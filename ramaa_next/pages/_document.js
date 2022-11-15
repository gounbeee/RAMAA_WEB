
import { Html, Head, Main, NextScript } from 'next/document'

//import Script from 'next/script'



function Document() {



  return (
    <Html>
        
      <Head>

        <title>Gounbeee.com</title>



        <link rel="apple-touch-icon" href="logo192.png" />

        <link rel="manifest" href="manifest.json" />

        <link rel="stylesheet" href="RAMAA/css/base.css"></link>
        <link rel="stylesheet" href="RAMAA/css/menubar.css"></link>
        <link rel="stylesheet" href="RAMAA/css/attribManager.css"></link>
        <link rel="stylesheet" href="RAMAA/css/toolbox.css"></link>
        <link rel="stylesheet" href="RAMAA/css/footer.css"></link>
        <link rel="stylesheet" href="RAMAA/css/workarea.css"></link>
        <link rel="stylesheet" href="RAMAA/css/svg.css"></link>
        <link rel="stylesheet" href="RAMAA/css/modal.css"></link>
        <link rel="stylesheet" href="RAMAA/css/arrow.css"></link>
        <link rel="stylesheet" href="RAMAA/css/timeline.css"></link>
        <link rel="stylesheet" href="RAMAA/css/playback.css"></link>
        <link rel="stylesheet" href="RAMAA/css/button.css"></link>
        <link rel="stylesheet" href="RAMAA/css/scenechange.css"></link>
        <link rel="stylesheet" href="RAMAA/css/htmlCanvas.css"></link>
        <link rel="stylesheet" href="RAMAA/css/animManager.css"></link>
        <link rel="stylesheet" href="RAMAA/css/bitmapPad.css"></link>
        <link rel="stylesheet" href="RAMAA/css/contents.css"></link>

        <link rel="stylesheet" href="RAMAA/css/debug.css"></link>

        <script src="https://unpkg.com/rxjs@^7/dist/bundles/rxjs.umd.min.js"></script>





      </Head>



      <body>


        <div id="allArea">

          <div className="w-full h-full absolute" id="ramaaApp_overlay">
          </div>



          <div className="bl_ramaaApp ly_ramaaApp" id="ramaaApp">

            <div className="user_logo" id="user_logo">
              <img src="images/LOGO.png" />
            </div>



            <div className="bl_menu_wrapper ly_menu_wrapper disable-select" id="menu_wrapper">

              <a className="bl_menu ly_menu" id="menu_logo">

                <div className="bl_menu_list ly_menu_list" id="menu_about_dialog">
                  <div className="bl_menu_item ly_menu_item" id="menu_about">What is this project?</div>

                </div>
              </a>

              <div className="bl_menu ly_menu" id="menu_create">
                <div className="bl_menu_btn ly_menu_btn" id="menu_create_btn">Create</div>
                <div className="bl_menu_list ly_menu_list" id="menu_create_dialog" >
                  <div className="bl_menu_item ly_menu_item" id="menu_create_textarea">Text Area</div>
                  <div className="bl_menu_item ly_menu_item" id="menu_create_connection">+ Link Text</div>
                  <div className="bl_menu_item ly_menu_item" id="menu_create_bitmap">Drawing</div>
                  <div className="bl_menu_item ly_menu_item" id="menu_create_rect">Rectangle</div>
                  <div className="bl_menu_item ly_menu_item" id="menu_create_arrow">Bridge</div>
                  <div className="bl_menu_item ly_menu_item" id="menu_create_ball">Ball</div>
                  
                </div>
              </div>

              <div className="bl_menu ly_menu" id="menu_source">
                <div className="bl_menu_btn ly_menu_btn" id="menu_source_btn">Source</div>

                <div className="bl_menu_list ly_menu_list" id="menu_source_dialog" >

                  <div class="bl_menu_item ly_menu_item">
                  <input class="source_openfile" type="file" name="" id="loadJsonFile" accept=".json"></input>
                  <button class="source_loadfile" id="sendJsonFile">Load</button>
                  </div>
                              
                  <div className="bl_menu_item ly_menu_item" id="menu_source_qsave" >QUICK SAVE</div>
                  <div className="bl_menu_item ly_menu_item" id="menu_source_json">Export Your Subject</div>
                  <div className="bl_menu_item ly_menu_item" id="menu_source_svg" >EXPORT SVG</div>

                </div>
              </div>


              <div className="bl_menu_r ly_menu_r">
                <div className="bl_menu_dispAttrBox ly_menu_dispAttrBox" id="menu_r_btn_attr">
                  Attributes
                </div>
                <div className="bl_menu_sns ly_menu_sns" id="menu_r_btn">
                  <a href="https://twitter.com/gounbeee" target="_blank" >SNS</a>
                </div>
              </div>




              <div id="REACT_ROOT"></div>




            </div> 


            <div className="bl_attribManager_wrapper ly_attribManager_wrapper" id="attribManager_wrapper">

              <div className="bl_attribManager_desc ly_attribManager_desc" id="attribManager_desc">

                <div className="bl_btn_deleteall ly_btn_deleteall" id="btn_delete_all">

                  Delete All


                </div>

                <div className="bl_zoomSelect ly_zoomSelect">
                  <h3>ZOOM</h3>
                  <label className="bl_attribManager_label ly_attribManager_label">
                    
                    <select className="zoom_select" id="zoom_select">
                    <option value="6">6%</option>
                    <option value="12">12%</option>
                    <option value="16">16%</option>
                    <option value="25">25%</option>
                    <option value="50">50%</option>
                    <option value="75">75%</option>
                    <option value="100"  selected="selected">100%</option>
                    <option value="150">150%</option>
                    <option value="200">200%</option>
                    <option value="300">300%</option>
                    <option value="400">400%</option>
                    <option value="600">600%</option>
                    <option value="800">800%</option>
                    <option value="1600">1600%</option>
                    </select>

                  </label>
                </div>
                <button className="bl_animManager_btn ly_animManager_btn" id="animManager_btn">Animation Editor</button>
              </div>


            </div>


            <div className="bl_footer_wrapper ly_footer_wrapper" id="footer_wrapper">
              <div className="ly_footer_inner">

                <div className="bl_timeline ly_timeline" id="timeline_wrapper"></div>

                <div className="bl_timeline ly_timeline" id="timeline_local_wrapper"></div>

                <div className="bl_playback ly_playback" id="plaback_wrapper"></div>

                <div className="bl_scenechange ly_scenechange" id="scene_change_wrapper" ></div>
              </div>
            </div> 


            <div className="bl_animManager_wrapper ly_animManager_wrapper" id="animManager_wrapper">
            </div>





          </div> 

        </div>


        <script type="module" src="RAMAA/js/main.js" />



        <Main />
        <NextScript />





      </body>
    </Html>
  )
}



export default Document

