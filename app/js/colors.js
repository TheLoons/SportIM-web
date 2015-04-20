function loadColors($scope, color)
{
	var primaryColor = "#" + color.primaryColor
	var secondaryColor = "#" + color.secondaryColor;
	$('.header').css('background-color', primaryColor);
	$('#top-menu').css('background-color', primaryColor);
	$('#context-menu').css('background-color', secondaryColor);
	
}