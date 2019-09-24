import React, { Component } from "react";
import { AxiosPromise } from "../../services/fetchAPI";
import { api } from "../../config/api";
import LoadingSpinner from "../../views/Components/LoadingSpinner";
import { socketConnect } from 'socket.io-react';

class SuperpoleView extends Component {
  state = {
		superpoleData: [],
	}
  componentDidMount() {
    const { socket } = this.props;
    socket.socketConnect  
  }
 
  componentWillUnmount(){
  }
  constructor(props) {
    super(props);
    this.state = {
				superpoleData: [],
				loadSuperpole:false,
      };
  }

  componentWillUnmount() {

	}
	capture = () => {
		this.setState({loadSuperpole:true,captureButtonDisable:true});
		AxiosPromise.get(api.captureSuperpole, '', '')
			.then(data => {
				if (data.status) {
					this.setState({superpoleData: data.data, loadSuperpole:false, captureButtonDisable: false})					
				}
			})
			.catch(error => {
				console.log("error", error);
			});
	}

	render() {
		return (
			<div className="animated fadeIn">
				<div className="row">
					<div className="col-lg-12">
						<div className="card">
							<div className="card-header">
									<h6>Superpole</h6>
							</div>
							<div className="card-block">
							<div className="row">
								<div className="col-md-12">
										<img src={'img/rotation.gif'} alt='SuperPole Graphic' style={{maxWidth:'100%',display:'block',marginLeft:'auto',marginRight:'auto'}}/>
								</div>
								<div className="col-md-12" style={{marginTop:'15px'}}>
									<div style={{textAlign:'center'}}>
											<button onClick={this.capture} disabled = {this.state.captureButtonDisable} type="button" className="btn col-md-4 ripple" style={{margin:'15px 0px',borderWidth:1,borderColor:'black'}}>CAPTURE</button>
									</div>
									<h4>After Movement - Superpole</h4>

									<div className="  row" >
										<div className="  dashboard-table col-sm-12 col-md-6 col-lg-6">
										<table className=" table-striped " style ={{width:'100%'}}> 
											<tbody>
													<tr>
														<th style = {{width:'50%'}}> X-position:</th>
														<td>
														{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.x_data}
														</td>
													</tr>
													<tr>
														<th style = {{width:'50%'}}> Y-position:</th>
														<td>
														{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.y_data}
														</td>
													</tr>
													<tr>
														<th style = {{width:'50%'}}> Latitude:</th>
														<td>
														{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.latitude}
														</td>
													</tr>
													<tr>
														<th style = {{width:'50%'}}> Longitude:</th>
														<td>
														{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.longitude}
														</td>
													</tr>
													<tr>
														<th style = {{width:'50%'}}> Altitude:</th>
														<td>
														{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.altitude}
														</td>
													</tr>
											</tbody>
										</table>
										</div>
									</div>
																
										{/* <div className="row" >											
											<div className="col-md-12" style={{paddingLeft:'0px'}}>
												<label className="col-md-3">X-position: </label> 
												<label className="col-md-3">{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.x_data}</label>
											</div>
											<div className="col-md-12" style={{paddingLeft:'0px'}}>
												<label className="col-md-3">Y-position: </label>
												<label className="col-md-3">{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.y_data}</label>
											</div>
											<div className="col-md-12" style={{paddingLeft:'0px'}}>
												<label className="col-md-3">Latitude: </label>
												<label className="col-md-3">{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.latitude}</label>
											</div>
											<div className="col-md-12" style={{paddingLeft:'0px'}}>
												<label className="col-md-3">Longitude: </label>
												<label className="col-md-3">{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.longitude}</label>
											</div>
											<div className="col-md-12" style={{paddingLeft:'0px'}}>
												<label className="col-md-3">Altitude: </label>
												<label className="col-md-3">{this.state.loadSuperpole ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" />  : this.state.superpoleData.altitude}</label>
											</div>
										</div> */}

									</div>
								</div> 
							</div>							
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default socketConnect(SuperpoleView)

