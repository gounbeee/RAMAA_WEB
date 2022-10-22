'use strict'




class SlotMatrix {

  constructor() {

    //-// console.log('%% SlotMatrix.mjs :: SlotMatrix CONSTRUCTOR EXECUTED')



    let cnvsDom = document.createElement("CANVAS")

    cnvsDom.setAttribute('width', 640)
    cnvsDom.setAttribute('height', 480)

    document.getElementById('workarea').appendChild(cnvsDom)
    document.getElementById('workarea').prepend(cnvsDom)

    // https://stackoverflow.com/questions/24041111/can-i-place-a-svg-image-element-on-top-a-canvas-element
    cnvsDom.classList.add('bl_htmlCanvas')
    cnvsDom.classList.add('ly_htmlCanvas')

    const ctx = cnvsDom.getContext("2d");
    //-// console.log(ctx.canvas);

    // Set colors
    ctx.strokeStyle = "red";
    ctx.fillStyle = "black";

    // Draw rectangle
    ctx.fillRect(15, 100, 300, 300);
    ctx.strokeRect(15, 100, 300, 300);

    // Draw circle
    ctx.beginPath();
    ctx.arc(480, 250, 150, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();


  }

  





}





export{SlotMatrix}