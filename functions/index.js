const functions = require('firebase-functions');
const admin = require('firebase-admin');
var GeoPoint = require('geopoint');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.addotherusers = functions.firestore.document(
    'new_users/{new_usersId}'
).onCreate((snapshot, context) => {
    var userInfo = snapshot.data();
     
    console.log("The new Users id is.............");
    console.log(userInfo.userId);
    var userLatitude = userInfo.userLatitude;
    var userlongitude = userInfo.userlongitude;

    var new_userId1 = {
        userId : userInfo.userId
    };
 

    console.log("The code reach to before users table");
    db.collection('user_info').get().then((snapshots) => {
        if (snapshots.empty) {
            console.log("Nothing in this documents");
        }
        else {
            for (var userData of snapshots.docs) {

                if (userData.data().userId == userInfo.userId) {
                    console.log("Not load this documents");
                }
                else {
                    console.log(userLatitude);
                    console.log(userlongitude);
                    console.log(userData.data().userLatitude);
                    console.log(userData.data().userlongitude);

                    point1 = new GeoPoint(parseFloat(userLatitude), parseFloat(userlongitude));
                    point2 = new GeoPoint(parseFloat(userData.data().userLatitude), parseFloat(userData.data().userlongitude));
                    var distance = point1.distanceTo(point2, true);
                    var distanceBwt = parseInt(distance, 10);
                    console.log(distanceBwt);

                    console.log("<<<<<<<<<<<<<<<<<<<<<<<<The distance calculated<<<<<<<<<<<<<<<<<<<");
                    console.log(distanceBwt);
                    console.log("??????????????????????????????????????????????????????");

                    var user_data_update = {
                        bwtDistance: distanceBwt,
                        userId: userData.data().userId,
                    };

                    
                    //console.log("The distance between you and he/she is" + bwtDistance);
                    db.collection('main_database').doc(userInfo.userId).set(new_userId1);
                    db.collection('main_database').doc(userInfo.userId).collection(userInfo.userId).doc(userData.data().userId).set(user_data_update);
                    db.collection('like_page').doc(userInfo.userId).set(new_userId1);
                }
            }
        }
    });

    console.log("Add to other users.........");
    db.collection('user_info').get().then((active_snapshot) => {
        if (active_snapshot.empty) {
            console.log("Nothing in active users documents");
        }
        else {
            for (var activeUsers of active_snapshot.docs) {

                if (activeUsers.data().userId == userInfo.userId) {
                    console.log("Not load this documents");
                }
                else {

                    point1 = new GeoPoint(parseFloat(userLatitude), parseFloat(userlongitude));
                    point2 = new GeoPoint(parseFloat(activeUsers.data().userLatitude), parseFloat(activeUsers.data().userlongitude));
                    var distance = point1.distanceTo(point2, true);
                    var distanceBwt = parseInt(distance, 10);
                    console.log(distanceBwt);

                    console.log("<<<<<<<<<<<<<<<<<<<<<<<<The distance calculated<<<<<<<<<<<<<<<<<<<");
                    console.log(distanceBwt);
                    console.log("??????????????????????????????????????????????????????");

                    var new_login_user_data = {
                        bwtDistance: distanceBwt,
                        userId: userInfo.userId,
                    };

                    var new_userId2 = {
                        userId : activeUsers.data().userId
                    };

                    db.collection('main_database').doc(activeUsers.data().userId).set(new_userId2);
                    db.collection('main_database').doc(activeUsers.data().userId).collection(activeUsers.data().userId).doc(userInfo.userId).set(new_login_user_data);
                    db.collection('like_page').doc(activeUsers.data().userId).set(new_userId2);
                    
                }

            }
        }
    });

});