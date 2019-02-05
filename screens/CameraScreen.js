// Source: // https://www.codementor.io/blessingoraz/access-camera-roll-with-react-native-9uwupuuy0
// https://medium.com/@davidjsehl/react-native-and-the-infamous-blob-uploading-images-to-firebase-b1a440f9e078
// https://facebook.github.io/react-native/docs/permissionsandroid.html#request
// https://github.com/expo/expo/issues/784
// join slack
import React, { Component } from 'react';
import {
  CameraRoll,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
  Button,
  PermissionsAndroid
} from 'react-native';


export default class CameraScreen extends React.Component {

  async requestPhotoAccess() {

    const granted = await PermissionsAndroid.request(
     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
     {
       title: 'ECS 165 Instagram App External Storage Permission',
       message:
         'Cool Photo App needs access to your photos ' +
         'so you puload photos.',
       buttonNeutral: 'Ask Me Later',
       buttonNegative: 'Cancel',
       buttonPositive: 'OK',
     },
   );
  }



  getPhotosFromGallery() {
  //  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //  ["Access photos to upload."]);

    this.requestPhotoAccess();

    CameraRoll.getPhotos({ first: 1000000 })
      .then(res => {
        let photoArray = res.edges;
        this.setState({ showPhotoGallery: true, photoArray: photoArray })
      })
  }

  render() {
   return (
     <View style={styles.container}>
      <Button
        title="Upload Photo"
        //onPress={() => this.props.navigation.navigate('Signup')}
        onPress={() => this.getPhotosFromGallery()}
      />
     </View>
   );
 }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
