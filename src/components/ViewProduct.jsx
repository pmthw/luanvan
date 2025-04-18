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
    <div className="container-fluid p-5">
      <div 
        className="view-product-container bg-cover bg-center bg-fixed relative" 
        style={{
          backgroundImage: 'url("../nenquyt.png")',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)'
        }}
      >
        <title>Danh Sách Sản Phẩm</title>

        <h2 className="text-center text-2xl font-bold mb-6 text-white">
          Nông hộ sản xuất: <span className="text-white">{nonghoSX}</span>
        </h2>

        {loading ? (
          <p className="no-products-message text-center text-white">Đang tải dữ liệu...</p>
        ) : products.length === 0 ? (
          <p className="no-products-message">Nông hộ sản xuất chưa thêm sản phẩm nào cả!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-hover">
              <thead className="thead-light">
                <tr>
                  <th className="text-left p-[10px_15px] bg-[#428bca] text-white text-base">STT</th>
                  <th className="text-left p-[10px_15px] bg-[#428bca] text-white text-base">Email liên hệ</th>
                  <th className="text-left p-[10px_15px] bg-[#428bca] text-white text-base">Mã sản phẩm</th>
                  <th className="text-left p-[10px_15px] bg-[#428bca] text-white text-base">Tiêu chuẩn</th>
                  <th className="text-left p-[10px_15px] bg-[#428bca] text-white text-base">Loại quýt</th>
                  <th className="text-left p-[10px_15px] bg-[#428bca] text-white text-base">Giống quýt</th>
                  <th className="text-left p-[10px_15px] bg-[#428bca] text-white text-base">Trọng lượng</th>
                  <th className="text-left p-[10px_15px] bg-[#428bca] text-white text-base">Ngày sản xuất</th>
                  <th className="text-left p-[10px_15px] bg-[#428bca] text-white text-base">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .sort((a, b) => a[1].localeCompare(b[1]))
                  .map((product, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-[rgb(255, 250, 240)] transition-colors"
                    >
                      <td className="text-left text-sm p-2">{index + 1}</td>
                      <td className="text-left text-sm p-2">{product[1]}</td>
                      <td className="text-left text-sm p-2">{product[3]}</td>
                      <td className="text-left text-sm p-2">{product[6]}</td>
                      <td className="text-left text-sm p-2">{product[4]}</td>
                      <td className="text-left text-sm p-2">{product[5]}</td>
                      <td className="text-left text-sm p-2">{product[7]}</td>
                      <td className="text-left text-sm p-2">{product[8]}</td>
                      <td className="text-left text-sm p-2">
                        {parseInt(product[9]) === 0 ? (
                          isAdmin && (
                            <div className="button-group">
                              <button className="button-approve" onClick={() => handleApprove(product[3], product[0])} > 
                                Duyệt 
                              </button>
                              <button className="button-delete" onClick={() => handleDelete(product[3], product[0])} >
                                Xóa
                              </button>
                            </div>
                          )
                        ) : (
                          <span className="da-duyet">Đã duyệt</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default ViewProduct;
