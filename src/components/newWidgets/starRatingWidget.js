import React, {Component} from 'react'
import {View} from 'react-native'
import Star from "./ratingStar";


class StarWidget extends Component {

    constructor(props) {
        super(props)
        this.state = {
            maxValue: null,
            value: null,
        }
        this.stars = []
    }

    componentDidMount() {
        this.setState({
            maxValue: this.props.maxValue,
            value: this.props.value,
        })
        let perStarArea = this.props.maxValue / 5
        let remainingValue = this.props.value;
        for (let i = 0; i < 5; i++) {
            this.stars.push(<Star
                index ={i}
                flexProp={remainingValue > perStarArea ? 1 : remainingValue > 0 ? remainingValue / perStarArea : 0}/>)
            remainingValue = remainingValue - perStarArea
        }
    }

    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                {this.stars}
            </View>
        )
    }
}

export default StarWidget;



