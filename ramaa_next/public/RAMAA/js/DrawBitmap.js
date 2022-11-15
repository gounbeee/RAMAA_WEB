'use strict'

import { Draw }             from "./Draw.js"
import { Security }         from "./Security.js"
import { ZIndexManager }    from "./ZIndexManager.js"
import { DraggableScreen }  from "./DraggableScreen.js"
import { LocalStorage }     from "./LocalStorage.js"
import { BitmapPad }        from "./BitmapPad.js"


// DRAW SVG OBJECT : BITMAP SHAPE

class DrawBitmap extends Draw {

  constructor(settings, stateObj) {
    //-// console.log('%% DrawBitmap.js :: DrawBitmap CONSTRUCTOR EXECUTED')
    
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
    this.svgRoot = document.getElementById('canvas_dom')
    this.group = document.createElementNS(this.nsSvg, 'g')
    this.foreignDom = document.createElementNS(this.nsSvg, 'foreignObject')

    // FLAG IF IT WAS EDITTING PRE-EXISTED BITMAP PAD
    // AND PRESSED 'OK' BUTTON IN THE UI
    this.wasEditting = settings.isEditting
    this.storedZIndex = settings.storedZIndex

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
    if(settings.isStored) {

      this.preload(settings)

    } else {
      // ------------------------------------
      // SETTING NEW ID
      this.groupId = new Security().getUUIDv4()


      // =======================================================
      // BITMAP PAD OBJECT
      this.bitmapPadObj = settings.bitmapObj
      this.canvasImageData = settings.canvasContext.getImageData(0, 0, parseInt(settings.width), parseInt(settings.height))
      


      // ------------------------------------
      // CREATE CANVAS ELEMENT
      this.canvas = document.createElement('canvas')
      this.foreignDom.appendChild(this.canvas)
      this.foreignDom.id = this.groupId + '_foreign'
      this.canvas.id = this.groupId + '_canvas'
      this.canvas.setAttribute('width', settings.width)
      this.canvas.setAttribute('height', settings.height)
      this.canvas.style.opacity = settings.opacity

      // ********** 
      // < THESE 'PUTTING IMAGE DATA TO CANVAS' MUST LOCATED AFTER SETTING ATTRIBUTES >
      this.canvas.getContext('2d').putImageData(this.canvasImageData, 0, 0)
      // this.canvas.getContext('2d').drawImage(this.preLoadedImg, 0, 0, settings.width, settings.height)


      this.preLoadedImg = this.imagedata_to_image(this.canvas.getContext('2d').getImageData(0, 0, parseInt(settings.width), parseInt(settings.height)))


      if(!settings.isDuplicating) this.bitmapPadObj.remove()

    }



    //console.log(this.preLoadedImg)




    // ------------------------------------
    this.group.setAttribute("id", this.groupId)

    // TODO :: CURRENTLY WE DO NOT NEED THIS FOR DRAGGING ELEMENTS
    // BELOW THIS GROUP !
    this.group.setAttribute("transform", `translate( 0, 0)`)

    this.svgRoot.appendChild(this.group)

    this.posX = settings.x
    this.posY = settings.y
    this.anchorPosX = 0
    this.anchorPosY = 0


    // ------------------------------------
    // STORING TIMELINES FOR ATTRIBUTES
    this.timelines = {}



    // ------------------------------------
    // CREATE BITMAP SHAPE
    this.foreignDom.setAttribute("x", this.posX)
    this.foreignDom.setAttribute("y", this.posY)
    this.foreignDom.setAttribute("width", settings.width)
    this.foreignDom.setAttribute("height", settings.height)
    this.foreignDom.style.opacity = settings.opacity
    this.group.appendChild(this.foreignDom)






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
        type: 'BITMAP',
        bitmapObject: this
      }
    })

    // -----------------------------------------------------------
    // FOR SENDING INFORMATION TO DOM OF ATTRIBUTE BOX
    let eventToAttribBox = new CustomEvent('attrManagerUpdate', {
      bubles: true,
      detail:{
        type: 'BITMAP',
        bitmapObject: this
      }
    })

    // -------------------------------------------------------------
    // SETTING UP OBSERVER FOR ATTRIBUTE CHANGES !!!
    const observeConfig = {
      attributes: true,
      subtree: false
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

          const mappedPosition = this.screenPointToSVGPoint( this.svgRoot, this.foreignDom, this.posX, this.posY)
          //-// console.log(`MAPPED POSITION X :::  ${this.posX}  ----  Y :::  ${this.posY}`)

          if(mappedPosition.x) this.foreignDom.setAttribute("x", Math.floor(mappedPosition.x - this.anchorPosX))
          if(mappedPosition.y) this.foreignDom.setAttribute("y", Math.floor(mappedPosition.y - this.anchorPosY))

          //this.group.setAttribute('transform', `translate( ${Math.floor(mappedPosition.x - this.anchorPosX)}, ${Math.floor(mappedPosition.y - this.anchorPosY)})`)
        


          // // ----------------------------------------
          // // UPDATE BOUNDING BOX EITHER !!!!
          // superClass.updateBoundingBox({
          //   x: parseInt(this.foreignDom.getAttribute('x')),
          //   y: parseInt(this.foreignDom.getAttribute('y')),
          //   width: this.foreignDom.getBBox().width,
          //   height: this.foreignDom.getBBox().height
          // })

          this.selectionManager.deleteOverlayBox()



          this.foreignDom.dispatchEvent(eventToAttribBox)

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
          this.dataStore.x = parseInt(this.foreignDom.getAttribute('x'))
          this.dataStore.y = parseInt(this.foreignDom.getAttribute('y'))
          this.dataStore.width = parseInt(this.foreignDom.getAttribute('width'))
          this.dataStore.height = parseInt(this.foreignDom.getAttribute('height'))

          this.dataStore.opacity = this.foreignDom.style.opacity

          this.localStorage.saveToLocalStr(this.dataStore)
          //-// console.log(this.dataStore)
        }
      }
    })
    this.observer.observe(this.foreignDom, observeConfig)


    // ZINDEX MUTATES IN group DOM OBJECT
    this.zIndexObserver = new MutationObserver((mutationsList, observer) => {
      for(const mutation of mutationsList) {
        if( mutation.type === 'attributes' ) {
          this.dataStore.zIndex = this.group.dataset.zIndex
          this.localStorage.saveToLocalStr(this.dataStore)
        }
      }
    })
    this.zIndexObserver.observe(this.group, observeConfig)




    this.mouseDownHnd = (ev) => {
      //-// console.log(`---- SVG-RECT CLICKED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      const mappedPosition = this.screenPointToDivPoint(this.svgRoot, this.foreignDom, ev.clientX, ev.clientY)

      // STORING ANCHOR POSITION
      this.screenDrag.setScreen({
        dragObj: this.foreignDom,
        mutationHandler: this.mutationHandler,
        mouseupHandler: this.mouseUpHnd
      })

      // ****  PANSCALER IS NEEDED ! (ZOOMED POSITION !!)
      this.anchorPosX = Math.floor(mappedPosition.x) * parseFloat(document.getElementById('zoom_select').dataset.panScaler)
      this.anchorPosY = Math.floor(mappedPosition.y) * parseFloat(document.getElementById('zoom_select').dataset.panScaler)

      //-// console.log(`ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)



      // // // ------------------------
      // // // DRAW BOUNDING BOX !
      // //console.log(this.foreignDom)

      // superClass.boundBoxCoords.x = parseInt(this.foreignDom.getAttribute('x'))
      // superClass.boundBoxCoords.y = parseInt(this.foreignDom.getAttribute('y'))
      // superClass.boundBoxCoords.width = this.foreignDom.getBBox().width
      // superClass.boundBoxCoords.height = this.foreignDom.getBBox().height

      // superClass.drawBoundingBox(this.foreignDom)



      // ------------------------
      // GLOBAL SELECT LIST !!!!
      console.log(gl_SELECTEDLIST[this.groupId])
      console.log(gl_SHIFTKEYPRESSED)
      let size = Object.keys(gl_SELECTEDLIST).length;

      if(size === 0) this.selectionManager.add(this)
      else if (gl_SELECTEDLIST[this.groupId] === undefined && gl_SHIFTKEYPRESSED) this.selectionManager.add(this)
      else {

        this.selectionManager.deleteOverlayBox()
        this.selectionManager.add(this)

      }


      //this.selectionManager.drawOverlayBox()




      ev.target.dispatchEvent(evAttrManOn)
    }
    this.foreignDom.addEventListener("mousedown", this.mouseDownHnd, false)




    this.mouseUpHnd = (ev) => {
      console.log('MOUSE IS UP !!')
      // DELETE BOUNDING BOX !!!!
      //superClass.removeBoundingBox()


    }




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
        switch (type) {
          case 'POSITION':
          values['x'] = parseInt(values['x'])
          values['y'] = parseInt(values['y'])
          break
          case 'SIZE':
            values['width'] = parseInt(values['width'])
            values['height'] = parseInt(values['height'])
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
              objType: 'BITMAP'
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
                objType: 'BITMAP'
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
    // EDIT BUTTON EVENT HANDLING
    // =========================================
    this.editObjectHandler = (ev) => {

      // CHECK IF THE GROUP ID IS IDENTICAL
      if(this.groupId === ev.detail.id) {

        //console.log('DrawBitmap:: EDIT BUTTON CLICKED')

        // SETTING ATTRIBUTES OF BITMAP PAD
        const canvasSizeDefault = {
          editFlag: true,
          width: this.foreignDom.getAttribute('width'),
          height: this.foreignDom.getAttribute('height'),
          x: parseInt(this.foreignDom.getAttribute('x')), 
          y: parseInt(this.foreignDom.getAttribute('y')), 
          img: this.preLoadedImg,
          oldObjRef: this,
          oldZIndex: this.group.dataset.zIndex
        }
        // CREATING CANVAS
        let canvas = new BitmapPad(canvasSizeDefault)


      }

    }
    this.group.addEventListener('editObject', this.editObjectHandler,false)



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
              objType: 'BITMAP'
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
              objType: 'BITMAP'
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
    if(!this.wasEditting) ZIndexManager.refreshAllSvg()
    else {
      // UPDATE ZINDEX OF DOM
      this.group.dataset.zIndex = parseInt(this.storedZIndex)

      // UPDATE LOCAL STORAGE
      this.dataStore.zIndex = parseInt(this.storedZIndex)
      this.localStorage.saveToLocalStr(this.dataStore)

      ZIndexManager.refreshAllSvg()
    }
      


    // SELECTION MANAGER 
    this.selectionManager = stateObj.selectionManager



  }


  // -----------------------------------
  //

  setDataStore() {
    this.dataStore = {
      type: 'BITMAP',
      isStored: true,
      id: this.groupId,
      zIndex: this.group.dataset.zIndex,
      svg_id: this.foreignDom.id,
      x: parseInt(this.foreignDom.getAttribute('x')),
      y: parseInt(this.foreignDom.getAttribute('y')),
      width: parseInt(this.canvas.width),
      height: parseInt(this.canvas.height),
      opacity: parseFloat(this.foreignDom.style.opacity),
      canvasDataURL: this.canvas.toDataURL()
    }
  }

  preload(settings) {
    // =======================================================
    //-// console.log(` (LOCAL STORAGE) PRELOADING ->   ${settings.id}`)
    // OVERLOADING REQUIRED MEMBERS
    this.groupId = settings.id


    // ------------------------------------
    // CREATE CANVAS ELEMENT
    this.canvas = document.createElement('canvas')
    this.foreignDom.appendChild(this.canvas)
    this.canvas.id = this.groupId + '_canvas'
    this.canvas.style.opacity = settings.opacity
    
    this.canvas.setAttribute('width', settings.width)
    this.canvas.setAttribute('height', settings.height)

    this.preLoadedImg = new Image(settings.width, settings.height)
    this.preLoadedImg.src = settings.canvasDataURL                             // THIS IS FROM LOCALSTORAGE

    this.preLoadedImg.onload = () => {

      //console.log(this.preLoadedImg)

      let canvasWidth  = this.canvas.getAttribute('width')
      let canvasHeight = this.canvas.getAttribute('height')

      // **** WE DO NOT NEED TO USE THE FORM LIKE BELOW
      // this.canvas.getContext('2d').drawImage(
      //   this.preLoadedImg, 
      //   0, 0, canvasWidth, canvasHeight, 
      //   0, 0, settings.width, settings.height
      // )

      this.canvas.getContext('2d').drawImage(
        this.preLoadedImg, 
        0, 0, canvasWidth, canvasHeight)

      this.setDataStore()
      this.localStorage.saveToLocalStr(this.dataStore)
    }
  }

  afterload(settings) {
    //-// console.log(` (LOCAL STORAGE) AFTERLOADING ->   ${settings.id}`)
    // RE-SETTING REQUIRED OBJECTS
    this.group.dataset.zIndex = settings.zIndex
    this.foreignDom.setAttribute("id", settings.id + '_foreign')
    this.foreignDom.setAttribute("x", settings.x)
    this.foreignDom.setAttribute("y", settings.y)
    this.foreignDom.setAttribute("width", settings.width)
    this.foreignDom.setAttribute("height", settings.height)
    this.foreignDom.style.opacity = parseFloat(settings.opacity)
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
    this.foreignDom.removeEventListener("mousedown", this.mouseDownHnd, false)
    this.keyframeManager.remove()


    // RESET TIMELINE
    this.timelines = {}
    this.animStore = {}
    this.dataStore = {}
    this.observer = undefined
    this.keyframeManager = undefined

    // DELETE DOM
    this.foreignDom.remove()
    this.group.remove()

  }



  // -----------------------------------


  duplicateSetting(prevObj) {

    this.posX = prevObj.x
    this.posY = prevObj.y


    this.canvas.setAttribute('width', prevObj.canvas.getAttribute('width'))
    this.canvas.setAttribute('height', prevObj.canvas.getAttribute('height'))
    this.canvas.style.opacity = prevObj.canvas.style.opacity

    this.foreignDom.setAttribute("x", prevObj.foreignDom.getAttribute("x"))
    this.foreignDom.setAttribute("y", prevObj.foreignDom.getAttribute("y"))
    this.foreignDom.setAttribute("width", prevObj.foreignDom.getAttribute("width"))
    this.foreignDom.setAttribute("height", prevObj.foreignDom.getAttribute("height"))
    this.foreignDom.style.opacity = prevObj.foreignDom.style.opacity

    this.canvasImageData = prevObj.canvasImageData
    this.canvas.getContext('2d').putImageData(this.canvasImageData, 0, 0)
    this.preLoadedImg = prevObj.preLoadedImg

  }









  // https://stackoverflow.com/questions/13416800/how-to-generate-an-image-from-imagedata-in-javascript
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



  getGroupId() {
    return this.group.id
  }

  // RETURN ALL HTML DOM TO OUTSIDE
  getDomList() {

    let domlist = []

    // GETTING DOMs FROM HANDLES
    //domlist = this.handles.A.getDomList().concat(this.handles.B.getDomList()).concat(this.handles.C.getDomList())

    domlist.push(this.foreignDom)

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


export { DrawBitmap }
