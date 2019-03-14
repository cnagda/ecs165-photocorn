import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight, TextInput, ScrollView, Image, Platform, KeyboardAvoidingView } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY , COLOR_PURPLEPINK} from './../components/commonstyle';
import { uploadPhoto } from '../utils/Photos'
import { ImagePicker } from 'expo';
import { Container, Content, ActionSheet, Root, Button } from 'native-base';
import { CheckBox } from 'react-native-elements'

var BUTTONS = ["Take a Photo", "Upload a Photo", "Cancel"];
var CANCEL_INDEX = 2;

export default class ProfileEdit extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            errorMessage: null,
            finishedEdit: false,
            image: null,
            interests: '',
            bio: '',
            dob:'',
            isImgLoading: true,
            gotNewPhoto: false,
            image: null,
            animals: false,
            nature: false,
            people: false,
            food: false,
            tech: false,
            fitness: false,
            motivation: false,
        }
    }
    // authenticate user
    componentDidMount() {
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            //console.log("inside get " + firebase.auth().currentUser.uid)

            this.getProfileImage(firebase.auth().currentUser.uid);

            this.setState(
                {
                    currentUser: firebase.auth().currentUser,
                    firstname: doc.data().first,
                    lastname: doc.data().last,
                    dob: doc.data().dob,
                    email: firebase.auth().currentUser.email,
                    bio: doc.data().bio ? doc.data().bio: "",
                    interests: doc.data().interests,
                    username: doc.data().username,
                    isLoading: false,

                }
            );
            if (doc.data().interests && doc.data().interests != "") {
                this.setState(
                    {
                        animals: doc.data().interests.includes("Animals"),
                        nature: doc.data().interests.includes("Nature"),
                        people: doc.data().interests.includes("People"),
                        food: doc.data().interests.includes("Food"),
                        tech: doc.data().interests.includes("Technology"),
                        fitness: doc.data().interests.includes("Fitness/Sports"),
                        motivation: doc.data().interests.includes("Motivational Quotes"),
                    }
                );
            }
        }.bind(this)).catch ((error) => {console.error(error);});

    }

    componentWillMount() {
        //console.log("inside component will mount in profile edit")
    }

    componentWillReceiveProps() {
        //console.log("inside component will receive props in profile edit")

        //this.setNewPhotoAsProfile()
    }

    setNewPhotoAsProfile = async(resultloc) => {
        //console.log("inside of setNewPhotoAsProfile")
        //console.log("resulturi: " + resultloc)
        ////console.log(this.props.navigation.state.params)
        result = resultloc;
        if (result != 'NULLVALUE') {
            this.setState({gotNewPhoto: false, image: result});
            const path = "ProfilePictures/".concat(firebase.auth().currentUser.uid, ".jpg");
            //console.log(result);
            //console.log(path);
            return uploadPhoto(result, path).then(function() {
                this.setState({isImgLoading: true})
                this.getProfileImage(firebase.auth().currentUser.uid).then(function() {
                    this.setState({isImgLoading: false})
                }.bind(this));
            }.bind(this));
        }
    }



    handleUploadPhoto = async() => {
        //console.log ("trying to handle upload photo")
        var status = await this.getCameraRollPermissions();
        if (status === 'granted') {
            //var resultloc = await this.pickImage();
            ////console.log("resulturi: " + resultloc)
            ////console.log("return screen: " + this.props.navigation.getParam('returnScreen', "NULLVALUE"))
            //await this.setNewPhotoAsProfile(resultloc)
            this.pickImage().then(function(resultloc) {
                //console.log("made it here: " + resultloc)
                this.setNewPhotoAsProfile(resultloc)
            }.bind(this))
        }
        this.setState({isImgLoading: false,})
    }

    handleTakePhoto = async() => {
        //console.log ("trying to handle take photo")
        var status = await this.getCameraAndCameraRollPermissions();
        if (status === 'granted') {
            //var resultloc = await this.takePhoto();
            ////console.log(resultloc)
            //setNewPhotoAsProfile(resultloc)
            this.takePhoto().then(function(resultloc) {
                //console.log("made it here: " + resultloc)
                this.setNewPhotoAsProfile(resultloc)
            }.bind(this))
        }
        this.setState({isImgLoading: false,})
    }


    getCameraRollPermissions = async() => {
        //console.log("trying to get camera roll permissions")
        const {  Permissions } = Expo;
        // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
        const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        //console.log("status: " + status)
        return status
    };

    getCameraAndCameraRollPermissions = async() => {
        //console.log("trying to get camera roll permissions")
        const {  Permissions } = Expo;
        // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
        const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        //console.log("status: " + status)
        return status
    };

    // set a profile picture
    pickImage = async () => {
        //console.log("trying to launch image picker")
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            base64: true,
            aspect: [1, 1],
        });

        if (!result.cancelled) {
            //console.log(result.uri)
            return result.uri
        }
    };

    takePhoto = async () => {
        //console.log("trying to launch image picker")
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            base64: true,
            aspect: [1, 1],
        });

        if (!result.cancelled) {
            //console.log(result.uri)
            return result.uri
        }
    };

    handleEdits = () => {
        const { email, password, firstname, lastname, dob, interests, bio, username } = this.state
            var user = firebase.auth().currentUser;
            var interestarray = []
            if (this.state.animals) {interestarray.push("Animals")}
            if (this.state.nature) {interestarray.push("Nature")}
            if (this.state.people) {interestarray.push("People")}
            if (this.state.food) {interestarray.push("Food")}
            if (this.state.tech) {interestarray.push("Technology")}
            if (this.state.fitness) {interestarray.push("Fitness/Sports")}
            if (this.state.motivation) {interestarray.push("Motivational Quotes")}
            var intereststring = interestarray.join(', ')
            user.updateEmail(email).then(
            firebase.firestore().collection("users").doc(user.uid).set({
                first: firstname,
                last: lastname,
                email: email,
                dob: dob,
                uid: user.uid,
                interests: intereststring,
                username: username,
                bio: bio,
            }).then(function() {
                this.setState({finishedEdit: true});
                //console.log("inside set " + user.uid)
            }.bind(this))
            )
    }

    getProfileImage = async(user) => {
          //console.log("in get profile image");
            //console.log(user)
            const path = "ProfilePictures/".concat(user, ".jpg");
            //console.log(path)

            const image_ref = firebase.storage().ref(path);
            const downloadURL = await image_ref.getDownloadURL()
            //setNewPhotoAsProfile()
                if (!downloadURL.cancelled) {
                  //console.log("testing1")
                  //console.log(downloadURL)
                  this.setState({profileImageURL: downloadURL, isImgLoading:false,});
                  return downloadURL
              }
    };

    render() {
        if(this.state.isLoading || this.state.isImgLoading ) {
            //this.getProfileImage(firebase.auth().currentUser.uid)
            return ( false )
        }
        if (this.state.finishedEdit) {
            var refreshString = this.state.profileImageURL + this.state.firstname + this.state.lastname + this.state.dob + this.state.email + this.state.interests + this.state.bio
            //console.log('here' + refreshString)
            //I think these parameters are unnecessary because that didn't work but I'm leaving it for now because I'm scared.
            return (this.props.navigation.navigate('Profile', {refresh: refreshString}))
        }

        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
        return (
            <Root>
            <Container style={styles.container}>
                <Content style={styles.content}>

            <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                keyboardVerticalOffset = {keyboardVerticalOffset}
                behavior="padding"
                enabled
            >
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={{flex:1, flexDirection:'column',}} >
                    <View style={{flex:1, paddingTop: 50,}}>
                        <TouchableHighlight style={styles.outerCircle} onPress={() =>
                            ActionSheet.show(
                              {
                                options: BUTTONS,
                                cancelButtonIndex: CANCEL_INDEX,
                                title: "Photo Upload Method"
                              },
                              buttonIndex => {
                                //this.props.navigation.navigate(LOCATIONS[buttonIndex], {userID: firebase.auth().currentUser.uid});
                                if (buttonIndex === 0) {
                                    this.handleTakePhoto()
                                } else if (buttonIndex===1) {
                                    this.handleUploadPhoto()
                                }
                              }
                          )}>
                          <Image
                              style={styles.innerCircle}
                              source = {{uri:  this.state.profileImageURL}}
                          />
                        </TouchableHighlight>
                    </View>
                    <View style={{flex:3}}>
                        <Text style={styles.textSecond}>First Name</Text>
                        <TextInput
                            placeholder={this.state.firstname}
                            autoCapitalize="words"
                            style={styles.textInput}
                            onChangeText={firstname => this.setState({ firstname })}
                            value={this.state.firstname}
                        />
                        <Text style={styles.textSecond}>Last Name</Text>
                        <TextInput
                            placeholder={this.state.lastname}
                            autoCapitalize="words"
                            style={styles.textInput}
                            onChangeText={lastname => this.setState({ lastname })}
                            value={this.state.lastname}
                        />

                        <Text style = {styles.textMainTwo}>About</Text>

                        <Text style={styles.textSecond}>Username</Text>
                        <TextInput
                            placeholder={this.state.username}
                            autoCapitalize="none"
                            style={styles.textInput}
                            onChangeText={username => this.setState({ username })}
                            value={this.state.username}
                        />

                        <Text style={styles.textSecond}>Birthday</Text>
                        <TextInput
                            placeholder={this.state.dob}
                            autoCapitalize="none"
                            style={styles.textInput}
                            onChangeText={dob => this.setState({ dob })}
                            value={this.state.dob}
                        />

                        <Text style={styles.textSecond}>Bio</Text>
                        <TextInput multiline
                            multiline = {true}
                            numberOfLines = {4}
                            placeholder={this.state.bio}
                            autoCapitalize="none"
                            style={styles.textInputLong}
                            onChangeText={bio => this.setState({ bio })}
                            value={this.state.bio}
                        />

                        <Text style={styles.textSecond}>Interests</Text>
                        <CheckBox
                            title="Animals"
                            checked={this.state.animals}
                            onPress={() => this.setState({animals: !this.state.animals})}
                            checkedColor= '#f300a2'
                            uncheckedColor= 'rgba(228,228,228,0.66)'
                            containerStyle={styles.checkCont}
                            textStyle={{color: 'rgba(228,228,228,0.66)'}}
                        />
                        <CheckBox
                            title="Nature"
                            checked={this.state.nature}
                            onPress={() => this.setState({nature: !this.state.nature})}
                            checkedColor= '#f300a2'
                            uncheckedColor= 'rgba(228,228,228,0.66)'
                            containerStyle={styles.checkCont}
                            textStyle={{color: 'rgba(228,228,228,0.66)'}}
                        />
                        <CheckBox
                            title="People"
                            checked={this.state.people}
                            onPress={() => this.setState({people: !this.state.people})}
                            checkedColor= '#f300a2'
                            uncheckedColor= 'rgba(228,228,228,0.66)'
                            containerStyle={styles.checkCont}
                            textStyle={{color: 'rgba(228,228,228,0.66)'}}
                        />
                        <CheckBox
                            title="Food"
                            checked={this.state.food}
                            onPress={() => this.setState({food: !this.state.food})}
                            checkedColor= '#f300a2'
                            uncheckedColor= 'rgba(228,228,228,0.66)'
                            containerStyle={styles.checkCont}
                            textStyle={{color: 'rgba(228,228,228,0.66)'}}
                        />
                        <CheckBox
                            title="Technology"
                            checked={this.state.tech}
                            onPress={() => this.setState({tech: !this.state.tech})}
                            checkedColor= '#f300a2'
                            uncheckedColor= 'rgba(228,228,228,0.66)'
                            containerStyle={styles.checkCont}
                            textStyle={{color: 'rgba(228,228,228,0.66)'}}
                        />
                        <CheckBox
                            title="Fitness/Sports"
                            checked={this.state.fitness}
                            onPress={() => this.setState({fitness: !this.state.fitness})}
                            checkedColor= '#f300a2'
                            uncheckedColor= 'rgba(228,228,228,0.66)'
                            containerStyle={styles.checkCont}
                            textStyle={{color: 'rgba(228,228,228,0.66)'}}
                        />
                        <CheckBox
                            title="Motivational Quotes"
                            checked={this.state.motivation}
                            onPress={() => this.setState({motivation: !this.state.motivation})}
                            checkedColor= '#f300a2'
                            uncheckedColor= 'rgba(228,228,228,0.66)'
                            containerStyle={styles.checkCont}
                            textStyle={{color: 'rgba(228,228,228,0.66)'}}
                        />

                        <Text style={styles.textSecond}>Email</Text>
                        <TextInput
                            placeholder={this.state.email}
                            autoCapitalize="none"
                            style={styles.textInput}
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        />
                        <View style = {styles.doneButton}>
                            <Button
                                onPress={this.handleEdits}
                                style={styles.button}
                            >
                                <Text style={{color: 'white', alignSelf: 'center'}}>Done</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
            </View>
            </Content>
            </Container>
            </Root>
        )
    }
}

//note: font not working

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_BACKGRND,
    },
    outerCircle: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        backgroundColor: COLOR_DGREY,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginLeft: 10
    },

    innerCircle: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        backgroundColor: COLOR_DGREY,
        alignItems: 'center',
        justifyContent: 'center'
    },

    textMainOne: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    textMainTwo: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:20,
        fontWeight: 'bold',
        marginLeft: 10
    },
    textSecond: {
        color: COLOR_PURPLEPINK,
        fontSize: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        marginLeft: 10
    },
    textInputLong: {
        height: 100,
        width: 300,
        marginTop: 10,
        borderColor: COLOR_DGREY,
        color: COLOR_LGREY,
        backgroundColor: COLOR_DGREY,
        paddingLeft: 10,
        borderRadius: 12,
        marginLeft: 10
    },
    textInput: {
        height: 40,
        width: 300,
        color: COLOR_LGREY,
        marginTop: 10,
        backgroundColor: COLOR_DGREY,
        paddingLeft: 10,
        borderRadius: 12,
        marginLeft: 10,
    },
    doneButton: {
        alignItems: 'stretch',
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1,
        flexDirection: 'column',
        marginTop: 30,
    },
    container: {
        backgroundColor: COLOR_BACKGRND,
    },
    content: {
        alignItems: 'center',
    },
    checkCont: {
        backgroundColor: 'rgba(122,122,122,0.2)',
        borderColor: 'transparent',
        borderRadius: 12,
        width: 300
    },
    button: {
        backgroundColor: COLOR_PINK,
        marginTop: 5,
        marginBottom: 20,
        width: 80,
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    },
})
