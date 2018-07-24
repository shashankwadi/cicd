/*
* Contains all navigation of the app
* */


import React from 'react';
import {
    Image,
    I18nManager,
    Text,
    View,
    Platform,
} from 'react-native';
import {
    TabNavigator,
    StackNavigator
} from 'react-navigation';

//import HomePage from '../screens/homePage'
import HomePage from '../screens/home'
import CartPage from '../screens/cart/cartPage'
import CheckoutPage from '../screens/checkoutPage'
import SearchPage from '../screens/search/searchPage'
import SearchFilters from '../screens/search/algoliaFilter'
import AccountsPage from '../screens/accountsPage'
import CategoryPage from '../screens/categoryPage'
import ProductList from '../screens//plp/productList';
import ProductDetail from '../screens/pdp/productDetail'
import MultiSeller from '../screens/pdp/multiSeller';
import SizeChart from '../screens/pdp/sizeChart';

import FilterPage from '../screens/filterPage';

import Authentication from '../screens/authentication';
import LoginPage from '../screens/authentication/loginPage/index';
import SignupScreen from '../screens/authentication/signupPage';
import PhoneScreen from '../screens/authentication/phonePage';
import OTPScreen from '../screens/authentication/otpPage';
import PasswordScreen from '../screens/authentication/passwordPage';
import ForgotPasswordScreen from '../screens/authentication/forgotPasswordPage';
import SignupSuccessScreen from '../screens/authentication/signupSuccessPage';

import CountryView from '../views/country/countryView'
import LanguageView from '../views/language/languageView'
import ErrorView from '../views/error/errorView'

import HomeUnSelIcon from 'Wadi/src/icons/tabbar/tab_home_unselected.png'
import HomeSelIcon from 'Wadi/src/icons/tabbar/tab_home_selected.png'

import CategoryUnSelIcon from 'Wadi/src/icons/tabbar/tab_category_unselected.png'
import CategorySelIcon from 'Wadi/src/icons/tabbar/tab_category_selected.png'

import AccountUnSelIcon from 'Wadi/src/icons/tabbar/tab_profile_unselected.png'
import AccountSelIcon from 'Wadi/src/icons/tabbar/tab_profile_selected.png'

import SearchUnSelIcon from 'Wadi/src/icons/tabbar/tab_search_unselected.png'
import SearchSelIcon from 'Wadi/src/icons/tabbar/tab_search_selected.png'

import CartUnSelIcon from 'Wadi/src/icons/tabbar/tab_bag_unselected.png'
import CartSelIcon from 'Wadi/src/icons/tabbar/tab_bag_selected.png'
import Colors from 'Wadi/src/utilities/namespaces/colors';
import {CartBadge} from '../common';

import wadiNavBarIcon from "Wadi/src/icons/navbar/Logo_en.png";
import {strings} from 'utilities/uiString';
import AccountsPageWebView from '../views/accountsPageWebView';
import AddressBookScreen from '../screens/account/addressBookScreen';
import AddressEditScreen from '../screens/account/addressEditScreen';
import MyOrders from "../screens/account/myOrders";
import OrderDetails from "../screens/account/orderDetails";
import CreditCardScreen from '../screens/account/creditCardScreen';
import WalletPage from '../screens/wallet/walletPage';

if (I18nManager.isRTL == true) {
    strings.setLanguage("ar");
} else {
    strings.setLanguage("en");
}

const headerTitleStyle = {
    textAlign: 'center',
    alignSelf: 'center'
}

export const headerConfiguration = {
    navigationOptions: {
        headerStyle: {
          backgroundColor: Colors.white,
        },
        // headerTintColor: '#fff',
        headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
        },
    },
}

const CategoryStack = StackNavigator({
    Category: {
        screen: CategoryPage,
        navigationOptions: {
            headerTitle: (
                <Image source={wadiNavBarIcon}/>
            ),
        }
    }
}, {
    ...headerConfiguration
});


const HomeStackNav = StackNavigator({
    Home: {
        screen: HomePage,
        navigationOptions: {
            header: null
        }
    },
    CategoryToHome: {
        screen: HomePage,
        navigationOptions: {
            header: null
        }
    },
    // HomeToPdp: {
    //     screen: ProductDetail,
    //     navigationOptions: {
    //         headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>,
    //         headerTintColor: Colors.black,
    //         //header:null,
    //     }
    // },
    // HomeToMultiSeller: {
    //     screen: MultiSeller,
    //     navigationOptions: {
    //         headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>,
    //         headerTintColor: Colors.black,
    //         //header:null,
    //     }
    // },
    // HomeToSizeChart: {
    //     screen: SizeChart,
    //     navigationOptions: {
    //         headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>,
    //         headerTintColor: Colors.black,
    //         //header:null,
    //     }
    // },
    HomeToPlp: {
        screen: ProductList,
        navigationOptions: {
            header: null
        }
    },
    // Filter:{
    //     screen:FilterPage,
    // },
},{
    initialRouteName:"Home",
    ...headerConfiguration
});

const HomeStackPop = StackNavigator({

    ErrorView: {
        screen: ErrorView,
        navigationOptions: {
            title: 'asfadfas',
            tabBarVisible: false
        }
    }


}, {
    ...headerConfiguration
});

const HomeStack = StackNavigator({

    HomeStackNav: {
        screen: HomeStackNav,
        navigationOptions: {
            header: null
        }
    },
    HomeStackPop: {
        screen: HomeStackPop,
        navigationOptions: {
            header: null
        }
    }


}, {mode: 'modal', ...headerConfiguration});


const SearchStack = StackNavigator({
    Search: {
        screen: SearchPage,
        navigationOptions:{
            headerTitle: <Image source={wadiNavBarIcon} style={{ alignSelf: 'center' }} />,
            headerTintColor: Colors.black,
        }
    },
    SearchToPlp: {
        screen: ProductList,
        navigationOptions: {
            header: null
        }
    },
    SearchFilters:{
        screen:SearchFilters,
    },
}, {
    initialRouteName:"Search",
    ...headerConfiguration
    //mode:'modal',
    //headerMode:'none',
});

const CartStack = StackNavigator({
    Cart: {
        screen: CartPage,
        navigationOptions: {
            title: 'SHOPPING BAG',
            headerTintColor: Colors.black
        }
    },
    // CartToCheckout: {
    //     screen: CheckoutPage,
    //     // navigationOptions: {
    //     //     title: 'MY CART'
    //     // }
    // },
    // CartToPdp: {
    //     screen: ProductDetail,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
},{
    initialRouteName:"Cart",
    ...headerConfiguration
    //headerMode:'none',
});

const AccountsStack = StackNavigator(
    {
        Account: {
            screen: AccountsPage,
            navigationOptions: {
                title: strings.MYWADI,
                headerBackTitle: null,
            }

        },
        Country: {
            screen: CountryView,
            navigationOptions: {
                title: strings.Country,
                headerTintColor: Colors.black,
                headerBackTitle: null,
            }

        },
        Language: {
            screen: LanguageView,
            navigationOptions: {
                title: strings.Language,
                //headerMode:'none'
            }

        },
        AccountsToTrackOrder: {
            screen: AccountsPage,
            navigationOptions: {
                title: strings.MYWADI,
                headerTintColor: Colors.black,
                headerBackTitle: null,
            }
        },
        AccountsWebView: {
            screen: AccountsPageWebView,
            headerBackTitle: null,
        },
        AccountsAddressScreen: {
            screen: AddressBookScreen,
            navigationOptions: {
                title: strings.AddressBook,
                headerTintColor: Colors.black,
                headerBackTitle: null,
            }
        },
        AccountsAddressEditScreen: {
            screen: AddressEditScreen,
            navigationOptions: {
                title: strings.EditAddress,
                headerTintColor: Colors.black,
                headerBackTitle: null,
            }
        },
        Wallet:
        {screen: WalletPage,
            navigationOptions: {
            title: strings.Wallet,
            headerTintColor: Colors.black,
            headerBackTitle: null,
        }},
        // AccountsAddressScreen: {
        //     screen: AddressBookScreen,
        //     navigationOptions: {
        //         title: strings.AddressBook,
        //     }
        // },
        // AccountsAddressEditScreen: {
        //     screen: AddressEditScreen,
        //     navigationOptions: {
        //         title: strings.EditAddress,
        //     }
        // }
        MyOrdersScreen: {
            screen: MyOrders,
            navigationOptions: {
                title: strings.MyOrders,
                headerTintColor: Colors.black,
                headerBackTitle: null,
            }
        },
        OrderDetailsScreen: {
            screen: OrderDetails,
            navigationOptions: {
                title: strings.MyOrders,
                headerTintColor: Colors.black,
                headerBackTitle: null,
            }
        },
        CreditCardScreen: {
            screen: CreditCardScreen,
            navigationOptions: {
                title: strings.CreditCardScreen,
                headerTintColor: Colors.black,
                headerBackTitle: null,
            }
        }

    },
    {
        mode: 'card',
        transitionConfig: () => androidStackAnimation(), //calls the stack animation required for android
        initialRouteName:"Account",
        ...headerConfiguration
        //headerMode:'none',
    }
);


export const LoginStack = StackNavigator(
    {
        InitialScreen: {
            screen: Authentication,
            navigationOptions: {
                headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>
            }
        },

        Login: {
            screen: LoginPage,
            navigationOptions: {
                headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>
            }
        },
        SignUp: {
            screen: SignupScreen,
            navigationOptions: {
                headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>
            }
        },
        EnterMobile: {
            screen: PhoneScreen,
            navigationOptions: {
                headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>
            }
        },
        EnterOTP: {
            screen: OTPScreen,
            navigationOptions: {
                headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>
            }
        },
        EnterPassword: {
            screen: PasswordScreen,
            navigationOptions: {
                headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>
            }
        },
        ForgotPassword: {
            screen: ForgotPasswordScreen,
            navigationOptions: {
                headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>
            }
        },
        SignupSuccess: {
            screen: SignupSuccessScreen,
            navigationOptions: {
                headerTitle: <Image source={wadiNavBarIcon} style={{alignSelf: 'center'}}/>
            }
        }

    },
    {
        mode: 'card',
        transitionConfig: () => androidStackAnimation(), //calls the stack animation required for android
        initialRouteName: 'InitialScreen',
        cardStyle: { shadowColor: 'transparent' },
        ...headerConfiguration,
    }
);

const AccountsStackModal = StackNavigator({
        AccountsStack: {
            screen: AccountsStack

        },
        LoginStack: {
            screen: LoginStack,
            navigationOptions: {
                tabBarVisible: false
            }
        },
    },
    {
        headerMode: 'none',
        mode: 'modal',
        ...headerConfiguration
    }
);


const tabNavigatorConfig = {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        showIcon: true,
        showLabel: false,
        tabStyle: {
            height: 40
        },
        style: {
            backgroundColor: '#fff',
        },
        iconStyle: (Platform.OS ==="android")?{ width: 70}:undefined,
    },
    initialRouteName: 'Home',
    mode: 'card',
    lazy:true,
}

const Tabs = TabNavigator({
     Home: {
        screen: HomeStack,
        navigationOptions: {
            tabBarIcon: ({tintColor, focused}) => (
                <Image
                    size={38}
                    source={focused ? HomeSelIcon : HomeUnSelIcon}
                />
            ),
        }
    },
    Category: {
        screen: CategoryStack,
        navigationOptions: {
            tabBarIcon: ({tintColor, focused}) => (
                <Image
                size={48}
                    source={focused ? CategorySelIcon : CategoryUnSelIcon}
                />
            ),
        }
    },
    Search: {
        screen: SearchStack,
        navigationOptions: {
            tabBarIcon: ({tintColor, focused}) => (
                <Image
                size={58}
                    source={focused ? SearchSelIcon : SearchUnSelIcon}
                />
            ),
        }
    },
    Cart: {
        screen: CartStack,
        navigationOptions:({ screenProps }) => ({
            tabBarIcon: ({tintColor, focused}) => (
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Image
                    size={18}
                        source={focused ? CartSelIcon : CartUnSelIcon}
                    />
                    <CartBadge badgeStyle={{position:'absolute', top:(Platform.OS ==="ios")?0:-2, right:-12, opacity:1}}/>
                </View>
            ),
        })
    },
    Account: {
        screen: AccountsStackModal,
        navigationOptions: {
            tabBarIcon: ({tintColor, focused}) => (
                <Image
                    source={focused ? AccountSelIcon : AccountUnSelIcon}
                />
            )
        }
    }
}, tabNavigatorConfig);





/*** Below code is for transition stack from right to left FOR ANDROID b*
 * Android doesn't provide by default but IOS RN INCLUDES THIS ***/
const androidStackAnimation = () => ({
    screenInterpolator: sceneProps => {
        const {layout, position, scene} = sceneProps;
        const {index} = scene;

        const translateX = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [layout.initWidth, 0, 0]
        });

        const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index, index + 0.99, index + 1],
            outputRange: [0, 1, 1, 0.3, 0]
        });

        return {opacity, transform: [{translateX}]}
    }
});


export default Tabs;