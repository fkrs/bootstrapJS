	
	VNS.resource.bootstrap.registerComponent('my component', (function(){
																	   
		function _componentLog(s){
			if (window.console !== undefined){
				console.info(s);
			}
		}
		
		function _changeStatus(elm, status){
			var isLoadingTest = (status === 'loading');
			elm
				.addClassName(isLoadingTest ? 'loading' : 'loaded')
				.removeClassName(isLoadingTest ? 'loaded' : 'loading')
			;
		}
		
		return {
			'immediate callback' : function(event, ref){
				_componentLog('$my_component > do it immediately / ' + event.timeStamp);
				_changeStatus(ref.primitive, 'loading');
			},
			'deferred callback' : function(event, ref){
				_componentLog('$my_component > do it after load / ' + event.timeStamp);
				ref.primitive.innerHTML = "<img src=\"img/water.jpg\" width=\"50\" height=\"50\" />";
				_changeStatus(ref.primitive, 'done');
			}
		}
		
	}()));
	