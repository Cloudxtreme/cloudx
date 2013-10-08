function popup (text) {
	var p = document.createElement('div');
		p.innerText = text;
		p.className = 'popup';
		
	document.body.appendChild(p);
	
	p.style.top = '-'+p.offsetHeight+'px';
	p.style.marginLeft = '-'+(p.offsetWidth/2+30)+'px';
	p.className = 'popup anim';
	p.style.top = '0px';
	
	function hide () {
		if (p) {
			p.style.top = '-'+p.offsetHeight+'px';
			p.style.opacity = '0.5';
			setTimeout (function () {
				document.body.removeChild(p);
				p = undefined;
			}, 350);
		}
	}
	
	setTimeout (function () {
		hide();
	}, 7500);
	
	p.onclick = hide;
}