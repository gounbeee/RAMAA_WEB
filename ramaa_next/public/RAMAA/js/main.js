'use strict';

import {RMMain} from "./RMMain.js"

let gl_SCENEINDEX = 0;
let gl_SHIFTKEYPRESSED = undefined;
let gl_SELECTEDLIST = {};


let ramaa_app;



// ENTRY POINT OF THIS APP
(function() {



  document.addEventListener("DOMContentLoaded", ()=>{


    // if ('serviceWorker' in navigator) {
    // window.addEventListener('load', function() {
    //   navigator.serviceWorker.getRegistrations().then(registrations => {
    //      for(let registration of registrations) {
    //          registration.unregister().then(bool => {console.log('unregister: ', bool);});
    //          }
    //          window.location.reload();
    //      });
    //  });
    // }


    ramaa_app = new RMMain()
    ramaa_app.initialize(gl_SCENEINDEX, gl_SHIFTKEYPRESSED, gl_SELECTEDLIST)


  })

})()




window.ramaa_app = RMMain