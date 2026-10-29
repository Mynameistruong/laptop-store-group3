# Báo cáo kiểm thử — LaptopStore

- Ngày kiểm tra: 29/10/2026
- Môi trường: Windows, Node.js 22.17.1, Vite 8, json-server 0.17.4, trình duyệt tích hợp VS Code
- Phạm vi: smoke test cục bộ; đây chưa phải biên bản kiểm thử phát hành của cả nhóm.
- Kết quả tự động: `npm run lint` và `npm run build` thành công.

| # | Kịch bản | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Trang chủ và dữ liệu catalog | Đạt | Trang chủ hiển thị banner, hãng, sản phẩm và đồng hồ đo request. |
| 2 | Lọc theo hãng Asus | Đạt | `brandId=3` trả đúng 4 laptop Asus; danh sách đồng bộ query trên URL. |
| 3 | Lọc RAM, sắp xếp, phân trang và F5 | Chưa chạy | Cần kiểm thử thủ công đầy đủ. |
| 4 | Hủy request khi đổi bộ lọc nhanh | Chưa chạy | Cần kiểm thử Slow 3G trong DevTools. |
| 5 | Gợi ý tìm kiếm Navbar | Chưa chạy | Cần kiểm tra debounce và request hủy. |
| 6 | Chi tiết laptop và dữ liệu liên quan | Đạt | Trang chi tiết Asus ROG hiển thị thông số, đánh giá và laptop liên quan. |
| 7 | Đăng nhập để tiếp tục thao tác thêm giỏ | Đạt | Chưa đăng nhập được chuyển đến login; đăng nhập xong quay lại đúng trang. |
| 8 | Thêm giỏ và tải lại trang | Một phần | Sản phẩm được lưu trên json-server và hiện trên trang giỏ; chưa kiểm tra F5. |
| 9 | Chặn số lượng vượt tồn kho | Chưa chạy | Cần kiểm tra đầy đủ bằng dữ liệu stock thấp. |
| 10 | Đặt hàng và trừ tồn kho | Đạt | Tạo đơn, chuyển tới `/orders`, thông báo mã đơn; giỏ được xóa và tồn kho cập nhật. |
| 11 | Hủy đơn và hoàn kho | Đạt | Đơn chuyển sang `cancelled`, thông báo thành công. |
| 12 | Customer truy cập route admin | Một phần | Route chuyển về trang chủ; chưa xác nhận Toast quyền truy cập. |
| 13 | Form admin từ chối giá sale không hợp lệ | Chưa chạy | Cần kiểm thử UI. |
| 14 | Admin tạo laptop | Chưa chạy | Cần kiểm thử UI. |
| 15 | Admin sửa nhanh tồn kho bằng PATCH | Chưa chạy | Cần kiểm tra payload trong Network. |
| 16 | Admin xóa hàng loạt | Chưa chạy | Cần kiểm tra `Promise.allSettled` và trạng thái lỗi từng dòng. |
| 17 | Xóa giỏ optimistic khi API lỗi | Chưa chạy | Cần dừng json-server để kiểm tra khôi phục UI. |
| 18 | ErrorAlert khi API không khả dụng | Chưa chạy | Cần dừng json-server và thử tải lại. |
| 19 | Trang 404 và laptop không tồn tại | Chưa chạy | Cần kiểm thử `/abc` và `/laptops/9999`. |

## Kiểm tra kỹ thuật

- [x] Không dùng `.then()` trong `src`.
- [x] Chỉ `src/api/` import Axios.
- [x] Không có `useEffect(async ...)`.
- [x] `npm run lint` thành công.
- [x] `npm run build` thành công.
- [x] API catalog trả HTTP 200 và dữ liệu seed hợp lệ.
- [ ] Hoàn tất 19 kịch bản chính thức trên `release/1.0.0`.
- [ ] Ghi tên thành viên/tester, commit phát hành, trình duyệt đầy đủ và issue bug (nếu có).
- [ ] Quay video demo 3–5 phút và bổ sung liên kết trong README.
