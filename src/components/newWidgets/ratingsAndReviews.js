/**
 * Created by Akhil Choudhary
 * Created on 2018-02-28
 *
 */
import React, {Component, PureComponent} from 'react'
import {View, Text, StyleSheet, FlatList, TouchableOpacity, I18nManager} from 'react-native'
import ReviewsRow from "./reviewsRow";
import RatingBar from "./ratingBar";
import StarWidget from "./starRatingWidget";
import * as GLOBAL from 'Wadi/src/utilities/constants';
import {fetchDataFromUrl, fetchReviewData} from "../../actions/ratingReviewsActions";
import {isEmptyObject} from "../../utilities/utilities";
import {connect} from "react-redux";
import {strings} from '../../utilities/uiString'


class RatingsAndReviews extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            productReview: null, //initial review call which gives us user_review and expert_review url
            userReview: null,
            expertReview: null,
            expertReviewIsOpened: false,
            userReviewIsOpened: false,
            pro_score_dist_all: null,
            user_score_dist_all: null


        }


    }

    componentDidMount() {

        this.props.fetchReviewData(this.props.sku).then(response => {

            this.setState({
                productReview: response,
                pro_score_dist_all: response.pro_score_dist_all ? response.pro_score_dist_all.reverse() : null,
                user_score_dist_all: response.user_score_dist_all ? response.user_score_dist_all.reverse() : null
            }, () => {
                this.state.productReview.user_review_count &&
                this.state.productReview.user_review_count > 0 &&
                this.state.productReview.user_review_url && fetchDataFromUrl(this.state.productReview.user_review_url).then(response => {
                    this.setState({userReview: response}, () => {

                    })
                })
                this.state.productReview.pro_review_count &&
                this.state.productReview.pro_review_count > 0 &&
                this.state.productReview.pro_review_url && fetchDataFromUrl(this.state.productReview.pro_review_url).then(response => {

                    this.setState({expertReview: response}, () => {
                    })
                })
            })
        })
    }


    render() {
        if (this.state.productReview && this.state.productReview.score && this.state.productReview.score>0) {
            let {pro_score_dist_all,user_score_dist_all} = this.state.productReview;
            const expertReviewCount = pro_score_dist_all ? pro_score_dist_all.reduce((total, amount) => total + amount) : 0;
            const userReviewCount = user_score_dist_all ? user_score_dist_all.reduce((total, amount) => total + amount) : 0;

            return (<View style={styles.parentContainer}>
                <View style={styles.topHeadingContainer}>
                    <Text style={styles.reviewScore}>{this.state.productReview.score / 2}</Text>
                    <View style={{marginLeft: 10}}>
                        <StarWidget maxValue={10} value={this.state.productReview.score}/>
                        <Text
                            style={styles.totalReviewsText}>{`${strings.BasedOn} ${expertReviewCount + userReviewCount} ${strings.Reviews}*`}</Text>
                    </View>

                </View>
                <View style={styles.expertUserReviewBar}>
                    <View style={styles.ratingBarContainer}>
                        <Text
                            style={styles.ratingBarContainerHeading}>{`${strings.ExpertReviews} (${expertReviewCount})*`}</Text>
                        {this.state.pro_score_dist_all && this.state.pro_score_dist_all.map((item, index) => {
                            return (<RatingBar totalCount={expertReviewCount} itemCount={item} index={4 - index}/>)
                        })}

                    </View>
                    <View style={styles.ratingBarContainerDivider}></View>
                    <View style={styles.ratingBarContainer}>
                        <Text
                            style={styles.ratingBarContainerHeading}>{`${strings.UserReviews} (${userReviewCount})*`}</Text>
                        {this.state.user_score_dist_all && this.state.user_score_dist_all.map((item, index) => {
                            return (<RatingBar totalCount={userReviewCount} itemCount={item} index={4 - index}/>)
                        })}
                    </View>
                </View>
                <View style={{
                    marginLeft: I18nManager.isRTL ? 0 : 15,
                    marginTop: 10,
                    paddingBottom: 10,
                    marginRight: I18nManager.isRTL ? 15 : 0
                }}>
                    {this.state.productReview.product_pros && this.state.productReview.product_pros.length > 0 &&
                    <Text style={styles.productConsProsText}><Text
                        style={styles.plusFont}>+ </Text>{this.state.productReview.product_pros.join(", ")}
                    </Text>}
                    {this.state.productReview.product_cons && this.state.productReview.product_cons.length > 0 &&
                    <Text style={styles.productConsProsText}><Text
                        style={styles.minusFont}>- </Text>{this.state.productReview.product_cons.join(", ")}
                    </Text>}
                    <Text style={styles.tncText}>* This score is based
                        on all expert and user reviews
                        that TestFreaks has collected for this product. Reviews and scores are collected from more than
                        30 countries but only reviews in selected languages are included above.</Text>
                </View>
                {/*expert review section starts*/}
                <View style={styles.reviewsContainer}><Text
                    style={styles.reviewsContainerCountText}>{`${strings.ExpertReviews} (${expertReviewCount})`}</Text>
                    <TouchableOpacity activeOpacity={1}
                                      onPress={() => this.setState(prevState => {
                                          return {expertReviewIsOpened: !prevState.expertReviewIsOpened}
                                      })}>
                        <Text
                            style={styles.toggleButton}>{this.state.expertReviewIsOpened ? '-' : '+'}</Text></TouchableOpacity></View>
                {(!!this.state.expertReviewIsOpened && this.state.expertReview && this.state.expertReview.reviews && this.state.expertReview.reviews.length > 0) &&
                <View style={{flex: 1}}>
                    {
                        this.state.expertReview.reviews.map((item, index) => {

                            return (<ReviewsRow item={item}/>)
                        })
                    }
                    <TouchableOpacity activeOpacity={1}
                                      onPress={() => this.loadMoreExpertReview()}>
                        <View style={styles.loadMore}>
                            <Text style={{color: 'black'}}>{strings.LoadMoreReviews}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                }
                {/*expert review section ends*/}

                {/*user review section starts*/}
                <View style={[styles.reviewsContainer, {
                    borderBottomColor: '#E7E7E8',
                    borderBottomWidth: 1,
                }]}><Text
                    style={styles.reviewsContainerCountText}>{`${strings.UserReviews} (${userReviewCount})`}</Text>
                    <TouchableOpacity activeOpacity={1}
                                      onPress={() => this.setState(prevState => {
                                          return {userReviewIsOpened: !prevState.userReviewIsOpened}
                                      })}>
                        <Text
                            style={styles.toggleButton}>{this.state.userReviewIsOpened ? '-' : '+'}</Text></TouchableOpacity></View>

                {(!!this.state.userReviewIsOpened && this.state.userReview && this.state.userReview.reviews && this.state.userReview.reviews.length > 0) &&
                <View style={{flex: 1}}>
                    {
                        this.state.userReview.reviews.map((item, index) => {

                            return (<ReviewsRow item={item}/>)
                        })
                    }
                    <TouchableOpacity activeOpacity={1}
                                      onPress={() => this.loadMoreUserReview()}>
                        <View style={styles.loadMore}>
                            <Text style={{color: 'black'}}>{strings.LoadMoreReviews}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                }
                {/*user review section ends*/}

            </View>)
        }
        else {
                return (<View/>)
        }

    }

    loadMoreUserReview() {
        fetchDataFromUrl(this.state.userReview.next_page_url).then(response => {
            this.setState(prevState => {
                return {
                    userReview: {
                        reviews: [...prevState.userReview.reviews, ...response.reviews],
                        next_page_url: response.next_page_url
                    }
                }
            }, () => {

            })

        })
    }

    loadMoreExpertReview() {
        fetchDataFromUrl(this.state.expertReview.next_page_url).then(response => {
            this.setState(prevState => {
                return {
                    expertReview: {
                        reviews: [...prevState.expertReview.reviews, ...response.reviews],
                        next_page_url: response.next_page_url
                    }
                }
            }, () => {

            })

        })
    }
}


const styles = StyleSheet.create({
    parentContainer: {marginTop: 1},
    topHeadingContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewScore: {
        fontSize: 42,
        color: 'black'
    },
    totalReviewsText: {
        color: '#666666'
    },
    expertUserReviewBar: {
        flexDirection: 'row',
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: GLOBAL.COLORS.bordergGreyColor,
        borderBottomWidth: 1,
        borderBottomColor: GLOBAL.COLORS.bordergGreyColor,
    },
    ratingBarContainer: {
        flex: 1,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    ratingBarContainerHeading: {
        color: '#333333',
        fontWeight: 'bold',
        marginBottom: 5,
        marginRight: I18nManager.isRTL ? 10 : 0
    },
    ratingBarContainerDivider: {
        backgroundColor: GLOBAL.COLORS.bordergGreyColor,
        width: 1,
    },
    productConsProsText: {
        color: '#333333',
        fontSize: 15
    },
    plusFont: {
        color: '#0FB0AA',
        fontSize: 18
    },
    minusFont: {color: 'red', fontSize: 18},
    tncText: {color: '#999999', fontSize: 13, marginTop: 10, marginRight: 2},
    reviewsContainer: {
        backgroundColor: '#F7FAFA',
        height: 50,
        alignItems: 'center',
        borderTopColor: '#E7E7E8',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reviewsContainerCountText: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 10
    },
    toggleButton: {
        color: '#333333',
        fontSize: 16,
        marginRight: 10
    },
    loadMore: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        backgroundColor: GLOBAL.COLORS.loadMore
    }

})

function mapStateToProps(store) {
    return {}

}

function mapDispatchToProps(dispatch) {

    return {
        fetchReviewData: (sku) => dispatch(fetchReviewData(sku))
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(RatingsAndReviews)