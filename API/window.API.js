API.window = {
	init: function (token, data) {
		if (!check (token, 'process.system')) {
			data.callback( false );
			return false;
		}
		if (!check (token, 'process.start.SYS.SYSTEM.GUI')) {
			data.callback( false );
			return false;
		}
		if (!check (token, 'process.stop.SYS.SYSTEM.GUI')) {
			data.callback( false );
			return false;
		}

		this._processes = [];
		if (!(this._element = document.getElementById('apps'))) {
			this._element = document.createElement('div');
			this._element.id = 'apps';
			document.body.appendChild(this._element);
		} else {
			this._element.innerHTML = '';
		}
		if (!document.getElementById('ghost') && localStorage.getItem('conf_ghost')) {
            g = document.createElement('div');
            g.id = 'ghost';
            document.body.appendChild(g);
            var ghost = document.getElementById("ghost");
        }
        if (!document.getElementById('dnd_fix')) {
            g = document.createElement('div');
            g.id = 'dnd_fix';
            document.body.appendChild(g);
        }
	},
	create: function (token, data) {
		var app = data.app;
		if (app.split('.')[0] === 'sys') {
			if (!check (token, 'process.system')) {
				data.callback ( false );
				return false;
			}
		}
		if (data.params) {
			if (!check (token, 'process.pipe.'+app)) {
				data.callback( false );
				return false;
			}
		}
		if (check (token, 'process.start.'+app)) {
			var wind = new win (app, this._processes.length, data.params);
			API.dock.addWindow(token, wind);
			this._processes.push(wind);
			data.callback( true );
		}
		data.callback( false );
	},
	list: function (token, data) {
		if (!check (token, 'process.list')) {
			data.callback ( false );
		}
		var tmp = [];
		this.elements.forEach (function (v){
			tmp.push({'app': v.name, 'pid': v.pid});
		});
		data.callback(tmp);
	}
}

/*
data = {
	'token' // для проверки привилегий
	'app' // ID приложения
	'params' // Аргументы запуска (объект)
}

*/