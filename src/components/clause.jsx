// components/TermsOfUse.js
import React from "react";

const TermsOfUse = () => {
  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-body">
          
          <h1 className="text-center fw-bold mb-4">ĐIỀU KHOẢN SỬ DỤNG</h1>
          
          <section className="mb-4">
            <h2 className="fs-4 fw-semibold">1. Giới thiệu</h2>
            <p>
              Chào mừng bạn đến với nền tảng Chứng thực nguồn gốc Quýt Hồng Lai Vung. Việc sử dụng dịch vụ của chúng tôi đồng nghĩa với việc bạn đồng ý tuân thủ các điều khoản dưới đây.
            </p>
          </section>
          
          <section className="mb-4">
            <h2 className="fs-4 fw-semibold">2. Quyền và nghĩa vụ của người dùng</h2>
            <ul className="ps-4">
              <li>Bạn có quyền truy cập và sử dụng dịch vụ theo đúng quy định.</li>
              <li>Bạn chịu trách nhiệm bảo vệ thông tin đăng nhập và báo cáo hành vi truy cập trái phép.</li>
              <li>Không sử dụng dịch vụ vào mục đích vi phạm pháp luật hoặc gây ảnh hưởng đến hệ thống.</li>
            </ul>
          </section>
          
          <section className="mb-4">
            <h2 className="fs-4 fw-semibold">3. Bảo mật thông tin</h2>
            <p>
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và không chia sẻ với bên thứ ba nếu không có sự đồng ý của bạn, trừ khi pháp luật yêu cầu.
            </p>
          </section>
          
          <section className="mb-4">
            <h2 className="fs-4 fw-semibold">4. Quy định về sử dụng dịch vụ</h2>
            <ul className="ps-4">
              <li>Không sử dụng dịch vụ vào mục đích trái pháp luật.</li>
              <li>Không can thiệp vào hệ thống hoặc truy cập dữ liệu người dùng khác trái phép.</li>
            </ul>
          </section>
          
          <section className="mb-4">
            <h2 className="fs-4 fw-semibold">5. Quyền sở hữu trí tuệ</h2>
            <p>
              Tất cả nội dung trên nền tảng thuộc quyền sở hữu trí tuệ của chúng tôi hoặc bên liên quan. Không sao chép, phân phối nếu không có sự đồng ý bằng văn bản.
            </p>
          </section>
          
          <section className="mb-4">
            <h2 className="fs-4 fw-semibold">6. Thay đổi điều khoản</h2>
            <p>
              Chúng tôi có quyền sửa đổi điều khoản bất kỳ lúc nào mà không cần thông báo trước. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận điều khoản mới.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;