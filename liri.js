var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
require("dotenv").config();;
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var a = process.argv[2];
var b = "";

if (a === "spotify-this-song") {
    toSpotify();
} else if (a === "my-tweets") {
    toTweets();
} else if (a === "movie-this") {
    toOMDB();
} else if (a === "do-what-it-says") {
    toDo();
}

function toSpotify() {
    argumentGet()
    spotify.search({ type: 'track', query: b }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        //console.log(JSON.stringify(data, null, 2));
        console.log("--------------------------")
        console.log("New song")
        for (var i = 0; i < data.tracks.items[0].album.artists.length; i++) {
            console.log("Artist(s) of the song:     " + data.tracks.items[0].album.artists[i].name);
        }
        console.log("The name of the song is:   " + data.tracks.items[0].name);
        console.log("The album name is:         " + data.tracks.items[0].album.name);
        if (data.tracks.items[0].preview_url != null) {
            console.log("Here is a preview URL of the song: " + data.tracks.items[0].preview_url);
        }
        console.log("--------------------------")
    });
}

function toTweets() {
    var params = { screen_name: 'HeresNothingYT' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log("--------------------------")
            console.log("My recent tweets")

            for (var i = 0; i < tweets.length; i++)
                console.log(tweets[i].text);
        }
        console.log("--------------------------")

    });
}

function toOMDB() {
    var queryUrl = "http://www.omdbapi.com/?t=" + argumentGet() + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("--------------------------")
            console.log("New movie")
            console.log("Movie Title: " + JSON.parse(body).Title)
            console.log("This move was released in: " + JSON.parse(body).Year)
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value)
            console.log("Country: " + JSON.parse(body).Country)
            console.log("Language: " + JSON.parse(body).Language)
            console.log("Movie Plot: " + JSON.parse(body).Plot)
            console.log("Actors: " + JSON.parse(body).Actors)
            console.log("--------------------------")
        }
    })
}

function toDo() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        var DataArr = data.split(",");
        b = DataArr[1];
        toSpotify();
    });
}

function argumentGet() {
    if (process.argv[3]) {
        for (var i = 3; i < process.argv.length; i++) {
            b = b + " " + process.argv[i];
            // .join instead of " ".
            return b.trim();
        }
    } else if (process.argv[2] === "do-what-it-says") {
        console.log ("You let me pick?");
    } else if (process.argv[2] === "spotify-this-song") {
        console.log ("You really want to let me pick, huh?");
        b = "The Sign, Ace of Base"
    }
     else {
        console.log("Insert another argument");
    }
}