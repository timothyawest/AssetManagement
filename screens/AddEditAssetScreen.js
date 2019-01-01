import React from "react";
import {Text,
    Image,
    KeyboardAvoidingView,
    Button,
    View, 
    TextInput,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    BackHandler,
    Picker,
    } from "react-native";
import {Location,Permissions} from 'expo';
import {NavigationEvents} from 'react-navigation';
import DataHandler from '../js/DataHandler';
export default class AddEditAssetScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            assets: this.props.navigation.state.params.assets,
            copyAsset:{...this.props.navigation.state.params.assets[this.props.navigation.state.params.index]},
            index: this.props.navigation.state.params.index,
            changed:false,
            Lat:null,
            Lon:null,
            assetType:null,
            assetTypes:[]
        };
        this.dataHandler =new DataHandler();

        this._getLocationAsync();
        this.dataHandler.getAssetTypes(data=>{
            console.log(data,"data");
            this.setState({assetTypes:data})});
    }
    static navigationOptions = {
        headerBackground:<Image style={{alignSelf:'center'}} source={require('../assets/logo-novo.png')}/>,
    };
   
    componentDidMount(){
        if(this.props.navigation.state.params.action !== undefined && this.props.navigation.state.params.action=="Add"){
            this.setState({index:0});
            this.state.assets.unshift({id:Date.now().toString(),Asset:""});
            this.setState({copyAsset:{}});
        }
        this.state.assets[this.state.index].Checked=new Date().toJSON();
        this.setState({assets:this.state.assets});

        this.willBlur = this.props.navigation.addListener("willBlur", payload =>
            BackHandler.removeEventListener("hardwareBackPress", this.props.onBack),
        );
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if(this.state.changed){
                alert("Please Press Cancel or Save before going back");
                return true;
            }else{
                this.props.navigation.goBack(); // works best when the goBack is async
                return true;
            }
          });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.willBlur.remove();
    }
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('Permission to access location was denied');
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ Lat:location.coords.latitude,Lon:location.coords.longitude });
        console.log("Got here");
        if(this.props.navigation.state.params.action !== undefined && this.props.navigation.state.params.action=="Add"){
            this.state.assets[0].Lat = location.coords.latitude; 
            this.state.assets[0].Lon = location.coords.longitude;
            this.setState({assets:this.state.assets}); 
        }
     
    };
    updateLatLon(latlon,index){
        console.log(latlon,index,"update lat lon");
        this.state.assets[index].Lat = latlon.latitude;
        this.state.assets[index].Lon = latlon.longitude;
        this.setState({assets:this.state.assets,changed:true});
    }
    renderMapButton(asset,index) {
        if(asset.Lon !=undefined && asset.Lon != null){
          return (
            <View style={{flexDirection:'row',width:32}}>
            <TouchableHighlight onPress={()=>{
              this.props.navigation.navigate("MapScreen",{coords:{latitude:asset.Lat,longitude:asset.Lon},index:index,Asset:asset.Asset,Barcode:asset.Barcode,updateLatLon:this.updateLatLon.bind(this)}); 
              }
            }>
              <Image style={{width:32, height:32}}
                source={require('../assets/geo-fence.png')}
              />
              
            </TouchableHighlight>
            <Text>{'  '}</Text>
            </View>
          );
        }
        return <></>;
     
      }
    renderPicker(){
        return (
            this.state.assetTypes.map((item)=>{
                return <Picker.Item label={item.Title} value={item.AssetTypeId} />
            }
            ));
    }    
    renderFields(){
        const asset=this.state.assets[this.state.index];
        if(asset==undefined)
            return;
        return (
        <View>
        <View style={styles.lbl}>
            <Text>Title:</Text>
            <TextInput key={'asset'} style={styles.input}
                placeholder={'Enter Title'}
                keyboardType='email-address'
                autoCorrect={false}
                returnKeyType='next'
                onChangeText={(text)=>{
                        const assets = this.state.assets;
                        assets[this.state.index].Asset = text;
                        this.setState({assets,changed:true});
                        }
                }
                value={asset.Asset!=undefined?asset.Asset:""}
            />   
        </View>
        <View style={styles.lbl}>
            <Text>Barcode:</Text> 
            <TextInput key={'Barcode'} style={styles.input}
                placeholder={'Enter Barcode'}
                keyboardType='email-address'
                autoCorrect={false}
                returnKeyType='next'
                onChangeText={(text)=>{
                        const assets = this.state.assets;
                        assets[this.state.index].Barcode = text;
                        this.setState({assets,changed:true});
                        }
                }
                value={asset.Barcode!=undefined?asset.Barcode.toString():""}
            />  
        </View>
        <View style={styles.lbl}>
            <Text>Serial #:</Text>
            <TextInput key={'Serial_Number'} style={styles.input}
                placeholder={'Enter Serial Number'}
                keyboardType='email-address'
                autoCorrect={false}
                returnKeyType='next'
                onChangeText={(text)=>{
                        const assets = this.state.assets;
                        assets[this.state.index].SerialNumber = text;
                        this.setState({assets,changed:true});
                        }
                }
                value={asset.SerialNumber!=undefined?asset.SerialNumber.toString():""}
            />    
        </View>
        <View style={styles.lbl}>
            <Text>Asset Type:</Text> 
            <Picker
                selectedValue={this.state.assets[this.state.index].AssetTypeId}
                style={{ height: 50,width:200}}
                onValueChange={(itemValue, itemIndex) =>{
                    const assets = this.state.assets;
                    assets[this.state.index].AssetTypeId = itemValue;
                    this.setState({assets,changed:true});
                }}>
                {this.renderPicker()}  
            </Picker>
        </View>
        <View style={styles.lbl}>
           {this.renderMapButton(asset,this.state.index)}     
            <Text>
                {'    '}Lat: {isNaN(asset.Lat)?"":asset.Lat.toString().substr(0,7)}, Lon: {isNaN(asset.Lon)?"":asset.Lon.toString().substr(0,7)}
            </Text>
        </View>
        </View>);

    }
    renderSaveCancelChanges(){
        return(<>
        <Button 
        title="Cancel Changes"
        onPress={()=> {              
                this.state.assets[this.state.index] = {...this.state.copyAsset};
                this.setState({changed:true});   //this is to force a redraw... react only sees top level changes.
                this.setState({assets:this.state.assets,changed:false});
        }}
        />
        </>);
        
    }   
    render(){
        const action = this.props.navigation.state.params.action!=undefined?this.props.navigation.state.params.action:"Edit";            
        return (
            <>
            <NavigationEvents
                onWillBlur={payload =>{
                    const action = this.props.navigation.state.params.action;
                    const assets = this.state.assets;
                    if(this.state.changed || assets[this.state.index].action == 'Add'){
                        //Add already there we don't want to put in an action of edit cause we have to add a record before we edit it
                        if(assets[this.state.index].action != 'Add' && assets[this.state.index].action !='Edit'){
                            assets[this.state.index].action = action!==undefined && action;
                        }
                        this.props.navigation.state.params.updateAssets(assets);
                        this.setState({assets:assets,changed:false,copyAsset:{...assets[this.state.index]}});
                    }else if(action !=undefined && action=="Add"){
                        this.state.assets.shift();
                    }
                }}
            />
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>   
             <ScrollView>
                {this.state.changed&&this.renderSaveCancelChanges()}   
                <Text style={{alignSelf:'center',fontSize:16,margin:10}}>{action} Asset</Text>
                {this.renderFields()}
                <View style={{height:400}}>
                </View>   
            </ScrollView>
            </KeyboardAvoidingView>   
            </>          
              
            
                
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
        flexDirection:'row'
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

