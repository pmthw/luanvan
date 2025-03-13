import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useLocation } from 'react-router-dom';
import XacThucSanPhamContract from '../contracts/XacThucSanPham.json';
import { Helmet } from 'react-helmet-async';
import '../css/ViewProduct.css';

const ViewProduct = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nonghoSX = queryParams.get('nonghoSX');
  const [, setProductHashes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Trạng thái kiểm tra admin

  useEffect(() => {
    const fetchProducts = async () => {
      if (!nonghoSX) {
        console.error('Nông hộ sản xuất không được cung cấp.');
        setLoading(false);
        return;
      }
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = XacThucSanPhamContract.networks[networkId];
        const contract = new web3.eth.Contract(
          XacThucSanPhamContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        try {
          const hashes = await contract.methods.getProductsByNongHoSX(nonghoSX).call();
          setProductHashes(hashes);
          console.log(hashes);

          // Lấy thông tin sản phẩm chi tiết và trạng thái sản phẩm
          const fetchedProducts = hashes[0];
          const productsDetails = await Promise.all(
            fetchedProducts.map(hash => contract.methods.getProduct(hash).call())
          );
          
          // Cập nhật trạng thái của từng sản phẩm vào state
          const updatedProducts = productsDetails.map((product) => ({
            ...product,
            trangThai: product.trangThai || 'PENDING', // Nếu không có trạng thái, mặc định là 'PENDING'
          }));
          
          setProducts(updatedProducts);

          // Kiểm tra xem địa chỉ ví có phải là admin không
          const adminAddress = await contract.methods.admin().call();
          const accounts = await web3.eth.getAccounts();
          if (accounts[0] === adminAddress) {
            setIsAdmin(true); // Nếu địa chỉ ví của người dùng là admin, thiết lập trạng thái admin
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [nonghoSX]);

  const handleApprove = async (maSanPham, nonghoSX) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = XacThucSanPhamContract.networks[networkId];
      const contract = new web3.eth.Contract(
        XacThucSanPhamContract.abi,
        deployedNetwork && deployedNetwork.address
      );
  
      const accounts = await web3.eth.getAccounts();
      try {
        // Tạo productHash từ maSanPham và nonghoSX
        const productHash = maSanPham + nonghoSX; // Kết hợp mã sản phẩm và Nông hộ sản xuất
        const productHashBytes32 = web3.utils.keccak256(web3.utils.asciiToHex(productHash)); // Chuyển thành bytes32
  
        console.log('Approving product hash:', productHashBytes32); // Kiểm tra giá trị đã chuyển đổi
  
        // Gửi transaction để duyệt sản phẩm
        await contract.methods.approveProduct(productHashBytes32).send({ from: accounts[0] });
        alert('Sản phẩm đã được duyệt');
  
        // Cập nhật trạng thái sản phẩm
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product[3] === maSanPham ? { ...product, trangThai: 1 } : product
          )
        );
        window.location.reload(); 
      } catch (error) {
        console.error('Error approving product:', error);
      }
    }
  };
  const handleDelete = async (maSanPham, nonghoSX) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = XacThucSanPhamContract.networks[networkId];
      const contract = new web3.eth.Contract(
        XacThucSanPhamContract.abi,
        deployedNetwork && deployedNetwork.address
      );
  
      const accounts = await web3.eth.getAccounts();
      try {
        // Tạo productHash từ maSanPham và nonghoSX
        const productHash = maSanPham + nonghoSX; // Kết hợp mã sản phẩm và Nông hộ sản xuất
        const productHashBytes32 = web3.utils.keccak256(web3.utils.asciiToHex(productHash)); // Chuyển thành bytes32
  
        console.log('Deleting product hash:', productHashBytes32); // Kiểm tra giá trị đã chuyển đổi
  
        // Gửi transaction để xóa sản phẩm
        await contract.methods.deleteProduct(productHashBytes32).send({ from: accounts[0] });
        alert('Sản phẩm đã được xóa');
  
        // Cập nhật danh sách sản phẩm
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product[3] !== maSanPham)
        );
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
    
  
  return (
    <div className="view-product-container">
      <Helmet>
        <title>Danh Sách Sản Phẩm</title>
      </Helmet>

      <h2 className="text-center">
        Cơ Sở Sản Xuất: <span className="nha-san-xuat">{nonghoSX}</span>
      </h2>

      <div className="table-responsive">
        {loading ? (
          <p className="loading-message">Đang tải dữ liệu...</p>
        ) : products.length === 0 ? (
          <p className="no-products-message">Nông hộ sản xuất chưa thêm sản phẩm nào cả!</p>
        ) : (
          <table className="product-table">
            <thead className="thead-light">
              <tr>
                <th>STT</th>
                <th>Email liên hệ</th>
                <th>Mã sản phẩm</th>
                <th>Tiêu chuẩn</th>
                <th>Loại quýt</th>
                <th>Giống quýt</th>
                <th>Trọng lượng</th>
                <th>Ngày sản xuất</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products
                .sort((a, b) => a[1].localeCompare(b[1]))
                .map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product[1]}</td>
                    <td>{product[3]}</td>
                    <td>{product[6]}</td>
                    <td>{product[4]}</td>
                    <td>{product[5]}</td>
                    <td>{product[7]}</td>
                    <td>{product[8]}</td>
                    <td>
                      {parseInt(product[9]) === 0 ? (
                        isAdmin && (
                          <>
                          <button
                            className="btn btn-success btn-sm btn-margin-right bi-building-check"
                            onClick={() => handleApprove(product[3], product[0])}
                          >
                            Duyệt
                          </button>
                          <button
                            className="btn btn-danger btn-sm btn-margin-right bi-trash3-fill"
                            onClick={() => handleDelete(product[3], product[0])}
                          >
                             Xóa
                          </button>
                          </>
                        )
                      ) : (
                        <span>Đã duyệt</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;
