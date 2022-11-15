'use strict'

import { Draggable } from "./Draggable.js"


class DraggableChildren extends Draggable {

  // OVERWRITE

  static create(anchor_id, grp_id) {
    const newItem = new DraggableChildren(anchor_id)

    grp_id.forEach( function (id) {
      newItem.addElement(id)
    })
  }


  constructor (anchor_id) {
    //-// console.log('%% DraggableChildren.js :: DraggableChildren CONSTRUCTOR EXECUTED')
    super(anchor_id)

    // WE ARE USING SEVERAL offsetX AND Y
    this.offsetXList = []
    this.offsetYList = []

  }



  mouseDown(event) {

    //const ev = (event.type === "mousedown") ? event : event.changedTouches[0];
    const ev = event

    // WE ARE PICKING GROUP ELEMENT
    this.dragElement = ev.target.parentElement

    // GETTING MOUSE POINT
    const p = this.mousePointToSVGPoint(ev)


    // GETTING ALL CHILD ELEMENTS
    let allChilds = this.dragElement.childNodes

    // FOR EVERY CHILDREN ELEMENT BELOW GROUP NODE IN SVG,
    // WE COPY THE VALUE TO OTHERS
    for( let i=0; i < allChilds.length ; i++ ) {

      let retvIdArray = allChilds[i].id.split('_')
      let setting

      if(retvIdArray.includes('rect')) setting = {type: 'rect', attrX: 'x', attrY: 'y'}
      if(retvIdArray.includes('tspan')) setting = {type: 'tspan', attrX: 'x', attrY: 'y'}

      if(setting) {
        this.offsetXList[i] = Math.floor( p.x - parseInt(allChilds[i].getAttribute(setting.attrX)) )
        this.offsetYList[i] = Math.floor( p.y - parseInt(allChilds[i].getAttribute(setting.attrY)) )
      }

    }

    ev.preventDefault()

  }




  mouseMove(event) {
    if( !this.dragElement ) return

    //const ev = (event.type === "mousemove") ? event : event.changedTouches[0]
    const ev = event

    const p = this.mousePointToSVGPoint(ev)


    // GETTING ALL CHILD ELEMENTS
    let allChilds = this.dragElement.childNodes

    for( let i=0; i < allChilds.length ; i++ ) {

      let retvIdArray = allChilds[i].id.split('_')
      let setting

      if(retvIdArray.includes('rect')) setting = {type: 'rect', attrX: 'x', attrY: 'y'}
      if(retvIdArray.includes('tspan')) setting = {type: 'tspan', attrX: 'x', attrY: 'y'}

      if(setting) {
        allChilds[i].setAttribute(setting.attrX, Math.floor( p.x - parseInt(this.offsetXList[i]) ))
        allChilds[i].setAttribute(setting.attrY, Math.floor( p.y - parseInt(this.offsetYList[i]) ))
      }

    }

    ev.preventDefault()

  }




  mousePointToSVGPoint(event) {

    return this.screenPointToSVGPoint( this.svg, this.dragElement, event.clientX, event.clientY )

  }




  //   // -----------------------------------------------------------------
  //   // < SVG transform interface >
  //   // https://developer.mozilla.org/en-US/docs/Web/API/SVGTransformList




}




export { DraggableChildren }
