import React from 'react'
import { StyleSheet, ScrollView, RefreshControl, View, Platform , StatusBar, TextInput, Dimensions, FlatList } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { Container, Header, Title, Content, Left, Right, Body, Icon, Text, Row, Grid, Col } from 'native-base';
import { ListItem, Button }  from 'react-native-elements'


export default class ListPeople extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    _renderItem = ({item}) => (
        <ListItem
            roundAvatar
            leftAvatar={{ source: { uri: item.uri } }}
            key={item.key}
            title={item.name}
            subtitle={item.username}
            onPress={() => this.props.navigation.push('Profile', {userID:item.key})}
            containerStyle={styles.result}
            titleStyle={styles.resultText}
            subtitleStyle={styles.subtext}
            chevronColor='white'
            chevron
        />
    );

    render() {
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
                        <Title style={{color: 'white'}}>{this.props.navigation.getParam('title', '')}</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Content contentContainerStyle={{paddingLeft: 10, paddingRight: 10}}>
                    <FlatList
                        contentContainerStyle={styles.list}
                        data={this.props.navigation.getParam('listOfPeople', [])}
                        renderItem={this._renderItem}
                        initialNumToRender={6}
                    />
                </Content>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR_BACKGRND,
    },
    result: {
        backgroundColor: COLOR_DGREY,
        borderRadius: 12,
        marginTop: 10,
    },
    resultText: {
        color: COLOR_PINK
    },
    list: {
        justifyContent: 'center',
        flexDirection: 'column',
    },
    header: {
        backgroundColor: COLOR_DGREY,
        borderBottomWidth: 0,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 20,
        height: Platform.OS === "android" ? 80: undefined
    },
    subtext: {
        color: COLOR_LGREY
    },
})
