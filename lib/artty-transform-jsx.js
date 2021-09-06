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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
const chalk_1 = __importDefault(require("chalk"));
const t = __importStar(require("@babel/types"));
function Artty(sourcecode) {
    let code = sourcecode.split("/* @__PURE__ */").join("");
    let output = core_1.transformSync(code, {
        plugins: [
            function ArttyTransform() {
                return {
                    visitor: {
                        CallExpression(path) {
                            if (path.node.callee.name !== 'h')
                                return;
                            var hName = path.node.callee.name;
                            var arg = path.node.arguments;
                            var tagName = !!path.node.arguments[0] ? path.node.arguments[0].value : null;
                            /// $if
                            (function () {
                                try {
                                    var foundKey = path.node.arguments[1].properties.find(e => e.key.name === '$if');
                                    if (!!foundKey) {
                                        if (foundKey.key.name === '$if') {
                                            path.traverse({
                                                ObjectExpression(path) {
                                                    path.traverse({
                                                        ObjectProperty(path) {
                                                            if (path.node.key.name === '$if')
                                                                path.remove();
                                                            console.log("-----------> ");
                                                        }
                                                    });
                                                }
                                            });
                                            path.replaceWith(t.conditionalExpression(t.parenthesizedExpression(foundKey.value) /*p foundKey.value*/, path.node, t.callExpression(t.identifier('h'), [])));
                                        }
                                        console.log('found ----> $if', !!foundKey ? true : false);
                                        // path.skip();
                                    }
                                }
                                catch (e) {
                                    console.log(`\n $if ${tagName}` + chalk_1.default.red(e.message));
                                }
                            })();
                            /// $for
                            (function () {
                                try {
                                    var foundKey = path.node.arguments[1].properties.find(e => e.key.name === '$for');
                                    if (!!foundKey) {
                                        if (foundKey.key.name === '$for') {
                                            path.traverse({
                                                ObjectExpression(path) {
                                                    path.traverse({
                                                        ObjectProperty(path) {
                                                            if (path.node.key.name === '$for')
                                                                path.remove();
                                                            console.log("-----------> ");
                                                        }
                                                    });
                                                }
                                            });
                                            if (t.isIdentifier(foundKey?.value?.left)) {
                                                path.replaceWith(t.callExpression(t.identifier('_.L'), [
                                                    t.parenthesizedExpression(foundKey.value.right),
                                                    t.arrowFunctionExpression([
                                                        foundKey.value.left
                                                    ], path.node)
                                                ]));
                                            }
                                            else if (t.isSequenceExpression(foundKey?.value?.left)) {
                                                path.replaceWith(t.callExpression(t.identifier('_.L'), [
                                                    t.parenthesizedExpression(foundKey.value.right),
                                                    t.arrowFunctionExpression(foundKey.value.left.expressions, path.node)
                                                ]));
                                            }
                                        }
                                        console.log('found ----> $for ' + tagName + ',' + hName, !!foundKey ? true : false);
                                        path.skip();
                                    }
                                }
                                catch (e) {
                                    console.log(`\n $for ${tagName}` + chalk_1.default.red(e.message));
                                }
                            })();
                        },
                    },
                };
            },
        ],
    });
    console.log(output?.code);
    return output;
}
exports.default = Artty;
