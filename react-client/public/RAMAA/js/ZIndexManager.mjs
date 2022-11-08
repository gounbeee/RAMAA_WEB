'use strict'


class ZIndexManager {

  constructor(settings) {
    //-// console.log('%% ZIndexManager.mjs :: ZIndexManager CONSTRUCTOR EXECUTED')
    this.svgRoot = document.getElementById('canvas_dom')
    this.elemAllList = this.svgRoot.children
    this.groupId = settings.groupId
    this.zIndex
    this.drawObj


    // -----------------------------------------------------------------
    // HANDLING EVENTS

    this.updateZIndEvHnd = (ev) => {

      //ZIndexManager.refreshAllSvg()


      //-// console.log(ev.detail.obj)
      this.drawObj = ev.detail.obj
      this.elemAllList = this.svgRoot.children
      let zIndexFrom = parseInt(ev.detail.zIndexFrom)
      let zIndexTo = parseInt(ev.detail.zIndexTo)
      let changePlus = ev.detail.changePlus

      // BELOW SHOULD BE EXECUTED ONLY ONCE BECAUSE WE HAVE THIS
      // TO ALL OBJECT
      if( this.groupId === this.drawObj.getGroupId()) {

        // console.log('----------- INDEX ------------')
        // console.log('-NOW WE WILL ADJUSTING ZINDEX-')
        // console.log(`zIndexFrom ::  ${zIndexFrom}`)
        // console.log(`zIndexTo ::  ${zIndexTo}`)
        // console.log(`changePlus ::  ${changePlus}`)
        // console.log(`id ::  ${this.drawObj.getGroupId()}`)


        // if(changePlus === true) {
        //   this.svgRoot.insertBefore(this.elemAllList[zIndexTo], this.elemAllList[zIndexFrom])
        // } else if(changePlus === false) {
        //   this.svgRoot.insertBefore(this.elemAllList[zIndexFrom], this.elemAllList[zIndexTo])
        // } else if( changePlus === undefined ) {
        // }




        // RE-ALIGNING ELEMENTS IN ARRAY
        for(let i=1; i < this.elemAllList.length; i++) {

          // CHANGE INDICES EXCLUDING THE CURRENTLY MODIFIED ELEM
          // < Z INDICES >
          // SCENARIO 1
          // 0 1 2 3 4 5 6 7 ...
          //   f     t                :: changePlus = true +
          //   ------>
          //     2 3 4
          //   v v v   (-1)
          //   1 2 3
          //
          // SCENARIO 2
          // 0 1 2 3 4 5 6 7 ...
          //   f t                    :: changePlus = true +
          //   -->
          //     2
          //     v     (-1)
          //   1
          //
          // SCENARIO 3
          // 0 1 2 3 4 5 6 7 ...
          //             f t          :: changePlus = true +
          //             -->
          //               7
          //               v     (-1)
          //             6
          // SCENARIO 4
          // 0 1 2 3 4 5 6 7 ...
          //             t f            :: changePlus = false -
          //             <--
          //             6
          //             v-v      (+1)
          //               7
          //
          // SCENARIO 5
          // 0 1 2 3 4 5 6 7 ...
          //   t     f                 :: changePlus = false -
          //   <------
          //   1 2 3
          //   v v v      (+1)
          //     2 3 4
          //
          // SCENARIO 6
          // 0 1 2 3 4 5 6 7 ...
          //   t f                     :: changePlus = false -
          //   <--
          //   1
          //   v         (+1)
          //     2


          //-// console.log(`ELEM ID ::   ${this.elemAllList[i].id}    -     ZINDEX :: ${this.elemAllList[i].dataset.zIndex}`)

          // THIS ALGORITHM CALCULATES ASCENDING OR DESCENDING ZINDEX,
          // 'EXCEPT' THE CHANGED ELEMENT!
          // SO BELOW'S IF STATEMENT HAS !== OPERATOR
          if(changePlus === true && this.elemAllList[i].id !== this.groupId) {
            if(zIndexFrom <= parseInt(this.elemAllList[i].dataset.zIndex) && parseInt(this.elemAllList[i].dataset.zIndex) <= zIndexTo) {
              // IN THIS RANGE OF ELEMENTS,
              // IT NEEDS TO BE -1 (LOWERED BY CURSOR ELEMENT)
              let newIndex = i - 1
              //-// console.log(`   ~~~~~~~~~~~~~~~~~   CURRENT PROCESS INDEX ::    ${i}    ----      INDEX AFTER SHIFTING ::    ${newIndex}`)
              this.elemAllList[i].dataset.zIndex = newIndex

              let shiftCount = this.elemAllList[i].dataset.zIndex - i

              //-// console.log(shiftCount)

              if(shiftCount < 0) {
                this.svgRoot.insertBefore(this.elemAllList[i], this.elemAllList[i-1])
              }
            }

          } else if(changePlus === false && this.elemAllList[i].id !== this.groupId) {

            // **** NOTE : TO AVOID 'DOUBLE CALCULATION OF ALREADY SHIFTED ELEMENT'
            //             OPERATOR IS CHANGED TO '<' NOT '<='
            if(zIndexTo <= parseInt(this.elemAllList[i].dataset.zIndex) && parseInt(this.elemAllList[i].dataset.zIndex) < zIndexFrom) {
              // IN THIS RANGE OF ELEMENTS,
              // IT NEEDS TO BE +1
              let newIndex = i + 1
              //-// console.log(`   ~~~~~~~~~~~~~~~~~   CURRENT PROCESS INDEX ::    ${i}    ----      INDEX AFTER SHIFTING ::    ${newIndex}`)
              this.elemAllList[i].dataset.zIndex = newIndex

              let shiftCount = this.elemAllList[i].dataset.zIndex - i

              //-// console.log(shiftCount)

              if(shiftCount > 0) {
                this.svgRoot.insertBefore(this.elemAllList[i+1], this.elemAllList[i])
              }

            }
          }
        }       // END OF FOR LOOP


        // UPDATING DATASET Z-INDEX
        if(changePlus === true) {
          this.drawObj.group.dataset.zIndex = parseInt(this.drawObj.group.dataset.zIndex) + 1
        } else if(changePlus === false) {
          this.drawObj.group.dataset.zIndex = parseInt(this.drawObj.group.dataset.zIndex) - 1
        } else if( changePlus === undefined ) {
          this.drawObj.group.dataset.zIndex = parseInt(this.drawObj.group.dataset.zIndex)
        }

      }
    }

    document.body.addEventListener('updateZIndex', this.updateZIndEvHnd)



  }

  static refreshAllSvg() {


    this.svgRoot = document.getElementById('canvas_dom')
    this.elemAllList = this.svgRoot.children

    // CHECK LOCAL STORAGE OBJECT'S LENGTH
    // THEN ONLY THAT COUNTER FULFILLED,
    // DO THE BELOW
    let str = localStorage
    // < GETTING LENGTH OF OBJECT >
    // https://stackoverflow.com/questions/5223/length-of-a-javascript-object
    //-// console.log(`LOCAL STORAGE COUNTS ::::      ${Object.keys(str).length}`)

    const storageCount = Object.keys(str).length

    let shapeCount = 0

    // < FILTERING ELEMENTS FROM STORAGE >
    // IF LOCAL STORAGE IS NOT EMPTY...
    if(Object.keys(str).length > 0) {
      for(let keyName in str) {
        // TO RETRIEVE SVG outerHTML STRINGS ONLY
        // WE USE '-' LETTER FILTERING
        // (WE HAVE 'FUNCTIONS' EITHER WITH THIS APPROACH)
        if(keyName.includes('-') && !keyName.includes('anim') && !keyName.includes('attrbox')) {
          shapeCount++
        }
      }
    }




    // < Z-SORTING IS ONLY NEEDED WHEN EVERY ELEMENTS IS GATHERED >
    if(shapeCount === this.elemAllList.length-1) {


      // --------------------------------------------------------
      // < SEARCHING RECT ELEMENT AND SEPERATED FROM ORIGINAL LIST >
      const searchedSeperated = this.searchTagSeperateElems('rect', this.elemAllList)
      let rectElem = searchedSeperated.searched
      this.elemAllList = searchedSeperated.seperated
      
      // --------------------------------------------------------
      // < CHECK NOT-EXISTED INDEX LIST >
      const notExistedIndexList = this.getNotExistedIndex(this.elemAllList)


      // --------------------------------------------------------
      // < CHECK DOUBLED-ZINDEX >
      const doubledZIndexObjList = this.getDoubledZIndexList(this.elemAllList)


      // --------------------------------------------------------
      // < CHECK ZERO INDEX LIST >
      const zeroZIndexObjList = this.getZeroZIndexElemList(this.elemAllList)


      // --------------------------------------------------------
      // < 1. FIX DOUBLED + ZERO INDEXED ELEMENT >
      this.elemAllList = this.fixDoubledZeroElem(this.elemAllList, zeroZIndexObjList, doubledZIndexObjList)


      // --------------------------------------------------------
      // < 2. FIX NOT-EXISTED INDEX ELEMENT >
      this.elemAllList = this.fixNoneExistedElem(this.elemAllList, notExistedIndexList)




      // --------------------------------------------------------
      // < START SORTING >
      let sortedKeys = []
      let sortedObj = {}

      for(let i=1; i < this.elemAllList.length+1; i++) {
        //-// console.log(this.elemAllList[i])

        // SEARCHING ELEMENT WHICH HAS SAME VALUE OF
        // ITS Z-INDEX AND "INDEX NUMBER" OF THIS LOOP
        for(let s=1; s < this.elemAllList.length+1; s++) {
          if(parseInt(this.elemAllList[s-1].dataset.zIndex) === i) {
            sortedObj[i] = this.elemAllList[s-1]
            sortedKeys.push(i)
          }
        }
      }

      // console.log(this.elemAllList)
      // console.log(sortedObj)
      // console.log(sortedKeys)


      // sortedKeys CAN BE RESETTED ALIGNED FASHION !
      // for(let s=1; s <= this.elemAllList.length; s++) {
      //   console.log(s)
      //   sortedKeys[s-1] = s
      //   if(s === this.elemAllList.length -1 ) this.elemAllList[s].dataset.zIndex = s


      // }

      // console.log(this.elemAllList)
      // console.log(sortedObj)
      // console.log(sortedKeys)


      for(let i=sortedKeys.length-1; i >= 0 ; i--){

        for(let key in sortedObj) {

          let k = parseInt(key)

            //console.log(key)// = k

          if(sortedKeys[i] === k) {

            this.svgRoot.insertBefore( sortedObj[key], this.elemAllList[0] )
            //console.log(k)
          }


        }
      }


      // console.log(this.elemAllList)
      // console.log(sortedObj)
      // console.log(sortedKeys)




      // -------------------------------------------------------
      // RESTORE RECT CANVAS ELEMENT
      this.svgRoot.insertBefore( rectElem, this.elemAllList[0] )

    }

  }


  // --------------------------------------------------------
  // < FIX NOT-EXISTED INDEX ELEMENT >
  static fixNoneExistedElem (elemList, notExistedIndexList) {

    const elemCount = elemList.length

    for(let i=1; i < notExistedIndexList.length+1; i++) {
      elemList[elemCount-i].dataset.zIndex = notExistedIndexList[i-1]
    }
      
    return elemList
  }


  // --------------------------------------------------------
  // < FIX DOUBLED + ZERO INDEXED ELEMENT >
  static fixDoubledZeroElem (elemList, zeroList, doubleList) {
    let elemListLastIndex = elemList.length

    // FIXING ZERO LIST FIRST
    // :: GIVING LAST INDEX NUMBER TO THEM
    for(let elem of zeroList) {

      // SEARCHING THAT ELEMENT IN ORIGINAL LIST AND FIX
      for(let originalElem of elemList) {
        if( elem === originalElem) {
          originalElem.dataset.zIndex = elemListLastIndex
          elemListLastIndex++
        }
      }
    }

    // FIXING DOUBLED-INDEXED ELEMENTS
    // :: GIVING LAST INDEX NUMBER TO THEM
    for(let elem of doubleList) {
      // SEARCHING THAT ELEMENT IN ORIGINAL LIST AND FIX
      for(let originalElem of elemList) {
        if( elem === originalElem) {
          originalElem.dataset.zIndex = elemListLastIndex
          elemListLastIndex++
        }
      }
    }

    return elemList

  }





  static getZeroZIndexElemList(elemList) {

    let zeroZIndexList = []
    for(let i=0; i < elemList.length; i++) {

      if(parseInt(elemList[i].dataset.zIndex) === 0 && elemList[i].tagName === 'g') {
        zeroZIndexList.push(elemList[i])
      }
    }

    return zeroZIndexList

  }




  static getDoubledZIndexList(elemList) {
    let sameZIndexList = []
    for(let i=0; i < elemList.length; i++) {

      // SEARCHING DOUBLED ZINDEX
      let sameCounter = 0
      for(let j=0; j < elemList.length; j++) {

        // 2. CHECKING DOUBLED
        if(parseInt(elemList[i].dataset.zIndex) === parseInt(elemList[j].dataset.zIndex)) {
          sameCounter++
        }
      }

      // 3. IF COUNTER IS OVER THAN 1 => DOUBLED
      if(sameCounter > 1) {
        sameZIndexList.push(elemList[i])
      }
    }

    return sameZIndexList

  }




  static getNotExistedIndex(elemList) {

    // < CHECK NOT-EXISTED INDEX >
    let notExistedIndexList = []
    let allZs = []
    let maxIndex = 0
    for(let i=0; i < elemList.length; i++) {
      allZs.push(parseInt(elemList[i].dataset.zIndex))
    }

    
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
    maxIndex = Math.max(...allZs)

    for(let i=1; i <= maxIndex; i++) {
      if(!allZs.includes(i) && i !== 0) {
        notExistedIndexList.push(i)
      }
    }

    return notExistedIndexList
  }





  static searchTagSeperateElems(tagName, elemList) {
    // STORING TARGET ELEMENT
    let targetElem

    for(let i=0; i < elemList.length; i++) {
      // 1. EXCLUDING <rect> (CANVAS RECTANGLE) 
      if(elemList[i].tagName === tagName) {
        // SETTING RECTANGLE CANVAS'S Z-INDEX SHOULD BE 0
        elemList[i].dataset.zIndex = 0

        // STORING TARGET ELEMENT
        targetElem = elemList[i]

        // DELETE RECTANGLE CANVAS ELEMENT
        elemList[i].remove()
      }
    }

    return { searched: targetElem, seperated: elemList }

  }




  remove() {

    document.body.removeEventListener('updateZIndex', this.updateZIndEvHnd)

    this.drawObj = undefined
    this.elemAllList = undefined

  }



  getIndex(id) {

    let elem = document.getElementById(id)
    let elemList = this.svgRoot.children
    let currentIndex

    for(let i=0; i < elemList.length; i++) {
      if(elemList[i] === elem) {
        currentIndex = i
      }
    }

    return currentIndex
  }


  getAllElemList() {

    // ACCESS TO ROOT SVG ELEMENT, AND GET LIST

    //-// console.log(this.svgRoot.children)


  }



}


export {ZIndexManager}
