//map vs filter
let data = [10,20,30,40,50, 55,65,75,85]

let mapArr = data.map((each) => each % 2 != 0);
console.log(mapArr)

let filterArr = data.filter((each) => each % 2 !== 0)
console.log(filterArr)