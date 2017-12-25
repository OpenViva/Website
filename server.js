import express from "express";
import expressHandlebars from 'express-handlebars';
import * as webpackHelper from "./server/helpers/webpackHelper";

const app = express();
const hbs = expressHandlebars.create({});

if (process.env.NODE_ENV !== 'production') {
    console.log('DEVOLOPMENT ENVIRONMENT: Turning on WebPack Middleware...');
    webpackHelper.useWebpackMiddleware(app)
} else {
    console.log('PRODUCTION ENVIRONMENT');
    app.use('/js', express.static(__dirname + '/dist/js'))
}

app.use('static', express.static('static'));
app.use('/client.bundle.js', express.static('client.bundle.js'));
app.use('/style.bundle.css', express.static('style.bundle.css'));

app.use(require('./server/helpers/reactHelper').apiSubdomain);
app.use(require('./server/helpers/reactHelper').reactMiddleware);

app.use('/', require("./server/routes/index"));

app.listen(3000);