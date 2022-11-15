'use strict'

import { ColorManager } from "./ColorManager.js"



class Timeline {

  constructor(setting) {
    //-// console.log('%% Timeline.js :: Timeline CONSTRUCTOR EXECUTED')

    this.colorManager = new ColorManager()

    this.attrName = setting.attrName
    this.keyframes = []
    this.keyframes.push(setting.keyframes)

    this.duration = setting.duration

    this.time = setting.time
    this.timePercent = "0%"

    this.nowValue = 0

    this.currentValue = {
      attrName: this.attrName,
      timePercent: this.timePercent,
      value: this.nowValue,
      time: 0,  // TODO
    }

  }


  addKeyframe(setting) {
    this.keyframes.push(setting.keyframes)
    return this
  }



  getResult(when) {

    if(when === undefined) {
      return this.currentValue
    } else if(typeof when === 'string') {
      // IF PERCENTAGE VALUE WAS INPUTTED...
      this.currentValue.timePercent = this.trimPercentage(when)
      this.currentValue.value = this.interpolate(when)
      this.currentValue.time = this.convertPerToVal(when) / 100 * this.duration

      return this.currentValue

    } else if(typeof when === 'number') {

      // IF THE INPUT IS NOT STRING AND NOT PERCENTAGE
      //-// console.log('NUMBER VALUE PASSED')
      this.currentValue.time = when

      // ** IF YOU USE BELOW YOU WILL GET MORE ROUGHER ANIMATION
      //this.currentValue.timePercent = Math.floor(this.currentValue.time / this.duration * 100) + '%'
      this.currentValue.timePercent = parseFloat(this.currentValue.time) / this.duration * 100.0 + '%'
      this.currentValue.timePercent = this.trimPercentage(this.currentValue.timePercent)
      // INTERPOLATING VALUE WITH PERCENTAGE VALUE
      this.currentValue.value = this.interpolate(this.currentValue.timePercent)

      //-// console.log(this.currentValue.value)

      return this.currentValue
    }
  }







  // =================================================
  // INTERNAL USAGES


  // FOR CHECKING CURRENT 'WHEN' VALUE IS OUT OF KETFRAME AREA
  checkOutside(when) {
    // CURRENT PERCENTAGE TO NUMBER TYPE
    let perVal = this.convertPerToVal(when)

    // FIND PREVIOUS AND NEXT KEYFRAME IF WE HAVE
    let pvsKeyframe = this.findPrevKeyFrame(when)
    let nxtKeyframe = this.findNextKeyFrame(when)

    // CHECK THE CASE pvsKeyframe AND nxtKeyframe IS SAME
    // WHICH MEANS THAT perVal IS 'OUTSIDE' OF THE KETFRAME AREA
    let outArea = false
    if(pvsKeyframe === nxtKeyframe) {
      outArea = true
    }

    // CHECKING THE AREA WHERE THE CURRENT 'WHEN' VALUE IS LOCATED
    // LOWER? OR HIGHER?
    // WE DO NOT CARE WHICH ONE USES
    let lowerOrHigher
    if(parseInt(pvsKeyframe.when) > perVal) lowerOrHigher = 'HIGHER'
    else if(parseInt(pvsKeyframe.when) < perVal) lowerOrHigher = 'LOWER'
    else {
      // IF perVal IS SAME AS ABOVES
      // RE-INITIALIZE THE FLAGS
      lowerOrHigher = undefined
      outArea = false
    }

    return {
      isOut: outArea,
      area: lowerOrHigher
    }

  }



  interpolateDetail(when) {
    // CURRENT PERCENTAGE TO NUMBER TYPE
    let perVal = this.convertPerToVal(when)

    // FIND PREVIOUS AND NEXT KEYFRAME IF WE HAVE
    let pvsKeyframe = this.findPrevKeyFrame(when)
    let nxtKeyframe = this.findNextKeyFrame(when)


    // CHECK THE CASE pvsKeyframe AND nxtKeyframe IS SAME
    // WHICH MEANS THAT perVal IS 'OUTSIDE' OF THE KETFRAME AREA
    let areaCheck = this.checkOutside(when)

    let colorCheck = false
    if( typeof pvsKeyframe.value === 'string' || typeof nxtKeyframe.value === 'string') {
      if(pvsKeyframe.value.includes('#') || nxtKeyframe.value.includes('#')) {
        colorCheck = true
      }
    }


    // < 1.0 VALUE ADJUSTING IN KEYFRAME >
    // FOR ANIMATION WITH OPACITY, VALUE '1' CAN CAUSE PROBLEM
    // WHICH PASSES TROUGH WITH 'FALSE' VALUE AS RESULT IN THE DECIMALS CHECK

    let decimalCheck = false
    if( typeof pvsKeyframe.value === 'number' || typeof nxtKeyframe.value === 'number') {
      const val = parseFloat(pvsKeyframe.value)
      const decCheck = val % 1

      if(val !== 1 && decCheck !== 0) {
        decimalCheck = true
      } else if(val === 1) {
        decimalCheck = true
      } else {
        decimalCheck = false
      }
    }


    // ------------------------------
    // ROUTE FOR TEXT DATA
    if(!colorCheck && (typeof pvsKeyframe.value === 'string' || typeof nxtKeyframe.value === 'string')) {
      // IF perVal AND ANY OF ABOVE TWO IS IDENTICAL, JUST RETURN THAT VALUE WITHOUT BELOW CALCULATION
      if(perVal === this.convertPerToVal(pvsKeyframe.when)) {
        // IF THE INPUT VALUE IS ALREADY EXISTED AND WAS THE PREVIOUS KEYFRAME
        return pvsKeyframe.value

      } else if ( perVal === this.convertPerToVal(nxtKeyframe.when)) {
        // OR, MATCHED TO NEXT KEYFRMAE
        return nxtKeyframe.value

      } else {

        // IF perVal IS ON THE OUTSIDE OF KEYFRAME AREA,
        if(areaCheck.isOut) {
          // NO NEED TO INTERPOLATE
          // AND WE CAN EXPORT ANY VALUE
          if(areaCheck.area === 'LOWER') return pvsKeyframe.value
          else if(areaCheck.area === 'HIGHER') return nxtKeyframe.value

        } else {
          // WE DO NOT NEED TO INTERPOLATE TEXT DATA !!!!
          // JUST EXPORT PREVIOUS KEYFRAME'S VALUE !!!!
          return pvsKeyframe.value
        }

      }

    } else {
      // ------------------------------
      // FOR NUMERICAL DATA + COLOR + OPACITY

      // IF perVal AND ANY OF ABOVE TWO IS IDENTICAL, JUST RETURN THAT VALUE WITHOUT BELOW CALCULATION
      if(perVal === this.convertPerToVal(pvsKeyframe.when)) {
        // IF THE INPUT VALUE IS ALREADY EXISTED AND WAS THE PREVIOUS KEYFRAME
        return pvsKeyframe.value

      } else if ( perVal === this.convertPerToVal(nxtKeyframe.when)) {
        // OR, MATCHED TO NEXT KEYFRMAE
        return nxtKeyframe.value

      } else {

        // IF perVal IS ON THE OUTSIDE OF KEYFRAME AREA,
        if(areaCheck.isOut) {
          // NO NEED TO INTERPOLATE
          // AND WE CAN EXPORT ANY VALUE
          if(areaCheck.area === 'LOWER') return pvsKeyframe.value
          else if(areaCheck.area === 'HIGHER') return nxtKeyframe.value

        } else {

          // CURRENT TIME IS INSIDE OF THE AREA BETWEEN 2 KEYFRAMES

          // INTERPOLATING VALUE
          let diffWhenRange = this.convertPerToVal(nxtKeyframe.when) - this.convertPerToVal(pvsKeyframe.when)
          let diffWhenNow = perVal - this.convertPerToVal(pvsKeyframe.when)

          if(typeof nxtKeyframe.value === 'number' && !decimalCheck) {
            // FOR INTEGER VALUE

            // IF NUMBER IS INPUTTED, DO AS BELOW
            let diffVal = parseFloat(nxtKeyframe.value) - parseFloat(pvsKeyframe.value)
            let interpolated = parseFloat(diffWhenNow) * diffVal / parseFloat(diffWhenRange) + parseFloat(pvsKeyframe.value)

            return interpolated

          } else if(decimalCheck) {
            // FOR DECIMAL (FLOAT) VALUE

            // IF NUMBER IS INPUTTED, DO AS BELOW
            let diffVal = parseFloat(nxtKeyframe.value) - parseFloat(pvsKeyframe.value)
            let interpolated = parseFloat(diffWhenNow) * diffVal / parseFloat(diffWhenRange) + parseFloat(pvsKeyframe.value)

            return interpolated


          } else if( colorCheck ){

            // IF INPUT VALUE IS COLOR, DO INTERPOLATION PROPERLY
            let nxtColor = this.colorManager.hex2rgb(nxtKeyframe.value)
            let prvColor = this.colorManager.hex2rgb(pvsKeyframe.value)

            let interpolating = this.colorManager.interpolateColor(
              prvColor,
              nxtColor,
              diffWhenNow / diffWhenRange
            )
            let interpolated = this.colorManager.rgb2hex(interpolating)
            return interpolated
          }

        }
      }

    }

  }




  interpolate(when) {
    // CURRENT PERCENTAGE TO NUMBER TYPE
    let perVal = this.convertPerToVal(when)

    // FIND PREVIOUS AND NEXT KEYFRAME IF WE HAVE
    let pvsKeyframe = this.findPrevKeyFrame(when)
    let nxtKeyframe = this.findNextKeyFrame(when)


    // CHECK THE CASE pvsKeyframe AND nxtKeyframe IS SAME
    // WHICH MEANS THAT perVal IS 'OUTSIDE' OF THE KETFRAME AREA
    let areaCheck = this.checkOutside(when)

    let colorCheck = false
    if( typeof pvsKeyframe.value === 'string' || typeof nxtKeyframe.value === 'string') {
      if(pvsKeyframe.value.includes('#') || nxtKeyframe.value.includes('#')) {
        colorCheck = true
      }
    }


    // < 1.0 VALUE ADJUSTING IN KEYFRAME >
    // FOR ANIMATION WITH OPACITY, VALUE '1' CAN CAUSE PROBLEM
    // WHICH PASSES TROUGH WITH 'FALSE' VALUE AS RESULT IN THE DECIMALS CHECK

    let decimalCheck = false
    if( typeof pvsKeyframe.value === 'number' || typeof nxtKeyframe.value === 'number') {
      const val = parseFloat(pvsKeyframe.value)
      const decCheck = val % 1

      if(val !== 1 && decCheck !== 0) {
        decimalCheck = true
      } else if(val === 1) {
        decimalCheck = true
      } else {
        decimalCheck = false
      }
    }


    // ------------------------------
    // ROUTE FOR TEXT DATA
    if(!colorCheck && (typeof pvsKeyframe.value === 'string' || typeof nxtKeyframe.value === 'string')) {
      // IF perVal AND ANY OF ABOVE TWO IS IDENTICAL, JUST RETURN THAT VALUE WITHOUT BELOW CALCULATION
      if(perVal === this.convertPerToVal(pvsKeyframe.when)) {
        // IF THE INPUT VALUE IS ALREADY EXISTED AND WAS THE PREVIOUS KEYFRAME
        return pvsKeyframe.value

      } else if ( perVal === this.convertPerToVal(nxtKeyframe.when)) {
        // OR, MATCHED TO NEXT KEYFRMAE
        return nxtKeyframe.value

      } else {

        // IF perVal IS ON THE OUTSIDE OF KEYFRAME AREA,
        if(areaCheck.isOut) {
          // NO NEED TO INTERPOLATE
          // AND WE CAN EXPORT ANY VALUE
          if(areaCheck.area === 'LOWER') return pvsKeyframe.value
          else if(areaCheck.area === 'HIGHER') return nxtKeyframe.value

        } else {
          // WE DO NOT NEED TO INTERPOLATE TEXT DATA !!!!
          // JUST EXPORT PREVIOUS KEYFRAME'S VALUE !!!!
          return pvsKeyframe.value
        }

      }

    } else {
      // ------------------------------
      // FOR NUMERICAL DATA + COLOR + OPACITY

      // IF perVal AND ANY OF ABOVE TWO IS IDENTICAL, JUST RETURN THAT VALUE WITHOUT BELOW CALCULATION
      if(perVal === this.convertPerToVal(pvsKeyframe.when)) {
        // IF THE INPUT VALUE IS ALREADY EXISTED AND WAS THE PREVIOUS KEYFRAME
        return pvsKeyframe.value

      } else if ( perVal === this.convertPerToVal(nxtKeyframe.when)) {
        // OR, MATCHED TO NEXT KEYFRMAE
        return nxtKeyframe.value

      } else {

        // IF perVal IS ON THE OUTSIDE OF KEYFRAME AREA,
        if(areaCheck.isOut) {
          // NO NEED TO INTERPOLATE
          // AND WE CAN EXPORT ANY VALUE
          if(areaCheck.area === 'LOWER') return pvsKeyframe.value
          else if(areaCheck.area === 'HIGHER') return nxtKeyframe.value

        } else {

          // CURRENT TIME IS INSIDE OF THE AREA BETWEEN 2 KEYFRAMES

          // INTERPOLATING VALUE
          let diffWhenRange = this.convertPerToVal(nxtKeyframe.when) - this.convertPerToVal(pvsKeyframe.when)
          let diffWhenNow = perVal - this.convertPerToVal(pvsKeyframe.when)

          if(typeof nxtKeyframe.value === 'number' && !decimalCheck) {
            // FOR INTEGER VALUE

            // IF NUMBER IS INPUTTED, DO AS BELOW
            let diffVal = parseFloat(nxtKeyframe.value) - parseFloat(pvsKeyframe.value)
            let interpolated = parseFloat(diffWhenNow) * diffVal / parseFloat(diffWhenRange) + parseFloat(pvsKeyframe.value)

            return interpolated

          } else if(decimalCheck) {
            // FOR DECIMAL (FLOAT) VALUE

            // IF NUMBER IS INPUTTED, DO AS BELOW
            let diffVal = parseFloat(nxtKeyframe.value) - parseFloat(pvsKeyframe.value)
            let interpolated = parseFloat(diffWhenNow) * diffVal / parseFloat(diffWhenRange) + parseFloat(pvsKeyframe.value)

            return interpolated


          } else if( colorCheck ){

            // IF INPUT VALUE IS COLOR, DO INTERPOLATION PROPERLY
            let nxtColor = this.colorManager.hex2rgb(nxtKeyframe.value)
            let prvColor = this.colorManager.hex2rgb(pvsKeyframe.value)

            let interpolating = this.colorManager.interpolateColor(
              prvColor,
              nxtColor,
              diffWhenNow / diffWhenRange
            )
            let interpolated = this.colorManager.rgb2hex(interpolating)
            return interpolated
          }

        }
      }

    }

  }


  trimPercentage(percentString) {
    let percentVal = parseFloat(percentString.replace('%',''))

    // ADJUST -X % AND 100 % ~
    if( percentVal >= 100) {
      percentVal = 100
    } else if (percentVal < 0 ) {
      percentVal = 0
    }

    return percentVal + '%'

  }


  convertPerToVal(percent) {
    let trimmedString = this.trimPercentage(percent)
    let parsed = parseFloat(trimmedString.replace('%',''))

    return parsed
  }


  collectWhens(){
    let list = []
    this.keyframes.forEach(key => {
      list.push(this.convertPerToVal(key.when))
    })

    // < SORTING >
    // https://qiita.com/PianoScoreJP/items/f0ff7345229871039672
    list.sort(function(list,item){
      if( list < item ) return -1
      if( list > item ) return 1
      return 0
    })

    return list
  }


  retrieveValue(when) {
    let result

    if(typeof when === "string") {

      for(let i = 0; i < this.keyframes.length; i++) {
        if( this.keyframes[i].when === when ) result = this.keyframes[i]
      }
    } else {
      //let whenStr = when + "%"
      for(let i = 0; i < this.keyframes.length; i++) {
        if( parseInt(this.keyframes[i].when) === when ) result = this.keyframes[i]
      }
    }

    return result
  }



  findPrevKeyFrame(when) {
    let currentWhen = this.convertPerToVal(when)

    let keyWhenList = this.collectWhens()


    // [0, 20, 100]
    // current -> 99

    // COLLECT KEYFRAME PREVIOUS THAN NOW
    //let count = 0
    let collected = []
    for(let i = 0; i < keyWhenList.length; i++) {
      // IF CURRENT WHEN IS BIGGER THAN keyWhen,
      // keyWhen IS 'PREVIOUS' KEYFRAME

      if(currentWhen > keyWhenList[i]) {
        collected.push(keyWhenList[i])
      } else if(currentWhen === keyWhenList[i]){
        collected.push(currentWhen)
      }

      collected = collected.sort(function (a, b) {  return a - b;  });


    }

    // SORTING
    let prevWhen = collected[collected.length-1]

    // CHECK THE CASE WHEN EVERY 'WHEN' IS BELOW THAN 'currentWhen'
    if(prevWhen === undefined) {
      // SORT 'ORIGINAL' VALUE LIST
      let sorted = keyWhenList.sort(function (a, b) {  return a - b;  })
      // SELECT LOWEST VALUE
      return this.retrieveValue(sorted[0])

    } else {

      // RETRIEVE VALUE FROM ABOVE
      return this.retrieveValue(prevWhen)
    }

  }


  findNextKeyFrame(when) {
    let currentWhen = this.convertPerToVal(when)

    let keyWhenList = this.collectWhens()

    // COLLECT KEYFRAME PREVIOUS THAN NOW
    let collected = []
    for(let i = 0; i < keyWhenList.length; i++) {
      // IF CURRENT WHEN IS SMALLER THAN keyWhen,
      // keyWhen IS 'NEXT' KEYFRAME
      if(currentWhen < keyWhenList[i]) {
        collected.push(keyWhenList[i])
      } else if(currentWhen === keyWhenList[i]) {
        // WHEN CURRENT TIME PERCENTAGE IS MATCHED TO KEYFRAME'S TIME...
        collected.push(currentWhen)
      }
    }

    // SORTING
    collected = collected.sort(function (a, b) {  return a - b;  })

    // RETURN FIRST ONE
    let nextWhen = collected[0]

    // CHECK THE CASE WHEN EVERY 'WHEN' IS BELOW THAN 'currentWhen'
    if(nextWhen === undefined) {
      // SORT 'ORIGINAL' VALUE LIST
      let sorted = keyWhenList.sort(function (a, b) {  return a - b;  })
      // SELECT HIGHEST VALUE
      return this.retrieveValue(sorted[sorted.length-1])

    } else {

      // RETRIEVE VALUE FROM ABOVE
      return this.retrieveValue(nextWhen)
    }


  }


}



export {Timeline}
