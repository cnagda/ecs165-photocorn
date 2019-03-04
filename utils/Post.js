import React from 'react'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_PURPLE, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { AppRegistry, StyleSheet, View, Dimensions, Image } from 'react-native'
import { Button, Grid, Col, Row, Container, Text, Content, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo'


const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// pretty prints a string given a date object
Date.prototype.tstring = function() {
  var month = monthNames[this.getMonth()];
  var day = this.getDate();
  var hh = this.getHours();
  var mm = this.getMinutes();

  return ["Posted on ", month, ' ', day, " at ", hh, ":", mm].join('');
};


// pretty print a string of space separated tags
function getTagString(str) {
    var res = ' '

    // remove extra white space and hashtag symbols
    try {
        var tags = str.split(' ');
        str = str.trim()
        var regexp = new RegExp('#([^\\s]*)','g');
        str = str.replace(regexp, 'REPLACED');

        var i;
        for(i = 0; i < tags.length - 1; i++) {
            res += '#';
            res += tags[i]
            res += ' '
        }
    }
    catch(err) { }
    return(res);
}


class PostView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isImgLoading: true,
        }
    }

    componentDidMount() {
        // authenticate user
        postID = this.props.postID;
        post_ref = firebase.firestore().collection("Posts");
        post_ref.doc(this.props.postID).get().then(function(doc) {
            photo_ref = firebase.firestore().collection("Photo");
            photo_ref.doc(this.props.postID).get().then(function(doc2) {
                console.log(doc2.data());
                users_ref = firebase.firestore().collection("users");
                users_ref.doc(doc.data().userID).get().then(function(doc1) {
                    timestamp = doc.data().timestamp.toDate();
                    // time_string = "Posted on " + timestamp.getMonth() " at " timestamp.getMinute();
                    this.setState({
                        name: doc1.data().first + " " + doc1.data().last,
                        postUser: doc.data().userID,
                        caption: doc.data().caption,
                        numComments: doc.data().numComments,
                        tags: doc.data().tags,
                        imageUri: doc2.data().imageUri,
                        timestamp: timestamp.tstring(),
                    });
                    console.log("caption " + doc.data().caption)
                    console.log("postid " + this.props.postID)
                    console.log("imageuri " + doc2.data().imageUri)
                    console.log("timestamp " + timestamp.tstring())
                }.bind(this))
            }.bind(this))
            this.getProfileImage(doc.data().userID);
        }.bind(this)).catch ((error) => {console.error(error);});
    }

    componentWillMount() {}

    // given a user id fetch profile picture from storage
    getProfileImage = async(user) => {
            const path = "ProfilePictures/".concat(user, ".jpg");
            const image_ref = firebase.storage().ref(path);
            const downloadURL = await image_ref.getDownloadURL()

            if (!downloadURL.cancelled) {
                this.setState({profileImageURL: downloadURL,isImgLoading:false,});
            }
    };

    render() {
        if (Boolean(this.state.isImgLoading) ) {
            return ( false )
        }

        return (
            <Container style={styles.container}>
                <Content scrollEnabled={false}>
                    <Grid>
                        {/*post header*/}
                        <Row style={styles.postHeader}>
                            <Col size={15} style={{paddingLeft: 10}}>
                                <Image style={styles.profile} source={{uri: this.state.profileImageURL}}/>
                            </Col>
                            <Col size={75} style={{paddingLeft: 10}}>
                                <Button transparent
                                    onPress={() => this.props.navigation.navigate('Profile', {userID: this.state.postUser})}
                                    style={{marginTop: -5}}>
                                    <Text style = {styles.posterName}>{this.state.name}</Text>
                                </Button>
                                <Text style={styles.timestamp}>{this.state.timestamp}</Text>
                            </Col>
                        </Row>

                        {/*post image*/}
                        <LinearGradient
                            colors={['rgba(122,122,122,0.2)', '#2a2a2a']}
                            style={styles.backBox}>
                        <Row>
                            <Image
                                style={styles.image}
                                source={{uri: this.state.imageUri}}
                            />
                        </Row>
                        </LinearGradient>

                        {/*post footer*/}
                        <Col style={styles.postFooter}>
                            {/*task bar*/}
                            <Row style={{paddingLeft: 10}}>
                                <Button icon transparent
                                    style={{marginLeft: -15}}>
                                    <Icon
                                        type="Feather"
                                        name="heart"
                                        style={{color: COLOR_LGREY}}/>
                                </Button>
                                <Button icon transparent>
                                    <Icon
                                        type="Feather"
                                        name="message-square"
                                        style={{color: COLOR_LGREY}}
                                        onPress={() => this.props.navigation.navigate('Comments', {postID: this.props.postID})}/>
                                </Button>
                                <Button icon transparent>
                                    <Icon
                                        type="Feather"
                                        name="info"
                                        style={{color: COLOR_LGREY}}/>
                                </Button>
                            </Row>
                            {/*likes*/}
                            <Row style={{paddingLeft: 10, paddingBottom: 3}}>
                                <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}}>Liked by </Text>
                                <Text style={{color: COLOR_PINK, fontWeight: 'bold'}}>chandninagda </Text>
                                <Text style={{color: COLOR_LGREY, fontWeight: 'bold'}}>and </Text>
                                <Text style={{color: COLOR_PINK, fontWeight: 'bold'}}>238 others </Text>
                            </Row>
                            {/*caption*/}
                            <Text style={{paddingLeft: 10, paddingTop: 5}}>
                                <Text style={styles.caption}>{this.state.caption}</Text>
                                <Text style={styles.tags}>{getTagString(this.state.tags)}</Text>
                            </Text>
                        </Col>
                    </Grid>
                </Content>
            </Container>

            /*
            <View style={styles.container}>
            <LinearGradient
              colors={['rgba(122,122,122,0.2)', '#2a2a2a']}
              style={styles.backBox}>
                    <View style = {{height: 68, flexDirection: 'row', marginLeft: 10}}>
                        <View style={{flex: 2, flexDirection: 'row'}}>
                            <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Image style={styles.profile} source={{uri: this.state.profileImageURL}}/>
                            </View>
                        </View>
                        <View style = {{flex: 6, flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-start'}}>
                                <Button transparent
                                    onPress={() => this.props.navigation.navigate('Profile', {userID: firebase.auth().currentUser.uid})}>
                                    <Text style = {styles.posterName}>{this.state.name}</Text>
                                </Button>
                                <Text style={{color: COLOR_LGREY, marginTop: -10}}>{this.state.timestamp}</Text>
                            </View>
                        </View>
                    </View>

                    <View style = {{flexDirection: 'row'}}>
                        <Image
                            style={styles.image}
                            source = {{uri: this.state.imageUri}}
                        />
                    </View>

                    <View style = {{flexDirection: 'row', paddingTop: 10}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text style = {styles.smallInfoLeft}>Liked by </Text>
                                </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center'}}>
                                <Text style = {styles.smallInfoRight}>{this.state.numComments} Comments</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View style={{height: 80, width: Dimensions.get('window').width, flexDirection: 'column', flex: 1, paddingTop: 10}}>
                    <Text style = {styles.tags}>{this.state.tags}</Text>
                    <Text style = {styles.caption}>{this.state.caption}</Text>
                </View>
            </View>*/
        )
    }
}

export default withNavigation(PostView);

const styles = StyleSheet.create({
    container: {
        fontSize: 20,
        backgroundColor: COLOR_BACKGRND,
        marginBottom: 20
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
    },
    profile: {
        height: 54,
        width: 54,
        borderRadius: 54 / 2,
    },
    posterName: {
        color: COLOR_PINK,
        fontSize: 18,
    },
    caption: {
        color: COLOR_LGREY,
        fontSize: 15,
    },
    tags: {
        color: COLOR_PURPLEPINK,
        fontSize: 15,
        fontWeight: 'bold'
    },
    timestamp: {
        color: COLOR_LGREY,
        marginLeft: 16,
        marginTop: -10
    },
    postHeader: {
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: COLOR_DGREY
    },
    postFooter: {
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: COLOR_DGREY
    }
})
