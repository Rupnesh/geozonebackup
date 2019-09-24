import React, { PureComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Aside from '../../components/Aside';
import Footer from '../../components/Footer';

/*import Dashboard from '../../views/Dashboard';*/
import Dashboard from '../../modules/dashboard';
import Collections from '../../modules/collections';
import Charts from '../../views/Charts';
import Widgets from '../../views/Widgets';
import Buttons from '../../views/Components/Buttons';
import WiFi from '../../modules/connection/WiFi';
import BlueTooth from '../../modules/connection/BlueTooth';
import Cable from '../../modules/connection/Cable';
import GpsMain from '../../modules/gps/Main';
import Device from '../../modules/gps/Device';
import Calibration from '../../modules/gps/Calibration';
import Radios from '../../modules/gps/Radios';
import NTRIP from '../../modules/gps/NTRIP';
import Senzors from '../../modules/gps/Senzors';
import Firmware from '../../modules/gps/Firmware';
import StarFire from '../../modules/gps/StarFire';
import BaseCord from '../../modules/gps/BaseCord';
import LogData from '../../modules/gps/LogData';
import Cloud from '../../modules/cloud';
import Survey from '../../modules/survey';
import Licenses from '../../modules/licenses';
import About from '../../modules/about'

import Logging from '../../modules/logging';
import FirmwareMain from '../../modules/firmware';
import Onyx from '../../modules/onyx';
import Superpole from '../../modules/superpole';


import Cards from '../../views/Components/Cards';
import Forms from '../../views/Components/Forms';
import Modals from '../../views/Components/Modals';
import SocialButtons from '../../views/Components/SocialButtons';
import Switches from '../../views/Components/Switches';
import Tables from '../../views/Components/Tables';
import Tabs from '../../views/Components/Tabs';
import FontAwesome from '../../views/Icons/FontAwesome';
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons';

export default class MainView extends PureComponent {
  render() {
    return (
      <div className='app'>
        <Header/>
        <div className='app-body'>
          <Sidebar {...this.props}/>
          <main className='main'>
            <Breadcrumb/>
            <div className='container-fluid'>
              <Switch>
                <Route path='/dashboard' name='Dashboard' component={Dashboard}/>
                <Route path='/collections' name='Collections' component={Collections}/>
                <Route path='/components/buttons' name='Buttons' component={Buttons}/>

                <Route path='/wifi' name='WiFi' component={WiFi}/>

                <Route path='/connection/bluetooth' name='BlueTooth' component={BlueTooth}/>
                <Route path='/connection/cable' name='Cable' component={Cable}/>
                
                {/* <Redirect from='/connection' to='/connection/wifi'/> */}

                <Route path='/gps/main' name='Main' component={GpsMain}/>
                <Route path='/gps/device' name='Device' component={Device}/>
                <Route path='/gps/calibration' name='Calibration' component={Calibration}/>
                <Route path='/gps/radios' name='Radios' component={Radios}/>
                <Route path='/gps/ntrip' name='NTRIP' component={NTRIP}/>
                <Route path='/gps/senzors' name='Senzors' component={Senzors}/>
                <Route path='/gps/firmware' name='Firmware' component={Firmware}/>
                <Route path='/gps/starfire' name='StarFire' component={StarFire}/>
                <Route path='/gps/basecord' name='BaseCord' component={BaseCord}/>
                <Route path='/gps/logdata' name='LogData' component={LogData}/>
                <Redirect from='/gps' to='/gps/main'/>
                <Route path='/cloud' name='Cloud' component={Cloud}/>
                <Route path='/survey' name='Survey' component={Survey}/>
                <Route path='/licenses' name='Licenses' component={Licenses}/>
                <Route path='/about' name='About' component={About}/>

                <Route path='/logging' name='Logging' component={Logging}/>
                <Route path='/firmware' name='Firmware' component={FirmwareMain}/>
                <Route path='/onyx' name='Onyx' component={Onyx}/>
                <Route path='/superpole' name='Superpole' component={Superpole}/>



                <Route path='/components/cards' name='Cards' component={Cards}/>
                <Route path='/components/forms' name='Forms' component={Forms}/>
                <Route path='/components/modals' name='Modals' component={Modals}/>
                <Route path='/components/social-buttons' name='Social Buttons' component={SocialButtons}/>
                <Route path='/components/switches' name='Swithces' component={Switches}/>
                <Route path='/components/tables' name='Tables' component={Tables}/>
                <Route path='/components/tabs' name='Tabs' component={Tabs}/>
                <Route path='/icons/font-awesome' name='Font Awesome' component={FontAwesome}/>
                <Route path='/icons/simple-line-icons' name='Simple Line Icons' component={SimpleLineIcons}/>
                <Route path='/widgets' name='Widgets' component={Widgets}/>
                <Route path='/charts' name='Charts' component={Charts}/>
                <Redirect from='/' to='/dashboard'/>
              </Switch>
            </div>
          </main>
          <Aside/>
        </div>
        <Footer/>
      </div>
    );
  }
}

