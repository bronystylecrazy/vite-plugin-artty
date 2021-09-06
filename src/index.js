"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var artty_transform_jsx_1 = require("./artty-transform-jsx");
function viteArtty() {
    console.clear();
    return {
        name: "vite-artty",
        transform: function (code, id) {
            if (path_1["default"].relative(__dirname, id).split('\\')[1] !== 'src')
                return;
            if (!['.js', '.jsx'].includes(path_1["default"].extname(id)))
                return;
            var transformed = artty_transform_jsx_1["default"](code);
            var writeTo = path_1["default"].join('./transformed/', path_1["default"].relative(__dirname, id).replace('..\\', ''));
            // console.log('path---->',writeTo.substring(0, writeTo.lastIndexOf("\\")));
            fs_1["default"].mkdirSync(writeTo.substring(0, writeTo.lastIndexOf("\\")), { recursive: true });
            fs_1["default"].writeFileSync(writeTo, transformed === null || transformed === void 0 ? void 0 : transformed.code, 'utf-8');
            return transformed;
        }
    };
}
exports["default"] = viteArtty;
