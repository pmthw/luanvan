//xem hash khối trước đó
// const block = await web3.eth.getBlock(1); 
// console.log(`Hash của khối: ${block.hash}`);
// console.log(`Hash của khối trước: ${block.parentHash}`);

//lấy thông tin sản phẩm dựa vào hash
// const contract = await XacThucSanPham.deployed();
// let productHash = '0x...'; 
// let product = await contract.getProduct(productHash);
// console.log(product);


// let contract = await QuanLyUser.deployed();
// let userInfo = await contract.getUser("username");
// console.log(userInfo);
// let user = await contract.users("username");
// console.log(user.passwordHash);
// let isValid = await contract.verifyUser("username", "password123");
// console.log(isValid);  // True nếu mật khẩu chính xác, false nếu sai