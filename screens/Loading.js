import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';


export default class Loading extends React.Component {
    // authenticate user
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'HomeScreen' : 'Signup')
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Welcome</Text>
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
