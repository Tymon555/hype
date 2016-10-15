var express = require('express');
var json = require('jsonfile')
var app = express();

app.get('/test/', function (req, res) {
	res.send("success")
});

app.get('/hypeit/', function (req, res) {
	var key = req.query.key;
	var id = getUserIdFromKey(key)
	var user = getUser(id)
	if (user != null) {
		user.hype = {
			time: getTime(),
			location: req.query.location
		}
		updateUser(user)
		res.send("success")
	} else {
		res.send("error")
	}
});

app.get('/gethype/', function (req, res) {

});

app.get('/newuser/', function (req, res) {
	var user = {
		userId: 1,
		key: getKeyFromUserId(1),
		hype: {
			time: 0,
			location: ""
		}
	}
	var file = __dirname + '/userdata/data.json'
	try {
    	var userData = getUserData();
		if (userData == null) {
			userData = []
		}
		user.userId = userData.length + 1
		user.key = getKeyFromUserId(user.userId)
		userData.push(user)
		updateUserData(userData)
		res.send(user.key)
	}
	catch(error) {
		console.log(error.code)
		if (error.code == "ENOENT") {
			json.writeFileSync(file, [user])
			res.send(user.key)
		} else {
			console.log(error)
			res.send("error")
		}
	}
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

function getUser(userId) {
	var user = null
	var userData = getUserData()
	if (userData != null) {
		for (var sUser of userData) {
			if (sUser.userId == userId) {
				user = sUser
				break
			}
		}
	}
	return user
}

function getUserData() {
	var userData
	try {
		userData = json.readFileSync(__dirname + '/userdata/data.json')
		if (userData == undefined) {
			userData = []
		}
	}
	catch (error) {
		console.log("Error reading user data: " + error)
		userData = null
	}
	return userData
}

function updateUser(user) {
	var userData = getUserData()
	if (userData != null) {
		for (var sUser of userData) {

			if (sUser.userId == user.userId) {
				sUser.hype = user.hype
			}
		}
	}
	updateUserData(userData)
}

function updateUserData(newUserData) {
	json.writeFileSync(__dirname + '/userdata/data.json', newUserData)
}

function getKeyFromUserId(userId) {
	return (36 - userId).toString(36)
}

function getUserIdFromKey(key) {
	return 36 - parseInt(key, 36)
}

function getTime() {
	return new Date().getTime() / 1000
}

function findDist(x1, y1, x2, y2) {
	var x = (x1 - x2)
	var y = (y1 - y2)
	return Math.sqrt(x * x + y * y)
}
