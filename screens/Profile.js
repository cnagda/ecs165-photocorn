import React from 'react'
import { View, StyleSheet, TouchableHighlight, Image, FlatList, Dimensions } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
// import { Footer, FooterTab, Icon, Button, Text } from 'native-base';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Grid, Col, ActionSheet, Root } from 'native-base';
//import { getProfileImage } from '../utils/Photos'
import PhotoGrid from '../utils/PhotoGrid'

var BUTTONS = ["Take a Photo", "Upload a Photo", "Cancel"];
var LOCATIONS = ["NewPost", "NewPost", "HomeScreen"]
var METHOD = ["camera", "upload", "none"]
var CANCEL_INDEX = 2;

urlList = []

export default class Loading extends React.Component {




    // initialize state
    constructor(props) {
        super(props);
        this.state = {isLoading: true,
                isImgLoading: true,
              photoList: this.getPhotos(this.props.navigation.getParam('userID', firebase.auth().currentUser.uid)),

        }

    }

    getUserInfo = async(users_ref) => {
        console.log("inside get user info")
        users_ref.doc(this.state.userViewing).get().then(function(doc) {
            this.getProfileImage(this.state.userViewing);
            this.setState(
                {
                    firstname: doc.data().first,
                    lastname: doc.data().last,
                    birthday: doc.data().dob,
                    email: doc.data().email,
                    bio: doc.data().bio,
                    interests: doc.data().interests,
                    isLoading: false
                }
            );
            console.log("just set states for real")

        }.bind(this)).catch ((error) => {console.error(error);});
    };

    // authenticate user
    componentDidMount() {
        console.log("in component did mount")
        currentUserVar = firebase.auth().currentUser.uid;
        userViewingVar = this.props.navigation.getParam('userID', firebase.auth().currentUser.uid);
        isEditableVar = currentUserVar == userViewingVar;
        console.log(currentUserVar)
        console.log(userViewingVar)
        console.log(isEditableVar)

        follows_ref = firebase.firestore().collection("Follows");
        follows_ref
        .where("userID", "==", firebase.auth().currentUser.uid)
        .get()
        .then(function(querySnapshot) {
            console.log("here")
            isAlreadyFollowingVar = false;
            querySnapshot.forEach(function(doc) {
                console.log(doc.data().followedID);
                if(userViewingVar == doc.data().followedID) {
                    isAlreadyFollowingVar = true;
                }
            });
            this.setState( {  currentUser:currentUserVar,
                            userViewing: userViewingVar,
                            isImgLoading: true,
                            isEditable: isEditableVar,
                            isAlreadyFollowing: isAlreadyFollowingVar,
                            followedJustNow: false,
                            unfollowedJustNow: false,
                        });
            console.log("just initialized state")
            users_ref = firebase.firestore().collection("users");
            users_ref.doc(this.state.userViewing).get().then(function(doc) {
                this.getProfileImage(this.state.userViewing);

                this.setState(
                    {
                        firstname: doc.data().first,
                        lastname: doc.data().last,
                        birthday: doc.data().dob,
                        email: doc.data().email,
                        bio: doc.data().bio,
                        interests: doc.data().interests,
                        isLoading: false,
                    }
                );
                console.log("just set states for real")

            }.bind(this)).catch ((error) => {console.error(error);});
            console.log("hereeeee")
            console.log("at the end: " + this.state.isEditable)
        }.bind(this))

        console.log("out here")

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newprops) {
        users_ref = firebase.firestore().collection("users");
         this.getUserInfo(users_ref)
        console.log("in component will receive props")
    }


    getPhotos (user){
        var postIDs = [];



        //Get all photos from a user by getting all postids from a user (postid is same as photoid)
        posts_ref = firebase.firestore().collection("Posts")                        //get the Posts collection
        posts_ref
        .orderBy("timestamp", "desc")                                               //order by time descending
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {                                   //for each post
                if (user == doc.data().userID) {         //if the post was made by current user
                    postIDs.push(doc.data().postID);
                    photo_ref = firebase.firestore().collection("Photo").doc(doc.data().postID);
                    photo_ref.get().then(function(doc1) {
                        if (doc1.exists) {
                            urlList.push(doc1.data().imageUri)
                            console.log("pushed " + doc1.data().imageUri)
                        } else {
                            urlList.push("http://i68.tinypic.com/awt7ko.jpg")
                            console.log("pushed " + "http://i68.tinypic.com/awt7ko.jpg")
                        }

                    })

                }
            });
            console.log("List of photos I will send: " + postIDs)
            this.setState(                                                          //set states to rerender
                {
                    photoList: postIDs, urlList: urlList,
                }
            );
        }.bind(this))
        return postIDs;
    }



    getProfileImage = async(user) => {
          console.log("in get profile image");
            console.log(user)
            const path = "ProfilePictures/".concat(user, ".jpg");
            console.log(path)
            const image_ref = firebase.storage().ref(path);
            const downloadURL = await image_ref.getDownloadURL()

            if (!downloadURL.cancelled) {
              console.log("testing1")
              console.log(downloadURL)
              this.setState({profileImageURL: downloadURL,isImgLoading:false,});
          }
    };

    handleFollow = () => {
        const {currentUser, userViewing } = this.state
            firebase.firestore().collection("Follows").doc(currentUser).set({
                followedID: userViewing,
                userID: currentUser,
            }).then(function() {
                this.setState({followedJustNow: true});
                this.setState({unfollowedJustNow: false});
            }.bind(this))
            firebase.firestore().collection("Updates").doc().set({
                actUser: currentUser,
                currUser: userViewing,
                type: "FOLLOW",
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            })

    };


    handleUnFollow = () => {
        const {currentUser, userViewing } = this.state
            firebase.firestore().collection("Follows").doc(currentUser).delete().then(function(){
                this.setState({followedJustNow: false});
                this.setState({unfollowedJustNow: true});
                console.log("Successfully deleted document in Follows", currentUser)
            }.bind(this))

            firebase.firestore().collection("Updates").where("currUser", "==", userViewing).where("actUser", "==", currentUser).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log("deleting")
                    doc.ref.delete()
                }.bind(this))
            }.bind(this))

    };

    displayFollowEditButton =  (isEditable, isAlreadyFollowing) => {
        console.log("isAlreadyFollowing: ", isAlreadyFollowing)
        console.log("followedJustNow: ", this.state.followedJustNow)
        if (isEditable) {
            // return <Button title="Edit" onPress={() => this.props.navigation.navigate('ProfileEdit')} color= 'rgba(228,228,228,0.66)'/>;
            return <Button
                        onPress={() => this.props.navigation.navigate('ProfileEdit')}
                        style={styles.button}>
                        <Text>Edit Profile</Text>
                    </Button>;
        } else if ((this.state.followedJustNow || isAlreadyFollowing) && ! this.state.unfollowedJustNow) {
            return <Button
                        onPress={this.handleUnFollow}
                        style={styles.button}>
                        <Text>Unfollow</Text>
                    </Button>;
            // return <Button title="UnFollow" onPress={this.handleUnFollow} color= 'rgba(228,228,228,0.66)'/>;
        } else {
            // return <Button title="Follow" onPress={this.handleFollow} color= 'rgba(228,228,228,0.66)'/>;
            return <Button
                        onPress={this.handleFollow}
                        style={styles.button}>
                        <Text>Follow</Text>
                    </Button>;
        }
    };

    render() {
        if (Boolean(this.state.isLoading) || Boolean(this.state.isImgLoading) ) {
            console.log("about to return false")

            return ( false )
        }
        const isEditable = this.state.isEditable;
        const isAlreadyFollowing = this.state.isAlreadyFollowing;
        console.log("from render: " + isEditable + " " + isAlreadyFollowing)
        return (

            <Root>
            <Container style={styles.container}>
                <Content>
                    <Grid>
                        <Col>
                            <Image
                                style= {styles.circle}
                                source = {{uri: this.state.profileImageURL}}
                            />
                        </Col>
                        <Col>
                            {this.displayFollowEditButton(isEditable, isAlreadyFollowing)}
                        </Col>
                    </Grid>

                    <Text style = {styles.textMainTwo}>{this.state.firstname} {this.state.lastname}</Text>

                    <View style={{flex:2, flexDirection: 'row',marginLeft:20,}}>
                        <View style={{flex:1, flexDirection:'column',}} >
                            <Text style = {styles.textSecond}>Birthday:</Text>
                            <Text style= {styles.textVal}> {this.state.birthday}</Text>
                            <Text style={styles.textSecond}>Bio: </Text>
                            <Text style={styles.textVal}>{this.state.bio}</Text>
                            <Text style = {styles.textSecond}>Interests: </Text>
                            <Text style={styles.textVal}>{this.state.interests}</Text>
                        </View>
                    </View>

                    <Button transparent
                        style={{marginLeft: 5}}
                        onPress={() => firebase.auth().signOut().then(function() {
                        console.log('Signed Out');
                        this.props.navigation.navigate('Login')
                        }.bind(this))}>
                        <Text style={{color: 'white'}}>Log Out</Text>
                    </Button>
                    <View style={{flex:2, flexDirection: 'column',alignItems: 'flex-start'}}>
                    {/*<FlatList contentContainerStyle={styles.list} data={this.state.photoIDList} renderItem={this.renderItem} initialNumToRender={8}/>*/}
                    <PhotoGrid photos={this.state.photoList}/>
                    </View>
                </Content>

                <Footer style={styles.footer}>
                    <FooterTab style={styles.footertab}>
                        <Button
                            onPress={() => this.props.navigation.navigate('HomeScreen', {userID: firebase.auth().currentUser.uid})}>
                            <Icon style ={styles.inactiveicon} name="home" />
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
                            <Icon style ={styles.inactiveicon} name="add" />
                        </Button>


                        <Button
                            onPress={() => this.props.navigation.navigate('Updates', {userID: firebase.auth().currentUser.uid})}>
                            <Icon
                                type="MaterialIcons"
                                name="notifications"
                                style={{color: COLOR_LGREY}}/>
                        </Button>


                        <Button active style={{backgroundColor: 'transparent'}}>
                            <Icon style={styles.icon} name="person" />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
            </Root>
        )
    }
}

//note: font not working

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // flexDirection: 'column',
        fontSize: 20,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: COLOR_BACKGRND,
    },
    circle: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        backgroundColor: COLOR_DGREY,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginLeft: 20
    },
    textMainOne: {
        color: COLOR_PINK,
        fontSize: 20,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textMainTwo: {
        color: COLOR_PINK,
        fontSize: 20,
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop:20,
        fontWeight: 'bold'
    },
    textSecond: {
        color: COLOR_PURPLEPINK,
        fontSize: 15,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    textVal: {
        color: COLOR_LGREY,
        fontSize: 15,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    followButton: {
        alignItems: 'stretch',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'column',
        margin:10,
    },
    footer: {
        backgroundColor: COLOR_DGREY,
        borderTopWidth: 0
    },
    footertab: {
        backgroundColor: COLOR_DGREY,
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
    },
    button: {
        backgroundColor: COLOR_PINK,
        marginTop: 90,
        marginLeft: 30
    },
    inactiveicon: {
        color: COLOR_LGREY
    },
    list: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
})
