var API = {}
function check (token, permission) {
	if (!sessionStorage.getItem('t_'+token)) {
		return false;
	}

	var tokendata = JSON.parse(sessionStorage.getItem('t_'+token));
	var appdata = JSON.parse(localStorage.getItem('mf_'+tokendata.app));


	if (appdata.permissions[0] === '*') {
		return true;
	}
	var tmp=[], tmp2=false;
	permission.split('.').forEach(function(v){
		tmp.push(v);
		var perms = appdata.permissions;
		if (perms.indexOf( tmp.join('.')+'.*' ) !== -1) {
			tmp2 = true;
		}
	});
	return tmp2 || appdata.permissions.indexOf(permission)!==-1;
}
setTimeout(function () {
	localStorage.setItem ('mf_sys.cloudx.repo', '{"size":["400","300"],"position":["center","center"],"permissions":"*","buttons":["minimize","maximize","close"],"icon":"/style/app.png","info":"Cloudx Apps (repository)","title":"Cloudx Apps","draggable":true,"resizable":true,"service":false,"executable":"/system/app/sys.cloudx.repo/main.html"}');
	sessionStorage.setItem ('t_'+localStorage.getItem('token'), '{"app": "SYS.SYSTEM.CORE", "pid": 0}');
	localStorage.setItem ('mf_SYS.SYSTEM.CORE', '{"permissions": "*", "service": true}')
},0);

API.execute = function (obj, callback) {
	var mt = obj.method.split('.');
	return API[mt[0]][mt[1]](obj.token, obj.data);
};

window.onmessage = function (event) {
	 API.execute(event.data, function (e) {
		event.source.postMessage ({
			'response': e,
			'request_id': event.data.request_id
		});
	 });
}

API.error = function (type) {
	if (type === 0 ) {
		alert ('[3.3.0d]: Ошибка инициализации! Перезапустите систему. (F5)')
	}
}

API.g_execute = function (method, data, raw, clb) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', '//api.cloudx.cx/'+method+'?token='+localStorage.getItem("token")+'&'+data, true);
	if (raw) {
		xmlhttp.overrideMimeType('text\/plain; charset=x-user-defined');
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				if (raw) {
					clb(xmlhttp.responseText);
				} else {
					if (xmlhttp.responseText.length < 5000) {
						debug('server returned', xmlhttp.responseText);
					} else {
						debug('Debug disbled: response is larger then 5000 symbols.')
					}
					clb(JSON.parse(xmlhttp.responseText));
				}
			};
		};
	};
	xmlhttp.send(null);
}

