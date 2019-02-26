import React from 'react'
// import { StyleSheet, Platform, Image, Text, View, Button, ScrollView, RefreshControl, } from 'react-native'
import { StyleSheet, ScrollView, RefreshControl } from 'react-native'
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import PostView from '../utils/Post'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { getTheme } from '../native-base-theme/components';
import { custom } from '../native-base-theme/variables/custom';
import { withNavigation } from 'react-navigation';


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
        this.state = {currentUser: null, name: "user", isLoading: true, postList: null, refreshing: false,}
    }

    // authenticate user
    componentDidMount() {
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            console.log("inside get " + firebase.auth().currentUser.uid)
            this.getPosts(10, firebase.auth().currentUser, doc.data().first);

            this.setState({
                isLoading: false,
                postList: null,  //this may be bad because I'm relying on getPosts to take longer so test it with this removed later
            })

            console.log("does it work here? " + this.state.postList)
            //this.forceUpdate();
        }.bind(this)).catch ((error) => {console.error(error);});

    }



    componentWillReceiveProps(newprops) {

        console.log("in component will receive props")
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            console.log("inside get " + firebase.auth().currentUser.uid)
            this.getPosts(10, firebase.auth().currentUser, doc.data().first);

            this.setState({
                isLoading: false,
                postList: null, //this may be bad because I'm relying on getPosts to take longer so test it with this removed later
            })

            console.log("does it work here? " + this.state.postList)
            //this.forceUpdate();
        }.bind(this)).catch ((error) => {console.error(error);});

    }

    toProfile(prof) {
        this.props.navigation.navigate('Profile', { prof });
    }

    getPosts(numPosts, currUser, firstName){
        this.setState({postList: null})
        var postList = [];
        var postIDs = [];
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


            posts_ref = firebase.firestore().collection("Posts")                //get the Posts collection
            var numPosts = 0
            posts_ref
            .orderBy("timestamp", "desc")                                               //order by time
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {                           //for each match
                    if ((followed.includes(doc.data().userID) || (firebase.auth().currentUser.uid == doc.data().userID)) && numPosts < 10) {  //if this post's poster is followed by this user
                        console.log("user followed: " + doc.data().userID)
                        postIDs.push(doc.data().postID);
                        numPosts++
                    }

                });
                postIDs.forEach(function(thisPostID) {
                    postList.push(<PostView postID={thisPostID}/>);
                    // postList.push(<PostView postID={thisPostID} toProfile={this.toProfile}/>);
                })

                console.log(postIDs)
                //postList = postIDs.map((id)=> <PostView postID={id} />)
                console.log("here")

                console.log(postList)
                this.setState(
                    {
                        currentUser: currUser,
                        name: firstName,
                        postList: postList,
                    }
                );
            }.bind(this))
        }.bind(this))
    }

    _onRefresh = () => {
        this.setState({refreshing: true, postList: null});
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            console.log("inside get " + firebase.auth().currentUser.uid)
            this.getPosts(10, firebase.auth().currentUser, doc.data().first);

            this.setState({
                isLoading: false,
                refreshing: false,
            })

            console.log("refresh " + this.state.postList)
            this.forceUpdate()
            //this.forceUpdate();
        }.bind(this)).catch ((error) => {console.error(error);});
    }



    render() {
        if(this.state.isLoading) {
            return ( false )
        }
        console.log( "inside homescreen render" + this.state.loading + " - " + this.state.name);
        console.log("inside render " + this.state.postList)

        return (
            <Container style={styles.container}>
                <Content style={styles.content}
                         refreshControl={ <RefreshControl refreshing={this.state.refreshing}
                         onRefresh={this._onRefresh} /> }>
                    <Text style={styles.textPink}>
                        Welcome, {this.state.name}!
                    </Text>

                    {this.state.postList}
                </Content>

                <Footer style={styles.footer}>
                    <FooterTab>
                        <Button active>
                            <Icon style={styles.icon} name="home" />
                        </Button>
                        <Button
                            onPress={() => this.props.navigation.navigate('NewPostUpload', {userID: firebase.auth().currentUser.uid})}>
                            <Icon name="add" />
                        </Button>
                        <Button>
                            <Icon name="search" />
                        </Button>
                        <Button
                            onPress={() => this.props.navigation.navigate('Profile', {userID: firebase.auth().currentUser.uid})}>
                            <Icon name="person" />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR_BACKGRND,
    },
    content: {
        alignItems: 'center',
    },
    footer: {
        backgroundColor: COLOR_DGREY,
        borderTopWidth: 0
    },
    footertab: {
        tabBarActiveTextColor: COLOR_PINK,
        tabActiveBgColor: 'rgba(255, 255, 255, .4)'
    },
    textPink: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        paddingBottom: 20
    },
    icon: {
        color: COLOR_PINK
    }
})
