import React, { Component } from "react";
import { AxiosPromise } from "../../services/fetchAPI";
import { api } from "../../config/api";
import Moment from "react-moment";
import moment from "moment-timezone";
import LoadingSpinner from "../../views/Components/LoadingSpinner";
import { socketConnect } from 'socket.io-react';


class AboutView extends Component {
    
  componentDidMount() {
    this.callAboutApi();
    this.callSDCardApi();

    const { socket } = this.props;
    socket.socketConnect
          
    socket && socket.emit('subscribe', 'data-batteryStatus');
    
     socket.on('data-batteryStatus', this.handleBatteryStatus);
   
  }

  
  componentWillUnmount(){
    const { socket } = this.props;
    socket.socketConnect
    socket && socket.emit('unsubscribe', 'data-batteryStatus');
    // clearInterval(this.interval)
  }
  constructor(props) {
    super(props);
    this.state = {
        isLoading: false,
        sdCardDetails:null,
        batteryPercentage:"--",
        batterySecondPercentage:0,
        batteryPlugInInserted:"--",
    };
  }

  componentWillUnmount() {

    const { socket } = this.props;
    socket && socket.emit('unsubscribe', 'data-batteryStatus');
   
  }
  handleBatteryStatus = (data) => {
    if (data){
        try {
            this.setState({
                batteryPercentage: data.internal_battery,
                batterySecondPercentage: data.secondary_battery,
                batteryStatus:data.volatage,
                batteryVoltageThreshold: data.batteryVoltageThreshold
            })
        } catch (error) {
            console.log("BatteryData",error)
        }
        
    }
  }

  callAboutApi = () => {
    this.setState({isLoading:false})
    AxiosPromise.get(api.hardware_about).then(data=> {
        if (data) {
           this.setState({aboutList: data.data, isLoading: true})
        }
      })
      .catch(error => {
        console.log("error", error);
        this.setState({isLoading:true})
      });
  };


  callSDCardApi = () => {
    AxiosPromise.get(api.about_list).then(data=> {
        if (data.data.status === 1) {
           this.setState({sdCardDetails: data.data})
        }else{
            this.callSDCardApi();
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };

//   getBatteryStatus = () => {
//     AxiosPromise.get(api.batteryStatus).then(data=> {
//         if (data) {
//             this.setState({
//                 batteryPercentage: data.internal_battery,
//                 batterySecondPercentage: data.secondary_battery,
//                 batteryStatus:data.volatage})
//           //console.log("DATA BATTERY", data)
//         }
//       })
//       .catch(error => {
//         console.log("error", error);
//       });
//   };

  renderList = (data, value, index) => {
      if(data){
          try {
            return(
                data[value] && data[value][value] && data[value][value].map((val, i)=>{
                return(
                    <div>
                <div className=" row">
                    <label className="col-md-3 " htmlFor="select">{Object.keys(val)[0]} :</label>
                    { Array.isArray(val[Object.keys(val)[0]]) ? 
                     Object.keys(val)[0] === "SD_Card_Space" ?
                      <div className="col-md-9">
                      <label className="col-md-3 " htmlFor="select">Memory Free: {val[Object.keys(val)[0]][0]}</label>
                      <label className="col-md-3 " htmlFor="select">Used: {val[Object.keys(val)[0]][1]}</label>
                      <label className="col-md-3 " htmlFor="select">Total: {val[Object.keys(val)[0]][2]}</label>
                </div> :   <div className="col-md-9">
                      <label style= {{marginLeft:'15px'}} htmlFor="select">{val[Object.keys(val)[0]][0]},</label>
                      <label className="col-md-3 " htmlFor="select">{val[Object.keys(val)[0]][1]}</label>
                </div> 
                    :
                    <div className="col-md-9">
                          <label className="col-md-3 " htmlFor="select">{val[Object.keys(val)[0]]}</label>
                    </div> 
                    }
                </div>
                </div>
                )
            }))
              
          } catch (error) {
           console.log("aboutListError", error)   
          }
     
  }
}

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h6>About</h6>
                            </div>
                            { this.state.isLoading ?
                            <div className="card-block">
                                <form >
                                <div className=" row">
                               {this.state.aboutList && 
                               <strong className="col-md-3 " style = {{marginBottom:'10px'}} 
                               htmlFor="select">{Object.keys(this.state.aboutList[Object.keys(this.state.aboutList)[1]])[0]}</strong> }
                                    </div>    
                                                  
                                { this.renderList(this.state.aboutList,'GNSS',0)}
                                <div className=" row">
                                {this.state.aboutList && 
                                <strong className="col-md-3 " style = {{marginBottom:'10px'}} 
                                htmlFor="select">{Object.keys(this.state.aboutList[Object.keys(this.state.aboutList)[2]])[0]}</strong>}
                                    </div>    
                          
                                { this.renderList(this.state.aboutList,'GSM',1)}
                                <div className=" row">
                                {this.state.aboutList && 
                                <strong className="col-md-3"   style = {{marginBottom:'10px'}}
                                htmlFor="select">{Object.keys(this.state.aboutList[Object.keys(this.state.aboutList)[3]])[0]}</strong>}
                                    </div>    
                                { this.renderList(this.state.aboutList,'UHF',2)}
                                <div className=" row">
                                {this.state.aboutList &&
                                     <strong className="col-md-3 " style = {{marginBottom:'10px'}} 
                                     htmlFor="select">{Object.keys(this.state.aboutList[Object.keys(this.state.aboutList)[0]])[0]}</strong>}
                                    </div> 
                                    { this.renderList(this.state.aboutList, 'Falcon-version',3)}  
                                <div>  
                                    <div className=" row">
                                     <strong className="col-md-3 " style = {{marginBottom:'10px'}} 
                                     htmlFor="select">Battery Status</strong>
                                    </div>    
                                    <div className=" row">
                                     <label className="col-md-3 " htmlFor="select">Internal Battery Level: </label>
                                   <div className="col-md-9">
                                    <label className="col-md-3 " htmlFor="select">{this.state.batteryPercentage}%</label>
                                  </div>
                                  </div>

                                  <div className=" row">
                                     <label className="col-md-3 " htmlFor="select">Battery Status: </label>
                                   <div className="col-md-9">
                                    <label className="col-md-3 " htmlFor="select">{this.state.batteryStatus >= 3 ? "Charging":"Not Charging"}</label>
                                  </div>
                                  </div>

                                  {/* <div className=" row">
                                     <label className="col-md-3 " htmlFor="select">Plug-In battery status: </label>
                                   <div className="col-md-9">
                                    <label className="col-md-3 " htmlFor="select">{this.state.batterySecondPercentage !== 0 ? "Inserted" : 'Not Inserted'}</label>
                                  </div>
                                  </div> */}

                                  <div className=" row">
                                     <label className="col-md-3 " htmlFor="select">Plug-In battery Level:  </label>
                                   <div className="col-md-9">
                                    <label className="col-md-3 " htmlFor="select">{this.state.batterySecondPercentage}%</label>
                                  </div>
                                  </div>

                                </div>     
                               
                                {this.state.sdCardDetails ?
                                <div>  
                                    <div className=" row">
                                     <strong className="col-md-3 " style = {{marginBottom:'10px'}} 
                                     htmlFor="select">{Object.keys(this.state.sdCardDetails[Object.keys(this.state.sdCardDetails)[0]])[0]}</strong>
                                    </div>    
                                { this.renderList(this.state.sdCardDetails, 'SD-card',0)}
                                </div>
                                :
                                     <div className=" row">
                                       <strong className="col-md-3 " style = {{marginBottom:'10px'}}  htmlFor="select">SD-card :</strong>
                                     <div className="col-md-9">
                                           <label className="col-md-3 " htmlFor="select">No SD-Card</label>
                                     </div>
                                     </div>
                                     }

                                </form>
                            </div>: <LoadingSpinner/>
                            }
                            {/* <div className="card-footer">
                                <button type="submit" className="btn btn-sm btn-success"><i className="fa fa-dot-circle-o"></i> Sync</button>
                            </div>


                            <div className="card-footer">
                                <button type="submit" className="btn btn-sm btn-success"><i className="fa fa-dot-circle-o"></i> Sync</button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default socketConnect(AboutView)

