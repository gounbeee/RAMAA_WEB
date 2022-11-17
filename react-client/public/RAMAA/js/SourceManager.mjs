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


  loadFromJsonReact(data, stateObj) {
    //-// console.log("%% SourceManager.mjs :: MENU - saveToJson BUTTON CLICKED")

    console.log(data)


    // 1. OPEN DIALOG BOX TO SELECT FILE
    // DONE AT StateEditting.mjs : 239

    // 2. PARSE THE INPUT (JSON FILE)
    const parsedJson = data

    // WE DO NOT NEED FILE NAME ANYMORE
    delete parsedJson['fileName']
    console.log(parsedJson)

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

    console.log(stateMachineSM)

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




  downloadToFile(content, filename, contentType) {

    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(a.href);

  }


  saveToJson(settings, objData) {
    //-// console.log("%% SourceManager.mjs :: MENU - saveToJson BUTTON CLICKED")

    let fn = settings.fileName
    objData.fileName = fn


    console.log(document.getElementById('_csrfLandingPage').value)
    const csrfToken = document.getElementById('_csrfLandingPage').value

    console.log( JSON.stringify(objData, undefined, 2) )

   
   
    this.downloadToFile( JSON.stringify(objData, undefined, 2) , 'rename_your_file.json', 'json');
    






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
