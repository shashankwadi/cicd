import {setLoginToken} from 'Wadi/src/utilities/sharedPreferences';

export const webViewFetchAPI = (params) => {
    return new Promise((resolve, reject) => {
        let {url, headers, dataObj, methodType} = params;
        let obj = {};
        if (methodType === 'GET') {
            obj = {
                method: !!methodType ? methodType : 'GET',
                headers: !!headers ? headers : {},
            }
        }
        else {
            obj = {
                method: !!methodType ? methodType : 'GET',
                headers: !!headers ? headers : {},
                body: !!dataObj ? JSON.stringify(dataObj) : ""
            }
        }

        try {
            fetch(url, obj)
                .then(response => {
                    let token = null;
                    if(!!response && !!response.headers && !!response.headers.get('set-cookie')){
                        token = _extractToken(response.headers.get('set-cookie'));
                        if(!!token)
                            setLoginToken(token); //save token in native storage

                    }
                    let data = JSON.parse(response._bodyText);
                    if(!!token){
                        data['cookie'] = token
                    }
                    resolve({code: 200, response: data, message: "Api Fetch Success", methodType: methodType});
                })
                .catch(error => {
                    // do nothing
                    reject({code: 500, message: `Error catch while API, error = ${JSON.stringify(error)}`, methodType: methodType});
                });
        }
        catch (error) {
            reject({code: 500, message: `Error while API try, error = ${JSON.stringify(error)}`, methodType: methodType})
        }
    })

};

const _extractToken = (headerCookie) => {
    if(typeof headerCookie === "string"){
        return _extractCookieFromString(headerCookie);
    }else{
        for(let index in headerCookie){
           let token = _extractCookieFromString(headerCookie[index]);
           if(token){
               return token
            };
        }
    }
};

const _extractCookieFromString = (headerCookie) => {
    if(headerCookie.includes('identity')){
       let cookiesArray = headerCookie.split(";");
       for(let index in cookiesArray){
            let value = cookiesArray[index]
            if(value.includes("identity")){
                let finalArray = value.split("=");
                return finalArray[1];
            }
       }
    }
    return "";
}
