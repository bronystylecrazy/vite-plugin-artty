import { BabelFileResult, NodePath, transformSync } from '@babel/core';
import chalk from 'chalk';
import * as t from '@babel/types';
export default function Artty(sourcecode: string){
    let code = sourcecode.split("/* @__PURE__ */").join("");
    let output : BabelFileResult | null = transformSync(code, {
        plugins: [
            function ArttyTransform() {
              return {
                visitor: {
                    CallExpression(path: NodePath){
                        
                        if(path.node.callee.name !== 'h') return;
                        var hName = path.node.callee.name;
                        var arg = path.node.arguments;
                        var tagName = !!path.node.arguments[0] ? path.node.arguments[0].value : null;
                        
                            /// $if
                            (function(){
                                try{
                            var foundKey = path.node.arguments[1].properties.find(e => e.key.name === '$if')
                            if(!!foundKey){
                                if(foundKey.key.name === '$if'){
                                    path.traverse({
                                        ObjectExpression(path){
                                            path.traverse({
                                                ObjectProperty(path){
                                                    if(path.node.key.name === '$if')
                                                        path.remove();
                                                    console.log("-----------> ", );
                                                }
                                            })
                                        }
                                    })
                                    path.replaceWith(
                                        t.conditionalExpression(
                                            t.parenthesizedExpression(foundKey.value) /*p foundKey.value*/,
                                            path.node,
                                            t.callExpression(t.identifier('h'),[])
                                        )
                                    );
                                }
                                console.log('found ----> $if', !!foundKey ? true : false)
                                // path.skip();
                                }
                            }catch(e){ console.log(`\n $if ${tagName}`+chalk.red(e.message))}
                            })();

                            /// $for
                            (function(){
                                try{
                                var foundKey = path.node.arguments[1].properties.find(e => e.key.name === '$for')
                                if(!!foundKey){
                                    if(foundKey.key.name === '$for'){
                                        path.traverse({
                                            ObjectExpression(path){
                                                path.traverse({
                                                    ObjectProperty(path){
                                                        if(path.node.key.name === '$for')
                                                            path.remove();
                                                        console.log("-----------> ", );
                                                    }
                                                })
                                            }
                                        })
                                        
                                        if(t.isIdentifier(foundKey?.value?.left)){
                                            path.replaceWith(
                                                t.callExpression(t.identifier('_.L'),[
                                                    t.parenthesizedExpression(foundKey.value.right),
                                                    t.arrowFunctionExpression([
                                                        foundKey.value.left
                                                    ], path.node)
                                                ])
                                            );
                                        }else if(t.isSequenceExpression(foundKey?.value?.left)){
                                            path.replaceWith(
                                                t.callExpression(t.identifier('_.L'),[
                                                    t.parenthesizedExpression(foundKey.value.right),
                                                    t.arrowFunctionExpression(foundKey.value.left.expressions, path.node)
                                                ])
                                            );
                                        }
                                    }
                                    console.log('found ----> $for ' + tagName + ',' + hName , !!foundKey ? true : false)
                                    path.skip();
                                }
                            }catch(e){ console.log(`\n $for ${tagName}`+chalk.red(e.message))}
                                })();

                       
                    },
                    // ObjectExpression(path: NodePath) {
                    //     if(path.parentPath?.isCallExpression()){
                    //         console.log(chalk.blue(path.parentPath.node.arguments))
                    //         console.log();
                    //         console.log("This is expression");
                    //     }
                    // },
                },
              };
            },
        ],
    });
    console.log(output?.code)
    return output;
}