import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader';

const Register = ({ showToast, loading, setLoading }) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", mobile: "", email: "", password: "", confirmpassword: "", })
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState({ name: false, password: false, confirmpassword: false });
  const [isChecked, setIsChecked] = useState(false);
  const showAlert = (message, type) => {
    setAlert({ msg: message, type })
  }
  const [value, setValue] = useState(null);
  const handleKeyPress = (evt) => {
    // Prevent non-numeric input
    if (!/^\d$/.test(evt.key)) {
      evt.preventDefault();
      setValue("is-invalid");
      if (credentials.mobile.length === 10) {
        setValue(null);
      }
    }
  };
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const { name, mobile, email, password, confirmpassword } = credentials;
    setError({ name: false, password: false, confirmpassword: false });
    if (email.length === 0) {
      setError({ email: true });
      showAlert("Please enter a valid email.", "danger")
      return;
    }
    if (password.length < 8 && confirmpassword.length < 8 && name.length < 3) {
      setError({ confirmpassword: true, password: true, name: true });
      return;
    }
    if (password !== confirmpassword) {
      showAlert("Password and Confirm password did not match.", "danger");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mobile, email, password })
      });
      const json = await response.json();
      if (json.success) {
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
        setLoading(false);
        showToast('Account Created Successfully, Navigating to login in 3 seconds....', "success");
      } else {
        setLoading(false);
        showToast('Entered email or mobile number already exists, Try again with different credentials.', "warning");
      }
    } catch (error) {
      setLoading(false);
      showAlert('An error occurred while creating the user.', "danger");
    }
  }
  const onChange = (evt) => {
    const { name, value } = evt.target;
    setCredentials({ ...credentials, [name]: value });
    setValue(null);
    if (name === "password") {
      if (value.length >= 8 || value.length === 0) {
        setError({ password: false });
      } else {
        setError({ password: true });
      }
    }
    if (name === "confirmpassword") {
      if (value.length >= 8 || value.length === 0) {
        setError({ confirmpassword: false });
      } else {
        setError({ confirmpassword: true });
      }
    }
    if (name === "name") {
      if (value.length >= 3 || value.length === 0) {
        setError({ name: false });
      } else {
        setError({ name: true });
      }
    }
  }
  const handleShowPassword = () => {
    setIsChecked((prev) => !prev);
  }
  return (
    <div>{loading && <Loader />}
      <div className='d-flex align-items-center justify-content-center' style={{ minHeight: 'calc(100vh - 7.7rem)' }}>
        <div className='container border rounded p-5 col-md-5' style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}>
          <h1 className='text-center mb-4'>Register Now</h1>
          <form onSubmit={handleSubmit}>
            {alert && <div className={`alert alert-${alert.type} p-2`}>{alert.msg}</div>}
            <div className="mb-2">
              <input type="text" className={`form-control ${error.name ? "is-invalid" : ""}`} name="name" placeholder='Name' value={credentials.name} onChange={onChange} aria-describedby="emailHelp" minLength={3} required />
              <div className="invalid-feedback">
                Please enter atleast 3 characters.
              </div>
            </div>
            <div className="mb-2">
              <input type="tel" className={`form-control ${value}`} id="exampleInputMobile" name="mobile" maxLength={10} placeholder='Mobile Number' value={credentials.mobile} onChange={onChange} onKeyPress={handleKeyPress} aria-describedby="emailHelp" minLength={10} required />
              <div className="invalid-feedback">
                Please enter a valid 10-digit mobile number.
              </div>
            </div>
            <div className="mb-2">
              <input type="email" className="form-control" id="exampleInputEmail1" name="email" placeholder='Email Address' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
              <div id="emailHelp" className="form-text"><i>We'll never share your contact details with anyone else.</i></div>
            </div>
            <div className="mb-2">
              <input type={`${isChecked === true ? "text" : "password"}`} className={`form-control ${error.password ? "is-invalid" : ""}`} id="exampleInputPassword1" placeholder='Password' value={credentials.password} onChange={onChange} name="password" minLength={8} required />
              <div className="form-check float-end">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={handleShowPassword} />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {isChecked === true ? "Hide Password" : "Show Password"}
                </label>
              </div>
              <div className="invalid-feedback">
                Password must have 8 characters.
              </div>
            </div>
            <div className="mb-2">
              <input type={`${isChecked === true ? "text" : "password"}`} className={`form-control ${error.confirmpassword ? "is-invalid" : ""}`} id="exampleInputConfirmPassword1" placeholder='Confirm Password' value={credentials.confirmpassword} onChange={onChange} name="confirmpassword" minLength={8} required />
              <div className="invalid-feedback">
                Confirm Password must have 8 characters.
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{ height: "2.5rem", borderRadius: "1.5rem" }}>Register Now</button> <hr />
            <i className='float-end'>Already have an account? <Link to="/login">Login Here</Link></i>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register;