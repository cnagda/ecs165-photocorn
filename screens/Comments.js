import React from 'react'
import { StyleSheet, ScrollView, RefreshControl, View, Platform , StatusBar, TextInput, Dimensions, KeyboardAvoidingView } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK, COLOR_MGREY } from './../components/commonstyle';
import { Container, Header, Title, Content, Left, Right, Body, Icon, Text, Row, Grid, Col } from 'native-base';
import { withNavigation } from 'react-navigation';
import { ListItem, Button }  from 'react-native-elements'

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// pretty prints a string given a date object
Date.prototype.tcstring = function() {
    var month = monthNames[this.getMonth()];
    var day = this.getDate();
    var hh = this.getHours();
    var mm = this.getMinutes();
    var tt = "AM";

    // format minutes
    if (mm < 10) {
        mm = "0" + mm;
    }

    // format hours
    if(hh > 12) {
        hh = hh - 12;
        tt = "PM"
    }

    return [month, ' ', day, " at ", hh, ":", mm, " ", tt].join('');
};

class Comments extends React.Component {
    // initialize state
    constructor(props) {
        super(props);

        this.state = {
            comment: '',
            postID: this.props.navigation.getParam('postID'),
            comments: [],
        }
        this.handleComment = this.handleComment.bind(this)
    }


    componentDidMount() {
        console.log("inside component did mount")
        var comments = [];
        var db = firebase.firestore();
        var ref = db.collection("Comments");
        var query = ref.where("postID", "==", this.state.postID);

        query.get().then(function(results) {
            results.forEach(function(doc) {
                var data = doc.data();
                var text = <Text>
                               <Text style={{fontWeight: 'bold', color: COLOR_PINK}}>{data.user.username + " "}</Text>
                               <Text style={{color: COLOR_LGREY}}>{data.text}</Text>
                           </Text>;
                comments.push(
                    <ListItem
                        key={query.id}
                        title={text}
                        subtitle={data.timestamp.toDate().tcstring()}
                        subtitleStyle={styles.subtitle}
                        leftAvatar={{source: {uri: data.user.avatar}}}
                        containerStyle={styles.comment}
                    />
                )
                console.log("timestamp " + timestamp)
            });
            this.setState({
                comments: comments,
            });
        }.bind(this))
    }


    // store comment in firebase
    handleComment = () => {
        // get reference to comments collection
        var db = firebase.firestore();
        var ref = db.collection("Comments").doc();

        // get state variables
        var uid = firebase.auth().currentUser.uid;
        var postid = this.state.postID;
        var comment = this.state.comment;

        // get user information
        var user_data;
        var user_ref = db.collection("users").doc(uid);
        user_ref.get().then(function(user_doc) {
            user_data = user_doc.data();
            const path = "ProfilePictures/".concat(uid, ".jpg");
            firebase.storage().ref(path).getDownloadURL().then(function(url) {
                // create comment document
                var com_doc = {
                    commentID: ref.id,
                    postID: postid,
                    text: comment,
                    timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                    user: {
                        userID: uid,
                        username: user_data.username,
                        avatar: url
                    }
                };

                ref.set(com_doc).then(function() {
                    var photo = com_doc.user.avatar
                    var text = <Text>
                                   <Text style={{fontWeight: 'bold', color: COLOR_PINK}}>{com_doc.user.username + " "}</Text>
                                   <Text style={{color: COLOR_LGREY}}>{com_doc.text}</Text>
                               </Text>;
                    this.setState((prevState, props) => {
                        var text = <View style={styles.commentView}>
                                       <Text style={{fontWeight: 'bold', color: COLOR_PINK}}>{com_doc.user.username + " "}</Text>
                                       <Text style={{color: COLOR_PINK}}>{prevState.comment}</Text>
                                   </View>;
                        return {
                            comments: prevState.comments.concat(
                                <ListItem
                                    key={ref.id}
                                    title={text}
                                    subtitle={com_doc.timestamp.toDate().tcstring()}
                                    subtitleStyle={styles.subtitle}
                                    leftAvatar={{source: {uri: photo}}}
                                    containerStyle={styles.comment}
                                />),
                            comment: "",
                        };
                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));

        firebase.firestore().collection("Updates").where("postid", "==", this.state.postID).where("type", "==", "COMMENT").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log("found one")
                newnumComments = doc.data().numComments + 1
                doc.ref.update({
                    numComments: newnumComments,
                    actUser: firebase.auth().currentUser.uid,
                    timestamp:  firebase.firestore.Timestamp.fromDate(new Date()),
                }).then(function() {
                    console.log("success")
                }).catch(function(error) {
                    console.log("Error updating document: " + error);
                });
            })
        }).then(function() {
            var regex = new RegExp(/(\@(\w|\b)+)/, 'g')
            var comment = this.state.comment
            var mentions = this.state.comment.match(regex)
            if (mentions) {
                this.state.comment.match(regex).forEach(function(mention) {
                    console.log("found a mention: " + mention.substr(1))
                    firebase.firestore().collection("users").where("username", "==", mention.substr(1)).get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            console.log("found a user match for the mention")
                            firebase.firestore().collection("Updates").add({
                                type: "MENTION",
                                postid: this.state.postID,
                                currUser: doc.data().uid,
                                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                                actUser: firebase.auth().currentUser.uid,
                                mentionType: "comment",
                                text: comment,
                            }).then(function(docRef) {
                                console.log("Document written with ID: ", docRef.id);
                            })
                            .catch(function(error) {
                                console.error("Error adding document: ", error);
                            });
                        }.bind(this))
                    }.bind(this))
                }.bind(this))
            }
        }.bind(this))


    }

    render() {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left style={{color:'white'}}>
                        <Button
                            onPress={() => this.props.navigation.goBack()}
                            title="Back"
                            type="clear"
                            titleStyle={{color: 'white'}}
                        />
                    </Left>
                    <Body>
                        <Title style={{color: 'white'}}>Comments</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Content>
                    {this.state.comments}

                    <Grid>
                        <Row style={{paddingLeft: 10, paddingRight: 10}}>
                            <TextInput multiline
                                placeholderTextColor='rgba(228,228,228,0.66)'
                                placeholder="Add a comment..."
                                style={styles.textInput}
                                onChangeText={comment => this.setState({ comment })}
                                value={this.state.comment}
                                autoCapitalize="none"
                            />
                            <Button
                                onPress={this.handleComment}
                                type="clear"
                                icon={
                                    <Icon
                                        type="MaterialCommunityIcons"
                                        name="send"
                                        style={{color: COLOR_PINK}}
                                    />
                                }
                                containerStyle={{alignSelf: 'flex-end', paddingBottom: 11}}
                            />
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}

export default withNavigation(Comments);

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR_BACKGRND,
    },
    header: {
        backgroundColor: COLOR_DGREY,
        borderBottomWidth: 0,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 20,
        height: Platform.OS === "android" ? 80: undefined
    },
    textInput: {
        maxHeight: 200,
        minHeight: 33,
        color: COLOR_LGREY,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: COLOR_DGREY,
        paddingLeft: 10,
        borderRadius: 12,
        width: Dimensions.get('window').width * 0.8,
        fontSize: 16
    },
    comment: {
        backgroundColor: COLOR_DGREY,
        borderRadius: 12,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    subtitle: {
        color: COLOR_LGREY,
        marginTop: 5,
        fontSize: 10,
    },
    postButton: {
        marginTop: 10,
    }
})
