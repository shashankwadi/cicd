/**
 * Created by Manjeet Singh on 09/02/2018 16:33:21
 * Purpose:- this Component is to show cart item count and to avoid render of whole app by passing cartitem to appstack as screenprops
 * file affected - rootnavigator and productdetail page]
 *
 * used redux to get cartitem count
 */


'use strict';
import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import Badge from './Badge';
import store from 'Wadi/src/reducers/store';
import {getStoreData} from "../../utilities/utilities";
import {navigateAction} from "../../actions/navigatorAction";
import {logoutUser, toggleLoginModal} from "../../actions/accountActions";

class CartBadge extends PureComponent {
    constructor(props) {
        super(props);
        this.state ={
         cartCount: getStoreData() && getStoreData().cart ? getStoreData().cart.itemsCount : 0
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return (this.props.cartItemsCount !== nextProps.cartItemsCount);
    // }
    render() {
        if (this.props.cartItemsCount > 0) {
            return (
                <Badge badgeStyle={this.props.badgeStyle} count={this.props.cartItemsCount} />
            );
        }
        return null;
    }
}

CartBadge.propTypes = {
    badgeStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    badgeTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

CartBadge.defaultProps = {
    badgeStyle: undefined,
    badgeTextStyle: undefined,
};

function mapStateToProps(store) {

    return {
        cartItemsCount: store.cart.itemsCount
    }

}

function mapDispatchToProps(dispatch) {
    return {
        deepLinkActions: (params) => dispatch(deepLinkActions(params))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CartBadge)