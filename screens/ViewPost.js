import React from 'react'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Button,
} from 'react-native'

import PostView from '../utils/Post'


export default class ViewPost extends React.Component {


    render() {
        return (
            <View style={styles.container}>
                    <PostView postID={this.props.navigation.getParam("postID", "")} />

                    <Button
                        title="Back" color= '#f300a2'
                        onPress={() => this.props.navigation.pop(2)}
                    />
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        width:  Dimensions.get('window').width,
        height:  Dimensions.get('window').height,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_BACKGRND,
        marginTop: 50,
    },

})
