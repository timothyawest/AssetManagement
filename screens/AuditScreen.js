import React from 'react';
import { StyleSheet, 
  Text, 
  ScrollView,
  View,
  Button,
  Image,
  TouchableHighlight,
  BackHandler } from 'react-native';
import DataHandler from '../js/DataHandler';
import {NavigationEvents} from 'react-navigation';



export default class AuditScreen extends React.Component {
  constructor(props){
    super(props);
    let state ={};
    //this is assets from some place else, if add new assets it comes in as empty array
    //isAsset is set to true if type is Asset
    this.dataHandler = new DataHandler();
    if(props.navigation.state.params !=undefined &&       
      props.navigation.state.params.assets !=undefined){
      state={
        assets:props.navigation.state.params.assets,
        isLoading:false,
        audit:false,
      };
    //this is the default auditlist that is loaded
    } else{ 
      state = {
        isLoading: true,
        assets:[],
        audit:true
      }
      if(state.audit){
        this.dataHandler.fetchAuditList((data)=>{
          this.setState({assets:data,isLoading:false});
        });
      }else{
        this.dataHandler.fetchAssetList((data)=>{
          this.setState({assets:data,isLoading:false});
        });
      }
    }
    this.state = state;
  }
  static navigationOptions = {
    headerBackground:(
      <View>
        <Image resizeMode="contain" style={{alignSelf:'center'}} source={require('../assets/logo-novo.png')}/>
      </View>),
    headerRight: (
      <TouchableHighlight  onPress={() => alert('This is a button!')}>
        <Image style={{width:24, height:24,marginRight:10}}
            source={require('../assets/3-line.png')}
        />
      </TouchableHighlight>
    ),
  };

  componentDidMount(){
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack(); // works best when the goBack is async
      return true;
    });
  }
  componentWillUnmount(){
    this.backHandler.remove();
  }
  updateAsset(asset,index){
    const newAssets = this.state.assets;
    newAssets[index] =asset;
    this.setState({assets:newAssets});
  }
  
  updateAssets(assets){
    this.setState({assets:assets});
  }
  renderEditButton(index){
    return (
      <View style={{flexDirection:'row',width:32}}>
      <TouchableHighlight onPress={()=>{
          this.props.navigation.navigate("AddEditAssetScreen",{assets:this.state.assets,updateAssets:this.updateAssets.bind(this),index:index,action:"Edit"}); 
        }
      }>
        <Image style={{width:32, height:32}}
          source={require('../assets/edit-icon.png')}
        />
        
      </TouchableHighlight>
      <Text>{'    '}</Text>
      </View>
    );
  }
  
  renderTableRows(assets,action){
    const filteredAssets =  [];
    assets.forEach((asset,cnt) =>{
      const date = new Date(asset.Checked);
      if(asset.action==action){
        filteredAssets.push(
        <View key={cnt} style={{backgroundColor:cnt%2?'white':'lightgrey',flexDirection:'row',flexWrap:'wrap'}}>
        <View  style={{alignSelf:'flex-start',flex:2,flexDirection:'column'}}>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>
              {asset.Barcode}{'   '}
            </Text>
            <Text style={{fontSize:16}}>
              {asset.Asset}
            </Text>
          </View>
          <View style={{flexDirection:'row',}}>
            <Text style={{fontSize:16}}>
                {'   '}{date.getMonth()+1}{'/'}{date.getDate()}{'/'}{date.getFullYear()}{'   '}{date.toLocaleTimeString()}
            </Text>
          </View>
        </View>
        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignSelf:'center'}}>
            {this.renderEditButton(cnt)}
          </View>
        </View>);
      }
    }  );
    return filteredAssets;   
  }
  render() {
    if(this.state.isLoading){
      return(
        <View><Text>Loading Data</Text></View>
      );
    }
    
    if(this.state.assets ==undefined || this.state.assets==null){
      return;
    }
    
    let formatedAssets  = this.renderTableRows(this.state.assets,undefined);
    formatedAssets.unshift(
      <Text style={styles.unscannedAssets}>
        Unmodified Items
      </Text>
    )
    let formatedItemsScanned  = this.renderTableRows(this.state.assets,"Scanned");
    formatedItemsScanned.unshift(
      <Text style={styles.scannedAssets}>
        Scanned Items
      </Text>
    )
    let formatedItemsEdited  = this.renderTableRows(this.state.assets,"Edit");
    formatedItemsEdited.unshift(
      <Text style={styles.editedAssets}>
        Edited Items
      </Text>
    )
    let formatedItemsAdded  = this.renderTableRows(this.state.assets,"Add");
    formatedItemsAdded.unshift(
      <Text style={styles.editedAssets}>
        Added Items
      </Text>
    )
  
    let formatedItemsUnknown  = this.renderTableRows(this.state.assets,"Unknown Scanned");
    formatedItemsUnknown.unshift(
      <Text style={styles.unknownAssets}>
        Barcodes Not in System
      </Text>
    )
    let formatedItemsLookedUp  = this.renderTableRows(this.state.assets,"Looked Up Scanned");
    formatedItemsLookedUp.unshift(
      <Text style={styles.lookedUpAssets}>
        Barcodes Found In Database
      </Text>
    )
    return (
      
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        
      <ScrollView style={{alignSelf:'stretch'}}>
          {formatedItemsUnknown.length>1&&formatedItemsUnknown}
          {formatedItemsLookedUp.length>1&&formatedItemsLookedUp}
          {formatedItemsScanned.length>1&&formatedItemsScanned}
          {formatedItemsEdited.length>1&&formatedItemsEdited}
          {formatedItemsAdded.length>1&&formatedItemsAdded}
         
          {formatedAssets.length>1&&formatedAssets}
          <Button 
            title="Add New Asset"
            onPress={()=> {
              this.props.navigation.navigate("AddEditAssetScreen",{assets:this.state.assets,updateAssets:this.updateAssets.bind(this),index:0,action:"Add"}); 
          }}
      />
      </ScrollView>
        
      <View style={{alignSelf:'stretch',
                    flexDirection:'row',
                    justifyContent:'space-evenly',
                    margin:5
                  }}>
      <Button 
        title="Scan Codes"
        onPress={()=> {
          this.props.navigation.navigate("CameraScreen",{updateAssets: this.updateAssets.bind(this),assets:this.state.assets})
        }}
      />
      <Button 
        title="Plot Locations"
        onPress={()=> {
            alert("This function hasn't been added yet");
        }}
      />
      <Button 
        title="Upload Data"
        onPress={ 
            ()=> {
           
            const assetsEdited = this.state.assets.filter((asset)=> asset.action !=undefined && (asset.action =='Edit' || asset.action=="Scanned" || asset.action=="Looked Up Scanned"));
            const assetsAdded  = this.state.assets.filter((asset)=> asset.action !=undefined && asset.action =='Add');
            //The isn't necessary because datahandler now just chooses the fields it wants and throws away the rest.  
            //for(asset in assetsAdded){
            //    delete assetsChanged[asset].action;
            //}
            //if everything went ok we filter out the assets that were added to the database
            this.dataHandler.uploadAssets(assetsAdded);
            this.dataHandler.updateAssets(assetsEdited);
            this.setState({assets:this.state.assets});
            this.setState({assets:this.state.assets.filter((asset)=>  asset.action ==undefined || !(asset.action =='Edit' || asset.action=="Scanned" || asset.action=="Looked Up Scanned" || asset.action=="Add"))});
          }
        }
         
      />
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  unscannedAssets:{
    fontSize:18,
    fontWeight:'bold',
    color:'white',
    backgroundColor:'red'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannedAssets:{
    fontSize:18,
    fontWeight:'bold',
    color:'white',
    backgroundColor:'green'
  },
  editedAssets:{
    fontSize:18,
    fontWeight:'bold',
    color:'white',
    backgroundColor:'blue'
  },
  unknownAssets:{
    fontSize:18,
    fontWeight:'bold',
    color:'white',
    backgroundColor:'orange'
  },
  lookedUpAssets:{
    fontSize:18,
    fontWeight:'bold',
    color:'black',
    backgroundColor:'yellow'
  }

});
