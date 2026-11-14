# Vườn Chữ

Game nông trại kiểu mạng xã hội (lối chơi giống Avatar ngày xưa, đồ hoạ tự vẽ) để học tiếng Anh: từ vựng theo trình độ và chuyên ngành, lộ trình IELTS, đề thi IELTS/TOEIC, Auto Farm có bài test.

## Chơi ngay
- **Web:** https://hieu281099.github.io/vuon-chu/
- **Android:** vào mục **Releases**, tải `VuonChu.apk` (Android 7.0 trở lên).
- **iPhone / iPad:** mở link web bằng **Safari** → nút Chia sẻ → **Thêm vào Màn hình chính**. Game có biểu tượng riêng, chạy toàn màn hình, chơi được khi mất mạng.

Trên điện thoại, xoay ngang máy để chơi.

Một tài khoản (tên đăng nhập + mật khẩu) dùng chung cho web và app, tiến độ tự đồng bộ qua Supabase (`supabase/schema.sql`).

## Build
```bash
python tools/build_html.py   # src/ -> dist/index.html, dist/test.html
python tools/build_apk.py    # dist/test.html -> dist/VuonChu.apk (cần JDK 17 + Android SDK 34 trong toolchain/)
```

## Ghi công
Nhân vật dựng từ bộ "nemo" (CC0). Font Baloo 2 và Nunito (SIL OFL) qua Google Fonts.
