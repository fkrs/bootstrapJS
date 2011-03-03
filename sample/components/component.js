	
	VNS.resource.bootstrap.registerComponent('my component', (function(){
		
		function _changeStatus(elm, status){
			
			elm
				.addClassName(status == 'loading' ? 'loading' : 'loaded')
				.removeClassName(status == 'loading' ? 'loaded' : 'loading')
			;
		}
		
		return {
			'immediate callback' : function(event, ref){
				console.info('$my_component > do it immediately / ' + event.timeStamp);
				_changeStatus(ref.primitive, 'loading');
			},
			'deferred callback' : function(event, ref){
				console.info('$my_component > do it after load / ' + event.timeStamp);
				ref.primitive.innerHTML = "<img src=\"img/water.jpg\" width=\"50\" height=\"50\" />";
				_changeStatus(ref.primitive, 'done');
			}
		}
		
	}()));