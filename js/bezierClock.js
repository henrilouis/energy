var BarClock = function(container, data, options){

	var date 					= new Date();
	var currentTime 			= date.getHours();
	var svg, barCharts, centerPiece, backgroundCircle, handArc, arcGradient, clockHand, clockTime, 
		gasIcon, electricityIcon, waterIcon, gasMeter, electricityMeter, waterMeter;
	var lineData = [[],[],[]]


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

	var dataSum = function(){
		var d = new Array;
		for(i=0; i<data[0].length; i++){
			d.push(0);
			for(j=0; j<data.length; j++){
				d[i] += data[j][i];
			}
		}
		return d;
	};

	var maximum = d3.max(dataSum());
	var circularAmount = 360/data[0].length;

	for (i=0; i<data[0].length; i++)
	{	
		var circularSinValue = Math.sin(toRadians(circularAmount*[i]));
		var circularCosValue = Math.cos(toRadians(circularAmount*[i]))
		lineData[0][i]= { "x": 455+ circularSinValue*((data[0][i])							/maximum*o.barHeight+208),   "y":455 - circularCosValue*((data[0][i])						/maximum*o.barHeight+208)} ;
		lineData[1][i]= { "x": 455+ circularSinValue*((data[0][i]+data[1][i])				/maximum*o.barHeight+208),   "y":455 - circularCosValue*((data[0][i]+data[1][i])			/maximum*o.barHeight+208)} ;
		lineData[2][i]= { "x": 455+ circularSinValue*((data[0][i]+data[1][i]+data[2][i])	/maximum*o.barHeight+208),   "y":455 - circularCosValue*((data[0][i]+data[1][i]+data[2][i])	/maximum*o.barHeight+208)} ;
	}

	stack = d3.layout.stack().offset("zero");

	var diameter = (o.centerRadius*2) + (o.centerWidth*2) + (o.gap*2) + (o.barHeight*2);

	var scaleCalc = d3.scale.linear()
		.range( [ 0,360-( 360/data[0].length ) ] )
		.domain([0,data[0].length-1]);

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
		.attr('id','energyClock')
		.style('width',diameter)
		.style('background',o.backgroundColor);

	function drawClock(){

		/*****************************************
				Creating the bar-charts
		*****************************************/
		
		// The mapping function that creates the normally data type for stacked barcharts
		dataMap = data.map(function(d) { return d.map(function(p, i) { return {x:i, y:p, y0:0}; }); });

		//The data for our line
		svg = d3.select("#energyClock").append("svg")
			.attr("width",diameter)
			.attr("height",diameter);
		/*
		// Bar charts group
		barCharts = svg.append( 'g' )
			.attr( 'transform' , 'translate('+( diameter/2 )+','+( diameter/2 )+')')
			.attr( 'id','barCharts' );
		
		// Loop through the different sets
		barCharts.selectAll("g")
			.data(stack(dataMap))
			.enter().append('g')
				.attr('id',function(d,i){
					return "bars"+i;
				})
				.selectAll('rect')
				.data(function(d,i){return d;})
				.enter().append('rect')
			.attr("height",function(d,i){
				return ( ( d.y / d3.max( dataSum() ) * o.barHeight ) );
				
			})
			.attr("width", o.barWidth)
			.attr('transform',function(d,i){
				return 'rotate(' + scaleCalc(i) + ') translate('+ -( o.barWidth/2 ) +','+ -( 

					o.centerRadius+o.centerWidth+o.gap+calcHeight(d.y+d.y0) 

					) +')';
			});

		// give the bars the right colours
		for(i=0; i<data.length; i++){
			barCharts.select("#bars"+i).selectAll('rect')
					.style('fill',function(){return o.colors[i]})
		}
		*/

		/*****************************************
				Creating the bezier lines
		*****************************************/

		//This is the accessor function to create intermediate points
		var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
                        .interpolate("cardinal-closed");
		
		//The first line SVG Path
		lineGraph1 = svg.append("path")
                          .attr("d", lineFunction(lineData[2]))
                            .attr("stroke", o.colors[2])
                            .attr("stroke-width", 3)
                            .attr("fill", o.colors[2]);
	

		//The second line SVG Path
		lineGraph2 = svg.append("path")
                          .attr("d", lineFunction(lineData[1]))
                            .attr("stroke", o.colors[1])
                            .attr("stroke-width", 3)
                            .attr("fill", o.colors[1]);

		//The third line SVG Path
		lineGraph3 = svg.append("path")
	                  .attr("d", lineFunction(lineData[0]))
	                    .attr("stroke", o.colors[0])
	                    .attr("stroke-width", 3)
	                    .attr("fill", o.colors[0]);

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

	function update(value){
		data = value;

		dataMap = data.map(function(d) { return d.map(function(p, i) { return {x:i, y:p, y0:0}; }); });
		lineData = [[],[],[]]
		maximum = d3.max(dataSum());
		circularAmount = 360/data[0].length;

		for (i=0; i<data[0].length; i++)
		{	
			var circularSinValue = Math.sin(toRadians(circularAmount*[i]));
			var circularCosValue = Math.cos(toRadians(circularAmount*[i]))
			lineData[0][i]= { "x": 455+ circularSinValue*((data[0][i])							/maximum*o.barHeight+208),   "y":455 - circularCosValue*((data[0][i])						/maximum*o.barHeight+208)} ;
			lineData[1][i]= { "x": 455+ circularSinValue*((data[0][i]+data[1][i])				/maximum*o.barHeight+208),   "y":455 - circularCosValue*((data[0][i]+data[1][i])			/maximum*o.barHeight+208)} ;
			lineData[2][i]= { "x": 455+ circularSinValue*((data[0][i]+data[1][i]+data[2][i])	/maximum*o.barHeight+208),   "y":455 - circularCosValue*((data[0][i]+data[1][i]+data[2][i])	/maximum*o.barHeight+208)} ;
		}
		/*
		barCharts.selectAll("g")
			.data(stack(dataMap))
				.selectAll('rect')
				.data(function(d,i){return d;})
				.transition()
			.attr("height",function(d,i){
				return ( ( d.y / d3.max( dataSum() ) * o.barHeight ) );
			})
			.attr("width", o.barWidth)
			.attr('transform',function(d,i){
				return 'rotate(' + scaleCalc(i) + ') translate('+ -( o.barWidth/2 ) +','+ -( 

					o.centerRadius+o.centerWidth+o.gap+calcHeight(d.y+d.y0) 

					) +')';
			});

		*/
		
		/*****************************************
		Update the bezier lines using transitions
		*****************************************/
		
		//Accessor function to create intermediate points
		var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
                        .interpolate("cardinal-closed");
       	lineGraph1.transition()
			.attr("d", lineFunction(lineData[2]))
		
		lineGraph2.transition()
			.attr("d", lineFunction(lineData[1]))
		
		lineGraph3.transition()
			.attr("d", lineFunction(lineData[0]))
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
