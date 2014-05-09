var ClockView = function(container,model){
	var menuContainer = $("<div id='menuContainer'>");

	var buttonGroup = 		$("<div class='btn-group'>");

	var barButton = 		$("<button title='Bar View' class='btn btn-default active'>");
	var bezierButton = 		$("<button title='Bezier View' class='btn btn-default'>");

	var barSpan = 			$("<span class='glyphicon glyphicon-th-large'>");
	var bezierSpan = 		$("<span class='glyphicon glyphicon-th-list'>");

	barButton.append(barSpan);
	bezierButton.append(bezierSpan);

	buttonGroup.append(barButton,bezierButton);

	var data = [[9,8,7,6,5,4,3,2,1,0,1,2,3,4,5,6,7,8,9,8,7,6,5,4],
				[4,7,3,5,6,5,1,1,2,3,4,5,6,7,8,9,8,7,6,5,5,4,3,4],
				[9,9,8,8,7,7,7,6,6,5,5,4,4,4,4,3,3,3,2,2,2,1,1,1]];

	var gasBool = true, elecBool = true, waterBool = true;

	var options = {

			colors					: ["#E25942","#F6CB51","#13A89E"]

		}

	var barClock = new BarClock(container,data, options);
	var bezierClock = new BezierClock(container,data, options);

	/********************************************************************************
							Adding the icons for each category.
	********************************************************************************/
	var iconsContainer = $("<div id='iconsContainer'>");
		iconsContainer.css('margin-left',($('#energyClock svg').width()/2) -112);
		iconsContainer.css('margin-top',(-$('#energyClock svg').height()/2));
		iconsContainer.css('margin-left',($('#energyClock2 svg').width()/2) -112);
		iconsContainer.css('margin-top',(-$('#energyClock2 svg').height()/2));

	var gasContainer = $("<div class='iconContainer'>");
	var gasIcon = $("<svg width='40' height='54'><path fill='"+options.colors[0]+"' d='M36.637,33.405C34.373,24.244,9.214,0,9.214,0S3.727,24.244,1.461,33.405c-2.106,8.522,2.276,16.261,8.345,20.356c-1.802-5.667-3.188-12.581-0.592-15.647c0,0,3.467-4.235,3.899-9.701c0,0,5.807,3.635,5.937,11.435c0,0,4.204-8.883,0-15.382c0,0,16.498,8.349,11.535,29.497C35.021,49.602,38.385,40.473,36.637,33.405z'/>")
	var gasLabel = $("<div class='units'>");
		gasLabel.css('margin-top','6px');
	var gasCount = function(){
		var count = 0;
		for(i=0; i<data[0].length; i++){
			count += data[0][i];
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
		for(i=0; i<data[1].length; i++){
			count += data[1][i];
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
		for(i=0; i<data[2].length; i++){
			count += data[2][i];
		}
		return count;
	}
	waterLabel.html("SEK "+Math.round(waterCount()));
	waterContainer.append(waterIcon,waterLabel);
	$(iconsContainer).append(waterContainer);
	$(container).append(iconsContainer);
	$(container).append(buttonGroup);

	/********************************************************************************
						Creating random data to test with.
	********************************************************************************/

	var updateClock = function(){

		data = [[],[],[]];

		for(i=0; i<3; i++){
			for(j=0; j<24; j++){
				data[i].push(Math.random()*10);
			}
		}

		if(gasBool == false){
			for(i=0; i<24; i++){
				data[0][i] = 0;
			}
		}
		if(elecBool == false){
			for(i=0; i<24; i++){
				data[1][i] = 0;
			}
		}
		if(waterBool == false){
			for(i=0; i<24; i++){
				data[2][i] = 0;
			}
		}

		barClock.update(data);
		bezierClock.update(data);

		gasLabel.html("SEK "+Math.round(gasCount()));
		elecLabel.html("SEK "+Math.round(elecCount()));
		waterLabel.html("SEK "+Math.round(waterCount()));

	}

	setInterval(updateClock,3000);

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
	this.updateClock		= updateClock;

	this.toggleGas 			= function(){

		if(gasBool){
			gasBool = false;
		}
		else{
			gasBool = true;
		}

	};
	this.toggleElec			= function(){

		if(elecBool){
			elecBool = false;
		}
		else{
			elecBool = true;
		}

	};
	this.toggleWater		= function(){

		if(waterBool){
			waterBool = false;
		}
		else{
			waterBool = true;
		}

	};

	this.update = function(args){
		
	}

}