// Live URL to run this JS :
// http://172.26.38.57:5984/victoria/_design/uniqueUserWithCoords/_view/uniqueUserWithCoordsView?group=true

//map
function (doc) {
    if (doc.coordinates != null) {
        emit(doc.user.id, doc);
    }
}

// reduce
function (keys, values, rereduce) {
    if (rereduce) {
        return sum(values);
    } else {
        return values.length;
    }
}