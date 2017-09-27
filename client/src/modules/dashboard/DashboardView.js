import ReactSVG from 'react-svg';
import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { socketConnect } from 'socket.io-react';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import ResizeObserver from 'react-resize-observer';

function getImageSrc(nr) {
  if (nr >= 1 && nr <= 32) {
    return 'us' + (nr < 10 ? ('0' + nr) : nr) + 'v3.fw.png';
  }
  
  if (nr >= 33 && nr <= 64) {
    return 'w' + nr + 'v3.fw.png';
  }
  
  if (nr >= 65 && nr <= 96) {
    return 'ru' + nr + 'v3.fw.png';
  }
  
  if (nr >= 97 && nr <= 192) {
    return 'u' + nr + 'v3.fw.png';
  }
  
  if (nr >= 193 && nr <= 200) {
    return 'jp' + nr + 'v3.fw.png';
  }
  
  if (nr >= 201 && nr <= 235) {
    return 'w' + nr + 'v3.fw.png';
  }
}

const options = {
  maintainAspectRatio: false,
  responsive: true,
  tooltips: {
    mode: 'label'
  }
};

class Dashboard extends Component {
  
  state = {
    GPS: true,
    IMU: false,
    graphData: {
      labels: [],
      datasets: [
        {
          label: 'Signal to Noise Ratio',
          backgroundColor: 'rgba(0,255,0,0.2)',
          borderColor: 'rgba(0,255,0,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(0,255,0,0.4)',
          hoverBorderColor: 'rgba(0,255,0,1)',
          data: []
        }
      ]
    },
    tpvData: null
  };
  satelliteData = null;
  spiritLevelData = null;
  imuData = null;
  oldSatellites = [];
  
  constructor(props) {
    super(props);
    const me = this;
    this.toggleGPS = this.toggleGPS.bind(this);
    this.toggleIMU = this.toggleIMU.bind(this);
    this.handleIMU1Data = this.handleIMU1Data.bind(this);
    this.handleGPSJSONData = this.handleGPSJSONData.bind(this);
    window.getThis = () => {
      return me;
    };
  }
  
  componentDidMount() {
    const { socket } = this.props;
    if (this.state.GPS === true) {
      socket && socket.emit('subscribe', 'GPSJSON');
    }
    if (this.state.IMU === true) {
      socket && socket.emit('subscribe', 'IMU_1');
    }
    socket.on('data-GPSJSON', this.handleGPSJSONData);
    socket.on('data-IMU_1',  this.handleIMU1Data);
  }
  
  componentWillUnmount() {
    const { socket } = this.props;
    socket && socket.emit('unsubscribe', 'GPSJSON');
    socket && socket.emit('unsubscribe', 'IMU_1');
  }
  
  handleIMU1Data(data) {
    const jsonData = JSON.parse(data);
    const newData = {
      cfangleX: jsonData['cfangleX'],
      cfangleY: jsonData['cfangleY'],
      cfangleZ: jsonData['cfangleZ']
    };

    if (JSON.stringify(newData) !== JSON.stringify(this.imuData)) {
      this.imuData = newData;
      this.spiritLevelCalculations();
    }
  }
  
  handleGPSJSONData(data) {
    const parsedData = JSON.parse(data);
    // console.log(parsedData);
    switch (parsedData.class) {
      case 'SKY':
        this.updateSatellites(parsedData);
        break;
      case 'TPV':
        this.updateTPV(parsedData);
        break;
    }
  }
  
  updateSatellites(data) {
    //console.log('SATELITE = ', data.satellites);
    this.satelliteData = data;
    this.plotCalculations();
    this.populateGraphData();
  }
  
  updateTPV(data) {
    // console.log('TPV = ', data);
    this.updateTableData(data);
  }
  
  updateTableData(data) {
    if (!this.satelliteData) {
      return;
    }
    
    const
      //Fix type depends on mode: %d, 0=no mode value yet seen, 1=no fix, 2=2D, 3=3D.
      fixType = {
        0: 'No mode',
        1: 'No fix',
        2: 'Fix2D',
        3: 'Fix3D'
      },
      tableData = {
        'alt': data['alt'],
        'lon': data['lon'],
        'lat': data['lat'],
        'vdop': this.satelliteData['vdop'],
        'hdop': this.satelliteData['hdop'],
        'pdop': this.satelliteData['pdop'],
        'geoid': (-32.6).toFixed(4),
        'fixTime': data['time'] ? new Date(data['time']).getTime() : "",
        'fixType': fixType[data['mode']],
        'quality': data['status'] === 2 ? 'DGPS fix' : 'Not Present'
      };
    
    if (JSON.stringify(tableData) !== JSON.stringify(this.state.tableData)) {
      this.setState({
        tableData: tableData
      });
    }
  }
  
  toggleGPS() {
    const { socket } = this.props;
    const state = !this.state.GPS ? 'subscribe' : 'unsubscribe';
    socket && socket.emit(state, 'GPSJSON');
    this.setState({
      GPS: !this.state.GPS
    });
  }
  
  toggleIMU() {
    const { socket } = this.props;
    const state = !this.state.IMU ? 'subscribe' : 'unsubscribe';
    socket && socket.emit(state, 'IMU_1');
    this.setState({
      IMU: !this.state.IMU
    });
  }
  
  arraysEqual(a, b, callback) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    
    for (var i = 0; i < a.length; ++i) {
      if (callback(a[i], b[i])) return false;
    }
    return true;
  }
  
  plotCalculations = (onResize) => {
    const data = this.satelliteData;
    
    if (!data) {
      return;
    }
    
    const deg2rad = Math.PI / 180;
    
    // Satellite Information
    
    const prn = [];               //Satellite PRN
    
    const azi = [];  //Azimuth in degrees
    
    const el = [];             //Elevation ang
    
    data.satellites.forEach((satellite) => {
      prn.push(satellite['PRN']);
      azi.push(satellite['az']);
      el.push(satellite['el']);
    });
    /*const prn = [14, 18, 1, 9, 12, 30, 22, 32, 5, 31];               //Satellite PRN
     
     const azi = [55, 135.2, -83, 49, 95, 135, 159, -56, 116, -145];  //Azimuth in degrees
     
     const el = [69, 35, 40, 30, 30, 24, 78, 62, 32, 22];             //Elevation angle in degrees*/
    
    // Plot Figure
    
    //Convert degrees to radians
    const a = [];
    
    for (let i = 0; i < azi.length; i++) {
      a[i] = azi[i] * deg2rad;
    }
    
    //Convert elevation angle to zenith
    const r = [];
    
    for (let i = 0; i < el.length; i++) {
      r[i] = 90 - el[i];
    }
    
    const svx = [];
    const svy = [];
    let index = 0;
    
    for (let i = 0; i < azi.length; i++) {
      if (data.satellites[i].used) {
        svx[index] = r[i] * Math.sin(a[i]);
        svy[index] = r[i] * Math.cos(a[i]);
        index++;
      }
    }
    
    const sameData = this.arraysEqual(data.satellites, this.oldSatellites, (a, b) => {
      //PRN: 7, el: 57, az: 67, ss: 42, used: true}
      return !(a['PRN'] == b['PRN'] && a['az'] == b['az'] && a['el'] == b['el']);
    });
    
    if (sameData && !onResize) {
      return;
    }
    
    this.oldSatellites = data.satellites;
    
    const canvas = document.querySelector("#svg-container canvas");
    const cx = canvas.getContext("2d");
    const svg = document.querySelector('svg');
    
    if (!svg) {
      return;
    }
    
    // console.log('Changed');
    cx.canvas.height = svg.height.baseVal.value;
    cx.canvas.width = svg.width.baseVal.value;
    
    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);   // Move (0,0) to (180, 184)
    //cx.scale(1,-1);          // Make y grow up rather than down
    
    const sizeOffest = canvas.clientHeight / 200;
    const imageSizeOffset = canvas.clientHeight / 700;
    
    function drawImage(cx, img, x, y, width, height) {
      let opacity = 0;
      
      (function fadeIn() {
        cx.globalAlpha = opacity;
        cx.drawImage(img, x, y, width, height);
        opacity += 0.02;
        
        if (opacity < 1) {
          requestAnimationFrame(fadeIn);
        }
      })();
      
    }
    
    for (let i = 0; i < svx.length; i++) {
      let newImage = new Image();
      
      newImage.onload = () => {
        if (onResize) {
          cx.drawImage(newImage, (svx[i] - 10) * sizeOffest, -(svy[i] + 15) * sizeOffest, newImage.width * imageSizeOffset, newImage.height * imageSizeOffset);
        } else {
          drawImage(cx, newImage, (svx[i] - 10) * sizeOffest, -(svy[i] + 15) * sizeOffest, newImage.width * imageSizeOffset, newImage.height * imageSizeOffset);
        }
      };
      newImage.src = 'img/icons/' + getImageSrc(prn[i]);
    }
  };
  
  spiritLevelCalculations() {
    const data = this.imuData;
    const canvas = document.querySelector('#spirit-level-container canvas');
    const cx = canvas.getContext("2d");
    const hSlideLimit = [1, 75];
    const vSlideLimit = [0, 80];
    const ChSlideLimit = [-2, 115];
    const CvSlideLimit = [-10, 118];
    const angleLimit = 42;
    const ACC_LPF_FACTOR = 0.3;

    let CFangleX = data['cfangleX'];
    let CFangleY = data['cfangleY'];
    let CFangleZ = data['cfangleZ'];
    
    function scaleH(value) {
      const min = -angleLimit;
      const max = angleLimit;
      const minScale = hSlideLimit[0];
      const maxScale = hSlideLimit[1];
      return minScale + (value - min) / (max - min) * (maxScale - minScale);
    }
    
    function scaleV(value) {
      const min = -angleLimit;
      const max = angleLimit;
      const minScale = vSlideLimit[0];
      const maxScale = vSlideLimit[1];
      return minScale + (value - min) / (max - min) * (maxScale - minScale);
    }
    
    //#These two are used to scale the value appropriately for the bubble within the circle
    function scaleCH(value) {
      const min = -angleLimit;
      const max = angleLimit;
      const minScale = ChSlideLimit[0];
      const maxScale = ChSlideLimit[1];
      return minScale + (value - min) / (max - min) * (maxScale - minScale);
    }
    
    function scaleCV(value) {
      const min = -angleLimit;
      const max = angleLimit;
      const minScale = CvSlideLimit[0];
      const maxScale = CvSlideLimit[1];
      return minScale + (value - min) / (max - min) * (maxScale - minScale);
    }
    
    function is_in_circle(circle_x, circle_y, r, x, y) {
      const d = Math.sqrt((x - circle_x) ** 2 + (y - circle_y) ** 2);
      
      return d <= r;
    }
    
    if (CFangleX > angleLimit)
      CFangleX = angleLimit;
    if (CFangleX < -angleLimit)
      CFangleX = -angleLimit;
    if (CFangleY > angleLimit)
      CFangleY = angleLimit;
    if (CFangleY < -angleLimit)
      CFangleY = -angleLimit;
    
    const hBposition = [parseInt(scaleH(CFangleX)), 118.5];
    const vBposition = [117.5, parseInt(scaleV(CFangleY))];
    const newcBposition = [parseInt(scaleCH(CFangleX)), parseInt(scaleCV(CFangleY))];
    let cBposition;
    
    //#confirm that center bubble is within the circle;
    if (is_in_circle(52, 52, 42, newcBposition[0], newcBposition[1])) {
      cBposition = newcBposition
    }

    const newData = {
      hBposition: hBposition,
      vBposition: vBposition,
      cBposition: cBposition
    };
    
    if (JSON.stringify(newData) !== JSON.stringify(this.spiritLevelData)) {
      let cBubble = new Image();
      let hbBubble = new Image();
      let vbBubble = new Image();
      let bubbleWidth = 28;
      
      this.spiritLevelData = newData;
      cx.clearRect(0, 0, canvas.width, canvas.height);
      cx.beginPath();
      cx.moveTo(52, 0);
      cx.lineTo(52, 100);
      cx.stroke();
      cx.moveTo(0, 53);
      cx.lineTo(100, 53);
      cx.stroke();
      cx.closePath();
      hbBubble.onload = () => {
        cx.drawImage(hbBubble, newData['hBposition'][0], newData['hBposition'][1], 35, 28);
      };
      hbBubble.src = "img/spirit-level/Vectorillustration_design_4_bottom_bubble.png";
  
      vbBubble.onload = () => {
        cx.drawImage(vbBubble, newData['vBposition'][0], newData['vBposition'][1], 28, 34);
      };
      vbBubble.src = "img/spirit-level/Vectorillustration_design_4_right_bubble.png";
  
      cBubble.onload = () => {
        if (newData['cBposition']) {
          cx.drawImage(cBubble, newData['cBposition'][0], newData['cBposition'][1], bubbleWidth, bubbleWidth);
        }
      };
      cBubble.src = "img/spirit-level/Vectorillustration_design_4_center_bubble.png";
    }
  };
  
  populateGraphData = () => {
    const data = this.satelliteData;
    let labels = [];
    let values = [];
    
    if (data) {
      const satellites = [...data.satellites];
      satellites.sort((a, b) => {
        return a['PRN'] - b['PRN'];
      });
      satellites.forEach((satellite) => {
        labels.push(satellite['PRN']);
        values.push(satellite['ss']);
      });
    }
    
    this.setState({
      graphData: {
        labels: labels,
        datasets: [
          {
            label: 'Signal to Noise Ratio',
            backgroundColor: 'rgba(0,255,0,0.2)',
            borderColor: 'rgba(0,255,0,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(0,255,0,0.4)',
            hoverBorderColor: 'rgba(0,255,0,1)',
            data: values
          }
        ]
      }
    });
  };
  
  render() {
    setTimeout(this.plotCalculations, 0);
    return (
      <div className='animated fadeIn'>
        <div className='row'>
          <div style={{
            maxHeight: '550px',
            position: 'relative',
            border: 0
          }} className='col-sm-12 col-md-6 col-lg-6 card'>
            <div id="svg-container" className='card-block pb-0'>
              <ResizeObserver
                onResize={() => this.plotCalculations(true)}
              />
              <canvas style={{ position: 'absolute' }}>
              </canvas>
              <ReactSVG
                path="img/skyplot.svg"
                callback={svg => {
                  svg.setAttribute('height', '100%');
                  svg.setAttribute('width', '100%');
                  svg.setAttribute('style', 'max-height: 450px;');
                  svg.querySelector('#Combined-Shape').setAttribute('fill', '#88e885');
                }}
                className="skyplot"
              />
            </div>
          </div>
          
          <div style={{ position: 'relative' }} className='col-sm-12 col-md-6 col-lg-6 mb-4 background-white'>
            <div className='row'>
              <div className="row col-sm-6 col-md-6 col-lg-6">
                <div id="spirit-level-container" className="card-block">
                  <canvas style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '2.25rem',
                    zIndex: '2'
                  }}>
                  </canvas>
                  <img onLoad={() => {
                    let canvas = document.querySelector('#spirit-level-container canvas');
                    let cx = canvas.getContext('2d');
  
                    canvas.setAttribute('height', '150px');
                    canvas.setAttribute('width', '150px');
  
                    cx.beginPath();
                    cx.moveTo(52, 0);
                    cx.lineTo(52, 100);
                    cx.stroke();
                    cx.moveTo(0, 53);
                    cx.lineTo(100, 53);
                    cx.stroke();
                    cx.closePath();
                  }} style={{
                    maxHeight: '150px',
                    position: 'relative'
                  }} className="spirit-level" src="img/spirit-level/Vectorillustration_design_4_no_bubble.png" alt=""/>
                </div>
                <div className="card-block">
                  <label>In built GPS Active</label>
                </div>
              </div>
              <div className='card-block col-sm-6 col-md-6 col-lg-6'>
                <div className="form-group row">
                  <label className="col-md-5 form-control-label mw-75" htmlFor="recordata">GPS Enabled</label>
                  <label className="switch switch-3d switch-primary">
                    <input
                      type="checkbox"
                      className="switch-input"
                      checked={this.state.GPS}
                      onChange={this.toggleGPS}/>
                    <span className="switch-label"></span>
                    <span className="switch-handle"></span>
                  </label>
                </div>
                <div className="form-group row">
                  <label className="col-md-5 form-control-label mw-75" htmlFor="recordata">Start Recording</label>
                  <label className="switch switch-3d switch-primary">
                    <input type="checkbox" className="switch-input"/>
                    <span className="switch-label"></span>
                    <span className="switch-handle"></span>
                  </label>
                </div>
                <div className="form-group row">
                  <label className="col-md-5 form-control-label mw-75" htmlFor="recordata">IMU Enabled</label>
                  <label className="switch switch-3d switch-primary">
                    <input
                      type="checkbox"
                      className="switch-input"
                      checked={this.state.IMU}
                      onChange={this.toggleIMU}/>
                    <span className="switch-label"></span>
                    <span className="switch-handle"></span>
                  </label>
                </div>
                <div className="form-group row">
                  <label className="col-md-5 form-control-label mw-75" htmlFor="recordata">Show GPS Data</label>
                  <label className="switch switch-3d switch-primary">
                    <input type="checkbox" className="switch-input"/>
                    <span className="switch-label"></span>
                    <span className="switch-handle"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="card dashboard-table">
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <th>Latitude</th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {this.state.tableData ? this.state.tableData.lat : ""}
                    </td>
                  </tr>
                  <tr>
                    <th>Longitude</th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {this.state.tableData ? this.state.tableData.lon : ""}
                    </td>
                  </tr>
                  <tr>
                    <th>Altitude</th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {this.state.tableData ? this.state.tableData.alt : ""}
                    </td>
                  </tr>
                  <tr>
                    <th>Fix Time</th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {this.state.tableData ? this.state.tableData.fixTime : ""}
                    </td>
                  </tr>
                  <tr>
                    <th>Geoid Hit</th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {this.state.tableData ? this.state.tableData.geoid : ""}
                    </td>
                  </tr>
                  <tr>
                    <th>Quality</th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {this.state.tableData ? this.state.tableData.quality : ""}
                    </td>
                  </tr>
                  <tr>
                    <th>Fix Type</th>
                    <td></td>
                    <td>
                      {this.state.tableData ? this.state.tableData.fixType : ""}
                    </td>
                    <td>VDOP</td>
                    <td>
                      {this.state.tableData ? this.state.tableData.vdop : ""}
                    </td>
                  </tr>
                  <tr>
                    <th>HDOP</th>
                    <td></td>
                    <td>1.25</td>
                    <td>PDOP</td>
                    <td>
                      {this.state.tableData ? this.state.tableData.pdop : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 card card-inverse'>
            <div style={{ maxHeight: '200px', position: 'relative' }} className='chart-wrapper px-3'>
              <Bar data={this.state.graphData}
                   options={options}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default socketConnect(Dashboard);
