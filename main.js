#!/usr/bin/env node

let process     = require('process');
let fs          = require('fs');
let commander   = require('commander');
let http = require('http');

let utils           = require('./scripts/utils.js');
let build           = require('./scripts/build.js');
let post_process     = require('./scripts/post_process.js');
let upload          = require('./scripts/upload.js');
let git             = require('./scripts/git');
let zip             = require('./scripts/zip');

let ip_arr = {
    "172.18.50.16":"吴滨",
    "172.18.50.201":"佳楠",
    "172.18.50.31":"雯婷",
    "172.18.50.33":"徐昊",
    "172.18.80.248":"吴滨",
    "172.18.80.196":"吴滨",
    "127.0.0.1":"吴滨",
   "172.18.50.18":"东平"
}

//获取url请求客户端ip
let get_client_ip = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0];
    }
    return ip;
};

let op_info = {
    is_doing : false,
    name : "",
};

let main = function (_cb) {

    let msg = "";
    utils.init();

    utils.delete_folder(utils.BUILD_PATH);
    utils.info("=======>删除 build 目录 " + utils.query_pars.package_name);

    commander
        .version('0.0.1')
        .option('-f, --ftp <n>', '0：不上传ftp，1：上传ftp，默认上传', 0)
        .option('-z, --zip <n>', '0：不打zip，1：打zip，默认不打zip', 0)
        .option('-c, --config <s>', 'config文件名', 'config_default.json')
        .parse(process.argv);

    let is_upload = parseInt(commander.ftp);
    let is_zip = parseInt(commander.zip);
    let config_file = commander.config;

    //如果需要上传ftp，需进行配置
    let ftp_config = JSON.parse(fs.readFileSync(__dirname + '/ftp.json'));
    if (is_upload && !ftp_config) {
        utils.error("没有配置 ftp 信息");
        _cb && _cb("没有配置 ftp 信息");
        return;
    }
    if (ftp_config) {
        ftp_config.localRoot = utils.BUILD_PATH;
    }

    let git_config = JSON.parse(fs.readFileSync(__dirname + '/git.json'));
    if (!git_config) {
        utils.error("没有配置 git 信息");
        _cb && _cb("没有配置 git 信息");
        return;
    }

    git.run(utils.PROJECT_PATH, git_config,
        (_msg)=> {
            //success
            msg += _msg;
            post_process.run(config_file, (_msg)=>{
                msg += _msg;
                build.run(utils.PROJECT_PATH,
                    (_msg)=> {
                        //finish
                        msg += _msg;
                        utils.info(">>>>>>>>>>>>" + op_info.name + "执行"+utils.query_pars.title + "_" + utils.query_pars.platform+"成功");
                        msg += "\n>>>>>>>>>>>>" + op_info.name + "执行"+utils.query_pars.title + "_" + utils.query_pars.platform+"成功";
                        _cb & _cb(msg);
                    },
                    (_msg)=> {
                        //success
                        // post_process.run(config_file);
                        if (is_zip) {
                            zip.run();
                        }
                        if (is_upload) {
                            upload.init(utils.BUILD_PATH, ftp_config);
                            upload.run(
                                () => {
                                    //success
                                },
                                () => {
                                    //failure
                                }
                            );
                        }
                    },
                    (_msg)=> {
                        //failure
                    }
                );
            });
        },
        (_msg)=> {
            //failure
            msg += _msg;
            utils.info(">>>>>>>>>>>>" + op_info.name + "执行失败");
            msg += "\n>>>>>>>>>>>>" + op_info.name + "执行失败";
            _cb & _cb(msg);
        });
};

utils.init();

let fn_request = function (request, response) {
    if(request.url === "/favicon.ico"){
        return;
    }
    let par_str = request.url.split("?")[1];
    if(par_str){
        let par_arr = par_str.split("&");
        for(let i=0; i < par_arr.length; i++){
            let pars = par_arr[i].split("=");
            utils.query_pars[pars[0]]=pars[1];
        }
    }
    let msg = "";

    let send_msg = function (_txt){
        response.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        response.end(_txt || msg);
    };

    let ip_ad = get_client_ip(request);

    let op_name = ip_arr[ip_ad];

    if(!op_name){
        send_msg(ip_ad + "未在白名单！");
        utils.error(ip_ad+"未定义");
        return;
    }

    utils.info(op_name+"----->");

    if(op_info.is_doing){
        send_msg(op_info.name + "正在操作，请稍后再试！");
        utils.info(op_name +" 排队");
        return;
    }
    op_info.is_doing =  true;
    op_info.name = op_name;

    main(function (_msg) {
        msg += _msg;
        op_info.is_doing = false;
        send_msg(msg);
    });
};

http.createServer(fn_request).listen(10086,'172.18.50.14');

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:10086/');
// console.log('Server running at http://127.0.0.1:10087/ H5包');

// main();