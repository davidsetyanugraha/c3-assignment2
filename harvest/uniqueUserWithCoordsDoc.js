// Live URL to run this JS :
// http://172.26.38.57:5984/victoria/_design/uniqueUserWithCoords/_view/uniqueUserWithCoordsDoc

//map
function (doc) {
    if (doc.coordinates != null) {
        emit(doc.user.id, doc);
    }
}