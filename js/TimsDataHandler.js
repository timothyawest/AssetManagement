const BASEURL = "https://truebesttech.com/barcode/";

export default class TimsDataHandler{
    createSearchString(searchObject){
        let str="";
        if(searchObject.Asset){
            str += "Asset="+searchObject.Asset;
        }
        if(searchObject.Barcode){
            if(str.length>0){
                str +="&";
            }
                str += "Barcode="+searchObject.Barcode;
        }
        if(searchObject.searchInRegion){
            if(str.length>0){
                str +="&";
            }
                str += "Lat="+searchObject.Lat;
                str += "&Lon="+searchObject.Lon;
                str += "&Delta="+searchObject.delta;
        }
        if(str.length>0)
            str = "?"+str;
        return str;
      }
      fetchAssetList(callback,searchObject){
        searchObject = searchObject || {};
        const searchString = this.createSearchString(searchObject);
        const url = BASEURL+`query.php${searchString}`;
        return this.fetchItemList(callback,url);
      }
      fetchAuditList(callback,searchObject){
        searchObject = searchObject || {}; 
        const searchString = this.createSearchString(searchObject);
        const url = BASEURL+`query.php${searchString}`;
        return this.fetchItemList(callback,url);  
      }
      async updateAssets(datain){
        console.log(datain,"tobeUploaded");
        this.uploadAssets(datain);
      
      }
      translateToTim(datain){
        return datain.map((data,cnt)=>{
            console.log("in map",cnt)
            delete data.action;
            return data;
        });
      }
      async uploadAssets(datain){
        if(!datain || datain.length <1){
          return
        }     
        const dataout= this.translateToTim(datain);
        console.log(dataout,"dataout"); 
          try{
             let response = fetch(BASEURL+`getJSon.php`,
              {
                  method: "POST", 
                  headers: {
                      'Accept': 'application/json, text/plain, */*',
                      'Content-Type': 'application/json',
                      'Authorization':`bearer ${token}`
                    },
          
                    body: JSON.stringify(dataout)
              });
              console.log(response);           
          }catch(err){
            console.error(err);
          }
        
        
      }
      createTypeObjects(data){
        return data.map((item)=>{
          return({Title:item.Title, AssetTypeId:item.AssetTypeId});
        })
      }
      async getAssetTypes(callback){
        const data = [{Title:"Office Supplies",AssetTypeId:"Office Supplies"},
        {Title:"Power Tools",AssetTypeId:"Power Tools"},
        {Title:"Vehicles",AssetTypeId:"Vehicles"},
        {Title:"Maintenance",AssetTypeId:"Maintenance"},];
        callback(data);
    
    
      }
      async getLocations(callback){
        callback(
          [{Title:"Norfolk Office",LocationId:"Norfolk Office"},
           {Title:"Virginia Beach Office",LocationId:"Virginia Beach Office"},
           {Title:"Hampton Office", LocationId:"Hampton Office"},
           {Title:"Pourtsmouth Office",LocationId:"Portsmouth Office"}
          ]
          );

      }
        
}