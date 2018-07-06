var view1 = {
	initialize: function(){
		//set the dimensions and margins of the graph
		var width = $('#view1-svg').width();
        var height = $('#view1-svg').height();
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = width - margin.left - margin.right,
            height = height - margin.top - margin.bottom;
		
		//append the svg object to the body of the page
		//append a 'group' element to 'svg'
		//moves the 'group' element to the top left margin
		var svg=d3.select("#view1-svg").append("svg")
			.attr("width",width+margin.left+margin.right)
			.attr("height",height+margin.top+margin.bottom)

		var bigger = 3;	
		
		var imgs = svg.selectAll("image").data([0]);
		imgs.enter()
			.append("svg:image")
			.attr("xlink:href", "datasets/Lekagul Roadways 2018.bmp")
			.attr("x", 60)
			.attr("y", 60)
			.attr("width",bigger*200)
			.attr("heitht",bigger*200)
	}
	
} 
