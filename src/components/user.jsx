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
import logo_bct from '../img/logo_bct.png';

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
    <div className="d-flex" id="user-wrapper">
    <Helmet>
      <title>Quản Lý Sản Phẩm</title>
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
          className={`list-group-item list-group-item-action bg-transparent text-white ${showAddProduct ? 'active' : ''}`} 
          onClick={toggleAddProduct}>
          <i className="bi bi-database-add me-2"></i>Thêm Sản Phẩm
        </a>
        <a href="#" 
          className={`list-group-item list-group-item-action bg-transparent text-white ${showProductList ? 'active' : ''}`} 
          onClick={toggleProductList}>
          <i className="bi bi-card-list me-2"></i>Danh Sách Sản Phẩm
        </a>
        <a href="#" 
          className={`list-group-item list-group-item-action bg-transparent text-white ${showUserInfo ? 'active' : ''}`} 
          onClick={toggleUserInfo}>
          <i className="bi bi-person-circle me-2"></i>Thông Tin Tài Khoản
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
    
    {/* Main Content */}
    <main className="user-dashboard-main col-md-9 ms-sm-auto col-lg-10 px-md-4">
      
    {/* Logout Button */}
    <div className="user-dashboard-logout d-flex justify-content-end mt-3">
      <button 
      className="btn btn-outline-danger" 
      onClick={handleLogout}
      >
      <i className="bi bi-box-arrow-right me-2"></i>
      Đăng xuất
      </button>
    </div>
    
    {/* User Info Bar */}
    <div className="user-dashboard-info-bar alert mt-3 text-center" 
       role="alert" 
       style={{ backgroundColor: "#FFA726", color: "white", padding: "15px", borderRadius: "10px" }}>
        <h2>Nông hộ sản xuất: {nonghoSX} </h2>
        <h4> Địa chỉ: {diaChi} </h4>
    </div>

          {/* Add Product Section */}
          {showAddProduct && (
        <div className="user-dashboard-add-product card mt-3">
          <div className="card-header">
            <h3>Thêm Sản Phẩm</h3>
          </div>
          <div className="card-body">
            <form onSubmit={addProduct}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Nông Hộ Sản Xuất</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={nonghoSX} 
                      readOnly 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email liên hệ</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={username} 
                      readOnly 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mã Sản Phẩm</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="maSanPham"
                      placeholder="Nhập mã sản phẩm" 
                      value={productData.maSanPham}
                      onChange={handleInputChange}
                      required 
                      autoComplete="off"  
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tiêu Chuẩn</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="tieuChuan"
                      placeholder="Nhập tiêu chuẩn (VD: VietGap, Organic, GlobalGap,...)" 
                      value={productData.tieuChuan}
                      onChange={handleInputChange}
                      autoComplete="off"  
                    />
                  </div>
                </div>
                <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label">Loại quýt</label>
        <select 
          name="loai" 
          value={productData.loai} 
          onChange={handleInputChange} 
          className="form-control" 
          required
        >
          <option value="">Chọn loại quýt</option>
          <option value="Loại 1">Loại 1</option>
          <option value="Loại 2">Loại 2</option>
        </select>
      </div>
                  <div className="mb-3">
                    <label className="form-label">Giống quýt</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="giong"
                      placeholder="Nhập giống quýt (VD: Truyền thống, Không hạt,...)"
                      value={productData.giong}
                      onChange={handleInputChange}
                      required 
                      autoComplete="off"  
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Trọng lượng</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="trongLuong"
                      placeholder="Nhập trọng lượng (VD: 1000kg)"
                      value={productData.trongLuong}
                      onChange={handleInputChange}
                      autoComplete="off"  
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ngày Thu Hoạch</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      name="ngayThuHoach"
                      value={productData.ngayThuHoach}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-custom"> 
                Thêm sản phẩm 
              </button>

            </form>
            {errorMessage && (
              <div className="alert alert-danger mt-3">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      )}

          {/* Product List Section */}
        {showProductList && (
          <div className="card shadow border-0 mt-4">
            <div className="card-header bg-primary text-white">
              <h5 className="m-0">Danh sách sản phẩm</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Email liên hệ</th>
                      <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Mã sản phẩm</th>
                      <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Tiêu chuẩn</th>
                      <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Loại quýt</th>
                      <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Giống quýt</th>
                      <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Trọng lượng</th>
                      <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Ngày thu hoạch</th>
                      <th scope="col" style={{ backgroundColor: "#f3be63", color: "white" }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.length > 0 ? (
                      productList
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
                              color: parseInt(product[9]) === 1 ? "green" : "#FFA726",
                              fontWeight: "bold",
                            }}
                          >
                            <i className={`bi ${parseInt(product[9]) === 1 ? 'bi-check-circle-fill' : 'bi-clock'} me-2`}></i>
                            {parseInt(product[9]) === 0 ? "Chờ duyệt" : "Đã duyệt"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <i className="bi bi-exclamation-circle fs-1 text-muted"></i>
                          <p className="mt-3 text-muted">Chưa có sản phẩm nào!</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

          {/* User Info Section */}
          {showUserInfo && (
            <div className="user-dashboard-user-info card mt-3">
              <div className="card-header">
                <h3>Thông Tin Tài Khoản</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img 
                      src={avt} 
                      alt="User Avatar" 
                      className="img-fluid rounded-circle mb-3" 
                      style={{maxWidth: '200px'}} 
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <strong>Email:</strong> {username}
                    </div>
                    <div className="mb-3">
                      <strong>Nông Hộ Sản Xuất:</strong> {nonghoSX}
                    </div>
                    <div className="mb-3">
                      <strong>Địa Chỉ:</strong> {diaChi}
                    </div>
                    <div className="mb-3">
                      <strong>Số Điện Thoại:</strong> {sdt}
                    </div>
                    <button className="btn btn-custom-outline" onClick={() => setShowPasswordForm(!showPasswordForm)}> 
                      Đổi Mật Khẩu
                    </button>

                    {showPasswordForm && (
                      <form 
                        className="user-dashboard-password-form mt-3" 
                        onSubmit={handlePasswordChange}
                      >
                        <div className="mb-3">
                          <label className="form-label">Mật khẩu cũ</label>
                          <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Nhập mật khẩu cũ" 
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Mật khẩu mới</label>
                          <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Nhập mật khẩu mới" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Xác nhận mật khẩu mới</label>
                          <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Xác nhận mật khẩu mới" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                          />
                        </div>
                        <button type="submit" className="btn btn-primary">
                          Cập Nhật
                        </button>
                        {errorMessage && (
                          <div className="alert alert-danger mt-3">
                            {errorMessage}
                          </div>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
  );
};


export default User;
