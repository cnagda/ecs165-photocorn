import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
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
        .then(() => this.props.navigation.navigate('HomeScreen'))
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
            <View style={{margin: 10}}>
                <Button
                    title="Login" color= '#f300a2'
                    onPress={this.handleLogin}
                />
            </View>
            <View stye={{margin: 10}}>
                <Button
                    title="No account? No problem. Sign Up" color= '#f300a2'
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
    },

    title: {
        color: COLOR_LGREY,
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
