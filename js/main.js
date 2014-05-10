$(function()
{
	var model = new EnergyClockModel();	

	var clockView = new ClockView("#energyClock", model);
	var clockController = new ClockController(clockView,model);
});

