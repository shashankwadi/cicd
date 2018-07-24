
'use strict';

/*    DOCS     */

/* Add common constants here and enums & urls in the subConstant-files */
/*        USAGE
add "import * as CONSTANT from 'Wadi/utilites/constants';"


*/

import * as API_URL from 'Wadi/src/utilities/namespaces/apiUrls';
import * as API_REQUEST_KEYS from 'Wadi/src/utilities/namespaces/apiRequestKeys';
import * as API_RESPONSE_KEYS from 'Wadi/src/utilities/namespaces/apiResponseKeys';
import * as ENUM from 'Wadi/src/utilities/namespaces/enums';
import * as MESSAGES from 'Wadi/src/utilities/namespaces/messages';
import * as API_HEADERS from 'Wadi/src/utilities/namespaces/headers';
import * as FONTS from 'Wadi/src/utilities/namespaces/fonts';
import * as COLORS from 'Wadi/src/utilities/namespaces/colors';
import * as WADI_STYLES from 'Wadi/src/utilities/namespaces/colors';
import * as CONFIG from 'Wadi/src/utilities/namespaces/config';
import * as DIMENSIONS from 'Wadi/src/utilities/namespaces/dimensions'

module.exports = {
	API_URL: API_URL,
	API_REQUEST_KEYS: API_REQUEST_KEYS,
	API_RESPONSE_KEYS: API_RESPONSE_KEYS,
	API_HEADERS : API_HEADERS,
	ENUM : ENUM,
	MESSAGES: MESSAGES,
	FONTS: FONTS,
	COLORS: COLORS,
	WADI_STYLES: WADI_STYLES,
    CONFIG: CONFIG,
    DIMENSIONS: DIMENSIONS,
};
