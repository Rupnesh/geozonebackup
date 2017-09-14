import React, { Component } from 'react';

const replaceCharactersWithRegex = (event) => {
    const { target } = event;
    const regex = new RegExp(target.dataset.regex, "g");

    target.value = target.value.replace(regex, "");
};

class NTRIPView extends Component {
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
                                        <label className="col-md-3 form-control-label" htmlFor="select">IP Address</label>
                                        <div className="col-md-9">
                                            <input onChange={replaceCharactersWithRegex} data-regex="[^0-9.]" className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Port</label>
                                        <div className="col-md-9">
                                            <input onChange={replaceCharactersWithRegex} data-regex="[^0-9]" className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Stream Name</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">User Name</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-md-3 form-control-label" htmlFor="select">Password</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="password" />
                                        </div>
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

export default NTRIPView;
