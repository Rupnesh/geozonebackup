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
				ggaMsgNumber:'',
				ggaMsgRate:'',
				flag1:true,
				flag2:true,
				numbers: ["0.5", "1", "2", "5"]
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

	onFocusOutGGAMsgNumber(e) {
		console.log(this.state.ggaMsgNumber)
		let data = {GGA_Msg_Number: parseInt(this.state.ggaMsgNumber)};
		if (this.state.ggaMsgNumber) {
			AxiosPromise.post(api.GGAMsgNumber, data)
			.then(response => {
			 		if (response.status) {
						// this.setState({flag1:false})
			 		} 
			 	})
			 	.catch(error =>
			 		console.log("error", error));
		}	
	}
	// onFocusOutGGAMsgRate(e) {
		
	// 	let data = {GGA_rate: parseInt(this.state.ggaMsgRate)};
	// 	if (this.state.ggaMsgRate) {
	// 		AxiosPromise.post(api.GGAMsgRate, data)
	// 		.then(response => {
	// 		 		if (response.status) {
	// 					 console.log('ifffff')
	// 					this.setState({flag1:false,flag2:false})
	// 		 		} 
	// 		 	})
	// 		 	.catch(error =>
	// 		 		console.log("error", error));
	// 	}	
	// }

	ggaMsgNumber = (event) => {
		this.setState({
			ggaMsgNumber: event.target.value
		});
	}
	ggaMsgRate = (event) => {
		this.setState({
			ggaMsgRate: event.target.value
		});
	}

	onSelectedRate = e => {
		console.log(e.target.value)
		this.setState({ ggaMsgRate: e.target.value });

		let data = {GGA_rate: parseFloat(e.target.value)};
		
			AxiosPromise.post(api.GGAMsgRate, data)
			.then(response => {
			 		if (response.status) {
						 console.log('ifffff')
						this.setState({flag1:false,flag2:false})
			 		} 
			 	})
			 	.catch(error =>
			 		console.log("error", error));
		
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
								<div className="col-md-12" style={{marginTop:'20px'}}>

								<div className="col-12 col-sm-12 col-md-6 col-lg-6 offset-md-3" >
									<input
										className="form-control"
										type="number"
										onBlur={e => this.onFocusOutGGAMsgNumber(e)}
										// onKeyUp={e => this.onFocusOutGGAMsgNumber(e)}
										name="gganumber"
										onChange={this.ggaMsgNumber}
										placeholder="Enter GGA Message Number"
									/>
								</div>

								{/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 offset-md-3" style={{marginTop:'15px'}}>
									<input
										className="form-control"
										type="number"
										onBlur={e => this.onFocusOutGGAMsgRate(e)}
										// onKeyUp={e => this.onFocusOutGGAMsgRate(e)}
										name="ggaMsgRate"
										onChange={this.ggaMsgRate}
										placeholder="Enter GGA Message Rate"
									/>
								</div> */}

								<div className="col-12 col-sm-12 col-md-6 col-lg-6 offset-md-3" style={{marginTop:'15px'}}>
									<select
										id="select"
										name="selectbox2"
										placeholder='Please select message rate'
										className="form-control"
										onChange={e => this.onSelectedRate(e)}
									>
										<option value="0">Please select</option>
										{this.state.numbers.map((number, i) => (

											<option key={i} value={number}>
												{number}
										</option>
										))}
									</select>
								</div>


									<div className="  dashboard-table col-sm-12 col-md-6 col-lg-6 offset-md-3" style={{textAlign:'center'}}>
											{/* <button onClick={this.capture} disabled = {this.state.captureButtonDisable} type="button" className="btn col-md-4 ripple" style={{margin:'15px 0px',borderWidth:1,borderColor:'black'}}>CAPTURE</button> */}
										
										<button onClick={this.capture} 
											disabled = {this.state.flag1 === true && this.state.flag2 === true} 
											type="button" className="btn col-md-4 ripple" 
											style={{margin:'15px 0px',borderWidth:1,borderColor:'black'}}>CAPTURE
										</button>
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

