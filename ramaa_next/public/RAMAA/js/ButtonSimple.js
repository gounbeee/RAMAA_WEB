'use strict'

import { ZIndexManager }    from "./ZIndexManager.js"


class ButtonSimple {

  constructor(settings) {
    //-// console.log('%% ButtonSimple.js :: ButtonSimple CONSTRUCTOR EXECUTED')

    this.nsSvg = 'http://www.w3.org/2000/svg'


    this.groupId = settings.id
    this.opacity = settings.opacity
    this.posX = 0
    this.posY = 0
    this.anchorPosX = 0
    this.anchorPosY = 0

    this.isPlaying = false


    // ------------------------------------
    // CREATE SVG ELEMENT
    this.domTarget = settings.target
    this.svgRoot = document.createElementNS(this.nsSvg, 'svg')
    this.group = document.createElementNS(this.nsSvg, 'g')
    this.svgDom = document.createElementNS(this.nsSvg, 'polygon')

    // APPLYING CSS
    for(let sheetName of settings.stylesheets) {
      this.svgRoot.classList.add(sheetName)
    }


    this.domTarget.appendChild(this.svgRoot)


    // ------------------------------------
    // CREATE ROOT SVG
    this.group.setAttribute("id", this.groupId)

    this.group.setAttribute("transform", `translate( 0, 0)`)
    this.svgRoot.setAttribute("x", 0)
    this.svgRoot.setAttribute("y", 0)
    this.svgRoot.setAttribute("width", settings.width)
    this.svgRoot.setAttribute("height", settings.height)
    this.svgRoot.setAttribute("viewBox", `${0} ${0} ${settings.width} ${settings.height}`)

    this.svgRoot.appendChild(this.group)


    // ------------------------------------
    // CREATE BUTTON
    //this.svgDomPath = "0,0 50,25 0,50"
    this.svgDomPath = settings.pathShape
    this.svgDom.setAttribute('points', this.svgDomPath)
    this.svgDom.setAttribute('x', 0)
    this.svgDom.setAttribute('y', 0)
    this.svgDom.setAttribute('fill', settings.fill)
    this.svgDom.setAttribute("id", this.groupId + '_play')

    this.group.appendChild(this.svgDom)



    this.svgDom.addEventListener("click", settings.clickHnd, false)

    this.enterHnd = (ev) => {
      //-// console.log(`---- SVG-BUTTON ENTERED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      // CHANGE COLOR
      this.svgDom.setAttribute('fill', settings.fillHover)


    }
    this.svgDom.addEventListener("mouseenter", this.enterHnd, false)

    this.leaveHnd = (ev) => {
      //-// console.log(`---- SVG-BUTTON LEAVED ::  ${this.groupId}`)

      ev.stopImmediatePropagation()
      ev.preventDefault()

      this.svgDom.setAttribute('fill', settings.fill)


    }
    this.svgDom.addEventListener("mouseleave", this.leaveHnd, false)




  }




  remove() {
    // REMOVE EVENT LISTENER
    this.svgDom.removeEventListener("click", this.clickPlayHnd, false)
    this.svgDom.removeEventListener("mouseenter", this.enterPlayHnd, false)
    this.svgDom.removeEventListener("mouseleave", this.leavePlayHnd, false)

    // DELETE DOM
    this.svgDom.remove()
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


export { ButtonSimple }
