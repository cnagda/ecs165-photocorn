import React from 'react'
import { StyleSheet, ScrollView, FlatList, TextInput, Platform, Image, Text, View, Button } from 'react-native'
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

function search(query) {
    matches = firebase.database().ref('users/').orderByValue().equalTo(query).limitToFirst(5);
    /*
    var query = this.state.query.toString();

    if (query == "") {
        this.listenForItems(reference);
    }
    else {
        reference.orderByChild("searchable").startAt(query).endAt(query).on('value',(snap) => {
            this.data = [];
            snap.forEach((child) => {
                this.data.push({
                    first: child.val().first,
                });
            });
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items)
            });
        });
    }
    */
}

renderRow = ({result}) => {
    return (
        <View style={styles.container}>
        <Text>
        {result.toString()}
    </Text>
        </View>
    )
}



export default class HomeScreen extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {currentUser: null, name: "user", isLoading: true, query: ""}
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
                    isLoading: false,
                    query: ""
                }
            );
        }.bind(this)).catch ((error) => {console.error(error);});


        //Get up to 10 most recent posts from users that this user follows
        follows_ref = firebase.firestore().collection("Follows");               //get the Follows collection
        var followed = [];                                                      //this will contain the users that this user follows
        follows_ref
        .where("userID", "==", firebase.auth().currentUser.uid)                 //look in follows table for this user
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {                               //for each match
                followed.push(doc.data().followedID);                           //add to followed array
            });

            var post_captions = [];                                             //will contain the captions for 10 most recent posts
            var post_timestamps = [];                                           //will contain the timestamps for 10 most recent posts

            posts_ref = firebase.firestore().collection("Posts")                //get the Posts collection

            posts_ref
            .orderBy("timestamp")                                               //order by time
            .limit(10)                                                          //get up to 10
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {                           //for each match
                    if (followed.includes(doc.data().userID)) {                 //if this post's poster is followed by this user
                        post_captions.push(doc.data().caption);
                        post_timestamps.push(doc.data().timestamp);
                    }

                });
                console.log(post_captions);                                     //print captions array
                console.log(post_timestamps);                                   //print timestamp array
            })
        })

    }

    // set a profile picture


    render() {
        console.log( "inside homescreen render" + this.state.loading + " - " + this.state.name);
        if(this.state.isLoading) {
            return ( false )
        }
        return (
            <View style={styles.container}>

            <View style={{flex:1, flexDirection:'row', alignItems: 'center'}}>
            <TextInput
            placeholder='...'
            onChangeText={query => this.setState({query})}
            value={this.state.query} style={styles.search}
            />
            {
                this.state.loading &&
                <ActivityIndicator
                size="large"
                color="#3498db"
                style={styles.activityStyle}
                />
            }
            <ScrollView>
            <FlatList
                data={search(this.state.query)}
                renderItem={this.renderRow}
                enableEmptySections={true}
            />
            </ScrollView>
            </View>
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
    search: {
        height: 40,
        width: 300,
        color: COLOR_PINK,
        marginTop: 20,
        backgroundColor: COLOR_DGREY,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
