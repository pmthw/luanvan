import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../css/info.css';

const InfoProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product; // Kiểm tra tránh lỗi undefined

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div className="info-background">
        <div className="error-container">
          <i className="bi bi-exclamation-triangle error-icon"></i>
          <div className="error-message">Không tìm thấy thông tin sản phẩm.</div>
          <button className="home-button" onClick={() => navigate('/')}>
            Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="info-background">
      <Helmet>
        <title>Thông Tin Sản Phẩm | {product.maSanPham}</title>
      </Helmet>

      <div className="info-product-container">
        {/* Header */}
        <div className="info-header">
          <h1 className="info-h1">CHỨNG NHẬN SẢN PHẨM CHÍNH HÃNG</h1>
          <div className="product-code">Mã sản phẩm: {product.maSanPham}</div>
        </div>

        {/* Nội dung */}
        <div className="info-content">
          <div className="info-section info-section-product">
            <div className="section-title product">
              <i className="bi bi-box-seam"></i> Thông Tin Sản Phẩm
            </div>

            <div className="info-row">
              <div className="info-label">Nông Hộ Sản Xuất:</div>
              <div className="info-value">{product.nonghoSX || "Chưa cập nhật"}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Địa Chỉ Sản Xuất:</div>
              <div className="info-value">{product.diaChi || "Chưa cập nhật"}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Email Liên Hệ:</div>
              <div className="info-value">{product.username || "Chưa cập nhật"}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Loại Quýt:</div>
              <div className="info-value">{product.loai || "Chưa cập nhật"}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Tiêu Chuẩn:</div>
              <div className="info-value">{product.tieuChuan || "Chưa cập nhật"}</div>
            </div>

            <div className="info-row">
              <div className="info-label"> Lượng:</div>
              <div className="info-value">{product.trongLuong || "Chưa cập nhật"}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Ngày Thu Hoạch:</div>
              <div className="info-value">{product.ngayThuHoach || "Chưa cập nhật"}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="info-footer">
          <button className="back-button" onClick={() => navigate('/')}>
            <i className="bi bi-arrow-left"></i>
            Quay Lại Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoProduct;
