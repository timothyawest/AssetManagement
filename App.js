import React from 'react';
import AuditScreen from './screens/AuditScreen';
import MappingScreen from './screens/MappingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import AddEditAssetScreen from './screens/AddEditAssetScreen';
import SearchScreen from './screens/SearchScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation'; // Version can be specified in package.json

const RootStack = createStackNavigator(
  {
    AuditScreen: { screen: AuditScreen,  
    },
    CameraScreen: { screen: CameraScreen,
    },
    MapScreen:{ screen: MappingScreen,
    }, 
    AddEditAssetScreen:{ screen: AddEditAssetScreen,
    }, 
    LoginScreen: { screen: LoginScreen,
    },
    HomeScreen: { screen: HomeScreen,
    },
    SearchScreen: { screen: SearchScreen,
    }

  },
  {
    initialRouteName: 'HomeScreen',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render(){
    return <AppContainer />;
  }
}

