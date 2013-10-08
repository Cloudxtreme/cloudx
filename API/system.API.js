API.system = {
	install: function (token, data) {
		if (!check (token, 'system.appinstall')) {
			data.callback ( false ) ;
			return false;
		}
		
		var apps = JSON.parse( localStorage.getItem('apps') ) || [];
		
		apps.push( JSON.stringify(data) );
		
		localStorage.setItem ( 'mf_'+data.name, JSON.stringify ( data ) );
		localStorage.setItem ( 'apps', JSON.stringify( apps ) );
	},
	updateConf: function (token, data) {
		
	},
	uploadConf: function (token, data) {
		
	}
}
