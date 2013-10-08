var _timeout

// Запуск приложения репозитория Cloudx.
// Не пасхалка, просто скрытая фича

document.getElementById('version').onmousedown = function () {
	_timeout = setTimeout (function () {
		API.window.create(localStorage.getItem('token'), {app: 'sys.cloudx.repo'});
	}, 1500);
}

document.getElementById('version').onmouseup = function () {
	clearTimeout(_timeout)
}