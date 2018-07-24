import React, { Component } from 'react';
import { Image } from 'react-native';

export default class ProgressiveImage extends Component {
    state = { showDefault: true, error: false };

    render() {
        var image = this.state.showDefault ? this.props.defaultImage : { uri: this.props.uri };
        var imageResizeMode = this.state.showDefault ? "cover" : this.props.resizeMode;

        return (
            <Image style={this.props.style}
                   source={image}
                   onLoadEnd={() => this.setState({showDefault: false})}
                   resizeMode={imageResizeMode}/>
        );
    }
}

ProgressiveImage.defaultProps ={
    defaultImage:require('../../icons/placeholderImage.png'),
}