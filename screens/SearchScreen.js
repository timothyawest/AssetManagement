import React from "react";
import {Text,
    TextInput, 
    Image,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Button,
    View,
    TouchableHighlight,
    } from "react-native";
import {CheckBox} from 'react-native-elements';
import {Location,Permissions} from 'expo';
import DataHandler from '../js/DataHandler';
export default class SearchScreen extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            Asset:"",
            Barcode:"",
            assets:[],
            delta:.001,
            Lat:null,
            Lon:null,
            searchInRegion:false
        }
        this.dataHandler =  new DataHandler();
    }
    static navigationOptions = {
        headerBackground:<Image style={{alignSelf:'center'}} source={require('../assets/logo-novo.png')}/>
      };
      componentWillMount(){
        console.log("getting locaiton");
        this._getLocationAsync();
    
      }
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('Permission to access location was denied');
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ Lat:location.coords.latitude,Lon:location.coords.longitude });
    };
   
    updateSearchBox(Lat,Lon,delta){
        this.setState({Lat:Lat,Lon:Lon,delta:delta});
    }
    renderMapButton() {
        if(this.state.Lon !=undefined && this.state.Lon != null){
          return (
            <TouchableHighlight style={{flex:1}} onPress={()=>{
                this.setState({searchInRegion:true});
                this.props.navigation.navigate("MapScreen",{coords:{latitude:this.state.Lat,longitude:this.state.Lon},delta:this.state.delta,updateSearchBox:this.updateSearchBox.bind(this)}); 
            }
            }>
              <Image style={{width:32, height:32}}
                source={require('../assets/geo-fence.png')}
              />
              
            </TouchableHighlight>
          );
        }
        return <></>;
     
      }
 
    render(){
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>   
                <ScrollView>
            
                <Text>Title Contains:</Text>
                <TextInput style={styles.input}
                    placeholder={'Search in Title'}
                    keyboardType='email-address'
                    autoCorrect={false}
                    returnKeyType='next'
                    onChangeText={(text)=>{
                            this.setState({Asset:text});
                            }
                    }    
                />
                <Text>Barcode Number:</Text>
                <TextInput style={styles.input}
                    placeholder={'Search Barcode'}
                    keyboardType='email-address'
                    autoCorrect={false}
                    returnKeyType='next'
                    onChangeText={(text)=>{
                            this.setState({Barcode:text});
                            }
                    }    
                />
                <View style={{color:'lightgrey'}}>
                    <CheckBox
                        title="Search in Region:"
                        containerStyle={{backgroundColor:'lightgrey',padding:0,borderColor:'lightgrey',margin:0}}
                        checked={this.state.searchInRegion}
                        onPress={() => this.setState({ searchInRegion: !this.state.searchInRegion })}
                    >
                    </CheckBox>
                </View>
                <View style={styles.lbl}>
                    {this.renderMapButton()}
                    <Text style={{flexGrow:1,alignItems:'center'}}>
                        Lat: {this.state.Lat!==null&&this.state.Lat.toString().substr(0,7)}
                        , Lon: {this.state.Lon!==null&&this.state.Lon.toString().substr(0,7)}
                        {'   '}Delta:{this.state.delta!==null&&this.state.delta.toString().substr(0,7)}  
                    </Text>
                </View>
                <Button
                    title="Search"
                    onPress={()=>{
                      this.dataHandler.fetchAssetList(data => {
                        this.setState({assets:data});
                        console.log(data,"data");
                        this.props.navigation.navigate("AuditScreen",{assets:data});
                     },
                        this.state);  
                    }}
                />
                </ScrollView>
            </KeyboardAvoidingView>   
           
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flexGrow:3,
        alignSelf:'stretch',
        backgroundColor: 'lightgrey',
        flexDirection:'column',
        justifyContent:'center',
      
    },
    lbl:{
        flex:1,
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'lightgrey'
    },
    input:{
        flex:2,
        height:40,
        margin:10,
        padding:10,
        color:'black',
        backgroundColor: 'rgba(255,255,255,.2)'
    },
});