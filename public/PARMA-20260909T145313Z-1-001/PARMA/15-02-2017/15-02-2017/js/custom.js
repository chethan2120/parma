
$(document).ready(function(){
		
			$('.content-box').addClass('animated fadeInRight');
            $('.ui-group').addClass('animated fadeInLeft');
            $('.grid-content').addClass('animated fadeInLeft');

			$('.logo-txt h1').addClass('animated fadeInLeft');
            $('.logo-txt h2').addClass('animated fadeInLeft');
			$('.landing-menus').addClass('animated fadeInRight');

	
		//$(".detail-box").addClass('box-hide');
	
        //$(".click-a").on( "click", function(e) {
//				e.preventDefault();
//				
//				var id = $(this).attr('data-related'); 
//				
//				$(".detail-box").each(function(){
//					$(this).fadeOut('slow');
//					
//					if($(this).hasClass('animated fadeInLeft box-display')){ 
//					
//						$(this).removeClass('animated fadeInLeft box-display');
//						
//					}
//					
//					
//					if($(this).attr('id') == id) {
//						$(this).addClass('animated fadeInLeft box-display');
//					}
//					
//				});
//				
//			});
		
			$(".filters .button").click(function(){
												 	
				$(".detail-box").removeClass('animated fadeInLeft box-display');						 
			});						 
			
		
			$(".click-a").click(function(e){
				e.preventDefault();
				var id = $(this).attr('data-related'); 
				
				
				
				$(".detail-box").each(function(){
					
					$(this).fadeOut('slow');
					
					if($(this).hasClass('animated fadeInLeft box-display')){ 
						
						$(this).removeClass('animated fadeInLeft box-display');
					
					}
					
					if($(this).attr('id') == id) {
						$(this).addClass('animated fadeInLeft box-display');	
					}
				
				
				});
				
				
			});
			 
		
		
		// footer
		
		
				
				$(".footer-a").on( "click", function(e) {
					
					e.preventDefault();
					
						$(this).parents(".outer-box").addClass("footer-content-active");
						$(this).parents(".outer-box").find(".each-vertical-tab-content").hide();
                        $(this).parents(".outer-box").find(".resp-accordion").removeClass("resp-tab-active");
						$(this).parents(".outer-box").find(".footer-menu-content").appendTo(".custom-full-block");
					
					
						var id = $(this).attr('data-related'); 
						
							$(".footer-menu-content").each(function(){
									$(this).hide();
									if($(this).attr('id') == id) {
										
										$(this).show();
											
									}
								});
							
								
					});
		
		
		
		$(".resp-tab-item").click(function () {
		
			if($(this).parents(".outer-box").hasClass("footer-content-active")){
				
				$(this).parents(".outer-box").removeClass("footer-content-active");
				
			}
				
			
		});
		
		$(".resp-accordion").click(function () {
		
			if($(this).parents(".outer-box").hasClass("footer-content-active")){
				
				$(this).parents(".outer-box").removeClass("footer-content-active");
				
			}
				
			
		});
		
		
	
	
		
		
});