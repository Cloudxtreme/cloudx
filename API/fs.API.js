//TODO: fs functions to .handler; rewrite API wrapper; (call function with args (API.ex.ex.apply(API.ex, argumentZ)))




API.fs = {
	init: function (token, data) {
		if (!check(token, 'process.system')) {
			data.callback(false);
			return false;
		}
		if (!check(token, 'process.start.SYS.SYSTEM.FSWRAPPER')) {
			data.callback(false);
			return false;
		}
		navigator.webkitPersistentStorage.requestQuota(2 * 1024 * 1024 * 1024, function (grantedBytes) {
			window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function (fs) {
				API.fs.fs = fs;
				data.callback(true);
			}, function (e) {
				data.callback(false);
				console.error('Unknown storage error: ', e);
				API.error(0);
			});
		}, function (e) {
			data.callback(false);
			console.error('FS cache init error: ', e);
			API.error(0);
		});
	},
	readFile: function (token, data) {
		if (!check(token, 'fs.read')) {
			data.callback(false);
			return false;
		}
		if (navigator.onLine) {
			getLastUpdate(data.path, function (d) {
				if (d>getLastUpdateLocal(data.path)) {
					dlfile(data.path, function (ret) {
						writefile(data.path, ret, function(){
							data.callback(ret);
						});
					});
				} else {
					readfile (data.path, data.callback);
				}
			});
		} else {
			readfile(data.path, data.callback);
		}
	},
	writeFile: function (token, data) {
		if (!check(token, 'fs.write')) {
			data.callback(false);
			return false;
		}
		if (navigator.onLine) {
			var executed = 0;
			writefile(data.path, data.data, function () {
				executed++;
				if (executed===2) {
					data.callback(true);
				}
			});
			writeserver(data.path, data.data, function () {
				executed++;
				if (executed===2) {
					data.callback(true);
				}
			});

		} else {
			writefile(data.path, data.data, function () {
				data.callback(1);
				waitForWrite(data.path);
			});
		}
	},
	ls: function (token, data) {
		if (!check(token, 'fs.read')) {
			data.callback(false);
			return false;
		}
		if (navigator.onLine) {
			//
		} else {

		}
		data.callback([]);
		return false;
	}
}

// navigator.onLine