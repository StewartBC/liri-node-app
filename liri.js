require("dotenv").config();

var fs = require("fs");
var request = require("request");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var params = { screen_name: "Stewart81679024" };
var song = "Sirens of the Sea";
var movie = "Princess Mononoke";

var append = function(item) {
    fs.appendFile("./log.txt", item, function(err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("-----------------------------------------------------------------------------");
          console.log("Your search has been logged to log.txt");
        } 
      });
}

var omdb = function () {
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (err, response, body) {
        if (!err && response.statusCode === 200) {
            var appendThis = "---------- Movie ----------\n";
            console.log("Movie title: " + JSON.parse(body).Title);
            appendThis+= "Movie title: " + JSON.parse(body).Title + "\n";
            console.log("Release year: " + JSON.parse(body).Year);
            appendThis+= "Release year: " + JSON.parse(body).Year + "\n";
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            appendThis+= "IMDB rating: " + JSON.parse(body).imdbRating + "\n";
            console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            appendThis+= "Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value + "\n";
            console.log("Country of production: " + JSON.parse(body).Country);
            appendThis+= "Country of production: " + JSON.parse(body).Country + "\n";
            console.log("Language: " + JSON.parse(body).Language);
            appendThis+= "Language: " + JSON.parse(body).Language + "\n";
            console.log("Plot: " + JSON.parse(body).Plot);
            appendThis+= "Plot: " + JSON.parse(body).Plot + "\n";
            console.log("Actors: " + JSON.parse(body).Actors);
            appendThis+= "Actors: " + JSON.parse(body).Actors + "\n\n";
            append(appendThis);
        }
    })
    setTimeout(function() {
        ask();
    }, 3000)
}

var tweets = function () {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error && response.statusCode === 200) {
            var appendThis = "---------- Tweets ----------\n";
            for (i = 1; i < 21; i++) {
                console.log("Tweet #" + i + ": ");
                appendThis+= "Tweet #" + i + ": \n";
                console.log(tweets[i - 1].text);
                appendThis+= tweets[i - 1].text + "\n";
                console.log("Created at: " + tweets[i - 1].created_at + "\n");
                appendThis+= "Created at: " + tweets[i - 1].created_at + "\n";
                if (i !== 20) {
                console.log("-----------------------------------------------------------------------------");
                }
            }
            appendThis+="\n";
            append(appendThis);
        }
    });
    setTimeout(function() {
        ask();
    }, 3000)
}

var getSong = function () {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (!err) {
            var appendThis = "---------- Song ----------\n";
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
            appendThis+= "Artist(s): " + data.tracks.items[0].artists[0].name + "\n";
            console.log("Song name: " + data.tracks.items[0].name);
            appendThis+= "Song name: " + data.tracks.items[0].name + "\n";
            console.log("Album name: " + data.tracks.items[0].album.name);
            appendThis+= "Album name: " + data.tracks.items[0].album.name + "\n";
            console.log("Preview: " + data.tracks.items[0].preview_url);
            appendThis+= "Preview: " + data.tracks.items[0].preview_url + "\n\n";
            append(appendThis);
        }
    });
    setTimeout(function() {
        ask();
    }, 3000)
}

var ask = function () {
    params = { screen_name: "Stewart81679024" };
    song = "Sirens of the Sea";
    movie = "Princess Mononoke";
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to search for?",
            choices: ["a movie", "a song", "tweets", "random"],
            name: "choice"
        }
    ]).then(function (answer) {
        if (answer.choice === "a movie") {
            inquirer.prompt([
                {
                    message: "What movie would you like to search for?",
                    name: "movieChoice"
                }
            ]).then(function(movieAnswer) {

                movie = movieAnswer.movieChoice;
                omdb();
            })
        } else if (answer.choice === "a song") {
            inquirer.prompt([
                {
                    message: "What song would you like to search for?",
                    name: "songChoice"
                }
            ]).then(function(songAnswer) {
                song = songAnswer.songChoice;
                getSong();
            })
        } else if (answer.choice === "tweets") {
            inquirer.prompt([
                {
                    message: "What Twitter account would you like to search for?",
                    name: "twitterChoice"
                }
            ]).then(function(twitterAnswer) {
                params.screen_name = twitterAnswer.twitterChoice;
                tweets();
            })
        } else {
            var random = Math.floor(Math.random()*3 + 1);
            if (random === 1) {
                omdb();
            } else if (random === 2) {
                getSong();
            } else {
                tweets();
            }
        }
    })
}

ask();