var ClockController = function(view,model){
	view.gasContainer.click(function(event) {

		if($(this).hasClass('disabled')){
			$(this).removeClass('disabled');
			$(this).find('path').attr('fill',view.options.colors[0]);
			$(this).find
			view.toggleGas();
		}else{
			$(this).addClass('disabled');
			$(this).find('path').attr('fill',"#ccc");
			view.toggleGas();
		}
		view.updateClock();
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
		view.updateClock();
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
		view.updateClock();
	});

	function hideAll(){
		$("#energyClock, #energyClock2").hide();
		$(view.barButton).removeClass('active');
		$(view.bezierButton).removeClass('active');
	}hideAll();

	view.barButton.click(function(){
		$(this).addClass("active");
		$("#energyClock").show();
	}

	view.bezierButton.click(function(){
		$(this).addClass("active");
		$("#energyClock2").show();
	}
	
}