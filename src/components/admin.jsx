import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import QuanLyUserContract from '../contracts/QuanLyUser.json';
import { Helmet } from 'react-helmet-async';
import removeAccents from 'remove-accents'; 
import '../css/user.css';

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
  };

  const toggleUserList = () => {
    setShowAddUser(false);
    setShowUserList(true);
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
    <div className="user-container">
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <button className="logout-button bi-box-arrow-right" onClick={handleLogout}> Đăng xuất</button>
      <div className="sidebar">
        <h2 className="sidebar-h2">BỘ CÔNG THƯƠNG</h2>
        <ul>
          <li><a className="bi-house-add-fill" href="#" onClick={toggleAddUser}> Thêm Tài Khoản</a></li>
          <li><a className="bi-card-list" href="#" onClick={toggleUserList}> Danh Sách Tài Khoản</a></li>
        </ul>
        <div class="social-links">
          <a href="https://www.facebook.com/share/g/1HBKyfjahu/" className="bi-icon bi-facebook" target="_blank" rel="noopener noreferrer">
          </a>
          <a href="https://youtu.be/qYI0CPTt6mc?si=8-F8jskP6eZP6xog" className="bi-icon bi-youtube" target="_blank" rel="noopener noreferrer">
          </a>
          <a href="https://vi.wikipedia.org/wiki/N%C6%B0%E1%BB%9Bc_m%E1%BA%AFm_Ph%C3%BA_Qu%E1%BB%91c" className="bi-icon bi-google"target="_blank" rel="noopener noreferrer">
          </a>
        </div>
      </div>

      <div className="content">
        {showAddUser && (
          <div className="add-user-form">
            <h1>Thêm Tài Khoản</h1>
            <div className="form-row">
            <div className="form-column">
              <label className="admin-label">Email</label>
              <input type="email" placeholder="Nhập email" value={username} onChange={(e) => setUsername(e.target.value)}/>

              <label className="admin-label">Nông Hộ Sản Xuất</label>
              <input type="text" placeholder="Nhập nông hộ sản xuất" value={nonghoSX} onChange={(e) => setNongHoSX(e.target.value)}/>
              
              <label className="admin-label">Địa chỉ</label>
              <input type="text" placeholder="Nhập địa chỉ" value={diaChi} onChange={(e) => setDiaChi(e.target.value)}/>

              </div>
              <div className="form-column">

              <label className="admin-label">Số Điện Thoại</label>
              <input type="text" placeholder="Nhập số điện thoại" value={sdt} onChange={(e) => setSdt(e.target.value)}/>

              <label className="admin-label">Mật Khẩu</label>
              <input type="password" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)}/>

              <label className="admin-label">Nhập Lại Mật Khẩu</label>
              <input type="password" placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              </div>
            </div>
            <button onClick={handleAddUser} className="btn btn-primary mb-4">Thêm</button>
            {errorMessage && <p className="admin-danger">{errorMessage}</p>}
          </div>
        )}

        {showUserList && (
          <div className="fade-in">
            <h1 className="list-user-h1">Danh Sách Tài Khoản</h1>
            {userList.length > 0 ? (
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Cơ Sở Sản Xuất</th>
                    <th>Email</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {userList
                    .sort((a, b) => a.nonghoSX.localeCompare(b.nonghoSX)) // Sắp xếp theo thứ tự chữ cái
                    .map((user, index) => (
                      <tr key={index}>
                        <td>{user.nonghoSX}</td>
                        <td>{user.username}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm btn-margin-right bi-search"
                            onClick={() => handleViewUserInfo(user.username)}
                          >
                            Xem Thông Tin
                          </button>
                          <button
                            className="btn btn-info btn-sm btn-margin-right bi-card-list"
                            onClick={() => handleViewProducts(user.nonghoSX)}
                          >
                            Danh Sách Sản Phẩm
                          </button>
                          <button
                            className="btn btn-success btn-sm btn-margin-right bi-key-fill"
                            onClick={() => handleResetPassword(user.username)}
                          >
                            Cấp Lại Mật Khẩu
                          </button>
                          <button
                            className="btn btn-danger btn-sm btn-margin-right bi-trash3-fill"
                            onClick={() => handleRemoveUser(user.username)}
                          >
                            Xóa Tài Khoản
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-white">Chưa có tài khoản nào được tạo!</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
