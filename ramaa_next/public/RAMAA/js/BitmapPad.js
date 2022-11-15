'strict mode'

import { ButtonSimple }         from "./ButtonSimple.js"
import { PointerInput }         from "./PointerInput.js"


class BitmapPad {
	

	constructor(settings) {

    this.nsSvg = 'http://www.w3.org/2000/svg'


    this.isDrawing = false
    this.rightButtonFlag = false

    this.lineDrawWidth = 1.0

    this.linePoints = []


    this.pointerPosX = undefined
    this.pointerPosY = undefined

    this.editFlag = settings.editFlag

    this.preLoadedImg = undefined
    this.object_xPos = undefined
    this.object_yPos = undefined

    this.colorCounts = 5
    this.colorSwatches      = ['#000000', '#FF0000', '#FFFF00', '#0000FF', '#00FF00']
    this.colorSwatchesHover = ['#333333', '#FF8888', '#FFFFCC', '#8888FF', '#BBFF88']
    this.currentColor = '#000000'

    // ***** WE NEED TO SET DIFFERENT VARIABLE,
    //       BECAUSE WHEN WE 'CALL' CANVAS-CONTEXT'S PROPERTIES
    //       LIKE canvasCtx.width, MAYBE THEY REFRESH CANVAS SO WE USE ALIAS
    this.width = settings.width
    this.height = settings.height


    // IF IT IS EDIT-MODE WE WILL HAVE PRE-DEFINED IMAGE AND POSITIONS
    if(this.editFlag) {
      this.preLoadedImg = settings.img
      this.object_xPos = settings.x
      this.object_yPos = settings.y
      this.oldObjRef = settings.oldObjRef
      this.oldZIndex = settings.oldZIndex
    }


    // ==============================================================
    // CREATING UI TO INPUT DRAWING FROM USER
    this.inputUIRoot = document.createElement('div')
    this.inputUIRoot.id = 'BITMAP_PAD'
    this.inputUIRoot.classList.add('bl_bitmapPad')
    this.inputUIRoot.classList.add('ly_bitmapPad')
    document.body.prepend(this.inputUIRoot)
    
    this.inputUIRootComputedStyle = getComputedStyle(this.inputUIRoot)
    
    this.UIWidth  = this.inputUIRootComputedStyle.getPropertyValue('width')
    this.UIHeight = this.inputUIRootComputedStyle.getPropertyValue('height')

    this.inputUIRoot.setAttribute('width', this.UIWidth)
    this.inputUIRoot.setAttribute('height', this.UIHeight)


    // ==============================================================
    // SVG ROOT
    this.svgRoot = document.createElementNS(this.nsSvg, 'svg')
    this.svgRoot.id = this.inputUIRoot.id + '_SVG_ROOT'
    this.svgRoot.setAttribute('width', this.UIWidth)
    this.svgRoot.setAttribute('height', this.UIHeight)
    this.inputUIRoot.appendChild(this.svgRoot)


    // ==============================================================
    // WIDTH, HEIGHT TEXTS
    this.svgTxtWidth = document.createElementNS(this.nsSvg, 'text')
    this.svgTxtHeight = document.createElementNS(this.nsSvg, 'text')
    
    this.svgTxtWidth.classList.add("bl_bitmapPad_text_size")
    this.svgTxtHeight.classList.add("bl_bitmapPad_text_size")

    this.svgTxtWidth.textContent = this.width
    this.svgTxtHeight.textContent = this.height
    this.svgTxtWidth.setAttribute('fill', '#e62b18')
    this.svgTxtHeight.setAttribute('fill', '#e62b18')
    this.svgTxtWidth.setAttribute('x', '22.8%')
    this.svgTxtWidth.setAttribute('y', '8%')
    this.svgTxtHeight.setAttribute('x', '8%')
    this.svgTxtHeight.setAttribute('y', '27.5%')


    this.svgRoot.appendChild(this.svgTxtWidth)
    this.svgRoot.appendChild(this.svgTxtHeight)



    // ==============================================================
    // PEN SIZE INDICATOR
    this.penSzIndicator = document.createElementNS(this.nsSvg, 'circle')
    this.penSzIndicator.setAttribute('r', '2')
    this.penSzIndicator.setAttribute('fill', 'black')
    this.penSzIndicator.setAttribute('cx', '75%')
    this.penSzIndicator.setAttribute('cy', '6%')

    this.svgRoot.appendChild(this.penSzIndicator)



    // ==============================================================
    // SVG FOREIGN OBJECT
    this.svgForeign = document.createElementNS(this.nsSvg, 'foreignObject')
    this.svgForeign.setAttribute('width', this.width)
    this.svgForeign.setAttribute('height', this.height)
    this.svgForeign.setAttribute('x', '20%')
    this.svgForeign.setAttribute('y', '20%')
    this.svgRoot.prepend(this.svgForeign)


    // ==============================================================
    // CANVAS PAD
    this.canvasDivRoot = document.createElement('div')
    this.canvasDivRoot.id = this.inputUIRoot.id + '_DIV'
    this.canvasDivRoot.classList.add('bl_bitmapPad_div_root')

    this.canvasPad = document.createElement('canvas')
    this.canvasPad.id = this.inputUIRoot.id + '_CANVAS'
    this.canvasPad.setAttribute('width', this.width)
    this.canvasPad.setAttribute('height', this.height)
    this.svgForeign.appendChild(this.canvasDivRoot)
    this.canvasDivRoot.appendChild(this.canvasPad)

    //this.canvasPad.style.border = '1px solid gray'

    this.canvasPadContext = this.canvasPad.getContext("2d")

    this.canvasPadContext.beginPath()
    this.canvasPadContext.strokeStyle = this.currentColor
    this.canvasPadContext.lineWidth = 2
    this.canvasPadContext.lineCap = 'round'
    this.canvasPadContext.lineJoin = 'round'


    // CANVAS FOR IN-MEMORY BACKUP
    this.canvas_mem = document.createElement('canvas')
    this.canvas_mem.width = this.width
    this.canvas_mem.height = this.height
    this.canvas_mem_ctx = this.canvas_mem.getContext('2d')
    this.canvas_mem_ctx.beginPath()
    this.canvas_mem_ctx.lineWidth = 2
    this.canvas_mem_ctx.lineCap = 'round'
    this.canvas_mem_ctx.lineJoin = 'round'

    // < DISABLE MOUSE'S RIGHT BUTTON CLICK >
    // https://codinhood.com/nano/dom/disable-context-menu-right-click-javascript
    this.canvasPad.addEventListener("contextmenu", e => e.preventDefault())



    // IF, THIS PAD IS CALLED FOR EDITTING PRE-DEFINED BITMAP PAD,
    // LOAD THAT IMAGE
    if(this.editFlag) {
      this.canvasPadContext.drawImage(
          this.preLoadedImg, 
          0, 0, this.width, this.height)
      this.canvas_mem_ctx.drawImage(
          this.preLoadedImg, 
          0, 0, this.width, this.height)
    }





    // ==============================================================
    // CREATE OK BUTTON
    let workarea = document.getElementById('workarea')
    this.btnHndOK = (ev) => {
      //console.log('BITMAPPAD OK BUTTON CLICKED !!!!')

      // < CANVAS IMAGE COPY > 
      // https://blanktar.jp/blog/2015/04/html-canvas-copy
      const evToState = new CustomEvent('createNewBitmapPad', {
        bubbles: true,
        detail: {
          obj: this,
          canvasContext: this.canvas_mem_ctx,
          //canvasContext: this.canvasPad.getContext('2d'),
          width: this.canvasPad.getAttribute('width'),
          height: this.canvasPad.getAttribute('height'),
          storedXPos: this.object_xPos,
          storedYPos: this.object_yPos,
          storedZIndex: this.oldZIndex
        }
      })

      // USING THE REFERENCE TO OLD OBJECT, WE WILL DELETE IT 
      // BEFORE WE CREATE RE-NEWED BITMAP PAD
      if(this.oldObjRef) {
        let str = localStorage

        // 1. DELETE LOCAL STORAGE (OBJECT)
        str.removeItem(this.oldObjRef.groupId) 
        // 2. DELETE LOCAL STORAGE (ANIMATION)
        str.removeItem(this.oldObjRef.groupId + '_anim') 
        // 3. DELETE LOCAL STORAGE (ATTRIBBOX)
        str.removeItem(this.oldObjRef.groupId + '_attrbox') 

        // DELETE OLD OBJECT
        this.oldObjRef.remove()
        delete this.oldObjRef.stateObj.renderListAll[this.oldObjRef.groupId]
      }

      // < MAKE DEEP COPY OF THE NODE >
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
      workarea.dispatchEvent(evToState)
    }

    const buttonOKSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonOK',
      stylesheets: ['bl_bitmapPad_okBtn', 'ly_bitmapPad_okBtn'],
      pathShape: "7.09,28.38 26.61,53.83 52.91,14.8 41.88,7.17 26.61,27.53 16.42,16.5 ",
      width: 60,
      height: 60,
      fill: "#ee5035",
      fillHover: "#fb866c",
      opacity: 1.0,
      clickHnd: this.btnHndOK
    }

    this.buttonOK = new ButtonSimple(buttonOKSettings)
    this.buttonOK.svgRoot.setAttribute('x', '10%')


    // ==============================================================
    // CREATE CANCEL BUTTON
    this.btnHndCancel = (ev) => {
      //console.log('BITMAPPAD CANCEL BUTTON CLICKED !!!!')

      this.remove()
    }

    const buttonCancelSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonCancel',
      stylesheets: ['bl_bitmapPad_cancelBtn', 'ly_bitmapPad_cancelBtn'],
      pathShape: "9.24,16.34 19.68,30 8.63,41.28 15.66,51.69 30.12,40.44 43.78,51.69 52.61,42.05 40.56,30 52.61,17.15 42.97,9.12 30.93,18.75 17.27,8.31 ",
      width: 60,
      height: 60,
      fill: "#31ce8f",
      fillHover: "#76dbaa",
      opacity: 1.0,
      clickHnd: this.btnHndCancel
    }

    this.buttonCancel = new ButtonSimple(buttonCancelSettings)
    this.buttonCancel.svgRoot.setAttribute('x', '1%')





    // ==============================================================================
    // < CANVAS SIZE RESIZING >


    // ==============================================================
    // SIZE HEIGHT UPPER BUTTON
    this.btnHndHeightSzUp = (ev) => {
      //console.log('BITMAPPAD SIZE HEIGHT UP BUTTON CLICKED !!!!')

      let currentHeight = parseInt(this.svgTxtHeight.textContent)

      if(currentHeight > 100) {

        currentHeight -= 50

      } 
      this.svgTxtHeight.textContent = currentHeight
      this.height = currentHeight

      // ADJUSTING SIZE
      this.svgForeign.setAttribute('height', this.height)
      this.canvasDivRoot.setAttribute('height', this.height)
      this.canvasPad.setAttribute('height', this.height)
      this.canvas_mem.setAttribute('height', this.height)

      // RE-SETTING CONTEXT
      this.canvasPadContext.height = this.height
      this.canvasPadContext.lineCap = 'round'
      this.canvasPadContext.lineJoin = 'round'
      this.canvasPadContext.strokeStyle = this.currentColor
      this.canvasPadContext.lineWidth = parseInt(this.penSzIndicator.getAttribute('r'))

      // RE-SETTING CONTEXT
      this.canvas_mem_ctx.height = this.height
      this.canvas_mem_ctx.lineCap = 'round'
      this.canvas_mem_ctx.lineJoin = 'round'
      this.canvas_mem_ctx.lineWidth = parseInt(this.penSzIndicator.getAttribute('r'))

      // CLEARING IN-MEMORY CANVAS
      //this.canvasPadContext.clearRect(0, 0, this.canvasPadContext.width, this.canvasPadContext.height)
      //this.canvas_mem_ctx.clearRect(0, 0, this.canvas_mem_ctx.width, this.canvas_mem_ctx.height)
      // RESETTING POINT ARRAY
      this.linePoints = []

    }

    const buttonHeightSzUpSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonHeightSzUp',
      stylesheets: ['bl_bitmapPad_SzHeightUpBtn', 'ly_bitmapPad_SzHeightUpBtn'],
      pathShape: "4,29 21,8 37,29 21,23 ",
      width: 40,
      height: 40,
      fill: "#ee5035",
      fillHover: "#fb866c",
      opacity: 1.0,
      clickHnd: this.btnHndHeightSzUp
    }

    this.buttonHeightSzUp = new ButtonSimple(buttonHeightSzUpSettings)
    this.buttonHeightSzUp.svgRoot.setAttribute('x', '13%')
    this.buttonHeightSzUp.svgRoot.setAttribute('y', '19%')



    // ==============================================================
    // SIZE HEIGHT DOWN BUTTON
    this.btnHndHeightSzDown = (ev) => {
      //console.log('BITMAPPAD CANCEL BUTTON CLICKED !!!!')

      let currentHeight = parseInt(this.svgTxtHeight.textContent)
      if(currentHeight < 400) {

        currentHeight += 50

      } 
      this.svgTxtHeight.textContent = currentHeight
      this.height = currentHeight

      // ADJUSTING SIZE
      this.svgForeign.setAttribute('height', this.height)
      this.canvasDivRoot.setAttribute('height', this.height)
      this.canvasPad.setAttribute('height', this.height)
      this.canvas_mem.setAttribute('height', this.height)

      // RE-SETTING CONTEXT
      this.canvasPadContext.height = this.height
      this.canvasPadContext.lineCap = 'round'
      this.canvasPadContext.lineJoin = 'round'
      this.canvasPadContext.strokeStyle = this.currentColor
      this.canvasPadContext.lineWidth = parseInt(this.penSzIndicator.getAttribute('r'))

      // RE-SETTING CONTEXT
      this.canvas_mem_ctx.height = this.height
      this.canvas_mem_ctx.lineCap = 'round'
      this.canvas_mem_ctx.lineJoin = 'round'
      this.canvas_mem_ctx.lineWidth = parseInt(this.penSzIndicator.getAttribute('r'))

      // CLEARING IN-MEMORY CANVAS
      //this.canvasPadContext.clearRect(0, 0, this.canvasPadContext.width, this.canvasPadContext.height)
      //this.canvas_mem_ctx.clearRect(0, 0, this.canvas_mem_ctx.width, this.canvas_mem_ctx.height)
      // RESETTING POINT ARRAY
      this.linePoints = []
    }

    const buttonHeightSzDownSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonHeightSzDown',
      stylesheets: ['bl_bitmapPad_SzHeightDownBtn', 'ly_bitmapPad_SzHeightDownBtn'],
      pathShape: "37,9 20,30 4,9 20,15 ",
      width: 40,
      height: 40,
      fill: "#ee5035",
      fillHover: "#fb866c",
      opacity: 1.0,
      clickHnd: this.btnHndHeightSzDown
    }

    this.buttonHeightSzDown = new ButtonSimple(buttonHeightSzDownSettings)
    this.buttonHeightSzDown.svgRoot.setAttribute('x', '13%')
    this.buttonHeightSzDown.svgRoot.setAttribute('y', '27%')






    // ==============================================================
    // SIZE LENGTH UPPER BUTTON
    this.btnHndLengthSzUp = (ev) => {
      //console.log('BITMAPPAD SIZE LENGTH UP BUTTON CLICKED !!!!')

      let currentLength = parseInt(this.svgTxtWidth.textContent)

      if(currentLength < 700) {

        currentLength += 50

      } 
      this.svgTxtWidth.textContent = currentLength
      this.width = currentLength

      // ADJUSTING SIZE
      this.svgForeign.setAttribute('width', this.width)
      this.canvasDivRoot.setAttribute('width', this.width)
      this.canvasPad.setAttribute('width', this.width)
      this.canvas_mem.setAttribute('width', this.width)

      // RE-SETTING CONTEXT
      this.canvasPadContext.width = this.width
      this.canvasPadContext.lineCap = 'round'
      this.canvasPadContext.lineJoin = 'round'
      this.canvasPadContext.strokeStyle = this.currentColor
      this.canvasPadContext.lineWidth = parseInt(this.penSzIndicator.getAttribute('r'))

      // RE-SETTING CONTEXT
      this.canvas_mem_ctx.width = this.width
      this.canvas_mem_ctx.lineCap = 'round'
      this.canvas_mem_ctx.lineJoin = 'round'
      this.canvas_mem_ctx.lineWidth = parseInt(this.penSzIndicator.getAttribute('r'))

      // CLEARING IN-MEMORY CANVAS
      //this.canvasPadContext.clearRect(0, 0, this.canvasPadContext.width, this.canvasPadContext.height)
      //this.canvas_mem_ctx.clearRect(0, 0, this.canvas_mem_ctx.width, this.canvas_mem_ctx.height)
      // RESETTING POINT ARRAY
      this.linePoints = []
    }

    const buttonLengthSzUpSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonLengthSzUp',
      stylesheets: ['bl_bitmapPad_SzLengthUpBtn', 'ly_bitmapPad_SzLengthUpBtn'],
      pathShape: "10,3 31,20 10,36 16,20 ",
      width: 40,
      height: 40,
      fill: "#ee5035",
      fillHover: "#fb866c",
      opacity: 1.0,
      clickHnd: this.btnHndLengthSzUp
    }

    this.buttonLengthSzUp = new ButtonSimple(buttonLengthSzUpSettings)
    this.buttonLengthSzUp.svgRoot.setAttribute('x', '25%')
    this.buttonLengthSzUp.svgRoot.setAttribute('y', '10%')



    // ==============================================================
    // SIZE LENGTH DOWN BUTTON
    this.btnHndLengthSzDown = (ev) => {
      //console.log('BITMAPPAD CANCEL BUTTON CLICKED !!!!')

      let currentLength = parseInt(this.svgTxtWidth.textContent)

      if(currentLength > 100) {

        currentLength -= 50

      } 
      this.svgTxtWidth.textContent = currentLength
      this.width = currentLength

      // ADJUSTING SIZE
      this.svgForeign.setAttribute('width', this.width)
      this.canvasDivRoot.setAttribute('width', this.width)
      this.canvasPad.setAttribute('width', this.width)
      this.canvas_mem.setAttribute('width', this.width)

      // RE-SETTING CONTEXT
      this.canvasPadContext.width = this.width
      this.canvasPadContext.lineCap = 'round'
      this.canvasPadContext.lineJoin = 'round'
      this.canvasPadContext.strokeStyle = this.currentColor
      this.canvasPadContext.lineWidth = parseInt(this.penSzIndicator.getAttribute('r'))

      // RE-SETTING CONTEXT
      this.canvas_mem_ctx.width = this.width
      this.canvas_mem_ctx.lineCap = 'round'
      this.canvas_mem_ctx.lineJoin = 'round'
      this.canvas_mem_ctx.lineWidth = parseInt(this.penSzIndicator.getAttribute('r'))

      // CLEARING IN-MEMORY CANVAS
      //this.canvasPadContext.clearRect(0, 0, this.canvasPadContext.width, this.canvasPadContext.height)
      //this.canvas_mem_ctx.clearRect(0, 0, this.canvas_mem_ctx.width, this.canvas_mem_ctx.height)
      // RESETTING POINT ARRAY
      this.linePoints = []
    }

    const buttonLengthSzDownSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonLengthSzDown',
      stylesheets: ['bl_bitmapPad_SzLengthDownBtn', 'ly_bitmapPad_SzLengthDownBtn'],
      pathShape: "31,36 10,19 31,3 25,19 ",
      width: 40,
      height: 40,
      fill: "#ee5035",
      fillHover: "#fb866c",
      opacity: 1.0,
      clickHnd: this.btnHndLengthSzDown
    }

    this.buttonLengthSzDown = new ButtonSimple(buttonLengthSzDownSettings)
    this.buttonLengthSzDown.svgRoot.setAttribute('x', '20%')
    this.buttonLengthSzDown.svgRoot.setAttribute('y', '10%')





    // ===============================================================================




    // ==============================================================
    // PEN WIDTH WIDER BUTTON
    this.btnHndPenSzUp = (ev) => {
      //console.log('PEN SIZE UP BUTTON CLICKED !!!!')
      if(this.canvasPadContext.lineWidth < 20) {
        this.canvasPadContext.lineWidth += 1
        this.canvas_mem_ctx.lineWidth += 1
        this.penSzIndicator.setAttribute('r', this.canvasPadContext.lineWidth)
      } 
    }
    const buttonPenSzUpSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonPenSzUp',
      stylesheets: ['bl_bitmapPad_SzHeightUpBtn', 'ly_bitmapPad_SzHeightUpBtn'],
      pathShape: "4,29 21,8 37,29 21,23 ",
      width: 40,
      height: 40,
      fill: "#ee5035",
      fillHover: "#fb866c",
      opacity: 1.0,
      clickHnd: this.btnHndPenSzUp
    }
    this.buttonPenSzUp = new ButtonSimple(buttonPenSzUpSettings)
    this.buttonPenSzUp.svgRoot.setAttribute('x', '68%')
    this.buttonPenSzUp.svgRoot.setAttribute('y', '1%')


    // ==============================================================
    // PEN WIDTH SMALLER BUTTON
    this.btnHndPenSzDown = (ev) => {
      //console.log('PEN SIZE DOWN BUTTON CLICKED !!!!')
      if(this.canvasPadContext.lineWidth > 1) {
        this.canvasPadContext.lineWidth -= 1
        this.canvas_mem_ctx.lineWidth -= 1
        this.penSzIndicator.setAttribute('r', this.canvasPadContext.lineWidth)
      } 
    }
    const buttonPenSzDownSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonPenSzDown',
      stylesheets: ['bl_bitmapPad_SzHeightDownBtn', 'ly_bitmapPad_SzHeightDownBtn'],
      pathShape: "37,9 20,30 4,9 20,15 ",
      width: 40,
      height: 40,
      fill: "#ee5035",
      fillHover: "#fb866c",
      opacity: 1.0,
      clickHnd: this.btnHndPenSzDown
    }
    this.buttonPenSzDown = new ButtonSimple(buttonPenSzDownSettings)
    this.buttonPenSzDown.svgRoot.setAttribute('x', '68%')
    this.buttonPenSzDown.svgRoot.setAttribute('y', '5%')






    // ===============================================================================
    // < COLOR SWATCHES > 
    this.colorSwatchBtn = this.setColorSwatches()






    // ===============================================================================
    // < DRAWING FUNCTIONALITY > 
    // 
    // ******* TODO :: TAKE NOTE BELOW !!! *******
    // < SMOOTH DRAWING >
    // http://jsfiddle.net/gounbeee/vcntep4w/
    // http://jsfiddle.net/aMmVQ/

    // ====================================
    // SMOOTH DRAWING USING QUADRATIC CURVE 
    // 


    // MOUSE :: < DOWN >
    // 1. CHECKING RIGHT MOUSE BUTTON
    // 2. GETTING NEW MOUSE POSITION
    // 3. STORING FIRST POSITION TO ARRAY
    // 4. FLAG ON
    this.onDown = (e) => {
      //console.log('DRAWING :: MOUSE CLICKED')

      // -----------------------------------------------------------------------------
      // < RIGHT MOUSE BUTTON CHECK >
      // https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
      e = e || window.event

      if ("which" in e){                                       
        this.rightButtonFlag = e.which == 3                       // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      } else if ("button" in e) {                                
        this.rightButtonFlag = e.button == 2                      // IE, Opera
      }
      //console.log(this.rightButtonFlag)


      // -----------------------------------------------------------------------------
      // GETTING NEW POSITION
      let position = this.screenPointToDivPoint(this.inputUIRoot, this.svgForeign, e.clientX, e.clientY)

      this.pointerPosX = position.x
      this.pointerPosY = position.y

      // -----------------------------------------------------------------------------
      // STORING POSITION
      this.linePoints.push({
        x: position.x,
        y: position.y
      })

      // console.log(this.pointerPosX)
      // console.log(this.pointerPosY)

      // -----------------------------------------------------------------------------
      // isDrawing FLAG IS NOW ON
      this.isDrawing = true

    }


    // ===============================================================================
    // MOUSE :: < MOVING >
    // **** CONSTANTLY CALLING ****
    this.onMove = (e) => {
      //console.log('DRAWING :: MOUSE MOVING')
      //console.log(this.pointerInput.penPressure)

      // GATE USING FLAG TO DRAW
      if(!this.isDrawing) return

      // 'CONSTANTLY' RESET CURRENT CANVAS
      // EVEN WE DELETE CURRENT IMAGE, WE ARE RESTORING UPDATED IMAGE FROM 
      //
      // --> SO, TECHNICALLY WE DO NOT 'DROP' PIXELS TO CANVAS UNTIL WE RELEASE THE BUTTON !!!!
      //     JUST 'PREVIEWING' THE NEW LINE
      this.canvasPadContext.clearRect(0, 0, this.width, this.height)
      
      // 'CONSTANTLY' RESTORING LAST IMAGE FROM MEMORY
      // :: SO, IT WILL DRAW ONLY 1 LINE WHICH IS CURRENTLY DRAWING
      // 
      // --> UNTIL WE ARE PREVIEWING CURRENT LINE,
      //     BELOW DRAWS 'CURRENT RESULT' FROM LAST CANVAS(IN-MEMORY)
      this.canvasPadContext.drawImage(this.canvas_mem, 0, 0)

      // GETTING NEW POSITION (SLIGHTLY MOVED)
      let newPosition = this.screenPointToDivPoint(this.inputUIRoot, this.svgForeign, e.clientX, e.clientY)
      this.pointerPosX = newPosition.x
      this.pointerPosY = newPosition.y

      // STORING THAT NEW POSITION
      this.linePoints.push({
        x: newPosition.x,
        y: newPosition.y
      })

      // < DRAWING >
      // LEFT MOUSE BUTTON TO DRAW
      if(!this.rightButtonFlag) {

        this.canvas_mem_ctx.globalCompositeOperation = "source-over"

        this.drawLine(this.canvasPadContext)

      } else {

        this.canvas_mem_ctx.globalCompositeOperation = "destination-out"

        this.drawLine(this.canvas_mem_ctx)  

      }

    }




    this.drawLine = (context) => {

      // UNTIL STORED POSITIONS ARE NOT REACHED SOME LEVEL,
      // JUST DRAW CIRCLE?
      if(this.linePoints.length < 6) {
        // let startPoint = this.linePoints[0]
        // this.canvasPadContext.beginPath()
        // this.canvasPadContext.strokeStyle = this.currentColor
        // this.canvasPadContext.arc(startPoint.x, startPoint.y, this.canvasPadContext.lineWidth/2, 0, Math.PI * 2, !0)
        // this.canvasPadContext.closePath()
        // this.canvasPadContext.fill()
        return
      }

      // AFTER POSITIONS ARE STORED ENOUGH,
      // WE CAN DRAW SMOOTH CURVE USING THAT POINTS
      context.beginPath()

      // FIRST POINT
      context.moveTo(this.linePoints[0].x, this.linePoints[0].y)

      // CREATING CURVE USING MULTIPLE POINTS
      // USING MID-POSITION BETWEEN TWO
      for(let i = 1; i < this.linePoints.length - 2; i++) {
        let midX = (this.linePoints[i].x + this.linePoints[i + 1].x) / 2
        let midY = (this.linePoints[i].y + this.linePoints[i + 1].y) / 2
        context.quadraticCurveTo(this.linePoints[i].x, this.linePoints[i].y, midX, midY)
        
      }


      //console.log(this.linePoints.length)
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.shadowColor = this.currentColor
      context.shadowBlur = 1
      // DRAW
      context.strokeStyle = this.currentColor
      context.stroke()

      context.shadowBlur = 0




      // ==================================================================
      // USING BELOW,
      // WE CAN USE 'PEN PRESSURE'
      // AND,
      // WE CAN CREATE 'DOTTED' LINE USING HERE --------------
      //                                                     |
      //                                                     V
      // for(let i = 0; i < this.linePoints.length - 3; i += 3) {

      //   // AFTER POSITIONS ARE STORED ENOUGH,
      //   // WE CAN DRAW SMOOTH CURVE USING THAT POINTS
      //   this.canvasPadContext.beginPath()
      //   // FIRST POINT
      //   this.canvasPadContext.moveTo(this.linePoints[i].x, this.linePoints[i].y)

      //   // CREATING CURVE USING MULTIPLE POINTS
      //   // USING MID-POSITION BETWEEN TWO
      //   for(let j = 0; j < 3; j++) {
      //     let midX = (this.linePoints[i + j].x + this.linePoints[i + j + 1].x) / 2
      //     let midY = (this.linePoints[i + j].y + this.linePoints[i + j + 1].y) / 2
      //     this.canvasPadContext.quadraticCurveTo(this.linePoints[i+j].x, this.linePoints[i+j].y, midX, midY)
      //   }

      //   // GETTING PRESSURE
      //   this.canvasPadContext.lineWidth = 2
      //   //this.canvasPadContext.lineWidth = 2 * this.pointerInput.penPressure

      //   this.canvasPadContext.shadowColor = 'black'
      //   this.canvasPadContext.shadowBlur = 1

      //   // DRAW
      //   this.canvasPadContext.stroke()

      //   // CLEARING IN-MEMORY CANVAS
      //   this.canvas_mem_ctx.clearRect(0, 0, this.canvas_mem_ctx.width, this.canvas_mem_ctx.height)
      //   // STORING CURRENT CANVAS TO IN-MEMORY CANVAS
      //   this.canvas_mem_ctx.drawImage(this.canvasPad, 0, 0)

      //   this.canvasPadContext.shadowBlur = 0
      // }

    }



    // MOUSE BUTTON :: <UP>
    this.onUp = (e) => {
      //console.log('DRAWING :: MOUSE UP')

      if(this.isDrawing) {
        // isDrawing FLAG OFF
        this.isDrawing = false
        // RESETTING POINT ARRAY
        this.linePoints = []

        if(!this.rightButtonFlag) {
          // CLEARING IN-MEMORY CANVAS
          this.canvas_mem_ctx.clearRect(0, 0, this.width, this.height)
          // STORING CURRENT CANVAS TO IN-MEMORY CANVAS
          this.canvas_mem_ctx.drawImage(this.canvasPad, 0, 0)
        } 

      }
    }



    // MOUSE BUTTON :: <LEAVE>
    this.onLeave = (e) => {
      if(this.isDrawing) {
        // isDrawing FLAG OFF
        this.isDrawing = false
        // RESETTING POINT ARRAY
        this.linePoints = []

        if(!this.rightButtonFlag) {
          // CLEARING IN-MEMORY CANVAS
          this.canvas_mem_ctx.clearRect(0, 0, this.width, this.height)
          // STORING CURRENT CANVAS TO IN-MEMORY CANVAS
          this.canvas_mem_ctx.drawImage(this.canvasPad, 0, 0)
        }       
      }
    }



    // MOUSE EVENT LISTENER
    this.canvasPad.addEventListener('mousedown',this.onDown)
    this.canvasPad.addEventListener('mousemove',this.onMove)
    this.canvasPad.addEventListener('mouseup',this.onUp)
    this.canvasPad.addEventListener('mouseleave',this.onLeave)









    // ==================================================================
    // TABLET POINTER SETTING

    const pointerInputSettings = {
      target: this.canvasPad
    }
    this.pointerInput = new PointerInput(pointerInputSettings)





  }





  setColorSwatches() {

    let result = {}

    for(let i = 0; i < this.colorCounts; i++) {

      const swatchSettings = {
        target: this.svgRoot,
        id: 'bitmapPad_buttonLengthSzDown',
        stylesheets: ['bl_bitmapPad_SzLengthDownBtn', 'ly_bitmapPad_SzLengthDownBtn'],
        pathShape: "0,0 20,0 20,40 0,40 ",
        width: 20,
        height: 40,
        fill: this.colorSwatches[i],
        fillHover: this.colorSwatchesHover[i],
        opacity: 1.0,
        clickHnd: (ev) => {
          //console.log(`COLOR :: ${this.colorSwatches[i]}    IS SELECTED`)
          this.currentColor = this.colorSwatches[i]
        }
      }

      let swatchBtn = new ButtonSimple(swatchSettings)
      swatchBtn.svgRoot.setAttribute('x', `${85 + i*2}%`)
      swatchBtn.svgRoot.setAttribute('y', '3%')
      result[`swatch_${i}`] = swatchBtn
    }

    return result
  }





  remove() {

    this.buttonOK.remove()
    this.buttonCancel.remove()

    this.penSzIndicator.remove()

    this.inputUIRoot.remove()
    this.svgRoot.remove()
    this.svgTxtWidth.remove()
    this.svgTxtHeight.remove()
    this.svgForeign.remove()
    this.canvasDivRoot.remove()
    this.canvasPad.remove()
    this.canvas_mem.remove()

    delete this
  }


  imagedata_to_image(imagedata) {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      canvas.width = imagedata.width
      canvas.height = imagedata.height
      ctx.putImageData(imagedata, 0, 0)

      var image = new Image()
      image.src = canvas.toDataURL()
      image.width = imagedata.width
      image.height = imagedata.height
      return image
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





}


export {BitmapPad}
