'use strict';

// 基礎中間件

const _ = require('lodash');

// 共用接口返回值(中間件)
// 成功:
// {
//   code: 0,
//   message: 'success',
//   data: {}/[{}]
// }
// 異常:
// {
//   code: 1,
//   message: 'reason'
// }
function reply(req, res, next) {
    function _reply(data) {
        if (data && typeof data.then === 'function') {
            _replyPromise(data);
        } else {
            _replyObj(data);
        }
    }

    function _replyPromise(promise) {
        promise.then((result) => {
            _replyObj(result);
        }).catch((err) => {
            _replyError(err);
        });
    }

    function _replyObj(data) {
        data = data || {};
        res.json({
            code: 0,
            message: 'success',
            data: data
        });
    }

    function _replyError(err) {
        err = err || {};

        console.error('Error', err);

        let message = err.message || err;
        let status = err.status || 400;

        // process joi error
        if (err.details && err.details.length) {
            message = _.reduce(err.details, (result, detail) => {
                if (result) {
                    result += '; ';
                }
                return result + detail.message;
            }, '');
        } else if (err.errors && err.errors.length) {
            message = err.errors[0].message;
        }

        res.status(status).json({
            code: err.code || 1,
            message: message || err || 'Unknown error'
        });
    }

    res.reply = _reply;
    res.replyError = _replyError;

    next();
}

// 404
function notFound(req, res) {
    res.status(404).end('Not found!');
}

// 共用錯誤處理
function error(err, req, res, next) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') {
        res.status(err.status || 500).json({ code: 1, message: 'Internal error!' });
    } else {
        res.status(err.status || 500);
        res.json({
            code: 1,
            message: err.message
        });
    }
}

module.exports = {
    reply: reply,
    notFound: notFound,
    error: error
};
