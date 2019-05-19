import ReactSVG from 'react-svg';
import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { socketConnect } from 'socket.io-react';
import { Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import ResizeObserver from 'react-resize-observer';

import HorizontalProgress from "./HorizontalProgress";
import Moment from 'react-moment';
import moment from 'moment-timezone';

function getImageSrc(nr) {
  //console.log(nr)
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
  },
  minBarLength: 5,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        maxTicksLimit: 5
      }
    }]
  }
};

class Dashboard extends Component {
  
  state = {
    GPS: true,
    IMU: true,
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
    tpvData: null,
    progress: 10,
    imuDataArray: {},
    todaysDate:''
  };
  satelliteData = null;
  spiritLevelData = null;
  imuData = null;
  oldSatellites = [];
  umMounted = false;

  
  constructor(props) {
    super(props);
    this.toggleGPS = this.toggleGPS.bind(this);
    this.toggleIMU = this.toggleIMU.bind(this);
    this.handleIMU1Data = this.handleIMU1Data.bind(this);
    this.handleGPSJSONData = this.handleGPSJSONData.bind(this);


    

  }
  
  componentDidMount() {
    console.log(this.props)

    var tzstring = moment.tz.guess();
    
    var date = moment(new Date().toString());
    const formattedDT = date.tz(tzstring).format('DD/MM/YYYY');
    // const formattedDT = date.tz(tzstring).format('DD-MM-YYYY HH:mm ZZ');
    this.setState({ todaysDate:formattedDT });

    // let labels = [20,10,30,40,50,60,50,60,40,50]
    // let values = [50,40,30,20,30,40,40,50,35,45]

    // let labels = [13,18,5,30, 20,10,30,40,50,60,50,60,40,50]
    // let values = [52,51,51,51,50,40,30,20,30,40,40,50,35,4]
    
    // this.setState({
    //   graphData: {
    //     labels: labels,
    //     datasets: [
    //       {
    //         label: 'Signal to Noise Ratio',
    //         backgroundColor: 'rgba(0,255,0,0.2)',
    //         borderColor: 'rgba(0,255,0,1)',
    //         borderWidth: 1,
    //         hoverBackgroundColor: 'rgba(0,255,0,0.4)',
    //         hoverBorderColor: 'rgba(0,255,0,1)',
    //         data: values
    //       }
    //     ]
    //   }
    // });

    const { socket } = this.props;
    socket.socketConnect
    
    if (this.state.GPS === true) {
      
      socket && socket.emit('subscribe', 'onyxCmdOut');
      // socket && socket.emit('subscribe', 'GPSJSON');
    }
    
    socket && socket.emit('subscribe', 'imuOut');

      // socket && socket.emit('subscribe', 'IMU_1');
    
    socket.on('data-onyxCmdOut', this.handleGPSJSONData);
    
    // socket.on('data-GPSJSON', this.handleGPSJSONData);

    socket.on('data-imuOut',  this.handleIMU1Data);

    // socket.on('data-IMU_1',  this.handleIMU1Data);

    setInterval(() => {
      this.setState(prevState => ({
        progress: 60
          //(prevState.progress + Math.floor(Math.random() * 20) + 1) % 100
      }));
    }, 5000);

  }
  
  componentWillUnmount() {

    const { socket } = this.props;
    socket && socket.emit('unsubscribe', 'onyxCmdOut');
    // socket && socket.emit('unsubscribe', 'GPSJSON');

    socket && socket.emit('unsubscribe', 'imuOut');

    // socket && socket.emit('unsubscribe', 'IMU_1');
    this.umMounted = true;
  }
  
  handleIMU1Data(data) {
    // const jsonData = JSON.parse(data);
    //debugger;
    let jsonData
    jsonData = JSON.parse(data);

    // console.log(data)
    // const jsonData = data;

    // let imuDataArray = {
    //   cfangleX: jsonData['cfangleX'],
    //   cfangleY: jsonData['cfangleY'],
    //   cfangleZ: jsonData['cfangleZ']
    // } 

    // this.setState({imuDataArray: imuDataArray})

    // const newData = this.state.imuDataArray

    const newData = {
      cfangleX: jsonData['cfangleX'],
      cfangleY: jsonData['cfangleY'],
      cfangleZ: jsonData['cfangleZ']
    };
    //console.log(newData)

    if (this.umMounted) {
      return;
    }
    // console.log(JSON.stringify(this.state.imuDataArray))
    
    if (JSON.stringify(newData) !== JSON.stringify(this.imuData)) {
      this.imuData = newData;
      this.spiritLevelCalculations();
    }
  }
  
  handleGPSJSONData(data) {
    //console.log("callleddddd gps...",data)



    // const parsedData = JSON.parse(data);
    // const parsedData = JSON.parse(JSON.stringify(data.data));
    const parsedData = data;
    //console.log(parsedData)


  
    if (this.umMounted) {
      return;
    }

    // if(parsedData != null) {
    //   console.log(parsedData)
    //   this.updateSatellites(parsedData);
    // }

    
    switch (parsedData.type) {
      case 'GSV':
        this.updateSatellites(parsedData);
        break;
      case 'GGA':
        this.updateTPV(parsedData); 
        break;
      case 'GSA':
        this.updateTPVGSA(parsedData); 
        break;
    }

    // switch (parsedData.class) {
    //   case 'SKY':
    //     this.updateSatellites(parsedData);
    //     break;
    //   case 'TPV':
    //     this.updateTPV(parsedData); 
    //     break;
    // }
  }
  updateTPVGSA(data) {
    const tableData = {
      'hdop': data['hdop'],
      'pdop': data['pdop'],
      'vdop': data['vdop']
    }
    if (JSON.stringify(tableData) !== JSON.stringify(this.state.tableData1)) {
      this.setState({
        tableData1: tableData
      });
    }
      
  }
  
  updateSatellites(data) {
    // console.log('SATELITE = ', data);
    this.satelliteData = data;
    if(this.satelliteData.satellites.length > 0) {
      this.plotCalculations();
      this.populateGraphData();
    }
  }
  
  updateTPV(data) {
    // console.log('TPV = ', data);
    this.updateTableData(data);
  }
  
  updateTableData(data) {
    // console.log(data)
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
        'geoid': data['geoidal'],
        'fixDate': data['time'] ? new Date(data['time']) : "",
        'fixTime': data['time'] ? new Date(data['time']).getTime() : "",
        'quality': data['quality'],
        'totalsatellite': data['satellites'],
        'hdop': data['hdop']
        // 'quality': data['status'] === 2 ? 'DGPS fix' : 'Not Present'
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
    console.log(socket)

    this.setState({
      GPS: !this.state.GPS 
    });
  }
  
  toggleIMU() {
    const { socket } = this.props;
    const state = !this.state.IMU ? 'subscribe' : 'unsubscribe';
    socket && socket.emit(state, 'IMU_1');
    console.log(socket)
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
    console.log()
    
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
      // console.log(satellite)
      prn.push(satellite['prn']);
      azi.push(satellite['azimuth']);
      el.push(satellite['elevation']);
      // prn.push(satellite['PRN']);
      // azi.push(satellite['az']);
      // el.push(satellite['el']);
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
      // if (data.satellites[i].used) {
        svx[index] = r[i] * Math.sin(a[i]);
        svy[index] = r[i] * Math.cos(a[i]);
        index++;
      // }
    }
    
    const sameData = this.arraysEqual(data.satellites, this.oldSatellites, (a, b) => {
      //PRN: 7, el: 57, az: 67, ss: 42, used: true}

      return !(a['prn'] == b['prn'] && a['azimuth'] == b['azimuth'] && a['elevation'] == b['elevation']);
      // return !(a['PRN'] == b['PRN'] && a['az'] == b['az'] && a['el'] == b['el']);
    });
    
    if (sameData && !onResize) {
      return;
    }
    
    this.oldSatellites = data.satellites;
    
    const canvas = document.querySelector("#svg-container canvas");
    
    if (!canvas) {
      return;
    }
    
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
    const ChSlideLimit = [13, 70];
    const CvSlideLimit = [11, 75];

    const angleLimit = 42;
    // const angleLimit = 42;
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
    
      const hBposition = [parseInt(scaleH(CFangleX)), 121];    
      const vBposition = [120.5, parseInt(scaleV(CFangleY))];
      // const hBposition = [parseInt(scaleH(CFangleX)), 118.5];
      // const vBposition = [117.5, parseInt(scaleV(CFangleY))];    
      // const newcBposition = [parseInt(scaleCH(CFangleX)), parseInt(scaleCV(CFangleY))];
  
      let newcBposition;
  
     // if( (parseInt(scaleCH(CFangleX)) >= 1 && parseInt(scaleCH(CFangleX)) <= 73) && (parseInt(scaleCV(CFangleY)) >= 1 && parseInt(scaleCV(CFangleY)) <= 62) ) {
        newcBposition = [parseInt(scaleCH(CFangleX)), parseInt(scaleCV(CFangleY))];
      //}
      //else {
        //newcBposition = [73, 52];
      //}
      // const newcBposition = [73, 52];
  
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
      let bubbleWidth = 22;
      // let bubbleWidth = 28;
      
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
        cx.drawImage(hbBubble, newData['hBposition'][0], newData['hBposition'][1], 22, 22);
        // cx.drawImage(hbBubble, newData['hBposition'][0], newData['hBposition'][1], 35, 28);
      };
      hbBubble.src = "img/spirit-level/Vectorillustration_design_4_bottom_bubble.png";
  
      vbBubble.onload = () => {
        cx.drawImage(vbBubble, newData['vBposition'][0], newData['vBposition'][1], 22, 22);
        // cx.drawImage(vbBubble, newData['vBposition'][0], newData['vBposition'][1], 28, 34);
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
        return a['prn'] - b['prn'];
        // return a['PRN'] - b['PRN'];
      });
      satellites.forEach((satellite) => {
        if(satellite['prn']!=null)
          labels.push(satellite['prn']);
        else {
          // labels = [];
          // labels = [30,30,30,30];
        }
        
        if(satellite['snr']!=null)
          values.push(satellite['snr']);
        else{
          // values = []
          // values = [30,30,30,30];
        }
        // labels.push(satellite['PRN']);
        // values.push(satellite['ss']);
      });
    }
    // labels = [20,10,30,40]
    // values = [50,40,30,20]

    //console.log(labels)
    //console.log(values)
    
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
  
                    canvas.setAttribute('height', '150px');
                    canvas.setAttribute('width', '150px');
                  }} style={{
                    maxHeight: '150px',
                    position: 'relative'
                  }} className="spirit-level" src="img/spirit-level/Vectorillustration_design_4_no_bubble.png" alt=""/>
                </div>
                <div className="card-block">
                  <h5 style = {{marginBottom:'15px'}}>In built GPS Active</h5>
                </div>
              </div>



              <div className='row col-sm-6 col-md-6 col-lg-6 card' style={{border:"none",position:'relative'}}>
                <div style={{position:"absolute",bottom:'0',width:'100%'}}>
                  <HorizontalProgress progress={this.state.progress} />
                </div>                

                
              </div>




              {/* <div className='card-block col-sm-6 col-md-6 col-lg-6'>
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
              </div> */}




            </div>

            {/* <div className='row'>
              <div className='col-sm-12 col-md-12 col-lg-12 card' style={{border:"none"}}>
                <HorizontalProgress progress={this.state.progress} />
              </div>
            </div> */}

            <div className=" card dashboard-table">
              <table className=" table-striped">
                <tbody>
                  <tr>
                    <th style = {{width:'50%'}}> Latitude</th>
                    <td>
                      {this.state.tableData && this.state.tableData.lat }
                    </td>
                  </tr>
                  <tr>
                    <th style = {{width:'50%'}}> Longitude</th>
                    <td>
                      {this.state.tableData && this.state.tableData.lon }
                    </td>
                  </tr>
                  <tr>
                    <th style = {{width:'50%'}}> Altitude</th>
                    <td>
                      {this.state.tableData && this.state.tableData.alt }
                    </td>
                  </tr>
                  <tr>
                    <th style = {{width:'50%'}}> Solution</th>
                    {/* <th>Fix Time</th> */}
                    <td>
                      {this.state.tableData && this.state.tableData.quality }
                    </td>
                  </tr>

                  <tr>
                    <th style = {{width:'50%'}}> PDOP</th>
                    <td>
                      {this.state.tableData1 && this.state.tableData1.pdop }
                    </td>
                  </tr>
                  <tr>
                    <th style = {{width:'50%'}}> HDOP</th>
                    <td>
                      {this.state.tableData1 && this.state.tableData1.hdop }
                    </td>
                  </tr>
                  <tr>
                    <th style = {{width:'50%'}}> VDOP</th>
                    <td>
                      {this.state.tableData1 && this.state.tableData1.pdop }
                    </td>
                  </tr>

                  <tr>
                    <th style = {{width:'50%'}}> Satellites Used</th>
                    <td>
                      {this.state.tableData && this.state.tableData.totalsatellite }
                    </td>
                  </tr>
                  <tr>
                    <th style = {{width:'50%'}}>Date</th>
                    <td>    
                      {this.state.todaysDate }        
                      {/* <Moment format="DD-MM-YYYY">
                        {new Date()}
                      </Moment> */}
                    </td>
                  </tr>
                  <tr>
                    <th style = {{width:'50%'}}> Time UTC</th>
                    <td>
                      {this.state.tableData && 
                        <Moment format="HH:mm:ss A">
                          {this.state.tableData.fixTime}
                        </Moment>
                        }
                      
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
















