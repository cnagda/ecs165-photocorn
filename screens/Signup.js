import React from 'react';
import { Header } from 'react-navigation';
import { StyleSheet, ScrollView, Text, TextInput, KeyboardAvoidingView, View, Button } from 'react-native';
import { ImagePicker } from 'expo';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';

export default class Signup extends React.Component {
  // initialize state
  state = { email: '', password: '', errorMessage: null, isSignedUp: false, image: null, isFocused: false }

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
              return {borderColor: 'gray', borderWidth: 1}
          default:
              return {borderColor: 'green', borderWidth: 3}
      }
  }

    handleSignUp = () => {
        const { email, password, firstname, lastname, dob } = this.state
        firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function(user) {
            var user = firebase.auth().currentUser;
            console.log("user: " + user)
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
                .catch(error => {console.log(error.message)})
    }

    pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            base64: true,
        });

        if (!result.cancelled) {
            this.setState({image: result.uri,});
        }
    };

    //todo: make birthday a date picker

//todo: make birthday a date picker
  render() {
    console.log("inside signup render " + this.state.isSignedUp + " - " + this.state.email);
    if (this.state.isSignedUp && firebase.auth().currentUser!== null) {
      return (
        this.props.navigation.navigate('HomeScreen')
      )
    }
      return (
          <View style={styles.container}>
          <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset = {Header.HEIGHT + 30}
          behavior="padding"
          enabled
          >
          <ScrollView
          width='100%'
          contentContainerStyle={{ alignItems: "center", marginTop:40, }}
          >
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            placeholder="First Name"
            autoCapitalize="words"
            style={styles.textInput}
            onChangeText={firstname => this.setState({ firstname })}
            value={this.state.firstname}
          />
          <TextInput
            placeholder="Last Name"
            autoCapitalize="words"
            style={styles.textInput}
            onChangeText={lastname => this.setState({ lastname })}
            value={this.state.lastname}
          />
          <TextInput
            placeholder="Birthday"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={dob => this.setState({ dob })}
            value={this.state.dob}
          />
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            style={[styles.textInput, this.getPasswordStrength(this.state.password.length),
            ]}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          </ScrollView>
          </KeyboardAvoidingView>
          <View style={{margin:10}}>
            <Button title="Sign Up" onPress={this.handleSignUp} />
          </View>
          <View style={{margin:10}}>
            <Button
              title="Already signed up? Log In"
              onPress={() => this.props.navigation.navigate('Login')}
            />
          </View>
          <View style={{margin:10}}>
              <Button title="Image Upload"
              onPress={this.pickImage}/>
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
        borderColor: COLOR_DGREY,
        borderWidth: 1,
        color: COLOR_LGREY,
        marginTop: 20,
    },

    title: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
