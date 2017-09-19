import React, { Component } from 'react';

class CalibrationView extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="row background-white">
                            <div className="col-sm-6 col-md-6 col-lg-6 p-3">
                                <form className="form-2orizontal">
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Latitude</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Longitude</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Altitude</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">North</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">East</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Level</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Calib Ratio</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-sm-6 col-md-6 col-lg-6 p-3">
                                <button type="button" className="btn btn-primary btn-lg d-block col-lg-7 col-md-6">Start Calibration</button>
                                <button type="button" className="btn btn-primary btn-lg d-block col-lg-7 col-md-6">Stop Calibration</button>
                                <button type="button" className="btn btn-primary btn-lg d-block col-lg-7 col-md-6">Erase Calibration</button>
                                <button type="button" className="btn btn-primary btn-lg d-block col-lg-7 col-md-6">Snap</button>
                            </div>
                        </div>
                        {/*<div className="card row">
                            <div className="card-block">
                                <form className="form-2orizontal">
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Latitude</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Longitude</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Altitude</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">North</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">East</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Level</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="text-input">Calib Ratio</label>
                                        <div className="col-md-9">
                                            <input type="text" id="text-input" name="text-input" className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="card row">
                            <div className="card-block">
                                <button type="button" className="btn btn-primary btn-lg btn-block">Start Calibration</button>
                                <button type="button" className="btn btn-primary btn-lg btn-block">Stop Calibration</button>
                                <button type="button" className="btn btn-primary btn-lg btn-block">Erase Calibration</button>
                                <button type="button" className="btn btn-primary btn-lg btn-block">Snap</button>
                            </div>
                        </div>*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default CalibrationView;
