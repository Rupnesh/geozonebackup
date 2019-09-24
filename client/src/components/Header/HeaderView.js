import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import auth from '../../utils/authentication';
//const authData = auth.get();
// const authData = auth.getAuth();
/* globals document */
class HeaderView extends Component {
  
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
  
    this.props.getUserData();
    
    // this.state = {
    //   dropdownOpen: false
    // };

    this.state = {
      dropdownOpen: false,
      username: ''
    };

    auth.get().then((res) => {
      this.authData = res;
      //console.log("header res....",res)
      this.setState({ username: res.userId }, () => {
        console.log(this.state.username)
      });
    })
  }
  
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  
  sidebarToggle = (e) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  };
  
  mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  };
  
  logout() {
    const { logoutUser } = this.props;
    logoutUser();
  }
  
  render() {
    const { userData } = this.props;
    return (
      <header className='app-header navbar'>
        <button className='navbar-toggler mobile-sidebar-toggler d-lg-none' type='button' onClick={this.mobileSidebarToggle}>&#9776;</button>
        <a href='/#/dashboard' className='navbar-brand'>&nbsp;</a>
        <ul className='nav navbar-nav d-md-down-none'>
          <li className='nav-item'>
            <button className='nav-link navbar-toggler sidebar-toggler' type='button' onClick={this.sidebarToggle}>&#9776;</button>
          </li>
          <li className='nav-item px-3'>
            <a href='/#/dashboard' className='nav-link'>Dashboard</a>
          </li>
          {/* <li className='nav-item px-3'>
            <a href='/#/connection' className='nav-link' onClick={() => {document.body.classList.remove('sidebar-hidden');}}>Connection</a>
          </li>
          <li className='nav-item px-3'>
            <a href='/#/gps' className='nav-link' onClick={() => {document.body.classList.remove('sidebar-hidden');}}>Gps</a>
          </li>
          <li className='nav-item px-3'>
            <a href='/#/cloud' className='nav-link' onClick={() => {document.body.classList.remove('sidebar-hidden');}}>Cloud</a>
          </li>
          <li className='nav-item px-3'>
            <a href='/#/survey' className='nav-link' onClick={() => {document.body.classList.remove('sidebar-hidden');}}>Survey</a>
          </li> */}
           <li className='nav-item px-3'>
            <a href='/#/connection/wifi' className='nav-link' onClick={() => {document.body.classList.remove('sidebar-hidden');}}>WiFi</a>
          </li>
          <li className='nav-item px-3'>
            <a href='/#/logging' className='nav-link' onClick={() => {document.body.classList.remove('sidebar-hidden');}}>Logging</a>
          </li>
          <li className='nav-item px-3'>
            <a href='/#/licenses' className='nav-link' onClick={() => {document.body.classList.remove('sidebar-hidden');}}>Licenses</a>
          </li>
          <li className='nav-item px-3'>
            <a href='/#/firmware' className='nav-link' onClick={() => {document.body.classList.remove('sidebar-hidden');}}>Firmware</a>
          </li>
          
          <li className='nav-item px-3'>
            <a href='/#/about' className='nav-link' onClick={() => {document.body.classList.remove('sidebar-hidden');}}>About</a>
          </li>
        </ul>
        <ul className='nav navbar-nav ml-auto'>
          <li className='nav-item'>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <button onClick={this.toggle} className='nav-link dropdown-toggle mr-2' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded={this.state.dropdownOpen}>
                <img src={'img/avatars/6.jpg'} className='img-avatar' alt='admin@bootstrapmaster.com'/>
                <span className='d-md-down-none'>{this.state.username ? this.state.username : ''}</span>
                {/* <span className='d-md-down-none'>{authData.userId}</span> */}
              </button>
              
              <DropdownMenu className='dropdown-menu-right'>
                
                <DropdownItem header className='text-center'><strong>Settings</strong></DropdownItem>
                
                <DropdownItem><i className='fa fa-user'></i> Profile</DropdownItem>
                <DropdownItem><i className='fa fa-wrench'></i> Settings</DropdownItem>
                <DropdownItem divider/>
                <DropdownItem onClick={this.logout}><i className='fa fa-lock'></i> Logout</DropdownItem>
              
              </DropdownMenu>
            </Dropdown>
          </li>
        </ul>
      </header>
    );
  }
}

/*HeaderView.defaultProps = {
  userData: {
    firstname: 'Username'
  }
};*/

HeaderView.propTypes = {
  logoutUser: PropTypes.func.isRequired
};

export default HeaderView;
