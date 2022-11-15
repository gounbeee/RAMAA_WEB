'use strict'


class TextArea {

  constructor() {

    // FORWARD DECLARATION
    this.nsSvg = 'http://www.w3.org/2000/svg'
    this.textLnFeed
    this.text
    this.width
    this.height
    this.posX
    this.posY
    this.lineCount
    this.tspans = []
    this.lineMargin
    this.lnFeedIndexes = []
    this.lnFeedSym = "&#13;&#10;"
    this.fontSize
    this.fill
    this.opacity
    this.fontName

  }

  initialize(settings) {
    this.id = settings.id
    this.text = settings.text
    this.width = settings.width
    this.height = settings.height
    this.posX = settings.x
    this.posY = settings.y
    this.lineMargin = settings.lineMargin
    this.lineCount = 0
    this.fill = settings.fill
    this.opacity = settings.opacity
    this.fontName = settings.fontName

    // SEARCHING LINEFEED SYMBOL "&#13;&#10;"


    this.txtLineArray = []


    // UNTIL EVERY MATCHED SYMBOL IS DELETED

    // SPLIT () FUNCTION
    // https://stackoverflow.com/questions/3568921/how-to-remove-part-of-a-string
    this.txtLineArray = this.text.split(this.lnFeedSym)



    // -----------------------------------------------------------------
    // CREATING <text> TAG
    this.txt = document.createElementNS(this.nsSvg, 'text')



    // -----------------------------------------------------------------
    // < USING TSPAN TO IMPLEMENT 'TEXTAREA' >
    //
    // CREATING <tspan> TAGS DERIVED FROM THE LINE COUNT WE CALCULATED


    // SET CSS CLASS
    this.txt.classList.add("svg", "textarea")


    // -----------------------------------------------------------------
    // < getUpdateStyles() FUNCTION >
    // WILL RETURN :: 
    //   fontSize: fontSize,
    //   oneLineTxtCount: oneLineTxtCount,
    //   textLnFeed: textLnFeed
    let styleResult = this.getUpdateStyles(this.txt, this.fontName, this.width, this.txtLineArray)
    this.fontSize =  styleResult.fontSize
    this.oneLineTxtCount = styleResult.oneLineTxtCount
    this.textLnFeed = styleResult.textLnFeed


    // -----------------------------------------------------------------
    // CREATE TSPAN WITH LINEFEEDED TEXT ARRAY
    this.createTspans(undefined)

    // APPLYING FONT
    this.applyFont(this.fontName)


    // // AFTER WE CREATED TSPANS, WE CAN KNOW THE ENTIRE HEIGHT
    // this.width = this.txt.
    // this.height = this.fontSize * this.textLnFeed.length + this.lineMargin * this.textLnFeed.length


    // UPDATING FONT SIZE AFTER APPLYING FONT
    //this.updateFontSize()

    //return this.tspans
    return this

  }



  getUpdateStyles(textarea, fontName, width, txtLineArray) {

    // WE APPEND CHILD BECAUSE WE WANT TO GET CSS OBJECT BELOW
    let tempDom = document.body.appendChild(textarea)

    tempDom.style.fontFamily = fontName

    // GETTING FONT SIZE
    let fontSize = parseInt(this.getFontSize(tempDom))

    // CALCULATING TEXT COUNTS FOR 1 LINE USING FONT SIZE
    let oneLineTxtCount = this.getOneLnTxtCount(width, fontSize)

    // FOR EVERY LINES, (SPLITTED BY LINEFEEDING)
    // SPECIFY ADDTIONAL LINE FEEDING WITH FONT-SIZE (OVERFLOW TO NEXT LINE)
    let textLnFeed = this.getSubLines(txtLineArray, oneLineTxtCount)

    document.body.removeChild(tempDom)

    return {
      fontSize: fontSize,
      oneLineTxtCount: oneLineTxtCount,
      textLnFeed: textLnFeed
    }

  }




  applyFont(fontName) {

    // < APPLYING WEB FONTS >
    // https://wpqw.jp/snippet/webfont/
    for(let tspn of this.tspans) {

      tspn.classList.add("svg", "tspans")
      tspn.style.fontFamily = fontName

    }

  }



  // < SPLITTING TO NEW LINE WITH FONT SIZE AND SIZE OF TEXT AREA >
  // FOR EVERY LINES, (SPLITTED BY LINEFEEDING)
  // SPECIFY ADDTIONAL LINE FEEDING WITH FONT-SIZE (OVERFLOW TO NEXT LINE)
  getSubLines(array, limit) {

    // CLONING ARRAY WITH ES6 WAY
    // https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array/
    let targetArray = [...array]
    let tempArray = [...array]

    let loopCount = 0


    for( let i = 0; i < tempArray.length ; i++) {

      let lineCopy = tempArray[i]

      // IF COUNT OF CHARACTERS IN EACH LINE
      // EXCEEDS THE LIMIT,
      // INSERT THE PORTION TO NEW SLOT IN ARRAY
      while( lineCopy.length > limit ) {
        let newLine = lineCopy.slice(0, limit)

        // INSERT NEW LINES TO TARGET TEXT ARRAY
        targetArray.splice(loopCount, 0, newLine)

        // DELETE THE MATCHED PORTION
        lineCopy = lineCopy.slice(limit, lineCopy.length)

        loopCount++
      }

      // ATTACH LAST PORTION
      targetArray.splice(loopCount, 0, lineCopy)

      // DELETE ORIGINAL LINE
      targetArray.splice(loopCount+1, 1)

      // STORE LINEFEEDED INDEX
      this.lnFeedIndexes.push(loopCount)

      // THIS IS REQUIRED TO ADJUST INDEX FOR NEXT SENTENCE
      loopCount++
    }

    return targetArray

  }




  setLineFeedIndex() {

    // ATTACH CUSTOM PROPERTY ABOUT 'LINE FEEDED INDEX' IN TSPAN LIST
    for( let i = 0; i < this.lnFeedIndexes.length - 1; i++ ) {
      // WE NEED TO INSERT CUSTOM FEED INDEX TO 'NEXT' TSPAN ELEMENT
      this.tspans[this.lnFeedIndexes[i] + 1].dataset.enter = true
    }


  }



  updateTransform() {
    // GETTING CURRENT WIDTH, HEIGHT, POSITION X AND Y
    // THEN UPDATE THIS OBJECT

    return this.updateText(this.text, 0)

  }



  updateText(newText, cursorLoc) {

    // RESET LINE FEED INDEX
    this.lnFeedIndexes = []

    // SET REFERENCE TO CLASS VARIABLE
    this.text = newText

    // INPUT CURSOR SEEMS TO COUNT '\n' AS 1 LETTER
    // SO WE NEED TO ADJUST THAT
    //let adjustedCursor = this.adjustCursor(cursorLoc, this.lnFeedSym, this.text)


    // SPLIT () FUNCTION
    // https://stackoverflow.com/questions/3568921/how-to-remove-part-of-a-string
    let txtLineArray = []
    txtLineArray = this.text.split(this.lnFeedSym)


    let parentOfTspan

    if(this.tspans[0]) parentOfTspan = this.tspans[0].parentElement
    else throw new Error("THERE IS AN ERROR WITH RESET THIS TEXTAREA !")


    // GETTING FONT SIZE
    this.fontSize = parseInt(this.getFontSize( parentOfTspan ))



    // CALCULATING TEXT COUNTS FOR 1 LINE USING FONT SIZE
    this.oneLineTxtCount = this.getOneLnTxtCount(this.width, this.fontSize)


    // FOR EVERY LINES, (SPLITTED BY LINEFEEDING)
    // SPECIFY ADDTIONAL LINE FEEDING WITH FONT-SIZE (OVERFLOW TO NEXT LINE)
    this.textLnFeed = this.getSubLines(txtLineArray, this.oneLineTxtCount)


    // ------------------------------------------------------------
    // CURSOR LOCATION IN THE TSPAN ARRAY
    //
    // RETURN::
    // delta: 6   // TEXT LOCATION IN
    // index: 4   // ARRAY INDEX
    //let crsLocObj = this.searchCursor(this.textLnFeed, adjustedCursor)

    //let test = this.textLnFeed[crsLocObj.index]



    //-// console.log(`**** BEFORE ::   ${this.posX}`)


    // UPDATING CURRENT xPos AND yPos
    // this.xPos = parseInt(this.tspans[0].getAttribute('x'))
    // this.yPos = parseInt(this.tspans[0].getAttribute('y'))
    //


    // //-// console.log(this.tspans[0].getAttribute('x'))
    // let oldPositions = []
    // for(let i=0; i < this.tspans.length; i++) {
    //   oldPositions.push(
    //     {
    //       x: Math.floor(parseInt(this.tspans[i].getAttribute('x'))),
    //       y: Math.floor(parseInt(this.tspans[i].getAttribute('y')))
    //     }
    //   )
    // }




    // -----------------------------------------------------------------
    // < METHOD 1 :: SIMPLE DELETE AND RE-CREATE >
    // GETTING PARENT AND DELETE INNTER HTML
    // let parentOfTspan = this.tspans[0].parentElement
    // parentOfTspan.innerHTML = ''
    //
    // this.tspans = []
    this.resetTspans()

    //-// console.log(`**** AFTER RESET ::   ${this.posX}`)


    // -----------------------------------------------------------------
    // CREATE TSPAN WITH LINEFEEDED TEXT ARRAY
    this.createTspans()

    // APPLYING FONT
    this.applyFont(this.fontName)

    // UPDATING FONT SIZE AFTER APPLYING FONT
    //this.updateFontSize()


    //-// console.log(`**** AFTER CREATE ::   ${this.posX}`)
    return this


  }



  // GETTING PARENT NODE (TEXT) FROM TSPAN
  // THEN RESET
  resetTspans() {
    let parentOfTspan

    if(this.tspans[0]) parentOfTspan = this.tspans[0].parentElement
    else throw new Error("THERE IS AN ERROR WITH RESET THIS TEXTAREA !")

    parentOfTspan.innerHTML = ''

    this.tspans = []

  }



  updateFontSize() {
    // let parentOfTspan
    // if(this.tspans[0]) parentOfTspan = this.tspans[0].parentElement
    // else throw new Error("THERE IS AN ERROR WITH RESET THIS TEXTAREA !")

    // GETTING FONT SIZE
    this.fontSize = parseInt(this.getFontSize( this.txt ))

  }



  // CREATING SVG-DOM ELEMENT USING TEXT LIST
  createTspans(lineHeight) {

    // -----------------------------------------------------------------
    // CREATE TSPAN WITH LINEFEEDED TEXT ARRAY
    for( let i = 0; i < this.textLnFeed.length; i++) {
      let el = document.createElementNS(this.nsSvg, 'tspan')

      el.setAttribute('id', this.id + '_tspan' + '_' + i)
      
      // *** WE ONLY NEED TO SET THE RELATIVE POSITION FROM GROUP ELEMENT
      el.setAttribute("x", 0)

      el.setAttribute("y", this.fontSize * i + this.lineMargin * i)

      el.setAttribute('fill', this.fill)

      el.style.opacity = this.opacity

      // APPLY THE RESULT FROM getSubLine() FUNCTION
      el.textContent = this.textLnFeed[i]

      this.tspans.push(el)



    }



  }




  // THIS FUNCTION SEARCH THE CURSOR LOCATION AND RETURN
  //   result = {
  //     index: i,          // ARRAY INDEX          ::> SO, IF THE RESULT IS  5
  //     delta: delta       // REMAINED DELTA                                 4
  //   }
  searchCursor(lineObj, cursorLoc) {
    // 0: "WRITE HERE LONG"
    // 1: " LONG "
    // 2: "LaONG SAMPLE "
    // 3: "SENTENCE"


    // -----------------------------------------------------------------
    // UPDATE TSPAN WITH LINEFEEDED TEXT ARRAY
    //
    // USING Cursor INDEX, WE CAN IDENTIFY THE LOCATION EDITTED IN this.textLnFeed
    // OUR CURSOR LOCATION IS CALCUATED WITH SITUATION WE ARE USING 'RAW TEXT' (LINEFEED WITH '\n')

    let accum = 0

    let result = {
      index: 0,
      delta: 0
    }

    for(let index in lineObj) {

      // NARROW DOWN THE CURSOR LOCATION
      let delta = cursorLoc - accum

      if( lineObj[index].length >= delta) {

        //-// console.log(lineArray[i])

        return result = {
          index: parseInt(index),
          delta: delta
        }

      }

      // ONLY INDEX IS 0 -> additional IS 1
      let additional = 0
      if(parseInt(index) === 0) additional = 1
      else additional = 0

      accum += (lineObj[index].length + 1) + additional

    }

    return result

  }




  // TODO :: TAKE NOTE BELOW
  // // ------------------------------------------------------------
  // // SPECIFY POSITION LINEFEED WITH \n (alt + ¥)
  //
  // // < SEARCHING ALL OCCURENCE OF TEXT IN STRING >
  // // https://stackoverflow.com/questions/10710345/finding-all-indexes-of-a-specified-character-within-a-string
  // let domLnFeed = []
  // let i = -1
  // while( (i=domText.indexOf('\n', i+1)) >= 0) domLnFeed.push(i)





  getTextFromTspans(tspanArray) {
    // ------------------------------------------------------------
    // GETTING CONCATENATED TEXT FROM SVG tspan LIST
    let tsAllText = []

    for(let i = 0; i < tspanArray.length; i++) {

      // IF THERE IS enter DATASET ATTRIBUTES
      if(tspanArray[i].dataset.enter === true) tsAllText.push(this.lnFeedSym)

      tsAllText.push(tspanArray[i].textContent)
    }

    // NOW, WE GOT THE CONCATENATED STRINGS FROM SVG-TSPANS
    return tsAllText.join('')

  }







  // < GETTING CURSOR POSITION OF TEXTAREA >
  // https://stackoverflow.com/questions/7745867/how-do-you-get-the-cursor-position-in-a-textarea
  //
  // Use it in your code like this:
  // var cursorPosition = getCursorPos($('#myTextarea')[0])
  static getCursorPos(input) {

    // selectionStart KEY IS ITEM IN THE TEXTAREA ELEMENT
    // WHICH INDICATES STARTING POINT OF SELECTION WE MARKED
    if ("selectionStart" in input && document.activeElement == input) {
      //-// console.log(input.selectionStart)

      return {
          start: input.selectionStart,
          end: input.selectionEnd
      }

    } else if (input.createTextRange) {
      // WHEN WE USED 'SELECTION AREA'

      var sel = document.selection.createRange();

      if (sel.parentElement() === input) {
        var rng = input.createTextRange();
        rng.moveToBookmark(sel.getBookmark());
        for (var len = 0;
          rng.compareEndPoints("EndToStart", rng) > 0;
          rng.moveEnd("character", -1)) {
          len++;
        }

        rng.setEndPoint("StartToStart", input.createTextRange());
        for (var pos = { start: 0, end: len };
          rng.compareEndPoints("EndToStart", rng) > 0;
          rng.moveEnd("character", -1)) {
          pos.start++;
          pos.end++;
        }
        return pos;
      }
    }
    return -1;
  }


  static setCursorPos(input, start, end) {
    if (arguments.length < 3) end = start;
    if ("selectionStart" in input) {
      setTimeout(function() {
        input.selectionStart = start;
        input.selectionEnd = end;
      }, 1);
    }
    else if (input.createTextRange) {
      var rng = input.createTextRange();
      rng.moveStart("character", start);
      rng.collapse();
      rng.moveEnd("character", end - start);
      rng.select();
    }
  }




  // THIS ADJUSTS CURSOR (WHICH INCLUDES ADDITIONAL COUNT FOR '\n')
  // USING COUNTER FOR PATTERN OCCURENCE
  adjustCursor(currentCursor, pattern, text) {
    let movingCursor = 0
    let sliced = text.slice()
    let patternLength = pattern.length
    let count = 0

    // IF THERE IS MATCHED...
    while( sliced.search(pattern) !== -1 ) {
      let searchedLoc = sliced.search(pattern)
      movingCursor += searchedLoc

      // IF NO NEED TO CONTINUE SEARCHING...
      if(movingCursor >= currentCursor) {
        currentCursor -= count
        return currentCursor
      }

      // TRIMMING STRING
      sliced = sliced.substring(searchedLoc + patternLength, sliced.length)
      // THIS IS FOR ADDING THE COUNT FOR '\n'
      movingCursor += 1
      // MAIN LOOP COUNTER
      count++
    }

    // IF THERE IS NO NEED TO ADJUST... ||  IF ALL PATTERNS WERE OCCURED...
    return currentCursor - count

  }







  // DISPLAYING SVG-CURSOR
  drawSvgCursor() {



  }




  remove() {

    // DELETE DOM
    this.txt.remove()


  }





  getOneLnTxtCount(width, fontSize) {
    return Math.floor( width / parseInt(fontSize) )
  }



  getFontSize(txtDom) {
    let txtStyle = getComputedStyle(txtDom)

    return txtStyle.fontSize

  }


  getGroupId() {
    return this.id.split('_')[0]
  }


}




export {TextArea}
