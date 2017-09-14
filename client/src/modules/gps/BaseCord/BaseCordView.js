import React, { Component } from 'react';

class BaseCordView extends Component {
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
                                        <label className="col-md-3 form-control-label" htmlFor="select">Base Latitude</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Base Longitude</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Base Altitude</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Base North</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Base Easth</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Base Level</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-sm btn-block btn-success w-25"><i className="fa fa-dot-circle-o"></i> Snap</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BaseCordView;
