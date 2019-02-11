import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Button } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';


export default class Loading extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        this.state = {currentUser: null,
                        firstname: "user",
                        lastname: "user",
                        isLoading: true,
                        birthday: "unknown",
                        email: null,
                        bio: "unknown",
                        interests: "unknown",
                    }
    }

    // authenticate user
    componentDidMount() {
        users_ref = firebase.firestore().collection("users");
        users_ref.doc(firebase.auth().currentUser.uid).get().then(function(doc) {
            console.log("inside get " + firebase.auth().currentUser.uid)
            this.setState(
                {
                    currentUser: firebase.auth().currentUser,
                    firstname: doc.data().first,
                    lastname: doc.data().last,
                    birthday: doc.data().dob,
                    email: firebase.auth().currentUser.email,
                    bio: doc.data().bio,
                    interests: doc.data().interests,
                    isLoading: false
                }
            );
        }.bind(this)).catch ((error) => {console.error(error);});
    }

    render() {
        console.log( "inside homescreen render" + this.state.loading + " - " + this.state.name);

        if(this.state.isLoading) {
            return ( false )
        }

        return (
            <View style={styles.container}>
                <View style={{flex:1, flexDirection:'row', marginBottom:40, marginLeft:20,}} >
                    <View style={{flex:1, flexDirection:'column'}}>
                        <TouchableHighlight style={styles.circle}>
                          <Text style={styles.textMainOne}>Put Photo Here</Text>
                        </TouchableHighlight>
                        <Text style = {styles.textMainTwo}>{this.state.firstname} {this.state.lastname}</Text>
                    </View>
                    <View style = {styles.followButton} >
                        <Button
                            title="Edit"
                            onPress={() => this.props.navigation.navigate('ProfileEdit')}
                            color= 'rgba(228,228,228,0.66)'
                        />
                    </View>
                </View>
                <View style={{flex:2, flexDirection: 'row',marginLeft:20,}}>
                    <View style={{flex:1, flexDirection:'column',}} >
                        <Text style = {styles.textMainTwo}>About</Text>
                        <Text style = {styles.textSecond}>Birthday:</Text>
                        <Text style= {styles.textVal}> {this.state.birthday}</Text>
                        <Text style={styles.textSecond}>Bio: </Text>
                        <Text style={styles.textVal}>{this.state.bio}</Text>
                        <Text style = {styles.textSecond}>Interests: </Text>
                        <Text style={styles.textVal}>{this.state.interests}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

//note: font not working

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_BACKGRND,
    },
    circle: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        backgroundColor: COLOR_DGREY,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    textMainOne: {
        color: COLOR_PINK,
        fontSize: 20,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'FuturaUCDavis-Book, Futura UC Davis',
    },
    textMainTwo: {
        color: COLOR_PINK,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'FuturaUCDavis-Book, Futura UC Davis',
        borderRadius: 20,
        marginTop:20,
    },
    textSecond: {
        color: COLOR_PURPLEPINK,
        fontSize: 15,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'FuturaUCDavis-Book, Futura UC Davis',
        marginTop: 20,
    },
    textVal: {
        color: COLOR_LGREY,
        fontSize: 15,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'FuturaUCDavis-Book, Futura UC Davis',
    },
    followButton: {
        alignItems: 'stretch',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'column',
        margin:10,
    },
})
