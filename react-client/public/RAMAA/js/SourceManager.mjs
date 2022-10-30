'use strict'

import { StateMachine }           from "./StateMachine.mjs"
import { StateEditting }          from "./StateEditting.mjs"
import { LocalStorageManager }    from "./LocalStorageManager.mjs"



class SourceManager {


  constructor() {
    //-// console.log('%% SourceManager.mjs :: SourceManager CONSTRUCTOR EXECUTED')
  }


  loadFromJson(data, stateObj) {
    //-// console.log("%% SourceManager.mjs :: MENU - saveToJson BUTTON CLICKED")

    // 1. OPEN DIALOG BOX TO SELECT FILE
    // DONE AT StateEditting.mjs : 239

    // 2. PARSE THE INPUT (JSON FILE)
    const parsedJson = JSON.parse(data)

    // WE DO NOT NEED FILE NAME ANYMORE
    delete parsedJson['fileName']
    //-// console.log(parsedJson)

    // 3. OVERWRITE CURRENT ANIMTION TIMELINE

    // DELETE ALL SHAPES, ANIMATIONS AND LOCAL STORAGES
    //let stateEditting = new StateEditting()
    stateObj.remove()

    // LOAD NEW DATA TO STORAGE
    let newStore = localStorage

    for ( let keyName in parsedJson) {
      newStore.setItem(keyName, JSON.stringify(parsedJson[keyName]))
    }


    // USING STATEMACHINE, POP CURRENT STATE AND RE-START
    let stateMachineSM = new StateMachine()
    //stateMachineSM.changeState('EDITTING')

    stateMachineSM.popState()

    // ROUTE TO NEXT STATE ACCORDING TO stateObj
    let stateName
    switch(stateObj.name) {
      case 'moving':
        stateName = 'MOVING'
      break
      case 'editting':
        stateName = 'EDITTING'
      break
      case 'boardgame':
        stateName = 'BOARDGAME'
      break

    }
    stateMachineSM.changeState(stateName)

  }




  saveToJson(settings, objData) {
    //-// console.log("%% SourceManager.mjs :: MENU - saveToJson BUTTON CLICKED")

    let fn = settings.fileName
    objData.fileName = fn


    console.log(document.getElementById('_csrfLandingPage').value)
    const csrfToken = document.getElementById('_csrfLandingPage').value


    //-// console.log('1. BEFORE FETCH')
    fetch('/save-to-json', {

        method: 'POST',
        mode: 'cors',
        headers: new Headers({
          'Content-Type': 'application/json',
          'CSRF-Token'  : csrfToken                   // **** IMPORTANT !
        }),
        body: JSON.stringify(objData, undefined, 2),
      })
      .then( (response) => {
        //-// console.log('2. RESPONSED FROM SERVER')
        //-// console.log(response)
        return response.json()
      })
      .then( (data) => {
        //-// console.log('3. SUCCESSED IN THE CLIENT')
        //-// console.log('Success:', JSON.stringify(data, undefined, 2))

        // < PRETTY JSON FORMAT>
        // http://jsfiddle.net/KJQ9K/554/
        this.download(data.fileName, JSON.stringify(data, undefined, 2))
      })
      .catch( (error) => {
        //-// console.log('Error:' , error)
      })


    //
    // const csrfJsonSend = async () => {
    //
    //   //-// console.log('1. BEFORE PROMISE')
    //   await new Promise( (resolve, reject) => {
    //
    //     const csrfResult = fetch('/get-token', {
    //   	  cache: 'no-store' // just in case
    //     })
    //     //-// console.log('2. CSRF REQUEST')
    //     return csrfResult
    //
    //   }).then( result => {
    //
    //     const csrfJSON = result.json()
    //     //-// console.log('3. CSRF DONE')
    //     return csrfJSON
    //
    //
    //   }).then( result => {
    //
    //     //-// console.log('4. BEFORE FETCH')
    //     fetch('/save-to-json', {
    //
    //         method: 'POST',
    //         headers: new Headers({
    //           'content-type': 'application/json',
    //           'CSRF-Token'  : result.csrfToken
    //         }),
    //         body: JSON.stringify(objData),
    //       })
    //       .then( function (response) {
    //         response.json()
    //       })
    //       .then( data => {
    //         //-// console.log('Success:', data)
    //       })
    //       .catch((error) => {
    //         //-// console.log('Error:' , error)
    //       })
    //     //-// console.log('5. FETCH DONE')
    //
    //   })
    //
    //   //-// console.log('6. EVERYTHING DONE')
    //
    // }
    //
    //
    // csrfJsonSend()

  }




  // < SAVING FILE WITH DIALOG >
  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
  }





}


export { SourceManager }
