'strict mode'

import { ButtonSimple }         from "./ButtonSimple.mjs"
import { PointerInput }         from "./PointerInput.mjs"


class BitmapPad {
	

	constructor(settings) {

    this.nsSvg = 'http://www.w3.org/2000/svg'


    this.isDrawing = false
    this.rightButtonFlag = false

    this.linePoints = []


    this.pointerPosX = undefined
    this.pointerPosY = undefined
    this.pointerPosAnchX = undefined
    this.pointerPosAnchY = undefined

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
    // CREATING MENU UI
    this.menuRoot = document.createElement('div')
    this.menuRoot.id = 'BITMAP_PAD_MENU'
    this.menuRoot.classList.add('bl_bitmapPad_menu')
    this.menuRoot.classList.add('ly_bitmapPad_menu')

    this.inputUIRoot.prepend(this.menuRoot)

    // ----------------------------------------------------
    // STROKE COLOR CONTROLLERS
    this.menuRootStroke = document.createElement('div')
    this.menuRoot.appendChild(this.menuRootStroke)

    this.menuRootStroke.classList.add('bl_bitmapPad_menu_strk')
    this.menuRootStroke.classList.add('ly_bitmapPad_menu_strk')

    // LABEL
    this.menuRootStrokeLb = document.createElement('label')
    this.menuRootStrokeLb.id = 'BITMAP_PAD_MENU_STRK_LB'
    this.menuRootStrokeLb.innerHTML = 'COLOR'

    // INPUT ELEMENT
    this.menuRootStrokeInpt = document.createElement('input')
    this.menuRootStrokeInpt.type = 'color'
    this.menuRootStrokeInpt.id = 'BITMAP_PAD_MENU_STRK'
    this.menuRootStrokeInpt.style.backgroundColor = 'transparent'
    this.menuRootStrokeInpt.style.borderColor = 'transparent'
    this.menuRootStrokeInpt.style.borderRadius = '10px'
    this.menuRootStrokeInpt.style.padding = '3px 0px 0px 0px'

    this.menuRootStroke.appendChild(this.menuRootStrokeLb)
    this.menuRootStroke.appendChild(this.menuRootStrokeInpt)

    // IF CHANGES OCCURED IN INPUT ELEMENT, SET THE LINE COLOR TO THAT
    this.menuRootStrokeInpt.addEventListener('change', e => {
      this.canvasPadContext.strokeStyle = this.currentColor = e.target.value
    })



    // ----------------------------------------------------
    // BACKGROUND COLOR CONTROLLERS
    this.menuRootBg = document.createElement('div')
    this.menuRoot.appendChild(this.menuRootBg)

    this.menuRootBg.classList.add('bl_bitmapPad_menu_bg')
    this.menuRootBg.classList.add('ly_bitmapPad_menu_bg')

    // LABEL
    this.menuRootBgLb = document.createElement('label')
    this.menuRootBgLb.id = 'BITMAP_PAD_MENU_STRK_LB'
    this.menuRootBgLb.innerHTML = 'CANVAS BG'

    // INPUT ELEMENT
    this.menuRootBgInpt = document.createElement('input')
    this.menuRootBgInpt.type = 'color'
    this.menuRootBgInpt.id = 'BITMAP_PAD_MENU_BG'
    this.menuRootBgInpt.style.backgroundColor = 'transparent'
    this.menuRootBgInpt.style.borderColor = 'transparent'
    this.menuRootBgInpt.style.borderRadius = '10px'
    this.menuRootBgInpt.style.padding = '3px 0px 0px 0px'
    this.menuRootBgInpt.value = '#ffffff'


    this.menuRootBg.appendChild(this.menuRootBgLb)
    this.menuRootBg.appendChild(this.menuRootBgInpt)


    // IF CHANGES OCCURED IN INPUT ELEMENT, SET THE LINE COLOR TO THAT
    // < input EVENT TYPE USED !!!! >
    // https://stackoverflow.com/questions/66065572/see-how-the-color-is-being-changed-with-input-type-color
    this.menuRootBgInpt.addEventListener('input', e => {

      this.canvasPad.style.backgroundColor = e.target.value

    })




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
    this.penSzIndicator.setAttribute('cy', '9%')

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
    this.canvasDivRoot.id = 'BITMAP_PAD_DIV'
    this.canvasDivRoot.classList.add('bl_bitmapPad_div_root')

    this.canvasPad = document.createElement('canvas')
    this.canvasPad.id = 'BITMAP_PAD_CANVAS'
    this.canvasPad.setAttribute('width', this.width)
    this.canvasPad.setAttribute('height', this.height)

    this.svgForeign.appendChild(this.canvasDivRoot)
    this.canvasDivRoot.appendChild(this.canvasPad)

    // THIS BACKGROUND COLOR IS JUST PREVIEW !
    // DOES NOT INCLUDE TO CONTENT !!
    this.canvasPad.style.backgroundColor = 'white'

    //this.canvasPad.style.border = '3px solid black'



    this.canvasPadContext = this.canvasPad.getContext("2d")

    this.canvasPadContext.beginPath()
    this.canvasPadContext.strokeStyle = this.currentColor
    this.canvasPadContext.lineWidth = 2
    this.canvasPadContext.lineCap = 'round'
    this.canvasPadContext.lineJoin = 'round'


    // < DISABLE MOUSE'S RIGHT BUTTON CLICK >
    // https://codinhood.com/nano/dom/disable-context-menu-right-click-javascript
    this.canvasPad.addEventListener("contextmenu", e => e.preventDefault())



    // IF, THIS PAD IS CALLED FOR EDITTING PRE-DEFINED BITMAP PAD,
    // LOAD THAT IMAGE
    if(this.editFlag) {
      this.canvasPadContext.drawImage(
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
          canvasContext: this.canvasPad.getContext('2d'),
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

      const imageData = this.canvasPadContext.getImageData(0, 0, this.width, this.height);

      let currentHeight = parseInt(this.svgTxtHeight.textContent)
      if(currentHeight > 100) {

        currentHeight -= 50

      } 
      this.svgTxtHeight.textContent = currentHeight
      this.height = currentHeight


      let newCanvas = document.createElement('canvas')
      newCanvas.id = 'NEW_CANVAS'

      newCanvas.setAttribute('width', this.width)
      newCanvas.setAttribute('height', this.height)


      // ADJUSTING SIZE
      this.svgForeign.setAttribute('height', this.height)
      this.canvasDivRoot.setAttribute('height', this.height)
      this.canvasPad.setAttribute('height', this.height)
      this.canvasPad.getContext('2d').putImageData(imageData, 0, 0)

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

      const imageData = this.canvasPadContext.getImageData(0, 0, this.width, this.height);

      let currentHeight = parseInt(this.svgTxtHeight.textContent)
      if(currentHeight < 400) {

        currentHeight += 50

      } 
      this.svgTxtHeight.textContent = currentHeight
      this.height = currentHeight


      let newCanvas = document.createElement('canvas')
      newCanvas.id = 'NEW_CANVAS'

      newCanvas.setAttribute('width', this.width)
      newCanvas.setAttribute('height', this.height)


      // ADJUSTING SIZE
      this.svgForeign.setAttribute('height', this.height)
      this.canvasDivRoot.setAttribute('height', this.height)
      this.canvasPad.setAttribute('height', this.height)
      this.canvasPad.getContext('2d').putImageData(imageData, 0, 0)

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

      const imageData = this.canvasPadContext.getImageData(0, 0, this.width, this.height);

      let currentWidth = parseInt(this.svgTxtWidth.textContent)
      if(currentWidth < 700) {

        currentWidth += 50

      } 
      this.svgTxtWidth.textContent = currentWidth
      this.width = currentWidth


      let newCanvas = document.createElement('canvas')
      newCanvas.id = 'NEW_CANVAS'

      newCanvas.setAttribute('width', this.width)
      newCanvas.setAttribute('height', this.height)


      // ADJUSTING SIZE
      this.svgForeign.setAttribute('width', this.width)
      this.canvasDivRoot.setAttribute('width', this.width)
      this.canvasPad.setAttribute('width', this.width)
      this.canvasPad.getContext('2d').putImageData(imageData, 0, 0)

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

      const imageData = this.canvasPadContext.getImageData(0, 0, this.width, this.height);

      let currentWidth = parseInt(this.svgTxtWidth.textContent)
      if(currentWidth > 100) {

        currentWidth -= 50

      } 
      this.svgTxtWidth.textContent = currentWidth
      this.width = currentWidth


      let newCanvas = document.createElement('canvas')
      newCanvas.id = 'NEW_CANVAS'

      newCanvas.setAttribute('width', this.width)
      newCanvas.setAttribute('height', this.height)


      // ADJUSTING SIZE
      this.svgForeign.setAttribute('width', this.width)
      this.canvasDivRoot.setAttribute('width', this.width)
      this.canvasPad.setAttribute('width', this.width)
      this.canvasPad.getContext('2d').putImageData(imageData, 0, 0)

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






    // ==============================================================================
    // < CANVAS OFFSET SLIDE >


    // ==============================================================
    // OFFSET HEIGHT UPPER BUTTON
    this.btnHndHeightOffsetUp = (ev) => {

      const imageData = this.canvasPadContext.getImageData(0, 0, this.width, this.height);
      this.canvasPad.getContext('2d').clearRect(0, 0, this.width, this.height)
      this.canvasPad.getContext('2d').putImageData(imageData, 0, -10)

    }


    const buttonHeightOffsetUpSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonHeightOffsetUp',
      stylesheets: ['bl_bitmapPad_OffsetHeightUpBtn', 'ly_bitmapPad_OffsetHeightUpBtn'],
      pathShape: "4,29 21,8 37,29 21,23 ",
      width: 40,
      height: 40,
      fill: "#5035ee",
      fillHover: "#866cfb",
      opacity: 1.0,
      clickHnd: this.btnHndHeightOffsetUp
    }

    this.buttonHeightOffsetUp = new ButtonSimple(buttonHeightOffsetUpSettings)
    this.buttonHeightOffsetUp.svgRoot.setAttribute('x', '8%')
    this.buttonHeightOffsetUp.svgRoot.setAttribute('y', '19%')



    // ==============================================================
    // Offset HEIGHT DOWN BUTTON
    this.btnHndHeightOffsetDown = (ev) => {

      const imageData = this.canvasPadContext.getImageData(0, 0, this.width, this.height);
      this.canvasPad.getContext('2d').clearRect(0, 0, this.width, this.height)
      this.canvasPad.getContext('2d').putImageData(imageData, 0, 10)

    }

    const buttonHeightOffsetDownSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonHeightOffsetDown',
      stylesheets: ['bl_bitmapPad_OffsetHeightDownBtn', 'ly_bitmapPad_OffsetHeightDownBtn'],
      pathShape: "37,9 20,30 4,9 20,15 ",
      width: 40,
      height: 40,
      fill: "#5035ee",
      fillHover: "#866cfb",
      opacity: 1.0,
      clickHnd: this.btnHndHeightOffsetDown
    }

    this.buttonHeightOffsetDown = new ButtonSimple(buttonHeightOffsetDownSettings)
    this.buttonHeightOffsetDown.svgRoot.setAttribute('x', '8%')
    this.buttonHeightOffsetDown.svgRoot.setAttribute('y', '47%')






    // ==============================================================
    // Offset LENGTH UPPER BUTTON
    this.btnHndLengthOffsetUp = (ev) => {

      const imageData = this.canvasPadContext.getImageData(0, 0, this.width, this.height);
      this.canvasPad.getContext('2d').clearRect(0, 0, this.width, this.height)
      this.canvasPad.getContext('2d').putImageData(imageData, 10, 0 )

    }

    const buttonLengthOffsetUpSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonLengthOffsetUp',
      stylesheets: ['bl_bitmapPad_OffsetLengthUpBtn', 'ly_bitmapPad_OffsetLengthUpBtn'],
      pathShape: "10,3 31,20 10,36 16,20 ",
      width: 40,
      height: 40,
      fill: "#5035ee",
      fillHover: "#866cfb",
      opacity: 1.0,
      clickHnd: this.btnHndLengthOffsetUp
    }

    this.buttonLengthOffsetUp = new ButtonSimple(buttonLengthOffsetUpSettings)
    this.buttonLengthOffsetUp.svgRoot.setAttribute('x', '40%')
    this.buttonLengthOffsetUp.svgRoot.setAttribute('y', '2%')



    // ==============================================================
    // Offset LENGTH DOWN BUTTON
    this.btnHndLengthOffsetDown = (ev) => {

      const imageData = this.canvasPadContext.getImageData(0, 0, this.width, this.height);
      this.canvasPad.getContext('2d').clearRect(0, 0, this.width, this.height)
      this.canvasPad.getContext('2d').putImageData(imageData, -10, 0 )

    }

    const buttonLengthOffsetDownSettings = {
      target: this.svgRoot,
      id: 'bitmapPad_buttonLengthOffsetDown',
      stylesheets: ['bl_bitmapPad_SzLengthDownBtn', 'ly_bitmapPad_OffsetLengthDownBtn'],
      pathShape: "31,36 10,19 31,3 25,19 ",
      width: 40,
      height: 40,
      fill: "#5035ee",
      fillHover: "#866cfb",
      opacity: 1.0,
      clickHnd: this.btnHndLengthOffsetDown
    }

    this.buttonLengthOffsetDown = new ButtonSimple(buttonLengthOffsetDownSettings)
    this.buttonLengthOffsetDown.svgRoot.setAttribute('x', '20%')
    this.buttonLengthOffsetDown.svgRoot.setAttribute('y', '2%')





    // ===============================================================================




    // ==================================================================
    // PEN PRESSURE SETUP

    this.getPenPressureWidth = (event) => {
        // console.log(event.pointerId);
        // console.log(event.pointerType);
        // console.log(event.pressure);

        this.canvasPadContext.lineWidth = parseFloat(this.penSzIndicator.getAttribute('r')) * event.pressure * 5
        //this.penSzIndicator.setAttribute('r', this.canvasPadContext.lineWidth)

        //console.log(this.canvasPadContext.lineWidth);

    }
    this.canvasPad.addEventListener("pointermove", this.getPenPressureWidth, true);




    // ==============================================================
    // PEN WIDTH WIDER BUTTON
    this.btnHndPenSzUp = (ev) => {
      //console.log('PEN SIZE UP BUTTON CLICKED !!!!')
      if(this.canvasPadContext.lineWidth < 20) {
        this.canvasPadContext.lineWidth += 1
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
    this.buttonPenSzUp.svgRoot.setAttribute('y', '4%')


    // ==============================================================
    // PEN WIDTH SMALLER BUTTON
    this.btnHndPenSzDown = (ev) => {
      //console.log('PEN SIZE DOWN BUTTON CLICKED !!!!')
      if(this.canvasPadContext.lineWidth > 1) {
        this.canvasPadContext.lineWidth -= 1
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
    this.buttonPenSzDown.svgRoot.setAttribute('y', '8%')






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


      this.canvasPadContext.strokeStyle = this.currentColor
      this.canvasPadContext.lineCap = 'round';


      // -----------------------------------------------------------------------------
      // < RIGHT MOUSE BUTTON CHECK >
      // https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
      e = e || window.event

      if ("which" in e){                                       
        this.rightButtonFlag = e.which == 3                       // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      } else if ("button" in e) {                                
        this.rightButtonFlag = e.button == 2                      // IE, Opera
      }
      console.log(this.rightButtonFlag)


      // -----------------------------------------------------------------------------
      // GETTING NEW POSITION
      this.pointerPosAnchX = e.clientX - this.canvasPad.getBoundingClientRect().x;
      this.pointerPosAnchY = e.clientY - this.canvasPad.getBoundingClientRect().y;

      this.pointerPosX = this.pointerPosAnchX
      this.pointerPosY = this.pointerPosAnchY

      // console.log("+++++++")
      // console.log(`this.pointerPosAnchX  IS  --   ${this.pointerPosAnchX}`)
      // console.log(`this.pointerPosAnchY  IS  --   ${this.pointerPosAnchY}`)


      // console.log("+++++++")
      // console.log(`this.canvasPad.getBoundingClientRect()  IS  -- `)
      // console.log(this.canvasPad.getBoundingClientRect())
      // //console.log(`this.pointerPosAnchY  IS  --   ${this.pointerPosAnchY}`)


      // -----------------------------------------------------------------------------
      // isDrawing FLAG IS NOW ON
      this.isDrawing = true

    }


    // ===============================================================================
    // MOUSE :: < MOVING >
    // **** CONSTANTLY CALLING ****
    this.onMove = (e) => {
      //console.log('DRAWING :: MOUSE MOVING')

      // GATE USING FLAG TO DRAW
      if(!this.isDrawing) return



      // GETTING NEW POSITION (SLIGHTLY MOVED)
    
      this.pointerPosX += e.movementX
      this.pointerPosY += e.movementY

      // console.log("+++++++")
      // console.log(`this.pointerPosX  IS  --   ${this.pointerPosX}`)
      // console.log(`this.pointerPosY  IS  --   ${this.pointerPosY}`)


      // < DRAWING OR ERASING >
      // LEFT MOUSE BUTTON TO DRAW
      



      // < DRAWING >
      // LEFT MOUSE BUTTON TO DRAW
      if(!this.rightButtonFlag) {

        this.canvasPadContext.globalCompositeOperation = "source-over"
        this.drawLine()

      } else {
        // DRAW BRUSH CIRCLE FOR ERASER
        console.log(this.pointerPosX)

        // this.canvasPadContext.beginPath();
        // this.canvasPadContext.arc(this.pointerPosX, this.pointerPosY, this.canvasPadContext.lineWidth, 0, 2 * Math.PI, false);
        // this.canvasPadContext.fillStyle = 'green';
        // this.canvasPadContext.fill()



        this.canvasPadContext.globalCompositeOperation = "destination-out"


        this.drawLine()

      }

    }



    // DRAWING FUNCTION 
    this.drawLine = () => {
      this.canvasPadContext.lineTo(this.pointerPosX, this.pointerPosY);
      this.canvasPadContext.stroke();

      this.canvasPadContext.beginPath()
    }



    // MOUSE BUTTON :: <UP>
    this.onUp = (e) => {
      //console.log('DRAWING :: MOUSE UP')
        this.isDrawing = false
    }



    // MOUSE BUTTON :: <LEAVE>
    this.onLeave = (e) => {

      this.isDrawing = false
    }



    // MOUSE EVENT LISTENER

    this.setupAllEventListeners = () => {
      this.canvasPad.addEventListener('mousedown' ,this.onDown)
      this.canvasPad.addEventListener('mousemove' ,this.onMove)
      this.canvasPad.addEventListener('mouseup'   ,this.onUp)
      this.canvasPad.addEventListener('mouseleave',this.onLeave)
    }
    this.setupAllEventListeners()

    this.removeAllEventListeners = () => {
      this.canvasPad.removeEventListener('mousedown' ,this.onDown)
      this.canvasPad.removeEventListener('mousemove' ,this.onMove)
      this.canvasPad.removeEventListener('mouseup'   ,this.onUp)
      this.canvasPad.removeEventListener('mouseleave',this.onLeave)
    }



    // ==================================================================
    // TABLET POINTER SETTING

    // const pointerInputSettings = {
    //   target: this.canvasPad
    // }
    // this.pointerInput = new PointerInput(pointerInputSettings)

    











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

          this.menuRootStrokeInpt.value = this.colorSwatches[i]


        }
      }

      let swatchBtn = new ButtonSimple(swatchSettings)
      swatchBtn.svgRoot.setAttribute('x', `${85 + i*2}%`)
      swatchBtn.svgRoot.setAttribute('y', '6%')
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
