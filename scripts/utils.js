let fs = require('fs');
let path = require('path');
let crypto = require('crypto');
let process = require('process');
let child_process = require('child_process');
let log4js = require('log4js');

let BUILD_LOG_PATH = __dirname + "/../build_log";

let utils = {};

utils.query_pars = {
    update_ver : 1,
    package_name : 'web-mobile',
    title : 'jlysr',
    platform : 'h5'
};

utils.PROJECT_PATH = __dirname + '/../../../../client/';
utils.BUILD_PATH = __dirname + '/../../../../client/build/web-mobile/';
utils.ZIP_PATH = __dirname + '/../../../../client/build/';

let is_utils_inited = false;
utils.init = function () {

    if (is_utils_inited){
        return;
    }

    this.query_pars.update_ver = parseInt(this.query_pars.update_ver);
    this.query_pars.package_name = this.query_pars.title + "_" + this.query_pars.platform + "";
    this.BUILD_PATH = __dirname + '/../../../../client/build/'+ this.query_pars.package_name + '/';

    /**
     * string.replaceAll
     * @param  {[type]} s1 [description]
     * @param  {[type]} s2 [description]
     * @return {[type]}    [description]
     */
    String.prototype.replaceAll  = function(s1, s2){
        return this.replace(new RegExp(s1,"gm"), s2);
    };

    /**
     * time_stamp
     */
    let fixed_time = function (num) {
        if (num <= 9) {
            return "0" + num;
        }else {
            return "" + num;
        }
    };
    let cur_time = new Date();
    this.time_stamp = fixed_time(cur_time.getFullYear()) + fixed_time((cur_time.getMonth() + 1)) + fixed_time(cur_time.getDate()) + fixed_time(cur_time.getHours()) + fixed_time(cur_time.getMinutes()) + fixed_time(cur_time.getSeconds());


    /**
     * log4js
     */
    let log_file_name = BUILD_LOG_PATH + '/build_log_' + this.time_stamp + ".log";
    if (!fs.existsSync(BUILD_LOG_PATH)) {
        fs.mkdirSync(BUILD_LOG_PATH);
    }
    fs.closeSync(fs.openSync(log_file_name, 'w'));
    log4js.configure({
        appenders: [
            { type: 'console' },
            { type: 'file', filename: log_file_name, category: "build_log"}
        ]
    });
};

utils.info = function (msg) {
    return log4js.getLogger("build_log").info(msg);
};

utils.warn = function (msg) {
    return log4js.getLogger("build_log").warn(msg);
};

utils.error = function (msg) {
    return log4js.getLogger("build_log").error(msg);
};

/**
 * 遍历文件目录
 * @param  {[type]} dir      [description]
 * @param  {[type]} file_list [description]
 * @return {[type]}          [description]
 */
utils.walk = function(dir, file_list) {
    let files = fs.readdirSync(dir);
    file_list = file_list || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            file_list = utils.walk(dir + file + '/', file_list);
        }
        else {
            file_list.push(path.resolve(dir, file));
        }
    });
    return file_list;
};

/**
 * 遍历目录下文件数量
 * @param dir_name
 */
utils.get_folder_files_count =  function (dir_name) {
    let walk_folder = function(dir) {
        let results = [];
        let list = fs.readdirSync(dir);
        list.forEach(function(file) {
            file = dir + '/' + file;
            let stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                results = results.concat(walk_folder(file));
            }else {
                results.push(file)
            }
        });
        return results;
    };
    return walk_folder(dir_name).length;
};

/**
 * 获取文件MD5
 * @param  {[type]} str       [description]
 * @param  {[type]} algorithm [description]
 * @param  {[type]} encoding  [description]
 * @return {[type]}           [description]
 */
utils.checksum = function(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
};

utils.get_md5_sum = function(str, algorithm, encoding) {
    return this.checksum(str, algorithm, encoding).substring(0,6);
};

/**
 * 获取时间戳
 */
utils.get_time_stamp = function() {
    return this.time_stamp;
};

/**
 * 文件相关操作
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
utils.delete_file = function(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
};

utils.copy_file = function(src_file, dst_file) {
    this.delete_file(dst_file);
    fs.writeFileSync(dst_file, fs.readFileSync(src_file, 'utf-8'), 'utf-8');
};

utils.delete_folder = function(path) {
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index){
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                utils.delete_folder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

/**
 * 获取resources文件及中符合后缀的文件列表
 * @param  {[type]} dir      [description]
 * @param  {[type]} process_file_ext [description]
 * @return {[type]}          [description]
 */
utils.get_ext_file_list = function(dir, file_list, process_file_ext) {
    let files = fs.readdirSync(dir);
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            file_list = utils.get_ext_file_list(dir + file + "/", file_list, process_file_ext);
        }
        else {
            let ext_name = file.substring(file.lastIndexOf(".") + 1, file.length);
            let is_process_file = false;
            for (let i = 0; i < process_file_ext.length; i++) {
                if (process_file_ext[i] === ext_name) {
                    is_process_file = true;
                    break;
                }
            }
            if (is_process_file) {
                file_list.push(dir + file);
            }
        }
    });
    return file_list;
};

module.exports = utils;