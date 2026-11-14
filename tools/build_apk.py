"""Package dist/test.html as an Android APK (WebView host) without Gradle.

python -I tools/build_apk.py      -> dist/VuonChu.apk
Toolchain lives in toolchain/ (JDK 17 + Android SDK build-tools 34, platform 34).
"""
import shutil, subprocess, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
AND, DIST, TC = ROOT / "android", ROOT / "dist", ROOT / "toolchain"
JDK = next(TC.glob("jdk-17*"))
BT = TC / "sdk" / "build-tools" / "34.0.0"
JAR = TC / "sdk" / "platforms" / "android-34" / "android.jar"
OUT = AND / "build"
ENV = {**__import__("os").environ, "JAVA_HOME": str(JDK)}

def run(*a):
    r = subprocess.run([str(x) for x in a], env=ENV, capture_output=True, text=True)
    if r.returncode: raise SystemExit(f"FAILED {a[0]}\n{r.stdout}\n{r.stderr}")
    return r.stdout

# 1. web assets: the standalone page + a speechSynthesis shim backed by Android TextToSpeech
SHIM = """<script>(function(){if(!window.AndroidTTS)return;var q=function(){};
var ss={speaking:false,pending:false,paused:false,onvoiceschanged:null,
speak:function(u){try{AndroidTTS.speak(String(u.text||''),+(u.rate||1),false)}catch(e){}},
cancel:function(){try{AndroidTTS.stop()}catch(e){}},pause:q,resume:q,
getVoices:function(){return [{name:'Android English',lang:'en-US',default:true,localService:true,voiceURI:'android'}]},
addEventListener:q,removeEventListener:q};
try{Object.defineProperty(window,'speechSynthesis',{value:ss,configurable:true,writable:true})}catch(e){window.speechSynthesis=ss}
function U(t){this.text=t||'';this.lang='en-US';this.rate=1;this.pitch=1;this.volume=1;this.voice=null}
try{Object.defineProperty(window,'SpeechSynthesisUtterance',{value:U,configurable:true,writable:true})}catch(e){window.SpeechSynthesisUtterance=U}
})();</script>"""
page = (DIST / "test.html").read_text(encoding="utf-8")
page = page.replace("<head>", "<head>" + SHIM, 1)
(AND / "assets").mkdir(exist_ok=True)
(AND / "assets" / "index.html").write_text(page, encoding="utf-8")

# 2. launcher icon (sprout on the game's violet-pink gradient)
def icon(n):
    im = Image.new("RGBA", (n, n), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    grad = Image.new("RGBA", (n, n))
    for y in range(n):
        t = y / n; grad.paste((int(124 + (255 - 124) * t), int(92 + (111 - 92) * t), int(255 + (181 - 255) * t), 255), (0, y, n, y + 1))
    mask = Image.new("L", (n, n), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, n - 1, n - 1), radius=n // 4, fill=255)
    im.paste(grad, (0, 0), mask)
    s = n / 192
    d.ellipse((46 * s, 128 * s, 146 * s, 156 * s), fill=(122, 74, 40, 255))                        # soil
    d.line((96 * s, 140 * s, 96 * s, 84 * s), fill=(61, 190, 108, 255), width=int(10 * s))          # stem
    d.ellipse((44 * s, 58 * s, 98 * s, 96 * s), fill=(61, 220, 132, 255))                           # left leaf
    d.ellipse((94 * s, 44 * s, 152 * s, 86 * s), fill=(61, 220, 132, 255))                          # right leaf
    d.ellipse((60 * s, 66 * s, 78 * s, 76 * s), fill=(180, 255, 210, 255))
    d.rounded_rectangle((122 * s, 24 * s, 168 * s, 50 * s), radius=int(10 * s), fill=(255, 255, 255, 255))
    d.text((131 * s, 27 * s), "ABC", fill=(124, 92, 255, 255))
    return im
for folder, n in [("mipmap-mdpi", 48), ("mipmap-hdpi", 72), ("mipmap-xhdpi", 96), ("mipmap-xxhdpi", 144), ("mipmap-xxxhdpi", 192)]:
    (AND / "res" / folder).mkdir(parents=True, exist_ok=True); icon(n).save(AND / "res" / folder / "ic_launcher.png")

# 3. resources + manifest
shutil.rmtree(OUT, ignore_errors=True); (OUT / "classes").mkdir(parents=True); (OUT / "gen").mkdir()
run(BT / "aapt2.exe", "compile", "--dir", AND / "res", "-o", OUT / "res.zip")
run(BT / "aapt2.exe", "link", "-I", JAR, "--manifest", AND / "AndroidManifest.xml", "-A", AND / "assets",
    "--min-sdk-version", "24", "--target-sdk-version", "34", "--java", OUT / "gen", "-o", OUT / "base.apk", OUT / "res.zip")

# 4. compile java -> dex
srcs = [str(p) for p in (AND / "src").rglob("*.java")] + [str(p) for p in (OUT / "gen").rglob("*.java")]
run(JDK / "bin" / "javac.exe", "--release", "11", "-classpath", JAR, "-d", OUT / "classes", "-Xlint:-options", *srcs)
classes = [str(p) for p in (OUT / "classes").rglob("*.class")]
run(BT / "d8.bat", "--release", "--min-api", "24", "--lib", JAR, "--output", OUT, *classes)

# 5. add dex, align, sign
with zipfile.ZipFile(OUT / "base.apk", "a", zipfile.ZIP_DEFLATED) as z: z.write(OUT / "classes.dex", "classes.dex")
run(BT / "zipalign.exe", "-f", "-p", "4", OUT / "base.apk", OUT / "aligned.apk")
ks = AND / "vuonchu.keystore"
if not ks.exists():
    run(JDK / "bin" / "keytool.exe", "-genkeypair", "-keystore", ks, "-alias", "vuonchu", "-keyalg", "RSA", "-keysize", "2048",
        "-validity", "10000", "-storepass", "vuonchu-local", "-keypass", "vuonchu-local", "-dname", "CN=Vuon Chu, O=Local build")
run(BT / "apksigner.bat", "sign", "--ks", ks, "--ks-key-alias", "vuonchu", "--ks-pass", "pass:vuonchu-local", "--key-pass", "pass:vuonchu-local",
    "--out", DIST / "VuonChu.apk", OUT / "aligned.apk")
print(run(BT / "apksigner.bat", "verify", "--verbose", DIST / "VuonChu.apk").splitlines()[:4])
print("dist/VuonChu.apk", (DIST / "VuonChu.apk").stat().st_size // 1024, "KB")
