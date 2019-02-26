export default createMaterialBottomTabNavigator({
        Profile: { screen: Profile },
        Library: { screen: NewPostUpload },
        History: { screen: HomeScreen },
        Cart: { screen: Login },
    }, {
        initialRouteName: 'HomeScreen',
        activeColor: '#f0edf6',
        inactiveColor: '#3e2465',
        barStyle: { backgroundColor: '#694fad' },
});

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}
