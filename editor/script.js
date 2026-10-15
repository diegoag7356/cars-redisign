var walls = [];
var start = [];
var trees = [];
var arrows = [];
var ramps = [];
var erase = [];
var hist = [];
var capa = 0; // Capa (piso) actual de dibujo: 0 = suelo, 1, 2...
var pendingRamp = null; // Rect\u00e1ngulo de rampa en curso: {a, b}
var rampDir = "up";     // Piso destino elegido en el di\u00e1logo: 'up' | 'down'
var rampFloor = 1;      // Piso destino elegido en el di\u00e1logo
var rampSide = "e";     // Hacia dónde sube la rampa en el mapa: 'n'|'s'|'e'|'w'

// ---- Previsualización 3D del juego --------------------------------------
// La vista usa el propio index.html/script.js del juego dentro de un iframe,
// no un renderizador aproximado del editor.
var mode3D = false;
var previewFrame = null;
var FLOOR_H = 6;
var toolStart = {x: 0, y: 0};

function markDirty(){
	if(mode3D) syncGamePreview();
}

var mouse = {
	down: false,
	start: {
		x: 0,
		y: 0
	},
	cur: {
		x: 0,
		y: 0
	},
	end: {
		x: 0,
		y: 0
	}
}
var sel = 0;
var s = document.getElementById("menu");
var ca = document.getElementById("c");
var height = ca.clientHeight * window.devicePixelRatio;
var width = ca.clientWidth * window.devicePixelRatio;
ca.height = height;
ca.width = width;
var scale = 40; // Zoom fijo x4: no hay controles para cambiarlo
var offset = {x: width % scale / 2, y : height % scale / 2}
var c = ca.getContext("2d");
c.lineCap = "round";
c.lineWidth = 2;
function drawBG(){
	c.clearRect(0, 0, width, height);
	c.strokeStyle="#C0C0C0";
	c.beginPath();
	for(var x = offset.x - scale; x < width; x += scale){
		c.moveTo(x, 0);
		c.lineTo(x, height);
	}
	for(var y = offset.y - scale; y < height; y += scale){
		c.moveTo(0, y);
		c.lineTo(width, y);
	}
	c.stroke();
}
drawBG();

function update(){
	requestAnimationFrame(update);
	height = ca.clientHeight * window.devicePixelRatio;
	width = ca.clientWidth * window.devicePixelRatio;
	ca.height = height;
	ca.width = width;
	drawBG();
	c.fillStyle="#08cc3c";
	c.beginPath();
	c.moveTo(width / 2, height / 2 - 10 - scale / 2);
	c.lineTo(width / 2 - 5, height / 2 + 5 - scale / 2);
	c.lineTo(width / 2 + 5, height / 2 + 5 - scale / 2);
	c.fill();
	c.translate(offset.x, offset.y);
	c.lineCap = "round";
	c.lineWidth = 2;
	var wallColors = ["#f48342", "#42a5f5", "#66bb6a", "#ffd54f", "#ff8a65"];
	for(var i = 0; i < walls.length; i++){
		var wl = walls[i].level || 0;
		if(wl > capa) continue; // las capas superiores se ocultan
		var lower = wl < capa;
		c.strokeStyle = wallColors[Math.min(wl, wallColors.length - 1)] || "#f48342";
		c.lineWidth = wl > 0 ? 3 : 2;
		c.setLineDash(lower ? [4, 4] : []);
		c.globalAlpha = lower ? 0.45 : 1;
		c.beginPath();
		c.moveTo(scale * walls[i].start.x, scale * walls[i].start.y);
		c.lineTo(scale * walls[i].end.x, scale * walls[i].end.y);
		c.stroke();
		c.setLineDash([]);
		c.globalAlpha = 1;
		c.lineWidth = 2;
		if(wl > 0 && !lower){
			c.fillStyle = "#fff";
			c.font = "9px Arial";
			c.fillText("N" + wl, scale * (walls[i].start.x + walls[i].end.x) / 2 - 4, scale * (walls[i].start.y + walls[i].end.y) / 2 - 4);
		}
	}
	c.strokeStyle="#428ff4";
	c.beginPath();
	for(var i = 0; i < start.length && i < 1; i++){
		c.moveTo(scale * start[i].start.x, scale * start[i].start.y);
		c.lineTo(scale * start[i].end.x, scale * start[i].end.y);
	}
	c.stroke();
	c.strokeStyle="#f00";
	c.beginPath();
	for(var i = 1; i < start.length; i++){
		c.moveTo(scale * start[i].start.x, scale * start[i].start.y);
		c.lineTo(scale * start[i].end.x, scale * start[i].end.y);
	}
	c.stroke();
	c.fillStyle="#08cc3c";
	for(var i = 0; i < trees.length; i++){
		c.beginPath();
		c.arc(scale * trees[i].x, scale * trees[i].y, 5, 0, 2 * Math.PI);
		c.fill();
	}
	c.fillStyle="#f00";
	c.beginPath();
	for(var i = 0; i < arrows.length; i++){
		c.moveTo(scale * arrows[i].x, scale * arrows[i].y);
		c.lineTo(scale * arrows[i].x - scale * Math.cos(arrows[i].angle) / 2, scale * arrows[i].y - scale * Math.sin(arrows[i].angle) / 2);
	}
	c.stroke();
	// Rampas: rect\u00e1ngulo con flecha de direcci\u00f3n (from \u2192 to)
	for(var i = 0; i < ramps.length; i++){
		var rp = ramps[i];
		if((rp.level || 0) > capa) continue;
		var lower = (rp.level || 0) < capa;
		c.setLineDash(lower ? [4, 4] : []);
		c.globalAlpha = lower ? 0.45 : 1;
		var ax = scale * rp.a.x, ay = scale * rp.a.y;
		var bx = scale * rp.b.x, by = scale * rp.b.y;
		var minX = Math.min(ax, bx), minY = Math.min(ay, by);
		var w = Math.abs(bx - ax), h = Math.abs(by - ay);
		c.fillStyle = "rgba(224, 64, 251, 0.18)";
		c.fillRect(minX, minY, w, h);
		c.strokeStyle = "#e040fb";
		c.lineWidth = 2;
		c.strokeRect(minX, minY, w, h);
		c.setLineDash([]);
		c.lineWidth = 2;
		// Flecha en el centro apuntando la direcci\u00f3n from\u2192to (de a hacia b)
		var mx = (ax + bx) / 2, my = (ay + by) / 2;
		var aAng = Math.atan2(by - ay, bx - ax);
		var aL = 10;
		c.strokeStyle = "#fff";
		c.beginPath();
		c.moveTo(mx - aL * Math.cos(aAng), my - aL * Math.sin(aAng));
		c.lineTo(mx + aL * Math.cos(aAng), my + aL * Math.sin(aAng));
		c.moveTo(mx + aL * Math.cos(aAng), my + aL * Math.sin(aAng));
		c.lineTo(mx + (aL - 4) * Math.cos(aAng) - 4 * Math.cos(aAng - Math.PI / 2), my + (aL - 4) * Math.sin(aAng) - 4 * Math.sin(aAng - Math.PI / 2));
		c.moveTo(mx + aL * Math.cos(aAng), my + aL * Math.sin(aAng));
		c.lineTo(mx + (aL - 4) * Math.cos(aAng) + 4 * Math.cos(aAng - Math.PI / 2), my + (aL - 4) * Math.sin(aAng) + 4 * Math.sin(aAng - Math.PI / 2));
		c.stroke();
		c.fillStyle = "#e040fb";
		c.font = "9px Arial";
		c.fillText((rp.from != null ? rp.from : (rp.level || 0)) + "\u2192" + (rp.to != null ? rp.to : (rp.level || 0) + 1), minX + 4, minY + 10);
		c.globalAlpha = 1;
	}
	// Rect\u00e1ngulo de rampa en curso
	if(pendingRamp){
		var pax = scale * pendingRamp.a.x, pay = scale * pendingRamp.a.y;
		var pbx = scale * pendingRamp.b.x, pby = scale * pendingRamp.b.y;
		c.setLineDash([6, 4]);
		c.strokeStyle = "#e040fb";
		c.lineWidth = 2;
		c.strokeRect(Math.min(pax, pbx), Math.min(pay, pby), Math.abs(pbx - pax), Math.abs(pby - pay));
		c.setLineDash([]);
	}	c.translate(-offset.x, -offset.y);
}

update();

function select(n){
	sel = n;
	for(var i = 0; i < s.children.length - 1; i++)
		s.children[i].className = "button" + (i == n ? " selected" : "");
}

function setCapa(n){
	capa = Math.max(0, Math.min(4, n));
	var el = document.getElementById("capaval");
	if(el) el.innerHTML = capa;
	markDirty(); // el plano de dibujo 3D cambia de altura
}

function adjCapa(d){
	setCapa(capa + d);
}

// ---- Di\u00e1logo de rampa: rect\u00e1ngulo ya dibujado, se elige direcci\u00f3n y piso ----
function openRampDialog(){
	if(!pendingRamp)
		return;
	// Regla: en la capa 0 solo se puede subir
	if(capa == 0){
		rampDir = "up";
		document.getElementById("rdDown").classList.add("disabled");
	}else{
		rampDir = "up";
		document.getElementById("rdDown").classList.remove("disabled");
	}
	rampFloor = capa + 1;
	// Dirección de la subida: por defecto la que marca el arrastre (a -> b),
	// restringida al eje más largo del rectángulo (el juego usa como eje de la
	// rampa la dimensión dominante, así que el extremo que sube es un final de
	// ese lado). Coordenadas: +x es derecha, +y es abajo en pantalla.
	var w = Math.abs(pendingRamp.b.x - pendingRamp.a.x);
	var h = Math.abs(pendingRamp.b.y - pendingRamp.a.y);
	if(w >= h)
		rampSide = pendingRamp.b.x >= pendingRamp.a.x ? "e" : "w";
	else
		rampSide = pendingRamp.b.y >= pendingRamp.a.y ? "s" : "n";
	updateRampDialog();
	document.getElementById("rampDialog").style.display = "block";
}

function setRampSide(dir){
	rampSide = dir;
	updateRampDialog();
}

function setRampDir(dir){
	// Regla: en la capa 0 las rampas solo pueden subir
	if(capa == 0 && dir == "down")
		return;
	rampDir = dir;
	rampFloor = dir == "up" ? Math.min(4, capa + 1) : Math.max(0, capa - 1);
	updateRampDialog();
}

function adjRampFloor(d){
	var maxF = rampDir == "up" ? 4 : capa - 1;
	var minF = rampDir == "up" ? capa + 1 : 0;
	rampFloor = Math.max(minF, Math.min(maxF, rampFloor + d));
	updateRampDialog();
}

function updateRampDialog(){
	var up = document.getElementById("rdUp");
	var down = document.getElementById("rdDown");
	up.className = "rd-dir" + (rampDir == "up" ? " sel" : "");
	down.className = "rd-dir" + (rampDir == "down" ? " sel" : "");
	if(capa == 0)
		down.classList.add("disabled");
	// Botones de dirección de la subida: solo habilitados los del eje largo
	var pw = pendingRamp ? Math.abs(pendingRamp.b.x - pendingRamp.a.x) : 0;
	var ph = pendingRamp ? Math.abs(pendingRamp.b.y - pendingRamp.a.y) : 0;
	var horizontal = pw >= ph;
	var sides = ["n", "s", "e", "w"];
	for(var i = 0; i < sides.length; i++){
		var el = document.getElementById("rdSide" + sides[i].toUpperCase());
		if(!el) continue;
		var verticalEnabled = !horizontal && (sides[i] == "n" || sides[i] == "s");
		var horizontalEnabled = horizontal && (sides[i] == "e" || sides[i] == "w");
		var cls = "rd-dir" + (rampSide == sides[i] ? " sel" : "");
		if(!verticalEnabled && !horizontalEnabled)
			cls += " disabled";
		el.className = cls;
	}
	var fv = document.getElementById("rdFloorVal");
	if(fv) fv.innerHTML = rampFloor;
	drawRampPreview();
}

// Vista lateral 2D de c\u00f3mo quedar\u00e1 la rampa seg\u00fan el piso elegido
function drawRampPreview(){
	var cv = document.getElementById("rdPreview");
	if(!cv) return;
	var ctx = cv.getContext("2d");
	ctx.clearRect(0, 0, cv.width, cv.height);
	var W = cv.width, H = cv.height;
	var floorGap = (H - 24) / 5; // hasta piso 4
	// L\u00edneas de piso
	ctx.strokeStyle = "rgba(255,255,255,0.25)";
	ctx.lineWidth = 1;
	for(var f = 0; f <= 4; f++){
		var y = H - 12 - f * floorGap;
		ctx.beginPath();
		ctx.moveTo(8, y);
		ctx.lineTo(W - 8, y);
		ctx.stroke();
		ctx.fillStyle = "rgba(255,255,255,0.5)";
		ctx.font = "9px Arial";
		ctx.fillText("P" + f, 2, y + 3);
	}
	// Flecha de la rampa (de from a to)
	var yFrom = H - 12 - capa * floorGap;
	var yTo = H - 12 - rampFloor * floorGap;
	ctx.strokeStyle = "#e040fb";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(30, yFrom);
	ctx.lineTo(W - 30, yTo);
	ctx.stroke();
	// Punta de flecha
	var ang = Math.atan2(yTo - yFrom, (W - 30) - 30);
	ctx.fillStyle = "#e040fb";
	ctx.beginPath();
	ctx.moveTo(W - 30, yTo);
	ctx.lineTo(W - 30 - 12 * Math.cos(ang - 0.4), yTo - 12 * Math.sin(ang - 0.4));
	ctx.lineTo(W - 30 - 12 * Math.cos(ang + 0.4), yTo - 12 * Math.sin(ang + 0.4));
	ctx.fill();
	// Etiquetas
	ctx.fillStyle = "#fff";
	ctx.font = "bold 11px Arial";
	ctx.fillText("Piso " + capa, 30, yFrom - 4);
	ctx.fillText("Piso " + rampFloor, W - 70, yTo - 4);
}

function acceptRamp(){
	if(!pendingRamp)
		return;
	// Guard: rechazar rectángulos de tamaño cero (un clic sin arrastrar)
	if(Math.abs(pendingRamp.b.x - pendingRamp.a.x) < 1 && Math.abs(pendingRamp.b.y - pendingRamp.a.y) < 1){
		pendingRamp = null;
		document.getElementById("rampDialog").style.display = "none";
		alert("Arrastra para dibujar el rectángulo de la rampa.");
		return;
	}
	// Esquinas a/b del rectángulo según la dirección de la subida elegida:
	// el juego calcula la altura proyectando sobre la dimensión dominante de
	// b-a, así que a debe quedar en el extremo bajo del eje de la subida.
	var minX = Math.min(pendingRamp.a.x, pendingRamp.b.x), maxX = Math.max(pendingRamp.a.x, pendingRamp.b.x);
	var minY = Math.min(pendingRamp.a.y, pendingRamp.b.y), maxY = Math.max(pendingRamp.a.y, pendingRamp.b.y);
	var w = maxX - minX, h = maxY - minY;
	var hzt = w >= h; // eje de la subida horizontal cuando el lado largo es el X
	var rA, rB;
	if(hzt){
		if(rampSide == "w"){
			rA = {x: maxX, y: maxY};
			rB = {x: minX, y: minY};
		}else{
			rA = {x: minX, y: minY};
			rB = {x: maxX, y: maxY};
		}
	}else{
		if(rampSide == "n"){
			rA = {x: minX, y: maxY};
			rB = {x: maxX, y: minY};
		}else{
			rA = {x: minX, y: minY};
			rB = {x: maxX, y: maxY};
		}
	}
	ramps.push({
		a: rA,
		b: rB,
		// level = piso más bajo: así la rampa se ve en el piso al que baja también
		level: Math.min(capa, rampFloor),
		from: capa,
		to: rampFloor
	});
	hist.push(4);
	pendingRamp = null;
	document.getElementById("rampDialog").style.display = "none";
	// Al poner una rampa, se crea/activa la capa destino autom\u00e1ticamente
	setCapa(rampFloor);
}

function cancelRamp(){
	pendingRamp = null;
	document.getElementById("rampDialog").style.display = "none";
}

function gridX(x){
	return Math.round((x * window.devicePixelRatio - offset.x) / scale);
}

function gridY(x){
	return Math.round((x * window.devicePixelRatio - offset.y) / scale);
}

// ---- Herramientas compartidas (editor 2D y modo 3D) --------------------
// Reciben coordenadas de rejilla, así que el ratón del editor 2D y el
// raycasting del modo 3D usan exactamente la misma lógica y el mismo undo.
function startTool(gx, gy){
	toolStart.x = gx;
	toolStart.y = gy;
	if(sel == 0)
		walls.push({start: {x: gx, y: gy}, end: {x: gx, y: gy}, level: capa});
	if(sel == 1)
		start.push({start: {x: gx, y: gy}, end: {x: gx, y: gy}, level: capa});
	if(sel == 2)
		trees.push({x: gx, y: gy});
	if(sel == 3)
		arrows.push({x: gx, y: gy, angle: 0});
	if(sel == 4)
		pendingRamp = {a: {x: gx, y: gy}, b: {x: gx, y: gy}};
	if(sel == 5)
		eraseL(gx, gy);
	markDirty();
}

function moveTool(gx, gy){
	if(sel == 0){
		walls[walls.length - 1].end.x = gx;
		walls[walls.length - 1].end.y = gy;
	}
	if(sel == 1){
		start[start.length - 1].end.x = gx;
		start[start.length - 1].end.y = gy;
	}
	if(sel == 2){
		trees.push({x: gx, y: gy});
		hist.push(sel);
	}
	if(sel == 3)
		arrows[arrows.length - 1].angle = Math.atan2(toolStart.y - gy, toolStart.x - gx);
	if(sel == 4 && pendingRamp){
		pendingRamp.b.x = gx;
		pendingRamp.b.y = gy;
	}
	if(sel == 5)
		eraseL(gx, gy);
	markDirty();
}

function endTool(gx, gy){
	if(sel == 0){
		walls[walls.length - 1].end.x = gx;
		walls[walls.length - 1].end.y = gy;
	}
	if(sel == 1){
		start[start.length - 1].end.x = gx;
		start[start.length - 1].end.y = gy;
	}
	if(sel == 2)
		trees[trees.length - 1] = {x: gx, y: gy};
	if(sel == 4 && pendingRamp){
		pendingRamp.b.x = gx;
		pendingRamp.b.y = gy;
		// La rampa solo se crea al confirmar en el diálogo
		openRampDialog();
	}else if(sel != 5){
		// La goma registra su propio historial solo cuando borra algo.
		hist.push(sel);
	}
	markDirty();
}

ca.onmousedown = function(e){
	mouse.down = true;
	mouse.cur.x = e.clientX;
	mouse.cur.y = e.clientY;
	mouse.start.x = e.clientX;
	mouse.start.y = e.clientY;
	startTool(gridX(mouse.start.x), gridY(mouse.start.y));
}

ca.onmousemove = function(e){
	mouse.cur.x = e.clientX;
	mouse.cur.y = e.clientY;
	if(mouse.down)
		moveTool(gridX(mouse.cur.x), gridY(mouse.cur.y));
}

ca.onmouseup = function(e){
	mouse.down = false;
	mouse.cur.x = e.clientX;
	mouse.cur.y = e.clientY;
	mouse.end.x = e.clientX;
	mouse.end.y = e.clientY;
	endTool(gridX(mouse.end.x), gridY(mouse.end.y));
}

function inferEditorCheckpointLevel(a, b){
	if(!walls.length) return 0;
	var points = [{x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}];
	var bestDistance = Infinity, bestLevel = 0;
	for(var i = 0; i < walls.length; i++){
		var wall = walls[i];
		var dx = wall.end.x - wall.start.x, dy = wall.end.y - wall.start.y;
		var length2 = dx * dx + dy * dy;
		var t = length2 ? Math.max(0, Math.min(1, ((points[0].x - wall.start.x) * dx + (points[0].y - wall.start.y) * dy) / length2)) : 0;
		var distance = Math.hypot(points[0].x - (wall.start.x + dx * t), points[0].y - (wall.start.y + dy * t));
		if(distance < bestDistance){
			bestDistance = distance;
			bestLevel = wall.level || 0;
		}
	}
	return bestDistance <= 8 ? bestLevel : 0;
}

function imp(){
	var text = prompt("Datos del mapa?").trim().split("|");
	
	if(!text || text.length < 4)
		return;

	if(text[4]) applyVars(text[4]);

	var wallsText = text[0].split(" ");
	var startText = text[1].split(" ");
	var treesText = text[2].split(" ");
	var arrowsText = text[3].split(" ");

	walls = [];
	for(var i = 0; i < wallsText.length; i++){
		var t = wallsText[i].split("/");
		if(t.length < 2)
			continue;

		// Nivel del muro: sufijo @N
		var lvl = 0;
		var atI = wallsText[i].indexOf("@");
		if(atI >= 0)
			lvl = parseInt(wallsText[i].substring(atI + 1)) || 0;

		walls.push({
			start: {
				x: parseInt(t[0].split(",")[0]) + Math.floor(width / scale / 2),
				y: -parseInt(t[0].split(",")[1]) + Math.floor(height / scale / 2)
			},
			end: {
				x: parseInt(t[1].split(",")[0]) + Math.floor(width / scale / 2),
				y: -parseInt(t[1].split(",")[1]) + Math.floor(height / scale / 2)
			},
			level: lvl
		});
	}

	start = [];
	for(var i = 0; i < startText.length; i++){
		var t = startText[i].split("/");
		if(t.length < 2)
			continue;

		var startLevel = 0;
		var startAt = startText[i].indexOf("@");
		var hasStartLevel = startAt >= 0;
		if(hasStartLevel){
			startLevel = parseInt(startText[i].substring(startAt + 1)) || 0;
			startText[i] = startText[i].substring(0, startAt);
			t = startText[i].split("/");
		}
		var startA = {
			x: parseInt(t[0].split(",")[0]) + Math.floor(width / scale / 2),
			y: -parseInt(t[0].split(",")[1]) + Math.floor(height / scale / 2)
		};
		var startB = {
			x: parseInt(t[1].split(",")[0]) + Math.floor(width / scale / 2),
			y: -parseInt(t[1].split(",")[1]) + Math.floor(height / scale / 2)
		};
		if(!hasStartLevel) startLevel = inferEditorCheckpointLevel(startA, startB);
		start.push({start: startA, end: startB, level: startLevel});
	}

	trees = [];
	for(var i = 0; i < treesText.length; i++){
		if(treesText[i].trim().length == 0)
			continue;

		trees.push({
			x: parseInt(treesText[i].split(",")[0]) + Math.floor(width / scale / 2),
			y: -parseInt(treesText[i].split(",")[1]) + Math.floor(height / scale / 2)
		});
	}

	arrows = [];
	for(var i = 0; i < arrowsText.length; i++){
		var t = arrowsText[i].split("/");
		if(t.length < 2)
			continue;

		arrows.push({
			x: parseInt(t[0].split(",")[0]) + Math.floor(width / scale / 2),
			y: -parseInt(t[0].split(",")[2]) + Math.floor(height / scale / 2),
			angle: (90 - parseInt(t[1])) * Math.PI / 180
		});
	}

	// Rampas: secci\u00f3n 6 (ax,ay/bx,by@from-to) - rect\u00e1ngulo que conecta dos pisos
	ramps = [];
	if(text[5]){
		var rampsText = text[5].split(" ");
		for(var i = 0; i < rampsText.length; i++){
			var t = rampsText[i].split("/");
			if(t.length < 2)
				continue;
			var rFrom = 0, rTo = 1;
			var atI2 = rampsText[i].indexOf("@");
			if(atI2 >= 0){
				var fl = rampsText[i].substring(atI2 + 1);
				var dash = fl.indexOf("-");
				if(dash >= 0){
					rFrom = parseInt(fl.substring(0, dash)) || 0;
					rTo = parseInt(fl.substring(dash + 1)) || 0;
				}else{
					rFrom = parseInt(fl) || 0;
					rTo = rFrom + 1;
				}
			}
			ramps.push({
				a: {
					x: parseInt(t[0].split(",")[0]) + Math.floor(width / scale / 2),
					y: -parseInt(t[0].split(",")[1]) + Math.floor(height / scale / 2)
				},
				b: {
					x: parseInt(t[1].split(",")[0]) + Math.floor(width / scale / 2),
					y: -parseInt(t[1].split(",")[1]) + Math.floor(height / scale / 2)
				},
				level: Math.min(rFrom, rTo),
				from: rFrom,
				to: rTo
			});
		}
	}
	markDirty();
}

// ---- Variables del mapa (se exportan en la \u00faltima secci\u00f3n del c\u00f3digo) ----
var mapVars = [
	{key: "SPEED", label: "Velocidad", val: 0.004, step: 0.001, min: 0.001, max: 0.02, dec: 3},
	{key: "mapscale", label: "Escala del mapa", val: 5, step: 1, min: 1, max: 20, dec: 0},
	{key: "MOUNTAIN_DIST", label: "Monta\u00f1as", val: 250, step: 25, min: 50, max: 1000, dec: 0},
	{key: "LAPS", label: "Vueltas", val: 3, step: 1, min: 1, max: 10, dec: 0},
	{key: "WALL_SIZE", label: "Grosor de muro", val: 1.2, step: 0.1, min: 0.5, max: 3, dec: 1},
	{key: "OOB_DIST", label: "L\u00edmite de pista", val: 200, step: 25, min: 50, max: 600, dec: 0},
	{key: "COLLISION", label: "Colisi\u00f3n", val: 1.1, step: 0.1, min: 0.5, max: 3, dec: 1},
	{key: "BOUNCE", label: "Rebote", val: 0.7, step: 0.05, min: 0.1, max: 1, dec: 2}
];

function buildVars(){
	var list = document.getElementById("varsList");
	if(!list) return;
	list.innerHTML = "";
	for(var i = 0; i < mapVars.length; i++){
		var v = mapVars[i];
		var row = document.createElement("DIV");
		row.className = "varrow";
		row.innerHTML =
			"<span class='varname' title='" + v.key + "'>" + v.label + "</span>" +
			"<div class='varctl'>" +
				"<button class='varbtn' onclick='adjVar(" + i + ",-1)'>&#8722;</button>" +
				"<span class='varval' id='varval" + i + "'>" + v.val.toFixed(v.dec) + "</span>" +
				"<button class='varbtn' onclick='adjVar(" + i + ",1)'>&#43;</button>" +
			"</div>";
		list.appendChild(row);
	}
}

function adjVar(i, dir){
	var v = mapVars[i];
	var nv = +(v.val + dir * v.step).toFixed(v.dec + 1);
	v.val = Math.max(v.min, Math.min(v.max, nv));
	var el = document.getElementById("varval" + i);
	if(el) el.innerHTML = v.val.toFixed(v.dec);
	markDirty();
}

function varsToCode(){
	// No `var` on purpose: the game evals this section, and plain assignments
	// reach the real globals (SPEED, mapscale, ...) instead of shadowing them.
	var out = "";
	for(var i = 0; i < mapVars.length; i++){
		var v = mapVars[i];
		out += v.key + " = " + v.val + ";";
	}
	return out;
}

function applyVars(code){
	if(!code) return;
	for(var i = 0; i < mapVars.length; i++){
		var v = mapVars[i];
		var m = code.match(new RegExp("(?:var\\s+)?" + v.key + "\\s*=\\s*([0-9.]+)"));
		if(m && m[1] != null)
			v.val = parseFloat(m[1]);
	}
	buildVars();
}
buildVars();

// Pliega/despliega el panel de variables (se abre con la flecha).
function toggleVars(){
	var body = document.getElementById("varsBody");
	var arrow = document.getElementById("varsArrow");
	var collapsed = body.style.display == "none";
	body.style.display = collapsed ? "" : "none";
	if(arrow) arrow.innerHTML = collapsed ? "&#9660;" : "&#9654;";
}

// El zoom de la grilla es fijo en x4 (scale = 40): no se puede cambiar.
// Import/export normalizan con Math.floor(width/scale/2), así que las
// coordenadas del mapa exportado no cambian aunque se ajuste este valor.

function exp(){
	var text = "";
	for(var i = 0; i < walls.length; i++){
		text += walls[i].start.x - Math.floor(width / scale / 2) + ",";
		text += -1 * (walls[i].start.y - Math.floor(height / scale / 2)) + "/";
		text += walls[i].end.x - Math.floor(width / scale / 2) + ",";
		text += -1 * (walls[i].end.y - Math.floor(height / scale / 2));
		if(walls[i].level)
			text += "@" + walls[i].level;
		text += " ";
	}
	text += "|";
	for(var i = 0; i < start.length; i++){
		text += start[i].start.x - Math.floor(width / scale / 2) + ",";
		text += -1 * (start[i].start.y - Math.floor(height / scale / 2)) + "/";
		text += start[i].end.x - Math.floor(width / scale / 2) + ",";
		text += -1 * (start[i].end.y - Math.floor(height / scale / 2));
		if(start[i].level) text += "@" + start[i].level;
		text += " ";
	}
	text += "|";
	for(var i = 0; i < trees.length; i++){
		text += trees[i].x - Math.floor(width / scale / 2) + ",";
		text += -1 * (trees[i].y - Math.floor(height / scale / 2)) + " ";
	}
	text += "|";
	for(var i = 0; i < arrows.length; i++){
		text += arrows[i].x - Math.floor(width / scale / 2) + ",3,";
		text += -1 * (arrows[i].y - Math.floor(height / scale / 2)) + "/";
		text += Math.floor(90 - arrows[i].angle * 180 / Math.PI) + " ";
	}
	text += "|";
	text += varsToCode();
	text += "|";
	for(var i = 0; i < ramps.length; i++){
		// Rampa: esquinas a y b del rect\u00e1ngulo + @from-to
		text += ramps[i].a.x - Math.floor(width / scale / 2) + ",";
		text += -1 * (ramps[i].a.y - Math.floor(height / scale / 2)) + "/";
		text += ramps[i].b.x - Math.floor(width / scale / 2) + ",";
		text += -1 * (ramps[i].b.y - Math.floor(height / scale / 2));
		text += "@" + (ramps[i].from != null ? ramps[i].from : 0) + "-" + (ramps[i].to != null ? ramps[i].to : 1) + " ";
	}
	text += "<br/>";
	if(mode3D) syncGamePreview();
	var win = window.open();
	win.document.body.innerHTML = text;
}

document.body.onkeydown = function(e){
	if(e.keyCode == 90 && (e.ctrlKey || e.metaKey)){
		if(hist.length == 0) return;
		e.preventDefault();
		var a = hist.splice(hist.length - 1, 1)[0];
		var ar = [walls, start, trees, arrows, ramps, erase][a];
		if(!ar || ar.length == 0) return;
		var del = ar.splice(ar.length - 1, 1)[0];
		if(ar == erase && del && del.list)
			del.list.splice(del.pos, 0, del.ob);
		markDirty();
	}
}
function eraseL(x, y){
	for(var i = 0; i < walls.length; i++)
		if(Math.hypot(walls[i].start.x - x, walls[i].start.y - y) < 1 || Math.hypot(walls[i].end.x - x, walls[i].end.y - y) < 1){
			hist.push(sel);
			erase.push({
				list: walls,
				ob: walls.splice(i, 1)[0],
				pos: i
			});
		}
	for(var i = 0; i < start.length; i++)
		if(Math.hypot(start[i].start.x - x, start[i].start.y - y) < 1 || Math.hypot(start[i].end.x - x, start[i].end.y - y) < 1){
			hist.push(sel);
			erase.push({
				list: start,
				ob: start.splice(i, 1)[0],
				pos: i
			});
		}
	for(var i = 0; i < trees.length; i++)
		if(Math.hypot(trees[i].x - x, trees[i].y - y) < 1){
			hist.push(sel);
			erase.push({
				list: trees,
				ob: trees.splice(i, 1)[0],
				pos: i
			});
		}
	for(var i = 0; i < arrows.length; i++)
		if(Math.hypot(arrows[i].x - x, arrows[i].y - y) < 1){
			hist.push(sel);
			erase.push({
				list: arrows,
				ob: arrows.splice(i, 1)[0],
				pos: i
			});
		}
	for(var i = 0; i < ramps.length; i++)
		// Borrar rampa: el clic debe caer dentro del rect\u00e1ngulo
		if(x >= Math.min(ramps[i].a.x, ramps[i].b.x) - 1 && x <= Math.max(ramps[i].a.x, ramps[i].b.x) + 1 &&
		   y >= Math.min(ramps[i].a.y, ramps[i].b.y) - 1 && y <= Math.max(ramps[i].a.y, ramps[i].b.y) + 1){
			hist.push(sel);
			erase.push({
				list: ramps,
				ob: ramps.splice(i, 1)[0],
				pos: i
			});
		}
}
function help(){
	document.getElementById("help").parentElement.style.transform = "none";
}

function dedupTrees(){
	var poss = [];

	for(var i = 0; i < trees.length; i++){
		for(var n = 0; n < poss.length; n++){
			if(poss[n].x == trees[i].x && poss[n].y == trees[i].y){
				console.log(i);
				trees.splice(i--, 1);
				break;
			}
		}
		
		poss.push(trees[i]);
	}
	markDirty();
}// ---- Vista previa 3D real del juego -------------------------------------
// El iframe carga el HTML y el motor reales. En modo preview, script.js toma
// el trackcode dinámico del editor, omite Firebase/menús y hace una órbita de cámara.
var previewSyncTimer = null;
var previewReady = false;
var previewLoadVersion = 0;

function toggle3D(){
	mode3D = !mode3D;
	document.body.classList.toggle("mode3d", mode3D);
	var btn = document.getElementById("btn3d");
	if(btn){
		btn.className = "button" + (mode3D ? " selected" : "");
		btn.innerHTML = mode3D ? "Volver al editor" : "Vista 3D";
	}
	if(mode3D){
		if(!previewFrame){
			previewFrame = document.createElement("iframe");
			previewFrame.id = "gamePreview";
			previewFrame.title = "Vista previa del circuito en el juego";
			previewFrame.src = "../index.html?trackPreview=1";
			previewFrame.addEventListener("load", function(){
				previewReady = true;
				syncGamePreview();
			});
			document.body.appendChild(previewFrame);
		}
		previewFrame.style.display = "block";
		syncGamePreview();
	}else if(previewFrame){
		previewFrame.style.display = "none";
	}
}

function currentMapCode(){
	var ox = Math.floor(width / scale / 2), oy = Math.floor(height / scale / 2);
	var checkpointLevels = start.map(function(line){
		return line.level != null ? line.level : inferEditorCheckpointLevel(line.start, line.end);
	});
	var wallsText = walls.map(function(w){
		return (w.start.x - ox) + "," + -(w.start.y - oy) + "/" + (w.end.x - ox) + "," + -(w.end.y - oy) + (w.level ? "@" + w.level : "");
	}).join(" ");
	var startsText = start.map(function(line, index){
		var level = checkpointLevels[index] || 0;
		return (line.start.x - ox) + "," + -(line.start.y - oy) + "/" + (line.end.x - ox) + "," + -(line.end.y - oy) + (level ? "@" + level : "");
	}).join(" ");
	var treesText = trees.map(function(t){ return (t.x - ox) + "," + -(t.y - oy); }).join(" ");
	var arrowsText = arrows.map(function(a){ return (a.x - ox) + ",3," + -(a.y - oy) + "/" + Math.floor(90 - a.angle * 180 / Math.PI); }).join(" ");
	var rampText = ramps.map(function(r){
		return (r.a.x - ox) + "," + -(r.a.y - oy) + "/" + (r.b.x - ox) + "," + -(r.b.y - oy) + "@" + (r.from != null ? r.from : 0) + "-" + (r.to != null ? r.to : 1);
	}).join(" ");
	return [wallsText, startsText, treesText, arrowsText, varsToCode(), rampText].join("|");
}

function syncGamePreview(){
	if(!mode3D || !previewFrame || !previewReady) return;
	if(previewSyncTimer) clearTimeout(previewSyncTimer);
	var version = ++previewLoadVersion;
	previewSyncTimer = setTimeout(function(){
		if(!mode3D || !previewFrame || !previewReady || version != previewLoadVersion) return;
		var previewWindow = previewFrame.contentWindow;
		if(!previewWindow || !previewWindow.setEditorTrackPreview) return;
		previewWindow.setEditorTrackPreview(currentMapCode());
	}, 80);
}
