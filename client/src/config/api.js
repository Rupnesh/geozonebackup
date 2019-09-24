export var api = {   
    // node wifi api 
    getWifiOn: 'wifi/on',
    OFF_WIFI: 'wifi/off',
    LOGIN_WITH_WIFI: 'wifi/cred',
    LOGIN_WITH_WIFI_CRED_STATUS: 'wifi/status_cred',

    //flask api's
    login: 'login',
    logging_status: 'logging',
    memory_status: 'logging/memory',
    log_file_exist: 'logging/logfile',
    log_list: 'logging/loglist',
    log_download_log_file: 'logging/logDownload',
    log_file_delete: 'logging/logDelete',
    start_api_call:'logging/logstart',
    stop_api_call:'logging/logstop',

    GSMstatus:'GSMstatus',

    //licenses api 
    //     licenses_option_status:'licenses/optionStatus',
    license_status: 'licenses/licenseStatus1',
    option_status: 'licenses/optionStatusNew',
    post_option_status:'licenses/optionStatus1',
    license_active: 'licenses/licenseActive1',
    about_list:'aboutDevice',
    hardware_about:'aboutDeviceHardware',
    batteryStatus:'aboutBattery',
    sdCardEject:'ejectSD',
    checkUpdate:'firmware/checkstatus',
    updateSoftware:'/firmware/updateSoftware',
    wifiStatus:'wifi/status',
    wifiList:'wifi/list',

    wifiListOnToogle: 'wifi/on_toggle',

    //Onyx firmware
    checkBandwidth: 'checkBandwidth',
    onyxUpdateAvailable: 'onyxUpdateAvailable',
    onyxUpdate: 'onyxUpdate',

    //Superpole
    captureSuperpole: 'SuperPoleTest',
    GGAMsgRate: 'GGAMsgRate',
    GGAMsgNumber: 'GGAMsgNumber'



}



