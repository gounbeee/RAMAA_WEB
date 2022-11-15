'use strict'

import {RMMath} from "./RMMath.js"
import {SvgFactory} from "./SvgFactory.js"
import {DraggableScreen} from "./DraggableScreen.js"



class Handle {

  constructor(settings) {
    // FORWARD DECLARATION
    this.nsSvg = 'http://www.w3.org/2000/svg'

    this.groupSvg = settings.target

    // HANDLE SHOULD BE GROUPED
    this.newGroupSvg = document.createElementNS(this.nsSvg, 'g')
    this.newGroupSvg.setAttribute('id', settings.id + '_grp')
    this.groupSvg.appendChild(this.newGroupSvg)

    // GETTING FACTORY FOR DRAWING SVG ELEMENT
    this.svgFactory = new SvgFactory().initialize()

    console.log(settings.dataStore)
    this.dataStore = settings.dataStore
    this.localStore

    // ------------------------------------------------------
    // FOR CUSTOM EVENT FOR UPDATING ATTRIB BOX
    let evAttrbox = settings.evAttrbox
    //-// console.log(evAttrbox)
    let eventToAttribBox = new CustomEvent('attrManagerUpdate', evAttrbox)


    // ------------------------------------------------------
    // FLAGS TO IDENTIFY MOUSE CLICKED
    this.posRectClicked = false
    this.rotCirAClicked = false
    // ** WE DO NOT NEED rotCirB BECAUSE IT MOVES REFLECTED FROM rotCirA


    // ------------------------------------------------------
    // ELEMENT CREATION
    // 1. LOCAL STORAGE LOADING
    // 2. NEW CREATION
    if(settings.isStored) {

      // RECTANGLE FOR POSITION
      this.posRect = {
        svgDom: this.svgFactory.createSvgDomSquare({
          id: settings.id + "_posRect",
          target: this.newGroupSvg,
          width: Math.floor(settings.rx * 1.2),
          posX: settings.posRect_posX + Math.floor(settings.rx * 1.2)/2,
          posY: settings.posRect_posY + Math.floor(settings.rx * 1.2)/2,
          lnWidth: Math.floor(settings.lineWidth * 0.7),
          fill: "#aaffaa"
        }),
        id: settings.id + "_posRect",
        target: this.newGroupSvg,
        width: Math.floor(settings.rx * 1.2),
        posX: settings.posRect_posX + Math.floor(settings.rx * 1.2)/2,
        posY: settings.posRect_posY + Math.floor(settings.rx * 1.2)/2,
        lnWidth: Math.floor(settings.lineWidth * 0.7),
        fill: "#aaffaa"
      }

      // CIRCLE FOR POSITION ( BIGGER THAN ROTATION CIRCLE )
      this.curveCircle = {
        svgDom: this.svgFactory.createSvgDomEllipse({                             // THIS PORTION IS FOR STORING DOM ELEMENT
          id: settings.id + "_curveCircle",
          target: this.newGroupSvg,
          rx: settings.rx,
          ry: settings.ry,
          posX: settings.posRect_posX + Math.floor(settings.rx * 1.2)/2,
          posY: settings.posRect_posY + Math.floor(settings.rx * 1.2)/2,
          lnWidth: 0,
          fill: "none"
        }),
        id: settings.id + "_curveCircle",
        target: this.newGroupSvg,
        rx: settings.rx,
        ry: settings.ry,
        posX: settings.posRect_posX + Math.floor(settings.rx * 1.2)/2,
        posY: settings.posRect_posY + Math.floor(settings.rx * 1.2)/2,
        lnWidth: 0
      }

      // CIRCLE FOR ROTATION
      // CIRCLE UPPER
      this.rotCircle_A = {
        svgDom: this.svgFactory.createSvgDomCircle({
          id: settings.id + "_rotCircle_A",
          target: this.newGroupSvg,
          diameter: Math.floor(settings.rx * 0.7),
          posX: settings.rotCirA_posX,
          posY: settings.rotCirA_posY,
          fill: "#aaaaaa"
        }),
        id: settings.id + "_rotCircle_A",
        target: this.newGroupSvg,
        diameter: Math.floor(settings.rx * 0.7),
        posX: settings.rotCirA_posX,
        posY: settings.rotCirA_posY,
        xPosRelRect: settings.rotCirA_posX - settings.posRect_posX,
        yPosRelRect: settings.rotCirA_posY - settings.posRect_posY,
        lnWidth: Math.floor(settings.lineWidth * 0.7)
      }

      // CIRCLE LOWER
      this.rotCircle_B = {
        svgDom: this.svgFactory.createSvgDomCircle({
          id: settings.id + "_rotCircle_B",
          target: this.newGroupSvg,
          diameter: 0,
          posX: settings.rotCirB_posX,
          posY: settings.rotCirB_posY,
          fill: "#aaaaaa"
        }),
        id: settings.id + "_rotCircle_B",
        target: this.newGroupSvg,
        diameter: Math.floor(settings.rx * 0.7),
        posX: settings.rotCirB_posX,
        posY: settings.rotCirB_posY,
        xPosRelRect: settings.rotCirB_posX - settings.posRect_posX,
        yPosRelRect: settings.rotCirB_posY - settings.posRect_posY,
        lnWidth: Math.floor(settings.lineWidth * 0.7)
      }

      // LINE CONNECTING ABOVE 2 CIRCLES
      this.line = {
        svgDom: this.svgFactory.createSvgDomLine({
          id: settings.id + "_line",
          target: this.newGroupSvg,
          pointA: {
            posX: settings.rotCirA_posX,
            posY: settings.rotCirA_posY
          },
          pointB: {
            posX: settings.rotCirB_posX,
            posY: settings.rotCirB_posY
          },
          lineColor: "#000000",
          lineWidth: settings.lineWidth
        }),
        pointA: {
          posX: settings.rotCirA_posX,
          posY: settings.rotCirA_posY,
        },
        pointB: {
          posX: settings.rotCirB_posX,
          posY: settings.rotCirB_posY,
        },
        lineColor: "#000000",
        lineWidth: settings.lineWidth
      }


    } else {

      // CIRCLE FOR POSITION ( BIGGER THAN ROTATION CIRCLE )
      this.curveCircle = {
        svgDom: this.svgFactory.createSvgDomEllipse({                             // THIS PORTION IS FOR STORING DOM ELEMENT
          id: settings.id + "_curveCircle",
          target: this.newGroupSvg,
          rx: settings.rx,
          ry: settings.ry,
          posX: settings.posX,
          posY: settings.posY,
          lnWidth: 0,
          fill: "none"
        }),
        id: settings.id + "_curveCircle",
        target: this.newGroupSvg,
        rx: settings.rx,
        ry: settings.ry,
        posX: settings.posX,
        posY: settings.posY,
        lnWidth: 0
      }

      // RECTANGLE FOR POSITION
      this.posRect = {
        svgDom: this.svgFactory.createSvgDomSquare({
          id: settings.id + "_posRect",
          target: this.newGroupSvg,
          width: Math.floor(settings.rx * 1.2),
          posX: settings.posX,
          posY: settings.posY,
          lnWidth: Math.floor(settings.lineWidth * 0.7),
          fill: "#aaffaa"
        }),
        id: settings.id + "_posRect",
        target: this.newGroupSvg,
        width: Math.floor(settings.rx * 1.2),
        posX: settings.posX,
        posY: settings.posY,
        lnWidth: Math.floor(settings.lineWidth * 0.7),
        fill: "#aaffaa"
      }

      // CIRCLE FOR ROTATION
      // CIRCLE UPPER
      this.rotCircle_A = {
        svgDom: this.svgFactory.createSvgDomCircle({
          id: settings.id + "_rotCircle_A",
          target: this.newGroupSvg,
          diameter: Math.floor(settings.rx * 0.7),
          posX: settings.posX,
          posY: settings.posY - Math.floor(settings.ry * 2.5),
          fill: "#aaaaaa"
        }),
        id: settings.id + "_rotCircle_A",
        target: this.newGroupSvg,
        diameter: Math.floor(settings.rx * 0.7),
        posX: settings.posX,
        posY: settings.posY - Math.floor(settings.ry * 2.5),
        xPosRelRect: settings.posX - this.posRect.posX,
        yPosRelRect: settings.posY - this.posRect.posY,
        lnWidth: Math.floor(settings.lineWidth * 0.7)
      }

      // CIRCLE LOWER
      this.rotCircle_B = {
        svgDom: this.svgFactory.createSvgDomCircle({
          id: settings.id + "_rotCircle_B",
          target: this.newGroupSvg,
          diameter: 0,
          posX: settings.posX,
          posY: settings.posY + Math.floor(settings.ry * 2.5),
          fill: "#aaaaaa"
        }),
        id: settings.id + "_rotCircle_B",
        target: this.newGroupSvg,
        diameter: Math.floor(settings.rx * 0.7),
        posX: settings.posX,
        posY: settings.posY + Math.floor(settings.ry * 2.5),
        xPosRelRect: settings.posX - this.posRect.posX,
        yPosRelRect: settings.posY - this.posRect.posY,
        lnWidth: Math.floor(settings.lineWidth * 0.7)
      }

      this.line = {
        svgDom: this.svgFactory.createSvgDomLine({
          id: settings.id + "_line",
          target: this.newGroupSvg,
          pointA: {
            posX: this.rotCircle_A.posX,
            posY: this.rotCircle_A.posY
          },
          pointB: {
            posX: this.rotCircle_B.posX,
            posY: this.rotCircle_B.posY
          },
          lineColor: "#000000",
          lineWidth: settings.lineWidth
        }),
        pointA: {
          posX: this.rotCircle_A.posX,
          posY: this.rotCircle_A.posY,
        },
        pointB: {
          posX: this.rotCircle_B.posX,
          posY: this.rotCircle_B.posY,
        },
        lineColor: "#000000",
        lineWidth: settings.lineWidth
      }

      this.calcRelPos_RotCirA()
      this.calcRelPos_RotCirB()
    }




    // -----------------------------------------------------------------
    // MUTATION SETTING
    // SOME PARTS OF HANDLE SHOULD MOVE TOGETHER
    const observeConfig = {
      attributes: true,
      subtree: false
    }







    // WHEN RECT OBJECT WAS UPDATED WITH POSITION,
    // THAT SHOULD AFFECT TO EVERY OTHER CONTROLLERS
    const monitorRect = (mutationsList, observer) => {
      for(const mutation of mutationsList) {
        if( mutation.type === 'attributes' ) {
          //console.log(`${mutation.attributeName}   WAS MODIFIED`)
          //console.log(mutation.target.getAttribute(mutation.attributeName))

          if(mutation.attributeName === 'x') {
            //-// console.log(mutation.target.getAttribute(mutation.attributeName))

            let currentPosRectX = mutation.target.getAttribute(mutation.attributeName)

            this.followToRect_CurveCircle()
            this.followToRect_RotCirA()
            this.followToRect_RotCirB()


          } else if(mutation.attributeName === 'y') {
            //-// console.log(mutation.target.getAttribute(mutation.attributeName))

            let currentPosRectY = mutation.target.getAttribute(mutation.attributeName)

            this.followToRect_CurveCircle()
            this.followToRect_RotCirA()
            this.followToRect_RotCirB()

          }
        }
      }
    }
    const observer_rect = new MutationObserver(monitorRect)
    observer_rect.observe(this.posRect.svgDom, observeConfig)







    // WHEN ROT CIRCLE A MOVES,
    // LINE'S POINT A SHOULD BE MOVED
    const monitorRotCirA = (mutationsList, observer) => {
      for(const mutation of mutationsList) {
        if( mutation.type === 'attributes' ) {
          //console.log(`${mutation.attributeName}   WAS MODIFIED`)
          //console.log(mutation.target.getAttribute(mutation.attributeName))

          // UPDATE CURVECIRCLE TO UPDATE ARROW PROPERLY
          let rxry = RMMath.pointOnCircle(
            parseInt(this.curveCircle.svgDom.getAttribute('cx')),
            parseInt(this.curveCircle.svgDom.getAttribute('cy')),
            parseInt(this.rotCircle_A.svgDom.getAttribute('cx')),
            parseInt(this.rotCircle_A.svgDom.getAttribute('cy'))
          )
          this.curveCircle.svgDom.setAttribute('rx', rxry.x)
          this.curveCircle.svgDom.setAttribute('ry', rxry.y)

          // CONSTRAINT THE POSITION OF LINE TO ROTATION CIRCLE
          this.line.svgDom.setAttribute('x1', this.rotCircle_A.svgDom.getAttribute('cx'))
          this.line.svgDom.setAttribute('y1', this.rotCircle_A.svgDom.getAttribute('cy'))

          // CALCULATING ROTATION CIRCLE B
          let pivotX = parseInt(this.curveCircle.svgDom.getAttribute('cx'))
          let posX = parseInt(this.rotCircle_A.svgDom.getAttribute('cx'))
          let mirrorPosX = pivotX - (posX - pivotX)

          let pivotY = parseInt(this.curveCircle.svgDom.getAttribute('cy'))
          let posY = parseInt(this.rotCircle_A.svgDom.getAttribute('cy'))
          let mirrorPosY = pivotY - (posY - pivotY)

          this.rotCircle_B.svgDom.setAttribute('cx', mirrorPosX)
          this.rotCircle_B.svgDom.setAttribute('cy', mirrorPosY)

          //this.calcRelPos_RotCirA()
          //this.calcRelPos_RotCirB()


          // ---------------------------------
          // SAVING VALUE TO LOCAL STORAGE
          const abcSelect = this.posRect.id.split('_')[1]
          const dtStrKey_x = 'hnd' + abcSelect + '_' + 'rotCirB_posX'
          const dtStrKey_y = 'hnd' + abcSelect + '_' + 'rotCirB_posY'

          //console.log(dtStrKey_y)

          this.dataStore[dtStrKey_x] = parseInt(this.rotCircle_B.svgDom.getAttribute('cx'))
          this.dataStore[dtStrKey_y] = parseInt(this.rotCircle_B.svgDom.getAttribute('cy'))

          
          this.localStore.saveToLocalStr(this.dataStore)


        }
      }
    }
    const observer_rotCirA = new MutationObserver(monitorRotCirA)
    observer_rotCirA.observe(this.rotCircle_A.svgDom, observeConfig)







    // WHEN ROT CIRCLE B MOVES,
    // LINE'S POINT B SHOULD BE MOVED
    const monitorRotCirB = (mutationsList, observer) => {
      for(const mutation of mutationsList) {
        if( mutation.type === 'attributes' ) {
          //-// console.log(`${mutation.attributeName}   WAS MODIFIED`)
          //-// console.log(mutation.target.getAttribute(mutation.attributeName))
          this.line.svgDom.setAttribute('x2', this.rotCircle_B.svgDom.getAttribute('cx'))
          this.line.svgDom.setAttribute('y2', this.rotCircle_B.svgDom.getAttribute('cy'))
        }
      }
    }
    const observer_rotCirB = new MutationObserver(monitorRotCirB)
    observer_rotCirB.observe(this.rotCircle_B.svgDom, observeConfig)










    // -----------------------------------------------------------------
    // CUSTOM EVENT FOR ARROW
    // (WHEN HANDLES MOVED, ARROW SHAPE SHOULD BE UPDATED)
    let eventToArrow = new CustomEvent('handleUpdated', {
      bubles: false,
      detail:{
        //allDomList: this.getDomList()
      }
    })



    // ----------------------------------------------------------------------
    // SCREEN DRAGGING OBJECT
    // FOR DRAGGING POINTER
    this.screenDrag = new DraggableScreen()

    this.mutationHandler_rect = (mutationList, observer) => {

      for(const mutation of mutationList) {
        if( mutation.type === 'attributes' ) {
          //-// console.log(`${mutation.target.id} :::   ${mutation.attributeName}   WAS MODIFIED`)

          if(mutation.attributeName === 'data-x-pos') {

            this.updatePosRect('x', mutation, this.dataStore)

          } else if(mutation.attributeName === 'data-y-pos') {

            this.updatePosRect('y', mutation, this.dataStore)

          }

          this.posRect.svgDom.dispatchEvent(eventToArrow)

        }
      }
    }




 


    this.mutationHandler_rotCirA = (mutationList, observer) => {
      for(const mutation of mutationList) {
        if( mutation.type === 'attributes' ) {
          //console.log(mutation)
          //console.log(`${mutation.target.id} :::   ${mutation.attributeName}   WAS MODIFIED`)

          if(mutation.attributeName === 'data-x-pos') {

            this.updateRotCirA('x', mutation, this.dataStore)

          } else if(mutation.attributeName === 'data-y-pos') {

            this.updateRotCirA('y', mutation, this.dataStore)

          }

          this.posRect.svgDom.dispatchEvent(eventToArrow)

        }
      }
    }


    // -----------------------------------------------------------------
    // FOR MOVEMENT OF RECTANGLE SHAPE FOR 'MOVING ENTIRE HANDLE'

    // MOUSE LEAVE EVENT
    // ***** MOUSE UP IS PROBLEMATIC WHEN MOUSE MOVED FAST !
    // https://javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave

    // MOUSE DOWN EVENT
    this.posRectEvHnd_md = (ev) => {
      console.log(`POS RECT MOUSE DOWN !! ::   ${ev.target.id}`)

      //-// console.log(`MOUSE CLIENT X POSITION ::   ${ev.clientX}`)
      //-// console.log(`POS RECT X POSITION ::   ${ev.target.getAttribute('x')}`)

      this.posRectClicked = true

      ev.stopImmediatePropagation()
      ev.preventDefault()

      this.screenDrag.setScreen({
        dragObj: ev.target,
        mutationHandler: this.mutationHandler_rect,
        mouseupHandler: this.posRectEvHnd_mu
      })

    }

    this.posRectEvLsn_md = () => {
      this.posRect.svgDom.addEventListener('mousedown', this.posRectEvHnd_md)
    }

    this.posRectEvLsn_md_rem = () => {
      this.posRect.svgDom.removeEventListener('mousedown', this.posRectEvHnd_mv)
    }



    this.posRectEvHnd_mu = (dom) => {
      console.log(`POS RECT MOUSE UP !! ::   ${dom.id}`)

      this.posRectClicked = false

      dom.dispatchEvent(eventToAttribBox)

    }


    // -----------------------------------------------------------------
    // FOR MOVEMENT OF CIRCLE SHAPE FOR 'ROTATING HANDLE' (A IS UPPER ONE)

    this.rotCircle_AEvHnd_md = (ev) => {
      this.rotCirAClicked = true

      ev.stopImmediatePropagation()
      ev.preventDefault()

      this.screenDrag.setScreen({
        dragObj: ev.target,
        mutationHandler: this.mutationHandler_rotCirA,
        mouseupHandler: this.rotCircle_AEvHnd_mu
      })

    }

    this.rotCircle_AEvLsn_md = () => {
      this.rotCircle_A.svgDom.addEventListener('mousedown', this.rotCircle_AEvHnd_md )
    }

    this.rotCircle_AEvLsn_md_rem = () => {
      this.rotCircle_A.svgDom.removeEventListener('mousedown', this.rotCircle_AEvHnd_md)
    }



    // -----------------------------------------------------------------
    // FOR MOVEMENT OF CIRCLE SHAPE FOR 'ROTATING HANDLE' (A IS UPPER ONE)

    this.rotCircle_AEvHnd_mu = (dom) => {
      //-// console.log(`ROT CIRCLE A MOUSE CLICKED !! ::   ${dom.id}`)
      this.rotCirAClicked = false

      dom.dispatchEvent(eventToAttribBox)

    }

    // ALIGN Z-ORDER
    this.curveCircle.svgDom.after(this.posRect.svgDom)
    this.curveCircle.svgDom.before(this.line.svgDom)

    // SETTING VISIBILITY
    this.setAllVisibility(true)

    // UPDATE CURVE CIRCLE'S SIZE !!
    // ** CRITICAL
    this.updateCurveCirSize()

  }




    // this.handlesAposRectMouseMove = (ev) => {
    //   ev.stopImmediatePropagation()
    //   ev.preventDefault()
      
    //   console.log(this.arrow.handles.A.posRectClicked)

    //   if(this.arrow.handles.A.posRectClicked) {

        

    //     this.dataStore.zIndex            = this.group.dataset.zIndex

    //     this.dataStore.hndA_posRect_posX = parseInt(this.arrow.handles.A.posRect.svgDom.getAttribute('x'))
    //     this.dataStore.hndA_posRect_posY = parseInt(this.arrow.handles.A.posRect.svgDom.getAttribute('y'))

    //     this.arrow.fill                  = this.arrow.svgDom.getAttribute('fill')
    //     this.dataStore.fill              = this.arrow.svgDom.getAttribute('fill')
    //     this.dataStore.opacity           = this.arrow.svgDom.style.opacity

    //     //console.log(this.arrow.svgDom)
    //     this.arrow.svgDom.dispatchEvent(eventToArribMan)
    //     this.localStorage.saveToLocalStr(this.dataStore)

    //     // UPDATE ARROW'S SHAPE
    //     this.arrow.update()

    //   }
    // }



  // UPDATE HANDLES
  updatePosRect(channel, mutation, dataStore) {

    switch(channel) {

      case 'x':

        this.posRect.posX = mutation.target.getAttribute(mutation.attributeName)
        const mappedPositionX = this.screenPointToSVGPoint( this.groupSvg.parentElement, this.posRect.svgDom, this.posRect.posX, "0")
        //-// console.log(mappedPositionX)

        // APPLY POSITION
        let rectWidth = parseInt(this.posRect.svgDom.getAttribute('width'))
        this.posRect.svgDom.setAttribute("x", Math.floor(mappedPositionX.x - rectWidth/2))
        //this.posRect.svgDom.setAttribute("x", mappedPosition.x)
        //-// console.log(`updatePosRect ::  this.rotCircle_A.xPosRelRect   ::    ${this.rotCircle_A.xPosRelRect}`)

        //console.log(dataStore)
        //console.log(this.posRect.id)

        // ---------------------------------
        // SAVING VALUE TO LOCAL STORAGE
        const abcSelect_x = this.posRect.id.split('_')[1]
        const dtStrKey_x = 'hnd' + abcSelect_x + '_' + 'posRect_posX'

        //console.log(dtStrKey_x)

        dataStore[dtStrKey_x] = parseInt(this.posRect.svgDom.getAttribute('x'))

        this.localStore.saveToLocalStr(this.dataStore)


        break

      case 'y':
        this.posRect.posY = mutation.target.getAttribute(mutation.attributeName)
        const mappedPositionY = this.screenPointToSVGPoint( this.groupSvg.parentElement, this.posRect.svgDom, "0",this.posRect.posY)
        //-// console.log(mappedPositionY)

        // APPLY POSITION
        let rectHeight = parseInt(this.posRect.svgDom.getAttribute('height'))
        this.posRect.svgDom.setAttribute("y", Math.floor(mappedPositionY.y - rectHeight/2))
        //this.posRect.svgDom.setAttribute("y", mappedPositionY.y)

        //console.log(dataStore)
        //console.log(this.posRect.id)


        // ---------------------------------
        // SAVING VALUE TO LOCAL STORAGE
        const abcSelect_y = this.posRect.id.split('_')[1]
        const dtStrKey_y = 'hnd' + abcSelect_y + '_' + 'posRect_posY'

        //console.log(dtStrKey_y)

        dataStore[dtStrKey_y] = parseInt(this.posRect.svgDom.getAttribute('y'))

        this.localStore.saveToLocalStr(this.dataStore)

        break

    }

  }

  updateRotCirA(channel, mutation, dataStore) {

    switch(channel) {

      case 'x':
        this.rotCircle_A.posX = mutation.target.getAttribute(mutation.attributeName)
        const mappedPositionX = this.screenPointToSVGPoint( this.groupSvg.parentElement, this.rotCircle_A.svgDom, this.rotCircle_A.posX, "0")

        this.calcRelPos_RotCirA()

        // APPLY POSITION
        this.rotCircle_A.svgDom.setAttribute("cx", Math.floor(mappedPositionX.x))
        //-// console.log(`updateRotCirA ::  this.rotCircle_A.xPosRelRect   ::    ${this.rotCircle_A.xPosRelRect}`)

        //console.log(dataStore)
        //console.log(this.posRect.id)


        // ---------------------------------
        // SAVING VALUE TO LOCAL STORAGE
        const abcSelect_x = this.rotCircle_A.id.split('_')[1]
        const dtStrKey_x = 'hnd' + abcSelect_x + '_' + 'rotCirA_posX'

        //console.log(dtStrKey_x)

        dataStore[dtStrKey_x] = parseInt(this.rotCircle_A.svgDom.getAttribute('cx'))

        this.localStore.saveToLocalStr(this.dataStore)

        break

      case 'y':

        this.rotCircle_A.posY = mutation.target.getAttribute(mutation.attributeName)
        const mappedPositionY = this.screenPointToSVGPoint( this.groupSvg.parentElement, this.rotCircle_A.svgDom, "0",this.rotCircle_A.posY)

        this.calcRelPos_RotCirA()

        // APPLY POSITION
        this.rotCircle_A.svgDom.setAttribute("cy", Math.floor(mappedPositionY.y))

        //console.log(dataStore)
        //console.log(this.posRect.id)


        // ---------------------------------
        // SAVING VALUE TO LOCAL STORAGE
        const abcSelect_y = this.rotCircle_A.id.split('_')[1]
        const dtStrKey_y = 'hnd' + abcSelect_y + '_' + 'rotCirA_posY'

        //console.log(dtStrKey_y)

        dataStore[dtStrKey_y] = parseInt(this.rotCircle_A.svgDom.getAttribute('cy'))

        this.localStore.saveToLocalStr(this.dataStore)

        break

    }
  }

  updateCurveCirSize() {
    let rxry = RMMath.pointOnCircle(
      parseInt(this.curveCircle.svgDom.getAttribute('cx')),
      parseInt(this.curveCircle.svgDom.getAttribute('cy')),
      parseInt(this.rotCircle_A.svgDom.getAttribute('cx')),
      parseInt(this.rotCircle_A.svgDom.getAttribute('cy'))
    )

    this.curveCircle.svgDom.setAttribute('rx', rxry.x)
    this.curveCircle.svgDom.setAttribute('ry', rxry.y)

  }


  // FUNCTIONS TO FOLLOW POS-RECT
  followToRect_CurveCircle() {
    // CURVE-CIRCLE SHOULE BE FOLLOWED WITH POSRECT
    let targetX = parseInt(this.posRect.svgDom.getAttribute('x'))
    let targetY = parseInt(this.posRect.svgDom.getAttribute('y'))
    let rectWidth = parseInt(this.posRect.svgDom.getAttribute('width'))
    let rectHeight = parseInt(this.posRect.svgDom.getAttribute('height'))
    this.curveCircle.svgDom.setAttribute('cx', targetX + rectWidth/2)
    this.curveCircle.svgDom.setAttribute('cy', targetY + rectHeight/2)

  }

  followToRect_RotCirA() {
    //-// console.log(`followToRect_RotCirA :::  relX :::   ${this.rotCircle_A.xPosRelRect}     relY :::   ${this.rotCircle_A.yPosRelRect}`)

    //this.calcRelPos_RotCirA()

    //this.rotCircle_A.svgDom.setAttribute('cx', parseInt(this.posRect.svgDom.getAttribute('x')) + 50)
    //this.rotCircle_A.svgDom.setAttribute('cy', parseInt(this.posRect.svgDom.getAttribute('y')) + 50)

    this.rotCircle_A.svgDom.setAttribute('cx', parseInt(this.posRect.svgDom.getAttribute('x')) + this.rotCircle_A.xPosRelRect)
    this.rotCircle_A.svgDom.setAttribute('cy', parseInt(this.posRect.svgDom.getAttribute('y')) + this.rotCircle_A.yPosRelRect)
  
    // ---------------------------------
    // SAVING VALUE TO LOCAL STORAGE
    const abcSelect = this.posRect.id.split('_')[1]
    const dtStrKey_x = 'hnd' + abcSelect + '_' + 'rotCirA_posX'
    const dtStrKey_y = 'hnd' + abcSelect + '_' + 'rotCirA_posY'

    //console.log(dtStrKey_y)

    this.dataStore[dtStrKey_x] = parseInt(this.rotCircle_A.svgDom.getAttribute('cx'))
    this.dataStore[dtStrKey_y] = parseInt(this.rotCircle_A.svgDom.getAttribute('cy'))

    
    this.localStore.saveToLocalStr(this.dataStore)




  }

  followToRect_RotCirB() {
    //-// console.log(`relX :::   ${this.rotCircle_B.xPosRelRect}     relY :::   ${this.rotCircle_B.yPosRelRect}`)

    //this.calcRelPos_RotCirB()

    this.rotCircle_B.svgDom.setAttribute('cx', parseInt(this.posRect.svgDom.getAttribute('x')) + this.rotCircle_B.xPosRelRect)
    this.rotCircle_B.svgDom.setAttribute('cy', parseInt(this.posRect.svgDom.getAttribute('y')) + this.rotCircle_B.yPosRelRect)
    

    // ---------------------------------
    // SAVING VALUE TO LOCAL STORAGE
    const abcSelect = this.posRect.id.split('_')[1]
    const dtStrKey_x = 'hnd' + abcSelect + '_' + 'rotCirB_posX'
    const dtStrKey_y = 'hnd' + abcSelect + '_' + 'rotCirB_posY'

    //console.log(dtStrKey_y)

    this.dataStore[dtStrKey_x] = parseInt(this.rotCircle_B.svgDom.getAttribute('cx'))
    this.dataStore[dtStrKey_y] = parseInt(this.rotCircle_B.svgDom.getAttribute('cy'))

    this.localStore.saveToLocalStr(this.dataStore)

  }


  // CALCULATING RELATIVE COORDINATES BETWEEN RECT
  calcRelPos_RotCirA() {
    //-// console.log(`calcRelPos_RotCirA :::  relX :::   ${this.rotCircle_A.xPosRelRect}     relY :::   ${this.rotCircle_A.yPosRelRect}`)
    this.rotCircle_A.xPosRelRect = parseInt(this.rotCircle_A.svgDom.getAttribute('cx')) - parseInt(this.posRect.svgDom.getAttribute('x')) //+ parseInt(this.posRect.svgDom.getAttribute('width'))/2
    this.rotCircle_A.yPosRelRect = parseInt(this.rotCircle_A.svgDom.getAttribute('cy')) - parseInt(this.posRect.svgDom.getAttribute('y')) //+ parseInt(this.posRect.svgDom.getAttribute('height'))/2
  }

  calcRelPos_RotCirB() {
    //-// console.log(`relX :::   ${this.rotCircle_B.xPosRelRect}     relY :::   ${this.rotCircle_B.yPosRelRect}`)
    this.rotCircle_B.xPosRelRect = parseInt(this.rotCircle_B.svgDom.getAttribute('cx')) - parseInt(this.posRect.svgDom.getAttribute('x')) //+ parseInt(this.posRect.svgDom.getAttribute('width'))/2
    this.rotCircle_B.yPosRelRect = parseInt(this.rotCircle_B.svgDom.getAttribute('cy')) - parseInt(this.posRect.svgDom.getAttribute('y')) //+ parseInt(this.posRect.svgDom.getAttribute('height'))/2
  }


  getGroup() {
    return this.newGroupSvg
  }

  turnOnEventHandlers() {
    this.posRectEvLsn_md()
    //this.posRectEvLsn_mu()

    this.rotCircle_AEvLsn_md()
    //this.rotCircle_AEvLsn_mu()

  }

  turnOffEventHandlers() {

    this.posRectEvLsn_md_rem()
    //this.posRectEvLsn_mu_rem()

    this.rotCircle_AEvLsn_md_rem()
    //this.rotCircle_AEvLsn_mu_rem()

  }



  // THIS FUNCTION CALCULATES ACTUAL POINTS
  // WHICH IS NEEDED WHEN WE DRAW BEZIER CURVE
  getDrawPoints() {
    let left
    let right
    let front
    let rear

    let result = {}

    // LEFT POINT IS A CROSS POINT OF this.line AND this.curveCircle
    let points = {
      get: () => {

        let rslt = {}

        let line_x1 = parseInt(this.line.svgDom.getAttribute('x1'))
        let line_y1 = parseInt(this.line.svgDom.getAttribute('y1'))
        let line_x2 = parseInt(this.line.svgDom.getAttribute('x2'))
        let line_y2 = parseInt(this.line.svgDom.getAttribute('y2'))

        let slope_l = RMMath.calcSlope2Pt(line_x1, line_y1, line_x2, line_y2)
        let radian_l = Math.atan(slope_l)

        let slope_r = RMMath.calcSlope2Pt(line_x2, line_y2, line_x1, line_y1)
        let radian_r = Math.atan(slope_r)

        let radian_F

        // NOW WE ARE USING NEAR-0 VALUE WITH CONSTRAINING VALUE
        // SO WE GET LARGE NUMBER WHEN IT CLOSES TO 0
        // -> HERE WE ROUTING TO NEW VALUE CALCULATED
        if(slope_l > 9999 || slope_l < -9999) {
          radian_F = radian_r - Math.PI
        } else {
          radian_F = radian_l
        }


        // CENTER POINT IS this.curveCircle.svgDom'S cx AND cy
        let cenX = parseInt(this.curveCircle.svgDom.getAttribute('cx'))
        let cenY = parseInt(this.curveCircle.svgDom.getAttribute('cy'))
        let dist = parseInt(this.curveCircle.svgDom.getAttribute('rx')) / 2
        //-// console.log(`DIST ::    ${dist}`)

        // TODO:: ABOVE !
        //let dist = parseInt(this.curveCircle.svgDom.getAttribute('ry'))
        let ScaleDiagonal = 1.47
        let ScalePerpend = 1.0


        // RIGHT
        let right = {
          x: cenX + Math.floor( dist * ScalePerpend * Math.cos(radian_F) ),
          y: cenY + Math.floor( dist * ScalePerpend * Math.sin(radian_F) )
        }
        // REAR RIGHT CONTROL POINT
        let rearRightCtl = {
          x: cenX + Math.floor( dist * ScaleDiagonal * Math.cos(radian_F + Math.PI * (1/4)) ),
          y: cenY + Math.floor( dist * ScaleDiagonal * Math.sin(radian_F + Math.PI * (1/4)) )
        }
        // REAR
        let rear = {
          x: cenX + Math.floor( dist * ScalePerpend * Math.cos(radian_F + Math.PI * (2/4)) ),
          y: cenY + Math.floor( dist * ScalePerpend * Math.sin(radian_F + Math.PI * (2/4)) )
        }
        // REAR LEFT CONTROL POINT
        let rearLeftCtl = {
          x: cenX + Math.floor( dist * ScaleDiagonal * Math.cos(radian_F + Math.PI * (3/4)) ),
          y: cenY + Math.floor( dist * ScaleDiagonal * Math.sin(radian_F + Math.PI * (3/4)) )
        }
        // LEFT
        let left = {
          x: cenX + Math.floor( dist * ScalePerpend * Math.cos(radian_F + Math.PI) ),
          y: cenY + Math.floor( dist * ScalePerpend * Math.sin(radian_F + Math.PI) )
        }
        // FRONT LEFT CONTROL POINT
        let frontLeftCtl = {
          x: cenX + Math.floor( dist * ScaleDiagonal * Math.cos(radian_F - Math.PI * (3/4)) ),
          y: cenY + Math.floor( dist * ScaleDiagonal * Math.sin(radian_F - Math.PI * (3/4)) )
        }
        // FRONT
        let front = {
          x: cenX + Math.floor( dist * ScalePerpend * Math.cos(radian_F - Math.PI * (2/4)) ),
          y: cenY + Math.floor( dist * ScalePerpend * Math.sin(radian_F - Math.PI * (2/4)) )
        }
        // FRONT RIGHT CONTROL POINT
        let frontRightCtl = {
          x: cenX + Math.floor( dist * ScaleDiagonal * Math.cos(radian_F - Math.PI * (1/4)) ),
          y: cenY + Math.floor( dist * ScaleDiagonal * Math.sin(radian_F - Math.PI * (1/4)) )
        }

        rslt = {
          right: right,
          left: left,
          front: front,
          rear: rear,
          frontRightCtl: frontRightCtl,
          frontLeftCtl: frontLeftCtl,
          rearRightCtl: rearRightCtl,
          rearLeftCtl: rearLeftCtl
        }

        return rslt

      }
    }

    //point_left.getX()





    result = {
      front: points.get().front,
      rear: points.get().rear,
      left: points.get().left,
      right: points.get().right,
      frontRightCtl: points.get().frontRightCtl,
      frontLeftCtl: points.get().frontLeftCtl,
      rearRightCtl: points.get().rearRightCtl,
      rearLeftCtl: points.get().rearLeftCtl
    }


    // // TODO :: COMMENT OUT BELOW
    // // FOR DEBUG
    // for(let elmKey in result) {
    //
    //   this.debugDrawPointSvg(true, result[elmKey].x, result[elmKey].y, document.getElementById('canvas_dom'))
    //
    // }




    return result

  }


  // RETURN ALL HTML DOM TO OUTSIDE
  getDomList() {

    let domlist = []

    domlist.push(this.curveCircle.svgDom)
    domlist.push(this.posRect.svgDom)
    //domlist.push(this.sclCircle.svgDom)
    domlist.push(this.rotCircle_A.svgDom)
    domlist.push(this.rotCircle_B.svgDom)
    domlist.push(this.line.svgDom)

    return domlist

  }



  // SETTING VISIBILITY
  // https://stackoverflow.com/questions/37943006/unable-to-change-class-name-of-svg-element
  //
  setAllVisibility(flag){
    let cssStyle = undefined

    if(flag === true) cssStyle = "visible"
    else cssStyle = "hidden"

    if(cssStyle) {
      this.curveCircle.svgDom.setAttribute('class', cssStyle)
      this.posRect.svgDom.setAttribute('class', cssStyle)
      //this.sclCircle.svgDom.setAttribute('class', cssStyle)
      this.rotCircle_A.svgDom.setAttribute('class', cssStyle)
      this.rotCircle_B.svgDom.setAttribute('class', cssStyle)
      this.line.svgDom.setAttribute('class', cssStyle)
    }



  }


  remove() {

    this.turnOffEventHandlers()
    this.mutationHandler_rect = undefined

    let domList = this.getDomList()
    for(let dom of domList) {
      dom.remove()
    }

    this.newGroupSvg.remove()



  }




  // ========================================================
  // PRIVATE USAGE


  debugDrawPointSvg(drawFlag ,posX, posY, svgRoot) {

    if(svgRoot) {
      if(drawFlag) {
        // DRAW
        let pnt = document.createElementNS(this.nsSvg, 'circle')

        pnt.classList.add('DEBUG-DRAWPOINT')
        pnt.setAttribute('cx', Math.floor(posX))
        pnt.setAttribute('cy', Math.floor(posY))
        pnt.setAttribute('r', 1)
        pnt.setAttribute('fill', '#FF0000')

        svgRoot.appendChild(pnt)
      } else {
        // REMOVE
        let debugElems = document.querySelector(".DEBUG-DRAWPOINT")
        if(debugElems) {
          debugElems.forEach( elm => {
            elm.remove()
          })
        }
      }

    } else {

      if(drawFlag) {
        let tempSvgRoot = document.createElementNS(this.nsSvg, 'svg')
        let pnt = document.createElementNS(this.nsSvg, 'circle')

        pnt.classList.add('DEBUG-DRAWPOINT')
        pnt.setAttribute('cx', Math.floor(posX))
        pnt.setAttribute('cy', Math.floor(posY))
        pnt.setAttribute('r', 1)
        pnt.setAttribute('fill', '#FF0000')

        document.body.appendChild(tempSvgRoot)
        tempSvgRoot.appendChild(pnt)

        document.body.prepend(tempSvgRoot)

      } else {
        // REMOVE
        let debugElems = document.querySelector(".DEBUG-DRAWPOINT")
        if(debugElems) {
          debugElems.forEach( elm => {
            elm.remove()
          })
        }
      }
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

  transferDataStore(dtStore, localStore) {

    this.dataStore = dtStore
    this.localStore = localStore
  }

  mousePointToSVGPoint(event) {


    return this.screenPointToSVGPoint( this.groupSvg.parentElement, event.target, event.clientX, event.clientY )

  }

}


export {Handle}
