	
	/*global VNS, Ajax*/

	VNS.resource.bootstrap.registerComponent('ajax tab', (function(){
																   
		var
			_tb_prfx = 'tab_',
			_pl_prfx = 'panel_',
			_xhrDone = false,
			_xhrResponse = '',
			_domLoaded = false,
			_prim = undefined
		;
		
		function _setLoader(status){_prim.down('.' + _pl_prfx + 'dynamic_content')[status ? 'addClassName' : 'removeClassName']('loading');}
		
		function _updateDynPanel(){
			_prim.down('.' + _pl_prfx + 'dynamic_content').update(_xhrResponse);
			_setLoader(false);
		}
		
		function _recordResponse(response){
			_xhrResponse = response;
			if(_domLoaded){ _updateDynPanel(); }
		}
		
		function _makeRequest(){
			_setLoader(true);
			new Ajax.Request('ajax/tab-content.php', {
				onSuccess : function(transport){  _recordResponse(transport.responseText); _xhrDone = true; },
				onFailure : function(){ _xhrDone = false; }
			});
		}
		
		function _switchTab(s){
			// css update
			_prim.select('.tab').each(function(t){t.removeClassName('current');});
			_prim.down('.' + _tb_prfx + s).addClassName('current');
			_prim.select('.panel').each(function(t){t.addClassName('elsewhere');});
			_prim.down('.' + _pl_prfx + s).removeClassName('elsewhere');
			if(s === 'dynamic_content' && !_xhrDone){ _makeRequest(); }
		}
		
		return {
			'immediate callback' : function(event, ref){
				_prim = ref.primitive;
				if(ref.target.hasClassName('tab')){
					_switchTab(ref.target.hasClassName(_tb_prfx + 'dynamic_content') ? 'dynamic_content' : 'home');
				}
			},
			'deferred callback' : function(event, ref){
				_domLoaded = true;
				if(_xhrDone){
					_updateDynPanel();
				} else {
					this['immediate callback'](event, ref);
				}
			}
		};
		
	}()));
	