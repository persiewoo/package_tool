/**
 * Created by xianbei on 19/4/13.
 */
let fs      = require('fs');
let process = require('process');
let readDir = require('readDir');
let utils   = require('./utils.js');

let post_process = {};

/**
 * 拷贝config.js
 */
post_process.copy_config_js = function (){
    let src_file = fs.readFileSync(__dirname + '/../config/configjs/' + utils.query_pars.platform + "/config.js", 'utf-8');
    let dst_file = utils.PROJECT_PATH + 'assets/script/util/config.js';
    fs.writeFileSync(dst_file, src_file,  'utf-8');
    utils.info(`=======>拷贝 ${utils.query_pars.platform} config.js 文件`);
    return `=======>拷贝 ${utils.query_pars.platform} config.js 文件 \n`;
};

/**
 * 拷贝图片资源
 */
post_process.copy_img = function (){
    let file_list = readDir.readSync(__dirname + '/../config/img/' + utils.query_pars.title + '/', ['login_title.png'], readDir.ABSOLUTE_PATHS);
    let src_file = file_list[0];
    // let src_file = fs.readFileSync(__dirname + '/../config/img/' + utils.query_pars.title + "/login_title.png");
    let dst_file = utils.PROJECT_PATH + 'assets/texture/login/login_title.png';
    fs.createReadStream(src_file).pipe(fs.createWriteStream(dst_file));
    utils.info(`=======>拷贝 ${utils.query_pars.title} 图像文件`);
    return `=======>拷贝 ${utils.query_pars.title} 图像文件 \n`;
};

// # /**
//  #  * 处理splash文件和favicon文件
//  #  * @return {[type]} [description]
//  #  */
// # post_process.process_splash_file = function() {
//     #     //splash
//     #     let file_list = readDir.readSync(utils.BUILD_PATH, ['splash*.*'], readDir.ABSOLUTE_PATHS);
//     #     let splash_png_path = file_list[0];
//     #     fs.createReadStream(new_splash_png_path).pipe(fs.createWriteStream(splash_png_path));
//     #     //favicon
//     #     fs.createReadStream(new_favicon_ico_path).pipe(fs.createWriteStream(favicon_ico_path));
//     #     utils.info("=======>处理 splash & favicon 文件");
//     # };


/**
 * 拷贝文件
 * @return {[type]} [description]
 */
post_process.run = function (config_file,_cb) {
    // let _config = JSON.parse(fs.readFileSync(__dirname + '/../config/' + config_file));
    let msg = "";
    msg += this.copy_config_js();
    msg += this.copy_img();
    msg += "=======>打包前期处理工作完成 \n";
    utils.info("=======>打包后期处理工作完成");
    _cb && _cb(msg);
};

module.exports = post_process;