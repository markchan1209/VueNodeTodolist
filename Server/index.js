'use strict';

require('dotenv').config();
const express = require('express');
const Sequelize = require('sequelize');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const redis = require("redis");
const client = redis.createClient();

let sessionStore;
if (process.env.REDIS_HOST) {
    const RedisStore = require('connect-redis')(session);
    sessionStore = new RedisStore({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        client: client
    });
}
const app = express();
const port = process.env.NODE_ENV === 'test' ? process.env.SERVER_PORT_TEST || 3001 : process.env.SERVER_PORT || 3000;
const apiPath = process.env.API_PATH + '/' + process.env.API_VERSION;
const util = require('./util/index');
const expressListRoutes = util.expressListRoutes;


// DB
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    timezone: '+08:00',
    logging: false
});

//test DB connection
sequelize.authenticate()
    .then(() => {
        console.log('Database ok.');
    })
    .catch(err => {
        console.error('Database fail.', err);
    });


app.all('*', function (req, res, next) {
    // 设置cors
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', 'true');  // 允许发送Cookie数据
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

if (util.isNotProdEnv()) {
    app.use(morgan('dev'));
}

app.use(session({
    store: sessionStore,
    secret: 'express-vue-admin',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(baseMiddleware.reply);

// 路由
// app.use(apiPath + '/', baseRouter);
// app.use(apiPath + '/admin', adminRouter);

app.use(baseMiddleware.notFound);
app.use(baseMiddleware.error);

app.listen(port, () => {
    console.log(`Server listening at - ${apiPath} : ${port}`);
});

module.exports = app;