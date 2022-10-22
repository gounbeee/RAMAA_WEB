'use strict'


import { RMMath }   from "./RMMath.mjs"
import { Slider }   from "./Slider.mjs"
import { Security } from "./Security.mjs"


class SliderDraggable {

  constructor(settings) {
    //-// console.log('%% SliderDraggable.mjs :: SliderDraggable CONSTRUCTOR EXECUTED')

    this.svgId

    if(settings.id) this.svgId = settings.id
    else this.svgId = new Security().getUUIDv4()

    this.target = settings.target            // HTML DOM WRAPPER ELEMENT

    // WIDTH IS 'PERCENT' FORMAT
    this.widthPercentage = parseInt(settings.width.replace('%'))

    this.width =  document.getElementById('footer_wrapper').offsetWidth * this.widthPercentage / 100.0
    this.height = settings.height
    this.posX = settings.posX
    this.posY = settings.posY
    this.lineWidth = settings.lineWidth

    // PERCENTAGE OF WIDTH IN document.getElementById('footer_wrapper').offsetWidth
    //-// console.log(this.widthPercentage)

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



    // MAIN SLIDER
    // THIS IS REQUIRED FOR CURSOR IS LOCATED THE END OF THE SLIDER
    let rightSideMargin = 100                            
    this.sliderLength = this.width - rightSideMargin
    this.svgDom.dataset.sliderLength = this.sliderLength


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
      pointerColor: "#CC6666",
      markerColor: "#66CC66",
      canDrag: settings.canDrag,
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
    }

    window.addEventListener("resize", this.sliderWindowResize)






  }


  remove() {
    window.removeEventListener("resize", this.sliderWindowResize)

    this.slider.remove()
    this.svgDom.remove()
  }



  getSliderLength() {
    return this.sliderLength
  }


  // RETURN ALL HTML DOM TO OUTSIDE
  getDomList() {

    //let domlist = []

    //domlist.push(this.slider.getDomList()[0])

    return this.slider.getDomList()

  }





}




export {SliderDraggable}
