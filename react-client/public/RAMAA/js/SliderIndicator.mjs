'use strict'


import {RMMath} from "./RMMath.mjs"
import {Slider} from "./Slider.mjs"
import { Security } from "./Security.mjs"
import {SvgFactory} from "./SvgFactory.mjs"
import {DraggableScreen} from "./DraggableScreen.mjs"

//
// THIS CLASS IS FOR timeline_local_wrapper !!!!
class SliderIndicator {

  constructor(settings) {
    //-// console.log('%% SliderIndicator.mjs :: SliderIndicator CONSTRUCTOR EXECUTED')

    this.svgId

    if(settings.id) this.svgId = settings.id
    else this.svgId = new Security().getUUIDv4()

    const rightSideMargin = 100

    // WIDTH IS 'PERCENT' FORMAT
    this.widthPercentage = parseInt(settings.width.replace('%'))
    this.width =  document.getElementById('footer_wrapper').offsetWidth * this.widthPercentage / 100.0


    this.target = settings.target            // HTML DOM WRAPPER ELEMENT
    this.height = settings.height
    this.posX = settings.posX
    this.posY = settings.posY
    this.lineWidth = settings.lineWidth
    this.pointerWid = settings.pointerWid
    this.pointerHgt = settings.pointerHgt
    this.anchorPosX = 0
    this.anchorPosY = 0
    this.sliderLength = this.width - rightSideMargin
    // DEEP COPY
    // https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/
    this.startPos = JSON.parse(JSON.stringify(settings.posX + settings.pointerWid/4))         // **** THIS IS FINE-TUNED
    this.lastPos = JSON.parse(JSON.stringify(settings.posX + this.sliderLength))


    // --------------------------------------------------------
    // CREATING SVG ROOT ELEMENT
    this.nsSvg = 'http://www.w3.org/2000/svg'
    this.svgDom = document.createElementNS(this.nsSvg, 'svg')
    this.svgDom.setAttribute("id", this.svgId)

    // SVG ROOT POSITION X AND Y
    this.svgDom.setAttribute("x", 0)
    this.svgDom.setAttribute("y", 0)

    this.svgDom.setAttribute("width", this.width)
    this.svgDom.setAttribute("height", this.height)
    // **** WE CAN PAN AND SCALE USING VIEWBOX'S PARAMETERS!!
    this.svgDom.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`)

    this.target.appendChild(this.svgDom)


    // -----------------------------------------------
    // INDICATORS
    // GETTING FACTORY FOR DRAWING SVG ELEMENT
    this.svgFactory = new SvgFactory().initialize()

    this.indicators = []
    this.indicatorSel = undefined
    this.indicatorPercents = []


    // -----------------------------------------------
    // MAIN SLIDER

    this.sliderSetting = {
      id: this.svgId,
      target: this.svgDom,                 // SLIDER SHOULD BE APPENDED UNDER SVG-ROOT
      length: this.sliderLength,
      posX: this.posX,
      posY: this.posY + this.height/2,
      lineWidth: this.lineWidth,
      pointerWid: settings.pointerWid,
      pointerHgt: settings.pointerHgt,
      mainColor: "#999999",
      pointerColor: "#66CC66",
      markerColor: "#6666CC",
      canDrag: false,
      pointerOn: settings.pointerOn
    }

    this.slider = new Slider(this.sliderSetting)




    this.sliderWindowResize = () => {
      //-// console.log("%% Canvas.mjs :: BROWSER RESIZED canvas_dom RESIZED EITHER")

      // WHEN WINDOW WAS RESIZED, WE NEED TO RESIZE BELOWS
      this.width = document.getElementById('footer_wrapper').offsetWidth * this.widthPercentage / 100.0
      this.sliderLength = this.width - rightSideMargin
      //-// console.log(this.widthPercentage)

      // 1. this.slider
      this.slider.updateLength(this.sliderLength)


      // 2. this.svgDom
      this.svgDom.setAttribute("width", this.width)
      this.svgDom.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`)


      // 3. RE-LOCATE KEYFRAMES

      // if(this.indicatorPercents.length > 0) {
      //   this.updateMarkerPercent(this.indicatorPercents)
      // }

      if(this.indicators.length > 0) {
        this.updateMarkerPercent()
      }

    }

    window.addEventListener("resize", this.sliderWindowResize)





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

            const mappedPosition = this.screenPointToDivPoint(mutation.target, this.target, targetX, undefined)

            let resultX = mappedPosition.x - this.anchorPosX

            //-// console.log(`DRAGGIN OBJECT ID ::   ${mutation.target.id}    ----    POSITION X ::   ${resultX}`)

            // SETTING CONSTRAINT
            if(mappedPosition.x <= this.startPos ) {
              mappedPosition.x = this.startPos
              resultX = this.startPos
            } else if( mappedPosition.x >= this.lastPos) {
              mappedPosition.x = this.lastPos
              resultX = this.lastPos
            }

            // APPLY POSITION TO INDICATOR
            this.indicatorSel.setAttribute("x", resultX)

            // SETTING NEW TIME VALUE TO KEYFRAME
            const newPercentage = (mappedPosition.x - this.startPos) / (this.lastPos - this.startPos) * 100.0

            //console.log(newPercentage)

            // USING this.indicatorSel.id
            // "bf8c86a0-32b6-483a-a5fe-21f48d8a3370_attr_rect_x_indicator_0"
            //                       0                 1    2  3     4     5
            const idSplitted = this.indicatorSel.id.split('_')
            const groupId = idSplitted[0]
            const shapeType = idSplitted[2]
            const attrName = idSplitted[3]
            const keyIndex = idSplitted[5]

            const groupDom = document.getElementById(groupId)

            const updateKeyTimeSettings = {
              bubbles: true,
              detail: {
                groupId: groupId,
                shapeType: shapeType,
                attrName: attrName,
                keyIndex: keyIndex,
                percentage: newPercentage

              }
            }
            const evToShape = new CustomEvent('update_keyframe_time', updateKeyTimeSettings)

            groupDom.dispatchEvent(evToShape)

          }
        }
      }
    }


    // ----------------------------------------------------------------------
    // EVENT HANDLING FOR MOUSE

    this.pointerEvHnd_mu = (ev) => {
      //-// console.log('CONTROLLER RESETTED')
      this.pointerDrag = null
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


    // ----------------------------------------------------------------------
    // CREATING MARKERS
    this.updateMarkerPercent = () => {

      for(let indicator of this.indicators) {
        //-// console.log(indicator)

        // GET INDICATOR'S INDEX NUMBER FROM THEIR ID
        const indicatorId = indicator.svgDom.id
        const indicatorIndex = parseInt(indicatorId.split('_')[5])

        // GETTING PERCENT FROM PERCENTAGE LIST
        const percent = parseInt(this.indicatorPercents[indicatorIndex])

        indicator.svgDom.setAttribute('x', this.posX + percent / 100 * this.sliderLength + this.pointerWid/2)
      }
    }



    this.makeMarkerPercent = (percentList) => {

      // STORE TO CONTAINER
      this.indicatorPercents = percentList

      for(let percent of this.indicatorPercents) {

        // CREATING SETTINGS FOR MAKE INDICATOR
        // FROM PERCENTAGE

        if(percent === 0) percent = 0.01
        if(percent >= 100 ) percent = 100

        //-// console.log(this.pointerWid)

        let setting = {
          width: this.pointerWid,
          height: this.pointerHgt,
          posX: this.posX + percent / 100 * this.sliderLength + this.pointerWid/2,
          posY: this.posY + this.height/2 - this.pointerHgt / 2,
          fill: "#668822"
        }
        this.createIndicator(setting)
      }

      // TURN ON EVENT HANDLERS TO MOUSEDOWN
      for(let indicator of this.indicators) {
        indicator.svgDom.addEventListener('mousedown', this.pointerEvHnd_md, false)
      }
    }



    this.createIndicator = (settings) => {

      let newIndicator = {
        svgDom: this.svgFactory.createSvgDomRect({
          id: this.svgId + "_indicator_" + this.indicators.length,
          target: this.svgDom,
          width: settings.width,
          height: settings.height,
          posX: settings.posX,
          posY: settings.posY,
          fill: settings.fill
        })
      }

      this.indicators.push(newIndicator)
    }




    // MOUSE DOWN EVENT
    this.pointerEvHnd_md = (ev) => {
      //-// console.log(`MOUSE DOWN !!!! ----     ${ev.target}   ----   ${ev.target.id}`)

      this.indicatorSel = ev.target
      this.pointerEvLsn_mu()

      this.screenDrag.setScreen({
        dragObj: ev.target,
        mutationHandler: this.mutationHandler
      })

      const mappedPosition = this.screenPointToDivPoint(this.target, this.indicatorSel, ev.clientX, ev.clientY)

      this.anchorPosX = Math.floor(mappedPosition.x)
      this.anchorPosY = Math.floor(mappedPosition.y)

      //-// console.log(`ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)

      ev.preventDefault()

    }

    this.pointerEvLsn_md = () => {
      this.indicatorSel.addEventListener('mousedown', this.pointerEvHnd_md)
    }

    this.pointerEvLsn_md_rem = () => {
      if(this.indicatorSel) {
        this.indicatorSel.removeEventListener('mousedown', this.pointerEvHnd_md)
      }
    }



    this.setIndicatorMouseDwn = (ev) => {
      //-// console.log(`MOUSE DOWN TO THE INDICATOR --->   ${ev.target.id}`)

      // // SELECT CURRENTLY CLICKED INDICATOR
      // if(ev) this.indicatorSel = ev.target

      // // SETTING EVENT LISTENER
      // this.pointerEvLsn_md()
      // this.pointerEvLsn_mu()
    }



    this.remove = () => {

      // TURN ON EVENT HANDLERS TO MOUSEDOWN
      for(let indicator of this.indicators) {
        indicator.svgDom.removeEventListener('mousedown', this.pointerEvHnd_md, false)
      }

      window.removeEventListener("resize", this.sliderWindowResize)

      this.pointerEvLsn_mu_rem()
      this.pointerEvLsn_md_rem()

      if(this.indicatorSel) this.indicatorSel.remove()
      this.svgDom.remove()
    }


    this.getSliderLength = () => {
      return this.sliderLength
    }

    // RETURN ALL HTML DOM TO OUTSIDE
    this.getDomList = () => {

      //let domlist = []

      //domlist.push(this.slider.getDomList()[0])

      return this.slider.getDomList()
    }



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




export {SliderIndicator}
