var ClockController = function(view,model){

	var calendarBool = false;
	var dayBool 	 = true;

	/********************************************************************************
					 Enabling / Disabling the different categories
	********************************************************************************/

	view.gasContainer.click(function(event) {

		if($(this).hasClass('disabled')){
			$(this).removeClass('disabled');
			$(this).find('path').attr('fill',view.options.colors[0]);
			view.toggleGas();
		}else{
			$(this).addClass('disabled');
			$(this).find('path').attr('fill',"#ccc");
			view.toggleGas();
		}
	});

	view.elecContainer.click(function(event) {

		if($(this).hasClass('disabled')){
			$(this).removeClass('disabled');
			$(this).find('polygon').attr('fill',view.options.colors[1]);
			view.toggleElec();
		}else{
			$(this).addClass('disabled');
			$(this).find('polygon').attr('fill',"#ccc");
			view.toggleElec();
		}
	});

	view.waterContainer.click(function(event) {

		if($(this).hasClass('disabled')){
			$(this).removeClass('disabled');
			$(this).find('path').attr('fill',view.options.colors[2]);
			view.toggleWater();
		}else{
			$(this).addClass('disabled');
			$(this).find('path').attr('fill',"#ccc");
			view.toggleWater();
		}

	});

	/********************************************************************************
					   	   For showing and hiding the calendar
	********************************************************************************/

	$(".clockTime").click(function(event) {
		if(!calendarBool){
			calendarBool = true;
			$("#calendar").fadeIn();
			if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				d3.selectAll('.clockTime').transition()
				.attr('dy','35')
				.style('font-size','30px');
			}
			else{
				d3.selectAll('.clockTime').transition()
				.attr('dy','45')
				.style('font-size','30px');
			}
			$("#scrollCalendarContainer").scrollLeft($("#scrollCalendar").width());
			view.calendarView.update("resend");
			
		}
		else{
			calendarBool = false;
			if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				d3.selectAll('.clockTime').transition()
				.attr('dy','-15')
				.style('font-size','55px');
			}
			else{
				d3.selectAll('.clockTime').transition()
				.attr('dy','-15')
				.style('font-size','55px');
			}
			
			$("#calendar").fadeOut();
			$("#scrollCalendarContainer").scrollLeft($("#scrollCalendar").width());
		}
	});

	/********************************************************************************
					 Switching between the bar and bezier views
	********************************************************************************/

	function hideAll(){
		$("#barEnergyClock, #bezierEnergyClock").hide();
	}

	$("#bezierEnergyClock path").click(function(event) {

		hideAll();
		$(this).addClass("active");
		$("#barEnergyClock").show();
		$("#bezierEnergyClock").hide();

	});

	$("#barEnergyClock rect").click(function(){

		hideAll();
		$(this).addClass("active");
		$("#barEnergyClock").hide();
		$("#bezierEnergyClock").show();

	});

	hideAll();
	$("#calendar").hide();
	$("#calendar").css("display","none");
	$("#barEnergyClock").show();
	$(view.barButton).addClass("active");

	/********************************************************************************
					 	Switching between night and day mode
	********************************************************************************/

	view.graphicSwitch.click(function(event) {
		if(dayBool){
			$(view.dayIcon).show();
			$(view.nightIcon).hide();
			$('body').css('background-color','#222222');
			dayBool = false;
		}
		else{
			$(view.nightIcon).show();
			$(view.dayIcon).hide();
			$('body').css('background-color','#FFFFFF');
			dayBool = true;
		}
		view.barClock.toggleNightMode();
		view.bezierClock.toggleNightMode();
	});
	
}