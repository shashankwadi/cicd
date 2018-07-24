import LocalizedStrings from 'react-native-localization';

// CommonJS syntax
// let LocalizedStrings  = require ('react-native-localization');

let strings = new LocalizedStrings({
    en: {
        ApplePay: "Apple Pay test",
        Country: "Country & Language",
        AppInfo: "App Info",
        RateApp: "Rate the App",
        TrackOrder: "Track Your Order",
        SendFeedback: "Send Feedback",
        SignIn: "Log In / Sign Up",
        MyAccount: "Sign Out",
        MyWallet: "My Wallet",
        MyOrders: "My Orders",
        Logout: "Logout",
        MYWADI: "MY WADI",
        Language: "Language",
        APPLY: "APPLY",
        //accounts related strings
        ServerError: 'Something went wrong please try again',
        Error: 'Error',
        OtpVerifyError: 'OTP did not match please try again',
        Email: 'Email',
        SignInPageHeading: 'Sign In',
        Facebook: 'Facebook',
        Google: 'Google',
        Or: 'OR',
        Password: 'Password',
        ForgotPassword: 'Forgot Password?',
        CreateAccount: 'Create a New Account',
        EnterEmailError: 'Please enter your email address',
        EnterMobileError: 'Please enter a valid number',
        EnterValidName: 'Please enter valid Name',
        EnterValidOTPCode: 'Enter a valid code',
        EnterValidPassword: 'The password should contain 6 or more characters',
        RegistrationFailed: 'Registration Failed!',
        AuthenticationFailed: 'Authentication failed! ',
        SignUpPageHeading: 'Sign Up',
        Name: 'Name',
        AlreadyHaveAnAccount: 'Already have an account?',
        ContinueShopping: 'Continue Shopping',
        SignUpSuccessHeading: 'SignUp Success',
        PhonePageOneStepText: 'You are one step away from creating your new account! Please verify your phone.',
        PhonePageEmailPlaceholder: 'E-mail: ',
        Phone: 'Phone #',
        EnterValidConfirmPassword: 'Your password and confirm password does not match',
        PhoneVerified: 'Phone Verified!',
        PhoneNotVerified: 'Phone not Verified!',
        ConfirmPassword: 'Confirm Password',
        SkipPhone: 'Verify your number to help us deliver your order faster',
        EnterOTPHeading: 'Enter OTP',
        OTPPagePhonePlaceholder: 'Phone: ',
        OTPVerificationText: 'Enter 4 digit verification code',
        RetryOTPText: 'You can retry in:',
        ReceiveCodeOnCallText: 'Receive Code on Call',
        ResendSMS: 'Resend SMS',
        ContinueWithoutVerifyingPhone: 'Continue without verifying phone number',
        ForgotPasswordHeading: 'Request New Password',
        ResetMyPassword: 'Reset my password',
        FrequentlyBoughtTogether:"FREQUENTLY BOUGHT TOGETHER",
        SimilarProducts:"SIMILAR PRODUCTS",
        ADDNOW:"ADD NOW",
        AlreadyAddedToYourCart:"Already added to your cart",
        ComboPrice:"Combo price: ",
        AddToCart: "ADD TO CART",
        SelectItemsToBuyTogether:"Select items to buy together",
        AddressBook: "Address book",
        EditAddress: "Edit Address",
        ViewCart:'View Cart',
        OutOfStcok:'Out of Stock',
        CHECKOUT: "SECURE CHECKOUT",
        AlreadyInCart: "CHECKOUT NOW",
        TrendingSearches:'Trending Searches',
        CreditCardScreen: "Credit Cards",
        Wallet:"Wallet",
        EnterYourDetailsForNewAccount: 'Enter your details for new account',
        VerificationCodeSentToYourPhone: 'A verification code sent to your phone',
        WadiExpress:'Express',
        UnitsLeft:'Units Left',
        English: 'ENGLISH',
        Arabic:'ARABIC',
        SearchText:'What are you searching for ?',
        View_all:'VIEW ALL',
        offText:'% OFF',
        shippingTo:'Shipping To:',
        Size:'Size:',
        Color:'Color:',
        Quantity:'Quantity:',
        Search:'Search',
        Cancel:'Cancel',
        ChangeCity:'Change City',
        OFFER:'OFFER',
        GENERALFEATURES:'GENERAL FEATURES',
        KEYHIGHLIGHTS:'KEY HIGHLIGHTS',
        SOLDBY:'SOLD BY: ',
        DESCRIPTION:'DESCRIPTION',
        Welcome:'Welcome',
        Unit:'Unit',
        Left:'left',
        EndsIn:'Ends In:',
        Save:'SAVE',
        Free:'FREE',
        Sort: 'Sort',
        ChangeLocation: 'Change location',
        GiftWrap:"Gift wrap available",
        ViewSubTotals:'View Subtotals',
        ApplyFilters:'Apply Filters',
        ClearFilters: 'Clear Filters',
        WAS_PRICE_TEXT: 'Was',
        SAVE_TEXT: 'You save',
        shopping_bag_empty_msg:"Your shopping bag is empty.\nTo add products to shoping bag go to product feed, select desired product and click add to bag button.",
        go_to_products:'GO TO PRODUCTS',
        BasedOn:'Based on',
        Reviews:'Reviews',
        ExpertReviews:'Expert Reviews',
        UserReviews:'User Reviews',
        LoadMoreReviews:'Load More Reviews',
        EnterLocation:'Enter your location',
        ComingSoon:'Coming soon in your city',
        unavailableInCity:'Currently we are not present in your city',
        app_error:"Something went wrong, please try again",
        retry:"Retry",
        splashText: "No queue for you!",
        "What_are_you_searching_for":"What are you searching for ?",
        shipping_in: "Shipping in",
        OutOfStockProductUpdatingCart: "Some products are out of stock, so we are updating your cart",
        OK: "OK",
        citySelectionHeader:'Select City for Delivery',
        Jeddah:'Jeddah',
        Dammam:'Dammam',
        Riyadh:'Riyadh',
        comingSoonInMoreCities:'Coming soon to your city',
        continue:'Continue',
        network_check: 'Please check your internet connection',
        network_check_retry: 'Tap to reload'

    },
    ar: {
        Country: "البلد",
        AppInfo: "معلومات عن التطبيق",
        RateApp: "قيم التطبيق",
        TrackOrder: "تتبع طلبيتك",
        SendFeedback: "ارسل تقييم",
        SignIn: "تعذر تسجيل الدخول",
        MYWADI: "واديَّ",
        Language: " التطبي",
        APPLY: "خصص لغرض ",

        //accounts string
        ServerError: 'حدث خطأ، يرجى المحاولة مرة أخرى',
        Error: 'حدث خطأ',
        OtpVerifyError: 'لم تتطابق كلمة السر المؤقتة، الرجاء المحاولة مرة أخرى.',
        Email: 'البريد الإلكتروني',
        SignInPageHeading: 'سجن إن',
        Facebook: 'فايسبوك',
        Google: 'جوجل',
        Or: 'أر',
        Password: 'كلمة السر',
        ForgotPassword: 'هل نسيت كلمة السر؟',
        CreateAccount: 'انشاء حساب',
        EnterEmailError: 'يرجى ادخال بريدك الالكتروني',
        EnterMobileError: 'يرجى إدخال رقم هاتف صحيح',
        EnterValidName: 'الرجاء إدخال اسم صحيح',
        EnterValidOTPCode: 'أدخل رمز فعال',
        EnterValidPassword: 'كلمة السر يجب ان تحتوي على 6 احرف على الاقل',
        RegistrationFailed:'لم تتم عملية التسجيل!',
        AuthenticationFailed: 'لم تتم بنجاح عملية التوثيق! ',
        SignUpPageHeading: 'سجن أب',
        Name: 'الإسم',
        AlreadyHaveAnAccount: 'هل لديك حساب؟',
        ContinueShopping: 'بالتسوق الاستمرار',
        SignUpSuccessHeading: 'تم إنشاء حساب بنجاح',
        PhonePageOneStepText: 'انت على بعد خطوة واحدة من انشاء حسابك الجديد! يرجى تفعيل رقم هاتفك.',
        PhonePageEmailPlaceholder: 'إيميل:',
        Phone: 'رقم الهاتف',
        EnterValidConfirmPassword: 'لمة مرورك لا تتطابق مع الكلمة المدرجة للتأكيد',
        PhoneVerified: 'تم تفعيل رقم الهاتف',
        PhoneNotVerified: 'لم يتم التحقق من رقم هاتفك!',
        ConfirmPassword:'تأكيد كلمة المرور',
        SkipPhone: 'تحقق من رقم هاتفك لتساعدنا في توصيل طلبك بشكل أسرع',
        EnterOTPHeading: 'إنتر عتب',
        OTPPagePhonePlaceholder: 'فن: ',
        OTPVerificationText: 'يرجى إدخال رمز التفعيل المكون من ٤ خانات',
        RetryOTPText: 'تستطيع إعادة المحاولة:',
        ReceiveCodeOnCallText: 'استقبال الرمز بمكالمة هاتفية',
        ResendSMS: 'عادة إرسال الرمز',
        ContinueWithoutVerifyingPhone: 'أكمل عملية الشراء بدون التحقق من رقم الهاتف',
        ForgotPasswordHeading: 'طلب كلمة مرور جديدة',
        ResetMyPassword: 'تغيير كلمة السر',
        MyWallet: "محفظتي",
        MyOrders: "طلباتي",
        Logout: "خروج",
        FrequentlyBoughtTogether:"يتم شرائها عادةً مع بعضها البعض‎",
        SimilarProducts:"منتجات مشابهة",
        ADDNOW:"أضفها الآن",
        AlreadyAddedToYourCart:"لقد تمت إضافتها بالفعل إلى عربتك",
        ComboPrice:"سعر المجموعة:",
        AddToCart:"اضف الى حقيبة التسوق",
        SelectItemsToBuyTogether:"اختر المنتجات لتشتريها معاً",
        AddressBook: "دفتر العناوين",
        EditAddress: "تعديل العنوان",
        ViewCart:'عرض حقيبة التسوق',
        OutOfStcok:'غير متوفر',
        CHECKOUT: "الدفع الآمن‎",
        AlreadyInCart:"المنتج مضاف إلى سلتك",
        TrendingSearches:'لأكثر بحثاً',
        CreditCardScreen: "بطاقة الائتمان",
        Wallet:"المحفظة",
        EnterYourDetailsForNewAccount: 'أدخل معلوماتك للحساب الجديد',
        VerificationCodeSentToYourPhone: 'تم إرسال رقم التفعيل لهاتفك',
        WadiExpress:'اكسبرس',
        UnitsLeft:'وحدة متبقية',
        English: 'ENGLISH',
        Arabic:'اللغة العربية',
        SearchText:'ما الذي تبحث عنه؟',
        View_all:'ما الذي تبحث عنه؟',
        offText:'خصم %',
        shippingTo:'الشحن إلى:',
        Size:'المقاس:',
        Color:'اللون:',
        Quantity:'الكمية:',
        Search:'ابحث',
        Cancel:'إلغاء',
        ChangeCity:'تغيير المدينة',
        OFFER:'عرض',
        GENERALFEATURES:'خصائص عامة',
        KEYHIGHLIGHTS:'المميزات الرئيسية',
        SOLDBY:'البائع: ',
        Welcome:'أهلاً',
        Unit:'وحدة',
        Left:'متبقية',
        EndsIn:'ينتهي في:',
        Save:'SAVE',
        Free:'FREE',
        Sort: 'Sort',
        ChangeLocation: 'Change location',
        GiftWrap:'تغليف الهدايا متاح‎',
        ViewSubTotals:'عرض المجاميع الفرعية',
        ApplyFilters:'Apply Filters',
        ClearFilters: 'Clear Filters',
        WAS_PRICE_TEXT: 'Was',
        SAVE_TEXT: 'You save',
        shopping_bag_empty_msg :"حقيبة التسوق فارغة. لإضافة منتج، يرجى الذهاب إلى صفحة المنتجات واختيار أي منتج ترغب به، ثم اضغط على  أضف إلى حقيبة التسوق",
        go_to_products:'اذهب إلى المنتجات',
        BasedOn:'Based on',
        Reviews:'Reviews',
        ExpertReviews:'Expert Reviews',
        UserReviews:'User Reviews',
        LoadMoreReviews:'Load More Reviews',
        EnterLocation: "أدخل موقعك",
        ComingSoon:'Coming soon in your city',
        unavailableInCity:'Currently we are not present in your city',
        app_error:"حدث خطأ، يرجى المحاولة مرة أخرى",
        retry:'إعادة المحاولة',
        splashText: "ماله داعي توقف بالطابور!",
        "What_are_you_searching_for":"ما الذي تبحث عنه؟",
        shipping_in:"تسوق في",
        OutOfStockProductUpdatingCart: "Some products are out of stock, so we are updating your cart",
        OK: "OK",
        citySelectionHeader:'اختر المدينة للتوصيل ',
        Jeddah:'أبراج',
        Dammam:'الدمام',
        Riyadh:'الرياض',
        comingSoonInMoreCities:'اختر المدينة للتوصيل ',
        continue:'استمرار',
        network_check: 'يرجى التحقق من إتصالك بشبكة الإنترنت',
        network_check_retry: 'اضغط لإعادة التحميل‎'

    }
});


module.exports = {
    strings: strings,
};