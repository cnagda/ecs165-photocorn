import React from 'react'
import { StyleSheet, ScrollView, RefreshControl, View, Platform , StatusBar, TextInput, Dimensions } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, Row, Grid, Col } from 'native-base';
import { withNavigation } from 'react-navigation';
import { ListItem }  from 'react-native-elements'


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
        var query = ref.where("postID", "==", this.state.postID)

        query.get().then(function(results) {
            results.forEach(function(doc) {
                console.log(doc.data());
                comments.push(
                    <ListItem
                        key={doc.data().text}
                        title={doc.data().text}
                        containerStyle={styles.comment}
                        titleStyle={styles.commentText}
                    />
                )
            });
            this.setState({
                comments: comments,
            });
        }.bind(this))
    }

    // store comment in firebase
    handleComment = () => {
        var db = firebase.firestore();
        var ref = db.collection("Comments").doc()
        var commentDoc = {
            commentID: ref.id,
            postID: this.state.postID,
            userID: firebase.auth().currentUser.uid,
            text: this.state.comment,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date())
        };




        ref.set(commentDoc).then(function() {
            console.log("stored new comment in db");
            this.setState((prevState, props) => {
                return {
                    comments: prevState.comments.concat(<ListItem
                                                      key={prevState.comment}
                                                      title={prevState.comment}
                                                      containerStyle={styles.comment}
                                                      titleStyle={styles.commentText}
                                                    />),
                    comment: "",
                };
            })


            // todo: rerender comments view and jump to top
            // also sort comments by time or something instead of the random uid....or be bad and put the timestamp in the name so it auto sorts

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

        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Text>Back</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Comments</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Content>
                    {this.state.comments}

                    <Grid>
                        <Row style={{paddingLeft: 10, paddingRight: 10}}>
                            <TextInput
                                placeholderTextColor='rgba(228,228,228,0.66)'
                                placeholder="Add a comment..."
                                style={styles.textInput}
                                onChangeText={comment => this.setState({ comment })}
                                value={this.state.comment}
                                autoCapitalize="none"
                            />
                            <Button transparent
                                onPress={this.handleComment}>
                                <Text>Post</Text>
                            </Button>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}

export default withNavigation(Comments)

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR_BACKGRND,
    },
    textInput: {
        height: 40,
        width: Dimensions.get('window').width * 0.7,
        color: COLOR_PINK,
        marginTop: 20,
        backgroundColor: COLOR_DGREY,
        paddingLeft: 10,
        borderRadius: 12
    },
    comment: {
        backgroundColor: COLOR_DGREY,
        borderRadius: 12,
        marginTop: 10,
    },
    commentText: {
        color: COLOR_PINK
    }
})
