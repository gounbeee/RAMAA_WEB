'use strict'



class FontLoader {


  constructor(name) {
    //-// console.log('%%  FontLoader.mjs : FontLoader CONSTRUCTOR EXECUTED')
    
    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }

    this.constructor.instance = this


    // -------------------------------------------------------


    

  }


  // load(f1, f2) {
  //   return new Promise((resolve, reject) => {


  //     const gmCanvasSM = new GameCanvas()

  //     const c = gmCanvasSM.generateCanvas(1, 1);



  //     let tryCnt = 0;

  //     const tryMax = 30;

  //     const chckTxt = 'abcdefg';

  //     const fntNm = f1.length > f2.length ? f1 : f2;

  //     document.body.append(c.canvas);



  //     const fnc = function() {
  //       if (tryCnt ++ >= tryMax) {
  //         const msg = 'err fnt : ' + fntNm;
  //         //-// console.log(msg);
  //         resolve(msg);
  //         return;
  //       }


  //       c.context.font = '32px ' + f1;
  //       const mt1 = c.context.measureText(chckTxt).width;


  //       c.context.font = '32px ' + f2;
  //       const mt2 = c.context.measureText(chckTxt).width;


  //       //-// console.log('fnt compare', mt1, mt2);


  //       if (mt1 != mt2) {
  //         const msg = 'load fnt : ' + fntNm;
  //         //-// console.log(msg);
  //         resolve(msg);
  //         c.canvas.parentNode.removeChild(c.canvas);
  //         return;

  //       }

  //       setTimeout(fnc, 100);

  //     };

  //     fnc();

  //   });


  // }




}





export {FontLoader}
