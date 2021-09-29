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

export const fieldSorterOptimized = function (fields) {
    var dir = [],
        i,
        l = fields.length;
    fields = fields.map(function (o, i) {
        if (o[0] === "-") {
            dir[i] = -1;
            o = o.substring(1);
        } else {
            dir[i] = 1;
        }
        return o;
    });

    return function (a, b) {
        for (i = 0; i < l; i++) {
            var o = fields[i];
            if (a[o] > b[o]) return dir[i];
            if (a[o] < b[o]) return -dir[i];
        }
        return 0;
    };
}

export const objectsEqual = (o1, o2) => {
    var objectsAreSame = true;
    for (var propertyName in o1) {
        if (o1[propertyName] !== o2[propertyName]) {
            objectsAreSame = false;
            break;
        }
    }
    return objectsAreSame;
};

export const arraysObjEqual = function (a1, a2) {
    return (a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx])));
};

export const getCookie = function (allCookies, index) {
    return allCookies.split('; ')
        .find(row => row.startsWith(index + '='))
        .split('=')[1];
}

export const wait = function (milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, milliseconds)
    })
}

export const proxyToStructure = data => {
    return JSON.parse(
        JSON.stringify({
          data
        })
      )
}