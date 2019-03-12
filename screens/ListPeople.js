import React from 'react'
import { StyleSheet, ScrollView, RefreshControl, View, Platform , StatusBar, TextInput, Dimensions, FlatList } from 'react-native'
import * as firebase from 'firebase';
import { COLOR_PINK, COLOR_BACKGRND, COLOR_DGREY, COLOR_LGREY, COLOR_PURPLEPINK } from './../components/commonstyle';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, Row, Grid, Col } from 'native-base';
import { ListItem }  from 'react-native-elements'


export default class ListPeople extends React.Component {
    // initialize state
    constructor(props) {
        super(props);
        //this.renderItem = this.renderItem.bind(this)

    }

    componentDidMount() {

    }

    _renderItem = ({item}) => (
        <ListItem
            roundAvatar
            leftAvatar={{ source: { uri: item.uri } }}
            key={item.key}
            title={item.username}
            onPress={() => this.props.navigation.push('Profile', {userID:item.key})}
            containerStyle={styles.result}
            titleStyle={styles.resultText}
            chevronColor='white'
            chevron
        />
    );





    render() {

        return (
            <Container style={styles.container}>
                <Header style={{backgroundColor: COLOR_DGREY, height: 80, borderBottomWidth: 0, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : undefined}}>
                    <Left style={{justifyContent: 'center'}}>
                        <Button transparent style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : undefined}}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text style={{color: COLOR_PINK, fontSize: 13}}>Back</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.props.navigation.getParam('title', '')}</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Content>
                    <View style={{flex: 1, flexDirection:'column', marginTop: 50}}>
                        <FlatList contentContainerStyle={styles.list} data={this.props.navigation.getParam('listOfPeople', [])} renderItem={this._renderItem} initialNumToRender={6}/>
                    </View>
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
    }
})
