var ScrollCalendar = function(container, data, options){

	var date 					= new Date();
	var currentTime 			= date.getHours();

	/*****************************************		
					Options
	*****************************************/

	var defaults = {

		squareHeight			: 10,
		squareWidth				: 20,
		squarePadding			: 0,
		squareMargin			: 0,
		domainOffset 			: 10,
		selectionPadding		: 10,
		backgroundColor			: "#FFFFFF",
		fontColor				: "#EFEFEF",
		handColor				: "#E25942",
		colors					: ["#ADD5F7","#7FB2F0","#4E7AC7","#35478C","#16193B"]

	};

	var options = $.extend(defaults,options);
	var o = options;

	/*****************************************
				Public functions
	*****************************************/

	this.update 				= update;

	/*****************************************
				Helper variables
	*****************************************/
	var max = d3.max(data.map(function(array) {
  		return d3.max(array);
	}));

	var getColor = function(value){
		var colorNumber = Math.round((value / max) * o.colors.length);
		return o.colors[colorNumber-1];
	}


	/*****************************************
			  Creating the calendar
	*****************************************/

	var scrollCalendar = d3.select(container).append("div")
		.attr('id','scrollCalendar')
		.style('background',o.backgroundColor);

	var drawCalendar = function(){
		
		var days = d3.select("#scrollCalendar")
			.selectAll("g")
			.data(data)
			.enter().append("g")
			.style("float","left")
			.style("margin-left",o.domainOffset+"px")

		days.selectAll("div")
			.data(function(d,i){return d;})
			.enter().append("div")
				.style("background-color",function(d,i){
					return getColor(d);
				})
				.style("width",o.squareWidth+"px")
				.style("height",o.squareHeight+"px")
				.style("padding",o.squarePadding+"px")
				.style("margin",o.squareMargin+"px");
		
	}

	var update = function(){

	}

	drawCalendar();
}