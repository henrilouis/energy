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
	
	var barClock = new BarClock(container,data, options);
	var bezierClock = new BezierClock(container,data, options);
	this.barClock = barClock;
	this.bezierClock = bezierClock;

	/********************************************************************************
								Adding navigation.
	********************************************************************************/

	var menuContainer = 	$("<div id='menuContainer'>");
	var buttonGroup = 		$("<div class='btn-group'>");

	var barButton = 		$("<button title='Bar View' class='btn btn-default active'>");
	var bezierButton = 		$("<button title='Bezier View' class='btn btn-default'>");

	var barSpan = 			$("<span class='glyphicon glyphicon-stats'>");
	var bezierSpan = 		$("<span class='glyphicon glyphicon-record'>");

	barButton.append(barSpan);
	bezierButton.append(bezierSpan);
	buttonGroup.append(barButton,bezierButton);

	/********************************************************************************
							Adding the icons for each category.
	********************************************************************************/
	
	var iconsContainer = $("<div id='iconsContainer'>");
		iconsContainer.css('margin-left',($('#barEnergyClock svg').width()/2) -112);
		iconsContainer.css('margin-top',(-$('#barEnergyClock svg').height()/2)+50);

	var gasContainer = $("<div class='iconContainer'>");
	var gasIcon = $("<svg width='40' height='54'><path fill='"+options.colors[0]+"' d='M36.637,33.405C34.373,24.244,9.214,0,9.214,0S3.727,24.244,1.461,33.405c-2.106,8.522,2.276,16.261,8.345,20.356c-1.802-5.667-3.188-12.581-0.592-15.647c0,0,3.467-4.235,3.899-9.701c0,0,5.807,3.635,5.937,11.435c0,0,4.204-8.883,0-15.382c0,0,16.498,8.349,11.535,29.497C35.021,49.602,38.385,40.473,36.637,33.405z'/>")
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


	var elecContainer = $("<div class='iconContainer'>");
	var elecIcon = $("<svg width='25' height='60'><polygon fill='"+options.colors[1]+"' points='24.939,27.604 15.009,27.604 19.569,0 0,32.351 9.931,32.351 5.371,59.956'>");
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

	var waterContainer = $("<div class='iconContainer'>");
	var waterIcon = $("<svg width='40' height='54'><path fill='"+options.colors[2]+"' d='M34.917,31.546c2.932,11.858-7.436,22.119-16.609,22.119c-9.173,0-19.54-10.26-16.608-22.119C3.838,22.895,18.308,0,18.308,0S32.778,22.895,34.917,31.546z'/>");
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
	$(container).append(buttonGroup);

	/********************************************************************************
							 Public variables and functions
	********************************************************************************/
	this.barButton 			= barButton;
	this.bezierButton 		= bezierButton;

	this.gasContainer 		= gasContainer;
	this.elecContainer 		= elecContainer;
	this.waterContainer 	= waterContainer;

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

		var d = new Date();

		gasLabel.html("SEK "+Math.round(gasCount()));
		elecLabel.html("SEK "+Math.round(elecCount()));
		waterLabel.html("SEK "+Math.round(waterCount()));

	}

}