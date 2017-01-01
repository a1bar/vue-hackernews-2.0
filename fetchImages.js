"use strict";
var firebase = require('firebase');
var request  = require('request');
var url      = require('url');
var kue      = require('kue');
var queue  = kue.createQueue({
	jobEvents: false,
	redis: process.env.REDIS_URL
});


var fetchApp = firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com'
},'fetchApp');
const api = firebase.database(fetchApp).ref('/v0');

function headReaquest(thumbUrl, callback){
	var imageUrl = `https://hnews.herokuapp.com/thumbnail/?url=${thumbUrl}`;
	// var imageUrl = `http://localhost:9000/thumbnail/?url=${thumbUrl}`;
	var options = {
		url:imageUrl,
		method:'HEAD'
	};
	request(options, function(error, response, body) {
		// console.log(JSON.stringify(response.headers));
		if(error) {
			console.log("Error: Could not screenshot:",imageUrl);
			callback();
			return;
		}
	  console.log('IMG=%s STATUS=%d CACHE=%s',imageUrl,response.statusCode, response.headers['cf-cache-status']);
		callback();
	});
}


function getNewsUrl(newsItem) {
	// var deffer = new Deferred();
  var queryRef = api.child('item').child(newsItem);
  // return it as a synchronized object
  return new Promise(function(resolve, reject) {
  	queryRef.on("value", function(snapshot) {
  		var result = snapshot.val();
  	  // console.log(result);
			if ( result && result.title.includes('[pdf]')) {
				reject(new Error('Looks like a pdf'));
			}
  		if (result && result.url) {
	  		resolve(result.url);
  		} else {
  			reject(new Error('No url detected'));
  		}
  	}, function (errorObject) {
  	  console.log("The read failed: " + errorObject.code);
  	  reject(new Error(result));
  	});
  });
}

function queScreenshot(snapshot) {
	var inewsId = snapshot.val();
	// console.log(inewsId);
	// console.log(arguments);
	getNewsUrl(inewsId).then(function(url){
		var job = queue.create('cacheImage', {url: url});
		job.removeOnComplete( true )
		.ttl(60*1000)
		// .delay(100)
		.save( function(err){
		   	if( !err ) console.log( `Job Qued ${job.id}` );
		});
	}).catch((error)=>{
		console.log(error.message);
	});
}
function flushDB(){
	var redis = require("redis"),
	    client = redis.createClient(process.env.REDIS_URL);
	client.flushall(function(err, replies){
		console.log("Flushing Redis:",err, replies);
		client.quit();
	});
}

function run(){
	console.log("running fetchImages");
	['top', 'new', 'show'].forEach(type => {
			api.child(`${type}stories`).on('child_changed', queScreenshot)
		})
	flushDB();

	queue.process('cacheImage',function(job, done){
	  console.log(`Caching : ${job.data.url}`);
	  headReaquest(job.data.url, done);
	});
}
run();
module.exports = {
	run        : run,
	getNewsUrl :getNewsUrl
};