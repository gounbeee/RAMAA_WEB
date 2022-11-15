'use strict'



import { DraggableScreen }    from "./DraggableScreen.js"
import { SvgFactory }         from "./SvgFactory.js"



class Marquee {

  // const marqueeSettings = {
  //   rootDom: this.domRoot,
  //   rootSvg: this.svgRoot,
  // }
  constructor(settings) {
    //-// console.log('%% Marquee.js :: Marquee CONSTRUCTOR EXECUTED')

    this.rootDom = settings.rootDom
    this.rootSvg = settings.rootSvg

    this.svgFactory = new SvgFactory()

    // CREATING RECTANGLE SHAPE
    this.marqRect = this.svgFactory.createSvgDomRect({
            target: this.rootSvg,
            id: 'MARQUEE_RECTANGLE',
            posX: -10,
            posY: -10,
            width: 1,
            height: 1,
            fill: "#889922"
          })
    // OVERWRITE STYLE
    this.marqRect.setAttribute('fill', 'none')
    this.marqRect.setAttribute('stroke', '#889922')
    this.marqRect.setAttribute('stroke-width', 5)
    this.marqRect.setAttribute('stroke-linejoin', 'bevel')
    this.marqRect.setAttribute('stroke-linecap', 'round')
    this.marqRect.setAttribute('stroke-dasharray', '15,15')


    this.marqRect.opacity = 0.5
    this.rootSvg.appendChild(this.marqRect)


    this.anchorPosX = 0
    this.anchorPosY = 0
    this.posX
    this.posY

    // IF TRUE, MARQUEE DRAGGING WILL BE DISABLED
    this.marqueeGate = false



    // FOR DRAGGING 
    this.screenDrag = new DraggableScreen()

    this.mutationHandler = (mutationList, observer) => {
      for(const mutation of mutationList) {

        // **** MARQUEE-GATE IS HERE
        if( mutation.type === 'attributes' && !this.marqueeGate) {
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

          const mappedPosition = this.screenPointToDivPoint( this.rootDom, this.rootSvg, this.posX, this.posY)
          //-// console.log(`MAPPED POSITION X :::  ${Math.floor(mappedPosition.x - this.anchorPosX)}  ----  Y :::  ${Math.floor(mappedPosition.y - this.anchorPosY)}`)

          // INPUT 0 IF THE CALCULATION COMES WITH NaN VALUE
          if(!mappedPosition.x) mappedPosition.x = 0
          if(!mappedPosition.y) mappedPosition.y = 0


          const differX = Math.floor(mappedPosition.x - this.anchorPosX)
          const differY = Math.floor(mappedPosition.y - this.anchorPosY)

          //-// console.log(`differX :::  ${differX}  ----  Y :::  ${differY}`)

          let startPointX
          let startPointY
          let rectWidth  
          let rectHeight 

          if(differX !== 0 && differY !== 0) {
            if(differX > 0 && differY > 0) {

              startPointX = this.anchorPosX
              startPointY = this.anchorPosY
              rectWidth   = differX
              rectHeight  = differY

            } else if(differX < 0 && differY < 0) {

              startPointX = this.anchorPosX + differX
              startPointY = this.anchorPosY + differY
              rectWidth   = Math.abs(differX)
              rectHeight  = Math.abs(differY)

            } else if(differX > 0 && differY < 0) {

              startPointX = this.anchorPosX
              startPointY = this.anchorPosY + differY
              rectWidth   = Math.abs(differX)
              rectHeight  = Math.abs(differY)

            } else if(differX < 0 && differY > 0) {

              startPointX = this.anchorPosX + differX
              startPointY = this.anchorPosY
              rectWidth   = Math.abs(differX)
              rectHeight  = Math.abs(differY)
            }

            // SETTING RECTANGLE AREA
            if(mappedPosition.x) this.marqRect.setAttribute("x", startPointX)
            if(mappedPosition.y) this.marqRect.setAttribute("y", startPointY)
            if(mappedPosition.x) this.marqRect.setAttribute("width" , rectWidth )
            if(mappedPosition.y) this.marqRect.setAttribute("height", rectHeight )


            // SENDING EVENT FOR COLLISION DETECTION
            const evForCollision = new CustomEvent('MarqueeCollision', {
              bubbles: true,
              detail: {
                selectAreaObj: this
              }
            })
            this.marqRect.dispatchEvent(evForCollision)

          }

        }
      }
    }

    // CALLBACK FUNCTION FOR DraggableScreen CLASS
    this.mouseupHandler = (dragObj) => {

      this.marqRect.setAttribute("x", 0)
      this.marqRect.setAttribute("y", 0)
      this.marqRect.setAttribute("width" , 0 )
      this.marqRect.setAttribute("height", 0 )
      this.marqRect.opacity = 0.5

    }



    // ----------------------------------------------------------------------
    // EVENT HANDLING FOR MOUSE

    // MOUSE DOWN EVENT
    this.pointerEvHnd_md = (ev) => {

      if(!this.marqueeGate) {
        //-// console.log(`MOUSE DOWN !!!! ----     ${ev.target}   ----   ${ev.target.id}`)

        this.screenDrag.setScreen({
          dragObj: ev.target,
          mutationHandler: this.mutationHandler,
          mouseupHandler: this.mouseupHandler

        })

        const mappedPosition = this.screenPointToDivPoint(this.rootDom, this.rootSvg, ev.clientX, ev.clientY)

        this.anchorPosX = Math.floor(mappedPosition.x)
        this.anchorPosY = Math.floor(mappedPosition.y)

        //-// console.log(`ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)

        ev.preventDefault()
        
      }
    

    }

    this.pointerEvLsn_md = () => {
      this.rootDom.addEventListener('mousedown', this.pointerEvHnd_md)
    }

    this.pointerEvLsn_md_rem = () => {
      if(this.rootDom) {
        this.rootDom.removeEventListener('mousedown', this.pointerEvHnd_md)
      }
    }


    // MOUSE UP EVENT
    this.pointerEvHnd_mu = (ev) => {
      //-// console.log('CONTROLLER RESETTED')
      //this.pointerDrag = null

    }

    this.pointerEvLsn_mu = () => {
      this.rootDom.addEventListener('mouseleave', this.pointerEvHnd_mu )
      this.rootDom.addEventListener('mouseup', this.pointerEvHnd_mu )
    }

    this.pointerEvLsn_mu_rem = () => {
      // AFTER WE DEFINED BELOW 'TWO' LISTENERS, 'STICKING TO CURSOR PROBLEM' WAS SOLVED !
      // **** IF THERE ARE NO KEYFRAMES, this.indicatorSel WILL BE undefined
      //
      if(this.rootDom) {
        this.rootDom.removeEventListener('mouseleave', this.pointerEvHnd_mu)
        this.rootDom.removeEventListener('mouseup', this.pointerEvHnd_mu)
      }
    }

    this.pointerEvLsn_md()



  }




  getRect() {
    return this.marqRect
  }




  remove() {

    if(this.marqRect) this.marqRect.remove()
    this.svgFactory = undefined
    this.screenDrag = undefined
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



export {Marquee}
