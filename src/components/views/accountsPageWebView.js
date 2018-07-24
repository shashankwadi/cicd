import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    TextInput,
    View,
    ActivityIndicator,
    ListView,
    TouchableOpacity,
    WebView,
    Alert,
    Cookie,
    Text,
    Image,
    Platform
} from 'react-native';

import {connect} from 'react-redux';
import {dimensions} from 'utilities/utilities';
import {addCommonHeaders} from "../../utilities/ApiHandler";

class AccountsPageWebView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers: {}
        };
    }

    componentWillMount(){
        var headers = addCommonHeaders();
        if(this.props.accountStore && this.props.accountStore.userData && this.props.accountStore.userData.cookie){
            headers['cookie'] = 'identity='+this.props.accountStore.userData.cookie;
        }
       // headers['city']='riyadh';
        this.setState({headers: headers});
        //console.log('state', this.props);
    }

    render() {
        return (
            <WebView
                source={{
                    uri: this.props.url,
                    method: 'GET',
                    headers: this.state.headers
                }}
            />
        )
    }


}


function mapStateToProps(state) {
    return {
        accountStore: state.accounts,
        configStore: state.configAPIReducer,
        featureMapStore: state.featureMapAPIReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //add your action creators right here
        //updateCartStatus:(params)=>dispatch(CartActions.updateCartStatus(params)),

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AccountsPageWebView)

