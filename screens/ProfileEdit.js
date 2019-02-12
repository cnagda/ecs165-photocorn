import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Button, TextInput, ScrollView, Image } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY , COLOR_PURPLEPINK} from './../components/commonstyle';
import { uploadPhoto } from '../utils/Photos'
import { ImagePicker } from 'expo';


export default class Loading extends React.Component {
    // authenticate user
    componentDidMount() {
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            console.log("inside get " + firebase.auth().currentUser.uid)

            this.getProfileImage(firebase.auth().currentUser.uid);

            this.setState(
                {
                    currentUser: firebase.auth().currentUser,
                    firstname: doc.data().first,
                    lastname: doc.data().last,
                    dob: doc.data().dob,
                    email: firebase.auth().currentUser.email,
                    bio: doc.data().bio,
                    interests: doc.data().interests,
                    isLoading: false,
                }
            );
        }.bind(this)).catch ((error) => {console.error(error);});
    }

    state = {
        email: '',
        password: '',
        errorMessage: null,
        finishedEdit: false,
        image: null,
        interests: '',
        bio: '',
        dob:'',
        isImgLoading: true,
    }

    handleEdits = () => {
        const { email, password, firstname, lastname, dob, interests, bio } = this.state
            var user = firebase.auth().currentUser;
            user.updateEmail(email).then(
            firebase.firestore().collection("users").doc(user.uid).set({
                first: firstname,
                last: lastname,
                email: email,
                dob: dob,
                uid: user.uid,
                interests: interests,
                bio: bio,
            }).then(function() {
                this.setState({finishedEdit: true});
                console.log("inside set " + user.uid)
            }.bind(this))
            )
    }

    // set a profile picture
    pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            base64: true,
        });

        if (!result.cancelled) {
            await this.setState({image: result.uri,});
            const path = "ProfilePictures/".concat(firebase.auth().currentUser.uid, ".jpg");
            console.log(result.uri);
            console.log(path);
            return uploadPhoto(result.uri, path).then(function() {
                this.setState({isImgLoading: true})
                this.getProfileImage(firebase.auth().currentUser.uid).then(function() {
                    this.setState({isImgLoading: false})
                }.bind(this));
            }.bind(this));
        }
    };

    getProfileImage = async(user) => {
          console.log("in get profile image");
            console.log(user)
            const path = "ProfilePictures/".concat(user, ".jpg");
            console.log(path)
            const image_ref = firebase.storage().ref(path);
            const downloadURL = await image_ref.getDownloadURL()

            if (!downloadURL.cancelled) {
              console.log("testing1")
              console.log(downloadURL)
              this.setState({profileImageURL: downloadURL, isImgLoading:false,});
          }
    };

    render() {
        if(this.state.isLoading || this.state.isImgLoading) {
            return ( false )
        }
        if (this.state.finishedEdit) {
            var refreshString = this.state.profileImageURL + this.state.firstname + this.state.lastname + this.state.dob + this.state.email + this.state.interests + this.state.bio
            console.log('here' + refreshString)
            return (this.props.navigation.navigate('Profile', {refreshed: refreshString}))
        }
        return (
            <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={{flex:1, flexDirection:'column',}} >
                    <View style={{flex:1, paddingTop: 50,}}>
                        <TouchableHighlight style={styles.outerCircle} onPress={this.pickImage}>
                          <Image
                              style={styles.innerCircle}
                              source = {{uri:   this.state.profileImageURL}}
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

                        <Text style={styles.textSecond}>Birthday</Text>
                        <TextInput
                            placeholder={this.state.dob}
                            autoCapitalize="none"
                            style={styles.textInput}
                            onChangeText={dob => this.setState({ dob })}
                            value={this.state.dob}
                        />

                        <Text style={styles.textSecond}>Bio</Text>
                        <TextInput
                            multiline = {true}
                            numberOfLines = {4}
                            placeholder={this.state.bio}
                            autoCapitalize="none"
                            style={styles.textInputLong}
                            onChangeText={bio => this.setState({ bio })}
                            value={this.state.bio}
                        />

                        <Text style={styles.textSecond}>Interests</Text>
                        <TextInput
                            multiline = {true}
                            numberOfLines = {4}
                            placeholder={this.state.interests}
                            autoCapitalize="none"
                            style={styles.textInputLong}
                            onChangeText={interests => this.setState({ interests })}
                            value={this.state.interests}
                        />

                        <Text style={styles.textSecond}>Email</Text>
                        <TextInput
                            placeholder={this.state.email}
                            autoCapitalize="none"
                            style={styles.textInput}
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        />
                        <View style = {styles.doneButton} >
                            <Button
                                title="Done"
                                onPress={this.handleEdits}
                                color= '#f300a2'
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            </View>
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
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textMainTwo: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: 80,
    },
    textSecond: {
        color: COLOR_PURPLEPINK,
        fontSize: 15,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    textInput: {
        height: 40,
        width: 300,
        borderColor: COLOR_DGREY,
        borderWidth: 1,
        color: COLOR_LGREY,
    },
    textInputLong: {
        height: 160,
        width: 300,
        borderColor: COLOR_DGREY,
        borderWidth: 1,
        color: COLOR_LGREY,
    },
    doneButton: {
        alignItems: 'stretch',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'column',
        marginTop: 30,
    },
})
