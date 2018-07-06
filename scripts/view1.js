function sortNumber(a,b)
{
    return a - b;
}
var view1 = {
	birdSpecies: null,
	yearNum: null,
	newctXY: null,
	newdotNum: null,
	initialize: function(){
		//set the dimensions and margins of the graph
		var width = $('#view1-svg').width();
        var height = $('#view1-svg').height();
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = width - margin.left - margin.right,
            height = height - margin.top - margin.bottom;
		
		birdSpecies = new Array("Rose-crested Blue Pipit", 
		"Blue-collared Zipper", "Bombadil", "Broad-winged Jojo", 
		"Canadian Cootamum", "Carries Champagne Pipit", "Darkwing Sparrow", 
		"Eastern Corn Skeet", "Green-tipped Scarlet Pipit", "Lesser Birchbeere", 
		"Orange Pine Plover", "Ordinary Snape", "Pinkfinch", "Purple Tooting Tout", 
		"Qax", "Queenscoat", "Bent-beak Riffraff", "Scrawny Jay", "Vermillion Trillian");

		var TimeOfday = new Array("上午","下午","晚上");
		var speciesNum = 19;
		var birdr=4, waster=8;
		var color = d3.scaleOrdinal(d3.schemeCategory20c)
						  .domain([0, 20]);
		var bigger = 4, leftX = 60, leftY = 60;
		var wasteX=148*bigger, wasteY=159*bigger;	
		
		var ctXY = new Array(19), dotNum = new Array(19);
		for(var i = 0; i< 19; ++i) {
			dotNum[i] = new Array(40);
			ctXY[i] = new Array(40);
			for(var j = 0; j< 40; ++j) {
				dotNum[i][j] = 0;
				ctXY[i][j] = new Array(3);
				for(var k = 0; k< 3; ++k) {
					ctXY[i][j][k] = 0;
				}
			}
		}
		
		var tooltip = d3.select("body")  
							.append("div")  
							.attr("class","tooltip1")  
							.style("opacity",0.0); 
		
		d3.csv("datasets/AllBirdsv4.csv", function(error, dataset) {
            if (error) throw error;
		    dataset.forEach(function(d,i) {
			    d.species = d.English_name;
				d.speciesid = birdSpecies.indexOf(d.species);
			    d.cx = +d["X"];
				d.cy = +d["Y"];
				d.cx = d.cx*bigger;
				d.cy = d.cy*bigger;
				var date = d.Date.split(/[-//]/);
				d.year = +date[0];
				d.month = +date[1];
				d.day = +date[2];
				if(d.day > 31) {
					d.year = +date[2];
					d.month = +date[0];
					d.day = +date[1];
				}
				if(d.year==0) d.year = NaN;
				if(d.month==0) d.month = NaN;
				if(d.day==0) d.day = NaN;
				var time = d.Time.split(':');
				if(time[0]>=6 &&time[0]<12) d.timeOfday=0;
				if(time[0]>=12 &&time[0]<19) d.timeOfday=1;
				if(time[0]>=19 &&time[0]<6) d.timeOfday=2;
				d.hour = time[0];
				d.id = d["File ID"];
							
            });
			//console.log(dataset);
			for(var i = 0; i < speciesNum; ++i) {
				dataset.forEach(function(d,j) {
					if(!isNaN(d.cx) && !isNaN(d.cy) 
								&& !isNaN(d.year) && (d.speciesid == i) )
					{
						dotNum[i][d.year - 1983] ++;
						ctXY[i][d.year - 1983][0] += d.cx;
						ctXY[i][d.year - 1983][1] += d.cy;
						ctXY[i][d.year - 1983][2] = d.year;
					}
				});
			}
			for(var j = 0; j < speciesNum; ++j) {
				for(var i = 0; i < 40; ++i) {
					ctXY[j][i][0] /= dotNum[j][i];
					ctXY[j][i][1] /= dotNum[j][i];
				}
			}
			//console.log(ctXY);
			//console.log(dotNum);
			yearNum = new Array(19);
			for(var i = 0; i< 19; ++i) {
				yearNum[i] = 0;
			}
			for(var j = 0; j < 19; ++j) {
				for(var i = 0; i < 40; ++i) {
					if(dotNum[j][i] == 0) continue;
					yearNum[j]++;
				}
			}
			//console.log(yearNum);
			newctXY = new Array(19); newdotNum = new Array(19);
			for(var i = 0; i< 19; ++i) {
				newctXY[i] = new Array(yearNum[i]);
				newdotNum[i] = new Array(yearNum[i]);
				for(var j = 0; j< yearNum[i]; ++j) {
					newdotNum[i][j] = 0;
					newctXY[i][j] = new Array(3);
					for(var k = 0; k< 3; ++k) {
						newctXY[i][j][k] = 0;
					}
				}
			}
			var k = 0;
			for(var j = 0; j < 19; ++j) {
				k = 0;
				for(var i = 0; i < 40; ++i) {
					if(dotNum[j][i] == 0) continue;
					newdotNum[j][k] = dotNum[j][i];
					newctXY[j][k][0] = ctXY[j][i][0];
					newctXY[j][k][1] = ctXY[j][i][1];
					newctXY[j][k][2] = ctXY[j][i][2];
					k++;
				}
			}
			//console.log(newctXY);
			//console.log(newdotNum);
			dataset.forEach(function(d,i) {
				if(!isNaN(d.cx) && !isNaN(d.cy) 
								&& !isNaN(d.year))
				{
					var dis = Math.pow(ctXY[d.speciesid][d.year - 1983][0]-d.cx,2);
					dis += Math.pow(ctXY[d.speciesid][d.year - 1983][1]-d.cy,2);
					dis = Math.sqrt(dis);
					d.classDis = dis;
				}
			});
			
			var maxyear=d3.max(dataset,function(d){
							return d.year;
					    });
			var minyear=d3.min(dataset,function(d){
							return d.year;
					    });
			//console.log(maxyear);
			//console.log(minyear);
			
			var svg = d3.select("#view1-svg").append("svg")
			.attr("id","view1-svg1")
			.attr("width",width+margin.left+margin.right)
			.attr("height",height+margin.top+margin.bottom)
				

			var imgs = svg.selectAll("image").data([0]);
				imgs.enter()
				.append("svg:image")
				.attr("xlink:href", "datasets/Lekagul Roadways 2018.bmp")
				.attr("x", leftX)
				.attr("y", leftY)
				.attr("width",bigger*200)
				.attr("heitht",bigger*200)
			
			var dots = svg.selectAll("circle").data(dataset);
				dots.enter()
				.append("circle")
				.filter(function(d,i){
					return !isNaN(d.cx) && !isNaN(d.cy);
				})
				.attr("class","allbird")
				.attr("id",function(d,i){
					return ("bird_" + d.speciesid) + d.id;
				})
				.attr("cx",function(d,i){
					return d.cx+leftX;
				})
				.attr("cy",function(d,i){
					return leftY+200*bigger-d.cy;
				})
				.attr("r",birdr)
				.attr("fill",function(d,i){
					return color(d.speciesid);
				})
				.on("mouseover",function(d){ ;
					d3.select(("#bird_"+d.speciesid)+d.id)
						.transition()
						.duration(200)
						.style("stroke-width","2px")
						.style("stroke","black");									
					tooltip.transition()
						.duration(200)
						.style("opacity",1.0);
					tooltip.html("species: "+d.species+"<br/>"
									//+"rate: "+d.rate+"<br/>"
									//+"box office: "+d['box office']
								)
						.style("left",(d3.event.pageX-60)+"px")
						.style("top", (d3.event.pageY + 20) + "px"); 
			   })
			   .on("mouseout",function(d){ 
					d3.select(("#bird_"+d.speciesid)+d.id)
						.transition()
						.duration(500)
						.style("stroke-width","0px")
						//.style("stroke","black");	
				    tooltip.transition()
						.duration(500)
						.style("opacity",0.0); 
			   })
			   .on("click",function(d,i){ 
					console.log("click"+i); 
               		//node_link.draw(i);
					//view1.updateSpecies(d.speciesid);
					//view1.updateYear(d.year);
           	   });;
			
			svg.append("circle")
			   .attr("cx",leftX+wasteX)
			   .attr("cy",leftY+200*bigger-wasteY)
			   .attr("r",waster)
			   .attr("fill","red"); 
			
			d3.select("#nRadius").on("input",function(){
				view1.updateYear(+this.value,3);
			});
			
			/* var tmpctXY = new Array(40), tmpdotNum = new Array(40);
			for(var i = 0; i < 40; ++i) {
				tmpdotNum[i] = 0;
				tmpctXY[i] = new Array(3);
				tmpctXY[i][0] = 0;
				tmpctXY[i][1] = 0;
				tmpctXY[i][2] = 1983 + i;
			}
			for(var i = 0; i < 40; ++i) {
				for(var j = 0; j < 19; ++j) {
					if(dotNum[j][i]!=0){
						tmpdotNum[i] += dotNum[j][i];
						tmpctXY[i][0] += ctXY[j][i][0]*dotNum[j][i];
						tmpctXY[i][1] += ctXY[j][i][1]*dotNum[j][i];
					}
				}
				tmpctXY[i][0] /= tmpdotNum[i];
				tmpctXY[i][1] /= tmpdotNum[i];
			}
			console.log(tmpctXY);
			console.log(tmpdotNum);
			var tmpyearNum = 0;
			k = 0;
			for(var i = 0; i < 40; ++i) {
				if(tmpdotNum[i] == 0) continue;
				k++;
			}
			var newtmpctXY = new Array(k), newtmpdotNum = new Array(k);
			for(var i = 0; i< k; ++i) {
				newtmpctXY[i] = new Array(3);
			}
			tmpyearNum = k;
			k = 0;
			for(var i = 0; i < 40; ++i) {
				if(tmpdotNum[i] == 0) continue;
				newtmpdotNum[k] = tmpdotNum[i];
				newtmpctXY[k][0] = tmpctXY[i][0];
				newtmpctXY[k][1] = tmpctXY[i][1];
				newtmpctXY[k][2] = tmpctXY[i][2];
				k++;
			}
			console.log(newtmpctXY);
			console.log(newtmpdotNum);
			dataset.forEach(function(d,i) {
				if(!isNaN(d.cx) && !isNaN(d.cy) 
								&& !isNaN(d.year))
				{
					var dis = Math.pow(tmpctXY[d.year - 1983][0]-d.cx,2);
					dis += Math.pow(tmpctXY[d.year - 1983][1]-d.cy,2);
					dis = Math.sqrt(dis);
					d.sumDis = dis;
				}
			});
			
			var circlenum = new Array(tmpyearNum), tmpk = new Array(tmpyearNum);
			for(var i = 0; i < tmpyearNum; ++i) {
				tmpk[i] = 0;
				circlenum[i] = new Array(newtmpdotNum[i]);
			}
			dataset.forEach(function(d,i) {
				if(!isNaN(d.cx) && !isNaN(d.cy) 
								&& !isNaN(d.year))
				{
					var year = 0;
					for(var i = 0; i < tmpyearNum; ++i) {
						if(d.year == newtmpctXY[i][2]) {
							year = i;
							break;
						}
					}
					circlenum[year][tmpk[year]++] = d.sumDis;
				}
			});
			for(var i = 0; i < tmpyearNum; ++i) {
				(circlenum[i]).sort(sortNumber);
			}
			console.log(circlenum);
			
			for(var i = 0; i < tmpyearNum; ++i) {
				if(newtmpdotNum[i]<100) continue;
				var j = 0;
				//console.log(newtmpdotNum[i]);
				//console.log(j);
				while(j + 100 < newtmpdotNum[i]*0.8) {
					j = j + 100;
					//console.log(circlenum[i][j]);
					svg.append("circle")
						.attr("cx", newtmpctXY[i][0] + leftX)
						.attr("cy", leftY+200*bigger-newtmpctXY[i][1])
						.attr("r", ''+Math.ceil(circlenum[i][j]))
						.attr("fill",'none')
						.attr("stroke-width","2px")
						.attr("stroke","red")
						.attr("opacity",0.5);
					svg.append("text")
						.attr("x", newtmpctXY[i][0] + leftX+Math.ceil(circlenum[i][j]))
						.attr("y", leftY+200*bigger-newtmpctXY[i][1])
						.text(""+j)
						.attr("fill","red")
						.attr("font-size","15px")
						.attr("opacity",0.8);
				}
				if(j!=Math.floor(newtmpdotNum[i]*0.8)) {
					svg.append("circle")
						.attr("cx", newtmpctXY[i][0] + leftX)
						.attr("cy", leftY+200*bigger-newtmpctXY[i][1])
						.attr("r", ''+Math.ceil(circlenum[i][Math.floor(newtmpdotNum[i]*0.8)-1]))
						.attr("fill",'none')
						.attr("stroke-width","2px")
						.attr("stroke","red")
						.attr("opacity",0.5);
					svg.append("text")
						.attr("x", newtmpctXY[i][0] + leftX+Math.ceil(circlenum[i][Math.floor(newtmpdotNum[i]*0.8)-1]))
						.attr("y", leftY+200*bigger-newtmpctXY[i][1])
						.text(""+Math.floor(newtmpdotNum[i]*0.8))
						.attr("fill","red")
						.attr("font-size","15px")
						.attr("opacity",0.8);
				}
			} 
			
			
			var defs = svg.append("defs");

			var arrowMarker = defs.append("marker")
									.attr("id","arrow")
									.attr("markerUnits","strokeWidth")
									.attr("markerWidth","12")
									.attr("markerHeight","12")
									.attr("viewBox","0 0 12 12") 
									.attr("refX","6")
									.attr("refY","6")
									.attr("orient","auto");

			var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
									
			arrowMarker.append("path")
						.attr("d",arrow_path)
						//.attr("fill","#000");
						.attr("fill","black");

			
			for(var i = 1; i< tmpyearNum; ++i) {
				svg.append("line")
						 .attr("x1",newtmpctXY[i-1][0] + leftX)
						 .attr("y1",leftY+200*bigger-newtmpctXY[i-1][1])
						 .attr("x2",newtmpctXY[i][0] + leftX)
						 .attr("y2",leftY+200*bigger-newtmpctXY[i][1])
						 .attr("stroke","blue")
						 .attr("stroke-width",2)
						 .attr("marker-end","url(#arrow)")			
			}   */
			
			
			var tmpyearNum = 0;
			for(var k = 0; k < 19; ++k) {
				tmpyearNum = yearNum[k];
				var circlenum = new Array(tmpyearNum), tmpk = new Array(tmpyearNum);
				for(var i = 0; i < tmpyearNum; ++i) {
					tmpk[i] = 0;
					circlenum[i] = new Array(newdotNum[k][i]);
				}
				dataset.forEach(function(d,i) {
					if(!isNaN(d.cx) && !isNaN(d.cy) 
									&& !isNaN(d.year) && d.speciesid == k)
					{
						var year = 0;
						for(var i = 0; i < tmpyearNum; ++i) {
							if(d.year == newctXY[k][i][2]) {
								year = i;
								break;
							}
						}
						circlenum[year][tmpk[year]++] = d.classDis;
					}
				});
				for(var i = 0; i < tmpyearNum; ++i) {
					(circlenum[i]).sort(sortNumber);
				}
				console.log(tmpk);
				console.log(circlenum);
				var interval = 10;
				for(var i = 0; i < tmpyearNum; ++i) {
					var j = 0, cnt = 1;
					//console.log(newtmpdotNum[i]);
					//console.log(j);
					var maxNum = Math.floor(newdotNum[k][i]*0.8);
					while(j + interval <= maxNum) {
						j = j + interval;
						//console.log(circlenum[i][j]);
						svg.append("circle")
							.attr("class","numLine"+k)
							.attr("id","numLine"+k+"yearIndex"+i+"cnt"+cnt)
							.attr("cx", newctXY[k][i][0]+leftX)
							.attr("cy", leftY+200*bigger-newctXY[k][i][1])
							.attr("r", ''+Math.ceil(circlenum[i][j]))
							.attr("fill",'none')
							.attr("stroke-width","2px")
							.attr("stroke","red")
							.attr("opacity",0);
						svg.append("text")
							.attr("class","numLineText"+k)
							.attr("id","numLineText"+k+"yearIndex"+i+"cnt"+cnt)
							.attr("x", newctXY[k][i][0]+leftX+Math.ceil(circlenum[i][j]))
							.attr("y", leftY+200*bigger-newctXY[k][i][1])
							.text(""+j)
							.attr("fill","red")
							.attr("font-size","15px")
							.attr("opacity",0);
						cnt++;
					}
					if(j!=maxNum) {
						svg.append("circle")
							.attr("class","numLine"+k)
							.attr("id","numLine"+k+"yearIndex"+i+"cnt"+cnt)
							.attr("cx", newctXY[k][i][0]+leftX)
							.attr("cy", leftY+200*bigger-newctXY[k][i][1])
							.attr("r", ''+Math.ceil(circlenum[i][maxNum-1]))
							.attr("fill",'none')
							.attr("stroke-width","2px")
							.attr("stroke","red")
							.attr("opacity",0);
						svg.append("text")
							.attr("class","numLineText"+k)
							.attr("id","numLineText"+k+"yearIndex"+i+"cnt"+cnt)
							.attr("x", newctXY[k][i][0]+leftX+Math.ceil(circlenum[i][maxNum-1]))
							.attr("y", leftY+200*bigger-newctXY[k][i][1])
							.text(""+maxNum)
							.attr("fill","red")
							.attr("font-size","15px")
							.attr("opacity",0);
					}
				}
				
				var defs = svg.append("defs");

				var arrowMarker = defs.append("marker")
										.attr("id","arrow")
										.attr("markerUnits","strokeWidth")
										.attr("markerWidth","12")
										.attr("markerHeight","12")
										.attr("viewBox","0 0 12 12") 
										.attr("refX","6")
										.attr("refY","6")
										.attr("orient","auto");

				var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
										
				arrowMarker.append("path")
							.attr("d",arrow_path)
							//.attr("fill","#000");
							.attr("fill","black");

				
				for(var i = 1; i< tmpyearNum; ++i) {
					svg.append("line")
							 .attr("class","moveLine"+k)
							 .attr("id","moveLine"+k+"yearIndex"+i)
							 .attr("x1",newctXY[k][i-1][0] + leftX)
							 .attr("y1",leftY+200*bigger-newctXY[k][i-1][1])
							 .attr("x2",newctXY[k][i][0] + leftX)
							 .attr("y2",leftY+200*bigger-newctXY[k][i][1])
							 .attr("stroke","blue")
							 .attr("stroke-width",2)
							 .attr("opacity",0)
							 .attr("marker-end","url(#arrow)")			
				}
			}
		});
	},
	updateSpecies: function(id) {
		var opa = 0.5;
		for(var i = 0; i < 19; ++i) {
			if(i == id) {
				d3.selectAll(".numLine"+id).attr("opacity",opa);
				d3.selectAll(".numLineText"+id).attr("opacity",opa);
				d3.selectAll(".moveLine"+id).attr("opacity",opa);
			}
			else {
				d3.selectAll(".numLine"+i).attr("opacity",0)
				d3.selectAll(".numLineText"+i).attr("opacity",0);
				d3.selectAll(".moveLine"+i).attr("opacity",0);
			}
		}
		d3.selectAll(".allbird")
		  .filter(function(d,i){
			  return d.speciesid == id;
		  })
		  .classed('circle-hidden', false);
		d3.selectAll(".allbird")
		  .filter(function(d,i){
			  return d.speciesid != id;
		  })
		  .classed('circle-hidden', true);
	},
	updateYear: function(year,id) {
		d3.select("#nRadius-value").text(year);
		d3.select("#nRadius").property("value",year);
		var opa = 0.5;
		for(var i = 0; i < 19; ++i) {

				d3.selectAll(".numLine"+i).attr("opacity",0)
				d3.selectAll(".numLineText"+i).attr("opacity",0);
				d3.selectAll(".moveLine"+i).attr("opacity",0);

		}
		d3.selectAll(".allbird")
		  .classed('circle-hidden', true);
		d3.selectAll(".allbird")
		  .filter(function(d,i){
			  return d.speciesid == id && (d.year == year || d.year == year-1);
		  })
		  .classed('circle-hidden', false);
		  
		var yearIndex = 0;
		for(var i = 0; i < yearNum[id]; ++i) {
			if(year == newctXY[id][i][2]) {
				yearIndex = i;
				break;
			}
		}
		
		d3.selectAll(".numLine"+id)
			.filter(function(d,i){
				var strid = d3.select(this).attr("id");
				var s1 = strid.substring(0,strid.indexOf('c'));
				var s2 = 'numLine'+id+'yearIndex'+yearIndex;
				if(yearIndex == 0) return s1 == s2;
				else {
					var s3 = 'numLine'+id+'yearIndex'+(yearIndex-1);
					return (s1==s2) || (s1==s3);
				}
			})
			.attr("opacity",opa);
		d3.selectAll(".numLineText"+id)
			.filter(function(d,i){
				var strid = d3.select(this).attr("id");
				var s1 = strid.substring(0,strid.indexOf('c'));
				var s2 = 'numLineText'+id+'yearIndex'+yearIndex;
				if(yearIndex == 0) return s1 == s2;
				else {
					var s3 = 'numLineText'+id+'yearIndex'+(yearIndex-1);
					return (s1==s2) || (s1==s3);
				}
			})
			.attr("opacity",opa);
		d3.selectAll(".moveLine"+id)
			.filter(function(d,i){
				var s = 'moveLine'+id+'yearIndex'+yearIndex;
				return s == d3.select(this).attr("id");
			})
			.attr("opacity",opa);
	},
	Animation: function() {
		
	}
} 

