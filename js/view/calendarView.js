var CalendarView = function(container,model,parent){

	var data 					= [[1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8],
								   [9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2]];
	var options 				= {

		width                   : 400,
		squareHeight			: 7,
		squareWidth				: 7,
		squarePadding			: 0,
		squareMargin			: 1,
		domainOffset 			: 0,
		selectionPadding		: 10,
		backgroundColor			: "#FFFFFF",
		fontColor				: "#EFEFEF",
		handColor				: "#E25942",
		colors					: ["rgba(226, 89, 66, 0.2)","rgba(226, 89, 66, 0.4)","rgba(226, 89, 66, 0.6)","rgba(226, 89, 66, 0.8)","rgba(226, 89, 66, 1)"]

	};

	var scrollCalendar = new ScrollCalendar(container,options,model);

	var prevSelection;

	$(container).css('position','absolute');
	$(container).css('margin-left',($('#barEnergyClock svg').width()/2) - (options.width/2));
	$(container).css('margin-top',($('#barEnergyClock svg').height()/2) - parent.options.centerRadius);
	$(container).css('overflow','hidden');

	// Sadly border radius makes the ipad version slow :(
	$(container).css('border-top-left-radius',options.width/2+"px");
	$(container).css('border-top-right-radius',options.width/2+"px");

	var convertData = function(value){

		var gas = !$(".gasContainer").hasClass('disabled');
		var elec = !$(".elecContainer").hasClass('disabled');
		var water = !$(".waterContainer").hasClass('disabled');

		data.length = 0;
		var rawData = value;
		for(var i=0; i<rawData.length; i++){
			data.push([]);
			for(var j=0; j<rawData[0][0][0].length; j++){
				var tempData = 0;
				if(gas){
					tempData += rawData[i][0][0][j];
				}
				if(elec){
					tempData += rawData[i][0][1][j];
				}
				if(water){
					tempData += rawData[i][0][2][j];
				}
				data[i].push(tempData);
			}
		}
	}

	model.addObserver(this);

	this.update = function(args){

		// Transform the data from the model into usable stuff
		if(args == "init"){

			convertData(model.getData());
			scrollCalendar.drawCalendar(data);

			$("#scrollCalendarContainer").scroll(function(event) {

				var inner = $("#scrollCalendar").width()-($("#scrollCalendarContainer").innerWidth()/2)-options.squareWidth;

				var workWidth = $("#scrollCalendarContainer").scrollLeft();
				var selection = Math.round(workWidth / $('#scrollCalendar g').outerWidth(true));

				var calendarHeight = $("#calendar").height();
				//console.log("workWidth: "+workWidth);
				//console.log("inner: "+inner);
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
				if(selection != prevSelection){
					model.setSelected(selection);
					prevSelection = selection;
				}
				
			});

			$("#scrollCalendar").click(function(event) {

			    $("html, body").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(){
			        $("#scrollCalendarContainer").stop();
			    });

			    var animateScroll = function(){
			    	
			    	$("#scrollCalendarContainer").animate({
			    		scrollLeft: $("#scrollCalendar").width()-options.width/2
			    	},(((data.length+1)*1000) * (1-($("#scrollCalendarContainer").scrollLeft()/($("#scrollCalendar").width()-options.width/2))))
			    	,'linear'
			    	,function(){
			        	$("#scrollCalendarContainer").scrollLeft(0);
			        	animateScroll();
			   		});

			    }
			    animateScroll();
			    return false; 

			});
			

		}
		else if(args == "resend")
		{
			convertData(model.getData());
			scrollCalendar.update(data);
		}
		
	}
}