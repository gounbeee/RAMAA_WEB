'use strict'

import { Draw }               from "./Draw.mjs"
import { Security }           from "./Security.mjs"
import { DraggableChildren }  from "./DraggableChildren.mjs"
import { Arrow }              from "./Arrow.mjs"
import { ZIndexManager }      from "./ZIndexManager.mjs"
import { LocalStorage }       from "./LocalStorage.mjs"


// DRAW SVG OBJECT : RECTANGLE SHAPE

class DrawArrow extends Draw {

  constructor(settings, stateObj) {
    //-// console.log('%% DrawArrow.mjs :: DrawArrow CONSTRUCTOR EXECUTED')
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


    // ----------------------------------------------------------------------
    // GETTING ZOOM SCALER 
    this.panscaler = parseFloat(document.getElementById('zoom_select').dataset.panScaler)



    // ----
    //
    this.mutationsList



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
    //this.group.setAttribute("transform", `translate( ${settings.x}, ${settings.y})`)
    this.svgRoot.appendChild(this.group)


    // ------------------------------------
    // STORING TIMELINES FOR ATTRIBUTES
    this.timelines = {}


    // -----------------------------------------------------------
    // SEND INFORMATION TO DOM OF ATTRIBUTE BOX

    let evAttrbox = {
      bubles: true,
      detail:{
        type: 'ARROW',
        arrowObject: this
      }
    }





    // -----------------------------------------------------------
    // < DISPATCHING EVENT WITH DATA >
    // USING CustomEvent

    // -----------------------------------------------------------
    // WE ARE CREATING CustomEvent OBJECT WITH DrawArrow OBJECT !
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    let eventToArribMan = new CustomEvent('attrManagerOn', {
      bubbles: true,                                            // TODO :: DOCUMENT THIS!
                                                                //         THIS IS CIRITICAL FOR BUBBLING UP !!
      detail: {
        type: 'ARROW',
        // arrow: this.arrow,
        arrowObject: this
      }
    })



    // ------------------------------------
    // DRAW ARROW
    // **** NEED TO BE ROUTE LOCAL STORAGE LOADING
    if(settings.isStored) {
      this.arrow = new Arrow({
        isStored: true,
        target: this.group,                                          // TARGET SVG-DOM OBJECT
        id: this.groupId + '_arrow',
        evAttrbox: evAttrbox,

        hndA_posRect_posX: settings.hndA_posRect_posX,
        hndA_posRect_posY: settings.hndA_posRect_posY,
        hndA_rotCirA_posX: settings.hndA_rotCirA_posX,
        hndA_rotCirA_posY: settings.hndA_rotCirA_posY,
        hndA_rotCirB_posX: settings.hndA_rotCirB_posX,
        hndA_rotCirB_posY: settings.hndA_rotCirB_posY,

        hndB_posRect_posX: settings.hndB_posRect_posX,
        hndB_posRect_posY: settings.hndB_posRect_posY,
        hndB_rotCirA_posX: settings.hndB_rotCirA_posX,
        hndB_rotCirA_posY: settings.hndB_rotCirA_posY,
        hndB_rotCirB_posX: settings.hndB_rotCirB_posX,
        hndB_rotCirB_posY: settings.hndB_rotCirB_posY,

        hndC_posRect_posX: settings.hndC_posRect_posX,
        hndC_posRect_posY: settings.hndC_posRect_posY,
        hndC_rotCirA_posX: settings.hndC_rotCirA_posX,
        hndC_rotCirA_posY: settings.hndC_rotCirA_posY,
        hndC_rotCirB_posX: settings.hndC_rotCirB_posX,
        hndC_rotCirB_posY: settings.hndC_rotCirB_posY,

        thickness: settings.thickness,
        fill: settings.fill,
        opacity: settings.opacity,
        dataStore: this.dataStore
      })
      // CREATING DOM ELEMENT
      this.arrow.create()

    } else {

      this.arrow = new Arrow({
        isStored: false,
        target: this.group,                                          // TARGET SVG-DOM OBJECT
        evAttrbox: evAttrbox,
        id: this.groupId + '_arrow',
        x: settings.x,
        y: settings.y,
        thickness: settings.thickness,
        fill: settings.fill,
        opacity: settings.opacity,
        dataStore: this.dataStore
      })
      // CREATING DOM ELEMENT
      this.arrow.create()
    }



    // ------------------------------------
    // ZIndexManager
    this.ZIndexManager = new ZIndexManager({
      groupId: this.group.id
    })
    this.group.dataset.zIndex = this.ZIndexManager.getIndex(this.group.id)
    //-// console.log(`this.group.id  ::  ${this.group.id}    -----    this.zIndex  ::    ${this.group.dataset.zIndex}`)






    // ======================================================================
    // EVENT LISTEN & HANDLERS
    // ======================================================================






    this.resetHandles = (ev) => {
      //-// console.log('HANDLE RESET EVENT OCCURED')
      this.arrow.resetHandles()
    }
    document.body.addEventListener('resetHandles', this.resetHandles, true)



    // ------------------------------------
    // CHECKING CLICK AND DOUBLE CLICK
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event

    this.arrowDoubleClick = (ev) => {
      //console.log(`---- SVG-ARROW DOUBLE CLICKED ::  -- ID -- ${this.arrow.svgDom.getAttribute('id')}`)
      // -----------------------------------------------------------
      // USING GLOBAL-SCOPED EVENT (main_global.js)
      // https://javascript.info/dispatch-events
      // https://blog.logrocket.com/custom-events-in-javascript-a-complete-guide/
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
      // https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
      ev.target.dispatchEvent(eventToArribMan)

      //console.log(ev.target)

    }
    this.arrow.svgDom.addEventListener("dblclick", this.arrowDoubleClick, false)






    this.arrowMouseDown = (ev) => {
      //-// console.log(`---- SVG-ARROW CLICKED ::  ${this.arrow.svgDom.getAttribute('id')}`)
      ev.stopImmediatePropagation()
      ev.preventDefault()

      this.arrow.seeHandles()

      ev.target.dispatchEvent(eventToArribMan)
    }
    this.arrow.svgDom.addEventListener("mousedown", this.arrowMouseDown, false)



    // ======================================================================
    // MUTATION OBSERVERS & HANDLERS
    // ======================================================================

    // -------------------------------------------------------------
    // SETTING UP OBSERVER FOR ATTRIBUTE CHANGES !!!
    const observeConfig = {
      attributes: true,
      subtree: true
    }

    this.observer = new MutationObserver((mutationsList, observer) => {

      //console.log(mutationsList)

      this.mutationsList = mutationsList


    })
    this.observer.observe(this.group, observeConfig)



    this.opacityObserver = new MutationObserver((mutationsList, observer) => {

      //console.log(mutationsList)

      this.mutationsList = mutationsList
      for(const mutation of mutationsList) {
        if(mutation.type === 'attributes') {

          //console.log(this.arrow.svgDom.style.opacity)

          this.dataStore.opacity = this.arrow.svgDom.style.opacity
          this.dataStore.fill = this.arrow.svgDom.getAttribute('fill')
          this.dataStore.zIndex = this.group.dataset.zIndex

          this.localStorage.saveToLocalStr(this.dataStore)

        }
      }
    })
    this.opacityObserver.observe(this.arrow.svgDom, observeConfig)





    // =========================================
    // CREATING KEYFRAME
    // =========================================

    this.createKeyframe = (ev) => {
      //-// console.log(`CREATE KEYFRAME EVENT OCCURED   ::  ${ev.detail.id}    ---- TYPE ::  ${ev.detail.type}     ---- TIME :: ${ev.detail.time}`)

      if( this.groupId === ev.detail.id.split('_')[0]) {

        // RETRIEVING VALUES, TIME ETC.
        let id = ev.detail.id
        let time = ev.detail.time
        let type = ev.detail.type
        let values = ev.detail.value
        let keyObjs = {}
        const hndId = ev.detail.value.hndId

        // VALUE TYPE CHEKCING
        switch (type) {
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


        // TODO::::
        // CREATING KEYFRAME
        for(let key in values) {
          if(key !== 'hndId') {
            keyObjs[key] = this.keyframeManager.createKeyframe({
              when: time,
              value: values[key]
            })
          }
        }
        // INSERT HANDLE ID
        //keyObjs['hndId'] = hndId

        // ------------------------------------------------------------
        // IF INCOMING ID DOES NOT EXIST IN THE timelines LIST,
        // IT SHOULD CREATE NEW TIMELINE
        // OR,
        // ALREADY EXISTED, WE JUST OVERWRITE THAT
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
            // INSERT HANDLE ID
            this.timelines[timelineName]['hndId'] = hndId

            // ----------------------------------------
            // TODO :: COLLECT ALL EVENT HANDLERS
            // SET EVENT HANDLER
            this.keyframeManager.setEventHandler({
              targetId: timelineName,
              obj: this,
              objType: 'ARROW'
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
              // INSERT HANDLE ID
              this.timelines[timelineName]['hndId'] = hndId
              // ----------------------------------------
              // SET EVENT HANDLER
              this.keyframeManager.setEventHandler({
                targetId: timelineName,
                obj: this,
                objType: 'ARROW'
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
      const incomingHndId = ev.detail.shapeType
      const incomingAttrName = ev.detail.attrName
      const incomingKeyIndex = parseInt(ev.detail.keyIndex)
      const incomingPercentage = Math.floor(ev.detail.percentage)


      // IF INCOMING EVENT IS SENT FROM SAME OBJECT
      if(this.groupId === incomingGrpId) {


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
          // bf8c86a0-32b6-483a-a5fe-21f48d8a3370_arrowArect_x
          const hndId = timelnName.split('_')[1]        // arrowArect
          let hndIndex = hndId.slice(5,6)               // A,B OR C
          let shapeType = hndId.slice(6)                // rect
          const attrName = timelnName.split('_')[2]     // x, y

          // CONSTRUCT KEYNAME FOR ATTIBBOX STORAGE
          const attrKeyName = shapeType + hndIndex + attrName           // rectAx


          if(hndId === incomingHndId && attrName === incomingAttrName) {
            // GETTING CURRENT TIMELINE AND ANIM STORAGE
            let keyArray_Timeline = this.timelines[timelnName].keyframes
            let keyArray_AnimStorage = animStorageObj[timelnName].keyframes

            // FIND UPDATED KEY FRAME USING KEYFRAME INDEX
            // 1. TIMELINES OBJECT UPDATE
            keyArray_Timeline[incomingKeyIndex].when = `${incomingPercentage}`
            // 2. LOCAL STORAGE (ANIM) UPDATE
            keyArray_AnimStorage[incomingKeyIndex].when = `${incomingPercentage}`
            str.setItem(animKeyName, JSON.stringify(animStorageObj))
            // 3. LOCAL STORAGE (ATTRIB BOX) UPDATE
            if(attrName !== 'opacity' && attrName !== 'fill') {
              // FOR HANDLE'S ATTRIBUTES
              attrboxStorageObj[attrKeyName][attrName][incomingKeyIndex].when = `${incomingPercentage}`
              str.setItem(attrboxKeyName, JSON.stringify(attrboxStorageObj))
            
            } else {
              // FOR OPACITY AND FILL ATTRIBUTE
              attrboxStorageObj[attrName][incomingKeyIndex].when = `${incomingPercentage}`
              str.setItem(attrboxKeyName, JSON.stringify(attrboxStorageObj))
            
            }

            //-// console.log(localStorage)
            
            // ------------------------------------------------------------------
            // < CHECKING FOR LINKED PARAMETER >
            let attrName_linked

            if(attrName === 'x') attrName_linked = 'y'
            else if(attrName === 'y') attrName_linked = 'x'
              console.log('attrName')
              console.log(attrName)
              console.log('attrName_linked')
              console.log(attrName_linked)

            // CONSTRUCT KEYNAME FOR ATTIBBOX STORAGE
            const attrKeyName_linked = shapeType + hndIndex + attrName_linked           // rectAy
              console.log('attrKeyName')
              console.log(attrKeyName)
              console.log('attrKeyName_linked')
              console.log(attrKeyName_linked)
              console.log(attrboxKeyName)

            // THIS IS FOR CHECKING LINKED OR NOT
            let timelnName_linked = undefined
            if(attrName_linked !== undefined) {
              timelnName_linked = timelnName.split('_')[0] + '_' + timelnName.split('_')[1] + '_' + attrName_linked
              console.log(timelnName_linked)


              // GETTING CURRENT TIMELINE AND ANIM STORAGE
              let keyArray_Timeline_linked = this.timelines[timelnName_linked].keyframes
              let keyArray_AnimStorage_linked = animStorageObj[timelnName_linked].keyframes

              // FIND UPDATED KEY FRAME USING KEYFRAME INDEX
              // 1. TIMELINES OBJECT UPDATE
              keyArray_Timeline_linked[incomingKeyIndex].when = `${incomingPercentage}`
              // 2. LOCAL STORAGE (ANIM) UPDATE
              keyArray_AnimStorage_linked[incomingKeyIndex].when = `${incomingPercentage}`
              str.setItem(animKeyName, JSON.stringify(animStorageObj))
              // 3. LOCAL STORAGE (ATTRIB BOX) UPDATE

              // FOR HANDLE'S ATTRIBUTES
              attrboxStorageObj[attrKeyName_linked][attrName_linked][incomingKeyIndex].when = `${incomingPercentage}`
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


    // ---------------------------------------------------------
    // SAVING TO LOCAL DATA
    // WHEN INITIALIZATION
    if(settings.isStored === false) {


      this.setDataStore()

      // ------------------------------------------------
      // TRANSFER dataStore TO ARROW AND HANDLES !!!!!
      this.arrow.handles.A.transferDataStore(this.dataStore, this.localStorage)
      this.arrow.handles.B.transferDataStore(this.dataStore, this.localStorage)
      this.arrow.handles.C.transferDataStore(this.dataStore, this.localStorage)



      //this.localStorage.saveToLocalStr(this.dataStore)


      // REQUIRED DATA FOR ATTRIBBOX STORAGE IS FOR DISPLAYING 'LOCAL TIMELINE'
      // SO THAT MEANS ONLY 'ANIMATABLE PARAMETERS'
      const dataForAttribBox = {
        groupId: this.groupId,
        timeline: this.timelines
      }
      this.setAttribBoxStore(dataForAttribBox, this.group)


    } else {

      // ---------------------------------------------------------
      // LOADING FROM LOCAL STORAGE

      // SHAPES

      this.setDataStore()


      //console.log(this.dataStore)
      // ------------------------------------------------
      // TRANSFER dataStore TO ARROW AND HANDLES !!!!!
      this.arrow.handles.A.transferDataStore(this.dataStore, this.localStorage)
      this.arrow.handles.B.transferDataStore(this.dataStore, this.localStorage)
      this.arrow.handles.C.transferDataStore(this.dataStore, this.localStorage)


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
              objType: 'ARROW'
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
              objType: 'ARROW'
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
    // if(settings.isStored) this.afterload(settings)


    // ======================================================================
    // RE-ALIGN DOMs ACCORDING TO Z-INDEX
    // ======================================================================

    ZIndexManager.refreshAllSvg()


  }


  // -----------------------------------
  // INPUT DATA TO LOCAL STORAGE
  // 1. WHEN NEWLY CREATED
  // 2. LOADING FROM LOCAL STORAGE
  setDataStore() {

    this.dataStore = {
      type: 'ARROW',
      isStored: true,
      id: this.groupId,
      zIndex: this.group.dataset.zIndex,
      svg_id: this.arrow.id,
      hndA_posRect_posX: parseInt(this.arrow.handles.A.posRect.svgDom.getAttribute('x')),
      hndA_posRect_posY: parseInt(this.arrow.handles.A.posRect.svgDom.getAttribute('y')),
      hndA_rotCirA_posX: parseInt(this.arrow.handles.A.rotCircle_A.svgDom.getAttribute('cx')),
      hndA_rotCirA_posY: parseInt(this.arrow.handles.A.rotCircle_A.svgDom.getAttribute('cy')),
      hndA_rotCirB_posX: parseInt(this.arrow.handles.A.rotCircle_B.svgDom.getAttribute('cx')),
      hndA_rotCirB_posY: parseInt(this.arrow.handles.A.rotCircle_B.svgDom.getAttribute('cy')),

      hndB_posRect_posX: parseInt(this.arrow.handles.B.posRect.svgDom.getAttribute('x')),
      hndB_posRect_posY: parseInt(this.arrow.handles.B.posRect.svgDom.getAttribute('y')),
      hndB_rotCirA_posX: parseInt(this.arrow.handles.B.rotCircle_A.svgDom.getAttribute('cx')),
      hndB_rotCirA_posY: parseInt(this.arrow.handles.B.rotCircle_A.svgDom.getAttribute('cy')),
      hndB_rotCirB_posX: parseInt(this.arrow.handles.B.rotCircle_B.svgDom.getAttribute('cx')),
      hndB_rotCirB_posY: parseInt(this.arrow.handles.B.rotCircle_B.svgDom.getAttribute('cy')),

      hndC_posRect_posX: parseInt(this.arrow.handles.C.posRect.svgDom.getAttribute('x')),
      hndC_posRect_posY: parseInt(this.arrow.handles.C.posRect.svgDom.getAttribute('y')),
      hndC_rotCirA_posX: parseInt(this.arrow.handles.C.rotCircle_A.svgDom.getAttribute('cx')),
      hndC_rotCirA_posY: parseInt(this.arrow.handles.C.rotCircle_A.svgDom.getAttribute('cy')),
      hndC_rotCirB_posX: parseInt(this.arrow.handles.C.rotCircle_B.svgDom.getAttribute('cx')),
      hndC_rotCirB_posY: parseInt(this.arrow.handles.C.rotCircle_B.svgDom.getAttribute('cy')),
      fill: this.arrow.svgDom.getAttribute('fill'),
      opacity: parseFloat(this.arrow.svgDom.style.opacity)
    }
  }

  preload(settings) {
    //-// console.log(` (LOCAL STORAGE) PRELOADING ->   ${settings.id}`)
    // OVERLOADING REQUIRED MEMBERS
    this.groupId = settings.id
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



  afterload(settings) {
    //-// console.log(` (LOCAL STORAGE) AFTERLOADING ->   ${settings.id}`)
    // RE-SETTING REQUIRED OBJECTS
    this.group.dataset.zIndex = settings.zIndex
    this.arrow.svgDom.setAttribute("id", settings.id + '_arrow')

    this.arrow.handles.A.posRect.posX = settings.hndA_posRect_posX
    this.arrow.handles.A.posRect.posY = settings.hndA_posRect_posY
    this.arrow.handles.A.rotCircle_A.posX = settings.hndA_rotCirA_posX
    this.arrow.handles.A.rotCircle_A.posY = settings.hndA_rotCirA_posY
    this.arrow.handles.A.rotCircle_B.posX = settings.hndA_rotCirB_posX
    this.arrow.handles.A.rotCircle_B.posY = settings.hndA_rotCirB_posY

    this.arrow.handles.B.posRect.posX = settings.hndB_posRect_posX
    this.arrow.handles.B.posRect.posY = settings.hndB_posRect_posY
    this.arrow.handles.B.rotCircle_A.posX = settings.hndB_rotCirA_posX
    this.arrow.handles.B.rotCircle_A.posY = settings.hndB_rotCirA_posY
    this.arrow.handles.B.rotCircle_B.posX = settings.hndB_rotCirB_posX
    this.arrow.handles.B.rotCircle_B.posY = settings.hndB_rotCirB_posY

    this.arrow.handles.C.posRect.posX = settings.hndC_posRect_posX
    this.arrow.handles.C.posRect.posY = settings.hndC_posRect_posY
    this.arrow.handles.C.rotCircle_A.posX = settings.hndC_rotCirA_posX
    this.arrow.handles.C.rotCircle_A.posY =  settings.hndC_rotCirA_posY
    this.arrow.handles.C.rotCircle_B.posX = settings.hndC_rotCirB_posX
    this.arrow.handles.C.rotCircle_B.posY = settings.hndC_rotCirB_posY

    this.arrow.handles.A.posRect.svgDom.setAttribute('x', settings.hndA_posRect_posX)
    this.arrow.handles.A.posRect.svgDom.setAttribute('y', settings.hndA_posRect_posY)
    this.arrow.handles.A.rotCircle_A.svgDom.setAttribute('cx', settings.hndA_rotCirA_posX)
    this.arrow.handles.A.rotCircle_A.svgDom.setAttribute('cy', settings.hndA_rotCirA_posY)
    this.arrow.handles.A.rotCircle_B.svgDom.setAttribute('cx', settings.hndA_rotCirB_posX)
    this.arrow.handles.A.rotCircle_B.svgDom.setAttribute('cy', settings.hndA_rotCirB_posY)

    this.arrow.handles.B.posRect.svgDom.setAttribute('x', settings.hndB_posRect_posX)
    this.arrow.handles.B.posRect.svgDom.setAttribute('y', settings.hndB_posRect_posY)
    this.arrow.handles.B.rotCircle_A.svgDom.setAttribute('cx', settings.hndB_rotCirA_posX)
    this.arrow.handles.B.rotCircle_A.svgDom.setAttribute('cy', settings.hndB_rotCirA_posY)
    this.arrow.handles.B.rotCircle_B.svgDom.setAttribute('cx', settings.hndB_rotCirB_posX)
    this.arrow.handles.B.rotCircle_B.svgDom.setAttribute('cy', settings.hndB_rotCirB_posY)

    this.arrow.handles.C.posRect.svgDom.setAttribute('x', settings.hndC_posRect_posX)
    this.arrow.handles.C.posRect.svgDom.setAttribute('y', settings.hndC_posRect_posY)
    this.arrow.handles.C.rotCircle_A.svgDom.setAttribute('cx', settings.hndC_rotCirA_posX)
    this.arrow.handles.C.rotCircle_A.svgDom.setAttribute('cy', settings.hndC_rotCirA_posY)
    this.arrow.handles.C.rotCircle_B.svgDom.setAttribute('cx', settings.hndC_rotCirB_posX)
    this.arrow.handles.C.rotCircle_B.svgDom.setAttribute('cy', settings.hndC_rotCirB_posY)

    this.arrow.svgDom.setAttribute("fill", settings.fill)
    this.arrow.svgDom.style.opacity = settings.opacity

    // UPDATE ARROW'S SHAPE
    this.arrow.update()


  }



  remove() {

    // REMOVE EVENT LISTENER
    document.body.removeEventListener("createKeyFrame", this.createKeyframe, true)
    document.body.removeEventListener('resetHandles', this.resetHandles, true)
    this.arrow.svgDom.removeEventListener("dblclick", this.arrowDoubleClick, false)
    this.arrow.svgDom.removeEventListener("mousedown", this.arrowMouseDown, false)
    this.group.removeEventListener('update_keyframe_time', this.updateKeyframeTime, false)
    this.group.removeEventListener('deleteObject', this.deleteObjectHandler,false)
    this.keyframeManager.remove()

    this.timelines = {}
    this.animStore = {}
    this.dataStore = {}
    this.observer = undefined
    this.keyframeManager = undefined

    // DELETE DOM
    this.arrow.remove()
    this.group.remove()



  }




  // -----------------------------------
  //


  duplicateSetting(prevObj) {

    // for(let tmName in prevObj.timelines) {
    //   let newKeyName = this.groupId + '_' + tmName.split('_')[1] + '_' + tmName.split('_')[2]
    //   this.timelines[newKeyName] = prevObj.timelines[tmName]

    // }


    this.arrow.handles.A.posRect.posX     = parseInt(prevObj.arrow.handles.A.posRect.posX)
    this.arrow.handles.A.posRect.posY     = parseInt(prevObj.arrow.handles.A.posRect.posY)
    this.arrow.handles.A.rotCircle_A.posX = parseInt(prevObj.arrow.handles.A.rotCircle_A.posX)
    this.arrow.handles.A.rotCircle_A.posY = parseInt(prevObj.arrow.handles.A.rotCircle_A.posY)
    this.arrow.handles.A.rotCircle_B.posX = parseInt(prevObj.arrow.handles.A.rotCircle_B.posX)
    this.arrow.handles.A.rotCircle_B.posY = parseInt(prevObj.arrow.handles.A.rotCircle_B.posY)

    this.arrow.handles.B.posRect.posX     = parseInt(prevObj.arrow.handles.B.posRect.posX    )
    this.arrow.handles.B.posRect.posY     = parseInt(prevObj.arrow.handles.B.posRect.posY    )
    this.arrow.handles.B.rotCircle_A.posX = parseInt(prevObj.arrow.handles.B.rotCircle_A.posX)
    this.arrow.handles.B.rotCircle_A.posY = parseInt(prevObj.arrow.handles.B.rotCircle_A.posY)
    this.arrow.handles.B.rotCircle_B.posX = parseInt(prevObj.arrow.handles.B.rotCircle_B.posX)
    this.arrow.handles.B.rotCircle_B.posY = parseInt(prevObj.arrow.handles.B.rotCircle_B.posY)

    this.arrow.handles.C.posRect.posX     = parseInt(prevObj.arrow.handles.C.posRect.posX    )
    this.arrow.handles.C.posRect.posY     = parseInt(prevObj.arrow.handles.C.posRect.posY    )
    this.arrow.handles.C.rotCircle_A.posX = parseInt(prevObj.arrow.handles.C.rotCircle_A.posX)
    this.arrow.handles.C.rotCircle_A.posY = parseInt(prevObj.arrow.handles.C.rotCircle_A.posY)
    this.arrow.handles.C.rotCircle_B.posX = parseInt(prevObj.arrow.handles.C.rotCircle_B.posX)
    this.arrow.handles.C.rotCircle_B.posY = parseInt(prevObj.arrow.handles.C.rotCircle_B.posY)

    this.arrow.handles.A.posRect.svgDom.setAttribute('x',      parseInt(prevObj.arrow.handles.A.posRect.svgDom.getAttribute('x')))
    this.arrow.handles.A.posRect.svgDom.setAttribute('y',      parseInt(prevObj.arrow.handles.A.posRect.svgDom.getAttribute('y')))
    this.arrow.handles.A.rotCircle_A.svgDom.setAttribute('cx', parseInt(prevObj.arrow.handles.A.rotCircle_A.svgDom.getAttribute('cx')))
    this.arrow.handles.A.rotCircle_A.svgDom.setAttribute('cy', parseInt(prevObj.arrow.handles.A.rotCircle_A.svgDom.getAttribute('cy')))
    this.arrow.handles.A.rotCircle_B.svgDom.setAttribute('cx', parseInt(prevObj.arrow.handles.A.rotCircle_B.svgDom.getAttribute('cx')))
    this.arrow.handles.A.rotCircle_B.svgDom.setAttribute('cy', parseInt(prevObj.arrow.handles.A.rotCircle_B.svgDom.getAttribute('cy')))

    this.arrow.handles.B.posRect.svgDom.setAttribute('x',      parseInt(prevObj.arrow.handles.B.posRect.svgDom.getAttribute('x')))
    this.arrow.handles.B.posRect.svgDom.setAttribute('y',      parseInt(prevObj.arrow.handles.B.posRect.svgDom.getAttribute('y')))
    this.arrow.handles.B.rotCircle_A.svgDom.setAttribute('cx', parseInt(prevObj.arrow.handles.B.rotCircle_A.svgDom.getAttribute('cx')))
    this.arrow.handles.B.rotCircle_A.svgDom.setAttribute('cy', parseInt(prevObj.arrow.handles.B.rotCircle_A.svgDom.getAttribute('cy')))
    this.arrow.handles.B.rotCircle_B.svgDom.setAttribute('cx', parseInt(prevObj.arrow.handles.B.rotCircle_B.svgDom.getAttribute('cx')))
    this.arrow.handles.B.rotCircle_B.svgDom.setAttribute('cy', parseInt(prevObj.arrow.handles.B.rotCircle_B.svgDom.getAttribute('cy')))

    this.arrow.handles.C.posRect.svgDom.setAttribute('x',      parseInt(prevObj.arrow.handles.C.posRect.svgDom.getAttribute('x')))
    this.arrow.handles.C.posRect.svgDom.setAttribute('y',      parseInt(prevObj.arrow.handles.C.posRect.svgDom.getAttribute('y')))
    this.arrow.handles.C.rotCircle_A.svgDom.setAttribute('cx', parseInt(prevObj.arrow.handles.C.rotCircle_A.svgDom.getAttribute('cx')))
    this.arrow.handles.C.rotCircle_A.svgDom.setAttribute('cy', parseInt(prevObj.arrow.handles.C.rotCircle_A.svgDom.getAttribute('cy')))
    this.arrow.handles.C.rotCircle_B.svgDom.setAttribute('cx', parseInt(prevObj.arrow.handles.C.rotCircle_B.svgDom.getAttribute('cx')))
    this.arrow.handles.C.rotCircle_B.svgDom.setAttribute('cy', parseInt(prevObj.arrow.handles.C.rotCircle_B.svgDom.getAttribute('cy')))

    this.arrow.allSvgPath = prevObj.arrow.allSvgPath
    this.arrow.svgDom.setAttribute('d', this.arrow.allSvgPath.join(' '))


    // ORDER BELOW IS CRITICAL!!!
    //console.log(prevObj.arrow.fill)
    this.arrow.svgDom.setAttribute("fill", prevObj.arrow.svgDom.getAttribute('fill'))            // 1
    this.arrow.fill = prevObj.arrow.svgDom.getAttribute('fill')                                  // 2
    this.arrow.svgDom.style.opacity = prevObj.arrow.svgDom.style.opacity

    this.arrow.calRelPos_Handles()
    
    // ** WE DO NOT USE .update() FUNCTION !!!!

  }





  getGroupId() {
    return this.group.id
  }

  // RETURN ALL HTML DOM TO OUTSIDE
  getDomList() {

    let domlist = []

    // GETTING DOMs FROM HANDLES
    //domlist = this.handles.A.getDomList().concat(this.handles.B.getDomList()).concat(this.handles.C.getDomList())

    domlist = this.arrow.getDomList()

    return domlist

  }



}


export {DrawArrow}
