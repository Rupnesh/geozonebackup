import React, { Component } from 'react';

const onBlur = (event) => {
    const { target } = event;
    const oldValue = parseFloat(target.value);

    target.value = (isNaN(oldValue) ? 0 : oldValue).toFixed(2);
};

class MainView extends Component {
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
                                        <label className="col-md-3 form-control-label" htmlFor="select">Type</label>
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
                                        <label className="col-md-3 form-control-label" htmlFor="select">Min. Distance</label>
                                        <div className="col-md-9">
                                            <input onBlur={onBlur} className="form-control" type="number" step="0.01" defaultValue="0.00"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Elevation Mask</label>
                                        <div className="col-md-9">
                                            <input onBlur={onBlur} className="form-control" type="number" step="0.01" defaultValue="0.00"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Staff Height</label>
                                        <div className="col-md-9">
                                            <input onBlur={onBlur} className="form-control" type="number" step="0.01" defaultValue="0.00"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">RTK Message</label>
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
                                        <label className="col-md-3 form-control-label" htmlFor="select">Correction Method</label>
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
                                        <label className="col-md-3 form-control-label" htmlFor="select">Cursor</label>
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
                                        <label className="col-md-3 form-control-label mw-75" htmlFor="recordata">Record Data Off</label>
                                        <label className="switch switch-3d switch-primary">
                                            <input type="checkbox" className="switch-input"/>
                                            <span className="switch-label"></span>
                                            <span className="switch-handle"></span>
                                        </label>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label mw-75" htmlFor="geometadata">Save GeoMetadata Off</label>
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

export default MainView;
