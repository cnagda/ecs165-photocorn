import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight, TextInput, ScrollView, Image, Platform, KeyboardAvoidingView, Dimensions } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY , COLOR_PURPLEPINK} from './../components/commonstyle';
import { uploadPhoto } from '../utils/Photos'
import { ImagePicker } from 'expo';
import { Button, Content } from 'native-base';


export default class NewPostUpload extends React.Component {
    // authenticate user
    componentDidMount() {

    }

    state = {
        errorMessage: null,
        finishedEdit: false,
        image: null,
        isImgLoading: true,
        photoID: firebase.auth().currentUser.uid + Date.now(),
        caption: '',
        numComments: 0,
        userID: firebase.auth().currentUser.uid,
    }

    handlePost = () => {
        const { uploadedImageURL, photoID, caption, numComments, userID, tags } = this.state
        firebase.firestore().collection("Posts").doc(photoID).set({
            photoID: photoID,
            postID: photoID,
            caption: caption,
            numComments: numComments,
            userID: userID,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            tags: tags,
        }).then(function() {
            firebase.firestore().collection("Photo").doc(photoID).set({
                photoID: photoID,
                imageUri: uploadedImageURL,
            }).then(function() {
                this.setState({finishedPost: true});
            }.bind(this))
        }.bind(this))

    }

    getCameraRollPermissions = async() => {
        console.log("trying to get camera roll permissions")
        const {  Permissions } = Expo;
        // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
        const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        console.log("status: " + status)
        return status
    };

    // set a profile picture
    pickImage = async () => {
        var status = await this.getCameraRollPermissions();
        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                base64: true,
                aspect: [1, 1],
            }).then(function() {
                console.log("Before request")
                this.setState({image: result.uri,});
                this.submitToGoogle()
                console.log("After request")
            }).then(function() {
                if (!result.cancelled) {
                    const path = "Posts/".concat(this.state.photoID, ".jpg");
                    console.log(result.uri);
                    console.log(path);
                    return uploadPhoto(result.uri, path).then(function() {
                        this.setState({isImgLoading: true})
                        this.getUploadedImage(this.state.photoID).then(function() {
                            this.setState({isImgLoading: false})
                        }.bind(this));
                    }.bind(this));
                }
            })
        }
    };

    submitToGoogle = async () => {
        console.log("In submitToGoogle")
        try {
            this.setState({ uploading: true });
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            { type: "LABEL_DETECTION", maxResults: 10 },
                            { type: "LANDMARK_DETECTION", maxResults: 5 },
                            { type: "FACE_DETECTION", maxResults: 5 },
                            { type: "LOGO_DETECTION", maxResults: 5 },
                            { type: "TEXT_DETECTION", maxResults: 5 },
                            { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
                            { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
                            { type: "IMAGE_PROPERTIES", maxResults: 5 },
                            { type: "CROP_HINTS", maxResults: 5 },
                            { type: "WEB_DETECTION", maxResults: 5 }
                        ],
                        image: {
                            source: {
                                imageUri: this.state.image
                            }
                        }
                    }
                ]
            });
            console.log("Created body")
            let response = await fetch(
                "https://vision.googleapis.com/v1/images:annotate?key=" +
                "AIzaSyD3yoe5pFlzna3E4EgkbCSOLv3A5hHqNfg",
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: body
                }
            );
            console.log("Made response")
            let responseJson = await response.json();
            console.log(responseJson);
            this.setState({
                googleResponse: responseJson,
                uploading: false
            });
        } catch (error) {
            console.log(error);
        }
    };

    getUploadedImage = async(photoID) => {
          console.log("in get profile image");
            console.log(photoID)
            const path = "Posts/".concat(photoID, ".jpg");
            console.log(path)
            const image_ref = firebase.storage().ref(path);
            const downloadURL = await image_ref.getDownloadURL()

            if (!downloadURL.cancelled) {
              console.log("testing1")
              console.log(downloadURL)
              this.setState({uploadedImageURL: downloadURL, isImgLoading:false,});
          }
    };

    render() {
        if (this.state.finishedPost) {
            return (this.props.navigation.navigate('HomeScreen', {userID: firebase.auth().currentUser.uid}))
        }
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
        return (
            <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                keyboardVerticalOffset = {keyboardVerticalOffset}
                behavior="padding"
                enabled
            >
            <Content showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems: 'center'}}>
                <View style={{flex:1, flexDirection:'column'}} >
                    <View style={{flex:1, paddingTop: 40,}}>
                        <TouchableHighlight style={styles.outerSquare} onPress={this.pickImage}>
                          <Image
                              style={styles.innerSquare}
                              source = {{uri: this.state.uploadedImageURL}}
                          />
                        </TouchableHighlight>
                    </View>
                    <View style={{flex:3}}>
                        <TextInput
                            placeholderTextColor='#f300a2'
                            placeholder="Caption"
                            style={styles.textInput}
                            onChangeText={caption => this.setState({ caption })}
                            value={this.state.caption}
                        />
                        <TextInput
                            placeholderTextColor='#f300a2'
                            placeholder="Hashtags (separated by space)"
                            style={styles.textInput}
                            onChangeText={tags => this.setState({ tags })}
                            value={this.state.tags}
                            autoCapitalize="none"
                        />
                        <View style = {styles.doneButton}>
                            <Button style={{backgroundColor: '#f300a2', width: 100, justifyContent: 'center'}} onPress={this.handlePost}>
                                <Text style={{color: 'white'}}>Post</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Content>
            </KeyboardAvoidingView>
            </View>
        )
    }
}

//note: font not working

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingTop: 40,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_BACKGRND,
    },
    outerSquare: {
        width:  Dimensions.get('window').width * 0.9,
        height:  Dimensions.get('window').width * 0.9,
        backgroundColor: COLOR_DGREY,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },

    innerSquare: {
        width:  Dimensions.get('window').width * 0.9,
        height:  Dimensions.get('window').width * 0.9,
        backgroundColor: COLOR_DGREY,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        height: 40,
        width: Dimensions.get('window').width * 0.9,
        color: COLOR_PINK,
        marginTop: 20,
        backgroundColor: COLOR_DGREY,
        paddingLeft: 10,
        borderRadius: 12
    },
    doneButton: {
        alignItems: 'stretch',
        justifyContent: 'center',
        // flex: 1,
        flexDirection: 'row',
        marginTop: 30,
    },
})
