// Set up
var express  = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
 
// Configuration
mongoose.connect('mongodb://localhost/myapp', { useMongoClient: true })

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
 
// Models
var Player = mongoose.model('Player', {
    id: Number,
    name: String,
    price: Number,
	teamName: String
});

var Team = mongoose.model('Team',{
	id: Number,
	name: String
})
 
// Routes
 
    // Get players
    app.get('/api/players', function(req, res) {
 
        console.log("fetching players");
 
        // use mongoose to get all reviews in the database
        Player.find(function(err, players) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(players); // return all players in JSON format
			console.log(players);
        });
    });

// Get teams
    app.get('/api/teams', function(req, res) {
 
        console.log("fetching teams");
 
        // use mongoose to get all teams in the database
        Team.find(function(err, teams) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(teams); // return all teams in JSON format
			console.log(teams);
        });
    });
 
    // create player and send back all players after creation
    app.post('/api/players', function(req, res) {
		console.log("creating player "  );
		Player.find(function(err, players){
			console.log(players.length + 1);
				Player.create({
            			id : players.length + 1,
           		 	name : req.body.name,
            			price: req.body.price,
					teamName: req.body.teamName,
            			done : false
        			}, function(err, players) {
            			if (err)
                			res.send(err);
 
            // get and return all the players after you create another
            			Player.find(function(err, players) {
                			if (err)
                    			res.send(err)
                				res.json(players);
            				});
        				});
			});
        
        // create a review, information comes from request from Ionic
         
    });
    // create team and send back all teams after creation
    app.post('/api/teams', function(req, res) {
		console.log("creating team "  );
		Team.find(function(err, teams){
			console.log("teams length " + (teams.length + 1));
				Team.create({
            			id : teams.length + 1,
           		 	name : req.body.name,
            			done : false
        			}, function(err, teams) {
            			if (err)
                			res.send(err);
 
            // get and return all the players after you create another
            			Team.find(function(err, teams) {
                			if (err)
                    			res.send(err)
                				res.json(teams);
            				});
        				});
			});
        
        // create a review, information comes from request from Ionic
         
    });

    // delete a player
    app.delete('/api/players/:id', function(req, res) {
        Player.remove({
            id : req.params.id
        }, function(err, player) {
 			
        });
    });
     // delete a team
    app.delete('/api/teams/:id', function(req, res) {
        Team.remove({	
            id : req.params.id
        }, function(err, player) {
 			
        });
    });

	//get team details
app.post('/api/teams/teamdetails', function(req, res) {
		console.log("getting  team details " + req.body.teamNm );
		Player.find({ teamName:req.body.teamNm }, function(err, players){
                			if (err)
                    			res.send(err)
                				res.json(players);
        				});
			}); 
 	


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");