/**
 * Created by Akhil Choudhary
 * Created on 2018-02-28
 *
 */
import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, I18nManager} from 'react-native'
import StarWidget from "./starRatingWidget";

const ReviewsRow = ({item, index}) => {

    return (
        <View style={styles.parentContainer}>
            <View style={styles.reviewer_detail_and_rating_row}>
                <View style={styles.reviewerDetail}>
                    <View style={styles.reviewerNameIcon}>
                        <Image
                            resizeMode="cover"
                            style={{width: 20, height: 20, marginRight: 5}}
                            source={item.icon ? {uri: item.icon} : require('../../icons/navbar/wadigrocery_en.png')}
                            borderRadius={10}
                        />
                        <Text style={styles.reviewerName}>{item.source}</Text>
                    </View>
                    <Text style={styles.postDate}>{item.date}</Text>


                </View>
                {item.score_max && item.score &&
                <StarWidget maxValue={item.score_max} value={item.score}/>}

            </View>
            <Text style={styles.reviewText}>{item.extract}</Text>
            {item.pros && <View style={styles.prosConsRow}>
                <Text style={{color: '#0FB0AA'}}>+ </Text>
                <Text style={styles.prosCons}>{item.pros}</Text>

            </View>}
            {item.cons && <View style={styles.prosConsRow}>
                <Text style={{color: 'red'}}>- </Text><Text
                style={styles.prosCons}>{item.cons}</Text>

            </View>}

        </View>
    )
}

const styles = StyleSheet.create({
    parentContainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 10,
        borderBottomColor: '#c7c7cd',
        borderBottomWidth: 0.5,
        paddingBottom: 10
    },
    reviewer_detail_and_rating_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: I18nManager.isRTL ? 0 : 10,
        marginLeft: I18nManager ? 10 : 0

    },
    reviewerDetail: {
        flexDirection: 'column'
    },
    reviewText: {
        marginLeft: I18nManager.isRTL ? 10 : 30,
        marginRight: I18nManager.isRTL ? 30 : 10,
        color: '#333333',
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 15,
        lineHeight: 20,
        marginTop: 10
    },
    reviewerName: {fontSize: 17, color: '#333333', fontWeight: 'bold'},
    postDate: {marginLeft: 35, fontSize: 13,textAlign:'left'},
    reviewerNameIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    prosConsRow: {flexDirection: 'row', flex: 1, marginLeft: 10, marginRight: 10, marginBottom: 5},
    prosCons: {
        marginRight: I18nManager.isRTL ? 5 : 10,
        marginLeft: I18nManager.isRTL ? 10 : 5,
        fontSize: 15,
        color: '#666666',
        textAlign: 'left'
    }

})

export default ReviewsRow
