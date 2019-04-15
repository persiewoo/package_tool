let child_process   = require('child_process');
let utils           = require('./utils.js');
let fs              = require('fs');

let ver_file_path   = utils.PROJECT_PATH + 'assets/script/util/ver.js';

let git  = {};

git.game_version = "0.0.0";

/**
 * 调用creator进行项目构建
 */
git.run = function (project_path, git_config, success_cb, failure_cb) {
    
    let msg = "";

    let execute_git_get_branch_name_cmd = `git rev-parse --abbrev-ref HEAD`;
    child_process.exec(execute_git_get_branch_name_cmd, (err, stdout, stderr) => {
        if (err) {
            utils.error(stderr);
            utils.error('=======>获取 git 分支名失败');
            msg += '=======>获取 git 分支名失败';
            failure_cb && failure_cb(msg);
        }else {
            utils.info(stdout);
            git_config.remote_branch = stdout;
            let execute_git_pull_cmd = `cd ${utils.PROJECT_PATH} && git pull ${git_config.remote_url} ${git_config.remote_branch}`;
            console.log(execute_git_pull_cmd)
            child_process.exec(execute_git_pull_cmd, (err, stdout, stderr) => {
                if (err) {
                    utils.error(stderr);
                    utils.error('=======>从 git 上更新代码失败');
                    msg += '=======>从 git 上更新代码失败';
                    failure_cb && failure_cb();
                } else {
                    msg += stdout.toString();
                    utils.info(stdout);
                    msg += '=======>从 git 上更新代码成功\n';
                    utils.info('=======>从 git 上更新代码成功');

                    if(utils.query_pars.update_ver){
                        let version = require('../../../../client/assets/script/util/ver').VERSION;
                        if(utils.query_pars.version){
                            version = utils.query_pars.version;
                            console.log("===="+version)
                        }
                        else{
                            version = version.substring(0, version.lastIndexOf('.') + 1) + (parseInt(version.substring(version.lastIndexOf('.') + 1, version.length)) + 1);
                            console.log("----"+version)
                            utils.query_pars.version = version;
                        }
                        git.game_version = version;
                        let version_text = `var ver = {};\nver.VERSION= "${version}";\n\nmodule.exports = ver;`;

                        fs.writeFileSync(ver_file_path, version_text, 'utf-8');
                        msg += `=======>修改版本号完成，当前版本号是v${version}\n`;
                        utils.info(`=======>修改版本号完成，当前版本号是v${version}`);
                        delete require.cache[require.resolve('../../../../client/assets/script/util/ver')];

                        let execute_git_push_cmd = `git add ${ver_file_path} && git commit -m "update version" && git push ${git_config.remote_url} ${git_config.remote_branch}`;
                        child_process.exec(execute_git_push_cmd, (err, stdout, stderr) => {
                            if (err) {
                                utils.error(stderr);
                                msg += '=======>版本号提交 git 失败\n';
                                utils.error('=======>版本号提交 git 失败');
                                failure_cb && failure_cb();
                            } else {
                                utils.info(stdout);
                                msg += '=======>版本号提交 git 成功\n';
                                utils.info('=======>版本号提交 git 成功');
                                success_cb && success_cb(msg);
                            }
                        });
                    }
                    else{
                        msg += `=======>保持当前版本号\n`;
                        utils.info(`=======>保持当前版本号`);
                        success_cb && success_cb(msg);
                    }



                }
            });
        }
    });
};

module.exports = git;