var BarClock = function(container, data, options){

	var date 					= new Date();
	var currentTime 			= date.getHours();
	var selectedDate;
	var dateBool 				= false;
	var nightMode 				= false;
	var svg, barCharts, centerPiece, backgroundCircle, handArc, arcGradient, clockHand, clockTime, 
		gasIcon, electricityIcon, waterIcon, gasMeter, electricityMeter, waterMeter;

	/*****************************************
					Options
	*****************************************/

	var defaults = {

		barHeight 				: 150,
		barWidth				: 10,
		gap 					: 20,
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
				Helper variables
	*****************************************/

	var dataSum = function(){
		var d = new Array;
		for(i=0; i<data[0][0].length; i++){
			d.push(0);
			for(j=0; j<data[0].length; j++){
				d[i] += data[0][j][i];
			}
		}
		return d;
	};

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

	/*****************************************
				Creating the clock
	*****************************************/

	var energyClock = d3.select(container).append("div")
		.attr('id','barEnergyClock')
		.style('width',diameter)
		.style('background',o.backgroundColor);

	function drawClock(){

		/*****************************************
				Creating the bar-charts
		*****************************************/

		// The mapping function that creates the normal data type for stacked barcharts
		dataMap = data[0].map(function(d) { return d.map(function(p, i) { return {x:i, y:p, y0:0}; }); });

		svg = d3.select("#barEnergyClock").append("svg")
			.attr("width",diameter)
			.attr("height",diameter);

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
		for(i=0; i<data[0].length; i++){
			barCharts.select("#bars"+i).selectAll('rect')
					.style('fill',function(){return o.colors[i]})
		}
		
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
	      	.style( 'fill',o.mainColor );

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

	function update(value){
		data = value;

		dataMap = data[0].map(function(d) { return d.map(function(p, i) { return {x:i, y:p, y0:0}; }); });
		
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
	}

	/*****************************************
		Update the digital and analog clock
		every second
	*****************************************/
	var clockUpdate = function(){
		if(dateBool){
			var format = d3.time.format("%Y-%m-%d");
			clockTime.text(format(selectedDate));
		}
		else{
			var d = new Date(Date.now());

			if (d.getHours() > currentTime || (d.getHours == 0 && currentTime == 23)){
				clockHand.transition().attr( 'transform' , 'rotate('+scaleCalc( d.getHours() )+') translate(0,'+ -( o.centerRadius+o.centerWidth+11 ) +') scale(4)');
			}
			
			// Also updating currentTime
			currentTime = d.getHours();
			clockTime.text(getTime())
		}
	}
	setInterval(clockUpdate,1000)

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
			clockTime.style('fill',o.fontColor);
			nightMode = false;
		}else{
			energyClock.style('background',o.nightBackgroundColor);
			backgroundCircle.style("fill",o.nightBackgroundColor);
			clockTime.style('fill',o.nightFontColor);
			nightMode = true;
		}

	}
	
	this.drawClock 				= drawClock;
	this.update 				= update;
	this.dateToggle				= dateToggle;
	this.selectDate				= selectDate;
	this.toggleNightMode		= toggleNightMode;
}