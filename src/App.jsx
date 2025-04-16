import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { HelmetProvider } from 'react-helmet-async';
import detectEthereumProvider from '@metamask/detect-provider';
import XacThucSanPham from './contracts/XacThucSanPham.json';
import { Routes, Route, useNavigate, Link } from "react-router-dom"; 
import XacThuc from './components/xacthuc';
import Login from './components/login';
import Admin from './components/admin';
import User from './components/user';
import InfoProduct from './components/infoProduct';
import ViewProduct from './components/ViewProduct';
import Fake from './components/FakeProduct';
import Slideshow from './components/slideShow';
import Us from './components/infowebsite';
import Clause from './components/clause';
import PrivateRoute from './components/PrivateRoute';
import { Helmet } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const Home = () => (
  <>
    <Helmet>
      <title>Quýt Hồng Lai Vung | Hệ thống xác thực nguồn gốc</title>
      <meta name="description" content="Hệ thống xác thực nguồn gốc Quýt Hồng Lai Vung dựa trên công nghệ Blockchain Ethereum" />
    </Helmet>
    
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{backgroundColor: '#FFA726'}}>
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src="/logo-quyt.png" alt="Logo" height="40" className="me-2" />
          <span className="fw-bold">Quýt Hồng Lai Vung</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link active">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link to="/tracuu" className="nav-link active">Tra cứu</Link>
            </li>
            <li className="nav-item">
              <Link to="/infostudent" className="nav-link active">Thông tin</Link>
            </li>
            <li className="nav-item">
              <Link to="/Login" className="nav-link active">Đăng nhập</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <header className="py-5" style={{backgroundColor: '#FFFAF0'}}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 order-lg-2">
            <div className="rounded-4 shadow overflow-hidden">
              <Slideshow />
            </div>
          </div>
          <div className="col-lg-6 order-lg-1">
            <h1 className="display-4 fw-bold text-success mb-3">Xác Thực Nguồn Gốc</h1>
            <h2 className="display-6" style={{ color: '#FFA726' }}>Quýt Hồng Lai Vung</h2>
            <p className="lead my-4">
            Xác thực nguồn gốc và chất lượng Quýt Hồng Lai Vung nhằm đảm bảo sự minh bạch và độ tin cậy cho người tiêu dùng.
            </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-start">
            <Link 
              to="/tracuu" 
              className="btn btn-lg px-4 gap-3 text-white" 
              style={{ backgroundColor: '#FFA726', borderColor: '#FFA726' }}
              >
              <i className="bi bi-search me-2"></i>Tra cứu sản phẩm
            </Link>
            <Link to="/Login" className="btn btn-outline-secondary btn-lg px-4">
                <i className="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
            </Link>
          </div>
          </div>
        </div>
      </div>
    </header>

{/* Process Section */}
<section className="py-5" style={{ backgroundColor: '#FFF8E0' }}>
  <div className="container">
    <div className="text-center mb-5">
      <h2 className="fw-bold text-success">Quy trình xác thực</h2>
    </div>
    <div className="row">
      <div className="col-md-12">
        <div className="timeline position-relative">
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle text-white mb-3" 
                   style={{ width: '80px', height: '80px', backgroundColor: '#28a745' }}>
                <i className="bi bi-1-circle fs-2"></i>
              </div>
              <h5 className="text-dark">Sản xuất</h5>
              <p className="text-dark">Quýt Hồng được trồng và thu hoạch tại Lai Vung</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle text-white mb-3" 
                   style={{ width: '80px', height: '80px', backgroundColor: '#FFA726' }}>
                <i className="bi bi-2-circle fs-2"></i>
              </div>
              <h5 className="text-dark">Đăng ký</h5>
              <p className="text-dark">Thông tin sản phẩm được đăng ký</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle text-white mb-3" 
                   style={{ width: '80px', height: '80px', backgroundColor: '#28a745' }}>
                <i className="bi bi-3-circle fs-2"></i>
              </div>
              <h5 className="text-dark">Gắn mã</h5>
              <p className="text-dark">Mỗi lô hàng được gắn mã xác thực</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle text-white mb-3" 
                   style={{ width: '80px', height: '80px', backgroundColor: '#FFA726' }}>
                <i className="bi bi-4-circle fs-2"></i>
              </div>
              <h5 className="text-dark">Tra cứu</h5>
              <p className="text-dark">Người tiêu dùng tra cứu thông tin qua ứng dụng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


{/* Footer */}
<footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-5 mb-4">
            <h5 className="fw-bold mb-3">Quýt Hồng Lai Vung</h5>
            <p>Hệ thống xác thực nguồn gốc Quýt Hồng Lai Vung dựa trên công nghệ Blockchain, Ethereum và Solidity.</p>
          </div>
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Thông Tin</h5>
            <ul className="list-unstyled">
              <li><Link to="/infostudent" className="text-decoration-none text-white-50">Thông tin</Link></li>
              <li><Link to="/dieukhoan" className="text-decoration-none text-white-50">Điều khoản sử dụng</Link></li>
            </ul>
            <div className="d-flex gap-3 mt-3">
              <a href="https://youtu.be/_OtEvHS_dhE?si=9bTrVJAD1uyW1hqN" className="text-white fs-5">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="https://vi.wikipedia.org/wiki/Qu%C3%BDt_h%E1%BB%93ng" className="text-white fs-5">
                <i className="bi bi-google"></i>
              </a>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Bộ Công Thương</h5>
            <p><i className="bi bi-geo-alt-fill me-2"></i>Địa chỉ: 23 Ngô Quyền, Hoàn Kiếm, Hà Nội</p>
            <p><i className="bi bi-telephone-fill me-2"></i>Điện thoại: (024) 22202108</p>
            <p><i className="bi bi-envelope-fill me-2"></i>Email: bbt@moit.gov.vn</p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center">
          <p>&copy; 2025 Blockchain. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  </>
);

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWeb3 = async () => {
      try {
        setLoading(true);
        const provider = await detectEthereumProvider();
        
        if (provider) {
          await provider.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(provider);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const networkId = await web3.eth.net.getId();
          const deployedNetwork = XacThucSanPham.networks[networkId];
          
          if (deployedNetwork) {
            const instance = new web3.eth.Contract(
              XacThucSanPham.abi, 
              deployedNetwork.address
            );
            setContract(instance);
          } else {
            setError("Smart contract chưa được triển khai trên mạng đã phát hiện.");
          }
        } else {
          setError("Vui lòng cài đặt MetaMask để sử dụng ứng dụng này!");
        }
      } catch (err) {
        console.error(err);
        setError("Đã xảy ra lỗi khi kết nối với blockchain.");
      } finally {
        setLoading(false);
      }
    };

    loadWeb3();
  }, []);

  // Loading component
  const LoadingScreen = () => (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{backgroundColor: '#FFFAF0'}}>
      <div className="text-center">
        <div className="spinner-border" style={{color: '#FFA726'}} role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <h5>Đang kết nối với blockchain...</h5>
      </div>
    </div>
  );

  // Error component
  const ErrorScreen = () => (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{backgroundColor: '#FFFAF0'}}>
      <div className="text-center">
        <div className="text-danger mb-3">
          <i className="bi bi-exclamation-triangle-fill fs-1"></i>
        </div>
        <h4>Lỗi kết nối</h4>
        <p>{error}</p>
        <button 
          className="btn text-white" 
          style={{backgroundColor: '#FFA726'}}
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/tracuu" 
            element={<XacThuc contract={contract} account={account} />} 
          />
          <Route path="/Login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <Admin contract={contract} account={account} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/user" 
            element={
              <PrivateRoute>
                <User contract={contract} account={account} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/view-product" 
            element={
              <PrivateRoute>
                <ViewProduct contract={contract} account={account} />
              </PrivateRoute>
            } 
          />
          <Route path="/fake" element={<Fake />} />
          <Route path="/infoproduct" element={<InfoProduct />} />
          <Route path="/infostudent" element={<Us />} />
          <Route path="/dieukhoan" element={<Clause />} />
        </Routes>
      </HelmetProvider>
    </div>
  );
};

export default App;