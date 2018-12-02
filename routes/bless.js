var express = require('express');
var router = express.Router();
//加载mysql模块
var mysql = require('mysql');
var URL = require('url');
//创建连接
var connection = mysql.createConnection({
    host: 'daodaop.mysql.polardb.rds.aliyuncs.com',
    user: 'daodao',
    password: 'HpU!^qkyVvG7tft',
    database: 'wedding'
});
//执行创建连接
connection.connect();

// 获取祝福
router.post('/getBless', function (req, res, next) {
    var sql = "select name,create_time,text from bless order by id desc";
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        res.jsonp(result);
        console.log(result);
    });
});

// 提交祝福
router.post('/commitBless', function (req, res, next) {
    //解析请求参数
    var params = URL.parse(req.url, true).query;
    // 查询宾客是否已存在
    var queryGuestSql = "select * from guest where name=?";
    connection.query(queryGuestSql, [params.name], function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        var ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/);
        ip = ip ? ip.join('.') : null;
        if (result.length == 0) {
            // 没有宾客信息，先插入宾客信息
            addGuest(params, ip, addBless,
                function (ret) {
                    res.jsonp(ret);
                }
            );
        } else {
            // 修改宾客信息
            updateGuest(params, ip, addBless,
                function (ret) {
                    res.jsonp(ret);
                }
            )
            ;
        }
    });
});

var addGuest = function (params, ip, addBlessFunction, addBlessSuccess) {
    // 插入宾客信息
    var addGuestSql = "INSERT INTO guest SET name = ?, phone = ?, num = ?, ip = ?";
    var sqlParams = [params.name, params.phone, params.num, ip];
    connection.query(addGuestSql, sqlParams, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        addBlessFunction(params, addBlessSuccess);
    });
}

var updateGuest = function (params, ip, addBlessFunction, addBlessSuccess) {
    // 更新宾客信息
    var updateGuestSql = "UPDATE guest SET name = ?,phone = ?,num = ?,ip = ?";
    var sqlParams = [params.name, params.phone, params.num, ip];
    connection.query(updateGuestSql, sqlParams, function (err, result) {
        if (err) {
            console.log('[UPDATE ERROR] - ', err.message);
            return;
        }
        addBlessFunction(params, addBlessSuccess);
    });
}

var addBless = function (params, addBlessSuccess) {
    var ret = {};
    if (params.text == '' || params.text == undefined) {
        ret.success = true;
        addBlessSuccess(ret);
        return;
    }
    // 插入祝福信息
    var sql = "INSERT INTO bless SET name = ?,text = ?,create_time = ?";
    var now = new Date().toLocaleString();
    var sqlParams = [params.name, params.text, now];
    connection.query(sql, sqlParams, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        ret.success = true;
        addBlessSuccess(ret);
    });
}

var getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
};

module.exports = router;
