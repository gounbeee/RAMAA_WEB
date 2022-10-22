'use strict'

import { State }                from "./State.mjs"
import { DrawFactory }          from "./DrawFactory.mjs"
import { ModalManager }         from "./ModalManager.mjs"



class StateMoving extends State {

  constructor(name) {
    //-// console.log('%% StateMoving.mjs :: StateMoving CONSTRUCTOR EXECUTED')
    super(name)

    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }

    this.constructor.instance = this

  }



  initialize() {
    //-// console.log('%% StateMoving.mjs :: initialize FUNCTION EXECUTED')


    this.world = {
      size: { width: 10000,
              height: 10000 }
    }

    this.worlds
    this.walker
    this.walkers


    // FACTORY FOR DRAWING
    this.drawFactory = new DrawFactory().initialize()


    // CREATING ModalManager OBJECT
    this.modalManager = new ModalManager()





    // HIDE NOT-USING AREA
    document.getElementById('attribManager_wrapper').style.display = 'none'
    document.getElementById('toolbox_wrapper').style.display = 'none'
    document.getElementById('footer_wrapper').style.display = 'none'
    document.getElementById('menu_create').style.display = 'none'
    document.getElementById('menu_source').style.display = 'none'





    // ------------------------------------------------
    // SETTING UP INITIAL VISIBILITIES (MENU LISTBOX)

    let aboutDialog = document.getElementById("menu_about_dialog")
    aboutDialog.style.display = 'none'

    let createDialog = document.getElementById("menu_create_dialog")
    createDialog.style.display = 'none'

    let sourceDialog = document.getElementById("menu_source_dialog")
    sourceDialog.style.display = 'none'


    this.aboutBtnConfigClick = ( event ) => {
      //-// console.log("%% StateEditting.mjs :: MENU - aboutBtnConfigClick BUTTON CLICKED")
    }

    this.aboutBtnCollabClick = (event) => {
      //-// console.log("%% StateEditting.mjs :: MENU - aboutBtnCollabClick BUTTON CLICKED")

      // SEND REQUEST TO NEW PAGE !
    }

    this.aboutBtnClick = (event) => {
      event.stopPropagation()

      //-// console.log("%% StateEditting.mjs :: MENU - ABOUT BUTTON CLICKED")
      let aboutDialog = document.getElementById("menu_about_dialog")
      if(aboutDialog.style.display === "none") {
        aboutDialog.style.display = 'block'
      } else {
        aboutDialog.style.display = 'none'
      }

      //TURNING OFF OTHER DIALOGS
      let createDialog = document.getElementById("menu_create_dialog")
      if(createDialog.style.display !== 'none') createDialog.style.display = 'none'
      let sourceDialog = document.getElementById("menu_source_dialog")
      if(sourceDialog.style.display !== 'none') sourceDialog.style.display = 'none'
    }

    this.aboutBtnAboutClick = (ev) => {
      this.modalManager.modalList.about.open()
    }

    // SETTING UP MENU BUTTONS (ITEMS)
    this.aboutBtn = document.getElementById("menu_logo_btn")
    this.aboutBtn.addEventListener("click", this.aboutBtnClick )

    this.aboutBtnAbout = document.getElementById("menu_about")
    this.aboutBtnAbout.addEventListener("click", this.aboutBtnAboutClick )

    this.aboutBtnConfig = document.getElementById("menu_config")
    this.aboutBtnConfig.addEventListener("click", this.aboutBtnConfigClick )

    this.aboutBtnCollab = document.getElementById("menu_collab")
    this.aboutBtnCollab.addEventListener("click", this.aboutBtnCollabClick )












  }





  remove() {






  }






  update() {
    //-// console.log('%%  StateMoving.js : update FUNCTION EXECUTED')


  }


  // RENDER ELEMENT 'IF IT IS UPDATED'
  render() {
    //-// console.log('%%  StateMoving.js : render FUNCTION EXECUTED')


  }



  onEnter() {
    //-// console.log(`%%  StateMoving.js : onEnter FUNCTION OF ==  ${this.name}  ==  EXECUTED`)
    this.initialize()
  }


  onExit() {
    //-// console.log(`%%  StateMoving.js : onExit FUNCTION OF ==  ${this.name}  == EXECUTED`)


  }





}



export {StateMoving}
