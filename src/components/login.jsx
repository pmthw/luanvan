import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import QuanLyUserContract from '../contracts/QuanLyUser.json';
import '../css/login.css'; 
import { Helmet } from 'react-helmet-async'; 
const Login = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Vui lòng nhập email và password.");
      return;
    }

    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = QuanLyUserContract.networks[networkId];
      const contract = new web3.eth.Contract(
        QuanLyUserContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      try {
        const isAdminValid = await contract.methods.verifyAdmin(username, password).call();

        if (isAdminValid) {
          localStorage.setItem('isAuthenticated', true);
          navigate('/admin');
          return;
        }
        const isUserValid = await contract.methods.verifyUser(username, password).call();

        if (isUserValid) {
          localStorage.setItem('isAuthenticated', true);
          navigate('/user', { state: { loggedInUsername: username, loggedInPassword: password } }); 
        } else {
          setErrorMessage("Email hoặc password không hợp lệ.");
        }
      } catch (error) {
        setErrorMessage("Không thể đăng nhập. Vui lòng thử lại.");
      }
    } else {
      setErrorMessage("Ethereum browser extension not detected");
    }
  };

  const handleBack = () => {
    navigate('/'); 
  };

  return (
    <div>
      <div className="login-background"></div>
      <div className="login-container">
        <Helmet>
          <title>Login</title>
        </Helmet>
        <h1 className="login-title">ĐĂNG NHẬP</h1>
          <>
            <label className="login-label">Email</label>
            <input
              className="login-input"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-btn" onClick={handleLogin}>Đăng Nhập</button>
            <div className="back-button-container">
              <button className="back-btn bi-box-arrow-left" onClick={handleBack}> Thoát</button>
            </div>
          </>

        {errorMessage && <p className="login-error">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;