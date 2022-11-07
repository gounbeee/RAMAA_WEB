'use strict'

import { KeyframeManager }  from "./KeyframeManager.mjs"
import { AttribManager }    from "./AttribManager.mjs"




// **** BASE CLASS ****
class Draw {

  constructor(settings) {
    //-// console.log('%% Draw.mjs :: Draw CONSTRUCTOR EXECUTED')
    this.nsSvg = 'http://www.w3.org/2000/svg'
    this.keyframeManager

    this.boundBoxDom
    this.boundBoxCoords = {
      x: 0,
      y: 0,
      width:0,
      height:0
    }

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

            //console.log(this.stateObj.arrowShapeInitSet)
            //console.log(this.currentObj)

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


  // THIS FUNCTION CALCULATES LEFT UPPER COORDINATE AND WIDTH + HEIGHT
  getBBoxCoords(svgDom) {

    console.log(svgDom)
    console.log(svgDom.tagName)



    switch(svgDom.tagName) {

      case 'ellipse':

        console.log('ellipse  IS SELECTED')

        this.boundBoxCoords.x = svgDom.getAttribute('cx') - svgDom.getAttribute('rx')
        this.boundBoxCoords.y = svgDom.getAttribute('cy') - svgDom.getAttribute('ry')
        this.boundBoxCoords.width = svgDom.getAttribute('rx') * 2
        this.boundBoxCoords.height = svgDom.getAttribute('ry') * 2

      break

      case 'rect':
        console.log('rect  IS SELECTED')

        this.boundBoxCoords.x = svgDom.getAttribute('x')
        this.boundBoxCoords.y = svgDom.getAttribute('y')
        this.boundBoxCoords.width = svgDom.getAttribute('width')
        this.boundBoxCoords.height = svgDom.getAttribute('height')
      break


      case 'text':

        console.log('text IS SELECTED')

        console.log(svgDom.getBBox({markers:true}))

        let idParent = svgDom.id.split('_')[0]
        const textGrpDom = document.getElementById(idParent)
        console.log(textGrpDom.transform.translate)
        


      break

      case 'CANVAS':

        console.log('canvas  IS SELECTED')




        


      break


      case 'path':

        console.log('path  IS SELECTED')




        


      break

    }


  }






}




export{Draw}
