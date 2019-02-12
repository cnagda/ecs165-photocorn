import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import * as firebase from 'firebase';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { COLOR_BACKGRND } from './components/commonstyle';

import Login from './screens/Login';
import Signup from './screens/Signup';
import Loading from './screens/Loading';
import HomeScreen from './screens/HomeScreen';
import Profile from './screens/Profile';
import ProfileEdit from './screens/ProfileEdit';


// initialize firebase
var config = {
    apiKey: "AIzaSyDv2e6dTo4qtQhJ4X5XgT3Wr6TzBbrXorg",
    authDomain: "expo-insta-app.firebaseapp.com",
    databaseURL: "https://expo-insta-app.firebaseio.com",
    projectId: "expo-insta-app",
    storageBucket: "expo-insta-app.appspot.com",
    messagingSenderId: "713043675850"
};
firebase.initializeApp(config);


// create a new navigator
const MainStack = createStackNavigator(
    {
        HomeScreen: HomeScreen,
        Loading: Loading,
        Login: Login,
        Signup: Signup,
        Profile: Profile,
        ProfileEdit: ProfileEdit,
    },
    {
        initialRouteName: 'Loading',
        headerMode: 'none',
        defaultNavigationOptions: {
            headerVisible: false,
        },
    }
);

const AppContainer = createAppContainer(MainStack);

export default class App extends React.Component {
    render() {
        return <AppContainer style={{backgroundColor: COLOR_BACKGRND,}}/>;
    }
}
