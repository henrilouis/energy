var EnergyClockModel = function(){
	
	

	/********************************************************************************
								Observable functions.
	********************************************************************************/

	var listeners = [];
	
	notifyObservers = function (args) {
	    for (var i = 0; i < listeners.length; i++){
	        listeners[i].update(args);
	    }
	};
	
	this.addObserver = function (listener) {
	    listeners.push(listener);
	};

}