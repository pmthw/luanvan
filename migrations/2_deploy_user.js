const QuanLyUser = artifacts.require("QuanLyUser");

module.exports = function (deployer) {
  deployer.deploy(QuanLyUser); // Không truyền tham số nếu constructor không yêu cầu
};
