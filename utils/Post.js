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
Date.prototype.toString = function() {
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
            numLikes: 0,
            profileImageURL: "http://i68.tinypic.com/awt7ko.jpg",
            postUser: "",
            name: "",
            timestamp: null,
            imageUri: "http://i68.tinypic.com/awt7ko.jpg",
            caption: "",
            tags: "",
            isLoading: true,
            username: "",
            likeInfo: null,
            lifeButton: null,
            likers: null,
        }
        this.displayLikeInfo = this.displayLikeInfo.bind(this)
        this.getLikeInfo = this.getLikeInfo.bind(this)
        this.getProfileImage = this.getProfileImage.bind(this)
        this.getLikers = this.getLikers.bind(this)
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
                        let timestamp = doc.data().timestamp.toDate();
                        // time_string = "Posted on " + timestamp.getMonth() " at " timestamp.getMinute();

                        // Determine if the currentuser (userViewingVar) already likes the post.
                        reaction_ref = firebase.firestore().collection("Reaction");
                        reaction_ref
                        .where("userID", "==", firebase.auth().currentUser.uid)
                        .get()
                        .then(function(querySnapshot) {
                          //console.log("in like verification")
                          var alreadyLikedVar = false;
                          querySnapshot.forEach(function(doc3) {
                              //console.log(doc3.data().postID);
                              // If the current user already liked the current post,
                              // set alreadyLikedVar to true
                              if(postID == doc3.data().postID) {
                                  alreadyLikedVar = true;
                                  //console.log("test")
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
                            username: doc1.data().username,
                            timestamp: timestamp.toString(),
                            alreadyLikedVar: alreadyLikedVar,
                            likedJustNow: false,
                            unlikedJustNow: false,
                            isLoading: false,
                        }, () => {
                            this.displayLikeButton()
                            this.displayLikeInfo()
                            this.getLikers()

                        });



                        // console.log("caption " + doc.data().caption)
                        // console.log("postid " + this.props.postID)
                        // console.log("imageuri " + doc2.data().imageUri)
                        // console.log("timestamp " + timestamp.tstring())
                      }.bind(this))
                    }.bind(this))
                }.bind(this))
                this.getProfileImage(doc.data().userID);
            }.bind(this)).catch ((error) => {console.error(error);});
        }.bind(this))

    }

    componentWillMount() {}

    // pretty prints a string given a date object

    getProfileImageSimple = async(uid) => {
        //console.log("uid passed to getprofileimagesimple: " + uid)
        const path1 = "ProfilePictures/".concat(uid,".jpg");
        const image_ref1 = firebase.storage().ref(path1);
        var url = await image_ref1.getDownloadURL()
        //console.log("is this a string: " + url)
        return url
    }


    getLikers() {
        this.setState({
            likers: []
        }, () => {
            firebase.firestore().collection("Reaction").where("postID", "==", this.props.postID).get().then(function(querySnapshot) {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(function(doc) {
                        firebase.firestore().collection("users").doc(doc.data().userID).get().then(function(doc1) {
                            this.getProfileImageSimple(doc.data().userID).then(function(url) {
                                this.setState((prevState, props) => {
                                    return {
                                        likers: prevState.likers.concat({key: doc.data().userID, uri: url, username: doc1.data().username}),
                                    };
                                })
                            }.bind(this))
                        }.bind(this))
                        //console.log("pushed a person this user follows")
                    }.bind(this))
                }
                //console.log("made it out of the querySnapshot forEach: " + pyf)
            }.bind(this))
        })

    }

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

        firebase.firestore().collection("Updates").where("postid", "==", this.props.postID).where("type", "==", "LIKE").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                //console.log("found one")
                var likeList = []
                newnumLikes = doc.data().numLikes - 1
                if (doc.data().likeList) {
                    likeList = doc.data().likeList
                } else { //should never happen because this is unlike
                    likeList = []
                }
                var newActUser = null
                if (doc.data().actUser == firebase.auth().currentUser.uid) {
                    newActUser = likeList.pop()
                } else {
                    newActUser = doc.data().actUser
                    for( var i = 0; i < likeList.length; i++){
                       if ( likeList[i] === firebase.auth().currentUser.uid) {
                         likeList.splice(i, 1);
                       }
                    }
                }

                doc.ref.update({
                    numLikes: newnumLikes,
                    likeList: likeList,
                    actUser: newActUser,
                }).then(function() {
                    if (newnumLikes == 0) {
                        this.setState({likeInfo: null})
                    } else {
                        this.getLikeInfo()
                    }

                    //console.log("success")
                }.bind(this)).catch(function(error) {
                    console.log("Error updating document: " + error);
                });
            }.bind(this))
        }.bind(this))

      //console.log("in handle unlike")
      firebase.firestore().collection("Reaction").where("userID", "==", firebase.auth().currentUser.uid).where("postID", "==", this.props.postID).get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc) {
            //console.log("about to delete doc")
            doc.ref.delete()
            //console.log("completed unlike")

          })
      }).then(function(){
        this.setState({likedJustNow: false, unlikedJustNow: true}, () => {
            this.displayLikeButton();
        });
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
                  this.setState({likedJustNow: true, unlikedJustNow: false}, () => {
                      this.displayLikeButton()
                  });
              }.bind(this))

              // Update the local variables corresponding to the number of likes of the post
              // this.getLikeInfo().then(function() {
              //     var otherLikes = this.state.otherLikes
              //     users_ref = firebase.firestore().collection("users");
              //     users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc1) {
              //         this.setState({otherLikes: otherLikes + 1,
              //                        lastLiked: doc1.data().username});
              //       }.bind(this))
              // })

        firebase.firestore().collection("Updates").where("postid", "==", this.props.postID).where("type", "==", "LIKE").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                //console.log("found one")
                newnumLikes = doc.data().numLikes + 1
                if (doc.data().likeList) {
                    likeList = doc.data().likeList
                } else {
                    likeList = []
                }
                likeList.push(doc.data().actUser)
                doc.ref.update({
                    numLikes: newnumLikes,
                    likeList: likeList,
                    actUser: firebase.auth().currentUser.uid,
                    timestamp:  firebase.firestore.Timestamp.fromDate(new Date()),
                }).then(function() {
                    this.getLikeInfo()
                    //console.log("success")
                }.bind(this)).catch(function(error) {
                    console.log("Error updating document: " + error);
                });
            }.bind(this))
        }.bind(this))
    }

    // Gets the number of likes for the current post and the last person who liked the post
    getLikeInfo = async() => {
     //console.log("I got in getlikeinfo")
      firebase.firestore().collection("Updates").where("postid", "==", this.props.postID).where("type", "==", "LIKE").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            users_ref = firebase.firestore().collection("users");
            users_ref.doc(doc.data().actUser).get().then(function(doc1) {

             // console.log("get like info test")
            // var otherLikes = doc.data().numLikes - 1
            // var lastLiked = doc.data().actUser
            // console.log("test getlikes")
            //   console.log("getlikeinfo otherlikes: ", otherLikes)
            //   console.log("getlikeinfo lastLiked: ", lastLiked)
            if (doc.data().numLikes == 0) {
                this.setState({numLikes: 0,
                               lastLiked: "",
                               likeInfo: null,
                               });
            } else {
                this.setState({numLikes: doc.data().numLikes,
                               lastLiked: doc1.data().username}, () => {
                                   this.displayLikeInfo()
                               });
            }

              }.bind(this))
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
          //console.log("called displayLikeInfo")
            if (this.state.numLikes > 2)
            {
              this.setState({
                  likeInfo: <Row style={{paddingLeft: 0, paddingBottom: 3}}>
                  <Button transparent
                      onPress={() => this.props.navigation.navigate('ListPeople', {listOfPeople: this.state.likers, title: "Liked by",})}
                      style={styles.likedby}>
                      <Text>
                      <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}} uppercase={false}>Liked by </Text>
                      <Text style={{color: COLOR_PINK, fontWeight: 'bold'}} uppercase={false}>{this.state.lastLiked}</Text>
                      <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}} uppercase={false}> and </Text>
                      <Text style={{color: COLOR_PINK, fontWeight: 'bold'}} uppercase={false}>{this.state.numLikes - 1}</Text>
                      <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}} uppercase={false}> others</Text>
                      </Text>
                      </Button>
                  </Row>
              }, () => {
                 // console.log("done")
              })
          } else if (this.state.numLikes == 2)
          {
            this.setState({
                likeInfo: <Row style={{paddingLeft: 0, paddingBottom: 3}}>
                <Button transparent
                    onPress={() => this.props.navigation.navigate('ListPeople', {listOfPeople: this.state.likers, title: "Liked by",})}
                    style={styles.likedby}>
                    <Text>
                    <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}} uppercase={false}>Liked by </Text>
                    <Text style={{color: COLOR_PINK, fontWeight: 'bold'}} uppercase={false}>{this.state.lastLiked}</Text>
                    <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}} uppercase={false}> and </Text>
                    <Text style={{color: COLOR_PINK, fontWeight: 'bold'}} uppercase={false}>{this.state.numLikes - 1}</Text>
                    <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}} uppercase={false}> other</Text>
                    </Text>
                    </Button>
                </Row>
            }, () => {
                //console.log("done")
            })
         }
           else if (this.state.numLikes == 1){
               this.setState({
                   likeInfo: <Row style={{paddingLeft: 0, paddingBottom: 3}}>
                   <Button transparent
                       onPress={() => this.props.navigation.navigate('ListPeople', {listOfPeople: this.state.likers, title: "Liked by",})}
                       style={styles.likedby}>
                       <Text>
                       <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}} uppercase={false}>Liked by </Text>
                       <Text style={{color: COLOR_PINK, fontWeight: 'bold'}} uppercase={false}>{this.state.lastLiked} </Text>
                       </Text>
                       </Button>
                   </Row>
               }, () => {
                   //console.log("done")
               })
           } else {
               this.setState({
                   likeInfo: null,
               })
           }
    };

    displayLikeButton =  () => {
        // console.log("alraedyLikedVar: ", alreadyLikedVar)
        // console.log("likedJustNow: ", this.state.likedJustNow)
        // console.log("unlikedJustNow: ", this.state.unlikedJustNow)
        if ((this.state.likedJustNow || this.state.alreadyLikedVar) && ! this.state.unlikedJustNow) {
            this.setState({
                likeButton: <Button icon transparent
                            style={{marginLeft: -15}}>
                            <Icon
                                type="FontAwesome"
                                name="heart"
                                style={{color: COLOR_LGREY}}
                                onPress={this.handleUnlike}/>
                        </Button>
            })
            // return <Button title="UnFollow" onPress={this.handleUnFollow} color= 'rgba(228,228,228,0.66)'/>;
        } else {
            // return <Button title="Follow" onPress={this.handleFollow} color= 'rgba(228,228,228,0.66)'/>;
            this.setState({
                likeButton: <Button icon transparent
                        style={{marginLeft: -15}}>
                        <Icon
                            type="Feather"
                            name="heart"
                            style={{color: COLOR_LGREY}}
                            onPress={this.handleLike}/>
                    </Button>
                })
        }
    };

    render() {
        if (Boolean(this.state.isImgLoading || this.state.isLoading) ) {
            return ( false )
        }
        //console.log("render numLikes ", this.state.numLikes)
        return (
            <Grid style={styles.container}>
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

                        {this.state.likeButton}

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


                    {this.state.likeInfo}

                    {/*caption*/}
                    <Text style={{paddingLeft: 10, paddingTop: 0}}>
                        <Text style={styles.caption}>{this.state.caption}</Text>
                        <Text style={styles.tags}>{getTagString(this.state.tags)}</Text>
                    </Text>
                </Col>
            </Grid>
        )
    }
}

export default withNavigation(PostView);

const styles = StyleSheet.create({
    container: {
        fontSize: 20,
        backgroundColor: COLOR_BACKGRND,
        marginBottom: 40
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
    },
    likedby: {
        marginTop: -10,
        marginLeft: -6,
        marginBottom: -8,
        paddingBottom: 0
    }
})
