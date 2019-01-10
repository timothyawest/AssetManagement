import React from 'react';
import {Picker,Text,StyleSheet,View} from 'react-native';

//keep project specific items in here buttons and all that I find I may use on more that one screen
function picker(props){
    if(!props.List){return};
    const list= props.List.map((item)=>{
        return <Picker.Item key={item.Title+item[props.field]} label={item.Title} value={item[props.field]} />
    });
    list.unshift(<Picker.Item key={props.Label+"undefined"} label={"Nothing Selected"} value={undefined} />);
    return list;
}    
//props who knows if this is good! but It makes sence to put common items in a common file :\
// asset, List, callback, field, Label
export function CustomPicker(props){
    const asset={...props.asset};
    return(
    <View key={props.Label+props.field} style={styles.lbl}>
        <Text>{props.Label}</Text> 
        <Picker
            selectedValue={asset[props.field]}
            style={{ height: 50,width:200}}
            onValueChange={(itemValue) =>{
                if(asset[props.field] !== itemValue){
                    asset[props.field]= itemValue;
                    props.callback(asset);
                }
            }}>
            {picker(props)}  
        </Picker>
    </View>
    );
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
