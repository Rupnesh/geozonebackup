import React, { Component } from "react";
import { AxiosPromise } from "../../services/fetchAPI";
import { api } from "../../config/api";
import Moment from "react-moment";
import moment from "moment-timezone";
import LoadingSpinner from "../../views/Components/LoadingSpinner";

class AboutView extends Component {
  componentDidMount() {
    this.callAboutApi();
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  callAboutApi = () => {
    AxiosPromise.get(api.about_list).then(data=> {
        if (data) {
          //  this.setState({aboutList: data.data})
        }
      })
      .then(error => {
        console.log("error", error);
      });
  };

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <strong>About</strong>
                            </div>
                            <div className="card-block">
                                <form action="" method="post">
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Falcon Version: </label>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Falcon Firmware:</label>
                                        <div className="col-md-9">
                                              <label className="col-md-3 form-control-label" htmlFor="select">1.0</label>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Falcon Serial Number:</label>
                                        <div className="col-md-9">
                                              <label className="col-md-3 form-control-label" htmlFor="select">1290</label>
                                        </div>
                                    </div>
                                    <div className="form-group row">	
                                        <label className="col-md-3 form-control-label" htmlFor="select">Onyx Options Status</label>
                                        <div className="col-md-9">
                                              <label className="col-md-3 form-control-label" htmlFor="select">  1.0</label>
                                        </div>
                                    </div>
                                    <div className="form-group row">	
                                        <label className="col-md-3 form-control-label" htmlFor="select">GNSS Receiver Board:</label>
                                        <div className="col-md-9">
                                              <label className="col-md-3 form-control-label" htmlFor="select"> Navcom Onyx R2</label>
                                        </div>
                                    </div>
                                    <div className="form-group row">	
                                        <label className="col-md-3 form-control-label" htmlFor="select">GNSS Receiver Firmware:</label>
                                        <div className="col-md-9">
                                              <label className="col-md-3 form-control-label" htmlFor="select"> 2.0.5</label>
                                        </div>
                                    </div>
                                    <div className="form-group row">	
                                        <label className="col-md-3 form-control-label" htmlFor="select">GNSS Receiver Serial Number:</label>
                                        <div className="col-md-9">
                                              <label className="col-md-3 form-control-label" htmlFor="select"> 1290</label>
                                        </div>
                                    </div>
                                    <div className="form-group row">	
                                        <label className="col-md-3 form-control-label" htmlFor="select">GNSS Antenna Type:</label>
                                        <div className="col-md-9">
                                              <label className="col-md-3 form-control-label" htmlFor="select">Tallysman</label>
                                        </div>
                                    </div>

                                </form>
                            </div>
                            {/* <div className="card-footer">
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
