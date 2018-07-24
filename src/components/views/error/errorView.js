
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

import LeftHeaderButton from 'Wadi/src/components/helpers/leftHeaderButton';
import images from 'assets/images';
import { strings } from 'utilities/uiString';

const Left = () => (
  <TouchableOpacity activeOpacity ={1} onPress={this.props.nav} style ={{marginLeft: 5, height: 30, width: 30, alignItems: 'center'}}>
    <Image style ={{flex: 1, resizeMode: 'contain'}}
      source={images.downArrow}
    />
  </TouchableOpacity>
);


export default class ErrorView extends Component {

  static navigationOptions = ({navigation}) => {
    return {

      headerLeft: (
        <LeftHeaderButton nav = {navigation}/>
      )
    }
  }
  render() {

    return <View style={{flex: 1,alignItems: 'center',}}>
      <Image style ={{width:300,height:300}} 
      defaultSource = {images.feedbackIcon}
       source = {images.errorGif}/>
      <View style={{ flex: 1,alignItems:'flex-end', flexDirection: 'row'}}>
        <TouchableOpacity activeOpacity ={1} style={styles.applyContainer}
          onPress={() => this.applyLanguage()}>

          <Text style={styles.applyButton}>
            {strings.APPLY}
            </Text>

        </TouchableOpacity>
        </View>
    </View>
  }

  applyLanguage() {

  this.props.navigation.goBack('');
    this.props.retryRequest();
     
  }
}

const styles = StyleSheet.create({
 
  applyContainer: {
    justifyContent: 'center',
    backgroundColor: 'green',
    height: 50,
    marginBottom: 0,
    flex: 1
  },
  applyButton: {
    textAlign: 'center',
    backgroundColor: 'green',

    fontSize: 16,
    padding: 0
  },

});