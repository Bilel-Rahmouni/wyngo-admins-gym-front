import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/admins/signup', formData);
      console.log(response.data);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.href = '/'; // Redirect after 5 seconds
      }, 5000);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="bg-gradient-primary vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-signup-image" style={{backgroundImage: "url('https://via.placeholder.com/600x400')"}}></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Sign Up</h1>
                      </div>
                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input type="text" name="firstName" className="form-control form-control-user" placeholder="First Name" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <input type="text" name="lastName" className="form-control form-control-user" placeholder="Last Name" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <input type="email" name="email" className="form-control form-control-user" placeholder="Email Address" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <input type="password" name="password" className="form-control form-control-user" placeholder="Password" onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-user btn-block">
                          Sign Up
                        </button>
                        <hr />
                      </form>
                      <div className="text-center">
                        <a className="small" href="/ForgotPassword">Forgot Password?</a>
                      </div>
                      <div className="text-center">
                        <a className="small" href="/Login">Already have an account? Login!</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Signup Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your account has been successfully created.</Modal.Body>
      </Modal>
    </div>
  );
}

export default Signup;
