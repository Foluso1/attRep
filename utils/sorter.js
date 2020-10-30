class Sorter {
    create(val) {
        if(!this[val]){
            this[val] = [];
        }
    }
}

module.exports = Sorter;

// { id: 5629343, firstname: "Folu", surname: "Ogunfile" }
// { id: 5629343, firstname: "Folu", surname: "May" }
// { id: 5238904, firstname: "Dele", surname: "May" }