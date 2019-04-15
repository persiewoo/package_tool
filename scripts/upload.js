let FtpDeploy   = require('ftp-deploy');
let Progress    = require('progress');

let utils       = require("./utils.js");

let upload = {};

upload.init = function (upload_dir, config) {
    let files_count = utils.get_folder_files_count(upload_dir);
    utils.info("=======>上传文件总数为" + files_count + "个");

    this.bar = new Progress("上传至FTP中 [:bar] :percent :etas", {
        complete: "=",
        incomplete: " ",
        width: 50,
        total: files_count
    });

    this.ftpDeploy = new FtpDeploy();
    this.config = config;
};

/**
 * 上传至FTP
 * @return {[type]} [description]
 */
upload.run = function (success_cb, failure_cb) {
    this.ftpDeploy.deploy(this.config, (err) => {
        if (err) {
            utils.info(err);
            utils.error("=======>上传至FTP失败，请重试");
            failure_cb && failure_cb();
        }else{
            this.bar.tick();
            utils.info("=======>上传至FTP成功");
            success_cb && success_cb();
        }
    });

    this.ftpDeploy.on("uploading", (data) => {
        // data.totalFileCount;       // total file count being transferred
        // data.transferredFileCount; // number of files transferred
        // data.percentComplete;      // percent as a number 1 - 100
        // data.filename;             // partial path with filename being uploaded
        // utils.info(data);
    });

    this.ftpDeploy.on("uploaded", (data) => {
        // utils.info(data);         // same data as uploading event
        this.bar.tick();
    });

    this.ftpDeploy.on("upload-error", (data) => {
        // utils.error(JSON.stringify(data, null, 4)); // data will also include filename, relativePath, and other goodies
        // utils.error(data.filename + " 传输失败，进行断点续传");
    });

    this.ftpDeploy.on("error", (data) => {
        // utils.error(JSON.stringify(data, null, 4)); // data will also include filename, relativePath, and other goodies
    });
};

module.exports = upload;