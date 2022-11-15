'use strict'

// import {AttribBox} from "./AttribBox.js"
// import { TextArea } from "./TextArea.js"



class Collision {
  // const collisionSettings = {
  //   rootDom: this.domRoot,
  //   rootSvg: this.svgRoot,
  //   selectArea: this.marquee,
  //   toBeSelected: this.selectedObj
  // }
  constructor(settings) {
    //-// console.log('%% Collision.js :: Collision CONSTRUCTOR EXECUTED')
    this.rootDom = settings.area.domRoot
    this.rootSvg = settings.area.svgRoot
    this.selectArea = settings.area.marquee.marqRect
    this.toBeSelectedArray = settings.area.indicatorAll
    this.toBeSelectedObj = {}

    // settings.area.indicatorAll IS AN ARRAY 
    // WE NEED TO CONVERT TO OBJECT
    for(let indicator of this.toBeSelectedArray) {
      this.toBeSelectedObj[indicator.id] = indicator
    }


    this.bboxMarquee 
    this.bboxIndicators = {}

    this.bboxIDCollided = {}




    // ============================================================
    // < FROM Marquee.js > 
    // const evForCollision = new CustomEvent('MarqueeCollision', {
    //   bubbles: true,
    //   detail: {
    //     selectAreaObj: this
    //   }
    // })
    this.calcCollision = (ev) => {

      // ========================================================================
      // RESET IF WE NEEDED
      if( Object.keys(this.bboxIndicators).length > 0 ||
          Object.keys(this.bboxIDCollided).length > 0 ) {
        this.resetCurrentCollision()
      } 

      //-// console.log(`MARQUEE COLLISION DETECTION IS EXECUTING --   ${ev.target}`)
      //-// console.log(ev.detail.selectAreaObj)
      //-// console.log(this.toBeSelected)

      // ------------------------------------------------------------
      // 1. GETTING BOUNDING BOX OF MARQUEE AREA
      this.bboxMarquee = ev.detail.selectAreaObj.marqRect.getBBox()

      //-// console.log(this.bboxMarquee)
      //-// console.log(this.toBeSelectedObj)

      // ------------------------------------------------------------
      // 2. GETTING BOUNDING BOX OF POINTERS TO BE SELECTED
      for(let indicator of this.toBeSelectedArray) {
        this.bboxIndicators[indicator.id] = indicator.getBBox()
      }
      
      //-// console.log(this.bboxIndicators)

      // ------------------------------------------------------------
      // 3. SPECIFYING COLLISION
      // :: INDICATORS (STEP 2) CHECK THE COLLISION WITH BOUNDING BOX OF MARQUEE TOOL
      for(let bboxId in this.bboxIndicators) {

        if( this.detectCollision(this.bboxMarquee, this.bboxIndicators[bboxId]) ) {
          this.bboxIDCollided[bboxId] = {
            id: bboxId,
            elems: this.toBeSelectedObj[bboxId]
          }
        }
      }

      // ------------------------------------------------------------
      // 4. SENDING COLLIDED OBJECTS TO AnimBox OBJECT
      const evToAnimBox = new CustomEvent('KeyframesCollided', {
        bubbles: true,
        detail: {
          collided: this.bboxIDCollided
        }
      })
      this.rootSvg.dispatchEvent(evToAnimBox)


    }
    this.selectArea.addEventListener('MarqueeCollision', this.calcCollision, false)


    



  }








  resetCurrentCollision() {
    this.bboxIndicators = {}
    this.bboxIDCollided = {}

  }



  // < COLLISION WITH 2 BBOXES >
  // https://www.inkfood.com/collision-detection-with-svg/
  // **** BUT MY ONE USES SVGRect OBJECT
  detectCollision(rect1, rect2) {

    const rect1_top = rect1.y
    const rect1_bottom = rect1.y + rect1.height
    const rect1_left = rect1.x
    const rect1_right = rect1.x + rect1.width

    const rect2_top = rect2.y
    const rect2_bottom = rect2.y + rect2.height
    const rect2_left = rect2.x
    const rect2_right = rect2.x + rect2.width

    return (
      rect2_top < rect1_bottom && 
      rect1_right > rect2_left &&
      rect1_top < rect2_bottom &&
      rect1_left < rect2_right
      )
  }



  remove() {
    this.bboxIDCollided = {}
    this.bboxIndicators = {}
    this.bboxMarquee = undefined


  }

}



export {Collision}
