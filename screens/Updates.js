import React from 'react'
import { StyleSheet, ScrollView, RefreshControl, View, Platform , StatusBar, TextInput, Dimensions, Image } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, Row, Grid, Col, Footer, FooterTab, ActionSheet } from 'native-base';
import { ListItem }  from 'react-native-elements'

const monthNames1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var BUTTONS = ["Take a Photo", "Upload a Photo", "Cancel"];
var LOCATIONS = ["NewPost", "NewPost", "HomeScreen"]
var METHOD = ["camera", "upload", "none"]
var CANCEL_INDEX = 2;



Date.prototype.tstring3 = function() {
  var month = monthNames1[this.getMonth()];
  var day = this.getDate();
  var hh = this.getHours();
  var mm = this.getMinutes();
  var tt = "AM";

  // format minutes
  if (mm < 10) {
      mm = "0" + mm;
  }

  // format hours
  if(hh > 12) {
      hh = hh - 12;
      tt = "PM"
  }

  if(hh == 0) {
      hh = 12
  }

  return [month, ' ', day, " at ", hh, ":", mm, " ", tt].join('');
};


export default class Updates extends React.Component {
    // initialize state
    constructor(props) {
        super(props);

        this.state = {
            updates: [],
            refreshing: false
        }
        this.getActUserProfilePic = this.getActUserProfilePic.bind(this)
    }

    componentDidMount() {
        console.log("inside component did mount")
        var updates = [];
        console.log(firebase.auth().currentUser.uid)
        firebase.firestore().collection("Updates").where("currUser", "==", firebase.auth().currentUser.uid).orderBy("timestamp", "desc").get().then(function(querySnapshot) {
            console.log("looked for current users matching this user")
            querySnapshot.forEach(function(doc) {
                console.log("found an update for this user")
                var niceTimestamp = doc.data().timestamp.toDate().tstring3();
                //niceTimestamp = doc.data().timestamp.toDate().toString();
                var timestampkey = doc.data().actUser + doc.data().type + niceTimestamp;
                console.log("nice timestamp: " + niceTimestamp)
                console.log("key: " + timestampkey)
                actUserUN = ""
                firebase.firestore().collection("users").doc(doc.data().actUser).get().then(function(doc2) {
                    actUserUN = doc2.data().username
                    console.log("username: " + doc.data().username)
                }).then(function() {
                    this.getActUserProfilePic(doc.data().actUser).then(function(avatarurl) {
                        console.log("avatar url: " + avatarurl)
                        switch(doc.data().type) {
                            case "MENTION":
                                console.log("was a mention")
                                firebase.firestore().collection("Photo").doc(doc.data().postid).get().then(function(doc1) {
                                    photourl = doc1.data().imageUri
                                    if(doc.data().mentionType == "comment") {
                                        this.setState((prevState, props) => {
                                            var text = <Text>
                                                           <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{" mentioned you in a comment: "}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{doc.data().text}</Text>
                                                       </Text>;
                                            return {
                                                updates: prevState.updates.concat(<ListItem
                                                    roundAvatar
                                                    leftAvatar={{ source: { uri: avatarurl } }}
                                                    key={timestampkey}
                                                    title={text}
                                                    onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                                    containerStyle={styles.result}
                                                    subtitleStyle={styles.timeText}
                                                    titleStyle={styles.resultText}
                                                    subtitle={niceTimestamp}
                                                    rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                                />),
                                            };
                                        })
                                    } else {
                                        this.setState((prevState, props) => {
                                            var text = <Text>
                                                           <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{" mentioned you in a post: "}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{doc.data().text}</Text>
                                                       </Text>;
                                            return {
                                                updates: prevState.updates.concat(<ListItem
                                                    roundAvatar
                                                    leftAvatar={{ source: { uri: avatarurl } }}
                                                    key={timestampkey}
                                                    title={text}
                                                    onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                                    containerStyle={styles.result}
                                                    subtitleStyle={styles.timeText}
                                                    titleStyle={styles.resultText}
                                                    subtitle={niceTimestamp}
                                                    rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                                />),
                                            };
                                        })
                                    }
                                }.bind(this))

                                break;
                            case "LIKE":
                                console.log("was a like")
                                firebase.firestore().collection("Photo").doc(doc.data().postid).get().then(function(doc1) {
                                    photourl = doc1.data().imageUri
                                    otherlikes = doc.data().numLikes - 1;
                                    if(doc.data().numLikes > 0) {
                                        this.setState((prevState, props) => {
                                            var text = <Text>
                                                           <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{" and " + otherlikes + " others liked your post"}</Text>
                                                       </Text>;
                                            return {
                                                updates: prevState.updates.concat(<ListItem
                                                    roundAvatar
                                                    leftAvatar={{ source: { uri: avatarurl } }}
                                                    key={timestampkey}
                                                    title={text}
                                                    onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                                    containerStyle={styles.result}
                                                    subtitleStyle={styles.timeText}
                                                    titleStyle={styles.resultText}
                                                    subtitle={niceTimestamp}
                                                    rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                                />),
                                            };
                                        })
                                    }
                                }.bind(this))
                                break;
                            case "COMMENT":
                                console.log("was a comment")
                                firebase.firestore().collection("Photo").doc(doc.data().postid).get().then(function(doc1) {
                                    photourl = doc1.data().imageUri
                                    othercomments = doc.data().numComments - 1;
                                    if(doc.data().numComments > 0) {
                                        this.setState((prevState, props) => {
                                            var text = <Text>
                                                           <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{" commented on your post (and " + othercomments + " more)"}</Text>
                                                       </Text>;
                                            return {
                                                updates: prevState.updates.concat(<ListItem
                                                    roundAvatar
                                                    leftAvatar={{ source: { uri: avatarurl } }}
                                                    key={timestampkey}
                                                    title={text}
                                                    onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                                    containerStyle={styles.result}
                                                    subtitleStyle={styles.timeText}
                                                    titleStyle={styles.resultText}
                                                    subtitle={niceTimestamp}
                                                    rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                                />),
                                            };
                                        })
                                    }
                                }.bind(this))
                                break;
                            case "FOLLOW":
                                this.setState((prevState, props) => {
                                    var text = <Text>
                                                   <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                   <Text style={{color: COLOR_PINK, fontSize: 12}}>{" followed you"}</Text>
                                               </Text>;
                                    return {
                                        updates: prevState.updates.concat(<ListItem
                                            roundAvatar
                                            leftAvatar={{ source: { uri: avatarurl } }}
                                            key={timestampkey}
                                            title={text}
                                            onPress={() => this.props.navigation.navigate('Profile', {userID: doc.data().actUser})}
                                            containerStyle={styles.result}
                                            subtitleStyle={styles.timeText}
                                            titleStyle={styles.resultText}
                                            subtitle={niceTimestamp}
                                        />),
                                    };
                                })
                                break;
                        }
                    }.bind(this))
                }.bind(this))
            }.bind(this))

            this.setState({
                updates: updates
            })
        }.bind(this)).catch(function(error) {
            console.log("Error searching document: " + error);
        });
    }

    getActUserProfilePic = async(uid) => {
        const path = "ProfilePictures/".concat(uid,".jpg");
        const image_ref = firebase.storage().ref(path);

        // image_ref.getDownloadURL().then(onResolve, onReject);
        // function onResolve(downloadURL) {
        //     console.log("downloadurl: " + downloadURL)
        //     url = downloadURL
        // }
        // function onReject(error){ //photo not found
        //     url = "http://i68.tinypic.com/awt7ko.jpg"
        // }

        url = await image_ref.getDownloadURL()

        return url
    }


    // for pull down refresh
    _onRefresh = () => {
        this.setState({ refreshing: true, updates: [] });
        console.log("inside component did mount")
        var updates = [];
        console.log(firebase.auth().currentUser.uid)
        firebase.firestore().collection("Updates").where("currUser", "==", firebase.auth().currentUser.uid).orderBy("timestamp", "desc").get().then(function(querySnapshot) {
            console.log("looked for current users matching this user")
            querySnapshot.forEach(function(doc) {
                console.log("found an update for this user")
                var niceTimestamp = doc.data().timestamp.toDate().tstring3();
                //niceTimestamp = doc.data().timestamp.toDate().toString();
                var timestampkey = doc.data().actUser + doc.data().type + niceTimestamp;
                console.log("nice timestamp: " + niceTimestamp)
                console.log("key: " + timestampkey)
                actUserUN = ""
                firebase.firestore().collection("users").doc(doc.data().actUser).get().then(function(doc2) {
                    actUserUN = doc2.data().username
                    console.log("username: " + doc.data().username)
                }).then(function() {
                    this.getActUserProfilePic(doc.data().actUser).then(function(avatarurl) {
                        console.log("avatar url: " + avatarurl)
                        switch(doc.data().type) {
                            case "MENTION":
                                console.log("was a mention")
                                firebase.firestore().collection("Photo").doc(doc.data().postid).get().then(function(doc1) {
                                    photourl = doc1.data().imageUri
                                    if(doc.data().mentionType == "comment") {
                                        this.setState((prevState, props) => {
                                            var text = <Text>
                                                           <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{" mentioned you in a comment: "}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{doc.data().text}</Text>
                                                       </Text>;
                                            return {
                                                updates: prevState.updates.concat(<ListItem
                                                    roundAvatar
                                                    leftAvatar={{ source: { uri: avatarurl } }}
                                                    key={timestampkey}
                                                    title={text}
                                                    onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                                    containerStyle={styles.result}
                                                    subtitleStyle={styles.timeText}
                                                    titleStyle={styles.resultText}
                                                    subtitle={niceTimestamp}
                                                    rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                                />),
                                            };
                                        })
                                    } else {
                                        this.setState((prevState, props) => {
                                            var text = <Text>
                                                           <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{" mentioned you in a post: "}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{doc.data().text}</Text>
                                                       </Text>;
                                            return {
                                                updates: prevState.updates.concat(<ListItem
                                                    roundAvatar
                                                    leftAvatar={{ source: { uri: avatarurl } }}
                                                    key={timestampkey}
                                                    title={text}
                                                    onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                                    containerStyle={styles.result}
                                                    subtitleStyle={styles.timeText}
                                                    titleStyle={styles.resultText}
                                                    subtitle={niceTimestamp}
                                                    rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                                />),
                                            };
                                        })
                                    }
                                }.bind(this))

                                break;
                            case "LIKE":
                                console.log("was a like")
                                firebase.firestore().collection("Photo").doc(doc.data().postid).get().then(function(doc1) {
                                    photourl = doc1.data().imageUri
                                    otherlikes = doc.data().numLikes - 1;
                                    if(doc.data().numLikes > 0) {
                                        this.setState((prevState, props) => {
                                            var text = <Text>
                                                           <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{" and " + otherlikes + " others liked your post"}</Text>
                                                       </Text>;
                                            return {
                                                updates: prevState.updates.concat(<ListItem
                                                    roundAvatar
                                                    leftAvatar={{ source: { uri: avatarurl } }}
                                                    key={timestampkey}
                                                    title={text}
                                                    onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                                    containerStyle={styles.result}
                                                    subtitleStyle={styles.timeText}
                                                    titleStyle={styles.resultText}
                                                    subtitle={niceTimestamp}
                                                    rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                                />),
                                            };
                                        })
                                    }
                                }.bind(this))
                                break;
                            case "COMMENT":
                                console.log("was a comment")
                                firebase.firestore().collection("Photo").doc(doc.data().postid).get().then(function(doc1) {
                                    photourl = doc1.data().imageUri
                                    othercomments = doc.data().numComments - 1;
                                    if(doc.data().numComments > 0) {
                                        this.setState((prevState, props) => {
                                            var text = <Text>
                                                           <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                           <Text style={{color: COLOR_PINK, fontSize: 12}}>{" commented on your post (and " + othercomments + " more)"}</Text>
                                                       </Text>;
                                            return {
                                                updates: prevState.updates.concat(<ListItem
                                                    roundAvatar
                                                    leftAvatar={{ source: { uri: avatarurl } }}
                                                    key={timestampkey}
                                                    title={text}
                                                    onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                                    containerStyle={styles.result}
                                                    subtitleStyle={styles.timeText}
                                                    titleStyle={styles.resultText}
                                                    subtitle={niceTimestamp}
                                                    rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                                />),
                                            };
                                        })
                                    }
                                }.bind(this))
                                break;
                            case "FOLLOW":
                                this.setState((prevState, props) => {
                                    var text = <Text>
                                                   <Text style={{fontWeight: 'bold', color: COLOR_PINK, fontSize: 12}}>{actUserUN}</Text>
                                                   <Text style={{color: COLOR_PINK, fontSize: 12}}>{" followed you"}</Text>
                                               </Text>;
                                    return {
                                        updates: prevState.updates.concat(<ListItem
                                            roundAvatar
                                            leftAvatar={{ source: { uri: avatarurl } }}
                                            key={timestampkey}
                                            title={text}
                                            onPress={() => this.props.navigation.navigate('Profile', {userID: doc.data().actUser})}
                                            containerStyle={styles.result}
                                            subtitleStyle={styles.timeText}
                                            titleStyle={styles.resultText}
                                            subtitle={niceTimestamp}
                                        />),
                                    };
                                })
                                break;
                        }
                    }.bind(this))
                }.bind(this))
            }.bind(this))

            this.setState({
                updates: updates,
                refreshing: false
            });

            this.forceUpdate();
        }.bind(this)).catch(function(error) {
            console.log("Error searching document: " + error);
        });

        this.setState({
            refreshing: false
        });
    }


    render() {

        return (
            <Container style={styles.container}>

                <Content contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />}
                >
                    {this.state.updates}
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
                            <Icon style={styles.inactiveicon} name="add" />
                        </Button>

                        <Button active style={{backgroundColor: 'transparent'}}>
                            <Icon
                                type="MaterialIcons"
                                name="notifications"
                                style={styles.icon}/>
                        </Button>


                        <Button
                            onPress={() => this.props.navigation.navigate('Profile', {userID: firebase.auth().currentUser.uid})}>
                            <Icon style ={styles.inactiveicon} name="person" />
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
        marginTop: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 50,
        marginBottom: 20
    },
    footer: {
        backgroundColor: COLOR_DGREY,
        borderTopWidth: 0
    },
    footertab: {
        backgroundColor: COLOR_DGREY,
    },
    icon: {
        color: COLOR_PINK
    },
    inactiveicon: {
        color: COLOR_LGREY
    },
    result: {
        backgroundColor: COLOR_DGREY,
        borderRadius: 12,
        marginTop: 10,
    },
    resultText: {
        color: COLOR_PINK
    },
    timeText: {
        color: COLOR_LGREY,
        fontSize: 10
    },
    smallImg: {
        width: 50,
        height: 50,
    },
})
