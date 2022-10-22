'use strict'



class DraggableScreen {


  constructor() {
    //-// console.log('%% DraggableScreen.mjs :: DraggableScreen CONSTRUCTOR EXECUTED')
    this.dragObj
    this.screenDrag

    this.mouseupHandler

    this.xPos
    this.yPos

    this.mutationMonitor

    this.canSetScreen = true 

  }



  setScreen(settings) {

    if(!this.canSetScreen) return


    // SETTING DRAG OBJECT
    this.dragObj = settings.dragObj
    // CREATING ADDITIONAL DIV UNDER THE ABOVE OBJECT
    this.screenDrag = document.createElement('div')
    this.screenDrag.id = 'SCREENDRAG'
    this.screenDrag.classList.toggle("fullscreen")

    // MOUSEUP HANDLER
    this.mouseupHandler = settings.mouseupHandler


    document.body.appendChild(this.screenDrag)


    // --------------------------------------------------
    // SETTING TRIMMING AREA
    // LIKE 'PADDING'
    this.trim = {
      left: settings.left,
      down: settings.down
    }
    for(let direction in this.trim) {
      if(!this.trim[direction]) this.trim[direction] = 0
    }

    // --------------------------------------------------
    // MUTATION OBSERVER SETTING
    // this.mutationHandler = (mutationList, observer) => {
    //   for(const mutation of mutationList) {
    //     if( mutation.type === 'attributes' ) {
    //       //-// console.log(`${mutation.attributeName}   WAS MODIFIED`)
    //       //-// console.log(`${mutation.target.getAttribute(mutation.attributeName)}   WAS MODIFIED`)
    //
    //
    //     }
    //   }
    // }

    this.mutationHandler = settings.mutationHandler

    this.mutationObserver = new MutationObserver(this.mutationHandler)


    const observerConfig = {
      attributes: true,
      subtree: false
    }

    this.mutationObserver.observe(this.screenDrag, observerConfig)


    // --------------------------------------------------
    // CREATING ADDITIONAL DIV TO ANCHOR Z ALIGNMENT
    //this.anchorObj = document.createElement('div')
    //this.anchorObj.id = 'TEMP-ANCHOR'


    // Z-ALIGN

    // BRING ANCHOR DOM TO CURRENT POSITION
    //this.anchorObj.after(this.dragObj)

    // BRING TWO ELEMENTS TO
    document.body.prepend(this.screenDrag)


    // ------------------------------------------------
    // EVETNT LISTENERS

    this.screenDragEvHnd_md = (ev) => {
      //-// console.log('%% DraggableScreen.mjs :: SCREEN MOUSE DOWN !!!')


    }

    this.screenDragEvLsn_md = () => {
      this.screenDrag.addEventListener('mousedown', this.screenDragEvHnd_md)
    }

    this.screenDragEvLsn_md_rem = () => {
      this.screenDrag.removeEventListener('mousedown', this.screenDragEvHnd_md)
    }


    this.screenDragEvHnd_mv = (ev) => {
      //console.log('%% DraggableScreen.mjs :: SCREEN MOUSE MOVING !!!')
      this.xPos = ev.clientX - this.trim.left
      this.yPos = ev.clientY - this.trim.down

      //console.log(`%% DraggableScreen.mjs :: MOUSE X POSITION ::  ${this.xPos}  Y POSITION ::  ${this.yPos}`)

      // SETTING ATTRIBUTE TO this.screenDrag DOM
      // BECAUSE WE WANT TO USE MUTATION OBSERVER (NEED TO CHANGE DOM ATTRIBUTE)
      this.screenDrag.dataset.xPos = this.xPos
      this.screenDrag.dataset.yPos = this.yPos

    }

    this.screenDragEvLsn_mv = () => {
      this.screenDrag.addEventListener('mousemove', this.screenDragEvHnd_mv)
    }

    this.screenDragEvLsn_mv_rem = () => {
      this.screenDrag.removeEventListener('mousemove', this.screenDragEvHnd_mv)

    }

    this.screenDragEvHnd_mu = (ev) => {
      //-// console.log('%% DraggableScreen.mjs :: SCREEN MOUSE UP !!!')

      // WHEN MOUSE WAS UP, WE CAN RUN BELOW FUNCTION
      if(this.mouseupHandler) this.mouseupHandler(this.dragObj)

      this.screenDragEvLsn_mv_rem()
      this.screenDragEvLsn_md_rem()
      this.screenDragEvLsn_md_rem()
      this.unsetScreen()


    }

    this.screenDragEvLsn_mu = () => {
      this.screenDrag.addEventListener('mouseup', this.screenDragEvHnd_mu)

    }

    this.screenDragEvLsn_mu_rem = () => {
      this.screenDrag.removeEventListener('mouseup', this.screenDragEvHnd_mu)

    }


    // ----------------------------------------------------------------------
    // STARTING FROM MOUSE DOWN EVENT LISTENER
    // **** EVENT LISTENING IS LOOPING...
    this.screenDragEvLsn_md()
    this.screenDragEvLsn_mv()
    this.screenDragEvLsn_mu()

  }








  getPos() {
    return {x: this.xPos, y: this.yPos}

  }




  turnOnEventHandlers() {
    this.screenDragEvLsn_md()
    this.screenDragEvLsn_mv()
    this.screenDragEvLsn_mu()


  }


  turnOffEventHandlers() {
    this.screenDragEvLsn_md_rem()
    this.screenDragEvLsn_mv_rem()
    this.screenDragEvLsn_mu_rem()

  }



  unsetScreen() {
    //-// console.log('~~~~~~ UNSET SCREEN DRAG ~~~~~')
    this.remove()
    this.mutationObserver.disconnect()
    this.mutationHandler = undefined
    this.mutationObserver = undefined
  }


  remove() {
    this.dragObj = undefined
    this.screenDrag.remove()

  }





}





export {DraggableScreen}
