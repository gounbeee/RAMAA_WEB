'use strict'

// gesource.jp/weblog/?p=7629
//import {MouseState} from "./MouseState.mjs"


class Draggable {

  static create( id_svg, el_id) {
    const newItem = new Draggable(id_svg)

    el_id.forEach( function (id) {
      newItem.addElement(id)
    })
  }



  constructor (id_svg) {
    //-// console.log('%% Draggable.mjs :: Draggable CONSTRUCTOR EXECUTED')

    // THE ELEMENT WE PICKED
    this.dragElement = null
    // POSITION
    this.offsetX = 0
    this.offsetY = 0

    // < ANCHOR COORDINATES >
    //
    // id_svg IS THE ROOT ELEMENT OF SVG OBJECT
    // -> <svg> ELEMENT
    this.svg = document.getElementById(id_svg)
    this.svg.addEventListener("mousedown", ev => this.mouseMove(ev), false)
    //this.svg.addEventListener("touchmove", ev => this.mouseMove(ev), false)
    this.svg.addEventListener("mouseup", ev => this.mouseUp(ev), false)
    //this.svg.addEventListener("touchend", ev => this.mouseUp(ev), false)

    // STATES RELATED ON MOUSE
    //this.mouseState = new MouseState()



  }



  addElement(id_el) {
    // < DRAGGING COORDINATES >

    const domElem = document.getElementById( id_el )

    domElem.addEventListener("mousedown", ev => this.mouseDown(ev), false)
    //domElem.addEventListener("touchstart", ev => this.mouseDown(ev), false)
    domElem.addEventListener("mousemove", ev => this.mouseMove(ev), false)
    //domElem.addEventListener("touchmove", ev => this.mouseMove(ev), false)
    domElem.addEventListener("mouseup", ev => this.mouseUp(ev), false)
    //domElem.addEventListener("touchend", ev => this.mouseUp(ev), false)

  }


  screenPointToSVGPoint(svg, elem, x, y) {
    const p = svg.createSVGPoint()
    p.x = x
    p.y = y

    const CTM = elem.getScreenCTM()

    return p.matrixTransform( CTM.inverse() )
  }


  mousePointToSVGPoint(event) {

    return this.screenPointToSVGPoint( this.svg, this.dragElement, event.clientX, event.clientY )

  }


  mouseDown(event) {

    // SETTING MOUSESTATE
    //this.mouseState.turnOn('clicked')

    //const ev = (event.type === "mousedown") ? event : event.changedTouches[0];
    const ev = event

    this.dragElement = ev.target

    const p = this.mousePointToSVGPoint(ev)
    this.offsetX = Math.floor( p.x - this.dragElement.getAttribute("x") )
    this.offsetY = Math.floor( p.y - this.dragElement.getAttribute("y") )


    ev.preventDefault()

  }

  mouseUp(event) {
    // SETTING MOUSESTATE
    //this.mouseState.turnOn('released')

    this.dragElement = null
  }


  mouseMove(event) {
    if( !this.dragElement ) return

    // SETTING MOUSESTATE
    //this.mouseState.turnOn('dragging')

    //const ev = (event.type === "mousemove") ? event : event.changedTouches[0]
    const ev = event

    const p = this.mousePointToSVGPoint(ev)
    this.dragElement.setAttribute("x", Math.floor( p.x - this.offsetX ))
    this.dragElement.setAttribute("y", Math.floor( p.y - this.offsetY ))

    ev.preventDefault()




  }

}



export {Draggable}
