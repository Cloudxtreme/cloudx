function resizer (rsizer, target) {

    var offset, tg;

    rsizer.onmousedown = start;

    function start (event) {
        event.preventDefault();

        target.classList.remove('animated');

		if (!!localStorage.getItem('conf_ghost')) {
			tg=document.getElementById('ghost');
			ihnerit(target, tg);
			target.style.visibility = 'hidden';
			tg.style.display=null;
		} else {
			target.style.zIndex = 999999;
			tg = target;
		}

        document.getElementById('dnd_fix').style.display=null;

		addListeners (event.target);
        offset = getPosition(tg);
    }

    function stop (event) {
        if (tg !== target) {
        	ihnerit(tg, target);
        }
        if (document.getElementById('ghost')) {
        	document.getElementById('ghost').style.display="none";
        }
        removeListeners(event.target);
        cb();
    }

    function action (event) {
        tg.style.width = event.pageX - offset.x + 'px';
        tg.style.height = event.pageY - offset.y + 'px';
    }

    function addListeners () {
        window.onmousemove = action;
        window.onmouseup   = stop;
    }
    function removeListeners () {
        window.onmousemove = null;
        window.onmouseup   = null;
    }
    function ihnerit (src, targ) {
        targ.style.top = src.style.top;
        targ.style.left = src.style.left;
        targ.style.width = src.style.width;
        targ.style.height = src.style.height;
        targ.style.visibility = null;
    }
    function cb () {
        document.getElementById('dnd_fix').style.display='none';
        setTimeout(function(){target.classList.add('animated')},30);
    }
}
