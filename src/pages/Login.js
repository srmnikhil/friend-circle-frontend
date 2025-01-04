import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../Components/Loader';
import { ToastContainer, toast } from 'react-toastify';


const Login = ({ loading, setLoading }) => {
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
    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      }); 
      const json = await response.json();
      if (json.success) {
        setTimeout(() => {
          localStorage.setItem("token", json.authToken);
          navigate("/dashboard", { replace: true });
          setLoading(false);
        }, 3000);
        toast.success("Logged in Successfully, Navigating to dashboard in 3 seconds....", {autoClose: 2500});
      } else {
        setLoading(false);
        toast.error('Invalid Credentials, Try logging with correct credentials');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error logging');
    };
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
    <div>{loading && <Loader />}
      <div className='d-flex align-items-center justify-content-center' style={{ minHeight: 'calc(100vh - 7.7rem)' }}>
        <div className='container border rounded p-5 col-md-5' style={styles.container}>
          <h1 className='text-center mb-3' style={styles.header}>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder='example@gmail.com'
                value={credentials.email}
                onChange={onChange}
                aria-describedby="emailHelp"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type={isChecked ? "text" : "password"}
                className={`form-control ${error.password ? "is-invalid" : ""}`}
                id="password"
                name="password"
                placeholder='Password'
                value={credentials.password}
                onChange={onChange}
                required
              />
              <div className="form-check float-end">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onClick={handleShowPassword}
                />
                <label className="form-check-label">
                  {isChecked ? "Hide Password" : "Show Password"}
                </label>
              </div>
              <div className="invalid-feedback">
                Password must be at least 8 characters long.
              </div>
            </div>
            <button
              disabled={credentials.email.length === 0}
              type="submit"
              className="btn btn-primary w-100 my-3"
              style={styles.button}
            >
              Login
            </button>
            <Link to="/forgotpassword">
              <button className={`btn btn-danger w-100`} style={styles.button}>Forgot Password</button>
            </Link>
            <hr />
            <i className='float-end'>Don't have an account yet? <Link to="/register">Register Now</Link></i>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right"/>
    </div>
  )
}

const styles = {
  container: {
    margin: '50px auto',
    maxWidth: '800px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    minHeight: 'calc(100vh - 7.7rem)',
  },
  header: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  button: {
    height: '2.5rem',
    borderRadius: '1.5rem',
  },
};

export default Login;
