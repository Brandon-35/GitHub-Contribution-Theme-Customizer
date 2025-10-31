# GitHub-Contribution-Theme-Customizer

🎨 Chrome Extension giúp tùy chỉnh màu sắc, hiệu ứng, và phân tích dữ liệu của bảng "GitHub Contributions Graph", kèm khả năng chụp nhanh ảnh biểu đồ để chia sẻ — hoàn toàn không cần đăng nhập.

## ✨ Tính năng chính

### 🎨 Tùy chỉnh Theme
- **6 Theme Presets**: Classic, Pastel, Midnight, Neon, Forest, Ocean
- **Custom Colors**: Tự chọn màu cho 5 mức độ contribution (Level 0-4)
- **Live Preview**: Xem trước ngay lập tức khi chọn theme

### 🌙 Chế độ hiển thị
- **Auto Mode**: Tự động chuyển đổi theo giao diện GitHub
- **Light/Dark Mode**: Chọn chế độ cố định theo ý muốn

### 📊 Analytics Overlay
- Hiển thị thống kê chi tiết:
  - 🔥 Current Streak (chuỗi ngày hiện tại)
  - ⭐ Longest Streak (chuỗi ngày dài nhất)
  - 📊 Total Contributions (tổng số đóng góp)
- Tooltip nâng cao khi hover vào từng ngày

### 🎞️ Hiệu ứng & Animation
- Hover effect: Phóng to nhẹ và highlight ô
- Smooth transitions khi thay đổi theme
- Tùy chọn bật/tắt animation

### 📸 Screenshot Capture
- Chụp nhanh contribution graph
- Tự động tải xuống với timestamp
- Chia sẻ dễ dàng trên mạng xã hội

### 🧠 Custom Rules (Đánh dấu ngày đặc biệt)
- Highlight các ngày quan trọng
- Tùy chỉnh màu sắc và label riêng

## 🚀 Cài đặt

### Cách 1: Cài đặt từ Chrome Web Store
*Coming soon...*

### Cách 2: Cài đặt thủ công (Developer Mode)

1. **Tải về extension**
   ```bash
   git clone https://github.com/Brandon-35/GitHub-Contribution-Theme-Customizer.git
   cd GitHub-Contribution-Theme-Customizer
   ```

2. **Mở Chrome Extensions**
   - Truy cập `chrome://extensions/`
   - Bật "Developer mode" ở góc trên bên phải

3. **Load extension**
   - Click "Load unpacked"
   - Chọn thư mục chứa extension

4. **Sử dụng**
   - Truy cập bất kỳ trang GitHub profile nào
   - Click vào icon extension để mở popup
   - Chọn theme và tùy chỉnh theo ý muốn
   - Click "Apply Theme"

## 📖 Hướng dẫn sử dụng

### Thay đổi Theme
1. Click vào icon extension trên toolbar
2. Chọn một trong 6 theme presets
3. Hoặc tùy chỉnh màu sắc riêng cho từng level
4. Click "✨ Apply Theme"

### Tùy chỉnh màu sắc
- Mỗi level (0-4) đại diện cho số lượng contributions
- Level 0: Không có contribution
- Level 4: Nhiều contributions nhất
- Click vào ô màu để chọn màu tùy chỉnh

### Bật/tắt tính năng
- **Animations**: Hiệu ứng hover và transitions
- **Analytics Overlay**: Hiển thị thống kê chi tiết

### Chụp ảnh
- Click nút "📸 Capture Screenshot"
- Ảnh sẽ được tải xuống tự động
- Tên file: `github-contributions-YYYY-MM-DD.png`

## 🛠️ Công nghệ sử dụng

- **Manifest V3**: Chrome Extension API mới nhất
- **Vanilla JavaScript**: Không dependency, nhẹ và nhanh
- **CSS3**: Animations và transitions mượt mà
- **Chrome Storage API**: Lưu cấu hình đồng bộ
- **Chrome Tabs API**: Chụp screenshot

## 📁 Cấu trúc dự án

```
GitHub-Contribution-Theme-Customizer/
├── manifest.json       # Cấu hình extension
├── popup.html         # Giao diện popup
├── popup.js           # Logic popup
├── content.js         # Script inject vào GitHub
├── background.js      # Service worker
├── style.css          # Styles cho contribution graph
├── icons/            # Icons của extension
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
├── README.md
└── note.md           # Tài liệu dự án
```

## 🎯 Roadmap

- [ ] Thêm nhiều theme presets hơn
- [ ] Export/Import cấu hình theme
- [ ] Chia sẻ theme với cộng đồng
- [ ] Hỗ trợ custom date ranges
- [ ] Dark mode cho popup
- [ ] Keyboard shortcuts
- [ ] Multi-language support

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:
1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Dự án này được phân phối dưới MIT License.

## 👨‍💻 Tác giả

**Brandon-35**

## 🙏 Lời cảm ơn

- GitHub vì contribution graph tuyệt vời
- Cộng đồng Chrome Extension developers
- Tất cả những người đã đóng góp và hỗ trợ dự án

## 📞 Liên hệ

- GitHub: [@Brandon-35](https://github.com/Brandon-35)
- Issues: [GitHub Issues](https://github.com/Brandon-35/GitHub-Contribution-Theme-Customizer/issues)

---

Made with 💜 for GitHub lovers

