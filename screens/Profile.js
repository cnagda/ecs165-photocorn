import React from 'react'
import { View, StyleSheet, TouchableHighlight, Image, FlatList, Dimensions, ScrollView } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
// import { Footer, FooterTab, Icon, Button, Text } from 'native-base';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Grid, Col, ActionSheet, Root, Row } from 'native-base';
//import { getProfileImage } from '../utils/Photos'
import PhotoGrid from '../utils/PhotoGrid'

var BUTTONS = ["Take a Photo", "Upload a Photo", "Cancel"];
var LOCATIONS = ["NewPost", "NewPost", "HomeScreen"]
var METHOD = ["camera", "upload", "none"]
var CANCEL_INDEX = 2;



export default class Loading extends React.Component {




    // initialize state
    constructor(props) {
        super(props);
        this.state = {isLoading: true,
                isImgLoading: true,
              photoList: this.getPhotos(this.props.navigation.getParam('userID', firebase.auth().currentUser.uid)),
              followers: [],
              pyf: [],
              followingList: null,
              followerList: null,

        }
        this.getProfileImage = this.getProfileImage.bind(this)
        this.renderItem1 = this.renderItem1.bind(this)
        this.displayFollowerList = this.displayFollowerList.bind(this)
        this.displayFollowingList = this.displayFollowingList.bind(this)

    }

    getUserInfo = async(users_ref) => {
        //console.log("inside get user info")
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
                    username: doc.data().username,
                    isLoading: false
                }
            );
            //console.log("just set states for real")

        }.bind(this)).catch ((error) => {console.error(error);});
    };

    // authenticate user
    componentDidMount() {
        //console.log("in component did mount")
        currentUserVar = firebase.auth().currentUser.uid;
        userViewingVar = this.props.navigation.getParam('userID', firebase.auth().currentUser.uid);
        isEditableVar = currentUserVar == userViewingVar;
        //console.log(currentUserVar)
        //console.log(userViewingVar)
        //console.log(isEditableVar)


        this.displayFollowingList()
        this.displayFollowerList()

        follows_ref = firebase.firestore().collection("Follows");
        follows_ref
        .where("userID", "==", firebase.auth().currentUser.uid)
        .get()
        .then(function(querySnapshot) {
            //console.log("here")
            isAlreadyFollowingVar = false;
            querySnapshot.forEach(function(doc) {
                //console.log(doc.data().followedID);
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
            //console.log("just initialized state")
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
                        username: doc.data().username,
                        isLoading: false,
                    }
                );
                //console.log("just set states for real")

            }.bind(this)).catch ((error) => {console.error(error);});
            //console.log("hereeeee")
            //console.log("at the end: " + this.state.isEditable)
        }.bind(this))

        //console.log("out here")

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newprops) {
        users_ref = firebase.firestore().collection("users");
         this.getUserInfo(users_ref)

        //console.log("in component will receive props")
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


                }
            });
            //console.log("List of photos I will send: " + postIDs)
            this.setState(                                                          //set states to rerender
                {
                    photoList: postIDs,
                }
            );
        }.bind(this))
        return postIDs;
    }



    getProfileImage = async(user) => {
        //console.log("in get profile image");
        //console.log(user)
        var path = "ProfilePictures/".concat(user, ".jpg");
        //console.log(path)
        var image_ref = firebase.storage().ref(path);
        var downloadURL = await image_ref.getDownloadURL()

        if (!downloadURL.cancelled) {
              //console.log("testing1")
              //console.log(downloadURL)
              this.setState({profileImageURL: downloadURL,isImgLoading:false,});
              return downloadURL
        }
        return "http://i68.tinypic.com/awt7ko.jpg";
    };

    handleFollow = () => {
        const {currentUser, userViewing } = this.state
            firebase.firestore().collection("Follows").doc().set({
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
            firebase.firestore().collection("Follows").where("userID", "==", currentUser).where("followedID", "==", userViewing).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    doc.ref.delete().then(function(){
                        this.setState({followedJustNow: false});
                        this.setState({unfollowedJustNow: true});
                        //console.log("Successfully deleted document in Follows", currentUser)
                    }.bind(this))
                }.bind(this))
            }.bind(this))

            firebase.firestore().collection("Updates").where("currUser", "==", userViewing).where("actUser", "==", currentUser).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    //console.log("deleting")
                    doc.ref.delete()
                }.bind(this))
            }.bind(this))

    };

    displayFollowEditButton =  (isEditable, isAlreadyFollowing) => {
        //console.log("isAlreadyFollowing: ", isAlreadyFollowing)
        //console.log("followedJustNow: ", this.state.followedJustNow)
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

    getProfileImageSimple = async(uid) => {
        //console.log("uid passed to getprofileimagesimple: " + uid)
        const path1 = "ProfilePictures/".concat(uid,".jpg");
        const image_ref1 = firebase.storage().ref(path1);
        var url = await image_ref1.getDownloadURL()
        //console.log("is this a string: " + url)
        return url
    }

    renderItem1({ item, index }) {
        var uid = item.key
        var imageurl1 = item.uri
        var username = item.username
        //console.log("made it to renderitem: " + uid + username)
        if (item.uri) {
            return (<View style={{
                    flex: 1,
                    backgroundColor: COLOR_BACKGRND,
                    width: 90,
                    height: 110,
                    alignItems: 'center',
                }}><TouchableHighlight onPress={() => this.props.navigation.push('Profile', {userID: uid})}>
                  <Image style={styles.smallcircle} source = {{uri: imageurl1}}  />
                  </TouchableHighlight><Text style={{color: COLOR_PINK, fontSize: 12}}>{username}</Text></View>);
                  ////console.log("rendered: " + rendered)
            //rendered = <Text style={styles.textMainOne}>HI</Text>
        }
    }

    displayFollowerList = () => {
        this.setState({
            followers: []
        })
        firebase.firestore().collection("Follows").where("followedID", "==", this.props.navigation.getParam('userID', firebase.auth().currentUser.uid)).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                this.getProfileImageSimple(doc.data().userID).then(function(url) {
                    firebase.firestore().collection("users").doc(doc.data().userID).get().then(function(doc1) {
                        this.setState((prevState, props) => {
                            return {
                                followers: prevState.followers.concat({
                                    key: doc.data().userID,
                                    uri: url,
                                    username: doc1.data().username,
                                    name: doc1.data().first + " " + doc1.data().last
                                }),
                            };
                        })
                    }.bind(this))
                }.bind(this))
                //console.log("pushed a follower of this user")
            }.bind(this))
            //console.log("made it out of the querySnapshot forEach: " + followers)
        }.bind(this))
    };

    displayFollowingList = () => {
        this.setState({
            pyf: []
        })
        firebase.firestore().collection("Follows").where("userID", "==", this.props.navigation.getParam('userID', firebase.auth().currentUser.uid)).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                this.getProfileImageSimple(doc.data().followedID).then(function(url) {
                    firebase.firestore().collection("users").doc(doc.data().followedID).get().then(function(doc1) {
                        //console.log("here's a username: " + doc1.data().username)
                        this.setState((prevState, props) => {
                            return {
                                pyf: prevState.pyf.concat({
                                    key: doc.data().followedID,
                                    uri: url,
                                    username: doc1.data().username,
                                    name: doc1.data().first + " " + doc1.data().last,
                                }),
                            };
                        })
                    }.bind(this))
                }.bind(this))
                //console.log("pushed a person this user follows")
            }.bind(this))
            //console.log("made it out of the querySnapshot forEach: " + pyf)
        }.bind(this))
    };

    render() {
        if (Boolean(this.state.isLoading) || Boolean(this.state.isImgLoading) ) {
            return ( false )
        }
        const isEditable = this.state.isEditable;
        const isAlreadyFollowing = this.state.isAlreadyFollowing;

        return (
            <Root>
            <Container style={styles.container}>
                <Content>
                    <Grid>
                        {/*profile header*/}
                        <Row>
                            <Col>
                                <Image
                                    style= {styles.circle}
                                    source = {{uri: this.state.profileImageURL}}
                                />
                            </Col>
                            <Col>
                                {this.displayFollowEditButton(isEditable, isAlreadyFollowing)}

                                {/*log out*/}
                                {this.props.navigation.getParam('userID', '') == firebase.auth().currentUser.uid ? <Button transparent
                                    style={{alignSelf: 'center', marginLeft: 3}}
                                    onPress={() => firebase.auth().signOut().then(function() {
                                        this.props.navigation.navigate('Login')
                                    }.bind(this))}>
                                    <Text style={styles.logoutbutton}>Log Out</Text>
                                </Button> : null}
                            </Col>
                        </Row>

                        {/*subtopics*/}
                        <Row>
                            <Col style={{ paddingLeft: 20, paddingRight: 20}}>
                                {/*user information*/}
                                <Text style = {styles.textMainTwo}>{this.state.firstname} {this.state.lastname}</Text>
                                <Text style = {styles.textSecond}>Username</Text>
                                <Text style= {styles.textVal}>{this.state.username}</Text>
                                <Text style = {styles.textSecond}>Birthday</Text>
                                <Text style= {styles.textVal}>{this.state.birthday}</Text>
                                <Text style={styles.textSecond}>Bio </Text>
                                <Text style={styles.textVal}>{this.state.bio}</Text>
                                <Text style = {styles.textSecond}>Interests </Text>
                                <Text style={styles.textVal}>{this.state.interests}</Text>

                                {/*followers*/}
                                <Button transparent
                                    onPress={() => this.props.navigation.navigate('ListPeople', {listOfPeople: this.state.followers, title: "Followers",})}
                                    style={{marginLeft: -15, marginBottom: -7, marginTop: 7}}
                                >
                                    <Text style = {styles.textSecondButton}>Followers</Text>
                                </Button>

                                {this.state.followers.length == 0 ? <Text style={styles.textVal}>Sorry, no one likes you!</Text> :
                                <FlatList horizontal
                                    contentContainerStyle={styles.list}
                                    data={this.state.followers}
                                    renderItem={this.renderItem1}
                                    initialNumToRender={2}
                                />}

                                {/*following*/}
                                <Button transparent
                                    onPress={() => this.props.navigation.navigate('ListPeople', {listOfPeople: this.state.pyf, title: "Following",})}
                                    style={{marginLeft: -15, marginBottom: -7, marginTop: 5}}>
                                    <Text style = {styles.textSecondButton}>Following</Text>
                                </Button>

                                {this.state.pyf.length == 0 ? <Text style={styles.textVal}>You're not following anyone yet!</Text> :
                                <FlatList horizontal
                                    contentContainerStyle={styles.list}
                                    data={this.state.pyf}
                                    renderItem={this.renderItem1}
                                    initialNumToRender={2}
                                />}
                                <Text style = {styles.textSecond}>Photos</Text>
                            </Col>
                        </Row>

                        <Row>
                            <Col style={{paddingTop: 7}}>
                                {/*photogrid*/}
                                <PhotoGrid photos={this.state.photoList} userViewing={this.state.userViewing}/>
                            </Col>
                        </Row>
                    </Grid>
                </Content>

                {/*footer*/}
                {this.props.navigation.getParam('userID', '') == firebase.auth().currentUser.uid ? <Footer style={styles.footer}>
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
                </Footer> : null}
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
    smallcircle: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        // backgroundColor: COLOR_DGREY,
        // alignItems: 'center',
        // justifyContent: 'center',
        // marginTop: 40,
        // marginLeft: 20
    },
    textMainOne: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textMainTwo: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:20,
        fontWeight: 'bold'
    },
    textSecond: {
        color: COLOR_PURPLEPINK,
        fontSize: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    textVal: {
        color: COLOR_LGREY,
        fontSize: 15,
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
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 0,
    },
    textSecondButton: {
        color: COLOR_PURPLEPINK,
        fontSize: 17,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    logoutbutton: {
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 15,
        marginTop: -4,
    }
})
