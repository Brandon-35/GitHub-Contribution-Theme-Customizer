# 🔄 Hướng dẫn cập nhật Extension sau khi fix bug

## ⚠️ Vấn đề
Extension vẫn báo lỗi `chrome.commands.onCommand` nghĩa là Chrome đang chạy **phiên bản code cũ**.

## ✅ Giải pháp - Chọn 1 trong 3 cách:

### Cách 1: Reload Extension (Nhanh nhất) ⚡
1. Mở `chrome://extensions/`
2. Tìm extension **"GitHub Contribution Theme Customizer"**
3. Click nút **🔄 Reload** (biểu tượng tròn tròn ở góc dưới bên phải của extension card)
4. Kiểm tra lại - lỗi sẽ biến mất!

### Cách 2: Xóa và cài lại extension 🔄
1. Mở `chrome://extensions/`
2. Tìm extension **"GitHub Contribution Theme Customizer"**
3. Click **Remove** để xóa
4. Click **Load unpacked**
5. Chọn thư mục: `/Users/macbook/Documents/workspace/GitHub Contribution Theme Customizer`
6. Extension sẽ được cài với code mới!

### Cách 3: Restart Chrome 🔄
1. Đóng hoàn toàn Chrome (Quit, không phải chỉ đóng tab)
2. Mở lại Chrome
3. Extension sẽ tự động reload với code mới

## 🧪 Kiểm tra Extension đã OK chưa:
1. Mở `chrome://extensions/`
2. Tìm extension "GitHub Contribution Theme Customizer"
3. Click **"Service Worker"** hoặc **"Inspect views: service worker"**
4. Xem Console - **KHÔNG** có lỗi nào là OK ✅

## 📝 Xác nhận code đã được fix:
- ✅ File `background.js` đã loại bỏ hoàn toàn code `chrome.commands`
- ✅ Dòng 97 là dòng cuối cùng (chỉ có comment và dòng trắng)
- ✅ Code đã được commit và push lên GitHub
- ✅ File ZIP mới đã sẵn sàng

## 🎯 Nếu vẫn còn lỗi:
1. Xóa hoàn toàn extension
2. Xóa cache Chrome: `chrome://settings/clearBrowserData`
3. Restart Chrome
4. Cài lại extension từ thư mục gốc

---
Made with 💜 for debugging

