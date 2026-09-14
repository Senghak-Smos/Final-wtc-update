import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./home/Navbar.jsx";
import Home from "./home/Home.jsx";
import About from "./home/About.jsx";
import Service from "./home/Service.jsx";
import Contact from "./home/Contact.jsx";
import Owner from "./home/Owner.jsx";
import Footer from "./home/Footer.jsx";
import Lighting from "./calculate/Lighting_cal.jsx";
import Air_cal from "./calculate/Air_cal.jsx";
import Fan_cal from "./calculate/Fan_cal.jsx";
import Wir_cal from "./calculate/Wire_cal.jsx";
import Login from "./log_res.jsx/Login.jsx";
import Register from "./log_res.jsx/Regis.jsx";

import QA from "./help_work/QA.jsx";
import Howwork from "./help_work/Howwork.jsx";
import Admin_dashboard from "./dashboard/Admin_dashboard.jsx";
import User_dashboard from "./dashboard/User_dashboard.jsx";

import ProtectedRoute from "./protect/Protect.jsx";

function Mian() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <section id="home"> <Home /> </section>
      <section id="about"> <About /> </section>
      <section id="service"> <Service /> </section>
      {/* <section id="owner"> <Owner /> </section> */}
      <section id="contact"> <Contact /> </section>
      <section id="footer"> <Footer /> </section>
    </>
  );
}

function App() {
  const isGitHubPages = window.location.hostname.includes("github.io");

  return (
    <div>
      <Router basename={isGitHubPages ? "/Fianl-WTC" : ""}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Mian />} />          
          <Route path="/home" element={<Mian />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/how" element={<Howwork />} />
       
          <Route path="/lighting" element={ <ProtectedRoute><Lighting /></ProtectedRoute> } />
          <Route path="/air" element={ <ProtectedRoute><Air_cal /></ProtectedRoute> } />
          <Route path="/fan" element={ <ProtectedRoute><Fan_cal /></ProtectedRoute> } />
          <Route path="/wire" element={ <ProtectedRoute><Wir_cal /></ProtectedRoute> } />
          
          <Route path="/admin" element={ <ProtectedRoute><Admin_dashboard/></ProtectedRoute> } />
          <Route path="/user" element={ <ProtectedRoute><User_dashboard/></ProtectedRoute> } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;