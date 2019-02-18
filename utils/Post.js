import React from 'react'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native'


export default class PostView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          isImgLoading: true,
       }
    }
    // authenticate user
    componentDidMount() {
    }

    componentWillMount() {
        postID = this.props.postID;
        post_ref = firebase.firestore().collection("Posts");
        post_ref.doc(postID).get().then(function(doc) {
            photo_ref = firebase.firestore().collection("Photo");
            photo_ref.doc(postID).get().then(function(doc2) {
                users_ref = firebase.firestore().collection("users");
                users_ref.doc(doc.data().userID).get().then(function(doc1) {
                    this.setState({
                        name: doc1.data().first + " " + doc1.data().last,
                        postUser: doc.data().userID,
                        caption: doc.data().caption,
                        numComments: doc.data().numComments,
                        tags: doc.data().tags,
                        imageUri: doc2.data().imageUri,
                    });
                }.bind(this))
            }.bind(this))
            this.getProfileImage(doc.data().userID);
        }.bind(this)).catch ((error) => {console.error(error);});


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
                <View style = {styles.backBox}>
                    <View style = {{height: 50, flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Image style={styles.profile} source={{uri: this.state.profileImageURL}}/>
                        </View>
                        <View style = {{flex: 1, flexDirection: 'row'}}>
                            <Text style = {styles.posterName}>{this.state.name}</Text>
                        </View>
                    </View>
                    <View style = {{flexDirection: 'row'}}>

                        <Image
                            style={styles.image}
                            source = {{uri: this.state.imageUri}}
                        />
                    </View>
                </View>
                <View>
                    <View style = {{flexDirection: 'row'}}>
                        <Text style = {styles.smallInfoLeft}>Liked by </Text>
                        <Text style = {styles.smallInfoRight}>{this.state.numComments} Comments</Text>
                    </View>
                    <View>
                        <Text style = {styles.posterName}>Tags: {this.state.tags}</Text>
                        <Text style = {styles.smallInfoLeft}>{this.state.caption}</Text>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: COLOR_BACKGRND,
    },
    backBox: {
        height: Dimensions.get('window').width + 50,
        width: Dimensions.get('window').width,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_DGREY,
        marginBottom: 50,
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
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40/2,
    },
    posterName: {
        color: COLOR_PINK,
        fontSize: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallInfoLeft: {
        color: COLOR_LGREY,
        fontSize: 12,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    smallInfoRight: {
        color: COLOR_LGREY,
        fontSize: 12,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
})
