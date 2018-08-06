/* This is the Root component mainly initializes Redux */

import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from './features/home/App';
import DefaultPage from './features/home/DefaultPage';

export default class Root extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routeConfig: PropTypes.array.isRequired,
  };
  render() {
    return (
      <Provider store={this.props.store}>
        <App>
          <DefaultPage />
        </App>
      </Provider>
    );
  }
}
