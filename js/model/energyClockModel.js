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
		var	gasAddition = 0;
		var	electrictyAddition = 0;
		var	waterAddition = 0;
		var	morningAddition = 0;
		var	middayAddition = 0;
		var	eveningAddition = 0;
		var nightAddition = 0;
		for(i=0; i<52; i++){
			data.push([],[],[],[],[],[],[]);
			//weekdays:
			for(x=0; x<7; x++){

				if(x<5){
					nightAddition = 0;
					morningAddition = 0;
					middayAddition = 0;
					eveningAddition = 0;
				}
				else{
					morningAddition = -5;
					middayAddition = 5;
					eveningAddition = 5;
					nightAddition = 3;
				}

					for(j=0; j<3; j++){
					data[i*7+x].push([]);
					for(k=0; k<3; k++){
						data[i*7+x][j].push([]);
						for(l=0; l<24; l++){
							if(i == 355){
								var date = new Date();
								if(l>date.getHours() && j==0){
									data[i*7+x][j][k].push(0);
								}
								else{

									if(l<6){
										data[i*7+x][j][k].push((Math.random()*(3+nightAddition)));
									}
									else if(l > 5 && l < 9){
										data[i*7+x][j][k].push((Math.random()*(10+morningAddition))+1);
									}
									else if(l > 8 && l < 18){
										data[i*7+x][j][k].push((Math.random()*(4+middayAddition))+1);
									}
									else if(l > 17 && l < 22){
										data[i*7+x][j][k].push((Math.random()*(10+eveningAddition))+1);
									}
									else if(l > 21 && l < 25){
										data[i*7+x][j][k].push((Math.random()*(8+eveningAddition))+1);
									}
									
								}
							}
							else{
									if(l<6){
										data[i*7+x][j][k].push((Math.random()*(3+nightAddition)));
									}
									else if(l > 5 && l < 9){
										data[i*7+x][j][k].push((Math.random()*(10+morningAddition))+1);
									}
									else if(l > 8 && l < 18){
										data[i*7+x][j][k].push((Math.random()*(4+middayAddition))+1);
									}
									else if(l > 17 && l < 22){
										data[i*7+x][j][k].push((Math.random()*(10+eveningAddition))+1);
									}
									else if(l > 21 && l < 25){
										data[i*7+x][j][k].push((Math.random()*(8+eveningAddition))+1);
									}
							}

						}
					}
				}
			}

			
		}
		setLatestSelected();
		notifyObservers("init");
	}

	var resendData = function(){
		notifyObservers("resend");
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

	createRandomData();
	setTimeout(createRandomData,300);
}