// upda8a2
// https://BiLSrvDev.github.io/BiLESP32_Weather/wsb_app0e32_scr_mas.js
// reverse panelki dlya debug 

var sideset, pmain, sets, maOBJ, canvasOBJ, GuageMeterOBJ;
var CanvGaugeArrT = [];
var CanvGaugeArrP = [];
var CanvGaugeArrH = [];
var CanvGaugeArrOther = [];

var httpd_cmd = 
{
	content_type: "application/json",
	command: "get_sens",
	crc16: "ANY"
}
var temp_json = {};
sideset = $(".sideset");
pmain = $(".pmain");

var gateway = 'wss://weather32app.bilymo.keenetic.pro/ws'
var WSsocket;
//var GuageMeter;
function ReconnectWebSocket() 
{
	console.log("Reconnect")
	WSsocket = new WebSocket(gateway);
	return WSsocket;
};

$('body').delay(1000).queue(function() {
WSsocket = new WebSocket(gateway);
maOBJ = $('*').get();
unit="";

$("canvas[data-type='linear-gauge']").each(function(index){	
	
    CanvGaugeArrT.push(new LinearGauge({
    renderTo: $( this ).attr('id'),
    width: 100,
    height: 300,
	colorPlate: "black",
	colorUnits: "black",
	colorNeedle: "#222",
	colorNeedleEnd: "",
	colorBar: "#f5f5f5",
	colorTitle: "blue",
    colorPlate: "#ccc",
	colorPlateEnd: "#ccc",
	colorBarStroke: "black",
	borderRadius: "20",
	borders: "true",
	minValue: -50,
	maxValue: 50,
	minorTicks: 11,
	majorTicks: ['-50','-40','-30','-20','-10','0','10','20','30','40','50'],
    colorNumbers: ['cyan','blue','blue','blue','black','black','black','green','green','#CE7E00','red'],
    colorMajorTicks: ['yellow','green','blue','blue','black','black','black','black','black','black','black'],
    fontNumbersSize: "30",
	fontValueSize: "45",
	fontTitleSize: "35",
	fontUnitsSize: "45",
	value: 0,
	units: '°C',
	title: String($(this).attr('id')),
	animationRule: 'elastic',
	animationDuration: 250
}).draw());
});
try
{
$("canvas[data-type='radial-gauge']").each(function(index){	
	
	if($(this).attr('class')=="canvasP1")
	{
	//console.log("Elem "+$(this).attr('id'))
	unit="ммРст"
    CanvGaugeArrP.push(new RadialGauge({
	renderTo: $( this ).attr('id'),
    title: String($(this).attr('id')),
    width: 150,
    height: 150,
    units: unit,
    minValue: 0,
    maxValue: 770,
    majorTicks: [
        "0",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "740",
        "750",
        "760",
        "770"
    ],
    minorTicks: 10,
    strokeTicks: true,
    highlights: [
        {
            "from": 740,
            "to": 760,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
}).draw());
	 }
	
	if($(this).attr('class')=="canvasH1")
	{
	//console.log("Elem "+$(this).attr('id'))
	unit="%"
    CanvGaugeArrH.push(new RadialGauge({
	renderTo: $( this ).attr('id'),
    title: String($(this).attr('id')),
    width: 150,
    height: 150,
    units: unit,
    minValue: 0,
    maxValue: 100,
    majorTicks: [
        "0",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100"
    ],
    minorTicks: 5,
    strokeTicks: true,
    highlights: [
        {
            "from": 60,
            "to": 100,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
	}).draw());
	}

	
if($(this).attr('id')=="GauAvTemp")
{
	//console.log("Elem "+$(this).attr('id'))
	unit=" C"
    CanvGaugeArrOther.push(new RadialGauge({
	renderTo: $( this ).attr('id'),
    title: String($(this).attr('id')),
    width: 150,
    height: 150,
    units: unit,
    minValue: -50,
    maxValue: 50,
	majorTicks:	['-50','-40','-30','-20','-10','0','10','20','30','40','50'],
    minorTicks: 5,
    strokeTicks: true,
    highlights: [
        {
            "from": -50,
            "to": 0,
            "color": "rgba(0,0, 255, .3)"
        },
        {
            "from": 0,
            "to": 50,
            "color": "rgba(255, 0, 0, .3)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
}).draw());
}
	
if($(this).attr('id')=="GauAvHum")
{
	unit = "%";
	//console.log("Elem "+$(this).attr('id'))
    CanvGaugeArrOther.push(new RadialGauge({
	renderTo: $( this ).attr('id'),
    title: String($(this).attr('id')),
    width: 150,
    height: 150,
    units: unit,
    minValue: 0,
    maxValue: 100,
    majorTicks: [
        "0",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100"
    ],
    minorTicks: 5,
    strokeTicks: true,
    highlights: [
        {
            "from": 60,
            "to": 100,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
}).draw());
}
	
	
	
if($(this).attr('id')=="GauAvPress")
{
	unit="ммРст"
    CanvGaugeArrOther.push(new RadialGauge({
	renderTo: $( this ).attr('id'),
    title: String($(this).attr('id')),
    width: 150,
    height: 150,
    units: unit,
    minValue: 0,
    maxValue: 770,
    majorTicks: [
        "0",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "740",
        "750",
        "760",
        "770"
    ],
    minorTicks: 10,
    strokeTicks: true,
    highlights: [
        {
            "from": 740,
            "to": 760,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
}).draw());
}
	
if($(this).attr('id')=="GauAirQ" || $(this).attr('id')=="bme680_gr")
{
	unit = "IAQ";
	//console.log("Elem "+$(this).attr('id'))
    CanvGaugeArrOther.push(new RadialGauge({
	renderTo: $( this ).attr('id'),
    title: String($(this).attr('id')),
    width: 150,
    height: 150,
    units: unit,
    minValue: 0,
    maxValue: 500,
    majorTicks: [
        "0",
        "50",
        "100",
        "150",
		"200",
		"250",
        "300",
		"350",
        "400",
		"450",
        "500",
    ],
    minorTicks: 10,
    strokeTicks: true,
    highlights: [
        {
            "from": 0,
            "to": 50,
            "color": "#00FF00",
        },
		{
            "from": 51,
            "to": 150,
            "color": "#3CB371"
        },
		{
            "from": 101,
            "to": 150,
            "color": "#FFD700"
        },
		{
            "from": 151,
            "to": 200,
            "color": "#FF8C00"
        },
		{
            "from": 201,
            "to": 300,
            "color": "#FF0000"
        },
		{
            "from": 301,
            "to": 500,
            "color": "#8B0000"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
}).draw());
}
	
	
if($(this).attr('id')=="ens160_tvoc") 
{
	unit = "ppb";
	//console.log("Elem "+$(this).attr('id'))
    CanvGaugeArrOther.push(new RadialGauge({
	renderTo: $( this ).attr('id'),
    title: String($(this).attr('id')),
    width: 150,
    height: 150,
    units: unit,
    minValue: 0,
    maxValue: 65000,
    majorTicks: [
        "0",
        "5000",
        "10500",
        "16000",
        "21500",
        "27000",
        "32500",
        "38000",
        "43500",
        "49000",
		"53000",
		"58500",
		"62500",
        "65000"
    ],
    minorTicks: 14,
    strokeTicks: true,
    highlights: [
        {
            "from": 49000,
            "to": 65000,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
}).draw());
}
	
if($(this).attr('id')=="ens160_eco2")
	{
	unit = "ppm";
	//console.log("Elem "+$(this).attr('id'))
    CanvGaugeArrOther.push(new RadialGauge({
	renderTo: $( this ).attr('id'),
    title: String($(this).attr('id')),
    width: 150,
    height: 150,
    units: unit,
    minValue: 400,
    maxValue: 65000,
    majorTicks: [
        "400",
        "5000",
        "10500",
        "16000",
        "21500",
        "27000",
        "32500",
        "38000",
        "43500",
        "49000",
		"53000",
		"58500",
		"62500",
        "65000"
    ],
    minorTicks: 14,
    strokeTicks: true,
    highlights: [
        {
            "from": 49000,
            "to": 65000,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
}).draw());
	}

	
	
if($(this).attr('id')=="ens160_AIQ")
{
	unit = "AQI-UBA";
	//console.log("Elem "+$(this).attr('id'))
    CanvGaugeArrOther.push(new RadialGauge({
	renderTo: $( this ).attr('id'),
    title: String($(this).attr('id')),
    width: 150,
    height: 150,
    units: unit,
    minValue: 0,
    maxValue: 5,
    majorTicks: [
        "0",
        "1",
        "2",
        "3",
		"4",
		"5"
    ],
    minorTicks: 10,
    strokeTicks: true,
    highlights: [
        {
            "from": 0,
            "to": 1,
            "color": "#00FF00",
        },
        {
            "from": 1,
            "to": 2,
            "color": "#3CB371",
        },
		{
            "from": 2,
            "to": 3,
            "color": "#FFD700"
        },
		{
            "from": 3,
            "to": 4,
            "color": "#FF0000"
        },
		{
            "from": 4,
            "to": 5,
            "color": "#8B0000"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
}).draw());
}
	
});
}
catch (e) {
		console.log(e.message);
		//console.log(CanvGaugeArrR);
		return 0;
}

if(WSsocket.readyState!=1)
{
	initWebSocket();
}

}); 

function smgh() {
    if (!device.mobile()) {
        $(".bt0st").click();
    }
}


function sub_init()
{
//
initWebSocket();
ReconnectWebSocket();
// Initialize GaugeMeter plugin
}

function sub_grad(aa)
{
//https://javascriptcompressor.com/
//gaugeArr[1].update({ value: '47' });

					/*$('canvas').attr({value:'51'})
					/$('canvas').attr({width:'100',height:'150'});*/
					
					/*guagelm75_t.attr('data-value','47');guagelm75_t.attr('data-width','100');
					guagelm75_t.attr('data-height','150');
					guagelm75_t.attr('data-value','47');*/
//console.log(WSsocket.readyState);
//rs = setInterval(refr_rtc, 3000);
if(aa==0)
	httpd_cmd.command="get_sens"
	
else if(aa==1)
{
	httpd_cmd.command="upd_fw"
	//url1 = "/get_cmd_srv_io.json?n=" + encodeURIComponent(JSON.stringify(httpd_cmd)) + "&";
	//console.log(url1);
	//fetch1(url1, "GET", TxMAINAJAX, 10);
}
	
else if(aa==2)
{
	httpd_cmd.command="rd_fw"
	//url1 = "/get_cmd_srv_io.json?n=" + encodeURIComponent(JSON.stringify(httpd_cmd)) + "&";
	//console.log(url1);
	//fetch1(url1, "GET", TxMAINAJAX, 10);
}
	
else if(aa==3)
{
	httpd_cmd.command="sw_fw"
	//url1 = "/get_cmd_srv_io.json?n=" + encodeURIComponent(JSON.stringify(httpd_cmd)) + "&";
	//console.log(url1);
	//fetch1(url1, "GET", TxMAINAJAX, 10);
}
	
else if(aa==4)
{
	httpd_cmd.command="get_sens"
	//url1 = "/get_cmd_srv_io.json?n=" + encodeURIComponent(JSON.stringify(httpd_cmd)) + "&";
	//console.log(url1);
	//fetch1(url1, "GET", TxMAINAJAX, 10);
}
	
else if(aa==5)
{
	httpd_cmd.command="cmd1"
	//url1 = "/get_cmd_srv_io.json?n=" + encodeURIComponent(JSON.stringify(httpd_cmd)) + "&";
	//console.log(url1);
	//fetch1(url1, "GET", TxMAINAJAX, 10);
}
	
else if(aa==6)
{
	httpd_cmd.command="cmd2"
	//url1 = "/get_cmd_srv_io.json?n=" + encodeURIComponent(JSON.stringify(httpd_cmd)) + "&";
	//console.log(url1);
	//fetch1(url1, "GET", TxMAINAJAX, 10);
}
	
else if(aa==7)
{
	httpd_cmd.command="cmd3"
	//url1 = "/get_cmd_srv_io.json?n=" + encodeURIComponent(JSON.stringify(httpd_cmd)) + "&";
	//console.log(url1);
	//fetch1(url1, "GET", TxMAINAJAX, 10);
}
	
else if(aa==8)
{
	httpd_cmd.command="cmd4"
	//url1 = "/get_cmd_srv_io.json?n=" + encodeURIComponent(JSON.stringify(httpd_cmd)) + "&";
	//console.log(url1);
	//fetch1(url1, "GET", TxMAINAJAX, 10);
}


if (WSsocket.readyState === 1) {
	WSsocket.send(JSON.stringify(httpd_cmd));
	return;
}
else
{ReconnectWebSocket();}
	
}


// https://learn.javascript.ru/websocket
// event websocket
// event.error
// event.wasClean
//   
// event.code === 1000
// event.reason === "работа закончена"
// event.wasClean === true (закрыто чисто)
//socket.readyState со значениями:
//
//0 – «CONNECTING»: соединение ещё не установлено,
//1 – «OPEN»: обмен данными,
//2 – «CLOSING»: соединение закрывается,
//3 – «CLOSED»: соединение закрыто.

// Make the function wait until the connection is made...
// 
//  waitForSocketConnection(socket, () => {
//        socket.send(action.payload);
 // })
function waitForSocketConnection(socket, callback)
{
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if (callback != null){
                    callback();
                }
            } else {
                console.log("wait for connection...")
                if (callback != null)
					waitForSocketConnection(socket, callback);
            }
        }, 5000); // wait 5 milisecond for the connection...
}


function initWebSocket()
{
	//console.log('Trying to open a WebSocket connection...');
	
	WSsocket.onopen = onOpen;
	WSsocket.onclose = onClose;
	WSsocket.onmessage = onMessage; // add this line
	WSsocket.onerror = onError;
	// socket.isConnected(); // or: socket.isConnected(function(connected) {});
	// socket.listen(function(data) {});
	// socket.remove(listenerCallback);
	// socket.removeAll();
}

function onOpen(event)
{
	//console.log('ws opened');
	state_online(true);
}

function onClose(event)
{
	// wasClean Returns a boolean value that Indicates whether or not the connection was cleanly closed.
	// reason
	// Returns an unsigned short containing the close code sent by the server.
	state_online(false);
	if (event.wasClean) 
	{
        console.log('Соединение закрыто чисто');
	}
	ReconnectWebSocket();
	//waitForSocketConnection(WSsocket, ReconnectWebSocket());
	console.log('ws close');
	WSsocket.close();
}

function onError(event) 
{
	// only event
	if(WSsocket.readyState==2 || WSsocket.readyState==3)
	{
		state_online(false);
		ReconnectWebSocket();
		console.log('ws error'+event);
	}
};
 
//	INPUT WSS MESSAGE

function onMessage(event)
{
arrbufcrc="";
tmpf=0.0;
ind=0,j=0,crc16_int=0;
Pdat=0.0,RMSt=0.0,
RMSh=0.0,RMSp=0.0;
//
//	2.1	Processing 'onMessage'
//
if(WSsocket.readyState==1)
{
	console.log(event.data);
try {
	json_data = JSON.parse(event.data);
	console.log(json_data);
	} catch (e) {
		console.log(e.message);
		console.log(event.data);
		return 0;
	}
}
else
	return 0;
//
//	2.3 Times from mcu
//
	
$('.mcu_tus').text(json_data.time[0].toString());
$('.ptime').text(json_data.time[1].toString());
$(".srvmode").text(json_data.data[0].toString());

//	2.4 temp_json["sensors"]
//
if (json_data["rd_fw"]) 
{

if (String(json_data.rd_fw.toString())==String("RD_FW") && String(json_data.data[1].toString())!=String("NULL")) 
{
	$("#esp_urx").val(String(json_data.data[1])+"\r\n");
	console.log("ok!");
}

};

};



function ftvall(cl) {
    for (i = 0; i < maOBJ.length; i++) {
        $("#" + maOBJ[i].name).val(cl);
        $("#" + maOBJ[i].name)
			.removeClass("is-invalid")
			.html();
        $("#" + maOBJ[i].name)
			.removeClass("is-valid")
			.html();
    }
}

function state_online(state) 
{
	if(state==true)
	{$(".tst0").removeClass("bg-danger");$(".tst0").addClass("bg-success").text("ОК")}
	else
	{$(".tst0").removeClass("bg-success");$(".tst0").addClass("bg-danger").text("off")};
}


function fetch1(url, method, callback, time_out) {
    //console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.onloadend = function () {
        callback(xhr.status, xhr.responseText);
    };
    xhr.ontimeout = function () {
        callback(-1, null);
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Accept", "text/html");
	xhr.responseType = 'json';
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); 
	//xhr.getResponseHeader('Content-Length',url.length);
	// text/plain	;charset=UTF-8
    xhr.timeout = time_out * 200;
    xhr.send();
}

/**
 * 		Peripherial	Functions
*/

/**
 * Calculates the buffers CRC16.
 *
 * @param {Buffer} buffer the data buffer.
 * @return {number} the calculated CRC16.
 * 
 * Source: github.com/yaacov/node-modbus-serial
 */

function crc16(buffer,extcrc) 
{
	var crc = 0xFFFFFFFF;
	var POLY_D = 0x1021
	var i=0,j,n1,k;
	$.each(buffer, function(index, element) {
        for (var j = 0; j < element.length; j++) {
			crc ^= (element.charCodeAt(j) << 8) & 0x0FFFFFFF;//charCodeAt
			crc = (crc & 0x8000 ? (crc << 1) ^ POLY_D : crc << 1) & 0x0FFFFFFF;
		}
	});
    if(crc==extcrc) 
		{return true;}
	else
		{return false;}
};

function refr_rtc() {

		if($('input[name="autmp"]').is(':checked'))
		{
			sub_grad(0);
    		console.log("refr_rtc");
		}
}

function rm_b() {
    // remove deviser HD
    $(".mc1").removeClass("col-md-8 col-xl-8").html();
    $(".bsn0").removeClass("col-md-4 col-xl-4").html();
    $(".mc1").removeClass("noscroll collapse hide");
    $(".mc1").addClass("col-12").html();
}

function sh_b() {
    // deviser HD
    $(".mc1").remove("col-12").html();
    $(".mc1").addClass("col-md-8 col-xl-8").html();
    $(".bsn0").addClass("col-md-4 col-xl-4").html();
}

function rms_b() {
    //$('.bsn0').removeClass('col-12').html();
    $(".bsn0").removeClass("col-12 overlay").html();
    $(".mc1").removeClass("noscroll collapse hide");
}

function shs_b() {
    $(".bsn0").addClass("col-12 overlay").html();
    $(".mc1").addClass("noscroll collapse hide").html();
}


	
window.onload = function () {

$(".bt0st").attr("value", "off");
$(".navia").addClass("list-group-item list-group-item-action bg-light border");
$("#esp_tx").val("wsbuser.prints(node.heap());");
$("#esp_urx").val("");

rs = setInterval(refr_rtc, 2000);


}