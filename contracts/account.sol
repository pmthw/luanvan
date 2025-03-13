
pragma solidity >=0.4.22 <0.9.0;

contract QuanLyUser {
    struct User {
        string username;
        string nonghoSX;
        string diaChi;
        string sdt;
        bytes32 passwordHash;
    }

    address public admin;
    mapping(string => User) public users; 
    string[] public userList; 

    event UserAdded(string indexed username);
    event UserRemoved(string indexed username);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);

    string public adminUsername; 
    bytes32 public adminPasswordHash;

    constructor() {
        admin = msg.sender; 
        adminUsername = "admin";
        adminPasswordHash = hashPassword("admin123");
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Chi admin moi duoc tao user!");
        _;
    }

    function hashPassword(string memory _password) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_password));
    }

    function addUser(
        string memory _username,
        string memory _nonghoSX,
        string memory _diaChi,
        string memory _sdt,
        string memory _password
    ) public onlyAdmin {
        require(bytes(users[_username].username).length == 0, "Username da ton tai!");

        users[_username] = User({
            username: _username,
            nonghoSX: _nonghoSX,
            diaChi: _diaChi,
            sdt: _sdt,
            passwordHash: hashPassword(_password)
        });

        userList.push(_username);
        emit UserAdded(_username);
    }

    function removeUser(string memory _username) public onlyAdmin {
        require(bytes(users[_username].username).length != 0, "User khong ton tai!");

        delete users[_username];

        for (uint i = 0; i < userList.length; i++) {
            if (keccak256(abi.encodePacked(userList[i])) == keccak256(abi.encodePacked(_username))) {
                userList[i] = userList[userList.length - 1]; // Đưa phần tử cuối vào vị trí đã xóa
                userList.pop(); // Xóa phần tử cuối
                break;
            }
        }
        emit UserRemoved(_username);
    }

    function getUser(string memory _username) public view returns (
        string memory nonghoSX,
        string memory diaChi,
        string memory sdt
    ) {
        User memory u = users[_username];
        return (u.nonghoSX, u.diaChi, u.sdt);
    }


    function getAllUsers() public view returns (string[] memory, string[] memory) {
        uint userCount = userList.length;
        string[] memory usernames = new string[](userCount);
        string[] memory nonghoSXs = new string[](userCount);

        for (uint i = 0; i < userCount; i++) {
            string memory username = userList[i];
            usernames[i] = username;
            nonghoSXs[i] = users[username].nonghoSX;
        }

        return (usernames, nonghoSXs);
    }

    function verifyUser(string memory _username, string memory _password) public view returns (bool) {
        User memory u = users[_username];
        require(bytes(u.username).length != 0, "User khong ton tai!");

        return u.passwordHash == hashPassword(_password);
    }

    function getUserByLogin(string memory _username, string memory _password) public view returns (
        string memory username,
        string memory nonghoSX,
        string memory diaChi,
        string memory sdt
    ) {
        require(verifyUser(_username, _password), "Thong tin dang nhap khong chinh xac!");

        User memory u = users[_username];
        return (u.username, u.nonghoSX, u.diaChi, u.sdt);
    }

    function verifyAdmin(string memory _username, string memory _password) public view returns (bool) {
        return (keccak256(abi.encodePacked(_username)) == keccak256(abi.encodePacked(adminUsername)) &&
                adminPasswordHash == hashPassword(_password));
    }

    function resetPassword(string memory _username, string memory _newPassword) public onlyAdmin {
        require(bytes(users[_username].username).length != 0, "User khong ton tai!");
        require(bytes(_newPassword).length > 0, "Mat khau khong duoc de trong!");

        // Cập nhật mật khẩu mới cho người dùng
        users[_username].passwordHash = hashPassword(_newPassword);
    }


    function changePassword(
        string memory _username,
        string memory _oldPassword,
        string memory _newPassword
    ) public {
        require(verifyUser(_username, _oldPassword), "Thong tin dang nhap khong chinh xac!");

        // Cập nhật mật khẩu mới
        users[_username].passwordHash = hashPassword(_newPassword);
    }

    function changeAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Dia chi admin moi khong hop le!");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }
}
