export var api = {   
    // node wifi api 
    GET_WIFI_LIST: 'v1/wifi/on',
    OFF_WIFI: 'v1/wifi/off',
    LOGIN_WITH_WIFI: 'v1/wifi/connect',

    //flask api's
    logging_status: 'logging',
    memory_status: 'logging/memory',
    log_file_exist: 'logging/logfile',
    log_list: 'logging/loglist',
    log_download_log_file: 'logging/logDownload',
    log_file_delete: 'logging/logDelete',
    start_api_call:'logging/logstart',
    stop_api_call:'logging/logstop',

    //licenses api 
    //     licenses_option_status:'licenses/optionStatus',
    license_status: 'licenses/licenseStatus1',
    option_status: 'licenses/optionStatusNew',
    post_option_status:'licenses/optionStatus1',
    license_active: 'licenses/licenseActive1',
    about_list:'aboutDevice',

}



