var CalendarView = function(container,model,parent){

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
		colors					: ["rgb(200,200,200)","rgb(150,150,150)","rgb(100,100,100)","rgb(50,50,50)","rgb(1,1,1)"]

	};

	$(container).css('position','absolute');
	$(container).css('margin-left',($('#barEnergyClock svg').width()/2) - (options.width/2));
	$(container).css('margin-top',($('#barEnergyClock svg').height()/2) - 140);
	$(container).css('overflow','hidden');
	$(container).css('border-radius','50px');

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

				var inner = $("#scrollCalendar").width()-($("#scrollCalendarContainer").innerWidth()/2)-(options.squareWidth+options.squarePadding*2+options.squareMargin*2)/2;

				var workWidth = $("#scrollCalendarContainer").scrollLeft();
				var selection = Math.round(workWidth / $('#scrollCalendar g').outerWidth(true));

				var calendarHeight = $("#calendar").height();

				if(workWidth < inner){

					lineGraph3.attr("clip-path","");
					lineGraph2.attr("clip-path","");
					lineGraph1.attr("clip-path","");

					parent.barClock.dateToggle(true);
					parent.bezierClock.dateToggle(true);
				}
				else{

					lineGraph3.attr("clip-path","url(#clipper)");
					lineGraph2.attr("clip-path","url(#clipper)");
					lineGraph1.attr("clip-path","url(#clipper)");

					parent.barClock.dateToggle(false);
					parent.bezierClock.dateToggle(false);
				}

				model.setSelected(selection);
			});

		}
		
	}
}