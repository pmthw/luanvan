import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import QuanLyUserContract from '../contracts/QuanLyUser.json';
import { Helmet } from 'react-helmet-async';
import removeAccents from 'remove-accents';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import '../css/user.css';
import logo_bct from '../img/logo_bct.png';
import ProductAwaiting from './ProductAwaiting';
import ViewProduct from './ProductAwaiting';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [nonghoSX, setNongHoSX] = useState('');
  const [diaChi, setDiaChi] = useState('');  
  const [sdt, setSdt] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userList, setUserList] = useState([]); 
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddUser, setShowAddUser] = useState(true);
  const [showUserList, setShowUserList] = useState(false);
  const [showViewProduct, setShowViewProduct]=useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = QuanLyUserContract.networks[networkId];
      const contract = new web3.eth.Contract(
        QuanLyUserContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const { 0: usernames, 1: nonghoSXs } = await contract.methods.getAllUsers().call();
      const allUsers = usernames.map((username, index) => ({
        username,
        nonghoSX: nonghoSXs[index],
      }));
      setUserList(allUsers);
    }
  };

  const handleAddUser = async () => {
    if (!username || !nonghoSX || !diaChi || !sdt || !password || !confirmPassword ) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setErrorMessage("Email không hợp lệ. Vui lòng nhập đúng định dạng email.");
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(sdt)) {
      setErrorMessage("Số điện thoại không hợp lệ. Chỉ được chứa số và phải từ 10-15 chữ số.");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    const passwordRegex =/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự và ít nhất một ký tự đặc biệt."
      );
      return;
    }
    const nonghoSXWithoutAccents = removeAccents(nonghoSX);
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = QuanLyUserContract.networks[networkId];
      const contract = new web3.eth.Contract(
        QuanLyUserContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const isConfirmed = window.confirm("Thông tin đã được nhập chính xác. Bạn muốn thêm tài khoản?");
  
      if (isConfirmed) {
        try {
          await contract.methods
            .addUser(username, nonghoSXWithoutAccents, diaChi, sdt, password)
            .send({ from: window.ethereum.selectedAddress });
          setUsername('');
          setNongHoSX('');
          setDiaChi('');
          setSdt('');
          setPassword('');
          setConfirmPassword('');
          setErrorMessage('');
          loadUsers();
          alert("Thêm người dùng thành công!");
        } catch (error) {
          if (error.message.includes("Internal JSON-RPC error")) {
            setErrorMessage("Email đã tồn tại. Vui lòng nhập một email khác.");
          } else {
    
          }
        }
      } 
    } else {
      setErrorMessage("Ethereum browser extension not detected");
    }
  };
  
  const getUserInfo = async (username) => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = QuanLyUserContract.networks[networkId];
        const contract = new web3.eth.Contract(
          QuanLyUserContract.abi,
          deployedNetwork && deployedNetwork.address
        );
  
        const { 0: nonghoSX, 1: diaChi, 2: sdt } = await contract.methods
          .getUser(username)
          .call();
  
        return { nonghoSX, diaChi, sdt };
      } else {
        throw new Error("Ethereum browser extension not detected");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      return null;
    }
  };
  
  const handleRemoveUser = async (user) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = QuanLyUserContract.networks[networkId];
      const contract = new web3.eth.Contract(
        QuanLyUserContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
  
      try {
        await contract.methods.removeUser(user).send({ from: window.ethereum.selectedAddress });
        loadUsers(); 
      } catch (error) {
          setErrorMessage("");
      }
    } else {
      setErrorMessage("Ethereum browser extension not detected");
    }
  };
  

  const handleViewProducts = (nonghoSX) => {
    const url = `/admin/view-product?nonghoSX=${encodeURIComponent(nonghoSX)}`;
    window.open(url, '_blank');
  };

  const toggleAddUser = () => {
    setShowAddUser(true);
    setShowUserList(false);
    setShowViewProduct(false);
  };

  const toggleUserList = () => {
    setShowAddUser(false);
    setShowUserList(true);
    setShowViewProduct(false);
  };
  const toggleViewProducts = () => {
    setShowAddUser(false);
    setShowUserList(false);
    setShowViewProduct(true);
  };

  const handleViewUserInfo = async (username) => {
    const userInfo = await getUserInfo(username);
    if (userInfo) {
      alert(`
        Email: ${username}
        Nông Hộ Sản Xuất: ${userInfo.nonghoSX}
        Địa Chỉ: ${userInfo.diaChi}
        Số Điện Thoại: ${userInfo.sdt}
      `);
    } else {
      alert("Không thể lấy thông tin người dùng.");
    }
  };
  
  const handleResetPassword = async (username) => {
    const newPassword = window.prompt("Nhập mật khẩu mới cho tài khoản này:");
  
    if (newPassword === null) {
      return; 
    }

    if (!newPassword) {
      alert("Mật khẩu không được để trống.");
      return;
    }
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert("Mật khẩu không hợp lệ. Phải chứa ít nhất 8 ký tự và ít nhất một ký tự đặc biệt.");
      return;
    }
    const confirmPassword = window.prompt("Nhập lại mật khẩu mới:");
  
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp. Vui lòng thử lại.");
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
        await contract.methods.resetPassword(username, newPassword).send({ from: window.ethereum.selectedAddress });
        alert("Cấp lại mật khẩu thành công!");
      } catch (error) {
        console.error("Lỗi khi cấp lại mật khẩu:", error);
        alert("Cấp lại mật khẩu không thành công.");
      }
    } else {
      alert("Ethereum browser extension not detected.");
    }
  };
  
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="d-flex" id="admin-wrapper">
      <Helmet>
        <title>Quản Lý Tài Khoản</title>
      </Helmet>

      {/* Sidebar */}
      <div className="sidebar" id="sidebar-wrapper" style={{ backgroundColor: "#FFA726" }}>
        <div className="logo-bct text-center py-3">
        <img src={logo_bct} alt="Logo Bộ Công Thương" className="logo_bct" style={{ width: "100px", height: "auto" }} />
        </div>
        <div className="sidebar-heading text-center py-3 text-white fs-5 fw-bold border-bottom">
          <span>BỘ CÔNG THƯƠNG</span>
        </div>
        <div className="list-group list-group-flush my-3">
          <a href="#" 
            className={`list-group-item list-group-item-action bg-transparent text-white ${showAddUser ? 'active' : ''}`} 
            onClick={toggleAddUser}>
            <i className="bi bi-person-plus-fill me-2"></i>Thêm Tài Khoản
          </a>
          <a href="#" 
            className={`list-group-item list-group-item-action bg-transparent text-white ${showUserList ? 'active' : ''}`} 
            onClick={toggleUserList}>
            <i className="bi bi-card-list me-2"></i>Danh Sách Tài Khoản
          </a>
          <a href="#" 
            className={`list-group-item list-group-item-action bg-transparent text-white ${showUserList ? 'active' : ''}`} 
            onClick={toggleViewProducts}>
            <i className="bi bi-card-list me-2"></i>Sản phẩm chờ duyệt
          </a>
        </div>
        <div className="social-links text-center mt-auto mb-4">
          <a href="https://youtu.be/_OtEvHS_dhE?si=9bTrVJAD1uyW1hqN" className="text-white mx-2" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-youtube fs-5"></i>
          </a>
          <a href="https://vi.wikipedia.org/wiki/Qu%C3%BDt_h%E1%BB%93ng" className="text-white mx-2" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-google fs-5"></i>
          </a>
        </div>
      </div>

      {/* Page Content */}
      <div id="page-content-wrapper">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg px-4">
          <div className="d-flex align-items-center">
            <h2 className="fs-4 m-0">{showAddUser ? 'Thêm Tài Khoản' : 'Danh Sách Tài Khoản'}</h2>
          </div>
        < button className="btn btn-outline-danger ms-auto d-flex align-items-center" 
        onClick={handleLogout}
        > 
        <i className="bi bi-box-arrow-right me-2"></i>
        Đăng xuất
        </button>
      </nav>

        {/* Content */}
        <div className="container-fluid px-4">
          {showAddUser && (
            <div className="card shadow border-0 mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="m-0">Thông tin tài khoản mới</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          type="email" 
                          className="form-control" 
                          id="floatingEmail" 
                          placeholder="name@example.com"
                          value={username}
                          autoComplete="off"  
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="floatingEmail">Email</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input 
                          type="text" 
                          className="form-control" 
                          id="floatingNongHo" 
                          placeholder="Nông hộ sản xuất"
                          value={nonghoSX}
                          autoComplete="off"  
                          onChange={(e) => setNongHoSX(e.target.value)}
                        />
                        <label htmlFor="floatingNongHo">Nông Hộ Sản Xuất</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input 
                          type="text" 
                          className="form-control" 
                          id="floatingAddress" 
                          placeholder="Địa chỉ"
                          value={diaChi}
                          autoComplete="off"  
                          onChange={(e) => setDiaChi(e.target.value)}
                        />
                        <label htmlFor="floatingAddress">Địa chỉ</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          type="text" 
                          className="form-control" 
                          id="floatingPhone" 
                          placeholder="Số điện thoại"
                          value={sdt}
                          autoComplete="off"  
                          onChange={(e) => setSdt(e.target.value)}
                        />
                        <label htmlFor="floatingPhone">Số Điện Thoại</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input 
                          type="password" 
                          className="form-control" 
                          id="floatingPassword" 
                          placeholder="Mật khẩu"
                          value={password}
                          autoComplete="off"  
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingPassword">Mật Khẩu</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input 
                          type="password" 
                          className="form-control" 
                          id="floatingConfirmPassword" 
                          placeholder="Nhập lại mật khẩu"
                          value={confirmPassword}
                          autoComplete="off"  
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label htmlFor="floatingConfirmPassword">Nhập Lại Mật Khẩu</label>
                      </div>
                    </div>
                  </div>
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  <div className="d-grid gap-2 col-6 mx-auto">
                  <button type="button" 
                    className="btn btn-add-user py-3" 
                    onClick={handleAddUser}>
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Thêm Tài Khoản
                  </button>

                  </div>
                </form>
              </div>
            </div>
          )}

          {showUserList && (
            <div className="card shadow border-0" >
              <div className="card-header bg-primary text-white">
                <h5 className="m-0">Danh sách tài khoản người dùng</h5>
              </div>
              <div className="card-body">
                {userList.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                        <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Cơ Sở Sản Xuất</th>
                          <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Email</th>
                          <th scope="col" className="text-center" style={{ backgroundColor: "#f3be63", color: "white" }}>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userList
                          .sort((a, b) => {
                            const nameA = removeAccents(a.nonghoSX.toLowerCase());
                            const nameB = removeAccents(b.nonghoSX.toLowerCase());
                            return nameA.localeCompare(nameB);
                          })
                          .map((user, index) => (
                            <tr key={index}>
                              <td>{user.nonghoSX}</td>
                              <td>{user.username}</td>
                              <td>
                                <div className="d-flex justify-content-center gap-2">
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleViewUserInfo(user.username)}
                                    title="Xem Thông Tin"
                                  >
                                    <i className="bi bi-search"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-info btn-sm"
                                    onClick={() => handleViewProducts(user.nonghoSX)}
                                    title="Danh Sách Sản Phẩm"
                                  >
                                    <i className="bi bi-card-list"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={() => handleResetPassword(user.username)}
                                    title="Cấp Lại Mật Khẩu"
                                  >
                                    <i className="bi bi-key-fill"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleRemoveUser(user.username)}
                                    title="Xóa Tài Khoản"
                                  >
                                    <i className="bi bi-trash3-fill"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-exclamation-circle fs-1 text-muted"></i>
                    <p className="mt-3 text-muted">Chưa có tài khoản nào được tạo!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {
            showViewProduct && (
              <ProductAwaiting toggleViewProducts ={toggleViewProducts}/>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Admin;