
	VNS.resource.bootstrap.registerComponent('my component 2', {
		'immediate callback' : function(event, ref){
			console.info('$my_component_2 > do it immediately / ' + event.timeStamp);
			ref.primitive.setStyle({'border' : '3px solid red'});
		},
		'deferred callback' : function(event, ref){
			console.info('$my_component_2 > do it after load / ' + event.timeStamp);
			ref.primitive.innerHTML += '<br/>click';
		}
	});
	
	