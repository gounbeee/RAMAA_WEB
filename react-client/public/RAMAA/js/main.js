'use strict';

import {RMMain} from "./RMMain.mjs"



// ENTRY POINT OF THIS APP
(function() {
  let main
  document.addEventListener("DOMContentLoaded", ()=>{
    main = new RMMain()
    main.initialize()

  })

})()
