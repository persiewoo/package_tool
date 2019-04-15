let child_process   = require('child_process');
let utils           = require('./utils.js');

let build = {};

/**
 * 调用creator进行项目构建
 */
build.run = function (project_path, finish_cb, success_cb, failure_cb) {
    let msg = "";
    let execute_cmd = 'CocosCreator.exe --path ' +  project_path + ' --build platform=web-mobile;buildPath=build/'+utils.query_pars.package_name;
    let child = child_process.exec(execute_cmd, {maxBuffer: 1024 * 100000}, (err, stdout, stderr)=> {
        if (err) {
            utils.error(err.stack);
            utils.error("错误代码：" + err.code);
            utils.error(stderr);
            utils.error('=======>Cocos Creator打包失败1');
            msg += "=======>Cocos Creator打包失败1";
            failure_cb && failure_cb();
        }else {
            // utils.info(stdout);
            if (stdout.includes('Generating html')) {
                utils.info('=======>Cocos Creator打包成功');
                msg += "=======>Cocos Creator打包成功";
                success_cb && success_cb();
            }else {
                utils.error('=======>Cocos Creator打包失败');
                msg += "=======>Cocos Creator打包失败";
                failure_cb && failure_cb();
            }
        }
        finish_cb && finish_cb(msg);
    });
    child.stdout.on('data', function (data) {
        let data_str = data.toString();
        utils.info(data_str);
    });
};

module.exports = build;