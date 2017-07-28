'use strict';

const fs = require('fs');
const path = require('path');
const ip = require('ip');

module.exports.isDirectoryExists = function (dir) {
    try {
        const stats = fs.lstatSync(dir);
        if (stats.isDirectory()) {
            return true;
        }
    }
    finally {
        /* */
    }
    return false;
};

module.exports.isFileExists = function (file) {
    return fs.existsSync(file);
};

module.exports.isGitExists = function (gitDir) {
    return fs.existsSync(path.resolve(gitDir, '.git'));
};

module.exports.getNetworkIp = function () {
    try {
        const ipAddress = ip.address();
        return ipAddress
    } catch (err) {
        return null
    }
};

module.exports.getProjectLogo = function () {
    return [
        "     _       _     _                       _                      _    ",
        "  __| |_   _| |__ | |__      __      _____| |__  _ __   __ _  ___| | __",
        " / _` \\ \\ / / '_ \\| '_ \\ ____\\ \\ /\\ / / _ \\ '_ \\| '_ \\ / _` |/ __| |/ /",
        "| (_| |\\ V /| | | | |_) |_____\\ V  V /  __/ |_) | |_) | (_| | (__|   <",
        " \\__,_| \\_/ |_| |_|_.__/       \\_/\\_/ \\___|_.__/| .__/ \\__,_|\\___|_|\\_\\",
        "                                                |_|                    "

    ].join('\n')
};
