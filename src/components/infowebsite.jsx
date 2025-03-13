import React from 'react';

const StudentInfo = () => {
  return (
    <div className="info-background">
        <div className="info-product-container">
        <h1>THÔNG TIN SINH VIÊN</h1>
        <div className="info-item">
            <strong className="student-strong">Họ và Tên:</strong> Phạm Thị Minh Thư
        </div>
        <div className="info-item">
            <strong className="student-strong">MSSV:</strong> B2013506
        </div>
        <div className="info-item">
            <strong className="student-strong">Email:</strong> thuB2013506@student.ctu.edu.vn
        </div>
        <div className="info-item">
            <strong className="student-strong">Trường:</strong> Trường Công nghệ thông tin và Truyền thông - Đại học Cần Thơ
        </div>
        <div className="info-item">
            <strong className="student-strong">Đề Tài Luận Văn:</strong> Xây dựng hệ thống Blockchain chứng thực nguồn gốc quýt hồng Lai Vung
        </div>
        <div className="info-item">
            <strong className="student-strong">Giáo Viên Hướng Dẫn:</strong> Thạc Sĩ Nguyễn Trọng Nghĩa
        </div>

        </div>
    </div>

  );
};

export default StudentInfo;
