import React from 'react'
// import { StyleSheet, Platform, Image, Text, View, Button, ScrollView, RefreshControl, } from 'react-native'
import { StyleSheet, ScrollView, RefreshControl, Dimensions, View, FlatList, StatusBar } from 'react-native'
import { ImagePicker } from 'expo';
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import PostView from '../utils/Post'
import { Container, Header, Title, Content, Footer, FooterTab, Left, Right, Body, Icon, Text, ActionSheet, Root } from 'native-base';
import { getTheme } from '../native-base-theme/components';
import { custom } from '../native-base-theme/variables/custom';
import { withNavigation } from 'react-navigation';
import {ListItem, Button}  from 'react-native-elements'



export default class StalkerView extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {postdata: [], userViewing:""}
        //this.itemLayout = this.itemLayout.bind(this)
        console.log("hi")
    }

    // authenticate user
    componentDidMount() {
        console.log("hi")
        var postdata = this.props.navigation.getParam('postdata', [])
        var index = this.props.navigation.getParam('index', 1)
        var userViewing = this.props.navigation.getParam('userViewing', '')
        firebase.firestore().collection("users").doc(userViewing).get().then(function(userdoc) {
            if (userdoc.exists) {
                this.setState({userViewing: userdoc.data().username})
            }
        }.bind(this))
        this.setState({postdata: postdata, index: index})
    }



    componentWillReceiveProps(newprops) {


    }

    renderItem({ item, index }) {
        console.log(item.key)

        return (
            <View style={{
                width: Dimensions.get('window').width,
                backgroundColor: COLOR_BACKGRND,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10: 30,
            }}>
                <PostView postID={item.key} />
            </View>
        )
    }

    itemLayout = (data, index) => ({
        index,
        length: Dimensions.get('window').width,
        offset: Dimensions.get('window').width * index,
    });

    render() {
        //console.log(this.props.postdata)
        console.log(this.state.postdata)

        return (
        <Root>
        <Container style={styles.container}>
        <Content contentContainerStylestyle={styles.content}>

        <FlatList horizontal
        pagingEnabled data={this.state.postdata}
        renderItem={this.renderItem}
        initialNumToRender={2}
        getItemLayout={this.itemLayout}
        initialScrollIndex={this.state.index}
        />

        </Content>

        </Container>
        </Root>
        );
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
