import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import {LoginStack} from "../../navigators/rootNavigator";
import {connect} from 'react-redux';

class LoginModal extends Component {


    constructor(props){
        super(props)
    }

    render() {
        let {fromScreen, toScreen} = this.props.accountStore;
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.accountStore.isLoginModalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >
                    <View style={{flex: 1}}>
                        <LoginStack screenProps={{fromScreen, toScreen}}/>
                    </View>
                </Modal>
            </View>
        );
    }
}

function mapStateToProps(store) {
    return {
        accountStore: store.accounts
    }

}

export default connect(mapStateToProps)(LoginModal)