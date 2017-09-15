import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';

/* globals document */
class HeaderView extends Component {
  
  constructor(props) {
    super(props);
    
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      dropdownOpen: false
    };
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
  
  sidebarMinimize = (e) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  };
  
  mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  };
  
  asideToggle = (e) => {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
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
          <li className='nav-item px-3'>
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
          </li>
        </ul>
        <ul className='nav navbar-nav ml-auto'>
          {/*<li className='nav-item d-md-down-none'>
            <a className='nav-link'><i className='icon-bell'></i><span className='badge badge-pill badge-danger'>5</span></a>
          </li>
          <li className='nav-item d-md-down-none'>
            <a className='nav-link'><i className='icon-list'></i></a>
          </li>
          <li className='nav-item d-md-down-none'>
            <a className='nav-link'><i className='icon-location-pin'></i></a>
          </li>*/}
          <li className='nav-item'>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <button onClick={this.toggle} className='nav-link dropdown-toggle mr-2' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded={this.state.dropdownOpen}>
                <img src={'img/avatars/6.jpg'} className='img-avatar' alt='admin@bootstrapmaster.com'/>
                <span className='d-md-down-none'>{userData.name}</span>
              </button>
              
              <DropdownMenu className='dropdown-menu-right'>
                {/*<DropdownItem header className='text-center'><strong>Account</strong></DropdownItem>
                
                <DropdownItem><i className='fa fa-bell-o'></i> Updates<span className='badge badge-info'>42</span></DropdownItem>
                <DropdownItem><i className='fa fa-envelope-o'></i> Messages<span className='badge badge-success'>42</span></DropdownItem>
                <DropdownItem><i className='fa fa-tasks'></i> Tasks<span className='badge badge-danger'>42</span></DropdownItem>
                <DropdownItem><i className='fa fa-comments'></i> Comments<span className='badge badge-warning'>42</span></DropdownItem>*/}
                
                <DropdownItem header className='text-center'><strong>Settings</strong></DropdownItem>
                
                <DropdownItem><i className='fa fa-user'></i> Profile</DropdownItem>
                <DropdownItem><i className='fa fa-wrench'></i> Settings</DropdownItem>
                {/*<DropdownItem><i className='fa fa-usd'></i> Payments<span className='badge badge-default'>42</span></DropdownItem>
                <DropdownItem><i className='fa fa-file'></i> Projects<span className='badge badge-primary'>42</span></DropdownItem>*/}
                <DropdownItem divider/>
                {/*<DropdownItem><i className='fa fa-shield'></i> Lock Account</DropdownItem>*/}
                <DropdownItem onClick={this.logout}><i className='fa fa-lock'></i> Logout</DropdownItem>
              
              </DropdownMenu>
            </Dropdown>
          </li>
          {/*<li className='nav-item d-md-down-none'>
            <button className='nav-link navbar-toggler aside-menu-toggler' type='button' onClick={this.asideToggle}>&#9776;</button>
          </li>*/}
        </ul>
      </header>
    );
  }
}

HeaderView.defaultProps = {
  userData: {
    name: 'Admin'
  }
};

HeaderView.propTypes = {
  logoutUser: PropTypes.func.isRequired
};

export default HeaderView;
