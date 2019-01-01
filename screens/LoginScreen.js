import  React from 'react';
import {SafeAreaView,
    StyleSheet,View,
    TextInput,Image,
    Button,
    KeyboardAvoidingView} from 'react-native';
import DataHandler from '../js/DataHandler';
const token="49f4f767-f1a0-4532-9986-a2247e692a71d3d415f4-7c27-411d-b30e-d3f332d8b3dd";
const loginAPI="https://sntestapimvc.novosharenet.com/api/Login";
export default class LoginScreen extends React.Component{
    constructor(props){
        super(props);
        this.dataHandler = new DataHandler();
    }
    static navigationOptions = {
        headerBackground:<Image style={{alignSelf:'center'}} source={require('../assets/logo-novo.png')}/>
      };
    render(){
        return (
        <View style={styles.container} >
        <KeyboardAvoidingView behavior="position" >  
            <TextInput style={styles.input}
                placeholder="Enter username/email"
                keyboardType='email-address'
                autoCorrect={false}
                returnKeyType='next'
                onSubmitEditing={()=> this.refs.txtPassword.focus()}
            />
         <TextInput  style={styles.input}
                placeholder="Enter Password"
                secureTextEntry={true}
                autoCorret={false}
                returnKeyType='go'
                ref={'txtPassword'}

            />
            <Button style={styles.button}
                title="Login"
                onPress={()=>{
                   this.dataHandler.getLocations((data)=>{

                   });
                }}
            />
        </KeyboardAvoidingView>
        </View>
     );
    }


}

/*
body: JSON.stringify({
    '@TenantId':"49f4f767-f1a0-4532-9986-a2247e692a71",
    Login:"timwest",
    Password:"2P3rF0rmAssetA!"
})*/
const styles = StyleSheet.create({
    container:{
        flexGrow:3,
        alingSelf:'stretch',
        backgroundColor: 'blue',
        flexDirection:'column',
        justifyContent:'center'

    },
    input:{
        height:40,
        margin:10,
        paddingHoritzontal:10,
        backgroundColor: 'rgba(255,255,255,.2)'
    },
    button:{
    }
});
