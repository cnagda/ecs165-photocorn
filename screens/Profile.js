import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_BORDER } from './../components/commonstyle';


export default class Loading extends React.Component {
    // authenticate user
    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:1}} >
                <TouchableHighlight style={styles.circle}>
                  <Text style={styles.text}>Put Photo Here</Text>
                </TouchableHighlight>
                </View>
                <View style={{flex:2}}>
                    <Text style = {styles.text}>About</Text>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_BACKGRND,
    },
    circle: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        backgroundColor: COLOR_BORDER,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 40,
    },
    text: {
        color: COLOR_PINK,
        fontSize: 20,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
