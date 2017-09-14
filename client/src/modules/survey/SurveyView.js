import React, { Component } from 'react';

class SurveyView extends Component {
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
                                <form action="" method="post">
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Map Type</label>
                                        <div className="col-md-9">
                                            <select id="select" name="select" className="form-control">
                                                <option value="0">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Code Table</label>
                                        <div className="col-md-9">
                                            <select id="select" name="select" className="form-control">
                                                <option value="0">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">SRID</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" defaultValue="0"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="recordata">AutoPath</label>
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

export default SurveyView;
