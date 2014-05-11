var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    Lara = exports = {};

global.Lara = Lara;
Lara.app = express();
Lara.models = {};
Lara.controllers = {};
Lara.middlewares = {};



function existsSyncFolder(folder) {
    return fs.existsSync(folder) && fs.lstatSync(folder).isDirectory();
};

function existsSyncFile(file) {
    return fs.existsSync(file) && fs.lstatSync(file).isFile();
};


function loadJS(file, callback) {

    if (file.indexOf('.js') && existsSyncFile(file)) {
        var obj = require(file);
        if (typeof callback !== typeof undefined)
            callback(obj, path.basename(file, '.js'));
    }
};

function loadJSFromDirectory(folder, callback) {

    if (existsSyncFolder(folder)) {

        fs.readdirSync(folder).forEach(function(name) {

            if (name.indexOf('.js')) {
                var urlFile = path.resolve(folder, name);
                var obj = require(urlFile);
                if (typeof callback !== typeof undefined)
                    callback(obj, path.basename(urlFile, '.js'));
            }

        });
    }
};

Lara.start = function(base) {
    Lara.appPath = typeof base === typeof undefined ? path.resolve(__dirname, './../../../app/') : base;



    loadJSFromDirectory(path.resolve(Lara.appPath, './config'));


    loadJSFromDirectory(path.resolve(Lara.appPath, './controllers'), function(ctrl, name) {

        if (ctrl.hasOwnProperty('name'))
            Lara.controllers[ctrl.name] = ctrl;
        else
            Lara.controllers[name] = ctrl;
    });

    loadJSFromDirectory(path.resolve(Lara.appPath, './models'), function(model, name) {
        if (model.hasOwnProperty('name'))
            Lara.models[model.name] = model;
        else
            Lara.models[name] = model;
    });



    loadJSFromDirectory(path.resolve(Lara.appPath, './middlewares'), function(middleware, name) {
        if (middleware.hasOwnProperty('name'))
            Lara.middlewares[middleware.name] = middleware;
        else
            Lara.middlewares[name] = middleware;
    });

    loadJS(path.resolve(Lara.appPath, './filters.js'));
    loadJS(path.resolve(Lara.appPath, './routes.js'));
    loadJS(path.resolve(Lara.appPath, './start.js'));
}



Lara.config = function(key, value) {
    var val = Lara.app.get(key);
    return typeof val !== typeof undefined ? val : value;
}