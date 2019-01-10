import React, { Component } from 'react';
import { WebView,View,Image,Button } from 'react-native';
import DataHandler from '../js/DataHandler';
export default class MyWeb extends Component {
    constructor(props){
        super(props);
        this.trial.bind(this);
        this.navigationStateChange.bind(this);
        this.state = {
          
        }
        this.webview;
        this.trial = this.trial.bind(this);
        this.dataHandler = new DataHandler();
    }
    static navigationOptions = {
        headerBackground:
        <View style={{alignSelf:'center',flex:2,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
        <Image resizeMode="contain" style={{height:50}} source={require('../assets/logo-novo.png')}/>
        </View>
        };
    injectScript(){

    }
    componentWillUnmount(){
        // use stored user name and password 
        this.dataHandler.getToken({},token=>{});
           
    }

    navigationStateChange(state){
        console.log(this.dataHandler.getLoginInformation(),"loginInformation");
        if(state.url=='https://qa4.novosharenet.com/mobile/admin/'){
            this.webview.injectJavaScript(
            `
            if(document.getElementById('mainhome')){
                document.getElementById('mainhome').click();
            }`)
            setTimeout(()=>{
            this.webview.injectJavaScript(`
                document.getElementById("userName").value="${this.dataHandler.getLoginInformation().Login}";
                document.getElementById("password").value="${this.dataHandler.getLoginInformation().Password}";
                document.getElementById("login").click();
            `);        
            },1000);
        }        
      
    }
    trial(data){
    
        

    }
    render() {
        return (
            <>
        <WebView
            ref={r=>this.webview=r}
            source={{uri: 'https://qa4.novosharenet.com/mobile/admin/'}}
            javaScriptEnabled={true}  
            onNavigationStateChange={this.navigationStateChange.bind(this)}
            onLoadEnd={this.trial}
        />
       
        </>
        );
    }
}