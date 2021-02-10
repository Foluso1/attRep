const       moment  = require("moment")

module.exports = (fewKeys, obj2) => {
    const obj1Keys = Object.keys(fewKeys);
    const obj2Keys = Object.keys(obj2);

    for(let objKeys of obj1Keys){
        if(fewKeys[objKeys] !== obj2[objKeys]){
            return false;
        }
    }
    return true;
}