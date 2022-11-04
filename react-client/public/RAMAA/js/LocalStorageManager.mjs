'use strict'

import { DrawFactory }          from "./DrawFactory.mjs"



class LocalStorageManager {


  constructor(){
    //-// console.log('%% LocalStorageManager.mjs :: LocalStorageManager CONSTRUCTOR EXECUTED')


    this.nsSvg = 'http://www.w3.org/2000/svg'

    this.idList = []

    this.storeTarget = document.getElementById('canvas_dom')

    // FACTORY FOR DRAWING
    this.drawFactory = new DrawFactory().initialize()



    this.storeLocalBrowser = (ev) => {

      //-// console.log(`$$$$$=  LocalStorageManager.mjs ::    STORING LOCAL DATA TO BROWSER !!`)

      let newStore = localStorage
      newStore.setItem(ev.detail.id, JSON.stringify(ev.detail))

      //
      // // https://stackoverflow.com/questions/237104/how-do-i-check-if-an-array-includes-a-value-in-javascript
      // if(this.idList.indexOf(ev.detail.id) < 0) {
      //   //-// console.log(`$$$$$= FOLLOWING WILL BE ADDED TO LOCAL STORAGE ----   ${ev.detail.id}`)
      //   this.idList.push(ev.detail.id)
      //
      //   let newStore = localStorage
      //   newStore.setItem(ev.detail.id, JSON.stringify(ev.detail))
      // } else {
      //   //-// console.log(`       ALREADY EXISTS IN LOCAL STORAGE ----   ${ev.detail.id}`)
      // }


    }


    // 0. SETTING EVENT DISPATCHER TO EVERY SINGLE INSTRUCTION TO HERE
    // 1. EVENT LISTENTING AT HERE
    document.body.addEventListener('DATASTORE-LOCAL', this.storeLocalBrowser)


  }


  loadFromStorage() {

    let str = localStorage
    // < GETTING LENGTH OF OBJECT >
    // https://stackoverflow.com/questions/5223/length-of-a-javascript-object
    //-// console.log(`LOCAL STORAGE COUNTS ::::      ${Object.keys(str).length}`)

    let strFiltered = {}

    
    console.log(str)



    if(Object.keys(str).length > 0) {
      for(let keyName in str) {
        // TO RETRIEVE SVG outerHTML STRINGS ONLY
        // WE USE '-' LETTER FILTERING
        // (WE HAVE 'FUNCTIONS' EITHER WITH THIS APPROACH)



        if(keyName.includes('-')) {

          console.log(keyName)

          strFiltered[keyName] = JSON.parse(str[keyName])



        }
      }
    }

    return strFiltered

  }



  restoreShape(stateObj) {
    // ----------------------------------------------------------------
    // RESTORE DATA FROM LOCAL STORAGE
    // :: IF THERE IS MORE THAN ONE ITEM,
    //    WE LOAD THEM

    //let stateEdittingSM = new StateEditting()


    let str = localStorage
    // < GETTING LENGTH OF OBJECT >
    // https://stackoverflow.com/questions/5223/length-of-a-javascript-object
    //-// console.log(`LOCAL STORAGE COUNTS ::::      ${Object.keys(str).length}`)

    if(Object.keys(str).length > 0) {
      for(let keyName in str) {
        // TO RETRIEVE SVG outerHTML STRINGS ONLY
        // WE USE '-' LETTER FILTERING
        // (WE HAVE 'FUNCTIONS' EITHER WITH THIS APPROACH)
        // +
        // EXCLUDE ANIMATION LOCAL STORAGE DATA
        // +
        // EXCLUDE ATTRBOX LOCAL STORAGE DATA
        if(keyName.includes('-') && !keyName.includes('anim') && !keyName.includes('attrbox')) {
          // console.log(keyName)
          // console.log(str[keyName])
          // console.log(JSON.parse(str[keyName]))

          stateObj.addRenderObject(JSON.parse(str[keyName]), stateObj)

        }
      }

      // ---------------------------------------------------
      // < LAZY LOADING FOR CONNECTIONS >
      // 
      // AFTER LOAD FROM LOCAL STORAGE,
      // WE NEED TO GET REAL ELEMENT FOR CONNECTION

      // DATA FOR CONNECTION IS STRING IN LOCAL STORAGE,
      // BUT WE NEED ACTUAL DOM OBJECT

      console.log(stateObj.renderListAll)
      for( let grpId in stateObj.renderListAll ) {
        console.log("grpId")
        console.log(grpId)
        console.log(stateObj.renderListAll)
        console.log(Object.keys(stateObj.renderListAll[grpId].connections).length)


        for( let grpIdConnected in stateObj.renderListAll[grpId].connections) {

          if(grpIdConnected !== '' ) {

            console.log("grpIdConnected")
            console.log(grpIdConnected)
            stateObj.renderListAll[grpId].connections[grpIdConnected] = document.getElementById(grpIdConnected)

            console.log(stateObj.renderListAll[grpId].connections[grpIdConnected])

            stateObj.renderListAll[grpId].makeConnections()

          }
      

        }


      }




    }
  }




  remove() {
    localStorage.clear()
    document.body.removeEventListener('DATASTORE-LOCAL', this.storeLocalBrowser)
  }




  // getStorageLength()
  //   let str = localStorage
  //   // < GETTING LENGTH OF OBJECT >
  //   // https://stackoverflow.com/questions/5223/length-of-a-javascript-object
  //   //-// console.log(Object.keys(str).length)
  //   return Object.keys(str).length
  // }

    //
    // settingObject(settings) {
    //
    //
    //
    // }

}



export {LocalStorageManager}
