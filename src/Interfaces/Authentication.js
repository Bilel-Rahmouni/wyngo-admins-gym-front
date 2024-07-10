import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Modal, Button, Alert } from 'react-bootstrap';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/admins/login', { email, password });
      setUser(response.data.admin);
      console.log('User after login:', response.data.admin);
      navigate('/dashboard'); // Navigate immediately after setting user
    } catch (error) {
      console.error('There was an error!', error);
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      }
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setError(null); 
  };

  return (
    <div className="bg-gradient-primary vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image" style={{backgroundImage: "url('https://via.placeholder.com/600x400')"}}></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Login</h1>
                      </div>
                      {error && <Alert variant="danger">{error}</Alert>}
                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input type="email" className="form-control form-control-user" placeholder="Enter Email Address..." value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <input type="password" className="form-control form-control-user" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="form-group">
                         
                        </div>
                        <button type="submit" className="btn btn-primary btn-user btn-block" disabled={loading}>
                          {loading ? 'Loading...' : 'Login'}
                        </button>
                        <hr />
                      </form>
                      <div className="text-center">
                        <a className="small" href="/ForgotPassword">Forgot Password?</a>
                      </div>
                      <div className="text-center">
                        <a className="small" href="/Signup">Create an Account!</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>User Not Found</Modal.Title>
              </Modal.Header>
              <Modal.Body>The user does not exist. Please check your email and try again.</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
