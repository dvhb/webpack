'use strict';

const fs = require('fs');
const path = require('path');

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
