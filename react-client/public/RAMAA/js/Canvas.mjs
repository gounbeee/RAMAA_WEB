'use strict'

// import {Draw} from './Draw.mjs'
import {DraggableScreen} from "./DraggableScreen.mjs"


class Canvas {

  constructor(settings) {
    //-// console.log('%% Canvas.mjs :: Canvas CONSTRUCTOR EXECUTED')

    // ROOT DOM ELEMENT
    const appRoot = document.getElementById('ramaaApp')

    // ------------------------------------------------------------
    // SETTINGS
    this.nsSvg = 'http://www.w3.org/2000/svg'
    this.stateName = settings.state
    this.canDrag = settings.canDrag

    // ------------------------------------------------------------
    // CREATE ELEMENTS
    this.domWorkArea = document.createElement('div')
    this.domWorkArea.id = 'workarea'

    // APPLY CSS STYLE TO 'workarea' DIV
    for(let style of settings.stylesheets) {
      this.domWorkArea.classList.add(style)
    }

    // console.log(appRoot)
    // console.log(this.domWorkArea)
    

    appRoot.appendChild(this.domWorkArea)

    // CREATE CONTAINER DIV 'svgcanvas' DIV
    this.domParent = document.createElement('div')
    this.domParent.id = 'svgcanvas'
    this.domWorkArea.appendChild(this.domParent)

    // ADJUST POSITION OF DOM
    appRoot.prepend(this.domWorkArea)

    // CANVAS STRUCTURE
    //
    // 1. CANVAS-DOM (SAME SIZE AS this.domParent(div))                                             <svg>
    //        +
    // 2. CANVAS RECT // TODO:: CANVAS DOES NOT HAVE TO BE RECTANGLE SHAPE !! (CIRCLE CANVAS!)      <rect>

    // ------------------------------------------------------------
    // GETTING DOM SIZE AFTER APPLYING CSS STYLE
    this.domWidth = this.domWorkArea.offsetWidth
    this.domHeight = this.domWorkArea.offsetHeight
    //this.domWidth_store = this.domWorkArea.offsetWidth
    //this.domHeight_store = this.domWorkArea.offsetHeight

    // SETTING DOM SIZE
    this.rectWidth = this.domWidth
    this.rectHeight = this.domHeight

    // ZOOMING PARAMETER
    // PANNING SHOULD BE SCALED UP WHEN THE CANVAS WAS ZOOMED OUT
    this.panScaler = 1.0


    // ----------------------------------------------
    // SETTING CANVAS-DOM
    this.canvas_dom = document.createElementNS(this.nsSvg, 'svg')
    this.canvas_dom.setAttribute("id", "canvas_dom")
    // CANVAS POSITION X AND Y
    this.canvas_dom.setAttribute("x", 0)
    this.canvas_dom.setAttribute("y", 0)

    this.canvas_dom.setAttribute("width", this.domWidth)
    this.canvas_dom.setAttribute("height", this.domHeight)

    this.differPosX = 0
    this.differPosY = 0

    this.canvas_dom.dataset.xSaved = 0;
    this.canvas_dom.dataset.ySaved = 0;

    // CREATING CANVAS INDICATOR (RECTANGLE AREA)
    this.canvasIndicatorRect = document.createElementNS(this.nsSvg, 'rect')
    this.canvasIndicatorRect.id = "CANVAS_RECT"
    this.canvasIndicatorRect.setAttribute("x", 0)
    this.canvasIndicatorRect.setAttribute("y", 0)
    this.canvasIndicatorRect.setAttribute("width", this.canvas_dom.getAttribute('width'))
    this.canvasIndicatorRect.setAttribute("height", this.canvas_dom.getAttribute('height'))
    this.canvasIndicatorRect.setAttribute("stroke-width", 5)
    this.canvasIndicatorRect.setAttribute("stroke", "#f66d50")
    this.canvasIndicatorRect.setAttribute("fill", "transparent")
    this.canvasIndicatorRect.setAttribute('stroke-linejoin', 'round')
    this.canvasIndicatorRect.setAttribute('stroke-linecap', 'round')
    this.canvasIndicatorRect.setAttribute('stroke-dasharray', '15,15')


    this.canvasIndicatorRect.dataset.zIndex = 0
    this.canvas_dom.appendChild(this.canvasIndicatorRect)


    // **** WE CAN PAN AND SCALE USING VIEWBOX'S PARAMETERS!!
    switch(this.stateName) {
      case 'editting':

        this.canvas_dom.setAttribute("viewBox", `0 0 ${this.domWidth} ${this.domHeight}`)

      break

      case 'presentation':

        this.canvas_dom.setAttribute("viewBox", `0 0 ${this.domWidth} ${this.domHeight}`)

      break
    }
    
    // ATTACH TO DOCUMENT
    this.domParent.appendChild(this.canvas_dom)


    // SETTING INITIAL VALUE OF SCALER
    document.getElementById('zoom_select').dataset.panScaler = 1.0



    // // ------------------------------------------------------------------
    // // EVENT HANDLERS FOR CANVAS
    // this.canvasMouseDown = (ev) => {

    //   // RESET ATTRIBBOX
    //   const resetAttrBox = new Event('resetAttrBox')
    //   // this.mainCanvas_area.dispatchEvent(resetAttrBox)
    //   this.canvas_dom.dispatchEvent(resetAttrBox)

    //   // SEND EVENT TO HIDE HANDLES FOR BRIDGE ELEMENTS !!!
    //   const resetHandles = new Event('resetHandles')
    //   // this.mainCanvas_area.dispatchEvent(resetHandles)
    //   this.canvas_dom.dispatchEvent(resetHandles)


    //   const mappedPosition = this.screenPointToDivPoint(
    //     this.canvas_dom.parentNode, 
    //     this.canvas_dom, 
    //     ev.clientX, 
    //     ev.clientY)


    //   if(this.canDrag) {

    //     // ============================================================
    //     // TODO :: TAKE NOTE BELOW
    //     // **** YOU CAN DEFINE EVENT HANDLER WHEN THE DRAGGING IS ENDED
    //     this.screenDrag.setScreen({
    //       dragObj: this.canvas_dom,
    //       mutationHandler: this.mutationHandler,
    //       mouseupHandler: this.canvasMouseUp
    //     })
    //   }

    //   //this.anchorPosX = Math.floor(mappedPosition.x)
    //   //this.anchorPosY = Math.floor(mappedPosition.y)
      
    //   this.anchorPosX = parseInt(mappedPosition.x * this.panScaler)
    //   this.anchorPosY = parseInt(mappedPosition.y * this.panScaler)
    //   //console.log(`CANVAS ::  ANCHOR :  POSITION  ::   X:  ${this.anchorPosX}      Y:  ${this.anchorPosY}`)



    //   ev.stopImmediatePropagation()
    //   ev.preventDefault()


    // }
    // this.canvas_dom.addEventListener('mousedown', this.canvasMouseDown)


    // // ***********************
    // // TODO :: TAKE A NOTE 
    // // WE ARE USING DraggableScreen WITH DRAGGING OBJECT,
    // // SO WE NEED TO DEFINE EVENT HANDLER INSIDE THE DraggablScreen CLASS
    // this.canvasMouseUp = (domElem) => {

    //   domElem.setAttribute('x', parseInt(domElem.getAttribute('x')) + this.differPosX)
    //   domElem.setAttribute('y', parseInt(domElem.getAttribute('y')) + this.differPosY)
    //   //console.log(`=====   canvas_dom :  POSITION  ::   X:  ${parseInt(domElem.getAttribute('x'))}      ======      Y:  ${parseInt(domElem.getAttribute('y'))}`)
    // }
    


    // // ----------------------------------------------------------------------
    // // SCREEN DRAGGING OBJECT
    // // FOR DRAGGING POINTER

    // if(this.canDrag) {
    //   this.screenDrag = new DraggableScreen()

    //   let dataGather = {}

    //   let targetX
    //   let targetY

    //   this.mutationHandler = (mutationList, observer) => {

    //     for(const mutation of mutationList) {
    //       if( mutation.type === 'attributes' ) {

    //         if(mutation.attributeName === 'data-x-pos') {
    //           targetX = parseInt(mutation.target.getAttribute(mutation.attributeName))
    //           dataGather['x'] = targetX
    //         } 

    //         if(mutation.attributeName === 'data-y-pos') {
    //           targetY = parseInt(mutation.target.getAttribute(mutation.attributeName))
    //           dataGather['y'] = targetY
    //         }
    //       }
    //     }

    //     if(dataGather['x'] && dataGather['y']) {
    //       //if(!dataGather['x']) //-// console.log('$$$$$  X IS NULL')
    //       //if(!dataGather['y']) //-// console.log('&&&&&  Y IS NULL')
    //       //-// console.log(dataGather)

    //       const mappedPosition = this.screenPointToDivPoint(
    //         this.canvas_dom.parentNode, 
    //         this.canvas_dom, 
    //         dataGather['x'], 
    //         dataGather['y'])

    //       console.log(`mappedPosition POS X  --->   ${mappedPosition.x}       POS Y  --->   ${mappedPosition.y}`)
    //       console.log(`anchorPos POS X  --->   ${this.anchorPosX}       POS Y  --->   ${this.anchorPosY}`)

    //       this.differPosX = Math.floor(mappedPosition.x) - Math.floor(this.anchorPosX)
    //       this.differPosY = Math.floor(mappedPosition.y) - Math.floor(this.anchorPosY)

    //       let viewPosX = -1.0 * parseInt(this.canvas_dom.getAttribute('x')) - this.differPosX
    //       let viewPosY = -1.0 * parseInt(this.canvas_dom.getAttribute('y')) - this.differPosY

    //       let zoomedPosX = parseInt(viewPosX * this.panScaler)
    //       let zoomedPosY = parseInt(viewPosY * this.panScaler)

    //       this.canvas_dom.setAttribute("viewBox", `${zoomedPosX} ${zoomedPosY} ${this.domWidth} ${this.domHeight}`)


    //       dataGather = {}
    //     }

    //   }
    // } 



    // --------------------------------------------------------
    // SETTING UPDATING DIV SIZE WHEN WINDOW IS RESIZED

    this.windowResize = () => {
      // console.log("%% Canvas.mjs :: BROWSER RESIZED canvas_dom RESIZED EITHER")


      // this.canvasIndicatorRect.setAttribute("width", this.domWidth)
      // this.canvasIndicatorRect.setAttribute("height", this.domHeight)

      // // ************************************
      // // TODO :: SHOULD BE NOTED !!!!
      // // WHEN WE ZOOM THE VIEWPORT,
      // // WE SHOULD SCALE THE CANVAS BUT ALSO SCALE POSITIONS (CURRENT POSITION, ANCHOR POSITION)
      // const currentPosX = parseInt(this.canvas_dom.getAttribute('x') * this.panScaler)
      // const currentPosY = parseInt(this.canvas_dom.getAttribute('y') * this.panScaler)

      // this.anchorPosX = parseInt(this.anchorPosX * this.panScaler)
      // this.anchorPosY = parseInt(this.anchorPosY * this.panScaler)

      // this.canvas_dom.setAttribute("viewBox", `${-1.0 * currentPosX} ${-1.0 * currentPosY} ${this.domWidth} ${this.domHeight}`)
     

    }

    window.addEventListener("resize", this.windowResize)


    // ------------------------------------------------------------------
    // CANVAS ZOOMING
    //

    this.zoomSelectHnd = (ev) => {

      //-// console.log(`CURRENT ZOOM CHANGED TO -->    ${ev.target.value}`)
      //-// console.log(document.getElementById('zoom_select').selectedIndex)

      // WHEN WE ZOOMED IN, EVERY PANNING MOVEMENT SHOULD BE SHRINKED
      // 25, 50, 75, 100 ...
      // 100 / 25 = 4 
      // MEANS THAT x4 SHRINK !!!!
      this.panScaler = 100 / ev.target.value                            // UNDER 1.0 WHEN THE VALUE IS > 100.0
      
      // STORING SCALER TO DOM FOR OTHER OBJECTS
      document.getElementById('zoom_select').dataset.panScaler = this.panScaler

      // SCALING CANVAS
      // CALCULATING FIRST
      this.domWidth = this.domWorkArea.offsetWidth * this.panScaler
      this.domHeight = this.domWorkArea.offsetHeight * this.panScaler

      // console.log(`CURRENT ZOOM CHANGED TO -->   this.domWidth ::   ${this.domWidth}   ----   this.domHeight ::   ${this.domHeight}`)
      // console.log(`CANVAS WIDTH :: ${this.canvas_dom.getAttribute('width')}   ----  CANVAS HEIGHT :: ${this.canvas_dom.getAttribute('height')}`)
      
      // const currentPosX = parseInt(this.canvas_dom.getAttribute('x')) * this.panScaler
      // const currentPosY = parseInt(this.canvas_dom.getAttribute('y')) * this.panScaler

      const currentPosX = parseInt(this.canvas_dom.dataset.xSaved) * this.panScaler;
      const currentPosY = parseInt(this.canvas_dom.dataset.ySaved) * this.panScaler;

      this.anchorPosX *= parseInt(this.panScaler)
      this.anchorPosY *= parseInt(this.panScaler)


      this.canvas_dom.setAttribute("viewBox", `${-1.0 * currentPosX} ${-1.0 * currentPosY} ${this.domWidth} ${this.domHeight}`)
    

    }
    document.getElementById('zoom_select').addEventListener('change', this.zoomSelectHnd)



    // ------------------------------------------------------------------
    // < DRAG AND DROP >


    // ----------------------------------------------
    // RXJS

    
    // https://steemit.com/utopian-io/@superoo7/tutorials-drag-and-drop-with-rxjs
    // https://codepen.io/superoo7/pen/OwZWZV

    const { fromEvent, interval } = rxjs;
    const { takeUntil, mergeMap, flatMap, map, merge } = rxjs.operators;
    

    // dom element
    //const target = document.querySelector(".box");
    const target = this.canvas_dom;
    

    // CREATING < OBSERVABLE > 
    // WITH fromEvent FUNCTION 
    const mousemove = fromEvent(document, "mousemove").pipe(
      merge(fromEvent(document, "touchmove"))
    );
    const mouseup = fromEvent(target, "mouseup").pipe(
      merge(fromEvent(target, "touchend"))
    );
    const mousedown = fromEvent(target, "mousedown").pipe(
      merge(fromEvent(target, "touchstart"))
    );



    // DRAGGING IS START FROM MOUSE DOWN,
    // THEN MOVE, SO  
    const m_drag = mousedown.pipe(

      // This operator is best used when you wish to flatten 
      // an inner observable but want to manually control the 
      // number of inner subscriptions.
      // https://www.learnrxjs.io/learn-rxjs/operators/transformation/mergemap
      mergeMap( md => {

        let anchorX, anchorY = 0;

        // md IS CAPTURED AS MouseEvent OBJECT
        // BECAUSE ABOVE'S  "mousedown = fromEvent(target, "mousedown")"
        // THEN, mousedown IS AN OBSERVABLE OBJECT,
        // SO HERE, WE ARE PIPING mergeMap FUNCTION SO THAT
        // WE ARE CALCULATE CURRENT POSITION OF MOUSE CLICKED
        //console.log(md)

        anchorX = md.layerX // 
        anchorY = md.layerY // 

        //console.log(`MOUSE DOWN  ::  ${anchorX}   --   ${anchorY}`)

        // RESET ATTRIBBOX
        const resetAttrBox = new Event('resetAttrBox')
        // this.mainCanvas_area.dispatchEvent(resetAttrBox)
        this.canvas_dom.dispatchEvent(resetAttrBox)

        // SEND EVENT TO HIDE HANDLES FOR BRIDGE ELEMENTS !!!
        const resetHandles = new Event('resetHandles')
        // this.mainCanvas_area.dispatchEvent(resetHandles)
        this.canvas_dom.dispatchEvent(resetHandles)

        console.log("RESETTING gl_SELECTEDLIST")
        gl_SELECTEDLIST = {}
        console.log(gl_SELECTEDLIST)


        // -------------------------------------------------------------
        // INNER OBSERVABLE
        //
        return mousemove.pipe(
          // mm IS MouseEvent WHEN MOUSE IS MOVING
          map(mm => {

            //console.log(`MOUSE MOVING  :: mm.layerX  ${mm.layerX}   --  mm.layerY  ${mm.layerY}`)
            //console.log(`MOUSE MOVING  ::  ${mm.movementX}   --   ${mm.movementY}`)

            // FINAL RESULT
            return {
              x: mm.movementX,
              y: mm.movementY
            };


          }),
          takeUntil(mouseup)

        );
      })
    );


    const subscription = m_drag.subscribe(pos => {

      //console.log(pos)
      let viewPosX =  -1.0 * pos.x - parseInt(this.canvas_dom.dataset.xSaved);
      let viewPosY =  -1.0 * pos.y - parseInt(this.canvas_dom.dataset.ySaved);

      let zoomedPosX = parseInt(viewPosX * this.panScaler)
      let zoomedPosY = parseInt(viewPosY * this.panScaler)

      // SAVE VALUE TO THIS CLASS VARIABLE
      this.anchorPosX = zoomedPosX
      this.anchorPosY = zoomedPosY
     
      //this.canvas_dom.setAttribute("viewBox", `${viewPosX} ${viewPosY} ${this.domWidth} ${this.domHeight}`)
      this.canvas_dom.setAttribute("viewBox", `${zoomedPosX} ${zoomedPosY} ${this.domWidth} ${this.domHeight}`)

      // STORE CURRENT VALUE
      this.canvas_dom.dataset.xSaved = -1.0 * viewPosX ;
      this.canvas_dom.dataset.ySaved = -1.0 * viewPosY ;


      // console.log(document.getElementById('ramaaApp_overlay').children)

      // const overlayList = document.getElementById('ramaaApp_overlay').children

      // for( let ind in overlayList) {

      //   console.log(overlayList[ind])




      // }

      // // // ----------------------------------------
      // // // UPDATE BOUNDING BOX EITHER !!!!
      // // superClass.updateBoundingBox({
      // //   x: this.textAreaObject.posX,
      // //   y: this.textAreaObject.posY + this.svgDom.getBBox().y,
      // //   width: this.svgDom.getBBox().width,
      // //   height: this.svgDom.getBBox().height
      // // })

    });





    // ---------------------------------------------------
    // const { range } = rxjs;
    // const { map, filter } = rxjs.operators;
    
    // range(1, 200)
    //   .pipe(
    //     filter(x => x % 2 === 1),
    //     map(x => x + x)
    //   )
    //   .subscribe(x =>  console.log(x));




    // ---------------------------------------------------
    // const observable = new rxjs.Observable(subscriber => {
    //   subscriber.next(1)
    //   subscriber.next(2)
    //
    //   setTimeout(() => {
    //     subscriber.next(3)
    //     subscriber.complete()
    //   }, 1000)
    //
    // })
    //
    // observable.subscribe(val => //-// console.log(val))




    // ---------------------------------------------------
    // const progressBar$ = rxjs.Observable.create(observer => {
    //    const OFFSET = 3000
    //    const SPEED =  50
    //
    //    let val = 0
    //    let timeoutId = 0
    //
    //    function progress() {
    //      if(++val <= 100) {
    //
    //        observer.next(val)
    //        timeoutId = setTimeout(progress, SPEED)
    //
    //      }
    //      else {
    //
    //        observer.complete()
    //
    //      }
    //    }
    //
    //    timeoutId  = setTimeout(progress, OFFSET)
    //
    //    return () => { //#A
    //       clearTimeout(timeoutId)
    //     }
    //
    // })
    //
    //
    //
    // const subs = progressBar$.subscribe(//-// console.log, null, () => //-// console.log('Complete!'))
    //
    // setTimeout(() => {
    //   subs.unsubscribe()
    //
    // }, 6000)










    // ------------------------------------------------------------------
    // WHEEL AND ZOOMING
    //
    this.wheelZooming = (ev) => {
      // ev.preventDefault()
      // ev.stopPropagation()

      // // https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
      // let delta = ev.deltaY * -0.0001


      // // WHEN WE ZOOMED IN, EVERY PANNING MOVEMENT SHOULD BE SHRINKED
      // this.panScaler += delta                         // UNDER 1.0 WHEN THE VALUE IS > 100.0
      
      // // VALUE CONSTRAINT
      // // *****  BEFORE SETTING VALUE TO BELOW                         |
      // //        WE NEED CONSTRAINT THE VALUE                          V
      // if(this.panScaler <= 0.1) {
      //   this.panScaler = 0.1
      // } else if(this.panScaler > 2.0) {
      //   this.panScaler = 2.0
      // }

      // // STORING SCALER TO DOM FOR OTHER OBJECTS
      // document.getElementById('zoom_select').dataset.panScaler = this.panScaler



      // console.log(this.panScaler)

      // // SCALING CANVAS
      // this.domWidth = parseInt(this.domWorkArea.offsetWidth * this.panScaler)
      // this.domHeight = parseInt(this.domWorkArea.offsetHeight * this.panScaler)


      // // ************************************
      // // TODO :: SHOULD BE NOTED !!!!
      // // WHEN WE ZOOM THE VIEWPORT,
      // // WE SHOULD SCALE THE CANVAS BUT ALSO SCALE POSITIONS (CURRENT POSITION, ANCHOR POSITION)
      // const currentPosX = parseInt(this.canvas_dom.getAttribute('x') * this.panScaler)
      // const currentPosY = parseInt(this.canvas_dom.getAttribute('y') * this.panScaler)

      // this.anchorPosX = parseInt(this.anchorPosX * this.panScaler)
      // this.anchorPosY = parseInt(this.anchorPosY * this.panScaler)

      // this.canvas_dom.setAttribute("viewBox", `${-1.0 * currentPosX} ${-1.0 * currentPosY} ${this.domWidth} ${this.domHeight}`)
      // //this.canvas_dom.setAttribute("viewBox", `0 0 ${this.domWidth} ${this.domHeight}`)
    

    }
    this.canvas_dom.onwheel = this.wheelZooming











  }





  // screenPointToDivPoint(from, to, x, y) {

  //   let domFrom = from
  //   let domTo = to
  //   let xPos
  //   let yPos
  //   let checkX = false
  //   let checkY = false

  //   if(x) {
  //     checkX = true
  //     xPos = x
  //   }

  //   if(y) {
  //     checkY = true
  //     yPos = y
  //   }

  //   // < RETRIEVE POSITION OF DOM ELEMENT >
  //   // https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
  //   //
  //   // DOMRect {x: 60, y: 466, width: 1340, height: 56, top: 466, …}
  //   // bottom: 522
  //   // height: 56
  //   // left: 60
  //   // right: 1400
  //   // top: 466
  //   // width: 1340
  //   // x: 60
  //   // y: 466
  //   let targetRect = domTo.getBoundingClientRect()
  //   //-// console.log(domTo.getBoundingClientRect())


  //   let result = {
  //     x: checkX ? xPos - targetRect.left : undefined,
  //     y: checkY ? yPos - targetRect.top : undefined
  //   }

  //   return result
  // }




  // screenPointToSVGPoint(svg, elem, x, y) {
  //   // let xPos
  //   // let yPos
  //   // let checkX = false
  //   // let checkY = false

  //   const point = svg.createSVGPoint()

  //   // if(x) {
  //   //   checkX = true
  //   //   xPos = x
  //   // }

  //   // if(y) {
  //   //   checkY = true
  //   //   yPos = y
  //   // }

  //   // point.x = xPos
  //   // point.y = yPos


  //   point.x = x
  //   point.y = y

  //   const CTM = elem.getScreenCTM()

  //   return point.matrixTransform( CTM.inverse() )
  // }




  zoomIn() {
    //-// console.log('%% Canvas.mjs :: zoomIn() FUNCTION EXECUTED')





  }



  remove() {
    window.removeEventListener("resize", this.windowResize)
    this.canvas_dom.removeEventListener('mousedown', this.canvasMouseDown)
    document.getElementById('zoom_select').removeEventListener('change', this.zoomSelectHnd)

    this.mutationHandler = undefined
    this.canvasObserver = undefined

    // REMOVE DOM
    //this.mainCanvas_area.remove()
    this.canvas_dom.remove()
    this.domParent.remove()
    this.domWorkArea.remove()
  }




}




export{Canvas}
