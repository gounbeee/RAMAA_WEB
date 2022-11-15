import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'



// import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useRouter } from 'next/router'

import {useEffect} from 'react'



// VIEWS
// import LandingPage      from "./views/LandingPage"
// import Login            from "./views/Login"
// import MakeAccount      from "./views/MakeAccount"
import { Toaster }      from "react-hot-toast";
// import EmailVerify      from "./views/EmailVerify";
// import PasswordReset    from "./views/PasswordReset";
// import UserAdmin        from "./views/UserAdmin";
// import CryptoContents   from "./views/CryptoContents";
// import Subjects         from "./views/Subjects";
// import SubjectsDetails  from "./views/SubjectsDetails";




export default function Home() {

  const router = useRouter()
  const { slug } = router.query

  return <h1>Post Slug: {slug}</h1>


}



// https://nextjs.org/docs/migrating/from-create-react-app


// https://nextjs.org/docs/migrating/from-react-router


