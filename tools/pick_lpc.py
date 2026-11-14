"""Pick the LPC sprite layers Vuon Chu needs and write sparse-checkout patterns.

Run from anywhere:  python -I pick_lpc.py <path-to-lpc-repo>
"""
import re
import subprocess
import sys
from pathlib import Path

repo = Path(sys.argv[1])
files = subprocess.run(["git", "-C", str(repo), "ls-tree", "-r", "--name-only", "HEAD"],
                       capture_output=True, text=True, check=True).stdout.splitlines()

ANIMS = r"(walk|idle|thrust|emote|sit)"
LAYERS = [
    r"body/bodies/(male|female)",
    r"head/heads/human/(male|female)",
    r"eyes/human/adult/default",
    r"hair/(plain|bob|pixie|messy1|bangs|long|curly_short|buzzcut|bangs_bun|pigtails|afro|idol|page|parted|bedhead|ponytail/adult/(bg|fg)|high_ponytail/adult/(bg|fg))",
    r"torso/clothes/shortsleeve/(tshirt|shortsleeve_polo|tshirt_vneck)/(male|female)",
    r"torso/clothes/longsleeve/(longsleeve|longsleeve2_cardigan)/(male|female)",
    r"torso/clothes/sleeveless/sleeveless1/(male|female)",
    r"torso/aprons/overalls/(male|female)",
    r"legs/(pants|shorts/shorts|skirts/plain|leggings)/(male|thin)",
    r"feet/(shoes/basic|sandals|boots/basic)/(male|thin)",
    r"hat/(cloth/(bandana|leather_cap)|formal/(bowler|tophat)|holiday/christmas|headband/tied)",
    r"facial/glasses/(glasses|round|sunglasses)",
    r"tools/(watering_can|hoe)/(bg|fg)",
]
layer_re = re.compile(r"^spritesheets/(" + "|".join(LAYERS) + r")(/[^/]+)*/" + ANIMS + r"\.png$")

picked = [f for f in files if layer_re.match(f)]
picked += [f for f in files if f.startswith("spritesheets/tools/fishing_rod/")]
extra = ["palette_definitions/", "sheet_definitions/", "CREDITS.csv", "README.md", "LICENSE"]

out = repo.parent / "lpc-sparse.txt"
out.write_text("\n".join(["/" + p for p in extra + picked]) + "\n", encoding="utf-8")
print(len(picked), "sprite files ->", out)
