const http = require('http');
const https = require('https');
const socketIO = require('socket.io');
const fs = require('fs');

const PubSubService = require('./utils/PubSubService');
const ampq = require('./index.ampq');
const { api } = require('./config');

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

var WiFiControl = require('wifi-control');
//npm i wifi-control --save
var wifi = require("node-wifi");
//npm install node-wifi

//var hostapd = require('wireless-tools/hostapd');
//npm i wireless-tools --save


var wifilist, currentwifi, disconnectflag = false;
wifi.init({
  // iface: null // network interface, choose a random wifi interface if set to null
  debug: true
});

// Scan networks
wifi.scan(function (err, networks) {
  if (err) {
    console.log(err);
  } else {
    wifilist = networks;
  }
});

//List the current wifi connections
wifi.getCurrentConnections(function (err, currentConnections) {
  if (err) {
    console.log(err);
  }
  currentwifi = currentConnections;
});

// wifi.disconnect(function(err) {
//   if (err) {
//     console.log(err);
//   }
//   disconnectflag =true;
//   console.log("Disconnected");
// });





module.exports = function listen(app) {
  //console.log("appppp", app)
  const server = api.ssl === true ? https.Server(httpsOptions, app) : http.Server(app);
  const io = socketIO(server);
  server.listen(api.port, function started() {
    //console.log("api.port...", api.port)
    const address = this.address();
    const host = address.address !== '::' ? address.address : 'localhost';
    const port = address.port;
    //console.log('App listening at http://%s:%s', host, port);
    //console.log('Swagger Doc started at at http://%s:%s/docs', host, port);
  });

  // wifi.init({
  //   iface: null // network interface, choose a random wifi interface if set to null
  // });

  // Scan networks


  io.on('connection', (socket) => {
    //console.log('=== SOCKET CONNECTED === ');
    PubSubService.unsubscribeAll(socket);
    // start messaging queues
    socket.on('disconnectMe', () => {
      //console.log('DISCONNECT');
      socket.disconnect(0);
    });

    socket.on('subscribe', (queue) => {
      //console.log('SUBSCRIBE calleddddd - ' + queue);
      socket.join(queue);
      setTimeout(() => {
        //console.log("Within timeout....")

        data = {
          "type": "GSV",
          "class": "SKY",
          "tag": "MID4",
          "device": "/dev/ttyUSB0",
          "time": "2017-09-14T14:42:36.000Z",
          "xdop": 0.92,
          "ydop": 0.70,
          "vdop": 1.75,
          "tdop": 1.15,
          "hdop": 1.00,
          "gdop": 2.40,
          "pdop": 2.10,
          "satellites": [
            {
              "azimuth": 43,
              "elevation": 36,
              "prn": 17,
              "snr": 21,
              "status": "tracking",
              "used": true
            },
            {
              "prn": 2,
              "elevation": 40,
              "azimuth": 187,
              "snr": 16,
              "status": "tracking",
              "used": true
            },
            {
              "prn": 5,
              "elevation": 0,
              "azimuth": 100,
              "snr": 280,
              "status": "tracking",
              "used": true
            },
            {
              "prn": 10,
              "elevation": 10,
              "azimuth": 200,
              "snr": 270,
              "status": "tracking",
              "used": true
            },
            {
              "prn": 15,
              "elevation": 50,
              "azimuth": 150,
              "snr": 250,
              "status": "tracking",
              "used": true
            },

          ]

        }

        imudata = {
          "loopTime": 0.25,
          "ACCX Angle": -2.1,
          "ACCY Angle": 0.2,
          "GRYX Angle": -5.74,
          "GYRY Angle": 2.13,
          "GYRZ Angle": 12.12,

          // "cfangleX": -2.37,
          // "cfangleY": 74.31,
          // "cfangleZ": 162.64,

          "cfangleX": 10,
          "cfangleY": 20,
          "cfangleZ": 0,
          // "cfangleX": 25, 
          // "cfangleY": 4, 
          // "cfangleZ": 0,

          "HEADING": 247.47,
          "tiltCompensatedHeading": 247.18,
          "kalmanX": -2.17,
          "kalmanY": 0.33


        }

        socket.emit('data-imuOut', imudata)

        socket.emit('data-onyxCmdOut', data)



        // socket.emit('data-GPSJSON',data)
        // socket.emit('data-IMU_1',imudata)

        // socket.emit('data-imuOut',imudata)

        // socket.emit('data-onyxCmdOut',data)

        PubSubService.subscribe(queue, (data) => {
          // console.log("Within emit....",data)

          // socket.broadcast.to(queue).emit(`data-${queue}`, data);

          socket.emit('data-imuOut', data)

          socket.emit('data-onyxCmdOut', data)
        }, socket);



      }, 5000);
    });

    socket.on('unsubscribe', (queue) => {
      //console.log('UNSUBSCRIBE - ' + queue);
      PubSubService.unsubscribe(queue, socket);
      socket.leave(queue);
    });

    socket.on('subscribewifi', (wifi) => {

      if (disconnectflag === true) {
        wifilist = [];
        currentwifi = [];
      }
      if (wifilist)
        //console.log('list...',wifilist)

        // this.currentConnection();
        if (currentwifi)
          //console.log('current...', currentwifi)


          WiFiControl.init({
            //debug: true,
          });
      WiFiControl.scanForWiFi(function (err, response) {
        if (err) console.log(err);
        dataarray = response.networks
        socket.emit('data-wifi', { data: response.networks })
      });
      var ifaceState = WiFiControl.getIfaceState();
      //console.log('if...',ifaceState)
      socket.emit('data-wifi-current', { data: ifaceState })




    })

    socket.on('subscibetimer', (data) => {
      console.log("server", data)
      var seconds = 60;
      seconds = seconds * data.time;

      var refreshId = setInterval(() => {
        seconds--;
        
        if(seconds === 0) {
          socket.emit('data-subscibetimer', { data: 0 })
          clearInterval(refreshId)
        }
        else  {
          socket.emit('data-subscibetimer', { data: seconds })
        }
      }, 1000);
    })

    socket.on('unsubscribe-timer', (queue) => {
      console.log('UNSUBSCRIBE - ' + queue);
      socket.leave('data-uploadStatus');

    });

  });

  setTimeout(() => {
    ampq.connect()
      .then((ch) => {
        // connect to the following channels and yield data
        ampq.start(ch, 'onyxCmdOut');
        ampq.start(ch, 'imuOut');
      })
      .catch(() => { });
  }, 5000);

  // currnetConnection(() => {
  //   console.log('hello')
  //   wifi.getCurrentConnections()
  //   .then(function(currentConnections) {
  //     currentwifi = currentConnections;
  //   })
  //   .catch(function(error) {
  //   });
  // });


  // setTimeout(() => {
  //   ampq.connect()
  //     .then((ch) => {
  //       ampq.start(ch, 'GPSJSON');
  //       ampq.start(ch, 'IMU_1');
  //     })
  //     .catch(() => {});
  // }, 1000);
};









// {"loopTime":  0.05, "ACCX Angle":  0.20, "ACCY Angle":  3.77, "GRYX Angle": -170667.90, "GYRY Angle": 180748.03, "GYRZ Angle": -735611.29, "cfangleX":  0.13, "cfangleY":  3.78, "cfangleZ": 162.60, "HEADING": 171.28, "tiltCompensatedHeading": 170.55, "kalmanX":  0.13, "kalmanY":  3.74}
// DashboardView.js:132 {"loopTime":  0.05, "ACCX Angle": -0.28, "ACCY Angle":  3.94, "GRYX Angle": -170667.93, "GYRY Angle": 180748.13, "GYRZ Angle": -735611.51, "cfangleX": -0.13, "cfangleY":  3.92, "cfangleZ": -40.62, "HEADING": 171.50, "tiltCompensatedHeading": 171.21, "kalmanX": -0.02, "kalmanY":  3.84}


// {"loopTime":  0.05, "ACCX Angle": -0.28, "ACCY Angle":  4.40, "GRYX Angle": -170925.50, "GYRY Angle": 181175.64, "GYRZ Angle": -737103.18, "cfangleX": -0.13, "cfangleY":  4.33, "cfangleZ": -34.83, "HEADING": 171.13, "tiltCompensatedHeading": 170.76, "kalmanX":  0.05, "kalmanY":  4.27}
// DashboardView.js:132 {"loopTime":  0.05, "ACCX Angle":  0.36, "ACCY Angle":  4.21, "GRYX Angle": -170925.55, "GYRY Angle": 181175.72, "GYRZ Angle": -737103.40, "cfangleX":  0.14, "cfangleY":  4.29, "cfangleZ": 91.07, "HEADING": 171.64, "tiltCompensatedHeading": 170.73, "kalmanX":  0.16, "kalmanY":  4.25}
// DashboardView.js:132 {"loopTime":  0.07, "ACCX Angle":  0.36, "ACCY Angle":  4.11, "GRYX Angle": -170925.57, "GYRY Angle": 181175.75, "GYRZ Angle": -737103.76, "cfangleX":  0.26, "cfangleY":  4.20, "cfangleZ": 141.29, "HEADING": 171.54, "tiltCompensatedHeading": 170.62, "kalmanX":  0.26, "kalmanY":  4.16}
// DashboardView.js:132 {"loopTime":  0.06, "ACCX Angle":  0.39, "ACCY Angle":  4.25, "GRYX Angle": -170925.62, "GYRY Angle": 181175.85, "GYRZ Angle": -737103.99, "cfangleX":  0.32, "cfangleY":  4.26, "cfangleZ": 161.25, "HEADING": 171.19, "tiltCompensatedHeading": 170.19, "kalmanX":  0.31, "kalmanY":  4.21}
// DashboardView.js:132 {"loopTime":  0.06, "ACCX Angle":  0.55, "ACCY Angle":  4.69, "GRYX Angle": -170925.66, "GYRY Angle": 181175.88, "GYRZ Angle": -737104.20, "cfangleX":  0.45, "cfangleY":  4.53, "cfangleZ": 168.39, "HEADING": 170.97, "tiltCompensatedHeading": 169.72, "kalmanX":  0.41, "kalmanY":  4.37}
// DashboardView.js:132 {"loopTime":  0.05, "ACCX Angle":  0.04, "ACCY Angle":  3.75, "GRYX Angle": -170925.70, "GYRY Angle": 181175.96, "GYRZ Angle": -737104.42, "cfangleX":  0.19, "cfangleY":  4.09, "cfangleZ": 174.91, "HEADING": 171.30, "tiltCompensatedHeading": 170.74, "kalmanX":  0.27, "kalmanY":  4.14}
// DashboardView.js:132 {"loopTime":  0.07, "ACCX Angle":  0.44, "ACCY Angle":  4.26, "GRYX Angle": -170925.78, "GYRY Angle": 181176.04, "GYRZ Angle": -737104.74, "cfangleX":  0.30, "cfangleY":  4.23, "cfangleZ": 174.31, "HEADING": 170.81, "tiltCompensatedHeading": 169.75, "kalmanX":  0.32, "kalmanY":  4.18}



// const http = require("http");
// const https = require("https");
// const socketIO = require("socket.io");
// const fs = require("fs");

// const PubSubService = require("./utils/PubSubService");
// const { connect, start, disconnect } = require("./index.ampq");
// const { api } = require("./config");

// const httpsOptions = {
//   key: fs.readFileSync("./certs/key.pem"),
//   cert: fs.readFileSync("./certs/cert.pem")
// };

// module.exports = function listen(app) {
//   const server =
//     api.ssl === true ? https.Server(httpsOptions, app) : http.Server(app);
//   const io = socketIO(server);

//   server.listen(api.port, function started() {
//     const address = this.address();
//     const host = address.address !== "::" ? address.address : "localhost";
//     const port = address.port;
//   });

//   io.on("connection", socket => {
//     PubSubService.unsubscribeAll(socket);

//     socket.on("disconnectMe", () => {
//       socket.disconnect(0);
//     });

//     socket.on("subscribe-upload", queue => {
//       data = [{ "status": "1", "message":"Uploading..." }, { "status": "2", "message":"Upload Completed..." }]
//       socket.emit("data-uploadStatus", data[0]);
//       setTimeout(() => {        
//         socket.emit("data-uploadStatus", data[1]);
//       }, 4000)
//     }); 
//     socket.on("unsubscribe-upload", queue => {
//       console.log("UNSUBSCRIBE - " + queue);
//       socket.leave('data-uploadStatus');
//     });

//     socket.on("subscribe", queue => {
//       socket.join(queue);
//       setTimeout(() => {

//         PubSubService.subscribe(
//           queue,
//           data => {
//             if ('imuOut' === queue) {
//               if (data)
//                 socket.emit("data-imuOut", data);
//               else
//                 socket.emit("data-imuOut", { noDataAvailable: true });
//             }
//             else {
//               if (data)
//                 socket.emit("data-onyxCmdOut", data);
//               else
//                 socket.emit("data-onyxCmdOut", { noDataAvailable: true });
//             }

//           },
//           socket
//         );
//       }, 5000);
//     });

//     socket.on("unsubscribe", queue => {
//       console.log("UNSUBSCRIBE - " + queue);
//       PubSubService.unsubscribe(queue, socket);
//       socket.leave(queue);
//       socket.leave('data-uploadStatus');
//     });
//   });

//   setTimeout(() => {
//     connect()
//       .then(ch => {
//         start(ch, "onyxCmdOut");
//         start(ch, "imuOut");
//       })
//       .catch(() => { });
//   }, 5000);


// };

