package com.vuonchu.game;

import android.app.Activity;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.util.Locale;

/** Full-screen WebView host for the bundled game, with an Android TextToSpeech bridge for English pronunciation. */
public class MainActivity extends Activity {
    private WebView web;
    private TextToSpeech tts;
    private volatile boolean ttsOk = false;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        s.setTextZoom(100);
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                return !r.getUrl().toString().startsWith("file:");
            }
        });
        tts = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                tts.setLanguage(Locale.US);
                ttsOk = true;
            }
        });
        web.addJavascriptInterface(new Bridge(), "AndroidTTS");
        web.loadUrl("file:///android_asset/index.html");
        hideBars();
    }

    private class Bridge {
        @JavascriptInterface
        public void speak(String text, float rate, boolean flush) {
            if (!ttsOk || text == null) return;
            tts.setSpeechRate(rate > 0 ? rate : 1f);
            tts.speak(text, flush ? TextToSpeech.QUEUE_FLUSH : TextToSpeech.QUEUE_ADD, null, "u" + System.nanoTime());
        }

        @JavascriptInterface
        public void stop() {
            if (ttsOk) tts.stop();
        }

        @JavascriptInterface
        public boolean ready() {
            return ttsOk;
        }
    }

    @SuppressWarnings("deprecation")
    private void hideBars() {
        web.setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideBars();
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        // close an open dialog first; leave the app only when nothing is open
        web.evaluateJavascript("(function(){var b=document.querySelector('#modal .pclose,#modal [data-act=close]');if(b){b.click();return true;}return false;})()",
                v -> { if (!"true".equals(v)) finish(); });
    }

    @Override
    protected void onPause() {
        // WebView.onPause marks the page hidden, which makes the game save immediately
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    @Override
    protected void onDestroy() {
        if (tts != null) tts.shutdown();
        web.destroy();
        super.onDestroy();
    }
}
