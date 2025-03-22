// upda7a2
// https://bilsrv.github.io/WSBSrvWeatherPub/wsb_script_2_2_2.js
// reverse panelki dlya debug 
var sds, mds, sets, maOBJ, canvasOBJ, GuageMeterOBJ;

var httpd_cmd = 
{
	content_type: "application/json",
	command: "get_sens",
	crc16: "ANY"
}

var temp_json = {};
sds = $(".sideset");
mds = $(".macnt");
sets = $(".setcnt");
cnftmp = $(".scntf");
	
var CanvGaugeArrT = [];
var CanvGaugeArrP = [];
var CanvGaugeArrH = [];
var CanvGaugeArrOther = [];
	
//$(document).ready(function() {  
var gateway = 'wss://wtest32.bilymo.keenetic.pro/ws'
//var gateway = 'wss://192.168.1.48/ws'
/*
var gateway = 
{
		//gw:'wss://wsb.bilymo.keenetic.pro/ws',
		gw:'ws://wsb.bilymo.keenetic.pro/ws',
		timeout:2000,
		attempts: 60,		
		dataType: 'json',
		protocol:''
};
*/
var WSsocket;
var GuageMeter;

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
	// var arr = new Uint32Array(1);
    //crc[1] = 0xFFFF;
	var POLY_D = 0x1021
	var i=0,j,n1,k;
	//var str="";
	/*$(buffer).each((index, element) => {
        console.log(`current index : ${index} element : ${element}`)
    });*/
	
	$.each(buffer, function(index, element) {
  		//console.log(index, element);
		//str=buffer[index];
		//console.log('puu '+buffer[index]);
		//crc = 0xFFFFFFFF;
        for (var j = 0; j < element.length; j++) {
			crc ^= (element.charCodeAt(j) << 8) & 0x0FFFFFFF;//charCodeAt
			crc = (crc & 0x8000 ? (crc << 1) ^ POLY_D : crc << 1) & 0x0FFFFFFF;
		}
			//console.log('crc ^=  '+crc.toString(16));
			//for (k = 0; k < 8; k++)
            	//crc = (crc & 0x8000 ? (crc << 1) ^ POLY_D : crc << 1) & 0x0FFFFFFF;
		
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
	 //if (subwdeb == false && $("#autmp").prop("checked")) {
        //fetch("/get_rtc.json?n=" + Math.random(), "GET", txjstmp, 30);
	//}
}


function rIAQItem_convertValue(rawValue,_temp,_humd)
{
  // Get temperature & humidity
	_hum_ratio = 0.09;
	_min_T=0;
	_min_U=500;
	_max_T=1600000;
	_max_U=0;
	
 // Compensate exponential impact of humidity on resistance
  if (!isNaN(_temp) && !isNaN(_humd)) {
    // Calculate stauration density and absolute humidity
    // double hum_abs = _humd * 10 * ((6.112 * 100.0 * exp((17.67 * _temp)/(243.12 + _temp)))/(461.52 * (_temp + 273.15)));
    hum_abs = 6.112 * Math.exp((17.67 * _temp)/(_temp + 243.5)) * _humd * 2.1674 / (273.15 + _temp);
    // Calculate the compensated value
    comp_gas = rawValue * Math.exp(_hum_ratio * hum_abs);
	//console.log("IAQ T"+_temp+"IAQ H"+_humd+"IAQ adc"+rawValue)
	  // (comp_gas-_min_T)/(_max_T-_min_T)*(_max_U-_min_U)+_min_U
	IAQ=Math.abs(_min_U+(comp_gas-_min_T)/(_max_T-_min_T)*(_max_U-_min_U));
    // Recalculation in IAQ from 0 to 500 with inversion
    return IAQ;
  };
	return -1;
}

function ReconnectWebSocket() 
{
	console.log("Reconnect")
	WSsocket = new WebSocket(gateway);
	return WSsocket;
};



$('body').delay(500).queue(function() {
WSsocket = new WebSocket(gateway);
    //$(this).load('myPage.php');
	maOBJ = $('*').get();
	unit="";
	tmpi=0;
//console.log("mainOBJ"+maOBJ);
// Canvas .each Default Settings 
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
//console.log("CanvGaugeArrOther "+CanvGaugeArrOther);
	
//console.log( String($(this).attr('id')) + ": " + $( this ).text() + $( this ).attr('id')+ " " );    units: '°C',	colorPlateEnd: "#327ac0",

if(WSsocket.readyState!=1)
{
	initWebSocket();
}

}); 


function sdmc_sh() {
    mds.removeClass("collapse show");
    mds.addClass("collapse hide");
    sds.removeClass("collapse hide");
    sds.addClass("collapse show");
    sets.removeClass("collapse hide");
    sets.addClass("collapse show");
}

function sdmc_rm() {
    mds.removeClass("collapse hide");
    mds.addClass("collapse show");
    sds.removeClass("collapse show");
    sds.addClass("collapse hide");
    sets.removeClass("collapse show");
    sets.addClass("collapse hide");
}

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

function ftmpd() {
    for (i = 0; i < maOBJ.length; i++) {
        $("#" + maOBJ[i].name)
			.removeClass("is-invalid")
			.html();
        $("#" + maOBJ[i].name)
			.removeClass("is-valid")
			.html();
    }
}

function spt0() {
    var lines = $("#esp_tx")
		.val()
		.replace(/^[\n]+$/g, "")
		.replace(/"/g, "\\\"")
		.split(/[\n]+/);
    return lines;
}

function smgh() {
    if (!device.mobile()) {
        $(".bt0st").click();
    }
}

// MENU - dublirovanmie
$(".bt0st1").click(function bjst1() {
    $(".bt0st").click();
});

function erxclr_uart() {
    $("#esp_tx").val("");
}

function etxclr_uart() {
    $("#esp_urx").val("");
    str_out1 = "";
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

function sub_init()
{
//
//https://javascriptcompressor.com/
//gaugeArr[1].update({ value: '47' });

					/*$('canvas').attr({value:'51'})
					/$('canvas').attr({width:'100',height:'150'});*/
					
					/*guagelm75_t.attr('data-value','47');guagelm75_t.attr('data-width','100');
					guagelm75_t.attr('data-height','150');
					guagelm75_t.attr('data-value','47');*/

//rs = setInterval(refr_rtc, 3000);
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

if (WSsocket.readyState === 1) {
	WSsocket.send(JSON.stringify(httpd_cmd));
	return;
}
else
{ReconnectWebSocket();}
	
}




function txjs_ua(s, d) 
{

    $("#btn1").prop("disabled", false);
    if (s != 200) {
        str_out1 += "Send command error" + "\n";
        clearTimeout(rs.handle);
        //console.log("Connection proplem!");
    } 
	else if (typeof d === "string") 
	{
            console.log("priem ok!");
            try {
                uart_json = JSON.parse(d);
            } catch (e) {
                //console.log(e);
                return -1;
            }
        } else {
            uart_json.uart_out = "null";
        }
	
if (uart_json["uart_out"]) 
{
	    //console.log(uart_json);
        if (uart_json.uart_out == "") {
            str_out1 += "ACK" + "\n";
        } else {
            str_out1 += uart_json.uart_out + "\n";
        }
 var esp_uart_out_val = $("#esp_urx");
	
    if (esp_uart_out_val.val() != "") {
        esp_uart_out_val.val(esp_uart_out_val.val() + str_out1);
    } else {
        esp_uart_out_val.val(str_out1);
    }
	return 0;
    //console.log(str_out1);
    str_out1 = "";
    //clearTimeout(rs.handle);
    //rs = to(refr, 3);
    //refr();
}
}

function submit_uart() {
    $("#btn1").prop("disabled", true);
    // spt0 - preobrazovanie ot mysora na UART
    lines_in = spt0();
    url = "";
    httpd_cmd.data = "null";

    if ($("#uart_get_ch").prop("checked")) {
        ua_mode = 1;
    } else {
        ua_mode = 0;
    }
	httpd_cmd.command = "get_uart";
    for (i = 0; i < lines_in.length; i++) {
        httpd_cmd.data = lines_in[i];
		if(txjs_ua(httpd_cmd.data)==-1)
			{return -1;}
		//if (WSsocket.readyState === 1) {
		//	WSsocket.send(JSON.stringify(httpd_cmd));
        if (ua_mode == 1) {
            fetch("/uart_get?input=" + encodeURIComponent(lines_in[i]) + "&", "GET", txjs_ua, 10);
        } else {
            fetch("/uart.json?n=" + encodeURIComponent(JSON.stringify(httpd_cmd)) + "&", "GET", txjs_ua, 10);
		}
}
        //if (ua_mode == 1) {
        //     fetch("/uart_get?input=" + encodeURIComponent(lines_in[i]) + "&", "GET", txjs_ua, 10);
        //} else {
        //    fetch("/uart.json?n=" + encodeURIComponent(JSON.stringify(uart_json)) + "&", "GET", txjs_ua, 10);
        //}
	return 0;
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
        }, 500); // wait 5 milisecond for the connection...
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
 

function onMessage(event)
{
arrbufcrc="";
tmpf=0.0;
ind=0,j=0,crc16_int=0;
Pdat=0.0,RMSt=0.0,
RMSh=0.0,RMSp=0.0;
	
//canvasOBJ = $( ".canvasT" ).get();

//
//	2.1	Processing 'onMessage'
//
//console.log("onMessage"+event.data);
if(WSsocket.readyState==1)
{
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


//
//	2.4 temp_json["sensors"]
//
if (json_data["sensors"]) 
{ 

//
//	2.1 CRC
//
if (json_data["crc16"]) 
{
	arrbufcrc=[].concat(json_data.sensors).concat(json_data.time);
	crc16_int=parseInt(json_data.crc16, 16);
	//console.log("crc16_int"+crc16_int);

	if(crc16(arrbufcrc,crc16_int) != true || isNaN(crc16_int) )
	{
		console.log("crc16(arrbufcrc,crc16_int) ERROR! arrbufcrc",arrbufcrc,"crc16_int",crc16_int);
		return 0;
	}	
	//for(i=0;i<json_data.time.length)
	//	{arrbufcrc[i]=json_data.time[i];j++;}
	//for(i=0;i<json_data.time.length)
	//	{arrbufcrc[i]=json_data.time[i];}
}
else
{return 0;}
	
	//
	//	2.3 Scope RMS scope sensors
	//
	tmpf=1.0;
	for(j=0;j<=9;j++)
	{
		if(parseFloat(json_data.sensors[j])<0)
			tmpf=tmpf*(-1);
	RMSt+=Math.abs(parseFloat(json_data.sensors[j]))
	}
	RMSt=RMSt*0.1*tmpf;
	for(j=0;j<=6;j++)
	{
	RMSh+=parseFloat(json_data.sensors[j+10])
		//console.log(RMSh)
	}
	RMSh=RMSh*0.14286;
	for(j=0;j<=3;j++)
	{
	RMSp+=parseFloat(json_data.sensors[j+17])
	}
	RMSp=RMSp*0.25;

	//console.log($("canvas[data-type='radial-gauge']"));
	//console.log($("canvas[data-type='radial-gauge']").attr("i"));
	if(parseInt(json_data.sensors[30],10))
		$("#lm75_t1_chk").prop("checked", true);
	else
		$("#lm75_t1_chk").prop("checked", false);
	if(parseInt(json_data.sensors[31],10))
		$("#lm75_t2_chk").prop("checked", true);
	else
		$("#lm75_t2_chk").prop("checked", false);
	
	$("#bme280_DEW").val(((parseFloat(json_data.sensors[32],10)+parseFloat(json_data.sensors[33]))*0.5).toString().substring(0, 7));
	$("#bme280_QNH").val(((parseFloat(json_data.sensors[34],10)+parseFloat(json_data.sensors[35]))*0.5).toString().substring(0, 7));
	$("#bme280_ALT").val(((parseFloat(json_data.sensors[36],10)+parseFloat(json_data.sensors[37]))*0.5).toString().substring(0, 7));
	
	ENS_AIQf(parseInt(json_data.sensors[24],10));
	
	ind=0;

	$(".progress-bar").each(function(index){
		//$ = jQuery.noConflict();
		txt=$(this).attr('class').toString().split(' ')[2];
		$('.'+txt).attr("aria-valuenow",parseInt(json_data.sensors[26+ind],10).toString());
		$('.'+txt).attr("aria-valuenow",parseInt(json_data.sensors[26+ind],10).toString());
		$('.'+txt).css("width", Math.round((0.0244*parseInt(json_data.sensors[26+ind],10))).toString());
		$('#'+txt).text(parseInt(json_data.sensors[26+ind],10).toString());
		ind++
	});
console.log("Width "+Math.round((0.0244*parseInt(json_data.sensors[26+ind]))).toString()+"val "+parseInt(json_data.sensors[26+ind]))
	
	ind=0;
//try {
	$("canvas[data-type='linear-gauge']").each(function(index){

		if($(this).attr('class')=="canvasT")
		{
		CanvGaugeArrT[ind].update({ value: parseFloat(json_data.sensors[ind]) });
		ind++;
		//if(index>8)
		//{return false;}
		}
	});
	
	//console.log(CanvGaugeArrH);
	//console.log(CanvGaugeArrP);
	//console.log(RMSt);
	//console.log(RMSh);
	//console.log(RMSp);
	
	ind=0;j=0;
	$("canvas[data-type='radial-gauge']").each(function(index){
		if($(this).attr('id')=="GauAvTemp")
		{
			//if(index>6)
			//	return false;
			
			CanvGaugeArrOther[0].update({ value: RMSt});
		}
		if($(this).attr('id')=="GauAvHum")
		{
			//if(index>6)
			//	return false;
			
			CanvGaugeArrOther[1].update({ value: RMSh});
		}
		if($(this).attr('id')=="GauAvPress")
		{
			//if(index>6)
			//	return false;
			
			CanvGaugeArrOther[2].update({ value: RMSp});
		}
		
		if($(this).attr('class')=="canvasH1")
		{
			//if(index>6)
			//	return false;
			//console.log(CanvGaugeArrH[ind]," indH ",ind," class ",$(this).attr('class'));
			CanvGaugeArrH[ind].update({ value: parseFloat(json_data.sensors[ind+10])});
			ind++;
		}
		
		if($(this).attr('class')=="canvasP1")
		{
			//console.log(CanvGaugeArrP[ind]," indP ",ind," class ",$(this).attr('class'));
			//console.log(" Pdat "+Pdat+" jd_sens "+json_data.sensors[j+17]);
			Pdat = (parseFloat(json_data.sensors[j+17])*0.750062).toFixed(2);
			CanvGaugeArrP[j].update({ value: (parseFloat(json_data.sensors[j+17])*0.750062).toFixed(2)});
			j++;
		}
		
		if($(this).attr('id')=="GauAirQ")
		{
			//console.log(" iaq "+rIAQItem_convertValue(parseInt(json_data.sensors[21],10),parseFloat(json_data.sensors[6]),parseFloat(json_data.sensors[14])));
			
			CanvGaugeArrOther[3].update({ value: rIAQItem_convertValue(parseInt(json_data.sensors[21],10),parseFloat(json_data.sensors[6]),parseFloat(json_data.sensors[14])) });
		}
		if($(this).attr('id')=="bme680_gr")
		{
			//console.log(" iaq "+rIAQItem_convertValue(parseInt(json_data.sensors[21],10),parseFloat(json_data.sensors[6]),parseFloat(json_data.sensors[14])));
			CanvGaugeArrOther[4].update({ value: rIAQItem_convertValue(parseInt(json_data.sensors[21],10),parseFloat(json_data.sensors[6]),parseFloat(json_data.sensors[14])) });
		}
			
		if($(this).attr('id')=="ens160_tvoc")
		{
			CanvGaugeArrOther[5].update({ value: parseInt(json_data.sensors[22],10) });
		}
			
		if($(this).attr('id')=="ens160_eco2")
		{
			CanvGaugeArrOther[6].update({ value: parseInt(json_data.sensors[23],10)});
		}
			
		if($(this).attr('id')=="ens160_AIQ")
		{
			CanvGaugeArrOther[7].update({ value: parseInt(json_data.sensors[24],10)});
		}
	});
}
	

//
//	2.4 temp_json["sensors"]
//
if (json_data["rd_fw"]) 
{
if (String(json_data.rd_fw[0].toString())==String("RD_FW") && String(json_data.data[1].toString())!=String("NULL")) 
{
	$("#esp_urx").val(json_data.data[1].toString()+"\r\n");
	console.log("ok!");
}
	
};
}


// cont: TEMP, RTC, DEBUG + Settings
function TxMAINAJAX(s, d) 
{
    if (s != 200) {
        console.log("Connection proplem!");
        return 0;
        //clearTimeout(rs.handle);
    } else {

        if (typeof d === "string") {
            console.log(d);
            try {
                temp_json = JSON.parse(d);
            } catch (e) {
				console.log(s, e);
                return 0;
            }
        } else {
            //console.log("d not string");
            ftvall("");
            return 0;
        }
    }
	
    if (temp_json["upd_fw"]) {
	    $("#esp_urx").val(temp_json["data"].toString());
		return;
	}
	console.log("Invaild cmd");
            
}

// cont: TEMP, RTC, DEBUG + Settings
function TxMAINAJAX(s, d) {
    var as1 = $(".pst1");
    var as0 = $(".pst0");
//    console.log(d);
    if (s != 200) {
        as0.removeClass("badge-success");
        as0.addClass("badge-danger");
        as0.text("Нет связи");
        as1.removeClass("badge-success");
        as1.addClass("badge-danger");
        as1.text("Нет связи");
        $(".swdeb").removeAttr("disabled");
        ftmpd();
        console.log(" TxMAINAJAX(s, d) Connection proplem!");
        return 0;
        //clearTimeout(rs.handle);
    } else {
        as0.removeClass("badge-danger");
        as1.removeClass("badge-danger");
        as0.addClass("badge-success");
        as1.addClass("badge-success");
        as0.text("ОК");
        if (typeof d === "string") {
            console.log(d);
            try {
                temp_json = JSON.parse(d);
                //console.log(s, temp_json);
            } catch (e) {
                // ftvall - form clear
                ftvall("");
                //console.log(s, e.message);
                return 0;
            }
        } else {
            //console.log("d not string");
            ftvall("");
            return 0;
        }
    }
	j=1;ii=0;
	console.log("temp_json[temp])");

}

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

function ENS_AIQf(value) 
{
  	$('.ens_AIQ').last().removeClass(function() {
    	return $( this ).prev().attr("class");
  	});
	$(".ens_AIQ").text("");
	switch (value)
		{
		case 1:
			$(".ens_AIQ").addClass("bg-success").text("ОТЛИЧНО!");
			break;
		case 2:
			$(".ens_AIQ").addClass("bg-info").text("ХОРОШО!");
			break;
		case 3:
			$(".ens_AIQ").addClass("bg-warning").text("НЕ ОЧЕНЬ!");
			break;
		case 4:
			$(".ens_AIQ").addClass("bg-secondary").text("ПЛОХО!");
			break;
		case 5:
			$(".ens_AIQ").addClass("bg-danger").text("ОПАСНО!");
			break;	
		default:
			break;
		}
		//default:
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



	
window.onload = function () {


	
$(".bt0st").attr("value", "off");
$(".navia").addClass("list-group-item list-group-item-action bg-light border");
$("#esp_tx").val("wsbuser.prints(node.heap());");
$("#esp_urx").val("");

rs = setInterval(refr_rtc, 3000);


}