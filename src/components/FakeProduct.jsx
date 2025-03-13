import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import warningImage from '../img/canhbao.png'; 
import { Helmet } from 'react-helmet-async'; 
const FakeProduct = () => {
  const fakeProductStyle = {
    backgroundColor: 'rgba(52, 194, 223, 0.2)', 
    color: 'black',
    padding: '20px', 
    borderRadius: '5px', 
    textAlign: 'center', 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
  };

  return (
    <div style={fakeProductStyle}>
      <Helmet>
        <title>FakeProduct</title>
      </Helmet>
      <h1 className="mb-4">
        Không tìm thấy sản phẩm Chứng Nhận - Xác Thực là Quýt Hồng Lai Vung.
      </h1>
      <div className="mb-4">
        <img src={warningImage} alt="Cảnh báo" className="img-fluid" style={{ maxWidth: '500px' }} />
      </div>
    </div>
  );
};

export default FakeProduct;
