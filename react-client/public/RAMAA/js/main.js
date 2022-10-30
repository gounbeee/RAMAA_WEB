'use strict';

import {RMMain} from "./RMMain.mjs"

let ramaa_app

// ENTRY POINT OF THIS APP
(function() {
  
  document.addEventListener("DOMContentLoaded", ()=>{
    ramaa_app = new RMMain()
    ramaa_app.initialize()

  })

})()



window.ramaa_app = RMMain