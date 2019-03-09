import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight, TextInput, ScrollView, Image, Platform, KeyboardAvoidingView, Dimensions } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY , COLOR_PURPLEPINK} from './../components/commonstyle';
import { uploadPhoto } from '../utils/Photos'
import { ImagePicker } from 'expo';
import { Button } from 'native-base';


export default class NewPost extends React.Component {
    // authenticate user
    componentDidMount() {
        method = this.props.navigation.getParam('method', 'upload');
        this.setState({
            isUpload: method === "upload",
        })
    }

    componentWillReceiveProps() {
        method = this.props.navigation.getParam('method', 'upload');
        this.setState({
            isUpload: method === "upload",
        })
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
        tags: '',
        caption: '',
        labels: null,
        bucket: '',
    }

    chooseBucket = () => {
        console.log("in chooseBucket");
        var buckets = {};
        buckets['Dog'] = 'Animals';
        buckets['Cat'] = 'Animals';
        buckets['Mammal'] = 'Animals';
        buckets['Bird'] = 'Animals';
        buckets['Reptile'] = 'Animals';
        buckets['Fish'] = 'Animals';
        buckets['Marinw Mammal'] = 'Animals';
        buckets['Wildlife'] = 'Animals';
        buckets['Tiger'] = 'Animals';
        buckets['Lion'] = 'Animals';
        buckets['Chameleon'] = 'Animals';
        buckets['Lizard'] = 'Animals';
        buckets['Turtle'] = 'Animals';
        buckets['Fox'] = 'Animals';
        buckets['Bear'] = 'Animals';
        buckets['Duck'] = 'Animals';
        buckets['Pig'] = 'Animals';
        buckets['Llama'] = 'Animals';
        buckets['Alpaca'] = 'Animals';
        buckets['Elephant'] = 'Animals';
        buckets['Wolf'] = 'Animals';
        buckets['Hamster'] = 'Animals';
        buckets['Monkey'] = 'Animals';
        buckets['Koala'] = 'Animals';
        buckets['Frog'] = 'Animals';
        buckets['Pet'] = 'Animals';
        buckets['Horse'] = 'Animals';
        buckets['Unicorn'] = 'Animals';
        buckets['Mythical Creature'] = 'Animals';

        buckets['Flower'] = 'Nature';
        buckets['Plant'] = 'Nature';
        buckets['Wildlife']	= 'Nature';
        buckets['Nature']	= 'Nature';
        buckets['Tree']	= 'Nature';
        buckets['Wilderness']	= 'Nature';
        buckets['Forest']	= 'Nature';
        buckets['Natural Landscape'] = 'Nature';
        buckets['Ocean'] = 'Nature';
        buckets['Water'] = 'Nature';
        buckets['Underwater']	= 'Nature';
        buckets['Sky'] = 'Nature';
        buckets['Sea'] = 'Nature';
        buckets['Sunset']	= 'Nature';
        buckets['Coast'] = 'Nature';
        buckets['Landscape'] = 'Nature';
        buckets['Woodland']	= 'Nature';
        buckets['Waterfall'] = 'Nature';
        buckets['Mountain']	= 'Nature';
        buckets['Tropics'] = 'Nature';
        buckets['Beach'] = 'Nature';
        buckets['Cloud'] = 'Nature';
        buckets['Mountain Range']	= 'Nature';
        buckets['Hill']	= 'Nature';
        buckets['National Park'] = 'Nature';
        buckets['Glacier'] = 'Nature';
        buckets['Mountainous Landforms'] = 'Nature';
        buckets['Valley']	= 'Nature';
        buckets['Galaxy']	= 'Nature';
        buckets['Outer Space'] = 'Nature';
        buckets['Nebula']	= 'Nature';
        buckets['Universe']	= 'Nature';
        buckets['Astronomical Object'] = 'Nature';
        buckets['Sun'] = 'Nature';
        buckets['Astronomy'] = 'Nature';
        buckets['Planet']	= 'Nature';
        buckets['Atmosphere']	= 'Nature';

        buckets['Face'] = 'People';
        buckets['Hair'] = 'People';
        buckets['Nose'] = 'People';
        buckets['Skin'] = 'People';
        buckets['Facial Expression'] = 'People';
        buckets['People'] = 'People';
        buckets['Smile'] = 'People';
        buckets['Forehead'] = 'People';
        buckets['Gesture'] = 'People';
        buckets['Neck'] = 'People';
        buckets['Thumb'] = 'People';
        buckets['Social Group'] = 'People';
        buckets['Spokesperson'] = 'People';
        buckets['Businessperson'] = 'People';
        buckets['Fun'] = 'People';
        buckets['Party'] = 'People';
        buckets['Event'] = 'People';
        buckets['Chin'] = 'People';
        buckets['Wrinkle'] = 'People';
        buckets['Head'] = 'People';
        buckets['Human'] = 'People';
        buckets['Nose'] = 'People';
        buckets['Social Group'] = 'People';
        buckets['Community'] = 'People';
        buckets['Glasses'] = 'People';
        buckets['Eyebrow'] = 'People';
        buckets['Family'] = 'People';

        buckets['Food'] = 'Food';
        buckets['Dish'] = 'Food';
        buckets['Cuisine'] = 'Food';
        buckets['Ingredient'] = 'Food';
        buckets['Junk Food'] = 'Food';
        buckets['Fried Food'] = 'Food';
        buckets['Produce'] = 'Food';
        buckets['Finger Food'] = 'Food';
        buckets['Snack'] = 'Food';
        buckets['Natural Foods'] = 'Food';
        buckets['Whole Food'] = 'Food';
        buckets['Superfood'] = 'Food';
        buckets['Meal'] = 'Food';
        buckets['Taco'] = 'Food';
        buckets['Sushi'] = 'Food';
        buckets['Comfort Food'] = 'Food';
        buckets['Brunch'] = 'Food';
        buckets['Lunch'] = 'Food';
        buckets['Breakfast'] = 'Food';
        buckets['Dinner'] = 'Food';
        buckets['Baking'] = 'Food';
        buckets['Baked Goods'] = 'Food';
        buckets['Cookie'] = 'Food';
        buckets['Dessert'] = 'Food';
        buckets['Noodle'] = 'Food';
        buckets['Pizza'] = 'Food';
        buckets['Hamburger'] = 'Food';
        buckets['Fast Food'] = 'Food';
        buckets['Ice Cream'] = 'Food';
        buckets['Frozen Dessert'] = 'Food';

        buckets['Technology'] = 'Technology';
        buckets['Screen'] = 'Technology';
        buckets['Output Device'] = 'Technology';
        buckets['Display Device'] = 'Technology';
        buckets['Electronic Device'] = 'Technology';
        buckets['Electronics'] = 'Technology';
        buckets['Laptop'] = 'Technology';
        buckets['Gadget'] = 'Technology';
        buckets['Multimedia'] = 'Technology';
        buckets['Personal Computer'] = 'Technology';
        buckets['Game Controller'] = 'Technology';
        buckets['Computer Component'] = 'Technology';
        buckets['Astronaut'] = 'Technology';
        buckets['Space'] = 'Technology';
        buckets['Loudspeaker'] = 'Technology';
        buckets['Audio Equipment'] = 'Technology';
        buckets['Smartphone'] = 'Technology';

        buckets['Sportswear'] = 'Fitness/Sports';
        buckets['Physical Fitness'] = 'Fitness/Sports';
        buckets['Strength Training'] = 'Fitness/Sports';
        buckets['Muscle'] = 'Fitness/Sports';
        buckets['Weights'] = 'Fitness/Sports';
        buckets['Exercise Equipment'] = 'Fitness/Sports';
        buckets['Bodybuilding'] = 'Fitness/Sports';
        buckets['Press Up'] = 'Fitness/Sports';
        buckets['Fitness Professional'] = 'Fitness/Sports';
        buckets['Basketball'] = 'Fitness/Sports';
        buckets['Sports'] = 'Fitness/Sports';
        buckets['Team Sport'] = 'Fitness/Sports';
        buckets['Player'] = 'Fitness/Sports';
        buckets['Ball Game'] = 'Fitness/Sports';
        buckets['Sports Equipment'] = 'Fitness/Sports';
        buckets['Sports Gear'] = 'Fitness/Sports';
        buckets['Helmet'] = 'Fitness/Sports';
        buckets['Football Gear'] = 'Fitness/Sports';
        buckets['American Football'] = 'Fitness/Sports';
        buckets['Baseball Player'] = 'Fitness/Sports';
        buckets['Sport Venue'] = 'Fitness/Sports';
        buckets['Soccer Player'] = 'Fitness/Sports';
        buckets['Football Player'] = 'Fitness/Sports';
        buckets['Soccer'] = 'Fitness/Sports';
        buckets['Ice Hockey'] = 'Fitness/Sports';
        buckets['Hockey'] = 'Fitness/Sports';
        buckets['Taekwondo'] = 'Fitness/Sports';
        buckets['Combat Sport'] = 'Fitness/Sports';
        buckets['Martial Arts'] = 'Fitness/Sports';
        buckets['Contact Sport'] = 'Fitness/Sports';
        buckets['Professional Boxer'] = 'Fitness/Sports';
        buckets['Boxing Ring'] = 'Fitness/Sports';
        buckets['Boxing'] = 'Fitness/Sports';
        buckets['Tennis'] = 'Fitness/Sports';
        buckets['Tennis Player'] = 'Fitness/Sports';
        buckets['Tennis Racket'] = 'Fitness/Sports';
        buckets['Volleyball'] = 'Fitness/Sports';
        buckets['Stadium'] = 'Fitness/Sports';
        buckets['Arena'] = 'Fitness/Sports';
        buckets['Golfer'] = 'Fitness/Sports';
        buckets['Golf'] = 'Fitness/Sports';
        buckets['Golf Course'] = 'Fitness/Sports';
        buckets['Golf Club'] = 'Fitness/Sports';
        buckets['Running'] = 'Fitness/Sports';
        buckets['Outdoor Recreation'] = 'Fitness/Sports';
        buckets['Jogging'] = 'Fitness/Sports';
        buckets['Individual Sports'] = 'Fitness/Sports';
        buckets['Exercise'] = 'Fitness/Sports';
        buckets['Jumping'] = 'Fitness/Sports';
        buckets['Pole Vault'] = 'Fitness/Sports';

        buckets['Text'] = 'Motivational Quotes';
        buckets['Font'] = 'Motivational Quotes';

        console.log("In chooseBucket");

        // just chooses the bucket that appears most.
        var choices = {};
        choices["Animals"] = 0;
        choices["Nature"] = 0;
        choices["People"] = 0;
        choices["Food"] = 0;
        choices["Technology"] = 0;
        choices["Fitness/Sports"] = 0;
        choices["Motivational Quotes"] = 0;
        labels = this.state.labels;
        for (var i = 0; i < labels.length; i++) {
           choices[buckets[labels[i]]] += 1;
        }

        var max = 0;
        var choice = "Other";
        Object.keys(choices).forEach(function (key) {
            if (choices[key] > max) {
                max = choices[key];
                choice = key;
            }
        });
        this.setState({ bucket: choice });
    }

    handlePost = () => {
        const { uploadedImageURL, photoID, caption, numComments, userID, tags, labels } = this.state

        console.log("in handlePost");
        console.log(labels);
        while (this.state.labels === null) {
           // there has to be a better way to do this...
        }

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
                console.log("length: " + tags.length)
                if (tags !== null && tags.length > 0) {
                    tagArr = tags.split(" ")
                    console.log(tagArr)
                    tagArr.forEach(function(tag) {
                        console.log(tag)

                        firebase.firestore().collection("Tags").doc(tag).get().then(function(doc) {
                            postIDList = []
                            if (doc.exists) {
                                postIDList = doc.data().posts;
                                console.log(doc.data())
                            }
                            console.log(postIDList)
                            postIDList.push(photoID)
                            console.log(postIDList)
                            firebase.firestore().collection("Tags").doc(tag).set({
                                posts: postIDList,
                                tag: tag
                            })
                        })
                    })
                }
            }.bind(this)).then(function() {
                firebase.firestore().collection("Updates").doc().set({
                    type: "LIKE",
                    postid: photoID,
                    numLikes: 0,
                    currUser: firebase.auth().currentUser.uid,
                    timestamp:  firebase.firestore.Timestamp.fromDate(new Date()),
                    actUser: "",
                }).then(function() {
                    firebase.firestore().collection("Updates").doc().set({
                        type: "COMMENT",
                        postid: photoID,
                        numComments: 0,
                        currUser: firebase.auth().currentUser.uid,
                        timestamp:  firebase.firestore.Timestamp.fromDate(new Date()),
                        actUser: "",
                    }).then(function() {
                        var regex = new RegExp(/(\@(\w|\b)+)/, 'g')
                        var mentions = caption.match(regex)
                        if (mentions) {
                            mentions.forEach(function(mention) {
                                firebase.firestore().collection("users").where("username", "==", mention.substr(1) ).get().then(function(querySnapshot) {
                                    querySnapshot.forEach(function(doc) {
                                        firebase.firestore().collection("Updates").doc().set({
                                            type: "MENTION",
                                            postid: photoID,
                                            currUser: doc.data().uid,
                                            timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                                            actUser: firebase.auth().currentUser.uid,
                                            mentionType: "post",
                                            text: caption,
                                        })
                                    }.bind(this))
                                }.bind(this))
                            }.bind(this))

                        }
                        this.setState({finishedPost: true});
                    }.bind(this))
                }.bind(this))
            }.bind(this))
        }.bind(this))

    }

    getCameraAndCameraRollPermissions = async() => {
        console.log("trying to get camera roll permissions")
        const {  Permissions } = Expo;
        // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
        const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        console.log("status: " + status)
        return status
    };

    // set a profile picture
    takePhoto = async () => {
        var status = await this.getCameraAndCameraRollPermissions();
        if (status === 'granted') {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                base64: true,
                aspect: [1, 1],
            });

            if (!result.cancelled) {
                this.setState({base64: result.base64})
                //await this.setState({image: result.uri,});

                this.submitToGoogle();
                uploadPhoto(result.uri, path);

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
        }
    };


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
            });

            if (!result.cancelled) {
                this.setState({base64: result.base64})
                //await this.setState({image: result.uri,});
                this.submitToGoogle();
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

    submitToGoogle = async () => {
        console.log("In submitToGoogle")
        imageURI = this.state.image
        imageURIb64 = this.state.base64
        try {
            this.setState({ uploading: true });
            let body = JSON.stringify({
                requests: [
                    {
                        features: [
                            { type: "LABEL_DETECTION", maxResults: 10 },
                            { type: "WEB_DETECTION", maxResults: 5 }
                        ],
                        image: {
                            content: imageURIb64

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
            //console.log(responseJson);
            // Get the image labels
            labels = responseJson["responses"]["0"]["labelAnnotations"]

            parsedLabels = []

            for (var k in labels){
                currTag = labels[k]
                console.log(currTag["description"])
                parsedLabels.push(currTag["description"])
            }
            //uploadTags(parsedLabels, this.state.photoID)
            this.setState({
                labels: parsedLabels,
                uploading: false
            });

        } catch (error) {
            console.log(error);
        }
    };


    startImgSelection = async() => {
        if (this.state.isUpload) {
            this.pickImage()
        } else {
            this.takePhoto()
        }
    }

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
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={{flex:1, flexDirection:'column',}} >
                    <View style={{flex:1, paddingTop: 40,}}>
                        <TouchableHighlight style={styles.outerSquare} onPress={this.startImgSelection}>
                          <Image
                              style={styles.innerSquare}
                              source = {{uri: "data:image/jpeg;base64," + this.state.base64}}
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
                            placeholder="Tags (separated by space)"
                            style={styles.textInput}
                            onChangeText={tags => this.setState({ tags })}
                            value={this.state.tags}
                            autoCapitalize="none"
                        />
                        <View style = {styles.doneButton} >
                            <Button style={{backgroundColor: '#f300a2', width: 100, justifyContent: 'center'}} onPress={this.handlePost}>
                                <Text style={{color: 'white'}}>Post</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
