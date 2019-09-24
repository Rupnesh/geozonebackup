import React, { Component } from 'react';
import Modal from 'react-modal';
import App from './../../../App';
import $ from 'jquery';
Modal.setAppElement(App)

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

class SuperPoleView extends Component { 
	mounted;
	constructor(props) {
		super(props);

		this.state = { isMounted: false, bodyText: 'This text can be updated in modal 1' };

		this.state = {
			modalIsOpen: true,
			disableSideMenu: false
		};

		this.openModal = this.openModal.bind(this);
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this);

		this.handleChange = this.handleChange.bind(this);

	}

	handleChange(e) {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}

	componentWillUnmount() {
		this.setState({ isMounted: false })
	}

	componentDidMount() {
		this.setState({ isMounted: true })
		this.getMyLocation()

		

	}

	getMyLocation() {
		const location = window.navigator && window.navigator.geolocation

		if (location) {
			location.getCurrentPosition((position) => {
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				})

			}, (error) => {
				this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
			})
			//console.log(this.state)
		}
	}

	openModal() {
		this.setState({ modalIsOpen: true });
		// $('.sidebar').css('pointer-events','none');
		// $('.app-header').css('pointer-events','none');
		
		
		

	}

	afterOpenModal() {
		// references are now sync'd and can be accessed.
		this.subtitle.style.color = '#f00';
	}

	closeModal() {
		this.setState({ modalIsOpen: false });
		$('.sidebar').css('pointer-events','');
		$('.app-header navbar').css('pointer-events','');
		$('.sidebar').css('cursor','');
	}



	render() {
		return (
			<div className="animated fadeIn">
				<div className="row">
					<div className="col-lg-12">
						<div className="card">
							<div className='card-block'>
								<div className='form-group ' style={{ marginLeft: '0px' }}>
									<h3>Super Pole</h3>
								</div>
								<button
									type='button'
									className='col-sm-5 col-md-5 col-lg-3 btn ripple'
									onClick={() => this.getMyLocation()}
									style={{
										borderRadius: '5px',
										margin: '5px',
										marginBottom: '20px',
										backgroundColor: '#E7e7e7'
									}} >
									GET CO-ORDINATES
                </button>
								<button
									type='button'
									className='col-sm-5 col-md-5 col-lg-3 btn ripple'
									style={{
										borderRadius: '5px',
										margin: '5px',
										marginBottom: '20px',
										backgroundColor: '#E7e7e7'
									}} >
									CHECK CO-ORDINATES
                </button>
							</div>
						</div>
					</div>
				</div>


				<div className="row">
					<div>
						{/* <button onClick={this.openModal}>Open Modal</button>
						<button onClick={this.closeModal}>Close Modal</button> */}
						<Modal
							isOpen={this.state.modalIsOpen}
							onAfterOpen={this.afterOpenModal}
							onRequestClose={this.closeModal}
							style={customStyles}
							contentLabel="Example Modal"
						>

							<h2 ref={subtitle => this.subtitle = subtitle}>GNSS Measurement</h2>


							<div>
								<div className="row">
									<label className="col-md-3 " >Solution: </label>
								</div>
								<div className="row">
									<label className="col-md-3 " >Satellites: </label>
								</div>
								<div className="row">
									<label className="col-md-3 " >PDOP: </label>
								</div>
							</div>

							<div>
								<p col-sm-12 col-md-12 col-lg-12 style={{background:'#ccc',color:'#fff',paddingLeft:'5px'}}>Real Time</p>
								<div className="row">
									<label className="col-md-8 " >Status: </label>
								</div>
								<div className="row">
									<label className="col-md-8 " >Horizontal StdDev: </label>
								</div>
								<div className="row">
									<label className="col-md-8 " >Vertical StdDev: </label>
								</div>
							</div>

							<div>
								<p col-sm-12 col-md-12 col-lg-12 style={{background:'#ccc',color:'#fff',paddingLeft:'5px'}}>Post Process</p>
								<div className="row">
									<label className="col-md-8 " >Status: </label>
								</div>
								<div className="row">
									<label className="col-md-8 " >Time: </label>
								</div>
							</div>

							<div className="row">
								<button onClick={this.closeModal}
									type='button'
									className='col-sm-12 col-md-6 col-lg-6 btn ripple'
									style={{
										borderRadius: '5px',
										margin: '5px',
										marginBottom: '20px',
										backgroundColor: '#E7e7e7'
										
									}}
								>Store Position</button>

								<button onClick={this.closeModal}
									type='button'
									className='col-sm-12 col-md-5 col-lg-5 btn ripple'
									style={{
										borderRadius: '5px',
										margin: '5px',
										marginBottom: '20px',
										backgroundColor: '#E7e7e7'
									}}
								>Close</button>
							</div>

							{/* <form>
								<input />
								<button>tab navigation</button>
								<button>stays</button>
								<button>inside</button>
								<button>the modal</button>
							</form> */}
						</Modal>
					</div>
				</div>






			</div>




		)
	}
}
export default SuperPoleView;
