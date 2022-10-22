'use strict'

import { Draw }             from "./Draw.mjs"
import { Security }         from "./Security.mjs"
import { ZIndexManager }    from "./ZIndexManager.mjs"
import { DraggableScreen }  from "./DraggableScreen.mjs"
import { LocalStorage }     from "./LocalStorage.mjs"


// DRAW SVG OBJECT : RECTANGLE SHAPE

class DrawBall extends Draw {

  constructor(settings, stateObj) {
    //-// console.log('%% DrawBall.mjs :: DrawBall CONSTRUCTOR EXECUTED')
    
    const superClass = super()

    const settingsToSuper = {
      stateObj: stateObj,
      currentObj: this
    }
    superClass.initialize(settingsToSuper)



    // ----------------------------------------------------------------------
    // GETTING ZOOM SCALER 
    this.panscaler = parseFloat(document.getElementById('zoom_select').dataset.panScaler)



    // ------------------------------------
    // CREATE SVG ELEMENT
    this.domRoot = document.getElementById('svgcanvas')

    // CREATE ADDITIONAL SVG ELEMEMENT FOR 'DEFS'
    if(!document.getElementById('canvas_dom_defs')) {
      this.svgDefs = document.createElementNS(this.nsSvg, 'svg')
      this.svgDefs.id = 'canvas_dom_defs'
      this.domRoot.appendChild(this.svgDefs)
    } else {
      this.svgDefs = document.getElementById('canvas_dom_defs')
    }

    this.svgRoot = document.getElementById('canvas_dom')
    this.group = document.createElementNS(this.nsSvg, 'g')
    this.svgDom = document.createElementNS(this.nsSvg, 'ellipse')


    // ------------------------------------
    // CREATING LocalStorage OBJECT
    const localStrSettings = {
      evDispatcher: this.group
    }
    this.localStorage = new LocalStorage(localStrSettings)

    this.animStore = {}


    // ======================================================================
    // PRELOADING (LOCAL STORAGE)
    // ======================================================================


    // ------------------------------------
    // PRELOADING (IF NECESSARY)
    if(settings.isStored) this.preload(settings)


    // ------------------------------------
    // SETTING NEW ID
    if(!this.groupId) {
      this.groupId = new Security().getUUIDv4()
    }

    // ------------------------------------
    this.group.setAttribute("id", this.groupId)

    // TODO :: CURRENTLY WE DO NOT NEED THIS FOR DRAGGING ELEMENTS
    // BELOW THIS GROUP !
    this.group.setAttribute("transform", `translate( 0, 0)`)

    this.svgRoot.appendChild(this.group)

    this.posX = 0
    this.posY = 0
    this.anchorPosX = 0
    this.anchorPosY = 0


    // ------------------------------------
    // STORING TIMELINES FOR ATTRIBUTES
    this.timelines = {}




    // CREATE SVG BALL GRADIENT
    this.ballGradDefs = document.createElementNS(this.nsSvg, 'defs')
    this.ballGradDefs.id = this.groupId + '_defs'
    this.ballGrad = document.createElementNS(this.nsSvg, 'radialGradient')
    this.ballGrad.id = 'gradient-ball'
    this.ballGrad.setAttribute('cx', '0.5')
    this.ballGrad.setAttribute('cy', '0.5')
    this.ballGrad.setAttribute('r', '0.65')
    this.ballGrad.setAttribute('fx', '0.25')
    this.ballGrad.setAttribute('fy', '0.25')
    this.ballGradDefs.appendChild(this.ballGrad)


    // Store an array of stop information for the <linearGradient>
    let stops = [
      {
        "color": "#FFFFFF",
        "offset": "0%"
      },
      {
        "color": "#FFFFFF",
        "offset": "3%"
      },
      {
        "color": "#FFd8db",
        "offset": "17%"
      },
      {
        "color": "#fb866c",
        "offset": "25%"
      },
      {
        "color": "#FF0000",
        "offset": "55%"
      },
      {
        "color": "#fb866c",
        "offset": "80%"
      },
      {
        "color": "#d6d8db",
        "offset": "100%"
      }
    ]

    // Parses an array of stop information and appends <stop> elements to the <linearGradient>
    for (let i = 0, length = stops.length; i < length; i++) {

      // Create a <stop> element and set its offset based on the position of the for loop.
      let stop = document.createElementNS(this.nsSvg, 'stop');
      stop.setAttribute('offset', stops[i].offset);
      stop.setAttribute('stop-color', stops[i].color);

      // Add the stop to the <lineargradient> element.
      this.ballGrad.appendChild(stop);

    }



    this.svgDefs.appendChild(this.ballGradDefs)




    // ------------------------------------
    // CREATE RECTANGLE SHAPE
    this.svgDom.setAttribute("cx", 0)
    this.svgDom.setAttribute("cy", 0)
    this.svgDom.setAttribute("rx", settings.width)
    this.svgDom.setAttribute("ry", settings.height)


    //this.svgDom.setAttribute("fill", settings.fill)

    
    this.svgDom.setAttribute("fill", 'url(#gradient-ball)')


    // this.svgDom.setAttribute("stroke", "grey")
    // this.svgDom.setAttribute("stroke-width", "3px")
    //this.svgDom.setAttribute("rx", "10px")
    this.svgDom.setAttribute("id", this.groupId + '_ball')
    this.svgDom.style.opacity = settings.opacity
    this.group.appendChild(this.svgDom)









    // ------------------------------------
    // ZIndexManager
    this.ZIndexManager = new ZIndexManager({
      groupId: this.group.id
    })
    this.group.dataset.zIndex = this.ZIndexManager.getIndex(this.group.id)
    //-// console.log(`this.group.id  ::  ${this.group.id}    -----    this.zIndex  ::    ${this.group.dataset.zIndex}`)




    // -----------------------------------------------------------
    // < DISPATCHING EVENT WITH DATA >
    // USING CustomEvent


    // -----------------------------------------------------------
    // WE ARE CREATING CustomEvent OBJECT WITH TextArea OBJECT !
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    let evAttrManOn = new CustomEvent('attrManagerOn', {
      bubbles: true,                                            // TODO :: DOCUMENT THIS!
                                                                //         THIS IS CIRITICAL TO BUBBLING UP !!
      detail: {
        type: 'BALL',
        //shapeDom: this.svgDom,
        ballObject: this
      }
    })

    // -----------------------------------------------------------
    // FOR SENDING INFORMATION TO DOM OF ATTRIBUTE BOX
    let eventToAttribBox = new CustomEvent('attrManagerUpdate', {
      bubles: true,
      detail:{
        type: 'BALL',
        ballObject: this
      }
    })

    // -------------------------------------------------------------
    // SETTING UP OBSERVER FOR ATTRIBUTE CHANGES !!!
    const observeConfig = {
      attributes: true,
      subtree: true
    }


    // ----------------------------------------------------------------------
    // SCREEN DRAGGING OBJECT
    // FOR DRAGGING POINTER
    this.screenDrag = new DraggableScreen()
    this.mutationHandler = (mutationList, observer) => {
      for(const mutation of mutationList) {
        if( mutation.type === 'attributes' ) {
          //-// console.log(`${mutation.target.id} :::   ${mutation.attributeName}   WAS MODIFIED`)
          //-// console.log(mutation.target.getAttribute(mutation.attributeName))

          let targetX
          let targetY

          if(mutation.attributeName === 'data-x-pos') {
            targetX = parseInt(mutation.target.getAttribute(mutation.attributeName))
            this.posX = targetX
          } else if(mutation.attributeName === 'data-y-pos') {
            targetY = parseInt(mutation.target.getAttribute(mutation.attributeName))
            this.posY = targetY
          }


          const mappedPosition = this.screenPointToSVGPoint( this.svgRoot, this.svgDom, this.posX, this.posY)
          //-// console.log(`MAPPED POSITION X :::  ${this.posX}  ----  Y :::  ${this.posY}`)

          if(mappedPosition.x) this.svgDom.setAttribute("cx", Math.floor(mappedPosition.x - this.anchorPosX))
          if(mappedPosition.y) this.svgDom.setAttribute("cy", Math.floor(mappedPosition.y - this.anchorPosY))

          //if(mappedPosition.x) this.svgDom.setAttribute("cx", Math.floor(mappedPosition.x))
          //if(mappedPosition.y) this.svgDom.setAttribute("cy", Math.floor(mappedPosition.y))

          this.svgDom.dispatchEvent(eventToAttribBox)

        }
      }
    }

    this.observer = new MutationObserver((mutationsList, observer) => {

      for(const mutation of mutationsList) {
        if( mutation.type === 'attributes' ) {
          //-// console.log(`---- CHANGED DOM ID::  ${mutation.target.id}`)
          // //-// console.log(`${mutation.attributeName}   WAS MODIFIED`)
          //-// console.log(`TO ${mutation.target.getAttribute(mutation.attributeName)}`)

          // ----------------------
          // UPDATING LOCAL STORAGE
          this.dataStore.x = parseInt(this.svgDom.getAttribute('cx'))
          this.dataStore.y = parseInt(this.svgDom.getAttribute('cy'))
          this.dataStore.width = parseInt(this.svgDom.getAttribute('rx'))
          this.dataStore.height = parseInt(this.svgDom.getAttribute('ry'))
          this.dataStore.fill = this.svgDom.getAttribute('fill')
          this.dataStore.zIndex = this.group.dataset.zIndex
          this.dataStore.opacity = this.svgDom.style.opacity

          this.localStorage.saveToLocalStr(this.dataStore)
          //-// console.log(this.dataStore)
        }
      }
    })
    this.observer.observe(this.group, observeConfig)


    this.mouseDownHnd = (ev) => {
      //-// console.log(`---- SVG-RECT CLICKED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      const mappedPosition = this.screenPointToDivPoint(this.svgRoot, this.svgDom, ev.clientX, ev.clientY)

      // STORING ANCHOR POSITION
      this.screenDrag.setScreen({
        dragObj: this.svgDom,
        mutationHandler: this.mutationHandler
      })

      // ****  PANSCALER IS NEEDED ! (ZOOMED POSITION !!)
      this.anchorPosX = Math.floor(mappedPosition.x) * parseFloat(document.getElementById('zoom_select').dataset.panScaler) - settings.width
      this.anchorPosY = Math.floor(mappedPosition.y) * parseFloat(document.getElementById('zoom_select').dataset.panScaler) - settings.height

      //-// console.log(`ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)

      ev.target.dispatchEvent(evAttrManOn)
    }
    this.svgDom.addEventListener("mousedown", this.mouseDownHnd, false)


    // =========================================
    // CREATING KEYFRAME
    // =========================================

    this.createKeyframe = (ev) => {
      //-// console.log(`CREATE KEYFRAME EVENT OCCURED   ::  ${ev.detail.id}`)

      if( this.groupId === ev.detail.id.split('_')[0]) {

        // RETRIEVING VALUES, TIME ETC.
        let id = ev.detail.id
        let time = ev.detail.time
        let type = ev.detail.type
        let values = ev.detail.value
        let keyObjs = {}

        // VALUE TYPE CHEKCING

        // TODO :: CREATE THE FUNCTION TO CONVERT THE NAME OF KEY VALUES
        switch (type) {
          case 'POSITION':
          values['cx'] = parseInt(values['cx'])
          values['cy'] = parseInt(values['cy'])
          break
          case 'SIZE':
            values['rx'] = parseInt(values['width'])
            values['ry'] = parseInt(values['height'])
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

            // ----------------------------------------
            // TODO :: COLLECT ALL EVENT HANDLERS
            // SET EVENT HANDLER
            this.keyframeManager.setEventHandler({
              targetId: timelineName,
              obj: this,
              objType: 'BALL'
            })

          }

        } else {


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
                objType: 'BALL'
              })


            } else {

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

    this.updateKeyframeTime = (ev) => {
      //-// console.log(`updateKeyframeTime ::  ${ev.detail.groupId}  ->  KEY INDEX  :: ${ev.detail.keyIndex}  ->  SHAPE :: ${ev.detail.shapeType}  ->  ATTR NAME :: ${ev.detail.attrName}  ->  NEW PERCENT :: ${ev.detail.percentage}`)

      //-// console.log(this.timelines)
      const incomingGrpId = ev.detail.groupId
      const incomingShape = ev.detail.shapeType
      let incomingAttrName = ev.detail.attrName
      const incomingKeyIndex = parseInt(ev.detail.keyIndex)
      const incomingPercentage = Math.floor(ev.detail.percentage)


      // CHECKING INCOMING ATTRIBUTE NAME IS CORRECT
      if(incomingAttrName === 'x' || incomingAttrName === 'y') {
        incomingAttrName = 'c' + incomingAttrName
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

          if(shapeType === incomingShape && attrName === incomingAttrName) {
            // UPDATE TIMELINE
            let keyArray_Timeline = this.timelines[timelnName].keyframes
            let keyArray_AnimStorage = animStorageObj[timelnName].keyframes

            // FIND UPDATED KEY FRAME USING KEYFRAME INDEX
            // 1. TIMELINES OBJECT UPDATE
            keyArray_Timeline[incomingKeyIndex].when = `${incomingPercentage}`
            // 2. LOCAL STORAGE (ANIM) UPDATE
            keyArray_AnimStorage[incomingKeyIndex].when = `${incomingPercentage}`
            str.setItem(animKeyName, JSON.stringify(animStorageObj))
            // 3. LOCAL STORAGE (ATTRIB BOX) UPDATE
            attrboxStorageObj[attrName][incomingKeyIndex].when = `${incomingPercentage}`
            str.setItem(attrboxKeyName, JSON.stringify(attrboxStorageObj))

            //-// console.log(localStorage)
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


    // ---------------------------------------------------------
    // SAVING TO LOCAL DATA
    // WHEN INITIALIZATION
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



      // ANIMATIONS
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
          let tlNm = keyframe.timelineName
          let attrNmArr = tlNm.split('_')
          let attrNm = attrNmArr[attrNmArr.length-1]

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
              objType: 'BALL'
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
              objType: 'BALL'
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




      // REQUIRED DATA FOR ATTRIBBOX STORAGE IS FOR DISPLAYING 'LOCAL TIMELINE'
      // SO THAT MEANS ONLY 'ANIMATABLE PARAMETERS'
      const dataForAttribBox = {
        groupId: this.groupId,
        timeline: this.timelines
      }
      this.setAttribBoxStore(dataForAttribBox, this.group)


    }



    // ------------------------------------
    // AFTERLOADING (IF NECESSARY)
    if(settings.isStored) this.afterload(settings)


    // ======================================================================
    // RE-ALIGN DOMs ACCORDING TO Z-INDEX
    // ======================================================================
    ZIndexManager.refreshAllSvg()

  }


  // -----------------------------------
  //

  setDataStore() {
    this.dataStore = {
      type: 'BALL',
      isStored: true,
      id: this.groupId,
      zIndex: this.group.dataset.zIndex,
      svg_id: this.svgDom.id,
      x: parseInt(this.svgDom.getAttribute('cx')),
      y: parseInt(this.svgDom.getAttribute('cy')),
      width: parseInt(this.svgDom.getAttribute('rx')),
      height: parseInt(this.svgDom.getAttribute('ry')),
      fill: this.svgDom.getAttribute('fill'),
      opacity: parseFloat(this.svgDom.style.opacity)
    }
  }

  preload(settings) {
    //-// console.log(` (LOCAL STORAGE) PRELOADING ->   ${settings.id}`)
    // OVERLOADING REQUIRED MEMBERS
    this.groupId = settings.id
  }

  afterload(settings) {
    //-// console.log(` (LOCAL STORAGE) AFTERLOADING ->   ${settings.id}`)
    // RE-SETTING REQUIRED OBJECTS
    this.group.dataset.zIndex = settings.zIndex
    this.svgDom.setAttribute("id", settings.id + '_ball')
    this.svgDom.setAttribute("cx", settings.x)
    this.svgDom.setAttribute("cy", settings.y)
    this.svgDom.setAttribute("rx", settings.width)
    this.svgDom.setAttribute("ry", settings.height)
    this.svgDom.setAttribute("fill", settings.fill)
    this.svgDom.style.opacity = parseFloat(settings.opacity)
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
    this.svgDom.removeEventListener("mousedown", this.mouseDownHnd, false)
    this.keyframeManager.remove()

    // DELETE DEFS
    this.ballGrad.remove()
    this.ballGradDefs.remove()

    // RESET TIMELINE
    this.timelines = {}
    this.animStore = {}
    this.dataStore = {}
    this.observer = undefined
    this.keyframeManager = undefined

    // DELETE DOM
    this.svgDom.remove()
    this.group.remove()

  }



  // -----------------------------------



  duplicateSetting(prevObj) {

    this.posX = prevObj.posX
    this.posY = prevObj.posY
    this.anchorPosX = prevObj.anchorPosX
    this.anchorPosY = prevObj.anchorPosY

    this.svgDom.setAttribute("cx", parseInt(prevObj.svgDom.getAttribute("cx")))
    this.svgDom.setAttribute("cy", parseInt(prevObj.svgDom.getAttribute("cy")))
    this.svgDom.setAttribute("rx", parseInt(prevObj.svgDom.getAttribute("rx")))
    this.svgDom.setAttribute("ry", parseInt(prevObj.svgDom.getAttribute("ry")))

    this.svgDom.style.opacity = prevObj.svgDom.style.opacity

  }




  getGroupId() {
    return this.group.id
  }

  // RETURN ALL HTML DOM TO OUTSIDE
  getDomList() {

    let domlist = []

    // GETTING DOMs FROM HANDLES
    //domlist = this.handles.A.getDomList().concat(this.handles.B.getDomList()).concat(this.handles.C.getDomList())

    domlist.push(this.svgDom)

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



}


export { DrawBall }
