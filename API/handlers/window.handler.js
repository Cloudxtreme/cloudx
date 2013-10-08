// ОСТОРОЖНО! Сломаешь моск! xDD

function win (app, pid, params) {
	var mf;

	this.name = app;
	this.pid = pid;

	if (!(mf = localStorage.getItem('mf_'+app))) {
		debug ('Невозможно запустить приложение "'+app+'" по причине его отсутствия');
		return false;
	}

	mf=JSON.parse(mf);

	this.title = mf.title || 'Без имени';
	this.icon = mf.icon || '/style/app.png';

	if (mf.service) {
		var app = document.createElement('iframe');
			app.style.visibility='hidden';
			app.sandbox='allow-scripts allow-forms';

			app.src=mf.executable;

		document.getElementById('apps').appendChild(app);

		this.close = function () {
			document.getElementById('apps').removeChild(app);
		};

		app.control=this;

		return false;
	}

	if (app.split('.')[0] === 'sys') {
		this.system === true;
	}

	if (mf.position[0] === 'center') {
		mf.position[0] = (document.width-mf.size[0])/2+'px';
	}
	if (mf.position[1] === 'center') {
		mf.position[1] = (document.height-mf.size[1])/2+'px';
	}

	this.element = document.createElement('div');
	this.element.className = 'window animated';
	this.element.style.top = mf.position[1];
	this.element.style.left = mf.position[0];
	this.element.style.height = mf.size[1];
	this.element.style.width = mf.size[0];

	header = document.createElement('div');
	header.className = 'header';
	header.ondblclick = function () {_self.maximize()}

	icon = document.createElement('div');
	icon.className = 'icon';

	title = document.createElement('div');
	title.className = 'title';
	title.innerText = mf.title;

	b_maximize = document.createElement('div');
	b_maximize.className = 'button maximize';
	b_maximize.onclick = function () {
		_self.maximize()
	}

	b_minimize = document.createElement('div');
	b_minimize.className = 'button minimize';
	b_minimize.onclick = function () {
		_self.hide();
		tmp = b_minimize.onclick;
		b_minimize.onclick = function() {
			_self.show();
			b_minimize.onclick = tmp;
		}
	}


	b_close = document.createElement('div');
	b_close.className = 'button close';
	b_close.onclick = function () {
		setTimeout(function(){
			_self.close();
		},0);
	}

	body = document.createElement('div');
	body.className = 'body';

	frame = document.createElement('iframe');
	frame.sandbox = 'allow-scripts allow-forms';
	frame.allowtransparency = true;
	frame.width = '100%';
	frame.height = '100%';

	resize = document.createElement('div');
	resize.className = 'resizer';
	resizer(resize, this.element);

	document.getElementById('apps').appendChild(this.element);
		this.element.appendChild(header);
			header.appendChild(icon);
			header.appendChild(title);
			header.appendChild(b_close);
			header.appendChild(b_maximize);
			header.appendChild(b_minimize);
		this.element.appendChild(body);
			body.appendChild(frame);
		this.element.appendChild(resize)



	this.show = function () {
		_self.hidden = false;
		_self.element.style.visibility = null;
		_self.element.style.left = mf.position[0];
		_self.element.style.top = mf.position[1];
		_self.element.style.zoom = 1;
		_self.element.style.opacity = 1;
	}

	this.maximize = function () {
		mf.position = [_self.element.style.left, _self.element.style.top];
		mf.size = [_self.element.style.width, _self.element.style.height];

		_self.element.childNodes[0].onmousedown = null;

		_self.element.style.left=0;
		_self.element.style.top=0;
		_self.element.style.width = '100%';
		_self.element.style.height = document.height - 40 + 'px';
		_self.element.childNodes[0].ondblclick = function () {_self.normalize()}
		_self.element.childNodes[0].childNodes[3].onclick = function () {_self.normalize()}
	}

	this.normalize = function () {
		_self.element.style.left = mf.position[0];
		_self.element.style.top = mf.position[1];
		_self.element.style.width = mf.size[0];
		_self.element.style.height = mf.size[1];

		if (mf.draggable) {
			dndwin.makeDraggable(this.element.childNodes[0]);
		}

		_self.element.childNodes[0].ondblclick = function () {_self.maximize()}
		_self.element.childNodes[0].childNodes[3].onclick = function () {_self.maximize()}
	}

	this.hidden = false;

	this.toggle = function () {
		if (_self.hidden) {
			_self.show();
		} else {
			_self.hide();
		}
	}

	this.hide = function () {
		_self.hidden = true;
		mf.position = [_self.element.style.left, _self.element.style.top];
		_self.element.style.zoom = 0.001;
		_self.element.style.left = '50%';
		_self.element.style.top = '100%';
		_self.element.style.opacity = 0;
		setTimeout(function(){
			_self.element.style.visibility = 'hidden';
		}, 400);
	}

	this.close = function () {
		_self.element.style.opacity = 0;
		_self.element.style.height = 0;
		setTimeout(function(){
			document.getElementById('apps').removeChild(_self.element);
		},400);
	}

	this.pipe = function (data) {
		frame.contentWindow.postMessage(data, '*');
	}

	if (mf.draggable) {
		dndwin.makeDraggable(this.element.childNodes[0]);
	}


	// Генерируем токен

	var token = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 128; i++ ) {
        token += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	sessionStorage.setItem('t_'+token, '{"app": "'+app+'", "pid": '+pid+'}');

	paramstr = '';
	for (var u in params) {
		paramstr=paramstr+'&'+encodeURIComponent(u)+'='+encodeURIComponent(params[u]);
	}

	frame.src = mf.executable+'#pid='+pid+'&token='+token+paramstr;

	this.element.control = this;

	this.element.id = pid;

	var _self = this;
	
	toTop (this.element);

}