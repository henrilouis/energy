var EnergyClockModel = function(){

	var data, copy, selected, selectedNumber;

	/********************************************************************************
									Public functions.
	********************************************************************************/

	// get current dataset to put in the clocks
	var getSelected = function(){
		return createCopy(selected);
	}
	this.getSelected = getSelected;

	// get the number to calculate date from.. for now we use only days
	var getSelectedDate = function(){
		var d = new Date();
		if(selectedNumber != null){
			d.setDate(d.getDate()-data.length);
			d.setDate(d.getDate()+selectedNumber+1);
		}
		return d;
	}
	this.getSelectedDate = getSelectedDate;

	var setSelected = function(value){
		selected = data[value];
		selectedNumber = value;
		notifyObservers();
	}
	this.setSelected = setSelected;

	var setLatestSelected= function(){
		selected = data[data.length-1];
		selectedNumber = data.length-1;
		notifyObservers();
	}
	this.setLatestSelected = setLatestSelected;

	var getData = function(){
		return data;
	}
	this.getData = getData;

	/********************************************************************************
								   Create random data.
	********************************************************************************/

	var createRandomData = function(){
		data = [];
		for(i=0; i<356; i++){
			data.push([]);
			for(j=0; j<3; j++){
				data[i].push([]);
				for(k=0; k<3; k++){
					data[i][j].push([]);
					for(l=0; l<24; l++){
						if(i == 355){
							var date = new Date();
							if(l>date.getHours() && j==0){
								data[i][j][k].push(0);
							}
							else{
								data[i][j][k].push(Math.random()*10);
							}
						}
						else{
							data[i][j][k].push(Math.random()*10);
						}

					}
				}
			}
		}
		setLatestSelected();
		notifyObservers("init");
	}

	var resendData = function(){
		notifyObservers();
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
	
	this.addObserver = function (listener) {
	    listeners.push(listener);
	};

	setTimeout(createRandomData,300);
}