var view2 = 
{
	open:false,
	number:null,
	xscale:null,
	yscale:null,
	initialize:function()
	{
		print("view2");

		this.number = new Array(19);
		for(var i=0;i<19;i++)
		{
			this.number[i] = new Array(36);
			for(var j=0;j<36;j++)
				this.number[i][j]=0;
		}
		var mx = 0;
		for(var k=0;k<len;k++)
		{
			var i = data[k].Type;
			var j = data[k].Year - start;
			this.number[i][j]++;
			if(this.number[i][j]>mx)
				mx = this.number[i][j];
		}

		var svg = d3.select("#view2-svg").append("svg")

		var view2 = document.getElementById("view2");
		view2.style.cssText="bottom: 10px";

		var width = document.getElementById("view2").offsetWidth;
		var height = document.getElementById("view2").offsetHeight;

		var st = height * 0.05;
		var en = height * 0.95;

		var wid = width / 2;
		var hei = (en-st)/10;

		svg.selectAll("text").data(birdname).enter().append("text").text(function(d, i)
		{
			return d;
		}).attr("id", function(d, i)
		{
			return "view2-svg-text"+i;
		}).attr("x", function(d, i)
		{
			if(i%2==0)
				return wid / 20;
			else
				return wid + wid / 20;
		}).attr("y", function(d, i)
		{
			var j = parseInt(i/2);
			return st + j * hei + hei / 4;
		}).attr("visibility", "hidden");

		svg.selectAll("rect").data(birdname).enter().append("rect").attr("x", function(d, i)
		{
			if(i%2==0)
				return wid / 20;
			else
				return wid + wid / 20;
		}).attr("id", function(d, i)
		{
			return "view2-svg-rect"+i;
		}).attr("y", function(d, i)
		{
			var j = parseInt(i/2);
			return st + j * hei + hei / 2;
		}).attr("width", function(d, i)
		{
			return hei / 4;
		}).attr("height", function(d, i)
		{
			return hei / 4;
		}).attr("fill", function(d, i)
		{
			return color[i];
		}).attr("stroke-width", "1").attr("stroke", "black").on("mouseover", function(d, i)
		{
			var id = "#view2-svg-text"+i;
			d3.select(id).attr("visibility", "visible")
		}).on("mouseout", function(d, i)
		{
			var id = "#view2-svg-text"+i;
			d3.select(id).attr("visibility", "hidden")
		}).on("click", function(d, i)
		{
			var id = "#view2-svg-rect"+i;
			if(selected[i])
			{
				selected[i]=false;
				d3.select(id).attr("fill", "white");
			}
			else
			{
				selected[i]=true;
				d3.select(id).attr("fill", color[i]);
			}
			view3.update();
			view4.update();
		});

		view2.xscale = d3.scaleLinear().domain([0, 35]).range([0, wid * 0.8]);
		view2.yscale = d3.scaleLinear().domain([0, mx]).range([0, hei * 0.8]);

		svg.selectAll("path").data(this.number).enter().append("path").attr("d", function(d, i)
		{
			var x, y;
			if(i%2==0)
				x = wid / 10;
			else
				x = wid + wid / 10;
			var j = parseInt(i / 2);
			y = st + (j+1)*hei;
			var s = "M"+x+" "+y+" ";
			for(var k=0;k<36;k++)
			{
				var xx = x + view2.xscale(k);
				var yy = y - view2.yscale(d[k]);
				s += "L"+xx+" "+yy+" ";
			}
			s += "L"+(x+view2.xscale(35))+" "+y+" ";
			s += "Z";
			return s;
		}).attr("fill", function(d, i)
		{
			return color[i];
		});

		view2.style.cssText="bottom: 95%";

		width = document.getElementById("view2").offsetWidth;
		height = document.getElementById("view2").offsetHeight;

		svg.attr("width", width).attr("height", height);

		svg.append("circle").attr("r", "10").on("click", function()
		{
			if(this.open)
			{
				this.open = false;
				document.getElementById("view3").style.display = "";
				document.getElementById("view4").style.display = "";
				var view2 = document.getElementById("view2");
				view2.style.cssText="bottom: 95%";

				var width = document.getElementById("view2").offsetWidth;
				var height = document.getElementById("view2").offsetHeight;
				svg.attr("width", width).attr("height", height);
			}
			else
			{
				this.open = true;
				document.getElementById("view3").style.display = "none";
				document.getElementById("view4").style.display = "none";
				var view2 = document.getElementById("view2");
				view2.style.cssText="bottom: 10px";

				var width = document.getElementById("view2").offsetWidth;
				var height = document.getElementById("view2").offsetHeight;
				svg.attr("width", width).attr("height", height);
			}
		});
	},
	update:function()
	{

	}
};