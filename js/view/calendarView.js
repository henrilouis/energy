var CalendarView = function(container,model){

	var data 					= [[1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8],
								   [9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2]];
	var options 				= [];

	model.addObserver(this);

	this.update = function(args){

		if(args == "init"){
			data.length = 0;
			var rawData = model.getData();
			for(var i=0; i<rawData.length; i++){
				data.push([]);
				for(var j=0; j<rawData[0][0][0].length; j++){

					data[i].push(rawData[i][0][0][j]+rawData[i][0][1][j]+rawData[i][0][2][j]);

				}
			}
			var scrollCalendar = new ScrollCalendar(container,data,options);
		}
		
	}
}