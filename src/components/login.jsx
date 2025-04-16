import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import QuanLyUserContract from "../contracts/QuanLyUser.json";
import { Helmet } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    if (!username || !password) {
      setErrorMessage("Vui lòng nhập email và mật khẩu.");
      return;
    }
  
    if (!window.ethereum) {
      setErrorMessage("Vui lòng cài đặt MetaMask.");
      return;
    }
  
    setLoading(true);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
  
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = QuanLyUserContract.networks[networkId];
  
      if (!deployedNetwork) {
        setErrorMessage("Hợp đồng không được triển khai trên mạng này.");
        return;
      }
  
      const contract = new web3.eth.Contract(
        QuanLyUserContract.abi,
        deployedNetwork.address
      );
  
      const isAdminValid = await contract.methods.verifyAdmin(username, password).call();
      if (isAdminValid) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/admin");
        return;
      }
  
      const isUserValid = await contract.methods.verifyUser(username, password).call();
      if (isUserValid) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/user", {
          state: { loggedInUsername: username, loggedInPassword: password },
        });
      } else {
        setErrorMessage("Email hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err);
      setErrorMessage("Đã xảy ra lỗi trong quá trình đăng nhập.");
    } finally {
      setLoading(false);
    }  
  };

  return (
    <div style={{backgroundColor: '#FFFAF0', minHeight: '100vh'}}>
      <Helmet>
        <title>Quýt Hồng Lai Vung | Đăng Nhập</title>
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
                </ul>
              </div>
            </div>
          </nav>

      <div className="container d-flex justify-content-center align-items-center" style={{minHeight: 'calc(100vh - 76px)'}}>
        <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: "450px", width: "100%" }}>
          <div className="card-header text-center py-3" style={{backgroundColor: '#FFA726', borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}>
            <h3 className="fw-bold text-white m-0">ĐĂNG NHẬP</h3>
          </div>
          
          <div className="card-body p-4">
            <form className="mt-2" onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-envelope-fill me-2"></i>Email
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg border-1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-key-fill me-2"></i>Mật khẩu
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg border-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  required
                />
              </div>

              {errorMessage && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{errorMessage}</div>
                </div>
              )}

              <div className="d-grid gap-2 mt-4">
                <button 
                  className="btn btn-lg py-2 text-white fw-bold w-100"
                  style={{backgroundColor: '#FFA726'}}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span> Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>Đăng Nhập
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-lg btn-outline-secondary py-2 mt-2"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  <i className="bi bi-arrow-left me-2"></i>Quay về trang chủ
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;