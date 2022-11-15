
// < SUBLIME TEXT JSX TEXT HIGHLIGHT >
// https://stackoverflow.com/questions/69051591/sublime-text-4-how-to-add-jsx-syntax-highlighting
// View > syntax > Open all with current extension as > javascript > JSX


// ----------------------------------------------------------------
// IMPORT

// TOOLKITS
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {useEffect} from 'react'

// VIEWS
import LandingPage      from "./views/LandingPage"
import Login            from "./views/Login"
import MakeAccount      from "./views/MakeAccount"
import { Toaster }      from "react-hot-toast";
import EmailVerify      from "./views/EmailVerify";
import PasswordReset    from "./views/PasswordReset";
import UserAdmin        from "./views/UserAdmin";
import CryptoContents   from "./views/CryptoContents";
import Subjects         from "./views/Subjects";
import SubjectsDetails  from "./views/SubjectsDetails";




// < FULLSCREEN >
// https://www.npmjs.com/package/react-full-screen

// < OVERLAY > 
// https://codesandbox.io/s/react-fullscreen-overlay-sbjs4


function App() {

  // ***** TOASTER SHOULD BE DEFINED HERE !!!!
  //       


  //                      BELOW ELEMENT SHOULD BE COMPONENT ! 
  //                      THAT'S WHY WE USE "< />"
  //                      
  //                      to ATTRIBUTE SHOULD BE 
  //                      
  //                      **** FULL PATH TO ROUTE FOR EXPRESS SERVER ****
  //                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (

    <BrowserRouter>

      <Toaster position="top-right" reverseOrder={false} />
      <Routes>

        <Route path='/' 
          element={ 
            <PublicRoutes>
              <LandingPage/> 
            </PublicRoutes>
          } 
          />

        <Route path='/member-area' 
          element={ 
            <ProtectedRoutes>
              <LandingPage/> 
            </ProtectedRoutes>

          } />
        
        <Route path='member-area/:username' 
          element={ 
            <ProtectedRoutes>
              <UserAdmin/> 
            </ProtectedRoutes>

          } />

        <Route path='/member-area/:username/uploadimg' 
          element={ 
            <ProtectedRoutes>
              <UserAdmin/> 
            </ProtectedRoutes>

          } />

        <Route path='member-area/:username/contents' 
          element={ 
            <ProtectedRoutes>
              <UserAdmin/> 
            </ProtectedRoutes>

          } />

        <Route path='/cryptocontents' 
          element={ 
            <PublicRoutes>
              <CryptoContents/> 
            </PublicRoutes>
          } >
        </Route>
        

        <Route path='/subjects' 
          element={ 
            <PublicRoutes>
              <Subjects/> 
            </PublicRoutes>
          } >

          <Route path=':categoryName' element={ <PublicRoutes><SubjectsDetails/></PublicRoutes> } />

        </Route>

        


        <Route path='/api/auth/login' 
          element={ 
            <PublicRoutes>
              <Login/> 
            </PublicRoutes>
          } />

        <Route path='/api/auth/make-account' 
          element={
            <PublicRoutes>
              <MakeAccount/>
            </PublicRoutes>
          } />

        <Route path='/emailverify/:token'
          element={
            <PublicRoutes>
              <EmailVerify />
            </PublicRoutes>
          }
        />

        <Route path='/passwordreset/:token'
          element={
            <PublicRoutes>
              <PasswordReset />
            </PublicRoutes>
          }
        />

        <Route path='*' element={<LandingPage/>} /> 

      </Routes>
    </BrowserRouter>
  )

}


// ============================================
// DEPENDING ON OUR USER IS LOGGED IN OR NOT,
// WE FORWARD THE USER TO PROPER ROUTE !!!!

export function ProtectedRoutes({ children }) {

  // SEARCHING LOCALSTORAGE AND GET user KEY
  const userKey = sessionStorage.getItem("user");

  console.log(userKey)

  // 
  if (userKey !== "" && userKey) {

    // WE DO NOT NEED TO CHANGE ROUTE
    // BELOW MEANS 'GO AHEAD'
    return children;

  } else {

    // CHANGE THE ROUTE TO NON-MEMBER AREA
    return <Navigate to="/" />;

  }

}


// IF THE USER HAVE TOKEN...
export function PublicRoutes({ children }) {

  const user = sessionStorage.getItem("user");

  if (user !== "" && user) {

    // IF USER HAS TOKEN
    // GO TO MEMBER HOMEPAGE
    return <Navigate to="/member-area" />;


  } else {

    // GO AHEAD TO REQUESTED ROUTE
    return children;


  }
}




export default App;
