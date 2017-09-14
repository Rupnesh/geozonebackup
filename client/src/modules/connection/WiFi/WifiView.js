import React, { Component } from 'react';

class WifiView extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <strong>Available WiFi</strong>
                            </div>
                            <div className="card-block">
                                <div className="form-group">
                                    <button type="button" className="btn btn-primary btn-lg btn-block">WiFi Scan</button>
                                    <div>
                                        <select id="multiple-select" name="multiple-select" className="form-control" size="5">
                                            <option value="1">Option #1</option>
                                            <option value="2">Option #2</option>
                                            <option value="3">Option #3</option>
                                            <option value="4">Option #4</option>
                                            <option value="5">Option #5</option>
                                            <option value="6">Option #6</option>
                                            <option value="7">Option #7</option>
                                            <option value="8">Option #8</option>
                                            <option value="9">Option #9</option>
                                            <option value="10">Option #10</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <strong>Credentials</strong>
                            </div>
                            <div className="card-block">
                                <form action="" method="post">
                                    <div className="form-group">
                                        <input type="email" id="nf-email" name="nf-email" className="form-control" placeholder="User Name"/>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" id="nf-password" name="nf-password" className="form-control" placeholder="Password"/>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-sm btn-success"><i className="fa fa-dot-circle-o"></i> Connect to WiFi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WifiView;
