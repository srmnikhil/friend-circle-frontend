import React from 'react'
import Loader from '../Components/Loader'
import { useNavigate } from 'react-router-dom';

const UserDets = ({ userDetails, loading }) => {
  let navigate = useNavigate();

  return (
    <div> {loading && <Loader />}
      <div className='d-flex align-items-center justify-content-center' style={{ minHeight: 'calc(100vh - 7.7rem)' }}>
        <div className='container border rounded p-5 col-md-5' style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}>
          <h1 className='text-center mb-4'>User Details</h1>
          <div className="mb-3">
            <input type="text" className="form-control" name="name" value={userDetails?.name || ""} placeholder='Name' aria-describedby="emailHelp" disabled />
          </div>
          <div className="mb-3">
            <input type="tel" className="form-control" id="exampleInputMobile" name="mobile" value={userDetails?.mobile || ""} placeholder='Mobile Number' aria-describedby="emailHelp" disabled />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" id="exampleInputEmail1" name="email" value={userDetails?.email || ""} placeholder='Email Address' aria-describedby="emailHelp" disabled />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" name="name" value={userDetails?.city || ""} placeholder='Name' aria-describedby="emailHelp" disabled />
          </div>
          <button className="btn btn-primary w-100 mt-3" style={{ height: "2.5rem", borderRadius: "1.5rem" }} onClick={() => navigate('/dashboard')} >Dashboard</button>
        </div>
      </div>
    </div>
  )
}

export default UserDets;
