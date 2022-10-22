'use strict'

import { SliderIndicator }      from "./SliderIndicator.mjs"
import { SvgFactory }           from "./SvgFactory.mjs"
import { DraggableScreen }      from "./DraggableScreen.mjs"
import { Marquee }              from "./Marquee.mjs"
import { Collision }          from "./Collision.mjs"



class AnimBox {

  constructor(selectedObj) {
    //-// console.log('%% AnimBox.mjs :: AnimBox CONSTRUCTOR EXECUTED')

    this.nsSvg = 'http://www.w3.org/2000/svg'

    this.selectedObj = selectedObj

    this.localTimeline = undefined

    this.timelineLocalWrapper  = document.getElementById('animManager_wrapper')

    this.domRoot = document.createElement('div')
    // https://stackoverflow.com/questions/16890292/why-nest-an-svg-element-inside-another-svg-element
    this.svgRoot = document.createElementNS(this.nsSvg, 'svg')

    this.domRoot.id = selectedObj.groupId + '_animBox'
    this.domRoot.classList.add('bl_animManager')
    this.domRoot.classList.add('ly_animManager')

    this.svgRoot.id = selectedObj.groupId + '_animBox_svg'
    this.svgRoot.setAttribute('width', '100%')
    this.svgRoot.setAttribute('height', '1000px')

    this.domRoot.appendChild(this.svgRoot)
    this.timelineLocalWrapper.appendChild(this.domRoot)

    this.currentShapeType = this.selectedObj.dataStore.type

    this.svgFactory = new SvgFactory()

    this.keyDeleteButton = document.createElement('button')
    this.keyDeleteButton.innerHTML = 'DELETE SELECTED KEYS'
    this.keyDeleteButton.classList.add('bl_animManager_delKeys_btn')
    this.keyDeleteButton.classList.add('ly_animManager_delKeys_btn')
    this.domRoot.prepend(this.keyDeleteButton)

    this.mainTimePercent = undefined
    this.mainTimeIndicator = undefined
    this.tl_observer = undefined


    // ---------------------------------------------------------
    // POSITION SETTINGS
    this.sliderLayout = {
      minX: 200,
      minY: 20,
      maxX: this.domRoot.offsetWidth - 100,
      maxY: 0,
      lineMargin: 50
    }

    this.indicatorSel = undefined
    this.indicatorAll = []
    this.dragSelIndicators = {}

    this.anchorPosX = 0
    this.anchorPosY = 0




    // ================================================================
    // MOUSE EVENT HANDLERS

    // FOR DRAGGING POINTER
    this.screenDrag = new DraggableScreen()

    this.mutationHandler = (mutationList, observer) => {
      for(const mutation of mutationList) {
        if( mutation.type === 'attributes' ) {
          //-// console.log(`${mutation.target.id} :::   ${mutation.attributeName}   WAS MODIFIED`)

          //-// console.log(observer)
          if(mutation.attributeName === 'data-x-pos') {

            // 1. GETTING VALUE FROM TEMP-SCREEN-DOM
            let targetX = mutation.target.getAttribute(mutation.attributeName)

            // 2. SETTING COORDINATE AND CURSOR POSITION
            const mappedPosition = this.screenPointToDivPoint(mutation.target, this.svgRoot, targetX, undefined)

            // 3. CALCULATING DIFFERENCE FROM ANCHOR
            let resultX = mappedPosition.x - this.anchorPosX

            //-// console.log(`DRAGGIN OBJECT ID ::   ${mutation.target.id}    ----    POSITION X ::   ${resultX}`)

            // --------------------------------------------------------------------
            // < APPLYING VALUE >
            //
            // ======================================================================
            // = CASE 1. USING MARQUEE TOOL
            let newPercentageObj = {}
            if(Object.keys(this.dragSelIndicators).length > 0) {

              // 4 CALCULATING DIFFERENCE BETWEEN SELECTED-ANCHOR INDICATOR
              let anchorVal = parseFloat(this.indicatorSel.getAttribute('x'))
              let differValObj = {}
              for(let indName in this.dragSelIndicators) {
                differValObj[indName] = {
                  differVal: parseFloat(this.dragSelIndicators[indName].elems.getAttribute('x')) - anchorVal
                }
              }
              //-// console.log(`differValObj ::    ${differValObj}`)

              for(let indName in this.dragSelIndicators) {

                // 5. APPLY POSITION TO THAT INDICATOR :: ANIMATING
                let newValue = resultX + differValObj[indName].differVal


                // 6. SETTING CONSTRAINT (OPTIONAL)
                if(newValue < this.sliderLayout.minX ) {
                  newValue = this.sliderLayout.minX
                } else if( newValue > this.sliderLayout.maxX) {
                  newValue = this.sliderLayout.maxX
                }

                this.dragSelIndicators[indName].elems.setAttribute("x", newValue)

                // 7. CALCULATING NEW TIME VALUE TO KEYFRAME
                newPercentageObj[indName] = (newValue - this.sliderLayout.minX) / (this.sliderLayout.maxX - this.sliderLayout.minX) * 100.0

              }

              // ========================================================
              // WRITE NEW VALUE
              //-// console.log(newPercentageObj)
              for(let indName in newPercentageObj) {
                // 7. APPLYING VALUE TO SHAPES
                this.applyPercentageToShapes(indName, newPercentageObj[indName])
              }

            } else {

              // ======================================================================
              // = CASE 2. USING DIRECT DRAGGING

              // 4. SETTING CONSTRAINT (OPTIONAL)
              if(mappedPosition.x < this.sliderLayout.minX ) {
                mappedPosition.x = this.sliderLayout.minX
                resultX = this.sliderLayout.minX
              } else if( mappedPosition.x > this.sliderLayout.maxX) {
                mappedPosition.x = this.sliderLayout.maxX
                resultX = this.sliderLayout.maxX
              }
              //-// console.log(`this.sliderLayout.minX ::   ${this.sliderLayout.minX}     ----  this.sliderLayout.maxX ::   ${this.sliderLayout.maxX}`)
              //-// console.log(`DRAGGIN OBJECT ID ::   ${mutation.target.id}    ----    POSITION X ::   ${resultX}`)            
              //-// console.log(this.indicatorSel)

              // 5. CALCULATING NEW TIME VALUE TO KEYFRAME
              // < APPLYING VALUE >
              this.indicatorSel.setAttribute("x", resultX)

              // 6. CALCULATING NEW TIME VALUE TO KEYFRAME
              const newPercentage = (resultX - this.sliderLayout.minX) / (this.sliderLayout.maxX - this.sliderLayout.minX) * 100.0

              // 7. APPLYING VALUE TO SHAPES
              this.applyPercentageToShapes(this.indicatorSel.id, newPercentage)
            }
          }
        }
      }
    }




    // =============================================
    // MARQUEE SETTINGS
    // MUST BE HERE WHERE WE DEFINED this.indicatorAll 
    const marqueeSettings = {
      rootDom: this.domRoot,
      rootSvg: this.svgRoot,
    }
    this.marquee = new Marquee(marqueeSettings)



    // ----------------------------------------------------------------------
    // EVENT HANDLING FOR MOUSE

    // MOUSE DOWN EVENT
    this.pointerEvHnd_md = (ev) => {
      //-// console.log(`MOUSE DOWN !!!! ----     ${ev.target}   ----   ${ev.target.id}`)

      this.indicatorSel = ev.target
      this.pointerEvLsn_mu()


      this.screenDrag.setScreen({
        dragObj: ev.target,
        mutationHandler: this.mutationHandler
      })

      const mappedPosition = this.screenPointToDivPoint(this.svgRoot, 
                                                        this.indicatorSel, 
                                                        ev.clientX, 
                                                        ev.clientY)

      this.anchorPosX = Math.floor(mappedPosition.x)
      this.anchorPosY = Math.floor(mappedPosition.y)

      //-// console.log(`ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)

      // **** DISABLING MARQUEE DRAGGING
      // WHEN WE CLICKED INDICATOR, MARQUEE FUNCTIONALITY SHOULD BE DISABLED
      this.marquee.marqueeGate = true

      ev.preventDefault()
    }


    // MOUSE UP EVENT
    this.pointerEvHnd_mu = (ev) => {
      //-// console.log('CONTROLLER RESETTED')
      this.marquee.marqueeGate = false            // **** THIS GATE IS IMPORTANT
    }

    this.pointerEvLsn_mu = () => {
      this.indicatorSel.addEventListener('mouseleave', this.pointerEvHnd_mu )
      this.indicatorSel.addEventListener('mouseup', this.pointerEvHnd_mu )
    }

    this.pointerEvLsn_mu_rem = () => {
      // AFTER WE DEFINED BELOW 'TWO' LISTENERS, 'STICKING TO CURSOR PROBLEM' WAS SOLVED !
      // **** IF THERE ARE NO KEYFRAMES, this.indicatorSel WILL BE undefined
      //
      if(this.indicatorSel) {
        this.indicatorSel.removeEventListener('mouseleave', this.pointerEvHnd_mu)
        this.indicatorSel.removeEventListener('mouseup', this.pointerEvHnd_mu)
      }
    }


    // ===================================================================================
    // GETTING ALL KEYFRAMES FROM THE SELECTED OBJECT
    this.keyFramesAll = this.getKeyFramesAll(this.selectedObj)
    this.keySlidersAll = {}
    
    this.settingAllTimelines()






    // =============================================
    // COLLISION SETTINGS
    // MUST BE HERE WHERE WE DEFINED this.indicatorAll 
    const collisionSettings = {
      // rootDom: this.domRoot,
      // rootSvg: this.svgRoot,
      // selectArea: this.marquee.marqRect,
      // toBeSelected: this.indicatorAll
      area: this
    }
    this.collision = new Collision(collisionSettings)


    // ===========================================================
    // RECEIVING COLLIDED INDICATORS FROM Collision OBJECT
    // < EVENT FORMAT >
    // const evToAnimBox = new CustomEvent('KeyframesCollided', {
    //   bubbles: true,
    //   detail: {
    //     collided: this.bboxIDCollided
    //   }
    // })
    this.collidedIndicatorHandler = (ev) => {

      // TODO :: SAVE BELOW FOR DEBUG
      //-// console.log(ev.detail.collided)

      // 0. STORE DRAG-SELECTED INDICATORS
      this.dragSelIndicators = ev.detail.collided

      // 1. CREATE STROKE TO SELECTED INDICATORS
      // IF THERE IS NO INDICATORS SELECTED,
      // UN-STROKE THEM
      // //-// console.log(Object.keys(this.dragSelIndicators).length)
      if(Object.keys(this.dragSelIndicators).length === 0) {
        this.indicatorStroke(false)
      } else {
        this.indicatorStroke(true)
      }
    }
    this.svgRoot.addEventListener('KeyframesCollided', this.collidedIndicatorHandler, false)


    // =====================================================================================
    // DELETE KEY SETTING

    this.deleteSelectedKeys = (ev) => {

      if(Object.keys(this.dragSelIndicators).length > 0) {

        //-// console.log(`@@@@== DELETE MULTIPLE KEYS ==@@@@`)

        // 0. PREPARING LOCAL STORAGES (ANIM + ATTRBOX)
        let str = localStorage
        let attrStorageData = JSON.parse(str[this.selectedObj.groupId + '_attrbox'])
        let animStorageData = JSON.parse(str[this.selectedObj.groupId + '_anim'])

        for(let indName in this.dragSelIndicators) {

          // ---------------------------------------------------------------------
          //-// console.log(this.dragSelIndicators)
          //
          // {  59e1e7c1-6d14-450f-928c-daab429700b9_rect_opacity_0: {…}}
          //    59e1e7c1-6d14-450f-928c-daab429700b9_rect_opacity_0:
          //      elems: rect#59e1e7c1-6d14-450f-928c-daab429700b9_rect_opacity_0
          //      id: "59e1e7c1-6d14-450f-928c-daab429700b9_rect_opacity_0"
          //
          // {  eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_0: {…}, eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_y_0: {…}}
          //    eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_0: 
          //      {id: 'eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_0', 
          //       elems: rect#eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_0}
          
          // ---------------------------------------------------------------------
          //-// console.log(this.keyFramesAll)
          // {opacity: Array(1), fill: Array(1)}
          //   fill: Array(1)
          //          0: {when: '0', value: '#667ee1'}
          //
          // {rectAx: {…}, rectAy: {…}, cir1Ax: {…}, cir1Ay: {…}, cir2Ax: {…}, …}
          //

          // ---------------------------------------------------------------------
          //-// console.log(this.indicatorAll)
          // [  rect#59e1e7c1-6d14-450f-928c-daab429700b9_rect_opacity_0, 
          //    rect#59e1e7c1-6d14-450f-928c-daab429700b9_rect_fill_0     ]
          //
          // [  rect#eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_0, 
          //    rect#eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_1, ...

          // ---------------------------------------------------------------------
          // < DELETE OBJECT BY delete operator > 
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
          // :: delete <OBJNAME>.<KEYNAME>;


          // ---------------------------------------------------------------------
          // **** EVERY keyframes 'ARRAY' SHOULD BE CONVERTED TO 'OBJECT'
          //      < WE CAN NOT 'SPLICE' WITH INDEX NUMBER !!!! >


          // DELETE KEYFRAMES FROM 
          this.deleteKeyframes(indName, attrStorageData, animStorageData)

        }

        // DELETING NULLS IN EVERY KEYFRAME CONTAINERS
        for(let indName in this.dragSelIndicators) {
          if(!indName.includes('arrow')) {
            this.clearNulls(indName, attrStorageData, animStorageData)
          } else {
            this.clearNullsArrow(indName, attrStorageData, animStorageData)
          }
        }

        // 5. DELETE SLOT IF THERE IS NO KEYFRAMES
        for(let indName in this.dragSelIndicators) {
          if(!indName.includes('arrow')) {
            this.clearEmptySlots(indName, attrStorageData, animStorageData)
          } else {
            this.clearEmptySlotsArrow(indName, attrStorageData, animStorageData)
          }
        }



        // //-// console.log('===================== RESULT ====================')

        // //-// console.log('< this.selectedObj >')
        // //-// console.log(this.selectedObj)         // ***+

        // //-// console.log('< this.keyFramesAll >')
        // //-// console.log(this.keyFramesAll)        // ***+

        // //-// console.log('< this.indicatorAll >')
        // //-// console.log(this.indicatorAll)

        // //-// console.log('< attrStorageData >')
        // //-// console.log(attrStorageData)          // ***+

        // //-// console.log('< animStorageData >')
        // //-// console.log(animStorageData)

        // //-// console.log('< this.dragSelIndicators >')
        // //-// console.log(this.dragSelIndicators)

        // 4. APPLYING CHANGES TO LOCAL STORAGES
        str.setItem(this.selectedObj.groupId + '_anim', JSON.stringify(animStorageData))
        str.setItem(this.selectedObj.groupId + '_attrbox', JSON.stringify(attrStorageData))

      }
    }

    this.keyDeleteButton.addEventListener('click', this.deleteSelectedKeys, false)

    this.keyDeleteButton.addEventListener('mouseover', (ev) => {
      // WHEN WE USE DELETE BUTTON, WE SHOULD GATE SCREENDRAG + MARQUEE DRAGGING
      this.screenDrag.canSetScreen = false
      this.marquee.marqueeGate = true
      //-// console.log(`this.screenDrag.canSetScreen  IS NOW  ---   ${this.screenDrag.canSetScreen}`)
    })

    this.keyDeleteButton.addEventListener('mouseout', (ev) => {
      // WHEN WE USE DELETE BUTTON, WE SHOULD GATE SCREENDRAG + MARQUEE DRAGGING
      this.screenDrag.canSetScreen = true
      this.marquee.marqueeGate = false
      //-// console.log(`this.screenDrag.canSetScreen  IS NOW  ---   ${this.screenDrag.canSetScreen}`)
    })

  }



  drawMainTimeline(layOut) {

    this.mainTimeIndicator = this.svgFactory.createSvgDomLine({
      target: this.svgRoot,
      id: 'ANIMBOX_MAINTIME',
      pointA: {
        posX: layOut.minX,
        posY: 0
      },
      pointB: {
        posX: layOut.minX,
        posY: layOut.minY + this.svgRoot.clientHeight
      },
      lineColor: "#FF1111",
      lineWidth: "2px"
    })

    const timelineObj = document.getElementById('Timeline_main_pointer')


    const monitorTimeline = (mutationsList, observer) => {

      for(const mutation of mutationsList) {

        if( mutation.type === 'attributes' && mutation) {
          //-// console.log(`${mutation.attributeName}   WAS MODIFIED`)
          //-// console.log(`${mutation.target.id}   WAS MODIFIED`)
          //-// console.log(`${mutation.target.getAttribute(mutation.attributeName)}   WAS MODIFIED`)

          // DISPATCH EVENT WHICH CONTAINS VALUE OF MAIN TIMELINE
          let timelineX = mutation.target.getAttribute(mutation.attributeName)
          let maximumVal = parseFloat(document.getElementById('Timeline_main').dataset.sliderLength)
          let timeVal = timelineX / maximumVal * parseFloat(document.getElementById('Timeline_main').dataset.timeDuration)
          let timelinePercent = timelineX / maximumVal * 100.0

          //-// console.log(timelinePercent)
          const animBoxStartPosX = layOut.minX
          const animBoxSliderLength = layOut.maxX - layOut.minX

          const newPositionX = animBoxStartPosX + animBoxSliderLength * timelinePercent / 100.0

          this.mainTimeIndicator.setAttribute('x1', newPositionX)
          this.mainTimeIndicator.setAttribute('x2', newPositionX)
        }
      }
    }

    const tl_observeConfig = {
      attributes: true,
      subtree: false
    }


    this.tl_observer = new MutationObserver(monitorTimeline)
    this.tl_observer.observe(timelineObj, tl_observeConfig)



 
  }





  clearEmptySlotsArrow(indName, attrStorageData, animStorageData) {

    for(let tmName in this.selectedObj.timelines) {
      if(this.selectedObj.timelines[tmName].keyframes.length === 0) {
        delete this.selectedObj.timelines[tmName]
      }
    }

    for(let attrName in this.keyFramesAll) {
      if(this.keyFramesAll[attrName].length === 0) {
        delete this.keyFramesAll[attrName]
      }
    }

    for(let hndId in attrStorageData) {
      for(let attrName in attrStorageData[hndId]) {
        if(attrStorageData[hndId][attrName].length === 0) {
          delete attrStorageData[hndId][attrName]
        }
      }
    }

    for(let tmName in animStorageData) {
      if(tmName !== 'id' && tmName !== 'isStored') {
        if(animStorageData[tmName].keyframes.length === 0) {
          delete animStorageData[tmName]
        }
      }
    }

  }



  clearEmptySlots(indName, attrStorageData, animStorageData) {

    for(let tmName in this.selectedObj.timelines) {
      if(this.selectedObj.timelines[tmName].keyframes.length === 0) {
        delete this.selectedObj.timelines[tmName]
      }
    }

    for(let attrName in this.keyFramesAll) {
      if(this.keyFramesAll[attrName].length === 0) {
        delete this.keyFramesAll[attrName]
      }
    }

    for(let attrName in attrStorageData) {
      if(attrStorageData[attrName].length === 0) {
        delete attrStorageData[attrName]
      }
    }

    for(let tmName in animStorageData) {
      if(tmName !== 'id' && tmName !== 'isStored') {
        if(animStorageData[tmName].keyframes.length === 0) {
          delete animStorageData[tmName]
        }
      }
    }

  }




  clearNullsArrow(indName, attrStorageData, animStorageData) {

    for(let hndId in this.keyFramesAll) {

      // FOR ARROW'S FILL AND OPACITY ATTRIBUTES 
      if(hndId === 'fill' || hndId === 'opacity') {
        for(let i=0; i < this.keyFramesAll[hndId].length; i++) {
          if(this.keyFramesAll[hndId][i] === null) {
            this.keyFramesAll[hndId].splice(i, 1)
          }
        }
      } else {
        // FOR HANDLE'S ATTRIBUTES
        for(let attrName in this.keyFramesAll[hndId]) {
          for(let i=0; i < this.keyFramesAll[hndId][attrName].length; i++) {
            if(this.keyFramesAll[hndId][attrName][i] === null) {
              this.keyFramesAll[hndId][attrName].splice(i, 1)
            }
          }
        }
      }
    }

    for(let hndId in attrStorageData) {

      // FOR ARROW'S FILL AND OPACITY ATTRIBUTES 
      if(hndId === 'fill' || hndId === 'opacity') {
        for(let i=0; i < attrStorageData[hndId].length; i++) {
          if(attrStorageData[hndId][i] === null) {
            attrStorageData[hndId].splice(i, 1)
          }
        }
      } else {
        // FOR HANDLE'S ATTRIBUTES
        for(let attrName in attrStorageData[hndId]) {
          for(let i=0; i < attrStorageData[hndId][attrName].length; i++) {
            if(attrStorageData[hndId][attrName][i] === null) {
              attrStorageData[hndId][attrName].splice(i, 1)
            }
          }
        }
      }
    }


    for(let timelineName in animStorageData) {
      // **** FOR ANIM-LOCAL-STORAGE, WE HAVE ADDITIONAL KEYS
      if(timelineName !== 'id' && timelineName !== 'isStored') {
        for(let i=0; i < animStorageData[timelineName].keyframes.length; i++) {
          if(animStorageData[timelineName].keyframes[i] === null) {
            animStorageData[timelineName].keyframes.splice(i, 1)
          }
        }
      }
    }



    for(let timelineName in this.selectedObj.timelines) {
      for(let i=0; i < this.selectedObj.timelines[timelineName].keyframes.length; i++) {
        if(this.selectedObj.timelines[timelineName].keyframes[i] === null) {
          this.selectedObj.timelines[timelineName].keyframes.splice(i, 1)
        }
      }
    }

    for(let timelineName in this.selectedObj.keyframeManager.timelines) {
      for(let i=0; i < this.selectedObj.keyframeManager.timelines[timelineName].keyframes.length; i++) {
        if(this.selectedObj.keyframeManager.timelines[timelineName].keyframes[i] === null) {
          this.selectedObj.keyframeManager.timelines[timelineName].keyframes.splice(i, 1)
        }
      }
    }


    for(let i=0; i < this.indicatorAll.length; i++) {
      if(this.indicatorAll[i] === null) {
        this.indicatorAll.splice(i, 1)
      }
    }

  }





  clearNulls(indName, attrStorageData, animStorageData) {


    for(let attrName in this.keyFramesAll) {
      for(let i=0; i < this.keyFramesAll[attrName].length; i++) {
        if(this.keyFramesAll[attrName][i] === null) {
          this.keyFramesAll[attrName].splice(i, 1)
        }
      }
    }

    for(let attrName in attrStorageData) {
      for(let i=0; i < attrStorageData[attrName].length; i++) {
        if(attrStorageData[attrName][i] === null) {
          attrStorageData[attrName].splice(i, 1)
        }
      }
    }

    for(let timelineName in animStorageData) {
      // **** FOR ANIM-LOCAL-STORAGE, WE HAVE ADDITIONAL KEYS
      if(timelineName !== 'id' && timelineName !== 'isStored') {
        for(let i=0; i < animStorageData[timelineName].keyframes.length; i++) {
          if(animStorageData[timelineName].keyframes[i] === null) {
            animStorageData[timelineName].keyframes.splice(i, 1)
          }
        }
      }
    }

    for(let timelineName in this.selectedObj.timelines) {
      for(let i=0; i < this.selectedObj.timelines[timelineName].keyframes.length; i++) {
        if(this.selectedObj.timelines[timelineName].keyframes[i] === null) {
          this.selectedObj.timelines[timelineName].keyframes.splice(i, 1)
        }
      }
    }

    for(let timelineName in this.selectedObj.keyframeManager.timelines) {
      for(let i=0; i < this.selectedObj.keyframeManager.timelines[timelineName].keyframes.length; i++) {
        if(this.selectedObj.keyframeManager.timelines[timelineName].keyframes[i] === null) {
          this.selectedObj.keyframeManager.timelines[timelineName].keyframes.splice(i, 1)
        }
      }
    }


    for(let i=0; i < this.indicatorAll.length; i++) {
      if(this.indicatorAll[i] === null) {
        this.indicatorAll.splice(i, 1)
      }
    }

  }



  deleteKeyframes(indName, attrStorageData, animStorageData) {

    // 1. DELETE KEYFRAMES FROM  this.keyFramesAll   USING this.dragSelIndicators 
    // +
    // 2. DELETE KEYFRAME FROM LOCAL STORAGES (ANIM + ATTRBOX)
    // +
    // 3. DELETE CURRENT TIMELINE DATA FROM OBJECT ITSELF
    const groupId = indName.split('_')[0]

    // FOR ARROW SHAPE
    let attrName
    let keyIndex
    let timelineName
      
    if( indName.split('_')[1].includes('arrow')) {
      // FOR ARROW SHAPE, attrName SHOULD BE LIKE 'rectAx'
      let hndIdRaw = indName.split('_')[1]
      let hndIndex = hndIdRaw.slice(5,6)                          // A,B OR C
      let shapeType = hndIdRaw.slice(6)                           // rect
      let attr = indName.split('_')[2]                            // x, y
      keyIndex = parseInt(indName.split('_')[3])                  // 0, 1, 2 ... 

      // CONSTRUCT KEYNAME FOR ATTIBBOX STORAGE
      attrName = shapeType + hndIndex + attr                      // rectAx
      timelineName = groupId + '_' + hndIdRaw + '_' + attr

      // < SPLICE ARRAY TO REMOVE THE ITEM >
      // https://love2dev.com/blog/javascript-remove-from-array/

      if(attr === 'fill' || attr === 'opacity') {
        // FOR FILL AND OPACITY ATTRIBUTES

        // **** WE CANNOT SPLICE WITH INDEX NUMBER SIMPLY,
        //      BECAUSE IN AN ARRAY, DELETING ELEMENT 'SHIFTS' THE INDEX NUMBER
        //      SO WE FILL 'NULL' FIRST, THEN CLEAR UP AFTER 

        this.keyFramesAll[attr][keyIndex] = null
        attrStorageData[attr][keyIndex] = null
        animStorageData[timelineName].keyframes[keyIndex] = null       
        this.selectedObj.timelines[timelineName].keyframes[keyIndex] = null     
        this.selectedObj.keyframeManager.timelines[timelineName].keyframes[keyIndex] = null

        //-// console.log(this.selectedObj)


      } else {
        // FOR OTHER ATTRIBUTES

        this.keyFramesAll[attrName][attr][keyIndex] = null   
        attrStorageData[attrName][attr][keyIndex] = null               
        animStorageData[timelineName].keyframes[keyIndex] = null      
        this.selectedObj.timelines[timelineName].keyframes[keyIndex] = null     
        this.selectedObj.keyframeManager.timelines[timelineName].keyframes[keyIndex] = null    
        //-// console.log(this.selectedObj)

      }

    } else {
      // FOR OTHER SHAPES
      
      let shapeType = indName.split('_')[1]                             // x, y
      attrName = indName.split('_')[2]                                  // x, y
      keyIndex = parseInt(indName.split('_')[3])                        // 0, 1, 2 ... 
      timelineName = groupId + '_' + shapeType + '_' + attrName

      this.keyFramesAll[attrName][keyIndex] = null  
      attrStorageData[attrName][keyIndex] = null                     
      animStorageData[timelineName].keyframes[keyIndex] = null       
      this.selectedObj.timelines[timelineName].keyframes[keyIndex] = null      
      this.selectedObj.keyframeManager.timelines[timelineName].keyframes[keyIndex] = null       
      //-// console.log(this.selectedObj)


    }



    // 4. DELETE DOM FROM this.indicatorAll
    for(let i=0; i < this.indicatorAll.length; i++) {
      if(this.indicatorAll[i] !== null && indName === this.indicatorAll[i].id) {
        
        this.indicatorAll[i].remove()
        this.indicatorAll[i] = null

      }
    }


  }









  applyPercentageToShapes(indicatorId, newPercent) {

    //-// console.log(this.indicatorSel.id)
    // this.indicatorSel.id
    // eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_0
    // eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_1
    // eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_y_0
    // eef94cfa-34c9-4af0-924b-956f25065fae_arrow_fill_0
    // eef94cfa-34c9-4af0-924b-956f25065fae_arrow_opacity_2
    // 59e1e7c1-6d14-450f-928c-daab429700b9_rect_opacity_0
    // 56c842be-00c2-4d95-892f-73b96ec54911_ball_cx_0

    const idSplitted = indicatorId.split('_')
    const groupId = idSplitted[0]
    const shapeType = idSplitted[1]
    const attrName = idSplitted[2]
    const keyIndex = idSplitted[3]

    const groupDom = document.getElementById(groupId)

    const updateKeyTimeSettings = {
      bubbles: true,
      detail: {
        groupId: groupId,
        shapeType: shapeType,
        attrName: attrName,
        keyIndex: keyIndex,
        percentage: newPercent

      }
    }
    const evToShape = new CustomEvent('update_keyframe_time', updateKeyTimeSettings)

    groupDom.dispatchEvent(evToShape)


  }




  settingAllTimelines() {

    let sliderCount = 0

    // FOR ALL ANIMATION KEYFRAMES
    for(let attrName in this.keyFramesAll) {

      // ================================================================
      // DRAW LINES
      this.svgFactory.createSvgDomLine({
        target: this.svgRoot,
        id: this.selectedObj.groupId + '_animbox' + '_line_' + attrName,
        pointA: {
          posX: this.sliderLayout.minX,
          posY: this.sliderLayout.minY + this.sliderLayout.lineMargin * sliderCount
        },
        pointB: {
          posX: this.sliderLayout.maxX,
          posY: this.sliderLayout.minY + this.sliderLayout.lineMargin * sliderCount
        },
        lineColor: "#AAAAAA",
        lineWidth: "3px"
      })


      // ================================================================
      // DRAW TITLE
      let title = document.createElementNS(this.nsSvg, 'text')
      title.textContent = attrName
      title.id = this.selectedObj.groupId + '_animbox' + '_title_' + attrName
      //title.setAttribute('textLength', 80)
      title.style.fontSize = "18px"
      title.setAttribute('fill', "#ffffff")
      title.setAttribute('x', "10px")
      title.setAttribute('y', `${this.sliderLayout.minY + this.sliderLayout.lineMargin * sliderCount + parseInt(title.style.fontSize)/2 }px`)
      
      // title.setAttribute('width', '100%')
      title.setAttribute('height', 100)
      //title.classList.add('svg', 'animboxTitle')
      this.svgRoot.appendChild(title)



      // ================================================================
      // DRAW KEYFRAMES
      switch(this.currentShapeType) {
        case 'ARROW':
          // FOR ARROW SHAPE, WE NEED TO GO INTO THE KEYNAME 
          // **** IF THE attrName IS NOT 'FILL' OR 'OPACITY'
          if( attrName === 'fill' || attrName === 'opacity') {
            if(Object.keys(this.keyFramesAll[attrName]).length > 0) {
              this.drawKeyframes('arrow', this.selectedObj.groupId, this.keyFramesAll[attrName], this.sliderLayout, attrName, sliderCount)
            }
          } else {
            const posAttr = attrName[attrName.length-1]

            if(Object.keys(this.keyFramesAll[attrName]).length > 0) {
              this.drawKeyframes('arrow', this.selectedObj.groupId, this.keyFramesAll[attrName][posAttr], this.sliderLayout, attrName, sliderCount)
            }
          }
        break
        case 'RECTANGLE':
          if(Object.keys(this.keyFramesAll[attrName]).length > 0) {
            this.drawKeyframes('rect', this.selectedObj.groupId, this.keyFramesAll[attrName], this.sliderLayout, attrName, sliderCount)
          }
        break
        case 'BITMAP':
          if(Object.keys(this.keyFramesAll[attrName]).length > 0) {
            this.drawKeyframes('bitmap', this.selectedObj.groupId, this.keyFramesAll[attrName], this.sliderLayout, attrName, sliderCount)
          }
        break
        case 'TEXTAREA':
          if(Object.keys(this.keyFramesAll[attrName]).length > 0) {
            this.drawKeyframes('textarea', this.selectedObj.groupId, this.keyFramesAll[attrName], this.sliderLayout, attrName, sliderCount)
          }
        break
        case 'BALL':
          if(Object.keys(this.keyFramesAll[attrName]).length > 0) {
            this.drawKeyframes('ball', this.selectedObj.groupId, this.keyFramesAll[attrName], this.sliderLayout, attrName, sliderCount)
          }
        break
      }
      

      // ================================================================
      // SETTING MOUSE EVENT HANDLER

      //-// console.log(this.indicatorAll)

      // TURN ON EVENT HANDLERS TO MOUSEDOWN
      for(let indicator of this.indicatorAll) {
        indicator.addEventListener('mousedown', this.pointerEvHnd_md, false)
      }

      sliderCount++


    }


    // DRAWING MAIN TIMELINE INDICATOR
    this.drawMainTimeline(this.sliderLayout)


  }






  indicatorStroke(swtch) {
    switch(swtch) {

      case true:
        for(let indId in this.dragSelIndicators) {
          this.dragSelIndicators[indId].elems.setAttribute('stroke', '#FFffAB')
          this.dragSelIndicators[indId].elems.setAttribute('stroke-width', 1)
          this.dragSelIndicators[indId].elems.setAttribute('linejoin-width', 'miter')
        }
      break

      case false:
        for(let indicator of this.indicatorAll) {               // ** HERE WE ARE USING DIFFERENT CONTAINER
          indicator.setAttribute('stroke-width', 0)
        }
      break

    }

  }





  drawKeyframes(shapeType, groupId, keyArray, layout, attrName, lineCounter) {



    // INPUT attrName IS LIKE, "rectAx", "opacity", "x"...
    // INDEX NUMBER = KEY FRAME INDEX
    for(let i=0; i < keyArray.length; i++) {

      // CALCULATING POSITION FROM PERCENTAGE VALUE OF KEYFRAME
      const key = keyArray[i]
      const when = parseInt(key.when)
      const length = layout.maxX - layout.minX
      const whenPixel = length * when / 100
        
      const pointerWid = 4
      const pointerHgt = 24

      // < ID MAKING >
      // FOR ARROW'S POSITION
      // WE NEED ID NAME LIKE,
      // bf8c86a0-32b6-483a-a5fe-21f48d8a3370_arrowArect_x (TIMELINE NAME WE ARE USING)
      // bf8c86a0-32b6-483a-a5fe-21f48d8a3370_rect_fill


      const id = this.idMatchForUpdatingKey(shapeType, groupId, attrName, i)
      // ABOVE OUTPUTS:
      // eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_0
      // eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_x_1
      // eef94cfa-34c9-4af0-924b-956f25065fae_arrowArect_y_0
      // eef94cfa-34c9-4af0-924b-956f25065fae_arrow_fill_0
      // eef94cfa-34c9-4af0-924b-956f25065fae_arrow_opacity_2
      // 59e1e7c1-6d14-450f-928c-daab429700b9_rect_opacity_0
      // 56c842be-00c2-4d95-892f-73b96ec54911_ball_cx_0


      const newPointer = this.svgFactory.createSvgDomRectCentered({
        target: this.svgRoot,
        id: id,
        posX: layout.minX + whenPixel + pointerWid/2,
        posY: layout.minY + layout.lineMargin * lineCounter,
        width: pointerWid,
        height: pointerHgt,
        fill: "#668822"
      })

      this.indicatorAll.push(newPointer)

    }
  }



  idMatchForUpdatingKey(type, groupId, attrName, keyIndex) {
    let resultId

    // INPUT attrName IS LIKE, "rectAx", "opacity", "x"...
    switch(type) {
      case 'arrow':

        if( attrName === 'fill' || attrName === 'opacity') {
          resultId = groupId + '_' + type + '_' + attrName + '_' + keyIndex
        } else {
          // WE WANT LIKE "arrowArect_x"
          const handleShape = attrName.slice(0,4)         // rect, cir1, cir2 
          const handleIndex = attrName.slice(4,5)         // A,B OR C
          const handleAttr  = attrName.slice(5,6)         // x, y
          resultId = groupId + '_' + type + handleIndex + handleShape + '_' + handleAttr + '_' + keyIndex
        }
      break

      default:
        resultId = groupId + '_' + type + '_' + attrName + '_' + keyIndex
      break

    }

    return resultId

  }




  getKeyFramesAll(selectedObj) {

    // GETTING DATA FROM STORAGE
    const str = localStorage
    const storageData = JSON.parse(str[selectedObj.groupId + '_attrbox'])


    return storageData

  }






  remove() {
    this.tl_observer.disconnect()

    this.mainTimeIndicator.remove()
    this.marquee.remove()
    this.collision.remove()

    this.svgRoot.remove()
    this.domRoot.remove()
    this.svgFactory = undefined
    this.indicatorSel = undefined
    this.indicatorAll = []
    this.dragSelIndicators = {}

    this.anchorPosX = 0
    this.anchorPosY = 0
    this.startPos = 0
    this.lastPos = 0

    this.marquee = undefined
    this.collision = undefined


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

    // TODO :: TAKE NOTE BELOW
    // IN CURRENT SETUP, WE HAVE SVG ROOT ELEMENT AS 'WHOLE AREA' OF CANVAS,
    // THEN WE HAVE 'PARTIAL CANVAS AREA USING RECTANGLE SHAPE'
    // SO WE CAN ADJUST THE 0,0 POINT WITH SVG-ELEMENT'S VIEWBOX ATTRIBUTE

    // let rootSvg = this.groupSvg.parentElement
    // let viewBox = rootSvg.getAttribute('viewBox').split(' ')
    //
    // let adjustedX = viewBox[0]
    // let adjustedY = viewBox[1]



    const p = svg.createSVGPoint()
    p.x = x
    p.y = y

    const CTM = elem.getScreenCTM()

    return p.matrixTransform( CTM.inverse() )
  }


  mousePointToSVGPoint(event) {


    return this.screenPointToSVGPoint( this.target, event.target, event.clientX, event.clientY )

  }





}



export {AnimBox}
