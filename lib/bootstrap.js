
	/*global VNS: true*/
	
	//
	// While DOM construction is underway or finished bootstrap allows : 
	//		- precise click event handling
	//		- on demand behavior loading and execution
	//
	// dependencies :
	//		- prototype.js library
	//		- VNS lib (viadeo.com)
	
	(function(ns){
	
		ns.bootstrap = (function(){
								 
			var
				browser,
				componentsLib,
				stack
			;
			
			// helper log function
			function log(message, options){
				if(window.console !== undefined){
					var
						opt = options || {},
						type = opt.type || 'log'
					;
					try{console[type](message);}catch(e){};
				}
			}
				
			// Browser events and states
			browser = (function(){
								  
				var _isDOMLoaded = false;
									  
				// Native events listeners
				// catches if a component is involved when click occurs
				// and listens to DOM load
				document
					.observe('click', function(event){
						var 
							target = event.findElement(),
							primitive = target.up('[data-type=component]') || (target.getAttribute('data-type') === 'component' ? target : undefined)
						;
						if(primitive !== undefined){
							var componentName = primitive.getAttribute('data-name'),
								componentURL = primitive.getAttribute('data-url');
							if(componentName !== undefined && componentURL !== undefined){
								log('$browser > asking for new entry : ' + componentName, {type : 'warn'});
								componentsLib.addEntry(componentName, componentURL, event, {
									primitive : primitive,
									target : target
								});
							}
						}
					})
					.observe('dom:loaded', function(){// DOM load Cacther				   
						log('$browser > DOM loaded -> stack execution', {type : 'warn'});
						stack.run();
						_isDOMLoaded = true;
					})
				;
				
				return {
					isDOMLoaded : function(){return _isDOMLoaded;}
				};
			
			}());
			
			
			// Component Library
			componentsLib = (function(){
										  
				var _components = {};
				
				//Component Model
				function Component(event, domRef){
					
					// attributes
					this._event = event;
					this._domRef = domRef;
					this._callback = { // always have default values - it costs less than a test
						'immediate callback' : function(){},
						'deferred callback' : function(){}
					};
					
					// methods
					this.addCallbacks = function(callbacks){
						this._callback['immediate callback'] = callbacks['immediate callback'] ? callbacks['immediate callback'] : this._callback['immediate callback'];
						this._callback['deferred callback'] = callbacks['deferred callback'] ? callbacks['deferred callback'] : this._callback['deferred callback'];
					};
					this.run = function(type){
						this._callback[type](this._event, this._domRef);
					};
					this.updateEvent = function(event, domRef){
						this._event = event;
						this._domRef = domRef;
					};
					
				}
				
				// treatment of components callbacks : immediate is execute, deferred is given to stack
				function _handleCallbacks(name){
		
					var currentComponent = _components[name];
					
					log('$componentsLib > immediate callback executed');
					currentComponent.run('immediate callback');
					
					log('$componentsLib > deferred behaviors reference given to stack');
					stack.add(name);
					
				}
				
				return {
					addEntry : function(name, url, event, domRef){
						if (_components[name] === undefined){
							log('$componentsLib > new component entry : ' + name + ' -> loading resource...');
							_components[name] = new Component(event, domRef);
							ns.require(url);
						} else {
							log('$componentsLib > known component entry : ' + name + ' -> updating native event reference');
							_components[name].updateEvent(event, domRef);
							_handleCallbacks(name);
						}
					},
					registerBehaviors : function(name, callbacks){
						log('$componentsLib > registering new behaviors from : ' + name);
						_components[name].addCallbacks(callbacks);
						_handleCallbacks(name);
					}, 
					runDeferred : function(name){
						var currentComponent = _components[name];
						log('$componentsLib > run deferred callback from ' + name);
						currentComponent.run('deferred callback');
					}
				};
			}());
			
			
			// Callbacks Stack
			stack = (function(){
								  
				var _stack = {};
								  
				return {
					add : function(componentName){
						// if DOM already loaded run
						if(browser.isDOMLoaded()){
							log('$stack > DOM loaded -> self-rewriting add method becomes direct execution');
							this.add = function(componentName){
								log('$stack > direct execution');
								componentsLib.runDeferred(componentName);
							};
							this.add(componentName);
						} else {
							log('$stack > DOM not loaded -> add reference to stack');
							_stack[componentName] = true;
						}
					},
					run : function(){
						log('$stack > beginning run and dump...');
						var componentName;
						for(componentName in _stack){
							if(_stack.hasOwnProperty(componentName)){
								componentsLib.runDeferred(componentName);
								delete _stack[componentName];
							}
						}
						log('$stack > ...end of run');
					}
				};
			}());
			
			return {
				registerComponent : function(name, callbacks){ // components entry point
					log('$bootstrap > registering new component : ' + name);
					componentsLib.registerBehaviors(name, callbacks);
				}
			};
				
		}());
	
	}(VNS.resource));