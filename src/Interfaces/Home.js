import React, { useContext, useEffect } from 'react';
import { Routes, Route, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // Get the navigation function


  console.log('User in Home:', user);
  const handleLogout = () => {
    // Perform logout actions (clear session, etc.)
    // Then navigate to the home page "/"
    navigate('/');
  };
  return (
    <div id="wrapper">
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <div className="sidebar-brand d-flex align-items-center justify-content-center">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">Coaching <sup>v0.1</sup></div>
        </div>
        
        <hr className="sidebar-divider my-0" />

        <li className="nav-item">
          <li   className="nav-link">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </li>
        </li>

        <hr className="sidebar-divider d-none d-md-block" />
        
      </ul>
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
              <i className="fa fa-bars"></i>
            </button>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown no-arrow">
                <div to="#" className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                    {user ? user.firstName : 'Connected User'} {user ? user.lastName : 'Connected User'} 

                  </span>
                  <img className="img-profile rounded-circle" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy7nFdX1g_CVR4WyP5LgKOGytP0J8PE53_RQ&s" alt="profile" />
                </div>
                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                  <div className="dropdown-divider"></div>
                  <div onClick={handleLogout} className="dropdown-item" data-toggle="modal" data-target="#logoutModal">
                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Logout
                  </div>
                </div>
              </li>
            </ul>
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Home;
