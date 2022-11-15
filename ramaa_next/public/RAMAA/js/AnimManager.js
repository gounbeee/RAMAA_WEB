'use strict'

import {AnimBox}      from "./AnimBox.js"






class AnimManager {

  constructor(selectedObj) {
    //-// console.log('%% AnimManager.js :: AnimManager CONSTRUCTOR EXECUTED')

    this.selectedObj = selectedObj

    this.animBox = new AnimBox(this.selectedObj)



    //-// console.log(this.selectedObj)



    // -------------------------------------------------------
    // < OPENING ATTRIBUTE MANAGER >
    // SETTING EVENT LISTENERS FOR SVG-OBJECTS

    // this.workarea.addEventListener('animManagerOn', (event) => {
    //   //-// console.log(`~~~~   AnimManager :: CUSTOM EVENT - animManagerOn IS TRIGGERED ! event.target IS -- ${event.target.id}`)

    // })



  }



  remove() {
    this.selectedObj = undefined
    this.animBox.remove()


  }




  // FORCE TO INPUT VALUE TO DECIMALS
  // https://stackoverflow.com/questions/38972448/force-input-number-decimal-places-natively
  forceDecimalsOne(event) {
    event.target.value = parseFloat(event.target.value).toFixed(1);
  }

  forceDecimalsTwo(event) {
  	event.target.value = parseFloat(event.target.value).toFixed(2);
  }


}



export {AnimManager}
