import React from 'react'
// import { StyleSheet, Platform, Image, Text, View, Button, ScrollView, RefreshControl, } from 'react-native'
import { StyleSheet, Platform, ScrollView, RefreshControl, TextInput, View, KeyboardAvoidingView } from 'react-native'
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

var searchResults = []

//remove duplicates from https://reactgo.com/removeduplicateobjects/

function search(array, key) {
    var res;
    for (var i = 0; i < array.length; i++) {
        if (array[i].uid === key) {
            res = array[i];
        }
    }

    var promise = new Promise(function(resolve, reject) {resolve(res)});
    return promise;
}

class SearchNames extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {query: '', searchResults: [], namesOfPeople: this.getNamesandUsernames(), result: [], followers:[], interests: []}
        this.getNamesandUsernames = this.getNamesandUsernames.bind(this)
        this.updateSearch = this.updateSearch.bind(this)
    }


    // authenticate user
    componentDidMount() {

         this.getInterests()
         this.getFollowerInfo()
    }
    componentWillReceiveProps() {
        this.setState({query: ''})
        searchResults = []

    }
    componentWillUnmount() {
        searchResults = []
    }

    getInterests() {
        var interests = ""
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(function(thisuserdoc) {
            this.setState({interests: thisuserdoc.data().interests})
        }.bind(this))
    }

    getFollowerInfo() {
        var followers = {};

        var followersSorted = [];
        firebase.firestore().collection("Follows").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                user = doc.data().followedID
                //console.log("here's a person: " + user)
                if (followers.hasOwnProperty(user)) {
                    //console.log("hereeee")
                    followers[user] += 1
                } else {
                    followers[user] = 1
                }
                //console.log("followers: " + followers[user])
            }.bind(this))
            for (var item in followers) {
                followersSorted.push([item, followers[item]]);
            }

            followersSorted.sort(function(a, b) {
                return b[1] - a[1];
            })
            this.setState({followers: followersSorted}, () => {
                this.displayResults()
            })

        }.bind(this))

    }

    getNamesandUsernames() {
        var namesOfPeople = []
        firebase.firestore().collection("Follows").where("userID", "==", firebase.auth().currentUser.uid).get().then(function(querySnapshot1) {
            querySnapshot1.forEach(function(followdoc) {
                    firebase.firestore().collection("users").doc(followdoc.data().followedID).get().then(function(userdoc) {
                        var fullName = userdoc.data().first + " " + userdoc.data().last
                        //console.log("in following " + fullName)
                        var username = userdoc.data().username
                        var uid = userdoc.data().uid
                        const path = "ProfilePictures/".concat(userdoc.data().uid,".jpg");
                        //var photourl = "http://i68.tinypic.com/awt7ko.jpg";
                        const image_ref = firebase.storage().ref(path);
                        //let currThis = this;
                        image_ref.getDownloadURL().then(onResolve, onReject);
                        function onResolve(downloadURL) {
                            namesOfPeople.push({name: fullName, username: username, photo: downloadURL, uid: uid});
                        }
                        function onReject(error){ //photo not found
                            namesOfPeople.push({name: fullName, username: username, photo: "http://i68.tinypic.com/awt7ko.jpg", uid: uid});
                        }
                    }.bind(this))

            }.bind(this))
            var users_ref = firebase.firestore().collection("users");

            users_ref
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        if (!namesOfPeople.some(e => e.uid === doc.data().uid)) {
                            var fullName = doc.data().first + " " + doc.data().last
                            //console.log("in regular search " + fullName)
                            var username = doc.data().username
                            var uid = doc.data().uid
                            const path = "ProfilePictures/".concat(doc.data().uid,".jpg");
                            //var photourl = "http://i68.tinypic.com/awt7ko.jpg";
                            const image_ref = firebase.storage().ref(path);
                            //let currThis = this;
                            image_ref.getDownloadURL().then(onResolve, onReject);
                            function onResolve(downloadURL) {
                                namesOfPeople.push({name: fullName, username: username, photo: downloadURL, uid: uid});
                            }
                            function onReject(error){ //photo not found
                                namesOfPeople.push({name: fullName, username: username, photo: "http://i68.tinypic.com/awt7ko.jpg", uid: uid});
                            }
                        }
                    }.bind(this));
                }.bind(this));
        })

        return namesOfPeople
    }


    updateSearch = (value) => {
        var people = this.state.namesOfPeople;
        //let currThis = this;
        searchResults = []
        if (value) {
            people.forEach(function(user) {
                if (user.name.toLowerCase().includes(value.toLowerCase()) || user.username.toLowerCase().includes(value.toLowerCase())) {
                    searchResults.push({
                                            name: user.name,
                                            username: user.username,
                                            userID: user.uid,
                                            photo: user.photo,
                                        })
                    this.setState({searchResults: searchResults})
                    this.displayResults();
                }
            }.bind(this));
        }
    }





    displayResults = () => {
        var query = this.state.query
        if (query.length > 0) {
            this.setState({
                result: this.state.searchResults.map(e => e['name']).map((e, i, final) => final.indexOf(e) === i && i).filter(e => searchResults[e]).map(e => searchResults[e]).map((l) => (
                    <ListItem
                        roundAvatar
                        leftAvatar={{ source: { uri: l.photo } }}
                        key={l.userID}
                        title={l.name}
                        subtitle={l.username}
                        onPress={() => this.props.navigation.push('Profile', {userID: l.userID})}
                        containerStyle={styles.result}
                        titleStyle={styles.resultText}
                        subtitleStyle={styles.subtext}
                        chevronColor='white'
                        chevron
                    />
                ))
            })
        } else if (this.state.followers) {
            var currentUser = firebase.auth().currentUser.uid;
            this.setState((prevState, props) => {
                return {
                    result: prevState.result.concat(<Text style={styles.sugtext}>Suggestions</Text>),
                };
            })



            for (let i = 0; i < Math.min(this.state.followers.length, 10); i++) {
                let user = this.state.followers[i]
                let result = []
                let numGotten = 0
                if (user[0] != currentUser) {
                    firebase.firestore().collection("users").doc(user[0]).get().then(function(userdoc) {
                        if (userdoc.exists) {
                            firebase.firestore().collection("Posts").where("userID", "==", user[0]).get().then(function(querySnapshot) {
                                if (querySnapshot.empty) {

                                } else {
                                    let counter = 0;
                                    querySnapshot.forEach(function(postdoc) {
                                        firebase.firestore().collection("AutoTags").where("photoID", "==", postdoc.data().postID).get().then(function(autotagquery) {
                                            if (!autotagquery.empty) {
                                                autotagquery.forEach(function(match) {
                                                    if (this.state.interests.includes(match.data().bucket)) {
                                                        if (counter < 1) {
                                                            counter ++;
                                                            this.setState((prevState, props) => {
                                                                let arr = prevState.result.slice(); //creates the clone of the state
                                                                var l = userdoc.data();
                                                                var photo = "http://i68.tinypic.com/awt7ko.jpg"

                                                                // get profile picture
                                                                var people = this.state.namesOfPeople;
                                                                let person = people.find(o => o.uid === l.uid);
                                                                photo = person.photo

                                                                arr[i] =
                                                                    <ListItem
                                                                        roundAvatar
                                                                        leftAvatar={{ source: { uri: photo} }}
                                                                        key={l.uid}
                                                                        title={l.first + " " + l.last}
                                                                        subtitle={l.username}
                                                                        onPress={() => this.props.navigation.push('Profile', {userID: l.uid})}
                                                                        containerStyle={styles.result}
                                                                        titleStyle={styles.resultText}
                                                                        subtitleStyle={styles.subtext}
                                                                        chevronColor='white'
                                                                        chevron
                                                                    />
                                                                // console.log(arr)
                                                                return {
                                                                    result: arr
                                                                }
                                                            })
                                                        }
                                                    }
                                                }.bind(this))
                                            }
                                        }.bind(this))
                                    }.bind(this))
                                }
                            }.bind(this))
                        }
                    }.bind(this))
                }

            }

        }

    }



    handleUpdate = async(query) => {
        this.setState({
          query: query
        }, () => {
          if (query && query.length > 0 ) {
              this.updateSearch(query)
          } else {
              searchResults = []
              this.setState({searchResults: searchResults})

              if (query.length == 0) {
                  this.setState({result: []}, () => {
                      this.displayResults()
                  })

              }


          }
        })
    };


    render() {

        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
        return (
            <Root>
                <Container style={styles.container}>
                    <Content contentContainerStyle={styles.content}>
                        <View style={{flex: 1, flexDirection:'column', marginTop: 50}}>
                            {/*search bar*/}
                            <TextInput
                                style={styles.search}
                                placeholder={"Search"}
                                placeholderTextColor='#f300a2'
                                onChangeText={query => this.handleUpdate(query) }
                                value={this.state.query}
                            />

                            {/*search results*/}
                            <KeyboardAvoidingView
                                style={styles.container}
                                keyboardVerticalOffset = {keyboardVerticalOffset}
                                behavior="padding"
                                enabled
                            >
                                <ScrollView>
                                    {this.state.result}
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </View>
                    </Content>
                </Container>
            </Root>
        );
    }

}

export default withNavigation(SearchNames);

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
        marginTop: -30,
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
    subtext: {
        color: COLOR_LGREY
    },
    sugtext: {
        fontWeight: 'bold',
        color: COLOR_LGREY,
        marginTop: 20
    }
})
