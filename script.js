var SPEED = 0.004;
var CAMERA_LAG = 0.9;
var COLLISION = 1.1;
var BOUNCE = 0.7;
var mapscale = 5;
var VR = false;
var BOUNCE_CORRECT = 0.01;
var WALL_SIZE = 1.2;
var MOUNTAIN_DIST = 250;
var OOB_DIST = 200;
var LAPS = 3;
function MODS(){

}

var serverList = [
	{
		apiKey: "AIzaSyDVdhuxy7e5R8zdd7Qw9HvC9AFR70dLmG0",
		authDomain: "cars-realtime-database.firebaseapp.com",
		databaseURL: "https://cars-realtime-database-default-rtdb.europe-west1.firebasedatabase.app",
		projectId: "cars-realtime-database",
		storageBucket: "cars-realtime-database.firebasestorage.app",
		messagingSenderId: "992285748221",
		appId: "1:992285748221:web:64a1d3d6447a22a9ac4794"
	},
];

var database, connectedN = -1, connectedS = undefined;
for(var i = 0; i < serverList.length; i++){
	firebase.initializeApp(serverList[i], "server" + i);
	let li = i;
	let la = firebase.apps[i];
	if(i == 0){
		try{
			la.analytics();
		}catch{}
	}
    	let tm = setTimeout(function(){
    	    la.delete();
    	}, 5000);
	la.auth().signInAnonymously().then(() => {
		database = la.database();
		database.ref("/testServer").once("value", function(e){
            		clearTimeout(tm);
			if(connectedN >= 0 && connectedN > li)
				connectedS.delete();
			if(connectedN < 0 || connectedN > li){
				database = la.database();
				connectedN = li;
				connectedS = la;
			}else{
				la.delete();
			}
		}, function(e){
			la.delete();
		});
	}, function(e){
		la.delete();
	});
}

/*var config = {
	apiKey: "AIzaSyDiJsMLlix5o9XqPW1EpeBvuA15XNjlR8M",
	authDomain: "car-game-a86b9.firebaseapp.com",
	databaseURL: "https://car-game-a86b9.firebaseio.com",
	projectId: "car-game-a86b9",
	storageBucket: "car-game-a86b9.appspot.com",
	messagingSenderId: "722396856191",
	appId: "1:722396856191:web:fb5f72917856108a50e44a"
}*/


setTimeout(function(){
	document.getElementById("title").style.transform = "none";
}, 500);
setTimeout(function(){
	document.getElementsByClassName("menuitem")[0].style.transform = "none";
}, 1000);
setTimeout(function(){
	document.getElementsByClassName("menuitem")[1].style.transform = "none";
}, 1200);
setTimeout(function(){
	document.getElementsByClassName("menuitem")[2].style.transform = "none";
}, 1400);
setTimeout(function(){
	document.getElementById("mywebsitelink").style.transform = "none";
}, 1600);
setTimeout(function(){
	document.getElementById("settings").style.transform = "none";
}, 1800);
/*var connected = -1;
/*var config = {
	apiKey: "AIzaSyDiJsMLlix5o9XqPW1EpeBvuA15XNjlR8M",
	authDomain: "car-game-a86b9.firebaseapp.com",
	databaseURL: "https://car-game-a86b9.firebaseio.com",
	projectId: "car-game-a86b9",
	storageBucket: "car-game-a86b9.appspot.com",
	messagingSenderId: "722396856191"
};
firebase.initializeApp(config);
var database = firebase.database();
try{
	firebase.analytics();
}catch(e){ console.log("Analytics were blocked :("); }


database.ref("/testServer").once("value", function(e){
	if(connected < 0 || connected > 0){
		database = firebase.apps[0].database();
		connected = 0;
	}
});

config = {
	apiKey: "AIzaSyCsqpn0aTDqU8ffGVE284fmSEOTK2tOgq8",
	authDomain: "car-game-backup.firebaseapp.com",
	databaseURL: "https://car-game-backup.firebaseio.com",
	projectId: "car-game-backup",
	storageBucket: "car-game-backup.appspot.com",
	messagingSenderId: "1015722732476"
};
firebase.initializeApp(config, "backup");
database = firebase.apps[1].database();
database.ref("/testServer").once("value", function(e){
	if(connected < 0 || connected > 1){
		database = firebase.apps[1].database();
		connected = 1;
	}
});

config = {
	apiKey: "AIzaSyDNuMPH_bg8Orkndl8Md6lUh_EOS3pitGs",
	authDomain: "car-game-backup-2.firebaseapp.com",
	databaseURL: "https://car-game-backup-2-default-rtdb.firebaseio.com",
	projectId: "car-game-backup-2",
	storageBucket: "car-game-backup-2.appspot.com",
	messagingSenderId: "250860288006",
	appId: "1:250860288006:web:9df8ed3929e7fceb2d2b87"
};
firebase.initializeApp(config, "backup2");
database = firebase.apps[2].database();
database.ref("/testServer").once("value", function(e){
	if(connected < 0 || connected > 2){
		database = firebase.apps[2].database();
		connected = 2;
	}
});

config = {
	apiKey: "AIzaSyCmfz7RvzLaAo4xIxA-sH3qhXuGQZYMuvE",
	authDomain: "car-game-backup-3.firebaseapp.com",
	databaseURL: "https://car-game-backup-3-default-rtdb.firebaseio.com",
	projectId: "car-game-backup-3",
	storageBucket: "car-game-backup-3.appspot.com",
	messagingSenderId: "477326457153",
	appId: "1:477326457153:web:421821136bcc6a67f149c0"
};
firebase.initializeApp(config, "backup3");
database = firebase.apps[3].database();
database.ref("/testServer").once("value", function(e){
	if(connected < 0 || connected > 3){
		database = firebase.apps[3].database();
		connected = 3;
	}
});

config = {
	apiKey: "AIzaSyAerrEq1YUJNZnvQhZvyRa6LOS9VyhEYvs",
	authDomain: "car-game-backup-4.firebaseapp.com",
	projectId: "car-game-backup-4",
	storageBucket: "car-game-backup-4.appspot.com",
	messagingSenderId: "802151922986",
	appId: "1:802151922986:web:69b9ff0ad8778d51da7253"
};
firebase.initializeApp(config, "backup4");
database = firebase.apps[4].database();
database.ref("/testServer").once("value", function(e){
	if(connected < 0 || connected > 4){
		database = firebase.apps[4].database();
		connected = 4;
	}
}); */

if(top != self) {
	document.getElementById("warning").style.display = "block";
}

function forceScroll(){
	requestAnimationFrame(forceScroll);
	window.scrollTo(0, 0);
}
forceScroll();

//var database = firebase.database();

var camera, renderer, scene, renderer2, scene2, labels = [];
scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
var mobile = navigator.userAgent.match("Mobile")!=null||navigator.userAgent.match("Linux;")!=null;
if(!mobile){
	renderer.shadowMap.enabled = false;
	renderer.shadowMap.autoUpdate = false;
	renderer.shadowMap.needsUpdate = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById("cardboard").className += " disabled";
	console.log(mobile);
}
var element = renderer.domElement;

function toggleFullScreen() {
	var doc = window.document;
	var docEl = doc.documentElement;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
		requestFullScreen.call(docEl);
	}
	else {
		cancelFullScreen.call(doc);
	}
	window.scrollTo(0,1);
}

var name, code, players = {}, me = {}, gameStarted = false, gameSortaStarted = false, left = false, right = false, lap, leaderboard;
var finishBanner, finishBannerQueue = [], finishBannerShowing = false, announcedFinishes = {};
var myFinishTime = null, spectating = false, spectateIds = [], spectateIndex = 0;
var spectatorUI, spectatorArrows, eyeBadge, eyeCountListenerRef = null, mySpectateTargetId = null;
var resultsStartTime = null, resultsMode = false, resultsOverlay, finalStandings;
var raceStartTime = null, raceTimerEl, announcedLastLap = {};
var carPos = [
	{x: 0, y: 0},
	{x: 2, y: 0},
	{x: -2, y: 0},
	{x: 0, y: -3},
	{x: -2, y: -3},
	{x: 2, y: -3},
	{x: 0, y: -6},
	{x: 2, y: -6},
	{x: -2, y: -6},
	{x: 0, y: -9},
	{x: 2, y: -9},
	{x: -2, y: -9},
	{x: 0, y: -12},
	{x: -2, y: -12},
	{x: 2, y: -12},
	{x: 0, y: -15},
	{x: 2, y: -15},
	{x: -2, y: -15}
];
color = Math.floor(Math.random() * 360);
var f = document.getElementById("fore");
var s = document.getElementById("slider");
updateColor = function(){
	s.style.marginLeft = color / 360 * 80 + "vw";
	s.style.backgroundColor = "hsl(" + color + ", 100%, 50%)";
	document.body.style.backgroundColor = "hsl(" + color + ", 50%, 50%)";
}
updateColor();

menu2 = function(){
	if(mobile){
		function reactOrientation(e){
			var angle = screen.orientation.type == "portrait-primary" ? e.gamma : screen.orientation.type == "portrait-secondary" ? -e.gamma : screen.orientation.type == "landscape-primary" ? e.beta : screen.orientation.type == "landscape-secondary" ? -e.beta : 0;
			me.data.steer = Math.max(Math.min((-angle) / 180 * Math.PI, Math.PI / 6), -Math.PI / 6);
		}

		if(DeviceOrientationEvent.requestPermission){
			DeviceOrientationEvent.requestPermission("The game needs to access phone tilt so you can steer your car.").then(permissionState => {
				if (permissionState === 'granted')
					window.addEventListener('deviceorientation', reactOrientation);
				else
					alert("Permission denied");
			}).catch(alert);
    		}else{
			window.addEventListener('deviceorientation', reactOrientation);
		}
	}
	if(document.getElementById("name").value == "")
		name = "Nerd with No Name";
	else
		name = document.getElementById("name").value;
	VR = document.getElementById("cardboard").className == "tools sel";
	f.style.transform = "translate3d(0, -100vh, 0)";
	setTimeout(function(){
		f.innerHTML = "<div class='menuitem title button' id='host' ontouchstart='this.click()' onclick='host()'>Host a game</div><div class='menuitem title button' ontouchstart='this.click()' id='join' onclick='joinGame()'>Join a game</div>";
		f.style.transform = "none";
		setTimeout(function(){
			document.getElementById("host").style.transform = "none";
			setTimeout(function(){
				document.getElementById("host").style.transition = "transform .2s, box-shadow .2s";
			}, 500);
		}, 500);
		setTimeout(function(){
			document.getElementById("join").style.transform = "none";
			setTimeout(function(){
				document.getElementById("join").style.transition = "transform .2s, box-shadow .2s";
			}, 500);
		}, 1000);
	}, 500);
}

host = function(){
	document.getElementById("host").onclick = null;
	f.style.transform = "translate3d(0, -100vh, 0)";
	setTimeout(function(){
		f.innerHTML = "<div class='info title'>Use this code to join the game!<div id='code'>Loading...</div></div><div id='startgame' class='title' onclick='startGame()' ontouchstart='this.click()'>Start!</div>";
		if(VR)
			f.innerHTML += "<div id='divider'></div>";
		f.appendChild(element);
		f.style.transform = "none";
		getCode();
	}, 1000);

	function getCode(){
		code = "";
		var letters = "ABCDEFGHIJKLMMNOPQRSTUVWXYZ";
		for(var i = 0; i < 4; i++)
			code += letters[Math.floor(Math.random() * letters.length)];
		database.ref(code).once("value", function(codeCheck){
			console.log(codeCheck.val());
			if(codeCheck.val() == null || codeCheck.val().status == -1 || !codeCheck.val().timestamp || Date.now() - codeCheck.val().timestamp > 1000 * 60 * 60 * 24){ // Allow overwriting a game if it was created more than 24 hours ago - seems safe.
				console.log(code);
				document.getElementById("code").innerHTML = code;

				database.ref(code).set({
					status: 0,
					players: {},
					map: document.getElementById("trackcode").innerHTML,
					timestamp: Date.now()
				});

				database.ref(code + "/players").on("child_added", function(p){
					console.log(p);
					players[p.ref_.path.pieces_[2]] = {
						data: p.val(),
						model: new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 2))
					};
					var pl = players[p.ref_.path.pieces_[2]];
					pl.model.position.set(pl.data.x, 0.6, pl.data.y);
					pl.model.material = new THREE.MeshLambertMaterial({color: new THREE.Color("hsl(" + pl.data.color + ", 100%, 50%)")});
					var wheel = new THREE.Mesh(
						new THREE.CylinderBufferGeometry(0.5, 0.5, 0.2, 10),
						new THREE.MeshLambertMaterial({color: new THREE.Color("#222")})
					);
					var w1 = wheel.clone();
					w1.position.set(0.6, -0.1, 0.7);
					w1.rotation.set(Math.PI / 2, 0, Math.PI / 2);
					pl.model.add(w1);
					var w2 = wheel.clone();
					w2.position.set(-0.6, -0.1, 0.7);
					w2.rotation.set(Math.PI / 2, 0, Math.PI / 2);
					pl.model.add(w2);
					var w3 = wheel.clone();
					w3.position.set(0.6, -0.1, -0.7);
					w3.rotation.set(Math.PI / 2, 0, Math.PI / 2);
					pl.model.add(w3);
					var w4 = wheel.clone();
					w4.position.set(-0.6, -0.1, -0.7);
					w4.rotation.set(Math.PI / 2, 0, Math.PI / 2);
					pl.model.add(w4);
					var label = document.createElement("DIV");
					label.className = "label";
					label.innerHTML = pl.data.name.replaceAll("<", "&lt;") + "<br/>|";
					pl.label = label;
					label.position = pl.model.position;
					console.log(label);
					f.appendChild(label);
					labels.push(label);
					pl.model.receiveShadow = true;
					scene.add(pl.model);

					if(p.ref_.path.pieces_[2] == me.ref.path.pieces_[2]){
						me.label = pl.label;
						me.model = pl.model;
						me.label.innerHTML = "";
					}
				});

				database.ref(code + "/players").on("child_changed", function(p){
					// console.log(p);
					players[p.ref_.path.pieces_[2]].data = p.val();
				});

				me.ref = database.ref(code + "/players").push();
				me.data = {
					x: 0,
					y: 0,
					xv: 0,
					yv: 0,
					dir: 0,
					steer: 0,
					color: color,
					name: name,
					checkpoint: 0,
					lap: 0,
					collision: {}
				}
				me.ref.set(me.data);

				database.ref(code + "/status").on("value", function(v){
					v = v.val();
					if(v == 1){
						document.getElementsByClassName("info")[0].outerHTML = "";
						document.getElementById("startgame").outerHTML = "";

						gameStarted = true;
						gameSortaStarted = true;

						var countDown = document.createElement("DIV");
						countDown.innerHTML = "3";
						countDown.className = "title";
						countDown.id = "countdown";
						f.appendChild(countDown);

						lap = document.createElement("DIV");
						lap.innerHTML = "1/" + LAPS;
						lap.className = "title";
						lap.id = "lap";
						f.appendChild(lap);

						leaderboard = document.createElement("DIV");
						leaderboard.id = "leaderboard";
						f.appendChild(leaderboard);

						try{ createRaceHUD(f); }catch(e){ console.error("createRaceHUD error:", e); }

						setTimeout(function(){
							countDown.innerHTML = "2";
						}, 1000);

						setTimeout(function(){
							countDown.innerHTML = "1";
						}, 2000);

						setTimeout(function(){
							countDown.innerHTML = "GO!";
							gameSortaStarted = false;
							raceStartTime = Date.now();
						}, 3000);

						setTimeout(function(){
							countDown.innerHTML = "";
						}, 4000);
					}
				});
			}else
				getCode();
		});
	}

	join();
}

joinGame = function(){
	document.getElementById("join").onclick = null;
	f.style.transform = "translate3d(0, -100vh, 0)";
	setTimeout(function(){
		f.innerHTML = "<div class='info title'>Enter a code to join a game!<input id='incode' class='title' onkeyup='codeCheck(event)' ontouchstart='this.focus()'></input></div>";
		if(VR)
			f.innerHTML += "<div id='divider'></div>";
		f.appendChild(element);
		f.style.transform = "none";
	}, 1000);
	join();
}

var map, trees, signs, startc, main;

function deleteMap(){
	while(map.children.length > 0)
		map.remove(map.children[0]);
	scene.remove(map);
	while(trees.children.length > 0)
		trees.remove(trees.children[0]);
	scene.remove(trees);
	while(signs.children.length > 0)
		signs.remove(signs.children[0]);
	scene.remove(signs);
	while(startc.children.length > 0)
		startc.remove(startc.children[0]);
	scene.remove(startc);
	while(main.children.length > 0)
		main.remove(main.children[0]);
	scene.remove(main);
}

function loadMap(){
	var racedata = document.getElementById("trackcode").innerHTML.trim().split("|")[0].trim().split(" ");
	var material = new THREE.MeshLambertMaterial({color: new THREE.Color(0xf48342)});
	//var mapscale = 7;
	map = new THREE.Object3D();
	for(var i = 0; i < racedata.length; i++){
		if(racedata[i] == "")
			continue;
		var point1 = new THREE.Vector2(parseInt(racedata[i].split("/")[0].split(",")[0]), parseInt(racedata[i].split("/")[0].split(",")[1]));
		var point2 = new THREE.Vector2(parseInt(racedata[i].split("/")[1].split(",")[0]), parseInt(racedata[i].split("/")[1].split(",")[1]));
		var wall = new THREE.Mesh(
			new THREE.BoxBufferGeometry(point1.distanceTo(point2) * mapscale + 0.3, 1.5, 0.3),
			material
		);
		var angle = Math.atan2((point1.y - point2.y), (point1.x - point2.x));
		wall.position.set(-(point1.x + point2.x) / 2 * mapscale, 0.75, (point1.y + point2.y) / 2 * mapscale);
		wall.rotation.set(0, angle, 0, "YXZ");
		var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle));
		wall.plane = plane;
		wall.width = point1.distanceTo(point2) * mapscale;
		wall.p1 = point1.multiply(new THREE.Vector2(-mapscale, mapscale));
		wall.p2 = point2.multiply(new THREE.Vector2(-mapscale, mapscale));
		wall.castShadow = true;
		wall.receiveShadow = true;
		map.add(wall);
	}
	scene.add(map);

	trees = new THREE.Object3D();
	var tree = new THREE.Mesh(
		new THREE.CylinderBufferGeometry(0, 4, 15),
		new THREE.MeshLambertMaterial({color: new THREE.Color("#1bad2c")})
	);
	var treedata = document.getElementById("trackcode").innerHTML.trim().split("|")[2].trim().split(" ");
	for(var i = 0; i < treedata.length; i++){
		if(treedata[i] == "")
			continue;
		var t = tree.clone();
		t.position.set(-parseInt(treedata[i].split(",")[0]) * mapscale, 0, parseInt(treedata[i].split(",")[1]) * mapscale);
		var s = Math.random() + 1;
		t.scale.set(s, s, s);
		t.castShadow = true;
		t.receiveShadow = true;
		trees.add(t);
	}
	scene.add(trees);

	signs = new THREE.Object3D();
	var sign = new THREE.Mesh(
		new THREE.ConeBufferGeometry(0.7, 2, 5),
		new THREE.MeshLambertMaterial({color: new THREE.Color("#f00")})
	);
	var signdata = document.getElementById("trackcode").innerHTML.trim().split("|")[3].trim().split(" ");
	for(var i = 0; i < signdata.length; i++){
		if(signdata[i] == "")
			continue;
		var s = sign.clone();
		var da = signdata[i].split("/");
		s.position.set(-parseFloat(da[0].split(",")[0]) * mapscale, parseFloat(da[0].split(",")[1]) + 1, parseFloat(da[0].split(",")[2]) * mapscale);
		s.rotation.set(Math.PI / 2, parseInt(da[1]) / 180 * Math.PI, 0, "YXZ");
		s.castShadow = true;
		s.receiveShadow = true;
		signs.add(s);
	}
	scene.add(signs);

	var startdata = document.getElementById("trackcode").innerHTML.trim().split("|")[1].trim().split(" ");
	startc = new THREE.Object3D();
	for(var i = 0; i < startdata.length; i++){
		if(startdata[i] == "")
			continue;
		var point1 = new THREE.Vector2(parseInt(startdata[i].split("/")[0].split(",")[0]), parseInt(startdata[i].split("/")[0].split(",")[1]));
		var point2 = new THREE.Vector2(parseInt(startdata[i].split("/")[1].split(",")[0]), parseInt(startdata[i].split("/")[1].split(",")[1]));
		var wall = new THREE.Mesh(
			new THREE.BoxBufferGeometry(point1.distanceTo(point2) * mapscale, 0.1, 1),
			new THREE.MeshLambertMaterial({color: new THREE.Color(i == 0 ? "#2580db" : "#db2525")})
		);
		var angle = Math.atan2((point1.y - point2.y), (point1.x - point2.x));
		wall.position.set(-(point1.x + point2.x) / 2 * mapscale, 0, (point1.y + point2.y) / 2 * mapscale);
		wall.rotation.set(0, angle, 0, "YXZ");
		var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle));
		wall.plane = plane;
		wall.width = point1.distanceTo(point2) * mapscale;
		wall.castShadow = true;
		wall.receiveShadow = true;
		startc.add(wall);
	}
	scene.add(startc);

	main = new THREE.Object3D();

	var stripes = new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQYV2NgYGD4z/D/////AA/6BPwHejn9AAAAAElFTkSuQmCC");
	stripes.magFilter = THREE.NearestFilter;
	stripes.wrapS = THREE.RepeatWrapping;
	stripes.wrapT = THREE.RepeatWrapping;
	stripes.repeat.set(100, 100);
	var ground = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(1000, 1000),
		new THREE.MeshLambertMaterial({color: new THREE.Color(0x57c115), emissive: new THREE.Color(0x0f0f0f), emissiveMap: stripes})
	);
	ground.rotation.set(-Math.PI / 2, 0, 0);
	ground.receiveShadow = true;
	main.add(ground);

	for(var i = 0; i < 100; i++){
		var cube = new THREE.Mesh(
			new THREE.BoxBufferGeometry(100, 100, 100),
			new THREE.MeshLambertMaterial({color: new THREE.Color("#888"), side: THREE.DoubleSide})
		);
		var dist = Math.random() * MOUNTAIN_DIST + MOUNTAIN_DIST;
		var dir = Math.random() * Math.PI * 2;
		cube.position.set(dist * Math.sin(dir), 0, dist * Math.cos(dir));
		cube.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
		main.add(cube);
	}
	scene.add(main);

	return document.getElementById("trackcode").innerText.trim().split("|")[4];
}

function createRaceHUD(container){
	console.log("createRaceHUD: iniciando");

	raceTimerEl = document.createElement("DIV");
	raceTimerEl.id = "raceTimer";
	raceTimerEl.innerHTML = "00:00.00";
	container.appendChild(raceTimerEl);

	finishBanner = document.createElement("DIV");
	finishBanner.id = "finishBanner";
	container.appendChild(finishBanner);

	// Eye badge: only shows to the player being watched, count of people watching THEM.
	// Independent of spectatorUI, visible any time someone is watching you (racing, celebrating, or spectating others).
	eyeBadge = document.createElement("DIV");
	eyeBadge.id = "eyeBadge";
	eyeBadge.style.display = "none";
	eyeBadge.innerHTML = "<span class='eye-icon'>\uD83D\uDC41</span><span id='eyeCount'>0</span>";
	container.appendChild(eyeBadge);

	// Spectator controls: arrows + name of who you're currently watching.
	spectatorUI = document.createElement("DIV");
	spectatorUI.id = "spectatorUI";
	spectatorUI.innerHTML =
		"<button id='spectatePrev' class='spectate-arrow spectate-arrow-left'>&#10094;</button>" +
		"<button id='spectateNext' class='spectate-arrow spectate-arrow-right'>&#10095;</button>" +
		"<div id='spectateName' class='title'></div>";
	container.appendChild(spectatorUI);

	resultsOverlay = document.createElement("DIV");
	resultsOverlay.id = "resultsOverlay";
	resultsOverlay.innerHTML =
		"<div id='finalStandingsBox'>" +
			"<div class='title' id='finalStandingsTitle'>Clasificaci\u00f3n final</div>" +
			"<div id='finalStandings'></div>" +
		"</div>";
	container.appendChild(resultsOverlay);

	document.getElementById("spectatePrev").onclick = function(){ setSpectateTarget(spectateIndex - 1); };
	document.getElementById("spectateNext").onclick = function(){ setSpectateTarget(spectateIndex + 1); };

	// Listen (for our whole time in the race) to how many people are watching US, and show it only to ourselves.
	var myId = me.ref.key;
	database.ref(code + "/players/" + myId + "/spectators").on("value", function(snap){
		var count = snap.exists() ? Object.keys(snap.val()).length : 0;
		var countEl = document.getElementById("eyeCount");
		if(countEl) countEl.innerHTML = count;
		eyeBadge.style.display = count > 0 ? "flex" : "none";
	});

	console.log("createRaceHUD: terminado sin errores");
}

// Reserves an atomic finish place for the local player (1st, 2nd, 3rd...)
function formatTime(ms){
	if(ms == null || ms < 0) return "00:00.00";
	var totalCentis = Math.floor(ms / 10);
	var centis = totalCentis % 100;
	var totalSeconds = Math.floor(totalCentis / 100);
	var seconds = totalSeconds % 60;
	var minutes = Math.floor(totalSeconds / 60);
	function pad(n, len){ n = String(n); while(n.length < len) n = "0" + n; return n; }
	return pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(centis, 2);
}

function claimFinishPlace(){
	if(me.data.finishedPlace) return;
	console.log("claimFinishPlace: reclamando puesto...");
	me.data.finishedPlace = -1; // reserve locally so we don't call this twice while the transaction resolves
	database.ref(code + "/nextPlace").transaction(function(current){
		return (current || 0) + 1;
	}, function(error, committed, snapshot){
		if(error) console.error("claimFinishPlace: error de transaccion", error);
		if(committed && snapshot){
			me.data.finishedPlace = snapshot.val();
			me.data.finishTime = raceStartTime ? Date.now() - raceStartTime : null;
			myFinishTime = Date.now();
			me.ref.set(me.data);
			console.log("claimFinishPlace: puesto asignado ->", me.data.finishedPlace, "tiempo:", formatTime(me.data.finishTime));
		}else{
			console.log("claimFinishPlace: transaccion no comprometida (committed=" + committed + ")");
		}
	});
}

function queueBanner(msg){
	finishBannerQueue.push(msg);
	showNextFinishBanner();
}

function queueFinishBanner(playerName, place){
	console.log("queueFinishBanner:", playerName, place);
	queueBanner(playerName.replaceAll("<", "&lt;") + " termin\u00f3 el " + place + "\u00ba");
}

function queueLastLapBanner(playerName){
	console.log("queueLastLapBanner:", playerName);
	queueBanner("\u00a1" + playerName.replaceAll("<", "&lt;") + " le queda una vuelta!");
}

function showNextFinishBanner(){
	if(finishBannerShowing || finishBannerQueue.length == 0 || !finishBanner) return;
	finishBannerShowing = true;
	finishBanner.innerHTML = finishBannerQueue.shift();
	finishBanner.className = "show";
	setTimeout(function(){
		finishBanner.className = "";
		setTimeout(function(){
			finishBannerShowing = false;
			showNextFinishBanner();
		}, 400);
	}, 2200);
}

// Looks for any player (including ourselves) whose finish place just got confirmed and hasn't been announced yet
function checkFinishAnnouncements(){
	for(var pid in players){
		var d = players[pid].data;
		if(d && d.finishedPlace && d.finishedPlace > 0 && !announcedFinishes[pid]){
			announcedFinishes[pid] = true;
			queueFinishBanner(d.name, d.finishedPlace);
		}
	}
}

// Looks for any player who just entered their final lap and hasn't been announced yet
function checkLastLapAnnouncements(){
	for(var pid in players){
		var d = players[pid].data;
		if(d && LAPS > 1 && d.lap == LAPS - 1 && !(d.finishedPlace > 0) && !announcedLastLap[pid]){
			announcedLastLap[pid] = true;
			queueLastLapBanner(d.name);
		}
	}
}

function enterSpectatorMode(){
	if(spectating) return;
	console.log("enterSpectatorMode: entrando");
	var myId = me.ref.key;
	spectateIds = [];
	for(var pid in players){
		if(pid != myId) spectateIds.push(pid);
	}
	if(spectateIds.length == 0){
		console.log("enterSpectatorMode: no hay a quien espectar");
		return;
	}
	spectating = true;
	spectatorUI.style.display = "flex";
	document.getElementById("spectatePrev").style.display = "inline-block";
	document.getElementById("spectateNext").style.display = "inline-block";
	setSpectateTarget(0);
}

function setSpectateTarget(idx){
	if(spectateIds.length == 0) return;
	idx = ((idx % spectateIds.length) + spectateIds.length) % spectateIds.length;
	spectateIndex = idx;

	var myId = me.ref.key;

	if(mySpectateTargetId){
		database.ref(code + "/players/" + mySpectateTargetId + "/spectators/" + myId).remove();
	}

	mySpectateTargetId = spectateIds[spectateIndex];
	var spectatorRef = database.ref(code + "/players/" + mySpectateTargetId + "/spectators/" + myId);
	spectatorRef.set(true);
	spectatorRef.onDisconnect().remove();

	var targetPlayer = players[mySpectateTargetId];
	var nameEl = document.getElementById("spectateName");
	if(nameEl) nameEl.innerHTML = targetPlayer && targetPlayer.data ? targetPlayer.data.name.replaceAll("<", "&lt;") : "";
}

function stopSpectating(){
	var myId = me.ref.key;
	if(mySpectateTargetId){
		database.ref(code + "/players/" + mySpectateTargetId + "/spectators/" + myId).remove();
	}
	mySpectateTargetId = null;
	spectating = false;
	if(spectatorUI) spectatorUI.style.display = "none";
}

function checkRaceEnd(){
	if(resultsStartTime) return;
	var total = 0, finished = 0;
	for(var pid in players){
		var d = players[pid].data;
		if(!d) continue;
		total++;
		if(d.finishedPlace && d.finishedPlace > 0) finished++;
	}
	if(total > 0 && finished >= total){
		resultsStartTime = Date.now();
	}
}

function updateFinalStandings(){
	var standings = [];
	for(var pid in players){
		var d = players[pid].data;
		if(!d) continue;
		standings.push({ name: d.name, place: d.finishedPlace || 999, lap: d.lap || 0, checkpoint: d.checkpoint || 0, finishTime: d.finishTime });
	}
	standings.sort(function(a, b){
		if(a.place != b.place) return a.place - b.place;
		if(b.lap != a.lap) return b.lap - a.lap;
		return b.checkpoint - a.checkpoint;
	});
	var html = "";
	for(var i = 0; i < standings.length; i++){
		var s = standings[i];
		html += "<div class='fsrow'><span class='fspos'>" + (i + 1) + "\u00ba</span><span class='fsname'>"
			+ s.name.replaceAll("<", "&lt;").substring(0, 20) + "</span><span class='fstime'>"
			+ formatTime(s.finishTime) + "</span></div>";
	}
	if(finalStandings) finalStandings.innerHTML = html;
}

function enterResultsMode(){
	if(resultsMode) return;
	resultsMode = true;
	stopSpectating();
	finalStandings = document.getElementById("finalStandings");
	updateFinalStandings();
	resultsOverlay.style.display = "flex";
}

function join(){
	eval(loadMap());

	scene.background = new THREE.Color(0x7fb0ff);

	camera = new THREE.PerspectiveCamera(
		90,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);

	camera.position.set(0, 3, 10);
	scene.add(camera);

	var player = new THREE.Object3D();
	player.position.set(0, 0, 0);

	camera.lookAt(player.position);

	scene.add(player);

	var light = new THREE.DirectionalLight(0xffffff, 0.7);
	light.position.set(3000, 2000, -2000);
	light.castShadow = true;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	light.shadow.camera.near = 3000;
	light.shadow.camera.far = 5000;
	light.shadow.camera.top = 100;
	light.shadow.camera.bottom = -100;
	light.shadow.camera.left = -100;
	light.shadow.camera.right = 120;
	light.shadow.bias = 0.00002;
	scene.add(light);
	scene.add(new THREE.AmbientLight(0xffffff, 0.5));

	//scene.add(new THREE.AmbientLight(0x404040));

	var x = 0;
	var ray = new THREE.Raycaster();
	function toXYCoords(pos){
		pos = pos.clone();
		pos.y += 0.5;
		var vector = pos.project(camera);
		vector.x = (vector.x + 1) / 2 * window.innerWidth;
		vector.y = -(vector.y - 1) / 2 * window.innerHeight;
		return vector;
	}
	var windowsize = {x: window.innerWidth, y: window.innerHeight};

	var ray = new THREE.Raycaster();
	ray.near = 0;
	ray.far = 1;

	var ren = renderer;
	var controls;
	if(VR){
		var effect = new THREE.StereoEffect(renderer);
		effect.setSize(window.innerWidth, window.innerHeight);
		effect.setEyeSeparation(0.7);
		ren = effect;
		controls = new THREE.DeviceOrientationControls(camera);
	}


	function updateLeaderboard(){
		if(!leaderboard) return;

		var standings = [];

		for(var pid in players){
			if(me.ref && pid == me.ref.key) continue;
			var p = players[pid];
			if(!p.data) continue;
			standings.push({ name: p.data.name, lap: p.data.lap || 0, checkpoint: p.data.checkpoint || 0, finishedPlace: p.data.finishedPlace > 0 ? p.data.finishedPlace : null, isMe: false });
		}
		standings.push({ name: me.data.name, lap: me.data.lap || 0, checkpoint: me.data.checkpoint || 0, finishedPlace: me.data.finishedPlace > 0 ? me.data.finishedPlace : null, isMe: true });

		standings.sort(function(a, b){
			var af = a.finishedPlace || Infinity;
			var bf = b.finishedPlace || Infinity;
			if(af != bf) return af - bf;
			if(b.lap != a.lap) return b.lap - a.lap;
			return b.checkpoint - a.checkpoint;
		});

		var html = "";
		for(var i = 0; i < standings.length; i++){
			var s = standings[i];
			var displayLap = Math.min(s.lap, LAPS);
			html += "<div class='lbrow" + (s.isMe ? " lbme" : "") + "'>"
				+ "<span class='lbpos'>" + (i + 1) + "</span>"
				+ "<span class='lbname'>" + (s.finishedPlace ? "\uD83C\uDFC1 " : "") + s.name.replaceAll("<", "&lt;").substring(0, 20) + "</span>"
				+ "<span class='lblap'>" + displayLap + "/" + LAPS + "</span>"
				+ "</div>";
		}
		leaderboard.innerHTML = html;
	}

	var lastTime = performance.now();
	function render(timestamp) {
		requestAnimationFrame(render);
		var timepassed = timestamp - lastTime;
		lastTime = timestamp;
		var warp = timepassed / 16;
		// Cap warp so returning from a backgrounded/inactive tab (where rAF was paused)
		// can't cause a single giant physics step that tunnels through walls.
		warp = Math.min(warp, 3);

		if(gameStarted){
			if(!mobile){
				if(left)
					me.data.steer = Math.PI / 6;
				if(right)
					me.data.steer = -Math.PI / 6;
				if(!(left ^ right))
					me.data.steer = 0;
			}
			if(VR)
				me.data.steer = camera.rotation.z;
			me.data.steer = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, me.data.steer));

			players[me.ref.path.pieces_[2]].data = me.data;
			var myId = me.ref.path.pieces_[2];

			if(!gameSortaStarted){
				for(var p in players){
					var play = players[p];

					play.data.dir += play.data.steer / 10 * warp;

					play.data.xv += Math.sin(play.data.dir) * SPEED * warp;
					play.data.yv += Math.cos(play.data.dir) * SPEED * warp;

					play.data.xv *= Math.pow(0.99, warp);
					play.data.yv *= Math.pow(0.99, warp);

					play.data.x += play.data.xv * warp;
					play.data.y += play.data.yv * warp;

					play.model.position.x = play.data.x + play.data.xv;
					play.model.position.z = play.data.y + play.data.yv;
					play.model.rotation.y = play.data.dir;

					play.model.children[0].rotation.z = Math.PI / 2 - play.data.steer;
					play.model.children[1].rotation.z = Math.PI / 2 - play.data.steer;

					// function checkCubes(angle){
					// 	ray.set(play.model.position, angle);
					// 	var inter = ray.intersectObjects(blocks);
					// 	if(inter.length > 0 && inter[0].distance < 0.5){
					// 		// console.log(inter[0]);
					// 		var vel = new THREE.Vector3(play.data.xv, 0, play.data.yv);
					// 		vel.reflect(inter[0].face.normal);
					// 		play.data.xv = vel.x * 0.3;
					// 		play.data.yv = vel.z * 0.3;
					// 		play.data.x += play.data.xv;
					// 		play.data.y += play.data.yv;
					// 	}
					// }
					// checkCubes(new THREE.Vector3(0, 0, 1));
					// checkCubes(new THREE.Vector3(0, 0, -1));
					// checkCubes(new THREE.Vector3(1, 0, 0));
					// checkCubes(new THREE.Vector3(-1, 0, 0));

					for(var w in map.children){
						var wall = map.children[w];
						var posi = new THREE.Vector2(play.data.x, play.data.y);
						if(Math.abs(wall.plane.distanceToPoint(play.model.position.clone().sub(wall.position))) < WALL_SIZE){
							if(wall.position.clone().distanceTo(play.model.position) < wall.width / 2){
								var vel = new THREE.Vector3(play.data.xv, 0, play.data.yv);
								vel.reflect(wall.plane.normal);
								play.data.xv = vel.x + BOUNCE_CORRECT * wall.plane.normal.x * Math.sign(wall.plane.normal.dot(play.model.position.clone().sub(wall.position)));
								play.data.yv = vel.z + BOUNCE_CORRECT * wall.plane.normal.z * Math.sign(wall.plane.normal.dot(play.model.position.clone().sub(wall.position)));
								//var dir = Math.normalize();
								while(Math.abs(wall.plane.distanceToPoint(new THREE.Vector3(play.data.x, 0, play.data.y).sub(wall.position))) < WALL_SIZE){
									play.data.x += play.data.xv;
									play.data.y += play.data.yv;
								}
								play.data.xv *= BOUNCE;
								play.data.yv *= BOUNCE;
							}
						}
						if(posi.distanceTo(wall.p1) < WALL_SIZE + 0.1){
							// console.log("o1");
							var norm = posi.clone().sub(wall.p1);
							norm = new THREE.Vector3(norm.x, 0, norm.y);
							norm.normalize();
							var vel = new THREE.Vector3(play.data.xv, 0, play.data.yv);
							vel.reflect(norm);
							play.data.xv = vel.x + norm.x * BOUNCE_CORRECT * 1;
							play.data.yv = vel.z + norm.z * BOUNCE_CORRECT * 1;
							while((new THREE.Vector2(play.data.x, play.data.y)).distanceTo(wall.p1) < WALL_SIZE + 0.1){
								play.data.x += play.data.xv;
								play.data.y += play.data.yv;
							}
							play.data.xv *= BOUNCE;
							play.data.yv *= BOUNCE;
						}
						if(posi.distanceTo(wall.p2) < WALL_SIZE + 0.1){
							// console.log("o2");
							var norm = posi.clone().sub(wall.p2);
							norm = new THREE.Vector3(norm.x, 0, norm.y);
							norm.normalize();
							var vel = new THREE.Vector3(play.data.xv, 0, play.data.yv);
							vel.reflect(norm);
							play.data.xv = vel.x + norm.x * BOUNCE_CORRECT * 1;
							play.data.yv = vel.z + norm.z * BOUNCE_CORRECT * 1;
							while((new THREE.Vector2(play.data.x, play.data.y)).distanceTo(wall.p2) < WALL_SIZE + 0.1){
								play.data.x += play.data.xv;
								play.data.y += play.data.yv;
							}
							play.data.xv *= BOUNCE;
							play.data.yv *= BOUNCE;
						}
					}

					for(var i in startc.children){
						var cp = startc.children[i];
						var idx = parseInt(i);
						if(Math.abs(cp.plane.distanceToPoint(play.model.position.clone().sub(cp.position))) < 1){
							if(cp.position.clone().distanceTo(play.model.position) < cp.width / 2 + 1){
								var totalCheckpoints = startc.children.length - 1;
								if(idx == 0){
									// Finish/start line: only counts the lap if every checkpoint was hit, in order
									if(play.data.checkpoint >= totalCheckpoints){
										play.data.checkpoint = 0;
										play.data.lap++;
									}
								}else{
									// Checkpoint line: only advances if it's the next one expected, in order
									if(play.data.checkpoint == idx - 1){
										play.data.checkpoint = idx;
									}
								}
							}
						}
					}

					if(play.data.lap > LAPS && !play.data.finishedPlace && p == myId){
						claimFinishPlace();
					}

					for(var pl in players){
						if(play != players[pl] && play.model.position.distanceTo(players[pl].model.position) < 2){
							var ply = players[pl];
							var temp = new THREE.Vector2(play.data.xv, play.data.yv);
							var temp2 = new THREE.Vector2(ply.data.xv, ply.data.yv);
							ply.data.xv -= temp.x;
							ply.data.yv -= temp.y;
							play.data.xv -= temp2.x;
							play.data.yv -= temp2.y;
							var norm = (new THREE.Vector2(play.data.x, play.data.y)).sub(new THREE.Vector2(ply.data.x, ply.data.y));
							norm = new THREE.Vector3(norm.x, 0, norm.y);
							norm.normalize();
							var vel = new THREE.Vector3(play.data.xv, 0, play.data.yv);
							var vel2 = new THREE.Vector3(ply.data.xv, 0, ply.data.yv);
							vel.reflect(norm);
							vel2.reflect(norm);
							ply.data.xv += COLLISION * vel2.x;
							ply.data.yv += COLLISION * vel2.z;
							play.data.xv += COLLISION * vel.x;
							play.data.yv += COLLISION * vel.z;
							ply.data.xv += temp.x;
							ply.data.yv += temp.y;
							play.data.xv += temp2.x;
							play.data.yv += temp2.y;
							while((new THREE.Vector2(play.data.x, play.data.y)).distanceTo(new THREE.Vector2(ply.data.x, ply.data.y)) < 2){
								play.data.x += play.data.xv;
								play.data.y += play.data.yv;
							}
						}
					}

					if(play.model.position.distanceTo(new THREE.Vector3()) > OOB_DIST){
						play.data.x = 0;
						play.data.y = 0;
					}
				}
			}

			try{
				checkLastLapAnnouncements();
				checkFinishAnnouncements();
				checkRaceEnd();

				if(resultsStartTime && !resultsMode && Date.now() - resultsStartTime >= 3000){
					enterResultsMode();
				}
			}catch(e){
				console.error("finish/results error:", e);
			}

			if(resultsMode){
				camera.position.set(
					camera.position.x * Math.pow(CAMERA_LAG, warp) + 60 * Math.sin(x * 0.3) * (1 - Math.pow(CAMERA_LAG, warp)),
					40,
					camera.position.z * Math.pow(CAMERA_LAG, warp) + 60 * Math.cos(x * 0.3) * (1 - Math.pow(CAMERA_LAG, warp))
				);
				camera.lookAt(new THREE.Vector3(0, 0, 0));
			}else if(spectating){
				var specPlayer = players[spectateIds[spectateIndex]];
				if(specPlayer && specPlayer.model){
					var specTarget = new THREE.Vector3(
						specPlayer.model.position.x + Math.sin(-specPlayer.model.rotation.y) * 5,
						3,
						specPlayer.model.position.z + -Math.cos(-specPlayer.model.rotation.y) * 5
					);
					camera.position.set(
						camera.position.x * Math.pow(CAMERA_LAG, warp) + specTarget.x * (1 - Math.pow(CAMERA_LAG, warp)),
						3,
						camera.position.z * Math.pow(CAMERA_LAG, warp) + specTarget.z * (1 - Math.pow(CAMERA_LAG, warp))
					);
					camera.lookAt(specPlayer.model.position);
				}
			}else{
				var target = new THREE.Vector3(
					me.model.position.x + Math.sin(-me.model.rotation.y) * 5,
					3,
					me.model.position.z + -Math.cos(-me.model.rotation.y) * 5
				);
				camera.position.set(
					camera.position.x * Math.pow(CAMERA_LAG, warp) + target.x * (1 - Math.pow(CAMERA_LAG, warp)),
					3,
					camera.position.z * Math.pow(CAMERA_LAG, warp) + target.z * (1 - Math.pow(CAMERA_LAG, warp))
				);
				camera.lookAt(me.model.position);

				if(myFinishTime && !spectating && Date.now() - myFinishTime >= 3000){
					try{ enterSpectatorMode(); }catch(e){ console.error("enterSpectatorMode error:", e); }
				}
			}

			me.ref.set(me.data);

			lap.innerHTML = me.data.lap <= LAPS ? me.data.lap + "/" + LAPS : "";

			if(raceTimerEl){
				if(me.data.finishedPlace > 0 && me.data.finishTime != null){
					raceTimerEl.innerHTML = formatTime(me.data.finishTime);
				}else if(raceStartTime){
					raceTimerEl.innerHTML = formatTime(Date.now() - raceStartTime);
				}
			}
			updateLeaderboard();
		}else{
			camera.position.set(50 * Math.sin(x), 20, 50 * Math.cos(x));
			camera.lookAt(player.position);
		}

		x += 0.01;

		camera.updateMatrix();
		camera.updateMatrixWorld();
		camera.updateProjectionMatrix();
		var frustum = new THREE.Frustum();
		frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
		for(var i = 0; i < labels.length; i++){
			var label = labels[i];
			if(frustum.containsPoint(label.position) && !VR){
				var vec = toXYCoords(label.position);
				label.style.left = vec.x + "px";
				label.style.top = vec.y + "px";
				label.style.zIndex = 99999 - Math.floor(camera.position.distanceTo(label.position) * 10);
				label.style.display = "inline-block";
			}else
				label.style.display = "none";
		}

		if(windowsize.x != window.innerWidth || windowsize.x != window.innerHeight){
			windowsize = {x: window.innerWidth, y: window.innerHeight};
			onWindowResize();
		}

		if(VR){
			var a = camera.rotation.y;
			controls.update();
			camera.rotation.y += a - Math.PI / 2;
		}
		ren.render(scene, camera);
		MODS();
	}

	render(performance.now());

	window.addEventListener("resize", onWindowResize, false);
	window.addEventListener("orientationchange", onWindowResize, false);

	function onWindowResize(){
		function orientCamera(){
			camera.aspect = window.innerWidth / window.innerHeight;
			renderer.setSize(window.innerWidth, window.innerHeight);
		}
		orientCamera();
		setTimeout(orientCamera, 0);
	}
}
codeCheck = function(){
	var incode = document.getElementById("incode");
	if(incode.value.length == 4){
		incode.onkeyup = null;
		code = incode.value.toUpperCase();
		database.ref(code).once("value", function(cc){
			if(typeof cc.val() != "undefined" && cc.val() != null && cc.val().status === 0){
				document.getElementsByClassName("info")[0].innerHTML = "<div class='info title'>Waiting for the game to start...<div id='code'>" + code + "</div></div>";
				var playerCount = 0;
				for(var p in cc.val().players){
					playerCount++;
					console.log(p);
					players[p] = {
						data: cc.val().players[p],
						model: new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 2))
					};
					var pl = players[p];
					pl.model.position.set(pl.data.x, 0.6, pl.data.y);
					pl.model.material = new THREE.MeshLambertMaterial({color: new THREE.Color("hsl(" + pl.data.color + ", 100%, 50%)")});
					var wheel = new THREE.Mesh(
						new THREE.CylinderBufferGeometry(0.5, 0.5, 0.2, 10),
						new THREE.MeshLambertMaterial({color: new THREE.Color("#222")})
					);
					var w1 = wheel.clone();
					w1.position.set(0.6, -0.1, 0.7);
					w1.rotation.set(Math.PI / 2, 0, Math.PI / 2);
					pl.model.add(w1);
					var w2 = wheel.clone();
					w2.position.set(-0.6, -0.1, 0.7);
					w2.rotation.set(Math.PI / 2, 0, Math.PI / 2);
					pl.model.add(w2);
					var w3 = wheel.clone();
					w3.position.set(0.6, -0.1, -0.7);
					w3.rotation.set(Math.PI / 2, 0, Math.PI / 2);
					pl.model.add(w3);
					var w4 = wheel.clone();
					w4.position.set(-0.6, -0.1, -0.7);
					w4.rotation.set(Math.PI / 2, 0, Math.PI / 2);
					pl.model.add(w4);
					var label = document.createElement("DIV");
					label.className = "label";
					label.innerHTML = pl.data.name.replaceAll("<", "&lt;").substring(0, 50) + "<br/>|";
					pl.label = label;
					label.position = pl.model.position;
					console.log(label);
					f.appendChild(label);
					labels.push(label);
					pl.model.receiveShadow = true;
					scene.add(pl.model);
				}
				database.ref(code + "/players").on("child_added", function(p){
					if(typeof players[p.ref_.path.pieces_[2]] == "undefined"){
						console.log(p);
						players[p.ref_.path.pieces_[2]] = {
							data: p.val(),
							model: new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 2))
						};
						var pl = players[p.ref_.path.pieces_[2]];
						pl.model.position.set(pl.data.x, 0.6, pl.data.y);
						pl.model.material = new THREE.MeshLambertMaterial({color: new THREE.Color("hsl(" + pl.data.color + ", 100%, 50%)")});
						var wheel = new THREE.Mesh(
							new THREE.CylinderBufferGeometry(0.5, 0.5, 0.2, 10),
							new THREE.MeshLambertMaterial({color: new THREE.Color("#222")})
						);
						var w1 = wheel.clone();
						w1.position.set(0.6, -0.1, 0.7);
						w1.rotation.set(Math.PI / 2, 0, Math.PI / 2);
						pl.model.add(w1);
						var w2 = wheel.clone();
						w2.position.set(-0.6, -0.1, 0.7);
						w2.rotation.set(Math.PI / 2, 0, Math.PI / 2);
						pl.model.add(w2);
						var w3 = wheel.clone();
						w3.position.set(0.6, -0.1, -0.7);
						w3.rotation.set(Math.PI / 2, 0, Math.PI / 2);
						pl.model.add(w3);
						var w4 = wheel.clone();
						w4.position.set(-0.6, -0.1, -0.7);
						w4.rotation.set(Math.PI / 2, 0, Math.PI / 2);
						pl.model.add(w4);
						var label = document.createElement("DIV");
						label.className = "label";
						label.innerHTML = pl.data.name.replaceAll("<", "&lt;").substring(0, 50) + "<br/>|";
						pl.label = label;
						label.position = pl.model.position;
						console.log(label);
						f.appendChild(label);
						labels.push(label);
						pl.model.receiveShadow = true;
						scene.add(pl.model);

						if(p.ref_.path.pieces_[2] == me.ref.path.pieces_[2]){
							me.label = pl.label;
							me.model = pl.model;
							me.label.innerHTML = "";
						}
					}
				});

				database.ref(code + "/players").on("child_changed", function(p){
					// console.log(p);
					players[p.ref_.path.pieces_[2]].data = p.val();
				});
				console.log("playerCount: " + playerCount);
				me.ref = database.ref(code + "/players").push();
				me.data = {
					x: carPos[playerCount].x,
					y: carPos[playerCount].y,
					xv: 0,
					yv: 0,
					dir: 0,
					steer: 0,
					color: color,
					name: name,
					checkpoint: 0,
					lap: 0,
					collision: {}
				}
				me.ref.set(me.data);

				database.ref(code + "/status").on("value", function(v){
					v = v.val();
					if(v == 1){
						document.getElementsByClassName("info")[0].outerHTML = "";

						gameStarted = true;
						gameSortaStarted = true;

						var countDown = document.createElement("DIV");
						countDown.innerHTML = "3";
						countDown.className = "title";
						countDown.id = "countdown";
						f.appendChild(countDown);

						lap = document.createElement("DIV");
						lap.innerHTML = "1/3";
						lap.className = "title";
						lap.id = "lap";
						f.appendChild(lap);

						leaderboard = document.createElement("DIV");
						leaderboard.id = "leaderboard";
						f.appendChild(leaderboard);

						try{ createRaceHUD(f); }catch(e){ console.error("createRaceHUD error:", e); }

						setTimeout(function(){
							countDown.innerHTML = "2";
						}, 1000);

						setTimeout(function(){
							countDown.innerHTML = "1";
						}, 2000);

						setTimeout(function(){
							countDown.innerHTML = "GO!";
							gameSortaStarted = false;
							raceStartTime = Date.now();
						}, 3000);

						setTimeout(function(){
							countDown.innerHTML = "";
						}, 4000);
					}
				});
				database.ref(code + "/map").once("value", function(e){
					document.getElementById("trackcode").innerHTML = e.val();
					deleteMap();
					eval(loadMap());
				});
			}else
				incode.onkeyup = codeCheck;
		});
	}else{
		incode.onkeyup = codeCheck;
		if(incode.value.length > 4)
			incode.value = incode.value.substring(0, 4);
	}
}

function startGame(){
	database.ref(code + "/status").set(1);
}

window.onkeydown = function(e){
	if(e.keyCode == 37)
		left = true;
	if(e.keyCode == 39)
		right = true;
}

window.onkeyup = function(e){
	if(e.keyCode == 37)
		left = false;
	if(e.keyCode == 39)
		right = false;
}

if(mobile){

}

document.body.onkeydown = function(e){
	if(e.keyCode == 73 && (e.ctrlKey || e.metaKey))
		document.getElementById("trackcode").innerText = prompt("Track data?")
}