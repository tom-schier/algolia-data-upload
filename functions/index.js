const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

const ALGOLIA_APP_ID = "9JSHZLXNPH";
const ALGOLIA_ADMIN_KEY = "ADMIN_KEY_HERE";
const ALGOLIA_INDEX_NAME = "airports";

admin.initializeApp(functions.config().firebase);

exports.addAirportDataToAlgolia = functions.https.onRequest((req, res) => {
    var arr = [];
    admin.firestore().collection('Airports').get().then((aps) => {
        aps.forEach((ap) => {
            let airport = ap.data();
            airport.objectID = ap.id;

            arr.push(airport);
        });

        var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
        var index = client.initIndex(ALGOLIA_INDEX_NAME);

        index.saveObjects(arr, function(err, content) {
            res.status(200).send(content);
        })
    })
})

