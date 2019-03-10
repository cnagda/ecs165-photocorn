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

  return ["Posted on ", month, ' ', day, " at ", hh, ":", mm].join('');
};


// pretty print a string of space separated tags
function getTagString(str) {
    var res = ' '

    // remove extra white space and hashtag symbols
    try {
        var tags = str.split(' ');
        str = str.trim()
        var regexp = new RegExp('#([^\\s]*)','g');
        str = str.replace(regexp, 'REPLACED');

        var i;
        for(i = 0; i < tags.length - 1; i++) {
            res += '#';
            res += tags[i]
            res += ' '
        }
    }
    catch(err) { }
    return(res);
}


class PostView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isImgLoading: true,
            otherLikes: 0,
            profileImageURL: "http://i68.tinypic.com/awt7ko.jpg",
            postUser: "",
            name: "",
            timestamp: null,
            imageUri: "http://i68.tinypic.com/awt7ko.jpg",
            caption: "",
            tags: "",
            isLoading: true,
        }
        this.displayLikeInfo = this.displayLikeInfo.bind(this)
        this.getLikeInfo = this.getLikeInfo.bind(this)
    }

    componentDidMount() {
        // authenticate user
        var postID = this.props.postID;
        // Get the user who is viewing the post.
        userViewingVar = firebase.auth().currentUser.uid;
        this.getLikeInfo().then(function() {
            post_ref = firebase.firestore().collection("Posts");
            post_ref.doc(this.props.postID).get().then(function(doc) {
                photo_ref = firebase.firestore().collection("Photo");
                photo_ref.doc(this.props.postID).get().then(function(doc2) {
                    //console.log(doc2.data());
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
                          var alreadyLikedVar = false;
                          querySnapshot.forEach(function(doc3) {
                              console.log(doc3.data().postID);
                              // If the current user already liked the current post,
                              // set alreadyLikedVar to true
                              if(postID == doc3.data().postID) {
                                  alreadyLikedVar = true;
                                  console.log("test")
                              }
                          }.bind(this));



                        this.setState({
                            currentUser: userViewingVar,
                            name: doc1.data().first + " " + doc1.data().last,
                            postUser: doc.data().userID,
                            caption: doc.data().caption,
                            numComments: doc.data().numComments,
                            tags: doc.data().tags,
                            imageUri: doc2.data().imageUri,
                            timestamp: timestamp.tstring(),
                            alreadyLikedVar: alreadyLikedVar,
                            likedJustNow: false,
                            unlikedJustNow: false,
                            otherLikes: 0,
                            lastLiked: "",
                            isLoading: false,
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
        }.bind(this))

    }

    componentWillMount() {}

    // given a user id fetch profile picture from storage
    getProfileImage = async(user) => {
            const path = "ProfilePictures/".concat(user, ".jpg");
            const image_ref = firebase.storage().ref(path);
            const downloadURL = await image_ref.getDownloadURL()

            if (!downloadURL.cancelled) {
                this.setState({profileImageURL: downloadURL,isImgLoading:false,});
            } else {
                this.setState({profileImageURL: "http://i68.tinypic.com/awt7ko.jpg",isImgLoading:false,});
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
        this.setState({likedJustNow: false, unlikedJustNow: true});
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
                  this.setState({likedJustNow: true, unlikedJustNow: false});
              }.bind(this))

              // Update the local variables corresponding to the number of likes of the post
              this.getLikeInfo()
              var otherLikes = this.state.otherLikes
              this.setState({otherLikes: otherLikes + 1,
                             lastLiked: firebase.auth().currentUser.uid});
        firebase.firestore().collection("Updates").where("postid", "==", this.props.postID).where("type", "==", "LIKE").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                //console.log("found one")
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

    // Gets the number of likes for the current post and the last person who liked the post
    getLikeInfo = async() => {
     console.log("I got in getlikeinfo")
      firebase.firestore().collection("Updates").where("postid", "==", this.props.postID).where("type", "==", "LIKE").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
             // console.log("get like info test")
            // var otherLikes = doc.data().numLikes - 1
            // var lastLiked = doc.data().actUser
            // console.log("test getlikes")
            //   console.log("getlikeinfo otherlikes: ", otherLikes)
            //   console.log("getlikeinfo lastLiked: ", lastLiked)
            this.setState({otherLikes: doc.data().numLikes - 1,
                           lastLiked: doc.data().actUser});
          }.bind(this))
        }.bind(this))
    };

    displayLikeInfo = () => {
        // Get the update corresponding the current post.
            // console.log("in displayLikeInfo")
            // console.log("otherLikes: ", this.state.otherLikes)
            // console.log("lastLiked: ", this.state.lastLiked)
            // If at least one user liked the post, then display the name of the user
            // who liked the post.
          //  otherLikes = 2
          //  lastLiked = "Bob"
            if (this.state.otherLikes > 1)
            {
              console.log("I got here in otherlikes")
              return <Row style={{paddingLeft: 10, paddingBottom: 3}}>
                  <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}}>Liked by </Text>
                  <Text style={{color: COLOR_PINK, fontWeight: 'bold'}}> {this.state.lastLiked} </Text>
                  <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}}>and </Text>
                  <Text style={{color: COLOR_PINK, fontWeight: 'bold'}}> {this.state.otherLikes} </Text>
              </Row>;
           }
           else if (this.state.otherLikes == 1){
             return <Row style={{paddingLeft: 10, paddingBottom: 3}}>
                 <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}}> Liked by </Text>
                 <Text style={{color: COLOR_PINK, fontWeight: 'bold'}}> {this.state.lastLiked} </Text>
             </Row>;
           }
           return null;
    };

    displayLikeButton =  () => {
        // console.log("alraedyLikedVar: ", alreadyLikedVar)
        // console.log("likedJustNow: ", this.state.likedJustNow)
        // console.log("unlikedJustNow: ", this.state.unlikedJustNow)
        if ((this.state.likedJustNow || this.state.alreadyLikedVar) && ! this.state.unlikedJustNow) {
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
        if (Boolean(this.state.isImgLoading || this.state.isLoading) ) {
            return ( false )
        }
        console.log("render otherlikes ", this.state.otherLikes)
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
                                    <Text style = {styles.posterName}>{this.state.name}</Text>
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

                                {this.displayLikeButton()}

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


                            {this.displayLikeInfo()}

                            {/*caption*/}
                            <Text style={{paddingLeft: 10, paddingTop: 5}}>
                                <Text style={styles.caption}>{this.state.caption}</Text>
                                <Text style={styles.tags}>{getTagString(this.state.tags)}</Text>
                            </Text>
                        </Col>
                    </Grid>
                </Content>
            </Container>

            /*
            <View style={styles.container}>
            <LinearGradient
              colors={['rgba(122,122,122,0.2)', '#2a2a2a']}
              style={styles.backBox}>
                    <View style = {{height: 68, flexDirection: 'row', marginLeft: 10}}>
                        <View style={{flex: 2, flexDirection: 'row'}}>
                            <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Image style={styles.profile} source={{uri: this.state.profileImageURL}}/>
                            </View>
                        </View>
                        <View style = {{flex: 6, flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-start'}}>
                                <Button transparent
                                    onPress={() => this.props.navigation.navigate('Profile', {userID: firebase.auth().currentUser.uid})}>
                                    <Text style = {styles.posterName}>{this.state.name}</Text>
                                </Button>
                                <Text style={{color: COLOR_LGREY, marginTop: -10}}>{this.state.timestamp}</Text>
                            </View>
                        </View>
                    </View>

                    <View style = {{flexDirection: 'row'}}>
                        <Image
                            style={styles.image}
                            source = {{uri: this.state.imageUri}}
                        />
                    </View>

                    <View style = {{flexDirection: 'row', paddingTop: 10}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text style = {styles.smallInfoLeft}>Liked by </Text>
                                </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center'}}>
                                <Text style = {styles.smallInfoRight}>{this.state.numComments} Comments</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View style={{height: 80, width: Dimensions.get('window').width, flexDirection: 'column', flex: 1, paddingTop: 10}}>
                    <Text style = {styles.tags}>{this.state.tags}</Text>
                    <Text style = {styles.caption}>{this.state.caption}</Text>
                </View>
            </View>*/
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
