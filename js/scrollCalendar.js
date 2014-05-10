var ScrollCalendar = function(container, data, options){

	var date 					= new Date();
	var currentTime 			= date.getHours();

	/*****************************************
					Options
	*****************************************/

	var defaults = {

		squareHeight			: 250,
		squareWidth				: 10,
		sqareOffset				: 20,
		domainOffset 			: 170,
		backgroundColor			: "#FFFFFF",
		fontColor				: "#3F4953",
		handColor				: "#E25942",
		colors					: ["#E25942","#F6CB51","#13A89E"]

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

	/*****************************************
			  Creating the calendar
	*****************************************/