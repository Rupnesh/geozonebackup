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
      <div className='sidebar' >
        <nav className='sidebar-nav'>
          <ul className='nav'>
            <li className='nav-item'>
              <NavLink to={'/dashboard'} className='nav-link' activeClassName='active'><i className='icon-target'></i> Dashboard</NavLink>
            </li>
            {/* <li className='nav-item'>
              <NavLink to={'/collections'} className='nav-link' activeClassName='active'><i className="fa fa-map"></i> Collections</NavLink>
            </li> */}
            <li className='nav-title'>
              Settings
            </li>
            


            <li className='nav-item'>
              <NavLink to={'/logging'} className='nav-link' activeClassName='active'><i className="fa fa-floppy-o "></i> Logging</NavLink>
            </li>

            <li className={this.activeRoute('/wifi')}>
              <a className='nav-link nav-dropdown-toggle' href='#' onClick={this.handleClick}><i className="fa fa-wifi"></i> WIFI</a>
              <ul className='nav-dropdown-items'>

                <li className='nav-item'>
                  <NavLink to={'/wifi/WiFi'} className='nav-link' activeClassName='active'><i className="fa fa-wifi"></i> WiFi</NavLink>
                </li>


                <li className='nav-item'>
                  <NavLink to={'/wifi/SuperPole'} className='nav-link' activeClassName='active'> <i className="fa fa-file-text"></i> Super Pole</NavLink>
                </li>

              </ul>
            </li>

            {/* <li className='nav-item'>
              <NavLink to={'/survey'} className='nav-link' activeClassName='active'><i className='fa fa-question'></i> Survey</NavLink>
            </li> */}

            <li className={this.activeRoute('/connection')}>
              <a className='nav-link nav-dropdown-toggle' href='#' onClick={this.handleClick}><i className="fa fa-fighter-jet"></i> My Falcon</a>
              <ul className='nav-dropdown-items'>
                <li className='nav-item'>
                  <NavLink to={'/licenses'} className='nav-link' activeClassName='active'><i className='fa fa-cc-diners-club'></i> Licenses</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink to={'/firmware'} className='nav-link' activeClassName='active'><i className='fa fa-google-wallet'></i> Firmware</NavLink>
                </li>

                <li className='nav-item'>
                  <NavLink to={'/superpole'} className='nav-link' activeClassName='active'> <i className="fa fa-file-text"></i> Super Pole</NavLink>
                </li>
                {/* <li className='nav-item'>
                  <NavLink to={'/demolink'} className='nav-link' activeClassName='active'> <i className="fa fa-file-text"></i> Demo Link</NavLink>
                </li> */}

                <li className='nav-item'>
                  <NavLink to={'/about'} className='nav-link' activeClassName='active'> <i className="fa fa-file-text"></i> About</NavLink>
                </li>





              </ul>
            </li>

            <li className='nav-item'>
              <NavLink to={'/upload'} className='nav-link' activeClassName='active'><i className="fa fa-floppy-o "></i> Upload</NavLink>
            </li>

            <li className='divider'></li>
          </ul>
        </nav>
      </div>
    );
  }
}
export default Sidebar;
