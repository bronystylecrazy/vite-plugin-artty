import fs from 'fs';
import path from 'path';
import Artty from './artty-transform-jsx';

export default function viteArtty(){
    console.clear();
    return {
        name: "vite-artty",
        transform(code: string, id: string){
            if(path.relative(__dirname, id).split('\\')[1] !== 'src') return; 
            if(!['.js','.jsx'].includes(path.extname(id))) return;
            let transformed = Artty(code);
            let writeTo = path.join('./transformed/',path.relative(__dirname, id).replace('..\\',''));
            // console.log('path---->',writeTo.substring(0, writeTo.lastIndexOf("\\")));
            fs.mkdirSync(writeTo.substring(0, writeTo.lastIndexOf("\\")),{recursive: true});
            fs.writeFileSync(writeTo,transformed?.code,'utf-8');
            return transformed;
        },
    };
}