// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract XacThucSanPham {
    enum TrangThai {
        PENDING,
        APPROVED
    }
    struct Product {
        string nonghoSX;
        string username;
        string diaChi;
        string maSanPham;
        string loai;
        string giong;
        string tieuChuan;
        string trongLuong;
        string ngayThuHoach;
        TrangThai trangThai; 
    }

    mapping(bytes32 => Product) public products;
    bytes32[] public productHashes;

    address public admin;

    event ProductAdded(
        bytes32 productHash,
        string maSanPham,
        string nonghoSX,
        TrangThai trangThai
    );
    event ProductApproved(bytes32 productHash);
    event ProductDeleted(bytes32 productHash);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Chi admin moi co quyen thuc hien!");
        _;
    }

    function addProduct(
        string memory nonghoSX,
        string memory username,
        string memory diaChi,
        string memory maSanPham,
        string memory loai,
        string memory giong,
        string memory tieuChuan,
        string memory trongLuong,
        string memory ngayThuHoach
    ) public {
        bytes32 productHash = keccak256(abi.encodePacked(maSanPham, nonghoSX));
        require(
            bytes(products[productHash].maSanPham).length == 0, 
            "San pham da ton tai!"
        );
        
        products[productHash] = Product(
            nonghoSX,
            username,
            diaChi,
            maSanPham,
            loai,
            giong,
            tieuChuan,
            trongLuong,
            ngayThuHoach,
            TrangThai.PENDING
        );

        productHashes.push(productHash);
        emit ProductAdded(productHash, maSanPham, nonghoSX, TrangThai.PENDING);
    }

    function approveProduct(bytes32 productHash) public onlyAdmin {
        require(
            products[productHash].trangThai == TrangThai.PENDING, 
            "San pham khong o trang thai cho duyet!"
        );
        products[productHash].trangThai = TrangThai.APPROVED;
        emit ProductApproved(productHash);
    }

    function deleteProduct(bytes32 productHash) public onlyAdmin {
        require(
            products[productHash].trangThai == TrangThai.PENDING, 
            "Chi co the xoa san pham o trang thai PENDING!"
        );
        delete products[productHash];
        
        for (uint i = 0; i < productHashes.length; i++) {
            if (productHashes[i] == productHash) {
                productHashes[i] = productHashes[productHashes.length - 1];
                productHashes.pop();
                break;
            }
        }
        emit ProductDeleted(productHash);
    }

    function getProduct(bytes32 productHash) public view returns (
        string memory, string memory, string memory, string memory, string memory,
        string memory, string memory, string memory, string memory, TrangThai
    ) {
        Product memory p = products[productHash];
        return (
            p.nonghoSX,
            p.username,
            p.diaChi,
            p.maSanPham,
            p.loai,
            p.giong,
            p.tieuChuan,
            p.trongLuong,
            p.ngayThuHoach,
            p.trangThai
        );
    }

    function getProductsByNongHoSX(string memory _nonghoSX) public view returns (
        bytes32[] memory,
        Product[] memory
    ) {
        uint count = 0;
        for (uint i = 0; i < productHashes.length; i++) {
            if (
                keccak256(abi.encodePacked(products[productHashes[i]].nonghoSX)) 
                == keccak256(abi.encodePacked(_nonghoSX))
            ) {
                count++;
            }
        }

        bytes32[] memory productHashList = new bytes32[](count);
        Product[] memory productList = new Product[](count);
        uint index = 0;

        for (uint i = 0; i < productHashes.length; i++) {
            if (
                keccak256(abi.encodePacked(products[productHashes[i]].nonghoSX)) 
                == keccak256(abi.encodePacked(_nonghoSX))
            ) {
                productHashList[index] = productHashes[i];
                productList[index] = products[productHashes[i]];
                index++;
            }
        }
        return (productHashList, productList);
    }

    function getProductsAwait() public view returns (
        bytes32[] memory,
        Product[] memory
    ) {
        uint count = 0;
        for (uint i = 0; i < productHashes.length; i++) {
            if (products[productHashes[i]].trangThai == TrangThai.PENDING) {
                count++;
            }
        }

        bytes32[] memory productHashList = new bytes32[](count);
        Product[] memory productList = new Product[](count);
        uint index = 0;

        for (uint i = 0; i < productHashes.length; i++) {
            if (products[productHashes[i]].trangThai == TrangThai.PENDING) {
                productHashList[index] = productHashes[i];
                productList[index] = products[productHashes[i]];
                index++;
            }
        }
        return (productHashList, productList);
    }

    function getProductHashes() public view returns (bytes32[] memory) {
        return productHashes;
    }
}
