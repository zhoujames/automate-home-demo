var Light = {
    
    repaintPanel: function (componentId, data) {
        'use strict';
        var checked = '';
        var domId = AutomatedHome.findDomId(componentId);
        if (data.status === "on") {
            checked = ' checked';
        }
        var body = '<input type="checkbox" id="' + domId + '-checkbox" class="boolean light" onchange=Light.change("'+componentId+'"); ' + checked + '/>';
        body += '<label for="' + domId + '-checkbox" class="boolean">' + data.name + '</label>';
        return body;
    },
    repaintFloorPlan: function (componentId, data) {
        'use strict';
        var roomId = AutomatedHome.findRoomId(componentId);
        var svgId = AutomatedHome.findSvgId(roomId);
        var doc = document.getElementById('home-map').contentDocument;
        var svgElement = doc.getElementById(svgId);
        // adjust the light level by 0.2 due to curtains or lights on/off
        var lightLevel = (svgElement.style.fillOpacity.length > 0) ? parseFloat(svgElement.style.fillOpacity) : 0.5;
        if (data.status === "on") {
            svgElement.style.fillOpacity = lightLevel + 0.5;
        } else {
            svgElement.style.fillOpacity = lightLevel - 0.5;
        }
    },
    add: function (componentId, data) {
        var event = {};
        event.componentId = componentId;
        event.data = data;
        var args = [];
        args.push(event);
        $.publish("light-refresh", args);
    },
    change: function (componentId) {
        var newEvent = {};
        newEvent.componentId = componentId;
        newEvent.data = {};
        if ($('#'+componentId+"-checkbox").is(':checked')){
            newEvent.data.status = "on";
        } else {
            newEvent.data.status = "off";
        }
        $.publish("light-change", newEvent);
    },
    onReady: function () {
        $.subscribe("light-refresh", function () {
            var event = [].slice.call(arguments, 1);
            if (!$("#" + event[0].componentId).length) {
                var lightHtml = Light.repaintPanel(event[0].componentId, event[0].data);
                var roomId = AutomatedHome.findRoomId(event[0].componentId);
                $("#" + roomId).append('<div class="feautre" id="' + event[0].componentId + '">' + lightHtml + '</div>');
            }
            Light.repaintFloorPlan(event[0].componentId, event[0].data);
        });

        $.subscribe("light-change", function () {
            var event = [].slice.call(arguments, 1);
            var newEvent = {};
            newEvent.componentId = event[0].componentId;
            newEvent.data = AutomatedHome.homeData['components']['lights'][newEvent.componentId].data;
            newEvent.data.status = event[0].data.status;
            $.publish("light-refresh", event);
            $.get("data/update.json", function () {
                $("#log").text(("[Light] light " + newEvent.componentId + " is  " + newEvent.data.status+"\n")+$("#log").text());
            }, 'json');
        });

        $.subscribe("light-time-change", function () {
            var event = [].slice.call(arguments, 1);
            var newEvent = {};
            newEvent.componentId = event[0].componentId;
            newEvent.data = AutomatedHome.homeData['components']['lights'][newEvent.componentId].data;
            var time = event[0].time;
            if (time >= newEvent.data.from && time <= newEvent.data.to){
                if (newEvent.data.status != "on"){
                    newEvent.data.status = "on";
                    $.publish("light-refresh", newEvent);
                    $.get("data/update.json", function () {
                        $("#log").text(("[Light] light " + newEvent.componentId + " is  " + newEvent.data.status+"\n")+$("#log").text());
                    }, 'json');
                }
            } else {
                if (newEvent.data.status != "off"){
                    newEvent.data.status = "off";
                    $.publish("light-refresh", newEvent);
                    $.get("data/update.json", function () {
                        $("#log").text(("[Light] light " + newEvent.componentId + " is  " + newEvent.data.status+"\n")+$("#log").text());
                    }, 'json');
                }
            }
           
        });
    }
};