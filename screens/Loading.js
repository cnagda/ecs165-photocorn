import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as firebase from 'firebase';


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
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})