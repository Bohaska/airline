var map
var flightPaths
var activeInput

$( document ).ready(function() {
    flightPaths = []
    activeInput = $("#fromAirport")
    loadAirlines()
})

function initMap() {
  map = L.map('map', {
    center: [20, 150.644],
       zoom : 2,
       attributionControl: false,
  });
  L.maplibreGL({
        style: 'https://tiles.openfreemap.org/styles/positron',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
  getAirports()
  refreshLinks()
}

function addMarkers(airports) {
    for (i = 0; i < airports.length; i++) {
          var airportInfo = airports[i]
          var position = [airportInfo.latitude, airportInfo.longitude];
          var marker = L.marker(position, {
                title: airportInfo.name,
                  airportCode: airportInfo.iata,
                  airportId: airportInfo.id
              }).addTo(map);
          
          marker.on('click', function(e) {
              var airportId = e.target.options.airportId
              if (activeInput.is($("#fromAirport"))) {
                  $("#fromAirport").val(airportId)
                  activeInput = $("#toAirport")
              } else {
                  $("#toAirport").val(airportId)
                  activeInput = $("#fromAirport")
              }
          });
    }
}

function loadAirlines() {
    $.ajax({
        type: 'GET',
        url: "airlines",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(airlines) {
            $.each(airlines, function( key, airline ) {
                $("#airlineOption").append($("<option></option>").attr("value", airline.id).text(airline.name)); 
              });
        },
        error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
        }
    });
}

function loadConsumptions() {
    $("#consumptions").empty()
    $.ajax({
        type: 'GET',
        url: "link-consumptions",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(consumptions) {
            $.each(consumptions, function( key, consumption ) {
                $("#consumptions").append($("<div></div>").text(consumption.airlineName + " - " + consumption.fromAirportCode + "=>" + consumption.toAirportCode + " : " + consumption.consumption)); 
              });
        },
        error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
        }
    });
}

function insertTestLink() {
    if ($("#fromAirport").val() && $("#toAirport").val()) {
        var url = "test-links"
        var airportData = { 
            "fromAirportId" : parseInt($("#fromAirport").val()), 
            "toAirportId" : parseInt($("#toAirport").val()),
            "airlineId" : parseInt($("#airlineOption").val()),
            "capacity" : parseInt($("#capacity").val()), 
            "quality" : parseInt($("#quality").val()),
            "price" : parseFloat($("#price").val()) }
        $.ajax({
            type: 'PUT',
            url: url,
            data: JSON.stringify(airportData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(savedLink) {
                drawFlightPath(savedLink)
            },
            error: function(jqXHR, textStatus, errorThrown) {
                    console.log(JSON.stringify(jqXHR));
                    console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
            }
        });
    }
}

function removeAllLinks() {
    $.ajax({
        type: 'DELETE',
        url: "links",
        success: function() {
            refreshLinks()
        },
        error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
        }
    });
    
    
}


function refreshLinks() {
    //remove all links from UI first
    $.each(flightPaths, function( key, value ) {
          map.removeLayer(value)
        });
    flightPaths = []
    
    $.ajax({
        type: 'GET',
        url: "links",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(links) {
            $.each(links, function( key, link ) {
                drawFlightPath(link)
              });
        },
        error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
        }
    });
}



function drawFlightPath(link) {
   var flightPath = L.polyline([[link.fromLatitude, link.fromLongitude], [link.toLatitude, link.toLongitude]], {
     color: '#F2B022',
     opacity: 1.0,
     weight: 2
   }).addTo(map);
   
   flightPaths.push(flightPath)
}


function appendConsole(message) {
    $('#console').append( message + '<br/>')
}

function getAirports() {
    $.getJSON( "airports?count=10", function( data ) {
          addMarkers(data)
        });
}
    
    
    
    
    
    