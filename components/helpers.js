async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array).catch((e) => { (e) ? console.log(e) : null })
    }
}

function splitArray(arr, count) {
    let newArray = [];
    while (arr.length > 0) {
        newArray.push(arr.splice(0, count));
    }
    return newArray;
}

module.exports = {
    asyncForEach,
    splitArray
};
