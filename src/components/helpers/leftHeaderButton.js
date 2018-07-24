import React, {Component} from 'react';
import {

    Image,
    TouchableOpacity
} from 'react-native';

import images from 'assets/images';

export default class LeftHeaderButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity activeOpacity ={1}
                onPress={() => {
                    this.props.nav.goBack('')
                }}
                style={{marginLeft: 5, height: 30, width: 30, alignItems: 'center'}}>

                <Image
                    style={{flex: 1, resizeMode: 'contain'}}
                    source={images.downArrow}/>

            </TouchableOpacity>
        )
    }

}