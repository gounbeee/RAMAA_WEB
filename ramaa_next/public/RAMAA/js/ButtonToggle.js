'use strict'

import { ZIndexManager }    from "./ZIndexManager.js"


class ButtonToggle {

  constructor(settings) {
    //-// console.log('%% ButtonToggle.js :: ButtonToggle CONSTRUCTOR EXECUTED')

    this.nsSvg = 'http://www.w3.org/2000/svg'


    this.groupId = settings.id
    this.opacity = settings.opacity
    this.posX = settings.xPos
    this.posY = settings.yPos
    this.anchorPosX = 0
    this.anchorPosY = 0

    this.isPlaying = false


    // ------------------------------------
    // CREATE SVG ELEMENT
    this.domTarget = settings.target
    this.svgRoot = document.createElementNS(this.nsSvg, 'svg')
    this.group = document.createElementNS(this.nsSvg, 'g')
    this.svgDomStop = document.createElementNS(this.nsSvg, 'rect')
    this.svgDomPlay = document.createElementNS(this.nsSvg, 'polygon')
    this.svgRoot.classList.add('ly_button')

    this.domTarget.appendChild(this.svgRoot)


    // ------------------------------------
    this.group.setAttribute("id", this.groupId)

    this.group.setAttribute("transform", `translate( 0, 0)`)
    this.svgRoot.setAttribute("x", this.posX)
    this.svgRoot.setAttribute("y", this.posY)
    this.svgRoot.setAttribute("width", settings.width)
    this.svgRoot.setAttribute("height", settings.height)
    this.svgRoot.setAttribute("viewBox", `${0} ${0} ${settings.width} ${settings.height}`)

    this.svgRoot.appendChild(this.group)


    // ------------------------------------
    // CREATE PLAY BUTTON
    //this.svgDomPlayPath = "0,0 50,25 0,50"
    this.svgDomPlayPath = `0,0 ${settings.width},${settings.height/2} 0,${settings.height}`
    this.svgDomPlay.setAttribute('points', this.svgDomPlayPath)
    this.svgDomPlay.setAttribute('x', settings.xPos)
    this.svgDomPlay.setAttribute('y', settings.yPos)
    this.svgDomPlay.setAttribute('fill', settings.fill)
    this.svgDomPlay.setAttribute("id", this.groupId + '_play')

    this.group.appendChild(this.svgDomPlay)



    // ------------------------------------
    // CREATE RECTANGLE SHAPE
    this.svgDomStop.setAttribute("x", settings.width)
    this.svgDomStop.setAttribute("y", 0)
    this.svgDomStop.setAttribute("width", settings.width)
    this.svgDomStop.setAttribute("height", settings.height)
    this.svgDomStop.setAttribute("fill", settings.fill)
    //this.svgDomStop.setAttribute("stroke", "grey")
    //this.svgDomStop.setAttribute("stroke-width", "3px")
    this.svgDomStop.setAttribute("rx", settings.width * 0.2)
    this.svgDomStop.setAttribute("id", this.groupId + '_stop')
    //this.svgDomStop.style.opacity = this.opacity
    this.group.appendChild(this.svgDomStop)


    // ------------------------------------
    // EVENT HANDLERS
    this.clickPlayHnd = (ev) => {
      //-// console.log(`---- SVG-BUTTON CLICKED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      // const mappedPosition = this.screenPointToDivPoint(this.svgRoot, this.svgDomPlay, ev.clientX, ev.clientY)
      //
      // this.anchorPosX = Math.floor(mappedPosition.x)
      // this.anchorPosY = Math.floor(mappedPosition.y)
      //
      // //-// console.log(`ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)

      this.svgRoot.setAttribute("viewBox", `${settings.width} ${0} ${settings.width} ${settings.height}`)

      const evToPlaySettings = {
        bubble: true,
        detail: {
          sender: ev.target,
          isPlaying: this.isPlaying
        }
      }
      const evToPlayTimeline = new CustomEvent('mainTimeline_play', evToPlaySettings)
      //-// console.log(ev.target)

      ev.target.dispatchEvent(evToPlayTimeline)

      this.isPlaying = true

    }
    this.svgDomPlay.addEventListener("click", this.clickPlayHnd, false)

    this.enterPlayHnd = (ev) => {
      //-// console.log(`---- SVG-BUTTON ENTERED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      // CHANGE COLOR
      this.svgDomPlay.setAttribute('fill', "#ffaaaa")


    }
    this.svgDomPlay.addEventListener("mouseenter", this.enterPlayHnd, false)

    this.leavePlayHnd = (ev) => {
      //-// console.log(`---- SVG-BUTTON LEAVED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      this.svgDomPlay.setAttribute('fill', settings.fill)


    }
    this.svgDomPlay.addEventListener("mouseleave", this.leavePlayHnd, false)





    this.clickStopHnd = (ev) => {
      //-// console.log(`---- SVG-BUTTON STOP CLICKED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      // const mappedPosition = this.screenPointToDivPoint(this.svgRoot, this.svgDomStop, ev.clientX, ev.clientY)
      //
      // this.anchorPosX = Math.floor(mappedPosition.x)
      // this.anchorPosY = Math.floor(mappedPosition.y)
      //
      // //-// console.log(`ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)

      this.svgRoot.setAttribute("viewBox", `${0} ${0} ${settings.width} ${settings.height}`)


      const evToStopSettings = {
        bubble: true,
        detail: {
          sender: ev.target,
          isPlaying: this.isPlaying
        }
      }
      const evToStopTimeline = new CustomEvent('mainTimeline_stop', evToStopSettings)

      //-// console.log(ev.target)

      ev.target.dispatchEvent(evToStopTimeline)

      this.isPlaying = false

    }
    this.svgDomStop.addEventListener("click", this.clickStopHnd, false)

    this.enterStopHnd = (ev) => {
      //-// console.log(`---- SVG-BUTTON STOP ENTERED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      // CHANGE COLOR
      this.svgDomStop.setAttribute('fill', "#ffaaaa")


    }
    this.svgDomStop.addEventListener("mouseenter", this.enterStopHnd, false)

    this.leaveStopHnd = (ev) => {
      //-// console.log(`---- SVG-BUTTON STOP LEAVED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      this.svgDomStop.setAttribute('fill', settings.fill)


    }
    this.svgDomStop.addEventListener("mouseleave", this.leaveStopHnd, false)







    //
    //
    // // REACTING TO EVENT 'createKeyFrame'
    // // FROM ATTRIB BOX
    //
    // this.createKeyframe = (ev) => {
    //   //-// console.log(`CREATE KEYFRAME EVENT OCCURED   ::  ${ev.detail.id}`)
    //
    //   if( this.groupId === ev.detail.id.split('_')[0]) {
    //
    //     // RETRIEVING VALUES, TIME ETC.
    //     let id = ev.detail.id
    //     let time = ev.detail.time
    //     let type = ev.detail.type
    //     let values = ev.detail.value
    //     let keyObjs = {}
    //
    //
    //     // CREATING KEYFRAME
    //     for(let key in values) {
    //       keyObjs[key] = this.keyframeManager.createKeyframe({
    //         when: time,
    //         value: values[key]
    //       })
    //     }
    //
    //     // ------------------------------------------------------------
    //     // IF INCOMING ID DOES NOT EXIST IN THE timelines LIST,
    //     // IT SHOULD CREATE NEW TIMELINE
    //     let currentKeyList = Object.keys(this.timelines)
    //
    //     let filteredObj = {}
    //
    //     for(let i=0; i < currentKeyList.length; i++){
    //       // CHECK IF NEW NAME IS ALREADY EXISTED
    //       for(let key in keyObjs) {
    //         let timelineName = id + '_' + key
    //         // IF THERE IS NO NAME EXISTED...
    //         if(currentKeyList[i] !== timelineName) filteredObj[timelineName] = { result: false, keyObj: keyObjs[key]}
    //         else if(currentKeyList[i] === timelineName) filteredObj[timelineName] = { result: true, keyObj: keyObjs[key]}
    //       }
    //     }
    //
    //
    //
    //     if(currentKeyList.length === 0) {
    //       // CREATING TIMELINE
    //       for(let key in keyObjs) {
    //         let timelineName = id + '_' + key
    //
    //         this.timelines = this.keyframeManager.setTimeline({
    //           domId: timelineName,
    //           attrName: key,
    //           time: keyObjs[key].when,
    //           keyframes: keyObjs[key],
    //           duration: 10000
    //         })
    //
    //         // ----------------------------------------
    //         // TODO :: COLLECT ALL EVENT HANDLERS
    //         // SET EVENT HANDLER
    //         this.keyframeManager.setEventHandler({
    //           targetId: timelineName
    //
    //
    //
    //         })
    //
    //       }
    //
    //     } else {
    //
    //
    //       // CREATING TIMELINE
    //       for(let key in keyObjs) {
    //         let timelineName = id + '_' + key
    //
    //
    //         let isExisted = currentKeyList.includes(timelineName)
    //
    //         if(!isExisted) {
    //           this.timelines = this.keyframeManager.setTimeline({
    //             domId: timelineName,
    //             attrName: key,
    //             time: keyObjs[key].when,
    //             keyframes: keyObjs[key],
    //             duration: 10000
    //           })
    //
    //           // SET EVENT HANDLER
    //           this.keyframeManager.setEventHandler({
    //             targetId: timelineName
    //
    //
    //
    //           })
    //
    //
    //         } else {
    //
    //           // ADDING KEYFRAME TO TIMELINE
    //           this.timelines = this.keyframeManager.addKeyframe({
    //             domId: timelineName,
    //             keyframes: keyObjs[key]
    //           })
    //         }
    //       }
    //     }
    //
    //     // -----------------------------------------------
    //     // STORING KEYFRAMES TO LOCAL STORAGE
    //     let groupId = ev.detail.id.split('_')[0]
    //
    //     // BELOW ID KEY NAME WILL DEFINE OBJECT'S MAIN KEYNAME
    //     this.animStore.id = groupId + '_anim'
    //     this.animStore.isStored = true
    //
    //     for( let keyName in this.timelines) {
    //       this.animStore[keyName] = this.timelines[keyName]
    //     }
    //     this.localStorage.saveToLocalStr(this.animStore)
    //
    //
    //
    //
    //   }
    //
    // }
    //
    // document.body.addEventListener("createKeyFrame", this.createKeyframe, true)
    //





    // // ======================================================================
    // // LOCAL STORAGE
    // // ======================================================================
    //
    //
    // // ---------------------------------------------------------
    // // SAVING TO LOCAL DATA
    // // WHEN INITIALIZATION
    // if(settings.isStored === false) {
    //   this.setDataStore()
    //   this.localStorage.saveToLocalStr(this.dataStore)
    // } else {
    //   this.setDataStore()
    //
    //
    //
    //   // ANIMATIONS
    //   let strAnim = localStorage
    //   // IF THERE IS AN ANIMTAION DATA
    //   if(strAnim[this.groupId + '_anim']) {
    //     //-// console.log(` >>>>   ${strAnim[this.groupId + '_anim']}     HAS AN ANIMATION DATA`)
    //
    //     // BELOW IS RAW OBJECT FROM LOCAL STORAGE
    //     let timelineBeforeEval = JSON.parse(strAnim[this.groupId + '_anim'])
    //
    //     // ==============================================
    //     // WE WILL RECONSTRUCT REAL TIMELINE
    //     // ==============================================
    //
    //     // ----------------------------------------------
    //     // PICKUP GROUPID (BASE ID)
    //     let groupId = timelineBeforeEval['id'].split('_')[0]
    //
    //     // BECAUSE OUR FORMAT OF ANIMTION LOCAL STORAGE HAS 'id' AND 'isStored' KEY,
    //     // SO WE DELETE THEM HERE
    //     delete timelineBeforeEval['id']
    //     delete timelineBeforeEval['isStored']
    //
    //     // ----------------------------------------------
    //     // COLLECTING KEYFRAME DATA FROM LOCAL STORAGE
    //     // THEN RE-EVALUATE
    //
    //     // 1. COLLECT FIRST
    //     // 2. RE-EVALUATED KEYFRAME OBJECTS
    //
    //     let allNameKeys = []
    //
    //     for(let timelineName in timelineBeforeEval) {
    //
    //       let collKeyframes = timelineBeforeEval[timelineName].keyframes
    //       let channel = timelineBeforeEval[timelineName].attrName
    //
    //       for(let i=0; i < collKeyframes.length; i++) {
    //
    //         let when = collKeyframes[i]['when']
    //         let value = collKeyframes[i]['value']
    //
    //         // KEYFRAME CREATION
    //         let keyObjs = {}
    //         keyObjs[channel] = this.keyframeManager.createKeyframe({
    //           when: when,
    //           value: value
    //         })
    //         keyObjs.timelineName = timelineName
    //
    //         allNameKeys.push(keyObjs)
    //
    //       }
    //     }
    //
    //
    //     for(let keyframe of allNameKeys) {
    //       let tlNm = keyframe.timelineName
    //       let attrNmArr = tlNm.split('_')
    //       let attrNm = attrNmArr[attrNmArr.length-1]
    //
    //       // ======================================================================
    //       // MANAGING KEYFRAME
    //       // ======================================================================
    //
    //       // CHECKING TIMELINE WAS INTIALIZED
    //       // OR ALREADY EXISTED
    //       //
    //       // + IF ALREADY EXISTED,
    //       //   1. TIMELINE IS EXISTED BUT, 'DIFFERENT' TIMELINE (DIFFERENT CHANNEL)
    //       //      -> STILL WE SHOULD CREATE NEW TIMELINE
    //       //   2. TIMELINE IS EXISTED AND 'SAME' TIMELINE
    //       //      -> JUST ADD KEYFRAME
    //       let currentKeyList = Object.keys(this.timelines)
    //       if(currentKeyList.length === 0) {
    //
    //         this.timelines = this.keyframeManager.setTimeline({
    //           domId: keyframe.timelineName,
    //           attrName: attrNm,
    //           time: keyframe[attrNm].when,
    //           keyframes: keyframe[attrNm],
    //           duration: 10000
    //         })
    //
    //         // SET EVENT HANDLER
    //         this.keyframeManager.setEventHandler({
    //           targetId: keyframe.timelineName,
    //           obj: this,
    //           objType: 'RECTANGLE'
    //         })
    //
    //
    //       } else if(currentKeyList.includes(tlNm) === false) {
    //
    //
    //         this.timelines = this.keyframeManager.setTimeline({
    //           domId: keyframe.timelineName,
    //           attrName: attrNm,
    //           time: keyframe[attrNm].when,
    //           keyframes: keyframe[attrNm],
    //           duration: 10000
    //         })
    //
    //         // SET EVENT HANDLER
    //         this.keyframeManager.setEventHandler({
    //           targetId: keyframe.timelineName,
    //           obj: this,
    //           objType: 'RECTANGLE'
    //         })
    //
    //
    //       } else {
    //
    //         // ADDING KEYFRAME TO TIMELINE
    //         this.timelines = this.keyframeManager.addKeyframe({
    //           domId: keyframe.timelineName,
    //           keyframes: keyframe[attrNm]
    //         })
    //
    //       }
    //     }
    //
    //   }
    //
    //
    //
    //
    //
    //
    // }



    // // ------------------------------------
    // // AFTERLOADING (IF NECESSARY)
    // if(settings.isStored) this.afterload(settings)
    //
    //
    // // ======================================================================
    // // RE-ALIGN DOMs ACCORDING TO Z-INDEX
    // // ======================================================================
    //
    // ZIndexManager.refreshAllSvg()

  }


  // -----------------------------------
  //

  // setDataStore() {
  //   this.dataStore = {
  //     type: 'RECTANGLE',
  //     isStored: true,
  //     id: this.groupId,
  //     zIndex: this.group.dataset.zIndex,
  //     svg_id: this.svgDomStop.id,
  //     x: parseInt(this.svgDomStop.getAttribute('x')),
  //     y: parseInt(this.svgDomStop.getAttribute('y')),
  //     width: parseInt(this.svgDomStop.getAttribute('width')),
  //     height: parseInt(this.svgDomStop.getAttribute('height')),
  //     fill: this.svgDomStop.getAttribute('fill'),
  //     opacity: parseFloat(this.svgDomStop.style.opacity)
  //   }
  // }
  //
  // preload(settings) {
  //   //-// console.log(` (LOCAL STORAGE) PRELOADING ->   ${settings.id}`)
  //   // OVERLOADING REQUIRED MEMBERS
  //   this.groupId = settings.id
  // }
  //
  // afterload(settings) {
  //   //-// console.log(` (LOCAL STORAGE) AFTERLOADING ->   ${settings.id}`)
  //   // RE-SETTING REQUIRED OBJECTS
  //   this.group.dataset.zIndex = settings.zIndex
  //   this.svgDomStop.setAttribute("id", settings.id + '_rect')
  //   this.svgDomStop.setAttribute("x", settings.x)
  //   this.svgDomStop.setAttribute("y", settings.y)
  //   this.svgDomStop.setAttribute("width", settings.width)
  //   this.svgDomStop.setAttribute("height", settings.height)
  //   this.svgDomStop.setAttribute("fill", settings.fill)
  //   this.svgDomStop.style.opacity = parseFloat(settings.opacity)
  // }


  remove() {
    // REMOVE EVENT LISTENER
    this.svgDomPlay.removeEventListener("click", this.clickPlayHnd, false)
    this.svgDomPlay.removeEventListener("mouseenter", this.enterPlayHnd, false)
    this.svgDomPlay.removeEventListener("mouseleave", this.leavePlayHnd, false)

    this.svgDomStop.removeEventListener("click", this.clickStopHnd, false)
    this.svgDomStop.removeEventListener("mouseenter", this.enterStopHnd, false)
    this.svgDomStop.removeEventListener("mouseleave", this.leaveStopHnd, false)


    // DELETE DOM
    this.svgDomPlay.remove()
    this.svgDomStop.remove()
    this.group.remove()
    this.svgRoot.remove()
  }



  // -----------------------------------

  getGroupId() {
    return this.group.id
  }

  // RETURN ALL HTML DOM TO OUTSIDE
  getDomList() {

    let domlist = []

    // GETTING DOMs FROM HANDLES
    //domlist = this.handles.A.getDomList().concat(this.handles.B.getDomList()).concat(this.handles.C.getDomList())

    domlist.push(this.svgDomStop)

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


export { ButtonToggle }
