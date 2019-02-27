import React from 'react'
// import { StyleSheet, Platform, Image, Text, View, Button, ScrollView, RefreshControl, } from 'react-native'
import { StyleSheet, ScrollView, RefreshControl, View } from 'react-native'
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import PostView from '../utils/Post'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, ActionSheet, Root } from 'native-base';
import { getTheme } from '../native-base-theme/components';
import { custom } from '../native-base-theme/variables/custom';
import { withNavigation } from 'react-navigation';
import {ListItem}  from 'react-native-elements'

var BUTTONS = ["Take a Photo", "Upload a Photo", "Cancel"];
var LOCATIONS = ["NewPostCamera", "NewPostUpload", "HomeScreen"]
var CANCEL_INDEX = 2;

const list = [

]

//to use list:
/* inside render:
<View>

  {
    list.map((l) => (
      <ListItem
        key={l.name}
        title={l.name}
      />
    ))
  }
</View>
*/




export default class SearchPostView extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {postList: null, isLoading: true}
        console.log("inside constructor")
        this.getPosts()

    }

    // authenticate user
    componentDidMount() {
        console.log("inside component did mount")
        this.getPosts()


    }



    componentWillReceiveProps(newprops) {
        this.getPosts()
        console.log("inside of componenet will receive props")

    }



    getPosts() {
        var postarray = this.props.navigation.getParam('postarray', [])
        var postList = []
        postarray.forEach(function(thisPostID) {
            postList.push(<PostView postID={thisPostID}/>)
        })
        this.setState({postList: postList})
    }




    render() {

        return (
            <Root>
            <Container style={styles.container}>
                <Content contentContainerStylestyle={styles.content}>
                    <View style={{flex:1, marginTop: 50, justifyContent: 'center'}}>
                    <View>
                    {this.state.postList}
                    </View>
                    <Button style={{backgroundColor: '#f300a2', width: 170, justifyContent: 'center'}} onPress={() =>this.props.navigation.navigate('HomeScreen')}>
                        <Text style={{color: 'white'}}>Done</Text>
                    </Button>
                    </View>
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
    footer: {
        backgroundColor: COLOR_DGREY,
        borderTopWidth: 0
    },
    footertab: {
        backgroundColor: COLOR_DGREY,
    },
    welcome: {
        color: COLOR_LGREY,
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        paddingBottom: 20
    },
    icon: {
        color: COLOR_PINK
    },
    inactiveicon: {
        color: COLOR_LGREY
    }
})
