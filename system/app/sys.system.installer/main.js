function $(a){return document.getElementById(a);};

$('install').disabled = true;

var start = new Date().getTime();
var g = setInterval(function(){
	var now = new Date().getTime();
	var o = now-start;
	if (o>7000) {
		clearInterval(g);
		$('install').disabled = false;
		$('install').innerText = 'Установить!';
	} else {
		$('install').innerText = 'Подождите '+(7-o/1000).toFixed(2)+' секунд';
	}
}, 0);

$('install').onclick = function (event) {
	if (event.target.disabled) {return false;}

	alert(ok);

};

$('appname').innerText = cx.parameters['app'];