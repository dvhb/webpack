'use strict';

class DvhbWebpackError extends Error {
    constructor(message) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'DvhbWebpackError';
        this.message = message;
    }
}

module.exports = DvhbWebpackError;
