	
	/*global VNS, Ajax*/

	VNS.resource.bootstrap.registerComponent('ajax tab', (function(){
																   
		var
			_tb_prfx = 'tab_',
			_pl_prfx = 'panel_',
			_xhrDone = false,
			_xhrResponse = '',
			_domLoaded = false,
			_prim = null
		;
		
		function _updateDynPanel(){
			if(_domLoaded){
				_prim.down('.' + _pl_prfx + 'dynamic_content')
					.update(_xhrResponse)
					.removeClassName('loading')
				;
			}
		}
		
		function _recordResponse(response){
			_xhrDone = true;
			_xhrResponse = response;
			if(_domLoaded){
				 _updateDynPanel();
			}
		}
		
		function _makeRequest(){
			if(!_xhrDone){
				new Ajax.Request('ajax/tab-content.php', {
					onSuccess : function(transport){ _recordResponse(transport.responseText); },
					onFailure : function(){ _xhrDone = false; }
				});
			}
		}
		
		function _switchTab(prim, s){
			// css update
			_prim = prim;
			_prim.select('.tab').each(function(t){t.removeClassName('current');});
			_prim.down('.' + _tb_prfx + s).addClassName('current');
			_prim.select('.panel').each(function(t){t.addClassName('elsewhere');});
			_prim.down('.' + _pl_prfx + s).removeClassName('elsewhere');
			if(s === 'dynamic_content'){
				_makeRequest();
				_prim.down('.' + _pl_prfx + s).addClassName('loading');
			}
		}
		
		return {
			'immediate callback' : function(event, ref){
				if(ref.target.hasClassName('tab')){
					_switchTab(
						ref.primitive,
						ref.target.hasClassName(_tb_prfx + 'dynamic_content') ? 'dynamic_content' : 'home'
					);
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
	