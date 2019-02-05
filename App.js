import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import * as firebase from 'firebase';
import { createStackNavigator, createAppContainer } from 'react-navigation'

import Login from './screens/Login';
import Signup from './screens/Signup';
import Loading from './screens/Loading';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';

//expo note: If LAN doesn't work, look at your Wifi IPv4 and set it using
//set REACT_NATIVE_PACKAGER_HOSTNAME=<IPv4>
//but for some reason this only seems to work at my house and on campus I have to use a tunnel
//I also often connect my device physically

// Sources:
// https://github.com/faahmad/react-native-firebase-auth

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDv2e6dTo4qtQhJ4X5XgT3Wr6TzBbrXorg",
    authDomain: "expo-insta-app.firebaseapp.com",
    databaseURL: "https://expo-insta-app.firebaseio.com",
    projectId: "expo-insta-app",
    storageBucket: "expo-insta-app.appspot.com",
    messagingSenderId: "713043675850"
  };
  firebase.initializeApp(config);




const MainStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    Loading: Loading,
    Login: Login,
    Signup: Signup,
    CameraScreen: CameraScreen,
  },
  {
    initialRouteName: 'Loading',
  }
);

const AppContainer = createAppContainer(MainStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
