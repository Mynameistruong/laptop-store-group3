# LaptopStore

Website bán laptop cho bài tập FER202 / Exercise 27 mở rộng, xây dựng bằng React, Vite, React Router 6, React-Bootstrap, Axios và json-server.

## Thành viên

| Vai trò | Họ tên | MSSV | GitHub |
|---|---|---|---|
| A — Leader, Issues #16–#31 | Lê Quang Trường | DE181052 | [@Mynameistruong](https://github.com/Mynameistruong) |
| B, Issues #1–#15 | Nguyễn Phước Thiện | DE190743 | [@Phuocthien253](https://github.com/Phuocthien253) |

- GitHub Project board: Chưa cung cấp
- Video demo 3–5 phút: Chưa quay
- Release `v1.0.0`: Chưa tạo
- Đề bài: [docs/ASSIGNMENT.md](docs/ASSIGNMENT.md)
- Báo cáo dự án và quy tắc phối hợp: [docs/PROJECT_REPORT.md](docs/PROJECT_REPORT.md)
- Báo cáo kiểm thử: [docs/TEST_REPORT.md](docs/TEST_REPORT.md)
- Ảnh trang chủ: [docs/screenshots/home.png](docs/screenshots/home.png)

## Bắt đầu

Yêu cầu Node.js 20.19+ hoặc 22 LTS.

```bash
npm install
cp .env.example .env
npm run build
npm run lint
npm start
```

Trên PowerShell, thay lệnh sao chép bằng `Copy-Item .env.example .env`. `npm start` chạy Vite tại `http://localhost:5173` và json-server tại `http://localhost:3001`.

Đặt lại dữ liệu mẫu: dừng `npm start`, chạy `npm run reset-db`, rồi khởi động lại `npm start`. Server mặc định không bật `--watch` để tránh restart khi các request ghi đơn hàng được gửi liên tiếp.

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | admin@laptopstore.vn | 123456 |
| Khách hàng | khach@laptopstore.vn | 123456 |

Đây là đăng nhập giả lập phục vụ bài tập; không dùng các tài khoản/mật khẩu này cho hệ thống thật.

## Chức năng

- Trang chủ, danh sách và chi tiết laptop; tìm kiếm, lọc và phân trang được đồng bộ lên URL.
- Tìm kiếm gợi ý có debounce và hủy request cũ.
- Đăng nhập, giỏ hàng lưu trên json-server, kiểm tra tồn kho và đặt hàng.
- Khách hàng xem/hủy đơn; hủy đơn hoàn lại tồn kho.
- Đánh giá sản phẩm.
- Khu vực admin quản lý laptop, tồn kho, đơn hàng; xóa đơn lẻ/hàng loạt và cập nhật trạng thái.
- Toast, xác nhận thao tác, trạng thái loading/error/empty và giao diện responsive.

## Kiến trúc

`src/api/axiosClient.js` là Axios instance dùng chung; các service tài nguyên nằm trong `src/api/`. Component giao tiếp qua service, và các trang tải dữ liệu bằng `useAxios` với `AbortController`.

```text
src/
├── api/          Axios client và services
├── components/   layout, common, laptop
├── contexts/     AuthContext, CartContext, ToastContext
├── hooks/        useAxios, useDebounce, useAddToCart, ...
├── pages/        trang khách hàng và admin
└── utils/        format, image, orderStatus
```

## Đo thời gian tải trang chủ

Một lần đo cục bộ với json-server có độ trễ 500 ms và 4 request:

| Cách gọi | Thời gian |
|---|---:|
| Tuần tự | 2.181 ms |
| Song song (`Promise.all`) | 555 ms |

Đây là một lần đo của môi trường hiện tại, không thay thế yêu cầu mỗi thành viên tự đo và bổ sung kết quả của mình.

## Trả lời câu hỏi

1. **Vì sao interceptor phải giữ nguyên lỗi hủy request?** `isCancel` nhận diện đối tượng lỗi hủy của Axios. Chuẩn hóa lỗi này thành object thông thường khiến component coi thao tác hủy là lỗi thật và hiển thị thông báo sai.
2. **Vì sao kiểm tra tồn kho dùng `Promise.all`, còn cập nhật kho dùng `Promise.allSettled`?** Tất cả kiểm tra tồn kho đều phải thành công trước khi tạo đơn. Sau khi tạo đơn, cần chờ mọi request cập nhật và ghi nhận riêng request thất bại để không báo đặt hàng thất bại giả.
3. **Vì sao sửa nhanh tồn kho dùng PATCH, còn form sửa dùng PUT?** Sửa nhanh chỉ cập nhật `stock`; PUT thay thế toàn bộ bản ghi nên phải gửi đầy đủ trường hiện có để không làm mất dữ liệu.
4. **Vì sao StrictMode có thể tạo request bị hủy ở môi trường phát triển?** React chạy lại effect khi mount để phát hiện cleanup không đúng; request đầu được `AbortController` hủy, request sau tiếp tục. Bản production không lặp effect theo cách này.

## Chạy kiểm thử

```bash
npm run lint
npm run build
```

Các kịch bản thủ công và trạng thái thực hiện được ghi trong [docs/TEST_REPORT.md](docs/TEST_REPORT.md). Project board, video và release cần được điền/tạo cùng các thành viên trước khi nộp.
