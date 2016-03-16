var pushNotification;

function onDeviceReady() {

    $("#app-status-ul").append('<li>Device ok. Evento ativado.</li>');



    document.addEventListener("backbutton", function(e)
    {
        $("#app-status-ul").append('<li>backbutton clicado.</li>');

        if( $("#home").length > 0)
        {
            // call this to get a new token each time. don't call it to reuse existing token.
            //pushNotification.unregister(successHandler, errorHandler);
            e.preventDefault();
            navigator.app.exitApp();
        }
        else
        {
            navigator.app.backHistory();
        }
    }, false);

    try
    {
        pushNotification = window.plugins.pushNotification;
        $("#app-status-ul").append('<li>Registrando o ' + device.platform + '</li>');
        if (device.platform == 'android' || device.platform == 'Android' ||
            device.platform == 'amazon-fireos' ) {
            pushNotification.register(successHandler, errorHandler, {"senderID":"1009576631068","ecb":"onNotification"});		// required!
        } else {
            pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
        }
    }
    catch(err)
    {
        txt="Um erro ocorreu.\n\n";
        txt+="Descrição do erro: " + err.message + "\n\n";
        alert(txt);
    }
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
        $("#app-status-ul").append('<li>push-notificação: ' + e.alert + '</li>');
        // showing an alert also requires the org.apache.cordova.dialogs plugin
        navigator.notification.alert(e.alert);
    }

    if (e.sound) {
        // playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
        snd.play();
    }

    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotification(e) {
    $("#app-status-ul").append('<li>EVENTO -> RECEBIDO:' + e.event + '</li>');

    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                //Registra o Device Key no maiscafe.blog.br
                RegistraDeviceKey(e.regid);

            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                $("#app-status-ul").append('<li>--NOTIFICAÇÕES IN LINE--' + '</li>');

                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                // playing a sound also requires the org.apache.cordova.media plugin
                var my_media = new Media("/android_asset/www/"+ soundfile);

                my_media.play();
            }
            else
            {	// otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                    $("#app-status-ul").append('<li>--NOTIFICAÇÕES RECEBIDAS--' + '</li>');
                else
                    $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
            }

            $("#app-status-ul").append('<li>MENSAGEM -> MSG: ' + e.payload.message + '</li>');
            //android only
            $("#app-status-ul").append('<li>MENSAGEM -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //amazon-fireos only
            $("#app-status-ul").append('<li>MENSAGEM -> TIMESTAMP: ' + e.payload.timeStamp + '</li>');
            break;

        case 'error':
            $("#app-status-ul").append('<li>ERRO -> MSG:' + e.msg + '</li>');
            break;

        default:
            $("#app-status-ul").append('<li>EVENTO -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

function tokenHandler (result) {
    $("#app-status-ul").append('<li>token: '+ result +'</li>');
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler (result) {
    $("#app-status-ul").append('<li>sucesso:'+ result +'</li>');
}

function errorHandler (error) {
    $("#app-status-ul").append('<li>erro:'+ error +'</li>');
}


document.addEventListener('deviceready', onDeviceReady, true);




//Registra Device Key

function RegistraDeviceKey(devicekey){

    //http://app.maiscafe.blog.br/devicekey/json.php

    $.ajax({
        dataType: "json",
        type: "POST",
        data: {
            key:                devicekey,
            deviceModel:        device.model ,
            devicePhonegap:     device.cordova,
            devicePlatform:     device.platform,
            deviceUUID:         device.uuid,
            deviceVersion:      device.version
        },
        url:'http://app.maiscafe.blog.br/devicekey/json.php',
        success: function(result){

            //alert("Status: " +  result.status +  "\r\n Erro:" + result.erro);

        }
    });
}