import React, { Component } from 'react';
import LoadingSpinner from '../../views/Components/LoadingSpinner';
import { AxiosPromise } from "../../services/fetchAPI";
import { api } from "../../config/api";
import { socketConnect } from 'socket.io-react';
import Modal from 'react-modal';
import App from './../../App';
import $ from 'jquery';

Modal.setAppElement(App)
var data = {
	statusCode: 200,
	success: true,
	result: true,
	message: 'software version fetched successfully.',
	updateData: 'New Update here',
	data: {
		firmware_version: 1,
		firmware_update_available: false,
		uhf_version: '1234',
		gsm_version: 1.25,
		onyx_version: '2.0.5'
	}
};

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)'
	}
};

class OnyxView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isUpdateAvailable: false,
			loading: true,
			updateData: 'New update available',
			updateData2: '',
			updateData3: '',
			updateData4: '',
			updateData5: '',
			updateData6: '',
			updateData7: '',
			disableButton: false,
			startUpdating: false,
			dataSpeed: 0,
			checksumstatus: false,
			checksumstatusLoad: false,
			bandwidthLoaded:true,
			modalIsOpen: false,
			downloadNewVersion: true,
			disableDownloadComplete:false

		};
	}

	componentDidMount() {

		AxiosPromise.get(api.checkBandwidth, '', '')
			.then(data => {
				if (data.status) {
					var dataspeed = parseInt(data.data.DataSpeed.replace(",", ""));
					if (dataspeed > 1024) {
						this.setState({ dataSpeed: dataspeed, bandwidthLoaded:false })
					}
					else {
						this.setState({ modalIsOpen: true, dataSpeed: dataspeed, bandwidthLoaded:false })
					}
				}

			})
			.catch(error => {
				this.setState({ dataSpeed: 0 })
				console.log("error", error);
			});

	}

	alertMessageDialog = () => {
		return (
			<Modal
				isOpen={this.state.modalIsOpen}
				onAfterOpen={this.afterOpenModal}
				onRequestClose={this.closeModal}
				style={customStyles}
				contentLabel="Example Modal"
			>
				<h2>Network Alert</h2>
				<p>Network speed is too slow, change your Network for better performance or press OK to continue.</p>
		
				<div className="row">
					
					<div className="col-sm-12 col-md-12 col-lg-12 text-center">
					<button onClick={this.closeModal}
						type='button'
						className='btn btn-primary ripple'
						style={{
							borderRadius: '5px',
							width:'auto',
						}}
					>OK</button>
					</div>
				</div>
		
			</Modal>
		)
	}


	closeModal= () => {
		this.setState({ modalIsOpen: false});
	}

	componentWillUnmount() {
	}

	softwareUpdateBandwidth = () => {
		alert('Software update process is going on, please do not press back or refresh button.')
    $('.sidebar').css('pointer-events','none');
		$('.app-header').css('pointer-events','none');
		
		this.setState({ loadingOnyxUpdateStatus: true, checksumstatusLoad: true });

		AxiosPromise.get(api.onyxUpdate, '', '')
			.then(data => {

				if (data.status) {
					this.setState({
						onysUpdateStatus: data.data.status,
						checksumstatus: data.data.checksumstatus,
						checksumstatusLoad: false,
						loadingOnyxUpdateStatus: false,
						downloadNewVersion: false,
						disableButton:true,
						disableDownloadComplete:true
					})

				}
			})
			.catch(error => {
				console.log("error", error);
			});

	}


	softwareUpdate = () => {
		alert('Software install process is going on, please do not press back or refresh button.')
    
		this.setState({disableDownloadComplete:true, disableDownloadComplete:false})
		this.softwareUpdateCall()
		setTimeout(() => {
			this.softwareUpdateCall()
		}, 2000);
	}
	softwareUpdateCall = () => {

		const { socket } = this.props;
		socket.socketConnect

		socket && socket.emit('loadOnyxfile', 'loadOnyxfile');
		socket && socket.emit('updateOnyxSoftware', 'updateOnyxSoftware');
		socket.on('updateOnyxSoftware', this.displayStep);

	}

	displayStep = (data) => {
		if (data) {
			var parseData = parseInt(data)
			switch (parseData) {
				case 1:
					this.setState({ updateData: "Initialized and Loading Process", disableButton: false, startUpdating: true })
					break;
				case 2:
					this.setState({ updateData2: " Started first file loading" })
					break;
				case 3:
					this.setState({ updateData3: "  Finish first file" })
					break;
				case 4:
					this.setState({ updateData4: " Started second file loading" })
					break;
				case 5:
					this.setState({ updateData5: " Finish second file" })
					break;
				case 6:
					this.setState({ updateData6: " Started third file loading" })
					break;
				case 7:
					this.setState({ updateData7: "Update completed", startUpdating: false })
					$('.sidebar').css('pointer-events','');
					$('.app-header').css('pointer-events','');
					break;

				case -1:
						this.setState({disableButton:false,startUpdating:false,updateDataInterup:true,updateData:'',updateData2:'',updateData3:'',updateData4:'',updateData5:'',updateData6:'',updateData7:''})
						$('.sidebar').css('pointer-events','');
						$('.app-header').css('pointer-events','');
						setTimeout(() => {
							window.location.reload(true);

						}, 5000);
					break;

				default:
					break;
			}
		}
	}

	

	checkForUpdate = () => {

		AxiosPromise.get(api.onyxUpdateAvailable, '', '')
			.then(data => {
				if (data.status) {
					this.setState({
						OnyxVersionAvailable: data.data.OnyxVersionAvailable,
						onyxVersion: data.data.version,
						isUpdateAvailable: true,
						onyxUpdateAvailable: data.data.OnyxVersionAvailable
					})
				}
			})
			.catch(error => {
				console.log("error", error);
			});

	}


	updateRender = (data) => {
		if (data) {
			return (
				<div>
					<div className='form-group row' style={{ marginLeft: '0px' }}>
						<i
							className='fa fa-check-circle'
							style={{ color: '#74CD58', fontSize: '25px' }}
							aria-hidden='true'
						/>{' '}
						<lable className='ml-3'>{data}</lable>
					</div>
				</div>
			)
		}

	}



	render() {
		return (
			<div className='animated fadeIn'>
				<div>
					<div style={{ width: '100%' }}>
						<div className='card'>
							<div className='card-block'>
								<div className='form-group ' style={{ marginLeft: '0px' }}>
									<h3>Onyx</h3>
								</div>

							{ (this.state.dataSpeed > 1024 && this.state.bandwidthLoaded === false) ? (
									<div>
									{this.alertMessageDialog()}
									
								</div>
							):'' }
								
								<div>
								
								<button
									type='button'
									disabled={this.state.endButtonDisable}
									className='col-md-4 col-lg-4 col-sm-4 btn ripple'
									style={{
										borderRadius: '5px',
										margin: '5px',
										marginBottom: '20px',
										backgroundColor: '#E7e7e7'
									}}
									onClick={this.checkForUpdate}
								>
									Check For Updates
                </button>
								{this.state.isUpdateAvailable && (
									<form action='' method='post'>
										<div className='form-group card-columns' style={{ marginBottom: '0px' }}>
											<strong>Onyx Firmware</strong>
										</div>
										<label>Version {this.state.onyxVersion}</label>
										{this.state.onyxUpdateAvailable ?
											<div>
												{this.state.updateDataInterup && <div>Process Interuptted</div>}
												{this.updateRender(this.state.updateData)}
												{this.updateRender(this.state.updateData2)}
												{this.updateRender(this.state.updateData3)}
												{this.updateRender(this.state.updateData4)}
												{this.updateRender(this.state.updateData5)}
												{this.updateRender(this.state.updateData6)}
												{this.updateRender(this.state.updateData7)}
												{this.state.startUpdating &&
													<div>

														<LoadingSpinner /> </div>}

												{ this.state.downloadNewVersion && ( <div className='form-group row' style={{ marginLeft: '0px' }}>
													<i
														className='fa fa-download'
														style={{ color: '#74CD58', fontSize: '25px' }}
														aria-hidden='true'
													/>{' '}
													<u
														className='ml-3'
														htmlFor='check3'
														style={{ cursor: 'pointer' }}
														onClick={() => this.softwareUpdateBandwidth()}
													>
														Download new version
                    </u>
												</div>)} 
												{ this.state.disableDownloadComplete && (<div className='form-group row' style={{ marginLeft: '0px' }}>
													<i
														className='fa fa-check-circle'
														style={{ color: '#74CD58', fontSize: '25px' }}
														aria-hidden='true'
													/>{' '}
													<u
														className='ml-3'
														htmlFor='check3'
														style={{ cursor: 'default',textDecoration:'none' }}
														
													>
														Download Completed
                    </u>
												</div>)

												}
												{this.state.checksumstatusLoad && <div><LoadingSpinner/></div>}
												{ ( this.state.disableButton && <div className='form-group row' style={{ marginLeft: '0px' }}>
													<i
														className='fa fa-download'
														style={{ color: '#74CD58', fontSize: '25px' }}
														aria-hidden='true'
													/>{' '}
													<u
														className='ml-3'
														htmlFor='check3'
														style={{ cursor: 'pointer' }}
														onClick={() => this.softwareUpdate()}
													>
														Install new version
                    </u>
												</div>)}

												


											</div>

											:
											<div className='form-group row' style={{ marginLeft: '0px' }}>
												<i
													className='fa fa-check-circle'
													style={{ color: '#74CD58', fontSize: '25px' }}
													aria-hidden='true'
												/>{' '}
												<lable className='ml-3'>Up to date</lable>
											</div>
										}
										{/* <div className='form-group' style={{ marginBottom: '0px' }}>
											<strong>Onyx Firmware</strong>
										</div>

										<label>Version {this.state.onyxVersion}</label> */}

									</form>
								)}
								</div>
								
								

								


							</div>


						</div>
					</div>
				</div>

			</div>
		);
	}
}

export default socketConnect(OnyxView)