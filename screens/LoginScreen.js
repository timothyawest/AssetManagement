import  React from 'react';
import {SafeAreaView,
    StyleSheet,View,
    TextInput,
    Button,
    KeyboardAvoidingView,
    Image} from 'react-native';
import DataHandler from '../js/DataHandler';
export default class LoginScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            Login:"timwest",
            Password:"2P3rF0rmAssetA!"
        }
        this.dataHandler = new DataHandler();
    }
    static navigationOptions = {
        headerBackground:
        <View style={{alignSelf:'center',flex:2,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
        <Image resizeMode="contain" style={{height:50}} source={require('../assets/logo-novo.png')}/>
        </View>
      };
    render(){
        return (
        <View style={styles.container} >
        <KeyboardAvoidingView behavior="position" >  
            <TextInput style={styles.input}
                placeholder="Enter username/email"
                keyboardType='default'
                autoCorrect={false}
                returnKeyType='next'
                onSubmitEditing={()=> this.refs.txtPassword.focus()}
                onChangeText={(Login) => this.setState({Login})}
            
            />
         <TextInput  style={styles.input}
                placeholder="Enter Password"
                secureTextEntry={true}
                autoCorret={false}
                returnKeyType='go'
                ref={'txtPassword'}
                onChangeText={(Password) => this.setState({Password})}
       
            />
            <Button style={styles.button}
                title="Login"
                onPress={()=>{
                    this.dataHandler.getToken({
                        Login:this.state.Login,
                        Password:this.state.Password
                    },token=>{                              //don't call this till token is set;
                        this.props.navigation.replace("HomeScreen");
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
        alignSelf:'stretch',
        backgroundColor: 'blue',
        flexDirection:'column',
        justifyContent:'center'

    },
    input:{
        height:40,
        margin:10,
        padding:10,
        backgroundColor: 'rgba(255,255,255,.2)'
    },
    button:{
    }
});
