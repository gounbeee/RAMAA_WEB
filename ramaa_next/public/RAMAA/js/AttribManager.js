'use strict'

import { AttribBox }        from "./AttribBox.js"
import { TextArea }         from "./TextArea.js"
import { AnimManager }      from "./AnimManager.js"
import { InputManager }      from "./InputManager.js"



class AttribManager {

  constructor() {
    //-// console.log('%% AttribManager.js :: AttribManager CONSTRUCTOR EXECUTED')

    this.selectedObj = undefined

    this.allAttribs = undefined
    this.groupNode = undefined


    this.attribBoxesAll = {}
    this.attribBox = undefined

    // HIDDEN ANIM MANAGER BUTTON INITIALLY
    document.getElementById('animManager_btn').style.display = 'none'

    // ======================================================================
    // BELOW FUNCTIONS WILL TRIGGERED WHEN ATTRIB BOX'S CONTROLLERS CHANGED
    // ======================================================================


    // -------------------------------------------------------
    // EVENT HANDLERS FOR SHAPE
    this.textAreaDomEvHandlers = {
      // KEY : DOM ID
      // TODO :: GET RID OF NOT-USING PARAMETERS !!!

      // GETTING TEXTS FROM textarea INPUT HTML ELEMENT
      text_content : function(ev, groupDom, textArea) {
        //-// console.log('ATTRIB MANAGER  TEXT AREA CHANGED')
        let newText = ev.target.value

        const evToTextarea = new CustomEvent('update_textarea_text', {
          bubbles: true,
          detail: {
            id: groupDom.id,
            text: newText,
            control: ev.target
          }
        })
        groupDom.dispatchEvent(evToTextarea)

      },
      text_width : function(ev, groupDom, textArea) {
        let newWidth = ev.target.value

        const evToTextarea = new CustomEvent('update_textarea_width', {
          bubbles: true,
          detail: {
            id:groupDom.id,
            width: newWidth,
            control: ev.target
          }
        })
        groupDom.dispatchEvent(evToTextarea)

      },
      text_fontsize : function(ev, groupDom, textArea) {
        // VALUE CONSTRAINT
        if( ev.target.value < 1 ) ev.target.value = 1

        let newFontSize = ev.target.value

        const evToTextarea = new CustomEvent('update_textarea_fontsize', {
          bubbles: true,
          detail: {
            id: groupDom.id,
            fontSize: newFontSize
          }
        })
        groupDom.dispatchEvent(evToTextarea)
      },
      text_linemargin : function(ev, groupDom, textArea) {
        let newLineMargin = ev.target.value

        const evToTextarea = new CustomEvent('update_textarea_linemargin', {
          bubbles: true,
          detail: {
            id: groupDom.id,
            lineMargin: newLineMargin
          }
        })
        groupDom.dispatchEvent(evToTextarea)

      },
      text_xPos : function(ev, groupDom, textArea) {
        //-// console.log('ATTRIB MANAGER text_xPos FUNCTION EXECUTED')

        let newXPos = parseInt(ev.target.value)


        groupDom.setAttribute('transform', `translate(${newXPos}, ${textArea.textAreaObject.posY})`)


      },
      text_yPos : function(ev, groupDom, textArea) {
        //-// console.log('ATTRIB MANAGER text_yPos FUNCTION EXECUTED')

        let newYPosFirst = parseInt(ev.target.value)

        groupDom.setAttribute('transform', `translate(${textArea.textAreaObject.posX}, ${newYPosFirst})`)

      },
      text_color_fill : function(ev, groupDom, textArea) {
        //-// console.log('ATTRIB MANAGER text_color_fill FUNCTION EXECUTED')
        let newFill = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'text') {
            for(let tspn of child.childNodes) {
              tspn.setAttribute('fill', newFill)
            }
          }
        })
        groupDom.dataset.fill = newFill
      },
      text_zindex : function(ev, groupDom, textArea, textAreaObject) {
        //-// console.log('text_zindex EXECUTED')
        //-// console.log(textAreaObject)

        // CHECK FOR HIGHEST LOWEST VALUE
        // ****  0 INDEX IS 'RECT' SVG ELEMENT FOR CANVAS  ****
        let lowest = 1
        let highest = textArea.svgRoot.children.length - 1

        //-// console.log(`    ----    highest   ::    ${highest}`)
        //-// console.log(textAreaObject.getGroupId())

        let zIndexTo
        if(ev.target.value >= highest) {
          zIndexTo = highest
          ev.target.value = highest
        } else if(ev.target.value <= lowest) {
          zIndexTo = lowest
          ev.target.value = lowest
        } else {
          zIndexTo = ev.target.value
        }
        let zIndexFrom = textArea.group.dataset.zIndex

        //-// console.log(`OBJECT'S Z-INDEX :: ${textAreaObject.group.dataset.zIndex}`)
        //-// console.log(`INPUT DOM VALUE :: ${ev.target.value}`)


        // CALCUALTING DIRECTION TO CHANGE ZINDEX
        // changePlus ->  true :: POSITIVE CHANGE
        //            ->  false :: NEGATIVE CHANGE
        //            ->  undefined :: SAME VALUE -> WILL NOT USE
        let changePlus

        if(zIndexTo - zIndexFrom > 0) {
          changePlus = true
        } else if(zIndexTo - zIndexFrom < 0) {
          changePlus = false
        } else if(zIndexTo - zIndexFrom === 0){
          changePlus = undefined
        }

        //-// console.log(`   %%%%     zIndexFrom ::   ${zIndexFrom}      -----   zIndexTo ::   ${zIndexTo}   -----     changePlus ::  ${changePlus}`)


        // DISPATCHING EVENT THAT ALL ELEMENTS UPDATE THEIR Z INDEX!
        // THIS WILL BE EXECUTED Draw CLASS (BASE CLASS OF ALL 'Drawed' ELEMENTS)
        let evToUpdateZIndex = new CustomEvent("updateZIndex", {
          bubbles: true,
          detail: {
            obj: textArea,           // **** TODO :: textAreaObject AND textArea -> TOO COMPLICATED
            zIndexFrom: zIndexFrom,
            zIndexTo: zIndexTo,
            changePlus: changePlus
          }
        })
        ev.target.dispatchEvent(evToUpdateZIndex)
        //textArea.group.dispatchEvent(evToUpdateZIndex)


      },
      text_color_opacity : function(ev, groupDom, textArea) {
        //-// console.log('ATTRIB MANAGER text_color_opacity FUNCTION EXECUTED')
        let newOpacity = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'text') {
            for(let tspn of child.childNodes) {
              tspn.style.opacity = parseFloat(newOpacity)
            }
          }
        })
        groupDom.dataset.opacity = parseFloat(newOpacity)

      },
      text_fontFamily : function(ev, groupDom, textArea) {
        //-// console.log('ATTRIB MANAGER text_fontFamily FUNCTION EXECUTED')
        let newFontFamily = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'text') {
            for(let tspn of child.childNodes) {
              tspn.style.fontFamily = newFontFamily
            }
          }
        })

        const evToTextarea = new CustomEvent('update_textarea_fontFamily', {
          bubbles: true,
          detail: {
            id: groupDom.id,
            fontFamily: newFontFamily,
            control: ev.target
          }
        })
        groupDom.dispatchEvent(evToTextarea)

      },
    }


    // -------------------------------------------------------
    // EVENT HANDLERS FOR SHAPE
    this.rectDomEvHandlers = {
      // KEY : DOM ID

      rect_xPos : function(ev, groupDom, shape) {
        let newXPos = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'rect') {
            child.setAttribute('x', newXPos)
          }
        })
      },
      rect_yPos : function(ev, groupDom, shape) {
        let newYPos = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'rect') {
            child.setAttribute('y', newYPos)
          }
        })
      },
      rect_width : function(ev, groupDom, shape) {
        let newWidth = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'rect') {
            child.setAttribute('width', newWidth)
          }
        })
      },
      rect_height : function(ev, groupDom, shape) {
        let newHeight = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'rect') {
            child.setAttribute('height', newHeight)
          }
        })
      },
      rect_color_fill : function(ev, groupDom, shape) {
        let newFill = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'rect') {
            child.setAttribute('fill', newFill)
          }
        })
      },
      rect_zindex : function(ev, groupDom, shape, groupObject) {
        //-// console.log('text_zindex EXECUTED')
        //-// console.log(groupObject)

        // CHECK FOR HIGHEST LOWEST VALUE
        // ****  0 INDEX IS 'RECT' SVG ELEMENT FOR CANVAS  ****
        let lowest = 1
        let highest = shape.svgRoot.children.length - 1

        //-// console.log(`    ----    highest   ::    ${highest}`)
        //-// console.log(groupObject.getGroupId())

        let zIndexTo
        if(ev.target.value >= highest) {
          zIndexTo = highest
          ev.target.value = highest
        } else if(ev.target.value <= lowest) {
          zIndexTo = lowest
          ev.target.value = lowest
        } else {
          zIndexTo = ev.target.value
        }
        let zIndexFrom = shape.group.dataset.zIndex

        //-// console.log(`OBJECT'S Z-INDEX :: ${groupObject.group.dataset.zIndex}`)
        //-// console.log(`INPUT DOM VALUE :: ${ev.target.value}`)


        // CALCUALTING DIRECTION TO CHANGE ZINDEX
        // changePlus ->  true :: POSITIVE CHANGE
        //            ->  false :: NEGATIVE CHANGE
        //            ->  undefined :: SAME VALUE -> WILL NOT USE
        let changePlus

        if(zIndexTo - zIndexFrom > 0) {
          changePlus = true
        } else if(zIndexTo - zIndexFrom < 0) {
          changePlus = false
        } else if(zIndexTo - zIndexFrom === 0){
          changePlus = undefined
        }

        //-// console.log(`   %%%%     zIndexFrom ::   ${zIndexFrom}      -----   zIndexTo ::   ${zIndexTo}   -----     changePlus ::  ${changePlus}`)


        // DISPATCHING EVENT THAT ALL ELEMENTS UPDATE THEIR Z INDEX!
        // THIS WILL BE EXECUTED Draw CLASS (BASE CLASS OF ALL 'Drawed' ELEMENTS)
        let evToUpdateZIndex = new CustomEvent("updateZIndex", {
          bubbles: true,
          detail: {
            obj: shape,
            zIndexFrom: zIndexFrom,
            zIndexTo: zIndexTo,
            changePlus: changePlus
          }
        })
        ev.target.dispatchEvent(evToUpdateZIndex)

        // SEND EVENT TO UPDATE LOCAL STORAGE
        // (FOR ALL OBJECTS)
        //const evToObj = new Event('update_storage_zindex')
        //groupObject.group.dispatchEvent(evToUpdateZIndex)


      },
      rect_color_opacity : function(ev, groupDom, shape) {
        //-// console.log('ATTRIB MANAGER rect_color_opacity FUNCTION EXECUTED')
        let newOpacity = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'rect') {

            child.style.opacity = parseFloat(newOpacity)

          }
        })
      },
    }

    // -------------------------------------------------------
    // EVENT HANDLERS FOR SHAPE
    this.bitmapDomEvHandlers = {
      // KEY : DOM ID

      bitmap_xPos : function(ev, groupDom, shape) {
        let newXPos = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'foreignObject') {
            child.setAttribute('x', newXPos)
          }
        })
      },
      bitmap_yPos : function(ev, groupDom, shape) {
        let newYPos = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'foreignObject') {
            child.setAttribute('y', newYPos)
          }
        })
      },
      bitmap_width : function(ev, groupDom, shape) {
        let newWidth = parseInt(ev.target.value)

        let imgwidth = shape.canvas.offsetWidth
        let imgheight = shape.canvas.offsetHeight
        
        // CLEARING CANVAS
        //shape.canvas.getContext('2d').clearRect(0, 0, imgwidth, imgheight)

        // UPDATING NEW WIDTH
        shape.foreignDom.setAttribute('width', newWidth)
        shape.canvas.setAttribute('width', newWidth)

        // DRAW 
        shape.canvas.getContext('2d').drawImage(
          shape.preLoadedImg, 
          0, 0, newWidth, shape.canvas.getAttribute('height'))


        // UPDATE PIXEL (SCALED) DATA
        shape.preLoadedImg.src = shape.canvas.toDataURL()        
        shape.preLoadedImg.width = newWidth


        // STORING DATA TO LOCALSTORAGE
        //console.log(shape.preLoadedImg)
        shape.dataStore.width = newWidth
        shape.dataStore.canvasDataURL = shape.canvas.toDataURL()   
        shape.setDataStore()
        shape.localStorage.saveToLocalStr(shape.dataStore)


      },
      bitmap_height : function(ev, groupDom, shape) {
        let newHeight = parseInt(ev.target.value)

        let imgwidth = shape.canvas.offsetWidth
        let imgheight = shape.canvas.offsetHeight

        // CLEARING CANVAS
        shape.canvas.getContext('2d').clearRect(0, 0, imgwidth, imgheight)

        // UPDATING NEW HEIGHT
        shape.foreignDom.setAttribute('height', newHeight)
        shape.canvas.setAttribute('height', newHeight)
        
        shape.canvas.getContext('2d').drawImage(
          shape.preLoadedImg, 
          0, 0, imgwidth, imgheight, 
          0, 0, shape.canvas.getAttribute('width'), newHeight)


        // UPDATE PIXEL (SCALED) DATA
        shape.preLoadedImg.src = shape.canvas.toDataURL()        
        shape.preLoadedImg.height = newHeight

        // STORING DATA TO LOCALSTORAGE
        //console.log(shape.preLoadedImg)
        shape.dataStore.height = newHeight
        shape.dataStore.canvasDataURL = shape.canvas.toDataURL()   
        shape.setDataStore()
        shape.localStorage.saveToLocalStr(shape.dataStore)


      },
      bitmap_zindex : function(ev, groupDom, shape, groupObject) {
        //-// console.log('text_zindex EXECUTED')
        //-// console.log(groupObject)

        // CHECK FOR HIGHEST LOWEST VALUE
        // ****  0 INDEX IS 'RECT' SVG ELEMENT FOR CANVAS  ****
        let lowest = 1
        let highest = shape.svgRoot.children.length - 1

        //-// console.log(`    ----    highest   ::    ${highest}`)
        //-// console.log(groupObject.getGroupId())

        let zIndexTo
        if(ev.target.value >= highest) {
          zIndexTo = highest
          ev.target.value = highest
        } else if(ev.target.value <= lowest) {
          zIndexTo = lowest
          ev.target.value = lowest
        } else {
          zIndexTo = ev.target.value
        }
        let zIndexFrom = shape.group.dataset.zIndex

        //-// console.log(`OBJECT'S Z-INDEX :: ${groupObject.group.dataset.zIndex}`)
        //-// console.log(`INPUT DOM VALUE :: ${ev.target.value}`)


        // CALCUALTING DIRECTION TO CHANGE ZINDEX
        // changePlus ->  true :: POSITIVE CHANGE
        //            ->  false :: NEGATIVE CHANGE
        //            ->  undefined :: SAME VALUE -> WILL NOT USE
        let changePlus

        if(zIndexTo - zIndexFrom > 0) {
          changePlus = true
        } else if(zIndexTo - zIndexFrom < 0) {
          changePlus = false
        } else if(zIndexTo - zIndexFrom === 0){
          changePlus = undefined
        }

        //-// console.log(`   %%%%     zIndexFrom ::   ${zIndexFrom}      -----   zIndexTo ::   ${zIndexTo}   -----     changePlus ::  ${changePlus}`)


        // DISPATCHING EVENT THAT ALL ELEMENTS UPDATE THEIR Z INDEX!
        // THIS WILL BE EXECUTED Draw CLASS (BASE CLASS OF ALL 'Drawed' ELEMENTS)
        let evToUpdateZIndex = new CustomEvent("updateZIndex", {
          bubbles: true,
          detail: {
            obj: shape,
            zIndexFrom: zIndexFrom,
            zIndexTo: zIndexTo,
            changePlus: changePlus
          }
        })
        ev.target.dispatchEvent(evToUpdateZIndex)

        // SEND EVENT TO UPDATE LOCAL STORAGE
        // (FOR ALL OBJECTS)
        //const evToObj = new Event('update_storage_zindex')
        //groupObject.group.dispatchEvent(evToUpdateZIndex)


      },
      bitmap_color_opacity : function(ev, groupDom, shape) {
        //-// console.log('ATTRIB MANAGER rect_color_opacity FUNCTION EXECUTED')
        let newOpacity = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'foreignObject') {

            child.style.opacity = parseFloat(newOpacity)

          }
        })
      },
    }

    // -------------------------------------------------------
    // EVENT HANDLERS FOR ARROW
    this.arrowDomEvHandlers = {
      // KEY : DOM ID

      arrow_fill : function(ev, groupDom, arrow) {
        let newFill = ev.target.value
        arrow.fill = newFill
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'path' && child.id.includes('_arrow')) {
            child.setAttribute('fill', newFill)
          }
        })
      },

      arrow_move : function(ev, groupDom, arrow) {
        //console.log(arrow)

        // ---------------------------------
        // DATA FROM
        let eventFrom = ev.target
        let fromId = eventFrom.getAttribute('id')
        let newValue = ev.target.value

        // attr_arrowArect_x
        let idSplitted = fromId.split('_')
        //let arrowId
        let arrow_which
        let arrow_objName
        let arrow_attrName

        let arrowId = idSplitted[idSplitted.length-2]
        // arrowId -->   arrowArect


        arrow_which = arrowId.replace('arrow', '')[0]                 // A
        arrow_objName = arrowId.substring(6, arrowId.length)          // rect, cir1
        arrow_attrName = idSplitted[idSplitted.length-1]              // x, y ...


        // ---------------------------------
        // DATA TO
        let baseId = groupDom.getAttribute('id')

        //let valueCurrent
        let attrName
        let arrow_objName_new

        // CONVERT DOM ID TO TARGET ID(PART)

        // console.log(arrow_objName)
        // console.log(arrow_attrName)

        switch( arrow_objName ) {
          case 'rect':
            arrow_objName_new = 'posRect'
            if( arrow_attrName === 'x' ) {
              //valueCurrent = parseInt(document.getElementById(baseId + '_' + arrow_which + '_' + arrow_objName_new).getAttribute('x'))
              attrName = 'x'
            } else if( arrow_attrName === 'y' ) {
              //valueCurrent = parseInt(document.getElementById(baseId + '_' + arrow_which + '_' + arrow_objName_new).getAttribute('y'))
              attrName = 'y'
            }
            break
          case 'cir1':
            arrow_objName_new = 'rotCircle_A'
            if( arrow_attrName === 'x' ) {
              //valueCurrent = parseInt(document.getElementById(baseId + '_' + arrow_which + '_' + arrow_objName_new).getAttribute('cx'))
              attrName = 'cx'
            } else if( arrow_attrName === 'y' ) {
              //valueCurrent = parseInt(document.getElementById(baseId + '_' + arrow_which + '_' + arrow_objName_new).getAttribute('cy'))
              attrName = 'cy'
            }
            break
          case 'cir2':
            arrow_objName_new = 'rotCircle_B'
            if( arrow_attrName === 'x' ) {
              //valueCurrent = parseInt(document.getElementById(baseId + '_' + arrow_which + '_' + arrow_objName_new).getAttribute('cx'))
              attrName = 'cx'
            } else if( arrow_attrName === 'y' ) {
              //valueCurrent = parseInt(document.getElementById(baseId + '_' + arrow_which + '_' + arrow_objName_new).getAttribute('cy'))
              attrName = 'cy'
            }
            break
        }


        // APPLYING FINAL VALUE TO PROPER HANDLE
        let targetId = baseId + '_' + arrow_which + '_' + arrow_objName_new
        let targetSVG = document.getElementById(targetId)
        targetSVG.setAttribute(attrName, newValue)

        // console.log(attrName)
        // console.log(newValue)
        // console.log(targetSVG)

        // 2- UPDATE PATH
        //    WITH SETTINGS

        arrow.arrow.update({
          objName: arrow_objName,
          attrName: arrow_attrName
        })


      },

      arrow_zindex : function(ev, groupDom, shape, groupObject) {
        //-// console.log('arrow_zindex EXECUTED')
        //-// console.log(groupObject)

        // CHECK FOR HIGHEST LOWEST VALUE
        // ****  0 INDEX IS 'RECT' SVG ELEMENT FOR CANVAS  ****
        let lowest = 1
        let highest = shape.svgRoot.children.length - 1

        //-// console.log(`    ----    highest   ::    ${highest}`)
        //-// console.log(groupObject.getGroupId())

        let zIndexTo
        if(ev.target.value >= highest) {
          zIndexTo = highest
          ev.target.value = highest
        } else if(ev.target.value <= lowest) {
          zIndexTo = lowest
          ev.target.value = lowest
        } else {
          zIndexTo = ev.target.value
        }
        let zIndexFrom = shape.group.dataset.zIndex

        //-// console.log(`OBJECT'S Z-INDEX :: ${groupObject.group.dataset.zIndex}`)
        //-// console.log(`INPUT DOM VALUE :: ${ev.target.value}`)


        // CALCUALTING DIRECTION TO CHANGE ZINDEX
        // changePlus ->  true :: POSITIVE CHANGE
        //            ->  false :: NEGATIVE CHANGE
        //            ->  undefined :: SAME VALUE -> WILL NOT USE
        let changePlus

        if(zIndexTo - zIndexFrom > 0) {
          changePlus = true
        } else if(zIndexTo - zIndexFrom < 0) {
          changePlus = false
        } else if(zIndexTo - zIndexFrom === 0){
          changePlus = undefined
        }

        //-// console.log(`   %%%%     zIndexFrom ::   ${zIndexFrom}      -----   zIndexTo ::   ${zIndexTo}   -----     changePlus ::  ${changePlus}`)


        // DISPATCHING EVENT THAT ALL ELEMENTS UPDATE THEIR Z INDEX!
        // THIS WILL BE EXECUTED Draw CLASS (BASE CLASS OF ALL 'Drawed' ELEMENTS)
        let evToZIndexMan = new CustomEvent("updateZIndex", {
          bubbles: true,
          detail: {
            obj: shape,
            zIndexFrom: zIndexFrom,
            zIndexTo: zIndexTo,
            changePlus: changePlus
          }
        })
        ev.target.dispatchEvent(evToZIndexMan)



      },
      arrow_color_opacity : function(ev, groupDom, arrow) {
        //-// console.log('ATTRIB MANAGER arrow_color_opacity FUNCTION EXECUTED')
        let newOpacity = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'path' && child.id.includes('_arrow')) {

            child.style.opacity = parseFloat(newOpacity)

          }
        })
      },
    }


    // -------------------------------------------------------
    // EVENT HANDLERS FOR BALL
    this.ballDomEvHandlers = {
      // KEY : DOM ID

      ball_xPos : function(ev, groupDom, shape) {
        let newXPos = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'ellipse') {
            child.setAttribute('cx', newXPos)
          }
        })
      },
      ball_yPos : function(ev, groupDom, shape) {
        let newYPos = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'ellipse') {
            child.setAttribute('cy', newYPos)
          }
        })
      },
      ball_width : function(ev, groupDom, shape) {
        let newWidth = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'ellipse') {
            child.setAttribute('rx', newWidth)
          }
        })
      },
      ball_height : function(ev, groupDom, shape) {
        let newHeight = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'ellipse') {
            child.setAttribute('ry', newHeight)
          }
        })
      },
      ball_color_fill : function(ev, groupDom, shape) {
        let newFill = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'ellipse') {
            child.setAttribute('fill', newFill)
          }
        })
      },
      ball_zindex : function(ev, groupDom, shape, groupObject) {
        //-// console.log('ball_zindex EXECUTED')
        //-// console.log(groupObject)

        // CHECK FOR HIGHEST LOWEST VALUE
        // ****  0 INDEX IS 'RECT' SVG ELEMENT FOR CANVAS  ****
        let lowest = 1
        let highest = shape.svgRoot.children.length - 1

        //-// console.log(`    ----    highest   ::    ${highest}`)
        //-// console.log(groupObject.getGroupId())

        let zIndexTo
        if(ev.target.value >= highest) {
          zIndexTo = highest
          ev.target.value = highest
        } else if(ev.target.value <= lowest) {
          zIndexTo = lowest
          ev.target.value = lowest
        } else {
          zIndexTo = ev.target.value
        }
        let zIndexFrom = shape.group.dataset.zIndex

        //-// console.log(`OBJECT'S Z-INDEX :: ${groupObject.group.dataset.zIndex}`)
        //-// console.log(`INPUT DOM VALUE :: ${ev.target.value}`)


        // CALCUALTING DIRECTION TO CHANGE ZINDEX
        // changePlus ->  true :: POSITIVE CHANGE
        //            ->  false :: NEGATIVE CHANGE
        //            ->  undefined :: SAME VALUE -> WILL NOT USE
        let changePlus

        if(zIndexTo - zIndexFrom > 0) {
          changePlus = true
        } else if(zIndexTo - zIndexFrom < 0) {
          changePlus = false
        } else if(zIndexTo - zIndexFrom === 0){
          changePlus = undefined
        }

        //-// console.log(`   %%%%     zIndexFrom ::   ${zIndexFrom}      -----   zIndexTo ::   ${zIndexTo}   -----     changePlus ::  ${changePlus}`)


        // DISPATCHING EVENT THAT ALL ELEMENTS UPDATE THEIR Z INDEX!
        // THIS WILL BE EXECUTED Draw CLASS (BASE CLASS OF ALL 'Drawed' ELEMENTS)
        let evToUpdateZIndex = new CustomEvent("updateZIndex", {
          bubbles: true,
          detail: {
            obj: shape,
            zIndexFrom: zIndexFrom,
            zIndexTo: zIndexTo,
            changePlus: changePlus
          }
        })
        ev.target.dispatchEvent(evToUpdateZIndex)

        // SEND EVENT TO UPDATE LOCAL STORAGE
        // (FOR ALL OBJECTS)
        //const evToObj = new Event('update_storage_zindex')
        //groupObject.group.dispatchEvent(evToUpdateZIndex)


      },
      ball_color_opacity : function(ev, groupDom, shape) {
        //-// console.log('ATTRIB MANAGER ball_color_opacity FUNCTION EXECUTED')
        let newOpacity = ev.target.value
        groupDom.childNodes.forEach( child => {
          if(child.tagName === 'ellipse') {

            child.style.opacity = parseFloat(newOpacity)

          }
        })
      },
    }




    // -------------------------------------------------------------------
    // THIS FUNCTION SEARCHES THE TYPE OF SHAPE
    // SVG STRUCTURE OF THIS APP IS
    // <g>
    //    <rect>
    //    <text>
    // </g>
    // AS A ONE UNIT ; SO, WE NEED SEARCH THE ELEMENTS BELOW THE GROUP
    this.searchShapeType = (groupDom) => {
      let type

      let pathCheck = true

      // IF THE GROUP CONTAINS <path> ELEMENT, IT WOULD BE HTE ARROW OBJECT
      // SO WE NEED TO EXCLUDE THAT FIRST
      groupDom.childNodes.forEach( child => {
        if( child.tagName === 'path') {
          pathCheck = false
          type = 'ARROW'
        }

      })

      if( pathCheck ) {
        groupDom.childNodes.forEach( child => {
          // EXCLUDING text TAG AND tspan
          //if( child.tagName !== 'text' && child.tagName !== 'tspan') {

          switch( child.tagName ) {
            case 'line':                              // WE CAN HAVE line SVG ELEMENT FOR ALL TYPES
            case 'tspan':
              type = 'TEXTAREA'
              break
            case 'line': 
            case 'text':
              type = 'TEXTAREA'
              break
            case 'line': 
            case 'rect':
              type = 'RECTANGLE'
              break
            case 'line':             
            case 'ellipse':
              type = 'BALL'
              break
            case 'line':   
            case 'foreignObject':
              type = 'BITMAP'
              break
            case 'line':   
            case 'circle':                            
              type = 'CIRCLE'
              break
            // case 'line':                            
            //   type = 'CONNECTION'
            //   break
            default:
              throw new Error(`THERE IS NO MATCHED TYPE --- INPUT -- ${child.tagName}`)
          }

        })

      }

      return type
    }



    // -------------------------------------------------------
    // **** WE NEED TO LISTEN 'BUBBLED' EVENT FROM SVG ELEMENTS !!!
    //      BECAUSE 'attribManager_wrapper' IS NOT PARENT ELEMENT SO
    //      WE NEED 'work_area'
    this.workarea = document.getElementById('workarea')



    // CREATE LOCAL STORAGE FOR ATTRIB BOX
    // **** WE NEED TO STORE DATA FOR 'LOCAL TIMELINE'
    //      'NOT THE ATTRIB BOX' ITSELF !!!
    this.setAttribBox = (ev) => {
      //-// console.log(`setAttribBoxStore() IS EXECUTED  -->  ${ev.detail.groupId}`)
      const groupId = ev.detail.groupId
      const tmlineList = ev.detail.timeline

      let searchedType = this.searchShapeType(document.getElementById(groupId))

      let store = localStorage

      switch(searchedType) {
        // FOR ARROW SHAPE
        // WE NEED TO USE hndId TO
        case 'ARROW':

          // 1. LOAD FROM LOCAL STORAGE
          if(Object.keys(tmlineList).length > 0) {
            // CREATE LOCAL STORAGE
            let data = {}
            //let data[`${}`]
            // COLLECTING hndId WITH TIMELINE NAME
            let hndIdTlNm = {}
            for(let tlName in tmlineList) {
              const hndId = tmlineList[tlName].hndId
              hndIdTlNm[tlName] = hndId
            }

            let strSource = JSON.parse(store[groupId + '_attrbox'])

            for(let tlName in tmlineList) {


              // IF tmlineList[tlName].hndId IS TRUE...
              if(!tlName.includes('fill') && !tlName.includes('opacity')) {

                // ************************
                // FOR ARROW SHAPE, IT HAS 3-DIFFERENT HANDLES WHICH HAS SAME ATTRIBUTES LIKE POSITION
                // SO WE NEED TO EXPAND SLOTS TO STORE THE DATA


                const attrName = tmlineList[tlName].attrName
                let hndIdRaw = tlName.split('_')[1]             // arrowArect
                let hndIndex = hndIdRaw.slice(5,6)              // A,B OR C
                let shapeType = hndIdRaw.slice(6)               // rect

                // CONSTRUCT KEYNAME FOR ATTIBBOX STORAGE
                const attrKeyName = shapeType + hndIndex + attrName           // rectAx
                let keyObj = {}
                keyObj[`${attrName}`] = tmlineList[tlName].keyframes          // **** IT IS IMPORTANT TO MAKE GROUP BEFORE
                                                                              //      SAVE TO LOCAL STORAGE
                strSource[`${attrKeyName}`] = keyObj

                // SAVE TO LOCAL STORAGE
                store[groupId + '_attrbox'] =  JSON.stringify(strSource)


              } else {

                // ************************
                // EVEN ARROW SHAPE, 'OPACITY' AND 'FILL' ATTRIBUTE DOES NOT
                // HAVE HANDLE ID


                const attrName = tmlineList[tlName].attrName

                let keyObj = {}
                keyObj[`${attrName}`] = tmlineList[tlName].keyframes          // **** IT IS IMPORTANT TO MAKE GROUP BEFORE
                                                                              //      SAVE TO LOCAL STORAGE
                strSource[`${attrName}`] = keyObj[`${attrName}`]

                // SAVE TO LOCAL STORAGE
                store[groupId + '_attrbox'] =  JSON.stringify(strSource)


              }

            }

          } else {
            // WHEN INITIALIZATION
            const attrNames = ['rectAx', 'rectAy', 'cir1Ax', 'cir1Ay', 'cir2Ax', 'cir2Ay',
                               'rectBx', 'rectBy', 'cir1Bx', 'cir1By', 'cir2Bx', 'cir2By',
                               'rectCx', 'rectCy', 'cir1Cx', 'cir1Cy', 'cir2Cx', 'cir2Cy',
                               'fill', 'opacity']
            let data = {}
            for(let attrNm of attrNames) {
              // SAVING TO STORAGE
              data[`${attrNm}`] = {}
              store.setItem(groupId + '_attrbox', JSON.stringify(data))
            }
          }
        break



        default:
          // 1. LOAD FROM LOCAL STORAGE
          if(Object.keys(tmlineList).length > 0) {
            // CREATE LOCAL STORAGE
            let data = {}

            for(let tlName in tmlineList) {
              // SAVING TO STORAGE
              data[`${tmlineList[tlName].attrName}`] = tmlineList[tlName].keyframes
              store.setItem(groupId + '_attrbox', JSON.stringify(data))
            }

          } else {
            const attrNames = ['x', 'y', 'width', 'height', 'fill', 'opacity', 'textContent', 'fontFamily']
            let data = {}
            for(let attrNm of attrNames) {
              // SAVING TO STORAGE
              data[`${attrNm}`] = {}
              store.setItem(groupId + '_attrbox', JSON.stringify(data))
            }
          }
        break
      }
    }
    this.workarea.addEventListener('set_attribBox', this.setAttribBox, false)



    // -------------------------------------------------------
    // < OPENING ATTRIBUTE MANAGER >
    // SETTING EVENT LISTENERS FOR SVG-OBJECTS

    this.workarea.addEventListener('attrManagerOn', (event) => {
      //-// console.log(`~~~~   AttribManager :: CUSTOM EVENT - attrManagerOn IS TRIGGERED ! event.target IS -- ${event.target.id}`)

      // DISPLAY ANIM MANAGER
      document.getElementById('animManager_btn').style.display = ''



      // IF THERE IS ALREADY EXISTED AttribBox, RESET THAT
      if(this.attribBoxesAll.length > 0) this.resetAttribBox()


      // FOR RESETTING HANDLES
      const resetHandles = new Event('resetHandles')

      // #### AT FIRST OUR CustomEvent IS CARRYING TEXTAREA OBJECT AND SHAPE
      // SO RETRIEVE IT
      this.selectedObj = this.setSelectedObj(event)


      // ---------------------------------------------------------------
      // GETTING GROUP NODE
      //let groupNode
      // tspan IS 'UNDER' THE TEXT TAG SO WE HAVE TO ADD ONE MORE PARENT
      if( event.target.tagName === 'tspan' ) this.groupNode = event.target.parentElement.parentElement
      else this.groupNode = event.target.parentElement



      // ---------------------------------------------------------
      // FILL AttribManager WITH PICKED UP SVG-OBJECT
      // WE NEED TO SEND 'GROUP' ELEMENT OF SVG STRUCTURE (parent)
      let searchedType = this.searchShapeType(this.selectedObj.group)

      // CREATE ATTRIB BOX
      this.createAttribBox(searchedType, this.selectedObj.group.id)

      switch(searchedType) {

        case 'TEXTAREA':
        case 'TEXTAREA':
          this.allAttribs = AttribManager.getTextAreaAttributes(this.selectedObj.group)
          // MAP TO DOMs
          this.mapTextAreaAttributes(this.allAttribs, this.selectedObj)
          // SETUP EVENT HANDLERS TO ATTRIBUTE PANEL
          this.setTextAreaDomEventListeners(this.selectedObj.group, this.selectedObj)
          break
        case 'RECTANGLE':
          this.allAttribs = AttribManager.getRectAttributes(this.selectedObj.group)
          // MAP TO DOMs
          this.mapRectAttributes(this.allAttribs, this.selectedObj)
          // SETUP EVENT HANDLERS TO ATTRIBUTE PANEL
          this.setRectDomEventListeners(this.selectedObj.group, this.selectedObj)
          break
        case 'BITMAP':
          this.allAttribs = AttribManager.getBitmapAttributes(this.selectedObj.group)
          // MAP TO DOMs
          this.mapBitmapAttributes(this.allAttribs, this.selectedObj)
          // SETUP EVENT HANDLERS TO ATTRIBUTE PANEL
          this.setBitmapDomEventListeners(this.selectedObj.group, this.selectedObj)
          break
        case 'ARROW':    // CASE OF DRAWING CURVE PATH IN SVG ELEMENT
          this.allAttribs = AttribManager.getArrowAttributes(this.selectedObj.group)
          // MAP TO DOMs
          this.mapArrowAttributes(this.allAttribs, this.selectedObj)
          // SETUP EVENT HANDLERS TO ATTRIBUTE PANEL
          this.setArrowDomEventListeners(this.selectedObj.group, this.selectedObj)
          break
        case 'BALL':    // CASE OF DRAWING CURVE PATH IN SVG ELEMENT
          this.allAttribs = AttribManager.getBallAttributes(this.selectedObj.group)
          // MAP TO DOMs
          this.mapBallAttributes(this.allAttribs, this.selectedObj)
          // SETUP EVENT HANDLERS TO ATTRIBUTE PANEL
          this.setBallDomEventListeners(this.selectedObj.group, this.selectedObj)
          break
        case 'CIRCLE':  
          break
        case 'CONNECTION':  
          break
        default:
          throw new Error(`THERE IS NO MATCHED TYPE`)
      }




    })



    // -------------------------------------------------------
    // < UPDATING ATTRIBUTE MANAGER >

    // -------------------------------------------------------
    // EVENT HANDLERS FOR UPDATING ATTRIB BOX
    this.workarea.addEventListener('attrManagerUpdate', (event) => {
      //console.log(`~~~~   AttribManager :: CUSTOM EVENT - attrManagerUpdate IS TRIGGERED ! event.target IS -- ${event.target.id}`)

      // UPDATE ATTRIB BOX FOR HANDLES
      let grpId = event.target.id.split('_')[0]

      // IF THERE IS THE ATTRIB BOX TO RIGHT SIDE OF SCREEN
      if(this.attribBoxesAll[grpId] !== undefined) {

        // THE CASE THAT DATA IS FROM ARROW OBJECT...
        if(event.detail.type === 'ARROW') {
          // ALL ATTRIBUTES
          let attribs = AttribManager.getArrowAttributes(document.getElementById(grpId))
          // PASS REFERENCE TO CLASS VARIABLE
          this.allAttribs = attribs
          // MAP TO DOMs
          this.mapArrowAttributes(attribs, this.selectedObj)

        // THE CASE THAT DATA IS FROM RECTANGLE OBJECT...
        } else if(event.detail.type === 'RECTANGLE') {
          // ALL ATTRIBUTES
          let attribs = AttribManager.getRectAttributes(document.getElementById(grpId))
          // PASS REFERENCE TO CLASS VARIABLE
          this.allAttribs = attribs
          // MAP TO DOMs
          this.mapRectAttributes(attribs, this.selectedObj)

        // THE CASE THAT DATA IS FROM RECTANGLE OBJECT...
        } else if(event.detail.type === 'BITMAP') {
          // ALL ATTRIBUTES
          let attribs = AttribManager.getBitmapAttributes(document.getElementById(grpId))
          // PASS REFERENCE TO CLASS VARIABLE
          this.allAttribs = attribs
          // MAP TO DOMs
          this.mapBitmapAttributes(attribs, this.selectedObj)

        // THE CASE THAT DATA IS FROM RECTANGLE OBJECT...
        } else if(event.detail.type === 'TEXTAREA') {
          // ALL ATTRIBUTES
          let attribs = AttribManager.getTextAreaAttributes(document.getElementById(grpId))
          // PASS REFERENCE TO CLASS VARIABLE
          this.allAttribs = attribs
          // MAP TO DOMs
          this.mapTextAreaAttributes(attribs, this.selectedObj)

        // THE CASE THAT DATA IS FROM BALL OBJECT...
        } else if(event.detail.type === 'BALL') {
          // ALL ATTRIBUTES
          let attribs = AttribManager.getBallAttributes(document.getElementById(grpId))
          // PASS REFERENCE TO CLASS VARIABLE
          this.allAttribs = attribs
          // MAP TO DOMs
          this.mapBallAttributes(attribs, this.selectedObj)
        }

      }
    },true)
    // ****** ABOVE FLAG FOR 'CAPTURING MODE' OF EVENT PROPAGATION IS CRITICAL
    // https://blog.logrocket.com/deep-dive-into-event-bubbling-and-capturing/
    // https://javascript.plainenglish.io/3-phases-of-javascript-event-2ff09aa76b03
    // TODO :: TAKE NOTE ABOVE



    this.workarea.addEventListener('resetAttrBox', ev => {
      //-// console.log('RESET ATTRIB BOX')
      // DISPLAY ANIM MANAGER
      document.getElementById('animManager_btn').style.display = 'none'

      this.resetAttribBox()

    },true)



    this.callAnimManager = (ev) => {
      //-// console.log(`callAnimManager() EVENT HANDLER EXECUTED --  EVENT TARGET =->  ${ev.target}`)

      if(this.selectedObj && !this.animManager) this.animManager = new AnimManager(this.selectedObj)

    }
    document.getElementById('animManager_btn').addEventListener('click', this.callAnimManager, false)




  }


  setSelectedObj(customEventObj) {

    let detail = customEventObj.detail
    let selected = undefined

    if(detail.textAreaObject) {
      selected = detail.textAreaObject
    }

    if(detail.shape) {
      selected = detail.shape
    }

    if(detail.rectObject) {
      selected = detail.rectObject
    }

    if(detail.arrowObject) {
      selected = detail.arrowObject
    }
    
    if(detail.ballObject) {
      selected = detail.ballObject
    }

    if(detail.bitmapObject) {
      selected = detail.bitmapObject
    }

    return selected

  }



  createAttribBox(searchedType, grpId) {
    // --------------------------------------------
    // CREATE AttribBox OBJECT

    // 1. CHECK IF THERE IS NO ATTRIB BOX
    if(Object.keys(this.attribBoxesAll).length === 0) {
      // IF THERE IS NO AttribBox, CREATE NEW ONE
      this.attribBox = new AttribBox()
      this.attribBoxesAll[grpId] = this.attribBox
      this.attribBoxesAll[grpId].initialize(searchedType, grpId)


    } else {
      // IF INPUT GROUP ID IS ALREADY EXISTED IN THE CONTAINER

      // AND 2. CHECK THE INCOMING GROUP ID IS NEWCOMER
      if(this.attribBoxesAll[grpId] === undefined) {
        // RESET PREVIOUS ONE
        let selectedObjBU = this.selectedObj
        this.resetAttribBox()
        this.selectedObj = selectedObjBU

        // CREATE NEW ONE
        this.attribBox = new AttribBox()
        this.attribBoxesAll[grpId] = this.attribBox
        this.attribBoxesAll[grpId].initialize(searchedType, grpId)


      } else if(this.attribBoxesAll[grpId].groupId === grpId) {
        // 3. CHECK IF INCOMING GROUP ID IS SAME AS PREVIOUS ONE
        // RESET PREVIOUS ONE
        let selectedObjBU = this.selectedObj
        this.resetAttribBox()
        this.selectedObj = selectedObjBU

        // JUST USE THAT ATTRIBBOX
        this.attribBoxesAll[grpId].initialize(searchedType, grpId)


      }
    }

  }


  resetAttribBox() {

    // // console.log("resetAttribBox :: RESETTED") 
    // // console.log(this.selectedObj)

    // console.log(gl_SHIFTKEYPRESSED)
    // console.log(this.selectedObj)


    // PUT OUT FROM SELECTED LIST
    if(this.selectedObj && gl_SELECTEDLIST[this.selectedObj.groupId] === this.selectedObj) {
      console.log("resetAttribBox :: RESETTED") 
      //console.log(gl_SHIFTKEYPRESSED) 
      this.selectedObj.selectionManager.removeFromList(this.selectedObj)
    
    }




    // RESET PROCESS
    for(let attribBoxName in this.attribBoxesAll) {
      if(this.attribBoxesAll[attribBoxName]) {
        this.attribBoxesAll[attribBoxName].remove()
      }
    }
    if(this.animManager) {
      this.animManager.remove()
      this.animManager = undefined
    }
    this.selectedObj = undefined
  }


  remove() {
    this.resetAttribBox()
    this.workarea.removeEventListener('set_attribBox', this.setAttribBox, false)

    for(let attribBoxName in this.attribBoxesAll) {
      this.attribBoxesAll[attribBoxName].remove()
    }

    this.textAreaDomEvHandlers = undefined
    this.rectDomEvHandlers = undefined
    this.bitmapDomEvHandlers = undefined
    this.arrowDomEvHandlers = undefined
    this.ballDomEvHandlers = undefined


    this.allAttribs = undefined
    this.groupNode = undefined

    this.textAreaObject = undefined
    this.textArea = undefined

    // TODO :: MATCH THE NAME BELOW !
    this.shape = undefined
    this.rectObject = undefined

    this.bitmap = undefined
    this.bitmapObject = undefined

    this.arrow = undefined
    this.arrowObject = undefined

    this.ball = undefined
    this.ballObject = undefined


    this.attribBoxesAll = {}
    this.attribBox = undefined

    this.selectedObj = undefined
  }




  // -------------------------------------------------------------------
  // REFLECT THE VALUE TO SVG OBJECT
  setTextAreaDomEventListeners(groupDom, textArea) {
    document.getElementById('attr_textarea_textContent').addEventListener('input', (ev) => {
      this.textAreaDomEvHandlers.text_content(ev, groupDom, textArea)
    })

    document.getElementById('attr_textarea_width').addEventListener('input', (ev) => {
      //-// console.log('setRectDomEventListeners() FUNCTION EXECUTED')
      this.textAreaDomEvHandlers.text_width(ev, groupDom, textArea)
    })

    document.getElementById('attr_textarea_fontsize').addEventListener('input', (ev) => {
      this.textAreaDomEvHandlers.text_fontsize(ev, groupDom, textArea)
    })

    document.getElementById('attr_textarea_linemargin').addEventListener('input', (ev) => {
      this.textAreaDomEvHandlers.text_linemargin(ev, groupDom, textArea)
    })

    document.getElementById('attr_textarea_x').addEventListener('input', (ev) => {
      this.textAreaDomEvHandlers.text_xPos(ev, groupDom, textArea)
    })

    document.getElementById('attr_textarea_y').addEventListener('input', (ev) => {
      this.textAreaDomEvHandlers.text_yPos(ev, groupDom, textArea)
    })

    document.getElementById('attr_textarea_fill').addEventListener('input', (ev) => {
      this.textAreaDomEvHandlers.text_color_fill(ev, groupDom, textArea)
    })

    document.getElementById('attr_textarea_zindex').addEventListener('input', (ev) => {
      this.textAreaDomEvHandlers.text_zindex(ev, groupDom, textArea, textArea.textAreaObject)
    })

    document.getElementById('attr_textarea_opacity').addEventListener('input', (ev) => {
      this.textAreaDomEvHandlers.text_color_opacity(ev, groupDom, textArea)
    })
    document.getElementById('attr_textarea_opacity').addEventListener('change', this.forceDecimalsOne)

    // 
    // https://stackoverflow.com/questions/19329978/change-selects-option-and-trigger-events-with-javascript
    document.getElementById('attr_textarea_fontFamily').addEventListener('change', (ev) => {
      this.textAreaDomEvHandlers.text_fontFamily(ev, groupDom, textArea)
    })
  }


  // REFLECT THE VALUE TO SVG OBJECT
  setRectDomEventListeners(groupDom, shape) {

    document.getElementById('attr_rect_x').addEventListener('input', (ev) => {
      this.rectDomEvHandlers.rect_xPos(ev, groupDom, shape)
    })

    document.getElementById('attr_rect_y').addEventListener('input', (ev) => {
      this.rectDomEvHandlers.rect_yPos(ev, groupDom, shape)
    })

    document.getElementById('attr_rect_width').addEventListener('input', (ev) => {
      this.rectDomEvHandlers.rect_width(ev, groupDom, shape)
    })

    document.getElementById('attr_rect_height').addEventListener('input', (ev) => {
      this.rectDomEvHandlers.rect_height(ev, groupDom, shape)
    })

    document.getElementById('attr_rect_fill').addEventListener('input', (ev) => {
      this.rectDomEvHandlers.rect_color_fill(ev, groupDom, shape)
    })

    document.getElementById('attr_rect_zindex').addEventListener('input', (ev) => {
      this.rectDomEvHandlers.rect_zindex(ev, groupDom, shape, this.rectObject)
    })

    document.getElementById('attr_rect_opacity').addEventListener('input', (ev) => {
      this.rectDomEvHandlers.rect_color_opacity(ev, groupDom, shape)
    })
    document.getElementById('attr_rect_opacity').addEventListener('change', this.forceDecimalsOne)

  }

  // REFLECT THE VALUE TO SVG OBJECT
  setBitmapDomEventListeners(groupDom, shape) {

    document.getElementById('attr_bitmap_x').addEventListener('input', (ev) => {
      this.bitmapDomEvHandlers.bitmap_xPos(ev, groupDom, shape)
    })

    document.getElementById('attr_bitmap_y').addEventListener('input', (ev) => {
      this.bitmapDomEvHandlers.bitmap_yPos(ev, groupDom, shape)
    })

    document.getElementById('attr_bitmap_width').addEventListener('input', (ev) => {
      this.bitmapDomEvHandlers.bitmap_width(ev, groupDom, shape)
    })

    document.getElementById('attr_bitmap_height').addEventListener('input', (ev) => {
      this.bitmapDomEvHandlers.bitmap_height(ev, groupDom, shape)
    })

    document.getElementById('attr_bitmap_zindex').addEventListener('input', (ev) => {
      this.bitmapDomEvHandlers.bitmap_zindex(ev, groupDom, shape, this.bitmapObject)
    })

    document.getElementById('attr_bitmap_opacity').addEventListener('input', (ev) => {
      this.bitmapDomEvHandlers.bitmap_color_opacity(ev, groupDom, shape)
    })
    document.getElementById('attr_bitmap_opacity').addEventListener('change', this.forceDecimalsOne)

  }

  // REFLECT THE VALUE TO SVG OBJECT
  setArrowDomEventListeners(groupDom, arrow) {

    document.getElementById('attr_arrow_fill').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_fill(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowArect_x').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowArect_y').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowAcir1_x').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowAcir1_y').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowAcir2_x').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowAcir2_y').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowBrect_x').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowBrect_y').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowBcir1_x').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowBcir1_y').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowBcir2_x').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowBcir2_y').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowCrect_x').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowCrect_y').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowCcir1_x').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowCcir1_y').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowCcir2_x').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrowCcir2_y').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_move(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrow_zindex').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_zindex(ev, groupDom, arrow, this.arrowObject)
    })
    document.getElementById('attr_arrow_opacity').addEventListener('input', (ev) => {
      this.arrowDomEvHandlers.arrow_color_opacity(ev, groupDom, arrow)
    })
    document.getElementById('attr_arrow_opacity').addEventListener('change', this.forceDecimalsOne)
  }


  // REFLECT THE VALUE TO SVG OBJECT
  setBallDomEventListeners(groupDom, shape) {

    document.getElementById('attr_ball_x').addEventListener('input', (ev) => {
      this.ballDomEvHandlers.ball_xPos(ev, groupDom, shape)
    })

    document.getElementById('attr_ball_y').addEventListener('input', (ev) => {
      this.ballDomEvHandlers.ball_yPos(ev, groupDom, shape)
    })

    document.getElementById('attr_ball_width').addEventListener('input', (ev) => {
      this.ballDomEvHandlers.ball_width(ev, groupDom, shape)
    })

    document.getElementById('attr_ball_height').addEventListener('input', (ev) => {
      this.ballDomEvHandlers.ball_height(ev, groupDom, shape)
    })

    document.getElementById('attr_ball_fill').addEventListener('input', (ev) => {
      this.ballDomEvHandlers.ball_color_fill(ev, groupDom, shape)
    })

    document.getElementById('attr_ball_zindex').addEventListener('input', (ev) => {
      this.ballDomEvHandlers.ball_zindex(ev, groupDom, shape, this.selectedObj)
    })

    document.getElementById('attr_ball_opacity').addEventListener('input', (ev) => {
      this.ballDomEvHandlers.ball_color_opacity(ev, groupDom, shape)
    })
    document.getElementById('attr_ball_opacity').addEventListener('change', this.forceDecimalsOne)

  }


  // -------------------------------------------------------------------
  mapTextAreaAttributes(attribs, selectedObj){
    // MAPPING TO DOMS


    // ----------------------------------------------
    // TEXT PROCESSING
    let txtSpans = attribs.textElem.textSpans

    // TEXTSPAN DATA INCLUDES 'dataset.enter' ATTRIBUTE IN SVG ELEMENT
    // SO WE NEED TO CONCATENATE ALL STRINGS IN THE TSPANS WITH INSERTING LINEFEED SYMBOL "&#13;&#10;"
    let linefeedSymbol = "&#13;&#10;"

    let concatString = ""

    for( let i = 0; i < txtSpans.length; i++ ) {

      // LINE FEED INDEX
      let linefeedFlag = false

      if( txtSpans[i].dataset.enter === "true") {
        linefeedFlag = true
      }
      if (linefeedFlag) concatString += linefeedSymbol

      concatString += txtSpans[i].textContent
    }


    // COLLECTING POSITIONS FROM OBJECT




    // ----------------------------------------------------
    // SETTING ATTRIB BOX DOM
    let attr_textArea = document.getElementById('attr_textarea_textContent')
    let attr_textArea_width = document.getElementById('attr_textarea_width')
    let attr_textArea_fontsize = document.getElementById('attr_textarea_fontsize')
    let attr_textArea_linemargin = document.getElementById('attr_textarea_linemargin')
    let attr_textArea_xPos = document.getElementById('attr_textarea_x')
    let attr_textArea_yPos = document.getElementById('attr_textarea_y')
    let attr_textArea_fill = document.getElementById('attr_textarea_fill')
    let attr_textArea_opacity = document.getElementById('attr_textarea_opacity')
    let attr_textArea_zIndex = document.getElementById('attr_textarea_zindex')
    let attr_textArea_fontFamily = document.getElementById('attr_textarea_fontFamily')

    if(attr_textArea) attr_textArea.innerHTML = concatString
    if(attr_textArea_width) attr_textArea_width.setAttribute('value', selectedObj.textAreaObject.width)
    if(attr_textArea_fontsize) attr_textArea_fontsize.setAttribute('value', selectedObj.textAreaObject.fontSize)
    if(attr_textArea_linemargin) attr_textArea_linemargin.setAttribute('value', selectedObj.textAreaObject.lineMargin)

    if(attr_textArea_xPos) attr_textArea_xPos.setAttribute('value', selectedObj.textAreaObject.posX)
    if(attr_textArea_yPos) attr_textArea_yPos.setAttribute('value', selectedObj.textAreaObject.posY)

    if(attr_textArea_fill) attr_textArea_fill.value = selectedObj.textAreaObject.fill
    if(attr_textArea_opacity) attr_textArea_opacity.value = selectedObj.textAreaObject.opacity.toFixed(1)
    if(attr_textArea_zIndex) attr_textArea_zIndex.value = selectedObj.group.dataset.zIndex
    if(attr_textArea_fontFamily) attr_textArea_fontFamily.value = selectedObj.group.dataset.fontName

  }


  // THIS FUNCTION DISPLAY SVG'S ATTRIBUTES TO ATTRIBUTE PANEL (HTML DOM)
  mapRectAttributes(attribs, selectedObj){
    let xPos = document.getElementById('attr_rect_x')
    let yPos = document.getElementById('attr_rect_y')
    let width = document.getElementById('attr_rect_width')
    let height = document.getElementById('attr_rect_height')
    let fill = document.getElementById('attr_rect_fill')
    let opacity = document.getElementById('attr_rect_opacity')
    let zindex = document.getElementById('attr_rect_zindex')

    if(xPos) xPos.value = attribs.rectElem.x
    if(yPos) yPos.value = attribs.rectElem.y
    if(width) width.value = attribs.rectElem.width
    if(height) height.value = attribs.rectElem.height
    if(fill) fill.value = attribs.rectElem.fill
    if(opacity) opacity.value = parseFloat(attribs.rectElem.opacity).toFixed(1)
    if(zindex) zindex.value = selectedObj.group.dataset.zIndex

  }


  // THIS FUNCTION DISPLAY SVG'S ATTRIBUTES TO ATTRIBUTE PANEL (HTML DOM)
  mapBitmapAttributes(attribs, selectedObj){
    let xPos = document.getElementById('attr_bitmap_x')
    let yPos = document.getElementById('attr_bitmap_y')
    let width = document.getElementById('attr_bitmap_width')
    let height = document.getElementById('attr_bitmap_height')
    let opacity = document.getElementById('attr_bitmap_opacity')
    let zindex = document.getElementById('attr_bitmap_zindex')

    if(xPos) xPos.value = attribs.bitmapElem.x
    if(yPos) yPos.value = attribs.bitmapElem.y
    if(width) width.value = attribs.bitmapElem.width
    if(height) height.value = attribs.bitmapElem.height
    if(opacity) opacity.value = parseFloat(attribs.bitmapElem.opacity).toFixed(1)
    if(zindex) zindex.value = selectedObj.group.dataset.zIndex

  }

  // THIS FUNCTION DISPLAY SVG'S ATTRIBUTES TO ATTRIBUTE PANEL (HTML DOM)
  mapArrowAttributes(attribs, selectedObj){
    // MAPPING TO DOMS

    // RETRIEVING INFORMATION FOR ARROW
    let arrowElem = attribs.arrowElem
    let arrowElemId = attribs.arrowElem.id
    let arrowElemFill = attribs.arrowElem.fill
    let arrowElemOpacity = attribs.arrowElem.opacity

    // RETRIEVING INFORMATION FOR HANDLES
    let arrowAcircleA = attribs.arrowAcircleA
    let arrowAcircleB = attribs.arrowAcircleB
    let arrowArect = attribs.arrowArect
    let arrowBcircleA = attribs.arrowBcircleA
    let arrowBcircleB = attribs.arrowBcircleB
    let arrowBrect = attribs.arrowBrect
    let arrowCcircleA = attribs.arrowCcircleA
    let arrowCcircleB = attribs.arrowCcircleB
    let arrowCrect = attribs.arrowCrect


    let attr_arrow_color_fill = document.getElementById('attr_arrow_fill')
    let attr_arrow_color_opacity = document.getElementById('attr_arrow_opacity')
    let attr_arrowArect_x = document.getElementById('attr_arrowArect_x')
    let attr_arrowArect_yPos = document.getElementById('attr_arrowArect_y')
    let attr_arrowAcir1_x = document.getElementById('attr_arrowAcir1_x')
    let attr_arrowAcir1_y = document.getElementById('attr_arrowAcir1_y')
    let attr_arrowAcir2_x = document.getElementById('attr_arrowAcir2_x')
    let attr_arrowAcir2_y = document.getElementById('attr_arrowAcir2_y')

    let attr_arrowBrect_x = document.getElementById('attr_arrowBrect_x')
    let attr_arrowBrect_y = document.getElementById('attr_arrowBrect_y')
    let attr_arrowBcir1_x = document.getElementById('attr_arrowBcir1_x')
    let attr_arrowBcir1_y = document.getElementById('attr_arrowBcir1_y')
    let attr_arrowBcir2_x = document.getElementById('attr_arrowBcir2_x')
    let attr_arrowBcir2_y = document.getElementById('attr_arrowBcir2_y')

    let attr_arrowCrect_x = document.getElementById('attr_arrowCrect_x')
    let attr_arrowCrect_y = document.getElementById('attr_arrowCrect_y')
    let attr_arrowCcir1_x = document.getElementById('attr_arrowCcir1_x')
    let attr_arrowCcir1_y = document.getElementById('attr_arrowCcir1_y')
    let attr_arrowCcir2_x = document.getElementById('attr_arrowCcir2_x')
    let attr_arrowCcir2_y = document.getElementById('attr_arrowCcir2_y')

    let attr_arrow_zindex = document.getElementById('attr_arrow_zindex')


    // FOR ARROW
    if(attr_arrow_color_fill) attr_arrow_color_fill.value = arrowElemFill
    if(attr_arrow_color_opacity) attr_arrow_color_opacity.value = parseFloat(arrowElemOpacity).toFixed(1)

    // FOR HANDLES
    if(attr_arrowArect_x) attr_arrowArect_x.value = arrowArect.posX
    if(attr_arrowArect_yPos) attr_arrowArect_yPos.value = arrowArect.posY
    if(attr_arrowAcir1_x) attr_arrowAcir1_x.value = arrowAcircleA.posX
    if(attr_arrowAcir1_y) attr_arrowAcir1_y.value = arrowAcircleA.posY
    if(attr_arrowAcir2_x) attr_arrowAcir2_x.value = arrowAcircleB.posX
    if(attr_arrowAcir2_y) attr_arrowAcir2_y.value = arrowAcircleB.posY

    if(attr_arrowBrect_x) attr_arrowBrect_x.value = arrowBrect.posX
    if(attr_arrowBrect_y) attr_arrowBrect_y.value = arrowBrect.posY
    if(attr_arrowBcir1_x) attr_arrowBcir1_x.value = arrowBcircleA.posX
    if(attr_arrowBcir1_y) attr_arrowBcir1_y.value = arrowBcircleA.posY
    if(attr_arrowBcir2_x) attr_arrowBcir2_x.value = arrowBcircleB.posX
    if(attr_arrowBcir2_y) attr_arrowBcir2_y.value = arrowBcircleB.posY

    if(attr_arrowCrect_x) attr_arrowCrect_x.value = arrowCrect.posX
    if(attr_arrowCrect_y) attr_arrowCrect_y.value = arrowCrect.posY
    if(attr_arrowCcir1_x) attr_arrowCcir1_x.value = arrowCcircleA.posX
    if(attr_arrowCcir1_y) attr_arrowCcir1_y.value = arrowCcircleA.posY
    if(attr_arrowCcir2_x) attr_arrowCcir2_x.value = arrowCcircleB.posX
    if(attr_arrowCcir2_y) attr_arrowCcir2_y.value = arrowCcircleB.posY

    if(attr_arrow_zindex) attr_arrow_zindex.value = selectedObj.group.dataset.zIndex

  }


  // THIS FUNCTION DISPLAY SVG'S ATTRIBUTES TO ATTRIBUTE PANEL (HTML DOM)
  mapBallAttributes(attribs, selectedObj){
    let xPos = document.getElementById('attr_ball_x')
    let yPos = document.getElementById('attr_ball_y')
    let width = document.getElementById('attr_ball_width')
    let height = document.getElementById('attr_ball_height')
    let fill = document.getElementById('attr_ball_fill')
    let opacity = document.getElementById('attr_ball_opacity')
    let zindex = document.getElementById('attr_ball_zindex')

    if(xPos) xPos.value = attribs.ballElem.x
    if(yPos) yPos.value = attribs.ballElem.y
    if(width) width.value = attribs.ballElem.width
    if(height) height.value = attribs.ballElem.height

    if(attribs.ballElem.fill !== "url(#gradient-ball)") {
      if(fill) fill.value = attribs.ballElem.fill
    } else {
      if(fill) fill.value = "#000000"
    }
    

    if(opacity) opacity.value = parseFloat(attribs.ballElem.opacity).toFixed(1)
    if(zindex) zindex.value = selectedObj.group.dataset.zIndex

  }




  // -------------------------------------------------------------------
  static getTextAreaAttributes(groupDom) {
    //-// console.log(`%% AttribManager.js :: GETTING ATTRIBUTE ---  ${groupDom}`)
    // GETTING text ELEMENT EITHER
    let textElem
    groupDom.childNodes.forEach( child => {
      if (child.tagName === 'text') {
        // FOR TEXT ELEMENT IN SVG
        // WE NEED TO STORE TSPAN ELEMENT !
        textElem = {
          type: 'TEXT',
          id: child.id,
          textSpans: child.children
        }
      }
    })
    return {
      textElem
    }
  }




  static getRectAttributes(groupDom) {
    //-// console.log(`%% AttribManager.js :: GETTING ATTRIBUTE ---  ${groupDom}`)

    // GETTING rect AND text ELEMENT EITHER
    let rectElem

    groupDom.childNodes.forEach( child => {
      if(child.tagName === 'rect') {

        rectElem = {
          type: 'RECTANGLE',
          id: child.id,
          x: child.x.baseVal.value,
          y: child.y.baseVal.value,
          width: child.width.baseVal.value,
          height: child.height.baseVal.value,
          fill: child.getAttribute('fill'),
          opacity: child.style.opacity,
          stroke: child.getAttribute('stroke'),
          strokeWidth: child.getAttribute('stroke-width'),
          rx: child.getAttribute('rx')
        }

      }

    })

    return {
      rectElem
    }

  }


  static getBitmapAttributes(groupDom) {
    //-// console.log(`%% AttribManager.js :: GETTING ATTRIBUTE ---  ${groupDom}`)

    // GETTING rect AND text ELEMENT EITHER
    let bitmapElem

    groupDom.childNodes.forEach( child => {
      if(child.tagName === 'foreignObject') {

        bitmapElem = {
          type: 'BITMAP',
          id: child.id,
          x: child.x.baseVal.value,
          y: child.y.baseVal.value,
          width: child.width.baseVal.value,
          height: child.height.baseVal.value,
          opacity: child.style.opacity,
        }

      }

    })

    return {
      bitmapElem
    }

  }




  // COLLECTING ATTRIBUTES
  static getArrowAttributes(groupDom) {
    //-// console.log(`%% AttribManager.js :: GETTING ATTRIBUTE ---  ${groupDom}`)

    // GETTING PATH ELEMENT OF ARROW AND HANDLE ELEMENTS
    let arrowElem
    //let arrowElemList = []

    let arrowArect
    let arrowAcircleA
    let arrowAcircleB
    let arrowBrect
    let arrowBcircleA
    let arrowBcircleB
    let arrowCrect
    let arrowCcircleA
    let arrowCcircleB

    // STRUCTURE FOR HANDLE IS
    // <g>
    //   <path>    -> ARROW
    //   <g>       -> HANDLE A
    //   <g>       -> HANDLE B
    //   <g>       -> HANDLE C
    groupDom.childNodes.forEach( child => {
      if(child.tagName === 'path') {

        arrowElem = {
          type: 'ARROW_BODY',
          id: child.id,
          fill: child.getAttribute('fill'),
          opacity: child.style.opacity
        }

      } else if( child.tagName === 'g') {

        //-// console.log(child.id)
        // ID WILL BE LIKE,
        // 1306ed20-dc43-45ea-a0d0-836c7c72085cAgrp

        // RETRIEVE HANDLE'S NAME (A,B OR C)
        let arrowNameArray = child.id.split('_')
        let arrowName = arrowNameArray[arrowNameArray.length-2]
        //-// console.log(arrowName)

        let arrowElems = child.children

        // FOR HANDLE A
        if( arrowName === 'A') {

          for(let elem of arrowElems) {

            if(elem.tagName === 'rect' && elem.id.includes('posRect')) {
              arrowArect = {
                id: elem.id,
                posX: elem.getAttribute('x'),
                posY: elem.getAttribute('y')
              }
            } else if(elem.tagName === 'circle' && elem.id.includes('rotCircle_A')){
              arrowAcircleA = {
                id: elem.id,
                posX: elem.getAttribute('cx'),
                posY: elem.getAttribute('cy')
              }
            } else if(elem.tagName === 'circle' && elem.id.includes('rotCircle_B')){
              arrowAcircleB = {
                id: elem.id,
                posX: elem.getAttribute('cx'),
                posY: elem.getAttribute('cy')
              }
            }
          }
        }

        // FOR HANDLE B
        if( arrowName === 'B') {

          for(let elem of arrowElems) {

            if(elem.tagName === 'rect' && elem.id.includes('posRect')) {
              arrowBrect = {
                id: elem.id,
                posX: elem.getAttribute('x'),
                posY: elem.getAttribute('y')
              }
            } else if(elem.tagName === 'circle' && elem.id.includes('rotCircle_A')){
              arrowBcircleA = {
                id: elem.id,
                posX: elem.getAttribute('cx'),
                posY: elem.getAttribute('cy')
              }
            } else if(elem.tagName === 'circle' && elem.id.includes('rotCircle_B')){
              arrowBcircleB = {
                id: elem.id,
                posX: elem.getAttribute('cx'),
                posY: elem.getAttribute('cy')
              }
            }
          }
        }

        // FOR HANDLE C
        if( arrowName === 'C') {

          for(let elem of arrowElems) {

            if(elem.tagName === 'rect' && elem.id.includes('posRect')) {
              arrowCrect = {
                id: elem.id,
                posX: elem.getAttribute('x'),
                posY: elem.getAttribute('y')
              }
            } else if(elem.tagName === 'circle' && elem.id.includes('rotCircle_A')){
              arrowCcircleA = {
                id: elem.id,
                posX: elem.getAttribute('cx'),
                posY: elem.getAttribute('cy')
              }
            } else if(elem.tagName === 'circle' && elem.id.includes('rotCircle_B')){
              arrowCcircleB = {
                id: elem.id,
                posX: elem.getAttribute('cx'),
                posY: elem.getAttribute('cy')
              }
            }
          }
        }


      }

    })

    return {
      arrowElem,
      arrowArect,
      arrowAcircleA,
      arrowAcircleB,
      arrowBrect,
      arrowBcircleA,
      arrowBcircleB,
      arrowCrect,
      arrowCcircleA,
      arrowCcircleB
    }

  }



  static getBallAttributes(groupDom) {
    //-// console.log(`%% AttribManager.js :: GETTING ATTRIBUTE ---  ${groupDom}`)

    // GETTING ball AND text ELEMENT EITHER
    let ballElem

    groupDom.childNodes.forEach( child => {
      if(child.tagName === 'ellipse') {

        ballElem = {
          type: 'BALL',
          id: child.id,
          x: child.cx.baseVal.value,
          y: child.cy.baseVal.value,
          width: child.rx.baseVal.value,
          height: child.ry.baseVal.value,
          fill: child.getAttribute('fill'),
          opacity: child.style.opacity,
          stroke: child.getAttribute('stroke'),
          strokeWidth: child.getAttribute('stroke-width')
        }

      }

    })

    return {
      ballElem
    }

  }



  // FORCE TO INPUT VALUE TO DECIMALS
  // https://stackoverflow.com/questions/38972448/force-input-number-decimal-places-natively
  forceDecimalsOne(event) {
    event.target.value = parseFloat(event.target.value).toFixed(1);
  }

  forceDecimalsTwo(event) {
  	event.target.value = parseFloat(event.target.value).toFixed(2);
  }


}



export {AttribManager}
