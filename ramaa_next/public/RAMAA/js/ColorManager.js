'use strict'




class ColorManager {


  constructor() {
    //-// console.log('%% ColorManager.js :: ColorManager CONSTRUCTOR EXECUTED')

    // TODO :: MANAGE BELOW!
    // https://codepen.io/njmcode/pen/axoyD/
    
    // this.gb2hsl = function(color) {
    //   let r = color[0]/255;
    //   let g = color[1]/255;
    //   let b = color[2]/255;
    //
    //   let max = Math.max(r, g, b), min = Math.min(r, g, b);
    //   let h, s, l = (max + min) / 2;
    //
    //   if (max == min) {
    //     h = s = 0; // achromatic
    //   } else {
    //     let d = max - min;
    //     s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
    //     switch(max) {
    //       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    //       case g: h = (b - r) / d + 2; break;
    //       case b: h = (r - g) / d + 4; break;
    //     }
    //     h /= 6;
    //   }
    //
    //   return [h, s, l];
    // };
    //
    // this.hsl2rgb = function(color) {
    //   let l = color[2];
    //
    //   if (color[1] == 0) {
    //     l = Math.round(l*255);
    //     return [l, l, l];
    //   } else {
    //     function hue2rgb(p, q, t) {
    //       if (t < 0) t += 1;
    //       if (t > 1) t -= 1;
    //       if (t < 1/6) return p + (q - p) * 6 * t;
    //       if (t < 1/2) return q;
    //       if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    //       return p;
    //     }
    //
    //     let s = color[1];
    //     let q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
    //     let p = 2 * l - q;
    //     let r = hue2rgb(p, q, color[0] + 1/3);
    //     let g = hue2rgb(p, q, color[0]);
    //     let b = hue2rgb(p, q, color[0] - 1/3);
    //     return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
    //   }
    // };
    //
    // this._interpolateHSL = function(color1, color2, factor) {
    //   if (arguments.length < 3) { factor = 0.5; }
    //   let hsl1 = rgb2hsl(color1);
    //   let hsl2 = rgb2hsl(color2);
    //   for (let i=0;i<3;i++) {
    //     hsl1[i] += factor*(hsl2[i]-hsl1[i]);
    //   }
    //   return hsl2rgb(hsl1);
    // };
    //

  }

  // Converts a #ffffff hex string into an [r,g,b] array
  hex2rgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null
  }

  // Inverse of the above
  rgb2hex(rgb) {
      return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
  }

  // Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
  // Taken from the awesome ROT.js roguelike dev library at
  // https://github.com/ondras/rot.js
  interpolateColor(color1, color2, factor) {

    if (arguments.length < 3) { factor = 0.5 }

    let result = color1.slice()

    for (let i=0;i<3;i++) {
      result[i] = Math.round(result[i] + factor*(color2[i]-color1[i]));
    }
    return result
  }


}





export {ColorManager}
