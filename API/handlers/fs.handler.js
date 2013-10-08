// 
// Only copypaste from http://www.html5rocks.com/en/tutorials/file/filesystem
// I can not think asyncronly :D
// 

function writefile(path, data, cb) {
	path = path.split('/');
	file = path.pop();
	createDir(API.fs.fs.root, path, function () {
		API.fs.fs.root.getFile(path.join('/') + '/' + file, {
			create: true
		}, function (fileEntry) {

			// Create a FileWriter object for our FileEntry (log.txt).
			fileEntry.createWriter(function (fileWriter) {

				fileWriter.onwriteend = function (e) {
					debug('Успешная запись в кэш (' + path.join('/') + '/' + file + ')', data);
					cb(data);
				};

				fileWriter.onerror = function (e) {
					console.error('FS cache error: ' + e.toString());
				};

				if (data instanceof Blob) {
					fileWriter.write(data);
				} else {
					fileWriter.write(new Blob([data]));
				}
			}, function (e) {
				console.error('FS cache writting file (to cache) error: ', e);
				API.error(1);
			});
		}, function (e) {
			console.error('FS cache getting file error: ', e);
			API.error(1);
		});
	});
}

function readfile(path, cb) {
	path = path.split('/');
	file = path.pop();

	API.fs.fs.root.getFile(path.join('/') + '/' + file, {
		create: true
	}, function (fileEntry) {

		fileEntry.file(function (file) {
			var reader = new FileReader();

			reader.onloadend = function (e) {
				cb(this.result);
			};

			reader.readAsText(file);
		}, function(e) { 
			console.error('FS error.', e)
			cb (false)
		});
	}, function (e) {
		console.error('FS cache getting file error: ', e);
		API.error(1);
		cb(false);
	});
}

function createDir(rootDirEntry, folders, cb) {
	// Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
	if (folders[0] == '.' || folders[0] == '') {
		folders = folders.slice(1);
	}
	rootDirEntry.getDirectory(folders[0], {
		create: true
	}, function (dirEntry) {
		// Recursively add the new subfolder (if we still have another to create).
		if (folders.length) {
			createDir(dirEntry, folders.slice(1), cb);
		} else {
			cb();
		}
	}, function (e) {
		console.error('FS error.', e);
	});
};

function setLastUpdateLocal (path) {
	localStorage.setItem('fupd_'+path, new Date().getTime());
};
function getLastUpdateLocal (path) {
	var f = localStorage.getItem('fupd_'+path);
	return f || 1;
};
function getLastUpdate (path, cb) {
	API.g_execute('fs.lastupdate', 'path='+path, 0, function (d){
		cb(d.response);
	});
};

waiting = [];
function waitForWrite (path) {
	if (waiting.indexOf(path) !== -1) {
		waiting.push(path);
	}
}
function writeserver (path, data, cb) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', '//api.cloudx.cx', true);
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			 if(xmlhttp.status == 200) {
				 cb (JSON.parse(xmlhttp.responseText));
			}
		}
	};
	xmlhttp.send('request='+JSON.stringify({
		'method': 'fs',
		'action': 'file.put.contents',
		'path': path,
		'data': data
	}));
}
var intervLock = false;
setInterval (function () {
	if (navigator.onLine && !intervLock) {
		intervLock = true;
		waiting.forEach (function(v){
   			readfile(v, function (c) {
   				writeserver(v, c);
   			})
		});
		waiting = [];
		intervLock = false;
	}
}, 10000);

function dlfile (path, cb) {
	var oReq = new XMLHttpRequest();
	oReq.open("GET", '//api.cloudx.cx/fs.file.get.contents?token='+localStorage.getItem('token')+'&path='+path, true);
	oReq.responseType = "arraybuffer";
	oReq.onload = function() {
		cb(new Blob([oReq.response], {type: oReq.getResponseHeader('Content-Type')}));
	};
	oReq.send();
}

function srv_ls (path, cb) {
	var oReq = new XMLHttpRequest();
	oReq.open("GET", '//api.cloudx.cx/fs.ls?token='+localStorage.getItem('token')+'&path='+path, true);
	oReq.onload = function() {
		cb(JSON.parse(oReq.responseText).response);
	};
	oReq.send();
}

function ls (path, cb) {
	
	function toArray(list) {
		return Array.prototype.slice.call(list || [], 0);
	}
	
	API.fs.fs.root.getDirectory(path, {create: false}, function (dir) {
		var reader = dir.createReader(),
			entries = [];
		
		function readEntries () {
			reader.readEntries(function (results) {
				if (!results.length) {
					listResults(entries.sort());
				} else {
					entries = entries.concat(toArray(results));
					readEntries();
				}
			});
		}
		
		function listResults (e) {
			
			var res = [];
			
			e.forEach (function (entry) {
				var name = (entry.isDirectory) ? entry.name + '/' : entry.name;
				res.unshift(name);
			});
			
			cb (res);
		}
		
		readEntries();
	});
}
