import React from 'react'
import { StyleSheet, ScrollView, RefreshControl, View, Platform , StatusBar, TextInput, Dimensions } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, Row, Grid, Col } from 'native-base';
import { withNavigation } from 'react-navigation';
import { ListItem }  from 'react-native-elements'


// given a post id returns a list of comment strings
function getComments(postID) {
    console.log("postID: " + postID)
    var comments = [];
    var db = firebase.firestore();
    var ref = db.collection("Comments");
    var query = ref.where("postID", "==", postID)

    query.get().then(function(results) {
        // console.log(results);
        results.forEach(function(doc) {
            comments.push(doc.data().text)
        });
    });

    return comments;
}


class Comments extends React.Component {
    // initialize state
    constructor(props) {
        super(props);

        this.state = {
            comment: '',
            postID: this.props.navigation.getParam('postID')
        }
    }

    componentDidMount() {
        console.log("inside component did mount")
        // this.getPosts()
    }

    componentWillReceiveProps(newprops) {
        // this.getPosts()
        console.log("inside of componenet will receive props")
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
            this.setState({finishedCommment: true});
            // todo: rerender comments view and jump to top
        });
    }

    // maps a comment string to a list item
    toComment = (text, i) => {
        <ListItem
            key={i}
            title={text}
            containerStyle={styles.comment}
            titleStyle={styles.commentText}
        />
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
                    {getComments(this.state.postID).map(this.toComment)}

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
