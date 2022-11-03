'use strict'

import { ModalBox }     from "./ModalBox.mjs"
import { ConnectionManager }  from "./ConnectionManager.mjs"


// FOR NOW THIS CLASS HAVE ALL MODALBOX HTML AND JAVASCRIPT!
// TODO :: FOR THE FUTURE, WE WANT TO EXPORT THIS TO DATABASE

class ModalManager {

  constructor() {
    //-// console.log('%% ModalManager.mjs :: ModalManager CONSTRUCTOR EXECUTED')

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

      // 
      articleList: new ModalBox({
        html: `
              `,
        initialize: (target) => {
          // WE CAN LAZY INITIALIZATION WITH THIS CALLBACK FUNCTION !
          // BECAUSE WE PASSED this OBJECT TO THE FUNCTION IN ModalBox CLASS !

          //console.log("ARTICLES INITIALIZED")
          //console.log(target)


          // 1. SEND REQUSET TO SERVER TO GET JSON FILE WHICH CONTAINS ARTICLES
          
          


          // 2.
          // 
          target.boxHtml.innerHTML = '<h1>Articles 2</h1>';




        },
        buttons: {

          // btn_deleteall_yes: (ev) => {
          //   //console.log('YES CLICKED')

          //   let evToState = new CustomEvent('deleteAllObjs', {
          //     bubbles:true
          //   })

          //   document.getElementById('workarea').dispatchEvent(evToState)


          // },
          // btn_deleteall_no: (ev) => {
          //   //console.log('NO CLICKED')
          //   this.modalList.deleteAll.hideBox()
          // }

          
        } 
      }),



      connManager: new ModalBox({
        html: `
              <h1>CREATE CONNECTION</h1>
              <button class="modal_btn_yesorno" id="btn_connManager_back">Back</button>
              <button class="modal_btn_yesorno" id="btn_connManager_create">Create</button> 
              `,
        initialize: (target) => {


          console.log(target)
          console.log(target.boxHtml)
          
          this.connectionManager = new ConnectionManager()
          this.connectionManager.showDialog(event, this, target.boxHtml)
    
        },
        buttons: {
          btn_connManager_create: (ev) => {
            console.log('CREATE CLICKED')

            // let evToState = new CustomEvent('deleteAllObjs', {
            //   bubbles:true
            // })

            // document.getElementById('workarea').dispatchEvent(evToState)


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
