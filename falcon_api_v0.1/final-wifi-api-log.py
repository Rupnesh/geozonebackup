from flask import Flask, jsonify, request
from flask_restful import Resource, Api
#from Flask-RESTful import Resource, Api
from flasgger import Swagger
import json
import copy_modified_receiver
import os
import sys
import datetime
import base64
import pika
#from publich_Data import sendTocmdInExchange
import logging
from datetime import datetime
import time


app = Flask(__name__)
api = Api(app, prefix="/api/v1")
app.config['SWAGGER'] = {
    'title': 'FalconGPS API',
    'uiversion': 2
}
swagger = Swagger(app)


#logging.info("Created flask APP")
def setResponse(data, status_code=200):
    '''
    creates the response package and sets the status code
    :param data:
    :param status_code:
    :return:
    '''
    response = jsonify(data)
    print(response)
    response.status_code = 200 # or 400 or whatever
    return response
    #return response1

def getConfigInfo__ ():
    #with open("../configuration/wifiConfig.yml", 'r') as ymlfile:
    #    configInfo = yaml.load(ymlfile)
    with open('E:/clients/GeoZone/GeoZone_pika/wificonfig.json', 'r') as json_data:
        configInfo = json.load(json_data)
        json_data.close()
    return configInfo

def statusFunctionProcess2(msg):
    fileavailable=True
    if fileavailable:
        msg_to_list = msg.split(',')
        print("msg_to_list",msg_to_list)
        connected_ssid = msg_to_list[1]
        print("SSID stored in the config file is %s", connected_ssid)
        response1 = {}

        if "[WLANSTATUS]ON" in msg_to_list:
            response1.setdefault("[WLANSTATUS]",[]).append("ON")
            if msg.find("NOT CONNECTED") >= 0 and msg.find("Internet Down"):
                print("status1", msg)
                #return the msg with the connected 
                response1.setdefault("[WLANSTATUS]",[]).append("NOT CONNECTED")
                response1.setdefault("[WLANSTATUS]",[]).append("Internet Down")
                #response1["[WLANSTATUS]ON"] = 'NOT CONNECTED'
                return msg
                #return response1
            else: 
                response1.setdefault("[WLANSTATUS]",[]).append("CONNECTED")
                response1.setdefault("[WLANSTATUS]",[]).append("Internet Up")
                return response1
        
        elif "[WLANSTATUS]OFF" in msg_to_list:
            response1.setdefault("[WLANSTATUS]",[]).append("OFF")
            if msg.find("NOT CONNECTED") >= 0 and msg.find("Internet Down"):
                print("status2", msg)
                #return msg
                #return the msg with the connected 
                response1.setdefault("[WLANSTATUS]",[]).append("NOT CONNECTED")
                response1.setdefault("[WLANSTATUS]",[]).append("Internet Down")
                return msg
            else: 
                response1.setdefault("[WLANSTATUS]",[]).append("CONNECTED")
                response1.setdefault("[WLANSTATUS]",[]).append("Internet Up")
                return response1
        else:
            print("Unable to find out the WLANSTATUS in msg body")





# def statusFunctionProcess(msg):
#     fileavailable=True
#     if fileavailable:
#         msg_to_list = msg.split(',')
#         print("msg_to_list",msg_to_list)
#         connected_ssid = msg_to_list[1]
#         print("SSID stored in the config file is %s", connected_ssid)
#         response1 = {}

#         if "[WLANSTATUS]ON" in msg_to_list:
#             response1.setdefault("[WLANSTATUS]",[]).append("ON")
#             if msg.find("NOT CONNECTED") >= 0 and msg.find("Internet Down"):
#                 #print("status1", msg)
#                 #return the msg with the connected 
#                 response1.setdefault("[WLANSTATUS]",[]).append("NOT CONNECTED")
#                 response1.setdefault("[WLANSTATUS]",[]).append("Internet Down")
#                 #response1["[WLANSTATUS]ON"] = 'NOT CONNECTED'
#                 return response1
#             else: 
#                 response1.setdefault("[WLANSTATUS]",[]).append("CONNECTED")
#                 response1.setdefault("[WLANSTATUS]",[]).append("Internet Up")
#                 return response1
        
#         elif "[WLANSTATUS]OFF" in msg_to_list:
#             response1.setdefault("[WLANSTATUS]",[]).append("OFF")
#             if msg.find("NOT CONNECTED") >= 0 and msg.find("Internet Down"):
#                 print("status2", msg)
#                 return msg
#                 #return the msg with the connected 
#                 response1.setdefault("[WLANSTATUS]",[]).append("NOT CONNECTED")
#                 response1.setdefault("[WLANSTATUS]",[]).append("Internet Down")
#                 return response1
#             else: 
#                 response1.setdefault("[WLANSTATUS]",[]).append("CONNECTED")
#                 response1.setdefault("[WLANSTATUS]",[]).append("Internet Up")
#                 return response1
#         else:
#             print("Unable to find out the WLANSTATUS in msg body")
#         #return response1



def statusFunctionProcess1(msg):
    fileavailable=True
    if fileavailable:
        msg_to_list = msg.split(',')
        logging.info("Inside method 'statusFunctionProcess1'")
        print("msg_to_list111",msg_to_list)
        logging.error("%s is the received and splited msg",msg_to_list)
        connected_ssid = msg_to_list[1]
        logging.error("%s is the SSID",connected_ssid)
        print("SSID stored in the config file is %s", connected_ssid)
        #response1 = {}

        if "[WLANSTATUS]ON" in msg_to_list:
            #response1.setdefault("[WLANSTATUS]",[]).append("ON")
            try:

                if "Internet Down\r\n" in msg_to_list:
                    if "NOT CONNECTED" in msg_to_list:
                        list1 = ['[WLANSTATUS]ON',connected_ssid,'NOT CONNECTED','Internet Down\r\n']
                        logging.error("returned %s",list1)

                        print("Internet down and not connected")
                        return list1
                    else:
                        print("Internet Down but connected")
                        list1 = ['[WLANSTATUS]ON',connected_ssid,'CONNECTED','Internet Down\r\n']
                        logging.error("returned %s",list1)
                        return list1
                elif "Internet UP\r\n" in msg_to_list:
                    if "NOT CONNECTED" in msg_to_list:
                        print("Internet UP but not connected")
                        list1 = ['[WLANSTATUS]ON',connected_ssid,'NOT CONNECTED','Internet Up\r\n']
                        logging.error("returned %s",list1)
                        return msg_to_list
                    else:
                        print("Internet UP and Connected")
                        list1 = ['[WLANSTATUS]ON',connected_ssid,'CONNECTED','Internet Up\r\n']
                        logging.error("returned %s",list1)
                        return msg_to_list
                else:
                    print("Nothing received properly")
                    logging("Nothing received properly")
            except Exception as e:
                #print(e)
                logging.error("Error occured %s",e)
        else:
            print("Unable to find out the WLANSTATUS in msg body")
            logging.info("Unable to find out the WLANSTATUS in msg body")

def changeCollection_(primarykey, body):
    '''
        changes the data in the json to the new value(s)
    :param primarykey: Primary Group Keyword value
    :param body: Json Object of data to change
    :return: full document to write back out.
    '''



    #logging.info("primarykey %s" % str(primarykey))
    with open('E:/clients/GeoZone/GeoZone_pika/wificonfig.json', 'r') as json_data:
        doc = json.load(json_data)
        print("received doc",doc)
        json_data.close()
    for  item in doc[primarykey]:
        print(item)
        print(body)
        print(primarykey)
        # if item == "wifiUserName":
        if body[primarykey][item] is not None:
            #print(body[primarykey][item])
            doc[primarykey][item]=body[primarykey][item]
        elif item == "wifiPassword":
            doc[primarykey][item]=body[primarykey][item]
        else:
            doc[primarykey][item]=body[primarykey][item]

        
        print(doc[primarykey][item])
        print(primarykey)


    print(doc)
    return doc

def writeJsonConfig_(data):
    ''' Writes Config file '''
    with open('E:/clients/GeoZone/GeoZone_pika/wificonfig.json', 'w') as json_data:
        #json_data = json_data
        print("successfully written")
        json.dump(data,json_data)
        json_data.close()

def returnMsg(msg):
    print("Inside the OFF status Update code")
    # dir_path = os.getcwd()
    # fileavailable = os.path.isfile(os.path.join(dir_path,'wlanconfig3.txt'))
    fileavailable =True
    try:
        logging.info("Inside the returnMsg funstion")
        if fileavailable:
            status1 ={}
            msg=msg.decode()
            if msg.find("OK") >= 0:
                status1['WLANSTATUS'] = 'OK'
                logging.info("returned [WLANSTATUS]: OK Dictionary")
                return status1
                
            else:
                print("Unable to Find the WLAN status OK")
    except Exception as e:
        print(e)
        logging.error("Error occured %s ",e)


def processCredential(msg):
    
    print("received msg inside the processCredentials",msg)
    logging.info("Inside processCredential method")
    usr = str(msg['ssid']) #print the User SSId received from the Frontend
    pas = str(msg['pass']) #print the password received from the FrontEnd
    print(pas)
    header = '[WLAN]ON'
    #end_point = '\\r\\n'
    list_ = [header,usr,pas]
    msg_created = str(','.join(str(x) for x in list_))
    logging.error("%s is the msg_created and retured")
    print("created msg",msg_created)
    return "'{}'".format(msg_created) #Convert the received msg into string

@app.route(api.prefix+'/wifi', methods=['GET'])
def wifiGet ():
    """ Returns WiFi Router and AP connection information
    ---
    responses:
        200:
            description: WiFi Router and AP connection info
    """
    info =  getConfigInfo__()
    wifi_info = info['wifiConfig']
    return setResponse({'wifiConfig': wifi_info},status_code=200)

@app.route(api.prefix + '/wifi', methods=['PUT'])
def wifiPut ():
    data= request.json
    info = getConfigInfo__()
    wifi_info= info['wifiConfig']
    
    changedValues = changeCollection_('wifiConfig', data)
    writeJsonConfig_(changedValues)
    #return jsonify(changedValues)
    return setResponse(changedValues,status_code=200)

# @app.route(api.prefix + '/wifi/connect', methods=['POST'])
# def wifiConnectPut():
#     data = request.json
#     #data=json.dumps(data)
#     if data is None:
#         return 'Data is empty or None'
#     elif data['ssid'] is None:
#         return 'ssid is empty or None'
#     elif data['pass'] is None :
#         return 'pass is empty or None'
#     print(data['ssid'])
#     print(data['pass'])


#     #return "Done"


#    # wifiConnect(data['ssid'],data['pass'])
#     return setResponse(data,status_code=200)
#     #ret

def readAndProcessInfo(msg):
    #dir_path = os.getcwd()
    #fileavailable = os.path.isfile(os.path.join(dir_path,'wlanconfig.txt'))
    fileavailable=True
    logging.info("inside readAndProcessInfo method to pass list of SSID's and Signal_dbm")
    if fileavailable:
        list1 = msg.split(',')
        list3=[]
        print(list1)
        if list1[-1] == '\r\n':
            list3=list1[:-1]
        if list3:
            list4 = [s.replace("[WLANSTATUS]",'') for s in list3]
            d = dict([(k,v) for k,v in zip(list4[::2],list4[1::2])])
            logging.error("%s is passed as a list to the front end",str(d))
            return d

def checkStatusOff(msg):
    print("inside the makin status OFF function")
    logging.info("Inside the checkStatusOFF method to check wether [WLANSTATUS] present or not")
    status =True
    if status:
        if msg:
            msg1=msg.decode()
            if msg1.find("[WLANSTATUS]") >= 0:
                statusReturnedValue = statusFunctionProcess2(msg1)
                logging.error("%s returned back to the API",str(statusReturnedValue))
                return statusReturnedValue
            else:
                print("No [WLANSTATUS] present")
                logging.info("No [WLANSTATUS] present")
        else:
            print("Msg body not received")

def sendTocmdInExchange(message):
    #Send data to the Onyx Exchange
    # message to send to Exhange Queue for fanout
    try:
        logging.info("Inside the sendTocmdINExchange")
        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        channel.exchange_declare(exchange='onyxCommandIn',
                              exchange_type='fanout')
        channel.basic_publish(exchange='onyxCommandIn', routing_key='', body=message)
        connection.close()
    except:
        print('SendToExchange: line 49 Unexpected error:', sys.exc_info()[1])

def processBody(msg):
    # dirname=os.getcwd()
    # fileavailable = os.path.isfile(os.path.join(dirname,'wlanconfig.txt'))
    fileavailable = True
    if fileavailable:
        msg1=msg.decode()
        if msg1.find("[WLANSTATUS]") >= 0:
            msg_body = readAndProcessInfo(msg1)
            print(msg_body)
            return msg_body
        else:
            print("config file in not present at that location") 

@app.route(api.prefix + '/wifi/on', methods=['GET']) #API to fetch and pass the LIST of available SSIDs and Signal dBms to and from backend
def wifis():

    try:
        #msg=[]
        logging.info("Inside the ON API")
        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        logging.error('%s channel has been established', str(channel))
        wifiListCommandPass = "[WLAN]ON\r\n"
        sendTocmdInExchange(wifiListCommandPass) # passing the ON command to the Exhange
        logging.error('%s command passed to the OnyxCmdIN Exchange to turn ON wifistatus', str(wifiListCommandPass))
        channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
        result = channel.queue_declare(exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange='onyxCmdOut',queue=queue_name) 
        wifiListCommandPass = "[WLAN]LIST"
        sendTocmdInExchange(wifiListCommandPass)
        logging.error('%s command passed to the OnyxCmdIN Exchange to get available wifi list', str(wifiListCommandPass))
        generator = channel.consume(queue=queue_name, inactivity_timeout=60)
        for message_tuple in generator:
            if message_tuple is not None:  # None returned after inactivity timeout
                method, properties, body = message_tuple
                logging.info("started the body-message consumption")
                if method is not None and body is not None:
                    if body:
                        FinalValue = processBody(body)
                        print("FinalValue",FinalValue)
                        logging.error("%s is the received value",str(FinalValue))
                        try:
                            if FinalValue != None:
                                #msg.append(FinalValue)
                                logging.info("COnvert the value and return as JSON object ")
                                return jsonify(FinalValue)
                                channel.cancel()
                                
                        except Exception as e:
                            #print(e)
                            logging.error("Exception occurred %s", e)

        channel.cancel()
    except Exception as e:
        print("Error while handling the channel")
        logging.error("Exception occurred %s", e) 





@app.route(api.prefix + '/wifi/cred', methods=['POST'])

def getCred():
    data = request.json
    logging.error("received %s from the front end", str(data))
    #data = str(data)
    credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
    channel = connection.channel()
    channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
    result = channel.queue_declare(exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
    logging.info("Established the connection")
    #check the valid data received or not
            
    if data is None:
        return 'Data is Empty'
    elif data['ssid'] is None:
        return 'SSID is Missing'
    elif data['pass'] is None:
        return 'Password is Missing'
    print("The {0} is SSID and {1} is the Password received".format(data['ssid'],data['pass']))
    logging.error("successfully received %s and %s",data['ssid'],data['pass'])

    if data:
        try:
            msg=[]
            #first confirm that WLAN is Connected or not by passing status command
            logging.info("Started consumption of the msg from the Exchange")
            sendTocmdInExchange('[WLAN]\r\n')
            #locals.error('sent %s to the onyxCmdIn exchange', '[WLAN]\r\n')
            generator = channel.consume(queue=queue_name)
            for message_tuple in generator:
                if message_tuple is not None:  # None returned after inactivity timeout
                    method, properties, body = message_tuple
                    if method is not None and body is not None:
                        if body:
                            body = body.decode()
                            logging.info("inside the body to consume the status of the connection")
                            print("body",body)
                            FinalValue = body    
                            print("SSID received ",FinalValue)                          
                            print("FinalValue",FinalValue)
                            logging.error("received boy is %s",str(FinalValue))
                            try:
                                if "ON" in FinalValue:
                                    logging.error("ON is present inside the %s",FinalValue)
                                    FinalValue1 = statusFunctionProcess1(FinalValue)
                                    print("FinalValue1",type(FinalValue1))
                                    print("FinalValue1",FinalValue1)

                                    if "NOT CONNECTED" in FinalValue1 and "Internet UP\r\n" in FinalValue1 :
                                        try:
                                            finalMsg={"status":0,
                                            "message1":"NOT Connected",
                                            "message2":"Internet Up"
                                            }
                                            print(finalMsg)
                                            return jsonify(finalMsg)
                                        except Exception as e:
                                            print(e)
                                            logging.error("Exception occurred %s", e)
                                    elif "NOT CONNECTED" in FinalValue1 and "Internet Down\r\n" in FinalValue1:
                                        try:
                                            finalMsg={"status":0,
                                            "message1":"NOT Connected",
                                            "message2":" Internet Down"
                                            }
                                            print(finalMsg)
                                            return jsonify(finalMsg)
                                        except Exception as e:
                                            print(e)
                                            logging.error("Exception occurred %s", e)
                                    elif "CONNECTED" in FinalValue1 and "Internet UP\r\n" in FinalValue1:
                                        try:
                                            expectedMsg = processCredential(data) #{'ssid':'xyz','pass':'abc'}
                                            print("Expectedmsg",expectedMsg)
                                            sendTocmdInExchange(expectedMsg) # Send the credentials to the commandIN exchange and update in wlanconfig.json file
                                            time.sleep(1)
                                            finalMsg={"status":1,
                                                "message1":"Connected",
                                                "message2":" Internet Up"
                                                }
                                            print(finalMsg)
                                            return jsonify(finalMsg)
                                        except Exception as e:
                                            print(e)
                                            logging.error("Exception occurred %s", e)
                                    else:
                                        try:
                                            finalMsg={"status":0,
                                                "message1":"Connected",
                                                "message2":" Internet Down"
                                                }
                                            print(finalMsg)
                                            return jsonify(finalMsg)
                                        except Exception as e:
                                            #print(e)
                                            logging.error("Exception occurred %s", e)
                                else:
                                    print("WLANSTATUS is OFF")


                            except Exception as e:
                                #print(e)
                                logging.error("Exception occurred %s", e)
            channel.cancel()
        except Exception as e:
            #print(e)  
            logging.error("Exception occurred %s", e) 




@app.route(api.prefix + '/wifi/off', methods=['GET'])
def makeWlanOff():
    #when we switch off the toggle button from the front end we need to update as status off in the wlanconfig file by sending the '[WLAN]OFF\r\n' msg to the exchange 
    credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
    logging.info("Inside the OFF APi")
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
    channel = connection.channel()
    wifiListCommandPass = "[WLAN]OFF\r\n"
    sendTocmdInExchange(wifiListCommandPass)
    logging.error("%s is passed to onyxCmdIn exchange",str(wifiListCommandPass))
    channel.exchange_declare(exchange='onyxCmdOut',
                                exchange_type='fanout')
    result = channel.queue_declare(exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
    wifiListCommandPass = "[WLAN]\r\n"
    sendTocmdInExchange(wifiListCommandPass)
    generator = channel.consume(queue=queue_name, inactivity_timeout=60)
    for message_tuple in generator:
        if message_tuple is not None:  # None returned after inactivity timeout
            method, properties, body = message_tuple
            if method is not None and body is not None:
                if body:
                    try:
                        global FinalValueOFF

                        resultJson= {}
                        # call the function which will check inside the body whether OFF is present or not
                        FinalValueOFF = checkStatusOff(body)
                        try:
                            if "OFF" in FinalValueOFF:
                                resultJson = {
                                    "[WLANSTATUS]" : "OFF"
                                }
                                # resultJson["[WLANSTATUS]"] = "OFF"

                                #print("Off check status response",FinalValue)
                                return jsonify(resultJson)
                            else:
                                print("None received from the checkStatusOff function")
                        except Exception as e:
                            print(e)
                            logging.error("Exception occurred %s", e)
                    except Exception as e:
                        print(e)
                        logging.error("Exception occurred %s", e)
                else:
                    print("proper msg body has not consumed")




@app.route(api.prefix + '/wifi/update', methods=['POST'])
def wifiOFF():
    print("Make the wifi Device OFF")

    data= request.json
    data = {'[WLANSTATUS]': 'OFF'}
    modified_data={"wifiConfig" : data}
    print(modified_data)
    info = getConfigInfo__()
    print(info)
    wifi_info= info['wifiConfig']
    print(wifi_info)
    
    changedValues = changeCollection_('wifiConfig', modified_data)
    print(changedValues)
    writeJsonConfig_(changedValues)
    return setResponse(changedValues,status_code=200)


if __name__ == "__main__":
    #app.run(host='0.0.0.0',port=6060, debug=True)
    now = datetime.now()
    now=now.strftime("%Y-%m-%d-%H-%M-%S")
    format
    logging.basicConfig( filename=r'GeoZone_API'+str(now)+'.log',level=logging.DEBUG,format = '%(name)s - %(levelname)s - %(message)s')
    app.run(host='0.0.0.0',port=6060, debug=True)
    logging.info("code done")
    logging.shutdown()
    


