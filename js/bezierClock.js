var BezierClock = function(container, data, options){

	var date 					= new Date();
	var currentTime 			= date.getHours();
	var selectedDate;
	var dateBool 				= false;
	var nightMode 				= false;
	var svg, barCharts, centerPiece, backgroundCircle, handArc, arcGradient, clockHand, clockTime, 
		gasIcon, electricityIcon, waterIcon, gasMeter, electricityMeter, waterMeter;
	var lineData = [[],[],[],[]];
	var oldlineData = [[],[],[],[]];
	var clipMask =[];
	var clipMaskInverted =[];

	/*****************************************
					Options
	*****************************************/

	var defaults = {

		barHeight 				: 173,
		barWidth				: 10,
		gap 					: -3,
		centerRadius 			: 170,
		centerWidth				: 15,
		backgroundColor			: "#FFFFFF",
		fontColor				: "#3F4953",
		mainColor				: "#E25942",
		colors					: ["#E25942","#F6CB51","#13A89E"],
		nightBackgroundColor    : '#222222',
		nightFontColor			: '#EFEFEF',
		timeFontSize			: 55,

	};

	var options = $.extend(defaults,options);
	var o = options;

	/*****************************************
				Public functions
	*****************************************/
	
	var dateToggle = function(value){
		dateBool = value;
		clockUpdate();
	}

	var selectDate = function(date){
		selectedDate = date;
		clockUpdate();
	}

	var toggleNightMode = function(){
		
		if(nightMode){
			energyClock.style('background',o.backgroundColor);
			backgroundCircle.style("fill",o.backgroundColor);
			clockHand.style('fill',o.backgroundColor);
			clockTime.style('fill',o.fontColor);
			nightMode = false;
		}else{
			energyClock.style('background',o.nightBackgroundColor);
			backgroundCircle.style("fill",o.nightBackgroundColor);
			clockTime.style('fill',o.nightFontColor);
			clockHand.style('fill',o.nightBackgroundColor);
			nightMode = true;
		}

	}

	this.drawClock 				= drawClock;
	this.update 				= update;
	this.dateToggle				= dateToggle;
	this.selectDate				= selectDate;
	this.toggleNightMode		= toggleNightMode;

	/*****************************************
				Helper variables
	*****************************************/

	var dataSum = function(length){
		var d = new Array;
		for(i=0; i<data[0][0].length; i++){
			d.push(0);
			for(j=0; j<data[0].length; j++){
				d[i] += data[0][j][i];
			}
		}
		return d;
	};

	var maximum = d3.max(dataSum())+10;
	var circularAmount = 360/data[0][0].length;
	var hournumber = parseInt(getTime().slice(0, -3));
	var bezierOffset =o.gap+o.centerRadius+o.centerWidth;
	
	stack = d3.layout.stack().offset("zero");

	var diameter = (o.centerRadius*2) + (o.centerWidth*2) + (o.gap*2) + (o.barHeight*2);

	var scaleCalc = d3.scale.linear()
		.range( [ 0,360-( 360/data[0][0].length ) ] )
		.domain([0,data[0][0].length-1]);

	function calcHeight(number){
		return number/d3.max(dataSum())*o.barHeight;
	}

	function getTime(){
		var d = new Date(); 
		formatTime = d3.time.format("%H:%M");
		return formatTime(d);
	}

	function toRadians (angle){
  		return angle * (Math.PI / 180);
	}

	/*****************************************
				Creating the clock
	*****************************************/

	var energyClock = d3.select(container).append("div")
		.attr('id','bezierEnergyClock')
		.style('width',diameter)
		.style('background',o.backgroundColor);

	function drawClock(){

		//The data for our line
		svg = d3.select("#bezierEnergyClock").append("svg")
			.attr("width",diameter)
			.attr("height",diameter);
		
		/*****************************************
				Creating the bezier lines
		*****************************************/
		//calcute x, y coordinates
		createLineData(data);
		
		//This is the accessor function to create intermediate points
		var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
                        .interpolate("cardinal-closed");
        
        var lineFunctionLinear = d3.svg.line()
                         .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
                        .interpolate("linear");

        // create clipping masks for data
        clipper = svg.append("svg:clipPath")
		    .attr("id", "clipper")
		    .append("svg:path")
		  	.attr("d", lineFunctionLinear(clipMask));

		invertedclipper = svg.append("svg:clipPath")
		    .attr("id", "invertedclipper")
		    .append("svg:path")
		  	.attr("d", lineFunctionLinear(clipMaskInverted));
		
		//kan effiecienter met for loop maar kreeg het niet lekker werkend (kon ze niet meer aanpassen)
		//previous data:
		oldlineGraph3 = svg.append("path")
    	  .attr("id", "oldlineGraph")
          .attr("d", lineFunction(oldlineData[2]))
          .attr("stroke", o.colors[2])
          .attr("stroke-width", 3)
          .attr("clip-path", "url(#invertedclipper)")
          .style("opacity", 0.2)
          .attr("fill", "grey");

        oldlineGraph2 = svg.append("path")
    	  .attr("id", "oldlineGraph")
          .attr("d", lineFunction(oldlineData[1]))
          .attr("stroke", o.colors[1])
          .attr("stroke-width", 3)
          .attr("clip-path", "url(#invertedclipper)")
          .style("opacity", 0.2)
          .attr("fill", "grey");

    	oldlineGraph1 = svg.append("path")
    	  .attr("id", "oldlineGraph")
          .attr("d", lineFunction(oldlineData[0]))
          .attr("stroke", o.colors[0])
          .attr("stroke-width", 3)
          .attr("clip-path", "url(#invertedclipper)")
          .style("opacity", 0.2)
          .attr("fill", "grey");
		  
		// current data:
	    lineGraph3 = svg.append("path")
    	  .attr("id", "oldlineGraph")
          .attr("d", lineFunction(lineData[2]))
          .attr("stroke", o.colors[2])
          .attr("stroke-width", 3)
          .attr("clip-path", "url(#clipper)")
          .attr("fill", o.colors[2]); 
		 
		lineGraph2 = svg.append("path")
    	  .attr("id", "oldlineGraph")
          .attr("d", lineFunction(lineData[1]))
          .attr("stroke", o.colors[1])
          .attr("stroke-width", 3)
          .attr("clip-path", "url(#clipper)")
          .attr("fill", o.colors[1]);

    	lineGraph1 = svg.append("path")
    	  .attr("id", "oldlineGraph")
          .attr("d", lineFunction(lineData[0]))
          .attr("stroke", o.colors[0])
          .attr("stroke-width", 3)
          .attr("clip-path", "url(#clipper)")
          .attr("fill", o.colors[0]);
              
	    //The average data line SVG Path
		lineGraph4 = svg.append("path")
	                  .attr("d", lineFunction(lineData[3]))
	                  	.attr('stroke-dasharray', '10,10')
	                    .attr("stroke", "grey")
	                    .attr("stroke-width", 1)
	                    .attr("fill", "none");

		/*****************************************
				Creating the clock center
		*****************************************/
		centerPiece = svg.append('g')
			.attr('id','centerPiece')
			.attr( 'transform' , 'translate('+( diameter/2 )+','+( diameter/2 )+')');
		
		backgroundCircle = centerPiece.append( 'circle' )
			.attr( "r", o.centerRadius+o.centerWidth+o.gap+4)
			.style("fill",o.backgroundColor);

		handArc = d3.svg.arc()
			.innerRadius( o.centerRadius )
			.outerRadius( o.centerRadius+o.centerWidth )
			.startAngle( 0 )
			.endAngle( 360 );

		arcGradient = centerPiece.append("defs").append("radialGradient")
	    		.attr("gradientUnits", "userSpaceOnUse")
	    		.attr("cx", 0)
	    		.attr("cy", 0)
	    		.attr("r", o.centerRadius+o.centerWidth)
	    		.attr("id", function(d, i) { return "grad1"; });
			arcGradient.append("stop").attr("offset", "55%").style("stop-color", "white");
			arcGradient.append("stop").attr("offset", "100%").style("stop-color", function(d, i) { return o.mainColor; });

		centerPiece.append( "path" )
			.attr( "d" , handArc )
			.attr("fill", function(d, i) { return "url(#grad1)"});
			
		clockHand = centerPiece.append( "path" )
			.attr( 'transform' , 'rotate('+scaleCalc( currentTime )+') translate(0,'+ -( o.centerRadius+o.centerWidth+12 ) +') scale(4)')
			.attr('d', function() {
		        return 'M ' + 0 +' '+ 0 + ' l 4 3 l -8 0 z';
	      	})
	      	.style( 'fill',o.backgroundColor );

	    clockTime = centerPiece.append( "text" )
	    	.attr('class','clockTime')
	    	.text(getTime())
	    	.attr("dy", -15)
	    	.attr("text-anchor", "middle")
	    	.style("font-size",o.timeFontSize+"px")
	    	.style("fill",o.fontColor);
	}
	drawClock();

	/*****************************************
		Update the clock using transitions
	*****************************************/

	function update(data){
				
		/*****************************************
		Update the bezier lines using transitions
		*****************************************/
		//calcute x, y coordinates
		createLineData(data);
		
		//Accessor function to create intermediate points
		var lineFunction = d3.svg.line()
                        .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
                        .interpolate("cardinal-closed");

        var lineFunctionLinear = d3.svg.line()
                         .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
                        .interpolate("linear");

        // update clipping masks for data
        clipper.transition()
		  	.attr("d", lineFunctionLinear(clipMask));

		invertedclipper.transition()
		  	.attr("d", lineFunctionLinear(clipMaskInverted));
  	
        //kan effiecienter maar kreeg het niet lekker werkend met for loop (niet meer aanspreekbaar)
        if(!dateBool){

        	oldlineGraph1.style('opacity','0.2');
        	oldlineGraph2.style('opacity','0.2');
        	oldlineGraph3.style('opacity','0.2');

        	oldlineGraph3.transition()
			.attr("d", lineFunction(oldlineData[2]));
			oldlineGraph2.transition()
			.attr("d", lineFunction(oldlineData[1]));
			oldlineGraph1.transition()
			.attr("d", lineFunction(oldlineData[0]));
        }
        else{
        	oldlineGraph1.style('opacity','0');
        	oldlineGraph2.style('opacity','0');
        	oldlineGraph3.style('opacity','0');
        }
		
	
		lineGraph3.transition()
			.attr("d", lineFunction(lineData[2]));
		lineGraph2.transition()
			.attr("d", lineFunction(lineData[1]));
		lineGraph1.transition()
			.attr("d", lineFunction(lineData[0]));

		lineGraph4.transition()
			.attr("d", lineFunction(lineData[3]))
	}

	function createLineData(data){
		lineData = [[],[],[],[]];
		oldlineData = [[],[],[],[]];
		circularAmount = 360/data[0][0].length;
		hournumber = parseInt(getTime().slice(0, -3));
			
			//clipping mask path for current data              
	        for (i=0; i<hournumber+1;i++)
	        {
	       		var circularSinValue = Math.sin(toRadians(circularAmount*[i]));
				var circularCosValue = Math.cos(toRadians(circularAmount*[i]));
	         	clipMask[i] ={ "x": diameter/2 + circularSinValue*500,   "y":diameter/2 - circularCosValue*500};             
	        }
	        clipMask[clipMask.length] ={ "x":  diameter/2,"y": diameter/2};  

	        //clipping mask path for previous data
	        for (j=hournumber; j<24+1;j++)
	        {
	       		var circularSinValue = Math.sin(toRadians(circularAmount*[j]));
				var circularCosValue = Math.cos(toRadians(circularAmount*[j]));
	         	clipMaskInverted[j-hournumber] ={ "x": diameter/2+ circularSinValue*500,   "y":diameter/2 - circularCosValue*500};             
	        }
	        clipMaskInverted[clipMaskInverted.length] ={ "x":  diameter/2,"y": diameter/2}; 

			//kan effiecienter maar dan is het misschien een idee om in het model al optelsommetjes te maken
			for (i=0; i<data[0][0].length; i++)
			{	
				var circularSinValue = Math.sin(toRadians(circularAmount*[i]));
				var circularCosValue = Math.cos(toRadians(circularAmount*[i]));

				//current line data
				lineData[0][i]= { "x": diameter/2+ circularSinValue*((data[0][0][i])								/maximum*o.barHeight+bezierOffset),   "y":diameter/2 - circularCosValue*((data[0][0][i])								/maximum*o.barHeight+bezierOffset)} ;
				lineData[1][i]= { "x": diameter/2+ circularSinValue*((data[0][0][i]+data[0][1][i])					/maximum*o.barHeight+bezierOffset),   "y":diameter/2 - circularCosValue*((data[0][0][i]+data[0][1][i])				/maximum*o.barHeight+bezierOffset)} ;
				lineData[2][i]= { "x": diameter/2+ circularSinValue*((data[0][0][i]+data[0][1][i]+data[0][2][i])	/maximum*o.barHeight+bezierOffset),   "y":diameter/2 - circularCosValue*((data[0][0][i]+data[0][1][i]+data[0][2][i])	/maximum*o.barHeight+bezierOffset)} ;

				//average line data (only for combined)
				lineData[3][i]= { "x": diameter/2+ circularSinValue*((data[2][0][i]+data[2][1][i]+data[2][2][i])	/maximum*o.barHeight+bezierOffset),   "y":diameter/2 - circularCosValue*((data[2][0][i]+data[2][1][i]+data[2][2][i])	/maximum*o.barHeight+bezierOffset)} ;
				
				//previous line data
				oldlineData[0][i]= { "x": diameter/2+ circularSinValue*((data[1][0][i])								/maximum*o.barHeight+bezierOffset),   "y":diameter/2 - circularCosValue*((data[1][0][i])								/maximum*o.barHeight+bezierOffset)} ;
				oldlineData[1][i]= { "x": diameter/2+ circularSinValue*((data[1][0][i]+data[1][1][i])				/maximum*o.barHeight+bezierOffset),   "y":diameter/2 - circularCosValue*((data[1][0][i]+data[1][1][i])				/maximum*o.barHeight+bezierOffset)} ;
				oldlineData[2][i]= { "x": diameter/2+ circularSinValue*((data[1][0][i]+data[1][1][i]+data[1][2][i])	/maximum*o.barHeight+bezierOffset),   "y":diameter/2 - circularCosValue*((data[1][0][i]+data[1][1][i]+data[1][2][i])	/maximum*o.barHeight+bezierOffset)} ;
			}	

			//data from previous day is startpoint for new day
			oldlineData[0][0]= lineData[0][0];
			oldlineData[1][0]= lineData[1][0];
			oldlineData[2][0]= lineData[2][0];

			return lineData;
			return oldlineData;
	}

	/*****************************************
		Update the digital and analog clock
		every second
	*****************************************/
	
	var clockUpdate = function(){
		if(dateBool){
			var format = d3.time.format("%Y-%m-%d");
			clockTime.text(format(selectedDate))
		}
		else{
			var d = new Date(Date.now());

			if (d.getHours() > currentTime || (d.getHours == 0 && currentTime == 23)){
				clockHand.transition().attr( 'transform' , 'rotate('+scaleCalc( d.getHours() )+') translate(0,'+ -( o.centerRadius+o.centerWidth+12 ) +') scale(4)');
			}
			
			// Also updating currentTime
			currentTime = d.getHours();
			clockTime.text(getTime())
		}
	}
	setInterval(clockUpdate,1000)

}
