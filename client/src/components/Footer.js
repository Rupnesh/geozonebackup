import React, { PureComponent } from 'react';

export default class Footer extends PureComponent {
  render() {
    const year = (new Date()).getFullYear();
    return (
      <footer className='app-footer'>
        <a href='#'>FalconGPS</a> &copy; { year }
        <span className='float-right'>Powered by <a target="_blank" href='http://mcro-e.com'>MCRO</a></span>
      </footer>
    );
  }
}
