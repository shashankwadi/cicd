'use strict';

import React from 'react';
import {
  View, StyleSheet, ActivityIndicator, Modal
} from 'react-native';
import PropTypes from 'prop-types';

const LoadingOverlay = ({ isLoading }) => {
  if (isLoading) {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => { alert("Modal has been closed.") }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator
            animating={true}
            style={[{ height: 80 }]}
            size="large"
          />
        </View>
      </Modal>);
  }
  return null;
}

LoadingOverlay.propTypes = {
  isLoading: PropTypes.bool,
};

LoadingOverlay.defaultProps = {
  isLoading: false,
};

export default LoadingOverlay;