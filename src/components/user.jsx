import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { useNavigate, useLocation } from 'react-router-dom';
import XacThucSanPham from '../contracts/XacThucSanPham.json';
import QuanLyUserContract from '../contracts/QuanLyUser.json';
import moment from 'moment'; 
import { Helmet } from 'react-helmet-async';
import '../css/user.css'; 
import avt from '../img/avatar-trang.jpg';

const User = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [productData, setProductData] = useState({
    maSanPham: '', loai: '', giong: '', tieuChuan: '', trongLuong: '', ngayThuHoach: ''
  });
  const [showUserInfo, setShowUserInfo] = useState(false); 
  const [username, setUsername] = useState('');
  const [nonghoSX, setNongHoSX] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [sdt, setSDT] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [productList, setProductList] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false); 
  const [showProductList, setShowProductList] = useState(false); 
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedInUsername, loggedInPassword } = location.state || {};

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
          console.error("Smart contract không được triển khai vào mạng được phát hiện.");
        }
      } else {
        console.error("Vui lòng cài đặt MetaMask!");
      }
    };

  const fetchUserData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();

        // Load contract QuanLyUser
        const quanLyUserNetwork = QuanLyUserContract.networks[networkId];
        const quanLyUserContract = new web3.eth.Contract(
          QuanLyUserContract.abi,
          quanLyUserNetwork && quanLyUserNetwork.address,
        );

        try {
          const user = await quanLyUserContract.methods.getUserByLogin(loggedInUsername, loggedInPassword).call();
          setUsername(user.username);
          setNongHoSX(user.nonghoSX);
          setDiaChi(user.diaChi);
          setSDT(user.sdt);
        } catch (error) {
          console.error(error); 
        }
      }
    };

    loadWeb3();
    fetchUserData();
  }, [loggedInUsername, loggedInPassword, contract]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
  
    // Cảnh báo xác nhận trước khi thêm sản phẩm
    const confirmAdd = window.confirm("Sản phẩm khi thêm không thể chỉnh sửa. Bạn có muốn thêm sản phẩm?");
    if (!confirmAdd) {
      return;
    }
  
    // Destructure các thông tin sản phẩm từ productData
    const { maSanPham, loai, giong, tieuChuan, trongLuong, ngayThuHoach } = productData;
  
    const formattedDate = moment(ngayThuHoach, "YYYY-MM-DD").format("DD-MM-YYYY");
  
    if (!maSanPham || !loai || !giong || !tieuChuan || !trongLuong || !ngayThuHoach) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
  
    try {
      // Gọi hàm addProduct từ smart contract, truyền tham số kiểu string
      await contract.methods.addProduct(
        nonghoSX,   
        username,     
        diaChi,      
        maSanPham,     
        loai,     
        giong,       
        tieuChuan,     
        trongLuong,       
        formattedDate  
      ).send({ from: account });
  
      // Thông báo thành công và reset lại form
      alert("Thêm sản phẩm thành công, hãy chờ Bộ Công Thương duyệt!");
      setProductData({
        maSanPham: '', loai: '', giong: '', tieuChuan: '', trongLuong: '', ngayThuHoach: ''
      });
      setErrorMessage('');
    } catch (error) {
      // Xử lý lỗi nếu có
      if (error.message.includes("Internal JSON-RPC error")) {
        setErrorMessage("Mã sản phẩm đã tồn tại. Vui lòng nhập một mã khác.");
      } else {
        setErrorMessage("");
      }
    }
  };

  function resetState() {
    setProductData({
      maSanPham: '', loai: '', giong: '', tieuChuan: '', trongLuong: '', ngayThuHoach: ''
    });
    setErrorMessage('');
    setShowUserInfo(false);
    setShowAddProduct(false);
    setShowProductList(false);
    setShowPasswordForm(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  const toggleUserInfo = () => {
    resetState(); 
    setShowUserInfo(true);
  };
  
  const toggleAddProduct = () => {
    resetState();
    setShowAddProduct(true);
  };

  const toggleProductList = async () => {
    resetState();
    setShowProductList(true);
  
    if (!showProductList && username) {
      try {
        const response = await contract.methods.getProductsByNongHoSX(nonghoSX).call();
  
        // Lấy mảng hash từ kết quả trả về
        const productHashes = response[0];
  
        // Lấy chi tiết sản phẩm cho từng hash
        const productsDetails = await Promise.all(
          productHashes.map(hash => contract.methods.getProduct(hash).call())
        );
        setProductList(productsDetails);
        console.log(productList)
      } catch (error) {
        console.error("Error fetching product list:", error);
      }
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage(
        'Mật khẩu mới không hợp lệ. Mật khẩu phải chứa ít nhất 8 ký tự và ít nhất một ký tự đặc biệt.'
      );
      return;
    }
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const quanLyUserNetwork = QuanLyUserContract.networks[networkId];
      const quanLyUserContract = new web3.eth.Contract(
        QuanLyUserContract.abi,
        quanLyUserNetwork && quanLyUserNetwork.address,
      );
      await quanLyUserContract.methods.changePassword(username, oldPassword, newPassword).send({ from: account });
      alert("Đổi mật khẩu thành công!");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      if (error.message.includes("Internal JSON-RPC error")) {
        setErrorMessage("Mật khẩu cũ không đúng!");
      } else {
        setErrorMessage("");
      }
    }
  };
  return (
    <div className="user-container">
      <Helmet>
        <title>User</title>
      </Helmet>
      <button className="logout-button bi-box-arrow-right" onClick={handleLogout}> Đăng xuất</button> 
      <div className="sidebar">
        <h2 className="sidebar-h2">MENU</h2>
        <ul>
          <li><a className="bi-database-add" onClick={toggleAddProduct}> Thêm sản phẩm</a></li>
          <li><a className="bi-card-list" onClick={toggleProductList}> Danh sách sản phẩm</a></li>
          <li><a className="bi-person-circle" onClick={toggleUserInfo}> Thông tin tài khoản</a></li>
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
        <p className="text-white"><strong>Nông hộ sản xuất:</strong> {nonghoSX} <strong> - Địa Chỉ:</strong> {diaChi}</p>
        {showAddProduct && (
          <div className="add-product-form">
      
            <h1>Thêm Sản Phẩm</h1>
            <form onSubmit={addProduct}>
            <div className="form-row">
            <div className="form-column">            
              <label className="user-label">Nông Hộ Sản Xuất</label>
              <input type="text" name="nonghoSX" placeholder="Nhập nông hộ sản xuất" value={nonghoSX} readOnly />

              <label className="user-label">Email liên hệ</label>
              <input type="text" name="username" placeholder="" value={username} readOnly />
              <label className="user-label">Nơi Sản Xuất và Đóng Gói</label>
              <input type="text" name="diaChi" placeholder="" value={diaChi} readOnly />
              <label className="user-label">Mã Sản Phẩm</label>
              <input type="text" name="maSanPham" placeholder="Nhập mã sản phẩm" value={productData.maSanPham} onChange={handleInputChange} required />
              
              <label className="user-label">Loại quýt</label>
              <input type="text" name="loai" placeholder="Nhập loại quýt" value={productData.loai} onChange={handleInputChange} required />
              </div>

              <div className="form-column">
              <label className="user-label">Giống quýt</label>
              <input type="text" name="giong" placeholder="Nhập giống quýt" value={productData.giong} onChange={handleInputChange} required />

              <label className="user-label">Tiêu Chuẩn</label>
              <input type="text" name="tieuChuan" placeholder="Nhập tiêu chuẩn" value={productData.tieuChuan} onChange={handleInputChange} />
              
              <label className="user-label">Trọng lượng</label>
              <input type="text" name="trongLuong" placeholder="Nhập trọng lượng" value={productData.trongLuong} onChange={handleInputChange} />
              
              <label className="user-label">Ngày Thu Hoạch</label>
              <input type="date" name="ngayThuHoach" value={productData.ngayThuHoach} onChange={handleInputChange} required />
  
              </div>
              </div>
              <button type="submit">Thêm sản phẩm</button>
            </form>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
          </div>
        )}

        {showProductList && (
          <div className="product-list">
            <h1 className="list-h1">Danh Sách Sản Phẩm</h1>
            {productList.length > 0 ? (
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Email liên hệ</th>
                    <th>Mã sản phẩm</th>
                    <th>Tiêu chuẩn</th>
                    <th>Loại quýt</th>                  
                    <th>Giống quýt</th>  
                    <th>Trọng lượng</th>
                    <th>Ngày thu hoạch</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {productList
                  .sort((a, b) => a[1].localeCompare(b[1]))
                  .map((product, index) => (
                    <tr key={index}>
                      <td>{product[1]}</td>
                      <td>{product[3]}</td>
                      <td>{product[6]}</td>
                      <td>{product[4]}</td>
                      <td>{product[5]}</td>
                      <td>{product[7]}</td>
                      <td>{product[8]}</td>
                      <td
                        style={{
                          color: parseInt(product[9]) === 1 ? "red" : "green",
                          fontWeight: "bold",
                        }}
                      >
                        {parseInt(product[9]) === 0 ? "Chờ duyệt" : "Đã duyệt"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-white">Chưa có sản phẩm nào!</p>
            )}
          </div>
        )}

        {showUserInfo && (
          <div className="user-info">
            <div className="avatar-section">
              <img 
                src={avt} alt="User Avatar" className="user-avatar"
              />
            </div>
            <div className="info-section">
              <h1>Thông Tin Tài Khoản</h1>
              
              <p><strong>Email:</strong> {username}</p>
              <p><strong>Nông Hộ Sản Xuất:</strong> {nonghoSX}</p>
              <p><strong>Địa Chỉ:</strong> {diaChi}</p>
              <p><strong>Số Điện Thoại:</strong> {sdt}</p>
              <button className="change-password-btn" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                Đổi Mật Khẩu
              </button>
              {showPasswordForm && (
                <form className="change-password-form" onSubmit={handlePasswordChange}>
                  <label className="user-label">Mật khẩu cũ</label>
                  <input type="password" placeholder="Nhập mật khẩu cũ" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                  <label className="user-label">Mật khẩu mới</label>
                  <input type="password" placeholder="Nhập mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  <label className="user-label">Xác nhận mật khẩu mới</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Xác nhận mật khẩu mới" required />
                  <button type="submit">Cập Nhật</button>
                  {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </form>
              )}
          </div>
          </div>
        )}

      </div>
      
    </div>
  );
};

export default User;
