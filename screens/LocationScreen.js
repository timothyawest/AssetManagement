import React from 'react';
import {Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet} from "react-native";
import DataHandler from "../js/DataHandler";
export default class LocationScreen extends React.Component {
    constructor(props){
        super(props);
        this.dataHandler = new DataHandler();
        this.state={
            Locations:null,
            assets:[]
        }
       
    }
    static navigationOptions = {
        headerBackground:
        <View style={{alignSelf:'center',flex:2,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
        <Image resizeMode="contain" style={{height:50}} source={require('../assets/logo-novo.png')}/>
        </View>
      };

    componentDidMount(){
        this.dataHandler.getLocations(data =>{
            data.sort((a,b)=>a.Title.toUpperCase()>b.Title.toUpperCase());
            this.setState({Locations:data});
        });
        
    }
    componentWillUnmount(){
        this.dataHandler.getToken({
            TenantId:"49f4f767-f1a0-4532-9986-a2247e692a71",
          
        });
    }
    startAudit(location){
        const loginname="timwest";
        alert(`Beginning audit at Location ${location.Title}`);
        const date = new Date();
        const auditTitle =  date.getFullYear() + "-" + date.getMonth()+1 + "-" + date.getDate() + " - "+loginname+ " - " + location.Title; 
        this.dataHandler.fetchAuditList((data)=>{
            //Does the audit list exist for today?  if so use it if not create a new one
            if(data.length<1){
                this.dataHandler.newAudit({Title:auditTitle,LocationId: location.LocationId}, data=>{
                    this.props.navigation.navigate("AssetsScreen",{assets:[],audit:true,Title:auditTitle,Locations:this.state.Locations});
                });
            }else{
                this.props.navigation.navigate("AssetsScreen",{assets:[],audit:true,Title:auditTitle,Locations:this.state.Locations,LocationId: location.LocationId});
            }
        },{Title:auditTitle} );
       
    }
    renderLocations(){
        if(!this.state.Locations){return};
        console.log(this.state,"Locations");
        const Loc = this.state.Locations;
        return (Loc.map((location,cnt)=>{
           return(
            <TouchableOpacity key={cnt}
                onPress={()=>{
                    this.startAudit(location);
                }}
            > 
                <View style={styles.Locations}>
                    <Text>
                        {location.Title}
                    </Text>
                </View>
            </TouchableOpacity>
           );
        }));
    }
    render(){
        return (<>
            <View>
                <View style={styles.Heading}>
                    <Text style={styles.HeadingTxt}>
                        Location of Audit
                    </Text>
                </View>
                <View>
                    {this.renderLocations()}
                </View>
            </View>

        </>);
    }
} 

const styles = new StyleSheet.create({
    Heading:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'blue'
      },
    HeadingTxt:{
        fontSize:18,
        fontWeight:'bold',
        color:'white',
    },
    Locations:{
        flexDirection:'row',
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'lightgrey'
    }
});
