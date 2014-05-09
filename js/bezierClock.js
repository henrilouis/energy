var BezierClock = function(container, data, options){

	var date 					= new Date();
	var currentTime 			= date.getHours();
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

		barHeight 				: 250,
		barWidth				: 10,
		gap 					: 20,
		centerRadius 			: 170,
		centerWidth				: 15,
		backgroundColor			: "#FFFFFF",
		fontColor				: "#3F4953",
		handColor				: "#E25942",
		mainColor				: "#E25942",
		colors					: ["#E25942","#F6CB51","#13A89E"],
		currency				: "SEK",
		timeFontSize			: 55,
		unitFontSize			: 14

	};

	var options = $.extend(defaults,options);
	var o = options;

	/*****************************************
				Public functions
	*****************************************/

	this.drawClock 				= drawClock;
	this.update 				= update;

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

	var maximum = d3.max(dataSum());
	var circularAmount = 360/data[0][0].length;
	var hournumber = parseInt(getTime().slice(0, -3));
	
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

	function toRadians (angle) {
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

        //clipping mask path for current data              
        for (i=0; i<hournumber+1;i++)
        {
       		var circularSinValue = Math.sin(toRadians(circularAmount*[i]));
			var circularCosValue = Math.cos(toRadians(circularAmount*[i]))	
         	clipMask[i] ={ "x": diameter/2 + circularSinValue*500,   "y":diameter/2 - circularCosValue*500};             
        }
        clipMask[clipMask.length] ={ "x": 455,"y":455};  

        //clipping mask path for previous data
        for (j=hournumber; j<24+1;j++)
        {
       		circularSinValue = Math.sin(toRadians(circularAmount*[j]));
			circularCosValue = Math.cos(toRadians(circularAmount*[j]))	
         	clipMaskInverted[j-hournumber] ={ "x": diameter/2+ circularSinValue*500,   "y":diameter/2 - circularCosValue*500};             
        }
        clipMaskInverted[clipMaskInverted.length] ={ "x": 455,"y":455};  

        svg.append("svg:clipPath")
		    .attr("id", "clipper")
		    .append("svg:path")
		  	.attr("d", lineFunctionLinear(clipMask));

		svg.append("svg:clipPath")
		    .attr("id", "invertedclipper")
		    .append("svg:path")
		  	.attr("d", lineFunctionLinear(clipMaskInverted));
		
		//kan effiecienter maar kreeg het niet lekker werkend

		//previous data:              
	    //The first line SVG Path

	    	oldlineGraph1 = svg.append("path")
	    	  .attr("id", "oldlineGraph")
              .attr("d", lineFunction(oldlineData[0]))
              .attr("stroke", o.colors[0])
              .attr("stroke-width", 3)
              .attr("clip-path", "url(#invertedclipper)")
              .style("opacity", 0.2)
              .attr("fill", o.colors[0]);

            oldlineGraph2 = svg.append("path")
	    	  .attr("id", "oldlineGraph")
              .attr("d", lineFunction(oldlineData[1]))
              .attr("stroke", o.colors[1])
              .attr("stroke-width", 3)
              .attr("clip-path", "url(#invertedclipper)")
              .style("opacity", 0.2)
              .attr("fill", o.colors[1]);
              
            oldlineGraph3 = svg.append("path")
	    	  .attr("id", "oldlineGraph")
              .attr("d", lineFunction(oldlineData[2]))
              .attr("stroke", o.colors[2])
              .attr("stroke-width", 3)
              .attr("clip-path", "url(#invertedclipper)")
              .style("opacity", 0.2)
              .attr("fill", o.colors[2]);

  
		// current data:
		//The first line SVG Path
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
	                    .attr("stroke", "grey")
	                    .attr("stroke-width", 3)
	                    .attr("fill", "none");

		/*****************************************
				Creating the clock center
		*****************************************/
		centerPiece = svg.append('g')
			.attr('id','centerPiece')
			.attr( 'transform' , 'translate('+( diameter/2 )+','+( diameter/2 )+')');
		
		backgroundCircle = centerPiece.append( 'circle' )
			.attr( "r", o.centerRadius+o.centerWidth+o.gap+2)
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
	    		.attr("id", function(d, i) { return "grad" + i; });
			arcGradient.append("stop").attr("offset", "55%").style("stop-color", "white");
			arcGradient.append("stop").attr("offset", "100%").style("stop-color", function(d, i) { return o.mainColor; });

		centerPiece.append( "path" )
			.attr( "d" , handArc )
			.attr("fill", function(d, i) { return "url(#grad" + i + ")"});
			
		clockHand = centerPiece.append( "path" )
			.attr( 'transform' , 'rotate('+scaleCalc( currentTime )+') translate(0,'+ -( o.centerRadius+o.centerWidth+11 ) +') scale(4)')
			.attr('d', function() {
		        return 'M ' + 0 +' '+ 0 + ' l 4 3 l -8 0 z';
	      	})
	      	.style( 'fill',o.handColor );

	    clockTime = centerPiece.append( "text" )
	    	.attr('id','clockTime')
	    	.text(getTime())
	    	.attr("dy", -35)
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
  	
        //kan effiecienter maar kreeg het niet lekker werkend
		oldlineGraph3.transition()
			.attr("d", lineFunction(lineData[2]));
		oldlineGraph2.transition()
			.attr("d", lineFunction(lineData[2]));
		oldlineGraph1.transition()
			.attr("d", lineFunction(lineData[0]));
	
		lineGraph3.transition()
			.attr("d", lineFunction(oldlineData[2]));
		lineGraph2.transition()
			.attr("d", lineFunction(oldlineData[1]));
		lineGraph1.transition()
			.attr("d", lineFunction(oldlineData[0]));

		lineGraph4.transition()
			.attr("d", lineFunction(lineData[3]))
	}

	function createLineData(data){
		lineData = [[],[],[],[]];
		oldlineData = [[],[],[],[]];
		circularAmount = 360/data[0][0].length;
		hournumber = parseInt(getTime().slice(0, -3));
			
			for (i=0; i<data[0][0].length; i++)
			{	
				var circularSinValue = Math.sin(toRadians(circularAmount*[i]));
				var circularCosValue = Math.cos(toRadians(circularAmount*[i]))
				lineData[0][i]= { "x": diameter/2+ circularSinValue*((data[0][0][i])								/maximum*o.barHeight+208),   "y":diameter/2 - circularCosValue*((data[0][0][i])								/maximum*o.barHeight+208)} ;
				lineData[1][i]= { "x": diameter/2+ circularSinValue*((data[0][0][i]+data[0][1][i])					/maximum*o.barHeight+208),   "y":diameter/2 - circularCosValue*((data[0][0][i]+data[0][1][i])				/maximum*o.barHeight+208)} ;
				lineData[2][i]= { "x": diameter/2+ circularSinValue*((data[0][0][i]+data[0][1][i]+data[0][2][i])	/maximum*o.barHeight+208),   "y":diameter/2 - circularCosValue*((data[0][0][i]+data[0][1][i]+data[0][2][i])	/maximum*o.barHeight+208)} ;

				lineData[3][i]= { "x": diameter/2+ circularSinValue*((data[2][0][i]+data[2][1][i]+data[2][2][i])	/maximum*o.barHeight+208),   "y":diameter/2 - circularCosValue*((data[2][0][i]+data[2][1][i]+data[2][2][i])	/maximum*o.barHeight+208)} ;
				
				oldlineData[0][i]= { "x": diameter/2+ circularSinValue*((data[1][0][i])								/maximum*o.barHeight+208),   "y":diameter/2 - circularCosValue*((data[1][0][i])								/maximum*o.barHeight+208)} ;
				oldlineData[1][i]= { "x": diameter/2+ circularSinValue*((data[1][0][i]+data[0][1][i])				/maximum*o.barHeight+208),   "y":diameter/2 - circularCosValue*((data[1][0][i]+data[0][1][i])				/maximum*o.barHeight+208)} ;
				oldlineData[2][i]= { "x": diameter/2+ circularSinValue*((data[1][0][i]+data[0][1][i]+data[0][2][i])	/maximum*o.barHeight+208),   "y":diameter/2 - circularCosValue*((data[1][0][i]+data[0][1][i]+data[0][2][i])	/maximum*o.barHeight+208)} ;
			}
			return lineData;
			return oldlineData;
	}

	/*****************************************
		Update the digital and analog clock
		every second
	*****************************************/
	
	setInterval(function(){
		var d = new Date(Date.now());

		if (d.getHours() > currentTime){
			clockHand.transition().attr( 'transform' , 'rotate('+scaleCalc( d.getHours() )+') translate(0,'+ -( o.centerRadius+o.centerWidth+11 ) +') scale(4)');
		}
		
		// Also updating currentTime
		currentTime = d.getHours();
		clockTime.text(getTime());
	},1000)

}
