import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Button, TextInput, ScrollView, Image, Platform, KeyboardAvoidingView } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY , COLOR_PURPLEPINK} from './../components/commonstyle';
import { uploadPhoto } from '../utils/Photos'
import { ImagePicker } from 'expo';


export default class ChooseUploadMethod extends React.Component {
    // authenticate user
    componentDidMount() {

    }

    state = {
        image: null,
    }

    handleUploadPhoto = async() => {
        //console.log ("trying to handle upload photo")
        var status = await this.getCameraRollPermissions();
        if (status === 'granted') {
            var resultloc = await this.pickImage();
            //console.log("resulturi: " + resultloc)
            //console.log("return screen: " + this.props.navigation.getParam('returnScreen', "NULLVALUE"))
            if (this.props.navigation.getParam('returnScreen', "NULLVALUE") == "ProfileEdit" ) {
                //console.log(resultloc)
                this.props.navigation.navigate('ProfileEdit', {resulturi: resultloc})
            }
        }
    }

    handleTakePhoto = async() => {
        //console.log ("trying to handle take photo")
        var status = await this.getCameraAndCameraRollPermissions();
        if (status === 'granted') {
            var resultloc = await this.takePhoto();
            if (this.props.navigation.getParam('returnScreen', "NULLVALUE") == "ProfileEdit" ) {
                //console.log(resultloc)
                this.props.navigation.navigate('ProfileEdit', {resulturi: resultloc})
            }
        }
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



    render() {


        return (
            <View style={styles.container}>

                <View style = {styles.doneButton} >
                    <Button
                        title="Upload a Photo"
                        onPress={this.handleUploadPhoto}
                        color= '#f300a2'
                    />
                </View>

                <View style = {styles.doneButton} >
                    <Button
                        title="Take a Photo"
                        onPress={this.handleTakePhoto}
                        color= '#f300a2'
                    />
                </View>

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
