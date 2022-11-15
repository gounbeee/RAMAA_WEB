'use strict'

import { Draw } from "./Draw.js"
import { DrawTextArea } from "./DrawTextArea.js"
import { DrawRectangle } from "./DrawRectangle.js"
import { DrawBitmap } from "./DrawBitmap.js"
import { DrawArrow } from "./DrawArrow.js"
import { DrawSlotMatrix } from "./DrawSlotMatrix.js"
import { DrawBall } from "./DrawBall.js"



class DrawFactory {

  constructor() {
    //-// console.log('%% DrawFactory.js :: DrawFactory CONSTRUCTOR EXECUTED')

    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }
    this.constructor.instance = this

  }



  initialize() {
    //-// console.log('%% DrawFactory.js :: initialize FUNCTION EXECUTED')
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

        default:
          throw new Error(`THERE IS NO CHANCE TO DRAW OBJECT LIKE --  ${setting.type}`)

      }

    }


  }



}


export {DrawFactory}
