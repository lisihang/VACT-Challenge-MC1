//主要的方法
function print(s)
{
	console.log(s);
}
var len;
var data;
var start = 1983;
var from,to;
var selected;
var birdname = new Array();
var color = new Array(19);
var selected = new Array(19);
d3.csv("datasets/AllBirdsv4.csv",function(d)
{
	data = d;
	print(data);
	len = data.length;
	var mx = 0;
	var nodate = 0;
	for(var i=0;i<19;i++)
	{
		selected[i] = true;
		var r = parseInt(Math.random() * 255);
		var g = parseInt(Math.random() * 255);
		var b = parseInt(Math.random() * 255);
		color[i] = "rgb("+r+","+g+","+b+")";
	}
	for(var i=0;i<len;i++)
	{
		data[i].X = parseInt(data[i].X);
		data[i].Y = parseInt(data[i].Y);
		data[i]['File ID'] = parseInt(data[i]['File ID']);
		if(i == 0)
			data[i].Type = 0, birdname.push(data[i].English_name);
		else if(data[i].English_name == data[i-1].English_name)
			data[i].Type = data[i-1].Type;
		else
			data[i].Type = data[i-1].Type + 1, birdname.push(data[i].English_name);
		if(data[i].Date.indexOf('/')>=0)
		{
			var s = data[i].Date.split('/');
			data[i].Month = parseInt(s[0]);
			data[i].Day = parseInt(s[1]);
			data[i].Year = parseInt(s[2]);
		}
		else if(data[i].Date.indexOf('-')>=0)
		{
			var s = data[i].Date.split('-');
			data[i].Year = parseInt(s[0]);
			data[i].Month = parseInt(s[1]);
			data[i].Day = parseInt(s[2]);
		}
		if(data[i].Year > 0)
			data[i].Stamp = (data[i].Year - 1983) * 12 + data[i].Month - 3;
		else
			data[i].Stamp = -1, nodate++;
		if(data[i].Stamp > mx)
			mx = data[i].Stamp;
	}
	print(mx);
	print(nodate);
	print(birdname);
	view1.initialize();
	view2.initialize();
	view3.initialize();
	view4.initialize();
});