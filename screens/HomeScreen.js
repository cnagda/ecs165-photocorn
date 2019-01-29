import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native'
import * as firebase from 'firebase';


export default class HomeScreen extends React.Component {

//state = { currentUser: null, name: null }
constructor(props) {
  super(props);
  this.state = {currentUser: null, name: "user", isLoading: true}

}

componentDidMount() {
firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(doc) {
    console.log("inside get " + firebase.auth().currentUser.uid)
    this.setState({currentUser: firebase.auth().currentUser, name: doc.data().first, isLoading: false});
  }.bind(this)).catch ((error) => {console.error(error);});
}


render() {

    console.log( "inside homescreen render" + this.state.loading + " - " + this.state.name);
    if(this.state.isLoading) {
      return ( false )
    }

  return (
    <View style={styles.container}>
      <Text>
        Hello {this.state.name}!
      </Text>
      <Button
        title="Log Out"
        onPress={() => firebase.auth().signOut().then(function() {
            console.log('Signed Out');
             this.props.navigation.navigate('Login')
          }.bind(this))}
      />
    </View>
  )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
