/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import * as Sentry from '@sentry/react-native';

import { Navigation } from 'react-native-navigation';

Sentry.init({ 
  dsn: 'https://d870ad989e7046a8b9715a57f59b23b5@o447951.ingest.sentry.io/5428561', 
  debug: true,
  tracesSampleRate: 1,
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation: new Sentry.ReactNativeNavigationInstrumentation(
        Navigation,
      )
    }),
  ],
});

class MyInnerComponent extends React.Component {
  render() {
    return (
      <Text>My Inner component!</Text>
    );
  }
}

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myReference = React.createRef();
  }
  render() {
    // warn: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
    const MyWrappedInnerComponent = Sentry.withProfiler(MyInnerComponent);
    // without Sentry.withProfiler does not warn
    // const MyWrappedInnerComponent = MyInnerComponent;
    return (
      <MyWrappedInnerComponent ref={this.myReference}/>
    );
  }
}

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.myReference = React.createRef();
  }

  render() {
    return (
      <View>
        <Text>Demo Module Screen</Text>
        <MyComponent ref={this.myReference}/>
      </View>
    );
  }
}

Navigation.registerComponent('Screen', () => Screen);

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Screen'
            }
          }
        ]
      }
    }
  });
});

// using Sentry.wrap gives you ui.react.mount spans
export default Sentry.wrap(Screen);
// export default Screen;
