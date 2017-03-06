'use strict';

const fs = require('fs');

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
