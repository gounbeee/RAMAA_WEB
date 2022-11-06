'use strict'

import { ModalBox }     from "./ModalBox.mjs"
import { ConnectionManager }  from "./ConnectionManager.mjs"


// FOR NOW THIS CLASS HAVE ALL MODALBOX HTML AND JAVASCRIPT!
// TODO :: FOR THE FUTURE, WE WANT TO EXPORT THIS TO DATABASE

class ModalManager {

  constructor(stateObj) {
    //-// console.log('%% ModalManager.mjs :: ModalManager CONSTRUCTOR EXECUTED')


    this.stateObj = stateObj


    this.modalList = {

      about: new ModalBox({
        html: `<div class="modal_box_about">
                <h1>About Gounbeee.com</h1>
                <p>In this website, you can do belows.</p>
                <p> . <b>Writing text</b> (<u> USE Create - TextArea</u>)</p>
                <p> . <b>Drawing</b> (<u> USE Create - Drawing</u>)</p>
                <p> . Mind mapping with <b>basic graphical elements</b> (<u>USE Create Menu</u>)</p>
                <p> . <b>Animating</b> aboves with keyframe system (<u>Keyframe button</u>)</p>
                <p> . <b>Export & Load JSON file</b> to store graphics + animation (<u>Source menu</u>)</p>
                <p> </p>
                <p><u>This website is one of the project in the '<b>Informatic Soma</b>' activities.</u></p>
                <p>'Gounbeee' means 'Beautiful Rain' in Korean word.</p>
                <p>All is done using Javascript + SVG + Canvas.</>
                <p>by Gounbeee 2021</p>
              </div>
              `
      }),

      deleteAll: new ModalBox({
        html: `
              <h1>DELETE ALL OBJECTS ?</h1>
              <button class="modal_btn_yesorno" id="btn_deleteall_yes">Yes</button> 
              <button class="modal_btn_yesorno" id="btn_deleteall_no">No</button>
              `,
        buttons: {
          btn_deleteall_yes: (ev) => {
            //console.log('YES CLICKED')

            let evToState = new CustomEvent('deleteAllObjs', {
              bubbles:true
            })

            document.getElementById('workarea').dispatchEvent(evToState)


          },
          btn_deleteall_no: (ev) => {
            //console.log('NO CLICKED')
            this.modalList.deleteAll.hideBox()
          }
        } 
      }),

      connManager: new ModalBox({
        html: `
              <h1>CREATE CONNECTION WITH TEXTS</h1>
              <h1>Select Multiple Text Area objects first, then click Create button!</h1>
              <button class="modal_btn_yesorno" id="btn_connManager_back">Back</button>
              <button class="modal_btn_yesorno" id="btn_connManager_create">Create</button> 
              `,
        initialize: (target) => {

          // IF THERE ARE NO SELECTED OBJECTS,
          // DO NOTHING
          let length = Object.keys(gl_SELECTEDLIST).length;
          if(length > 0) {



          } else {

            console.log( "ModalManager   ::   THERE ARE NO SELECTED OBJECTS !!!!" )

          }



        },
        buttons: {
          btn_connManager_create: (ev) => {
            console.log('CREATE CONNECTION CLICKED')

            console.log(gl_SELECTEDLIST)

            // CHECK EVERY SELECTED OBJECTS ARE DrawTextArea TYPE !!!!
            for( let grpId in gl_SELECTEDLIST ) {
              // WE WILL CREATE CONNECTIONS ONLY FOR TEXTAREA OBJECT !!!!
              if(gl_SELECTEDLIST[grpId].constructor.name !== 'DrawTextArea') {
                console.log("YOU CAN CREATE CONNECTION LINE FOR ONLY DrawTextArea !!!!")
                return
              }
            }


            for( let grpId in gl_SELECTEDLIST ) {
              // WE WILL CREATE CONNECTIONS ONLY FOR TEXTAREA OBJECT !!!!
              if(gl_SELECTEDLIST[grpId].constructor.name === 'DrawTextArea') {
                gl_SELECTEDLIST[grpId].createConnections()
              } 
            }

            for( let grpId in gl_SELECTEDLIST ) {

              gl_SELECTEDLIST[grpId].updateConns()

            }
            
          },
          btn_connManager_back: (ev) => {
            console.log('BACK CLICKED')

            this.modalList.connManager.hideBox()


          }
        } 
      }),



    }



  }


  remove() {
    this.modalList.about.remove()
    this.modalList.deleteAll.remove()


  }

}


export {ModalManager}
