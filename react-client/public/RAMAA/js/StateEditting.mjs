'use strict'


import { Canvas }               from "./Canvas.mjs"
import { State }                from "./State.mjs"
import { DrawFactory }          from "./DrawFactory.mjs"
import { AttribManager }        from "./AttribManager.mjs"
import { ModalManager }         from "./ModalManager.mjs"
import { SliderDraggable }      from "./SliderDraggable.mjs"
import { Timeline }             from "./Timeline.mjs"
import { LocalStorageManager }  from "./LocalStorageManager.mjs"
import { SourceManager }        from "./SourceManager.mjs"
import { StateMachine }         from "./StateMachine.mjs"
import { ButtonToggle }         from "./ButtonToggle.mjs"
import { ButtonSimple }         from "./ButtonSimple.mjs"
import { BitmapPad }            from "./BitmapPad.mjs"
import { Security }             from "./Security.mjs"

//import { SlotMatrix }           from "./SlotMatrix.mjs"


// FUNCTIONALITIES FOR BETA VERSION

// TODO :  *  LICENSING !!!!

// TODO :: 3. RESIZING WINDOWS AND COORDINATE BUG FIXING
// TODO :: 4. DASH BOARD UI
// TODO :: 5. EXPORTING TO 'SVG' !
// TODO :: 6. HYPERLINK !                         **** SERVER UPLOADING REQUIRED
// TODO :: 7. VIRTUAL CONSOLE



class StateEditting extends State {

  constructor(name) {
    //-// console.log('%% StateEditting.mjs :: StateEditting CONSTRUCTOR EXECUTED')
    super(name)

    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }

    this.constructor.instance = this
  }


  initialize() {
    // -------------------------------------------
    // INITIALIZING CANVAS
    this.canvasSettings = {
      state: this.name,
      WIDTH: 800,
      HEIGHT: 500,
      stylesheets: ['bl_workarea', 'ly_workarea'],
      canDrag: true,
    }

    this.renderListAll = {}

    this.playSetIntervalId
    this.playSetIntervalIdList = []
    
    // CREATE NEW CANVAS
    this.svgCanvas = new Canvas(this.canvasSettings);

    // FACTORY FOR DRAWING
    this.drawFactory = new DrawFactory().initialize()

    // CREATING AttribManager OBJECT
    this.attribManager = new AttribManager()

    // CREATING ModalManager OBJECT
    this.modalManager = new ModalManager()

    // CREATING LocalStorage OBJECT
    this.localStorageManager = new LocalStorageManager()

    // CREATING SourceManager OBJECT
    this.sourceManager = new SourceManager()


    // -------------------------------------------------------------
    // CREATING Timeline SLIDER  OBJECT FOR THIS STATE
    let timelineTarget = document.getElementById('timeline_wrapper')

    this.timelineObj = new SliderDraggable({
      id: 'Timeline_main',
      target: timelineTarget,
      width: '80%',
      height: 56,
      posX: 0,
      posY: 0,
      pointerWid: 32,
      pointerHgt: 24,
      lineWidth: 5,
      canDrag: true,
      pointerOn: true
    })


    // -------------------------------------------------------------
    // CREATING TIMELINE
    this.stateDuration = 10000.0            // 10 secs SETTED HERE
    // WE WILL USE THIS IN THIS APP USING DOM
    this.timelineObj.svgDom.dataset.timeDuration = this.stateDuration


    this.stateTimelineSetting = {
      attrName: "x",
      time: 0,
      duration: this.stateDuration,
      keyframes: [
        {
          when: "0%",
          value: 0
        },
        {
          when: "100%",
          value: this.timelineObj.getSliderLength()
        },
      ]
    }

    this.stateTimeline = new Timeline(this.stateTimelineSetting)


    // -------------------------------------------------------------
    // MAIN TIMELINE PERCENT
    this.timelinePercent = 0


    // -------------------------------------------------------------
    // MAIN TIMELINE PERCENT
    let pointerDom = document.getElementById('Timeline_main_pointer')
    pointerDom.classList.add("svg", "tspans")




    // -------------------------------------------------------------
    // CREATING OBSERVER TO DISPATCH EVENT
    const monitorTimeline = (mutationsList, observer) => {

      for(const mutation of mutationsList) {


        if( mutation.type === 'attributes' && mutation) {
          //-// console.log(`${mutation.attributeName}   WAS MODIFIED`)
          //-// console.log(`${mutation.target.id}   WAS MODIFIED`)
          //-// console.log(`${mutation.target.getAttribute(mutation.attributeName)}   WAS MODIFIED`)

          // DISPATCH EVENT WHICH CONTAINS VALUE OF MAIN TIMELINE
          let timelineX = mutation.target.getAttribute(mutation.attributeName)
          let maximumVal = this.timelineObj.getSliderLength()
          let timeVal = timelineX / maximumVal * this.stateTimeline.duration
          this.timelinePercent = timelineX / maximumVal * 100.0

          const event = new CustomEvent("TIMELINE_MAIN", {
            bubbles: true,
            detail: {
              time: timeVal,
              timePercent: this.timelinePercent
            },
          })

          // FIRING CUSTOM EVENT FROM EVERY SVG-Group ELEMENTS
          const renderListGrpIds = Object.keys(this.renderListAll)
          for(let groupId of renderListGrpIds) {
            document.getElementById(groupId).dispatchEvent(event)
          }
        }
      }
    }

    const tl_observeConfig = {
      attributes: true,
      subtree: false
    }
    this.tl_observer = new MutationObserver(monitorTimeline)
    this.tl_observer.observe(this.timelineObj.slider.pointer.svgDom, tl_observeConfig)


    // --------------------------------------------------------------
    //
    this.localStorageManager.restoreShape(this)


    // --------------------------------------------------------------
    // PLAYBACK BUTTONS
    const playBtnSettings = {
      target: document.getElementById('plaback_wrapper'),
      id: 'playback_button',
      xPos: 0,
      yPos: 0,
      width: 40,
      height: 40,
      fill: "#AA7777",
      opacity: 1.0
    }
    this.playbutton = new ButtonToggle(playBtnSettings)



    // EVENT FROM BUTTON HANDLING
    this.playBtSvg = this.playbutton.svgDomPlay
    this.stopBtSvg = this.playbutton.svgDomStop


    // TODO :: TAKE NOTE BELOW
    // FIRST WE MOVE document.getElementById('Timeline_main_pointer') OBJECT,
    // THEN, RUN THE HANDLER FUNCTION OF MUTATION OBSERVER ABOVE
    // FOR THAT WE BUILT 'FAKED mutationList OBJECT'
    //                    ~~~~~~~~~~~~~~~~~~~~~~~~~

    const animationSpeed = 30
    this.playSetIntervalId

    this.calcNextPos = () => {

      let pointerDom = document.getElementById('Timeline_main_pointer')

      // ------------------------------
      // < CALCULATING LOOP POSITION OF POINTER >
      // BASIC PREPARATION
      let currentPointerPosX = parseInt(pointerDom.getAttribute('x'))
      const maximumVal = this.timelineObj.getSliderLength()
      const oneFrameLength = maximumVal / 10000 * animationSpeed

      // LOOPING CHECK
      let nextFramePosX = currentPointerPosX + oneFrameLength
      if( nextFramePosX > maximumVal ) {
        nextFramePosX = nextFramePosX - maximumVal                        // RETURN
      }
      // SETTING THE NEW POSITION TO POITNER DOM OBJECT
      pointerDom.setAttribute('x', nextFramePosX)

      //-// console.log(`nextFramePosX   -->     ${nextFramePosX}`)

      // ------------------------------
      // 'FAKED mutationList OBJECT'
      const mutationSettings = {
        mutationList: [{
          type: 'attributes',
          target: pointerDom,
          attributeName: 'x',
        }]
      }

      monitorTimeline(mutationSettings.mutationList, undefined)
    }

    this.playMainTimeline = (ev) => {
      //-// console.log('MAIN TIMELINE -> PLAY !')
      // USING setInterval ANIMATE TIMELINE
      // https://developer.mozilla.org/en-US/docs/Web/API/setInterval

      this.playSetIntervalId = setInterval(this.calcNextPos, animationSpeed)
      // STORING NEW SET INTERVAL ID
      this.playSetIntervalIdList.push(this.playSetIntervalId)

      //-// console.log(`PLAYING WITH SETINTERVAL ID --->   ${this.playSetIntervalId}`)
    }
    this.playBtSvg.addEventListener('mainTimeline_play', this.playMainTimeline)


    this.clearAllSetIntervals = () => {

      // FOR EVERY SET INTERVAL IDS
      for(let i=0; i < this.playSetIntervalIdList.length; i++) {
        if(this.playSetIntervalIdList[i]) {
          clearInterval(this.playSetIntervalIdList[i])

          // DELETE AFTER CLEAR SET INTERVAL ID LIST
          // https://www.codegrepper.com/code-examples/javascript/remove+element+from+array+javascript+slice
          this.playSetIntervalIdList.splice(i, 1)
        }
      }
    }

    this.stopMainTimeline = (ev) => {
      //-// console.log('MAIN TIMELINE -> STOP !')
      //-// console.log(`STOP SETINTERVAL ID --->   ${this.playSetIntervalId}`)

      this.clearAllSetIntervals()
    }
    this.stopBtSvg.addEventListener('mainTimeline_stop', this.stopMainTimeline)

    


    // =======================================================
    // HANDLER FOR CREATING DRAWING OBJECT
    let workarea = document.getElementById('workarea')
    this.createNewBitmapPad = (ev) => {

      //console.log('CREATE NEW BITMAP PAD EVENT ARRIVED !!!')

      // **** IF THIS FUNCTION IS CALLED FOR 'EDTTING' (ACTUALLY RE-NEW) BITMAP PAD,
      // USE 'storedXPos' AND 'storedYPos'
      let xPos = 0
      let yPos = 0
      let editFlag = undefined
      let storedZIndex = undefined
      if(ev.detail.storedXPos) {
        xPos = ev.detail.storedXPos
        editFlag = true
        storedZIndex = ev.detail.storedZIndex
      }

      if(ev.detail.storedYPos) {
        yPos = ev.detail.storedYPos
        editFlag = true
        storedZIndex = ev.detail.storedZIndex
      }
      

      let bitmapAreaSetting = {
        isEditting: editFlag,
        isStored: false,                  // true  -->  ALREADY EXISTS IN LOCAL STORAGE
        stateObj: this,
        type: 'BITMAP',
        width: ev.detail.width,
        height: ev.detail.height,
        x: xPos,
        y: yPos,
        opacity: 1.0,
        storedZIndex: storedZIndex,
        canvasContext: ev.detail.canvasContext,
        bitmapObj: ev.detail.obj

      }

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        stateNow.addRenderObject(bitmapAreaSetting, this)
      }

    }
    workarea.addEventListener('createNewBitmapPad', this.createNewBitmapPad)





    // =======================================================================
    // SCENE CHANGING BUTTONS


    this.scenefileList = ["RAMAA/SCENE_1.json", 
                          "RAMAA/SCENE_2.json", 
                          "RAMAA/SCENE_3.json" ]



    // --------------------------------------------------------------
    // INITIALIZE CURRENT SCENEFILE
    //
    this.currentSceneIndex = gl_SCENEINDEX
    this.currentSceneFile = this.scenefileList[this.currentSceneIndex]


    this.sceneFileSwitcher = (direction, currentIndex, list, loopFlag) => {
      let resultIndex
      let resultName

      switch(direction) {

        case 'NEXT':
          
          if(!loopFlag) {
            currentIndex++
            if(currentIndex === list.length) currentIndex = list.length - 1
            resultName = list[currentIndex]
          } else {
            currentIndex++
            currentIndex = currentIndex % list.length                    // 3
            resultName = list[currentIndex]
          }
        break

        case 'PREVIOUS':

          if(!loopFlag) {
            currentIndex--
            if(currentIndex === -1)  currentIndex = 0
            resultName = list[currentIndex]
          } else {
            currentIndex--
            if(currentIndex === -1) currentIndex = list.length - 1  
            currentIndex = currentIndex % list.length
            resultName = list[currentIndex]
          }
        break
      }

      return {
        index: currentIndex,
        filename: resultName
      }
    }


    // ----------------------------------------------
    this.loadPrevScene = (ev) => {
      //-// console.log('PREV FILE BUTTON CLICKED')
      ev.stopImmediatePropagation()
      ev.preventDefault()

      //-// console.log(`CURRENT FILE WAS --> ${this.currentSceneFile}`)

      let prevFile = this.sceneFileSwitcher('PREVIOUS', this.currentSceneIndex, this.scenefileList, false)
      this.currentSceneIndex = prevFile.index
      gl_SCENEINDEX = prevFile.index
      this.currentSceneFile = prevFile.filename
      //-// console.log(`PREVIOUS FILE IS --> ${prevFile.filename}`)


      // ----------------------------------
      // LOADING PREVIOUS FILE

      // < LOADING JSON FILE FROM CLIENT SIDE>
      // https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");

      xobj.open('GET', this.currentSceneFile, true);             // Replace 'my_data' with the path to your file

      xobj.onreadystatechange = () => {

        if (xobj.readyState == 4 && xobj.status == "200") {

          // Required use of an anonymous callback as .open will NOT return a value 
          // but simply returns undefined in asynchronous mode
          //callback(xobj.responseText);
          //-// console.log(xobj.responseText)
          this.sourceManager.loadFromJson(xobj.responseText, this)
        }
      }

      xobj.send(null);
    }

    const scnPrevBtnSettings = {
      target: document.getElementById('scene_change_wrapper'),
      id: 'scnPrev_button',
      stylesheets: ['bl_scenechange_prev', 'ly_scenechange_prev'],
      pathShape: `0,${40/2} 40,${40/4}  40,${40*3/4}`,
      width: 40,
      height: 40,
      fill: "#225555",
      fillHover: "#558866",
      opacity: 1.0,
      clickHnd: this.loadPrevScene
    }

    // IF THIS BUTTON IS ALREADY EXISTED, (WHEN SCENE CHANGED)
    // DELETE FIRST
    if(this.scnPrevButton) this.scnPrevButton.remove()
    this.scnPrevButton = new ButtonSimple(scnPrevBtnSettings)



    // ----------------------------------------------
    this.loadNextScene = (ev) => {
      //-// console.log('NEXT FILE BUTTON CLICKED')
      ev.stopImmediatePropagation()
      ev.preventDefault()

      //-// console.log(`CURRENT FILE WAS --> ${this.currentSceneFile}`)

      let nextFile = this.sceneFileSwitcher('NEXT', this.currentSceneIndex, this.scenefileList, false)
      this.currentSceneIndex = nextFile.index
      gl_SCENEINDEX = nextFile.index
      this.currentSceneFile = nextFile.filename

      //-// console.log(`NEXT FILE IS --> ${nextFile.filename}`)


      // ----------------------------------
      // LOADING NEXT FILE

      // < LOADING JSON FILE FROM CLIENT SIDE>
      // https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");

      xobj.open('GET', this.currentSceneFile, true);             // Replace 'my_data' with the path to your file

      xobj.onreadystatechange = () => {

        if (xobj.readyState == 4 && xobj.status == "200") {

          // Required use of an anonymous callback as .open will NOT return a value 
          // but simply returns undefined in asynchronous mode
          //callback(xobj.responseText);
          //-// console.log(xobj.responseText)
          this.sourceManager.loadFromJson(xobj.responseText, this)
        }
      }

      xobj.send(null);
    }

    const scnNextBtnSettings = {
      target: document.getElementById('scene_change_wrapper'),
      id: 'scnNext_button',
      stylesheets: ['bl_scenechange_next', 'ly_scenechange_next'],
      pathShape: `0,${40/4} ${40},${40/2} 0,${40*3/4}`,
      width: 40,
      height: 40,
      fill: "#225555",
      fillHover: "#558866",
      opacity: 1.0,
      clickHnd: this.loadNextScene
    }

    // IF THIS BUTTON IS ALREADY EXISTED, (WHEN SCENE CHANGED)
    // DELETE FIRST
    if(this.scnNextButton) this.scnNextButton.remove()
    this.scnNextButton = new ButtonSimple(scnNextBtnSettings)


    // INITIAL SETTING OF PLAYBACK BUTTONS IS 'HIDING'
    //this.playbackButtonsHide()




    // =============================================================
    // =============================================================
    // EVENT HANDLERS



    this.sourceBtnQuickSaveClick = ( event ) => {
      //-// console.log("%% StateEditting.mjs :: MENU - sourceBtnQuickSaveClick BUTTON CLICKED")
    }


    // < EXPORT TO JSON FILE >
    // HERE WE UPLOAD TO SERVER THEN 
    // RECEIVE FROM SERVER -> DOWNLOAD WILL OCCUR
    this.sourceBtnExportJsonClick = ( event ) => {
      //-// console.log("%% StateEditting.mjs :: MENU - sourceBtnExportJsonClick BUTTON CLICKED")

      const fileNm = this.svgId = new Security().getUUIDv4() + ".json"
      const newFileName = 'GiveNameForThis_' + fileNm
      //console.log(fileNm)

      // THIS WILL BE THE FILENAME OF EXPORTED JSON FILE
      let settings = {
        fileName: newFileName,
      }

      // GETTING OBJECT FROM LOCAL STORAGE
      const localData = this.localStorageManager.loadFromStorage()
      this.sourceManager.saveToJson(settings, localData)
    }


    this.sourceBtnExportSvgClick = ( event ) => {
      //-// console.log("%% StateEditting.mjs :: MENU - sourceBtnExportSvgClick BUTTON CLICKED")
    }


    this.textareaInitSet = {
      isStored: false,
      stateObj: this,
      type: 'TEXTAREA',
      width: 250,
      height: 150,
      x: 0,
      y: 0,
      lineMargin: 8,
      fill: "#333333",
      opacity: 1.0,
      fontName: 'nsjp'
    }
    this.createBtnTextAreaClick = (event) => {
      //-// console.log("%% StateEditting.mjs :: MENU - createBtnTextAreaClick BUTTON CLICKED")
      //event.stopPropagation()

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        stateNow.addRenderObject(this.textareaInitSet, this)
      }
    }
    this.createTextArea = (settings) => {
      //-// console.log("%% StateEditting.mjs :: MENU - createBtnTextAreaClick BUTTON CLICKED")
      //event.stopPropagation()

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        return stateNow.addRenderObject(settings, this)
      }
    }

    this.arrowShapeInitSet = {
      isStored: false,
      stateObj: this,
      type: 'ARROW',
      thickness: 50,
      x: 0,
      y: 0,
      fill: "#ff9999",
      opacity: 1.0
    }
    this.createBtnArrowClick = (event) => {
      //-// console.log("%% StateEditting.mjs :: MENU - createBtnArrowClick BUTTON CLICKED")

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        stateNow.addRenderObject(this.arrowShapeInitSet, this)
      }
    }
    this.createArrow = (settings) => {
      //-// console.log("%% StateEditting.mjs :: MENU - createBtnArrowClick BUTTON CLICKED")

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        return stateNow.addRenderObject(settings, this)
      }
    }

    this.rectShapeInitSet = {
      isStored: false,                  // true  -->  ALREADY EXISTS IN LOCAL STORAGE
      stateObj: this,
      type: 'RECTANGLE',
      width: 250,
      height: 150,
      x: 0,
      y: 0,
      fill: "#ff9999",
      opacity: 1.0
    }
    this.createBtnRectClick = (event) => {
      //-// console.log("%% StateEditting.mjs :: MENU - createBtnRectClick BUTTON CLICKED")
      //event.stopPropagation()

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        stateNow.addRenderObject(this.rectShapeInitSet, this)
      }
    }
    this.createRect = (settings) => {
      //-// console.log("%% StateEditting.mjs :: MENU - createBtnRectClick BUTTON CLICKED")
      //event.stopPropagation()

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        return stateNow.addRenderObject(settings, this)
      }
    }


    this.drawingInitSet = {
      width: 300,
      height: 300,
      predefinedCanvas: undefined                 // IF 'DUPLICATION' IS THE CASE, WE WILL USE THIS
    }
    this.createBtnBitmapClick = (event) => {
      //-// console.log("%% StateEditting.mjs :: MENU - createBtnRectClick BUTTON CLICKED")
      //event.stopPropagation()

      // CREATING CANVAS
      let canvas = new BitmapPad(this.drawingInitSet)

    }
    this.createBitmap = (settings) => {

      let bitmapAreaSetting = {
        isEditting: false,
        isStored: false,                  // true  -->  ALREADY EXISTS IN LOCAL STORAGE
        isDuplicating: true,
        stateObj: this,
        type: 'BITMAP',
        width: settings.width,
        height: settings.height,
        x: settings.posX,
        y: settings.posY,
        opacity: 1.0,
        canvasContext: settings.canvasContext,

      }

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        return stateNow.addRenderObject(bitmapAreaSetting, this)
      }
  
    }

    this.ballShapeInitSet = {
      isStored: false,                  // true  -->  ALREADY EXISTS IN LOCAL STORAGE
      stateObj: this,
      type: 'BALL',
      width: 50,
      height: 50,
      x: 0,
      y: 0,
      fill: "#ff9999",
      opacity: 1.0
    }
    this.createBtnBallClick = (event) => {
      //-// console.log("%% StateEditting.mjs :: MENU - createBtnBallClick BUTTON CLICKED")
      //event.stopPropagation()

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        stateNow.addRenderObject(this.ballShapeInitSet, this)
      }
    }
    this.createBall = (settings) => {
      //-// console.log("%% StateEditting.mjs :: MENU - createBtnBallClick BUTTON CLICKED")
      //event.stopPropagation()

      // GETTING STATEMACHINE WHICH IS SINGLETON OBJECT
      let singletonSM = new StateMachine()
      let stateNow = singletonSM.getCurrentState()

      if( stateNow.name === 'editting' ) {
        return stateNow.addRenderObject(settings, this)
      }
    }

    // TODO :: SKIN CHANGING?
    this.aboutBtnConfigClick = ( event ) => {
      //-// console.log("%% StateEditting.mjs :: MENU - aboutBtnConfigClick BUTTON CLICKED")
    }


    this.aboutBtnCollabClick = (event) => {
      //-// console.log("%% StateEditting.mjs :: MENU - aboutBtnCollabClick BUTTON CLICKED")

      // SEND REQUEST TO NEW PAGE !
    }



    this.aboutBtnClick = (event) => {
      event.stopPropagation()

      //-// console.log("%% StateEditting.mjs :: MENU - ABOUT BUTTON CLICKED")
      let aboutDialog = document.getElementById("menu_about_dialog")
      if(aboutDialog.style.display === "none") {
        aboutDialog.style.display = 'block'
      } else {
        aboutDialog.style.display = 'none'
      }

      //TURNING OFF OTHER DIALOGS
      let createDialog = document.getElementById("menu_create_dialog")
      if(createDialog.style.display !== 'none') createDialog.style.display = 'none'
      let sourceDialog = document.getElementById("menu_source_dialog")
      if(sourceDialog.style.display !== 'none') sourceDialog.style.display = 'none'
    }



    this.createBtnClick = (event) => {
      //-// console.log("%% StateEditting.js :: MENU - CREATE BUTTON CLICKED")

      event.stopPropagation()

      // CALLING SINGLETON OBJECT
      //let statemachine = new StateMachine()
      //statemachine.changeState('LOADDATABASE')


      let createDialog = document.getElementById("menu_create_dialog")
      // https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
      if(createDialog.style.display === "none") {
        createDialog.style.display = 'block'
      } else {
        createDialog.style.display = 'none'
      }


      //TURNING OFF OTHER DIALOGS
      let aboutDialog = document.getElementById("menu_about_dialog")
      if(aboutDialog.style.display !== 'none') aboutDialog.style.display = 'none'
      let sourceDialog = document.getElementById("menu_source_dialog")
      if(sourceDialog.style.display !== 'none') sourceDialog.style.display = 'none'
    }


    this.sourceBtnClick = (event) => {
      //-// console.log("%% StateEditting.mjs :: MENU - sourceBtnClick BUTTON CLICKED")
    }


    this.sourceBtnClick = (event) => {
      //-// console.log("%% StateEditting.js :: MENU - SOURCE BUTTON CLICKED")

      event.stopPropagation()

      // CALLING SINGLETON OBJECT
      //let statemachine = new StateMachine()
      //statemachine.changeState('LOADDATABASE')


      let sourceDialog = document.getElementById("menu_source_dialog")
      // https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
      if(sourceDialog.style.display === "none") {
        sourceDialog.style.display = 'block'
      } else {
        sourceDialog.style.display = 'none'
      }


      //TURNING OFF OTHER DIALOGS
      let aboutDialog = document.getElementById("menu_about_dialog")
      if(aboutDialog.style.display !== 'none') aboutDialog.style.display = 'none'
      let createDialog = document.getElementById("menu_create_dialog")
      if(createDialog.style.display !== 'none') createDialog.style.display = 'none'
    }


    this.aboutBtnAboutClick = (ev) => {
      this.modalManager.modalList.about.open()
    }


    this.sourceSendJsonClick = () => {

      // loadJsonFile IS THe 'INPUT' ELEMENT
      // WE SETTED IT UP AS file
      var file = document.getElementById('loadJsonFile').files[0];
      var reader = new FileReader()

      if(file) {
        reader.readAsText(file, 'UTF-8')

        reader.onload = (evt) => {

          this.sourceManager.loadFromJson(evt.target.result, this)

        }
      } 
    }



    this.articlesBtnClick = (ev) => {
      this.modalManager.modalList.articleList.open()
    }





    // ------------------------------------------------
    // SETTING UP INITIAL VISIBILITIES (MENU LISTBOX)
    let aboutDialog = document.getElementById("menu_about_dialog")
    aboutDialog.style.display = 'none'

    let createDialog = document.getElementById("menu_create_dialog")
    createDialog.style.display = 'none'

    let sourceDialog = document.getElementById("menu_source_dialog")
    sourceDialog.style.display = 'none'


    // SETTING UP MENU BUTTONS (ITEMS)

    this.createBtn = document.getElementById("menu_create_btn")
    this.createBtn.addEventListener("click", this.createBtnClick )

    this.createBtnRect = document.getElementById("menu_create_rect")
    this.createBtnRect.addEventListener("click", this.createBtnRectClick )

    this.createBtnBitmap = document.getElementById("menu_create_bitmap")
    this.createBtnBitmap.addEventListener("click", this.createBtnBitmapClick )

    this.createBtnBall = document.getElementById("menu_create_ball")
    this.createBtnBall.addEventListener("click", this.createBtnBallClick )

    this.createBtnArrow = document.getElementById("menu_create_arrow")
    this.createBtnArrow.addEventListener("click", this.createBtnArrowClick )

    this.createBtnTextArea = document.getElementById("menu_create_textarea")
    this.createBtnTextArea.addEventListener("click", this.createBtnTextAreaClick )

    this.sourceBtn = document.getElementById("menu_source_btn")
    this.sourceBtn.addEventListener("click", this.sourceBtnClick )

    this.sourceBtnQuickSave = document.getElementById("menu_source_qsave")
    this.sourceBtnQuickSave.addEventListener("click", this.sourceBtnQuickSaveClick )

    this.sourceBtnExportJson = document.getElementById("menu_source_json")
    this.sourceBtnExportJson.addEventListener("click", this.sourceBtnExportJsonClick )

    this.sourceBtnExportSvg = document.getElementById("menu_source_svg")
    this.sourceBtnExportSvg.addEventListener("click", this.sourceBtnExportSvgClick )

    // < LOADING FILE FROM CLIENT >
    // https://stackoverflow.com/questions/44438560/read-json-file-data-on-client-side-with-pure-javascript
    this.sourceSendJson = document.getElementById('sendJsonFile')
    this.sourceSendJson.addEventListener('click', this.sourceSendJsonClick)


    // LISTENING EVENT WHEN THE OBJECT WAS DELETED
    // EVERY ELEMENTS MIGHT BE DELETED BY THE OBJECT ITSELF,
    // SO HERE WE DO CARE ABOUT this.renderListAll LIST

    this.updateRenderList = (ev) => {

      //-// console.log(`UPDATE RENDER LIST EVENT OCCURED   --->   ${ev.detail.id}`)

      // SEARCH THE ITEM IN THE LIST AND DELETE
      delete this.renderListAll[ev.detail.id]

      //-// console.log(this.renderListAll)

    }
    document.getElementById('workarea').addEventListener('updateRenderList', this.updateRenderList, false)



    // ==============================================================
    // DELETE ALL BUTTON SETTING
    this.deleteAllBtnHandler = (ev) => {
      //console.log('deleteAllBtnHandler CLICKED')
      event.stopPropagation()
      this.modalManager.modalList.deleteAll.open()
    }
    document.getElementById('btn_delete_all').addEventListener('click', this.deleteAllBtnHandler, false)


    this.deleteAllObjects = (ev) => {
      //console.log('DELETE ALL OBJECT')
      //console.log(this.renderListAll)

      if(this.renderListAll !== undefined) {

        if(Object.keys(this.renderListAll).length > 0) {
          for(let objName in this.renderListAll) {
            this.renderListAll[objName].deleteObjectHandler({
              detail: {
                id: objName
              }
            })
          }

          this.modalManager.modalList.deleteAll.close()

        }
      }

    }

    document.getElementById('workarea').addEventListener('deleteAllObjs', this.deleteAllObjects, false)


    // ---------------------------------------------------------------------------
    // ATTRIBUTE EDITOR DIALOG 
    let attrDialog = document.getElementById("attribManager_wrapper")
    attrDialog.style.display = 'none'


    this.attrDispBtnClick = (event) => {
      event.stopPropagation()

      // console.log("dispAttrBtn")

      //-// console.log("%% StateEditting.mjs :: MENU - ABOUT BUTTON CLICKED")
      let attrDialog = document.getElementById("attribManager_wrapper")
      if(attrDialog.style.display === "none") {
        attrDialog.style.display = 'block'
      } else {
        attrDialog.style.display = 'none'
      }

    }
    this.attrDispBtn = document.getElementById("menu_r_btn_attr")
    this.attrDispBtn.addEventListener("click", this.attrDispBtnClick )











  }


  // ============================================================
  // MENU BUTTON
  // ============================================================



  addRenderObject(settings, stateObj) {
    //-// console.log('%%  StateEditting.js : addRenderObject FUNCTION EXECUTED')
    let objCreated = this.drawFactory.draw(settings, stateObj)

    this.renderListAll[objCreated.groupId] = objCreated

    return objCreated
  }




  remove() {

    for(let renderobjName in this.renderListAll) {
      this.renderListAll[renderobjName].remove()
    }


    if(this.aboutBtn) this.aboutBtn.removeEventListener("click", this.aboutBtnClick )
    if(this.aboutBtnAbout) this.aboutBtnAbout.removeEventListener("click", this.aboutBtnAboutClick )

    if(this.aboutBtnConfig) this.aboutBtnConfig.removeEventListener("click", this.aboutBtnConfigClick )
    if(this.aboutBtnCollab) this.aboutBtnCollab.removeEventListener("click", this.aboutBtnCollabClick )

    this.createBtn.removeEventListener("click", this.createBtnClick )
    this.createBtnRect.removeEventListener("click", this.createBtnRectClick )
    this.createBtnBitmap.removeEventListener("click", this.createBtnBitmapClick )
    this.createBtnArrow.removeEventListener("click", this.createBtnArrowClick )
    this.createBtnTextArea.removeEventListener("click", this.createBtnTextAreaClick )
    this.createBtnBall.removeEventListener("click", this.createBtnBallClick )
    this.sourceBtn.removeEventListener("click", this.sourceBtnClick )
    this.sourceBtnQuickSave.removeEventListener("click", this.sourceBtnQuickSaveClick )
    this.sourceBtnExportJson.removeEventListener("click", this.sourceBtnExportJsonClick )
    this.sourceBtnExportSvg.removeEventListener("click", this.sourceBtnExportSvgClick )
    this.sourceSendJson.removeEventListener('click', this.sourceSendJsonClick)
    this.playBtSvg.removeEventListener('mainTimeline_play', this.playMainTimeline)
    this.stopBtSvg.removeEventListener('mainTimeline_stop', this.stopMainTimeline)
    document.getElementById('workarea').removeEventListener('updateRenderList', this.updateRenderList, false)


    this.tl_observer = undefined

    this.svgCanvas.remove()
    this.drawFactory = undefined

    this.attribManager.remove()
    this.attribManager = undefined

    this.localStorageManager.remove()
    this.localStorageManager = undefined

    this.sourceManager = undefined

    this.modalManager.remove()
    this.modalManager = undefined

    this.timelineObj.remove()
    this.timelineObj = undefined

    this.stateTimeline = undefined

    this.playbutton.remove()
    //this.scnNextButton.remove()

    this.renderListAll = {}

    this.clearAllSetIntervals()

  }




  playbackButtonsHide() {
    this.scnPrevButton.group.style.display = 'none'
    this.scnNextButton.group.style.display = 'none'


    this.scnPrevButton.group.style.display = 'none'
    this.scnNextButton.group.style.display = 'none'

  }


  playbackButtonsDisplay() {
    this.scnPrevButton.group.style.display = ''
    this.scnNextButton.group.style.display = ''


    this.scnPrevButton.group.style.display = ''
    this.scnNextButton.group.style.display = ''

  }





  update() {
    //-// console.log('%%  StateEditting.js : update FUNCTION EXECUTED')


  }


  // RENDER ELEMENT 'IF IT IS UPDATED'
  render() {
    //-// console.log('%%  StateEditting.js : render FUNCTION EXECUTED')


  }



  onEnter() {
    //-// console.log(`%%  StateEditting.js : onEnter FUNCTION OF ==  ${this.name}  ==  EXECUTED`)
    this.initialize()
  }


  onExit() {
    //-// console.log(`%%  StateEditting.js : onExit FUNCTION OF ==  ${this.name}  == EXECUTED`)


  }




}



export {StateEditting}
