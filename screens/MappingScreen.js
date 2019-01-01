import React from 'react';
import {Image,
        BackHandler} from 'react-native';
import {MapView} from 'expo';
import resizeImage from '../assets/expand-square.png';

export default class MappingScreen extends React.Component {
  constructor(props){
    super(props);
    let regionBox=false;
    let delta=null;
    if(this.props.navigation.state.params.delta !=undefined){
      regionBox =true;
      delta = this.props.navigation.state.params.delta;
    }
    this.state={
      coords: this.props.navigation.state.params.coords,
      regionBox:regionBox,
      delta:delta
    }
  }
  static navigationOptions = {
    headerBackground:<Image style={{alignSelf:'center'}} source={require('../assets/logo-novo.png')}/>
  };

  componentDidMount(){
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack() // works best when the goBack is async
      return true;
    });
  }
  componentWillUnmount(){
    this.backHandler.remove();
  }
  renderBox(){
    if(!this.state.coords)
    return;
    const {latitude,longitude} = this.state.coords;
    const delta=this.state.delta;
   
    return( 
      <>
    <MapView.Polygon
      coordinates = {[
        {latitude:latitude+delta,longitude:longitude+delta},
        {latitude:latitude+delta,longitude:longitude-delta},
        {latitude:latitude-delta,longitude:longitude-delta},
        {latitude:latitude-delta,longitude:longitude+delta}
      ]}
     />
    <MapView.Marker draggable
        coordinate= {{latitude:latitude+delta,longitude:longitude+delta}}
        conterOffset={{x:.5,y:.5}}
        anchor={{x:.5,y:.5}}
        onDrag={(e) =>{ 
            const deltaLat = Math.abs(e.nativeEvent.coordinate.latitude - this.state.coords.latitude);
            const deltaLon = Math.abs(e.nativeEvent.coordinate.longitude - this.state.coords.longitude);
            console.log(deltaLat,"DeltaLat");
            console.log(deltaLat,"DeltaLon"); 
            const delta = Math.max(deltaLat,deltaLon);
            console.log(delta,"Delta");
            this.setState({delta:delta});
          }
        }
       onDragEnd={(e)=>{
          this.props.navigation.state.params.updateSearchBox(this.state.coords.latitude,this.state.coords.longitude,this.state.delta);    
       }} 
    >
      <Image 
      source={resizeImage}
    />

       </MapView.Marker>
    </>
     );
  }
  
  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          ...this.state.coords,
          latitudeDelta: this.state.regionBox?10*this.state.delta:0.0922,
          longitudeDelta: this.state.regionBox?5*this.state.delta:0.0421,
        }}>
        <MapView.Marker draggable
          coordinate={this.state.coords}
          title={!this.state.regionBox? this.props.navigation.state.params.Barcode.toString():""}
          description={!this.state.regionBox? this.props.navigation.state.params.Asset:""}
          onDrag={(e) =>{ 
            this.setState({coords:e.nativeEvent.coordinate});
            }
          }
          onDragEnd={(e) =>{
            if(!this.state.regionBox){ 
              this.props.navigation.state.params.updateLatLon(e.nativeEvent.coordinate,this.props.navigation.state.params.index);
              }
            if(this.state.regionBox){
              this.props.navigation.state.params.updateSearchBox(this.state.coords.latitude,this.state.coords.longitude,this.state.delta);    
              }  
            }
          } 
        />
          {this.state.regionBox && this.renderBox()}
      </MapView>
    );
  }
}