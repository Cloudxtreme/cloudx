var select = document.createElement('div');
var desktop = document.createElement('div');
var offset = [];

select.id = 'select';
desktop.id = 'desktop';

//document.body.appendChild(desktop);
document.body.appendChild(select);

window.onselectstart = function (e) {return false};
window.ondragstart = function () {return false};
window.onmousemove = null;

window.onmousedown = function (e) {

	if (e.target !== document.body) {
		return false;
	}
	
	offset = [e.pageX, e.pageY];

	select.style.opacity = 1;
	select.style.display = 'block';
	select.style.top = e.pageY+'px';
	select.style.left = e.pageX+'px';

	window.onmousemove = function (m) {

		if (m.pageX>offset[0]) {
			select.style.left = offset[0]+'px';
			select.style.width = m.pageX-offset[0]+'px';
		} else {
			select.style.left = m.pageX+'px';
			select.style.width = offset[0]-m.pageX+'px';
		}

		if (m.pageY>offset[1]) {
			select.style.top = offset[1]+'px';
			select.style.height = m.pageY-offset[1]+'px';
		} else {
			select.style.top = m.pageY+'px';
			select.style.height = offset[1]-m.pageY+'px';
		}

	}

	window.onmouseup = function (m) {
		select.style.opacity = 0;

		if ((Math.abs(m.pageY-offset[1]) + Math.abs(m.pageX-offset[0])) > 200) {
			// #пасхалка  #easteregg
			popup ('Select feature is experimental.\n----------------------------\nYou selected '+ (Math.abs(m.pageY-offset[1]) * Math.abs(m.pageX-offset[0])) + ' pixels, \n that does not make any sense');
		}

		window.onmousemove = null;
		window.onmouseup = null;
		
		setTimeout(function () {
				select.style.opacity = 1;
				select.style.height = 0;
				select.style.width = 0;
				select.style.display = null;
		}, 100);
	}

	return false; 

}
