API.dock = {
	init: function () {
		this.elements = {};
		if (!(this._element = document.getElementById('dockbar'))) {
			this._element = document.createElement('div');
			this._element.id = 'dockbar';
			document.body.appendChild(this._element);
		} else {
			this._element.innerHTML = '';
		}
	},
	addWindow: function (token, data) {
		// data = window object
		if (!check (token, 'system.special')) {
			data.callback ( false ) ;
			return false;
		}
		if (this.elements[data.name]) {
			this.elements[data.name].add(data);
		} else {
			this.elements[data.name] = {
				list: [data],
				el: undefined,
				e: undefined,
				add: function (data) {

					if (this.list.length === 1) {
						this.el.onclick = null;

						var e = document.createElement('div');
						e.className='processes';

						this.el.appendChild(e);
						this.e=e;

						// create 1st element

						var element;

						this.list.forEach(function(v){
							element = v;
						});

						var l = document.createElement('div');
						l.className = 'process';
						l.onclick = function () {
							element.toggle();
						};

						var t = document.createElement('div');
						t.className = 'title';
						t.innerText = element.title;

						var i = document.createElement('div');
						i.className = 'icon';
						i.style.backgroundImage = 'url('+element.icon+')';

						this.list.push(data);

						this.e.appendChild(l);
						l.appendChild(t);
						l.appendChild(i);
					}

					var l = document.createElement('div');
					l.className = 'process';
					l.onclick = function () {
						data.toggle();
					};

					var t = document.createElement('div');
					t.className = 'title';
					t.innerText = data.title;

					var i = document.createElement('div');
					i.className = 'icon';
					i.style.backgroundImage = 'url('+data.icon+')';

					this.list.push(data);

					this.e.appendChild(l);
					l.appendChild(t);
					l.appendChild(i);
				},
				remove: function (data) {
					this.list.forEach (function (v,i) {
						if (v === data) {
							delete this.list[i];
						}
					});
					if (this.list.length === 1) {
						this.el.removeChild(this.e);
						var tmp = '';
						this.list.forEach(function(v){tmp=v;});
						this.el.onclick = function () {
							tmp.toggle();
						}
					};
				}
			}
			el = document.createElement('div');
			el.className = 'item app';
			el.onclick = function () {
				data.toggle();
			};

			ic = document.createElement('div');
			ic.className = 'img';

			el.appendChild(ic);
			this._element.appendChild(el);

			this.elements[data.name].el = el;
		}
		data.callback ( true );
	},
	removeWindow: function (token, data) {
		if (!check (token, 'system.special')) {
			data.callback( false );
		}
		if (!this.elements[data.app]) {
			data.callback( false );
		}
		if (this.elements[data.app].list.length === 1) {
			this._element.removeChild(this.elements[data.app].el);
		} else {
			this.elements[data.app].remove(data);
		}
	}
}
