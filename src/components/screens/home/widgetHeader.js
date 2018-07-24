import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import {strings} from '../../../utilities/uiString'
export default class WidgetHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: null,
            url: null
        }
    }

    render() {
        const {title, url} = this.props;
        return (
            <View style={[styles.widgetHeaderContainer, this.props.style]}>
                {this.renderHeader(title)}
                {url && !!url && this.renderViewAllButton(url)}
            </View>

        )
    }

    /**
     * Renders view all button
     * @param url if present view all button is shown and is passed to the callback on being pressed
     *
     */
    renderViewAllButton=(url)=>{
        return( <TouchableOpacity activeOpacity ={1} style={styles.widgetHeaderShowAllContainer} onPress = {()=>this.props.viewAllTapped(url)}>
            <Text style={styles.widgetHeaderShowAll}>
                {strings.View_all}
            </Text>
        </TouchableOpacity>)
    }

    /**
     * Renders header and the title bar
     * @param title
     */
    renderHeader = (title) => {
        return(<View style={styles.widgetHeaderTitleContainer}>
            <View style={[styles.widgetHeaderTitleBackgroundLine, {backgroundColor: this.props.colorTheme}]}/>
            <Text style={styles.widgetHeaderTitle}>
                {title}
            </Text>
        </View>)
    }

}


const styles = StyleSheet.create({

    widgetHeaderContainer: {
        flex:1.0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },

    widgetHeaderTitleContainer: {
        flex:0.8,
        display: 'flex',
        flexDirection: 'column',
    },

    widgetHeaderTitleBackgroundLine: {
        flex: 0.1,
        width: 30,
        height: 2.5,
    },

    widgetHeaderTitle: {
        color: '#333',
        fontSize: 16,
        marginTop:7,
    },

    widgetHeaderShowAllContainer: {
        flex:0.2,
        marginTop: 9.5,
        paddingRight: 12,
        paddingBottom: 5,
        paddingLeft: 12,
        borderWidth: 1,
        borderColor: '#E7E7E8',
        borderRadius: 2,
        backgroundColor: '#fff',
        alignItems:'center',
        justifyContent:'center',
    },

    widgetHeaderShowAll: {
        fontSize: 12,
        color: '#333',
        marginTop:5,
    }


});