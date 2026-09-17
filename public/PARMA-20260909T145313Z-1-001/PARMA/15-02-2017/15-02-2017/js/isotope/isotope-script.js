
$(document).ready(function(){

// isotope

    
	
	setTimeout(function(){
		
		$('.grid').isotope({ 
						   
				filter: '.first',
				 // options
				itemSelector: '.element-item',
				layoutMode: 'packery',
				transitionDuration: 0,
				
				hiddenStyle: {
					opacity: 0
				},
				visibleStyle: {
					opacity: 1
				}
			
			});
		
			
		
		
		},10
	)
	
	
});