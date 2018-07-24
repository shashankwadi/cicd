/***
 * @Author: Akhil Choudhary
 * @Date: 2018-1-18
 *
 */

import Types from './actionTypes';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import ApiHandler from '../utilities/ApiHandler';

const BASE_URL_TYPE = "MYWADI";

var client = new ApiHandler();

export const getWalletSummary = (cookie) => {

    let url = GLOBAL.API_URL.Wadi_Wallet_Summary;
    var headers = {'cookie': cookie};

    return new Promise((resolve, reject) => {
        client.getRequest(url, headers, BASE_URL_TYPE)
            .then(response => {
                /* let data = (response.data && response.data.data) ? response.data.data : {};
                 if (response.status === 200) {
                     resolve({status: 200, sku: data.sku,data:data})
                 }
                 else
                     resolve({status: 403})

 */
              //  console.log("response is:", response);
                resolve(response.data)
            }).catch(error => {
            reject({status: 403});
        });
    });

}

export const getUpComingPoints = (cookie) => {
    let url = GLOBAL.API_URL.Wadi_Wallet_Upcoming_Points;
    var headers = {'cookie': cookie};
    return new Promise((resolve, reject) => {
        client.getRequest(url, headers, BASE_URL_TYPE).then(
            response => {
              //  console.log("upcoming points are:", response);
                resolve(response.data)

            }
        ).catch(error => {
            reject({status: 403})
        })
    })


}

export const getTransactions = (cookie, page) => {
    let url = GLOBAL.API_URL.Wadi_Wallet_Transactions + '?page=' + page;
    var headers = {'cookie': cookie};

    return new Promise((resolve, reject) => {
        client.getRequest(url, headers, BASE_URL_TYPE).then(
            response => {
                // console.log("transactions are:", response);
                resolve(response.data)

            }
        ).catch(error => {
            reject({status: 403})
        })
    })


}

export const applyCouponCode = (cookie, coupon) => {
    let url = GLOBAL.API_URL.Wadi_Wallet_Redeem_Coupon;
    var headers = {'cookie': cookie};
    var param = {code: coupon}
    return new Promise((resolve, reject) => {
        client.postRequest(url, param, headers, BASE_URL_TYPE).then(
            response => {
                // console.log("coupon applied response:", response);
                resolve(response.data)

            }
        ).catch(error => {
            reject({status: 403})
        })
    })


}
