import React from 'react'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_PURPLE, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { AppRegistry, StyleSheet, View, Dimensions, Image } from 'react-native'
import { Button, Grid, Col, Row, Container, Text, Content, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo'


const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// pretty prints a string given a date object
Date.prototype.tstring = function() {
    var month = monthNames[this.getMonth()];
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

    return ["Posted on ", month, ' ', day, " at ", hh, ":", mm, " ", tt].join('');
};


// pretty print a string of space separated tags
function getTagString(str) {
    try {
        var notags= str.replace(/#/g, '')
        var removedextraspaces = notags.replace(/(\s+)/g, ' ')
        return '  ' + removedextraspaces.replace(/(\w+)/g, '#' + '$&')
    }
    catch(err) { } // prob no tags
}


class PostView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isImgLoading: true,
        }
    }

    componentDidMount() {
        // authenticate user
        postID = this.props.postID;
        // Get the user who is viewing the post.
        userViewingVar = firebase.auth().currentUser.uid;
        post_ref = firebase.firestore().collection("Posts");
        post_ref.doc(this.props.postID).get().then(function(doc) {
            photo_ref = firebase.firestore().collection("Photo");
            photo_ref.doc(this.props.postID).get().then(function(doc2) {
                console.log(doc2.data());
                users_ref = firebase.firestore().collection("users");
                users_ref.doc(doc.data().userID).get().then(function(doc1) {
                    timestamp = doc.data().timestamp.toDate();
                    // time_string = "Posted on " + timestamp.getMonth() " at " timestamp.getMinute();

                    // Determine if the currentuser (userViewingVar) already likes the post.
                    reaction_ref = firebase.firestore().collection("Reaction");
                    reaction_ref
                    .where("userID", "==", firebase.auth().currentUser.uid)
                    .get()
                    .then(function(querySnapshot) {
                      console.log("in like verification")
                      alreadyLikedVar = false;
                      querySnapshot.forEach(function(doc) {
                          console.log(doc.data().postID);
                          // If the current user already liked the current post,
                          // set alreadyLikedVar to true
                          if(postID == doc.data().postID) {
                              alreadyLikedVar = true;
                              console.log("test")
                          }
                      });

                    this.setState({
                        currentUser: userViewingVar,
                        name: doc1.data().first + " " + doc1.data().last,
                        postUser: doc.data().userID,
                        caption: doc.data().caption,
                        numComments: doc.data().numComments,
                        tags: doc.data().tags,
                        imageUri: doc2.data().imageUri,
                        timestamp: timestamp.tstring(),
                        username: doc1.data().username,
                        alreadyLikedVar: alreadyLikedVar,
                        likedJustNow: false,
                        unlikedJustNow: false
                    });
                    console.log("caption " + doc.data().caption)
                    console.log("postid " + this.props.postID)
                    console.log("imageuri " + doc2.data().imageUri)
                    console.log("timestamp " + timestamp.tstring())
                  }.bind(this))
                }.bind(this))
            }.bind(this))
            this.getProfileImage(doc.data().userID);
        }.bind(this)).catch ((error) => {console.error(error);});
    }

    componentWillMount() {}

    // given a user id fetch profile picture from storage
    getProfileImage = async(user) => {
            const path = "ProfilePictures/".concat(user, ".jpg");
            const image_ref = firebase.storage().ref(path);
            const downloadURL = await image_ref.getDownloadURL()

            if (!downloadURL.cancelled) {
                this.setState({profileImageURL: downloadURL,isImgLoading:false,});
            }
    };

    handleUnlike = () => {
      console.log("in handle unlike")
      firebase.firestore().collection("Reaction").where("userID", "==", firebase.auth().currentUser.uid).where("postID", "==", this.props.postID).get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc) {
            console.log("about to delete doc")
            doc.ref.delete()
            console.log("completed unlike")

          })
      }).then(function(){
        this.setState({likedJustNow: false});
        this.setState({unlikedJustNow: true});
        console.log("unlike finished")
      }.bind(this))
    }

      // Todo: Handle update for unLike


    handleLike = () => {
        console.log("in handle like")
        // Add a reaction document corresponding to the current user and the current post.
            firebase.firestore().collection("Reaction").doc().set({
                  postID: this.props.postID,
                  userID: firebase.auth().currentUser.uid,
                  rid: 1,
                  rtype: 1
              }).then(function() {
                  this.setState({likedJustNow: true});
                  this.setState({unlikedJustNow: false});
              }.bind(this))


        firebase.firestore().collection("Updates").where("postid", "==", this.props.postID).where("type", "==", "LIKE").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log("found one")
                newnumLikes = doc.data().numLikes + 1
                doc.ref.update({
                    numLikes: newnumLikes,
                    actUser: firebase.auth().currentUser.uid,
                    timestamp:  firebase.firestore.Timestamp.fromDate(new Date()),
                }).then(function() {
                    console.log("success")
                }).catch(function(error) {
                    console.log("Error updating document: " + error);
                });
            })
        })
    }



    displayLikeButton =  (alreadyLikedVar) => {
        console.log("alraedyLikedVar: ", alreadyLikedVar)
        console.log("likedJustNow: ", this.state.likedJustNow)
        console.log("unlikedJustNow: ", this.state.unlikedJustNow)
        if ((this.state.likedJustNow || alreadyLikedVar) && ! this.state.unlikedJustNow) {
            return <Button icon transparent
                        style={{marginLeft: -15}}>
                        <Icon
                            type="FontAwesome"
                            name="heart"
                            style={{color: COLOR_LGREY}}
                            onPress={this.handleUnlike}/>
                    </Button>;
            // return <Button title="UnFollow" onPress={this.handleUnFollow} color= 'rgba(228,228,228,0.66)'/>;
        } else {
            // return <Button title="Follow" onPress={this.handleFollow} color= 'rgba(228,228,228,0.66)'/>;
            return <Button icon transparent
                        style={{marginLeft: -15}}>
                        <Icon
                            type="Feather"
                            name="heart"
                            style={{color: COLOR_LGREY}}
                            onPress={this.handleLike}/>
                    </Button>;
        }
    };

    render() {
        if (Boolean(this.state.isImgLoading) ) {
            return ( false )
        }
        const  alreadyLikedVar = this.state.alreadyLikedVar

        return (
            <Container style={styles.container}>
                <Content scrollEnabled={false}>
                    <Grid>
                        {/*post header*/}
                        <Row style={styles.postHeader}>
                            <Col size={15} style={{paddingLeft: 10}}>
                                <Image style={styles.profile} source={{uri: this.state.profileImageURL}}/>
                            </Col>
                            <Col size={75} style={{paddingLeft: 10}}>
                                <Button transparent
                                    onPress={() => this.props.navigation.navigate('Profile', {userID: this.state.postUser})}
                                    style={{marginTop: -5}}>
                                    <Text
                                        style = {styles.posterName}
                                        uppercase={false}>
                                            {this.state.username}
                                    </Text>
                                </Button>
                                <Text style={styles.timestamp}>{this.state.timestamp}</Text>
                            </Col>
                        </Row>

                        {/*post image*/}
                        <LinearGradient
                            colors={['rgba(122,122,122,0.2)', '#2a2a2a']}
                            style={styles.backBox}>
                            <Row>
                                <Image
                                    style={styles.image}
                                    source={{uri: this.state.imageUri}}
                                />
                            </Row>
                        </LinearGradient>

                        {/*post footer*/}
                        <Col style={styles.postFooter}>
                            {/*task bar*/}
                            <Row style={{paddingLeft: 10}}>

                                {this.displayLikeButton(alreadyLikedVar)}

                                <Button icon transparent>
                                    <Icon
                                        type="Feather"
                                        name="message-square"
                                        style={{color: COLOR_LGREY}}
                                        onPress={() => this.props.navigation.navigate('Comments', {postID: this.props.postID})}/>
                                </Button>
                                <Button icon transparent>
                                    <Icon
                                        type="Feather"
                                        name="info"
                                        style={{color: COLOR_LGREY}}/>
                                </Button>
                            </Row>
                            {/*likes*/}
                            <Row style={{paddingLeft: 10, paddingBottom: 3}}>
                                <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}}>Liked by </Text>
                                <Text style={{color: COLOR_PINK, fontWeight: 'bold'}}>chandninagda </Text>
                                <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}}>and </Text>
                                <Text style={{color: COLOR_PINK, fontWeight: 'bold'}}>238 others </Text>
                            </Row>
                            {/*caption*/}
                            <Text style={{paddingLeft: 10, paddingTop: 5}}>
                                <Text style={styles.caption}>{this.state.caption}</Text>
                                <Text style={styles.tags}>{getTagString(this.state.tags)}</Text>
                            </Text>
                        </Col>
                    </Grid>
                </Content>
            </Container>
        )
    }
}

export default withNavigation(PostView);

const styles = StyleSheet.create({
    container: {
        fontSize: 20,
        backgroundColor: COLOR_BACKGRND,
        marginBottom: 20
    },
    backBox: {
        // height: Dimensions.get('window').width + 75,
        width: Dimensions.get('window').width,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textMainTwo: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').width,
    },
    profile: {
        height: 54,
        width: 54,
        borderRadius: 54 / 2,
    },
    posterName: {
        color: COLOR_PINK,
        fontSize: 18,
    },
    caption: {
        color: COLOR_LGREY,
        fontSize: 15,
    },
    tags: {
        color: COLOR_PURPLEPINK,
        fontSize: 15,
        fontWeight: 'bold'
    },
    timestamp: {
        color: COLOR_LGREY,
        marginLeft: 16,
        marginTop: -10
    },
    postHeader: {
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: COLOR_DGREY
    },
    postFooter: {
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: COLOR_DGREY
    }
})
