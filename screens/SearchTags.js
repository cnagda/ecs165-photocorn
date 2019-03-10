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


class SearchTags extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {query: '', searchResults: [], result: []}
        this.displayResults = this.displayResults.bind(this)
    }

    // authenticate user
    componentDidMount() {
        this.displayResults()

    }
    componentWillReceiveProps() {
        this.setState({query: ''})
        searchResults = []

    }
    componentWillUnmount() {
        searchResults = []
    }
    updateSearch = (value) => {
        searchResults = []
        let currThis = this;
        if (value) {
            users_ref = firebase.firestore().collection("Tags");
            users_ref
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        //var fullName = doc.data().first + " " + doc.data().last
                        if (doc.data().tag.toLowerCase().includes(value.toLowerCase())) {

                            searchResults.push(
                                {
                                    tag: doc.data().tag,
                                    postarray: doc.data().posts
                                }
                            );
                            //console.log(searchResults)
                            this.setState({searchResults: searchResults})
                            this.displayResults()

                        }
                    }.bind(this));
                }.bind(this))
            }
            return searchResults
        }

    handleUpdate = async(query) => {
        this.setState({
          query: query
        }, () => {
            console.log(query)
          if (query && query.length > 0 ) {
              this.updateSearch(query)
          } else {
              searchResults = []
              this.setState({searchResults: searchResults})

              if (query.length == 0) {
                  this.setState({result: []})
                  this.displayResults()
              }
          }
        })
    };

    handleSelect(tag, postarr) {
        console.log("in handle select")
        firebase.firestore().collection("TagSearchHits").doc(tag).get().then(function(doc) {
            console.log("made it inside")
            var numHits = 0
            if (doc.exists) {
                numHits = doc.data().hits;
            }
            firebase.firestore().collection("TagSearchHits").doc(tag).set({
                hits: numHits + 1,
                tag: tag
            }).then(function() {
                console.log("trying to navigate")
                this.props.navigation.navigate('SearchPostView', {postarray: postarr, tag: tag});
            }.bind(this)).catch(function(error) {
                console.log("error setting: " + error)
            })
        }.bind(this)).catch(function(error) {
            console.log("error accessing doc: " + error)
        })
    }

    displayResults = () => {
        var query = this.state.query
        if (query.length > 0) {
            this.setState({
                result: this.state.searchResults.map(e => e['tag']).map((e, i, final) => final.indexOf(e) === i && i).filter(e => searchResults[e]).map(e => searchResults[e]).map((l) => (
                    <ListItem

                        key={l.tag}
                        title={l.tag}
                        onPress={() => this.handleSelect(l.tag, l.postarray)}
                        containerStyle={styles.result}
                        titleStyle={styles.resultText}
                        chevronColor='white'
                        chevron
                    />
                ))
            })
        } else {
            this.setState((prevState, props) => {
                return {
                    result: prevState.result.concat(<Text style={{color: '#f300a2', fontWeight: 'bold', marginTop: 50}}>POPULAR TAGS</Text>),
                };
            })
            firebase.firestore().collection("TagSearchHits").orderBy("hits", "desc").limit(10).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(hitdoc) {
                    firebase.firestore().collection("Tags").doc(hitdoc.data().tag).get().then(function(tagdoc) {
                        console.log("got a suggestion: " + hitdoc.data().tag)
                        this.setState((prevState, props) => {
                            return {
                                result: prevState.result.concat(<Button transparent onPress={() => this.props.navigation.navigate('SearchPostView', {postarray: tagdoc.data().posts, tag: hitdoc.data().tag})}>
                                    <Text style={{color: '#f300a2'}}>{hitdoc.data().tag}</Text>
                                </Button>),
                            };
                        })
                    }.bind(this))
                }.bind(this))
            }.bind(this))
        }
    }

    render() {

        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
        return (
            <Root>
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                <View style={{flex: 1, flexDirection:'column', marginTop: 50}}>
                         <TextInput
                             style={styles.search}
                             placeholder={"Search"}
                             placeholderTextColor='#f300a2'
                             onChangeText={query => this.handleUpdate(query) }
                             value={this.state.query}
                         />
                         <KeyboardAvoidingView
                             style={styles.container}
                             keyboardVerticalOffset = {keyboardVerticalOffset}
                             behavior="padding"
                             enabled
                         >
                         <ScrollView>
                         { this.state.result }
                         </ScrollView>


                         </KeyboardAvoidingView>
                        </View>
                </Content>
            </Container>
            </Root>
        );
    }

}

export default withNavigation(SearchTags);


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
    }
})
