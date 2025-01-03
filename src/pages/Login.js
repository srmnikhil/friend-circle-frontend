import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../Components/Loader';

const Login = ({ showToast, loading, setLoading }) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState({ password: false });
  const [isChecked, setIsChecked] = useState(false);
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError({ password: false });
    if (credentials.password.length < 8) {
      setError({ password: true });
      return;
    }
    setLoading(true);
    navigate("/dashboard", { replace: true });

    // try {
      
    //   const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email: credentials.email, password: credentials.password })
    //   });
    //   const json = await response.json();
    //   if (json.success) {
    //     setTimeout(() => {
    //       localStorage.setItem("token", json.authToken);
    //       navigate("/dashboard", { replace: true });
    //       setLoading(false);
    //     }, 3000);
    //     showToast("Logged in Successfully, Navigating to dashboard in 3 seconds....", "success");
    //   } else {
    //     setLoading(false);
    //     showToast('Invalid Credentials, Try logging with correct credentials', "danger");
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   showToast("Internal server error.", "danger");
    // };
  }
  const onChange = (evt) => {
    const { name, value } = evt.target;
    setCredentials({ ...credentials, [name]: value });
    if (name === "password") {
      if (value.length >= 8 || value.length === 0) {
        setError({ password: false });
      } else {
        setError({ password: true });
      }
    }
  }
  const handleShowPassword = () => {
    setIsChecked((prev) => !prev);
  }
  return (
    <div>{loading && <Loader/>}
      <div className='d-flex align-items-center justify-content-center' style={{ minHeight: 'calc(100vh - 7.7rem)' }}>
        <div className='container border rounded p-5 col-md-5' style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}>
          <h1 className='text-center mb-3'>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 ">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address:</label>
              <input type="email" className="form-control" id="exampleInputEmail1" name="email" placeholder='example@gmail.com' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password:</label>
              <input type={isChecked === true ? "text" : "password"} className={`form-control ${error.password ? "is-invalid" : ""}`} id="exampleInputPassword1" value={credentials.password} onChange={onChange} name="password" placeholder='Password'/>
              <div className="form-check float-end">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={handleShowPassword} />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {isChecked === true ? "Hide Password" : "Show Password"}
                </label>
              </div>
              <div className="invalid-feedback">
                Password must be at least 8 characters long.
              </div>
            </div>
            <button disabled={credentials.email.length === 0} type="submit" className="btn btn-primary w-100 my-3" style={{ height: "2.5rem", borderRadius: "1.5rem" }}>Login</button>
            <Link to="/forgotpassword"><button className={`btn btn-danger w-100`} style={{ height: "2.5rem", borderRadius: "1.5rem" }}>Forgot Password</button>
            </Link>
            <hr />
            <i className='float-end'>Don't have an account yet? <Link to="/register">Register Now</Link></i>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
