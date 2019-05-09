from flask import Flask, jsonify, request, Response,make_response,send_file,send_from_directory
from flask_restful import Resource, Api
#from Flask-RESTful import Resource, Api
from flasgger import Swagger
import json
import os
import os.path
import sys
import datetime
import base64
import pika
import subprocess
#from publich_Data import sendTocmdInExchange
import logging
from pathlib import Path
import codecs
from datetime import datetime
import time
#import loggig-pi-script-download
JSON_MIME_TYPE = 'application/json'

from collections import OrderedDict
import unicodedata

from flask import send_file
from werkzeug.http import dump_options_header
from werkzeug.urls import url_quote


app = Flask(__name__)
api = Api(app, prefix="/api/v1")
app.config['SWAGGER'] = {
    'title': 'FalconGPS API',
    'uiversion': 2
}
swagger = Swagger(app)
sdcardInserted=''
final_value = ''

def processSpaceData(msg):
    try:
        print("Type of data received",type(msg))
        if type(msg) == list:    
            print("data received for final processing",msg)
            #used/free/total
            Mem_used = msg[0]
            Mem_Free = msg[1]
            Mem_total = msg[2]
            if msg:
                finalMsg={"status":1,"data":{'Used_Memory':Mem_used,'Free_Memory':Mem_Free,'Total_memory':Mem_total},"message":"Space availability status is sent"}
                return (finalMsg)
            else:
                print("data not received")
    except Exception as e:
        print(e)



def processOnLogging(message):
    #convert the data into list
    #if connection.is_open:
    startProcess=True
    if startProcess:
        list1 = message.split(',')
        list3=[]
        print(list1)
        #if '\r\n' present at end then eliminate that 
        if list1:
            list3 = [s.replace("\r\n",'') for s in list1]

        #     list3=list1[:-1]
        if list3:
            list4 = [s.replace("[SDCARDSTATUS]",'') for s in list3]
            print("list4",list4)
            return list4 #[OFF,log.dat,logRate:1,logType:NMEA,logDuration:0]
        else:
            print("list is not present LOGGING")    

def processCredentialLog(msg):
    
    print("received LOG Data from front end inside the processCredentials Function",msg)
    LOG_RATE = str(msg['LOG_RATE'])
    TYPE = str(msg['TYPE'])
    LOG_DURATION = str(msg['LOG_DURATION'])
    LOG_FILE = str(msg['LOG_FILE'])
    print(LOG_RATE,TYPE,LOG_DURATION,LOG_FILE)
    header = '[SDLOG]START'
    #end_point = '\\r\\n'
    list_ = [header,LOG_RATE,TYPE,LOG_DURATION,LOG_FILE]
    msg_created = str(','.join(str(x) for x in list_))
    print(msg_created)
    return msg_created, list_
#***********************************************************


#******************FInal defined format to return***********
def returnLogFileNames():
    # receivedFileName = fileName
    response= []
    arr = os.listdir('/usr/src/app/')
    print (arr)
    # if arr:
    #     cmd = 'sudo ls /mnt/usbdrive/'
    #     ps = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    #     cmdoutput = ps.communicate()[0]

    #     response=(arr)
    return arr
# def returnLogFileNames():
#     os.path.expanduser("/")
#     arr = os.listdir("/mnt/usbdrive/")
#     print(arr,"list")
#     cmd = 'sudo ls /mnt/usbdrive/'
#     ps = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
#     cmdoutput = ps.communicate()[0]
#     return cmdoutput

def finalProcessedData(data):
    try:
        print("Type of data received",type(data))
        if type(data) == list:    
            print("data received for final processing",data)
            #[OFF,log.dat,logRate:1,logType:NMEA,logDuration:0]
            LogfileName = data[1]
            LogRate = data[2].split(":")[1]
            LogType = data[3].split(":")[1]
            LogDuration = data[4].split(":")[1]
            
            if data[0] == 'ON':
                finalMsg={"status":1,"data":{'LOGGING':'ON','SD_CARD':'INSERTED','LOG_Type':LogType,'LOG_RATE':LogRate,'LOG_DURATION':LogDuration,'LOG_FILE':LogfileName,'Log_status':1},"message":"Sent logging ON status"}
                return (finalMsg)
                    
            else:
                finalMsg={"status":1,"data":{'LOGGING':'OFF','SD_CARD':'INSERTED','LOG_Type':LogType,'LOG_RATE':LogRate,'LOG_DURATION':LogDuration,'LOG_FILE':LogfileName,'Log_status':0},"message":"Sent logging OFF status"}
                return (finalMsg)

                

    except Exception as e:
        print(e)



def sendTocmdInExchange1(message):
    #Send data to the Onyx Exchange
    # message to send to Exhange Queue for fanout
    try:
        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        channel.exchange_declare(exchange='onyxCommandIn',
                            exchange_type='fanout')
        channel.basic_publish(exchange='onyxCommandIn', routing_key='', body=message)
        connection.close()
    except:
        print('SendToExchange: line 49 Unexpected error:', sys.exc_info()[1])










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
        if fileavailable:
            status1 ={}
            msg=msg.decode()
            if msg.find("OK") >= 0:
                status1['WLANSTATUS'] = 'OK'
                return status1
                
            else:
                print("Unable to Find the WLAN status OK")
    except Exception as e:
        print(e)

def processCredential(msg):
    
    print("received msg inside the processCredentials",msg)
    usr = str(msg['ssid'])
    pas = str(msg['pass'])
    print(pas)
    header = '[WLAN]ON'
    #end_point = '\\r\\n'
    list_ = [header,usr,pas]
    msg_created = str(','.join(str(x) for x in list_))
    print(msg_created)
    return msg_created
    #'[WLAN]ON,Geozone AG,GeozoneAG8153\r\n'


#**************************old process cred******************
# def processCredential(msg):
    
#     print("received msg inside the processCredentials",msg)
#     usr = str(msg['ssid']) #print the User SSId received from the Frontend
#     pas = str(msg['pass']) #print the password received from the FrontEnd
#     print(pas)
#     header = '[WLAN]ON'
#     #end_point = '\\r\\n'
#     list_ = [header,usr,pas]
#     msg_created = str(','.join(str(x) for x in list_))
#     print("created msg",msg_created)
#     return "'{}'".format(msg_created) #Convert the received msg into string

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


def readAndProcessInfo(msg):
    #dir_path = os.getcwd()
    #fileavailable = os.path.isfile(os.path.join(dir_path,'wlanconfig.txt'))
    fileavailable=True
    if fileavailable:
        list1 = msg.split(',')
        list3=[]
        print(list1)
        if list1[-1] == '\r\n':
            list3=list1[:-1]
        if list3:
            list4 = [s.replace("[WLANSTATUS]",'') for s in list3]
            d = dict([(k,v) for k,v in zip(list4[::2],list4[1::2])])
            return d
#****************************


def statusFunctionProcess1(msg):
    fileavailable=True
    if fileavailable:
        msg_to_list = msg.split(',')
        print("msg_to_list",msg_to_list)
        connected_ssid = msg_to_list[1]
        IP_address = msg_to_list[4]
        FinalValue =msg_to_list
        try:
            print("IP address received is",IP_address)
            print("SSID stored in the config file is %s", connected_ssid)
            #response1 = {}
            if "[WLANSTATUS]ON" in FinalValue:

            #logging.error("ON is present inside the %s",FinalValue)

                FinalValue1 = FinalValue
                print("FinalValue1",type(FinalValue1))
                print("FinalValue1",FinalValue1)
                # print("FinalValue1[2]",FinalValue1[2])
                # print("FinalValue1[3]",FinalValue1[3])
                # print("FinalVal[4]",FinalValue1[4])
                if(FinalValue1[2] == "NOT CONNECTED" and FinalValue1[3] == "Internet UP"):
                    try:
                        finalMsg={"status":0,
                        "message1":"NOT Connected",
                        "message2":"Internet Up",
                        "message3":"0.0.0.0" 
                        }
                        print(finalMsg)
                        return finalMsg
                    except Exception as e:
                        print(e)
                        #logging.error("Exception occurred %s", e)
                elif FinalValue1[2] == "NOT CONNECTED" and FinalValue1[3] == "Internet Down":
                    try:
                        finalMsg={"status":0,
                        "message1":"NOT Connected",
                        "message2":" Internet Down",
                        "message3":"0.0.0.0"        
                        }
                        print(finalMsg)
                        return finalMsg
                    except Exception as e:
                        print(e)
                        #logging.error("Exception occurred %s", e)
                elif FinalValue1[2]=="CONNECTED" and FinalValue1[3] == "Internet UP" and FinalValue1[4] != "0.0.0.0\r\n":
                    try:
                        # data={"ssid":"GeoZone AG", "pass":"GeoZone8351\r\n"}
                        # expectedMsg = processCredential(data) #{'ssid':'xyz','pass':'abc'}
                        # print("Expectedmsg",expectedMsg)
                        # sendTocmdInExchange(expectedMsg) # Send the credentials to the commandIN exchange and update in wlanconfig.json file
                        # time.sleep(1)
                        finalMsg={"status":1,
                            "message1":"Connected",
                            "message2":"Internet Up",
                            "message3": IP_address,
                            "message4":connected_ssid
                            }
                        print(finalMsg)
                        return finalMsg
                    except Exception as e:
                        print(e)
                        #logging.error("Exception occurred %s", e)
                else:
                    try:
                        finalMsg={"status":0,
                            "message1":"Connected",
                            "message2":" Internet Down",
                            "message3": IP_address,
                            "message4":connected_ssid
                            }
                        print(finalMsg)
                        return finalMsg
                    except Exception as e:
                        print(e)
                        #logging.error("Exception occurred %s", e)
            else:
                print("WLANSTATUS is OFF")
        except Exception as e:
            print("Exception raised %s",str(e))








#*******************


def checkStatusOff(msg):
    print("inside the makin status OFF function")
    status =True
    if status:
        if msg:
            #msg1=msg.decode()
            if msg.find("[WLANSTATUS]") >= 0:
                statusReturnedValue = statusFunctionProcess2(msg)
                return statusReturnedValue
            else:
                print("No [WLANSTATUS] present")
        else:
            print("Msg body not received")

def sendTocmdInExchange(message):
    #Send data to the Onyx Exchange
    # message to send to Exhange Queue for fanout
    try:
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
        #msg1=msg.decode()
        if msg.find("[WLANSTATUS]") >= 0:
            msg_body = readAndProcessInfo(msg)
            print(msg_body)
            return msg_body
        else:
            print("config file in not present at that location") 

@app.route(api.prefix + '/wifi/on', methods=['GET']) #API to fetch and pass the LIST of available SSIDs and Signal dBms to and from backend
def wifis():
    
    #send the ON command to the Command Exchange 
    # wifiListCommandPass = "[WLAN]ON\r\n"
    # sendTocmdInExchange(wifiListCommandPass)
    wifiON = "[WLAN]ON\r\n"
    # sendTocmdInExchange(wifiON)
    try:
        msg=[]
        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        # passing the ON command to the Exhange
        channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
        result = channel.queue_declare('',exclusive=True)
        queue_name = result.method.queue
        #wifiON = "[WLAN]ON\r\n"
        # sendTocmdInExchange(wifiListCommandPass)
        channel.queue_bind(exchange='onyxCmdOut',queue=queue_name) 
        wifiListCommandPass = "[WLAN]LIST"
        sendTocmdInExchange(wifiListCommandPass) # Passing the 
        generator = channel.consume(queue=queue_name)
        # return jsonify("done")
        for message_tuple in generator:
            try:
                if message_tuple is not None:  # None returned after inactivity timeout
                    method, properties, body = message_tuple
                    if method is not None and body is not None:
                        try:
                            body=body.decode()
                            print("body received",body)
                            # if body.find("[WLANSTATUS]OK") != -1:
                            #     continue
                            if body.find("[WLANSTATUS]") >= 0:
                                FinalValue = processBody(body)
                                print("FinalValue",FinalValue)
                                sendTocmdInExchange(wifiON)
                                time.sleep(1)
                                # resp = Response(json.dumps(FinalValue), status=200, mimetype=JSON_MIME_TYPE)
                                # resp.headers['Access-Control-Allow-Origin'] = '*'
                                # resp.headers['Access-Control-Allow-Credentials'] = True
                                # resp.headers['Access-Control-Allow-Origin']='*'
                                # resp.headers['Access-Control-Allow-Methods']= '*'
                                # resp.headers['Access-Control-Allow-Headers'] = '*'
                                # return resp
                                return jsonify(FinalValue)
                            else:
                                print("not found")
                        except Exception as e:
                            print(e)

            except Exception as e:
                print(e)
    except Exception :
        print("Error while handling the channel")

@app.route(api.prefix + '/wifi/cred', methods=['POST'])
def getCred():
    data1 = request.json
    if data1 is None:
        return 'Data is Empty'
    elif data1['ssid'] is None:
        return 'SSID is Missing'
    elif data1['pass'] is None:
        return 'Password is Missing'
    print("The {0} is SSID and {1} is the Password received".format(data1['ssid'],data1['pass']))
    credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
    channel = connection.channel()
    channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
    result = channel.queue_declare('',exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
    message="[WLAN]\r\n"
    sendTocmdInExchange(message)
    # processData = processCredential(data1)
    # sendTocmdInExchange(processData)
    # time.sleep(1)

    try:
        msg=[]
        #first confirm that WLAN is Connected or not by passing status command
        sendTocmdInExchange(message)
        generator = channel.consume(queue=queue_name,inactivity_timeout=60)
        for message_tuple in generator:
            if message_tuple is not None:  # None returned after inactivity timeout
                method, properties, body = message_tuple
                if method is not None and body is not None:
                    if body:
                        #global body1
                        body = body.decode()
                        print("body111111111",body)
                        #body1 = body
                        # list2=[]
                        # list2.append(body)
                        try:

                            if body.find("[WLANSTATUS]ON")>=0:

                                FinaValue2 = statusFunctionProcess1(body)
                                #FinalValue = body    
                                print("SSID received ",FinaValue2)
                                # ID= FinaValue2['message4']
                                # ID2= data1['ssid']

                                if(FinaValue2['message4'] == data1['ssid']):
                                    if FinaValue2["message1"]=="Connected":
                                        print("SSID saved matched to the passed SSID")
                                        expectedMsg = processCredential(data1)
                                        print("Expectedmsg",expectedMsg)
                                        sendTocmdInExchange(expectedMsg)
                                        time.sleep(1)
                                        return jsonify(FinaValue2)
                                    else:
                                        return jsonify("NOT CONNECTED")

                                    # return jsonify(FinaValue2)
                                else:
                                    try:
                                        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
                                        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
                                        channel = connection.channel()
                                        channel.exchange_declare(exchange='onyxCmdOut',
                                                                        exchange_type='fanout')
                                        result = channel.queue_declare('',exclusive=True)
                                        queue_name = result.method.queue
                                        sendTocmdInExchange(message)
                                        channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
                                        generator = channel.consume(queue=queue_name)
                                        for message_tuple in generator:
                                            if message_tuple is not None:  # None returned after inactivity timeout
                                                method, properties, body = message_tuple
                                                if method is not None and body is not None:
                                                    try:
                                                        if body:
                                                            global body1
                                                            body = body.decode()
                                                            #print("body111111111",body)
                                                            if body.find("[WLANSTATUS]ON")>=0:

                                                                FinaValue3 = statusFunctionProcess1(body)
                                                                print("SSID received ",FinaValue3)
                                                                expectedMsg = processCredential(data1)
                                                                print("Expectedmsg",expectedMsg)
                                                                sendTocmdInExchange(expectedMsg)
                                                                time.sleep(1)
                                                                return jsonify(FinaValue3)

                                                            else:
                                                                print("nothing received")
                                                        else:
                                                            print("body not received")
                                                    except Exception as e:
                                                        print(e)
                                    except Exception as e:
                                        print(e)
                                                

                                    # print(type(FinaValue2))
                                    # return jsonify(FinaValue2)
                            else:
                                print("NO [WLANSTATUS] and no IP address present")
                        except Exception as e:
                            print(e)                          
                        #print("FinalValue",FinalValue)
                        
    except Exception as e:
        print(e)   








@app.route(api.prefix + '/wifi/off', methods=['GET'])
def makeWlanOff():
    #when we switch off the toggle button from the front end we need to update as status off in the wlanconfig file by sending the '[WLAN]OFF\r\n' msg to the exchange 
    credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
    channel = connection.channel()
    wifiListCommandPass = "[WLAN]OFF\r\n"
    sendTocmdInExchange(wifiListCommandPass)
    channel.exchange_declare(exchange='onyxCmdOut',
                                exchange_type='fanout')
    result = channel.queue_declare('',exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
    wifiListCommandPass = "[WLAN]\r\n"
    sendTocmdInExchange(wifiListCommandPass)
    generator = channel.consume(queue=queue_name, inactivity_timeout=60)
    for message_tuple in generator:
        if message_tuple is not None:  # None returned after inactivity timeout
            method, properties, body = message_tuple
            if method is not None and body is not None:
                body = body.decode()
                if body.find("[WLANSTATUS]") >= 0:
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
                    except Exception as e:
                        print(e)
                else:
                    print("proper msg body has not consumed")


@app.route(api.prefix + '/logging', methods=['GET'])
def loggingStatus():
    try:

        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        # passing the ON command to the Exhange
        channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
        result = channel.queue_declare('',exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
        #send the '[SDLOG]\r\n' to commandInExchange 
        loggingStatusMsg = '[SDLOG]\r\n'
        sendTocmdInExchange1(loggingStatusMsg) # Passing the 
        generator = channel.consume(queue=queue_name)
        for message_tuple in generator:
            try:
                if message_tuple is not None:  # None returned after inactivity timeout
                    method, properties, body = message_tuple
                    if method is not None and body is not None:
                        try:
                            body=body.decode()
                            print("Received from the 'Logging' body",body)

                            if body.find("[SDCARDSTATUS]NOSDCARD") >=0:
                                global sdcardInserted 
                                sdcardInserted = "NOSDCARD"
                                finalMsg={"status":0,"data":[{'LOGGING':'OFF','SD_CARD':'NOT INSERTED','LOG_FILENAME':'','LOG_RATE':'','LOG_DURATION':'','LOG_FILE':''}],"message":""}
                                resp = Response(json.dumps(finalMsg), status=200, mimetype=JSON_MIME_TYPE)
                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                resp.headers['Access-Control-Allow-Credentials'] = True
                                resp.headers['Access-Control-Allow-Methods']= '*'
                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                return resp
                                #return jsonify(finalMsg)

                            
                            elif body.find("[SDCARDSTATUS]ON") >= 0:

                                returnloggingData = processOnLogging(body)

                                #It return [SDLOGSTATUS]ON/OFF,LOG RATE,LOG DURATION,LOG FILE
                                #[ON/OFF,LOG RATE,LOG DURATION,LOG FILE]
                                final_value = finalProcessedData(returnloggingData)
                                resp = Response(json.dumps(final_value), status=200, mimetype=JSON_MIME_TYPE)
                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                resp.headers['Access-Control-Allow-Credentials'] = True
                                resp.headers['Access-Control-Allow-Methods']= '*'
                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                return resp
                                # return final_value
                                
                            elif body.find("[SDCARDSTATUS]OFF") >= 0:
                                returnloggingData = processOnLogging(body)
                                final_value = finalProcessedData(returnloggingData)
                                resp = Response(json.dumps(final_value), status=200, mimetype=JSON_MIME_TYPE)
                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                resp.headers['Access-Control-Allow-Credentials'] = True
                                resp.headers['Access-Control-Allow-Methods']= '*'
                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                return resp
                                #return final_value

                            else:
                                print("message not received")
                        
                        except Exception as e:
                            print(e)
                                
            except Exception as e:
                print(e)
    except Exception :
        print("Error while handling the channel")

@app.route(api.prefix + '/logging/memory', methods=['GET'])
def loggingMemory():
    try:

        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        # passing the ON command to the Exhange
        channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
        result = channel.queue_declare('',exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
        #send the '[SDLOG]\r\n' to commandInExchange 
        loggingStatusMsg = '[SDLOG]SPACE\r\n'
        sendTocmdInExchange(loggingStatusMsg) # Passing the 
        generator = channel.consume(queue=queue_name)
        for message_tuple in generator:
            try:
                if message_tuple is not None:  # None returned after inactivity timeout
                    method, properties, body = message_tuple
                    if method is not None and body is not None:
                        try:
                            body=body.decode()
                            print("Received from the 'Logging' body",body)

                            if body.find("[SDCARDSTATUS]") >=0 and body.find("29G"):
                                receivedSpaceData = processOnLogging(body)
                                Final_Value_space = processSpaceData(receivedSpaceData)
                                resp = Response(json.dumps(Final_Value_space), status=200, mimetype=JSON_MIME_TYPE)
                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                resp.headers['Access-Control-Allow-Credentials'] = True
                                resp.headers['Access-Control-Allow-Methods']= '*'
                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                return resp
                                #return jsonify(Final_Value_space)
                            else:
                                print("Memory data not received")
                        except Exception as e:
                            print(e)
            except Exception as e:
                print(e)
    except Exception as e:
        print(e)
@app.route(api.prefix + '/logging/loglist', methods=['GET'])
def logList():
    try:
        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        # passing the ON command to the Exhange
        channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
        result = channel.queue_declare('',exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
        #send the '[SDLOG]\r\n' to commandInExchange 
        loggingStatusMsg = '[SDLOG]LIST\r\n'
        sendTocmdInExchange(loggingStatusMsg) # Passing the 
        generator = channel.consume(queue=queue_name)
        arr = os.listdir('/mnt/usbdrive/')
        print("arr",arr)
        for message_tuple in generator:
            try:
                if message_tuple is not None:  # None returned after inactivity timeout
                    method, properties, body = message_tuple
                    if method is not None and body is not None:
                        try:
                            body=body.decode()
                            if body.find("[SDCARDSTATUS]") >=0:
                                Logslist = arr
                                #arr = os.listdir('/mnt/usbdrive/')
                                # cmd = 'sudo ls /mnt/usbdrive/'
                                # ps = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                                # Logslist = ps.communicate()[0]
                                # print("list",Logslist)
                                # return jsonify(Lo)

                                resp = Response(json.dumps(Logslist), status=200, mimetype=JSON_MIME_TYPE)
                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                resp.headers['Access-Control-Allow-Credentials'] = True
                                resp.headers['Access-Control-Allow-Methods']= '*'
                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                return resp
                            else:
                                print("SDCARD status not found")
                        except Exception as e:
                            print(e)
            except Exception as e:
                print(e)
    except Exception as e:
        print(e)

# validate the log file name
@app.route(api.prefix + '/logging/logfile', methods=['POST'])
def logFile():
    try:
        FileHeading=''
        #global FileHeading
        logFileName=request.json
        FileName = logFileName["logFile"]
        print("FileName",FileName)
        if FileName.lower().endswith(('.txt')) or FileName.lower().endswith(('.dat')):
            
            FileHeading = FileName.split(".")[0]
            print("FileHeading",FileHeading)
            try:
                credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
                connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
                channel = connection.channel()
                # passing the ON command to the Exhange
                channel.exchange_declare(exchange='onyxCmdOut',
                                            exchange_type='fanout')
                result = channel.queue_declare('',exclusive=True)
                queue_name = result.method.queue
                channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
                #send the '[SDLOG]\r\n' to commandInExchange 
                loggingStatusMsg = '[SDLOG]LIST\r\n'
                sendTocmdInExchange(loggingStatusMsg) # Passing the 
                generator = channel.consume(queue=queue_name)
                for message_tuple in generator:
                    try:
                        if message_tuple is not None:  # None returned after inactivity timeout
                            method, properties, body = message_tuple
                            if method is not None and body is not None:
                                try:
                                    body=body.decode()
                                    if True:
                                        #receivedSpaceData = processOnLogging(body)
                                        listOfLogs = os.listdir('/mnt/usbdrive/')
                                        if type(listOfLogs) == list:
                                            if FileName in listOfLogs:
                                                finalMessage = {'message':'Log file already exists','status':0}
                                                resp = Response(json.dumps(finalMessage), status=200, mimetype=JSON_MIME_TYPE)
                                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                                resp.headers['Access-Control-Allow-Credentials'] = True
                                                resp.headers['Access-Control-Allow-Methods']= '*'
                                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                                return resp
                                                #return jsonify(finalMessage)
                                            else:
                                                finalMessage = {'message':'Can procced','status':1}
                                                resp = Response(json.dumps(finalMessage), status=200, mimetype=JSON_MIME_TYPE)
                                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                                resp.headers['Access-Control-Allow-Credentials'] = True
                                                resp.headers['Access-Control-Allow-Methods']= '*'
                                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                                return resp
                                                #return jsonify(finalMessage)
                                        else:
                                            print("Received data type is not LIST")
                                    else:
                                        print("[SDCARDSTATUS] not found")
                                except Exception as e:
                                    print(e)
                    except Exception as e:
                        print(e)
            except Exception as e:
                print(e)
    except Exception as e:
        print(e)


#*****************Logging Start API**********************************

@app.route(api.prefix + '/logging/logstart', methods=['POST'])
def loggingStart():
    #message4 = '[SDLOG]START,1,NAVCOM,1,log3.txt\r\n'
    # msg={"LOG_RATE":1,"TYPE":"NMEA","LOG_DURATION":1,"LOG_FILE":"log4.txt\r\n"}
    dataReceived = request.json
    if dataReceived is None:
        return 'Logging data received is Empty'
    elif dataReceived['LOG_RATE'] is None:
        return 'LOG_RATE is Missing'
    elif dataReceived['TYPE'] is None:
        return 'Logging TYPE is Missing'
    elif dataReceived['LOG_DURATION'] is None:
        return 'LOG_DURATION is Missing'
    elif dataReceived['LOG_FILE'] is None:
        return 'LOG_FILE is missing'
    print("The {0} is Log Rate, {1} is the Log Type,{2} is the Log duration and {3} is the Log file received".format(dataReceived['LOG_RATE'],dataReceived['TYPE'],dataReceived['LOG_DURATION'],dataReceived['LOG_FILE']))
    dataToStartLogging, ListOfLoggingData = processCredentialLog(dataReceived)
    print("type to the dataTOStartLogging", type(dataToStartLogging))
    print("type to the dataTOStartLogging", type(ListOfLoggingData))

    print("We received the data to start the logging process", dataToStartLogging)
    list4 = [s.replace("\r\n",'') for s in ListOfLoggingData]

    ReceivedLogFileName = list4[4]
    print("ReceivedLogFileName######################", ReceivedLogFileName)

    try:
        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        # passing the ON command to the Exhange
        channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
        result = channel.queue_declare('',exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
        #first confirm that WLAN is Connected or not by passing status command
        sendTocmdInExchange(dataToStartLogging) # we are passing the data to the OnyxCmdIn exchange 
        generator = channel.consume(queue=queue_name,inactivity_timeout=60)
        for message_tuple in generator:
            if message_tuple is not None:  # None returned after inactivity timeout
                method, properties, body = message_tuple
                if method is not None and body is not None:
                    if body:
                        body = body.decode()
                        print("Body received inside the logStart function", body)
                        try:

                            if body.find("[SDLOGSTATUS]")>=0:
                                print("Successfully started the logging")
                                final_message={
                                    "LOG_FILE" : ReceivedLogFileName,
                                    "LOGGING_DURATION" : dataReceived['LOG_DURATION'],
                                    "message" : "Successfully started the Logging process"
                                }
                                resp = Response(json.dumps(final_message), status=200, mimetype=JSON_MIME_TYPE)
                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                resp.headers['Access-Control-Allow-Credentials'] = True
                                resp.headers['Access-Control-Allow-Methods']= '*'
                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                return resp
                            else:
                                print("Not yet started logging")
                        except Exception as e:
                            print(e)
                    else:
                        print("Data not received from the cmdOutExchange")
    except Exception as e:
        print(e)



@app.route(api.prefix + '/logging/logstop',methods=['GET'])
def logStop():
    try:

        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        # passing the ON command to the Exhange
        channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
        result = channel.queue_declare('',exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
        
        #first confirm that WLAN is Connected or not by passing status command
        sendTocmdInExchange('[SDLOG]STOP]\r\n') # we are passing the data to the OnyxCmdIn exchange 
        generator = channel.consume(queue=queue_name,inactivity_timeout=60)
        for message_tuple in generator:
            if message_tuple is not None:  # None returned after inactivity timeout
                method, properties, body = message_tuple
                if method is not None and body is not None:
                    if body:
                        body = body.decode()
                        print("Body received inside the logStart function", body)
                        try:

                            if body.find("[SDLOGSTATUS]OK")>=0:
                                print("Successfully started the logging")
                                final_message={
                                    "message" : "Successfully stopped the Logging process"
                                }
                                resp = Response(json.dumps(final_message), status=200, mimetype=JSON_MIME_TYPE)
                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                resp.headers['Access-Control-Allow-Credentials'] = True
                                resp.headers['Access-Control-Allow-Methods']= '*'
                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                return resp
                            else:
                                print("Not yet started logging")
                        except Exception as e:
                            print(e)
                    else:
                        print("Data not received from the cmdOutExchange")
    except Exception as e:
        print(e)



@app.route(api.prefix + '/logging/logDelete',methods=['POST'])

def logDelete():
    receivedFile = request.json
    print(receivedFile['logFile'])
    # Received the selected log file name to be deleted
    logFileName = receivedFile['logFile']
    if logFileName is None:
        return 'No Logging file received'
    print("Logging file {} received".format(logFileName))
    listResponse=[]
    listOfLogFiles = os.listdir('/mnt/usbdrive/')
    print("list",listOfLogFiles)
    try:
        path1 = "/mnt/usbdrive/"
        for x in listOfLogFiles:
            if logFileName in  listOfLogFiles:
                print("logFile name",logFileName)
                my_file = "/mnt/usbdrive/"+ logFileName
                if os.path.exists(my_file):
                    os.remove(my_file)
                    print("removed file")
                    final_message={"message" : "Successfully removed " }
                    resp = Response(json.dumps(final_message), status=200, mimetype=JSON_MIME_TYPE)
                    resp.headers['Access-Control-Allow-Origin'] = '*'
                    resp.headers['Access-Control-Allow-Credentials'] = True
                    resp.headers['Access-Control-Allow-Methods']= '*'
                    resp.headers['Access-Control-Allow-Headers'] = '*'
                    return resp 
            else:

                final_message={"message" : "Unable to removed "}
                return jsonify(final_message)
    except Exception as e:
        print(e)


@app.route(api.prefix + '/logging/logDownload', methods=['POST'])
def logDownload():
    filename = request.json
    filename1 = filename["logFile"]
    print("received file",filename1)
    path = "/mnt/usbdrive/"
    fileNamePath ={}
    try:
        for root, dirs, files in os.walk(path):
            for fname in files:
                print(files)
                try:

                    if fname == filename1:
                        fileNamePath['Filename'] = filename1
                        fileNamePath['path'] = path+'/'+filename1

                        print ('filenamepath',fileNamePath)
                        # file_data = codecs.open(fileNamePath['path'], 'rb').read()
                        # response = make_response()
                        # response.headers['my-custom-header'] = 'my-custom-status-0'
                        # response.data = file_data
                        #return response
                        path1 = send_file(fileNamePath['path'])
                        print("received path",path1)

                        #return send_from_directory(directory=path, filename=filename1)
                        rv = send_file(fileNamePath['path'],mimetype="text/plane",as_attachment=True)
                        filenames = OrderedDict()
                        #print("#####",filenames)
                        from pathlib import Path
                        contents = Path(fileNamePath['path']).read_text()
                        try:
                            filename = filename1.encode('latin-1')
                        except UnicodeEncodeError:
                            filenames['filename'] = unicodedata.normalize('NFKD', filename).encode('latin-1', 'ignore')
                            filenames['filename*']: "UTF-8''{}".format(url_quote(filename))
                        else:
                            filenames['filename'] = filename

                        rv.headers.set('Content-Disposition', dump_options_header('attachment', filenames))
                        return rv



                    else:
                        print("file not present")
                except Exception as e:
                    print(e)
    except Exception as e:
        print(e)

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





# to activate my Onyx Starfire license in the front end
# to activate my Onyx Options in the front end
# to check my Onyx Starfire License Status
# to check my Onyx Options Status
# this license and option information to be queried and updated once when i navigate to this menu


#step 1) Activate the Sf license in the front end 
def checkOnyxLicenseStatus():
    # to check the status of the onyx starfire license
    # [OUTPUT]SFLICENSEB,ONCE
    return '[OUTPUT]SFLICENSEB,ONCE'


def checkOnyxOptionStatus(msg):
    #check the Onyx option status
    # [INPUTSWOPTION]
    msg=msg.decode()
    fileavailable=True
    if fileavailable:
        list1 = msg.split(',')
        list3=[]
        print(list1)
        if list1[-1] == '\r\n':
            list3=list1[:-1]
        if list3:
            list4 = [s.replace("[SFLICENSEB]",'') for s in list3]
            print("list4",list4)
            d = dict([(k,v) for k,v in zip(list4[::2],list4[1::2])])
            return d


def activateOnyxlicense():
    #activate the lincese by sending the  [INPUTSFLICENSE] 4A2A6C82-F2EB1CEE-8D682E3C-95B83A16 to the ExchangeIN
    # with [INPUTSFLICENSE] header
    pass


    
    
    
    

def processLicense(licenseData):
    pass
    # with header as [INPUTSFLICENSE]

@app.route(api.prefix + '/licenses/optionActivate', methods=['GET'])
def optionActivate():
    pass


@app.route(api.prefix + '/licenses/licenseActivate', methods=['POST'])
def licenseActivate():
    pass
    

@app.route(api.prefix + '/licenses/optionStatus', methods=['GET'])
def optionStatus():
    #send the command In sendTocmdInExchange1

    sendTocmdInExchange1('[OUTPUT]SFLICENSEB,ONCE\r\n')
    try:
        credentials = pika.credentials.PlainCredentials('guest', 'guest', erase_on_connect=False)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='10.8.1.170', port=5672, credentials=credentials,socket_timeout=2))
        channel = connection.channel()
        # passing the ON command to the Exhange
        channel.exchange_declare(exchange='onyxCmdOut',
                                    exchange_type='fanout')
        result = channel.queue_declare('',exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange='onyxCmdOut',queue=queue_name)
        sendTocmdInExchange1('[OUTPUT]SFLICENSEB,ONCE\r\n')
        generator = channel.consume(queue=queue_name,inactivity_timeout=60)
        for message_tuple in generator:
            if message_tuple is not None:  # None returned after inactivity timeout
                method, properties, body = message_tuple
                if method is not None and body is not None:
                    if body:
                        body = body.decode()
                        print("Body received inside the logStart function", body)
                        try:

                            if body.find(b"[SFLICENSEB]")>=0:
                                receivedOptionData = checkOnyxOptionStatus(body)
                                resp = Response(json.dumps(receivedOptionData), status=200, mimetype=JSON_MIME_TYPE)
                                resp.headers['Access-Control-Allow-Origin'] = '*'
                                resp.headers['Access-Control-Allow-Credentials'] = True
                                resp.headers['Access-Control-Allow-Methods']= '*'
                                resp.headers['Access-Control-Allow-Headers'] = '*'
                                return resp
                            else:
                                print("Unable to find the [INPUTSWOPTION] in the OnyxCmd Out Exchange")
                        except Exception as e:
                            print(e)
                    else:
                        print("body does not contain anything")
                else:
                    print("None has received inside the body")
    except Exception as e:
        print(e)

                        






@app.route(api.prefix + '/licenses/licenseStatus', methods=['GET'])
def licenseStatus():
    pass


@app.route(api.prefix + '/licenses', methods=['GET'])

def licenses():
    pass
    # pass the license information to the ExchangeIN 







if __name__ == "__main__":
    app.run(host='0.0.0.0',port=6060, debug=True)

