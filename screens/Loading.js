import React from 'react'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import {
  ActivityIndicator,
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';


export default class Loading extends React.Component {
    // authenticate user
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // this.props.navigation.navigate('HomeScreen', {user: user})
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'HomeScreen', params: {user: user} })],
                });
                this.props.navigation.dispatch(resetAction);
            } else {
                this.props.navigation.navigate('Signup')
            }

        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textMainTwo}>Loading</Text>
                <ActivityIndicator size="large" color="#ffffff"/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_BACKGRND,
    },
    textMainTwo: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
