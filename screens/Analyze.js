import React from 'react'
import Environment from "../config/environment";
import { View, Text, StyleSheet, TouchableHighlight, Button, Image } from 'react-native'
import * as firebase from 'firebase';
import 'firebase/firestore';
import getProfileImage from './Profile'
// Credit to: https://medium.com/@mlapeter/using-google-cloud-vision-with-expo-and-react-native-7d18991da1dd


export default class Analyze extends React.Component {



    // initialize state
    constructor(props) {
        super(props);

        this.state = {
          isLoading: true,
          isImgLoading: true,
       }
    }

    // authenticate user
    componentDidMount() {
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            console.log("inside get " + firebase.auth().currentUser.uid)

            getProfileImage(firebase.auth().currentUser)

            //this.forceUpdate();
        }.bind(this)).catch ((error) => {console.error(error);});
    }

      // Credit to for the submitToGoogle function: https://medium.com/@mlapeter/using-google-cloud-vision-with-expo-and-react-native-7d18991da1dd
      submitToGoogle = async () => {
        this.setState({ uploading: true });
        let { image } = this.state.profileImageURL;
        console.log("here")
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
                  imageUri: image
                }
              }
            }
          ]
        });
        let response = await fetch(
          "https://vision.googleapis.com/v1/images:annotate?key=" +
            Environment["GOOGLE_CLOUD_VISION_API_KEY"],
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            method: "POST",
            body: body
          }
        );
        let responseJson = await response.json();
              console.log(responseJson);
              this.setState({
                googleResponse: responseJson,
                uploading: false
              });

              this.state.googleResponse && (
              <FlatList
                data={this.state.googleResponse.responses[0].labelAnnotations}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={({ item }) => <Text>Item: {item.description}</Text>}
              />
            )

      };




        render() {
            return (
            <Button title="View Emma's Profile" color= '#f300a2'

                onPress={() => this.submitToGoogle}
            />
          )

        }
}
