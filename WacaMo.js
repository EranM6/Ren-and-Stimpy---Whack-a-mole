var Chr = function (posObj){
	this.domObj = null;
	this.actionObj = null;
	this.dead = false;
	this.points = null;
	this.hit = null;
	this.select = null;
	var _this = this;
	var cnt = document.createElement("div");
	var hole = document.createElement("img");
	var chr = document.createElement("div");
	var div = document.createElement("div");
	hole.setAttribute("src", "./hole.png");
	cnt.className = "cnt";
	hole.className = "hole";
	chr.className = "chr";
	div.addEventListener ("click", function(){
		if (!_this.dead){
			_this.dead = true;
			_this.actionObj.style.backgroundPosition = "-100px 0";
			document.dispatchEvent (new CustomEvent("whack", {"detail": _this.points}));
			_this.hit.play();
		}
	});
	div.addEventListener ("animationend", function(){
		_this.actionObj.offsetWidth = _this.actionObj.offsetWidth;
		_this.actionObj.className = "";
		_this.dead = false;
		_this.actionObj.style.backgroundPosition = "0 0";
	});
	chr.appendChild(div);
	cnt.appendChild(hole);
	cnt.appendChild(chr);
	this.domObj = cnt;
	this.actionObj = div;
	this.setChrPos(posObj);
};
Chr.prototype = {
	getDomObj: function(){
		return this.domObj;
	},
	setChrPos: function(posObj){
		this.domObj.style.top = posObj.y+"px";
		this.domObj.style.left = posObj.x+"px";
	},
	setChrAction: function(para){
		this.actionObj.className = para.t;
		this.points = para.p;
	},
	setCharacter: function(x){
		this.actionObj.style.background = "rgba(0, 0, 0, 0) url('"+x+".png') no-repeat scroll 0 0 / 250%";
		this.hit = new Audio(x+"hit.mp3");
		this.select = new Audio(x+"select.mp3");
	}
};

var Whack = function (){
	var _this = this;
	this.duration = 20;
	this.field = document.getElementById("field");
	this.time = document.querySelector("#time > p");
	this.score = document.querySelector("#score > p");
	this.Chr = [];
	this.totalPoints = 0;
	this.totalChrs = 10;
	this.time.innerHTML = this.duration;
	this.score.innerHTML = this.totalPoints;
	this.counter = null;
	var pos = this.calcChrPos();
	for (var i=0; i<this.totalChrs; i++){
		this.Chr[i] = new Chr (pos[i]);
		this.field.appendChild(this.Chr[i].getDomObj());
	}
	document.addEventListener("whack", function(e) {
		_this.totalPoints += e.detail;
		_this.score.innerHTML = _this.totalPoints;
	},false);
	this.field.addEventListener("mousedown",function(){
		_this.field.className = "hit";
		new Audio ("plop.mp3").play();
	});
	this.field.addEventListener("mouseup", function(){
		_this.field.className = "wait";
	})
};
Whack.prototype = {
	calcChrPos: function(){
		return this.randPos (this.totalChrs, {x:100, y:100});
	},
	getActionParams: function(){
		var temp = Math.floor(Math.random() * (3 - 1 + 1) + 1);
		return {t: "s"+temp, p: temp*5}
	},
	startGame: function(x){
		document.getElementById("over").style.visibility = "hidden";
		clearInterval(this.counter);
		this.score.innerHTML = "0";
		this.totalPoints = 0;
		this.duration = 20;
		this.pos = this.calcChrPos();
		for (var i=0; i<this.totalChrs; i++){
			this.Chr[i].setChrAction({t: "", p: null});
			this.Chr[i].setChrPos(this.pos[i]);
			this.Chr[i].setCharacter(x);
		}
		this.Chr[0].select.play();
		this.gameTimer();
	},
	gameTimer : function(){
		var _this = this;
		_this.counter = setInterval(function(){
			if(_this.duration > 0){
				_this.duration--;
				_this.time.innerHTML = _this.duration;
				_this.beat()
			}else{
				_this.endGame();
			}
		},1000)},
	beat: function(){
		for (var i=0; i<this.totalChrs; i++){
			if (this.Chr[i].actionObj.className == "") {
				var x = this.getActionParams();
				this.Chr[i].setChrAction(x);
			}
		}
	},
	randPos: function(numOfObj, size){
		var arr = [];
		var h = this.field.clientHeight;
		var w = this.field.clientWidth;
		for (var i=0; i<numOfObj; i++){
			var tempX = Math.floor(Math.random() * (w - size.x) );
			var tempY = Math.floor(Math.random() * (h - size.y) );
			if (arr.length == 0) {
				arr[i] = {
					x: tempX,
					y: tempY
				};
			} else {
				var flag = true;
				for (var j = 0; j < i && flag; j++) {
					if (Math.abs(arr[j].x - tempX) < size.x && Math.abs(arr[j].y - tempY < size.y)) {
						flag = false;
					}
				}
				if (flag) {
					arr[i] = {
						x: tempX,
						y: tempY
					};
				} else {
					i--;
				}
			}
		}
		return arr;
	},
	endGame: function(){
		this.duration = 0;
		clearInterval(this.counter);
		new Audio ("horse.mp3").play();
		document.getElementById("over").style.visibility = "visible";
	}
};