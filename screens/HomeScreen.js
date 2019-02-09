import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native'
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';


// upload a given photo to firebase
function uploadPhoto(uri, uploadUri) {
    return new Promise(async (res, rej) => {
        // const response = await fetch(uri);
        // console.log(response);
        // const blob = await response.blob();
        blob = new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onerror = reject;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.response);
                }
            };
            xhr.responseType = 'blob'; // convert type
            xhr.open('GET', uri);
            xhr.send();
        });

        // dereference blob and upload
        blob.then(blob_val => {
            console.log(blob_val)
            const ref = firebase.storage().ref(uploadUri);
            const unsubscribe = ref.put(blob_val).on(
                    'state_changed',
                    state => {},
                    err => {
                    unsubscribe();
                    rej(err);
                    console.log("put blob in storage")
                },
                async () => {
                    unsubscribe();
                    const url = await ref.getDownloadURL();
                    res(url);
                },
            );
        });
    });
}


export default class HomeScreen extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {currentUser: null, name: "user", isLoading: true}
    }

    // authenticate user
    componentDidMount() {
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            console.log("inside get " + firebase.auth().currentUser.uid)
            this.setState(
                {
                    currentUser: firebase.auth().currentUser,
                    name: doc.data().first,
                    isLoading: false
                }
            );
        }.bind(this)).catch ((error) => {console.error(error);});
    }

    // set a profile picture
    pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            base64: true,
        });

        if (!result.cancelled) {
            this.setState({image: result.uri,});
            const path = "ProfilePictures/".concat(this.state.name, ".jpg");
            console.log(result.uri);
            console.log(path);
            return uploadPhoto(result.uri, path);
        }
    };

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
                <Button title="Upload a Profile Picture"
                    onPress={this.pickImage}
                />
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
