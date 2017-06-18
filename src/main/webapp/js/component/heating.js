var Heating = {
    repaintPanel: function (componentId, data) {
        'use strict';
        var domId = AutomatedHome.findDomId(componentId);
        var body = '<label for="' + domId + '" class="integer"> Temperature </label>';
        body += '<input type="number" class="integer" min="' + data.min + '" max="' + data.max + '" ';
        body += 'id="' + domId + '-number" value="' + data.current + '" onchange=Heating.change("'+componentId+'");  /><span class="units">&#8451</span>';
        return body;
    },
    repaintFloorPlan: function (componentId, data) {
        'use strict';
    },
    add: function (componentId, data) {
        var event = {};
        event.componentId = componentId;
        event.data = data;
        var args = [];
        args.push(event);
        $.publish("heating-refresh", args);
    },
    change: function (componentId) {
        var newEvent = {};
        newEvent.componentId = componentId;
        newEvent.data = {};
        newEvent.data.current = $('#'+componentId+"-number").val();
        $.publish("heating-change", newEvent);
    },
    onReady: function () {
        $.subscribe("heating-refresh", function () {
            var event = [].slice.call(arguments, 1);
            if (!$("#" + event[0].componentId).length) {
                var content = Heating.repaintPanel(event[0].componentId, event[0].data);
                var roomId = AutomatedHome.findRoomId(event[0].componentId);
                $("#" + roomId).append('<div class="feautre" id="' + event[0].componentId + '">' + content + '</div>');
            }
            Heating.repaintFloorPlan(event[0].componentId, event[0].data);
        });
        $.subscribe("heating-change", function () {
            var event = [].slice.call(arguments, 1);
            var newEvent = {};
            newEvent.componentId = event[0].componentId;
            newEvent.data = AutomatedHome.homeData['components']['heatings'][newEvent.componentId].data;
            newEvent.data.current = event[0].data.current;
            $.publish("Heating-refresh", event);
            $.get("data/update.json", function () {
                $("#log").text(("[Heating] Change Temperature of " + newEvent.componentId + " to  " + newEvent.data.current+"\n")+$("#log").text());
            }, 'json');
        });
    }
};