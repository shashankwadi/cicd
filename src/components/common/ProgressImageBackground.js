import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import PropTypes from 'prop-types';



export default class ProgressImageBackground extends Component {
    state = { showDefault: true, error: false };

    render() {
        let {defaultImage, source, resizeMode, children}= this.props;
        var image = this.state.showDefault ? this.props.defaultImage : this.props.source;
        var imageResizeMode = this.state.showDefault ? "cover" : this.props.resizeMode;

        return (
            <ImageBackground style={this.props.style}
                   source={image}
                   onLoadEnd={() => this.setState({showDefault: false})}
                   resizeMode={imageResizeMode}>
                {children}
            </ImageBackground>
        );
    }
}

ProgressImageBackground.defaultProps ={
    defaultImage:require('../../icons/placeholderImage.png'),
}