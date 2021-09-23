export const arrayToMap = function (array) {
    return array.reduce((map, obj) => {
        obj.name = null;
        map.set(obj.id, obj);
        return map;
    }, new Map());
}

export const mapToArray = function (map) {
    let array = []
    map.forEach((value, key) => {
        value.id = key;
        array.push(value);
    });
    return array;
}