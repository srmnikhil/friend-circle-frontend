import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader';
import { ToastContainer, toast } from 'react-toastify';

const Register = ({ loading, setLoading }) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", mobile: "", email: "", password: "", confirmpassword: "", city: "" })
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState({ name: false, password: false, confirmpassword: false });
  const [isChecked, setIsChecked] = useState(false);
  const showAlert = (message, type) => {
    setAlert({ msg: message, type })
  }
  const [value, setValue] = useState(null);
  const handleKeyPress = (evt) => {
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
    const { name, mobile, email, password, confirmpassword, city } = credentials;
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
      const response = await fetch(`http://localhost:5000/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mobile, email, city, password })
      });
      const json = await response.json();
      if (json.success) {
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
        setLoading(false);
        toast.success('Account Created Successfully, Navigating to login in 3 seconds....');
      } else {
        setLoading(false);
        toast.warning('Entered email or mobile number already exists, Try again with different credentials.');
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
    if (name === "city") {
      if (value.length >= 3 || value.length === 0) {
        setError({ city: false });
      } else {
        setError({ city: true });
      }
    }
  }
  const handleShowPassword = () => {
    setIsChecked((prev) => !prev);
  }
  return (
    <div>{loading && <Loader />}
      <div className='d-flex align-items-center justify-content-center' >
        <div className='container border rounded p-5 col-md-5' style={styles.container}>
          <h1 className='text-center mb-4' style={styles.header}>Register Now</h1>
          <form onSubmit={handleSubmit}>
            {alert && <div className={`alert alert-${alert.type} p-2`}>{alert.msg}</div>}
            <div className="mb-2">
              <input type="text" className={`form-control ${error.name ? "is-invalid" : ""}`} name="name" placeholder='Name' value={credentials.name} onChange={onChange} minLength={3} required />
              <div className="invalid-feedback">
                Please enter atleast 3 characters.
              </div>
            </div>
            <div className="mb-2">
              <input type="tel" className={`form-control ${value}`} name="mobile" maxLength={10} placeholder='Mobile Number' value={credentials.mobile} onChange={onChange} onKeyPress={handleKeyPress} minLength={10} required />
              <div className="invalid-feedback">
                Please enter a valid 10-digit mobile number.
              </div>
            </div>
            <div className="mb-2">
              <input type="email" className="form-control" name="email" placeholder='Email Address' value={credentials.email} onChange={onChange} />
              <div id="emailHelp" className="form-text"><i>We'll never share your contact details with anyone else.</i></div>
            </div>
            <div className="mb-2">
              <input type="text" className={`form-control ${error.city ? "is-invalid" : ""}`} name="city" placeholder='City' value={credentials.city} onChange={onChange} minLength={3} required />
              <div className="invalid-feedback">
                Please enter atleast 3 characters.
              </div>
            </div>
            <div className="mb-2">
              <input type={`${isChecked ? "text" : "password"}`} className={`form-control ${error.password ? "is-invalid" : ""}`} name="password" placeholder='Password' value={credentials.password} onChange={onChange} minLength={8} required />
              <div className="form-check float-end">
                <input className="form-check-input" type="checkbox" onClick={handleShowPassword} />
                <label className="form-check-label">
                  {isChecked ? "Hide Password" : "Show Password"}
                </label>
              </div>
              <div className="invalid-feedback">
                Password must have 8 characters.
              </div>
            </div>
            <div className="mb-2">
              <input type={`${isChecked ? "text" : "password"}`} className={`form-control ${error.confirmpassword ? "is-invalid" : ""}`} name="confirmpassword" placeholder='Confirm Password' value={credentials.confirmpassword} onChange={onChange} minLength={8} required />
              <div className="invalid-feedback">
                Confirm Password must have 8 characters.
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" style={styles.button}>Register Now</button> <hr />
            <i className='float-end'>Already have an account? <Link to="/login">Login Here</Link></i>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
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

export default Register;
