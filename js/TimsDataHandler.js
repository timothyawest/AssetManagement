export default class TimsDataHandler{

    fetchItemList(callback,auditassetid,auditasset){
        fetch("http://www.truebesttech.com/barcode/getJSon.php",
            {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: "{}"
            })
            .then(response =>{
                return response.json();
                }
            )
            .then(data => {
                callback(data);
            },
            error => console.error(error)
            );
    }
    fetchAssetList(callback){
        return fetchItemList(callback,ENTITYIDASSET,"Asset");
    }
    fetchAuditList(callback){
        return fetchItemList(callback,ENTITYIDASSETAUDIT,"AssetAudit");  
    }
    
}