const amqp = require('amqplib');
const Promise = require('bluebird');
const { CLOUDAMQP_URL } = require('./config');
const PubSubService = require('./utils/PubSubService');
let arr = {
  satellites:[]
}

function connect() {
  connection: null;
    return new Promise((resolve, reject) => {
      this.connection = amqp.connect(CLOUDAMQP_URL);
      this.connection.then((conn) => {
        return conn.createChannel();
      }).then((ch) => {        
        resolve(ch);
      }).catch((e) => {
        //console.warn(e);
        //console.log("TEST")
        reject(e);
      });
    });
  }

  async function start(ch, exchange) {

    // create exchange
    const res1 = await ch.assertExchange(exchange, "fanout", {
      durable: false
    });

    //use exclusive queue en
    let result = await ch.assertQueue("", { exclusive: true });
    // console.log(result);

    //bind the queue to exchange
    let res2 = await ch.bindQueue(result.queue, exchange, "");

    let checkImuData=false;
    let checkSnr=false;
    let res4={};

    //consume data and pass to frontend
      ch.consume(
      result.queue,
      function (msg) {
        if (msg.content) {

         
          let res = msg.content.toString();
          // console.log(res);
     

          let r= res.startsWith("{");
          let isobject = typeof res === "object" ? true :false;
          if(r===true && !isobject ){
            checkImuData=true;
            checkSnr=false;
            res4=res;
             PubSubService.publish(exchange,res );
             
             } 
        
          const GPS =require('gps');
          var gps = new GPS();
          var sentence = msg.content.toString();
        
          gps.on('data', function(parsed) {
            checkImuData=false;
            checkSnr=true;
            
            if(parsed.type === "GGA" || parsed.type === "GSA")
            { 

              res=parsed;
            } 
            else if (parsed.type === "GSV") {

              var array = res.split(',');
              if (array[0] === "$GPGSV" || array[0] === "$GLGSV") {
                if (array[1] == 1 || 2 || 3) {
          
                  parsed.satellites.map((i => {
                    arr.satellites.push(i);
                  }))
                  if (array[1] == 1 && array[0] === "$GLGSV" ) {
                    parsed.satellites =arr.satellites;
                   
                    arr.satellites = []
                  }
                  if (array[2] == 2 && array[1] == 2 && array[0] === "$GLGSV" ) {
                    parsed.satellites =arr.satellites;
                    res = parsed;
                    arr.satellites = []
                  }
                  if (array[2] == 3 && array[1] == 3 && array[0] === "$GLGSV"  ) {
                    parsed.satellites =arr.satellites;
                    res = parsed;
                    arr.satellites = []
                  }
                }
              }
            }
            PubSubService.publish(exchange,res );
            res4=parsed;
            

          });
          gps.update(sentence);
        }
      },
      { noAck: true }
    );
  
    
    if(!checkImuData  && exchange === "imuOut" )  { 
      start(ch, exchange);
      
      if(typeof res4 === "object" && !res4.looptime ) {
        setTimeout(async()=>{
          PubSubService.publish(exchange,"")
          //console.log('no data 1',checkImuData,res4);
        },10000)
      }
    }
    // if(!checkSnr  && exchange === "onyxCmdOut" )  { 
    //   start(ch, exchange);
      
    //   if(typeof res4 === "object" && !res4 ) {
    //     setTimeout(async()=>{
    //       PubSubService.publish(exchange,"")
    //       console.log('no data 1',checkImuData,res4);
    //     },10000)
    //   }
    // }
  }

  function disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }
module.exports = {
connect,
disconnect,
start
  
};


