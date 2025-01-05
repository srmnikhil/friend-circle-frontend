import { useState } from "react";
import './App.css';
import Home from "./pages/Home";
import Navbar from "./Components/Navbar";
import About from './pages/About';
import NotFound from "./Components/NotFound";
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Dashboard from './pages/Dashboard';
import UserDets from "./pages/UserDets";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
      });
      const data = await response.json();
      if (data.success) {
        setUserDetails(data.user);
        setLoading(false);
      } else {
        console.error("Error while fetching")
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    };
  }
  return (
    <>
      <Router>
        <div className="app-container">
          <Navbar fetchUser={fetchUser} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard loading={loading} setLoading={setLoading} />} />
              <Route path="/pending-requests" element={<Dashboard loading={loading} setLoading={setLoading} />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login loading={loading} setLoading={setLoading} />} />
              <Route path="/register" element={<Register loading={loading} setLoading={setLoading} />} />
              <Route path="/forgotpassword" element={<Forgot loading={loading} setLoading={setLoading} />} />
              <Route path="/user" element={<UserDets loading={loading} userDetails={userDetails} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
        {/* <ToastContainer /> */}
      </Router>
    </>
  );
}

export default App;
