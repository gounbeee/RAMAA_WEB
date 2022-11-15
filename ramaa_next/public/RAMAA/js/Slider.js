'use strict'

import {SvgFactory} from "./SvgFactory.js"
import {DraggableScreen} from "./DraggableScreen.js"



// SLIDER IS CONSTRUCTED WITH 1 LINE + 1 POINTER + n MARKERS
class Slider {


  constructor(setting) {
    //-// console.log('%% Slider.js :: Slider CONSTRUCTOR EXECUTED')

    this.pointerPercent = 0

    this.nsSvg = 'http://www.w3.org/2000/svg'

    // GETTING FACTORY FOR DRAWING SVG ELEMENT
    this.svgFactory = new SvgFactory().initialize()


    this.length = setting.length

    // TARGET ELEMENT TO APPENDCHILD
    this.target = setting.target

    // POSITION
    this.posX = setting.posX
    this.posY = setting.posY
    this.anchorPosX = 0
    this.anchorPosY = 0

    // DEEP COPY
    // https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/
    this.startPos = JSON.parse(JSON.stringify(setting.posX))
    this.lastPos = JSON.parse(JSON.stringify(setting.posX + this.length))
    //-// console.log(this.startPos)

    // LINE WIDTH
    this.lineWidth = setting.lineWidth

    // COLOR SETTING
    this.mainColor = setting.mainColor
    this.pointerColor = setting.pointerColor
    this.markerColor = setting.markerColor

    // FLAG CAN BE DRAG OR NOT
    this.canDrag = setting.canDrag

    // POINTER SIZE
    let pntWid = setting.pointerWid
    let pntHgt = setting.pointerHgt


    // FLAG TO USE POINTER RECT
    this.pointerOn = setting.pointerOn


    // CREATING 1 LINE
    this.mainLine = {
      svgDom: this.svgFactory.createSvgDomLine({
        id: setting.id + "_mainLine",
        target: setting.target,
        pointA: {
          posX: this.posX + pntWid/2,
          posY: this.posY
        },
        pointB: {
          posX: this.posX + this.length + pntWid/2,
          posY: this.posY
        },
        lineColor: this.mainColor,
        lineWidth: this.lineWidth
      }),
      id: setting.id + "_mainLine",
      target: setting.target,
      pointA: {
        posX: this.posX - pntWid/2,
        posY: this.posY
      },
      pointB: {
        posX: this.posX + this.length + pntWid/2,
        posY: this.posY
      },
      lineColor: this.mainColor,
      lineWidth: this.lineWidth
    }



    // 1 POINTER
    if(this.pointerOn) {
      this.pointer = {
        svgDom: this.svgFactory.createSvgDomRect({
          id: setting.id + "_pointer",
          target: setting.target,
          width: pntWid,
          height: pntHgt,
          posX: this.posX,
          posY: this.posY - pntHgt/2,
          fill: setting.pointerColor,
          percent: this.pointerPercent
          // // CALLBACK FOR UPDATING SVGDOM AND PROPERTY
          // setUpdatingValue: function(){
          //   //-// console.log("EVENT LISTERNER IS CREATING...")
          // }
        }),
        id: setting.id + "_pointer",
        target: setting.target,
        width: pntWid,
        height: pntHgt,
        posX: this.posX,
        posY: this.posY - pntHgt/2,
        fill: setting.pointerColor,
        percent: this.pointerPercent,
      }
    }




    // FUNCTION TO UPDATE SLIDER LENGTH
    this.updateLength = (newlength) => {
      // UPDATE CLASS MEMBER
      this.length = newlength

      // RE-SET MOUSE MOVE CONSTRAINT
      this.startPos = JSON.parse(JSON.stringify(setting.posX))
      this.lastPos = JSON.parse(JSON.stringify(setting.posX + this.length))

      // RE-DRAW
      this.mainLine.pointB.posX = this.posX + this.length + pntWid/2
      this.mainLine.svgDom.setAttribute('x2', this.posX + this.length + pntWid/2)

    }



    // ----------------------------------------------------------------------
    // SCREEN DRAGGING OBJECT
    // FOR DRAGGING POINTER
    this.screenDrag = new DraggableScreen()

    this.mutationHandler = (mutationList, observer) => {
      for(const mutation of mutationList) {
        if( mutation.type === 'attributes' ) {
          //-// console.log(`${mutation.target.id} :::   ${mutation.attributeName}   WAS MODIFIED`)

          //-// console.log(observer)
          if(mutation.attributeName === 'data-x-pos') {

            let targetX = mutation.target.getAttribute(mutation.attributeName)
            this.pointerDrag = this.pointer.svgDom

            const mappedPosition = this.screenPointToDivPoint(mutation.target, this.target, targetX, undefined)
            //-// console.log(mappedPosition)

            let resultX = mappedPosition.x - this.anchorPosX
        
            // SETTING CONSTRAINT
            if(mappedPosition.x <= this.startPos ) {
              mappedPosition.x = this.startPos
              resultX = this.startPos
            } else if( mappedPosition.x >= this.lastPos) {
              mappedPosition.x = this.lastPos
              resultX = this.lastPos
            }


            // APPLY POSITION
            this.pointerDrag.setAttribute("x", resultX)

            // CALCULTING PERCENT
            this.pointerPercent = this.calcPercentLocation({from: this.startPos,to:this.lastPos}, resultX)
            //-// console.log(this.pointerPercent)
            this.pointer.percent = this.pointerPercent

          }
        }
      }
    }



    // ----------------------------------------------------------------------


    // ----------------------------------------------------------------------
    // EVENT HANDLING FOR MOUSE

    this.pointerEvHnd_mu = (ev) => {
      //-// console.log('CONTROLLER RESETTED')
      this.pointerDrag = null
    }

    this.pointerEvLsn_mu = () => {
      // AFTER WE DEFINED BELOW 'TWO' LISTENERS, 'STICKING TO CURSOR PROBLEM' WAS SOLVED !
      this.pointer.svgDom.addEventListener('mouseleave', this.pointerEvHnd_mu )
      this.pointer.svgDom.addEventListener('mouseup', this.pointerEvHnd_mu )
    }

    this.pointerEvLsn_mu_rem = () => {
      this.pointer.svgDom.removeEventListener('mouseleave', this.pointerEvHnd_mu)
      this.pointer.svgDom.removeEventListener('mouseup', this.pointerEvHnd_mu)
    }




    // MOUSE DOWN EVENT
    this.pointerEvHnd_md = (ev) => {
      //-// console.log(`MOUSE DOWN !!!! ----     ${ev.target}   ----   ${ev.target.id}`)

      this.screenDrag.setScreen({
        dragObj: ev.target,
        mutationHandler: this.mutationHandler
      })

      const mappedPosition = this.screenPointToDivPoint(this.target, this.pointer.svgDom, ev.clientX, ev.clientY)

      this.anchorPosX = Math.floor(mappedPosition.x)
      this.anchorPosY = Math.floor(mappedPosition.y)

      //-// console.log(`ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)


      ev.preventDefault()
    }

    this.pointerEvLsn_md = () => {
      this.pointer.svgDom.addEventListener('mousedown', this.pointerEvHnd_md)
    }

    this.pointerEvLsn_md_rem = () => {
      this.pointer.svgDom.removeEventListener('mousedown', this.pointerEvHnd_md)
    }



    // SETTING VISIBILITY
    this.setAllVisibility(true)


    if(this.canDrag) this.turnOnEventHandlers()



 




  }




  // ========================================================
  // PUBLIC API


  // SETTING Observable TO MONITOR PERCENTAGE
  setObservable(obs) {

    this.percentObservable = obs

  }


  // RETURN ALL HTML DOM TO OUTSIDE
  getDomList() {

    let domlist = []

    domlist.push(this.mainLine.svgDom)
    domlist.push(this.pointer.svgDom)

    return domlist

  }


  getValue() {
    // CALCULATING PERCENTAGE LOCATION
    this.pointerPercent = this.calcPercentLocation({
      from: this.startPos,
      to: this.lastPos
    },
      this.posX
    )
    return this.pointerPercent
  }

  turnOnEventHandlers() {
    this.pointerEvLsn_mu()
    this.pointerEvLsn_md()
    //this.pointerEvLsn_mv()
  }


  turnOffEventHandlers() {
    this.pointerEvLsn_mu_rem()
    this.pointerEvLsn_md_rem()
    //this.pointerEvLsn_mv_rem()

  }




  // SETTING VISIBILITY
  // https://stackoverflow.com/questions/37943006/unable-to-change-class-name-of-svg-element
  //
  setAllVisibility(flag){
    let cssStyle = undefined

    if(flag === true) cssStyle = "visible"
    else cssStyle = "hidden"

    if(cssStyle && this.pointer) {
      this.pointer.svgDom.setAttribute('class', cssStyle)
    }


  }



  remove() {
    this.mainLine.svgDom.remove()
    if(this.pointer) this.pointer.svgDom.remove()
    this.mutationHandler = undefined

  }



  // ========================================================
  // PRIVATE USAGE



  calcPercentLocation(range, value) {
    let percent = ( (value - range.from) / (range.to - range.from) ) * 100

    return percent

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




export {Slider}
