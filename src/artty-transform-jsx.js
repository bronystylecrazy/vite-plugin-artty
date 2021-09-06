"use strict";
exports.__esModule = true;
var core_1 = require("@babel/core");
var chalk_1 = require("chalk");
var t = require("@babel/types");
function Artty(sourcecode) {
    var code = sourcecode.split("/* @__PURE__ */").join("");
    var output = core_1.transformSync(code, {
        plugins: [
            function ArttyTransform() {
                return {
                    visitor: {
                        CallExpression: function (path) {
                            if (path.node.callee.name !== 'h')
                                return;
                            var hName = path.node.callee.name;
                            var arg = path.node.arguments;
                            var tagName = !!path.node.arguments[0] ? path.node.arguments[0].value : null;
                            /// $if
                            (function () {
                                try {
                                    var foundKey = path.node.arguments[1].properties.find(function (e) { return e.key.name === '$if'; });
                                    if (!!foundKey) {
                                        if (foundKey.key.name === '$if') {
                                            path.traverse({
                                                ObjectExpression: function (path) {
                                                    path.traverse({
                                                        ObjectProperty: function (path) {
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
                                    console.log("\n $if " + tagName + chalk_1["default"].red(e.message));
                                }
                            })();
                            /// $for
                            (function () {
                                var _a, _b;
                                try {
                                    var foundKey = path.node.arguments[1].properties.find(function (e) { return e.key.name === '$for'; });
                                    if (!!foundKey) {
                                        if (foundKey.key.name === '$for') {
                                            path.traverse({
                                                ObjectExpression: function (path) {
                                                    path.traverse({
                                                        ObjectProperty: function (path) {
                                                            if (path.node.key.name === '$for')
                                                                path.remove();
                                                            console.log("-----------> ");
                                                        }
                                                    });
                                                }
                                            });
                                            if (t.isIdentifier((_a = foundKey === null || foundKey === void 0 ? void 0 : foundKey.value) === null || _a === void 0 ? void 0 : _a.left)) {
                                                path.replaceWith(t.callExpression(t.identifier('_.L'), [
                                                    t.parenthesizedExpression(foundKey.value.right),
                                                    t.arrowFunctionExpression([
                                                        foundKey.value.left
                                                    ], path.node)
                                                ]));
                                            }
                                            else if (t.isSequenceExpression((_b = foundKey === null || foundKey === void 0 ? void 0 : foundKey.value) === null || _b === void 0 ? void 0 : _b.left)) {
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
                                    console.log("\n $for " + tagName + chalk_1["default"].red(e.message));
                                }
                            })();
                        }
                    }
                };
            },
        ]
    });
    console.log(output === null || output === void 0 ? void 0 : output.code);
    return output;
}
exports["default"] = Artty;
