import { useState } from "react";
import './App.css';
import Home from "./pages/Home";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import About from './pages/About';
import NotFound from "./Components/NotFound";
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard loading={loading} setLoading={setLoading} />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login loading={loading} setLoading={setLoading} />} />
              <Route path="/register" element={<Register loading={loading} setLoading={setLoading} />} />
              <Route path="/forgotpassword" element={<Forgot loading={loading} setLoading={setLoading} />} />
              {/* <Route path="/user" element={<UserDets loading={loading} userDetails={userDetails} />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
