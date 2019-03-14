import React from 'react'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import {
  AppRegistry,
  StyleSheet,
  View,
  Dimensions,
  Image,
  Button,
  StatusBar,
} from 'react-native'

import { Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Icon, Text, ActionSheet, Root } from 'native-base';

import PostView from '../utils/Post'


export default class ViewPost extends React.Component {


    render() {
        return (
            <Container style={styles.container}>
            <Content contentContainerStylestyle={styles.content}>
            <View style={{
                width: Dimensions.get('window').width,
                backgroundColor: COLOR_BACKGRND,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10: 30,
            }}>
                    <PostView postID={this.props.navigation.getParam("postID", "")} />
            </View>


            </Content>
            </Container>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR_BACKGRND,
    },
    content: {
        alignItems: 'center',
    },

})
