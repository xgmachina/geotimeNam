var map;
var wmsLayer;

var mapClickChange;

var graphicsLayer;
var graphicsLayerClick;

function initMap(){
    require(["esri/map","esri/geometry/Extent","esri/layers/WMSLayer","esri/layers/WMSLayerInfo","esri/graphic","esri/layers/GraphicsLayer"],
          function(Map,Extent,WMSLayer,WMSLayerInfo,Graphic,GraphicsLayer){

           map = new Map("map",{  
                basemap: "hybrid",  
                center: [-114.6, 44.4],  
                zoom: 8
               //isDoubleClickZoom:false
                //smartNavigation: false
            }); 
 
/// pbdb information
		//var timeinterval = "Permian";//geo;     //"Permian";  //In the following work, change it as a function to request from the timechart
	  var intervalSelect = document.getElementById("intervalSelect");
	  intervalSelect.innerHTML="&nbsp;Fossil occurrences within: <span style='background-color: #F04028'>Permian</span>"
									+"<br>"
									+"&nbsp;Base: 298.9 Ma; Top: 252.2 Ma";
        var locationURL="https://paleobiodb.org/data1.2/occs/list.json?lngmin=-125&lngmax=-60&latmin=25&latmax=48.996&show=full";
        locationURL += "&"+"max_ma=298.9"+"&"+"min_ma=252.2"; // use the boundaries of Permian to get fossil results for the initial map window
       // console.log(locationURL);
       graphicsLayer = new GraphicsLayer();
	    map.addLayer(graphicsLayer);
		graphicsLayerClick = graphicsLayer.on("click",getgeoinfoFoss);
       var result;
     //$(document).ready(function(){
        $.ajax({
         type:'get',
         url:locationURL,
         dataType:'json',
         async:true,
         success:function(data){
						result = data.records; //get the information from PBDB{"oid","typ","nco","noc","lng","lat","eag","lag","cxi","ein","lin"},
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

							 var gra= new esri.Graphic(myPoint);
							  //map.addLayer(gra);
							 graphicsLayer.add(gra);  
					}
			}
		});

        //pbdb informaiton

  

   wmsLayer = new WMSLayer("https://mrdata.usgs.gov/services/id?",{
      format:"png",
      resourceInfo:{
            copyright:"USGS",
             description:"Idaho_Lithology",
             extent:new Extent(-117.3,41.9,-111,49.1,{wkid:4326}),
             featureInfoFormat: "text/html",
             getFeatureInfo:"https://mrdata.usgs.gov/services/id?",
             getMapURL:"https://mrdata.usgs.gov/services/id?",
            layerInfos:[
              new WMSLayerInfo({
                name:"Idaho geo",
                queryable:true,
                showPopup: true
              })] ,
              spatialReferences:[3857] ,
              version:"1.3.0"   
            },
              version:"1.3.0",
              visibleLayers:["Idaho_Lithology","Idaho_Faults"],   // The overlay order:Lithology(base)->Faults(top)
              opacity:0.6
           });
           map.addLayer(wmsLayer);

        map.on("load", function(){
            map.infoWindow.resize(500,250);
          });
       
       //map.on("dbl-click",getgeoinfo);

	});
}
/*
 * switch the layer for querying attributes
 */
	function changeLayer(type){
		map.infoWindow.hide();	   	
		if(type =="USGS" ){
		  !graphicsLayerClick?"":graphicsLayerClick.remove();
		  mapClickChange = map.on("click",getgeoinfoUSGS);
	   	 }else if(type =="Foss" ){
			!mapClickChange?"":mapClickChange.remove();
	   		 graphicsLayerClick = graphicsLayer.on("click",getgeoinfoFoss);
	   	 }
    }
	 // use function to getFeatureInnfo from USGS
    function getgeoinfoFoss (event){
		 //console.log("getgeoinfoUSGS");
		// console.log(event.graphic.attributes);
		 var  attr = event.graphic.attributes;
		 var lon=event.mapPoint.x;
		 var lat=event.mapPoint.y;		
		 map.infoWindow.setTitle("Fossil Information ");
		 map.infoWindow.setContent(  "<b>Accepted name: </b>"+attr.tna+"<br/><b>Accepted attributes: </b>"+attr.att+"<br/><b>Accepted rank: </b>"+attr.rnk
		 	+"<br/><b>Early interval: </b>"+attr.oei+"<br/><b>Latitude: </b>"+attr.lat+"<br/><b>Longitude: </b>"+attr.lng+"<br/><b>Phylum: </b>"+attr.phl+"<br/><b>Class: </b>"+attr.cll
           +"<br/><b>Order: </b>"+attr.odl+"<br/><b>Family: </b>"+attr.fml+"<br/><b>Genus: </b>"+attr.gnl+"<br/><b>Subgenus: </b>"+attr.idf+"<br/><b>Species: </b>"+attr.ids
           +"<br/><b>Formation: </b>"+attr.sfm+"<br/><b>General environment: </b>"+attr.jev+"<br/><b>Geology comments: </b>"+attr.gcm+"<br/><b>Primary reference: </b>"+attr.ref                       
	 	);

		 map.infoWindow.show(event.mapPoint, map.getInfoWindowAnchor(event.screenPoint));
     };
     function getgeoinfoUSGS (event){

		 //console.log("getgeoinfoUSGS");
      var lon=event.mapPoint.x;
      var lat=event.mapPoint.y;
      var bbox = lon.toString()+","+lat.toString()+","+(lon+0.0000001).toString()+","+(lat+0.0000001).toString();
      var infoURL="https://mrdata.usgs.gov/services/id?service=WMS&request=GetFeatureInfo&VERSION=1.1.1&format=image/png&layers=Idaho_Lithology&query_layers=Idaho_Lithology&SRS=EPSG:3857&info_format=text/html&exception=text/xml&x=0&y=0&radius=0";
      infoURL += "&"+"bbox="+bbox+"&WIDTH=500&HEIGHT=250&styles=default"
 // use ajax method to get the code of html containing the geological bodies infomation, convert it to string,and extract it by Tag address
          
       $.ajax({url:infoURL,success:function(data){
            var str =  data;
            //console.log(infoURL);
            var Unitname = $(str).find('tbody>tr>td>a').html();
            var Unitage = $(str).find('tbody>tr>td:eq(1)').html();
            var primary = $(str).find('tbody>tr>td>a:eq(1)').html();
            var secondary = $(str).find('tbody>tr>td>a:last').html();
            var source = $(str).find('tbody>tr>td:last').html();
           // console.log(source);

             map.infoWindow.setTitle("Geology Information");
          map.infoWindow.setContent("<b>Unite Name:</b>"+Unitname+"<br/><b>Unite Age:</b>"+Unitage+"<br/><b>Primary Rock Type:</b>"+primary+"<br/><b>Secondary Rock Type:</b>"+secondary+"<br/><b>Source:</b>"+source) 

      map.infoWindow.setTitle("Geology Information");

      // This method uses the floating windows to query the geological information, If the USGS does not permit cross-oringn framing, it will broken down
      //map.infoWindow.setContent("<iframe  id='wmsFeatureInfo' name='wmsFeatureInfo' width='600' height='300' frameBorder='0' src='" + infoURL + "'>Cannot get WMS feature info for the clicked point.</iframe> ");
    //  console.log(infoURL);

      map.infoWindow.show(event.mapPoint, map.getInfoWindowAnchor(event.screenPoint));
    	/* var query= new esri.tasks.Query();
    	 query.returnGeometry = true;
         query.outFields =  ["*"];
         query.outSpatialReference = map.spatialReference;
         query.geometry = extent;
   	     var queryTask = new esri.tasks.queryTask(wmsLayer);
   		 queryTask.execute(query,showResults);*/
   	     //infoTemplate = new esri.infoTemplate("oid:${oid}");
     }});
}
 
function gotoStateCenter(stateChosen) {
    require(["esri/map","esri/geometry/Extent","esri/geometry/Point"],
          function(Map,Extent,Point){	
  
	if (stateChosen == 'Alabama') {
	map.centerAndZoom(new Point(-86.8, 32.8), 8);
	return;  }

	if (stateChosen == 'Alaska') {
	map.centerAndZoom(new Point(-152.3, 64.1), 8);
	return;  }

	if (stateChosen == 'Arizona') {
	map.centerAndZoom(new Point(-111.7, 34.3), 8);
	return;  }

	if (stateChosen == 'Arkansas') {
	map.centerAndZoom(new Point(-92.4, 34.9), 8);
	return;  }

	if (stateChosen == 'California') {
	map.centerAndZoom(new Point(-119.5, 37.2), 8);
	return;  }

	if (stateChosen == 'Colorado') {
	map.centerAndZoom(new Point(-105.5, 39), 8);
	return;  }

	if (stateChosen == 'Connecticut') {
	map.centerAndZoom(new Point(-72.7, 41.6), 8);
	return;  }

	if (stateChosen == 'Delaware') {
	map.centerAndZoom(new Point(-75.5, 39), 8);
	return;  }

	if (stateChosen == 'District of Columbia') {
	map.centerAndZoom(new Point(-77, 38.9), 8);
	return;  }

	if (stateChosen == 'Florida') {
	map.centerAndZoom(new Point(-82.4, 28.6), 8);
	return;  }

	if (stateChosen == 'Georgia') {
	map.centerAndZoom(new Point(-83.4, 32.6), 8);
	return;  }

	if (stateChosen == 'Hawaii') {
	map.centerAndZoom(new Point(-156.4, 20.3), 8);
	return;  }

	if (stateChosen == 'Idaho') {
	map.centerAndZoom(new Point(-114.6, 44.4), 8);
	return;  }

	if (stateChosen == 'Illinois') {
	map.centerAndZoom(new Point(-89.2, 40), 8);
	return;  }

	if (stateChosen == 'Indiana') {
	map.centerAndZoom(new Point(-86.3, 39.9), 8);
	return;  }

	if (stateChosen == 'Iowa') {
	map.centerAndZoom(new Point(-93.5, 42.1), 8);
	return;  }

	if (stateChosen == 'Kansas') {
	map.centerAndZoom(new Point(-98.4, 38.5), 8);
	return;  }

	if (stateChosen == 'Kentucky') {
	map.centerAndZoom(new Point(-85.3, 37.5), 8);
	return;  }

	if (stateChosen == 'Louisiana') {
	map.centerAndZoom(new Point(-92, 31.1), 8);
	return;  }

	if (stateChosen == 'Maine') {
	map.centerAndZoom(new Point(-69.2, 45.4), 8);
	return;  }

	if (stateChosen == 'Maryland') {
	map.centerAndZoom(new Point(-76.8, 39.1), 8);
	return;  }

	if (stateChosen == 'Massachusetts') {
	map.centerAndZoom(new Point(-71.8, 42.3), 8);
	return;  }

	if (stateChosen == 'Michigan') {
	map.centerAndZoom(new Point(-85.4, 44.3), 8);
	return;  }

	if (stateChosen == 'Minnesota') {
	map.centerAndZoom(new Point(-94.3, 46.3), 8);
	return;  }

	if (stateChosen == 'Mississippi') {
	map.centerAndZoom(new Point(-89.7, 32.7), 8);
	return;  }

	if (stateChosen == 'Missouri') {
	map.centerAndZoom(new Point(-92.5, 38.4), 8);
	return;  }

	if (stateChosen == 'Montana') {
	map.centerAndZoom(new Point(-109.6, 47.1), 8);
	return;  }

	if (stateChosen == 'Nebraska') {
	map.centerAndZoom(new Point(-99.8, 41.5), 8);
	return;  }

	if (stateChosen == 'Nevada') {
	map.centerAndZoom(new Point(-116.6, 39.3), 8);
	return;  }

	if (stateChosen == 'New Hampshire') {
	map.centerAndZoom(new Point(-71.6, 43.7), 8);
	return;  }

	if (stateChosen == 'New Jersey') {
	map.centerAndZoom(new Point(-74.7, 40.2), 8);
	return;  }

	if (stateChosen == 'New Mexico') {
	map.centerAndZoom(new Point(-106.1, 34.4), 8);
	return;  }

	if (stateChosen == 'New York') {
	map.centerAndZoom(new Point(-75.5, 43), 8);
	return;  }

	if (stateChosen == 'North Carolina') {
	map.centerAndZoom(new Point(-79.4, 35.6), 8);
	return;  }

	if (stateChosen == 'North Dakota') {
	map.centerAndZoom(new Point(-100.5, 47.5), 8);
	return;  }

	if (stateChosen == 'Ohio') {
	map.centerAndZoom(new Point(-82.8, 40.3), 8);
	return;  }

	if (stateChosen == 'Oklahoma') {
	map.centerAndZoom(new Point(-97.5, 35.6), 8);
	return;  }

	if (stateChosen == 'Oregon') {
	map.centerAndZoom(new Point(-120.6, 43.9), 8);
	return;  }

	if (stateChosen == 'Pennsylvania') {
	map.centerAndZoom(new Point(-77.8, 40.9), 8);
	return;  }

	if (stateChosen == 'Rhode Island') {
	map.centerAndZoom(new Point(-71.6, 41.7), 8);
	return;  }

	if (stateChosen == 'South Carolina') {
	map.centerAndZoom(new Point(-80.9, 33.9), 8);
	return;  }

	if (stateChosen == 'South Dakota') {
	map.centerAndZoom(new Point(-100.2, 44.4), 8);
	return;  }

	if (stateChosen == 'Tennessee') {
	map.centerAndZoom(new Point(-86.4, 35.9), 8);
	return;  }

	if (stateChosen == 'Texas') {
	map.centerAndZoom(new Point(-99.3, 31.5), 8);
	return;  }

	if (stateChosen == 'Utah') {
	map.centerAndZoom(new Point(-111.7, 39.3), 8);
	return;  }

	if (stateChosen == 'Vermont') {
	map.centerAndZoom(new Point(-72.7, 44.1), 8);
	return;  }

	if (stateChosen == 'Virginia') {
	map.centerAndZoom(new Point(-78.9, 37.5), 8);
	return;  }

	if (stateChosen == 'Washington') {
	map.centerAndZoom(new Point(-120.4, 47.4), 8);
	return;  }

	if (stateChosen == 'West Virginia') {
	map.centerAndZoom(new Point(-80.6, 38.6), 8);
	return;  }

	if (stateChosen == 'Wisconsin') {
	map.centerAndZoom(new Point(-90, 44.6), 8);
	return;  }

	if (stateChosen == 'Wyoming') {
	map.centerAndZoom(new Point(-107.6, 43), 8);
	return;  }
 
	}); 
}