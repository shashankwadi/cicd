import {experiment, fallbackActionDispatcher} from "../reducers/store";
import Actions from './actionTypes';
import {fetchUserDataStorage} from "./accountActions";
import {getUserSelectedCountryFromStorage, _setSelectedLanguage} from "./configAPIActions";


export var fallBackActions = (function () {

    // Instance stores a reference to the Singleton
    var instance;


    function init() {
        return {
            setDeviceInfo: function (deviceInfo) {
                fallbackActionDispatcher({
                    type: Actions.SET_DEVICE_INFO,
                    payload: deviceInfo
                })


            },
            fetchUserData: function () {
                fallbackActionDispatcher(fetchUserDataStorage)

            },
            getUserSelectedCountry: function () {
                fallbackActionDispatcher(getUserSelectedCountryFromStorage)
            },
            setSelectedLanguage: function (response) {
                fallbackActionDispatcher(_setSelectedLanguage(response))

            }

        };

    };

    return {

        getInstance: function () {

            if (!instance) {
                instance = init();
            }

            return instance;
        }

    };

})();

