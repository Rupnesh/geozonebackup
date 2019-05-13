import React, { Component } from "react";
import { AxiosPromise } from "../../services/fetchAPI";
import { api } from "../../config/api";
import Moment from "react-moment";
import moment from "moment-timezone";
import LoadingSpinner from "../../views/Components/LoadingSpinner";

var data = {
    "GNSS": {
        "GNSS": [
            {
                "GNSS Receiver Board": "Navcom Onyx R2"
            },
            {
                "GNSS Receiver Serial Number": 1290
            },
            {
                "GNSS Antenna Type": "Tallysman"
            }
        ]
    },
    "GSM": {
        "GSM": [
            {
                "GSM Modem Version": "Quectel u-GSM UG96"
            },
            {
                "GSM Modem Firmware": 1.25
            },
            {
                "GSM Modem Serial Number": 84037
            },
            {
                "GSM Modem IMEI": 865851038406104
            },
            {
                "GSM modem Status": [
                    "ON",
                    "connected"
                ]
            }
         ]
    },
    "SD-Card": {
        "SD-Card": [
            {
                "SD Card": "Not inserted"
            },
            {
                "SD Card Space": "availabled space"
            }
        ]
    },
    "UHF": {
        "UHF": [
            {
                "UHF Modem Version": "Satelline-M3-TR4-TA23"
            },
            {
                "UHF Modem Serial Number": 1913000077
            }
        ]
    },
    "falcon-version": {
        "falcon-version": [
            {
                "Falcon Version": 1
            },
            {
                "Falcon Firmware": 1
            },
            {
                "Falcon Serial Number": 1290
            }
        ]
    }
}

class AboutView extends Component {
  componentDidMount() {
    this.callAboutApi();
  }
  constructor(props) {
    super(props);
    this.state = {
        isLoading: false
    };
  }

  callAboutApi = () => {
    this.setState({isLoading:false})
    AxiosPromise.get(api.about_list).then(data=> {
        if (data) {
           this.setState({aboutList: data.data, isLoading: true})
        }
      })
      .then(error => {
        console.log("error", error);
        this.setState({isLoading:true})
      });
  };

  renderList = (value, index) => {
      if(this.state.aboutList){
      return(
        this.state.aboutList[value] && this.state.aboutList[value][value] && this.state.aboutList[value][value].map((val, i)=>{
        return(
            <div>
        <div className="form-group row">
            <label className="col-md-3 form-control-label" htmlFor="select">{Object.keys(val)[0]} :</label>
            <div className="col-md-9">
                  <label className="col-md-3 form-control-label" htmlFor="select">{val[Object.keys(val)[0]]}</label>
            </div>
        </div>
        </div>
        )
    }))
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
                                <form action="" method="post">
                                <div className="form-group row">
                                        <strong className="col-md-3 form-control-label" htmlFor="select">{Object.keys(this.state.aboutList[Object.keys(this.state.aboutList)[0]])[0]}</strong>
                                    </div>    
                                                  
                                { this.renderList('UHF',0)}
                                <div className="form-group row">
                                        <strong className="col-md-3 form-control-label" htmlFor="select">{Object.keys(this.state.aboutList[Object.keys(this.state.aboutList)[1]])[0]}</strong>
                                    </div>    
                          
                                { this.renderList('GNSS',1)}
                                <div className="form-group row">
                                        <strong className="col-md-3 form-control-label" htmlFor="select">{Object.keys(this.state.aboutList[Object.keys(this.state.aboutList)[2]])[0]}</strong>
                                    </div>    
                                { this.renderList('GSM',2)}
                                <div className="form-group row">
                                        <strong className="col-md-3 form-control-label" htmlFor="select">{Object.keys(this.state.aboutList[Object.keys(this.state.aboutList)[3]])[0]}</strong>
                                    </div>    
                                { this.renderList('SD-card',3)}
                                <div className="form-group row">
                                        <strong className="col-md-3 form-control-label" htmlFor="select">{Object.keys(this.state.aboutList[Object.keys(this.state.aboutList)[4]])[0]}</strong>
                                    </div>    
                                { this.renderList('falcon-version',4)}
                                   

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

export default AboutView;
