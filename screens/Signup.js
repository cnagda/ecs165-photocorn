import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import * as firebase from 'firebase';

import 'firebase/firestore';

export default class Signup extends React.Component {
  state = { email: '', password: '', errorMessage: null, isSignedUp: false }

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
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <View style={{margin:10}}>
            <Button title="Sign Up" onPress={this.handleSignUp} />
          </View>
          <View style={{margin:10}}>
            <Button
              title="Already signed up? Log In"
              onPress={() => this.props.navigation.navigate('Login')}
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
