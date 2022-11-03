'use strict'

import { Draw }             from "./Draw.mjs"
import { Security }         from "./Security.mjs"
import { TextArea }         from "./TextArea.mjs"
import { DraggableScreen }  from "./DraggableScreen.mjs"
import { ZIndexManager }    from "./ZIndexManager.mjs"
import { LocalStorage }     from "./LocalStorage.mjs"


// DRAW SVG OBJECT : RECTANGLE SHAPE

class DrawTextArea extends Draw {

  constructor(settings, stateObj) {
    //-// console.log('%% DrawTextArea.mjs :: DrawTextArea CONSTRUCTOR EXECUTED')
    
    const superClass = super()

    const settingsToSuper = {
      stateObj: stateObj,
      currentObj: this
    }
    superClass.initialize(settingsToSuper)


    // ------------------------------------
    // CREATE SVG ELEMENT
    this.svgRoot = document.getElementById('canvas_dom')
    this.group = document.createElementNS(this.nsSvg, 'g')
    this.svgDom = document.createElementNS(this.nsSvg, 'text')


    // ------------------------------------
    // CREATING LocalStorage OBJECT
    const localStrSettings = {
      evDispatcher: this.group
    }
    this.localStorage = new LocalStorage(localStrSettings)

    this.animStore = {}


    // ------------------------------------
    this.textAreaSettings
    this.textContentControlId = 'attr_textarea'


    // ------------------------------------
    // SETTING NEW ID
    if(!this.groupId) {
      this.groupId = new Security().getUUIDv4()
    }


    // ======================================================================
    // PRELOADING (LOCAL STORAGE)
    // ======================================================================


    // ------------------------------------
    // PRELOADING (IF NECESSARY)
    // 1. DATA LOADING FROM LOCAL STORAGE
    if(settings.isStored) {

      this.preload(settings)

    } else {

      // 2. CREATION ROUTE
      this.textAreaSettings = {
        id: this.groupId + '_textarea',
        text: "INPUT TEXT &#13;&#10;USING &#13;&#10;Attributes &#13;&#10;PANEL",
        width: settings.width,
        height: settings.height,
        x: settings.x,
        y: settings.y,
        lineMargin: settings.lineMargin,
        fill: settings.fill,
        opacity: parseFloat(settings.opacity),
        fontName: settings.fontName
      }

    }



    // ------------------------------------
    // STORING TIMELINES FOR ATTRIBUTES
    this.timelines = {}


    // ------------------------------------
    // TEXT AREA
    let txtArea = new TextArea()


    this.textAreaObject = txtArea.initialize(this.textAreaSettings)

    // ------------------------------------
    this.group.setAttribute("id", this.groupId)

    // TODO :: CURRENTLY WE DO NOT NEED THIS FOR DRAGGING ELEMENTS
    // BELOW THIS GROUP !
    //this.group.setAttribute("transform", `translate( ${settings.x}, ${settings.y})`)

    this.svgRoot.appendChild(this.group)


    // ------------------------------------
    // CREATE INITIAL TEXT SVG OBJECT (TSPANS !!)

    // GETTING BBOX OF TEXT ELEMENT
    // https://stackoverflow.com/questions/1636842/svg-get-text-element-width
    // var bbox = textElement.getBBox();
    // var width = bbox.width;
    // var height = bbox.height;
    //
    this.svgDom.setAttribute("id", this.groupId + '_textarea')

    // ------------------------------------------------------------------
    // STORING DATA TO DOM
    // USING <text> ELEMENT'S x,y ATTRIBUTES AS SAVING PURPOSE OF
    // POSITION OF FIRST <tspan>
    this.group.setAttribute("fill", this.textAreaObject.tspans[0].getAttribute('fill'))
    this.group.dataset.fill = this.textAreaObject.tspans[0].getAttribute('fill')
    this.group.dataset.fontSize = this.textAreaObject.fontSize
    this.group.dataset.fontName = this.textAreaObject.fontName
    this.group.dataset.lineMargin = this.textAreaObject.lineMargin
    this.group.dataset.opacity = this.textAreaObject.opacity


    // APPEND TSPANS TO TEXT ELEMENT
    for( let i = 0; i < this.textAreaObject.tspans.length; i++ ) {
      this.svgDom.appendChild(this.textAreaObject.tspans[i])
    }

    this.textAreaObject.setLineFeedIndex()
    this.group.appendChild(this.svgDom)


    // ------------------------------------
    // POSITIONING
    this.anchorPosX
    this.anchorPosY


    this.group.setAttribute('transform', `translate(${this.textAreaObject.posX}, ${this.textAreaObject.posY})`)

    // ------------------------------------
    // ZIndexManager
    this.ZIndexManager = new ZIndexManager({
      groupId: this.group.id
    })
    this.group.dataset.zIndex = this.ZIndexManager.getIndex(this.group.id)
    //-// console.log(`this.group.id  ::  ${this.group.id}    -----    this.zIndex  ::    ${this.group.dataset.zIndex}`)



    // ----------------------------------------------------------------------
    // < OBSERVER AND EVENT LISTENERS >
    // ------------------------------------
    // OBSERVER SETTINGS
    const observeConfig = {
      attributes: true,
      subtree: false
    }

    // -----------------------------------------------------------
    // < DISPATCHING EVENT WITH DATA >
    // USING CustomEvent
    // WE ARE CREATING CustomEvent OBJECT WITH TextArea OBJECT !
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    let eventWithTextArea = new CustomEvent('attrManagerOn', {
      bubbles: true,                                            // TODO :: DOCUMENT THIS!
                                                                //         THIS IS CIRITICAL TO BUBBLING UP !!
      detail: {
        type: 'TEXTAREA',
        textAreaObject: this,
        //superClass: superClass
        //textArea: this.textAreaObject
      }
    })

    let updateWithTextArea = new CustomEvent('attrManagerUpdate', {
      bubbles: true,                                            // TODO :: DOCUMENT THIS!
                                                                //         THIS IS CIRITICAL TO BUBBLING UP !!
      detail: {
        type: 'TEXTAREA',
        // textGroup: this.group,
        // textArea: this.textAreaObject,
        textAreaObject: this
      }
    })



    // ----------------------------------------------------------------------
    // STORING LINEHEIGHT
    //this.lineHeightStore = parseInt(this.group.dataset.lineMargin) + parseInt(this.group.dataset.fontSize)
    this.lineHeightStore = this.textAreaObject.lineMargin + this.textAreaObject.fontSize




    // ======================================================================
    // MUTATION OBSERVERS & HANDLERS
    // ======================================================================



    // ----------------------------------------------------------------------
    // FOR SCREEN DRAGGING OBJECT
    // < POSITION X, Y >


    //https://blog.frankmtaylor.com/2017/06/16/promising-a-mutation-using-mutationobserver-and-promises-together/
    
    // < MUTATION OBSERVER CONFIGS >
    // 
    // ChildList
    // Have elements been added/removed directly in this element?
    // Attributes
    // Has the element had any changes to attributes?
    // CharacterData
    // Has any text inside of the element changed?
    // Subtree
    // Have elements more than one level deep changed?
    // AttributeOldValue
    // Do you want the original value of the attribute?
    // CharacterDataOldValue
    // Do you want the original text of the element?
    // AttributeFilter
    // What specific attributes should be watched?
    // All we want to know is if a class name is changing. Easy enough!

    this.screenDrag = new DraggableScreen()
    this.mutationHandler = (mutationList, observer) => {
      for(const mutation of mutationList) {
        if( mutation.type === 'attributes' ) {
          //-// console.log(`${mutation.target.id} :::   ${mutation.attributeName}   WAS MODIFIED`)

          //console.log(`mutation.target.dataset.xPos   --   ${mutation.target.dataset.xPos}`)
          //console.log(`mutation.target.dataset.yPos   --   ${mutation.target.dataset.yPos}`)

          // ***** OUR CANVAS CAN BE PANNED, BUT,
          //       ev.clientX AND Y POSITION DOES NOT CARE THAT,
          //       SO WE NEED TO CALCULATE DIFFERENCE BETWEEN THE CANVAS'S POSITION
          //       +
          //       AND THE VALUES ARE INVERTED TO MINUS VALUE WHEN WE DRAG TO PLUS DIRECTION -> "INVERTING IS REQUIRED"
          const canvasPannedX = parseInt(document.getElementById('canvas_dom').getAttribute('x'))
          const canvasPannedY = parseInt(document.getElementById('canvas_dom').getAttribute('y'))

          // ***** AND, WE NEED TO SCALE THE POSITION FROM ZOOMING OUR CANVAS !!!!
          let zoomScaleForMultiply = parseFloat(document.getElementById('zoom_select').dataset.panScaler)
          //let zoomFromOne = 1.0 - parseFloat(document.getElementById('zoom_select').dataset.panScaler) + 1.0
          
          // ===============================================================
          // getBoundingClientRect() IS FIXED VALUE WHEN WE ZOOMED IN OR OUT
          // **************************************
          // ------------- 
          // RETURN ::
          //
          // bottom: 1228
          // height: 1196
          // left: 60
          // right: 1548
          // top: 32
          // width: 1488
          // x: 60
          // y: 32
          //
          let fromRect = this.svgRoot.getBoundingClientRect()

          // console.log("+++++++++++")

          // console.log(`canvasPannedX ::  ${canvasPannedX}`)
          // console.log(`canvasPannedY ::  ${canvasPannedY}`)

          // console.log(`zoomScaleForMultiply ::  ${zoomScaleForMultiply}`)
          
          // console.log(`fromRect.left ::  ${fromRect.left}`)
          // console.log(`fromRect.top ::  ${fromRect.top}`)

          // console.log(`parseInt(mutation.target.dataset.xPos) ::  ${parseInt(mutation.target.dataset.xPos)}`)
          // console.log(`parseInt(mutation.target.dataset.yPos) ::  ${parseInt(mutation.target.dataset.yPos)}`)
          
          // console.log(`this.anchorPosX ::  ${this.anchorPosX}`)
          // console.log(`this.anchorPosY ::  ${this.anchorPosY}`)


          //this.anchorPosX = Math.floor(mappedPosition.x) * parseFloat(document.getElementById('zoom_select').dataset.panScaler)
          //this.anchorPosY = Math.floor(mappedPosition.y) * parseFloat(document.getElementById('zoom_select').dataset.panScaler)


          let xPos = parseInt(mutation.target.dataset.xPos) - canvasPannedX - fromRect.left - parseInt(this.svgRoot.dataset.xSaved)
          let yPos = parseInt(mutation.target.dataset.yPos) - canvasPannedY - fromRect.top - parseInt(this.svgRoot.dataset.ySaved)

          // SCALE WITH CANVAS ZOOM VALUE
          xPos *= zoomScaleForMultiply
          yPos *= zoomScaleForMultiply

          this.textAreaObject.posX = parseInt(xPos -  this.anchorPosX)
          this.textAreaObject.posY = parseInt(yPos -  this.anchorPosY - this.textAreaObject.tspans[0].getExtentOfChar(0).y)
          //                                                                                 ~~~~~~~~~~~~~~~~~~~~


          // console.log(`this.textAreaObject.posX ::  ${this.textAreaObject.posX}`)
          // console.log(`this.textAreaObject.posY ::  ${this.textAreaObject.posY}`)


          // ----------------------------------------
          // UPDATE BOUNDING BOX EITHER !!!!
          superClass.updateBoundingBox({
            x: this.textAreaObject.posX,
            y: this.textAreaObject.posY + this.svgDom.getBBox().y,
            width: this.svgDom.getBBox().width,
            height: this.svgDom.getBBox().height
          })




          // =================================================================================================
          // TODO:: **** NOTE BELOW ABSOLUTELY ****
          // 
          // < getExtentOfChar() IN SVGTextContentElement >
          // https://developer.mozilla.org/en-US/docs/Web/API/SVGTextContentElement
          // https://stackoverflow.com/questions/22218456/how-to-get-the-position-and-width-of-a-tspan-element
          // 
          // < SVGTextContentElement.getExtentOfChar() >
          // ::  Returns a DOMRect representing the computed tight bounding box of the glyph cell 
          //     that corresponds to a given typographic character.
          //
          //
          //console.log(this.textAreaObject.tspans[0].getExtentOfChar(0))

          //-// console.log(parseFloat(document.getElementById('zoom_select').dataset.panScaler))


          // APPLYING VALUE
          this.group.setAttribute('transform', `translate(${this.textAreaObject.posX}, ${this.textAreaObject.posY})`)

          // LOCAL STORAGE
          this.dataStore.x = this.textAreaObject.posX
          this.dataStore.y = this.textAreaObject.posY
          this.localStorage.saveToLocalStr(this.dataStore)


          this.group.dispatchEvent(updateWithTextArea)

        }
      }

    }


    // #### FOR DEBUGGING
    //
    // this.svgRoot.addEventListener('mousemove', (ev) => {
    //   ev.stopImmediatePropagation()
    //   ev.preventDefault()

    //   //-// console.log(`ev.offsetX --   ${ev.offsetX}       ----    ev.offsetY --   ${ev.offsetY}`)

    //   const mappedPosition = this.screenPointToDivPoint(this.svgRoot, this.group, ev.offsetX, ev.offsetY)

    //   // ****  PANSCALER IS NEEDED ! (ZOOMED POSITION !!)

    //   const testX = mappedPosition.x * parseFloat(document.getElementById('zoom_select').dataset.panScaler)
    //   const testY = mappedPosition.y * parseFloat(document.getElementById('zoom_select').dataset.panScaler)

    //   //-// console.log(`SCALED TEST POSITION  ::   X:  ${testX}      Y:  ${testY}`)


    // })



    // ======================================================================
    // EVENT LISTEN & HANDLERS
    // ======================================================================



    this.observer = new MutationObserver((mutationsList, observer) => {

      for(const mutation of mutationsList) {
        if( mutation.type === 'attributes' ) {
          //-// console.log(`---- CHANGED DOM ID::  ${mutation.target.id}`)
          // //-// console.log(`${mutation.attributeName}   WAS MODIFIED`)
          //-// console.log(`TO ${mutation.target.getAttribute(mutation.attributeName)}`)

          // ----------------------
          // UPDATING LOCAL STORAGE
          // this.dataStore.x = parseInt(this.svgDom.getAttribute('x'))
          // this.dataStore.y = parseInt(this.svgDom.getAttribute('y'))
          // this.dataStore.width = parseInt(this.svgDom.getAttribute('width'))
          // this.dataStore.height = parseInt(this.svgDom.getAttribute('height'))

          this.dataStore.fill = this.group.dataset.fill
          this.dataStore.zIndex = parseInt(this.group.dataset.zIndex)
          this.dataStore.opacity = parseFloat(this.group.dataset.opacity)

          this.localStorage.saveToLocalStr(this.dataStore)
          //-// console.log(this.dataStore)
        }
      }
    })
    this.observer.observe(this.group, observeConfig)








    // ----------------------------------------------------------------------
    // CHECKING CLICK AND DOUBLE CLICK
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event

    this.doubleClickHnd = (ev) => {
      //-// console.log(`---- SVG-TEXT DOUBLE CLICKED ::  -- ID -- ${this.groupId}`)

      // -----------------------------------------------------------
      // USING GLOBAL-SCOPED EVENT (main_global.js)
      // https://javascript.info/dispatch-events
      // https://blog.logrocket.com/custom-events-in-javascript-a-complete-guide/
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
      // https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
      //const newEvent = new CustomEvent('inspectOn', {detail: 'TEST DATA'})

      ev.target.dispatchEvent(eventWithTextArea)
    }
    this.svgDom.addEventListener("dblclick", this.doubleClickHnd, false)



    this.mouseUpHnd = (dragObj) => {

      // DELETE BOUNDING BOX !!!!
      superClass.removeBoundingBox()

    }



    this.mouseClickHnd = (ev) => {
      //-// console.log(`---- SVG-TEXTAREA CLICKED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      ev.target.dispatchEvent(eventWithTextArea)

      // console.log(ev)
      
      const canvas_rect = document.getElementById('CANVAS_RECT')

      const mappedPosition = this.screenPointToDivPoint(canvas_rect, this.group, ev.clientX, ev.clientY)
      //const mappedPosition = this.screenPointToDivPoint(this.svgRoot, this.svgDom, ev.clientX, ev.clientY)

      // ****  PANSCALER IS NEEDED ! (ZOOMED POSITION !!)

      this.anchorPosX = mappedPosition.x * parseFloat(document.getElementById('zoom_select').dataset.panScaler)
      this.anchorPosY = mappedPosition.y * parseFloat(document.getElementById('zoom_select').dataset.panScaler)

      //console.log(`panScaler  ::  ${parseFloat(document.getElementById('zoom_select').dataset.panScaler)}`)
      // console.log(`ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)




      // ------------------------
      // DRAW BOUNDING BOX !

      //console.log(this.svgDom)
      superClass.boundBoxCoords.x = this.textAreaObject.posX
      superClass.boundBoxCoords.y = this.textAreaObject.posY + this.svgDom.getBBox().y
      superClass.boundBoxCoords.width = this.svgDom.getBBox().width
      superClass.boundBoxCoords.height = this.svgDom.getBBox().height

      superClass.drawBoundingBox(this.svgDom)


      // ------------------------
      // GLOBAL SELECT LIST !!!!
      console.log(gl_SELECTEDLIST[this.groupId])
      console.log(gl_SHIFTKEYPRESSED)
      let size = Object.keys(gl_SELECTEDLIST).length;

      if(size === 0) this.selectionManager.add(this)
      else if (gl_SELECTEDLIST[this.groupId] === undefined && gl_SHIFTKEYPRESSED) this.selectionManager.add(this)
      else {

        gl_SELECTEDLIST = {}
        this.selectionManager.add(this)

      }


      // SETTING SCREEN DRAG OBJECT
      this.screenDrag.setScreen({
        dragObj: this.group,
        mutationHandler: this.mutationHandler,
        mouseupHandler: this.mouseUpHnd
      })


    }
    this.svgDom.addEventListener("mousedown", this.mouseClickHnd, false)


    // ----------------------------------------------------------------------
    //    {
    //    bubbles: true,
    //      detail: {
    //        id: groupDom.id,
    //        fontSize: newFontSize
    //      }
    //    }


    // ----------------------------------------------------------------------
    // CHECKING TEXT CHANGING
    this.updateText = (ev) => {

      // ev.stopPropagation()
      // ev.preventDefault()

      // GETTING value FROM TEXTAREA HTML ELEMENT
      let newText = ev.detail.text.replaceAll('\n', '&#13;&#10;')

      if(!ev.detail.control.id) this.textContentControlId = ev.detail.control
      else this.textContentControlId = ev.detail.control.id

      //-// console.log('DRAW TEXTAREA  TEXT AREA CHANGED')
      //-// console.log(newText)

      // FOR SVG ELEMENTS...
      this.group.childNodes.forEach( child => {
        if(child.tagName === 'text') {

          // GETTING CURSOR WHERE EDITTED
          // ** IF THIS FUNCTION IS CALLED WHEN LOAD FROM LOCAL STORAGE,
          //    WE SHOULD ROUTE DIFERENTLY, BECAUSE THERE IS 'NO' ATTRIB BOX (RIGHT SIDE OF SCREEN)
          let edittedLoc
          if(document.getElementById(this.textContentControlId)) edittedLoc = TextArea.getCursorPos(document.getElementById(this.textContentControlId)).end
          else edittedLoc = 0

          // UPDATE TEXTAREA'S TEXT AND GETTING THAT OBJECT
          let updatedTextArea = this.textAreaObject.updateText(newText, edittedLoc)

          // --------------------------------------
          // APPEND NEW TSPANS TO TEXT SVG-ELEMENT
          // +
          // UPDATE TIMELINE'S TEXT
          for( let i = 0; i < updatedTextArea.tspans.length; i++ ) {
            // CREATE NEW TSPAN
            child.appendChild(updatedTextArea.tspans[i])

          }


          // UPDATE LENGTH OF ARRAY WHICH INCLUDES tspans
          //console.log(child)
          //console.log(this.textAreaObject.tspans.length)
          //console.log(this.updatedTextArea.tspans.length)



          updatedTextArea.setLineFeedIndex()

        }
      })


      // --------------------------------------
      // UPDATE TO LOCAL STORAGE
      this.dataStore.text = newText
      this.dataStore.textControlId = this.textContentControlId
      this.localStorage.saveToLocalStr(this.dataStore)
    }
    this.group.addEventListener('update_textarea_text', this.updateText)

    // ----------------------------------------------------------------------
    // CHECKING FONTSIZE CHANGING
    this.updateFontSize = (ev) => {
      //-// console.log('====   update_textarea_fontsize  ====')
      // ev.stopPropagation()
      // ev.preventDefault()

      // SET NEW WIDTH VALUE FROM HTML DOM
      this.textAreaObject.fontSize = ev.detail.fontSize
      this.group.dataset.fontSize = ev.detail.fontSize

      // FOR SVG ELEMENTS...
      this.group.childNodes.forEach( child => {
        if(child.tagName === 'text') {

          // SETTING UP FONT SIZE OF CSS
          child.style.fontSize = this.textAreaObject.fontSize

          // UPDATE TEXTAREA
          let updatedTextArea = this.textAreaObject.updateTransform()

          // APPEND NEW TSPANS TO TEXT SVG-ELEMENT
          for( let i = 0; i < updatedTextArea.tspans.length; i++ ) {
            child.appendChild(updatedTextArea.tspans[i])
          }

          updatedTextArea.setLineFeedIndex()

        }
      })



      // this.setTextAreaDomEventListeners(this.groupNode, this.textArea)
      // UPDATE TO LOCAL STORAGE
      this.dataStore.fontSize = parseInt(this.group.dataset.fontSize)
      this.localStorage.saveToLocalStr(this.dataStore)
    }
    this.group.addEventListener('update_textarea_fontsize', this.updateFontSize)

    // ----------------------------------------------------------------------
    // CHECKING LINEMARGIN CHANGING
    this.updateWidth = (ev) => {
      //-// console.log('====   update_textarea_width   ====')
      ev.stopPropagation()
      ev.preventDefault()

      let newWidth = ev.detail.width

      // SET NEW WIDTH VALUE FROM HTML DOM
      // **** BUT, THAT HAS TO BE THE NUMBER ABOVE THE FONT SIZE !!!!
      if( newWidth < this.textAreaObject.fontSize ) {
        this.textAreaObject.width = this.textAreaObject.fontSize
        ev.detail.control.value = this.textAreaObject.fontSize

      } else this.textAreaObject.width = newWidth

      // FOR SVG ELEMENTS...
      this.group.childNodes.forEach( child => {
        if(child.tagName === 'text') {

          // UPDATE TEXTAREA
          let updatedTextArea = this.textAreaObject.updateTransform()

          // APPEND NEW TSPANS TO TEXT SVG-ELEMENT
          for( let i = 0; i < updatedTextArea.tspans.length; i++ ) {
            child.appendChild(updatedTextArea.tspans[i])
          }

          updatedTextArea.setLineFeedIndex()

        }
      })

      // UPDATE TO LOCAL STORAGE
      this.dataStore.width = parseInt(this.textAreaObject.width)
      this.localStorage.saveToLocalStr(this.dataStore)
    }
    this.group.addEventListener('update_textarea_width', this.updateWidth)

    // ----------------------------------------------------------------------
    // CHECKING LINEMARGIN CHANGING
    this.updateLineMargin = (ev) => {
      ev.stopPropagation()
      ev.preventDefault()

      let newLineMargin = parseInt(ev.detail.lineMargin)

      // SET NEW WIDTH VALUE FROM HTML DOM
      this.textAreaObject.lineMargin = newLineMargin
      this.group.dataset.lineMargin = newLineMargin


      // FOR SVG ELEMENTS...
      this.group.childNodes.forEach( child => {
        if(child.tagName === 'text') {

          // UPDATE TEXTAREA
          let updatedTextArea = this.textAreaObject.updateTransform()

          // APPEND NEW TSPANS TO TEXT SVG-ELEMENT
          for( let i = 0; i < updatedTextArea.tspans.length; i++ ) {
            // ADJUSTING YPOS
            //updatedTextArea.tspans[i].setAttribute('y', parseInt(updatedTextArea.tspans[i].getAttribute('y')))

            // APPENDING DOM
            child.appendChild(updatedTextArea.tspans[i])
          }
          updatedTextArea.setLineFeedIndex()


        }
      })

      // UPDATE TO LOCAL STORAGE
      this.dataStore.lineMargin = parseInt(this.group.dataset.lineMargin)
      this.localStorage.saveToLocalStr(this.dataStore)
    }
    this.group.addEventListener('update_textarea_linemargin', this.updateLineMargin)

    // ----------------------------------------------------------------------
    // CHANGING TEXT CONTEX IN REALTIME
    this.updateTextTimeline = (ev) => {

      //-// console.log('UPDATE TEXTCONTENT WITH TIMELINE')

      //-// console.log(`INCOMING TEXT CONTENT:: ${ev.detail.text}`)
      //-// console.log(`INCOMING TEXT FONTSIZE:: ${ev.detail.fontSize}`)
      //-// console.log(`INCOMING TEXT LINEMARGIN:: ${ev.detail.lineMargin}`)

      this.updateText({
        detail: {
          id: this.groupId,
          text: ev.detail.text,
          control: this.textContentControlId
        }
      })
    }
    this.group.addEventListener('update_textContent_timeline', this.updateTextTimeline)

    // ----------------------------------------------------------------------
    // CHECKING FONTSIZE CHANGING
    this.updateFontFamily = (ev) => {
      //-// console.log('====   updateFontFamily ()  ====')
      // ev.stopPropagation()
      // ev.preventDefault()

      // SET NEW WIDTH VALUE FROM HTML DOM
      this.textAreaObject.fontName = ev.detail.fontFamily
      this.group.dataset.fontName = ev.detail.fontFamily

      // // FOR SVG ELEMENTS...
      // this.group.childNodes.forEach( child => {
      //   if(child.tagName === 'text') {

      //     // SETTING UP FONT SIZE OF CSS
      //     child.style.fontFamily = this.textAreaObject.fontName

      //     // UPDATE TEXTAREA
      //     let updatedTextArea = this.textAreaObject.updateTransform()

      //     // APPEND NEW TSPANS TO TEXT SVG-ELEMENT
      //     for( let i = 0; i < updatedTextArea.tspans.length; i++ ) {
      //       child.appendChild(updatedTextArea.tspans[i])
      //     }

      //     updatedTextArea.setLineFeedIndex()

      //   }
      // })

      // // AFTER DOM CREATION,
      // // ONCE WE 'DELETED' TSPANS ABOVE, SO WE NEED TO SET MUTATION OBSERVER FOR TSPAN[0] !!!!
      // this.setMutationObserver_tspan0()

      // this.setTextAreaDomEventListeners(this.groupNode, this.textArea)
      // UPDATE TO LOCAL STORAGE
      this.dataStore.fontName = this.group.dataset.fontName
      this.localStorage.saveToLocalStr(this.dataStore)
    }
    this.group.addEventListener('update_textarea_fontFamily', this.updateFontFamily)




    // ----------------------------------------------------------------------
    // REACTING TO EVENT 'createKeyFrame'
    // FROM ATTRIB BOX

    this.createKeyframe = (ev) => {
      //-// console.log(`CREATE KEYFRAME EVENT OCCURED   ::  ${ev.detail.id}`)

      // CHECK ID
      //-// console.log(this.groupId)
      if( this.groupId === ev.detail.id.split('_')[0]) {

        // RETRIEVING VALUES, TIME ETC.
        let id = ev.detail.id
        let time = ev.detail.time
        let type = ev.detail.type
        let values = ev.detail.value
        let keyObjs = {}

        // ADJUSTING value WITH THEIR TYPE
        switch(type) {
          case 'POSITION':
            values['x'] = parseInt(values['x'])
            values['y'] = parseInt(values['y'])
            break
          case 'SIZE':
            values['width'] = parseInt(values['width'])
            values['height'] = parseInt(values['height'])
            break
          case 'COLOR':
            values['fill'] = values['fill']
            break
          case 'OPACITY':
            values['opacity'] = parseFloat(values['opacity'])
            break
        }


        // CREATING KEYFRAME
        for(let key in values) {
          keyObjs[key] = this.keyframeManager.createKeyframe({
            when: time,
            value: values[key]
          })
        }


        // ------------------------------------------------------------
        // IF INCOMING ID DOES NOT EXIST IN THE timelines LIST,
        // IT SHOULD CREATE NEW TIMELINE
        let currentKeyList = Object.keys(this.timelines)

        let filteredObj = {}

        for(let i=0; i < currentKeyList.length; i++){
          // CHECK IF NEW NAME IS ALREADY EXISTED
          for(let key in keyObjs) {
            let timelineName = id + '_' + key
            // IF THERE IS NO NAME EXISTED...
            if(currentKeyList[i] !== timelineName) filteredObj[timelineName] = { result: false, keyObj: keyObjs[key]}
            else if(currentKeyList[i] === timelineName) filteredObj[timelineName] = { result: true, keyObj: keyObjs[key]}
          }

        }

        // -----------------------------------
        // ANIMATION TIMELINE INITIALIZATION
        if(currentKeyList.length === 0) {
          // CREATING TIMELINE
          for(let key in keyObjs) {
            let timelineName = id + '_' + key

            this.timelines = this.keyframeManager.setTimeline({
              domId: timelineName,
              attrName: key,
              time: keyObjs[key].when,
              keyframes: keyObjs[key],
              duration: 10000
            })

            // SET EVENT HANDLER
            this.keyframeManager.setEventHandler({
              targetId: timelineName,
              obj: this,
              objType: 'TEXTAREA'
            })

          }

        } else {

          // -----------------------------------
          // AFTER EASTABLISHING TIMELINE,
          // WE CHECK THERE IS ALREADY BUILT FOR THAT ATTRIBUTE
          //
          // CREATING TIMELINE
          for(let key in keyObjs) {
            let timelineName = id + '_' + key

            let isExisted = currentKeyList.includes(timelineName)

            if(!isExisted) {
              this.timelines = this.keyframeManager.setTimeline({
                domId: timelineName,
                attrName: key,
                time: keyObjs[key].when,
                keyframes: keyObjs[key],
                duration: 10000
              })

              // SET EVENT HANDLER
              this.keyframeManager.setEventHandler({
                targetId: timelineName,
                obj: this,
                objType: 'TEXTAREA'
              })


            } else {
              // THERE IS ALREADY EXISTED TIMELINE,
              // WE WILL JUST ADD KEYFRAME
              //
              // ADDING KEYFRAME TO TIMELINE
              this.timelines = this.keyframeManager.addKeyframe({
                domId: timelineName,
                keyframes: keyObjs[key]
              })

            }

          }

        }


        // -----------------------------------------------
        // STORING KEYFRAMES TO LOCAL STORAGE
        let groupId = ev.detail.id.split('_')[0]

        // BELOW ID KEY NAME WILL DEFINE OBJECT'S MAIN KEYNAME
        this.animStore.id = groupId + '_anim'
        this.animStore.isStored = true

        // UPLOAD
        for( let keyName in this.timelines) {
          this.animStore[keyName] = this.timelines[keyName]
        }
        this.localStorage.saveToLocalStr(this.animStore)

        // UPDATE ATTRBOX STORAGE
        const dataForAttribBox = {
          groupId: this.groupId,
          timeline: this.timelines
        }
        this.setAttribBoxStore(dataForAttribBox, this.group)

      }
    }
    document.body.addEventListener("createKeyFrame", this.createKeyframe, true)




    // =========================================
    // UPDATING KEYFRAME
    // =========================================

    // THIS CASE INCLUDES THE CHANGES FROM LOCAL TIMELINE !!!!
    this.updateKeyframeTime = (ev) => {
      //-// console.log(`updateKeyframeTime ::  ${ev.detail.groupId}  ->  KEY INDEX  :: ${ev.detail.keyIndex}  ->  SHAPE :: ${ev.detail.shapeType}  ->  ATTR NAME :: ${ev.detail.attrName}  ->  NEW PERCENT :: ${ev.detail.percentage}`)

      //console.log(this.timelines)
      const incomingGrpId = ev.detail.groupId
      const incomingShape = ev.detail.shapeType
      let incomingAttrName = ev.detail.attrName
      const incomingKeyIndex = parseInt(ev.detail.keyIndex)
      const incomingPercentage = Math.floor(ev.detail.percentage)

      // LINKED ATTR IS LIKE POSITION X & Y
      let attrName_linked = undefined

      // CHECKING INCOMING ATTRIBUTE NAME IS CORRECT
      if(incomingAttrName === 'x') {
        
        attrName_linked = 'y'
      } else if(incomingAttrName === 'y') {

        attrName_linked = 'x'
      }


      // IF INCOMING EVENT IS SENT FROM SAME OBJECT
      if(this.groupId === incomingGrpId) {

        // **** WE ARE NOW SHARING DATA BETWEEN TIMELINES + LOCALSTORAGE(ANIM) + LOCALSTORAGE(ATTRIBBOX)
        //
        // 1. UPDATE TIMELINE
        // +
        // 2. UPDATE LOCAL STORAGE FOR ANIMATION
        // +
        // 3. UPDATE LOCAL STORAGE FOR ATTRIBBOX
        let str = localStorage
        const animKeyName = this.groupId + '_anim'
        const attrboxKeyName = this.groupId + '_attrbox'
        let animStorageObj = JSON.parse(str[animKeyName])
        let attrboxStorageObj = JSON.parse(str[attrboxKeyName])

        for(let timelnName in this.timelines) {
          // timelnName
          // bf8c86a0-32b6-483a-a5fe-21f48d8a3370_rect_fill
          const shapeType = timelnName.split('_')[1]
          const attrName = timelnName.split('_')[2]

          // THIS IS FOR CHECKING LINKED OR NOT
          let timelnName_linked = undefined
          if(attrName_linked !== undefined) {
            timelnName_linked = timelnName.split('_')[0] + '_' + timelnName.split('_')[1] + '_' + attrName_linked
            //console.log(timelnName_linked)
          }




          if(shapeType === incomingShape && attrName === incomingAttrName) {
            // UPDATE TIMELINE
            let keyArray_Timeline = this.timelines[timelnName].keyframes
            let keyArray_AnimStorage = animStorageObj[timelnName].keyframes

            //console.log(timelnName)

            // FIND UPDATED KEY FRAME USING KEYFRAME INDEX
            // 1. TIMELINES OBJECT UPDATE
            keyArray_Timeline[incomingKeyIndex].when = `${incomingPercentage}`


            // 2. LOCAL STORAGE (ANIM) UPDATE
            keyArray_AnimStorage[incomingKeyIndex].when = `${incomingPercentage}`
            str.setItem(animKeyName, JSON.stringify(animStorageObj))
            // 3. LOCAL STORAGE (ATTRIB BOX) UPDATE
            attrboxStorageObj[attrName_linked][incomingKeyIndex].when = `${incomingPercentage}`
            str.setItem(attrboxKeyName, JSON.stringify(attrboxStorageObj))

            //-// console.log(localStorage)


            if(timelnName_linked !== undefined) {
              
              let keyArray_Timeline_linked = this.timelines[timelnName_linked].keyframes
              let keyArray_AnimStorage_linked = animStorageObj[timelnName_linked].keyframes

              //console.log(timelnName)

              // FIND UPDATED KEY FRAME USING KEYFRAME INDEX
              // 1. TIMELINES OBJECT UPDATE
              keyArray_Timeline_linked[incomingKeyIndex].when = `${incomingPercentage}`


              // 2. LOCAL STORAGE (ANIM) UPDATE
              keyArray_AnimStorage_linked[incomingKeyIndex].when = `${incomingPercentage}`
              str.setItem(animKeyName, JSON.stringify(animStorageObj))
              // 3. LOCAL STORAGE (ATTRIB BOX) UPDATE
              attrboxStorageObj[attrName][incomingKeyIndex].when = `${incomingPercentage}`
              str.setItem(attrboxKeyName, JSON.stringify(attrboxStorageObj))



            }


          }
        }
      }
    }
    this.group.addEventListener('update_keyframe_time', this.updateKeyframeTime, false)


    // =========================================
    // DELETE BUTTON EVENT HANDLING
    // =========================================
    this.deleteObjectHandler = (ev) => {

      // CHECK IF THE GROUP ID IS IDENTICAL
      if(this.groupId === ev.detail.id) {

        //-// console.log(`DELETE OBJECT BUTTON PRESSED !!!!  --->    ${ev.detail.id}`)


        let str = localStorage

        // 1. DELETE LOCAL STORAGE (OBJECT)
        str.removeItem(this.groupId) 

        // 2. DELETE LOCAL STORAGE (ANIMATION)
        str.removeItem(this.groupId + '_anim') 

        // 3. DELETE LOCAL STORAGE (ATTRIBBOX)
        str.removeItem(this.groupId + '_attrbox') 

        // 3. DELETE CURRENT OBJECT
        this.remove()
        
        // ======================================================================
        // RE-ALIGN DOMs ACCORDING TO Z-INDEX
        // ======================================================================
        ZIndexManager.refreshAllSvg()
        // RESET TIMELINE
        this.ZIndexManager.remove()


        // 4. RESET ATTRIB BOX LIST OF ATTRIB MANAGER
        const evToAttrMan = new CustomEvent('resetAttrBox', {
          bubbles: true,
          detail: {
            id: this.groupId
          }
        })
        document.getElementById('workarea').dispatchEvent(evToAttrMan)

        // 5. REPORT TO STATE
        const evToState = new CustomEvent('updateRenderList', {
          bubbles: true,
          detail: {
            id: this.groupId
          }
        })
        document.getElementById('workarea').dispatchEvent(evToState)


      }
    }
    this.group.addEventListener('deleteObject', this.deleteObjectHandler,false)



    // =========================================
    // DUPLICATE BUTTON EVENT HANDLING
    // =========================================
    superClass.setupCommonEventHandlers()




    // ======================================================================
    // LOCAL STORAGE
    // ======================================================================

    // ----------------------------------------------------------------------
    // SAVING TO LOCAL DATA
    // WHEN FIRST INITIALIZATION
    if(settings.isStored === false) {
      this.setDataStore()
      this.localStorage.saveToLocalStr(this.dataStore)

      // REQUIRED DATA FOR ATTRIBBOX STORAGE IS FOR DISPLAYING 'LOCAL TIMELINE'
      // SO THAT MEANS ONLY 'ANIMATABLE PARAMETERS'
      const dataForAttribBox = {
        groupId: this.groupId,
        timeline: this.timelines
      }
      this.setAttribBoxStore(dataForAttribBox, this.group)

    } else {
      this.setDataStore()

      // =================================================================================
      // ANIMATIONS
      // =================================================================================
      this.loadAnimStore()

      // REQUIRED DATA FOR ATTRIBBOX STORAGE IS FOR DISPLAYING 'LOCAL TIMELINE'
      // SO THAT MEANS ONLY 'ANIMATABLE PARAMETERS'
      const dataForAttribBox = {
        groupId: this.groupId,
        timeline: this.timelines
      }
      this.setAttribBoxStore(dataForAttribBox, this.group)

    }



    // ----------------------------------------------------------------------
    // AFTERLOADING (IF NECESSARY)
    if(settings.isStored) this.afterload(settings)




    // ======================================================================
    // RE-ALIGN DOMs ACCORDING TO Z-INDEX
    // ======================================================================
    ZIndexManager.refreshAllSvg()






    // SELECTION MANAGER 
    this.selectionManager = stateObj.selectionManager






  }



  // ----------------------------------------------------------------------
  //
  setDataStore() {
    this.dataStore = {
      type: 'TEXTAREA',
      isStored: true,
      id: this.groupId,
      zIndex: this.group.dataset.zIndex,
      svg_id: this.svgDom.id,
      x: this.textAreaObject.posX,
      y: this.textAreaObject.posY,
      width: this.textAreaObject.width,
      height: this.textAreaObjectheight,
      fill: this.textAreaObject.tspans[0].getAttribute('fill'),
      opacity: parseFloat(this.textAreaObject.tspans[0].style.opacity),
      text: this.textAreaObject.text,
      textControlId : this.textContentControlId,
      fontSize: parseInt(this.group.dataset.fontSize),
      fontName: this.group.dataset.fontName,
      lineMargin: parseInt(this.group.dataset.lineMargin)
    }
  }

  preload(settings) {
    //-// console.log(` (LOCAL STORAGE) PRELOADING ->   ${settings.id}`)
    // OVERLOADING REQUIRED MEMBERS
    this.groupId = settings.id
    this.textContentControlId = settings.textControlId

    // DATA LOADING FROM LOCALSTORAGE
    this.textAreaSettings = {
      id: settings.id + '_textarea',
      text: settings.text,
      width: settings.width,
      height: settings.height,
      x: settings.x,
      y: settings.y,
      lineMargin: settings.lineMargin,
      fill: settings.fill,
      opacity: parseFloat(settings.opacity),
      fontName: settings.fontName
    }


    this.group.setAttribute('transform', `translate(${settings.x}, ${settings.y})`)

  }

  afterload(settings) {
    //-// console.log(` (LOCAL STORAGE) AFTERLOADING ->   ${settings.id}`)
    // RE-SETTING REQUIRED OBJECTS
    this.group.dataset.zIndex = settings.zIndex
    this.svgDom.setAttribute("id", settings.id + '_textarea')
    this.group.dataset.fontSize = settings.fontSize
    this.textAreaObject.text = settings.text

    // WE ARE RE-USING EVENT HANDLER
    this.updateFontSize({
      detail: {
       id: this.group.id,
       fontSize: settings.fontSize
      }
    })
    this.updateText({
      detail: {
        id: this.groupId,
        text: settings.text,
        control: this.textContentControlId
      }
    })

    // BECAUSE WE DELETE ALL TSPANS WHEN updateTect() IN TEXTAREA CLASS,
    // (TSPAN[0] IS DELETED !!!!)
    // SO WE NEED TO RE-EASTABLISH THE MUTATION
    //this.setMutationObserver_tspan0()





  }

  loadAnimStore() {

    let strAnim = localStorage
    // IF THERE IS AN ANIMTAION DATA
    if(strAnim[this.groupId + '_anim']) {
      //-// console.log(` >>>>   ${strAnim[this.groupId + '_anim']}     HAS AN ANIMATION DATA`)

      // BELOW IS RAW OBJECT FROM LOCAL STORAGE
      let timelineBeforeEval = JSON.parse(strAnim[this.groupId + '_anim'])

      // ==============================================
      // WE WILL RECONSTRUCT REAL TIMELINE
      // ==============================================

      // ----------------------------------------------
      // PICKUP GROUPID (BASE ID)
      let groupId = timelineBeforeEval['id'].split('_')[0]

      // BECAUSE OUR FORMAT OF ANIMTION LOCAL STORAGE HAS 'id' AND 'isStored' KEY,
      // SO WE DELETE THEM HERE
      delete timelineBeforeEval['id']
      delete timelineBeforeEval['isStored']

      // ----------------------------------------------
      // COLLECTING KEYFRAME DATA FROM LOCAL STORAGE
      // THEN RE-EVALUATE

      // 1. COLLECT FIRST
      // 2. RE-EVALUATED KEYFRAME OBJECTS

      let allNameKeys = []

      for(let timelineName in timelineBeforeEval) {

        let collKeyframes = timelineBeforeEval[timelineName].keyframes
        let channel = timelineBeforeEval[timelineName].attrName

        for(let i=0; i < collKeyframes.length; i++) {

          let when = collKeyframes[i]['when']
          let value = collKeyframes[i]['value']

          // KEYFRAME CREATION
          let keyObjs = {}
          keyObjs[channel] = this.keyframeManager.createKeyframe({
            when: when,
            value: value
          })
          keyObjs.timelineName = timelineName

          allNameKeys.push(keyObjs)

        }
      }


      for(let keyframe of allNameKeys) {
        let tlNm = keyframe.timelineName          // "51614f9c-e290-46df-a379-7cf2833066c2_textarea_textContent_0"
        let attrNmArr = tlNm.split('_')

        // ROUTE TO TEXTAREA'S TEXT CONTENT
        let attrNm
        //let attrIndex
        // if( attrNmArr.includes('textContent')) {
        //   attrNm = attrNmArr[2]
        //   //attrIndex = attrNmArr[3]
        // } else attrNm = attrNmArr[attrNmArr.length-1]

        attrNm = attrNmArr[attrNmArr.length-1]

        // ======================================================================
        // MANAGING KEYFRAME
        // ======================================================================

        // CHECKING TIMELINE WAS INTIALIZED
        // OR ALREADY EXISTED
        //
        // + IF ALREADY EXISTED,
        //   1. TIMELINE IS EXISTED BUT, 'DIFFERENT' TIMELINE (DIFFERENT CHANNEL)
        //      -> STILL WE SHOULD CREATE NEW TIMELINE
        //   2. TIMELINE IS EXISTED AND 'SAME' TIMELINE
        //      -> JUST ADD KEYFRAME
        let currentKeyList = Object.keys(this.timelines)




        if(currentKeyList.length === 0) {

          this.timelines = this.keyframeManager.setTimeline({
            domId: keyframe.timelineName,
            attrName: attrNm,
            time: keyframe[attrNm].when,
            keyframes: keyframe[attrNm],
            duration: 10000
          })

          // SET EVENT HANDLER
          this.keyframeManager.setEventHandler({
            targetId: keyframe.timelineName,
            obj: this,
            objType: 'TEXTAREA'
          })


        } else if(currentKeyList.includes(tlNm) === false) {


          this.timelines = this.keyframeManager.setTimeline({
            domId: keyframe.timelineName,
            attrName: attrNm,
            time: keyframe[attrNm].when,
            keyframes: keyframe[attrNm],
            duration: 10000
          })

          // SET EVENT HANDLER
          this.keyframeManager.setEventHandler({
            targetId: keyframe.timelineName,
            obj: this,
            objType: 'TEXTAREA'
          })


        } else {

          // ADDING KEYFRAME TO TIMELINE
          this.timelines = this.keyframeManager.addKeyframe({
            domId: keyframe.timelineName,
            keyframes: keyframe[attrNm]
          })

        }

      }

    }
  }



  // ----------------------------------------------------------------------
  // SAVING ATTRIB BOX TO LOCAL STORAGE
  setAttribBoxStore(dataToTransfer, senderDom) {

    const evToAttrMan = new CustomEvent('set_attribBox', {
      bubbles: true,
      detail: dataToTransfer
    })

    senderDom.dispatchEvent(evToAttrMan)

  }



  remove() {
    // REMOVE EVENT LISTENER
    document.body.removeEventListener("createKeyFrame", this.createKeyframe, true)
    this.svgDom.removeEventListener("dblclick", this.doubleClickHnd, false)
    this.svgDom.removeEventListener("mousedown", this.mouseClickHnd, false)
    this.group.removeEventListener('update_textContent_timeline', this.updateTextTimeline)

    this.group.removeEventListener('update_textarea_text', this.updateText)
    this.group.removeEventListener('update_textarea_fontsize', this.updateFontSize)
    this.group.removeEventListener('update_textarea_linemargin', this.updateLineMargin)
    this.group.removeEventListener('update_textarea_width', this.updateWidth)

    this.group.removeEventListener('update_keyframe_time', this.updateKeyframeTime, false)
    this.group.removeEventListener('deleteObject', this.deleteObjectHandler,false)

    this.keyframeManager.remove()

    // RESET TIMELINE
    this.timelines = {}
    this.animStore = {}
    this.dataStore = {}
    this.observer = undefined
    this.keyframeManager = undefined

    this.textAreaObject.remove()

    // DELETE DOM
    this.svgDom.remove()
    this.group.remove()

  }




  // -----------------------------------
  //


  duplicateSetting(prevObj) {

    //                 ~~~~~~~   <-- THIS SHOULE NOT BE 'this' !!!! 
    for(let i = 0; i < prevObj.textAreaObject.tspans.length; i++) {
      console.log(prevObj.textAreaObject.tspans[i])

      let fill = prevObj.textAreaObject.tspans[i].getAttribute('fill')


      this.textAreaObject.tspans[i].setAttribute('fill', fill)  
    }
    this.textAreaObject.fill = prevObj.textAreaObject.tspans[0].getAttribute('fill')
    this.textAreaObject.fontSize = prevObj.textAreaObject.fontSize
    this.textAreaObject.fontName = prevObj.textAreaObject.fontName
    this.textAreaObject.lineMargin = parseInt(prevObj.group.dataset.lineMargin)
    this.textAreaObject.opacity = parseFloat(prevObj.group.dataset.opacity)
    this.group.dataset.lineMargin = parseInt(prevObj.group.dataset.lineMargin)
    this.group.dataset.opacity = parseFloat(prevObj.group.dataset.opacity)
    this.textAreaObject.text = prevObj.textAreaObject.text
    this.textAreaObject.width = prevObj.textAreaObject.width
    this.textAreaObject.height = prevObj.textAreaObject.height
    this.textAreaObject.posX = prevObj.textAreaObject.posX
    this.textAreaObject.posY = prevObj.textAreaObject.posY

    this.group.setAttribute('fill', prevObj.textAreaObject.tspans[0].getAttribute('fill'))
    this.group.setAttribute('transform', prevObj.group.getAttribute('transform'))


    // WE ARE RE-USING EVENT HANDLER
    this.updateFontSize({
      detail: {
       id: this.group.id,
       fontSize: this.textAreaObject.fontSize
      }
    })
    this.updateText({
      detail: {
        id: this.groupId,
        text: this.textAreaObject.text,
        control: this.textContentControlId
      }
    })

    this.group.setAttribute("fill", prevObj.textAreaObject.tspans[0].getAttribute('fill'))
    this.group.dataset.fill = prevObj.textAreaObject.tspans[0].getAttribute('fill')
    this.group.dataset.fontSize = prevObj.textAreaObject.fontSize
    this.group.dataset.fontName = prevObj.textAreaObject.fontName

    this.dataStore.width = prevObj.textAreaObject.width
    this.dataStore.lineMargin = parseInt(this.group.dataset.lineMargin)
    this.dataStore.fill = this.group.dataset.fill
    this.dataStore.zIndex = parseInt(this.group.dataset.zIndex)
    this.dataStore.opacity = parseFloat(this.group.dataset.opacity)

    this.localStorage.saveToLocalStr(this.dataStore)
          

  }





  getGroupId() {
    return this.group.id
  }

  // RETURN ALL HTML DOM TO OUTSIDE
  getDomList() {
    let domlist = []
    // GETTING DOMs FROM HANDLES
    for(let tspn of this.svgDom.childNodes) {
      domlist.push(tspn)
    }
    return domlist
  }

  screenPointToDivPoint(from, to, x, y) {

    let domFrom = from
    let domTo = to
    let xPos
    let yPos
    let checkX = false
    let checkY = false

    if(x) {
      checkX = true
      xPos = x
    }

    if(y) {
      checkY = true
      yPos = y
    }

    // < RETRIEVE POSITION OF DOM ELEMENT >
    // https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    //
    // DOMRect {x: 60, y: 466, width: 1340, height: 56, top: 466, …}
    // bottom: 522
    // height: 56
    // left: 60
    // right: 1400
    // top: 466
    // width: 1340
    // x: 60
    // y: 466
    let targetRect = domTo.getBoundingClientRect()
    //-// console.log(domTo.getBoundingClientRect())


    let result = {
      x: checkX ? xPos - targetRect.left : undefined,
      y: checkY ? yPos - targetRect.top : undefined
    }

    return result

  }

  screenPointToSVGPoint(svg, elem, x, y) {
    let xPos
    let yPos
    let checkX = false
    let checkY = false
    const point = svg.createSVGPoint()
    if(x) {
      checkX = true
      xPos = x
    }
    if(y) {
      checkY = true
      yPos = y
    }
    point.x = xPos
    point.y = yPos
    const CTM = elem.getScreenCTM()
    return point.matrixTransform( CTM.inverse() )
  }

  mousePointToSVGPoint(event) {
    return this.screenPointToSVGPoint( this.groupSvg.parentElement, event.target, event.clientX, event.clientY )
  }

}


export { DrawTextArea }
