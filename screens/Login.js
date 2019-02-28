import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Button } from 'native-base'
import * as firebase from 'firebase';
import 'firebase/firestore';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';

export default class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null }

    handleLogin = () => {
        const { email, password } = this.state
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => this.props.navigation.navigate('HomeScreen', {refresh: true}))
        .catch(error => this.setState({ errorMessage: error.message }))
    }

    render() {
        return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholderTextColor='#f300a2'
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Email"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
            />
            <TextInput
                secureTextEntry
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Password"
                placeholderTextColor='#f300a2'
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
            />
            <View style={{marginTop: 30}}>
                <Button style={{backgroundColor: '#f300a2', width: 130, justifyContent: 'center'}} onPress={this.handleLogin}>
                    <Text style={{color: 'white'}}>Login</Text>
                </Button>
            </View>
            <View stye={{margin: 0}}>
                <Button transparent onPress={() => this.props.navigation.navigate('Signup')}>
                    <Text style={{color: '#f300a2'}}>No account? Sign up here.</Text>
                </Button>
            </View>
        </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_BACKGRND,
    },

    textInput: {
        height: 40,
        width: 300,
        color: COLOR_PINK,
        marginTop: 20,
        backgroundColor: COLOR_DGREY,
        borderRadius: 12,
        paddingLeft: 10
    },

    title: {
        color: COLOR_LGREY,
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
