

'use strict';
import React, { Component } from 'react';

import { dimensions } from 'utilities/utilities';
import HTMLView from 'react-native-htmlview';

export default class RichHtml extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
         <HTMLView
            value={this.props.widgetData.data}
      />
    );
  }
}