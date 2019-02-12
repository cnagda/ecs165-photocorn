import React from 'react';
import { Header } from 'react-navigation';
import { StyleSheet, ScrollView, Text, TextInput, KeyboardAvoidingView, View, Button } from 'react-native';
import { ImagePicker } from 'expo';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { uploadPhoto } from '../utils/Photos';

export default class Signup extends React.Component {
    // initialize state
    state = { email: '', password: '', errorMessage: null, isSignedUp: false, image: null, isFocused: false }

    // display password strength based on length
    getPasswordStrength = (passwordLength) => {
        switch (passwordLength) {
            case 5:
            case 4:
                return {borderColor: 'yellow', borderWidth: 3}
            case 3:
            case 2:
            case 1:
                return {borderColor: 'red', borderWidth: 3}
            case 0:
                return {borderColor: COLOR_DGREY, borderWidth: 0}
            default:
                return {borderColor: 'green', borderWidth: 3}
        }
    }

    // set user information in firebase
    handleSignUp = () => {
        // create user
        const { email, password, firstname, lastname, dob } = this.state
        firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function(user) {
            var user = firebase.auth().currentUser;
            console.log("user: " + user)

            // create profile picture
            const uri = "http://i68.tinypic.com/awt7ko.jpg"
            const path = "ProfilePictures/".concat(user.uid, ".jpg");
            uploadPhoto(uri, path);

            // create a user
            firebase.firestore().collection("users").doc(user.uid).set({
                first: firstname,
                last: lastname,
                email: email,
                dob: dob,
                uid: user.uid,
            }).then(function() {
                this.setState({isSignedUp: true});
                console.log("inside set " + user.uid)
            }.bind(this))
                .catch ((error) => {console.error(error);});
            }.bind(this))
                .catch(error => {console.log(error.message)});


    }

    render() {
        console.log("inside signup render " + this.state.isSignedUp + " - " + this.state.email);
        if (this.state.isSignedUp && firebase.auth().currentUser!== null) {
            return (
                this.props.navigation.navigate('ProfileEdit')
            )
        }
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
      return (
          <View style={styles.container}>
          <KeyboardAvoidingView
              style={styles.container}
              keyboardVerticalOffset = {keyboardVerticalOffset}
              behavior="padding"
              enabled
          >
              <ScrollView
                  width='100%'
                  contentContainerStyle={{ alignItems: "center", marginTop:40, paddingBottom:40}}
              >
                  <Text style={styles.title}>Sign Up</Text>
                  <TextInput
                        placeholderTextColor='#f300a2'
                        placeholder="First Name"
                        autoCapitalize="words"
                        style={styles.textInput}
                        onChangeText={firstname => this.setState({ firstname })}
                        value={this.state.firstname}
                  />
                  <TextInput
                        placeholder="Last Name"
                        placeholderTextColor='#f300a2'
                        autoCapitalize="words"
                        style={styles.textInput}
                        onChangeText={lastname => this.setState({ lastname })}
                        value={this.state.lastname}
                  />
                  <TextInput
                        placeholder="Birthday"
                        placeholderTextColor='#f300a2'
                        autoCapitalize="none"
                        style={styles.textInput}
                        onChangeText={dob => this.setState({ dob })}
                        value={this.state.dob}
                  />
                  <TextInput
                        placeholder="Email"
                        placeholderTextColor='#f300a2'
                        autoCapitalize="none"
                        style={styles.textInput}
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                  />
                  <TextInput
                        secureTextEntry
                        placeholderTextColor='#f300a2'
                        placeholder="Password"
                        autoCapitalize="none"
                        style={[styles.textInput, this.getPasswordStrength(this.state.password.length),
                        ]}
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                  />
                  <View style={{marginTop:40}}>
                    <Button title="Create Account" color= '#f300a2' onPress={this.handleSignUp} />
                  </View>
                  <View style={{margin:20}}>
                    <Button
                      title="Already signed up? Log In" color= '#f300a2'
                      onPress={() => this.props.navigation.navigate('Login')}
                    />
                  </View>
              </ScrollView>
          </KeyboardAvoidingView>


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
