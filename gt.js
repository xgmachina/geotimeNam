var width = 1366,
    height = 130;
    var geo;
 var x=d3.scale.linear().range([0,width]);
var y=d3.scale.linear().range([0,height]);


var color = d3.scale.category20();

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height);
var rect = svg.selectAll("rect");
var partition = d3.layout.partition()
                  .sort(null)
                
                  .value(function(d) { return d.interval; });

d3.json("Northamerica.json", function(error, root) {
  
  var nodes = partition.nodes(root);
  var g=svg.selectAll("g")
            .data(partition.nodes(root))
             .enter().append("svg:g")
            .on("click", clicked)
            .on("dblclick",TransInterval);
  
  g.append("svg:rect")
      
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", function(d) { return x(d.dx); })
      .attr("height", function(d) { return y(d.dy); })
      .style("fill", function(d) {return d.colour; })
      .attr("id",function(d){return "t"+d.oid;});
     

  g.append("svg:text")
          /* .data(nodes.filter(function(d){
            return x(d.dx) > 6;
           }))*/
            .attr("id",function(d){return "l"+d.oid;})
            .attr("transform", transform)
            .text( function(d){return d.name; })
            .attr("dy",".35em")//function(d){ return y(d.dy);});
            .style("opacity", textDisply)
            .attr("text-anchor", "middle");
			
// zoom the selected ele)//ment
function clicked(d){
      x.domain([d.x, d.x + d.dx]).range([0, width]);
      y.domain([d.y, 1]).range([d.y ? 15 : 0, height]);

     //before the transformation, make all labels invisible 
	 g.transition()
     .duration(10)
	 .select("text")
	 .style("opacity", 0);
	 
	 var t=g.transition()
             .duration(450);
       // .attr("transform", function(d){ return "translate(" + x(d.x) + "," + y(d.y) + ")";});
	 		 
     t.select("rect")
       .attr("x", function(d) { return x(d.x); })
       .attr("y", function(d) { return y(d.y); })
       .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
       .attr('height', function(d) { return y(d.y + d.dy) - y(d.y); })
	   .each('end', labelTrans); // use the 'end' listener to trigger label transformation - i.e. after the node rectangle transformation is done, begin the label transformation.
	   	   
};

function labelTrans(d){
	var t2=g.transition()
             .duration(1);
	t2.select("text")
        //.attr("x",labelX)
     //.attr("y", function(d){ return y(d.y)+18;})
     .attr("transform", transform)
     .style("opacity", textDisply)// function(d) { return x(d.dx)-8 > d3.select("#l" + d.oid).node().getComputedTextLength() ? 1 : 0; });
     .attr("text-anchor", "middle");
       //d3.event.stopPropagation();
	   
}

function transform(d) {

     return "translate(" + x(d.x +( d.dx-0) / 2) + "," + y(d.y + d.dy / 2) + ")";
  };


 function textDisply(d){
    var rectWidth = parseFloat(d3.select("#t" + d.oid).attr("width")), 
          rectX = parseFloat(d3.select("#t" + d.oid).attr("x"));
 var labelWidth;
  try {
        labelWidth = d3.select("#l" + d.oid).node().getComputedTextLength();
   } catch(err) {
        labelWidth = 25;
      } 
if (rectWidth-8 <labelWidth){
  return 0 ;
 } else{ 
return 1;
}

};

//var TransInterval =  (function(d){

//return {

   // TransIl:function(d){
   // geoInter = d.name;
    // console.log(geoInter);
  //return geoInter;
 //}

//};

//}());

//console.log(geoInter);
function TransInterval(d){
  
console.log('TransInterval');
geo = d.name;
/*loadM(geo);*/
var intervalColor = d.colour,
    start = d.base, 
    end = d.top;
loadM(start, end);	

var intervalSelect = document.getElementById("intervalSelect");
intervalSelect.innerHTML="&nbsp;Fossil occurrences within: " +"<span style='background-color: " +intervalColor + "'>" + geo +"</span>"
						+"<br>"
						+"&nbsp;Base: " + start + " Ma; Top: " + end+ " Ma";
   //test(geo);
 //console.log(geo);

};
 //geo=TransInterval();

//console.log(geo);

});

 
//Here the function uses the base and top boundaries of the selected geo time interval to retrieve fossil records from PBDB
//An other option is to use the name of the time interval to retrieve data, but that may miss some records
//Numerical values of time boundaries are the most mutual standard about a period of time
function loadM(base_b, top_b) {
      //var timeinterval = "Permian";//geo;     //"Permian";  //In the following work, change it as a function to request from the timechart
      //console.log(geo);
	  graphicsLayer.clear();
        var locationURL="https://paleobiodb.org/data1.2/occs/list.json?lngmin=-125&lngmax=-60&latmin=25&latmax=50&&show=full";
        locationURL += "&"+"max_ma="+base_b+"&"+"min_ma="+top_b;
       // console.log(locationURL);
       //graphicsLayer = new GraphicsLayer();
      //map.addLayer(graphicsLayer);
    //graphicsLayerClick = graphicsLayer.on("click",getgeoinfoFoss);
       var result;
     //$(document).ready(function(){
        $.ajax({
         type:'get',
         url:locationURL,
         dataType:'json',
         async:true,
         success:function(data){
            result = data.records; //get the information from PBDB{"oid","typ","nco","noc","lng","lat","eag","lag","cxi","ein","lin"},
            //graphicsLayer.clear();
            for(i=0; i<result.length-1;i++){
              var myPoint = {
                   "geometry":{
                      "x":result[i].lng,
                      "y":result[i].lat,
                     // "points":mypoints,
                  
                  "spatialReference":{"wkid":4326}
                  },
                  "attributes":{
                     //"XCoord":-104.4140625,
                     //"YCoord":69.2578125,
                                         "tna":result[i].tna,
                                         "att":result[i].att,
                                         "rnk":result[i].rnk,
                                         "oei":result[i].oei,
                                         "lat":result[i].lat,
                                         "lng":result[i].lng,
                                         "phl":result[i].phl,
                                         "cll":result[i].cll,
                                         "odl":result[i].odl,
                                         "fml":result[i].fml,
                                         "gnl":result[i].gnl,
                                         "idf":result[i].idf,
										 "ids":result[i].ids,
										 "sfm":result[i].sfm,
                                         "jev":result[i].jev,
										 "gcm":result[i].gcm,
                                         "ref":result[i].ref
                  },
                  "symbol":{
                      "color":[0,0,0,64],
                      "size":10,
              
                      "angle":0,
                      "xoffset":0,
                      "yoffset":0,
                      "type":"esriSMS",
                      "style":"esriSMSCircle",
                      "outline":{
                        "color":[0,0,0,255],
                        "width":1,
                        "type":"esriSLS",
                        "style":"esriSLSSolid"
                  }
                }
              };
              
              //graphicsLayer.remove(gra);

               var gra = new esri.Graphic(myPoint);
              // console.log(myPoint);
                //map.addLayer(gra);
                
               graphicsLayer.add(gra);  

               
          }
          console.log('done');
      }
    });


}