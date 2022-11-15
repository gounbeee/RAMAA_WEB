'use strict'





class Keyframe {

  constructor(settings){
    //-// console.log('%% Keyframe.js :: Keyframe CONSTRUCTOR EXECUTED')

    this.when = settings.when

    // ROUTING WITH DATA TYPE (NUMBER OR STRING)
    this.value

    // TYPE CHECK
    if(typeof settings.value === 'number') {
      // IF INPUT VALUE IS NOT INTEGER (DECIMAL)
      if(settings.value % 1 !== 0) {
        this.value = parseFloat(settings.value)
      } else {
        this.value = parseInt(settings.value)
      }

    } else if(typeof settings.value === 'string') {
      this.value = settings.value
    }


  }

  getKeyframe() {
    return {
      when: this.when,
      value: this.value
    }
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




export {Keyframe}
