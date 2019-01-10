import React from "react";
import {View,Image,Button,StyleSheet,TouchableOpacity,Text} from "react-native";
import DataHandler from "../js/DataHandler";
import NovoDataHandler from "../js/NovoDataHandler";
export default class HomeScreen extends React.Component{
    static navigationOptions = {
        headerBackground:
        <View style={{alignSelf:'center',flex:2,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
        <Image resizeMode="contain" style={{height:50}} source={require('../assets/logo-novo.png')}/>
        </View>
      };
    renderButton(ButtonName,params,Title){
        return (
            <>
            <TouchableOpacity key={ButtonName} 
                onPress={()=>{
                    this.props.navigation.navigate(ButtonName,params);
                    }
                }
            >
            <View style={stylesheet.button}>
            <Text> {Title} </Text>   
            </View>   
            </TouchableOpacity>
            </>
        );
    }
    
    
    
    render(){
        console.log("token:",NovoDataHandler.token());
      
        return (
            <>
            
            {true && this.renderButton("WebViewScreen",{audit:true},"Web Based Management")}  
            {true && this.renderButton("SearchScreen",{},"Find Assets")}  
            {true && this.renderButton("AssetsScreen",{assets:[],isAsset:true},"Add New Assets")}  
            {true && this.renderButton("LocationScreen",{audit:true},"Audit Assets")}  
            
            </>
        );
    }
}
const stylesheet = StyleSheet.create({
    button:{
        padding:15,
        borderColor:'lightgrey',
        borderWidth:1,
        alignItems:'center',
    }
});