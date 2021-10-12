"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
// import * as mongoose from 'mongoose';
var mongoose_1 = __importDefault(require("mongoose"));
var https = __importStar(require("https"));
var fs_1 = require("fs");
var path_1 = require("path");
var passport_1 = __importDefault(require("passport"));
var routes_1 = __importDefault(require("./routes"));
var seed_1 = require("./utils/seed");
var app = (0, express_1.default)();
// Bodyparser Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
require('./services/jwtStrategy');
require('./services/localStrategy');
var isProduction = process.env.NODE_ENV === 'production';
// DB Config
var dbConnection = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;
// Connect to Mongo
mongoose_1.default
    .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
    .then(function () {
    console.log('MongoDB Connected...');
    (0, seed_1.seedDb)();
})
    .catch(function (err) { return console.log(err); });
// Use Routes
app.use('/', routes_1.default);
app.use('/public', express_1.default.static((0, path_1.join)(__dirname, '../public')));
// Serve static assets if in production
if (isProduction) {
    // Set static folder
    app.use(express_1.default.static((0, path_1.join)(__dirname, '../../client/build')));
    app.get('*', function (req, res) {
        res.sendFile((0, path_1.resolve)(__dirname, '../..', 'client', 'build', 'index.html')); // index is in /server/src so 2 folders up
    });
    var port_1 = process.env.PORT || 80;
    app.listen(port_1, function () { return console.log("Server started on port " + port_1); });
}
else {
    var port_2 = process.env.PORT || 5000;
    var httpsOptions = {
        key: (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, '../security/cert.key')),
        cert: (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, '../security/cert.pem')),
    };
    var server = https.createServer(httpsOptions, app).listen(port_2, function () {
        console.log('https server running at ' + port_2);
        // console.log(all_routes(app));
    });
}
