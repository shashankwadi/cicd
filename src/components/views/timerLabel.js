import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { dimensions } from 'utilities/utilities';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import TimerMixin from 'react-timer-mixin';
var timer;


export default class TimerLabel extends Component {

    constructor(props) {
        super(props);
        let expiryTime = this.props.expiryTime / 1000;
        var currentTime = (new Date).getTime() / 1000;

        let timeLeft = (currentTime >= expiryTime) ? 0 : (expiryTime - currentTime);
        let hoursRemaining = Math.floor(timeLeft / 3600);
        let minutesRemaining = Math.floor(timeLeft/60 - (hoursRemaining * 60));
        let secondsRemaining = Math.floor(timeLeft - ((hoursRemaining * 3600) + (minutesRemaining * 60)))
        let displayTimer = (timeLeft > 0) ? true: false;
        this.state = {
            hours: hoursRemaining,
            minutes: minutesRemaining,
            seconds: secondsRemaining,
            hoursText: (hoursRemaining < 10) ? '0'.concat(hoursRemaining) : hoursRemaining,
            minutesText: (minutesRemaining < 10) ? '0'.concat(minutesRemaining) : minutesRemaining,
            secondsText: (secondsRemaining < 10) ? '0'.concat(secondsRemaining) : secondsRemaining,
            timeLeft: timeLeft
        }
        this.startTimer();
    }

    startTimer() {

        this.timer = TimerMixin.setInterval(
            () => { this.decrementTimer() },
            1000.0);
    }

    decrementTimer() {

        let secondsRemaining = this.state.seconds;
        let minutesRemaining = this.state.minutes;
        let hoursRemaining = this.state.hours;

        if (secondsRemaining == 0) {
            if (minutesRemaining == 0) {
                if (hoursRemaining == 0) {
                    TimerMixin.clearInterval(this.timer);
                    this.setState({
                        timeLeft: 0
                    })
                } else {
                    minutesRemaining = 59;
                    hoursRemaining--;
                    secondsRemaining = 59;
                }
            } else {
                minutesRemaining--;
                secondsRemaining = 59;
            }
        } else {
            secondsRemaining--;
        }
        this.setState({
            hours: hoursRemaining,
            minutes: minutesRemaining,
            seconds: secondsRemaining,
            hoursText: (hoursRemaining < 10) ? '0'.concat(hoursRemaining) : hoursRemaining,
            minutesText: (minutesRemaining < 10) ? '0'.concat(minutesRemaining) : minutesRemaining,
            secondsText: (secondsRemaining < 10) ? '0'.concat(secondsRemaining) : secondsRemaining,
            timeLeft: this.state.timeLeft - 1
        })
    
    }


render() {
    if(this.state.timeLeft > 0) {
    return (
        <View style={[styles.timerContainer, this.props.style]}>
            {this.props.prefixText && this.props.prefixText.length >= 0 && <Text style = {styles.prefixText}>
                {this.props.prefixText}{' '}
            </Text>}
            <Text style = {styles.timerText} numberOfLines = {1}>
                {this.state.hoursText}:{this.state.minutesText}:{this.state.secondsText}
            </Text>
        </View>
            );
        }
        else {
            return <View/>
        }
}

componentWillUnmount() { 
    TimerMixin.clearInterval(this.timer);
    this.setState({
        timeLeft: 0
    })
}

}

var styles = StyleSheet.create({
    timerContainer: {
        flexDirection: 'row'
    },
    timerText: {
        fontFamily: GLOBAL.FONTS.default_font,
        color: GLOBAL.COLORS.progressBarColorFilled,
        fontSize: 12
    },
    prefixText: {
        fontFamily: GLOBAL.FONTS.default_font,
        color: 'darkgray',
        fontSize: 12
        
    }
});