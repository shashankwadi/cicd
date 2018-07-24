import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import PhoneScreen from './phonePage';
import LoginScreen from './loginPage';
import {hideLoginModalAndNavigate, toggleLoginModal} from "../../../actions/accountActions";

let closed = false;
class Authentication extends Component {
    static navigatorButtons = {
        leftButtons: [
            {
                icon: require('../../../icons/navbar/arrow-down.png'),
                id: 'closeButton'
            }
        ]
    };
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'closeButton') { // this is the same id field from the static navigatorButtons definition

                this.hideLoginModal();
            }
        }
    }

    // static navigationOptions = ({navigation}) => {
    //     return {
    //         headerLeft: (
    //             <TouchableOpacity activeOpacity ={1}
    //                 onPress={() => {navigation.state.params.toggleModal()}}
    //                 style={{marginLeft: 5, height: 30, width: 30, alignItems: 'center'}}>
    //                 <Image style={{flex: 1, resizeMode: 'contain'}} source={images.downArrow}/>
    //             </TouchableOpacity>
    //         ),
    //         headerRight: (<RightHeaderButton/>)
    //     }
    // };
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.accountStore && nextProps.accountStore.userData && nextProps.accountStore.loggedIn
            && nextProps.accountStore.userData.phoneNumber && !closed) {
            closed = true;

            setTimeout(() => {
                closed = false;
            }, 3000);
            // this.props.hideLoginModal('AuthenticationIndex', this.props.navigator);
            this.hideLoginModal().then(() =>  this.props.hideLoginModalAndNavigate('AuthenticationIndex', this.props.navigator));
        }
    }

    hideLoginModal = async () => {
        await this.props.navigator.dismissModal({
            animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
        });

    };

    render(){
        return (
            this.props.accountStore.loggedIn ? <PhoneScreen navigator={this.props.navigator}/> : (!this.props.accountStore.userData.isPrimary ? <LoginScreen navigator={this.props.navigator}/> : <View/>)
        )
    }

}

function mapStateToProps(store) {
    return {
        accountStore: store.accounts
    }

}

function mapDispatchToProps(dispatch) {
    return {
        /*Toggle login modal action*/
        toggleLoginModal: () => dispatch(toggleLoginModal()),
        hideLoginModalAndNavigate: (fromScreen) => dispatch(hideLoginModalAndNavigate(fromScreen)),

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Authentication)