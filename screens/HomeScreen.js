import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native'
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';


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


    render() {
        console.log( "inside homescreen render" + this.state.loading + " - " + this.state.name);
        if(this.state.isLoading) {
            return ( false )
        }

        return (
            <View style={styles.container}>
                <View style={{flex:1, flexDirection:'row',alignItems:'flex-end'}} >
                    <Text style={styles.textPink}>
                        Welcome, {this.state.name}!
                    </Text>
                </View>
                <View style={{flex:8, flexDirection: 'row',alignItems:'flex-end', marginLeft: 10, marginRight: 10,}}>
                    <View style={{flex:1, flexDirection:'column',marginRight:10,}}>
                        <Button title="View Profile" color= '#f300a2'
                            onPress={() => this.props.navigation.navigate('Profile')}
                        />
                    </View>
                    <View style={{flex:1, flexDirection:'column',}}>
                        <Button
                            title="Log Out"
                            color= '#f300a2'
                            onPress={() => firebase.auth().signOut().then(function() {
                            console.log('Signed Out');
                            this.props.navigation.navigate('Login')
                            }.bind(this))}
                        />
                    </View>
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
    textPink: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
