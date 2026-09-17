$(document).ready(function(){
				
	
	// nav drop down
	
	$(".f-nav-dropdwn").hover(function () {
		
		if($(this).hasClass("f-drp-active")){
			
			$(this).removeClass("f-drp-active");
			$(this).find(".f-dropdwn-menu").fadeOut(300);
		}
		
		else{
			$(this).addClass("f-drp-active");
			$(this).find(".f-dropdwn-menu").fadeIn(300);	
		}
		
		
	});
	
	
						   
 });