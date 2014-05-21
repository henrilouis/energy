$(function()
{
	var model = new EnergyClockModel();	

	var clockView = new ClockView("#energyClock", model);
	var clockController = new ClockController(clockView, model);

	/********************************************************************************
					 	Showing / Hiding the information screen
	********************************************************************************/
	var height = $("#information").outerHeight(true);
	$("#information").css('bottom',-height);
	$("#hide").click(function(event) {
		if($("#hide span").hasClass('glyphicon-chevron-up')){
			
			$("#information").animate({
				bottom: 0
			},500);
			$("#hide span").removeClass('glyphicon-chevron-up');
			$("#hide span").addClass('glyphicon-chevron-down');
		}
		else{
			var height = $("#information").outerHeight(true);
			$("#information").animate({
				bottom: -height
			},500);
			$("#hide span").removeClass('glyphicon-chevron-down');
			$("#hide span").addClass('glyphicon-chevron-up');
		}
	});

});

