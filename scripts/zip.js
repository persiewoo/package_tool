/**
 * Created by Jacky on 2017/8/30.
 */

let utils  = require("./utils.js");
let zipper = require("zip-local");
let git    = require("./git");

let zip = {};

zip.run = function () {
    // zipper.sync.zip(utils.BUILD_PATH).compress().save(utils.ZIP_PATH + 'client_' + utils.get_time_stamp() + '.zip');
    zipper.sync.zip(utils.BUILD_PATH).compress().save(utils.ZIP_PATH + 'client.' + git.game_version + '.zip');
};

module.exports = zip;