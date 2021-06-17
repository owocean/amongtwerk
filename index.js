/*
---------------------------------------------------------------------------------------

    Disclaimer!!! I am not responsible for any injuries caused by viewing this file

---------------------------------------------------------------------------------------
*/

const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const fsp = require('fs').promises;
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const gifframes = require('gif-frames'); // wip

let filename = process.argv[2];

(async()=>{

    let info = (await ffprobe(filename, { path: ffprobeStatic.path })).streams[0];

    let canvas2 = createCanvas(info.width/15, info.height/15);
    let ctx2 = canvas2.getContext('2d');
    let img = await loadImage(filename)
    ctx2.drawImage(img, 0, 0, info.width/15, info.height/15)
    await fsp.writeFile('smallsized.png', canvas2.toBuffer());
    
    const encoder = new GIFEncoder(info.width - (info.width%15), info.height - (info.height%15));
    encoder.createReadStream().pipe(fs.createWriteStream('baka.gif'));
    
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(1);
    encoder.setQuality(200);
    
    let canvas = createCanvas(info.width - (info.width%15), info.height - (info.height%15));
    let ctx = canvas.getContext('2d');
    
    for(var i=0;i<6;i++){
        console.log(i);
        let sus = await loadImage('sussy/'+i+'.png');
        ctx.clearRect(0,0,canvas.width,canvas.height)
        for(var y=0;y<canvas.height/15;y++){
            for(var x=0;x<canvas.width/15;x++){
                ctx.drawImage(sus, x*15, y*15, 15, 15)
            }
        }
        for(var y=0;y<canvas.height/15;y++){
            for(var x=0;x<canvas.width/15;x++){
                var imag = ctx.getImageData(x*15, y*15, 15, 15);
                var imag2 = ctx2.getImageData(x,y,1,1)
                for (var t=0;t< imag.data.length;t+=4) {   
                    if(imag.data[t] < 10 && imag.data[t+1] < 10 && imag.data[t+2] < 10)continue;
                    imag.data[t]   = imag.data[t]   & imag2.data[0] 
                    imag.data[t+1] = imag.data[t+1] & imag2.data[1]
                    imag.data[t+2] = imag.data[t+2] & imag2.data[2]
                }
                ctx.putImageData(imag,x*15,y*15);
            }
        }
        encoder.addFrame(ctx);
    }
    
    encoder.finish();

})();