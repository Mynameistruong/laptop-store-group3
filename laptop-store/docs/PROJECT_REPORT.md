# Báo cáo dự án — LaptopStore

- **Môn/bài tập:** FER202 — Exercise 27 mở rộng
- **Ngày cập nhật:** 29/10/2026
- **Trạng thái:** Ứng dụng và tài liệu chính đã có; nhóm cần hoàn tất kiểm thử thủ công, demo và quy trình phát hành.
- **Nhánh làm việc hiện tại:** `feature/4-laptop-store-app`
- **Commit nền hiện tại:** `aa4efe6` — cập nhật phân công cho nhóm hai người

## 1. Tổng quan

LaptopStore là ứng dụng web bán laptop xây dựng bằng React. Khách hàng có thể duyệt, tìm kiếm, lọc và xem chi tiết laptop; đăng nhập, quản lý giỏ hàng, đặt hàng và xem/hủy đơn. Quản trị viên có thể quản lý laptop, tồn kho và đơn hàng.

Mục tiêu kỹ thuật của bài tập gồm giao tiếp API bất đồng bộ, axios instance và tầng service, React Router với route bảo vệ, custom hooks, hủy request, cập nhật URL theo bộ lọc, CRUD với json-server, xử lý song song và trạng thái giao diện loading/error/empty.

## 2. Công nghệ và cấu trúc

- React, Vite, React Router 6 và React-Bootstrap.
- Axios cho HTTP; json-server 0.17.4 cho API và dữ liệu cục bộ.
- `src/api/`: Axios client và các service tài nguyên.
- `src/components/`: layout, component dùng chung và component laptop.
- `src/contexts/`: trạng thái xác thực, giỏ hàng và thông báo.
- `src/hooks/`: hook dùng chung cho request, debounce và thao tác giỏ.
- `src/pages/`: trang khách hàng và quản trị.
- `db.json`: dữ liệu mẫu cục bộ.

## 3. Phân công công việc

| Thành viên | Phạm vi chính | Issue theo phân công | Review |
|---|---|---|---|
| **A — Lê Quang Trường (DE181052), Leader** | Cấu hình và tích hợp; API client và auth; hooks dùng chung; route/layout; bảo vệ route; trang quản trị danh sách laptop; tích hợp và release | #1, #2, #5, #8, #9, #10, #13, #18, #19, #26, #29 | Review PR của B |
| **B — Nguyễn Phước Thiện (DE190743)** | Seed/dữ liệu; catalog phía khách hàng; giỏ hàng, checkout, đơn hàng, đánh giá; form quản trị laptop; kiểm thử catalog/commerce và báo cáo kiểm thử | #3, #4, #6, #7, #11, #12, #14–#17, #20–#25, #27, #28, #30, #31 | Review PR của A |

Chi tiết tiêu chí chấp nhận và phụ thuộc của từng issue nằm trong [ASSIGNMENT.md](./ASSIGNMENT.md). Trạng thái từng kịch bản kiểm thử nằm trong [TEST_REPORT.md](./TEST_REPORT.md).

## 4. Quy tắc phối hợp để tránh xung đột

### Khi cùng sửa qua VS Code Live Share

Live Share cho hai người cùng thao tác trên **một workspace và một nhánh trên máy host**. Hãy áp dụng các quy tắc sau:

1. A là host và người duy nhất chạy lệnh Git trong workspace đang được chia sẻ: checkout, pull, add, commit, push hoặc merge. B không chạy các lệnh này đồng thời trong phiên.
2. Chia file theo phạm vi ở mục 3. Không cùng sửa một file hoặc cùng một component. Nếu cần sửa file ngoài phạm vi, báo người sở hữu file và thống nhất trước.
3. Với file tích hợp dễ xung đột (`src/App.jsx`, `package.json`, cấu hình, API client, README và tài liệu chung), chỉ một người sửa tại một thời điểm. A điều phối và tích hợp; B yêu cầu A trước khi chỉnh các file này.
4. Trước khi bắt đầu một issue, nói rõ issue, file dự kiến sửa và người phụ trách. Đánh dấu đang làm trên board/bảng chung; không bắt đầu issue đã có người nhận.
5. Hoàn tất một thay đổi thì báo người kia, chạy kiểm tra phù hợp, xem diff và chờ xác nhận trước khi chuyển sang file/phạm vi dùng chung.
6. Chỉ A stage các file thuộc một phần việc đã hoàn tất và tạo commit riêng cho phần đó. Kiểm tra `git diff --cached` trước commit để không gom nhầm thay đổi đang làm dở của B.
7. Không đổi nhánh, reset, stash, rebase hoặc hoàn tác thay đổi trong lúc Live Share đang hoạt động nếu chưa báo và được người kia đồng ý.
8. Nếu cùng lúc phát sinh sửa trùng, dừng sửa file đó; không ghi đè hay tự chọn một bản. Hai người so sánh diff, thống nhất nội dung giữ lại rồi mới tiếp tục.
9. Chỉ chia sẻ terminal khi thật sự cần. Không chia sẻ `.env`, thông tin đăng nhập, token hoặc secret; không đưa chúng vào commit.
10. Kết thúc phiên, A kiểm tra `git status` và `git diff`, xác nhận thay đổi nào đã commit và thay đổi nào còn dang dở, rồi thông báo cho B.

### Khi làm trên hai bản sao/nhánh riêng

Nếu chuyển sang làm việc độc lập thay vì Live Share, mỗi người tạo nhánh riêng từ `develop`, chỉ commit phần được giao, rồi mở PR vào `develop`. Người còn lại review; không push trực tiếp vào `main`/`develop`, không dùng chung một nhánh để cùng commit. Không trộn hai cách làm trên cùng một thời điểm: thống nhất cả nhóm sẽ dùng Live Share hoặc nhánh riêng trước khi bắt đầu.

## 5. Tiến độ và kết quả đã xác minh

- Các luồng ứng dụng chính đã được triển khai: catalog, xác thực, giỏ hàng, checkout, đơn hàng, đánh giá và quản trị.
- `npm run lint`: thành công.
- `npm run build`: thành công.
- Smoke test trình duyệt đã xác nhận một số luồng catalog, đăng nhập, đặt hàng và hủy đơn. Đây là kiểm tra trong phiên hỗ trợ, không thay thế kiểm thử nghiệm thu do nhóm tự thực hiện.
- Có 19 kịch bản trong [TEST_REPORT.md](./TEST_REPORT.md); một số vẫn ghi “Chưa chạy” hoặc “Một phần” và cần được kiểm tra, cập nhật kết quả.
- Tại thời điểm báo cáo, các commit đang ở máy local; nhánh chưa được đẩy lên GitHub. Việc cộng tác Live Share không tự động tạo bản sao trên GitHub.

## 6. Việc cần làm tiếp

1. A mở phiên Live Share, B tham gia; thống nhất issue và file mỗi người nhận trước khi sửa.
2. A hoàn tất các kịch bản test về hạ tầng, auth, routing và admin; B hoàn tất các kịch bản catalog, review, giỏ hàng, checkout, đơn hàng và form admin trong [TEST_REPORT.md](./TEST_REPORT.md).
3. Ghi rõ kết quả thực tế, người chạy, môi trường và issue lỗi; không đánh dấu “Đạt” nếu chưa thực hiện.
4. Chạy lại `npm run lint` và `npm run build` sau khi tích hợp thay đổi.
5. Hoàn thành Project board, video demo 3–5 phút và quy trình release theo [ASSIGNMENT.md](./ASSIGNMENT.md) trước khi nộp.
6. Nếu cần cộng tác ngoài Live Share hoặc sao lưu code từ xa, thống nhất với nhóm trước khi đẩy nhánh lên GitHub.

## 7. Tài liệu liên quan

- [Hướng dẫn dự án](../README.md)
- [Phân công và yêu cầu bài tập](./ASSIGNMENT.md)
- [Báo cáo kiểm thử](./TEST_REPORT.md)
