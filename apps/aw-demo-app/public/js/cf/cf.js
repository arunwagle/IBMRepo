'use strict';


$(document).ready(function() {

  $('#createGraphButton').click(function() {
    console.log('Clicked create graph button' );
    var graphName = $('#ccGraphName').val().trim();
    // console.log('CC graphName=' + graphName);

    createGraph(graphName);

  });

  $('#createGraphSchemaButton').click(function() {
    console.log('Clicked create schema button' );
    var graphId = $('#ccGraphId').val().trim();
    // console.log('CC graphName=' + graphName);

    createSchema(graphId);

  });

  $('#startConsumerButton').click(function() {
    console.log('Clicked start Kafka Consumer' );
    startConsumer();

  });

  $('#stopConsumerButton').click(function() {
    console.log('Clicked stop Kafka Consumer' );
    stopConsumer();

  });


  function startConsumer(){
    $.ajax({
      url: "/cf/cc/startConsumer",
      type: "POST",
      cache: false,
      dataType: "json"
    }).success(function(data) {
      console.log(data);
    }).fail(_error);
  }

  function stopConsumer(){
    $.ajax({
      url: "/cf/cc/stopConsumer",
      type: "POST",
      cache: false,
      dataType: "json"
    }).success(function(data) {
      console.log(data);
    }).fail(_error);
  }

  function createGraph(graphName){
    $.ajax({
      url: "/cf/cc/createGraph",
      type: "POST",
      cache: false,
      contentType: "application/json",
      dataType: "json",
      data: '{"id":' + JSON.stringify(graphName) + '}'
    }).success(function(data) {
      console.log("Create Graph successful" + data);
    }).fail(_error);
  }

  function createGraph(graphName){
    $.ajax({
      url: "/cf/cc/createGraph",
      type: "POST",
      cache: false,
      contentType: "application/json",
      dataType: "json",
      data: '{"id":' + JSON.stringify(graphName) + '}'
    }).success(function(data) {
      console.log("Create Graph successful" + data);
    }).fail(_error);
  }

  function createSchema(graphId){
    $.ajax({
      url: "/cf/cc/createSchema",
      type: "POST",
      cache: false,
      contentType: "application/json",
      dataType: "json",
      data: '{"id":' + JSON.stringify(graphId) + '}'
    }).success(function(data) {
      console.log("Create Graph successful" + data);
    }).fail(_error);
  }

  function _error(error) {
    console.log(error);
  }




});
