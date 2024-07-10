import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Authentication from './Interfaces/Authentication';
import Home from './Interfaces/Home';
import DashboardHeader from './Interfaces/Components/DashboardHeader';
import ForgotPassword from './Interfaces/ForgotPassword';
import Signup from './Interfaces/Signup';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Dashboard" element={<Home />}>
            <Route path="" element={<DashboardHeader />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
