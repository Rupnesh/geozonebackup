import React, { Component } from 'react';

class FirmwareView extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-block">
                                <form className="form-2orizontal">
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">License - User ID</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">License - Passcode</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Current Firmware</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-sm btn-block btn-success w-25"><i className="fa fa-dot-circle-o"></i> Check For Update</button>
                                <button className="btn btn-sm btn-block btn-success w-25"><i className="fa fa-dot-circle-o"></i> Upload Firmware</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FirmwareView;
