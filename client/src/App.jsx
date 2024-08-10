import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";

import FooterCom from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop></ScrollToTop>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/about" element={<About></About>} />
        <Route path="/sign-in" element={<SignIn></SignIn>} />
        <Route path="/sign-up" element={<SignUp></SignUp>} />
        <Route path="/search"element={<Search></Search>}></Route>
        
        <Route element={<PrivateRoute></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard></Dashboard>} />
          <Route path="/Projects" element={<Projects></Projects>} />
        </Route>

        <Route element={<PrivateAdminRoute></PrivateAdminRoute>}>
        <Route path="/updatepost/:postId" element={<UpdatePost></UpdatePost>} />
          <Route path="/createpost" element={<CreatePost></CreatePost>} />
          <Route path="/post/:postSlug" element={<PostPage></PostPage>} />
        </Route>
      </Routes>
      <FooterCom></FooterCom>
    </BrowserRouter>
  );
}
