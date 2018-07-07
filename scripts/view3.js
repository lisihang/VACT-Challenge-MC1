var view3 = 
{
	xscale:null,
	yscale:null,
	number:null,
	initialize:function()
	{
		print("view3");

		var width = document.getElementById("view3-svg").offsetWidth;
		var height = document.getElementById("view3-svg").offsetHeight;
		var svg = d3.select("#view3-svg").append("svg").attr("width", width).attr("height", height);

		var stx = width * 0.01;
		var enx = width * 0.99;
		var sty = height * 0.01;
		var eny = height * 0.99;

		var hei = eny - sty;
		var wid = enx - stx;

		view3.xscale = d3.scaleLinear().domain([200, 421]).range([0, wid]);
		this.number = new Array(421);
		var mx=0;
		for(var i=0;i<421;i++)
			this.number[i] = 0;
		for(var i=0;i<len;i++)
		{
			if(data[i].Stamp < 0)
				continue;
			this.number[data[i].Stamp]++;
			if(this.number[data[i].Stamp]>mx)
				mx = this.number[data[i].Stamp];
		}
		view3.yscale = d3.scaleLinear().domain([0, mx]).range([0, hei]);
		this.number = new Array(19);
		for(var i=0;i<19;i++)
		{
			this.number[i] = new Array(421);
			for(var j=0;j<421;j++)
				this.number[i][j] = 0;
		}
		var top = new Array(421);

		for(var i=0;i<421;i++)
			top[i] = 0;

		for(var i=0;i<len;i++)
		{
			if(data[i].Stamp < 0)
				continue;
			this.number[data[i].Type][data[i].Stamp]++;
		}

		for(var i=0;i<19;i++)
		{
			var cla = ".view3-svg-rect"+i;
			svg.selectAll(cla).data(this.number[i]).enter().append("rect").attr("x", function(d, i)
			{
				if(i < 200)
					return 0;
				return stx + view3.xscale(i) + (view3.xscale(i+1)-view3.xscale(i))/2;
			}).attr("y", function(d, i)
			{
				if(i < 200)
					return 0;
				return eny - top[i] - view3.yscale(d)/2;
			}).attr("width", function(d, i)
			{
				if(i < 200)
					return 0;
				return view3.xscale(i+1)-view3.xscale(i);
			}).attr("height", function(d, i)
			{
				if(i < 200)
					return 0;
				var h = view3.yscale(d);
				top[i] += h;
				return h;
			}).attr("fill", function(d, k)
			{
				return color[i];
			});
		}
	},
	update:function()
	{

	}
};