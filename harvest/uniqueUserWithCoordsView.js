// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//    Dading Zainal Gusti (1001261)
//    David Setyanugraha (867585)
//    Ghawady Ehmaid (983899)
//    Indah Permatasari (929578)
//    Try Ajitiono (990633)

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