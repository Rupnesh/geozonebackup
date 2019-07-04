import React, { Component } from 'react';
import './Wifi.css';
import {GETAPI, POSTAPI, postAPI1, AxiosPromise} from '../../../services/fetchAPI'

import {api} from '../../../../src/config/api'
import LoadingSpinner from '../../../views/Components/LoadingSpinner';
import axios from 'axios';

class WifiView extends Component {
  constructor(props) {
    super(props);

    // {"statusCode":200,"success":true,"result":true,"message":"Result fetched successfuly","data":[
    //   {"essid":"Arcogast","signalleveldb":"-85"},{"essid":"Geozone AG","signalleveldb":"-67"},{"essid":"Geozone AG_RPT","signalleveldb":"-31"},
    //   {"essid":"GoeGuest","signalleveldb":"-67"},{"essid":"Skyline","signalleveldb":"-83"},{"essid":"Sunrise_2.4GHz_6E9550","signalleveldb":"-85"},
    //   {"essid":"falconGPS","signalleveldb":"-29"}]}

    this.state = {
        WIFI: true,
        WIFIList: [
          {"essid":"Arcogast","signalleveldb":"-85"},
          {"essid":"Geozone AG","signalleveldb":"-67"},
          {"essid":"Geozone AG_RPT","signalleveldb":"-31"},
          {"essid":"GoeGuest","signalleveldb":"-67"},
          {"essid":"Skyline","signalleveldb":"-83"},
          {"essid":"Sunrise_2.4GHz_6E9550","signalleveldb":"-85"},
          {"essid":"falconGPS","signalleveldb":"-29"}
        ],
        selectedWIFI:"",
        connectedWIFI:"",
        WIFIList1: [],
        nf_email:"",
        nf_password:"",
        loading:true,
        ConnectedStatus:null,
        statusMSGName:''
        

    };
    this.toggleWIFI = this.toggleWIFI.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // this.props.getWiFiList();
  }

  componentDidMount() {
    // this.state.WIFIList.sort((a, b) => a.strength - b.strength);
    this.getStatusOfWiFi()
    this.wifiListApiCall()
   // this.getStatusOfWiFi()
  }

  wifiListApiCall = (url) => {
    AxiosPromise.get(api.getWifiOn)
    .then(response => {
      if(response.data.wifistatus) {
      setTimeout(() => {
        this.getListOfWifi()
      }, 5000); 
      
      }
    
    })
    .catch(error => {
      console.log("error", error);
    //  this.setState({ loading: false });
    });
  }

  getListOfWifi = () =>{
    AxiosPromise.get(api.wifiList)
    .then(response => {
      if(response.data) {
       let output = Object.keys(response.data).map(function(key) {
          return {type: key, name: response.data[key]};
       });
       
        this.setState({  WIFIList1: output, loading: false })
      //   // this.setState({  WIFIList1: response.data }, function () {
        //   console.log(this.state.WIFIList1);
        // })
      }
    
    })
    .catch(error => {
      console.log("error", error);
    //  this.setState({ loading: false });
    });
  }

  getStatusOfWiFi = () => {
    AxiosPromise.get(api.wifiStatus)
    .then(response => {
        if(response.data) {
          this.setState({ConnectedStatus: response.data.status, statusMSG1:response.data.message1,
             statusMSG2:response.data.message2,
             statusMSG3: response.data.message3,
            statusMSGName: response.data.message4,
            WIFI: true });
      }
    
    })
    .catch(error => {
      console.log("error", error);
    //  this.setState({ loading: false });
    });
  }


  scanWIFI() {
    this.setState({loading : true, WIFIList1:[] })
    this.getListOfWifi()

   
  }


  toggleWIFI() {
    
    this.setState({
      WIFI: !this.state.WIFI,
      loading: false,
      nf_email:'',
      nf_password:'',
      notConnectedMessage:''
    });

    if(this.state.WIFI === true) {

      AxiosPromise.get(api.OFF_WIFI)
      .then(response => {
      if(response) {

      }
    
    })
    .catch(error => {
      console.log("error", error);
    });
    }
    else {
      this.setState({loading : true})
      this.setState({ WIFIList1: []});

     this.wifiListApiCall()

      
    }
    
  }


  loginToWIFI = () => {
    console.log("WIFI>>>",this.state.selectedWIFI)
    
    // let data = {"ssid":"Arcogast1","pass":"Arcogast@17" }
    let data = {"ssid":this.state.selectedWIFI,"pass":this.state.nf_password +'\r\n' }

    AxiosPromise.post(api.LOGIN_WITH_WIFI, data)
    .then(response => {
      if(response.data) {
        this.setState({ConnectedStatus: response.data.status,
           statusMSG1:response.data.message1, 
           statusMSG2:response.data.message2, statusMSG3: response.data.message3,      
            statusMSGName: response.data.message4, });
      }
    })
    .catch(error =>
      console.log("error", error));

    this.setState({ connectedWIFI: this.state.selectedWIFI })
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // async handleChange(key,value) {
  //   console.log(value)
  //   try {
  //     this.setState({ [key]: value})
  //   } catch (error) {
  //     console.log("Error saving data" + error);
  //   }
  // }


  render() {
    let cursorStyle, selectEle;
    if(!this.state.WIFI) {
      cursorStyle = { cursor:"not-allowed"}
    }
         
    return (
      <div className="animated fadeIn">

        <div className="row">
        <div className='card-block col-sm-6 col-md-6 col-lg-6'>
          <div className="form-group row ">
            <label className="col-md-5 form-control-label mw-75" htmlFor="recordata">Enable/ Disable WiFi</label>
            <label className="switch switch-3d switch-primary">
              <input
              type="checkbox"
              className="switch-input"
              checked={this.state.WIFI}
              onChange={this.toggleWIFI}/>
              <span className="switch-label"></span>
              <span className="switch-handle"></span>
            </label>
          </div>
        </div>

        <div className='card-block col-sm-6 col-md-6 col-lg-6'>
          {/* { this.state.WIFI ? "Connected to "+this.state.connectedWIFI : "Not Connected"} */}
          { (this.state.ConnectedStatus === 1) ?   this.state.statusMSGName +', '+this.state.statusMSG1 + ', ' + this.state.statusMSG2 + ', ' + this.state.statusMSG3: this.state.statusMSG1 }
          {/* { (this.state.WIFI && this.state.ConnectedStatus == 0) ?   this.state.statusMSG1 + '/' + this.state.statusMSG2 : this.state.statusMSG1 } */}
        </div>
        </div>


        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-header">
                  <strong>Available WiFi</strong>
              </div>
              <div className="card-block">
                <div className="form-group">
                  <button onClick={()=>this.scanWIFI()} disabled={!this.state.WIFI} type="button" className="btn btn-primary btn-lg btn-block">WiFi Scan</button>

                  <div>

                    {this.state.loading ? <LoadingSpinner /> : 
                    
                    <select onChange={(e)=>this.setState({selectedWIFI:e.target.value}) } id="multiple-select" name="multiple-select" style={cursorStyle} className="form-control" size="5">
                    
                      { this.state.WIFIList1 && this.state.WIFIList1.length > 0 &&
                        this.state.WIFIList1.sort((a, b) => b.name - a.name).map(
                          (i, index) => { return (<option disabled={!this.state.WIFI} value={i.type} key={index}>{i.type}</option>) }
                        )
                      }

                      { this.state.WIFI && this.state.WIFIList.length == 0 &&
                        <option disabled={this.state.WIFI} value="no1" key="no">No Data Available</option>
                      }

                      { !this.state.WIFI && 
                        <option disabled={!this.state.WIFI} value="no1" key="no">Turn On the WIFI</option>
                      }

                    </select>

                    }

                  </div>
                  
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-header">
                  <strong>Credentials</strong>
              </div>
              <div className="card-block">
                  <form action="" method="post">
                      <div className="form-group">
                          <input type="email" value={this.state.selectedWIFI} id="nf-email" style={cursorStyle} name="nf_email" disabled={!this.state.WIFI} className="form-control" placeholder="User Name"/>
                      </div>
                      <div className="form-group">
                          <input 
                          type="password" 
                          //value={this.state.nf_password} 
                          onChange={this.handleChange} id="nf-password" 
                          style={cursorStyle} 
                          name="nf_password" 
                          //disabled={!this.state.WIFI} 
                          className="form-control" 
                          placeholder="Password"/>
                      </div>
                  </form> 
              </div>
              <div className="card-footer">
                  <button onClick={()=>this.loginToWIFI()} type="submit" disabled={!this.state.WIFI} style={cursorStyle} className="btn btn-sm btn-success"><i className="fa fa-dot-circle-o"></i> Connect to WiFi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default WifiView;



