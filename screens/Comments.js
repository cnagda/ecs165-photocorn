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
        var query = ref.where("postID", "==", this.state.postID);

        query.get().then(function(results) {
            results.forEach(function(doc) {
                var data = doc.data();
                var text = <View style={styles.commentView}>
                               <Text style={{fontWeight: 'bold', color: COLOR_PINK}}>{data.user.username + " "}</Text>
                               <Text style={{color: COLOR_PINK}}>{data.text}</Text>
                           </View>;
                comments.push(
                    <ListItem
                        key={query.id}
                        title={text}
                        leftAvatar={{source: {uri: data.user.avatar}}}
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
                                    leftAvatar={{source: {uri: photo}}}
                                    containerStyle={styles.comment}
                                    titleStyle={styles.commentText}
                                />),
                            comment: "",
                        };
                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));
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
        marginLeft: 10,
        marginRight: 10
    },
    commentText: {
        color: COLOR_PINK
    },
    commentView: {
        flexDirection:'row',
        flexWrap:'wrap'
    }
})
