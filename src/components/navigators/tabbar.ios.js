import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  requireNativeComponent
} from 'react-native';

export default class TabBarView extends Component {

  constructor(props) {
   super(props);
   this.state = {
      selectedTab: 'redTab',
      notifCount: 0,
    };
  }


  _renderContent(color: string, pageText: string, num?: number) {

    return <View/>;

  }
  render() {

    return (
      <TabBarIOS
          unselectedTintColor="yellow"
          tintColor="white">
          <TabBarIOS.Item
            icon={require('Wadi/src/Icons/Tabbar/tab_category_unselected.png')}
            selectedIcon={require('Wadi/src/Icons/Tabbar/tab_category_selected.png')}
            renderAsOriginal
            selected={this.state.selectedTab === 'categoryTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'categoryTab',
              });
            }}>
            {this._renderContent('#414A8C', 'Category Tab')}
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={require('Wadi/src/Icons/Tabbar/tab_home_unselected.png')}
            selectedIcon={require('Wadi/src/Icons/Tabbar/tab_home_selected.png')}
            renderAsOriginal
            selected={this.state.selectedTab === 'HomeTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'HomeTab',
              });
            }}>
            {this._renderContent('#414A8C', 'Home Tab')}
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={require('Wadi/src/Icons/Tabbar/tab_search_unselected.png')}
            selectedIcon={require('Wadi/src/Icons/Tabbar/tab_search_selected.png')}
            renderAsOriginal
            selected={this.state.selectedTab === 'searchTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'searchTab',
              });
            }}>
            {this._renderContent('#414A8C', 'search Tab')}
          </TabBarIOS.Item>
          <TabBarIOS.Item
          icon={require('Wadi/src/Icons/Tabbar/tab_bag_unselected.png')}
          selectedIcon={require('Wadi/src/Icons/Tabbar/tab_bag_selected.png')}
          renderAsOriginal
            badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
            selected={this.state.selectedTab === 'cartTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'cartTab',
                notifCount: this.state.notifCount + 1,
              });
            }}>
            {this._renderContent('#783E33', 'cart Tab', this.state.notifCount)}
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={require('Wadi/src/Icons/Tabbar/tab_profile_unselected.png')}
            selectedIcon={require('Wadi/Icons/Tabbar/tab_profile_selected.png')}
            renderAsOriginal
            selected={this.state.selectedTab === 'accountTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'accountTab'
              });
            }}>
            {this._renderContent('#21551C', 'account Tab')}
          </TabBarIOS.Item>
        </TabBarIOS>
    );
  }
}
