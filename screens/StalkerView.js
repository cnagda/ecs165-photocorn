import React from 'react'
// import { StyleSheet, Platform, Image, Text, View, Button, ScrollView, RefreshControl, } from 'react-native'
import { StyleSheet, ScrollView, RefreshControl, Dimensions, View, FlatList } from 'react-native'
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import PostView from '../utils/Post'
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, ActionSheet, Root } from 'native-base';
import { getTheme } from '../native-base-theme/components';
import { custom } from '../native-base-theme/variables/custom';
import { withNavigation } from 'react-navigation';
import {ListItem}  from 'react-native-elements'



export default class StalkerView extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {postdata: []}
        //this.itemLayout = this.itemLayout.bind(this)
        console.log("hi")
    }

    // authenticate user
    componentDidMount() {
        console.log("hi")
        var postdata = this.props.navigation.getParam('postdata', [])
        var index = this.props.navigation.getParam('index', 1)
        this.setState({postdata: postdata, index: index})
    }



    componentWillReceiveProps(newprops) {
        this.setState({postdata: this.props.navigation.state.postdata, index: this.props.navigation.state.index})


    }

    renderItem({ item, index }) {


            return <View style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    backgroundColor: COLOR_BACKGRND,
                }}>
                  <PostView postID={item.key} />
                </View>

            //return <Text style={styles.posterName}>HIIIIIII {index}</Text>


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
            <View style = {styles.container}>
                <FlatList horizontal pagingEnabled data={this.state.postdata} renderItem={this.renderItem} initialNumToRender={2} getItemLayout = {this.itemLayout} initialScrollIndex = {this.state.index}/>

            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        backgroundColor: COLOR_BACKGRND,
        alignItems: 'center',
        justifyContent: 'center',
        flex:1
    },
    posterName: {
        color: COLOR_PINK,
        fontSize: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
