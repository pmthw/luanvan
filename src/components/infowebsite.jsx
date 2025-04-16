import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentInfo = () => {
  const navigate = useNavigate();

  return (
    <div style={{backgroundColor: '#FFFAF0', minHeight: '100vh'}}>
      <Helmet>
        <title>Quýt Hồng Lai Vung | Thông Tin Sinh Viên</title>
      </Helmet>
      
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: '#FFA726'}}>
        <div className="container">
          <a onClick={() => navigate("/")} className="navbar-brand d-flex align-items-center" style={{cursor: 'pointer'}}>
            <img src="/logo-quyt.png" alt="Logo" height="40" className="me-2" />
            <span className="fw-bold">Quýt Hồng Lai Vung</span>
          </a>
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center py-5">
        <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: "700px", width: "100%" }}>
          <div className="card-header text-center py-3" style={{backgroundColor: '#FFA726', borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}>
            <h3 className="fw-bold text-white m-0">THÔNG TIN SINH VIÊN</h3>
          </div>
          
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <img src="/logo-quyt.png" alt="Logo" height="80" className="mb-3" />
            </div>

            <div className="row mb-3 py-2 border-bottom">
              <div className="col-md-4 fw-bold" style={{color: '#FFA726'}}>Họ và Tên:</div>
              <div className="col-md-8">Phạm Thị Minh Thư</div>
            </div>
            
            <div className="row mb-3 py-2 border-bottom">
              <div className="col-md-4 fw-bold" style={{color: '#FFA726'}}>MSSV:</div>
              <div className="col-md-8">B2013506</div>
            </div>
            
            <div className="row mb-3 py-2 border-bottom">
              <div className="col-md-4 fw-bold" style={{color: '#FFA726'}}>Email:</div>
              <div className="col-md-8">thuB2013506@student.ctu.edu.vn</div>
            </div>
            
            <div className="row mb-3 py-2 border-bottom">
              <div className="col-md-4 fw-bold" style={{color: '#FFA726'}}>Trường:</div>
              <div className="col-md-8">Trường Công nghệ thông tin và Truyền thông - Đại học Cần Thơ</div>
            </div>
            
            <div className="row mb-3 py-2 border-bottom">
              <div className="col-md-4 fw-bold" style={{color: '#FFA726'}}>Đề Tài Luận Văn:</div>
              <div className="col-md-8">Xây Dựng Hệ Thống Blockchain Chứng Thực Nguồn Gốc Quýt Hồng Lai Vung</div>
            </div>
            
            <div className="row mb-3 py-2 border-bottom">
              <div className="col-md-4 fw-bold" style={{color: '#FFA726'}}>Giáo Viên Hướng Dẫn:</div>
              <div className="col-md-8">Thạc Sĩ Nguyễn Trọng Nghĩa</div>
            </div>

            <div className="d-grid gap-2 mt-4">
              <button 
                className="btn btn-lg btn-outline-secondary py-2"
                type="button"
                onClick={() => navigate("/")}
              >
                <i className="bi bi-arrow-left me-2"></i>Quay về trang chủ
              </button>
            </div>
          </div>
          
          <div className="card-footer bg-light p-3 text-center rounded-bottom">
            <small className="text-muted">
              Hệ thống xác thực Quýt Hồng Lai Vung dựa trên Blockchain
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;