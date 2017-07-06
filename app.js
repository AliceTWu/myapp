import express from "express";
import db from "./mongodb/db";
import config from "./config/default";
import router from './routes/index.js'; 
import path from "path";
import http from "http";
import favicon from "static-favicon";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from 'express-session';
import connectMongo from "connect-mongo";
import history from 'connect-history-api-fallback';



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
/*app.use(logger('dev'));*/
/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded());*/
app.use(cookieParser());
/*app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);*/

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    store: new MongoStore({
        url: config.url
    })
}))

/// catch 404 and forwarding to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

router(app);
 
app.use(history());
//app.use(express.static('./public'));
app.use((err, req, res, next) => {
    res.status(404).send('未找到当前路由');
});

/*module.exports = app;*/
app.listen(config.port);
