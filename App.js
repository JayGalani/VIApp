import React from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

LogBox.ignoreAllLogs(true);

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
