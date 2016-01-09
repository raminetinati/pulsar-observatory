function main() {


    var geoXmlDoc = null;
	  var myParser;
    var startingSessionTime = new Date();

    //var intervalStats = setInterval(function(){updateHTML()}, 2000);

    var countTotal = 0;
    var users = {};
    var totalUsers = 0;

    //initialize the map!
    initialize();

    

   //SOCKET IOCODE

    //var socket = io.connect('http://socpub.cloudapp.net:9999');
    //var socket = io.connect('http://sociamvm-app-001.ecs.soton.ac.uk:9001');

    // socket.on('wikipedia_images', function (image_data) {
    //     var data = image_data.data;
    //     var image_url = image_data.image_url;

    //     // images
    //     if (image_url && image_url != "") {
    //         var div = $("#collageContainer");
    //         var img = new Image(image_url);
    //         img.onload = function () {
    //           try{
    //           div.append($("<div id='thumbimg'><a href='#'><img src='"+image_url+"'></a></div>"));
    //           if (div.children().length > 6) {
    //             div.children()[0].remove();
    //           }
    //         }catch(err){}
    //         };
    //         img.src = image_url;
    //     }
    // });

    // socket.on('live_stream_tweets_all', function (data) {
    //     // update graph data
    //     //console.log(data);
    //     ++count;
    //     // update words
    //     //updateHTML();
    //     // calculateMostCommonLang(data);

    //     // updateWikiActivityList(data)

    //     // if(data.wikipedia_page_name != undefined){
    //     //  //console.log(data.wikipedia_page_name);
    //     //   words[data.wikipedia_page_name]= 1;
    //     //   ++countTotal;
    //     //   if(data.wikipedia_user.username in users){
    //     //     users[data.wikipedia_user.username] = users[data.wikipedia_user.username]+1;
    //     //   }else{
    //     //      users[data.wikipedia_user.username] = 1;
    //     //   }
    //     //   totalUsers = Object.keys(users).length;

    //     // }
    // });	

    //random functions


    var DateDiff = {

      inSeconds: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2-t1)/(1000));
        },

      inMinutes: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2-t1)/(60*1000));
        },


      inHours: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2-t1)/(3600*1000));
        },


        inDays: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2-t1)/(24*3600*1000));
        },

        inWeeks: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2-t1)/(24*3600*1000*7));
        },

        inMonths: function(d1, d2) {
            var d1Y = d1.getFullYear();
            var d2Y = d2.getFullYear();
            var d1M = d1.getMonth();
            var d2M = d2.getMonth();

            return (d2M+12*d2Y)-(d1M+12*d1Y);
        },

        inYears: function(d1, d2) {
            return d2.getFullYear()-d1.getFullYear();
        }
    }


}

    function updateHTML(data){

     //$("#statsDiv span").html(createStatsString());
     //console.log("updating client");

     $("#kmlHistoDiv span").html(createKMLListingsString(data));
    }

    var numOfItems = 0;

   // function updateTweetActivityList(data){
     
   //        if(numOfItems>3){
   //          $('#loc li:first').remove();
   //          --numOfItems;
   //        }
   //          //console.log(node.id, node.data.tags);
   //        ++numOfItems;

   //        try{
   //                $('<font color="red"><li>' + data.screen_name + '<br>' + 
   //                  data.text + '</li></font>').appendTo('ul#loc');
   //        }catch(e){

   //        }     

   //  }


    function addRecentTweet(data){
     
          if(numOfItems>10){
            $("#tweet-list").children("a:first").remove();
            --numOfItems;
          }
            //console.log(node.id, node.data.tags);
          ++numOfItems;

          try{
                  $('<a href="#" class="list-group-item" id="tweet"><span class="badge">' + data.timestamp + '</span>'+
                    '<i class="fa fa-fw fa-calendar"></i>' +  data.text  + '</a>'

                    ).appendTo('#tweet-list');
          }catch(e){

          }     

    }


    var numOfSotonTweets = 0;
      function addHistoricDataOnPollution(data){
     
          if(numOfSotonTweets>10){
            $("#tweet-southampton-list").children("a:first").remove();
            --numOfSotonTweets;
          }
            //console.log(node.id, node.data.tags);
          ++numOfSotonTweets;

          try{
                  $('<a href="#" class="list-group-item" id="tweet"><span class="badge">' + data.created_at + '</span>'+
                    '<i class="fa fa-fw fa-calendar"></i> Zoonivite, Location: ' +  data.country_code  + '. Classified Project: ' + data.project_id +'.</a>'

                    ).appendTo('#tweet-southampton-list');
          }catch(e){

          }     

    }



      function addSouthamptonTwitterData(data){
     
          if(numOfSotonTweets>10){
            $("#tweet-southampton-list").children("a:first").remove();
            --numOfSotonTweets;
          }
            //console.log(node.id, node.data.tags);
          ++numOfSotonTweets;

          try{
                  $('<a href="#" class="list-group-item" id="tweet"><span class="badge">' + data.timestamp + '</span>'+
                    '<i class="fa fa-fw fa-calendar"></i>' +  data.text  + '</a>'

                    ).appendTo('#tweet-southampton-list');
          }catch(e){

          }     

    }

    var numOfWikiItems = 0;
    function addRecentWikiEntry(data){
     
          if(numOfWikiItems>10){
            $("#wikipedia-list").children("a:first").remove();
            --numOfWikiItems;
          }
            //console.log(node.id, node.data.tags);
          ++numOfWikiItems;

          try{
                  $('<a href="#" class="list-group-item" id="tweet"><span class="badge">' + data.timestamp + '</span>'+
                    '<i class="fa fa-fw fa-calendar"></i>' +  data.wikipedia_page_name  + '</a>'

                    ).appendTo('#wikipedia-list');
          }catch(e){

          }     

    }

  // function updateWikipediaActivityList(data){
     
  //         if(numOfItems>3){
  //           $('#loc li:first').remove();
  //           --numOfItems;
  //         }
  //           //console.log(node.id, node.data.tags);
  //         ++numOfItems;

  //         try{
  //                 $('<font color="green"><li>' + data.wikipedia_user + '<br>' + 
  //                   data.wikipedia_page_name + '</li></font>').appendTo('ul#loc');
  //         }catch(e){

  //         }     

  //   }


    function createKMLListingsString(data){

        
      var statsStr = "";
      var total = 0;
      for(key in data){

          statsStr = statsStr +  key.replace("-"," ").toLowerCase()+": "+data[key]+"<br>";
          total = total + data[key];
      }      

      return statsStr;

    };

    function updateCounters(data){

      $("#tweet-count span").html(data["tweetsAll"]);
      //$("#wikipedia-count span").html(data["wikiAll"]);
      //$("#wikipedia-southampton-count span").html(data["wikiSoton"]);
    };







  function createLongestCascadeGraph(){
  var graphLongest = Viva.Graph.graph();

  try{

  //aphLongest.addNode(1);

  var layout2 = Viva.Graph.Layout.forceDirected(graphLongest, {
                springLength : 10,
                springCoeff : 0.0010,
                dragCoeff : 0.02,
                gravity : -.1
            });

            // Set custom nodes appearance
            var graphics2 = Viva.Graph.View.svgGraphics();
            try{
            graphics2.node(function(node) {
                   // The function is called every time renderer needs a ui to display node
                var ui =  Viva.Graph.svg("rect")
                         .attr("width", 6)
                         .attr("height", 6)
                         .attr("fill", "#FFA500");

                return ui;    
                });
            }catch(ee){}  

            var renderer2 = Viva.Graph.View.renderer(graphLongest, 
                {
                    container : document.getElementById('southampton-network'),
                    graphics : graphics2,
                    layout : layout2
                });
            renderer2.run();

  }catch(e){

    console.log(e);

  }


}

function updateLongestCascadeGraph(){

   var nodes = hashtags[longestCascadeName];

    for(i = 0; i<nodes.length; i++){
      try{
        graphLongest.addLink(nodes[i+1].id,nodes[i].id);
      }catch(e){

      }
    }

}
