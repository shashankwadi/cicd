import Types from './actionTypes';

export const fetchReviewData = (sku) => {

    return dispatch => {

        return new Promise((resolve, reject) => {

            fetch(`https://d1le22hyhj2ui8.cloudfront.net/onpage/wadi.com/reviews.json?key=${sku}`)
                .then((response) => response.json())
                .then((responseJson) => {
                    // console.log('reviews are from api:::', responseJson)
                    dispatch({
                        type: Types.FETCHED_RATING_REVIEWS,
                        payload: responseJson
                    })
                    resolve(responseJson)
                })
                .catch((error) => {
                    reject(error)
                });

        })
    }

}


export const fetchDataFromUrl = (url) => {

    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                resolve(responseJson)
            })
            .catch((error) => {
                reject(error)
            });

    })
}

