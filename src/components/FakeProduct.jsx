import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import warningImage from '../img/canhbao.png';
import { Helmet } from 'react-helmet-async';

const FakeProduct = () => {
  return (
    <div className="fake-product-container vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgb(255, 250, 240)',
      }}>
      <Helmet>
        <title>Quýt Hồng Lai Vung - Sản phẩm không xác thực</title>
      </Helmet>
      
      <div className="container">
        <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '700px' }}>
          <div className="card-body text-center p-5">
            <img 
              src={warningImage} 
              alt="Cảnh báo" 
              className="img-fluid mb-4" 
              style={{ maxWidth: '250px' }} 
            />
            
            <h1 className="fw-bold"style={{color: '#ea0000'}}>
              Không tìm thấy sản phẩm
            </h1>
            
            <p className="fw-bold" style={{color: '#000000'}}>
              Sản phẩm này không được xác thực là Quýt Hồng Lai Vung chính hãng.
            </p>
            
            <div className="d-grid gap-2 mt-4">
              <a href="/" className="btn text-white fw-bold px-3 py-2 w-auto" 
              style={{ backgroundColor: "#FFA726", borderColor: "#FFA726" }} >
                <i className="bi bi-house-door me-2"></i>Trang chủ
              </a>
              <a href="/tracuu" className="btn btn-outline-secondary fw-bold px-3 py-2 w-auto">
              <i className="bi bi-arrow-repeat me-2"></i>Kiểm tra lại
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default FakeProduct;