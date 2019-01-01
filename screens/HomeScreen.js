import React from "react";
import {View,Image,Button,StyleSheet} from "react-native";

export default class HomeScreen extends React.Component{
    static navigationOptions = {
        headerBackground:<Image style={{alignSelf:'center'}} source={require('../assets/logo-novo.png')}/>
      };
    render(){
        return (
            <>
            <View style={stylesheet.button}>
            <Button style= {stylesheet.button} title="Add New Assets"
                onPress={()=>{
                    this.props.navigation.navigate("AuditScreen",{assets:[],isAsset:true});
                    }
                }
            />
            </View>
            <View style={stylesheet.button}>
            <Button style= {stylesheet.button} title="Find Assets" 
                onPress={()=>{
                    this.props.navigation.navigate("SearchScreen");
                    }
                }
            />
            </View>
            <View style={stylesheet.button}>
            <Button style= {stylesheet.button} title="Audit Assets" 
                onPress={()=>{
                    this.props.navigation.navigate("AuditScreen",{audit:true});
                    }
                }
            />
            </View>
            </>
        );
    }
}
const stylesheet = StyleSheet.create({
    button:{
        marginTop:10,
        marginButtom:10,
    }
});