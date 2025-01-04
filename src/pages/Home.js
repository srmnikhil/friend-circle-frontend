import React from 'react';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
    <div className="container my-2">
      <div className="row">
      <h2 className='text-center'>Welcome to FriendCircle</h2>
        <div className="col-md-6">
          <img
            src="/Logo.jpg"
            alt="Home Us"
            className="img-fluid rounded"
           style={{height: "30rem"}}/>
        </div>
        <div className="col-md-6">
          <p>
          FriendCircle is a web application designed to help individuals stay connected with their friends and family. The platform allows users to create a personal network, share updates, and engage in real-time conversations. Whether you're catching up on the latest updates or organizing a get-together, FriendCircle makes managing friendships simple, engaging, and fun.
          </p>
          <h4>Features:</h4>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Register:</strong> Sign up with your email and create an
              account easily.
            </li>
            <li className="list-group-item">
              <strong>Login:</strong> Securely log in using your credentials to
              login your account.
            </li>
            <li className="list-group-item">
              <strong>Make Friends:</strong> You can send friends requests to your friends and recieve to, there is option to accept or reject their requests. 
            </li>
            <li className="list-group-item">
              <strong>Privacy:</strong> We ensures user privacy by securing data with encryption and providing customizable privacy settings for full control over personal information.
            </li>
          </ul>
          <p className="my-1">
          <strong>Connecting You, Protecting You.</strong> Join <strong>FriendCircle</strong> today and easily manage your notes with peace of mind.
          </p>
          <div className='d-flex justify-content-center'>
          {localStorage.getItem("token") ? <Link to="/dashboard" className="btn btn-primary">
            Dashboard
          </Link> : <Link to="/register" className="btn btn-primary">
            Register Now
          </Link>}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Home;
