import ReactSVG from 'react-svg';
import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';

const brandPrimary = '#20a8d8';
const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';
const brandDanger = '#f86c6b';

// Card Chart 1
const cardChartData1 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: brandPrimary,
            borderColor: 'rgba(255,255,255,.55)',
            data: [65, 59, 84, 84, 51, 55, 40]
        }
    ],
};

const cardChartOpts1 = {
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            gridLines: {
                color: 'transparent',
                zeroLineColor: 'transparent'
            },
            ticks: {
                fontSize: 2,
                fontColor: 'transparent',
            }
        }],
        yAxes: [{
            display: false,
            ticks: {
                display: false,
                min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
                max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
            }
        }],
    },
    elements: {
        line: {
            borderWidth: 1
        },
        point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
        },
    }
}

// Card Chart 2
const cardChartData2 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: brandInfo,
            borderColor: 'rgba(255,255,255,.55)',
            data: [1, 18, 9, 17, 34, 22, 11]
        }
    ],
};

const cardChartOpts2 = {
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            gridLines: {
                color: 'transparent',
                zeroLineColor: 'transparent'
            },
            ticks: {
                fontSize: 2,
                fontColor: 'transparent',
            }

        }],
        yAxes: [{
            display: false,
            ticks: {
                display: false,
                min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
                max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
            }
        }],
    },
    elements: {
        line: {
            tension: 0.00001,
            borderWidth: 1
        },
        point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
        },
    }
}

// Card Chart 3
const cardChartData3 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
            data: [78, 81, 80, 45, 34, 12, 40]
        }
    ],
};

const cardChartOpts3 = {
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            display: false
        }],
        yAxes: [{
            display: false
        }],
    },
    elements: {
        line: {
            borderWidth: 2
        },
        point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
        },
    }
}

// Card Chart 4
const cardChartData4 = {
    labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,255,255,.3)',
            borderColor: 'transparent',
            data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98]
        }
    ],
};

const cardChartOpts4 = {
    maintainAspectRatio: false,
    /*legend: {
        display: false
    },
    scales: {
        xAxes: [{
            display: false,
            barPercentage: 0.6,
        }],
        yAxes: [{
            display: false,
        }]
    }*/
}

// Main Chart

// convert Hex to RGBA
function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
}

//Random Numbers
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
    data1.push(random(50, 200));
    data2.push(random(80, 100));
    data3.push(65);
}


const bar = {
    labels: ['2', '5', '12', '17', '19', '24', '25', '28', '29', '46', '48', '51'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(0,255,0,0.2)',
            borderColor: 'rgba(0,255,0,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(0,255,0,0.4)',
            hoverBorderColor: 'rgba(0,255,0,1)',
            data: [36, 0, 35, 0, 34, 34, 44, 0, 18, 0, 29, 0, 0]
        }
    ]
};

const options = {
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
        mode: 'label'
    }
};

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return (
            <div className='animated fadeIn'>
                <div className='row'>
                    <div className='col-sm-6 card'>
                      <div className='card-block pb-0'>
                        <ReactSVG
                          path="img/skyplot.svg"
                          callback={svg => {
                            {svg.setAttribute('height', '100%');
                              svg.setAttribute('width', '100%');
                              svg.setAttribute('style', 'max-height: 550px;');
                              svg.querySelector('#Combined-Shape').setAttribute('fill', '#88e885');}
                          }}
                          className="skyplot"
                        />
                      </div>
                    </div>

                    <div className='col-sm-6 mb-4 background-white'>
                        <div className='row'>
                          <div className="card-block ml-3 col-sm-4">
                              <div className="form-group">
                                  <img width="200" height="200" className="spirit-level" src="img/spirit-level/Vectorillustration_design_4_no bubble.png" alt=""/>
                              </div>
                          </div>
                          <div className='card-block pb-0 col-sm-6'>
                              <div className="form-group row">
                                  <label className="col-md-5 form-control-label" htmlFor="recordata">GPS OFF</label>
                                  <label className="switch switch-3d switch-primary">
                                      <input type="checkbox" className="switch-input"/>
                                      <span className="switch-label"></span>
                                      <span className="switch-handle"></span>
                                  </label>
                              </div>
                              <div className="form-group row">
                                  <label className="col-md-5 form-control-label" htmlFor="recordata">Start Recording</label>
                                  <label className="switch switch-3d switch-primary">
                                      <input type="checkbox" className="switch-input"/>
                                      <span className="switch-label"></span>
                                      <span className="switch-handle"></span>
                                  </label>
                              </div>
                              <div className="form-group row">
                                  <label className="col-md-5 form-control-label" htmlFor="recordata">IMU OFF</label>
                                  <label className="switch switch-3d switch-primary">
                                      <input type="checkbox" className="switch-input"/>
                                      <span className="switch-label"></span>
                                      <span className="switch-handle"></span>
                                  </label>
                              </div>
                              <div className="form-group row">
                                  <label className="col-md-5 form-control-label" htmlFor="recordata">Hide GPS Data</label>
                                  <label className="switch switch-3d switch-primary">
                                      <input type="checkbox" className="switch-input"/>
                                      <span className="switch-label"></span>
                                      <span className="switch-handle"></span>
                                  </label>
                              </div>
                          </div>
                        </div>
                        <div className="card-block">
                            <table className="table table-striped">
                                <tbody>
                                <tr>
                                    <th>Latitude</th>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td>
                                        34.17833267
                                    </td>
                                </tr>
                                <tr>
                                    <th>Longitude</th>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td>
                                        -118.34633750
                                    </td>
                                </tr>
                                <tr>
                                    <th>Altitude</th>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td>
                                        189.500
                                    </td>
                                </tr>
                                <tr>
                                    <th>Fix Time</th>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td>
                                        165258.000
                                    </td>
                                </tr>
                                <tr>
                                    <th>Geoid Hit</th>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td>
                                        -32.600
                                    </td>
                                </tr>
                                <tr>
                                    <th>Quality</th>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td>
                                        DgpsFix
                                    </td>
                                </tr>
                                <tr>
                                    <th>Fix Type</th>
                                    <td> </td>
                                    <td>Fix3D</td>
                                    <td>VDOP</td>
                                    <td>
                                        2.33
                                    </td>
                                </tr>
                                <tr>
                                    <th>HDOP</th>
                                    <td> </td>
                                    <td>1.25</td>
                                    <td>PDOP</td>
                                    <td>
                                        NaN
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-12 card card-inverse'>
                        <div className='card-block pb-0'>
                            <div className='btn-group float-right'>
                                <Dropdown isOpen={this.state.card4} toggle={() => {
                                  this.setState({ card4: !this.state.card4 });
                                }}>
                                    <button onClick={() => {
                                      this.setState({ card4: !this.state.card4 });
                                    }} className='btn btn-transparent active dropdown-toggle p-0' data-toggle='dropdown' aria-haspopup='true' aria-expanded={this.state.card4}>
                                        <i className='icon-settings'></i>
                                    </button>
                                    <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <h4 className='mb-0'>9.823</h4>
                            <p>Members online</p>
                        </div>
                        <div className='chart-wrapper px-3'>
                            <Bar data={bar}
                                 options={options}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;
