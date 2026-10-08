var SPEED = 0.004;
var CAMERA_LAG = 0.9;
var COLLISION = 1.1;
var BOUNCE = 0.7;
var mapscale = 5;
var VR = false;
var BOUNCE_CORRECT = 0.01;
var WALL_SIZE = 1.2;
var LEVEL_HEIGHT = 6; // Altura (en unidades 3D) de cada nivel del mapa multinivel
var ramps = []; // Rampas del mapa: {p1, p2 (coordenadas mundo), level}
var elevFloors = []; // Suelos de pisos elevados (hitbox): {level, cx, cz, ux, uz, hx, vx, vz, hz}
// Registra un suelo elevado con hitbox: rectángulo orientado en el plano XZ con
// centro (cx,cz), semieje X = (ux,uz)*hx (a lo largo de la pared) y semieje Z =
// (vx,vz)*hz (a lo ancho). La física lo usa para saber si el coche va sobre él.
function registerFloor(level, cx, cz, ux, uz, hx, vx, vz, hz){
	elevFloors.push({level: level, cx: cx, cz: cz, ux: ux, uz: uz, hx: hx, vx: vx, vz: vz, hz: hz});
}
var carPitch = {}; // Inclinación del coche por jugador (solo visual, no se sincroniza)
var elevGroup = null; // Mallas decorativas de los niveles (pilares, cubiertas, rampas)
var MOUNTAIN_DIST = 250;
var OOB_DIST = 200;
var LAPS = 3;
var soloLaps = 3;
var soloMode = null;
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
	la.auth().signInAnonymously().then(() => {
		// No se publica la base de datos hasta comprobar que responde. Antes se
		// asignaba aquí y un timeout de 5 s eliminaba `la` si la comprobación
		// tardaba más: los botones conservaban una referencia ya borrada.
		var candidateDatabase = la.database();
		candidateDatabase.ref("/testServer").once("value", function(e){
			if(connectedN >= 0 && connectedN > li)
				connectedS.delete();
			if(connectedN < 0 || connectedN > li){
				database = candidateDatabase;
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
var lobbyMapType = "preset", lobbyMapData = null, lobbyIsCustom = false, lobbyAllReady = false, lobbyIsHost = false, hostedRaceStarted = false, soloMode = null;
var paused = false; // pausa real en modo solitario (entrenamiento)
var originalForeHTML = document.getElementById("fore").innerHTML; // para "Salir al menú principal"
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
	// Posicionar el punto según el ancho REAL del colorpicker (min(78vw,100vmin)),
	// no un valor fijo de 80vw: así el punto coincide con el ratón y se detiene al final.
	var cp = document.getElementById("colorpicker");
	var w = cp ? cp.clientWidth : window.innerWidth;
	s.style.marginLeft = color / 360 * w + "px";
	s.style.backgroundColor = "hsl(" + color + ", 100%, 50%)";
	document.body.style.backgroundColor = "hsl(" + color + ", 50%, 50%)";
}
updateColor();
// Re-posiciona el punto al redimensionar la ventana
window.addEventListener("resize", function(){
	if(typeof color != "undefined" && s) updateColor();
}, false);

// ---- Intro: pantalla con bot\u00f3n "Iniciar juego" ---------------------------
// The black overlay (#intro) first shows an "Iniciar juego" button. Clicking
// it starts the intro video AND the music (a user click unlocks the audio,
// so no autoplay workarounds are needed). The music then keeps playing
// through the menus and only fades out when a race actually starts.
var introEl = document.getElementById("intro");
var introVideo = document.getElementById("introVideo");
var introMusic = document.getElementById("introMusic");
var introRevealed = false;
var introStarted = false;
var introMusicOn = false;   // fade-in is running
var introMusicFade = null;
var introVideoStart = null; // when the intro video started

// --- Ajustes de sonido (volumen + silencio) con memoria localStorage -----
var musicVolume = parseInt(localStorage.getItem("carsVolume") || "80");
musicVolume = isNaN(musicVolume) ? 80 : Math.max(0, Math.min(100, musicVolume));
var musicMuted = localStorage.getItem("carsMuted") == "1";

function applyMusicState(){
	if(!introMusic) return;
	// Aplica el volumen correcto: 0 si mute, o el % guardado si no.
	introMusic.volume = musicMuted ? 0 : musicVolume / 100;
	var sl = document.getElementById("volSlider");
	if(sl) sl.value = musicVolume;
	var b1 = document.getElementById("intro-mute");
	if(b1) b1.classList.toggle("muted", musicMuted);
	var b2 = document.getElementById("muteBtn");
	if(b2) b2.classList.toggle("muted", musicMuted);
}

function setVolume(v){
	musicVolume = Math.max(0, Math.min(100, parseInt(v) || 0));
	if(musicMuted) musicMuted = false;
	localStorage.setItem("carsVolume", musicVolume);
	localStorage.setItem("carsMuted", "0");
	applyMusicState();
}

function toggleMute(){
	musicMuted = !musicMuted;
	localStorage.setItem("carsMuted", musicMuted ? "1" : "0");
	applyMusicState();
}

function toggleSettings(){
	var tb = document.getElementById("toolbar");
	if(tb) tb.className = (tb.className.indexOf("sel") >= 0) ? "" : "sel";
	var sl = document.getElementById("volSlider");
	if(sl) sl.value = musicVolume;
}

function startIntroMusic(){
	if(!introMusic || introMusicOn) return;
	introMusicOn = true;
	try{
		introMusic.volume = 0;
		var p = introMusic.play();
		if(p && p.catch) p.catch(function(){});
		if(introMusicFade) clearInterval(introMusicFade);
		introMusicFade = setInterval(function(){
			// Recalcula el objetivo en cada tick para que mute/volumen se respeten durante el fade.
			var target = musicMuted ? 0 : musicVolume / 100;
			if(!introMusicOn || introMusic.volume >= target){
				clearInterval(introMusicFade);
				introMusicFade = null;
				return;
			}
			introMusic.volume = Math.min(target, introMusic.volume + 0.03);
		}, 90);
	}catch(e){}
}

function stopIntroMusic(){
	if(!introMusic) return;
	introMusicOn = false;
	try{
		if(introMusicFade) clearInterval(introMusicFade);
		var fade = setInterval(function(){
			if(!introMusic || introMusic.volume <= 0.01){
				clearInterval(fade);
				if(introMusic) introMusic.pause();
				return;
			}
			introMusic.volume = Math.max(0, introMusic.volume - 0.03);
		}, 60);
	}catch(e){}
}

function revealMenu(){
	if(introRevealed) return;
	introRevealed = true;
	if(introEl) introEl.classList.add("hidden");
	setTimeout(function(){
		if(introEl && introEl.parentNode) introEl.parentNode.removeChild(introEl);
	}, 2200);
}

// "Saltar intro": muestra el men\u00fa inmediatamente y arranca la m\u00fasica
// (el clic en el bot\u00f3n ya desbloquea el audio).
function skipIntro(){
	if(introStarted){
		try{ introVideo.pause(); }catch(e){}
	}
	revealMenu();
	startIntroMusic();
}

// Called by the "Iniciar juego" button: plays the intro video and starts the
// music with a fade-in. Because it runs inside a user gesture, the browser
// lets the audio play immediately (no autoplay blocking).
function startIntroPlay(){
	if(introStarted || introRevealed) return;
	introStarted = true;
	var startBtn = document.getElementById("intro-start");
	if(startBtn) startBtn.classList.add("hide");
	introVideoStart = Date.now();
	try{
		introVideo.muted = true;
		introVideo.currentTime = 0;
		var p = introVideo.play();
		if(p && p.catch) p.catch(function(){ revealMenu(); });
	}catch(e){ revealMenu(); }
	startIntroMusic();
}

// Preload both media so the intro never stutters, and wire up the reveal.
function runIntro(){
	if(!introEl || !introVideo || !introMusic) return;
	// Reveal at 8s from the video start (the song's beat kicks in there);
	// if the video is longer, reveal when it ends instead.
	introVideo.addEventListener("ended", function(){
		if(introVideoStart === null) return;
		var elapsed = Date.now() - introVideoStart;
		var wait = Math.max(0, 8000 - elapsed);
		setTimeout(revealMenu, wait);
	});
	// If the video can't load or play at all, never leave the player stuck
	// on a black screen: reveal the menu anyway.
	introVideo.addEventListener("error", revealMenu);
	// Safety net: only rescue if the intro was actually started (so the
	// "Iniciar juego" screen never vanishes on its own).
	setTimeout(function(){
		if(introStarted && !introRevealed) revealMenu();
	}, 20000);
}
runIntro();
applyMusicState(); // sincroniza slider/silencio con lo guardado en localStorage

// ---- Cuenta atr\u00e1s F1 (sem\u00e1foro) --------------------------------------
// Preloads the 5 traffic-light PNGs so the countdown never pops in late.
var SEMAFORO_IMGS = [
	"semaforo0-removebg-preview.png",
	"semaforo1-removebg-preview.png",
	"semaforo2-removebg-preview.png",
	"semaforo3-removebg-preview.png",
	"semaforo4-removebg-preview.png"
];
function preloadSemaforos(){
	for(var i = 0; i < SEMAFORO_IMGS.length; i++){
		var im = new Image();
		im.src = SEMAFORO_IMGS[i];
	}
}
preloadSemaforos();

// F1-style countdown. `onGo` fires the instant the race actually starts
// (when light 4 turns on). Cars stay locked until then.
function startSemaforoCountdown(onGo){
	preloadSemaforos();
	var semi = document.createElement("DIV");
	semi.id = "semaforo";
	var img = document.createElement("IMG");
	img.alt = "";
	img.src = SEMAFORO_IMGS[0];
	semi.appendChild(img);
	f.appendChild(semi);

	var timers = [];
	// t=2s: light 0 slides in from the top.
	timers.push(setTimeout(function(){ semi.classList.add("show"); }, 2000));
	// +2s after it entered: light 1.
	timers.push(setTimeout(function(){ img.src = SEMAFORO_IMGS[1]; }, 4000));
	// +1s: light 2.
	timers.push(setTimeout(function(){ img.src = SEMAFORO_IMGS[2]; }, 5000));
	// +1s: light 3.
	timers.push(setTimeout(function(){ img.src = SEMAFORO_IMGS[3]; }, 6000));
	// Random 3-5s on light 3, then light 4 = GO.
	var goAt = 6000 + 3000 + Math.random() * 2000;
	timers.push(setTimeout(function(){
		img.src = SEMAFORO_IMGS[4];
		if(typeof onGo == "function") onGo();
		// Stay 3s after the race starts, then exit upward.
		timers.push(setTimeout(function(){
			semi.classList.add("leave");
			timers.push(setTimeout(function(){
				if(semi.parentNode) semi.parentNode.removeChild(semi);
			}, 900));
		}, 3000));
	}, goAt));
}

menu2 = function(){
	// The intro music keeps playing through the menus; it only fades out
	// when a race actually starts (see startHostedRace/startSoloGame).
	if(mobile){
		function reactOrientation(e){
			var angle = screen.orientation.type == "portrait-primary" ? e.gamma : screen.orientation.type == "portrait-secondary" ? -e.gamma : screen.orientation.type == "landscape-primary" ? e.beta : screen.orientation.type == "landscape-secondary" ? -e.beta : 0;
			me.data.steer = Math.max(Math.min((-angle) / 180 * Math.PI, Math.PI / 6), -Math.PI / 6);
		}

		if(DeviceOrientationEvent.requestPermission){
			DeviceOrientationEvent.requestPermission("El juego necesita acceder a la inclinaci\u00f3n del tel\u00e9fono para que puedas dirigir tu coche.").then(permissionState => {
				if (permissionState === 'granted')
					window.addEventListener('deviceorientation', reactOrientation);
				else
					alert("Permiso denegado");
			}).catch(alert);
    		}else{
			window.addEventListener('deviceorientation', reactOrientation);
		}
	}
	var nameEl = document.getElementById("name");
	if(!nameEl || nameEl.value == "")
		name = "Jugador sin nombre";
	else
		name = nameEl.value;
	VR = false;
	transitionMenu(
		"<div class='menuitem title button menu-top' id='solo' ontouchstart='this.click()' onclick='soloMenu()'>Jugar en solitario</div>" +
		"<div class='menuitem title button menu-bottom' id='friends' ontouchstart='this.click()' onclick='friendsMenu()'>Jugar con amigos</div>",
		function(){
			var soloEl = document.getElementById("solo");
			if(soloEl) soloEl.style.transform = "none";
			setTimeout(function(){
				var el = document.getElementById("solo");
				if(el) el.style.transition = "transform .2s, box-shadow .2s";
			}, 500);
			setTimeout(function(){
				var friendsEl = document.getElementById("friends");
				if(friendsEl) friendsEl.style.transform = "none";
				setTimeout(function(){
					var el = document.getElementById("friends");
					if(el) el.style.transition = "transform .2s, box-shadow .2s";
				}, 500);
			}, 500);
		}
	);
}

function escapeHtml(text){
	return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Helper: replaces the #fore contents with a slide transition.
// `html` is the new innerHTML; `after` is called once the slide-in finishes.
function transitionMenu(html, after){
	f.style.transform = "translate3d(0, -100vh, 0)";
	setTimeout(function(){
		f.innerHTML = html;
		if(VR)
			f.innerHTML += "<div id='divider'></div>";
		f.style.transform = "none";
		if(typeof after == "function")
			after();
	}, 500);
}

// ---- Solo mode menu: Cronometraje / Entrenamiento -----------------
soloMenu = function(){
	transitionMenu(
		"<div class='menuitem title' id='solomenu-title'>Elige el modo de juego</div>" +
		"<div class='menuitem title button menu-top' id='crono' ontouchstart='this.click()' onclick='soloCrono()'>Cronometraje</div>" +
		"<div class='menuitem title button menu-bottom' id='entren' ontouchstart='this.click()' onclick='soloEntreno()'>Entrenamiento</div>" +
		"<div class='menuitem title button menu-back' id='soloback' ontouchstart='this.click()' onclick='menu2()'>Volver</div>",
		function(){
			setTimeout(function(){ var el = document.getElementById("solomenu-title"); if(el) el.style.transform = "none"; }, 100);
			setTimeout(function(){ var el = document.getElementById("crono"); if(el) el.style.transform = "none"; }, 400);
			setTimeout(function(){ var el = document.getElementById("entren"); if(el) el.style.transform = "none"; }, 700);
			setTimeout(function(){ var el = document.getElementById("soloback"); if(el) el.style.transform = "none"; }, 1000);
		}
	);
}

// Solo "Entrenamiento": free drive, no countdown, no timer, no laps, no leaderboard.
soloEntreno = function(){
	soloMode = "entreno";
	// Entrenamiento: infinite laps internally (so the lap counter never triggers a finish),
	// but we hide the lap/timer/leaderboard HUDs entirely.
	LAPS = 999;
	f.style.transform = "translate3d(0, -100vh, 0)";
	setTimeout(function(){
		f.innerHTML = "";
		if(VR) f.innerHTML += "<div id='divider'></div>";
		// Black loading screen for 4 seconds
		var loader = document.createElement("DIV");
		loader.id = "loader";
		loader.innerHTML = "<div class='title' id='loader-title'>Cargando...</div>";
		f.appendChild(loader);
		f.appendChild(element);
		f.style.transform = "none";

		// Initialise the renderer/camera/render-loop (maps loaded inside join()).
		join();

		// Once join() returns, after the loading screen, build the solo player + race.
		setTimeout(function(){
			loader.style.opacity = "0";
			setTimeout(function(){ if(loader.parentNode) loader.parentNode.removeChild(loader); }, 500);
			startSoloGame();
		}, 4000);
	}, 500);
}

// Solo "Cronometraje": normal race (countdown, timer, leaderboard, laps) for 1 player.
soloCrono = function(){
	soloMode = "crono";
	LAPS = soloLaps;
	f.style.transform = "translate3d(0, -100vh, 0)";
	setTimeout(function(){
		f.innerHTML = "";
		if(VR) f.innerHTML += "<div id='divider'></div>";
		var loader = document.createElement("DIV");
		loader.id = "loader";
		loader.innerHTML = "<div class='title' id='loader-title'>Cargando...</div>";
		f.appendChild(loader);
		f.appendChild(element);
		f.style.transform = "none";

		join();

		setTimeout(function(){
			loader.style.opacity = "0";
			setTimeout(function(){ if(loader.parentNode) loader.parentNode.removeChild(loader); }, 500);
			startSoloGame();
		}, 2500);
	}, 500);
}

// ---- Play with friends menu: Create room / Join room --------------
friendsMenu = function(){
	transitionMenu(
		"<div class='menuitem title button menu-top' id='host' ontouchstart='this.click()' onclick='host()'>Crear una sala</div>" +
		"<div class='menuitem title button menu-bottom' id='join' ontouchstart='this.click()' onclick='joinGame()'>Unirse a una sala</div>" +
		"<div class='menuitem title button menu-back' id='friendsback' ontouchstart='this.click()' onclick='menu2()'>Volver</div>",
		function(){
			setTimeout(function(){ var el = document.getElementById("host"); if(el){ el.style.transform = "none"; setTimeout(function(){ if(el) el.style.transition = "transform .2s, box-shadow .2s"; }, 500); } }, 200);
			setTimeout(function(){ var el = document.getElementById("join"); if(el){ el.style.transform = "none"; setTimeout(function(){ if(el) el.style.transition = "transform .2s, box-shadow .2s"; }, 500); } }, 700);
			setTimeout(function(){ var el = document.getElementById("friendsback"); if(el) el.style.transform = "none"; }, 1200);
		}
	);
}

host = function(){
	document.getElementById("host").onclick = null;
	if(typeof lobbyStartGame == "function") {/* no-op */}
	// Step 1: choose map type (predetermined vs custom)
	transitionMenu(
		"<div class='menuitem title' id='mapmenu-title'>Elige el tipo de mapa</div>" +
		"<div class='menuitem title button menu-top' id='mappreset' ontouchstart='this.click()' onclick='hostCreatePreset()'>Mapa predeterminado</div>" +
		"<div class='menuitem title button menu-bottom' id='mapcustom' ontouchstart='this.click()' onclick='hostCreateCustom()'>Mapa personalizado</div>" +
		"<div class='menuitem title button menu-back' id='mapback' ontouchstart='this.click()' onclick='friendsMenu()'>Volver</div>",
		function(){
			setTimeout(function(){ var el = document.getElementById("mapmenu-title"); if(el) el.style.transform = "none"; }, 100);
			setTimeout(function(){ var el = document.getElementById("mappreset"); if(el) el.style.transform = "none"; }, 400);
			setTimeout(function(){ var el = document.getElementById("mapcustom"); if(el) el.style.transform = "none"; }, 700);
			setTimeout(function(){ var el = document.getElementById("mapback"); if(el) el.style.transform = "none"; }, 1000);
		}
	);
}

hostCreatePreset = function(){
	lobbyMapType = "preset";
	hostStartRoom(false, "mappreset");
}

hostCreateCustom = function(){
	lobbyMapType = "custom";
	transitionMenu(
		"<div class='menuitem title' id='custommap-title'>Pega los datos del mapa</div>" +
		"<div class='menuitem title' id='mapdata-wrap'><textarea id='mapdata' class='title' ontouchstart='this.focus()' placeholder='Pega aqu\u00ed los n\u00fameros/export del mapa'></textarea></div>" +
		"<div class='menuitem title button menu-bottom' id='mapstart' ontouchstart='this.click()' onclick='hostCreateCustomGo()'>Continuar</div>" +
		"<div class='menuitem title button menu-back' id='mapback2' ontouchstart='this.click()' onclick='friendsMenu()'>Volver</div>",
		function(){
			setTimeout(function(){ var el = document.getElementById("custommap-title"); if(el) el.style.transform = "none"; }, 100);
			setTimeout(function(){ var el = document.getElementById("mapdata-wrap"); if(el) el.style.transform = "none"; }, 250);
			setTimeout(function(){ var el = document.getElementById("mapstart"); if(el) el.style.transform = "none"; }, 400);
			setTimeout(function(){ var el = document.getElementById("mapback2"); if(el) el.style.transform = "none"; }, 700);
		}
	);
}

hostCreateCustomGo = function(){
	var md = document.getElementById("mapdata");
	if(!md || md.value.trim().length == 0){
		alert("Tienes que pegar los datos del mapa.");
		return;
	}
	lobbyMapData = md.value.trim();
	hostStartRoom(true, "mapstart");
}

// Firebase termina de autenticar de forma asíncrona. Antes se intentaba crear
// la sala inmediatamente y, si el jugador pulsaba rápido, `database` todavía
// era undefined y el menú parecía no responder.
hostStartRoom = function(isCustom, buttonId){
	var button = document.getElementById(buttonId);
	var originalLabel = button ? button.innerHTML : "Continuar";
	if(button){
		button.onclick = null;
		button.style.pointerEvents = "none";
		button.innerHTML = "Conectando...";
	}

	var startedAt = Date.now();
	var waitForDatabase = setInterval(function(){
		if(database && typeof database.ref == "function"){
			clearInterval(waitForDatabase);
			hostLobbySetup(isCustom);
			return;
		}
		if(Date.now() - startedAt >= 10000){
			clearInterval(waitForDatabase);
			if(button){
				button.onclick = function(){ hostStartRoom(isCustom, buttonId); };
				button.style.pointerEvents = "";
				button.innerHTML = originalLabel;
			}
			alert("No se ha podido conectar al servidor. Comprueba tu conexión e inténtalo de nuevo.");
		}
	}, 100);
}

// Creates the room in Firebase and shows the lobby (ready-check) screen.
// `isCustom` controls whether the room code is 5 chars (custom) or 4 chars (preset).
lobbyMapType = "preset";
lobbyMapData = null;
hostLobbySetup = function(isCustom){
	lobbyIsHost = true;
	// Retry-safe code generator
	function getCode(cb){
		code = "";
		var letters = "ABCDEFGHIJKLMMNOPQRSTUVWXYZ";
		var len = isCustom ? 5 : 4;
		for(var i = 0; i < len; i++)
			code += letters[Math.floor(Math.random() * letters.length)];
		database.ref(code).once("value", function(codeCheck){
			var cv = codeCheck.val();
			if(cv == null || cv.status == -1 || !cv.timestamp || Date.now() - cv.timestamp > 1000 * 60 * 60 * 24){
				cb();
			}else{
				getCode(cb);
			}
		});
	}

	getCode(function(){
		var mapValue = isCustom ? lobbyMapData : document.getElementById("trackcode").innerHTML;
		document.getElementById("trackcode").innerHTML = mapValue;
		database.ref(code).set({
			status: 0,
			players: {},
			map: mapValue,
			mapType: isCustom ? "custom" : "preset",
			timestamp: Date.now()
		});

		// Track whose mapType it is on the host side so the lobby UI shows it.
		lobbyIsCustom = isCustom;

		// Build the lobby UI (ready-check instead of host Start button)
		f.style.transform = "translate3d(0, -100vh, 0)";
		setTimeout(function(){
			f.innerHTML =
				"<div class='info title'>C\u00f3digo de la sala<div id='code'>" + code + "</div>" +
				"<div class='subtitle'>" + (lobbyIsCustom ? "Mapa personalizado" : "Mapa predeterminado") + "</div>" +
				"</div>" +
				"<div id='lobbylist'></div>" +
				"<div class='menuitem title button ready-btn' id='readybtn' ontouchstart='this.click()' onclick='toggleReady()'>Estoy listo</div>";
			if(VR) f.innerHTML += "<div id='divider'></div>";
			f.appendChild(element);
			f.style.transform = "none";
			join();

			// Listen for players joining
			database.ref(code + "/players").on("child_added", function(p){
				var pid = p.ref_.path.pieces_[2];
				players[pid] = {
					data: p.val(),
					model: new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 2))
				};
				var pl = players[pid];
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
				label.innerHTML = escapeHtml(pl.data.name).substring(0, 50) + "<br/>|";
				pl.label = label;
				label.position = pl.model.position;
				f.appendChild(label);
				labels.push(label);
				pl.model.receiveShadow = true;
				scene.add(pl.model);

				if(pid == me.ref.path.pieces_[2]){
					me.label = pl.label;
					me.model = pl.model;
					me.label.innerHTML = "";
				}
				renderLobbyList();
			});

			database.ref(code + "/players").on("child_changed", function(p){
				var pid = p.ref_.path.pieces_[2];
				if(players[pid]) players[pid].data = p.val();
				renderLobbyList();
			});

			database.ref(code + "/players").on("child_removed", function(p){
				var pid = p.ref_.path.pieces_[2];
				if(players[pid]){
					if(players[pid].model) scene.remove(players[pid].model);
					if(players[pid].label && players[pid].label.parentNode) players[pid].label.parentNode.removeChild(players[pid].label);
					var li = labels.indexOf(players[pid].label);
					if(li >= 0) labels.splice(li, 1);
					delete players[pid];
				}
				renderLobbyList();
			});

			me.ref = database.ref(code + "/players").push();
			me.data = {
				x: carPos[0].x,
				y: carPos[0].y,
				h: 0,
				xv: 0,
				yv: 0,
				dir: 0,
				steer: 0,
				color: color,
				name: name,
				checkpoint: 0,
				lap: 0,
				ready: false,
				collision: {}
			}
			me.ref.set(me.data);

			renderLobbyList();

			// Auto-start when everyone is ready (status flips to 1 server-side).
			database.ref(code + "/status").on("value", function(v){
				v = v.val();
				if(v == 1){
					startHostedRace();
				}
			});
		}, 500);
	});
}

// Renders the lobby member-list with check-emoji for ready ones.
function renderLobbyList(){
	var list = document.getElementById("lobbylist");
	if(!list) return;
	var html = "<div class='lobby-title'>Jugadores en la sala:</div>";
	var count = 0, readyCount = 0;
	for(var pid in players){
		var d = players[pid].data;
		if(!d) continue;
		count++;
		if(d.ready) readyCount++;
		var check = d.ready ? " \u2705" : " \u23F3";
		var meCls = (pid == me.ref.key) ? " lobby-me" : "";
		html += "<div class='lobby-row" + meCls + "'>" + escapeHtml(d.name).substring(0, 20) + check + "</div>";
	}
	if(count > 0)
		html += "<div class='lobby-count'>" + readyCount + "/" + count + " listos</div>";
	else
		html += "<div class='lobby-count'>Esperando jugadores...</div>";
	list.innerHTML = html;

	// Update the ready button text
	var btn = document.getElementById("readybtn");
	if(btn){
		btn.innerHTML = me.data.ready ? "Estoy listo \u2705" : "Estoy listo";
		btn.className = "menuitem title button ready-btn" + (me.data.ready ? " ready-btn-on" : "");
	}

	lobbyAllReady = count > 0 && readyCount == count;
	if(lobbyIsHost && lobbyAllReady && !hostedRaceStarted){
		hostedRaceStarted = true;
		database.ref(code + "/status").set(1);
	}
}

// Toggles the local player's ready state, and (if host) auto-starts the race once everyone is ready.
toggleReady = function(){
	me.data.ready = !me.data.ready;
	me.ref.update({ready: me.data.ready});
	if(me.ref && me.ref.key && players[me.ref.key])
		players[me.ref.key].data.ready = me.data.ready;
	renderLobbyList();
}

startHostedRace = function(){
	if(gameStarted) return;
	// The race is starting: fade the menu music out.
	stopIntroMusic();
	var info = document.getElementsByClassName("info")[0];
	if(info) info.outerHTML = "";
	var rb = document.getElementById("readybtn");
	if(rb) rb.outerHTML = "";
	var ll = document.getElementById("lobbylist");
	if(ll) ll.outerHTML = "";

	gameStarted = true;
	gameSortaStarted = true;

	lap = document.createElement("DIV");
	lap.innerHTML = "0/" + LAPS;
	lap.className = "title";
	lap.id = "lap";
	f.appendChild(lap);

	leaderboard = document.createElement("DIV");
	leaderboard.id = "leaderboard";
	f.appendChild(leaderboard);

	try{ createRaceHUD(f); }catch(e){ console.error("createRaceHUD error:", e); }

	startSemaforoCountdown(function(){
		gameSortaStarted = false;
		raceStartTime = Date.now();
	});
}

joinGame = function(){
	lobbyIsHost = false;
	document.getElementById("join").onclick = null;
	transitionMenu(
		"<div class='info title' style='position:static;border:none;background:none;'>Introduce el c\u00f3digo de la sala<div id='codehint'>(4 letras si mapa predeterminado, 5 si mapa personalizado)</div></div>" +
		"<input id='incode' class='title' onkeyup='codeCheck(event)' ontouchstart='this.focus()' maxlength='5' autofocus></input>" +
		"<div class='menuitem title button menu-back' id='joinback' ontouchstart='this.click()' onclick='friendsMenu()'>Volver</div>",
		function(){
			f.appendChild(element);
			var ic = document.getElementById("incode");
			if(ic) ic.focus();
			setTimeout(function(){ var el = document.getElementById("joinback"); if(el) el.style.transform = "none"; }, 300);
		}
	);
	join();
}

var map, trees, signs, startc, main, joined = false;

// --- Solo mode setup --------------------------------------------------
// Builds a fake `me.ref` and a fake `players` entry so the existing
// render/physics code (which references `me.ref.path.pieces_[2]`) keeps
// working without touching Firebase.
startSoloGame = function(){
	// The solo race is starting: fade the menu music out.
	stopIntroMusic();
	var myId = "me";
	me.ref = { path: { pieces_: [code || "solo", "players", myId] }, key: myId };
	players[myId] = {
		data: {
			x: carPos[0].x,
			y: carPos[0].y,
			h: 0,
			xv: 0,
			yv: 0,
			dir: 0,
			steer: 0,
			color: color,
			name: name,
			checkpoint: 0,
			lap: 0,
			collision: {}
		},
		model: new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 2))
	};
	me.data = players[myId].data;
	var pl = players[myId];
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
	pl.model.receiveShadow = true;
	scene.add(pl.model);
	me.label = document.createElement("DIV");
	me.label.className = "label";
	me.label.innerHTML = "";
	me.label.position = pl.model.position;
	me.model = pl.model;

	gameStarted = true;
	// Re-apply solo lap settings AFTER join() has eval'd any map variables,
	// so a custom map with `var LAPS` can't break Entrenamiento/Cronometraje.
	LAPS = (soloMode == "entreno") ? 999 : soloLaps;
	// Entrenamiento skips the countdown; Cronometraje shows it.
	if(soloMode == "crono"){
		gameSortaStarted = true;
			lap = document.createElement("DIV");
			lap.innerHTML = "0/" + soloLaps;
		lap.className = "title";
		lap.id = "lap";
		f.appendChild(lap);

		leaderboard = document.createElement("DIV");
		leaderboard.id = "leaderboard";
		leaderboard.style.display = "none"; // hide empty leaderboard in solo mode
		f.appendChild(leaderboard);

		try{ createRaceHUD(f); }catch(e){ console.error("createRaceHUD error:", e); }

		startSemaforoCountdown(function(){
			gameSortaStarted = false;
			raceStartTime = Date.now();
		});
	}
	// Entrenamiento: nothing to render beyond the canvas (no HUD),
	// pero s\u00ed a\u00f1adimos el bot\u00f3n de pausa con su men\u00fa.
	if(soloMode == "entreno"){
		var pauseBtn = document.createElement("DIV");
		pauseBtn.id = "pauseBtn";
		pauseBtn.innerHTML = "<svg viewBox='0 0 24 24' width='22' height='22' fill='currentColor'><rect x='6' y='4' width='4' height='16' rx='1'/><rect x='14' y='4' width='4' height='16' rx='1'/></svg>";
		pauseBtn.title = "Pausa (Esc)";
		pauseBtn.onclick = togglePause;
		f.appendChild(pauseBtn);

		var pauseMenu = document.createElement("DIV");
		pauseMenu.id = "pauseMenu";
		pauseMenu.innerHTML =
			"<div class='pause-title'>Pausa</div>" +
			"<div class='pause-btn' ontouchstart='this.click()' onclick='togglePause()'>Continuar</div>" +
			"<div class='pause-btn pause-exit' ontouchstart='this.click()' onclick='exitToMainMenu()'>Salir al men\u00fa principal</div>";
		f.appendChild(pauseMenu);
	}
};

// Pausa real del modo entrenamiento: congela la f\u00edsica (el bucle de
// render salta el bloque de juego mientras `paused` est\u00e9 activo).
function togglePause(){
	if(!gameStarted || soloMode != "entreno") return;
	paused = !paused;
	var pm = document.getElementById("pauseMenu");
	if(pm) pm.style.display = paused ? "flex" : "none";
	var pb = document.getElementById("pauseBtn");
	if(pb) pb.classList.toggle("on", paused);
}

// Sale del modo solitario y restaura el men\u00fa principal original.
function exitToMainMenu(){
	paused = false;
	soloMode = null;
	gameStarted = false;
	gameSortaStarted = false;
	// Quitar el coche del jugador de la escena
	if(me && me.model && me.model.parentNode) me.model.parentNode.removeChild(me.model);
	if(me && me.label && me.label.parentNode) me.label.parentNode.removeChild(me.label);
	var li = labels.indexOf(me.label);
	if(li >= 0) labels.splice(li, 1);
	players = {};
	me = {};
	// Limpiar HUD y elementos de pausa
	["lap","leaderboard","raceTimer","finishBanner","pauseMenu","pauseBtn","resultsOverlay","spectatorUI","spectateName","eyeBadge","countdown","semaforo"].forEach(function(id){
		var el = document.getElementById(id);
		if(el && el.parentNode) el.parentNode.removeChild(el);
	});
	// Restaurar el men\u00fa original (guardado al cargar)
	f.innerHTML = originalForeHTML;
	f.style.transform = "none";
	// Re-ejecutar la animaci\u00f3n de entrada del men\u00fa
	setTimeout(function(){ var el = document.getElementById("title"); if(el) el.style.transform = "none"; }, 400);
	setTimeout(function(){ var el = document.getElementsByClassName("menuitem")[0]; if(el) el.style.transform = "none"; }, 800);
	setTimeout(function(){ var el = document.getElementsByClassName("menuitem")[1]; if(el) el.style.transform = "none"; }, 1000);
	setTimeout(function(){ var el = document.getElementsByClassName("menuitem")[2]; if(el) el.style.transform = "none"; }, 1200);
	setTimeout(function(){ var el = document.getElementById("settings"); if(el) el.style.transform = "none"; }, 1500);
	// La m\u00fasica del men\u00fa vuelve a sonar y se resincroniza el control de volumen
	if(introMusic && introMusic.paused && !musicMuted) startIntroMusic();
	applyMusicState();
}

function deleteMap(){
	if(!map) return;
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
	if(elevGroup){
		while(elevGroup.children.length > 0)
			elevGroup.remove(elevGroup.children[0]);
		scene.remove(elevGroup);
		elevGroup = null;
	}
	ramps = [];
	elevFloors = [];
}

// Crea la malla 3D de una rampa: un prisma con la superficie inclinada que sube
// (o baja) del piso `from` al piso `to`. a y b son las dos esquinas opuestas del
// rect\u00e1ngulo en coordenadas de rejilla; la altura en cada punto sigue la
// proyecci\u00f3n sobre la diagonal a->b, igual que la f\u00edsica.
function rampAxisT(g, a, b){
	// Interpola a lo largo del eje dominante del rectángulo: así la entrada
	// y la salida de la rampa quedan niveladas (no inclinadas hacia un lado)
	// y las rampas dibujadas en horizontal o vertical se ven correctamente.
	var dx = b.x - a.x, dy = b.y - a.y;
	if(Math.abs(dx) >= Math.abs(dy))
		return dx == 0 ? 0 : Math.max(0, Math.min(1, (g.x - a.x) / dx));
	return dy == 0 ? 0 : Math.max(0, Math.min(1, (g.y - a.y) / dy));
}

// Devuelve la altura (en pisos) de la rampa en un punto del mundo, o null si no hay rampa.
// Se usa para inclinar el coche según la pendiente real de la rampa.
function rampHeightAt(wx, wz){
	var pad = 1.2;
	for(var r = 0; r < ramps.length; r++){
		var rp = ramps[r];
		if(wx < Math.min(rp.ax, rp.bx) - pad || wx > Math.max(rp.ax, rp.bx) + pad ||
		   wz < Math.min(rp.az, rp.bz) - pad || wz > Math.max(rp.az, rp.bz) + pad)
			continue;
		var gp = new THREE.Vector2(-wx / mapscale, wz / mapscale);
		var t = rampAxisT(gp, rp.a, rp.b);
		return rp.from + (rp.to - rp.from) * t;
	}
	return null;
}

function buildRampMesh(a, b, from, to){
	var hF = from * LEVEL_HEIGHT, hT = to * LEVEL_HEIGHT;
	var d = b.clone().sub(a);
	var len2 = d.lengthSq();
	if(len2 < 0.001) return null;
	var gCorners = [a, new THREE.Vector2(b.x, a.y), b, new THREE.Vector2(a.x, b.y)];
	var top = [], bot = [];
	for(var i = 0; i < 4; i++){
		var g = gCorners[i];
		var t = rampAxisT(g, a, b);
		var h = hF + (hT - hF) * t;
		var p = new THREE.Vector3(-g.x * mapscale, h, g.y * mapscale);
		top.push(p);
		bot.push(p.clone().add(new THREE.Vector3(0, -0.25, 0)));
	}
	var verts = [];
	function tri(p1, p2, p3){
		verts.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
	}
	// Cara superior inclinada (dos tri\u00e1ngulos)
	tri(top[0], top[1], top[2]);
	tri(top[0], top[2], top[3]);
	// Cara inferior
	tri(bot[0], bot[2], bot[1]);
	tri(bot[0], bot[3], bot[2]);
	// Laterales
	for(var i = 0; i < 4; i++){
		var j = (i + 1) % 4;
		tri(top[i], top[j], bot[j]);
		tri(top[i], bot[j], bot[i]);
	}
	var geo = new THREE.BufferGeometry();
	// El juego carga three.js r86, donde el método es addAttribute (setAttribute solo existe desde r110)
	geo.addAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
	geo.computeVertexNormals();
	var mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color: new THREE.Color("#2a2a2a"), side: THREE.DoubleSide}));
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh;
}

// ---- Ayudas de entorno: hierba, muros de circuito y asfalto ----
// Crea la textura de hierba (verde con motas) para el suelo.
function makeGrassTexture(){
	try{
		var c = document.createElement("canvas");
		c.width = 64; c.height = 64;
		var ctx = c.getContext("2d");
		if(!ctx) return null;
		ctx.fillStyle = "#3c8a2c";
		ctx.fillRect(0, 0, 64, 64);
		for(var i = 0; i < 500; i++){
			var r = 30 + Math.floor(Math.random() * 50);
			var g = 110 + Math.floor(Math.random() * 90);
			var b = 25 + Math.floor(Math.random() * 35);
			ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",0.45)";
			var s = Math.random() * 2 + 1;
			ctx.fillRect(Math.random() * 64, Math.random() * 64, s, s);
		}
		var tex = new THREE.CanvasTexture(c);
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(160, 160);
		return tex;
	}catch(e){
		return null;
	}
}

// Crea el material de los muros tipo circuito: valla clásica de carreras con
// bandas horizontales rojas y blancas (estilo karting/F1), uniformes a lo largo
// de todo el muro. Las antiguas franjas diagonales envolvían el muro como un
// bastón de caramelo, así que se sustituyen por bandas horizontales.
function makeStripedWallMaterial(width){
	try{
		if(typeof document.createElement != "function") return null;
		var c = document.createElement("canvas");
		c.width = 128; c.height = 128;
		var ctx = c.getContext("2d");
		if(!ctx) return null;
		// Variante C: gris claro con franja roja delgada en el borde superior
		// (estilo barrera de hormigón con aviso, la elegida por el usuario).
		ctx.fillStyle = "#c7ccd4";
		ctx.fillRect(0, 0, 128, 128);
		ctx.fillStyle = "#e0352b";
		ctx.fillRect(0, 0, 128, 15); // ~12% de la altura del muro
		var tex = new THREE.CanvasTexture(c);
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		// El alto del muro (1.5) mapea la textura completa: las bandas quedan
		// bien proporcionadas en cualquier longitud de muro, sin repetición.
		tex.repeat.set(1, 1);
		// Anisotropía para que las bandas no se emborronen al mirar muros largos
		// de reflón (ángulo de visión muy cerrado).
		if(typeof renderer != "undefined" && renderer && renderer.capabilities){
			tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
		}
		return new THREE.MeshLambertMaterial({map: tex});
	}catch(e){
		return null;
	}
}

// Distancia de un punto a un segmento (plano XZ).
function distToSeg2(px, pz, x1, z1, x2, z2){
	var dx = x2 - x1, dz = z2 - z1;
	var len2 = dx * dx + dz * dz;
	if(len2 < 0.0001) return Math.sqrt((px - x1) * (px - x1) + (pz - z1) * (pz - z1));
	var t = ((px - x1) * dx + (pz - z1) * dz) / len2;
	t = Math.max(0, Math.min(1, t));
	var qx = x1 + t * dx, qz = z1 + t * dz;
	return Math.sqrt((px - qx) * (px - qx) + (pz - qz) * (pz - qz));
}

// Pinta de concreto negro el circuito de nivel 0 (la zona cerrada entre los
// muros), dejando la hierba en todo lo que no es pista. Usa relleno por
// inundación sobre una rejilla: lo que queda fuera del bucle es hierba.
function generateAsphalt(){
	var tcode = document.getElementById("trackcode");
	var racedata = tcode.innerHTML.trim().split("|")[0].trim().split(" ");
	var segs = [];
	for(var i = 0; i < racedata.length; i++){
		if(racedata[i] == "") continue;
		var tok = racedata[i];
		var lvl = 0;
		var at = tok.indexOf("@");
		if(at >= 0){
			lvl = parseInt(tok.substring(at + 1)) || 0;
			tok = tok.substring(0, at);
		}
		if(lvl != 0) continue; // solo muros de suelo
		var pts = tok.split("/");
		if(pts.length < 2) continue;
		var a = pts[0].split(","), b = pts[1].split(",");
		if(a.length < 2 || b.length < 2) continue;
		segs.push({
			x1: -parseInt(a[0]) * mapscale, z1: parseInt(a[1]) * mapscale,
			x2: -parseInt(b[0]) * mapscale, z2: parseInt(b[1]) * mapscale
		});
	}
	if(segs.length < 3) return;
	var minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
	for(var i = 0; i < segs.length; i++){
		var s = segs[i];
		minX = Math.min(minX, s.x1, s.x2); maxX = Math.max(maxX, s.x1, s.x2);
		minZ = Math.min(minZ, s.z1, s.z2); maxZ = Math.max(maxZ, s.z1, s.z2);
	}
	var span = Math.max(maxX - minX, maxZ - minZ);
	var CELL = span / 110; // ~110 celdas en el eje largo
	CELL = Math.min(4, Math.max(1.0, CELL));
	var PAD = 4;
	var gx0 = Math.floor(minX / CELL) - Math.ceil(PAD / CELL);
	var gx1 = Math.floor(maxX / CELL) + Math.ceil(PAD / CELL);
	var gz0 = Math.floor(minZ / CELL) - Math.ceil(PAD / CELL);
	var gz1 = Math.floor(maxZ / CELL) + Math.ceil(PAD / CELL);
	var W = gx1 - gx0 + 1, H = gz1 - gz0 + 1;
	// distancia mínima de cada celda a los muros (y celda de muro)
	var WALL_HALF = 0.3 / 2 + 0.35;
	var ROAD_HALF = 6; // mitad de la anchura de la carretera
	var dmin = [];
	for(var x = 0; x < W; x++){
		dmin[x] = [];
		for(var z = 0; z < H; z++){
			var cxw = (gx0 + x) * CELL, czw = (gz0 + z) * CELL;
			var d = Infinity;
			for(var i = 0; i < segs.length; i++){
				var s = segs[i];
				d = Math.min(d, distToSeg2(cxw, czw, s.x1, s.z1, s.x2, s.z2));
			}
			dmin[x][z] = d;
		}
	}
	// relleno por inundación desde el borde: lo alcanzable es "fuera"
	var out = [];
	for(var x = 0; x < W; x++){ out[x] = []; for(var z = 0; z < H; z++) out[x][z] = false; }
	var stack = [];
	for(var x = 0; x < W; x++){
		for(var z = 0; z < H; z++){
			if((x == 0 || z == 0 || x == W - 1 || z == H - 1) && dmin[x][z] >= WALL_HALF){
				out[x][z] = true;
				stack.push([x, z]);
			}
		}
	}
	while(stack.length){
		var c = stack.pop();
		var x = c[0], z = c[1];
		if(x > 0 && dmin[x-1][z] >= WALL_HALF && !out[x-1][z]){ out[x-1][z] = true; stack.push([x-1, z]); }
		if(x < W-1 && dmin[x+1][z] >= WALL_HALF && !out[x+1][z]){ out[x+1][z] = true; stack.push([x+1, z]); }
		if(z > 0 && dmin[x][z-1] >= WALL_HALF && !out[x][z-1]){ out[x][z-1] = true; stack.push([x, z-1]); }
		if(z < H-1 && dmin[x][z+1] >= WALL_HALF && !out[x][z+1]){ out[x][z+1] = true; stack.push([x, z+1]); }
	}
	// asfalto: interior (no muro, no fuera) y cerca de un muro (la pista)
	var asphaltMat = new THREE.MeshLambertMaterial({color: new THREE.Color(0x222222)});
	for(var z = 0; z < H; z++){
		var x = 0;
		while(x < W){
			if(dmin[x][z] < WALL_HALF || out[x][z] || dmin[x][z] >= ROAD_HALF){ x++; continue; }
			var x0 = x;
			while(x < W && dmin[x][z] >= WALL_HALF && !out[x][z] && dmin[x][z] < ROAD_HALF) x++;
			var x1 = x - 1;
			var w = (x1 - x0 + 1) * CELL;
			// profundidad exacta CELL: un solape de 0.05 entre filas adyacentes causaba z-fighting
			var box = new THREE.Mesh(
				new THREE.BoxBufferGeometry(w + 0.05, 0.05, CELL),
				asphaltMat
			);
			box.position.set((gx0 + (x0 + x1) / 2) * CELL, 0.025, (gz0 + z) * CELL);
			box.receiveShadow = true;
			elevGroup.add(box);
		}
	}
}

function loadMap(){
	// Apply custom map variables (5th section of the code, e.g. SPEED = 0.004;)
	// BEFORE building the scene so mapscale/MOUNTAIN_DIST/etc. take effect immediately.
	// Note: innerHTML/textContent, NOT innerText - #trackcode is display:none and
	// innerText returns "" on hidden elements in most browsers.
	var tcode = document.getElementById("trackcode");
	var varsCode = tcode.textContent.trim().split("|")[4];
	if(varsCode && varsCode.trim()){
		try{ eval(varsCode); }catch(e){ console.error("Error en variables del mapa:", e); }
	}
	// Mínimo 3 vueltas en cualquier carrera personalizada (los mapas no pueden
	// forzar carreras de 1-2 vueltas; el 999 del Entrenamiento queda intacto).
	if(LAPS < 3) LAPS = 3;
	var racedata = tcode.innerHTML.trim().split("|")[0].trim().split(" ");
	var material = new THREE.MeshLambertMaterial({color: new THREE.Color(0xf48342)});	//var mapscale = 7;
	map = new THREE.Object3D();
	elevGroup = new THREE.Object3D();
	var pillarMat = new THREE.MeshLambertMaterial({color: new THREE.Color("#777")});
	var deckMat = new THREE.MeshLambertMaterial({color: new THREE.Color("#8a8a8a")});
	var elevWalls = []; // Muros elevados, para generar los suelos entre paredes después
	for(var i = 0; i < racedata.length; i++){
		if(racedata[i] == "")
			continue;
		var wallToken = racedata[i];
		var wallLevel = 0;
		var atIdx = wallToken.indexOf("@");
		if(atIdx >= 0){
			wallLevel = parseInt(wallToken.substring(atIdx + 1)) || 0;
			wallToken = wallToken.substring(0, atIdx);
		}
		var point1 = new THREE.Vector2(parseInt(wallToken.split("/")[0].split(",")[0]), parseInt(wallToken.split("/")[0].split(",")[1]));
		var point2 = new THREE.Vector2(parseInt(wallToken.split("/")[1].split(",")[0]), parseInt(wallToken.split("/")[1].split(",")[1]));
		var wall = new THREE.Mesh(
			new THREE.BoxBufferGeometry(point1.distanceTo(point2) * mapscale + 0.3, 1.5, 0.3),
			makeStripedWallMaterial(point1.distanceTo(point2) * mapscale) || material
		);
		var angle = Math.atan2((point1.y - point2.y), (point1.x - point2.x));
		wall.position.set(-(point1.x + point2.x) / 2 * mapscale, 0.75 + wallLevel * LEVEL_HEIGHT, (point1.y + point2.y) / 2 * mapscale);
		wall.rotation.set(0, angle, 0, "YXZ");
		wall.level = wallLevel;
		var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle));
		wall.plane = plane;
		wall.width = point1.distanceTo(point2) * mapscale;
		// Posiciones mundo de los extremos (antes de mutar point1/point2)
		var p1w = new THREE.Vector3(-point1.x * mapscale, 0, point1.y * mapscale);
		var p2w = new THREE.Vector3(-point2.x * mapscale, 0, point2.y * mapscale);
		wall.p1 = point1.multiply(new THREE.Vector2(-mapscale, mapscale));
		wall.p2 = point2.multiply(new THREE.Vector2(-mapscale, mapscale));
		wall.castShadow = true;
		wall.receiveShadow = true;
		map.add(wall);

		if(wallLevel > 0){
			// Pilares en ambos extremos del muro elevado
			[p1w, p2w].forEach(function(pw){
				var pillar = new THREE.Mesh(new THREE.BoxBufferGeometry(0.4, wallLevel * LEVEL_HEIGHT, 0.4), pillarMat);
				pillar.position.set(pw.x, wallLevel * LEVEL_HEIGHT / 2, pw.z);
				pillar.castShadow = true;
				pillar.receiveShadow = true;
				elevGroup.add(pillar);
			});
			elevWalls.push(wall);
		}
	}

	// ---- Suelos de pisos elevados (detecta pasillos entre paredes) ----
	// 1) Agrupa los muros colineales del mismo piso en tramos continuos.
	var wallLists = {};
	for(var wi = 0; wi < elevWalls.length; wi++){
		var w = elevWalls[wi];
		(wallLists[w.level] = wallLists[w.level] || []).push(w);
	}
	// Separación máx. entre paredes paralelas para considerarlas un pasillo
	// (en unidades 3D; generosa para que se rellene cualquier carretera).
	var MAX_SPAN = Math.max(20, mapscale * 8);
	var DEF_DECK = 3.25; // ancho del borde por defecto de un muro sin pared vecina
	for(var lvl in wallLists){
		var walls = wallLists[lvl];
		// 1) tramos (runs) colineales del mismo piso
		var runs = [];
		for(var i = 0; i < walls.length; i++){
			var w = walls[i];
			var wdx = w.p2.x - w.p1.x, wdz = w.p2.y - w.p1.y;
			var wlen = Math.sqrt(wdx * wdx + wdz * wdz);
			if(wlen < 0.001) continue;
			wdx /= wlen; wdz /= wlen;
			var placed = false;
			for(var r = 0; r < runs.length && !placed; r++){
				var run = runs[r];
				if(Math.abs(wdx * run.dx + wdz * run.dz) < 0.995) continue; // no colineal
				// distancia perpendicular del muro al eje del tramo
				var px = w.p1.x - run.x0, pz = w.p1.y - run.z0;
				if(Math.abs(px * run.nx + pz * run.nz) > 0.35) continue; // otra línea
				var t1 = px * run.dx + pz * run.dz;
				var t2 = t1 + wlen * (wdx * run.dx + wdz * run.dz);
				if(Math.max(t1, t2) < run.tMin - 0.3 || Math.min(t1, t2) > run.tMax + 0.3) continue; // separados
				run.tMin = Math.min(run.tMin, t1, t2);
				run.tMax = Math.max(run.tMax, t1, t2);
				placed = true;
			}
			if(!placed){
				runs.push({
					x0: w.p1.x, z0: w.p1.y,
					dx: wdx, dz: wdz, nx: -wdz, nz: wdx,
					tMin: 0, tMax: wlen, rotY: w.rotation.y,
					leftCov: [], rightCov: [], corrW: 0
				});
			}
		}
		// coordenadas físicas de cada tramo según su intervalo [tMin,tMax]
		for(var r = 0; r < runs.length; r++){
			var run = runs[r];
			run.len = run.tMax - run.tMin;
			run.p1x = run.x0 + run.dx * run.tMin; run.p1z = run.z0 + run.dz * run.tMin;
			run.p2x = run.x0 + run.dx * run.tMax; run.p2z = run.z0 + run.dz * run.tMax;
			run.cx = (run.p1x + run.p2x) / 2; run.cz = (run.p1z + run.p2z) / 2;
		}
		// 2) Suelos de pasillo: rellena TODO el hueco entre dos paredes paralelas
		//    enfrentadas (de pared a pared) a lo largo de su solape.
		for(var i = 0; i < runs.length; i++){
			var A = runs[i];
			var bestR = null, bestRd = Infinity, bestRp = 0;
			for(var j = 0; j < runs.length; j++){
				if(j == i) continue;
				var B = runs[j];
				if(Math.abs(A.dx * B.dx + A.dz * B.dz) < 0.85) continue; // no paralelas
				var vx = B.cx - A.cx, vz = B.cz - A.cz;
				var proj = vx * A.nx + vz * A.nz;
				var adist = Math.abs(proj);
				if(adist < 1.5 || adist > MAX_SPAN) continue;
				if(proj > 0 && adist < bestRd){ bestR = B; bestRd = adist; bestRp = proj; }
			}
			// Solo se crea el suelo cuando la vecina está al lado +normal (así cada
			// pareja se genera una única vez; la otra lo registrará como cubierto).
			if(bestR){
				var B = bestR;
				A.corrW = Math.max(A.corrW, Math.abs(bestRp));
				B.corrW = Math.max(B.corrW, Math.abs(bestRp));
				// solape de ambos tramos sobre el eje de A
				var tb1 = (B.p1x - A.p1x) * A.dx + (B.p1z - A.p1z) * A.dz;
				var tb2 = (B.p2x - A.p1x) * A.dx + (B.p2z - A.p1z) * A.dz;
				var lo = Math.max(0, Math.min(tb1, tb2));
				var hi = Math.min(A.len, Math.max(tb1, tb2));
				if(hi - lo >= 0.5){
					var tMid = (lo + hi) / 2;
					var cx = A.p1x + A.dx * tMid + A.nx * (bestRp / 2);
					var cz = A.p1z + A.dz * tMid + A.nz * (bestRp / 2);
					var deck = new THREE.Mesh(
						new THREE.BoxBufferGeometry(hi - lo + 0.3, 0.25, Math.abs(bestRp)),
						deckMat
					);
					deck.position.set(cx, parseInt(lvl) * LEVEL_HEIGHT - 0.15, cz);
					deck.rotation.set(0, A.rotY, 0, "YXZ");
					deck.receiveShadow = true;
					elevGroup.add(deck);
					registerFloor(parseInt(lvl), cx, cz, A.dx, A.dz, (hi - lo + 0.3) / 2, A.nx, A.nz, Math.abs(bestRp) / 2);
					// registrar intervalos cubiertos (con margen para no solapar bordes)
					A.rightCov.push([lo - 0.25, hi + 0.25]);
					var ta1 = (A.p1x - B.p1x) * B.dx + (A.p1z - B.p1z) * B.dz;
					var ta2 = (A.p2x - B.p1x) * B.dx + (A.p2z - B.p1z) * B.dz;
					var plo = Math.max(0, Math.min(ta1, ta2));
					var phi = Math.min(B.len, Math.max(ta1, ta2));
					B.leftCov.push([plo - 0.25, phi + 0.25]);
				}
			}
		}
		// 3) Bordes por defecto en las zonas no cubiertas por un pasillo.
		var levelY = parseInt(lvl) * LEVEL_HEIGHT - 0.15;
		for(var i = 0; i < runs.length; i++){
			var A = runs[i];
			var emitDeck = function(lo, hi, sideSign){
				var tMid = (lo + hi) / 2;
				var cx = A.p1x + A.dx * tMid + A.nx * (sideSign * DEF_DECK / 2);
				var cz = A.p1z + A.dz * tMid + A.nz * (sideSign * DEF_DECK / 2);
				var deck = new THREE.Mesh(
					new THREE.BoxBufferGeometry(Math.max(0.5, hi - lo + 0.2), 0.25, DEF_DECK),
					deckMat
				);
				deck.position.set(cx, levelY, cz);
				deck.rotation.set(0, A.rotY, 0, "YXZ");
				deck.receiveShadow = true;
				elevGroup.add(deck);
				registerFloor(parseInt(lvl), cx, cz, A.dx, A.dz, Math.max(0.5, hi - lo + 0.2) / 2, A.nx, A.nz, DEF_DECK / 2);
			};
			var addDeckSide = function(sideSign){
				var cov = sideSign > 0 ? A.rightCov : A.leftCov;
				// huecos = [0,len] menos los intervalos cubiertos
				var cursor = 0;
				for(var k = 0; k < cov.length; k++){
					var clo = Math.max(0, cov[k][0]), chi = Math.min(A.len, cov[k][1]);
					if(chi <= clo) continue;
					if(clo > cursor + 0.05) emitDeck(cursor, clo, sideSign);
					if(chi > cursor) cursor = chi;
				}
				if(A.len - cursor > 0.05) emitDeck(cursor, A.len, sideSign);
			};
			addDeckSide(1);
			addDeckSide(-1);
		}
		// 4) Esquinas: rellena la unión de dos tramos que se encuentran en ángulo
		//    (curvas y esquinas) para que el suelo del nivel sea continuo y con hitbox.
		var cornerDist = Math.max(2, DEF_DECK);
		var cornerSeen = {};
		for(var i = 0; i < runs.length; i++){
			var A = runs[i];
			var aEnds = [[A.p1x, A.p1z], [A.p2x, A.p2z]];
			for(var j = i + 1; j < runs.length; j++){
				var B = runs[j];
				if(Math.abs(A.dx * B.dx + A.dz * B.dz) >= 0.85) continue; // paralelas: el pasillo ya las une
				var bEnds = [[B.p1x, B.p1z], [B.p2x, B.p2z]];
				for(var ea = 0; ea < 2; ea++){
					for(var eb = 0; eb < 2; eb++){
						var dxe = aEnds[ea][0] - bEnds[eb][0];
						var dze = aEnds[ea][1] - bEnds[eb][1];
						var dd = Math.sqrt(dxe * dxe + dze * dze);
						if(dd > cornerDist) continue;
						var key = i + "_" + j + "_" + ea + "_" + eb;
						if(cornerSeen[key]) continue;
						cornerSeen[key] = true;
						// punto de unión (mitad entre los dos extremos cercanos)
						var jx = (aEnds[ea][0] + bEnds[eb][0]) / 2;
						var jz = (aEnds[ea][1] + bEnds[eb][1]) / 2;
						// tamaño: cubre el pasillo más ancho de los dos tramos
						var wA = A.corrW || DEF_DECK;
						var wB = B.corrW || DEF_DECK;
						var side = Math.max(wA, wB) + 1;
						// orientación: bisectriz de las dos direcciones
						var angA = Math.atan2(A.dz, A.dx);
						var angB = Math.atan2(B.dz, B.dx);
						var diff = angB - angA;
						while(diff > Math.PI) diff -= Math.PI * 2;
						while(diff < -Math.PI) diff += Math.PI * 2;
						var mid = angA + diff / 2;
						var corner = new THREE.Mesh(
							new THREE.BoxBufferGeometry(side, 0.25, side),
							deckMat
						);
						corner.position.set(jx, levelY - 0.02, jz);
						corner.rotation.set(0, mid, 0, "YXZ");
						corner.receiveShadow = true;
						elevGroup.add(corner);
						registerFloor(parseInt(lvl), jx, jz, Math.cos(mid), Math.sin(mid), side / 2, -Math.sin(mid), Math.cos(mid), side / 2);
					}
				}
			}
		}
	}
	generateAsphalt();
	scene.add(map);

	// ---- Rampas (secci\u00f3n 6: x1,y1/x2,y2@from-to) - rect\u00e1ngulo que conecta dos pisos ----
	ramps = [];
	var rampdataRaw = tcode.innerHTML.trim().split("|")[5];
	if(rampdataRaw && rampdataRaw.trim()){
		var rampTokens = rampdataRaw.trim().split(" ");
		for(var i = 0; i < rampTokens.length; i++){
			if(rampTokens[i] == "")
				continue;
			var rt = rampTokens[i];
			var rFrom = 0, rTo = 1;
			var atI = rt.indexOf("@");
			if(atI >= 0){
				var fl = rt.substring(atI + 1);
				var dash = fl.indexOf("-");
				if(dash >= 0){
					rFrom = parseInt(fl.substring(0, dash)) || 0;
					rTo = parseInt(fl.substring(dash + 1)) || 0;
				}else{
					rFrom = parseInt(fl) || 0;
					rTo = rFrom + 1;
				}
				rt = rt.substring(0, atI);
			}
			var pts = rt.split("/");
			if(pts.length < 2)
				continue;
			var ra = new THREE.Vector2(parseInt(pts[0].split(",")[0]), parseInt(pts[0].split(",")[1]));
			var rb = new THREE.Vector2(parseInt(pts[1].split(",")[0]), parseInt(pts[1].split(",")[1]));
			ramps.push({
				a: ra, b: rb, from: rFrom, to: rTo,
				ax: -ra.x * mapscale, az: ra.y * mapscale,
				bx: -rb.x * mapscale, bz: rb.y * mapscale
			});
			var rampMesh = buildRampMesh(ra, rb, rFrom, rTo);
			if(rampMesh)
				elevGroup.add(rampMesh);
		}
	}
	scene.add(elevGroup);

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
		// Línea elevada a 0.06 para que su cara superior (0.11) quede por encima
		// de la del asfalto (0.05): antes coincidían exactamente y provocaban
		// z-fighting (la meta y los checkpoints parpadeaban / se glitcheaban).
		wall.position.set(-(point1.x + point2.x) / 2 * mapscale, 0.06, (point1.y + point2.y) / 2 * mapscale);
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
	var grassTex = makeGrassTexture();
	var groundMat = grassTex
		? new THREE.MeshLambertMaterial({color: new THREE.Color(0xffffff), map: grassTex})
		: new THREE.MeshLambertMaterial({color: new THREE.Color(0x57c115), emissive: new THREE.Color(0x0f0f0f), emissiveMap: stripes});
	var ground = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(1000, 1000),
		groundMat
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

	return varsCode;
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

		if(!soloMode && database && me.ref && me.ref.key){
			// Listen (for our whole time in the race) to how many people are watching US, and show it only to ourselves.
			var myId = me.ref.key;
			database.ref(code + "/players/" + myId + "/spectators").on("value", function(snap){
				var count = snap.exists() ? Object.keys(snap.val()).length : 0;
				var countEl = document.getElementById("eyeCount");
				if(countEl) countEl.innerHTML = count;
				eyeBadge.style.display = count > 0 ? "flex" : "none";
			});
		}

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
		queueBanner(escapeHtml(playerName) + " termin\u00f3 el " + place + "\u00ba");
}

function queueLastLapBanner(playerName){
	console.log("queueLastLapBanner:", playerName);
		queueBanner("\u00a1" + escapeHtml(playerName) + " le queda una vuelta!");
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
		if(nameEl) nameEl.innerHTML = targetPlayer && targetPlayer.data ? escapeHtml(targetPlayer.data.name) : "";
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
				+ escapeHtml(s.name).substring(0, 20) + "</span><span class='fstime'>"
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
	if(map) deleteMap();
	eval(loadMap());
	if(joined) return;
	joined = true;

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
				+ "<span class='lbname'>" + (s.finishedPlace ? "\uD83C\uDFC1 " : "") + escapeHtml(s.name).substring(0, 20) + "</span>"
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

		if(gameStarted && !paused){
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

					// ---- Multinivel: altura del coche (h) ----
					if(play.data.h == null) play.data.h = 0;
					var targetH = 0;
					var onRamp = false;
					var pos2d = new THREE.Vector2(play.data.x, play.data.y);
					for(var r = 0; r < ramps.length; r++){
						var rp = ramps[r];
						// \u00bfEst\u00e1 el coche dentro del rect\u00e1ngulo de la rampa (con margen)?
						var pad = 1.2;
						if(play.data.x < Math.min(rp.ax, rp.bx) - pad || play.data.x > Math.max(rp.ax, rp.bx) + pad ||
						   play.data.y < Math.min(rp.az, rp.bz) - pad || play.data.y > Math.max(rp.az, rp.bz) + pad)
							continue;
						var gp = new THREE.Vector2(-play.data.x / mapscale, play.data.y / mapscale);
						var t = rampAxisT(gp, rp.a, rp.b);
						targetH = rp.from + (rp.to - rp.from) * t;
						onRamp = true;
						break;
					}
					// Suelo con hitbox bajo el coche: el nivel más alto de suelo elevado que
					// contiene al coche y que está a la altura del coche (o por debajo).
					// Si el coche está bajo un paso elevado, ese suelo se ignora (no sube).
					if(!onRamp){
						var floorLvl = 0;
						for(var fi = 0; fi < elevFloors.length; fi++){
							var fl = elevFloors[fi];
						if(fl.level < 1 || fl.level > play.data.h + 0.15) continue;
						var rx = play.data.x - fl.cx, rz = play.data.y - fl.cz;
						var along = rx * fl.ux + rz * fl.uz;
						var across = rx * fl.vx + rz * fl.vz;
						if(Math.abs(along) <= fl.hx + 0.5 && Math.abs(across) <= fl.hz + 0.5 && fl.level > floorLvl)
							floorLvl = fl.level;
						}
						if(floorLvl > 0){
							targetH = floorLvl;
						}else{
							targetH = 0;
							// Compatibilidad: si no hay suelo bajo el coche pero está junto a un
							// muro elevado de su nivel actual, se mantiene arriba (mapas antiguos).
							var curLvl = Math.round(play.data.h);
							if(curLvl > 0){
								for(var w in map.children){
									var wall = map.children[w];
									if(!wall.level || wall.level != curLvl) continue;
									var wap = pos2d.clone().sub(wall.p1);
									var wab = wall.p2.clone().sub(wall.p1);
									var wabLen2 = wab.lengthSq();
									if(wabLen2 < 0.001) continue;
									var wt = Math.max(0, Math.min(1, wap.dot(wab) / wabLen2));
									var wclosest = wall.p1.clone().add(wab.clone().multiplyScalar(wt));
									if(pos2d.distanceTo(wclosest) < 3.2){
										targetH = curLvl;
										break;
									}
								}
							}
						}
					}
					if(targetH < play.data.h - 0.05 && !onRamp)
						play.data.falling = true;
					// Gravedad: sobre una rampa el coche sigue la superficie casi al
					// momento (sobre todo al bajar, para que no flote); al caer, baja
					// rápido; en llano/soportado, transición suave.
					var hRate = onRamp ? 0.5 : (play.data.falling ? 0.3 : 0.08);
					play.data.h += (targetH - play.data.h) * Math.min(1, hRate * warp);
					play.data.h = Math.max(0, play.data.h);
					if(play.data.h <= 0.05)
						play.data.falling = false;

					play.model.position.x = play.data.x + play.data.xv;
					play.model.position.y = 0.6 + play.data.h * LEVEL_HEIGHT;
					play.model.position.z = play.data.y + play.data.yv;

					// ---- Inclinación del coche según la pendiente de la rampa ----
					// Mide la altura real de la rampa delante y detrás del coche en su
					// dirección de marcha y calcula el ángulo de inclinación (pitch).
					// La velocidad no cambia: solo se rota el modelo para que parezca
					// que sube/baja la cuesta en lugar de atravesarla. Se guarda en
					// carPitch (no en play.data) para no sincronizarlo por Firebase.
					var pitchTarget = 0;
					var fwdStep = 2; // unidades de mundo por delante
					var hNow = rampHeightAt(play.data.x, play.data.y);
					var hAhead = rampHeightAt(
						play.data.x + Math.sin(play.data.dir) * fwdStep,
						play.data.y + Math.cos(play.data.dir) * fwdStep
					);
					if(hNow != null && hAhead != null)
						pitchTarget = Math.atan2((hAhead - hNow) * LEVEL_HEIGHT, fwdStep);
					if(carPitch[p] == null) carPitch[p] = 0;
					carPitch[p] += (pitchTarget - carPitch[p]) * Math.min(1, 0.12 * warp);
					// order 'YXZ': primero el giro (dir) sobre Y y luego el cabeceo sobre
					// el eje lateral local del coche, que es lo que queremos para las rampas.
					play.model.rotation.order = "YXZ";
					play.model.rotation.y = play.data.dir;
					play.model.rotation.x = -carPitch[p];

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
						if(wall.level != Math.floor(play.data.h + 0.05)) continue;
						var posi = new THREE.Vector2(play.data.x, play.data.y);
						if(Math.abs(wall.plane.distanceToPoint(play.model.position.clone().sub(wall.position))) < WALL_SIZE){
							// Distancia 2D (ignorando Y): con pistas multinivel el coche puede estar por debajo/encima
							var wallDist2d = Math.hypot(wall.position.x - play.model.position.x, wall.position.z - play.model.position.z);
							if(wallDist2d < wall.width / 2){
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
						if(Math.round(play.data.h) != 0) break; // Los checkpoints solo cuentan en nivel 0
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

					if(play.data.lap >= LAPS && !play.data.finishedPlace && p == myId){
						if(soloMode == "crono"){
							// Solo cronometraje: just record our own finish locally.
							me.data.finishedPlace = 1;
							me.data.finishTime = raceStartTime ? Date.now() - raceStartTime : null;
							myFinishTime = Date.now();
						}else{
							claimFinishPlace();
						}
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
						play.data.h = 0;
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
						(specPlayer.model.position.y || 0) + 2.4,
						specPlayer.model.position.z + -Math.cos(-specPlayer.model.rotation.y) * 5
					);
					camera.position.set(
						camera.position.x * Math.pow(CAMERA_LAG, warp) + specTarget.x * (1 - Math.pow(CAMERA_LAG, warp)),
						camera.position.y * Math.pow(CAMERA_LAG, warp) + specTarget.y * (1 - Math.pow(CAMERA_LAG, warp)),
						camera.position.z * Math.pow(CAMERA_LAG, warp) + specTarget.z * (1 - Math.pow(CAMERA_LAG, warp))
					);
					camera.lookAt(specPlayer.model.position);
				}
			}else{
				var camY = (me.model.position.y || 0) + 2.4;
				var target = new THREE.Vector3(
					me.model.position.x + Math.sin(-me.model.rotation.y) * 5,
					camY,
					me.model.position.z + -Math.cos(-me.model.rotation.y) * 5
				);
				camera.position.set(
					camera.position.x * Math.pow(CAMERA_LAG, warp) + target.x * (1 - Math.pow(CAMERA_LAG, warp)),
					camera.position.y * Math.pow(CAMERA_LAG, warp) + camY * (1 - Math.pow(CAMERA_LAG, warp)),
					camera.position.z * Math.pow(CAMERA_LAG, warp) + target.z * (1 - Math.pow(CAMERA_LAG, warp))
				);
				// En bajadas (pitch negativo) inclinamos la cámara hacia abajo para ver
				// más carretera; en subidas se deja igual.
				var myPitch = carPitch[myId] || 0;
				var lookY = me.model.position.y;
				if(myPitch < -0.02)
					lookY += myPitch * 5;
				camera.lookAt(new THREE.Vector3(me.model.position.x, lookY, me.model.position.z));

				if(myFinishTime && !spectating && Date.now() - myFinishTime >= 3000){
					try{ enterSpectatorMode(); }catch(e){ console.error("enterSpectatorMode error:", e); }
				}
			}

			if(typeof me.ref.set == "function" && !soloMode) me.ref.set(me.data);

			if(lap) lap.innerHTML = me.data.lap <= LAPS && soloMode != "entreno" ? me.data.lap + "/" + LAPS : "";

			if(raceTimerEl && soloMode != "entreno"){
				if(me.data.finishedPlace > 0 && me.data.finishTime != null){
					raceTimerEl.innerHTML = formatTime(me.data.finishTime);
				}else if(raceStartTime){
					raceTimerEl.innerHTML = formatTime(Date.now() - raceStartTime);
				}
			}
			if(soloMode != "entreno") updateLeaderboard();
		}else if(!paused){
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
	if(incode.value.length > 5){
		incode.value = incode.value.substring(0, 5);
		return;
	}
	// Only act when 4 or 5 chars were typed.
	if(incode.value.length != 4 && incode.value.length != 5){
		incode.onkeyup = codeCheck;
		return;
	}
	incode.onkeyup = null;
	code = incode.value.toUpperCase();
	lobbyIsCustom = (code.length == 5);
	database.ref(code).once("value", function(cc){
		var cv = cc.val();
		if(typeof cv != "undefined" && cv != null && cv.status === 0){
			// Found a valid room. Show lobby (ready-check). For custom-map (5-char) rooms,
			// pull the map data from Firebase and load it locally.
			database.ref(code + "/map").once("value", function(mapsnap){
				if(mapsnap.val() != null){
					document.getElementById("trackcode").innerHTML = mapsnap.val();
					deleteMap();
					eval(loadMap());
				}
			});

			// Build the lobby UI (mirrors host's lobby layout, minus the action-sheet).
			var loader = document.createElement("DIV");
			loader.id = "loader";
			loader.innerHTML = "<div class='title' id='loader-title'>Entrando en la sala...</div>";
			f.style.transform = "translate3d(0, -100vh, 0)";
			setTimeout(function(){
				f.innerHTML =
					"<div class='info title'>C\u00f3digo de la sala<div id='code'>" + code + "</div>" +
					"<div class='subtitle'>" + (lobbyIsCustom ? "Mapa personalizado" : "Mapa predeterminado") + "</div>" +
					"</div>" +
					"<div id='lobbylist'></div>" +
					"<div class='menuitem title button ready-btn' id='readybtn' ontouchstart='this.click()' onclick='toggleReady()'>Estoy listo</div>";
				if(VR) f.innerHTML += "<div id='divider'></div>";
				f.appendChild(element);
				f.style.transform = "none";

				var playerCount = 0;
				// First, snapshot the players currently in the room.
				var existingPlayers = cv.players || {};
				for(var pid in existingPlayers){
					playerCount++;
					players[pid] = {
						data: existingPlayers[pid],
						model: new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 2))
					};
					var pl = players[pid];
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
						label.innerHTML = escapeHtml(pl.data.name).substring(0, 50) + "<br/>|";
					pl.label = label;
					label.position = pl.model.position;
					f.appendChild(label);
					labels.push(label);
					pl.model.receiveShadow = true;
					scene.add(pl.model);
				}

				// Listen for further additions / changes / removals.
				database.ref(code + "/players").on("child_added", function(p){
					var pid = p.ref_.path.pieces_[2];
					if(typeof players[pid] != "undefined") return;
					players[pid] = {
						data: p.val(),
						model: new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 2))
					};
					var pl = players[pid];
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
						label.innerHTML = escapeHtml(pl.data.name).substring(0, 50) + "<br/>|";
					pl.label = label;
					label.position = pl.model.position;
					f.appendChild(label);
					labels.push(label);
					pl.model.receiveShadow = true;
					scene.add(pl.model);

					if(p.ref_.path.pieces_[2] == me.ref.path.pieces_[2]){
						me.label = pl.label;
						me.model = pl.model;
						me.label.innerHTML = "";
					}
					renderLobbyList();
				});

				database.ref(code + "/players").on("child_changed", function(p){
					var pid = p.ref_.path.pieces_[2];
					if(players[pid]) players[pid].data = p.val();
					renderLobbyList();
				});
				database.ref(code + "/players").on("child_removed", function(p){
					var pid = p.ref_.path.pieces_[2];
					if(players[pid]){
						if(players[pid].model) scene.remove(players[pid].model);
						if(players[pid].label && players[pid].label.parentNode) players[pid].label.parentNode.removeChild(players[pid].label);
						var li = labels.indexOf(players[pid].label);
						if(li >= 0) labels.splice(li, 1);
						delete players[pid];
					}
					renderLobbyList();
				});

				me.ref = database.ref(code + "/players").push();
				me.data = {
					x: carPos[playerCount] && carPos[playerCount].x != null ? carPos[playerCount].x : 0,
					y: carPos[playerCount] && carPos[playerCount].y != null ? carPos[playerCount].y : 0,
					h: 0,
					xv: 0,
					yv: 0,
					dir: 0,
					steer: 0,
					color: color,
					name: name,
					checkpoint: 0,
					lap: 0,
					ready: false,
					collision: {}
				}
				me.ref.set(me.data);
				renderLobbyList();

				// Auto-start race when host flips status.
				database.ref(code + "/status").on("value", function(v){
					v = v.val();
					if(v == 1){
						startHostedRace();
					}
				});
			}, 500);
		}else{
			// Room not found / not joinable: enable typing again.
			incode.onkeyup = codeCheck;
			alert("No se encontr\u00f3 ninguna sala con ese c\u00f3digo, o ya est\u00e1 cerrada.");
		}
	});
	}

	function startGame(){
	database.ref(code + "/status").set(1);
}

window.onkeydown = function(e){
	if(e.keyCode == 37)
		left = true;
	if(e.keyCode == 39)
		right = true;
	if(e.keyCode == 27) // Esc: pausa/contin\u00faa en entrenamiento
		togglePause();
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
		document.getElementById("trackcode").innerText = prompt("Datos del mapa?")
}
