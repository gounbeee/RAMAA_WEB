'use strict'


class BitmapLoader {


  constructor(name) {
    //-// console.log('%%  BitmapLoader.mjs : BitmapLoader CONSTRUCTOR EXECUTED')
    
    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }

    this.constructor.instance = this


    // -------------------------------------------------------
    this.images = {}


  }


  load(name, url) {
    //-// console.log('%%  BitmapLoader.mjs : load FUNCTION EXECUTED')

    return new Promise((resolve, reject) => {

      // CREATING NEW IMAGE TO CLASS MEMBER
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
      const img = this.images[name] = new Image()

      // CALLBACK FUNCTION WHEN THE IMAGE IS LOADED
      img.onload = function() {

        const resultMessege = 'LOADED IMAGE : ' + name

        //-// console.log(resultMessege)
        
        resolve(resultMessege)

      }

      img.src = url
      
    }).catch(err => {
      //-// console.log(err)
    })


  }




}





export {BitmapLoader}
