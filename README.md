Dự án quản lý sách
Mô tả: Dự án này là một ứng dụng quản lý sách, cho phép người dùng đăng ký, đăng nhập, quản lý sách và lấy thông tin người dùng hiện tại.
Bao gồm các api và cách dùng(swagger):
Đầu tiên truy cập http://localhost:3000/api-docs/

Đăng ký: điền thông tin email và mật khẩu để đăng ký
Đăng nhập: điền thông tin vừa đăng ký vào api này sẽ hiện token để sử dụng (dán token vào header Authorization nếu không được thì thêm Bearer vào trước token)
Lấy thông tin user hiện tại: lấy thông tin user đang đăng nhập
Thêm sách: chỉ có role admin mới được thêm sách, không phải role admin sẽ từ chối
Lấy danh sách sách: tất cả role đều có thể lấy danh sách tất cả cuốn sách