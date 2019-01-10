import NovoDataHandler from './NovoDataHandler'; //handler for novo's database
import TimsDataHandler from './TimsDataHandler'; //handler to my mock up database run on php apache   

//set when logged in
//reality is this is the only way to do get sets in javascript
let loginInformation = {};

export default class DataHandler extends NovoDataHandler{
    constructor(props){
        super(props);
    }
    getLoginInformation(){
        return loginInformation;
    }

    //javascript is uable to overide methods
    getToken(data,callback){
        this._getToken(data,callback);
        loginInformation =data;
    }
}