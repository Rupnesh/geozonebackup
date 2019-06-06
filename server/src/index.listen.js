const http = require("http");
const https = require("https");
const socketIO = require("socket.io");
const fs = require("fs");

const PubSubService = require("./utils/PubSubService");
const {connect, start,disconnect} = require("./index.ampq");
const { api } = require("./config");

const httpsOptions = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem")
};

module.exports = function listen(app) {
  const server =
    api.ssl === true ? https.Server(httpsOptions, app) : http.Server(app);
  const io = socketIO(server); 
 
      server.listen(api.port, function started() {
    //console.log("api.port...", api.port);
    const address = this.address();
    const host = address.address !== "::" ? address.address : "localhost";
    const port = address.port;
    //console.log("App listening at http://%s:%s", host, port);
    //console.log("Swagger Doc started at at http://%s:%s/docs", host, port);
  });

  io.on("connection", socket => {

    //console.log("=== SOCKET CONNECTED === ");
    PubSubService.unsubscribeAll(socket);
    // start messaging queues
    socket.on("disconnectMe", () => {
      //console.log("DISCONNECT");
      socket.disconnect(0);
    });

    socket.on("subscribe", queue => {
      //console.log("SUBSCRIBE calleddddd - " + queue);
      socket.join(queue);
      setTimeout(() => {
        // console.log("Within timeout.&&&&&&&&&&&&...", queue);
 

        // socket.emit('data-GPSJSON',data)
        // socket.emit('data-IMU_1',imudata)
 
        PubSubService.subscribe(
          queue,
          data => {
       //    console.log("Within emit....",data,queue)

            //socket.broadcast.to(queue).emit(`data-${queue}`, data);
            if ('imuOut' === queue){
              if (data)
              socket.emit("data-imuOut", data);
              else 
              socket.emit("data-imuOut", {noDataAvailable:true });
            }
            else{
              if(data)
              socket.emit("data-onyxCmdOut", data);
              else 
              socket.emit("data-onyxCmdOut", {noDataAvailable:true });
            }

          },
          socket
        );
      }, 5000);
    });

    socket.on("unsubscribe", queue => {
      //console.log("UNSUBSCRIBE - " + queue);
      PubSubService.unsubscribe(queue, socket);
      socket.leave(queue);
    });
  });

  setTimeout(() => {
          connect()
      .then(ch => {
        //console.log('connected');
        // connect to the following channels and yield data
        start(ch, "onyxCmdOut");
        start(ch, "imuOut");
      })
      .catch(() => {});
  }, 5000);

 
};

 