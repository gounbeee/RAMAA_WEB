'use strict'



class LocalStorage {


  constructor(settings){
    //-// console.log('%% LocalStorage.js :: LocalStorage CONSTRUCTOR EXECUTED')

    this.domToEvDispatch = settings.evDispatcher

  }


  saveToLocalStr(data) {
    let evDataSave = new CustomEvent('DATASTORE-LOCAL', {
      bubbles: true,
      detail: data
    })

    this.domToEvDispatch.dispatchEvent(evDataSave)

  }




}



export {LocalStorage}
