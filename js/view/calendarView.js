var CalendarView = function(container,model){

	var data 					= [[1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8],
								   [9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2]];
	var options 				= {

		width                   : 225,
		squareHeight			: 3,
		squareWidth				: 3,
		squarePadding			: 0,
		squareMargin			: 0,
		domainOffset 			: 0,
		selectionPadding		: 10,
		backgroundColor			: "#FFFFFF",
		fontColor				: "#EFEFEF",
		handColor				: "#E25942",
		colors					: ["#ADD5F7","#7FB2F0","#4E7AC7","#35478C","#16193B"]

	};

	$(container).css('position','absolute');
	$(container).css('margin-left',($('#barEnergyClock svg').width()/2) - (options.width/2));
	$(container).css('margin-top',($('#barEnergyClock svg').height()/2) - 140);

	model.addObserver(this);

	this.update = function(args){

		// Transform the data from the model into usable stuff
		if(args == "init"){
			data.length = 0;
			var rawData = model.getData();
			for(var i=0; i<rawData.length; i++){
				data.push([]);
				for(var j=0; j<rawData[0][0][0].length; j++){

					data[i].push(rawData[i][0][0][j]+rawData[i][0][1][j]+rawData[i][0][2][j]);

				}
			}
			var scrollCalendar = new ScrollCalendar(container,data,options, model);

			$("#scrollCalendarContainer").scroll(function(event) {

				var workWidth = $("#scrollCalendarContainer").scrollLeft();
				var selection = Math.round(workWidth / $('#scrollCalendar g').outerWidth(true));

				//console.log(selection);

				model.setSelected(selection);
			});
			
		}
		
	}
}