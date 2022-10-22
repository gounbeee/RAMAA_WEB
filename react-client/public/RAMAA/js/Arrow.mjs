'use strict'


import { Handle } from "./Handle.mjs"
import { Timeline } from "./Timeline.mjs"
import { RMMath } from "./RMMath.mjs"



class Arrow {

  constructor(settings) {

    // FORWARD DECLARATION
    this.nsSvg = 'http://www.w3.org/2000/svg'

    // TARGET DOM
    this.target = settings.target

    // DOM OBJECT
    this.svgDom = document.createElementNS(this.nsSvg, 'path')

    this.svgTriangle = document.createElementNS(this.nsSvg, 'polygon')

    this.triSize = 20

    // ID
    this.id = settings.id

    // --------------------------------------------
    // HANDLES
    // 1. LOADING FROM LOCAL STORAGE
    // 2. NEWLY CREATED
    if(settings.isStored) {
      this.handles = {
        A: new Handle({
          isStored: true,
          id: settings.target.id + "_A",
          target: settings.target,
          evAttrbox: settings.evAttrbox,
          rx: 20,
          ry: 20,
          lineWidth: 1,
          posRect_posX: settings.hndA_posRect_posX,
          posRect_posY: settings.hndA_posRect_posY,
          rotCirA_posX: settings.hndA_rotCirA_posX,
          rotCirA_posY: settings.hndA_rotCirA_posY,
          rotCirB_posX: settings.hndA_rotCirB_posX,
          rotCirB_posY: settings.hndA_rotCirB_posY
        }),
        B: new Handle({
          isStored: true,
          id: settings.target.id + "_B",
          target: settings.target,
          evAttrbox: settings.evAttrbox,
          rx: 15,
          ry: 15,
          lineWidth: 1,
          posRect_posX: settings.hndB_posRect_posX,
          posRect_posY: settings.hndB_posRect_posY,
          rotCirA_posX: settings.hndB_rotCirA_posX,
          rotCirA_posY: settings.hndB_rotCirA_posY,
          rotCirB_posX: settings.hndB_rotCirB_posX,
          rotCirB_posY: settings.hndB_rotCirB_posY,
        }),
        C: new Handle({
          isStored: true,
          id: settings.target.id + "_C",
          target: settings.target,
          evAttrbox: settings.evAttrbox,
          rx: 15,
          ry: 15,
          lineWidth: 1,
          posRect_posX: settings.hndC_posRect_posX,
          posRect_posY: settings.hndC_posRect_posY,
          rotCirA_posX: settings.hndC_rotCirA_posX,
          rotCirA_posY: settings.hndC_rotCirA_posY,
          rotCirB_posX: settings.hndC_rotCirB_posX,
          rotCirB_posY: settings.hndC_rotCirB_posY,
        })
      }
    } else {
      // HANDLES
      this.handles = {
        A: new Handle({
          isStored: false,
          id: settings.target.id + "_A",
          target: settings.target,
          evAttrbox: settings.evAttrbox,
          rx: 20,
          ry: 20,
          lineWidth: 1,
          posX: settings.x,
          posY: settings.y
        }),
        B: new Handle({
          isStored: false,
          id: settings.target.id + "_B",
          target: settings.target,
          evAttrbox: settings.evAttrbox,
          rx: 15,
          ry: 15,
          lineWidth: 1,
          posX: settings.x + 200,
          posY: settings.y + 50
        }),
        C: new Handle({
          isStored: false,
          id: settings.target.id + "_C",
          target: settings.target,
          evAttrbox: settings.evAttrbox,
          rx: 15,
          ry: 15,
          lineWidth: 1,
          posX: settings.x + 400,
          posY: settings.y
        })
      }
    }

    this.fill = settings.fill
    this.opacity = settings.opacity

    this.isFocusing = false

    // ALL PATH DATA FOR SVGDOM
    this.allSvgPath = []

    // TODO:: BELOW IS NOT USING
    this.triangle

    // SETTING VISIBILITY OF HANDLES
    this.setHandleVisibility(false)

    // -------------------------------------------------------
    // FOR VISIBILITY OF HANDLES
    this.resetHandles = () => {
      if(this.isFocusing) {

        //-// console.log('blur')

        // SET THE HOVERING FLAG true
        this.isFocusing = false

        this.handles.A.turnOffEventHandlers()
        this.handles.B.turnOffEventHandlers()
        this.handles.C.turnOffEventHandlers()

        this.handles.A.setAllVisibility(false)
        this.handles.B.setAllVisibility(false)
        this.handles.C.setAllVisibility(false)

        // ALIGNING ORDER
        this.svgDom.before(this.handles.A.getGroup())
        this.svgDom.before(this.handles.B.getGroup())
        this.svgDom.before(this.handles.C.getGroup())

      }
    }

    this.seeHandles = () => {
      //-// console.log('focus')
      if(!this.isFocusing) {
        // SET THE HOVERING FLAG true
        this.isFocusing = true

        this.handles.A.turnOnEventHandlers()
        this.handles.B.turnOnEventHandlers()
        this.handles.C.turnOnEventHandlers()

        // DISPLAY HANDLES
        this.handles.A.setAllVisibility(true)
        this.handles.B.setAllVisibility(true)
        this.handles.C.setAllVisibility(true)

        // ALIGNING ORDER
        this.svgDom.after(this.handles.A.getGroup())
        this.svgDom.after(this.handles.B.getGroup())
        this.svgDom.after(this.handles.C.getGroup())

      }
    }



    // -------------------------------------------------------
    // CREATING EVENTLISTENER FOR ARROW


    // SETTING ARROW OBJECT'CSS TO outline: none; WHEN FOCUSED
    this.svgDom.setAttribute('class', "visible")

    this.workarea = document.getElementById('workarea')



    // SETTING EVENT HANDLER WHEN HANDLER UPDATED THEIR POSITION
    this.workarea.addEventListener('handleUpdated', ev => {
      //-// console.log('ARROW HANDLE MOVED !!!!')
      // UPDATE ARROW'S SHAPE
      this.update()

    }, true)
    // ****** ABOVE FLAG FOR 'CAPTURING MODE' OF EVENT PROPAGATION IS CRITICAL
    // https://blog.logrocket.com/deep-dive-into-event-bubbling-and-capturing/
    // https://javascript.plainenglish.io/3-phases-of-javascript-event-2ff09aa76b03
    // TODO :: TAKE NOTE ABOVE


    this.update()


  }


  // ===========================================
  // PUBLIC API

  // updateHandles() {

  //   for( let name in this.handles ) {
  //     this.handles[name].calcRelPos_RotCirA()
  //     this.handles[name].calcRelPos_RotCirB()
  //   }

  // }

  update() {
    //-// console.log('ARROW IS UPDATING')
    //this.updateHandles()

    // this.handles.A.calcRelPos_RotCirA()
    // this.handles.A.calcRelPos_RotCirB()
    // this.handles.B.calcRelPos_RotCirA()
    // this.handles.B.calcRelPos_RotCirB()
    // this.handles.C.calcRelPos_RotCirA()
    // this.handles.C.calcRelPos_RotCirB()

    let pointsA = this.handles.A.getDrawPoints()
    let pointsB = this.handles.B.getDrawPoints()
    let pointsC = this.handles.C.getDrawPoints()

    //-// console.log(pointsA)

    // DRAW FROM RIGHT POINT OF HANDLE
    this.allSvgPath = [
      `M ${pointsA.right.x},${pointsA.right.y}`,
      `C ${pointsA.rearRightCtl.x},${pointsA.rearRightCtl.y} ${pointsA.rearLeftCtl.x},${pointsA.rearLeftCtl.y} ${pointsA.left.x},${pointsA.left.y}`,
      `S ${pointsB.rearLeftCtl.x},${pointsB.rearLeftCtl.y} ${pointsB.left.x},${pointsB.left.y}`,
      `S ${pointsC.rearLeftCtl.x},${pointsC.rearLeftCtl.y} ${pointsC.left.x},${pointsC.left.y}`,
      `C ${pointsC.frontLeftCtl.x},${pointsC.frontLeftCtl.y} ${pointsC.frontRightCtl.x},${pointsC.frontRightCtl.y} ${pointsC.right.x},${pointsC.right.y}`,
      `S ${pointsB.frontRightCtl.x},${pointsB.frontRightCtl.y} ${pointsB.right.x},${pointsB.right.y}`,
      `C ${pointsB.rearRightCtl.x},${pointsB.rearRightCtl.y} ${pointsA.frontRightCtl.x},${pointsA.frontRightCtl.y} ${pointsA.right.x},${pointsA.right.y}`,
      `Z`
    ]

    this.svgDom.setAttribute('d', this.allSvgPath.join(' '))
    //this.svgDom.setAttribute('fill', this.fill)
    //his.svgDom.style.opacity = this.opacity

    //-// console.log(RMMath.calcSlope2Pt(pointsC.left.x, pointsC.left.y, pointsC.front.x, pointsC.front.y))


    let x1 = parseInt(this.handles.C.line.svgDom.getAttribute('x1'))
    let y1 = parseInt(this.handles.C.line.svgDom.getAttribute('y1'))
    let x2 = parseInt(this.handles.C.line.svgDom.getAttribute('x2'))
    let y2 = parseInt(this.handles.C.line.svgDom.getAttribute('y2'))

    let slope_l = RMMath.calcSlope2Pt(x1, y1, x2, y2)
    let radian_l = Math.atan(slope_l)

    let slope_r = RMMath.calcSlope2Pt(x2, y2, x1, y1)
    let radian_r = Math.atan(slope_r)

    let radian_F

    // NOW WE ARE USING NEAR-0 VALUE WITH CONSTRAINING VALUE
    // SO WE GET LARGE NUMBER WHEN IT CLOSES TO 0
    // -> HERE WE ROUTING TO NEW VALUE CALCULATED
    if(slope_l > 9999 || slope_l < -9999) {
      radian_F = radian_r - Math.PI/2 + Math.PI
    } else {
      radian_F = radian_l - Math.PI/2
    }

    //-// console.log(`slope_l::   ${slope_l}   ---  slope_r::   ${slope_r}`)
    
    //-// console.log(`radian_l::   ${radian_l}   ---  radian_r::   ${radian_r}   ---  radian_F::   ${radian_F}`)
    //-// console.log(`radian_F::   ${radian_F}`)


    this.trianglePath = [
      `${pointsC.left.x},${pointsC.left.y - this.triSize}`,
      `${pointsC.front.x + this.triSize},${pointsC.front.y}`,
      `${pointsC.right.x},${pointsC.right.y + this.triSize}`
    ]


    // this.svgTriangle.setAttribute('points', this.trianglePath.join(' '))
    // this.svgTriangle.setAttribute('fill', this.fill)
    // this.svgTriangle.style.opacity = this.opacity
    // //this.svgTriangle.setAttribute('transform', `rotate(${radian_F / Math.PI * 180} 0 0)`)



  }



  create() {


    let pointsA = this.handles.A.getDrawPoints()
    let pointsB = this.handles.B.getDrawPoints()
    let pointsC = this.handles.C.getDrawPoints()

    //-// console.log(pointsA)

    // DRAW FROM RIGHT POINT OF HANDLE
    this.allSvgPath = [
      `M ${pointsA.right.x},${pointsA.right.y}`,
      `C ${pointsA.rearRightCtl.x},${pointsA.rearRightCtl.y} ${pointsA.rearLeftCtl.x},${pointsA.rearLeftCtl.y} ${pointsA.left.x},${pointsA.left.y}`,
      `S ${pointsB.rearLeftCtl.x},${pointsB.rearLeftCtl.y} ${pointsB.left.x},${pointsB.left.y}`,
      `S ${pointsC.rearLeftCtl.x},${pointsC.rearLeftCtl.y} ${pointsC.left.x},${pointsC.left.y}`,
      `C ${pointsC.frontLeftCtl.x},${pointsC.frontLeftCtl.y} ${pointsC.frontRightCtl.x},${pointsC.frontRightCtl.y} ${pointsC.right.x},${pointsC.right.y}`,
      `S ${pointsB.frontRightCtl.x},${pointsB.frontRightCtl.y} ${pointsB.right.x},${pointsB.right.y}`,
      `C ${pointsB.rearRightCtl.x},${pointsB.rearRightCtl.y} ${pointsA.frontRightCtl.x},${pointsA.frontRightCtl.y} ${pointsA.right.x},${pointsA.right.y}`,
      `Z`
    ]

    this.svgDom.setAttribute('d', this.allSvgPath.join(' '))
    this.svgDom.setAttribute('fill', this.fill)
    this.svgDom.style.opacity = this.opacity

    this.target.appendChild(this.svgDom)

    //-// console.log(RMMath.calcSlope2Pt(pointsC.left.x, pointsC.left.y, pointsC.front.x, pointsC.front.y))


    let rslt = {}

    let line_x1 = parseInt(this.handles.C.line.svgDom.getAttribute('x1'))
    let line_y1 = parseInt(this.handles.C.line.svgDom.getAttribute('y1'))
    let line_x2 = parseInt(this.handles.C.line.svgDom.getAttribute('x2'))
    let line_y2 = parseInt(this.handles.C.line.svgDom.getAttribute('y2'))

    let slope_l = RMMath.calcSlope2Pt(line_x1, line_y1, line_x2, line_y2)
    let radian_l = Math.atan(slope_l)

    let slope_r = RMMath.calcSlope2Pt(line_x2, line_y2, line_x1, line_y1)
    let radian_r = Math.atan(slope_r)

    let radian_F

    // NOW WE ARE USING NEAR-0 VALUE WITH CONSTRAINING VALUE
    // SO WE GET LARGE NUMBER WHEN IT CLOSES TO 0
    // -> HERE WE ROUTING TO NEW VALUE CALCULATED
    if(slope_l > 9999 || slope_l < -9999) {
      radian_F = radian_r - Math.PI/2 + Math.PI
    } else {
      radian_F = radian_l - Math.PI/2
    }

    //-// console.log(`radian_l::   ${radian_l}   ---  radian_r::   ${radian_r}   ---  radian_F::   ${radian_F}`)

    // this.trianglePath = [
    //   `${pointsC.left.x},${pointsC.left.y - this.triSize}`,
    //   `${pointsC.front.x + this.triSize},${pointsC.front.y}`,
    //   `${pointsC.right.x},${pointsC.right.y + this.triSize}`
    // ]

    // this.svgTriangle.setAttribute('points', this.trianglePath.join(' '))
    // this.svgTriangle.setAttribute('fill', this.fill)
    // this.svgTriangle.style.opacity = this.opacity
    // this.target.appendChild(this.svgTriangle)
    // this.svgTriangle.after(this.svgDom)




    // SETTING ID TO DOM
    this.setSvgId(this.id)

  }



  calRelPos_Handles() {
    this.handles.A.calcRelPos_RotCirA()
    this.handles.A.calcRelPos_RotCirB()
    this.handles.B.calcRelPos_RotCirA()
    this.handles.B.calcRelPos_RotCirB()
    this.handles.C.calcRelPos_RotCirA()
    this.handles.C.calcRelPos_RotCirB()
  }


  setHandleVisibility(flag) {

    this.handles.A.setAllVisibility(flag)
    this.handles.B.setAllVisibility(flag)
    this.handles.C.setAllVisibility(flag)


  }


  // RETURN ALL HTML DOM TO OUTSIDE
  getDomList() {

    let domlist = []

    // GETTING DOMs FROM HANDLES
    domlist = this.handles.A.getDomList().concat(this.handles.B.getDomList()).concat(this.handles.C.getDomList())

    domlist.push(this.svgDom)

    return domlist

  }


  remove() {
    this.isFocusing = false
    this.allSvgPath = []
    this.setHandleVisibility(false)


    this.svgDom.remove()

    this.resetHandles()
    this.handles.A.remove()
    this.handles.B.remove()
    this.handles.C.remove()

  }


  // ===========================================
  // INTERNAL USAGE

  setSvgId(id) {
    this.svgDom.setAttribute('id', id)
  }



}


export {Arrow}
