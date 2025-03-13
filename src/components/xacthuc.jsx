import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from 'react-helmet-async';
import removeAccents from 'remove-accents'; 
import moment from 'moment'; 

const VerifyProduct = ({ contract }) => {
  const [maSanPham, setMaSanPham] = useState('');
  const [nonghoSX, setNonghoSX] = useState('');
  const [ngayThuHoach, setNgayThuHoach] = useState('');
  const navigate = useNavigate();
  const authenticateProduct = async (e) => {
    e.preventDefault();
    const confirmAction = window.confirm(
      'Đảm bảo thông tin đã được nhập chính xác. Bạn có muốn tiếp tục?'
    );

    if (!confirmAction) return;
    try {
      const hashes = await contract.methods.getProductHashes().call();
      for (let i = 0; i < hashes.length; i++) {
        const product = await contract.methods.getProduct(hashes[i]).call();


        // Kiểm tra nếu mã sản phẩm, nông hộ sản xuất và ngày thu hoạch khớp
        if (
          product[3].toLowerCase() === maSanPham.toLowerCase() &&
          product[0].toLowerCase() === nonghoSX.toLowerCase() 
        ){
          if (parseInt(product[9]) === 1) {  
            const verifiedProductData = {
              diaChi: product[2],
              username: product[1],
              maSanPham: product[3],
              nonghoSX: product[0],
              loai: product[4],
              giong: product[5],
              tieuChuan: product[6],
              trongLuong: product[7],
              ngayThuHoach: product[8],
              hash: hashes[i],
            };
            navigate('/infoproduct', { state: { product: verifiedProductData } });
            return;
          } else {
           navigate('/fake');
            return;
          }
        }
      }
      navigate('/fake');
    } catch (error) {
      console.error('Lỗi xác thực sản phẩm:', error);
    }
  };

  const handleBack = () => {
    navigate('/'); 
  };

  return (
    <div>
      <div className="login-background"></div>
      <div className="xacthuc-container">
      <Helmet>
        <title>Tra cứu</title>
      </Helmet>
      <h1 className="login-title">TRA CỨU SẢN PHẨM</h1>
          <form action="">
            <label className="login-label">Mã Sản Phẩm</label>
              <input
                type="text"
                className="login-input"
                name="maSanPham"
                value={maSanPham}
                onChange={(e) => setMaSanPham(e.target.value)}
                required
              />

              <label className="login-label">Nông Hộ sản xuất</label>
              <input
                type="text"
                className="login-input"
                name="nonghoSX"
                value={nonghoSX}
                onChange={(e) => setNonghoSX(e.target.value)}
                required
              />

              <label className="login-label">Ngày thu hoạch</label>
              <input
                type="date"
                className="login-input"
                name="ngayThuHoach"
                value={ngayThuHoach}
                onChange={e => setNgayThuHoach(e.target.value)}
                required
              />

            <button className="login-btn" onClick={authenticateProduct}>Tra Cứu</button>
          </form>
          <div className="back-button-container">
          <button className="back-btn bi-box-arrow-left" onClick={handleBack}> Thoát</button>
          </div>
      </div>
    </div>
  );
};

export default VerifyProduct;
