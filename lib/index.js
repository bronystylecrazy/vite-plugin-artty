"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const artty_transform_jsx_1 = __importDefault(require("./artty-transform-jsx"));
function viteArtty() {
    console.clear();
    return {
        name: "vite-artty",
        transform(code, id) {
            if (path_1.default.relative(__dirname, id).split('\\')[1] !== 'src')
                return;
            if (!['.js', '.jsx'].includes(path_1.default.extname(id)))
                return;
            let transformed = artty_transform_jsx_1.default(code);
            let writeTo = path_1.default.join('./transformed/', path_1.default.relative(__dirname, id).replace('..\\', ''));
            // console.log('path---->',writeTo.substring(0, writeTo.lastIndexOf("\\")));
            fs_1.default.mkdirSync(writeTo.substring(0, writeTo.lastIndexOf("\\")), { recursive: true });
            fs_1.default.writeFileSync(writeTo, transformed?.code, 'utf-8');
            return transformed;
        },
    };
}
exports.default = viteArtty;
