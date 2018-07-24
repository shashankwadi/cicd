import * as config from '../utilities/namespaces/config';

const images = {
	feedbackIcon: require('./accounts/icon-feedback.png'),
	rateIcon: require('./accounts/icon-rate.png'),
    settingsIcon: require('./accounts/icon-settings.png'),
	trackIcon: require('./accounts/icon-track.png'),
    walletIcon: require('./accounts/Wallet.png'),
    orderIcon: require('./accounts/Order.png'),
	signInIcon: require('./accounts/Signin.png'),
	logoutIcon: require('./accounts/Signout.png'),
	bahrainIcon: require('./country/Bahrain.png'),
	omanIcon: require('./country/Oman.png'),
	kuwaitIcon: require('./country/Kuwait.png'),
	lebanonIcon: require('./country/Lebanon.png'),
	qatarIcon: require('./country/Qatar.png'),
	saIcon: require('./country/Saudi-Arabia.png'),
	uaeIcon: require('./country/uae.png'),
	downArrow: require('./navbar/arrow-down.png'),
	groceryBanner: require('./accounts/groceryBanner.png'),
	facebookImage: require('./accounts/fb.png'),
	googleImage: require('./accounts/google.png'),
	//mailImage: require('./accounts/mail.png'),
	checkMark: require('./accounts/icon-check.png'),
	errorGif: require('./general/static.gif'),

	starFilled: require('./product/filledStar.png'),
	starHalf: require('./product/halfStar.png'),
	starEmpty: require('./product/icon-rate.png'),
	star_white: require('./product/star.png'),
	gridSwitchCell: require('./general/switchIcon.png'),
	listSwitchCell: require('./general/listWitch.png'),
	singleSwitchCell: require('./general/singleSwitch.png'),
	star_black: require('./product/blackStar.png'),
	//sort icons
	sortIcon:require('./SortIcons/new/new.png'),

	//splash screen
    splashScreeni4:require('./splashScreen/iphone4LaunchImage.png'),
    splashScreeni5:require('./splashScreen/iphone5LaunchImage.png'),
    splashScreeni6:require('./splashScreen/iphone6LaunchImage.png'),
    splashScreeni6plus:require('./splashScreen/iphone6plusLaunchImage.png'),
    splashScreeniX:require('./splashScreen/iphoneXLaunchImage.jpg'),

	splashScreeni4_grocery:require('./splashScreen/grocery_640-x-960-En.png'),
    splashScreeni5_grocery:require('./splashScreen/gorcery_640-x-1136_EN.png'),
    splashScreeni6_grocery:require('./splashScreen/grocery_750-x-1334_En.png'),
    splashScreeni6plus_grocery:require('./splashScreen/grocery_1242-x-2208_En.png'),
    splashScreeniX_grocery:require('./splashScreen/grocery_1125-x-2436_En.png'),
	
    splashGroceryAndroid: require('./splashScreen/splash_grocery.png'),
    loadingGif: config.isGrocery?require('./loading-icon.gif'):require('./green-loading-icon.gif'),


	Gift:require('../icons/cart/Gift.png'),
	Truck:require('../icons/cart/Truck.png'),
	Trash:require('../icons/cart/Trash.png'),
	EmptyBagIcon:require('../icons/cart_empty/EmtyBagIcon.png'),
};

export default images;