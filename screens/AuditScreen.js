import React from 'react';
import { StyleSheet, 
  Text, 
  ScrollView,
  View,
  Button,
  Image,
  TouchableOpacity,
  BackHandler,
  Modal,
  Picker } from 'react-native';
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
        assets:props.navigation.state.params.assets
          .sort((a,b) => !a.Barcode? 1:!b.Barcode?-1:b.Barcode && parseInt(a.Barcode) - parseInt(b.Barcode)),
        isLoading:false,
        audit:false,
        modalVisible:false,
        sortBy:"Barcode"
      };
    //this is the default auditlist that is loaded
    } else{ 
      state = {
        isLoading: true,
        assets:[],
        audit:true,
        modalVisible:false,
        sortBy:"Barcode"

      }
      if(state.audit){
        this.dataHandler.fetchAuditList((data)=>{
          data.sort((a,b) => !a.Barcode? 1:!b.Barcode?-1:b.Barcode && parseInt(a.Barcode) - parseInt(b.Barcode));
          this.setState({assets:data,isLoading:false});
        });
      }else{
        this.dataHandler.fetchAssetList((data)=>{
          data.sort((a,b) => !a.Barcode? 1:!b.Barcode?-1:b.Barcode && parseInt(a.Barcode) - parseInt(b.Barcode));
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
      <TouchableOpacity  onPress={() => alert('This is a button!')}>
        <Image style={{width:24, height:24,marginRight:10}}
            source={require('../assets/3-line.png')}
        />
      </TouchableOpacity>
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
  
  renderTableRows(assets,action){
    const filteredAssets =  [];
    assets.forEach((asset,cnt) =>{
      const date = new Date(asset.Checked);
      if(asset.action==action){
        filteredAssets.push(
        <View key={asset.id} style={{backgroundColor:cnt%2?'white':'lightgrey',flexDirection:'row',flexWrap:'wrap'}}>
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
            default:
          }
          this.setState({assets:assets});
      }}>
      <Picker.Item label={"Order by Title"} value={"Title"} />  
      <Picker.Item label={"Order by Barcode"} value={"Barcode"} />  
    </Picker></View>);  
  }
  renderHeader(style,heading){
    return(
    <View>
      <Text style={style}>
        {heading} 
      </Text>
    </View>
        )
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
      <>
      {this.renderHeader(styles.unscannedAssets,"Unmodified Items")}
      </>   
    )
    let formatedItemsScanned  = this.renderTableRows(this.state.assets,"Scanned");
    formatedItemsScanned.unshift(
      <>
      {this.renderHeader(styles.scannedAssets,"Scanned Items")}
      </>
    )
    let formatedItemsEdited  = this.renderTableRows(this.state.assets,"Edit");
    formatedItemsEdited.unshift(
      <>
      {this.renderHeader(styles.editedAssets,"Edited Items")}
      </>
      
    )
    let formatedItemsAdded  = this.renderTableRows(this.state.assets,"Add");
    formatedItemsAdded.unshift(
      <>
      {this.renderHeader(styles.editedAssets,"Added Items")}
      </>
      
    )
  
    let formatedItemsUnknown  = this.renderTableRows(this.state.assets,"Unknown Scanned");
    formatedItemsUnknown.unshift(
      <>
      {this.renderHeader(styles.unknownAssets,"Barcodes Not in System")}
      </>
     
    )
    let formatedItemsLookedUp  = this.renderTableRows(this.state.assets,"Looked Up Scanned");
    formatedItemsLookedUp.unshift(
      <>
      {this.renderHeader(styles.lookedUpAssets,"Barcodes Found In Database")}
      </>
    )
    return (
      
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}
          >
          <View style={{marginTop: 22}}>
            <View>
              <Text>Hello World!</Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({modalVisible:!this.state.modalVisible});
                }}>
                <Text>Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
          </Modal> 
  
        <ScrollView style={{alignSelf:'stretch'}}>
          {this.renderOrderBy()}  
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
    backgroundColor:'red',
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
