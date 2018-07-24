'use strict';
import React, {Component} from 'react';
import {I18nManager, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Stars from 'react-native-stars';

import * as GLOBAL from 'Wadi/src/utilities/constants';
import {dimensions} from 'utilities/utilities';
import images from 'assets/images';
import {VectorIcon} from '../../common';
import {connect} from 'react-redux';
import TimerLabel from "../timerLabel";
import ExpressWidget from '../../widgets/expressWidget'
import CityDropdown from "../CityDropdown";
import {strings} from '../../../utilities/uiString'
import StarWidget from "../../newWidgets/starRatingWidget";
import coupon from '../../../icons/product/coupon.png'

const ELECTRONICS_ATTRIBUTE = 'electronics';

class TitleSection extends Component {


    _handleToggleCityDropdown = () => {
        this.setState({isCityDropdownVisible: !this.state.isCityDropdownVisible})
    };
    _handleSelectCity = (selectedCity) => {
        this.props.handleSelectCity(selectedCity, this.state.selectedSeller)
    };

    constructor(props) {
        super(props);
        this.state = {
            isCityDropdownVisible: false,
            titleHeight: 0,
        };
    }

    /**
     * Renders express widget
     * @returns {*}
     */
    renderExpressWidget = () => {
        if (!!this.props.data.is_express && this.props.data.is_express === 1) {
            return (
                <View style={[styles.expressWidgetContainer]}>
                    <ExpressWidget/>
                </View>
            );
        } else {
            return (
                <View/>
            );
        }

    };
    /**
     * Renders warranty section
     * @returns {*}
     */
    renderWarranty = () => {
        if (this.props.data
            && this.props.data.bestSeller
            && this.props.data.bestSeller.warranty_period) {
            return (
                <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center', paddingHorizontal: 10}}>
                    <VectorIcon groupName={"SimpleLineIcons"} name={"shield"}
                                size={14}
                                style={{color: 'black'}}/>
                    <Text
                        style={[styles.infoText, {marginLeft: 8}]}>{this.props.data.bestSeller.warranty_period}</Text>
                </View>
            )
        } else {
            return <View/>
        }

    };
    /**
     * Renders city selector modal
     * @returns {*}
     */
    renderCityDropDownOverlay = () => {
        return (
            <CityDropdown isCityDropdownVisible={this.state.isCityDropdownVisible}
                          handleToggleCityDropdown={this._handleToggleCityDropdown}
                          handleSelectCity={(selectedCity) => this._handleSelectCity(selectedCity)}
                          selectedCity={this.props.selectedCity}
                          cities={this.props.configStore.configObj.content.deliveryCities}/>
        );
    };
    /**
     * Render selected city section
     * @returns {*}
     */
    renderSelectedCity = () => {
        return (
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                paddingHorizontal: 10,
            }}>
                {!this.props.isMultiseller && !GLOBAL.CONFIG.isGrocery && <View>
                    <TouchableOpacity activeOpacity={1} onPress={this._handleToggleCityDropdown}
                                      style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          marginTop: Platform.OS === "android" ? 10 : 0
                                      }}>
                        <Text style={{
                            marginRight: 30,
                            color: GLOBAL.COLORS.wadiDarkGreen,
                            fontFamily: GLOBAL.FONTS.default_font,
                            fontSize: 14,
                            textDecorationLine: 'underline'
                        }}>{strings.ChangeCity}</Text>
                    </TouchableOpacity>
                </View>}
            </View>
        );
    }

    /**
     * Renders title view
     * @returns {*}
     */
    renderTitleView() {
        let {name, brand, name_desc, attributes} = this.props.data;
        brand = !!(name_desc && name_desc.brand)?name_desc.brand:(!!brand?brand:"");
        name = !!(name_desc && name_desc.name)?name_desc.name:(!!name?name:"");
        let subtitle = !!(name_desc && name_desc.subtitle)?name_desc.subtitle:""
        return (
            <View style={styles.titleView}
                  onLayout={(event) => this.calculateOffsetHeight(event)}>
                <Text style={styles.titleText} numberOfLines={2}>
                    {attributes && attributes.attribute_set === ELECTRONICS_ATTRIBUTE ? (brand + name) : (brand)}
                </Text>
                <Text style={styles.lightText} numberOfLines={2}>
                    {attributes && attributes.attribute_set === ELECTRONICS_ATTRIBUTE ? (subtitle) : (name.substr(1) + ' ' + subtitle)}
                </Text>
            </View>
        )
        
        
    }

    /**
     * Calculate title and price section height to adjust image page size
     * @param event
     */
    calculateOffsetHeight(event) {
        let height = event.nativeEvent.layout.height;
        if (height > 0) {
            this.setState({
                titleHeight: this.state.titleHeight + height,
            });
            // this.props.setOffsetHeight(this.state.titleHeight + height)
        }

    }

    /**
     * Renders price view, discount view
     * @returns {*}
     */
    renderPriceView() {
        let {offerPrice, price, specialPrice, discount, bestSeller} = this.props.data;
        specialPrice = (specialPrice && specialPrice !== 0) ? specialPrice : 0;
        return (
            <View style={{flex: 1}}
                  onLayout={(event) => this.calculateOffsetHeight(event)}>
                <View style={styles.priceContainerView}>
                    <View style={styles.priceView}>
                        <Text
                            style={styles.specialPriceText}>{`${specialPrice || price} ${this.props.featureMapAPIReducer.featureMapObj.currency.label} ` || ''}</Text>
                    </View>

                    {bestSeller && bestSeller.tax_info &&
                    <Text style={[styles.lightText]}>{bestSeller.tax_info}</Text>}
                </View>

            </View>
        )
    }

    /**
     * Not used as of now.
     **/
    renderRatingView() {

        let rating = 1.6;
        let totalReviews = 39;
        return (
            <View style={styles.ratingContainerView}>
                {String(rating).length > 0 &&
                <View style={styles.ratingView}>
                    <View style={{alignItems: 'flex-start', flexDirection: 'row', padding: 3}}>
                        <Stars
                            half={true}
                            rating={rating}
                            spacing={2}
                            count={5}
                            starSize={15}
                            backingColor='transparent'
                            fullStar={images.starFilled}
                            emptyStar={images.starEmpty}
                            halfStar={images.starHalf}/>
                    </View>
                </View>}
                {String(totalReviews).length > 0 &&
                <View style={styles.totalReviewsView}>
                    <View style={{alignItems: 'flex-start',}}>
                        <Text style={styles.totalReviewsText}>
                            {totalReviews}{' reviews'}
                        </Text>
                    </View>
                </View>}

            </View>
        )
    }

    /**
     * Renders brand
     **/
    renderBrand() {
        let {brand} = this.props.data;
        return (
            <View style={styles.brandView}>
                {(brand && !GLOBAL.CONFIG.isGrocery) ?
                    <Image source={{uri: `https://b.wadicdn.com/brand/${brand.url}`}} style={{flex: 1}}
                           resizeMode={"contain"}/>
                    : null}
            </View>
        );
    }

    /**
     * Renders title and brand section
     **/
    renderTopView() {
        return (
            <View style={styles.topView}>
                {this.renderTitleView()}
                {this.renderBrand()}
            </View>
        )
    }

    /**
     * Renders user reviews and ratings, price view
     **/
    renderMiddleView() {
        let {offerPrice, price, specialPrice, discount, bestSeller} = this.props.data;
        const expertReviewCount = (this.props.product && this.props.product.ratingReviewObj && this.props.product.ratingReviewObj.pro_score_dist_all)
            ? this.props.product.ratingReviewObj.pro_score_dist_all.reduce((total, amount) => total + amount) : 0;
        const userReviewCount = (this.props.product && this.props.product.ratingReviewObj && this.props.product.ratingReviewObj.user_score_dist_all)
            ? this.props.product.ratingReviewObj.user_score_dist_all.reduce((total, amount) => total + amount) : 0;
        const totalUserCount = expertReviewCount + userReviewCount;
        return (
            <View>
            <View style={styles.middleView}>
                {this.props && this.props.data && this.props.data.bestSeller && this.renderPriceView()}
                {totalUserCount > 0 &&
                <View>
                    <StarWidget maxValue={10}
                                value={this.props.product.ratingReviewObj.score}/>
                    <Text style={styles.totalReviewText}>({totalUserCount} {strings.Reviews})</Text></View>
                }

            </View>
                {discount > 0 &&
                <View style={styles.discountView}>
                    <Text style={styles.discountText}>
                        {`${discount}${strings.offText}`}
                    </Text>
                    <Text style={[styles.lightText, {fontSize: 14, fontWeight: '400', marginLeft: 10}]}>
                        {!I18nManager.isRTL ?
                            `${strings.WAS_PRICE_TEXT} ${parseInt(price)} ${this.props.featureMapAPIReducer.featureMapObj.currency.label}. ` :
                            `.${this.props.featureMapAPIReducer.featureMapObj.currency.label} ${parseInt(price)} ${strings.WAS_PRICE_TEXT}`
                        }
                    </Text>
                    <View style={{flexDirection: 'row', marginLeft: 7,alignItems:'center'}}>
                        <Text style={[styles.lightText, {fontSize: 14, fontWeight: '400'}]}>
                            {strings.SAVE_TEXT}
                        </Text>
                        <Text style={[styles.lightText, {fontSize: 14, fontWeight: '700', color: 'black'}]}>
                            {!I18nManager.isRTL ?
                                ` ${parseInt(price - specialPrice)} ${this.props.featureMapAPIReducer.featureMapObj.currency.label}` :
                                `${this.props.featureMapAPIReducer.featureMapObj.currency.label} ${parseInt(price - specialPrice)} `
                            }
                        </Text>
                    </View>
                </View>}
            </View>
        )
    }

    /**
     * Renders flash sale
     **/
    renderBottomView() {
        let {flash} = this.props.data;
        if (flash && flash.active && !!flash.active) {
            let expiryTime = new Date(flash.endAt).getTime(),
                startTime = new Date(flash.startAt).getTime(),
                timeLeft = expiryTime - startTime;
            let progressDone = flash.totQty - flash.availableQty;
            let progressPending = flash.totQty - progressDone;
            return (
                <View style={styles.bottomView}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {String(progressDone).length > 0 && <View style={styles.progressBarContainerView}>
                            <View style={[styles.progressPendingView, {flex: progressPending / 10}]}>
                            </View>
                            <View style={[styles.progressDoneView, {flex: progressDone / 10}]}>
                            </View>
                        </View>}
                        <Text
                            style={{color: '#e23446'}}>{`${flash.availableQty} ${strings.Unit}${flash.availableQty > 1 ? 's' : ''} ${strings.Left}`}</Text>
                    </View>
                    {
                        timeLeft > 0
                        &&
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                color: '#9e9e9e',
                                marginTop: 5,
                                textAlign: 'left',
                                marginRight: 5
                            }}>{strings.EndsIn}</Text>
                            <TimerLabel style={{color: '#686868', marginTop: 9}} expiryTime={expiryTime}/>
                        </View>
                    }
                </View>
            )
        }

    }

    /**
     * Renders offers section
     * @returns {*}
     */
    renderOfferView() {
        let {ribbon} = this.props.data;
        if (!ribbon) return true;
        return (
            <View style={{backgroundColor: "#eef9f9", padding: 10, marginTop: 10}}>
                <View style={styles.offerTitleContainer}>
                    <View>
                        <Image source={coupon} style={{height: 18, width: 18}}/>
                    </View>
                    <Text style={{
                        marginLeft: 10,
                        marginRight: 10,
                        textAlign: 'left',
                        fontFamily: GLOBAL.FONTS.default_font_bold,
                        color: GLOBAL.COLORS.wadiDarkGreen,
                        fontSize: 14
                    }}>{strings.OFFER}</Text>
                </View>
                <View>
                    {(ribbon && ribbon.desc) && <Text style={{
                        textAlign: 'left',
                        color: GLOBAL.COLORS.darkGreyColor,
                        fontSize: 14,
                        marginBottom: 5,
                        lineHeight: 25
                    }}>{`${ribbon.desc}`}</Text>}
                </View>
            </View>

        );
    }

    /**
     * Renders delivery info
     **/
    renderDeliveryInfo() {
        let {simples, bestSeller} = this.props.data;
        let {delivery_time_min, delivery_time_max, shipping_time_min, shipping_time_max, shipped_by_date, delivered_by_date} = this.props.data.bestSeller;
        return (
            <View style={{marginTop: 5, paddingHorizontal: 10}}>
                {/*Don't delete below commented code*/}
                {/*<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <VectorIcon groupName={"Ionicons"} name={"ios-warning"} size={16} style={{ color: 'black' }} />
                        <View style={{ width: 5 }} />
                        <Text style={styles.lightText}>This item cannot be exchanged or returned</Text>
                    </View>*/}
                {
                    this.props.product &&
                    this.props.product.deliveryDetailsObj &&
                    Object.keys(this.props.product.deliveryDetailsObj).length > 0 &&
                    Object.values(this.props.product.deliveryDetailsObj).length > 0 &&
                    !!Object.values(this.props.product.deliveryDetailsObj)[0] &&
                    !!Object.values(this.props.product.deliveryDetailsObj)[0].expected_delivery_text &&
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <VectorIcon groupName={"MaterialCommunityIcons"} name={"truck-delivery"} size={16}
                                    style={{color: 'black', marginLeft: 2}}/>
                        <View style={{width: 5}}/>

                        <Text
                            style={styles.lightText}>{Object.values(this.props.product.deliveryDetailsObj)[0].expected_delivery_text}</Text>

                    </View>
                }
            </View>
        );

    }

    render() {
        return (
            <View style={styles.containerView}>
                <View style={[styles.paddingHorizontal]}>
                    {this.renderCityDropDownOverlay()}
                    {this.renderTopView()}
                    {this.renderMiddleView()}
                    {this.renderExpressWidget()}
                    {this.renderBottomView()}
                </View>
                {this.renderOfferView()}
                {this.renderWarranty()}
                {this.props.data && this.props.data.bestSeller && !this.props.isMultiseller && this.renderDeliveryInfo()}
                {this.renderSelectedCity()}
            </View>
        )
    }

}

var styles = StyleSheet.create({
    containerView: {
        paddingBottom: 10,
    },
    paddingHorizontal: {
        paddingHorizontal: 10
    },
    titleView: {
        flex: 0.80,
        justifyContent: 'center',
    },
    brandView: {
        flex: 0.20,
        justifyContent: 'flex-start'
    },
    ratingContainerView: {
        flex: 0.30,
        justifyContent: 'center',
        marginLeft: 5,
    },
    priceView: {
        flexDirection: 'row',
        alignContent: 'center',
    },
    ratingView: {
        flexDirection: 'row',
        marginTop: 2,
        alignContent: 'center',

    },
    totalReviewsView: {},
    discountView: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        borderRadius: 4,
    },
    priceContainerView: {
        flex: 0.70,
        justifyContent: 'center',
    },
    discountText: {
        color: 'black',
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 14,
        paddingHorizontal: 10,
        paddingTop: 4,
        borderRadius: 12,
        borderWidth: 1.5,
        overflow: 'hidden',
        borderColor: "#ffdc51",
        // backgroundColor: 'transparent'
    },
    totalReviewsText: {
        marginLeft: 3,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 14,
        color: 'darkgray',
        textAlign: 'left',
        marginTop: 5,
    },
    priceText: {
        //marginLeft: 10,
        fontFamily: GLOBAL.FONTS.default_font,
        fontSize: 18,
        color: '#808080',
        textAlign: 'left',
        marginTop: 5,
        textDecorationLine: 'line-through'


    },
    specialPriceText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 20,
        textAlign: 'left',
        color: 'black',
        marginTop: 5

    },
    currencyText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 18,
        color: 'black',
        textAlign: 'left',
        marginTop: 5
    },
    topView: {
        flex: 0.33,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    middleView: {
        //flex: 0.33,
        flexDirection: 'row',
        //paddingLeft: 5,
        paddingVertical: 10
    },
    bottomView: {
        justifyContent: 'center',
        //alignItems: 'center',
        marginRight: 5,
        paddingVertical: 10

    },
    progressBarContainerView: {
        flex: 1,
        height: 10,
        flexDirection: 'row',
        borderColor: GLOBAL.COLORS.wadiRoseColor,
        marginRight: 10
    },
    progressPendingView: {
        backgroundColor: GLOBAL.COLORS.progressBarColorFilled,
        borderTopLeftRadius: I18nManager.isRTL ? 0 : 4,
        borderBottomLeftRadius: I18nManager.isRTL ? 0 : 4,
        borderTopRightRadius: I18nManager.isRTL ? 4 : 0,
        borderBottomRightRadius: I18nManager.isRTL ? 4 : 0,
    },
    progressDoneView: {
        //backgroundColor: GLOBAL.COLORS.progressBarColorEmpty,
        backgroundColor: '#FFF',
        borderColor: GLOBAL.COLORS.progressBarColorFilled,
        borderWidth: 1,
        borderTopRightRadius: I18nManager.isRTL ? 0 : 4,
        borderBottomRightRadius: I18nManager.isRTL ? 0 : 4,
        borderTopLeftRadius: I18nManager.isRTL ? 4 : 0,
        borderBottomLeftRadius: I18nManager.isRTL ? 4 : 0,
    },
    titleText: {
        fontFamily: GLOBAL.FONTS.default_font_bold,
        fontSize: 16,
        lineHeight: 25,
        color: 'black',
        textAlign: 'left',
    },

    lightText: {
        fontFamily: GLOBAL.FONTS.default_font,
        color: '#666666',
        textAlign: 'left',
        fontSize: 14
    },
    offerTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    expressWidgetContainer: {
        display: 'flex',
        flex: 0,
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 4
    },
    infoText: {
        fontSize: 14,
        fontFamily: GLOBAL.FONTS.default_font,
        color: GLOBAL.COLORS.darkGreyColor
    },
    totalReviewText: {color: '#666666', textDecorationLine: 'underline'}


});

function mapStateToProps(state) {

    return {
        product: state.productDetailReducers,
        configStore: state.configAPIReducer,
        featureMapAPIReducer: state.featureMapAPIReducer,
    }
}


export default connect(mapStateToProps)(TitleSection)

