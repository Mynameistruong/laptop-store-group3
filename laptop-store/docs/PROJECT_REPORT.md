# Báo cáo dự án — LaptopStore

- **Môn/bài tập:** FER202 — Exercise 27 mở rộng
- **Ngày cập nhật:** 29/10/2026
- **Trạng thái:** Ứng dụng và tài liệu chính đã có; nhóm cần hoàn tất kiểm thử thủ công, demo và quy trình phát hành.
- **Nhánh làm việc hiện tại:** `feature/4-laptop-store-app`
- **Commit nền hiện tại:** `d468fbc` — thêm báo cáo dự án và quy tắc phối hợp

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
| **A — Lê Quang Trường (DE181052), Leader** | Catalog, chi tiết laptop, tìm kiếm/lọc, giỏ hàng, checkout, đơn hàng, quản trị, README, test report và tích hợp phát hành | #16–#31 (16 issue) | Review PR của B |
| **B — Nguyễn Phước Thiện (DE190743)** | Nền tảng dự án, seed, API/services, auth, routes/layout, shared UI và hooks | #1–#15 (15 issue) | Review PR của A |

Chi tiết tiêu chí chấp nhận và phụ thuộc của từng issue nằm trong [ASSIGNMENT.md](./ASSIGNMENT.md). Trạng thái từng kịch bản kiểm thử nằm trong [TEST_REPORT.md](./TEST_REPORT.md).

### Cách đồng bộ hai agent

Agent của A và agent chạy trong phiên VS Code của B là hai phiên riêng, không thể tự trao đổi hoặc nhìn thấy trạng thái của nhau. Đồng bộ qua repository GitHub:

1. A đẩy commit tài liệu/phân công lên nhánh `feature/4-laptop-store-app`.
2. B yêu cầu agent của mình lấy phiên bản mới nhất (`git fetch origin`), rồi tạo nhánh riêng cho từng issue từ `origin/feature/4-laptop-store-app`.
3. B chỉ xử lý issue #1–#15; A chỉ xử lý #16–#31. Mỗi issue có branch/PR riêng theo mẫu gốc; PR tạm thời mở về `feature/4-laptop-store-app` để người kia review.
4. Không để hai agent commit/push trực tiếp vào cùng một nhánh; không merge khi có thay đổi chưa lưu. Trao đổi qua PR, review và mô tả commit.
5. Sau khi tích hợp và kiểm thử xong, tạo PR từ nhánh tích hợp vào `develop` theo quy trình gốc.

**Tin nhắn để gửi cho agent của B:**

> Đọc `laptop-store/docs/PROJECT_REPORT.md` và `laptop-store/docs/ASSIGNMENT.md` trước khi làm. Bạn phụ trách issue #1–#15; tạo branch riêng cho từng issue từ `origin/feature/4-laptop-store-app`, không commit/push trực tiếp vào nhánh tích hợp. Mỗi issue cần ghi file đã sửa, lệnh/kết quả chạy, ảnh minh chứng thật, branch/commit/PR, review và checklist vào báo cáo theo mẫu gốc. Mở từng PR về `feature/4-laptop-store-app` để A review. Không tự điền kết quả hoặc ảnh chưa thực hiện.

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

Trong giai đoạn hiện tại, các commit hoàn thiện LaptopStore nằm trên `feature/4-laptop-store-app` và chưa tích hợp vào `develop`. Vì vậy, hai agent dùng nhánh feature này làm nhánh nền tạm thời cho các PR công việc; sau khi tích hợp xong mới mở PR tổng hợp vào `develop`.

## 5. Tiến độ và kết quả đã xác minh

- Các luồng ứng dụng chính đã được triển khai: catalog, xác thực, giỏ hàng, checkout, đơn hàng, đánh giá và quản trị.
- `npm run lint`: thành công.
- `npm run build`: thành công.
- Smoke test trình duyệt đã xác nhận một số luồng catalog, đăng nhập, đặt hàng và hủy đơn. Đây là kiểm tra trong phiên hỗ trợ, không thay thế kiểm thử nghiệm thu do nhóm tự thực hiện.
- Có 19 kịch bản trong [TEST_REPORT.md](./TEST_REPORT.md); một số vẫn ghi “Chưa chạy” hoặc “Một phần” và cần được kiểm tra, cập nhật kết quả.
- Nhánh `feature/4-laptop-store-app` đang có trên GitHub; các PR của hai agent cần dựa trên nhánh này cho đến khi tích hợp xong vào `develop`. Live Share không tự tạo bản sao cho người tham gia.

## 6. Việc cần làm tiếp

1. A mở phiên Live Share, B tham gia; thống nhất issue và file mỗi người nhận trước khi sửa.
2. B xác minh nền tảng, API, auth, routes/layout, shared UI và hooks thuộc #1–#15; A xác minh catalog, commerce, admin và hoàn thiện báo cáo kiểm thử thuộc #16–#31. Ghi rõ người thực chạy từng kịch bản trong [TEST_REPORT.md](./TEST_REPORT.md).
3. Ghi rõ kết quả thực tế, người chạy, môi trường và issue lỗi; không đánh dấu “Đạt” nếu chưa thực hiện.
4. Chạy lại `npm run lint` và `npm run build` sau khi tích hợp thay đổi.
5. Hoàn thành Project board, video demo 3–5 phút và quy trình release theo [ASSIGNMENT.md](./ASSIGNMENT.md) trước khi nộp.
6. Giữ các thay đổi đang làm trên nhánh riêng; chỉ đẩy nhánh công việc sau khi đã kiểm tra và thống nhất nội dung PR.

## 7. Nhật ký công việc và minh chứng theo Issue

Ghi theo mẫu báo cáo gốc: mỗi issue cần có người thực hiện/reviewer, file hoặc module, lệnh và kết quả chạy, hai ảnh minh chứng thực tế, branch/commit/PR, kết quả review, checklist, ngày thực hiện và ghi chú lỗi. Trạng thái trong bảng là trạng thái ghi nhận minh chứng, không thay thế trạng thái issue GitHub. Các ô để trống cho nhóm cập nhật; không đánh dấu hoàn tất hoặc thêm ảnh khi chưa thực hiện.

Ảnh nên chụp bằng chứng rõ ràng (cấu trúc/file hoặc diff; kết quả chạy, UI/API/terminal) và lưu theo tên `docs/screenshots/issues/issue-XX-01.png`, `issue-XX-02.png`. Không đưa token, mật khẩu, `.env` hay dữ liệu cá nhân vào ảnh.

| Issue | Công việc | Người làm | Reviewer | File / module | Trạng thái minh chứng | Lệnh / kết quả test | Ảnh 1 / Ảnh 2 | Branch / commit / PR | Kết quả review | Checklist / ngày / ghi chú lỗi |
|---:|---|---|---|---|---|---|---|---|---|---|
| #1 | [CHORE] Repo templates & CODEOWNERS | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #2 | [FEATURE] Project setup & configuration (Phần 0) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #3 | [CHORE] Seed data db.json (0.4) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #4 | [FEATURE] Format utils formatPrice/formatDate (A3) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #5 | [FEATURE] axiosClient & interceptors (B1–B4) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #6 | [FEATURE] Laptop, catalog & review services (B5) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #7 | [FEATURE] Cart & order services (B5) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #8 | [FEATURE] Fake login & AuthContext (B6) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #9 | [FEATURE] Routes, layouts & 404 (F1, F6, F7) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #10 | [FEATURE] ProtectedRoute by role (F2) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #11 | [FEATURE] Common components: Loading, ErrorAlert, EmptyState, Price (E) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #12 | [FEATURE] ToastContext & ConfirmModal (E) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #13 | [FEATURE] Hooks useAxios & useDebounce (H1, H2) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #14 | [FEATURE] AppNavbar & Footer (E1) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #15 | [FEATURE] LaptopCard & LaptopGrid (E2) | B | A |  | Chưa ghi nhận |  |  |  |  |  |
| #16 | [FEATURE] Home page with Promise.all (C1, C2) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #17 | [FEATURE] Laptop list: URL filters, sort, pagination, cancel (F3, E6, D1) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #18 | [FEATURE] LaptopFilter controlled component (E3) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #19 | [FEATURE] Navbar search suggestions (D3) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #20 | [FEATURE] Laptop detail with allSettled & cancel (C3, D2, E4) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #21 | [FEATURE] Review list & form (G2) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #22 | [FEATURE] CartContext & add to cart (G1) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #23 | [FEATURE] Cart page & optimistic delete (G1, H4) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #24 | [FEATURE] Checkout flow (C4) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #25 | [FEATURE] My orders & cancel order (G4) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #26 | [FEATURE] Admin laptop table, quick stock edit, optimistic delete (G3, H4) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #27 | [FEATURE] Admin laptop create/edit form (G3, F4, F5) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #28 | [FEATURE] Admin order management (G4) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #29 | [FEATURE] Bulk delete with allSettled (H3) | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #30 | [DOCS] README: setup, timing results, 4 answers | A | B |  | Chưa ghi nhận |  |  |  |  |  |
| #31 | [TEST] Test report 19 scenarios & demo video | A | B |  | Chưa ghi nhận |  |  |  |  |  |

Checklist áp dụng cho từng issue: đạt acceptance criteria; chạy và ghi kết quả test; lưu ảnh minh chứng; commit Conventional Commits kèm `Refs #n`; push nhánh và mở PR có `Closes #n`; review chéo, xử lý góp ý; merge, đóng issue và cập nhật board.

## 8. Tài liệu liên quan

- [Hướng dẫn dự án](../README.md)
- [Phân công và yêu cầu bài tập](./ASSIGNMENT.md)
- [Báo cáo kiểm thử](./TEST_REPORT.md)
