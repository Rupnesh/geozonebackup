import os
import subprocess


def returnLogFileNames():
    # receivedFileName = fileName
    response= []
    arr = os.listdir('/mnt/usbdrive/')
    print (arr)
    if arr:
        cmd = 'sudo ls /mnt/usbdrive/'
        ps = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        cmdoutput = ps.communicate()[0]

        response=(arr)
        return response
             

xyz=returnLogFileNames()
print(xyz)

# #             response.append(x)
# #     return response

# #arr = os.listdir('/mnt/usbdrive')
# #['log1.dat', 'somefile.txt', 'log2.dat', 'log3.txt', 'loga.dat', 'System Volume Information']

 



# def logDownload():
#     ReceivedData1 = {"FileName":"log6.txt"}
#     receivedFile = ReceivedData1["FileName"]
#     if receivedFile is None:
#         return "Received No FileName from the frontEnd"
#     print("The {0} is Received File".format(ReceivedData1["FileName"])
#     try:

#         if receivedFile:
#             receivedDataFromFunction = returnLogFileNames(receivedFile)
#             path1 = receivedDataFromFunction[1]
#             fileName1 = receivedDataFromFunction[0]
#             if fileName1 == receivedFile:
#                 print("received the proper data")
#                 message1 = {
#                     "FILE_NAME":fileName1
#                     "FILE_PATH":path1
#                 }
#                 return (message1)
#             else:
#                 print("Received file name not matched with passed file name")
#         else:
#             print("File not received")
#     except Exception as e:
#         print(e)

# if __name__ == '__main__':
#     #final_msg=logDownload()
#    # print(final_msg)
#     #def logDownload():
#     ReceivedData1 = {"FileName":"log6.txt"}
#     receivedFile = ReceivedData1["FileName"]
#     if receivedFile is None:
#         print("Received No FileName from the frontEnd")
#     print("The {0} is Received File".format(ReceivedData1["FileName"]))
#     if receivedFile >=0:
#         receivedDataFromFunction = returnLogFileNames(receivedFile)
#         path1 = receivedDataFromFunction[1]
#         fileName1 = receivedDataFromFunction[0]
#         if fileName1 == receivedFile:
#             print("received the proper data")
#             message1 = {
#                 "FILE_NAME":fileName1,
#                 "FILE_PATH":path1
#             }
#             print(message1)
#         else:
#             print("Received file name not matched with passed file name")
#     else:
#         print("File not received")
    