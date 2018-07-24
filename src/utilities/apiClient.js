'use strict'

import React  from 'react';

import {
	Platform,
	I18nManager
} from 'react-native';

import * as GLOBAL from 'Wadi/src/utilities/constants';

const env = GLOBAL.ENUM.EnvironmentType.Staging;

function ApiClient() {
	this.isWadi = true;
	let _this = this;

	this.GET = function(url:string, headers: Object) {

		_this.baseUrl = _this.isWadi ? _getBaseUrl() : '';
		var requestUrl = _this.baseUrl + url;

		var requestHeaders = _addCommonHeaders(headers)
		return new Promise(function (resolve, reject) {
			fetch(requestUrl, {
				method : 'GET',
				headers : headers
			})
			.then((response) => response.json())
			.then((responseData) => {
					resolve(responseData);
			})
			.catch((error) => {
				reject(error);
			})
			.done();
		});
	};

	this.DELETE = function(url:string, headers: Object) {
		_this.baseUrl = _this.isWadi ? _getBaseUrl() : '';
		var requestUrl = _this.baseUrl + url;

		var requestHeaders = _addCommonHeaders(headers);

		return new Promise(function (resolve, reject) {
			fetch(requestUrl, {
				method : 'DELETE',
				headers : headers
			})
			.then((response) => {

			if (response.status == 204) {
				resolve(true);
			} else {
				resolve(false);
			}
			})
			.catch((error) => {
				
				reject(error);
			})
			.done();
		});
	};

	this.PUT = function(url:string, headers: Object, body:Object) {
		_this.baseUrl = _this.isWadi ? _getBaseUrl() : '';
		var requestUrl = _this.baseUrl + url;
		var requestHeaders = _addCommonHeaders(headers);

		return new Promise(function (resolve, reject) {
			fetch(requestUrl, {
				method : 'PUT',
				headers : headers,
				body : JSON.stringify(requestBody),
			})
			.then((response) => response.json())
			.then((responseData) => {
					resolve(responseData);
			})
			.catch((error) => {
				reject(error);
			})
			.done();
		});
	};

	this.POST = function(url:string, headers: Object, body:Object) {
		_this.baseUrl = _this.isWadi ? _getBaseUrl() : '';
		var requestUrl = _this.baseUrl + url;
		var requestHeaders = _addCommonHeaders(headers);
		var requestBody = body;

		return new Promise(function (resolve, reject) {
			fetch(requestUrl, {
				method : 'POST',
				headers :requestHeaders,
				body : JSON.stringify(requestBody),
			})
			.then((response) => response.json())
			.then((responseData) => {
				resolve(responseData)
			})
			.catch((error) => {
				reject(error);
			})
			.done();
		});
	};

	this.PATCH = function(url:string, headers: Object, body:Object) {
		_this.baseUrl = _this.isWadi ? _getBaseUrl() : '';
		var requestUrl = _this.baseUrl + url;
		var requestHeaders = _addCommonHeaders(headers);
		var requestBody = body;

		return new Promise(function (resolve, reject) {
			fetch(requestUrl, {
				method : 'PATCH',
				headers :requestHeaders,
				body : JSON.stringify(requestBody),
			})
			.then((response) => response.json())
			.then((responseData) => {
				resolve(responseData)
			})
			.catch((error) => {
				reject(error);
			})
			.done();
		});
	};

}

var _addCommonHeaders = function (requestHeaders) {

	var language;
    if (I18nManager.isRTL == true) {
      language = "ar"
    } else {
      language = "en"
    }
	var appendedHeaders = {"language": language};
	if (requestHeaders) {
		appendedHeaders = requestHeaders;
	}

	appendedHeaders[GLOBAL.API_REQUEST_KEYS.CONTENT_TYPE] = 'application/json';

	//Platform Specific headers
	if (Platform.OS === 'ios') {

	}
	else {

	}
	return appendedHeaders;
}

var _getBaseUrl = function() {
	if (env === GLOBAL.ENUM.EnvironmentType.Production) {
		return GLOBAL.API_URL.WadiBaseURLProd;
	}
	return GLOBAL.API_URL.WadiBaseURLStaging;
}

module.exports = ApiClient;
