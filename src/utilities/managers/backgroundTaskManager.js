'use strict';

import { AsyncStorage, NativeModules, Platform } from 'react-native'
//import BackgroundTask from 'react-native-background-task'
import RNFetchBlob from "react-native-fetch-blob";
import { unzip } from 'react-native-zip-archive'
import ApiHandler from "utilities/ApiHandler";
import UserHandler from "utilities/managers/userHandler";
import * as GLOBAL from 'utilities/constants';

const zipBridge = NativeModules.RNZipArchive;

var client = new ApiHandler();
let dirs = RNFetchBlob.fs.dirs;

export const currentTimeStamp = () => {
    let date = new Date();
    return date.toLocaleString();
};


export const checkAndStartBundleUpdate = async (progress) => {
    try {
        let bundleUpdates = await checkForBundleUpdate();
        let currentChecksum = await UserHandler.getCurrentDoodleBundleChecksum();
        if (bundleUpdates) {
            if(bundleUpdates === "NETWORK_ERROR"){
                return "NETWORK_ERROR";
            }else if(currentChecksum !== bundleUpdates){
                return await fetchDoodleBundle(bundleUpdates, progress);
            }
        }else {
            return "BUNDLE_UPDATES_FAILED";
        }
    } catch (error) {
        return false;
    }
};

export const checkForBundleUpdate = () => {
    return new Promise((resolve, reject) => {
        client.headRequest(GLOBAL.API_URL.Wadi_DoodleBundleUrl, {}, {}, 'WadiS3')
            .then((response) => {
                if (response.status === 200 && response.headers && response.headers.etag) {
                    resolve(response.headers.etag);
                } else {
                    resolve((response.problem)?response.problem:null);
                }
            })
            .catch((error) => {
                reject(null);
            });
    });
};

export const fetchDoodleBundle = async (checksum, progress) => {
    try {
        if (Platform.OS === "ios") {
            return await _fetchDoodleBundleIos(checksum, progress);
        } else {
            return await _fetchDoodleBundleAndroid(checksum, progress);
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

//android
const _fetchDoodleBundleAndroid = (checksum, progress) => {
    return new Promise((resolve, reject) => {
        RNFetchBlob
            .config({
                // add this option that makes response data to be stored as a file,
                // this is much more performant.
                fileCache: true,
                appendExt: 'zip'
            })
            .fetch('GET', GLOBAL.API_URL.WadiS3 + GLOBAL.API_URL.Wadi_DoodleBundleUrl, {
                //some headers ..
            })
            .progress((received, total) => {
                progress(received / total)
            })
            .then((res) => {

                // the temp file path
                const sourcePath = res.path(); //res.path();
                const targetPath = dirs.DocumentDir + "/doodle/";
                unzip(sourcePath, targetPath)
                    .then((path) => {
                        RNFetchBlob.fs.unlink(sourcePath)
                            .then((res) => {

                            }).catch((error) => {

                            });
                        UserHandler.setDoodleBundleChecksum(checksum)
                            .then(() => {
                                UserHandler.setBundleUpdateStatus(true);
                                resolve(true);
                            });
                        resolve(true);
                    })
                    .catch((error) => {
                        reject(false);
                    });
            })
            .catch((error) => {
                reject(false);
            });
    });
};

//ios
const _fetchDoodleBundleIos = (checksum, progress) => {
    return new Promise((resolve, reject) => {
        RNFetchBlob
            .config({
                fileCache: true,
                appendExt: 'zip'
            })
            .fetch('GET', GLOBAL.API_URL.WadiS3 + GLOBAL.API_URL.Wadi_DoodleBundleUrl, {})
            .progress((received, total) => {
                console.log('first launch download progress'- received / total);
                progress(received / total);
            })
            .then((res) => {

                RNFetchBlob.fs.unlink(dirs.DocumentDir + '/doodle').then((result) => {
                    _unzip(checksum, res).then((data)=>{
                        resolve(data);
                    });
                }).catch((error) => {
                    _unzip(checksum, res).then((data)=>{
                        resolve(data);
                    });
                });

            })
            .catch((error) => {
                reject(false);
            });
    });
};

const _unzip = (checksum, res) => {
    const sourcePath = res.path();
    const targetPath = dirs.DocumentDir + '/doodle';
    return new Promise((resolve, reject)=>{
        zipBridge.unzip(sourcePath, targetPath)
            .then((path) =>  {return UserHandler.setDoodleBundleChecksum(checksum)})
            .then(()=>{return UserHandler.setBundleUpdateStatus(true)})
            .then(()=>{return resolve(true)})
            .then(()=> {return RNFetchBlob.fs.unlink(dirs.DocumentDir + '/RNFetchBlob_tmp')})
            .then((res)=>{return resolve(true)})
            .catch((error) =>{return reject(false)})
    });
}


