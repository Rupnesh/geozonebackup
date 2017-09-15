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
              <NavLink to={'/dashboard'} className='nav-link' activeClassName='active'><i className='icon-speedometer'></i> Dashboard</NavLink>
            </li>
            <li className='nav-title'>
              Settings
            </li>
            <li className={this.activeRoute('/connection')}>
              <a className='nav-link nav-dropdown-toggle' href='#' onClick={this.handleClick}><i className='icon-puzzle'></i> Connection</a>
              <ul className='nav-dropdown-items'>
                <li className='nav-item'>
                  <NavLink to={'/connection/wifi'} className='nav-link' activeClassName='active'><i className='icon-puzzle'></i> WiFi</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/connection/bluetooth'} className='nav-link' activeClassName='active'><i className='icon-puzzle'></i> BlueTooth</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/connection/cable'} className='nav-link' activeClassName='active'><i className='icon-puzzle'></i> RS232-Cable</NavLink>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute('/gps')}>
              <a className='nav-link nav-dropdown-toggle' href='#' onClick={this.handleClick}><i className='icon-star'></i> GPS</a>
              <ul className='nav-dropdown-items'>
                <li className='nav-item'>
                  <NavLink to={'/gps/main'} className='nav-link' activeClassName='active'><i className='icon-star'></i> Main</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/device'} className='nav-link' activeClassName='active'><i className='icon-star'></i> Device</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/calibration'} className='nav-link' activeClassName='active'><i className='icon-star'></i> Calibration</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/radios'} className='nav-link' activeClassName='active'><i className='icon-star'></i> Radios</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/ntrip'} className='nav-link' activeClassName='active'><i className='icon-star'></i> NTRIP</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/senzors'} className='nav-link' activeClassName='active'><i className='icon-star'></i> Senzors</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/firmware'} className='nav-link' activeClassName='active'><i className='icon-star'></i> Firmware</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/starfire'} className='nav-link' activeClassName='active'><i className='icon-star'></i> StarFire</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/basecord'} className='nav-link' activeClassName='active'><i className='icon-star'></i> Base Cord</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/gps/logdata'} className='nav-link' activeClassName='active'><i className='icon-star'></i> Log Data</NavLink>
                </li>
              </ul>
            </li>
            <li className='nav-item'>
              <NavLink to={'/cloud'} className='nav-link' activeClassName='active'><i className='icon-calculator'></i> Cloud</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to={'/survey'} className='nav-link' activeClassName='active'><i className='icon-pie-chart'></i> Survey</NavLink>
            </li>
            <li className='divider'></li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Sidebar;
