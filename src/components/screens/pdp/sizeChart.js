import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
} from 'react-native';

import {dimensions} from 'utilities/utilities';
import TitleSection from '../../views/pdp/titleSection';
import {connect} from 'react-redux';
import {CartActions} from '../../../reducers/cart';
import TableView from '../../common/tableView';

class SizeChart extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            sizeChart: params.sizeChart
        };
    }

    componentWillMount() {

    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView 

                    style={{paddingTop: 20, paddingLeft: 20, paddingRight: 20}}
                    showsVerticalScrollIndicator={false}>
                    <TableView 
                         tableData={this.state.sizeChart.data}/> 
                
                    <Text
                        style={{margin: 10, textAlign: 'center'}}>
                        {'To-Fit Denotes body measurements in '+this.state.sizeChart.hints}
                    </Text>
                    <Image 
                        style={{width: '100%', height: 400}}
                        source={{uri: 'https://b.wadicdn.com'+this.state.sizeChart.image}} />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

});


function mapStateToProps(state) {
    return {
        product: state.productDetailReducers
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProductToCart: (params) => dispatch(CartActions.addToCart(params)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SizeChart)