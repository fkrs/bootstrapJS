	
	VNS.resource.bootstrap.registerComponent('my component', (function(){
		
		function _changeBorderStyle(elm, color){
			elm.setStyle({'border' : '3px solid ' + color});
		}
		
		return {
			'immediate callback' : function(event, ref){
				console.info('$my_component > do it immediately / ' + event.timeStamp);
				_changeBorderStyle(ref.primitive, 'green');
			},
			'deferred callback' : function(event, ref){
				console.info('$my_component > do it after load / ' + event.timeStamp);
				_changeBorderStyle(ref.primitive, 'red');
			}
		}
		
	}()));