
const REGULAR_CODE = {}

//用户名是否有效（6-15位的大小写字母、数字、下划线、星号）
REGULAR_CODE.USERNAME_VALID = /^[a-zA-Z0-9*_]{6,15}$/;
//密码是否有效（6-15位的大小写字母、数字、下划线、星号）
REGULAR_CODE.PASSWORD_VALID = /^[a-zA-Z0-9*_]{6,15}$/;
//游戏名字是否有效（2-6位的汉字、大小写字母、数字）
REGULAR_CODE.GAMENAME_VALID = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,6}$/;

module.exports = REGULAR_CODE;