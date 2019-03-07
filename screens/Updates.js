import React from 'react'
import { StyleSheet, ScrollView, RefreshControl, View, Platform , StatusBar, TextInput, Dimensions } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, Row, Grid, Col, Footer, FooterTab } from 'native-base';
import { ListItem }  from 'react-native-elements'

Date.prototype.tstring3 = function() {
  var month = monthNames[this.getMonth()];
  var day = this.getDate();
  var hh = this.getHours();
  var mm = this.getMinutes();

  return [month, ' ', day, " at ", hh, ":", mm].join('');
};


export default class Updates extends React.Component {
    // initialize state
    constructor(props) {
        super(props);

        this.state = {
            updates: []
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
                niceTimestamp = doc.data().timestamp.toDate().tstring3();
                timestampkey = doc.data().actUser + doc.data().type + niceTimestamp;
                console.log("nice timestamp: " + niceTimestamp)
                console.log("key: " + timestampkey)
                actUserUN = ""
                firebase.firestore().collection("users").doc(doc.data().actUser).get().then(function(doc) {
                    actUserUN = doc.data().username
                    console.log("username: " + doc.data().username)
                }).then(function() {
                    this.getActUserProfilePic(doc.data().actUser).then(function(avatarurl) {
                        console.log("avatar url: " + avatarurl)
                        switch(doc.data().type) {
                            case "MENTION":
                                this.getPhoto(doc.data().postid).then(function(photourl){
                                    console.log("photourl: " + photourl)
                                    if(doc.data().mentionType == "comment") {
                                        updates.push(<ListItem
                                            roundAvatar
                                            leftAvatar={{ source: { uri: avatarurl } }}
                                            key={timestampkey}
                                            title={ actUserUN + " mentioned you in a comment: " + doc.data().text}
                                            onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                            containerStyle={styles.result}
                                            subtitleStyle={styles.timeText}
                                            titleStyle={styles.resultText}
                                            subtitle={niceTimestamp}
                                            rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                        />)
                                    } else {
                                        updates.push(<ListItem
                                            roundAvatar
                                            leftAvatar={{ source: { uri: avatarurl } }}
                                            key={timestampkey}
                                            title={ actUserUN + " mentioned you in a post: " + doc.data().text}
                                            onPress={() => this.props.navigation.navigate('ViewPost', {postID: doc.data().postid})}
                                            containerStyle={styles.result}
                                            subtitleStyle={styles.timeText}
                                            titleStyle={styles.resultText}
                                            subtitle={niceTimestamp}
                                            rightElement={<Image style={styles.smallImg} source={{uri: photourl}}/>}
                                        />)
                                    }
                                }.bind(this))
                                break;
                            case "LIKE":
                                this.getPhoto(doc.data().postid).then(function(photourl){

                                }.bind(this))
                                break;
                            case "COMMENT":
                                this.getPhoto(doc.data().postid).then(function(photourl){

                                }.bind(this))
                                break;
                            case "FOLLOW":
                                break;
                        }
                        console.log(updates)
                    }.bind(this))
                }.bind(this))
            }.bind(this))

            this.setState({
                updates: updates
            })
        }.bind(this))
    }

    getActUserProfilePic = (uid) => {
        const path = "ProfilePictures/".concat(uid,".jpg");
        const image_ref = firebase.storage().ref(path);
        let currThis = this;
        image_ref.getDownloadURL().then(onResolve, onReject);
        function onResolve(downloadURL) {
            return downloadURL
        }
        function onReject(error){ //photo not found
            return "http://i68.tinypic.com/awt7ko.jpg"
        }
    }

    getPhoto = (postid) => {
        firebase.firestore().collection("Photo").doc(postid).get.then(function(doc) {
            return doc.data().imageUri
        })
    }



    render() {

        return (
            <Container style={styles.container}>


                <Content>
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
        alignItems: 'center',
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
    search: {
        height: 40,
        width: 300,
        color: COLOR_PINK,
        marginTop: 20,
        backgroundColor: COLOR_DGREY,
        paddingLeft: 10,
        borderRadius: 12,
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
        color: COLOR_LGREY
    },
    smallImg: {
        width: 50,
        height: 50,
    }
})
