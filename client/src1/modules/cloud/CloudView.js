import React, { Component } from 'react';

class CloudView extends Component {
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
                            <div className="card-header">
                                <strong>Credentials</strong>
                            </div>
                            <div className="card-block">
                                <form action="" method="post">
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Azure Key</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Azure Secret Key</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-sm btn-success"><i className="fa fa-dot-circle-o"></i> Sync</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CloudView;
