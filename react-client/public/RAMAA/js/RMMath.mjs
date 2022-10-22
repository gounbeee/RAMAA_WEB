'use strict'






class RMMath {

  constructor() {
  }



  static pointOnCircle(centerX, centerY, mouseX, mouseY) {

    let rx = Math.hypot(centerX - mouseX, centerY - mouseY) * Math.SQRT2
    let ry = Math.abs((centerY - mouseY))



    return {x: rx, y:ry}
  }



  static vec2plus(vec1, vec2) {
    return {
      x: vec1.x + vec2.x,
      y: vec1.y + vec2.y
    }
  }


  static calcSlope2Pt(x1,y1,x2,y2) {

    let deno = x2-x1

    if (deno < 0.001) deno = 0.001

    return (y2-y1) / deno

  }


  // Example easing functions
  // https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-smooth-canvas-animation
  static easeInOutQuint (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  }

  static easeLinear (t, b, c, d) {
    return c * t / d + b;
  }

}



export {RMMath}
