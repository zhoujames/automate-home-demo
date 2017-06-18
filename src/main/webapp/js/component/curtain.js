var Curtain = {
    repaintPanel: function (componentId, data) {
        'use strict';
        var checked = '';
        var domId = AutomatedHome.findDomId(componentId);
        if (data.status === "open") {
            checked = ' checked';
        }
        var body = '<input type="checkbox" id="' + domId + '-checkbox" class="boolean curtain" onchange=Curtain.change("'+componentId+'"); ' + checked + '/>';
        body += '<label for="' + domId + '-checkbox" class="boolean">' + data.name + '</label>';
        return body;
    },
    repaintFloorPlan: function (componentId, data) {
        'use strict';
        var roomId = AutomatedHome.findRoomId(componentId);
        var svgId = AutomatedHome.findSvgId(roomId);
        var doc = document.getElementById('home-map').contentDocument;
        var svgElement = doc.getElementById(svgId);
        if (data.status === "open") {
            // svgElement.style.strokeWidth = "solid";
            svgElement.style.stroke="green"
            svgElement.style.strokeWidth = 3;
        } else {
            // svgElement.style.borderStyle = "none";
            svgElement.style.strokeWidth = 0;
        }
    },
    add: function (componentId, data) {
        var event = {};
        event.componentId = componentId;
        event.data = data;
        var args = [];
        args.push(event);
        $.publish("curtain-refresh", args);
    },
    change: function (componentId) {
        var newEvent = {};
        newEvent.componentId = componentId;
        newEvent.data = {};
        if ($('#'+componentId+"-checkbox").is(':checked')){
            newEvent.data.status = "open";
        } else {
            newEvent.data.status = "closed";
        }
        $.publish("curtain-change", newEvent);
    },
    onReady: function () {
        $.subscribe("curtain-refresh", function () {
            var event = [].slice.call(arguments, 1);
            if (!$("#" + event[0].componentId).length) {
                var curtainHtml = Curtain.repaintPanel(event[0].componentId, event[0].data);
                var roomId = AutomatedHome.findRoomId(event[0].componentId);
                $("#" + roomId).append('<div class="feautre" id="' + event[0].componentId + '">' + curtainHtml + '</div>');
            }
            Curtain.repaintFloorPlan(event[0].componentId, event[0].data);
        });
        $.subscribe("curtain-change", function () {
            var event = [].slice.call(arguments, 1);
            var newEvent = {};
            newEvent.componentId = event[0].componentId;
            newEvent.data = AutomatedHome.homeData['components']['curtains'][newEvent.componentId].data;
            newEvent.data.status = event[0].data.status;
            $.publish("curtain-refresh", event);
            $.get("data/update.json", function () {
                //alert("curtain " + newEvent.componentId + " is  " + newEvent.data.status);
                $("#log").text(("[Curtain] curtain " + newEvent.componentId + " is  " + newEvent.data.status+"\n")+$("#log").text());
            }, 'json');
        });
    }
}