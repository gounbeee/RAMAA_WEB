'use strict'




class Security {

  constructor() {
    //-// console.log('%% Security.mjs :: Security CONSTRUCTOR EXECUTED')
  }


  // GENERATING UUID
  // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
  //
  // : For an RFC4122 version 4 compliant solution
  //
  // getUUIDv4() {
  // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //   var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //   return v.toString(16);
  // });

  getUUIDv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }




}


export {Security}
