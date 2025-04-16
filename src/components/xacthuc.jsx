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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const authenticateProduct = async (e) => {
    e.preventDefault();
    const confirmAction = window.confirm(
      'Đảm bảo thông tin đã được nhập chính xác. Bạn có muốn tiếp tục?'
    );

    if (!confirmAction) return;
    
    setIsLoading(true);
    
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
            setIsLoading(false);
            navigate('/infoproduct', { state: { product: verifiedProductData } });
            return;
          } else {
            setIsLoading(false);
            navigate('/fake');
            return;
          }
        }
      }
      setIsLoading(false);
      navigate('/fake');
    } catch (error) {
      console.error('Lỗi xác thực sản phẩm:', error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    
    <div className="xacthuc-product-container vh-100 d-flex align-items-center justify-content-center" 
    style={{
    backgroundImage: 'url("../nenquyt.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh'
    }}
    >

      <Helmet>
        <title>Quýt Hồng Lai Vung | Tra Cứu</title>
      </Helmet>
      
      <div className="card shadow p-4 rounded-4 border-0" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="text-center mb-3">
          <h2 className="fw-bold" style={{color: '#FFA726'}}>TRA CỨU SẢN PHẨM</h2>
        </div>

        <form onSubmit={authenticateProduct} className="mt-3">
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-upc-scan me-2"></i>Mã Sản Phẩm
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={maSanPham}
              onChange={(e) => setMaSanPham(e.target.value)}
              placeholder="Nhập mã sản phẩm"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-house me-2"></i>Nông Hộ Sản Xuất
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={nonghoSX}
              onChange={(e) => setNonghoSX(e.target.value)}
              placeholder="Nhập tên nông hộ sản xuất"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-calendar-date me-2"></i>Ngày Thu Hoạch
            </label>
            <input
              type="date"
              className="form-control form-control-lg"
              value={ngayThuHoach}
              onChange={(e) => setNgayThuHoach(e.target.value)}
              required
            />
          </div>

          <div className="d-grid gap-2 mt-4">
            <button 
              className="btn btn-lg text-white fw-bold" 
              style={{backgroundColor: '#FFA726'}}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span> Đang tra cứu...
                </>
              ) : (
                <>
                  <i className="bi bi-search me-2"></i>Tra Cứu
                </>
              )}
            </button>
            
            <button 
              className="btn btn-lg btn-outline-secondary" 
              type="button" 
              onClick={handleBack}
              disabled={isLoading}
            >
              <i className="bi bi-arrow-left me-2"></i>Quay Về Trang Chủ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyProduct;