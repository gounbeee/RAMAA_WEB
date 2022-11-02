'use strict'

import { Timeline } from "./Timeline.mjs"
import { Keyframe } from "./Keyframe.mjs"




class KeyframeManager {

  constructor(stateObj, currentObj){
    //-// console.log('%% KeyframeManager.mjs :: KeyframeManager CONSTRUCTOR EXECUTED')

    // TIMELINES WE ATTACHS TO ATTRIBUTES
    this.timelines = {}

    this.stateSingleton = stateObj
    this.currentObj = currentObj

  }


  createKeyframe(settings) {
    return new Keyframe({when:settings.when, value:settings.value})
  }


  setEventHandler(settings) {

    // -------------------------------------------------------------
    // SETTING EVENT LISTENER FOR REACTING TO MAIN TIMELINE

    this.mainTimeLineReact = (ev) => {

      //console.log(ev.detail)

      let maintimeline = ev.detail.time
      let maintimelinePercent = ev.detail.timePercent

      // IF THERE IS KEY-FRAMED ELEMENTS, ANIMATE THAT ATTRIBUTES
      //console.log(this.timelines[settings.targetId].getResult(maintimeline))

      // IF SETTING'S TARGET ID IS NOT INCLUDED IN TIMELINES, JUST RETURN
      if(!Object.keys(this.currentObj.timelines).includes(settings.targetId)) return


      let groupId = settings.targetId.split('_')[0]
      let id = groupId + '_' + settings.targetId.split('_')[1]
      let rawValue = this.timelines[settings.targetId].getResult(maintimeline)

      // -----------------------------------------------------------------
      // APPLYING VALUE TO CURRENT SVG OBJECT'S ATTRIBUTE
      let attrName = this.timelines[settings.targetId].attrName
      let attrArr = settings.targetId.split('_')

      // ----------------------------------------------------------------
      // < VALUE IDENTIFYING >
      let value

      // IF THE INCOMING VALUE IS COLOR...
      if(typeof rawValue.value !== 'number' && rawValue.value.includes('#')) {

        value = rawValue.value

      } else if( rawValue.attrName.includes('textContent')) {

        // IF THE INCOMING VALUE IS TEXT CONTENT...
        value = rawValue.value

      } else {

        // THE VALUE IS NUMERICAL
        // 1. DECIMALS
        if( value % 1 !== 0) {
          value = parseFloat(rawValue.value)
        } else {
          // 2. INTEGER
          value = parseInt(rawValue.value)
        }

      }


      // ================================================================
      //  < APPLYING ATTRIBUTE OF KEYFRAME >
      // ================================================================


      // IF INCOMING DATA IS FROM TEXTAREA, WE NEED
      // APPLY THAT VALUE TO FIRST <tspan> !! (ID: '_tspan_0')
      if(settings.targetId.split('_')[1] === 'textarea') {
        // ==============================================
        // FOR TEXTAREA
        // ==============================================

        // ------------------------------------------
        // < KEYFRAME ANIMATION :: TEXTAREA ALL ATTRIBUTES (POSITION, FILL) >

        // SETTING VALUE TO 'SVG OBJECT'
        let tspansList = document.getElementById(id).childNodes


        // GETTING TEXTAREA INFORMATION FROM DOM
        let fontSize = parseInt(document.getElementById(groupId).dataset.fontSize)
        let lineMargin = parseInt(document.getElementById(groupId).dataset.lineMargin)


        if(attrName.includes('textContent')) {
          // FOR TEXT CONTENT OF TEXTAREA

          // TODO :: NOTE BELOW !!!!
          // TO TRANSFORM TEXT CONTENT IN REALTIME,
          // WE USE DrawTextArea CLASS, SO WE THROW CUSTOM EVENT
          const evToDrawTextArea = new CustomEvent('update_textContent_timeline', {

            bubbles: true,
            detail: {
              text: value,
              fontSize: fontSize,
              lineMargin: lineMargin
            }

          })
          document.getElementById(groupId).dispatchEvent(evToDrawTextArea)



        } else {
          // FOR OTHER ATTRIBUTES OF TEXTAREA


          let translatePos = document.getElementById(groupId).getAttribute('transform')
          let translatePosArray = translatePos.split(',')
          const currentX = parseFloat(translatePosArray[0].match(/[\d\.]+/))
          const currentY = parseFloat(translatePosArray[1].match(/[\d\.]+/))

          let differPosition = {}

          // POSITION
          // TODO:: TAKE A NOTE !!!!
          // TRANSFORM ATTRIBUTE NEEDS 2-ATTRIBUTES(X,Y)
          // SO WE FIRST COLLECTED CURRENT POSITIONS
          // AND APPLY THE POSITION PARTIALLY
          // +
          // UPDATING OBJECT'S POSITION IS CRITICAL !
          if(attrName === 'x') {

            document.getElementById(groupId).setAttribute('transform', `translate(${value}, ${currentY})`)

            this.currentObj.textAreaObject.posX = value

          } else if(attrName === 'y') {

            document.getElementById(groupId).setAttribute('transform', `translate(${currentX}, ${value})`)

            this.currentObj.textAreaObject.posY = value
          }

          // FOR FILL AND OPACITY
          for(let i=0; i < tspansList.length; i++) {

            if(attrName === 'fill') {
              tspansList[i].setAttribute(
                attrName,
                value
              )
            } else if(attrName === 'opacity') {

              tspansList[i].style.opacity = value

            }
          }
        }


      } else if(settings.targetId.includes('arrow') && settings.targetId.includes('fill')) {
        // ==============================================
        // FOR ARROW + FILL
        // ==============================================

        // ------------------------------------------
        // < KEYFRAME ANIMATION :: ARROW FILL >

        //-// console.log(settings.targetId)
        // FOR COLOR DATA OF ARROW SHAPE, WE DO NOT NEED TO
        // ADJUST THE ID STRINGS LIKE BELOW

        // DOM ID FORMAT ::
        // 07546439-7ecf-472e-a9b4-03183c33fdeb_arrow

        // BELOW CONNECTION IS CRITICAL TO ANIMATE FILL
        if(settings.obj) {
          settings.obj.arrow.fill = value
          //-// console.log(`BEFORE APPLYING FILL  --  ${settings.obj.arrow.fill}`)
        }

        document.getElementById(id).setAttribute(
          attrName,
          value
        )


      } else if(settings.targetId.includes('arrow') && settings.targetId.includes('opacity')) {
        // ==============================================
        // FOR ARROW + OPACITY
        // ==============================================

        if(settings.obj) {
          settings.obj.arrow.opacity = value
          //-// console.log(`BEFORE APPLYING FILL  --  ${settings.obj.arrow.fill}`)
        }
        //-// console.log(value)
        document.getElementById(id).style.opacity = value


      } else if(settings.targetId.split('_')[1].includes('arrow')) {
        // ==============================================
        // FOR ARROW + HANDLE MOVEMENT
        // ==============================================

        // ------------------------------------------
        // < KEYFRAME ANIMATION :: ARROW MOVE >

        // IF INCOMING DATA IS ARROW SHAPE...
        // &&
        // "NOT" THE COLOR DATA(!)
        //
        //-// console.log(id)
        // 1bdd7634-a521-42be-bcd6-e8941b4d0dd3_arrowArect

        let splt = id.split('_')[1]                   // arrowArect
        let trimmed = splt.replace('arrow', '')       // Arect
        let hdlId = trimmed[0]                        // A
        let attrType = splt.substring(6, splt.length) // rect

        let attrTypeFinal
        switch(attrType) {
          case 'rect':
            attrTypeFinal = 'posRect'
            break
          case 'cir1':
            attrTypeFinal = 'rotCircle_A'
            attrName = 'c'+ attrName        // CIRCLE FOR ROTAION USES 'cx' AND 'cy'
            break
          case 'cir2':
            attrTypeFinal = 'rotCircle_B'
            attrName = 'c'+ attrName
            break
        }

        let resultId = groupId + '_' + hdlId + '_' + attrTypeFinal

        // TARGET ::
        // 1bdd7634-a521-42be-bcd6-e8941b4d0dd3_A_posRect

        //console.log(resultId)


        if(settings.obj) {

          // WE DO NOT STORE RELATIVE POSITION BETWEEN 'POSRECT' AND 'ROTAION CIRCLES'
          // SO NEEDED TO CALCULATE BELOW BEFORE APPLYING POSITIONS.
          // WITHOUT THIS, 'FROZEN' RELATIVE POSITIONS WILL
          // 'OVERWRITE' THE ROTATION CIRCLE'S POSITION
          // SO ROTATION CIRCLE'S ANIMATION WILL BE 'CANCELED'
          settings.obj.arrow.calRelPos_Handles()

          settings.obj.arrow.update({
            objName: attrType,
            attrName: attrName
          })

        }


        document.getElementById(resultId).setAttribute(
          attrName,
          value
        )


      } else if( ( settings.targetId.includes('rect') || settings.targetId.includes('ball') ) && settings.targetId.includes('opacity')) {
        // ==============================================
        // RECTANGEL OPACITY
        // ==============================================

        document.getElementById(id).style.opacity = value


      } else if( settings.targetId.includes('bitmap') && !settings.targetId.includes('opacity')) {

        let resultId = id.split('_')[0] + '_foreign'


        document.getElementById(resultId).setAttribute(
          attrName,
          value
        )


      } else if( settings.targetId.includes('bitmap') && settings.targetId.includes('opacity') ) {

        let resultId = id.split('_')[0] + '_foreign'

        document.getElementById(resultId).setAttribute(
          'style',
          `opacity:${value};`
        )


      } else {
        // ==============================================
        // OTHER ATTRIBUTES
        // ==============================================

        // ------------------------------------------
        // < KEYFRAME ANIMATION :: EVERY SHAPES MOVE (WITHOUT ARROW) >

        // SETTING VALUE TO 'SVG OBJECT'
        document.getElementById(id).setAttribute(
          attrName,
          value
        )
      }

      // -----------------------------------------------------------------
      // SETTING TIME VALUE TO TIME(%) INPUT ELEM IN 'ATTRIB BOX'
      // BY DISPATCHING EVENT
      let evToAttribBox = new CustomEvent('updateMainTime', {
        bubbles: true,
        detail: {
          timePercent: Math.floor(maintimelinePercent)
        }
      })
      ev.target.dispatchEvent(evToAttribBox)
    }

    //this.stateSingleton.timelineObj.svgDom.addEventListener('TIMELINE_MAIN', this.mainTimeLineReact, false)
    this.currentObj = settings.obj
    this.currentObj.group.addEventListener('TIMELINE_MAIN', this.mainTimeLineReact, false)

  }


  setTimeline(settings){
    this.timelines[settings.domId] = new Timeline({
      attrName: settings.attrName,
      time: parseInt(settings.time),
      keyframes: settings.keyframes,
      duration: settings.duration
    })

    return this.timelines
  }


  addKeyframe(settings) {
    this.timelines[settings.domId] = this.timelines[settings.domId].addKeyframe({
      keyframes: settings.keyframes
    })

    return this.timelines
  }



  remove() {
    this.currentObj.group.removeEventListener('TIMELINE_MAIN', this.mainTimeLineReact, false)
    this.timelines = {}


  }

}




export {KeyframeManager}
