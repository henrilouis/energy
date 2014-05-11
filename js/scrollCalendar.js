var ScrollCalendar = function(container, data, options, model){

	var date 					= new Date();
	var currentTime 			= date.getHours();

	/*****************************************		
					Options
	*****************************************/

	var defaults = {

		squareHeight			: 5,
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
	var width;

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

	var scrollCalendarContainer = d3.select(container).append("div")
		.attr('id','scrollCalendarContainer');

	var scrollCalendar = scrollCalendarContainer.append("div")
		.attr('id','scrollCalendar')
		.style("width",function(){
			width = 0;
			for(i=0;i<data.length;i++){
				width += ( o.squareWidth + o.domainOffset + (o.squarePadding * 2) + (o.squareMargin * 2) );
			}
			width += $(window).innerWidth()/2;
			return width+"px";
		})
		.style("height",function(){
			return ( o.squareHeight + ( o.squarePadding*2) + ( o.squareMargin*2 ) ) * data[0].length+"px";
		})
		.style("margin-left",function(){
			return $(window).innerWidth()/2+"px";
		});

	var drawCalendar = function(){

		var days = d3.select("#scrollCalendar")
			.selectAll("g")
			.data(data)
			.enter().append("g")
				.style("float","left")
				.style("margin-left",o.domainOffset+"px")
			.append("text")
			.text(function(d,i){
				var date = new Date();
				date.setDate(date.getDate()-data.length+1);
				date.setDate(date.getDate()+i);
				var format = d3.time.format("%Y-%m-%d");
				return format(date);
			})
				.style("font-size","3px");	
		
		var items = days.selectAll("div")
			.data(function(d,i){return d;})
			.enter().append("div")
				.style("background-color",function(d,i){
					return getColor(d);
				})
				.style("width",o.squareWidth+"px")
				.style("height",o.squareHeight+"px")
				.style("padding",o.squarePadding+"px")
				.style("margin",o.squareMargin+"px");
		
		$("#scrollCalendarContainer").css('width',$(window).width());
		$("#scrollCalendarContainer").scrollLeft($("#scrollCalendar").width());
		
	}



	/*****************************************
			  Scrolling using jQuery
			  functions
	*****************************************/
	$("#scrollCalendarContainer").css('overflow-x','scroll');
	$("#scrollCalendarContainer").addClass('-webkit-overflow-scrolling','touch');

	$("#scrollCalendarContainer").scroll(function(event) {
		var workWidth = $("#scrollCalendarContainer").scrollLeft()-($(window).width());
		var totalWidth = $("#scrollCalenar").width()-($(window).width());
		var pos = workWidth - totalWidth;
		var selection = Math.round(pos / $('#scrollCalendar g').outerWidth(true));
		//console.log(selection);
		model.setSelected(selection-1);
	});

	var update = function(){

	}

	drawCalendar();
}