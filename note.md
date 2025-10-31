🧩 TÊN DỰ ÁN

GitHub Contribution Theme Customizer

Extension Chrome giúp tùy chỉnh màu sắc, hiệu ứng, và phân tích dữ liệu của bảng “GitHub Contributions Graph”, kèm khả năng chụp nhanh ảnh biểu đồ để chia sẻ — hoàn toàn không cần đăng nhập.

🏗️ I. TÍNH NĂNG CỐT LÕI (Core Features)
1. 🎨 Tuỳ chỉnh màu contributions graph

Cho phép thay đổi màu của các ô vuông (0–4 mức độ) theo bảng màu tùy chọn.

Cung cấp preset theme: “Classic”, “Pastel”, “Midnight”, “Neon”, “Forest”, “Ocean”.

Áp dụng theme ngay lập tức (live preview).

2. 🌙 Chế độ Dark / Light auto

Tự động chuyển theme theo giao diện GitHub (Light/Dark).

Có thể chọn chế độ cố định (chỉ Light hoặc chỉ Dark).

3. ⚡ Giao diện popup trực quan

Popup UI hiển thị khi click icon extension.

Gồm:

Chọn theme preset hoặc nhập thủ công màu HEX.

Preview 5 ô mẫu (0 → 4).

Nút “Apply Theme” để áp dụng ngay.

4. 💾 Lưu theme đã chọn

Lưu cấu hình theme (màu sắc, chế độ sáng/tối, hiệu ứng) vào chrome.storage.sync.

Khi mở lại GitHub, theme được tự động áp dụng lại.

🚀 II. TÍNH NĂNG NÂNG CAO (Advanced Features)
5. 📅 Contribution Analytics Overlay

Hiển thị lớp dữ liệu nhỏ ngay trên contributions graph, gồm:

Tooltip chi tiết khi hover: ngày, số commits, streak.

Highlight “longest streak” hoặc “most active week”.

Tùy chọn bật/tắt lớp phân tích trong popup.

6. 📸 Screenshot Capture (Quick Share)

Cho phép chụp nhanh ảnh phần contributions graph.

Có 2 chế độ:

Capture visible area (theo khung nhìn hiện tại)

Capture contributions section only (tự động cắt phần biểu đồ SVG).

Ảnh được tải xuống tự động hoặc copy vào clipboard.

Ứng dụng không yêu cầu đăng nhập GitHub (chỉ thao tác cục bộ).

7. 🎞️ Hiệu ứng & hoạt ảnh

Hover vào ô → phóng to nhẹ + stroke sáng.

Tùy chọn bật/tắt animation trong popup.

Hiệu ứng dùng CSS transition nhẹ để không ảnh hưởng hiệu suất.

8. 🧠 Custom Rules (Highlight ngày đặc biệt)

Cho phép đánh dấu một số ngày đặc biệt (ví dụ: birthday, ngày đạt milestone).

Người dùng có thể nhập JSON dạng:

[{ "date": "2025-10-01", "color": "#ff69b4", "label": "1000 commits!" }]


Các ô tương ứng đổi màu hoặc có border riêng.

🔧 III. TÍNH NĂNG KỸ THUẬT (Implementation Core)
Thành phần	Mô tả
manifest.json	Định nghĩa permissions, scripts, popup, và icon
content.js	Inject code vào GitHub profile để đổi màu SVG và overlay dữ liệu
style.css	Quản lý hiệu ứng hover, animation, và overlay
popup.html / popup.js	Giao diện chọn theme, lưu cấu hình, chụp screenshot
background.js	(tuỳ chọn) hỗ trợ API chụp ảnh tab (chrome.tabs.captureVisibleTab)
chrome.storage.sync	Lưu cục bộ dữ liệu theme, hiệu ứng, rule, và tuỳ chọn overlay
🧠 IV. DỮ LIỆU LƯU TRONG chrome.storage.sync
{
  "theme_name": "Neon Night",
  "colors": ["#202124", "#34a853", "#fbbc05", "#4285f4", "#ea4335"],
  "mode": "auto",
  "animation": true,
  "overlay": true,
  "special_days": [
    { "date": "2025-03-10", "color": "#ff69b4", "label": "1000 commits!" }
  ]
}