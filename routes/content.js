var mongo = require('mongodb'),
  BSON = mongo.BSONPure,
  server = new mongo.Server('localhost', 27017, {auto_reconnect: true}),
  db = new mongo.Db('abc_radio', server),
  collectionName = 'content';

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to abc_radio");
    db.collection(collectionName, {strict: true}, function (err, collection) {
      if (err) {
        console.log(collectionName, "does not exist.")
      }
    });
  }
});

exports.findByProgramDate = function(req, res) {
  var networkId = req.params.networkId,
    airportCode = req.params.airportCode,
    date = req.params.date;
    console.log("Looing for network/air/date: ", networkId, airportCode, date);
  db.collection(collectionName, function (err, collection) {
    collection.find({
      'network': networkId,
      'program': airportCode,
      'txdate': date
    }).toArray(function (err, items) {
      res.send(items);
    });
  });
};

exports.findByProgramDateTime = function(req, res) {
  var networkId = req.params.networkId,
    airportCode = req.params.airportCode,
    date = req.params.date,
    time = req.params.time;
    console.log("Looing for network/air/date/time: ", networkId, airportCode, date, time);
  db.collection(collectionName, function (err, collection) {
    collection.find({
      'network': networkId,
      'program': airportCode,
      'txdate': date,
      'txtime': time
    }).toArray(function (err, items) {
      res.send(items);
    });
  });
};

exports.findById = function(req, res) {
  var id = req.params.id;
  console.log("Find", collectionName, id);

  db.collection(collectionName, function(err, collection) {
    collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
      res.send(item);
    });
  })
};

exports.add = function(req, res) {
  var obj = req.body;
  console.log('Adding', collectionName, JSON.stringify(obj));
  db.collection(collectionName, function(err, collection) {
    collection.insert(obj, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('Added', JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });
}

exports.update = function(req, res) {
  var id = req.params.id;
  var obj = req.body;
  console.log('Updating', collectionName, id);
  console.log(JSON.stringify(obj));
  db.collection(collectionName, function(err, collection) {
    collection.update({'_id': new BSON.ObjectID(id)}, obj, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating', collectionName, err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log(result, 'document(s) updated');
        res.send(obj);
      }
    });
  });
}

exports.remove = function(req, res) {
  var id = req.params.id;
  console.log('Deleting', collectionName, id);
  db.collection(collectionName, function(err, collection) {
    collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred - ' + err});
      } else {
        console.log(result, 'document(s) deleted');
        res.send(req.body);
      }
    });
  });
}