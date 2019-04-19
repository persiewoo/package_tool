/**
 * Created by xianbei on 18/5/5.
 * */

let config = {};

/**
 * 是否是打包模式
 */
config.BUILD_MODE = false;

/**
 * 是否是调试模式
 */
config.DEV_MODE = false;

config.GUIDE_MODE = false;

CC_DEBUG = false;

/**
 * 0 微端
 * 1 H5
 */
config.RUN_CLIENT = 0;

config.ckOrigin = 'http://wenrj.ck-dev.haifurong.cn';
config.pyOrigin = 'http://139.196.157.72:8888/jlysr_02';

config.SERVER_LINE= "http://pyrt-h5.qudah5.com/Lines_h5/Lines.aspx";
config.QUERY_MODE = "zsdat";
config.QUERY_DATA = "utils.Encrypt(utils.zip(query_data))";
config.RESPONSE_DATA = "utils.unzip(utils.Decrypt(response))";
config.XIANBEI = CryptoJS.enc.Utf8.parse("v&tXOg]l-Vl/7J^A");  //十六位十六进制数作为密钥
config.WOOD = CryptoJS.enc.Utf8.parse("A@2a}5vhlMu=69W[");   //十六位十六进制数作为密钥偏移量

cc.game.setFrameRate(30);

module.exports = config;