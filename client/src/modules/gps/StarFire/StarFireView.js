import React, { Component } from 'react';

const onBlur = (event) => {
    const { target } = event;
    const oldValue = parseFloat(target.value);

    target.value = (isNaN(oldValue) ? 0 : oldValue).toFixed(2);
};

class StarFireView extends Component {
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
                                        <label className="col-md-3 form-control-label" htmlFor="select">SFOIP Mount Point</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Status</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">StarFire Sat ID</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">StarFire License</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">License Start Date</label>
                                        <div className="col-md-9">
                                            <input className="form-control no-spinner" type="date"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">License Stop Date</label>
                                        <div className="col-md-9">
                                            <input className="form-control no-spinner" type="date"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="recordata">Allow SFOIP Switching</label>
                                        <label className="switch switch-3d switch-primary">
                                            <input type="checkbox" className="switch-input"/>
                                            <span className="switch-label"></span>
                                            <span className="switch-handle"></span>
                                        </label>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="geometadata">Use Rapid Recovery</label>
                                        <label className="switch switch-3d switch-primary">
                                            <input type="checkbox" className="switch-input"/>
                                            <span className="switch-label"></span>
                                            <span className="switch-handle"></span>
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default StarFireView;
