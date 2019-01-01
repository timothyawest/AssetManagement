import React from 'react';
import { Text, View, TouchableOpacity,Image} from 'react-native';
import { Camera, Permissions, Location } from 'expo';
import DataHandler from '../js/DataHandler';

export default class CameraScreen extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        lastBarcode: null,
        barcodeTextColor: 'white',
        assets:this.props.navigation.state.params.assets,
        location: null,
      };
      this.dataHandler = new DataHandler();
      this._getLocationAsync();
    
  }

  static navigationOptions = {
    headerBackground:<Image style={{alignSelf:'center'}} source={require('../assets/logo-novo.png')}/>
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        alert('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log("location",location);
    this.setState({ location });
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  getIndexOfBarcode(assets,barcode){
    for(let i=0;i<assets.length;i++){
      if(assets[i].Barcode == barcode){
        return i;
      }
    }
    return -1;
  }
  barcodeTextStyle(color='white'){
    return { fontSize: 30, 
             marginTop: 10, 
             color: color, 
             flex: 1, 
             alignSelf:'center' }

  }
  checkServer(Barcode){
    if(!this.state.location || !this.state.location.coords.latitude){
      console.warn("latitude not yet updated -- probably not a problem");
      return;
    }
    this.dataHandler.fetchAssetList(
        (data)=>{
          if(data[0]){
            asset=data[0];
            console.log(asset,"Scanned in Look Up Scanned");
            asset.action ="Looked Up Scanned";
          } 
          //create object if not found temp id if database changes it, but perminant if not
          else{
            asset={Id:Date.now()};  
            asset.action="Unknown Scanned";
            asset.Barcode = Barcode;
          }
          asset.Lat = this.state.location.coords.latitude || 0;
          asset.Lon = this.state.location.coords.longitude || 0;
          asset.Checked = new Date().toJSON();       
          this.state.assets.unshift(asset);
          this.setState({assets:this.state.assets});
          this.props.navigation.state.params.updateAssets(this.state.assets);
        }
      ,{Barcode:Barcode}
    );
    
  }
  updateAssets(index,Barcode){
    if(!this.state.location || !this.state.location.coords.latitude){
      console.warn("latitude not yet updated -- probably not a problem");
      return;
    }
    let copyAssets = JSON.parse(JSON.stringify(this.state.assets));
    if(index==-1){
      this.checkServer(Barcode);
    } else{
      copyAssets[index].action="Scanned";
      copyAssets[index].Checked = new Date().toJSON();
      copyAssets[index].Lat = this.state.location.coords.latitude;
      copyAssets[index].Lon = this.state.location.coords.longitude;
      copyAssets.sort((a,b) => a.Barcode - b.Barcode);
      this.setState({assets:copyAssets});
      this.props.navigation.state.params.updateAssets(copyAssets);
    }
  }
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} 
            type={this.state.type}
            onBarCodeScanned={e => {
              let assets = this.state.assets;
              let index = this.getIndexOfBarcode(assets,e.data); 
              this.setState({lastBarcode:e.data});
              if(index >-1 && this.state.assets[index].action == undefined){
                this.setState({barcodeTextColor:'green'});
                this.updateAssets(index,e.data);
              } else if(index == -1){
                this.updateAssets(-1,e.data);
                this.setState({barcodeTextColor:'red'});
              }
            }} 
          >
              
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'column',
                alignContent:'flex-end'
              }}>
              <View style={{flex:4}}>

              </View>
              <Text  style={{ 
              fontSize: 30, 
              marginTop: 10, 
              height:40,
              color: this.state.barcodeTextColor, 
              
              flex: 1, 
              alignSelf:'center' }}>
               {this.state.lastBarcode} 
              </Text>
              <View style={{flex:1}}>
                
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}