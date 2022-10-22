'use strict'


//
class SvgFactory {


  constructor() {
    //-// console.log('%% SvgFactory.mjs :: SvgFactory CONSTRUCTOR EXECUTED')

    this.nsSvg = 'http://www.w3.org/2000/svg'


    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }
    this.constructor.instance = this


  }


  initialize() {
    //-// console.log('%% SvgFactory.mjs :: initialize FUNCTION EXECUTED')
    return this
  }



  createSvgDomLine(setting) {
    let target = setting.target
    let elem = document.createElementNS(this.nsSvg, 'line')
    elem.setAttribute('id', setting.id)
    elem.setAttribute('x1', setting.pointA.posX)
    elem.setAttribute('y1', setting.pointA.posY)
    elem.setAttribute('x2', setting.pointB.posX)
    elem.setAttribute('y2', setting.pointB.posY)
    elem.setAttribute('stroke', setting.lineColor)
    elem.setAttribute('stroke-width', setting.lineWidth)

    target.appendChild(elem)

    return elem
  }

  createSvgDomSquare(setting) {
    let target = setting.target
    let elem = document.createElementNS(this.nsSvg, 'rect')
    elem.setAttribute('id', setting.id)
    elem.setAttribute('x', Math.floor( setting.posX - setting.width/2 ))
    elem.setAttribute('y', Math.floor( setting.posY - setting.width/2 ))
    elem.setAttribute('width', setting.width)
    elem.setAttribute('height', setting.width)
    elem.setAttribute('fill', setting.fill)

    target.appendChild(elem)

    return elem
  }


  createSvgDomRect(setting) {
    let target = setting.target
    let elem = document.createElementNS(this.nsSvg, 'rect')
    elem.setAttribute('id', setting.id)
    elem.setAttribute('x', Math.floor(setting.posX))
    elem.setAttribute('y', Math.floor(setting.posY))
    elem.setAttribute('width', setting.width)
    elem.setAttribute('height', setting.height)
    elem.setAttribute('fill', setting.fill)

    target.appendChild(elem)

    return elem
  }

  createSvgDomRectCentered(setting) {
    let target = setting.target
    let elem = document.createElementNS(this.nsSvg, 'rect')
    elem.setAttribute('id', setting.id)
    elem.setAttribute('x', Math.floor( setting.posX - setting.width/2 ))
    elem.setAttribute('y', Math.floor( setting.posY - setting.height/2 ))
    elem.setAttribute('width', setting.width)
    elem.setAttribute('height', setting.height)
    elem.setAttribute('fill', setting.fill)

    target.appendChild(elem)

    return elem
  }

  createSvgDomCircle(setting) {
    let target = setting.target
    let elem = document.createElementNS(this.nsSvg, 'circle')
    elem.setAttribute('id', setting.id)
    elem.setAttribute('cx', setting.posX)
    elem.setAttribute('cy', setting.posY)
    elem.setAttribute('r', setting.diameter)

    if(setting.fill == "none") {
      elem.setAttribute('fill', 'none')
      elem.setAttribute('stroke', 'blue')
      elem.setAttribute('stroke-width', 3)
    } else {
      elem.setAttribute('fill', setting.fill)
    }

    target.appendChild(elem)

    return elem
  }


  createSvgDomEllipse(setting) {
    let target = setting.target
    let elem = document.createElementNS(this.nsSvg, 'ellipse')
    elem.setAttribute('id', setting.id)
    elem.setAttribute('cx', setting.posX)
    elem.setAttribute('cy', setting.posY)
    elem.setAttribute('rx', setting.rx)
    elem.setAttribute('ry', setting.ry)

    if(setting.fill == "none") {
      elem.setAttribute('fill', 'none')
      elem.setAttribute('stroke', 'blue')
      elem.setAttribute('stroke-width', setting.lnWidth)
    } else {
      elem.setAttribute('fill', setting.fill)
    }

    target.appendChild(elem)

    return elem
  }

  // create(setting) {
  //
  //   switch(setting.type) {
  //     case 'LINE':
  //       return this.createSvgDomLine(setting)
  //
  //     case 'RECTANGLE':
  //         return this.createSvgDomRect(setting)
  //
  //     case 'CIRCLE':
  //         return this.createSvgDomCircle(setting)
  //
  //
  //     default:
  //       throw new Error(`THERE IS NO CHANCE TO DRAW OBJECT LIKE --  ${setting.type}`)
  //
  //   }
  //
  //
  //
  // }





}




export {SvgFactory}
