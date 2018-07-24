import {listenerHandler} from "./listener";

function WebViewUtils() {

    this.listener = (event, webViewRef, callback, updateLocalState) => {
        listenerHandler(event, webViewRef,callback, updateLocalState)
            .then((response) => {
                let data = !!response ? response.data : {},
                    speakerActionType = !!response ? response.speakerActionType : '';
                if (!!response && !!data && !!speakerActionType)
                    this.speaker(data, speakerActionType, webViewRef);
            });
    };


    this.speaker = (data, speakerActionType, webViewRef) => {
        webViewRef.postMessage(JSON.stringify({data: data, speakerActionType: speakerActionType}), '*');
    };

}

export const WebViewHandler = new WebViewUtils();

