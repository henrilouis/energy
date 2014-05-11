var ClockController = function(view,model){

	var calendarBool = false;

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

	$(".clockTime").click(function(event) {

		var calendarHeight = $("#calendar").height();
		var speed = 500;

		if(!calendarBool){

			calendarBool = true;
			$("#calendar").animate({
				bottom: 0,
				},speed, function() {
				/* stuff to do after animation is complete */
			});
		}
		else{

			calendarBool = false;
			$("#calendar").animate({
				bottom: -calendarHeight,
				},speed, function() {
				/* stuff to do after animation is complete */
			});

			$("#scrollCalendarContainer").scrollLeft($("#scrollCalendar").width());
			model.setLatestSelected();
		}

		view.barClock.dateToggle();
		view.bezierClock.dateToggle();

	});

	function hideAll(){
		$("#barEnergyClock, #bezierEnergyClock").hide();
		$(view.barButton).removeClass('active');
		$(view.bezierButton).removeClass('active');
	}
	

	view.barButton.click(function(){
		hideAll();
		$(this).addClass("active");
		$("#barEnergyClock").show();
		$("#bezierEnergyClock").hide();
	});

	view.bezierButton.click(function(){
		hideAll();
		$(this).addClass("active");
		$("#barEnergyClock").hide();
		$("#bezierEnergyClock").show();
	});

	hideAll();
	$("#barEnergyClock").show();
	$(view.barButton).addClass("active");
	
}