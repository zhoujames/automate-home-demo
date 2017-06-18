var AutomatedHome = {

    homeData: {},

    onReady: function (file) {
        'use strict';
        $.get(file, function (data) {
            AutomatedHome.homeData['components'] = data['components'];
            AutomatedHome.homeData['floor-plan'] = data['floor-plan'];
            $.each(AutomatedHome.homeData['components']['lights'], function (key, val) {
                Light.add(key, val.data);
            });
            $.each(AutomatedHome.homeData['components']['curtains'], function (key, val) {
                Curtain.add(key, val.data);
            });
            $.each(AutomatedHome.homeData['components']['heatings'], function (key, val) {
                Heating.add(key, val.data);
            });
        }, 'json');
        Light.onReady();
        Curtain.onReady();
        Heating.onReady();
    },
    findDomId:function (componentId) {
       for (component in AutomatedHome.homeData['components']){
            if (AutomatedHome.homeData['components'][component][componentId]){
                return AutomatedHome.homeData['components'][component][componentId].data['domId'];
            }
       }
    },
    findSvgId:function (roomId) {
       return AutomatedHome.homeData['floor-plan'][roomId]['svgId'];
    },
    findRoomId:function (componentId) {
        for (room in AutomatedHome.homeData['floor-plan']) {
            if ($.inArray(componentId, AutomatedHome.homeData['floor-plan'][room]['components']) >=0){
                return room;
            }

        }
    },
    emulate : function () {
        if (emulateState === "on") {
            emulateState = "off";
            $("#emulate").text("Start emulating");
            clearInterval(intervalId);
        } else {
            emulateState = "on";
            $("#emulate").text("Stop emulating");
            intervalId = setInterval(function() {
                var hour = $("#hour").text();
                var hour = (parseInt(hour)+1)%24;
                $("#hour").text(hour);
                $("#log").text(("[Emulation] Set Hour to "+hour +"\n")+$("#log").text());
                $(".light").each(function(){
                    var newEvent = {};
                    var id = $(this).attr("id");
                    newEvent.componentId = id.substring(0,id.length-9);
                    newEvent.time = hour;
                    $.publish("light-time-change", newEvent);
                });
            }, 2000);
        }
    }
};
var emulateState="off";
var intervalId;

/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */

(function($) {

    var o = $({});

    $.subscribe = function() {
        o.on.apply(o, arguments);
    };

    $.unsubscribe = function() {
        o.off.apply(o, arguments);
    };

    $.publish = function() {
        o.trigger.apply(o, arguments);
    };

}(jQuery));