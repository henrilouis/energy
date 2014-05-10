var EnergyClockModel = function(){

	var data, copy;
	/********************************************************************************
								Create random data.
	********************************************************************************/
	var createRandomData = function(){
		data = [ [[],[],[]] , [[],[],[]] , [[],[],[]] ];
		for(i=0; i<3; i++){
			for(j=0; j<24; j++){
				data[0][i].push(Math.random()*10);
				data[1][i].push(Math.random()*10);
				data[2][i].push(Math.random()*10);
			}
		}

		notifyObservers(createCopy(data));
	}

	setInterval(createRandomData,3000);

	var resendData = function(){
		notifyObservers(createCopy(data));
	}

	this.resendData = resendData;

	/********************************************************************************
								Helper variable.
	********************************************************************************/
	var createCopy = function(data){
		copy = [];

		for(i=0; i<data.length; i++){
			copy.push([]);
			for(j=0; j<data[0].length; j++){
				copy[i].push([]);
				for(k=0; k<data[0][0].length; k++){
					copy[i][j] = data[i][j].slice();
				}
			}
		}

		return copy;
	}
	/********************************************************************************
								Observable functions.
	********************************************************************************/

	var listeners = [];
	
	notifyObservers = function (args) {
	    for (var i = 0; i < listeners.length; i++){
	        listeners[i].update(args);
	    }
	};
	this.notifyObservers =
	
	this.addObserver = function (listener) {
	    listeners.push(listener);
	};
}