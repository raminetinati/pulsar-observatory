/***
*Author: Ramine Tinati
****/



//This is the function which sets everything up when the index.html is called [onload() function in body]
function initialize() {

	var map;
	var ajaxRequest;
	var plotlist;
	var plotlayers=[];


	// Initialise a new map. 
  	map = new L.Map('map_canvas',{
		zoom: 12
	}
		);

  //Note: There are various other tile servers if you wish to use them....such as cloudemade.com
  //create the tile layer with correct attribution.
	// var osmUrl ='http://{S}tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/999/256/{Z}/{X}/{Y}.png'
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osm = new L.TileLayer(
		osmUrl, 
		{
			minZoom: 8, 
			maxZoom: 18, 
		}
		);		

	// Start the map in Shenzhenhistoric_data
	 map.setView(new L.LatLng(51.5072, 0.1275),3);

   //some of the configs for the map. There are various other parameters that can be set here
	var cfg = {
		  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
		  // if scaleRadius is false it will be the constant radius used in pixels
		  "radius": 15,
		  "maxOpacity": .8, 
		  "blur": .75,
		  // scales the radius based on map zoom
		  //"scaleRadius": true, 
		  // if set to false the heatmap uses the global maximum for colorization
		  // if activated: uses the data maximum within the current map boundaries 
		  //   (there will always be a red spot with useLocalExtremas true)
		  "useLocalExtrema": true,
		  // which field name in your data represents the latitude - default "lat"
		  latField: 'lat',
		  // which field name in your data represents the longitude - default "lng"
		  lngField: 'lng',
		  // which field name in your data represents the data value - default "value"
		  valueField: 'count'
	};

  //create a new heatmap layer
	var heatmapLayer = new HeatmapOverlay(cfg);

  //Create the base layer, (e.g. the actuall underlying map)
	var baseLayer = L.tileLayer(
  			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    		attribution: '...',
    		maxZoom: 18
  	}
	);

  //we need to now add the layers to the map!
	map.addLayer(baseLayer);
 	map.addLayer(heatmapLayer);
	
	

  //NOTE: These are just general counters and maps we use to update the HTML using JQuery

  //init the histogram.
  //drawHisto()
  // createLongestCascadeGraph();
  var tweetsAll = 0;
  var tweetsSoton = 0;
  var wikiAll = 0;
  var wikiSoton = 0;

  var counters= {};
  counters["tweetaAll"] = tweetsAll;
  counters["tweetsSoton"] = tweetsSoton;
  counters["wikiAll"] = wikiAll;
  counters["wikiSoton"] = wikiSoton;

  $("#tweet-count span").html(tweetsAll);
  $("#twitter-pollution-count span").html(tweetsSoton);
  $("#wikipedia-count span").html(wikiAll);
  $("#wikipedia-southampton-count span").html(wikiSoton);


  //shenzne boundary box location
  var lon1 = 22.445027;
  var lon2 = 22.861748;
  var lat2 = 114.627296;
  var lat1 = 113.756918;

  //--------------------------------
  //SOCKET WORK
    
   //Storage for WebSocket connections
   var socket3 = io.connect('http://sotonwo.cloudapp.net:3005');



   //country list
   var country_dist = {};
   //users
   var users_dist = {};



   //Firstcall to the server, asks for some data to be loaded
   socket3.emit("load_data","");

   //waiting for some of the shenzhen data!
   socket3.on('panoptes_classifications', function (databaseDump) {


    console.log(databaseDump);

   	//console.log("Shenzhen Historic Data size:", databaseDump.length)

   //for(var i=0; i<databaseDump.length; i++) {
      try{
          //console.log(databaseDump[i])
          tweetsAll = tweetsAll + 1;
           
          counters["tweetsAll"] = tweetsAll;
          
          var data = databaseDump;

          var tstamp = Date.parse(data.created_at)
          var timestamp = new Date(tstamp).format("%Y-%m-%d %H:00:00");
          var country_code = data.country_code;
          var user_id = data.user_id;


          //then update the front end!
          $("#twitter-shenzhen-timestamp span").html(new Date(tstamp).format("%Y-%m-%d %H:%M:%S"));


          //as new data comes in, we need to add it to the mappings of hourly timestamps...
          if(country_code in country_dist){
          		var cnt = country_dist[country_code];
          		country_dist[country_code] =cnt + 1
          }else{
          		country_dist[country_code] = 1
          }
          $("#twitter-pollution-count span").html(Object.keys(country_dist).length);
          
    		  	
          

          //as new data comes in, we need to add it to the mappings of hourly timestamps...
          if(user_id in users_dist){
              var cnt = users_dist[user_id];
              users_dist[user_id] =cnt + 1
          }else{
              users_dist[user_id] = 1
          }
          $("#pm25-pollution-count span").html(Object.keys(users_dist).length);
          


          //We want to ensure that the data we're getting in actually has the gep data
          //this is a double check, as the server should onlybe sending this data...    
            if(data.lat != undefined){
              // resetAllKML();   

              var lat_fnd =   data.lng;
              var lng_fnd =   data.lat;


              //heatmaps need the data placed on the heatmap layer in a specific schema
              var dataPoint = { 
    		  			lat: lat_fnd, // x coordinate of the datapoint, a number 
    			 		  lng: lng_fnd, // y coordinate of the datapoint, a number
    					  count: data.id // the value at datapoint(x, y)
        			};

              //once you;ve created the data point, then you need to add it to the layer
              heatmapLayer.addData(dataPoint);         
            } 

            //finally,we want to update any counters which we havent set during the incomming data
            updateCounters(counters);
            addHistoricDataOnPollution(data);

        }catch(e){
          console.log(e);
        }
          // updateHTML(kmlLayerTweetCount);
    //}

       

  });

  var tweetsPollution = 0;
  
  socket3.on('historic_data', function (databaseDump) {

  //    console.log("Historic Panoptes Data size:", databaseDump.length)
     

      //We use this to keep track of the data coming in!
      var timestamp_dist = {};
      var timeseries = [];


      try{
            //console.log("database data:"+databaseDump)
        for(var i=0; i<databaseDump.length; i++) {

            var data = databaseDump[i];

            var tstamp = Date.parse(data)
            
            var timestamp = new Date(tstamp).format("%Y-%m-%dT%H:00:00");
         
            //console.log(timestamp)

            //tweetsAll = tweetsAll + 1;
           
            //counters["tweetsAll"] = tweetsAll;  

            //timestamp counter:
            if(timestamp in timestamp_dist){
                var cnt = timestamp_dist[timestamp];
                timestamp_dist[timestamp] =cnt + 1
            }else{
                timestamp_dist[timestamp] = 1
            }

            //$("#twitter-pollution-count span").html(tweetsPollution);
            
            //var data = databaseDump;

            //we want to add to the scolling data visualisation
            //addHistoricDataOnPollution(data);
          }
          calcTimeseries(timestamp_dist)
       }catch(e){
            console.log(e);
       }
           

    });


  var pm25Readings = 0;
  
  //Lets listen for any PM25 data comming in....
  socket3.on('pm25_data', function (databaseDump) {

      for(var i=0; i<databaseDump.length; i++) {
        try{
           //console.log(databaseDump[i])
           pm25Readings = pm25Readings + 1;
                 
           $("#pm25-pollution-count span").html(tweetsPollution);
                
           var data = databaseDump[i];
           //we want to add to the scolling data visualisation
        
            //Currently we do not do anything with the PM25 dta
            processPM25Data(data);

        }catch(e){
           console.log(e);
        }
      }
    });



  //WE monitor for when different datasets have finsihed loading...
  socket3.on('finished_sending_historic_classification_data', function (databaseDump) {

    //we to perform some of the calulations on the time series data
    calcTimeseries();

  });


  socket3.on('finished_sending_pollutiom_data', function (databaseDump) {

    //DO SOMETHING
  });


 socket3.on('finished_sending_pm25_data', function (databaseDump) {

    //DO SOMETHING

  });

}

function calcTimeseries(timestamp_dist){
  var timeseries = [];
  for(var key in timestamp_dist){

          var cnt = timestamp_dist[key];
          var unixtime = new Date(key).getTime()/1000

          var entry = [unixtime,cnt];
          timeseries.push(entry);

       }
       //npow we are able to plot this in the HTML!
       plotTimeseries(timeseries);
}


function pop_arrays(){
  try{
    for (i = 0; i < (liveTweetsPos.getLength()-1); i++) { 
      liveTweetsPos.pop();
      //console.log("popping");
    }
    
  }catch(err){}
  

}   

//INFO: Here we want to do some pre-prcessing on the data in order to make 
//it useful for analysis and visualisation 
function processPM25Data(data){

  //TO-DO

}





//this mught be useful if the data gets too large
//var interval = setInterval(function(){pop_arrays()}, 20000);



//INFO: to plot the timeseries data.  
function plotTimeseries(timeseries){
    $(function() {
        

        function euroFormatter(v, axis) {
            return v.toFixed(axis.tickDecimals) + "€";
        }

        function doPlot(position) {
            $.plot($("#flot-multiple-axes-chart"), [{
                data: timeseries,
                label: "Panoptes Activity"
            }], {
                xaxes: [{
                    mode: 'time'
                }],
                yaxes: [{
                    min: 0
                }, {
                    // align if we are to the right
                    alignTicksWithAxis: position == "right" ? 1 : null,
                    position: position,
                    tickFormatter: euroFormatter
                }],
                legend: {
                    position: 'sw'
                },
                grid: {
                    hoverable: true //IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s for %x was %y",
                    xDateFormat: "%y-%0m-%0d",

                    onHover: function(flotItem, $tooltipEl) {
                        // console.log(flotItem, $tooltipEl);
                    }
                }

            });
        }

        doPlot("right");

        $("button").click(function() {
            doPlot($(this).text());
        });
    });

};


//---------------------------------------------------
//MISC FUNCTIONS

function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
};

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  return out;
};





 function getStringTimestamp(date) {
   var yyyy = date.getFullYear();
   var mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); // getMonth() is zero-based
   var dd  = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
   var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  // var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
   return "".concat(yyyy).concat(mm).concat(dd).concat(hh);;
  };