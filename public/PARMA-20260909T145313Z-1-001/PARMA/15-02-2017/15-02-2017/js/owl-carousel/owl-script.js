$(document).ready(function(){
	
	
	
	//home slider
	
	$(".home-slide").owlCarousel({
        autoPlay: 2500,
        items : 1,
		transitionStyle : "fade",
		//autoPlay : true,
		navigation : false,
		pagination : false,
    	navigationText : ["",""],
        itemsDesktop : [1199,1],
        itemsDesktopSmall : [979,1],
		itemsTablet: [768,1],
    	itemsMobile : [479,1],
      });
	
	
	//gallery slider
	//
//	$(".gallery-slider").owlCarousel({
//        autoPlay: 3000,
//        items : 4,
//		autoPlay : true,
//		navigation : false,
//		pagination : false,
//    	navigationText : ["",""],
//        itemsDesktop : [1199,4],
//        itemsDesktopSmall : [979,3],
//		itemsTablet: [768,2],
//    	itemsMobile : [479,2],
//      });
	

	
	
						   
});