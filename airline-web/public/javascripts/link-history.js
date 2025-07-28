var historyFlightMarkers = []
//var flightMarkerAnimations = []
var historyPaths = {}

function showLinkHistoryView() {
    fromLinkCanvas = $('#linksCanvas').is(":visible")
    $('.exitPaxMap').data("fromLinkCanvas", fromLinkCanvas)

    if (!$('#worldMapCanvas').is(":visible")) {
        showWorldMap()
    }

    loadCurrentAirlineAlliance(function(allianceDetails) {
        currentAirlineAllianceMembers = []
        if (allianceDetails.allianceId) {
            var alliance = loadedAlliancesById[allianceDetails.allianceId]
            if (alliance) {
                $.each(alliance.members, function(index, member) {
                    currentAirlineAllianceMembers.push(member.airlineId)
                })
            }
        }
    })
    clearAllPaths() //clear all flight paths

    //populate control panel
    $("#linkHistoryControlPanel .transitAirlineList .table-row").remove()

    $("#linkHistoryControlPanel .routeList").empty()
    $("#linkHistoryControlPanel").data("showForward", true)
    var link = loadedLinksById[selectedLink]
    var forwardLinkDescription = "<div style='display: flex; align-items: center;' class='clickable selected' onclick='toggleLinkHistoryDirection(true, $(this))'>" + getAirportText(link.fromAirportCity, link.fromAirportCode) + "<img src='assets/images/icons/arrow.png'>" + getAirportText(link.toAirportCity, link.toAirportCode) + "</div>"
    var backwardLinkDescription = "<div style='display: flex; align-items: center;' class='clickable' onclick='toggleLinkHistoryDirection(false, $(this))'>" + getAirportText(link.toAirportCity, link.toAirportCode) + "<img src='assets/images/icons/arrow.png'>" + getAirportText(link.fromAirportCity, link.fromAirportCode) + "</div>"

    $("#linkHistoryControlPanel .routeList").append(forwardLinkDescription)
    $("#linkHistoryControlPanel .routeList").append(backwardLinkDescription)

    $("#linkHistoryControlPanel").show()

    $('#linkHistoryControlPanel').data('cycleDelta', 0)
    loadLinkHistory(selectedLink)
}

function loadLinkHistory(linkId) {
    $.each(historyPaths, function(index, path) { //clear all history path
        path.remove()
    })
    historyPaths = {}
    var linkInfo = loadedLinksById[linkId]
    var airlineNamesById = {}
    var cycleDelta = $('#linkHistoryControlPanel').data('cycleDelta')
    $("#linkHistoryControlPanel .transitAirlineList").empty()

    var url = "airlines/" + activeAirline.id + "/related-link-consumption/" + linkId + "?cycleDelta=" + cycleDelta +
    "&economy=" + $("#linkHistoryControlPanel .showEconomy").is(":checked") +
    "&business=" + $("#linkHistoryControlPanel .showBusiness").is(":checked") +
    "&first=" + $("#linkHistoryControlPanel .showFirst").is(":checked")

    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(linkHistory) {
            var forwardTransitPaxByAirlineId = {}
            var backwardTransitPaxByAirlineId = {}

            if (!jQuery.isEmptyObject(linkHistory)) {
                $.each(linkHistory.relatedLinks, function(step, relatedLinksOnStep) {
                    $.each(relatedLinksOnStep, function(key, relatedLink) {
                        drawLinkHistoryPath(relatedLink, false, linkId, step)
                        if (linkInfo.fromAirportId != relatedLink.fromAirportId || linkInfo.toAirportId != relatedLink.toAirportId || linkInfo.airlineId != linkInfo.airlineId) { //transit should not count the selected link
                            airlineNamesById[relatedLink.airlineId] = relatedLink.airlineName
                            if (!forwardTransitPaxByAirlineId[relatedLink.airlineId]) {
                                forwardTransitPaxByAirlineId[relatedLink.airlineId] = relatedLink.passenger
                            } else {
                                forwardTransitPaxByAirlineId[relatedLink.airlineId] = forwardTransitPaxByAirlineId[relatedLink.airlineId] + relatedLink.passenger
                            }
                        }
                    })
                })
                $.each(linkHistory.invertedRelatedLinks, function(step, relatedLinksOnStep) {
                    $.each(relatedLinksOnStep, function(key, relatedLink) {
                        drawLinkHistoryPath(relatedLink, true, linkId, step)
                        if (linkInfo.fromAirportId != relatedLink.toAirportId || linkInfo.toAirportId != relatedLink.fromAirportId || linkInfo.airlineId != linkInfo.airlineId) { //transit should not count the selected link
                            airlineNamesById[relatedLink.airlineId] = relatedLink.airlineName
                            if (!backwardTransitPaxByAirlineId[relatedLink.airlineId]) {
                                backwardTransitPaxByAirlineId[relatedLink.airlineId] = relatedLink.passenger
                            } else {
                                backwardTransitPaxByAirlineId[relatedLink.airlineId] = backwardTransitPaxByAirlineId[relatedLink.airlineId] + relatedLink.passenger
                            }
                        }
                    })
                })
                var forwardItems = Object.keys(forwardTransitPaxByAirlineId).map(function(key) {
                  return [key, forwardTransitPaxByAirlineId[key]];
                });
                var backwardItems = Object.keys(backwardTransitPaxByAirlineId).map(function(key) {
                  return [key, backwardTransitPaxByAirlineId[key]];
                });
                //now sort them
                forwardItems.sort(function(a, b) {
                    return b[1] - a[1]
                })
                backwardItems.sort(function(a, b) {
                    return b[1] - a[1]
                })
                //populate the top 5 transit airline table
                forwardItems = $(forwardItems).slice(0, 5)
                backwardItems = $(backwardItems).slice(0, 5)
                $.each(forwardItems, function(index, entry) { //entry : airlineId, pax counts
                    var tableRow = $("<div class='table-row' style='display: none;'></div>")
                    tableRow.addClass("forward")
                    var airlineId = entry[0]
                    tableRow.append("<div class='cell' style='width: 70%'>" + getAirlineSpan(airlineId, airlineNamesById[airlineId]) + "</div>")
                    tableRow.append("<div class='cell' style='width: 30%'>" + entry[1] + "</div>")

                    $("#linkHistoryControlPanel .transitAirlineList").append(tableRow)
                })
                $.each(backwardItems, function(index, entry) { //entry : airlineId, pax counts
                    var tableRow = $("<div class='table-row' style='display: none;'></div>")
                    tableRow.addClass("backward")
                    var airlineId = entry[0]
                    tableRow.append("<div class='cell' style='width: 70%'>" + getAirlineSpan(airlineId, airlineNamesById[airlineId]) + "</div>")
                    tableRow.append("<div class='cell' style='width: 30%'>" + entry[1] + "</div>")

                    $("#linkHistoryControlPanel .transitAirlineList").append(tableRow)
                })

            }
            showLinkHistory(fromLinkCanvas)
        },
        error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
        },
        beforeSend: function() {
            $('body .loadingSpinner').show()
        },
        complete: function(){
            $('body .loadingSpinner').hide()
        }
    });
}


function toggleLinkHistoryDirection(showForward, routeDiv) {
    routeDiv.siblings().removeClass("selected")
    routeDiv.addClass("selected")

    $("#linkHistoryControlPanel").data("showForward", showForward)
    showLinkHistory()
}

function hideLinkHistoryView() {
    $.each(historyPaths, function(index, path) {
        map.removeLayer(path)
    })
    historyPaths = {}

    clearHistoryFlightMarkers()
    updateLinksInfo() //redraw all flight paths

    $("#linkHistoryControlPanel").hide()

    if ($('.exitPaxMap').data("fromLinkCanvas")) {
        showLinksDetails()
    }
}

function drawLinkHistoryPath(link, inverted, watchedLinkId, step) {
    var from = [link.fromLatitude, link.fromLongitude]
    var to = [link.toLatitude, link.toLongitude]
    var pathKey = link.fromAirportId + "|"  + link.toAirportId + "|" + inverted

    var lineSymbol = L.polylineDecorator(L.polyline([from, to]), {
        patterns: [
            {offset: '50%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: {stroke: true, color: '#DC83FC', weight: 2}})}
        ]
    });

    var isWatchedLink = link.linkId == watchedLinkId

    var relatedPath
    if (!historyPaths[pathKey]) {
        relatedPath = L.polyline([from, to], {
             color: "#DC83FC",
             opacity: 0.8,
             weight: 2,
             inverted : inverted,
             watched : isWatchedLink,
             step : step
        }).addTo(map);

        var shadowPath = L.polyline([from, to], {
             opacity: 0.0001,
             weight: 25,
             inverted : inverted,
             link : link,
             thisAirlinePassengers : 0,
             thisAlliancePassengers : 0,
             otherAirlinePassengers : 0
        }).addTo(map);

        relatedPath.shadowPath = shadowPath

        historyPaths[pathKey] = relatedPath
    } else {
        relatedPath = historyPaths[pathKey]
    }

    if (link.airlineId == activeAirline.id) {
        relatedPath.shadowPath.options.thisAirlinePassengers += link.passenger
    } else if (currentAirlineAllianceMembers.length > 0 && $.inArray(link.airlineId, currentAirlineAllianceMembers) != -1) {
        relatedPath.shadowPath.options.thisAlliancePassengers += link.passenger
    } else {
        relatedPath.shadowPath.options.otherAirlinePassengers += link.passenger
    }
}

function clearHistoryFlightMarkers() {
    $.each(historyFlightMarkers, function(index, markersOnAStep) {
        $.each(markersOnAStep, function(index, marker) {
        //window.clearInterval(marker.animation)
            marker.remove()
        })
    })
    historyFlightMarkers = []

    if (historyFlightMarkerAnimation) {
        window.clearInterval(historyFlightMarkerAnimation)
        historyFlightMarkerAnimation = null
    }
}
var historyFlightMarkerAnimation

function animateHistoryFlightMarkers(framesPerAnimation) {
    var currentStep = 0
    var currentFrame = 0
    var animationInterval = 50
    historyFlightMarkerAnimation = window.setInterval(function() {
        $.each(historyFlightMarkers[currentStep], function(index, marker) {
            if (!marker.options.isActive) {
                marker.options.isActive = true
                marker.options.elapsedDuration = 0
                marker.setLatLng(marker.options.from)
                marker.addTo(map)
            } else  {
                marker.options.elapsedDuration += 1

                if (marker.options.elapsedDuration == marker.options.totalDuration) { //arrived
                    marker.options.isActive = false
                    //console.log("next departure " + marker.nextDepartureFrame)
                } else {
                    var newPosition = [marker.options.from[0] + (marker.options.to[0] - marker.options.from[0]) * marker.options.elapsedDuration / marker.options.totalDuration, marker.options.from[1] + (marker.options.to[1] - marker.options.from[1]) * marker.options.elapsedDuration / marker.options.totalDuration]
                    marker.setLatLng(newPosition)
                }
            }
          })
          if (currentFrame == framesPerAnimation) {
             fadeOutMarkers(historyFlightMarkers[currentStep], animationInterval)
             currentStep = (++ currentStep) % historyFlightMarkers.length
           currentFrame = 0
        } else {
           currentFrame ++
        }
    }, animationInterval)

}

function fadeOutMarkers(markers, animationInterval) {
    var opacity = 1.0
    var animation = window.setInterval(function () {
        if (opacity <= 0) {
            $.each(markers, function(index, marker) {
                map.removeLayer(marker)
                marker.setOpacity(1)
            })
            window.clearInterval(animation)
        } else {
            $.each(markers, function(index, marker) {
                marker.setOpacity(opacity)
            })
            opacity -= 0.1
        }
    }, animationInterval)
}


function drawHistoryFlightMarker(line, framesPerAnimation, totalPassengers) {
    if (currentAnimationStatus) {
        var from = line.getLatLngs()[0][0]
        var to = line.getLatLngs()[0][1]
        var iconUrl
        if (totalPassengers > 200) {
           iconUrl = "dot-5.png"
        } else if (totalPassengers > 100) {
           iconUrl = "dot-4.png"
        } else if (totalPassengers > 50) {
           iconUrl = "dot-3.png"
        } else if (totalPassengers > 25) {
           iconUrl = "dot-2.png"
        } else {
           iconUrl = "dot-1.png"
        }

        var image = L.icon({
            iconUrl: "assets/images/markers/" + iconUrl,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        var marker = L.marker(from, {
            from : from,
            to : to,
            icon : image,
            elapsedDuration : 0,
            totalDuration : framesPerAnimation,
            isActive: false,
            clickable: false
        });

        //flightMarkers.push(marker)
        var step = line.options.step
        var historyFlightMarkersOfThisStep = historyFlightMarkers[step]
        if (!historyFlightMarkersOfThisStep) {
            historyFlightMarkersOfThisStep = []
            historyFlightMarkers[step] = historyFlightMarkersOfThisStep
        }
        historyFlightMarkersOfThisStep.push(marker)
    }
}





function showLinkHistory() {
    var showAlliance = $("#linkHistoryControlPanel .showAlliance").is(":checked")
    var showOther = $("#linkHistoryControlPanel .showOther").is(":checked")
    var showForward = $("#linkHistoryControlPanel").data("showForward")
    var showAnimation = $("#linkHistoryControlPanel .showAnimation").is(":checked")

    var cycleDelta = $("#linkHistoryControlPanel").data('cycleDelta')
    $("#linkHistoryControlPanel .cycleDeltaText").text(cycleDelta * -1 + 1)
    var disablePrev = false
    var disableNext= false
    if (cycleDelta <= -29) {
        disablePrev = true
    }
    if (cycleDelta >= 0) {
        disableNext = true
    }

    $("#linkHistoryControlPanel img.prev").prop("onclick", null).off("click");
    if (disablePrev) {
        $('#linkHistoryControlPanel img.prev').attr("src", "assets/images/icons/arrow-180-grey.png")
        $('#linkHistoryControlPanel img.prev').removeClass('clickable')
    } else {
        $('#linkHistoryControlPanel img.prev').attr("src", "assets/images/icons/arrow-180.png")
        $('#linkHistoryControlPanel img.prev').addClass('clickable')
        $("#linkHistoryControlPanel img.prev").click(function() {
            $("#linkHistoryControlPanel").data('cycleDelta', $("#linkHistoryControlPanel").data('cycleDelta') - 1)
            loadLinkHistory(selectedLink)
        })
    }

    $("#linkHistoryControlPanel img.next").prop("onclick", null).off("click");
    if (disableNext) {
        $('#linkHistoryControlPanel img.next').attr("src", "assets/images/icons/arrow-grey.png")
        $('#linkHistoryControlPanel img.next').removeClass('clickable')
        $("#linkHistoryControlPanel img.next").prop("onclick", null).off("click");
    } else {
        $('#linkHistoryControlPanel img.next').attr("src", "assets/images/icons/arrow.png")
        $('#linkHistoryControlPanel img.next').addClass('clickable')
        $("#linkHistoryControlPanel img.next").click(function() {
            $("#linkHistoryControlPanel").data('cycleDelta', $("#linkHistoryControlPanel").data('cycleDelta') + 1)
            loadLinkHistory(selectedLink)
        })
    }

    $("#linkHistoryControlPanel .transitAirlineList .table-row").hide()
    if (showForward) {
        $("#linkHistoryControlPanel .transitAirlineList .table-row.forward").show()
    } else {
        $("#linkHistoryControlPanel .transitAirlineList .table-row.backward").show()
    }

    var framesPerAnimation = 50
    clearHistoryFlightMarkers()
    $.each(historyPaths, function(key, historyPath) {
        if (((showForward && !historyPath.options.inverted) || (!showForward && historyPath.options.inverted))  //match direction
        && (historyPath.shadowPath.options.thisAirlinePassengers > 0
         || (showAlliance && historyPath.shadowPath.options.thisAlliancePassengers > 0)
         || (showOther && historyPath.shadowPath.options.otherAirlinePassengers))) {
            var totalPassengers = historyPath.shadowPath.options.thisAirlinePassengers + historyPath.shadowPath.options.thisAlliancePassengers + historyPath.shadowPath.options.otherAirlinePassengers
            if (totalPassengers < 100) {
                var newOpacity = 0.2 + totalPassengers / 100 * (historyPath.options.opacity - 0.2)
                if (!historyPath.options.watched) {
                    historyPath.setStyle({opacity : newOpacity})
                }
            }
            var infowindow;
            historyPath.shadowPath.on('mouseover', function(event) {
                var link = this.options.link

                $("#linkHistoryPopupFrom").html(getCountryFlagImg(link.fromCountryCode) + getAirportText(link.fromAirportCity, link.fromAirportCode))
                $("#linkHistoryPopupTo").html(getCountryFlagImg(link.toCountryCode) + getAirportText(link.toAirportCity, link.toAirportCode))
                $("#linkHistoryThisAirlinePassengers").text(this.options.thisAirlinePassengers)
                if (showAlliance) {
                    $("#linkHistoryThisAlliancePassengers").text(this.options.thisAlliancePassengers)
                    $("#linkHistoryThisAlliancePassengers").closest(".table-row").show()
                } else {
                    $("#linkHistoryThisAlliancePassengers").closest(".table-row").hide()
                }
                if (showOther) {
                    $("#linkHistoryOtherAirlinePassengers").text(this.options.otherAirlinePassengers)
                    $("#linkHistoryOtherAirlinePassengers").closest(".table-row").show()
                 } else {
                    $("#linkHistoryOtherAirlinePassengers").closest(".table-row").hide()
                 }

                var popup = $("#linkHistoryPopup").clone()
                popup.show()
                infowindow = L.popup({ maxWidth : 400}).setLatLng(event.latlng).setContent(popup[0]).openOn(map);

                highlightPath(historyPath, false)
            })
            historyPath.shadowPath.on('mouseout', function(event) {
                map.closePopup(infowindow)
                if (!historyPath.options.watched) { //do not unhighlight if it's watched link
                    unhighlightPath(historyPath)
                }
            })


            if (historyPath.shadowPath.options.thisAirlinePassengers > 0) {
                historyPath.setStyle({color: "#DC83FC"})
            } else if (showAlliance && historyPath.shadowPath.options.thisAlliancePassengers > 0) {
                historyPath.setStyle({color: "#E28413"})
            } else {
                historyPath.setStyle({color: "#888888"})
            }


            if (historyPath.options.watched) {
                highlightPath(historyPath)
            }

            if (showAnimation) {
                drawHistoryFlightMarker(historyPath, framesPerAnimation, totalPassengers)
            }

            historyPath.addTo(map)
            historyPath.shadowPath.addTo(map)
            polylines.push(historyPath)
            polylines.push(historyPath.shadowPath)
         } else {
            map.removeLayer(historyPath)
            map.removeLayer(historyPath.shadowPath)
         }
    })
    if (showAnimation) {
        animateHistoryFlightMarkers(framesPerAnimation)
    }

}


