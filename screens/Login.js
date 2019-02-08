import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import * as firebase from 'firebase';
import 'firebase/firestore';


export default class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null }

    handleLogin = () => {
        const { email, password } = this.state
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => this.props.navigation.navigate('HomeScreen'))
        .catch(error => this.setState({ errorMessage: error.message }))
    }

    render() {
        return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
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
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
            />
            <View style={{margin: 10}}>
                <Button
                    title="Login"
                    onPress={this.handleLogin}
                />
            </View>
            <View stye={{margin: 10}}>
                <Button
                    title="No account? No problem. Sign Up"
                    onPress={() => this.props.navigation.navigate('Signup')}
                />
            </View>
        </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },

    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        paddingTop: 10,
    },

    title: {
        fontSize: 20,
    },
})
