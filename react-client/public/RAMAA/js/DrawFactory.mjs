'use strict'

import { Draw } from "./Draw.mjs"
import { DrawTextArea } from "./DrawTextArea.mjs"
import { DrawRectangle } from "./DrawRectangle.mjs"
import { DrawBitmap } from "./DrawBitmap.mjs"
import { DrawArrow } from "./DrawArrow.mjs"
import { DrawSlotMatrix } from "./DrawSlotMatrix.mjs"
import { DrawBall } from "./DrawBall.mjs"
import { DrawImage } from "./DrawImage.mjs"



class DrawFactory {

  constructor() {
    //-// console.log('%% DrawFactory.mjs :: DrawFactory CONSTRUCTOR EXECUTED')

    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }
    this.constructor.instance = this

  }



  initialize() {
    //-// console.log('%% DrawFactory.mjs :: initialize FUNCTION EXECUTED')
    return this
  }



  draw(setting, stateObj) {

    if(setting.type) {

      switch(setting.type) {
        case 'TEXTAREA':
          return new DrawTextArea(setting, stateObj)
          
        case 'RECTANGLE':
          return new DrawRectangle(setting, stateObj)

        case 'ARROW':
            return new DrawArrow(setting, stateObj)

        case 'BALL':
            return new DrawBall(setting, stateObj)

        case 'BITMAP':
            return new DrawBitmap(setting, stateObj)

        case 'IMAGE':
            return new DrawImage(setting, stateObj)

        default:
          throw new Error(`THERE IS NO CHANCE TO DRAW OBJECT LIKE --  ${setting.type}`)

      }

    }


  }



}


export {DrawFactory}
