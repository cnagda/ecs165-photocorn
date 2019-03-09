
// THIS DIDN'T WORK SO I'M JUST LEAVING IT HERE TO ROT BECAUSE MAYBE I'LL FIX IT







import React from 'react'
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_PURPLE, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { AppRegistry, StyleSheet, Text, View, Dimensions, Image, ScrollView, FlatList, TouchableHighlight  } from 'react-native'
import { Button, Container, Content } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { withNavigation } from 'react-navigation';
import {LinearGradient} from 'expo'



class PhotoGrid extends React.Component {



    constructor(props) {
        super(props);
        // this.toProfile = this.toProfile.bind(this);
        this.state = {
            isLoading: true,
            ready: false,
        }
        this.getPhotoIDList = this.getPhotoIDList.bind(this)
        this.renderItem = this.renderItem.bind(this)

    }

    componentWillMount() {
        console.log("called get photo id list")
        //console.log("urlList: " + this.props.urls)
        this.getPhotoIDList().then(function() {
            this.setState({ready: true})
        })
    }

    componentWillReceiveProps() {
        "made it into component will receive props in photo grid"
    }

    getPhotoIDList = async() => {
        var photoIDList = []

        this.props.photos.forEach(function(photo) {
            photoIDList.push({key: photo})

        })
        console.log(photoIDList)
        await this.setState({photoIDList: photoIDList, })
    }

    renderItem({ item, index }) {

        console.log(index)
        if (urlList.length > index) {
            var uri = urlList[index]

            return <View style={{
                    flex: 1,
                    width: Dimensions.get('window').width/3,
                    height: Dimensions.get('window').width/3,
                    backgroundColor: COLOR_BACKGRND,
                }}>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('StalkerView', {postdata: this.state.photoIDList, index: index})}>
                  <Image style={{width: Dimensions.get('window').width/3, height: Dimensions.get('window').width/3}} source = {{uri: uri}} defaultSource={"http://i68.tinypic.com/awt7ko.jpg"} />
                  </TouchableHighlight>
                </View>
        }
  }
    render() {

        return (
            <View style={styles.container}>
                <FlatList contentContainerStyle={styles.list} data={this.state.photoIDList} renderItem={this.renderItem} initialNumToRender={8}/>
            </View>
        );
    }
}

export default withNavigation(PhotoGrid);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'column',
        //fontSize: 20,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: COLOR_BACKGRND,
        //height: 100,
        //marginBottom: 10,
    },
    backBox: {
        // height: Dimensions.get('window').width + 75,
        width: Dimensions.get('window').width,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textMainTwo: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profile: {
        height: 54,
        width: 54,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 54/2,
        marginTop: 0,
    },
    posterName: {
        color: COLOR_PINK,
        fontSize: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallInfoLeft: {
        color: 'white',
        fontSize: 15,
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    caption: {
        color: COLOR_LGREY,
        fontSize: 15,
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    tags: {
        color: COLOR_PURPLE,
        fontSize: 15,
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    smallInfoRight: {
        color: 'white',
        fontSize: 15,
        marginRight: 20,
        alignItems: 'flex-end'
    },
    list: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
})
