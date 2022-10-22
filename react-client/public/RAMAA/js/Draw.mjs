'use strict'

import { KeyframeManager }  from "./KeyframeManager.mjs"
import { AttribManager }    from "./AttribManager.mjs"




// **** BASE CLASS ****
class Draw {

  constructor(settings) {
    //-// console.log('%% Draw.mjs :: Draw CONSTRUCTOR EXECUTED')
    this.nsSvg = 'http://www.w3.org/2000/svg'
    this.keyframeManager

  }





  initialize(settings) {

    this.stateObj = settings.stateObj
    this.currentObj = settings.currentObj
    
    this.keyframeManager = new KeyframeManager(this.stateObj, this.currentObj)





  }


  setupCommonEventHandlers() {


    // =========================================
    // DUPLICATE BUTTON EVENT HANDLING
    // =========================================
    this.duplicateObjectHandler = (ev) => {

      // CHECK IF THE GROUP ID IS IDENTICAL
      if(this.currentObj.groupId === ev.detail.id) {

        //console.log(`DUPLICATE OBJECT BUTTON PRESSED !!!!  --->    ${ev.detail.id}`)

        // < GETTING CLASS NAME >
        // https://stackoverflow.com/questions/332422/get-the-name-of-an-objects-type
        let className = this.currentObj.constructor.name
        
        // 1. COLLECT CURRENT DATA 
        let extractedAttr
        let createdObjNew

        switch(className) {
          case 'DrawArrow':
            // CREATE NEW ONE
            createdObjNew = this.stateObj.createArrow(this.stateObj.arrowShapeInitSet)
            createdObjNew.duplicateSetting(this.currentObj)

          break
          case 'DrawBall':
            // CREATE NEW ONE
            createdObjNew = this.stateObj.createBall(this.stateObj.ballShapeInitSet)
            createdObjNew.duplicateSetting(this.currentObj)




          break
          case 'DrawBitmap':
            let bitmapInitSet = {
              posX: this.currentObj.posX,
              posY: this.currentObj.posY,
              width: parseInt(this.currentObj.canvas.getAttribute('width')),
              height: parseInt(this.currentObj.canvas.getAttribute('height')),
              canvasContext:  this.currentObj.canvas.getContext('2d')
            }

            // CREATE NEW ONE
            createdObjNew = this.stateObj.createBitmap(bitmapInitSet)
            createdObjNew.duplicateSetting(this.currentObj)




          break
          case 'DrawRectangle':
            // CREATE NEW ONE
            createdObjNew = this.stateObj.createRect(this.stateObj.rectShapeInitSet)
            createdObjNew.duplicateSetting(this.currentObj)

          break
          case 'DrawTextArea':
            // CREATE NEW ONE
            createdObjNew = this.stateObj.createTextArea(this.stateObj.textareaInitSet)
            createdObjNew.duplicateSetting(this.currentObj)






          break

        }





        //let str = localStorage




        // ======================================================================
        // RE-ALIGN DOMs ACCORDING TO Z-INDEX
        // ======================================================================
        //ZIndexManager.refreshAllSvg()


        // // 4. RESET ATTRIB BOX LIST OF ATTRIB MANAGER
        // const evToAttrMan = new CustomEvent('resetAttrBox', {
        //   bubbles: true,
        //   detail: {
        //     id: this.groupId
        //   }
        // })
        // document.getElementById('workarea').dispatchEvent(evToAttrMan)


        // // 5. REPORT TO STATE
        // const evToState = new CustomEvent('updateRenderList', {
        //   bubbles: true,
        //   detail: {
        //     id: this.currentObj.groupId
        //   }
        // })
        // document.getElementById('workarea').dispatchEvent(evToState)


      }
    }
    this.currentObj.group.addEventListener('duplicateObject', this.duplicateObjectHandler,false)






  }






}




export{Draw}
