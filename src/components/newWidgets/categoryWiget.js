'use strict';

import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as GLOBAL from '../../utilities/constants';

var categoryMap = {};
console.log(GLOBAL.API_URL.Wadi_Home);
if (!GLOBAL.CONFIG.isGrocery) {

     categoryMap = {
    "wadicon-mobile": "https://b.wadicdn.com/cms/ios/home_banners/categoy_icon_Electronics_14Nov17_en.png",
    "wadicon-tv": "https://b.wadicdn.com/cms/ios/home_banners/categoy_icon_Fragrances_14Nov17_en.png",
    "wadicon-kitchenware": "https://b.wadicdn.com/cms/ios/home_banners/categoy_icon_HomeKitchen_14Nov17_en.png",
    "wadicon-arabic-perfume": "https://b.wadicdn.com/cms/ios/home_banners/categoy_icon_Watches_14Nov17_en.png",
    "wadicon-male": "https://b.wadicdn.com/cms/ios/home_banners/categoy_icon_Watches_14Nov17_en.png",
    "wadicon-female": "https://b.wadicdn.com/cms/ios/home_banners/categoy_icon_DailyNeeds_14Nov17_en.png"
};

}
else{

    categoryMap = {
    "wadicon-mobile": "https://b.wadicdn.com/cms/ios/hyperlocal/home_banners/shopByCat_Fresh_Meat_02Jan17_en.jpg",
    "wadicon-tv": "https://b.wadicdn.com/cms/ios/hyperlocal/home_banners/shopByCat_Fresh_Vegetables_02Jan17_en.jpg",
    "wadicon-kitchenware": "https://b.wadicdn.com/cms/ios/hyperlocal/home_banners/shopByCat_Fresh_Fruit_02Jan17_en.jpg",
    "wadicon-arabic-perfume": "https://b.wadicdn.com/cms/ios/hyperlocal/home_banners/shopByCat_Frozen_02Jan17_en.jpg",
    "wadicon-male": "https://b.wadicdn.com/cms/ios/hyperlocal/home_banners/shopByCat_Branded_Food_02Jan17_en.jpg",
    "wadicon-female": "https://b.wadicdn.com/cms/ios/hyperlocal/home_banners/shopByCat_Food_Grains_02Jan17_en.jpg"
};

}


export default class CategoryWidget extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            this.props && this.props.widgetData && this.props.widgetData.json["datalinks.bind"].smallcategoryLink ?
                <View style={{borderTopWidth: 1, borderTopColor: '#E7E7E8'}}>
                    <FlatList
                        data={this.props.widgetData.json["datalinks.bind"].smallcategoryLink}
                        renderItem={(rowData) => this.rowView(rowData)}
                        numColumns={3}
                        keyExtractor={(item, index)=>{return `categoryLinks-${index}`}}
                    /></View> : <Text>Loading...</Text>

        )
    }

    rowView = (rowData) => {
        return (<TouchableOpacity activeOpacity ={1} style={styles.item} onPress={() => this.categoryClicked(rowData)}><View
                style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                    style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}
                    source={{uri: categoryMap[rowData.item.smallimageIcon]}}/>
                <Text style={{fontSize: 14, textAlign: 'center',color:'#080808'}}>{rowData.item.smallImageTitle}</Text>
            </View>
            </TouchableOpacity>
        )

    };

    categoryClicked = (rowData) => {
        this.props.callBack({url: rowData.item.smallImageUrl,screenName:rowData.item.smallImageTitle})
    }


}
var styles = StyleSheet.create({
    item: {
        display: 'flex',
        flex: 1,
        borderRightColor: GLOBAL.COLORS.bordergGreyColor,
        borderBottomColor: GLOBAL.COLORS.bordergGreyColor,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    }
});
