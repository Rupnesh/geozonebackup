import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Sidebar extends Component {

  handleClick = (e) => {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  };

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1
      ? 'nav-item nav-dropdown open'
      : 'nav-item nav-dropdown';
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav nav-second-level collapse in' : 'nav nav-second-level collapse';
  // }

  render() {
    return (
      <div className='sidebar'>
        <nav className='sidebar-nav'>
          <ul className='nav'>
            <li className='nav-item'>
              <NavLink to={'/dashboard'} className='nav-link' activeClassName='active'><i className='icon-target'></i> Dashboard</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to={'/collections'} className='nav-link' activeClassName='active'><i className="fa fa-map"></i> Collections</NavLink>
            </li>
            <li className='nav-title'>
              Settings
            </li>
            <li className={this.activeRoute('/connection')}>
              <a className='nav-link nav-dropdown-toggle' href='#' onClick={this.handleClick}><i className='fa fa-plug'></i> Connection</a>
              <ul className='nav-dropdown-items'>
                <li className='nav-item'>
                  <NavLink to={'/connection/wifi'} className='nav-link' activeClassName='active'>WiFi</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/connection/bluetooth'} className='nav-link' activeClassName='active'>BlueTooth</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/connection/cable'} className='nav-link' activeClassName='active'>RS232-Cable</NavLink>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute('/gps')}>
              <a className='nav-link nav-dropdown-toggle' href='#' onClick={this.handleClick}><i className="fa fa-location-arrow"></i> GPS</a>
              <ul className='nav-dropdown-items'>
                <li className='nav-item'>
                  <NavLink to={'/gps/main'} className='nav-link' activeClassName='active'>Main</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/device'} className='nav-link' activeClassName='active'>Device</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/calibration'} className='nav-link' activeClassName='active'>Calibration</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/radios'} className='nav-link' activeClassName='active'>Radios</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/ntrip'} className='nav-link' activeClassName='active'>NTRIP</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/senzors'} className='nav-link' activeClassName='active'>Senzors</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/firmware'} className='nav-link' activeClassName='active'> Firmware</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/starfire'} className='nav-link' activeClassName='active'>StarFire</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/basecord'} className='nav-link' activeClassName='active'>Base Cord</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/logdata'} className='nav-link' activeClassName='active'>Log Data</NavLink>
                </li>
              </ul>
            </li>
            <li className='nav-item'>
              <NavLink to={'/cloud'} className='nav-link' activeClassName='active'><i className="fa fa-cloud"></i> Cloud</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to={'/survey'} className='nav-link' activeClassName='active'><i className='fa fa-question'></i> Survey</NavLink>
            </li>
            <li className='divider'></li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Sidebar;
