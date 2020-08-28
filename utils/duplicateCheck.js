const       moment  = require("moment")

module.exports = (obj1_orig, arr) => {
    // Prevent users from sending duplicate reports
    let test = false;
    if (obj1_orig && arr && arr.length > 0 ) {
        // First Object
        let date_obj1 = moment(obj1_orig.date).startOf("day").format();
        obj1 = JSON.parse(JSON.stringify(obj1_orig));
        obj1._id = null;
        obj1.__v = null;
        obj1.date = null;
        //Stringify the object
        let stringify_obj1 = JSON.stringify(obj1)
        
        //Array
        for(let i = 0; i <= arr.length-1; i++) {
        let obj2 = arr[i];
            let date_obj2 = moment(obj2.date).startOf("day").format();
            obj2._id = null;
            obj2.__v = null;
            obj2.date = null;
            //Stringify the object
            let stringify_obj2 = JSON.stringify(obj2);
            console.log("Obj1", stringify_obj1)
            console.log("Obj2", stringify_obj2)
            if (date_obj1 == date_obj2 && stringify_obj1 == stringify_obj2) {
                return test = true;
            } 
        }
    } 
    return test
}