require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");
var command = process.argv[2];
var queryName;
var thisMovie;
var inquirer = require("inquirer");

inquirer.prompt([
  {
    type: "list",
    name: "question",
    message: "Which action would you like to do?",
    choices: ["my-tweets","spotify-this-song", "movie-this", "do-what-it-says"]
  },
  {
    type: "input",
    name: "input",
    message: "What specifically are you looking for?"
  }
]).then(function(data) {
  command = data.question;
  queryName = data.input;
  thisMovie = data.input;

  switchIt();
})
function writeTo(usingThis) {
fs.appendFile('log.txt',usingThis + "\n", (err) => {
  if (err) throw err;
  console.log('Data was appended to file!');
});
}
 function myTweets() {
    var client = new Twitter(keys.twitter); 
   client.get('statuses/user_timeline', {screen_name: 'tjbains1991'}, function(error, tweets, response) {
    if (!error) {
      for (let x = 0; x < tweets.length; x++) {
        console.log(tweets[x].created_at);
        console.log(tweets[x].text);
        writeTo(tweets[x].created_at);
        writeTo(tweets[x].text);
        
    }
  }
  });
   }
function spotifyThis() {
    var spotify = new Spotify(keys.spotify);
    if (!(queryName === undefined)) {
    } else {
      queryName = process.argv[3];
    }
     
if (queryName === undefined) {
    queryName = "the-sign-by-ace-of-base";
}
    spotify.search({ type: 'track', query: queryName }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      else {
        console.log(data.tracks.items[0].album.artists[0].name);
          console.log(data.tracks.items[0].name)
    console.log(data.tracks.items[0].album.external_urls.spotify);
    console.log(data.tracks.items[0].album.name);
    writeTo(data.tracks.items[0].album.artists[0].name);
          writeTo(data.tracks.items[0].name)
    writeTo(data.tracks.items[0].album.external_urls.spotify);
    writeTo(data.tracks.items[0].album.name);
      }
    });
}

function getMovie() {
  if (!(thisMovie === undefined)) {
  } else {
    thisMovie = process.argv[3];
  }
  if (thisMovie === undefined) {
    thisMovie = "Mr-Nobody";
  }
  request("http://www.omdbapi.com/?t=" + thisMovie + "&apikey=Trilogy", function (error, response, body) {
  // console.log('error:', error); 
  // console.log('statusCode:', response && response.statusCode); 
  var results = JSON.parse(body);
  console.log("Title: " + results.Title);
  console.log("Year: " + results.Year); 
  console.log("IMDBRating: " + results.imdbRating);
  console.log("Rotten Tomatoes: " + results.Ratings[1].Value);
  console.log("Country: " + results.Country);
  console.log("Language: " + results.Language);
  console.log("Plot: " + results.Plot);
  console.log("Actors: " + results.Actors);
  writeTo("Title: " + results.Title);
  writeTo("Year: " + results.Year); 
  writeTo("IMDBRating: " + results.imdbRating);
  writeTo("Rotten Tomatoes: " + results.Ratings[1].Value);
  writeTo("Country: " + results.Country);
  writeTo("Language: " + results.Language);
  writeTo("Plot: " + results.Plot);
  writeTo("Actors: " + results.Actors);
});
}

function getRandom() {
  fs.readFile('random.txt', "utf-8", (err, data) => {
    if (err) throw err;
    // console.log(data);
    var arry = data.split(",");
    var action = arry[0];
    command = action;
    var newArry = arry[1].split(" ").join("-").replace(/"/g, "");
    // console.log(newArry);
     queryName = newArry;
     thisMovie = newArry;
    switchIt();
   
  });
}
function switchIt() {
switch (command) {
    case "my-tweets":
    myTweets();
        break;
    case "spotify-this-song":
    spotifyThis();
    break;
    case "movie-this":
    getMovie();
    break;
    case "do-what-it-says":
    getRandom();
    default:
        break;
}
}
switchIt();