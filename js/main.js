$(function()
{
	var model = new EnergyClockModel();	

	var clockView = new ClockView("#dayClock", model);
	var clockController = new ClockController(clockView,model);
});

