// Auth
var DOMLoadTimer = setInterval(function () {
			if (/loaded|complete/i.test(document.readyState)) {
				ld();
				clearInterval(DOMLoadTimer);
			}
		}, 10)
var ld = function () {
	console.time('Инициализация заняла');
	document.body.style.cursor='wait';
	log('Запуск системы.. Проверка авторизации')
	setTimeout(function(){
		log ('[Асинхронно] установка фона');
		document.body.style.backgroundImage='url(style/dubstep.jpg)';
		log ('[Асинхронно] фон установлен')
	},0);
	if (localStorage.getItem('token') && document.location.hash !== '#relogin') {
		log ('Обнаружен токен, авторизация отменена. Запуск интерфейсов.');
		boot();
		return false;
	}

	log ('Запрос авторизации')

	document.getElementById('auth').style.display = null;

	document.getElementById('ok').onclick = function () {
		var pass = document.getElementById('pass').value,
			login = document.getElementById('login').value;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', '//api.cloudx.cx/', true);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					tmp = JSON.parse(xmlhttp.responseText);

					if(!tmp.success) {
						console.log(tmp);
						alert('[dev version]: invalid password/login');
					}

					localStorage.setItem('uid', tmp.response.user_id);
					localStorage.setItem('token', tmp.response.token);

					boot();

				} else {
					document.location.href = '/error.html#server+is+down';
				}
			}
		};
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
		xmlhttp.send("request="+JSON.stringify({
			"method": "user",
			"action": "login",
			"password": pass,
			"nickname": login
		}));
	}
}
var loaded = function () {
	if(scripts.length===0){
		document.getElementById('text').innerText = 'Прорисовка..';

		var s = document.createElement('link');
		s.href = 'style/main.css';
		s.rel = 'stylesheet';
		document.getElementsByTagName('head')[0].appendChild(s);

		document.getElementById('loader').style['-webkit-transition'] = 'all linear 1s 0.2s';
		document.getElementById('loader').style.opacity='.5';
		init();
		document.getElementById('loader').style.opacity='0';
		document.body.style.cursor=null;
		setTimeout(function(){
			document.body.removeChild(document.getElementById('loader'));
		},1400);
		console.timeEnd('Инициализация заняла');
		return false;
	}
	var scr = document.createElement('script');
	scr.src=scripts.shift();
	scr.async=true;
	scr.onload=loaded;
	document.getElementById('text').innerText=scripts.shift();
	document.getElementsByTagName('head')[0].appendChild(scr);
}
;
var scripts = ['/API/API.js', 'Подготовка API',
			'/API/desktop.API.js', 'Рабочий стол',
			'/API/dock.API.js', 'Панель задач',
			'/API/window.API.js', 'Оконая система',
			'/API/fs.API.js', 'Файловая система',
			'/API/handlers/fs.handler.js', 'Файловая система',
			'/API/handlers/resize.handler.js', 'Подготовка графического интерфейса (1/5)',
			'/API/handlers/window.handler.js', 'Подготовка графического интерфейса (2/5)',
			'/API/handlers/dragndrop.handler.js', 'Подготовка графического интерфейса (3/5)',
			'/API/handlers/select.handler.js', 'Подготовка графического интерфейса (4/5)',
			'/API/handlers/eastereggs.js', 'Подготовка пасхалок',
			'/API/handlers/popup.handler.js', 'Подготовка графического интерфейса (5/5)'
];
function boot () {

	var loader = document.createElement('div');
	loader.id = "loader";

	var anim = document.createElement('div');
	anim.id="ajaxloader";

	var text_wr = document.createElement('div');
	text_wr.id = "text_wrapper";

	var text = document.createElement('div');
	text.id="text"; text.innerText = 'Инициализация загрузчика';

	loader.appendChild(anim);
	loader.appendChild(text_wr);
	text_wr.appendChild(text);
	document.body.appendChild(loader);
	document.body.removeChild(document.getElementById('auth'));

	log('Загрузка модулей')
	loaded();
}

function log () {
	if (localStorage.getItem('log')) {
		var a = [];
		Array.prototype.forEach.call(arguments, function (v) {
			a.push(v);
		})
		return console.log.apply(console, a);
	}
	return false;
}
function debug () {
	if (localStorage.getItem('debug')) {
		var a = [];
		Array.prototype.forEach.call(arguments, function (v) {
			a.push(v);
		})
		return console.debug.apply(console, a);
	}
	return false;
}

function init() {
	setparams ();
	log ('Инициализация API');
	API.dock.init(localStorage.getItem('token'), {callback: function(){}});
	API.window.init(localStorage.getItem('token'), {callback: function(){}});
	//API.desktop.init();
	//API.global.init(); // server APIs
	API.fs.init(localStorage.getItem('token'),{callback: function(){}}); // cache
	//API.defaults.init(); // defaults (start menu, etc)

	log ('Запуск фоновых и не очень служб');

	JSON.parse(localStorage.getItem('autostart')).forEach(function (app) {
		API.window.create(app.token, {app: app.app, params: app.params, callback: function(a){debug('app '+app.app+' autostarted and return is '+a);}});
	});

	JSON.parse(localStorage.getItem('shortcuts')).forEach(function(app) {
		dock.addShortcut(app.token, {app:app.app});
	})

}
function setparams () {
	var tmp1 = localStorage.getItem('autostart') || "[]";
	localStorage.setItem('autostart', tmp1);
	var tmp2 = localStorage.getItem('shortcuts') || "[]";
	localStorage.setItem('shortcuts', tmp2);
}
// console.memory