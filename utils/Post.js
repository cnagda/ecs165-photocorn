import React from 'react'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_PURPLE, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { AppRegistry, StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import { Button, Grid, Col } from 'native-base';
import { withNavigation } from 'react-navigation';
import {LinearGradient} from 'expo'

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

Date.prototype.tstring = function() {
  var month = monthNames[this.getMonth()];
  var day = this.getDate();
  var hh = this.getHours();
  var mm = this.getMinutes();

  return ["Posted on ", month, ' ', day, " at ", hh, ":", mm].join('');
};

class PostView extends React.Component {

    constructor(props) {
        super(props);
        // this.toProfile = this.toProfile.bind(this);

        this.state = {
          isImgLoading: true,
       }
    }
    // authenticate user
    componentDidMount() {
        postID = this.props.postID;
        post_ref = firebase.firestore().collection("Posts");
        post_ref.doc(this.props.postID).get().then(function(doc) {
            photo_ref = firebase.firestore().collection("Photo");
            photo_ref.doc(this.props.postID).get().then(function(doc2) {
                console.log(doc2.data());
                users_ref = firebase.firestore().collection("users");
                users_ref.doc(doc.data().userID).get().then(function(doc1) {
                    timestamp = doc.data().timestamp.toDate();
                    // time_string = "Posted on " + timestamp.getMonth() " at " timestamp.getMinute();
                    this.setState({
                        name: doc1.data().first + " " + doc1.data().last,
                        postUser: doc.data().userID,
                        caption: doc.data().caption,
                        numComments: doc.data().numComments,
                        tags: doc.data().tags,
                        imageUri: doc2.data().imageUri,
                        timestamp: timestamp.tstring(),
                    });
                    console.log("caption " + doc.data().caption)
                    console.log("postid " + this.props.postID)
                    console.log("imageuri " + doc2.data().imageUri)
                    console.log("timestamp " + timestamp.tstring())
                }.bind(this))
            }.bind(this))
            this.getProfileImage(doc.data().userID);
        }.bind(this)).catch ((error) => {console.error(error);});
    }

    componentWillMount() {



    }

    toProfile(prof) {
        this.props.toProfile(prof);
    }

    getProfileImage = async(user) => {
            const path = "ProfilePictures/".concat(user, ".jpg");
            const image_ref = firebase.storage().ref(path);
            const downloadURL = await image_ref.getDownloadURL()

            if (!downloadURL.cancelled) {
              this.setState({profileImageURL: downloadURL,isImgLoading:false,});
          }
    };

    render() {
        if (Boolean(this.state.isImgLoading) ) {
            return ( false )
        }
        return (
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
            </View>
        )
    }
}

export default withNavigation(PostView);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: COLOR_BACKGRND,
        marginBottom: 10
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    profile: {
        height: 54,
        width: 54,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 54/2,
        marginTop: 0,
    },
    posterName: {
        color: COLOR_PINK,
        fontSize: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallInfoLeft: {
        color: 'white',
        fontSize: 15,
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    caption: {
        color: COLOR_LGREY,
        fontSize: 15,
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    tags: {
        color: COLOR_PURPLE,
        fontSize: 15,
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    smallInfoRight: {
        color: 'white',
        fontSize: 15,
        marginRight: 20,
        alignItems: 'flex-end'
    },
})
