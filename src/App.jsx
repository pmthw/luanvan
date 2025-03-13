import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { HelmetProvider } from 'react-helmet-async';
import detectEthereumProvider from '@metamask/detect-provider';
import XacThucSanPham from './contracts/XacThucSanPham.json';
import { Routes, Route, useNavigate } from "react-router-dom"; 
import XacThuc from './components/xacthuc';
import Login from './components/login';
import Admin from './components/admin';
import User from './components/user'
import InfoProduct from './components/infoProduct'
import ViewProduct from './components/ViewProduct';
import Fake from './components/FakeProduct';
import Slideshow from './components/slideShow';
import Us from './components/infowebsite';
import Clause from './components/clause';
import PrivateRoute from './components/PrivateRoute';
import { Helmet } from 'react-helmet-async';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

const Home = () => (
  <header className="site-header">
      <Helmet>
        <title>Quyt Hong Lai Vung</title>
      </Helmet>
    <nav className="container-fluid">
      <div className="logo text-center">
        <h1 className="display-5">Quyt Hong</h1>
      </div>
    </nav>
    <section className="d-flex justify-content-around align-items-center py-5" style={{ height: 'calc(95vh - 150px)' }}>
    <div className="leftside img-fluid animated-img">

        <Slideshow /> 
      </div>

      <div className="rightside text-center">
        <h1 className="display-4">BLOCKCHAIN</h1>
        <h2 className="display-3">HỆ THỐNG CHỨNG THỰC</h2>
        <h2 className="display-3">NGUỒN GỐC QUÝT HỒNG LAI VUNG</h2>
        <p className="lead">DỰA TRÊN MẠNG ETHEREUM VÀ NGÔN NGỮ SOLIDITY</p>
        <a href="/tracuu" className="btn btn-warning btn-lg mt-4 btn-spacing">TRA CỨU SẢN PHẨM</a>
        <a href="/Login" className="btn btn-warning btn-lg mt-4">ĐĂNG NHẬP</a>
      </div>
    </section>

    <footer>
      <p className="footer-info">&copy; 2024 Blockchain. Mọi quyền được bảo lưu.</p>
      <p className="footer-info">Họ và tên: Phạm Thị Minh Thu | MSSV: B2013506 | Email: thuB2013506@student.ctu.edu.vn</p>
      <div class="footer-content">  
        <div class="social-links">
          <a href="https://www.facebook.com/share/g/1HBKyfjahu/" className="bi-icon bi-facebook" target="_blank" rel="noopener noreferrer">
          </a>
          <a href="https://youtu.be/qYI0CPTt6mc?si=8-F8jskP6eZP6xog" className="bi-icon bi-youtube" target="_blank" rel="noopener noreferrer">
          </a>
          <a href="https://vi.wikipedia.org/wiki/N%C6%B0%E1%BB%9Bc_m%E1%BA%AFm_Ph%C3%BA_Qu%E1%BB%91c" className="bi-icon bi-google"target="_blank" rel="noopener noreferrer">
          </a>
        </div>
        <div class="footer-links">
          <a href="/infostudent">Thông tin </a>
          <a href="/dieukhoan">Điều khoản sử dụng</a>
        </div>
      </div>
    </footer>

  </header>

);

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = XacThucSanPham.networks[networkId];
        if (deployedNetwork) {
          const instance = new web3.eth.Contract(XacThucSanPham.abi, deployedNetwork.address);
          setContract(instance);
        } else {
          console.error("Smart contract is not deployed to the detected network.");
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    loadWeb3();
  }, []);

  return (
    <div className="container-fluid">
      <main>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<Home account={account} navigate={navigate} />} />
          <Route path="/tracuu" element={<XacThuc contract={contract} account={account} />} />
          <Route path="/Login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/view-product"
            element={
              <PrivateRoute>
                <ViewProduct />
              </PrivateRoute>
            }
          />
          <Route path="admin/view-product" element={<ViewProduct />} />
          <Route path="/fake" element={<Fake />} />
          <Route path="/infoproduct" element={<InfoProduct />} />
          <Route path="/infostudent" element={<Us />} />
          <Route path="/dieukhoan" element={<Clause />} />
        </Routes>
      </HelmetProvider>
      </main>
    </div>
  );
};

export default App;
