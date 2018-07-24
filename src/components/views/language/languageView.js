import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  I18nManager,
  Image
} from 'react-native';

import * as prefs from 'Wadi/src/utilities/sharedPreferences';
import { strings } from 'utilities/uiString';
import images from 'assets/images';

export default class LanguageView extends Component {

  constructor(props) {
    super(props);
    var language;
    if (I18nManager.isRTL == true) {
      language = "ar"
    } else {
      language = "en"
    }
    this.state = {language:language}

  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <FlatList style={{ marginTop: 30 }}
          enableEmptySections={true}
          removeClippedSubviews={false}
          ItemSeparatorComponent={({ highlighted }) => (<View style={[styles.separator, highlighted && { marginLeft: 0 }]} />)}
          data={[{ key: 'English', code: 'en' }, { key: 'Arabic', code: 'ar' }]}
          renderItem={({ item }) => <TouchableOpacity activeOpacity ={1} style={styles.container}
            onPress={() => this.onPressItem(item)}>

            <Text style={styles.text}>
              {item.key.toUpperCase()}
            </Text>
            {this.state.language == item.code && <Image style = {styles.checkMark} source={images.checkMark} />}
          </TouchableOpacity>}
        />
        <TouchableOpacity activeOpacity ={1} style={styles.applyContainer}
          onPress={() => this.applyLanguage()}>

          <Text style={styles.applyButton}>
            {strings.APPLY}
            </Text>

        </TouchableOpacity>
      </View>
    );
  }


  onPressItem(item) {
    this.setState({language:item.code})
  }
  applyLanguage() {



    prefs.setLanguage(this.state.language).then(resultValue => {

    })
      .catch(e => console.error(e));

  }

}

const styles = StyleSheet.create({
  /*
   * Removed for brevity
   */
  separator: {

    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 50,
    flex:1,
  },
  applyContainer: {
    justifyContent: 'center',
    backgroundColor: 'green',
    height: 50,
    marginBottom: 0
  },
  checkMark: {
     marginTop: 15,
    width:18,
    height:15,
    marginRight: 10,
  },
  text: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
    marginTop: 12
  },

  applyButton: {
    textAlign: 'center',
    backgroundColor: 'green',

    fontSize: 16,
    padding: 0
  },

});
