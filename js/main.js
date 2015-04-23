$(function()
{
	var model = new EnergyClockModel();	
	var clockView = new ClockView("#energyClock", model);
	var clockController = new ClockController(clockView, model);

	/********************************************************************************
					 			Vertical Centering
	********************************************************************************/

	$(window).resize(function(){
		verticalCenter();
	});

	var verticalCenter = function(){
		var screenHeight = $(window).height();
		$("#energyClock").css('margin-top',( screenHeight-770)/2 );
	}

	verticalCenter();

	/********************************************************************************
					 	Showing / Hiding the information screen
	********************************************************************************/

	var height = $("#information").outerHeight(true);
	$("#information").css('bottom',-height);
	$("#hide").click(function(event) {
		if($("#hide span").hasClass('glyphicon-chevron-up')){
			
			$("#information").animate({
				bottom: 0
			},500,function(){
				$("#hide span").removeClass('glyphicon-chevron-up');
				$("#hide span").addClass('glyphicon-chevron-down');
			});
			
		}
		else{
			
			var height = $("#information").outerHeight(true);
			$("#information").animate({
				bottom: -height
			},500,function(){
				$("#hide span").removeClass('glyphicon-chevron-down');
				$("#hide span").addClass('glyphicon-chevron-up');
			});
			
		}
	});

});

