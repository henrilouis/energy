var ScrollCalendar = function(container, options, model){

	var date 					= new Date();
	var currentTime 			= date.getHours();
	var scrollCalendarContainer, scrollCalendar, selector, days, items;

	/*****************************************		
					Options
	*****************************************/

	var defaults = {

		width                   : 250,
		squareHeight			: 3,
		squareWidth				: 3,
		squarePadding			: 0,
		squareMargin			: 0,
		domainOffset 			: 10,
		selectionPadding		: 10,
		backgroundColor			: "#FFFFFF",
		fontColor				: "#EFEFEF",
		handColor				: "#E25942",
		colors					: ["#ADD5F7","#7FB2F0","#4E7AC7","#35478C","#16193B"]

	};

	var data;

	var options = $.extend(defaults,options);
	var o = options;
	var width;

	/*****************************************
				Helper variables
	*****************************************/

	var max;

	var getColor = function(value){
		var colorNumber = Math.round((value / max) * o.colors.length);
		return o.colors[colorNumber-1];
	}

	/*****************************************
			  Creating the calendar
	*****************************************/

	var drawCalendar = function(value){

		data = value;

		max = d3.max(data.map(function(array) {
  		return d3.max(array);
		}));

		scrollCalendarContainer = d3.select(container).append("div")
			.attr('id','scrollCalendarContainer');

		scrollCalendar = scrollCalendarContainer.append("div")
			.attr('id','scrollCalendar')
			.style("width",function(){
				width = 0;
				for(i=0;i<data.length-1;i++){
					width += ( o.squareWidth + o.domainOffset + (o.squarePadding * 2) + (o.squareMargin * 2) );
				}
				width += (o.width/2)+((o.squareWidth+(o.squareMargin*2)+(o.squarePadding*2))/2)+o.domainOffset;
				return width+"px";
			})
			.style("height",function(){
				return ( o.squareHeight + ( o.squarePadding*2) + ( o.squareMargin ) ) * data[0].length+"px";
			})
			.style("margin-left",function(){
				return (o.width/2)-((o.squareWidth+(o.squareMargin*2)+(o.squarePadding*2))/2)-o.domainOffset+"px";
			});

		selector = scrollCalendar.append("div")
			.attr('id','selector')
			.style("width",function(){
				return o.squareWidth+(o.squareMargin*2)+(o.squarePadding*2)+"px";
			})
			.style("height",function(){
				return (o.squareHeight+o.squareMargin+o.squarePadding*2)*data[0].length+"px";
			})
			.style('position','absolute')
			.style('left',function(){
				return (o.width/2)-((o.squareWidth+(o.squareMargin*2)+(o.squarePadding*2))/2)+"px";
			})
			.style('box-shadow','0px 0px 5px #555555')
			.style('background','rgba(255,255,255,0.3)');

		days = d3.select("#scrollCalendar")
			.selectAll("g")
			.data(data)
			.enter().append("g")
				.style("float","left")
				.style("margin-left",o.domainOffset+"px");
		
		items = days.selectAll("div")
			.data(function(d,i){return d;})
			.enter().append("div")
				.style("background-color",function(d,i){
					return getColor(d);
				})
				.style("width",o.squareWidth+"px")
				.style("height",o.squareHeight+"px")
				.style("padding",o.squarePadding+"px")
				.style("margin",o.squareMargin+"px");

		$("#scrollCalendarContainer").css('width',o.width);
		$("#scrollCalendarContainer").scrollLeft($("#scrollCalendar").width());
		if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
			$("#scrollCalendarContainer").css('overflow','scroll');
		}
		else{
			$("#scrollCalendarContainer").css('overflow-x','scroll');
		}
	}

	/*****************************************
			  Update function
	*****************************************/
	
	var update = function(value){
		
		data = value;
		
		max = d3.max(data.map(function(array) {
  			return d3.max(array);
		}));

		d3.select("#scrollCalendar")
			.selectAll('g')
			.data(data)
			.selectAll("div")
			.data(function(d,i){return d;})
			.transition()
				.style("background-color",function(d,i){
					return getColor(d);
				});
		
	}

	/*****************************************
				Public functions
	*****************************************/

	this.drawCalendar 			= drawCalendar;
	this.update 				= update;
}