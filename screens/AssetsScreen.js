import React from 'react';
import { StyleSheet, 
  Text, 
  ScrollView,
  View,
  Button,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  BackHandler,
  Dimensions,
  Picker } from 'react-native';
import DataHandler from '../js/DataHandler';
import {NavigationEvents} from 'react-navigation';



export default class AssetsScreen extends React.Component {
  constructor(props){
    super(props);
    let state ={};
    //this is assets from some place else, if add new assets it comes in as empty array
    //isAsset is set to true if type is Asset
    this.dataHandler = new DataHandler();
    if(props.navigation.state.params !=undefined &&       
      props.navigation.state.params.assets !=undefined){
      state={
        assets:props.navigation.state.params.assets
          .sort((a,b) => !a.Barcode? 1:!b.Barcode?-1:b.Barcode && parseInt(a.Barcode) - parseInt(b.Barcode)),
        isLoading:false,
        audit:props.navigation.state.params.audit?props.navigation.state.params.audit:false,
        modalVisible:false,
        auditText:"",
        sortBy:"Barcode",
        Locations:null,
      };
    //assets undefined
    } else{ 
      state = {
        isLoading: true,
        assets:[],
        auditText:"",
        audit:props.navigation.state.params.audit?props.navigation.state.params.audit:false,
        modalVisible:false,
        sortBy:"Barcode",
        Locations:null,
      }
    }
    this.state = state;
       
  }
  static navigationOptions = {
    headerBackground:
    <View style={{alignSelf:'center',flex:2,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
      <Image resizeMode="contain" style={{height:50}} source={require('../assets/logo-novo.png')}/>
    </View>
  };

  componentDidMount(){
    console.log(this.props.navigation.state.params.LocationId,"LocationId");
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack(); // works best when the goBack is async
      return true;
    });
    this.dataHandler.getLocations(data =>{
      
      this.setState({Locations:data});
    });
    //get audit we are going to associate with.
    if(this.state.audit && this.props.navigation.state.params.Title){
        this.dataHandler.fetchAuditList((data)=>{
          console.log(data,"audit");
          this.setState({auditText:String(data[0].Asset),AssetAuditId:String(data[0].id)});
        },{Title: this.props.navigation.state.params.Title});
      }
      if(this.props.navigation.state.params.LocationId){
        const LocationId=this.props.navigation.state.params.LocationId;
        this.dataHandler.fetchAssetList((data)=>{
          data.sort((a,b) => !a.Barcode? 1:!b.Barcode?-1:b.Barcode && parseInt(a.Barcode) - parseInt(b.Barcode));
          this.setState({assets:data,isLoading:false});
        },{LocationId});
      }

  }
  componentWillUnmount(){
    this.backHandler.remove();
    this.setState =undefined;  //don't set state after it has unmounted
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
      <View key={"EditButton"+this.state.assets[index].id} style={{flexDirection:'row',width:32}}>
      <TouchableOpacity onPress={()=>{
          this.props.navigation.navigate("AddEditAssetScreen",{assets:this.state.assets,updateAssets:this.updateAssets.bind(this),index:index,action:"Edit"}); 
        }
      }>
        <Image style={{width:32, height:32}}
          source={require('../assets/edit-icon.png')}
        />
        
      </TouchableOpacity>
      <Text>{'    '}</Text>
      </View>
    );
  }

    
  
  renderTableRows(){
    const groups = {
    "Add":[ this.renderHeader(styles.editedAssets,"Assets Added")],
    "Edit":[ this.renderHeader(styles.editedAssets,"Assets Edited")],
    "Scanned":[this.renderHeader(styles.scannedAssets,"Assets Scanned in this Location") ],
    "Unknown Scanned":[this.renderHeader(styles.unknownAssets,"Unknown Barcodes")],
    "Looked Up Scanned":[this.renderHeader(styles.lookedUpAssets,"Assets Belonging to a Different Location ")],
      undefined:[this.renderHeader(styles.unscannedAssets,"Assets in this Location")]
    };
    this.state.assets.forEach((asset,cnt) =>{
      const date = new Date(asset.Checked);
      groups[asset.action].push(
        <View key={"v1"+asset.id} style={{borderColor:'lightgrey',borderWidth:1,flexDirection:'row',flexWrap:'wrap'}}>
          <View style={{alignSelf:'flex-start',flex:2,flexDirection:'column'}}>
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
                  {'   '}{this.state.Locations && asset.LocationId &&  this.state.Locations.filter(item=>item.LocationId == asset.LocationId)[0].Title}{asset.SerialNumber && '  -  '}{asset.SerialNumber}
                </Text>
            </View>
          </View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignSelf:'center'}}>
            {!this.state.audit && this.renderEditButton(cnt)}
          </View>
        </View>);
      }
    );
    
    let filteredAssets=[];
    for(key in groups){
      if(groups[key].length>1){
        filteredAssets=filteredAssets.concat(groups[key]);
      }
    }
    console.log(filteredAssets.length,"length filtered");
    return filteredAssets;   
  }
  renderOrderBy(){
    return(<View style={{backgroundColor:'white'}}>
    <Picker
      selectedValue={this.state.sortBy}
      style={{ height: 20,width:200,flex:1,color:'black'}}
      onValueChange={(itemValue, itemIndex) =>{
        let assets=[...this.state.assets];
          switch(itemValue){
            case 'Title':  assets.sort((a,b) => !a.Asset?1:!b.Asset?-1:a.Asset.toUpperCase()> b.Asset.toUpperCase()?1:-1);
              this.setState({sortBy:"Title"})
              break;
            case 'Barcode':  assets.sort((a,b) => !a.Barcode? 1:!b.Barcode?-1:b.Barcode && parseInt(a.Barcode) - parseInt(b.Barcode));
              this.setState({sortBy:"Barcode"})
              break;
            case 'Location':  assets.sort((a,b) => !a.LocationId? 1:!b.LocationId?-1:b.LocationId && a.LocationId.toUpperCase() >  b.LocationId.toUpperCase()?1:-1);
              this.setState({sortBy:"Location"})
              break;
            default:
          }
          this.setState({assets:assets});
      }}>
      <Picker.Item label={"Not Sorted"} value={null}/>
      <Picker.Item label={"Order by Title"} value={"Title"} />  
      <Picker.Item label={"Order by Location"} value={"Location"} />  
      <Picker.Item label={"Order by Barcode"} value={"Barcode"} />  
    </Picker></View>);  
  }
  renderHeader(style,heading){
    return(
    <View key={heading}>
      <Text style={style}>
        {heading} 
      </Text>
    </View>
        )
  }
  renderAddNewAssetButton(){
    return(
          <TouchableOpacity
            onPress={()=> {
              this.props.navigation.navigate("AddEditAssetScreen",{assets:this.state.assets,updateAssets:this.updateAssets.bind(this),index:0,action:"Add"}); 
            }}
          >
          <View style={{alignItems:'center',backgroundColor:'blue',padding:10}}>
            <Text style={{color:'white'}}>Add New Asset</Text> 
          </View>

          </TouchableOpacity>
         
    )
  }
  renderAssetSections(){
    
    return (
      <View>
      {this.renderTableRows()}
      </View>
    );
  }
  render() {
    if(this.state.isLoading){
      return(
        <View><Text>Loading Data</Text></View>
      );
    }
    
    if(this.state.assets ==undefined || this.state.assets==null){
      console.log("No assets");
      return;
    }
    
  
    const auditTitle = this.state.auditText;
    console.log(auditTitle,"AuditTitle");
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ScrollView style={{alignSelf:'stretch'}}>
        <View>
            <Text style={styles.header}>
              {auditTitle && auditTitle}
            </Text>
          </View>
          {this.state.assets.length>0 && this.renderOrderBy()}  
          {this.renderAssetSections()}
          {!this.state.audit && this.renderAddNewAssetButton()}
      </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
          onPress={()=> {
            this.props.navigation.navigate("CameraScreen",{updateAssets: this.updateAssets.bind(this),assets:this.state.assets})
          }}>    
            <View style={styles.buttonhalf}>       
            <Text> 
              Scan Codes
              </Text>
            </View> 
          </TouchableOpacity>
          <TouchableOpacity
              onPress={ 
                ()=> {
              
                const assetsEdited = this.state.assets.filter((asset)=> asset.action !=undefined && (asset.action =='Edit' || asset.action=="Scanned" || asset.action=="Looked Up Scanned"));
                const assetsAdded  = this.state.assets.filter((asset)=> asset.action !=undefined && asset.action =='Add');
                if(!this.state.audit){
                  this.dataHandler.uploadAssets(assetsAdded);
                  this.dataHandler.updateAssets(assetsEdited);
                }
                if(this.state.audit){
                  console.log(this.state.AssetAuditId,"Audit ID");
                  this.dataHandler.updateAuditAssociation(this.state.AssetAuditId,assetsAdded);
                  this.dataHandler.updateAuditAssociation(this.state.AssetAuditId,assetsEdited);
                }
                  this.setState({assets:this.state.assets});
                  this.setState({assets:this.state.assets.filter((asset)=>  asset.action ==undefined || !(asset.action =='Edit' || asset.action=="Scanned" || asset.action=="Looked Up Scanned" || asset.action=="Add"))});
                
              }
            }>
            <View style={styles.buttonhalf}> 
              <Text>
                Upload Data
              </Text>
            </View>
          </TouchableOpacity>  
        </View>
         
    </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    fontSize:18,
    fontWeight:'bold',
    color:'black',
    backgroundColor:'white',
    alignSelf:'center'
  },
  unscannedAssets:{
    fontSize:18,
    fontWeight:'bold',
    color:'white',
    backgroundColor:'red',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer:{
    flexDirection:'row',
    alignSelf:'stretch',
    height:40,
  },
  buttonBlue:{
    alignSelf:'stretch',
    backgroundColor:'blue',
  },
  buttonhalf:{
    padding:10,
    borderColor:'lightgrey',
    borderWidth:1,
    width:Dimensions.get("window").width/2,
    alignItems:'center',
    justifyContent:'center'
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
