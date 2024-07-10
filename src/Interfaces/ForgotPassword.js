import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/admins/forgotpassword', { email });
      setEmailSent(true);
      setPassword(response.data.password);  // Assuming `password` is returned by the new backend implementation
      setError('');
    } catch (error) {
      setError('Error sending email: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gradient-info vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-reset-image" style={{ backgroundImage: "url('https://via.placeholder.com/600x400')" }}></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Forgot Your Password?</h1>
                        <p className="mb-4">Enter your email address below and we'll send you your original password.</p>
                      </div>
                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input 
                            type="email" 
                            className="form-control form-control-user" 
                            id="exampleInputEmail" 
                            aria-describedby="emailHelp" 
                            placeholder="Enter Email Address..." 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="btn btn-info btn-user btn-block" disabled={loading}>
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            'Reset Password'
                          )}
                        </button>
                        <hr />
                      </form>
                      {password && (
                        <div className="alert alert-info" role="alert">
                          Your password: <strong>{password}</strong>
                          <br />
                          <button className="btn btn-sm btn-primary mt-2" onClick={() => navigator.clipboard.writeText(password)}>Copy Password</button>
                        </div>
                      )}
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}
                      <div className="text-center">
                        <a className="small" href="/">Back to Login</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
