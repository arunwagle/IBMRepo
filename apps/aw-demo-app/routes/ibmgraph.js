'use strict';

var request = require('request-promise'); /* Note: using promise-friendly lib */
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var KafkaRest = require('kafka-rest');
var kafka;

// IBMGraph Service API
var apiURL;
var username;
var password;
var baseURL;

var topicName = "topic_cf_cc_small";
var kafkaRestAPIURL;
var kafkaConsumerGroup = "console-consumer-grp-" + topicName;
var fromBeginning = true;
var consumed = 0;
var consumerConfig = {
    "format": "binary"
};
if (fromBeginning) {
    consumerConfig['auto.offset.reset'] = 'smallest';
}


// Retrieve Graph API from VCAP services
if (process.env.VCAP_SERVICES) {
  var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  console.log("Grapph vcapServices=" + JSON.stringify(vcapServices));
  var graphService = 'IBM Graph';
  if (vcapServices[graphService] && vcapServices[graphService].length > 0) {
    var tp3 = vcapServices[graphService][0];
    apiURL = tp3.credentials.apiURL;
    username = tp3.credentials.username;
    password = tp3.credentials.password;
    baseURL = apiURL.split('/g').join('');
  }

  // Message HUM Configurations
  var messagehubService = 'messagehub';
  if (vcapServices[messagehubService] && vcapServices[messagehubService].length > 0) {
    var tp3 = vcapServices[messagehubService][0];
    kafkaRestAPIURL = tp3.credentials.kafka_rest_url;
    var kafka = new KafkaRest({ 'url': kafkaRestAPIURL, 'headers': {'X-Auth-Token': 'i32mLKpYLwobWqcS1iX2qZj3WnoWxpGw2LaLAAvmJHKtBhbi'}});

  }

}

// START: Generate IBM Graph Session
var sessionToken;
var getTokenOpts = {
    method: 'GET',
    uri: baseURL + '/_session',
    auth: {user: username, pass: password},
    json: true
};

request(getTokenOpts).then(function (body) {
    sessionToken = 'gds-token ' + body['gds-token'];
})

console.log("sessionToken=" + sessionToken);
// END: Generate IBM Graph Session

// START: Create Kafka producer



// var producer = new Kafka.Producer({
//   'metadata.broker.list': 'localhost:9092',
//   'dr_cb': true
// });

// var consumer = new Kafka.KafkaConsumer({
//   'group.id': 'kafka',
//   'metadata.broker.list': kafkaBrokers,
// }, {});
//

// START: Create Graph
var createGraph=function createGraph(id){
  console.log("id=" + id);
  var graphCreateOpts = {
          method: 'POST',
          headers: {'Authorization': sessionToken},
          uri: baseURL + '/_graphs' + '/' + id,
          json: true
  };
  console.log("graphCreateOpts=" + graphCreateOpts);
  request(graphCreateOpts).then(function (body) {
      apiURL = body.dbUrl; //Update apiURL to use new graph
      return apiURL;
  }).catch(function (err) {
    return err;
  });
  return "Request to creategraph submitted successfully";
}
// END: Create Graph

// START: Create Schema
var createSchema=function createSchema(graphId){
  fs.readFileAsync('./public/json/cf/cc/graph/ccschema.json', 'utf-8').then(function (data) {
    // console.log('data= : ' + data);
    // JSON.parse(data.toString())
      //Now send the request to IBM Graph
      var postSchemaOpts = {
          method: 'POST',
          headers: {'Authorization': sessionToken},
          uri: baseURL + "/" + graphId + "/" + '/schema',
          json: JSON.parse(data.toString())
      };
      return request(postSchemaOpts);
    }).then(function (body) {
      console.log('Successfully created schema and here is the response : ' +
          JSON.stringify(body));
  });
  return "Request to createSchema submitted successfully";
}
// END: Create Schema

// START: Start Consumer
var kafka_consumer_instance;
var startConsumer=function startConsumer(){
  kafka.consumer(kafkaConsumerGroup).join(consumerConfig, function(err, consumer_instance) {
      if (err) return console.log("Failed to create instance in consumer group: " + err);
      kafka_consumer_instance = consumer_instance;
      console.log("kafka_consumer_instance: " + consumer_instance.toString());
      console.log("Consumer instance initialized: " + consumer_instance.toString());
      var stream = consumer_instance.subscribe(topicName);
      stream.on('data', function(msgs) {
          for(var i = 0; i < msgs.length; i++) {
              if (consumerConfig.format == "binary") {
                  // Messages keys (if available) and values are decoded from base64 into Buffers. You'll need to decode based
                  // on whatever serialization format you used. By default here, we just try to decode to text.
                  console.log(msgs[i].value.toString('utf8'));
                  // Also available: msgs[i].key, msgs[i].partition
              } else {
                  console.log(JSON.stringify(msgs[i].value));
              }
          }

          consumed += msgs.length;
          // if (messageLimit !== undefined && consumed >= messageLimit)
          //     consumer_instance.shutdown(logShutdown);
      });
      stream.on('error', function(err) {
          console.log("Consumer instance reported an error: " + err);
          console.log("Attempting to shut down consumer instance...");
          consumer_instance.shutdown(logShutdown);
      });
      stream.on('end', function() {
          console.log("Consumer stream closed.");
      });

      // Events are also emitted by the parent consumer_instance, so you can either consume individual streams separately
      // or multiple streams with one callback. Here we'll just demonstrate the 'end' event.
      consumer_instance.on('end', function() {
          console.log("Consumer instance closed.");
      });

      // Also trigger clean shutdown on Ctrl-C
      process.on('SIGINT', function() {
          console.log("Attempting to shut down consumer instance...");
          consumer_instance.shutdown(logShutdown);
      });

  });
  return "Request to startConsumer submitted";
}
// END: Start Consumer

// START: Start Consumer
var stopConsumer=function stopConsumer(){
  if(kafka_consumer_instance !== undefined){
    kafka_consumer_instance.shutdown(logShutdown);
  }
  return "Request to stopConsumer submitted";
}

function logShutdown(err) {
    if (err)
        console.log("Error while shutting down: " + err);
    else
        console.log("Shutdown cleanly.");
}

// END: Start Consumer

// module.exports.createSession=createSession;
module.exports.createGraph=createGraph;
module.exports.createSchema=createSchema;
module.exports.startConsumer=startConsumer;
module.exports.stopConsumer=stopConsumer;



// var instance = {
//     "credentials": {
//       "apiURL": "https://ibmgraph-alpha.ng.bluemix.net/bc351dba-cead-4e5f-a0b4-6f316572280b",
//       "username": "fe911750-1124-4820-a922-88a4755f208e",
//       "password": "12967e1e-6720-442c-a190-32db06707fc0"
//     }
// };
// var GDS = require('ibm-graph-client');
// var g = new GDS(instance.credentials);
// g.session(function(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     g.config.session = data;
//     console.log("Your session token is " + data);
//   }
// });
// END: IBM GRAPH INIT
