import React from 'react'
import { StyleSheet, ScrollView, RefreshControl, FlatList } from 'react-native'
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import PostView from '../utils/Post'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, ActionSheet, Root } from 'native-base';
import { getTheme } from '../native-base-theme/components';
import { custom } from '../native-base-theme/variables/custom';
import { withNavigation } from 'react-navigation';
import {ListItem}  from 'react-native-elements';
import { uploadPhoto } from '../utils/Photos';

var BUTTONS = ["Take a Photo", "Upload a Photo", "Cancel"];
var LOCATIONS = ["NewPost", "NewPost", "HomeScreen"]
var METHOD = ["camera", "upload", "none"]
var CANCEL_INDEX = 2;

const list = []

// upload a given photo to firebase
// function uploadPhoto(uri, uploadUri) {
//     return new Promise(async (res, rej) => {
//         blob = new Promise((resolve, reject) => {
//             var xhr = new XMLHttpRequest();
//             xhr.onerror = reject;
//             xhr.onreadystatechange = () => {
//                 if (xhr.readyState === 4) {
//                     resolve(xhr.response);
//                 }
//             };
//             xhr.responseType = 'blob'; // convert type
//             xhr.open('GET', uri);
//             xhr.send();
//         });
//
//         // dereference blob and upload
//         blob.then(blob_val => {
//             console.log(blob_val)
//             const ref = firebase.storage().ref(uploadUri);
//             const unsubscribe = ref.put(blob_val).on(
//                     'state_changed',
//                     state => {},
//                     err => {
//                     unsubscribe();
//                     rej(err);
//                     console.log("put blob in storage")
//                 },
//                 async () => {
//                     unsubscribe();
//                     const url = await ref.getDownloadURL();
//                     res(url);
//                 },
//             );
//         });
//     });
// }


export default class HomeScreen extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {currentUser: null, name: "user", isLoading: true, postIDs: null, refreshing: false,}
    }

    // authenticate user
    componentDidMount() {
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            //console.log("inside get " + firebase.auth().currentUser.uid)
            this.getPosts(50, firebase.auth().currentUser, doc.data().first);

            // this may be bad because I'm relying on getPosts to take
            // longer so test it with this removed later
            this.setState({
                isLoading: false,
                postIDs: null
            })

            //console.log("does it work here? " + this.state.postIDs)
        }.bind(this)).catch ((error) => {console.error(error);});

    }

    componentWillReceiveProps(newprops) {
        //console.log("in component will receive props")
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            //console.log("inside get " + firebase.auth().currentUser.uid)
            this.getPosts(50, firebase.auth().currentUser, doc.data().first);

            // this may be bad because I'm relying on getPosts to take
            // longer so test it with this removed later
            this.setState({
                isLoading: false,
                postIDs: null
            })

            //console.log("does it work here? " + this.state.postIDs)
        }.bind(this)).catch ((error) => {console.error(error);});
    }

    getPosts(numPostsToGet, currUser, firstName){
        this.setState({postIDs: null})
        var postIDs = [];

        // get up to 10 most recent posts for activity feed
        follows_ref = firebase.firestore().collection("Follows"); // get the Follows collection
        var followed = []; // this will contain the users that this user follows
        follows_ref
        .where("userID", "==", firebase.auth().currentUser.uid) // look in follows table for this user
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) { // for each match
                followed.push(doc.data().followedID); // add to followed list
            });
            posts_ref = firebase.firestore().collection("Posts") // get the Posts collection
            var numPosts = 0
            posts_ref
            .orderBy("timestamp", "desc") // order by time descending
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) { //for each match
                    if ((followed.includes(doc.data().userID) ||
                            (firebase.auth().currentUser.uid == doc.data().userID))
                            && numPosts < numPostsToGet) { //if the post should be in the feed
                        //console.log("user followed: " + doc.data().userID)
                        postIDs.push({key: doc.data().postID});
                        list.push({name: doc.data().userID});
                        numPosts++
                    }
                });


                // set states to rerender
                this.setState(
                    {
                        currentUser: currUser,
                        name: firstName,
                        postIDs: postIDs,
                    }
                );
            }.bind(this))
        }.bind(this))
    }

    _onRefresh = () => {
        this.setState({refreshing: true, postIDs: null});
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            //console.log("inside get " + firebase.auth().currentUser.uid)
            this.getPosts(50, firebase.auth().currentUser, doc.data().first);

            this.setState({
                isLoading: false,
                refreshing: false,
            })

            //console.log("refresh " + this.state.postIDs)
            this.forceUpdate()
            //this.forceUpdate();
        }.bind(this)).catch ((error) => {console.error(error);});
    }

    renderItem = ({item, index}) => (
        <PostView postID={item.key}/>
    );



    render() {
        if(this.state.isLoading) {
            return ( false )
        }
        //console.log( "inside homescreen render" + this.state.loading + " - " + this.state.name);
        //console.log("inside render " + this.state.postIDs)

        return (
            <Root>
                <Container style={styles.container}>
                    <Content contentContainerStylestyle={styles.content}
                             refreshControl={ <RefreshControl refreshing={this.state.refreshing}
                             onRefresh={this._onRefresh} /> }>
                        <Text style={styles.welcome}>
                            Welcome, {this.state.name}!
                        </Text>

                        <FlatList contentContainerStyle={styles.list} data={this.state.postIDs} renderItem={this.renderItem} initialNumToRender={3}/>
                    </Content>


                    <Footer style={styles.footer}>
                        <FooterTab style={styles.footertab}>

                            <Button active style={{backgroundColor: 'transparent'}}>
                                <Icon style={styles.icon} name="home" />
                            </Button>

                            <Button
                                onPress={() => this.props.navigation.navigate('Search', {userID: firebase.auth().currentUser.uid})}>
                                <Icon style ={styles.inactiveicon} name="search" />
                            </Button>

                            <Button
                                onPress= {() =>
                                    ActionSheet.show(
                                      {
                                        options: BUTTONS,
                                        cancelButtonIndex: CANCEL_INDEX,
                                        title: "How do you want to upload?"
                                      },
                                      buttonIndex => {
                                        this.props.navigation.navigate(LOCATIONS[buttonIndex], {method: METHOD[buttonIndex]});
                                      }
                                  )}>
                                <Icon style={styles.inactiveicon} name="add" />
                            </Button>

                            <Button
                                onPress={() => this.props.navigation.navigate('Updates', {userID: firebase.auth().currentUser.uid})}>
                                <Icon
                                    type="MaterialIcons"
                                    name="notifications"
                                    style={{color: COLOR_LGREY}}/>
                            </Button>


                            <Button
                                onPress={() => this.props.navigation.navigate('Profile', {userID: firebase.auth().currentUser.uid})}>
                                <Icon style ={styles.inactiveicon} name="person" />
                            </Button>

                        </FooterTab>
                    </Footer>
                </Container>
            </Root>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR_BACKGRND,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    footer: {
        backgroundColor: COLOR_DGREY,
        borderTopWidth: 0
    },
    footertab: {
        backgroundColor: COLOR_DGREY,
    },
    welcome: {
        color: COLOR_LGREY,
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        paddingBottom: 20
    },
    icon: {
        color: COLOR_PINK
    },
    inactiveicon: {
        color: COLOR_LGREY
    }
})
