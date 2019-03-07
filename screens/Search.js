import React from 'react'
// import { StyleSheet, Platform, Image, Text, View, Button, ScrollView, RefreshControl, } from 'react-native'
import { StyleSheet, Platform, ScrollView, RefreshControl, TextInput, View, KeyboardAvoidingView, StatusBar } from 'react-native'
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import PostView from '../utils/Post'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, TabHeading,
         Icon, Text, ActionSheet, Root, Tabs, Tab, ScrollableTab, Heading } from 'native-base';
import { getTheme } from '../native-base-theme/components';
import { custom } from '../native-base-theme/variables/custom';
import { withNavigation } from 'react-navigation';
import {ListItem}  from 'react-native-elements'
import SearchNames from './SearchNames'
import SearchTags from './SearchTags'

var BUTTONS = ["Take a Photo", "Upload a Photo", "Cancel"];
var LOCATIONS = ["NewPost", "NewPost", "HomeScreen"]
var METHOD = ["camera", "upload", "none"]
var CANCEL_INDEX = 2;


var searchResults = []

//remove duplicates from https://reactgo.com/removeduplicateobjects/


export default class Search extends React.Component {
    render() {

        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
        return (
            <Root>
            <Container style={styles.container}>
                <Header style={{backgroundColor: COLOR_DGREY, height: 20, borderBottomWidth: 0, toolbarDefaultBorder: 0, borderBottomColor: 'transparent', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : undefined}} hasTabs/>

                <Tabs renderTabBar={()=> <ScrollableTab underlineStyle={{backgroundColor: COLOR_LGREY}} style={{backgroundColor: COLOR_DGREY, borderBottomWidth: 0,}}/>}>
                    <Tab heading={ <TabHeading  style={{backgroundColor: 'transparent'}}><Text style={{color: COLOR_PINK}}>People</Text></TabHeading>} >
                        <SearchNames />
                    </Tab>
                    <Tab heading={ <TabHeading style={{backgroundColor: 'transparent'}}><Text style={{color: COLOR_PINK}}>Tags</Text></TabHeading>}>
                        <SearchTags />
                    </Tab>
                </Tabs>



                <Footer style={styles.footer}>
                    <FooterTab style={styles.footertab}>

                        <Button
                            onPress={() => this.props.navigation.navigate('HomeScreen', {userID: firebase.auth().currentUser.uid})}>
                            <Icon style={styles.inactiveicon} name="home" />
                        </Button>

                        <Button active style={{backgroundColor: 'transparent'}}>
                            <Icon style ={styles.icon} name="search" />
                        </Button>

                        <Button
                            onPress= {() =>
                                ActionSheet.show(
                                  {
                                    options: BUTTONS,
                                    cancelButtonIndex: CANCEL_INDEX,
                                    title: "How do you want to upload?"
                                  },
                                  buttonIndex => {
                                    this.props.navigation.navigate(LOCATIONS[buttonIndex], {method: METHOD[buttonIndex]});
                                  }
                              )}>
                            <Icon style={styles.inactiveicon} name="add" />
                        </Button>



                        <Button
                            onPress={() => this.props.navigation.navigate('Updates', {userID: firebase.auth().currentUser.uid})}>
                            <Icon
                                type="MaterialIcons"
                                name="notifications"
                                style={{color: COLOR_LGREY}}/>
                        </Button>


                        <Button
                            onPress={() => this.props.navigation.navigate('Profile', {userID: firebase.auth().currentUser.uid})}>
                            <Icon style ={styles.inactiveicon} name="person" />
                        </Button>

                    </FooterTab>
                </Footer>

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
    },
    search: {
        height: 40,
        width: 300,
        color: COLOR_PINK,
        marginTop: 20,
        backgroundColor: COLOR_DGREY,
        paddingLeft: 10,
        borderRadius: 12,
    },
    result: {
        backgroundColor: COLOR_DGREY,
        borderRadius: 12,
        marginTop: 10,
    },
    resultText: {
        color: COLOR_PINK
    },
    tabs: {
        backgroundColor: COLOR_DGREY
    }
})
