import React, { Component } from "react";
import { AxiosPromise } from "../../services/fetchAPI";
import { api } from "../../config/api";
import Moment from 'react-moment';
import moment from 'moment-timezone';
import LoadingSpinner from "../../views/Components/LoadingSpinner";


class LicensesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      StarFireLicensesNo: "",
      OnyxLicensesNo: "",
      licenseActivationStatus: '',
      licenseActivationStatusNo:1,
      optionListData:[],
      optionActivationStatus:'',
      isActiveLicense:'',
      expiryData:'',
      optionActivationStatusNo:1,
      listOfActiveOption:[],
      maxNavFreq:'',
      maxDataRate:''

    };
  }

  componentDidMount() {
    this.getLicensesDetail(this.optionCall);
    //this.renderOptionActiveList()
  }

  getLicensesDetail = (callback) => {
      const header = {
        "content-type": "application/json"
      }
    AxiosPromise.get(api.license_status, header)
      .then(response => {
        if (response) {
            callback()
          this.setState({ isActiveLicense: response.data.LicenseStatus, expiryData: response.data.EndDate});
        }
      })
      .then(error => {
        console.log("error", error);
      });
  };

  optionCall = () => {
    AxiosPromise.get(api.option_status)
    .then(response => {
      if (response) {
        this.setState({ optionListData: response.data});
        this.renderOptionActiveList()
      }
    })
    .then(error => {
      console.log("error", error);
    });

  }

  toActivateLicense = () => {
      const data = {
        licenseNumber: `${this.state.StarFireLicensesNo}\r\n`
      }
    AxiosPromise.post(api.license_active, data).then(response => {
        if (response) {
       this.setState({licenseActivationStatus: response.data.message, licenseActivationStatusNo: response.data.status})
        }
      })
      .then(error => {
        console.log("error", error);
      });
  }

  renderOptionActiveList = () =>{
    let a = []
    for (var i = 0; i < this.state.optionListData.length ; i ++){
      if(this.state.optionListData[i][Object.keys(this.state.optionListData[i])[0]] === " 1" ||
      (Object.keys(this.state.optionListData[i])[0]) === " Max Nav Rate" ||
      (Object.keys(this.state.optionListData[i])[0]) === " Max Data Rate")
     { 
       if ( (Object.keys(this.state.optionListData[i])[0]) === " Max Nav Rate"){
         this.setState({maxNavFreq: (this.state.optionListData[i][" Max Nav Rate"])})
      }else if ( (Object.keys(this.state.optionListData[i])[0]) === " Max Data Rate"){
         this.setState({maxDataRate: (this.state.optionListData[i][" Max Data Rate"])})
     }
       a.push(Object.keys(this.state.optionListData[i])[0])
      }
    }
    this.setState({listOfActiveOption: a})
    //console.log('data',this.state.listOfActiveOption)
    
     
}

  commafy = (num, value) => {
    var str = num.toString().split(".");
    if (num.length === 8) {
      str[0] = str[0].replace(/(\w)(?=(\w{8})+$)/g, `$1${value}`);
    } else if (num.length === 16) {
      str[0] = str[0].replace(/(\w)(?=(\w{8})+$)/g, `$1${value}`);
    } else if (num.length === 25) {
      str[0] = str[0].replace(/(\w)(?=(\w{8})+$)/g, `$1${value}`);
    } else if (num.length === 34) {
      str[0] = str[0].replace(/(\w)(?=(\w{8})+$)/g, `$1${value}`);
    }
    return str.join(".");
  };

  licensesNumber = event => {
    // const value = (event.target.value).replace(/(\d{8})/g, '$1-').trim()

    this.setState({
      StarFireLicensesNo: this.commafy(event.target.value, "-"), licenseActivationStatus: ''
    });
  };

  OnyxLicensesNo = event => {
    this.setState({ OnyxLicensesNo: this.commafy(event.target.value, " "), optionActivationStatus: '' });
  };

  toActivateOption = () =>{
    const data = {
        optionNumber: `${this.state.OnyxLicensesNo}\r\n`
      }
    AxiosPromise.post(api.post_option_status, data).then(response => {
        if (response) {
       this.setState({optionActivationStatus: response.data.message, optionActivationStatusNo: response.data.status})
        }
      })
      .then(error => {
        console.log("error", error);
      });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
         
              <div className="card-header">
                <strong>License</strong>
              </div>
              { this.state.isActiveLicense ?
              <div className="card-block">
                <form action="" method="post">
                  <div className="form-group row" style={{ marginLeft: "0px" }}>
                    <i
                      className={
                        !this.state.isActiveLicense ? "fa fa-times-circle" : "fa fa-check-circle"
                      }
                      style={{ color:this.state.isActiveLicense ? "#33cc33": "#F31B10", fontSize: "25px" }}
                      aria-hidden="true"
                    />{" "}
                    <lable className="col-md-3">
                      Onyx Starfire License Status:
                    </lable>
                    {this.state.isActiveLicense && <label className="form-control-label" htmlFor="select">
                    <label style = {{color: '#33cc33'}}> {this.state.isActiveLicense}</label> Valid Until {''}
                    <label style = {{color: '#F31B10'}}><Moment parse="YYYY-MM-DD HH:mm">
                     {this.state.expiryData}
                     </Moment></label>
                    </label>
                    }
                  </div>
                  <div
                    className="form-group row"
                    style={{ marginLeft: "0px", marginBottom: "20px" }}
                  >
                    <i
                      className={
                        this.state.optionListData && this.state.optionListData.length >0 ? "fa fa-check-circle"
                          : "fa fa-times-circle"
                      }
                      style={{ color:  this.state.optionListData && this.state.optionListData.length >0 ? "#33cc33" : "#F31B10", fontSize: "25px" }}
                      aria-hidden="true"
                    />{" "}
                    <lable className="col-md-3" >Onyx Options Status:  {" "}</lable>
                    <lable style = {{color: this.state.optionListData && this.state.optionListData.length >0 ?'#33cc33': "#F31B10"}}>
                    { this.state.optionListData && this.state.optionListData.length >0 ? "Option is Active": "Option is Inactive"}
                    </lable>
                    <lable className="col-md-5"> {this.state.listOfActiveOption.map((val, i)=>{ 
                      if(i === 0){
                       return `${val} = ${this.state.maxDataRate}, `
                      }else if (i === 1){
                        return `${val} = ${this.state.maxNavFreq}, `
                      }else{
                        return `${val}, `
                      }
                  }
                    )} </lable>
                  
                  </div>
                  <div className="form-group row">
                    <label
                      className="col-md-3 form-control-label"
                      htmlFor="select"
                    >
                      Onyx Starfire License
                    </label>
                    <i
                      className= "fa fa-times-circle"
                      style={{ color: '#fff',fontSize: "25px" }}
                      aria-hidden="true"
                    />
                    <div className="col-md-7">
                    
                      <input
                        className="form-control"
                        type="text"
                        onChange={this.licensesNumber}
                        // onSubmit={this.OnyxLicensesNo}
                        maxLength={34}
                        value={this.state.StarFireLicensesNo}
                        placeholder={"Enter 32 character license number"}
                      />
                      <h6 style={{ marginTop: "5px", color: this.state.licenseActivationStatusNo ===1? "#33cc33": "#F31B10" }}>
                        {this.state.StarFireLicensesNo.length === 35 && this.state.licenseActivationStatus}
                      </h6>
                      <button
                        type="button"  
                        disabled={
                          this.state.StarFireLicensesNo.length === 35
                            ? false
                            : true
                        }
                        className="btn btn-sm btn-success"
                        onClick={this.toActivateLicense}
                        style = {{marginTop:'10px'}}
                      >
                        <i className="fa fa-dot-circle-o" /> Set License
                      </button>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      className="col-md-3 form-control-label"
                      htmlFor="select"
                    >
                      Onyx Options
                    </label>
                    <i
                      className= "fa fa-times-circle"
                      style={{ color: '#fff',fontSize: "25px" }}
                      aria-hidden="true"
                    />
                    <div className="col-md-7">
                      <input
                        className="form-control"
                        type="text"
                        maxLength={34}
                        value={this.state.OnyxLicensesNo}
                        onChange={this.OnyxLicensesNo}
                        placeholder={"Enter 32 character license number"}
                      />
                      <h6 style={{ marginTop: "5px", color: this.state.optionActivationStatusNo ===1? "#33cc33": "#F31B10"  }}>
                      {this.state.OnyxLicensesNo.length === 35 && this.state.optionActivationStatus}
                      </h6>
                      <button
                        type="button"
                        disabled={
                          this.state.OnyxLicensesNo.length === 35 ? false : true
                        }
                        className="btn btn-sm btn-success"
                        style = {{marginTop:'10px'}}
                        onClick={this.toActivateOption}
                      >
                        <i className="fa fa-dot-circle-o" /> Set License
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              : (
                 <LoadingSpinner />
               )
             }
              <div className="card-footer" />
            </div>
                   
          </div>
        </div>
      </div>
    );
  }
}

export default LicensesView;
