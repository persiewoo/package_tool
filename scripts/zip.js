/**
 * Created by Jacky on 2017/8/30.
 */

let utils  = require("./utils.js");
let zipper = require("zip-local");
let git    = require("./git");
let fs      = require('fs');

let zip = {};

zip.run = function () {
    // zipper.sync.zip(utils.BUILD_PATH).compress().save(utils.ZIP_PATH + 'client_' + utils.get_time_stamp() + '.zip');
    let zip_name = utils.query_pars.title + "_" + utils.query_pars.platform + "_01";
    fs.rename(utils.BUILD_PATH+"web-mobile", utils.BUILD_PATH+zip_name, function () {
        zipper.sync.zip(utils.BUILD_PATH).compress().save(utils.ZIP_PATH + zip_name + ".zip");
    });
};

module.exports = zip;