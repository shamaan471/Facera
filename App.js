import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
<<<<<<< HEAD

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
=======
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import authReducer from './store/reducers/auth';  ////////////////////////
import friendReducer from './store/reducers/friends';
import { LogBox } from 'react-native';
///////////---------------
LogBox.ignoreLogs(['Setting a timer'])
LogBox.ignoreLogs(['VirtualizedLists'])

//combine the reducers
const rootReducer = combineReducers({
  auth: authReducer,
  friend: friendReducer
  //other reducers

});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store = {store}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  )
>>>>>>> addFriend
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
