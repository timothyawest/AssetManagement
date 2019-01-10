import React from "react";
import {Text,
    TextInput, 
    Image,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Button,
    View,
    TouchableOpacity,
    } from "react-native";
import {CheckBox} from 'react-native-elements';
import {Location,Permissions} from 'expo';
import DataHandler from '../js/DataHandler';
import {CustomPicker} from '../js/RenderableItems';

export default class SearchScreen extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            Asset:"",
            Barcode:"",
            assets:[],
            delta:.001,
            LocationId:null,
            AssetTypeId:null,
            Lat:null,
            Lon:null,
            Locations:null,
            assetTypes:null,
            searchInRegion:false
        }
        this.dataHandler =  new DataHandler();
    }
    static navigationOptions = {
        headerBackground:
        <View style={{alignSelf:'center',flex:2,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
        <Image resizeMode="contain" style={{height:50}} source={require('../assets/logo-novo.png')}/>
        </View>
      };
      
      componentWillMount(){
        console.log("getting locaiton");
        this._getLocationAsync();
    
      }
      componentDidMount(){
        this.dataHandler.getAssetTypes(data=>{
            console.log(data,"assettypes");
            this.setState({assetTypes:data});
        });
        this.dataHandler.getLocations(data=>{
            console.log(data,"locations");
            data.sort((a,b)=>a.Title.toUpperCase()>b.Title.toUpperCase());
            this.setState({Locations:data});
        })
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
            <TouchableOpacity style={{flex:1}} onPress={()=>{
                this.setState({searchInRegion:true});
                this.props.navigation.navigate("MapScreen",{coords:{latitude:this.state.Lat,longitude:this.state.Lon},delta:this.state.delta,updateSearchBox:this.updateSearchBox.bind(this)}); 
            }
            }>
              <Image style={{width:32, height:32}}
                source={require('../assets/geo-fence.png')}
              />
              
            </TouchableOpacity>
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
                
                
                <CustomPicker callback={(asset)=>
                    {
                        this.setState({...asset}); //force a refresh
                    }
                } 
                    field="LocationId" 
                    Label="Asset Location:" 
                    asset={this.state} 
                    List={this.state.Locations}
                />
                <CustomPicker callback={(asset)=>
                    {
                        this.setState({...asset}); //force a refresh
                    }
                } 
                    field="AssetTypeId" 
                    Label="Asset Type:" 
                    asset={this.state} 
                    List={this.state.assetTypes}
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
                <TouchableOpacity
                    onPress={()=>{
                        this.dataHandler.fetchAssetList(data => {
                          this.setState({assets:data});
                          this.props.navigation.navigate("AssetsScreen",{assets:data});
                       },
                          this.state);  
                      }}
                >
                <View style={{alignItems:'center',backgroundColor:'blue',padding:10}}>
                    <Text style={{color:'white'}}>Search</Text> 
                </View>

               </TouchableOpacity>
                
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