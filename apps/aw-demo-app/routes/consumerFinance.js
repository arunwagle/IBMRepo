'use strict';

var ibmGraphSvc = require('./ibmgraph.js');

module.exports = function (app) {

  app.post('/cf/cc/createGraph', function(req, res, next) {
    var graphName = req.body.id;
    console.log("graphName=" + graphName);
    var resp = ibmGraphSvc.createGraph(graphName);
    console.log("resp=" + resp);
    return res.json(resp);
  });

  app.post('/cf/cc/createSchema', function(req, res, next) {
    var graphId = req.body.id;
    console.log("graphId=" + graphId);
    var resp = ibmGraphSvc.createSchema(graphId);
    console.log("resp=" + resp);
    return res.json(resp);
  });

  app.post('/cf/cc/startConsumer', function(req, res, next) {
    var resp = ibmGraphSvc.startConsumer();
    console.log("resp=" + resp);
    return res.json(resp);
  });

  app.post('/cf/cc/stopConsumer', function(req, res, next) {
    var resp = ibmGraphSvc.stopConsumer();
    console.log("resp=" + resp);
    return res.json(resp);
  });



}
