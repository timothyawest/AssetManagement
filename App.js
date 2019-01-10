import React from 'react';
import AssetsScreen from './screens/AssetsScreen';
import MappingScreen from './screens/MappingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import AddEditAssetScreen from './screens/AddEditAssetScreen';
import SearchScreen from './screens/SearchScreen';
import LocationScreen from './screens/LocationScreen';
import WebViewScreen from './screens/WebViewScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation'; // Version can be specified in package.json

const RootStack = createStackNavigator(
  {
    AssetsScreen: { screen: AssetsScreen,},
    CameraScreen: { screen: CameraScreen,},
    MapScreen:{ screen: MappingScreen,}, 
    AddEditAssetScreen:{ screen: AddEditAssetScreen,}, 
    LoginScreen: { screen: LoginScreen,},
    HomeScreen: { screen: HomeScreen,},
    SearchScreen: { screen: SearchScreen,},
    LocationScreen: {screen: LocationScreen},
    WebViewScreen: {screen: WebViewScreen}
  },
  {
    initialRouteName: 'LoginScreen',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render(){
    return <AppContainer />;
  }
}

