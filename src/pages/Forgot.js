import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../Components/Loader';
import { ToastContainer, toast } from 'react-toastify';

const Forgot = ({ loading, setLoading }) => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "", mobile: "" });
    const [error, setError] = useState({ password: false });
    const [isChecked, setIsChecked] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [value, setValue] = useState("")
    const handleKeyPress = (evt) => {
        // Prevent non-numeric input
        if (!/^\d$/.test(evt.key)) {
            evt.preventDefault();
            setValue("is-invalid");
            if (credentials.mobile.length > 9) {
                setValue("");
            }
        }
    };
    const handleVerify = async (evt) => {
        evt.preventDefault();
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, mobile: credentials.mobile })
        });
        const json = await response.json();
        if (json.success) {
            toast.success("User found, Now update the password...");
            setLoading(false);
            setIsDisabled(!isDisabled);
            setError({ password: false });
            if (credentials.password.length < 8) {
                setError({ password: true });
                return;
            }
        }
        else {
            setLoading(false);
            toast.error('User Not Found! Either email or mobile does not exist.');
            return;
        }
    }
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/users/forgotpassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: credentials.email, mobile: credentials.mobile, password: credentials.password })
            });
            const json = await response.json();
            if (json.success) {
                setTimeout(() => {
                    navigate("/login", { replace: true });
                    setIsDisabled(!isDisabled);
                }, 3000);
                setLoading(false);
                toast.success("Password reset Successfully, Navigating to login in 3 seconds....");
            } else {
                setLoading(false);
                toast.error("Some Error Occured.");
            }
        } catch (error) {
            setLoading(false);
            toast.error("Internal server error.");
            return;
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
    }
    const handleShowPassword = () => {
        setIsChecked((prev) => !prev);
    }
    return (
        <div>{loading && <Loader />}
            <div className='d-flex align-items-center justify-content-center' style={{ minHeight: 'calc(100vh - 7.7rem)' }}>
                <div className='container border rounded p-5 col-md-5' style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}>
                    <h1 className='text-center mb-3'>Forgot Password</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 ">
                            <input type="email" className="form-control" id="exampleInputEmail1" name="email" placeholder='example@gmail.com' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-2">
                            <input type="tel" className={`form-control ${value}`} id="exampleInputMobile" name="mobile" maxLength={10} placeholder='Mobile Number' value={credentials.mobile} onChange={onChange} onKeyPress={handleKeyPress} aria-describedby="emailHelp" minLength={10} required />
                            <div className="invalid-feedback">
                                Please enter a valid 10-digit mobile number.
                            </div>
                        </div>
                        <div className={`mb-3 ${isDisabled || "d-none"}`}>
                            <input type={`${isChecked === true ? "text" : "password"}`} className={`form-control ${error.password ? "is-invalid" : ""}`} id="exampleInputPassword1" value={credentials.password} onChange={onChange} name="password" placeholder='Password' />
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
                        <button disabled={credentials.email.length === 0} onClick={handleVerify} className={`btn btn-primary w-100 my-2 ${!isDisabled || "d-none"}`} style={{ height: "2.5rem", borderRadius: "1.5rem" }}>Verify</button>
                        <button type="submit" className={`btn btn-primary w-100 ${isDisabled || "d-none"}`} style={{ height: "2.5rem", borderRadius: "1.5rem" }}>Forgot Password</button>
                        <hr />
                        <Link to="/login"><button type="button" className="btn btn-danger w-100 mt-2" style={{ height: "2.5rem", borderRadius: "1.5rem" }}>Back to Login</button></Link>
                    </form>
                </div>
            </div>
            <ToastContainer position="bottom-right"/>
        </div>
    )
}
export default Forgot;
