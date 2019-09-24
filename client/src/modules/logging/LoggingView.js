import React, { Component } from "react";
import { api } from "../../../src/config/api";
import { GETAPIFlask, postApiFlask, AxiosPromise } from "../../services/fetchAPI";
import LoadingSpinner from "../../views/Components/LoadingSpinner";
import './LoggingView.css';

class LoggingView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectbox1: "",
			selectbox2: "",
			filelog: "",
			file: "",
			numbers: [],
			logStatus: [],
			memoryStatus: { Free_Memory: 0, Used_Memory: 0, Total_memory: 0 },
			selectedLoggingType: "",
			selectedLoggingRate: '',
			loading: false,
			load: true,
			newFileName: '',
			logFileStatus: '',
			endButtonDisable: true,
			durationLog: '',
			listData: [],
			displayMessage: false,
			durationStatus: '',
			selectedValue: '',
			ejectSDCardStatus: '',
			sdCardStatus: false,
			logFileErrorStatus: false,
			durationLogError:true
		};
	}


	componentDidMount() {
		this.callApi();
		this.props.getListApiCall(api.log_list)
	}

	callApi = () => {
		this.setState({ loading: true });
		AxiosPromise.get(api.logging_status)
			.then(response => {
				if (response.data.status === 1) {
					this.callMemoryStatusApi()
					this.setState({ logStatus: response.data.data, loading: false });
					if (response.data.data.LOGGING === 'ON') {
						this.setState({ disbaleStartOnStopClick: true })
					}
					else {
						this.setState({ disbaleStartOnStopClick: false })
					}
				}
			})
			.catch(error => {
				console.log("error", error);
				//this.setState({ loading: false });
			});
	};

	callMemoryStatusApi = () => {
		AxiosPromise.get(api.memory_status)
			.then(response => {
				if (response && response.data && response.data.status === 1) {
					this.setState({ memoryStatus: response.data.data, displayMessage: false, sdCardStatus: true });
					this.getListData();
				} else {
					this.setState({ sdCardStatus: false })
				}
			}).catch(error => {
				console.log("error", error);
				//this.setState({ loading: false });
			});
	}

	ejectSDCard = () => {
		AxiosPromise.get(api.sdCardEject)
			.then(response => {
				if (response.data.status === 1) {
					setTimeout(() => {
						this.setState({ ejectSDCardStatus: '' })
					}, 20000);
					this.setState({ ejectSDCardStatus: 'Now you can easily eject SD card safely.' })
				}
				//console.log('EjectSDCard', response)
			}).catch(error => {
				console.log("error", error);
				//this.setState({ loading: false });
			});
	}

	getListData = () => {
		this.props.getListApiCall(api.log_list)
		// AxiosPromise.get(api.log_list)
		//   .then(response => {
		//     if (response) {
		//       this.setState({ listData: response.data });
		//     }
		//   })
		//   .then(error => console.log("error", error));
	};

	onChange = e => {
		this.setState({ selectedLoggingType: e.target.value });

		if (e.target.value === "NMEA") {
			this.setState({
				numbers: ["0.1", "0.5", "1", "2", "5"]
			});
		} else if (e.target.value === "NAVCOM") {
			this.setState({
				numbers: ["0.1", "0.5", "1"]
			});
		} else {
			this.setState({ numbers: [] });
		}
	};

	onSelectedRate = e => {
		this.setState({ selectedLoggingRate: e.target.value });
	}

	onFocusOut(file) {
		this.setState({ displayMessage: true })
		let data = { logFile: `${this.state.newFileName}.txt` };
		if (this.state.newFileName) {
			AxiosPromise.post(api.log_file_exist, data)
				.then(response => {
					if (response.data.status === 1) {
						this.setState({ logFileStatus: 'Ok' })
					} else {
						this.setState({ logFileStatus: 'This file already exists, Please type different name.' })
					}
				})
				.catch(error =>
					console.log("error", error));
		}

		if(parseInt(this.state.newFileName.length) === 0  ) {
			this.setState({logFileErrorStatus:true,logFileError:'Please enter Log file name', logFileStatus:''})
	 }

	}

	onSubmit(e) {
		e.preventDefault();
	}

	handleOptionsChange = (event) => {
		this.setState({
			selectedValue: event.target.value
		});
	}
	durationLog = (event) => {
		this.setState({
			durationLog: event.target.value
		});
	}

	downloadTxtFile = () => {
		let data = {
			logFile: this.state.selectedValue
		}
		AxiosPromise.post(api.log_download_log_file, data)
			.then(response => {
				const element = document.createElement("a");
				const file = new Blob([response.data], { type: 'text/plain' });
				element.href = URL.createObjectURL(file);
				element.download = `${this.state.selectedValue}`
				document.body.appendChild(element); // Required for this to work in FireFox
				element.click();
			})
			.then(error => console.log("error", error));

	}

	onNewFileName = (event) => {
		
		try {
			let xyz = (event.target.value).split('.')
			this.setState({
				newFileName: xyz[0], filenameLength:xyz[0].length
			});
		} catch (error) {
			console.log('Error', error)
		}

		
		
	}

	deleteLogFile = () => {

		let data = {
			logFile: this.state.selectedValue
		}
		AxiosPromise.post(api.log_file_delete, data)
			.then(response => {
				this.getListData(response)
				alert(response.data.message)
			})
			.catch(error =>
				console.log("error", error));
	}


	startButton = () => {
		const { selectedLoggingRate, selectedLoggingType, durationLog, newFileName } = this.state
		// this.setState({  })

		// setTimeout(()=>{this.setState({load:true})},6000);
		// this.setState({load:false});
		
		if (selectedLoggingRate && selectedLoggingRate != '0' && selectedLoggingType && selectedLoggingType != '0' && newFileName) {
			this.setState({ endButtonDisable: false, disbaleStartOnStopClick: false, load: true,loadstart:true })
			// API Call
			let data = {
				LOG_RATE: this.state.selectedLoggingRate,
				TYPE: this.state.selectedLoggingType,
				LOG_DURATION: this.state.durationLog,
				LOG_FILE: `${this.state.newFileName}.txt\r\n`
			}



			AxiosPromise.post(api.start_api_call, data)
				.then(response => {
					// this.getListData()
					console.log("response", response)

					setTimeout(() => {
						AxiosPromise.get(api.logging_status)
							.then(response => {
								if (response.data.status === 1) {

									this.setState({ logStatus: response.data.data, loadstart:false });
									if (response.data.data.LOGGING === 'ON') {

										this.setState({ disbaleStartOnStopClick: true, load: false })
									}
									else {
										this.setState({ disbaleStartOnStopClick: false })
									}
								}
							})
							.catch(error => {
								console.log("error", error);
								//this.setState({ loading: false });
							});

					}, 5000);




				})

				.catch(error => console.log("error", error));
		} else {
			// if(parseInt(this.state.durationLog) > 280 || this.state.durationLog < 0 )
			// 	alert('Log duration must be a integer of minutes between 0 and 280')			

			if(parseInt(this.state.newFileName.length) === 0  ) {
				 // alert('Please enter file name')
				 this.setState({logFileErrorStatus:true,logFileError:'Please enter Log file name'})
			}
      // else {
			// alert('Something is missing. Please make sure you have filled all required fields.')
			alert('Please complete ALL required fields indicated by the * in the label.')
			// }
		}
		
      
		
	}

	endLogFile = () => {
		// API Call
    this.setState({loadStop:true})
		AxiosPromise.get(api.stop_api_call)
			.then(response => {
				if (response) {
          this.setState({loadStop:false})
					this.callApi()
					this.setState({ selectedLoggingRate: '', selectedLoggingType: '', durationLog: '', newFileName: '' })

				}
			})
			.catch(error =>
				console.log("error", error));
	}

	onEnterDuration = (data) => {

		if(this.state.durationLog.length === 0) {
			this.setState({durationLog : ''})
		}

		let duration = parseInt(this.state.durationLog)
		if (Number.isInteger(+this.state.durationLog)) {
			if (0 <= duration && duration <= 280) {				
				this.setState({ durationStatus: '',durationLogError:false })				
			} else {
				console.log(this.state.durationLog)
				this.setState({ durationStatus: 'Invalid time duration', durationLog: '', durationLogValue:0, durationLogError:true })
				console.log(this.state.durationLog)
			}
		} else {
			this.setState({ durationStatus: 'Invalid time duration', durationLog: '',durationLogValue:0,durationLogError:true })
		}
	}



	render() {
		return (
			<div className="animated fadeIn">
				<div className="row">
					<div style={{ width: '100%' }}>
						<div className="card">
							{!this.state.loading ? (
								<div className="card-block">
									<form action="" method="post">
										<div
											className="form-group row"
											style={{ marginLeft: "0px" }}
										>
											<h3>Logging Status</h3>
										</div>

										<div className="form-group row">
											<div className={'col-md-4 not-login'} style={{ marginBottom: "15px" }}>
												<i className={
													// (this.state.endButtonDisable ? 
													(this.state.logStatus.LOGGING !== 'ON' ?
														"fa fa-times-circle"
														: "fa fa-check-circle")
												}
													// style={{ color: this.state.endButtonDisable  ? "#F31B10" :  "#74CD58", fontSize: "25px", }}
													style={{ color: this.state.logStatus.LOGGING !== 'ON' ? "#F31B10" : "#74CD58", fontSize: "25px", }}
													aria-hidden="true"
												/>{" "}
												<lable className="ml-3" style={{ fontSize: 14 }}>
													{/* {this.state.endButtonDisable  */}
													{this.state.logStatus.LOGGING !== 'ON'
														? "Not logging"
														: "Logging"}
												</lable>
											</div>
											{this.state.sdCardStatus && <div className='col-md-1'>
												<div><button onClick={() => this.ejectSDCard()} type="button" className="btn btn-sm btn-success"><i className="fa fa-dot-circle-o"></i> Eject SD card</button>
												</div></div>
											}
											<h6 style={{ marginTop: '5px', color: 'green', marginLeft: '15px' }}>
												{this.state.ejectSDCardStatus}
											</h6>
										</div>

										<div className="form-group row" style={{ marginLeft: "0px" }} >
											<i className={
												this.state.sdCardStatus
													? "fa fa-check-circle"
													: "fa fa-times-circle"
											}
												style={{ color: this.state.sdCardStatus ? "#74CD58" : "#F31B10", fontSize: "25px" }}
												aria-hidden="true"
											/>{" "}
											<lable className="ml-3">
												{this.state.sdCardStatus
													? "SD Card inserted"
													: "SD Card not inserted"}
											</lable>
										</div>
										<div className="form-group row" style={{ marginLeft: "0px" }} >
											<i
												className="fa fa-info-circle"
												style={{ color: "#3790E8", fontSize: "25px" }}
												aria-hidden="true"
											/>{" "}
											<span className="ml-3">
												<lable>
													Memory Free: <label style={{ color: '#009900' }}>{this.state.memoryStatus.Free_Memory} </label>,
                          Used: <label style={{ color: '#F31B10' }}>{this.state.memoryStatus.Used_Memory}</label>,
                          Total: <label style={{ color: '#3790E8' }}>{this.state.memoryStatus.Total_memory}</label>
												</lable>
											</span>
										</div>

										<div className="form-group row">
											<label className="col-md-4 form-control-label" htmlFor="select" >
												Logging Type <label style={{ color: '#F31B10' }}>*</label>
											</label>
											<div className="col-md-5">
												<select
													className="form-control"
													id="select"
													name="selectbox1"
													// value={this.state.selectbox1}
													onChange={e => this.onChange(e)}
												>
													<option value="0">Please select</option>
													<option value="NMEA">NMEA</option>
													<option value="NAVCOM">NAVCOM</option>
												</select>
											</div>
										</div>

										{
											this.state.numbers.length > 0 &&
											<div className="form-group row">
												<label className="col-md-4 form-control-label" htmlFor="select" >
													Logging Rate <label style={{ color: '#F31B10' }}>*</label>
												</label>
												<div className="col-md-5">
													<select
														id="select"
														name="selectbox2"
														placeholder='Please select'
														className="form-control"
														onChange={e => this.onSelectedRate(e)}
													>
														<option value="0">Please select</option>
														{this.state.numbers.map((number, i) => (

															<option key={i} value={number}>
																{number} / sec
                            </option>
														))}
													</select>
												</div>
											</div>
										}

										<div className="form-group row">
											<label className="col-md-4 form-control-label" htmlFor="select" >
												New Log File Name <label style={{ color: '#F31B10' }}>* <label style={{ color: 'gray' }}>(max.12 characters)</label></label>
											</label>
											<div className="col-md-5">
												<input
													className="form-control"
													type="text"
													// onBlur={e => this.onFocusOut(e)}
													onKeyUp={e => this.onFocusOut(e)}
													//value={this.state.file}
													name="file"
													onChange={this.onNewFileName}
													placeholder="Enter Log File"
													maxLength="12"
												/>
											</div>
											<div className="col-md-3" >
												{ this.state.logFileStatus === 'Ok'  &&
												<h6 style={{ marginTop: '8px', color: this.state.logFileStatus === 'Ok' ? 'green' : 'red' }}> {
													this.state.displayMessage &&
													this.state.logFileStatus
												}
												
											</h6> }

											{  this.state.logFileStatus !== 'Ok' &&
											<h6 style={{ marginTop: '8px', color: 'red' }}>{this.state.logFileStatus }</h6> }

											{  this.state.logFileStatus === '' &&
											<h6 style={{ marginTop: '8px', color: 'red' }}>{this.state.logFileError }</h6> }

											

												{/* { this.state.filenameLength > 0 ?
												<h6 style={{ marginTop: '8px', color: this.state.logFileStatus === 'Ok' ? 'green' : 'red' }}> {
													this.state.displayMessage &&
													this.state.logFileStatus
												} 
												</h6> : <h6 style={{color:'red'}}>Please enter file name(max.12 charcters)</h6>
												} */}
											</div>
										</div>
										<div className="form-group row align-items-center" style={{ marginBottom: '30px' }}>
											<label className="col-md-4 form-control-label" htmlFor="select" >
												Log Duration in Minutes <label style={{ color: 'gray' }}>(default 0 for no duration limit)</label>
											</label>
											<div className="col-md-5">
												<input
													className="form-control"
													type="number"
													value={this.state.durationLogError?'0':this.state.durationLog}
													// defaultValue={this.state.durationLogError?'0':this.state.durationLog}
													placeholder="Enter Log Duration"
													onKeyUp={e => this.onEnterDuration(e)}
													onChange={this.durationLog}
												//value ={this.state.durationLog}
												/>
											</div>
											<div className="col-md-3" >
												<h6 style={{ marginTop: '8px', color: 'red' }}> {
													this.state.durationStatus !== '' &&
													this.state.durationStatus
												}
												</h6>
											</div>
										</div>

										<div className="form-group offset-md-4 col-md-5 divmargin">
											<div className="row">
											<div className="col-12 col-sm-6 col-md-6 pl-2 pr-2" style={{ textAlign: 'center',paddingLeft:'0.4rem' }}>
												<button
													type="button"
													disabled={this.state.loadstart || (this.state.logStatus.LOGGING === 'ON' && this.state.disbaleStartOnStopClick)}
													//disabled = {!this.state.endButtonDisable}
													className=" btn btn-primary"
													style={{ borderRadius: '5px', margin: '5px', width: '100%' }}
													onClick={this.startButton}>
													{this.state.loadstart || this.state.logStatus.LOGGING === 'ON' ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" /> : 'Start Log'}
												</button>
											</div>

											<div className="col-12 col-sm-6 col-md-6 pl-2 pr-2" style={{ textAlign: 'center',paddingLeft:'0.4rem' }}>
												<button
													type="button"
													onClick={this.endLogFile}
													disabled={this.state.logStatus.LOGGING !== 'ON'}
													// disabled={this.state.logStatus.LOGGING !== 'ON' && this.state.disbaleStartOnStopClick}
													// disabled = {this.state.endButtonDisable}
													className="col-12 col-sm-6 col-md-3 btn btn-primary"
													style={{ borderRadius: '5px', margin: '5px', width: '100%' }}
												>
                          {this.state.loadStop  ? <i className="fa fa-spinner fa-pulse fa-1x fa-fw" /> : 'Stop Log'}
													
                      </button>
											</div>
										</div>
										</div>


										<div className="form-group row justify-content-between" style={{ marginTop: 30 }} >
											<label className="col-12 col-sm-4 col-md-4 form-control-label" htmlFor="select">Log Files <label style={{ color: '#F31B10' }}>*</label>
											</label>

											<div className="form-group col-12 col-sm-5 col-md-5" >
												<select
													multiple
													name="select"
													className="form-control"
													style={{ padding: "5px", width: '100%' }}
													onChange={this.handleOptionsChange}>

													{this.props.getList &&
														this.props.getList.map((data, index) => {
															return (
																<option
																	key={data}
																	className="opt"
																	value={data}>
																	<h6>{data}</h6>
																</option>
															);
														})}
												</select>
											</div>
											<div className="col-md-3" ></div>
										</div>

										<div className="form-group offset-md-4 col-md-5 divmargin">
											<div className="row">
											<div className="col-12 col-sm-6 col-md-6 pl-2 pr-2" style={{ textAlign: 'center' }}>
												<button
													type="button"
													style={{ borderRadius: '5px', margin: '5px', width: '100%' }}
													disabled={this.state.selectedValue ? false : true}
													className="col-md-3 btn btn-primary"

													onClick={this.downloadTxtFile}
												>
													Download Selected
                      </button>
											</div>
											<div className="col-12 col-sm-6 col-md-6 pl-2 pr-2" style={{ textAlign: 'center' }}>
												<button
													type="button"
													style={{ borderRadius: '5px', margin: '5px', width: '100%' }}
													disabled={this.state.selectedValue ? false : true}
													className="col-md-3 btn btn-primary"

													onClick={this.deleteLogFile}
												>
													Delete Selected
                      </button>
											</div>
											</div>
										</div>
									</form>
								</div>
							) : (
									<LoadingSpinner />
								)
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LoggingView

// 		<div className="animated fadeIn container mt-5 shadow  mb-4 bg-white">
// 	<h3>Login Status</h3>

// 	<div className="mt-5 mb-3">
// 		<i
// 			className="fa fa-times-circle"
// 			style={{ color: "red", fontSize: "28px" }}
// 			aria-hidden="true"
// 		/>{" "}
// 		<span className="ml-3">Not logging</span>
// 	</div>
// 	<div className="mb-3">
// 		<i
// 			className="fa fa-check-circle"
// 			style={{ color: "green", fontSize: "28px" }}
// 			aria-hidden="true"
// 		/>{" "}
// 		<span className="ml-3">SD Card inserted</span>
// 	</div>
// 	<div>
// 		<i
// 			className="fa fa-info-circle"
// 			style={{ color: "blue", fontSize: "28px" }}
// 			aria-hidden="true"
// 		/>{" "}
// 		<span className="ml-3">
// 			Memory Free: 7640MB, used: 360MB, Total: 8000MB
// 		</span>
// 	</div>
// 	<form style={{ padding: "20px 0px" }} onSubmit={this.onSubmit}>
// 		<div className="form-group row">
// 			<div className="col-lg-4 pl-0 mb-3">
// 				<label className="col-md-6 form-control-label" htmlFor="select">
// 					Logging Type
// 				</label>
// 				<div className="col-md-9 ">
// 					<select
// 						id="select"
// 						name="selectbox1"
// 						value={this.state.selectbox1}
// 						onChange={this.onChange.bind(this)}
// 						className="form-control">
// 						<option value="" disabled>
// 							Logging Type
// 						</option>
// 						<option value="NMEA">NMEA</option>
// 						<option value="NAVCOM">NAVCOM</option>
// 					</select>
// 				</div>
// 			</div>
// 			<div className="col-lg-4 pl-0">
// 				<label className="col-md-6 form-control-label" htmlFor="select">
// 					Logging Rate
// 				</label>
// 				<div className="col-md-9 ">
// 					<select
// 						id="select"
// 						name="selectbox2"
// 						value={this.state.selectbox2}
// 						onChange={this.onChange.bind(this)}
// 						className="form-control">
// 						<option value="" disabled>
// 							Logging Rate
// 						</option>
// 						{this.state.numbers.map((number, i) => (
// 							<option key={i} value={number}>
// 								{number}
// 							</option>
// 						))}
// 					</select>
// 				</div>
// 			</div>
// 		</div>

// 		<div className="mt-3 mb-3 row">
// 			<h6 className="col-lg-3">New LogFile Name</h6>
// 			<div className="col-lg-3">
// 				<div className="form-group">
// 					<input
// 						type="text"
// 						className="form-control"
// 						autoComplete="OFF"
// 						id="Logtxt"
// 						placeholder="Enter log file"
// 						value={this.state.filelog}
// 						name="filelog"
// 						onChange={this.onChange}
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 		<div className="mt-3 mb-3 row">
// 			<h6 className="col-lg-3">Log Duration (min)</h6>
// 			<div className="col-lg-3">
// 				<div className="form-group">
// 					<input
// 						type="text"
// 						className="form-control"
// 						autoComplete="OFF"
// 						id="Logtxt"
// 						placeholder="Enter Log Duration"
// 						value={this.state.file}
// 						name="file"
// 						onChange={this.onChange}
// 					/>
// 				</div>
// 			</div>
// 		</div>

// 		<div className="mb-3 row text-center">
// 			<button
// 				type="submit"
// 				className="btn btn-primary mt-3 mb-3 col-lg-2">
// 				Start Log
// 			</button>
// 			<button
// 				type="button"
// 				className="btn btn-primary mt-3 mb-3 offset-lg-1 col-lg-2">
// 				Stop Log
// 			</button>
// 		</div>
// 	</form>
// 	<div className="col-lg-6">
// 		<h3>Log Files</h3>
// 		<form style={{ padding: "20px 0px" }}>
// 			<label
// 				className="col-md-6 pl-0 form-control-label"
// 				htmlFor="select">
// 				Log Files
// 			</label>
// 			<select multiple name="select" className="form-control">
// 				<option value="1">Option #1</option>
// 				<option value="2">Option #2</option>
// 				<option value="3">Option #3</option>
// 				<option value="4">Option #4</option>
// 				<option value="5">Option #5</option>
// 				<option value="6">Option #6</option>
// 			</select>
// 			<button type="button" className="btn btn-primary mt-4 mb-3">
// 				Download Selected
// 			</button>
// 			<br />
// 			<button type="button" className="btn btn-primary mt-3 mb-3">
// 				Delete Selected
// 			</button>
// 		</form>
// 	</div>
// </div>

// > ssh pi@10.8.1.170
// pi@001290:~/fgps/geozone_frontend $
// pi@001290:~/fgps/geozone_frontend $ less Dockerfile
// pi@001290:~/fgps/geozone_frontend $ history | grep build
// pi@001290:~/fgps/geozone_frontend $ docker images
// pi@001290:~/fgps/geozone_frontend $ docker build -t geozone/frontend-wifi:dev .