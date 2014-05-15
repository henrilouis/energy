var ClockView = function(container,model){

	var data =[ 	//today
				[	[4,7,3,5,6,5,1,1,2,3,4,5,6,7,8,9,8,7,6,5,5,4,6,4],
					[9,9,8,8,7,7,7,6,6,5,5,4,4,4,4,3,3,3,2,2,2,1,1,1],
					[9,8,7,6,5,4,3,2,1,0,1,2,3,4,5,6,7,8,9,8,7,2,3,4]
			   	],
			   		//yesterday
			   	[	[9,8,7,6,5,4,3,2,1,0,1,2,3,4,5,6,7,8,9,8,7,1,1,1],
					[4,7,3,5,6,5,1,1,2,3,4,5,6,7,8,9,8,7,6,5,5,1,3,4],
					[9,9,8,8,7,7,7,6,6,5,5,4,4,4,4,3,3,3,2,2,2,1,1,1]
				],
					//averages
				[	[7,6,7,6,5,3,5,1,1,0,2,2,4,4,7,6,6,8,3,8,7,5,5,4],
					[5,7,3,5,6,5,1,4,3,3,4,5,6,7,6,9,8,6,6,5,4,4,3,6],
					[9,7,8,1,7,7,7,3,6,4,5,4,4,4,4,3,3,3,2,1,2,1,3,1]
				],
			  ];

	var gasBool = true, elecBool = true, waterBool = true;

	var options = {

			barWidth				: 10,
			centerRadius 			: 200,
			centerWidth				: 15,
			backgroundColor			: "#FFFFFF",
			fontColor				: "#3F4953",
			handColor				: "#E25942",
			mainColor				: "#E25942",
			colors					: ["#E25942","#F6CB51","#13A89E"],
			timeFontSize			: 55,

		}

	this.options = options;

	var barClock = new BarClock(container, data, options);
	var bezierClock = new BezierClock(container, data, options);
	
	/********************************************************************************
							Adding the icons for each category.
	********************************************************************************/
	
	var iconsContainer = $("<div id='iconsContainer'>");
		iconsContainer.css('margin-left',($('#barEnergyClock svg').width()/2) -112);
		iconsContainer.css('margin-top',(-$('#barEnergyClock svg').height()/2)+65);

	var gasContainer = $("<div class='iconContainer gasContainer'>");
	var gasIcon = $("<svg width='28' height='38'><path transform='scale(0.7)' fill='"+options.colors[0]+"' d='M36.637,33.405C34.373,24.244,9.214,0,9.214,0S3.727,24.244,1.461,33.405c-2.106,8.522,2.276,16.261,8.345,20.356c-1.802-5.667-3.188-12.581-0.592-15.647c0,0,3.467-4.235,3.899-9.701c0,0,5.807,3.635,5.937,11.435c0,0,4.204-8.883,0-15.382c0,0,16.498,8.349,11.535,29.497C35.021,49.602,38.385,40.473,36.637,33.405z'/>")
	var gasLabel = $("<div class='units'>");
		gasLabel.css('margin-top','6px');
	var gasCount = function(){
		var count = 0;
		for(i=0; i<data[0][0].length; i++){
			count += data[0][0][i];
		}
		return count;
	}
	gasLabel.html("SEK "+Math.round(gasCount()));
	gasContainer.append(gasIcon,gasLabel);
	$(iconsContainer).append(gasContainer);


	var elecContainer = $("<div class='iconContainer elecContainer'>");
	var elecIcon = $("<svg width='18' height='44'><polygon transform='scale(0.7)' fill='"+options.colors[1]+"' points='24.939,27.604 15.009,27.604 19.569,0 0,32.351 9.931,32.351 5.371,59.956'>");
	var elecLabel = $("<div class='units'>");
	var elecCount = function(){
		var count = 0;
		for(i=0; i<data[0][1].length; i++){
			count += data[0][1][i];
		}
		return count;
	}
	elecLabel.html("SEK "+Math.round(elecCount()));
	elecContainer.append(elecIcon,elecLabel);
	$(iconsContainer).append(elecContainer);

	var waterContainer = $("<div class='iconContainer waterContainer'>");
	var waterIcon = $("<svg width='28' height='38'><path transform='scale(0.7)' fill='"+options.colors[2]+"' d='M34.917,31.546c2.932,11.858-7.436,22.119-16.609,22.119c-9.173,0-19.54-10.26-16.608-22.119C3.838,22.895,18.308,0,18.308,0S32.778,22.895,34.917,31.546z'/>");
	var waterLabel = $("<div class='units'>");
		waterLabel.css('margin-top','6px');
	var waterCount = function(){
		var count = 0;
		for(i=0; i<data[0][2].length; i++){
			count += data[0][2][i];
		}
		return count;
	}
	waterLabel.html("SEK "+Math.round(waterCount()));
	waterContainer.append(waterIcon,waterLabel);
	$(iconsContainer).append(waterContainer);
	$(container).append(iconsContainer);

	/********************************************************************************
					   	   Adding the icons for night/day
	********************************************************************************/
	var graphicSwitch = $("<div id='graphicSwitch'>");
		graphicSwitch.css('margin-left',$(iconsContainer).width()/2-9);
		graphicSwitch.css('margin-top','89px');
		graphicSwitch.css('position','relative');
		graphicSwitch.css('cursor','pointer');

	var dayIcon = $('<svg width="17" height="16.5"><circle stroke="'+options.colors[1]+'" fill="'+options.colors[1]+'" stroke-miterlimit="10" cx="8.75" cy="8.25" r="3.125"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="8.75" y1="3.875" x2="8.75" y2="1"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="6.562" y1="4.462" x2="5.56" y2="2.725"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="4.375" y1="8.251" x2="2.37" y2="8.25"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="6.564" y1="12.039" x2="5.56" y2="13.775"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="10.938" y1="12.038" x2="11.94" y2="13.775"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="13.125" y1="8.249" x2="15.129" y2="8.25"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="10.936" y1="4.461" x2="11.94" y2="2.725"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="4.961" y1="6.063" x2="2.472" y2="4.625"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="4.962" y1="10.437" x2="2.472" y2="11.875"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="8.751" y1="12.624" x2="8.75" y2="15.499"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="12.539" y1="10.437" x2="15.028" y2="11.874"/><line fill="none" stroke="'+options.colors[1]+'" stroke-miterlimit="10" x1="12.539" y1="6.062" x2="15.028" y2="4.625"/>');
		dayIcon.hide();
	var nightIcon = $('<svg width="17" height="16.5"><path fill="#000000" stroke="#000000" stroke-miterlimit="10" d="M8.32,2.794c0.198,0.797,0.315,1.625,0.315,2.483c0,3.206-1.469,6.067-3.77,7.952c0.687,0.306,1.444,0.479,2.244,0.479c3.052,0,5.526-2.474,5.526-5.526C12.635,5.547,10.789,3.347,8.32,2.794z"/>')
		
	graphicSwitch.append(dayIcon);
	graphicSwitch.append(nightIcon);
	$(iconsContainer).append(graphicSwitch);


	/********************************************************************************
					   		  The calendarview is added
	********************************************************************************/

	var calendarView = new CalendarView("#calendar", model, this);
	var calendarController = new CalendarController(calendarView,model);

	/********************************************************************************
							 Public variables and functions
	********************************************************************************/
	this.barClock 			= barClock;
	this.bezierClock 		= bezierClock;

	this.calendarView 		= calendarView;
	this.calendarController = calendarController;

	this.gasContainer 		= gasContainer;
	this.elecContainer 		= elecContainer;
	this.waterContainer 	= waterContainer;

	this.graphicSwitch 		= graphicSwitch;
	this.dayIcon			= dayIcon;
	this.nightIcon			= nightIcon;

	this.gasIcon 			= gasIcon;
	this.elecIcon 			= elecIcon;
	this.waterIcon 			= waterIcon;

	this.options 			= options;

	this.toggleGas 			= function(){

		if(gasBool){
			gasBool = false;
		}
		else{
			gasBool = true;
		}
		model.resendData();
	};
	this.toggleElec			= function(){

		if(elecBool){
			elecBool = false;
		}
		else{
			elecBool = true;
		}
		model.resendData();
	};
	this.toggleWater		= function(){

		if(waterBool){
			waterBool = false;
		}
		else{
			waterBool = true;
		}
		model.resendData();
	};

	model.addObserver(this);
	this.update = function(args){
		
		data = model.getSelected();

		if(gasBool == false){
			for(i=0; i<data[0][0].length; i++){
				data[0][0][i] = 0;
				data[1][0][i] = 0;
				data[2][0][i] = 0;
			}
		}

		if(elecBool == false){
			for(i=0; i<data[0][0].length; i++){
				data[0][1][i] = 0;
				data[1][1][i] = 0;
				data[2][1][i] = 0;
			}
		}

		if(waterBool == false){
			for(i=0; i<data[0][0].length; i++){
				data[0][2][i] = 0;
				data[1][2][i] = 0;
				data[2][2][i] = 0;
			}
		}

		barClock.update(data);
		bezierClock.update(data);

		barClock.selectDate(model.getSelectedDate());
		bezierClock.selectDate(model.getSelectedDate());

		gasLabel.html("SEK "+Math.round(gasCount()));
		elecLabel.html("SEK "+Math.round(elecCount()));
		waterLabel.html("SEK "+Math.round(waterCount()));

	}

}