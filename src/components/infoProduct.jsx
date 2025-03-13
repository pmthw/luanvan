import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 
import '../css/info.css';

const InfoProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleBack = () => {
    console.log('Nút thoát đã được nhấn');
    navigate('/');
  };
  const { product } = location.state || {}; 

  if (!product) {
    return <p className="text-danger">Không tìm thấy thông tin sản phẩm.</p>;
  }

  return (
    <div className="info-background">
      <Helmet>
        <title>Thông Tin Sản Phẩm</title>
      </Helmet>
      <button className="back-button bi-box-arrow-left" onClick={handleBack}> Thoát</button>
      <div className="info-product-container">

      <h1 className="info-h1">CHỨNG NHẬN SẢN PHẨM CHÍNH HÃNG</h1>
      <table className="table">
        <tbody>
          <tr>
            <th className="text-left">Sản Xuất Và Đóng Gói Tại:</th>
            <td className="text-right">{product.diaChi}</td>
          </tr>
          <tr>
            <th className="text-left">Nông Hộ Sản Xuất:</th>
            <td className="text-right">{product.nonghoSX}</td>
          </tr>
          <tr>
            <th className="text-left">Email liên hệ:</th>
            <td className="text-right">{product.username}</td>
          </tr>
          <tr>
            <th className="text-left">Mã Sản Phẩm:</th>
            <td className="text-right">{product.maSanPham}</td>
          </tr>
          <tr>
            <th className="text-left">Tiêu Chuẩn:</th>
            <td className="text-right">{product.tieuChuan}</td>
          </tr>
          <tr>
            <th className="text-left">Loại quýt:</th>
            <td className="text-right">{product.loai}</td>
          </tr>
          <tr>
            <th className="text-left">Trọng lượng:</th>
            <td className="text-right">{product.trongLuong}</td>
          </tr>
          <tr>
            <th className="text-left">Ngày Thu Hoạch:</th>
            <td className="text-right">{product.ngayThuHoach}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default InfoProduct;
