// upda9a4
// https://BiLSrvDev.github.io/BiLESP32_Weather/wsb_app0e32_scr_mas.js
// reverse panelki dlya debug 
// function onMessage(event) with 722
let reconnectAttempts = 0;
let reconnectTimer = null;
const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_DELAY = 1000;
const MAX_DELAY = 10000;
var pmain, sets, maOBJ, canvasOBJ, GuageMeterOBJ;
var CanvGaugeArrT = [];
var CanvGaugeArrP = [];
var CanvGaugeArrH = [];
var CanvGaugeArrOther = [];
var CanvGaugeMap = {};
const REG_T = [1, 2, 5, 6, 3, 4, 7, 9, 8, 10];
const REG_H = [5, 6, 3, 4, 7, 9];
const REG_P = [5, 6, 7, 10];
var cmd_descr = {
  0: "WSB_CMD_RXTX_DATA_TEMPERATURE",
  1: "WSB_CMD_RX_CFG_TEMPERATURE",
  2: "WSB_CMD_RX_CFG_SLAVE",
};
const CMD_MAP = {
  0: "3",		// WSB_CMD_RXTX_DATA_TEMPERATURE
  1: "4",		// WSB_CMD_RXTX_CFG_TEMPERATURE				
  2: "5",		// WSB_CMD_TX_CFG_SLAVE
  3: "6",		// WSB_CMD_RX_RESET_APP
  4: "7",		// WSB_CMD_TX_RESET_SLAVE
  5: "8",		// WSB_CMD_TX_SENS_OFF_SLAVE
  6: "9",		// WSB_CMD_TX_SENS_ON_SLAVE
  7: "10",		// WSB_CMD_NA_SW
  8: "11",		// WSB_CMD_TX_DEBUG_SLAVE				
  9: "12",		// WSB_CMD_TX_DEBUG_OFF_SLAVE
  10: "13",		// WSB_CMD_SETTXRX_CFG_TEMPERATURE
  11: "14",		// WSB_CMD_APP0_UPD
  12: "15",		// WSB_CMD_TX_MAX
};

var httpd_cmd = 
{
	content_type: "application/json",
	command: "0",
	crc16: "ANY"
}
var temp_json = {};
sideset = $(".sideset");
pmain = $(".pmain");

var gateway = 'wss://wsb32.bilymo.netcraze.pro/ws'
var WSsocket;

function setGaugeValue(id, value) {
  const g = CanvGaugeMap[id];
  if (g && typeof value === "number" && isFinite(value)) {
    g.update({ value: value });
  }
}
//var GuageMeter;
function ReconnectWebSocket() 
{
	
if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts = 0;
    return;
}
	//if(WebSocket.readyState == WebSocket.CLOSED)
	//{
	console.log("Reconnect")
	state_online(false);
//WSsocket.close();
	WSsocket = new WebSocket(gateway);
console.log("new WebSocket(gateway) ");
	//}
	return WSsocket;
};

$(function () {
setTimeout(function () {
// 1) сокет с обработчиками
createWebSocket();

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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
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
      CanvGaugeArrT.push(gauge);
      CanvGaugeMap[id] = gauge;
}
	
});
}
catch (e) {
		console.log(e.message);
		//console.log(CanvGaugeArrR);
		return 0;
}

    if (!WSsocket || WSsocket.readyState === WebSocket.CLOSED) {
      createWebSocket();
    }
	}, 1000);
}); 


function ENS_AIQf(value) {
  const $els = $('.ens_AIQ');
  $els.removeClass('bg-success bg-info bg-warning bg-secondary bg-danger').text('');

  switch (Number(value)) {
    case 1: $els.addClass('bg-success').text('ОТЛИЧНО!'); break;
    case 2: $els.addClass('bg-info').text('ХОРОШО!'); break;
    case 3: $els.addClass('bg-warning').text('НЕ ОЧЕНЬ!'); break;
    case 4: $els.addClass('bg-secondary').text('ПЛОХО!'); break;
    case 5: $els.addClass('bg-danger').text('ОПАСНО!'); break;
  }
}


function sub_init()
{
//
    ReconnectWebSocket();
//initWebSocket();
// Initialize GaugeMeter plugin
}

function sendHttpdCmd() {
  if (!WSsocket || WSsocket.readyState !== WebSocket.OPEN) {
    state_online(false);
    ReconnectWebSocket();
    return;
  }

  state_online(true);
  WSsocket.send(JSON.stringify(httpd_cmd));
}

function fsend(aa)
{
	if (CMD_MAP[aa] !== undefined) {
		httpd_cmd.command = CMD_MAP[aa];
	}
	sendHttpdCmd();
}

function frx(aa) {
  if (CMD_MAP[aa] !== undefined) {
    httpd_cmd.command = CMD_MAP[aa];
  }
  sendHttpdCmd();
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

function getReconnectDelay() {
    const exponentialDelay = Math.min(
        BASE_DELAY * Math.pow(2, reconnectAttempts),
        MAX_DELAY
    );
    const jitter = exponentialDelay * Math.random() * 0.3;
    return exponentialDelay + jitter;
}

// Единственная точка создания сокета + назначения обработчиков
function createWebSocket() {
    // аккуратно закрываем старый
    if (WSsocket) {
        try {
            WSsocket.onopen = null;
            WSsocket.onclose = null;
            WSsocket.onmessage = null;
            WSsocket.onerror = null;
            if (WSsocket.readyState === WebSocket.CONNECTING ||
                WSsocket.readyState === WebSocket.OPEN) {
                WSsocket.close();
            }
        } catch (e) { 
			console.warn("cleanup socket:", e); 
		}
    }

    try {
        WSsocket = new WebSocket(gateway);
    } catch (e) {
        console.error("WebSocket create failed:", e);
        scheduleReconnect();
        return null;
    }

    WSsocket.onopen    = onOpen;
    WSsocket.onclose   = onClose;
    WSsocket.onmessage = onMessage;
    WSsocket.onerror   = onError;
    return WSsocket;
}

function scheduleReconnect() {
    if (reconnectTimer) return;                 // уже запланировано
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error("MAX_RECONNECT_ATTEMPTS достигнут");
        state_online(false);
        return;
    }
    const delay = getReconnectDelay();
    console.log(`Переподключение через ${Math.round(delay)} мс (попытка ${reconnectAttempts + 1})`);
    reconnectAttempts++;
    reconnectTimer = setTimeout(function () {
        reconnectTimer = null;
        createWebSocket();
    }, delay);
}

// Совместимость со старым API
function ReconnectWebSocket() {
    if (WSsocket &&
        (WSsocket.readyState === WebSocket.OPEN ||
         WSsocket.readyState === WebSocket.CONNECTING)) {
        return WSsocket;
    }
    if (reconnectTimer) return WSsocket;
    return createWebSocket();
}

// Совместимость: теперь просто синоним создания
function initWebSocket() {
    if (!WSsocket) createWebSocket();
}

function onOpen(event) {
    console.log("ws opened");
    state_online(true);
    reconnectAttempts = 0;
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
}

function onClose(event) {
    console.log(`ws closed: code=${event.code} reason="${event.reason}" clean=${event.wasClean}`);
    state_online(false);
    if (event.code === 1000) return;            // штатное закрытие — не реконнектим
    scheduleReconnect();                         // ← без прямого .close()
}

function onError(event) {
    console.error("ws error", event);
    state_online(false);
    // onClose сам запланирует реконнект. Здесь — только «страховка»
    if (!WSsocket || WSsocket.readyState === WebSocket.CLOSED) {
        scheduleReconnect();
    }
}


//https://kotyara12.ru/iot/bme680/
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
 
//	INPUT WSS MESSAGE

function onMessage(event)
{
  let arrbufcrc = "";
  let REGFAIL = 0;
  let ind = 0, j = 0, cmd = 0, crc16_int = 0;
  let Pdat = 0.0, RMSt = 0.0, RMSh = 0.0, RMSp = 0.0;
  let json_data;
//
//	2.1	Processing 'onMessage'
//
if (!WSsocket || WSsocket.readyState !== WebSocket.OPEN) return;
	console.log(event.data);
	

try {
	json_data = JSON.parse(event.data);
	console.log(json_data);
	} catch (e) {
		console.log(e.message);
		console.log(event.data);
		return 0;
	}

//
//	2.2 Times from mcu
//
if (Array.isArray(json_data.time) && json_data.time.length >= 2)
{
	$('.mcu_tus').text(json_data.time[0].toString());
	$('.ptime').text(json_data.time[1].toString());
}

//	2.3 temp_json["rd_fw"]
//
if (json_data.rd_fw !== undefined && json_data.rd_fw !== null) 
{
cmd=parseInt(json_data.rd_fw.toString(), 10);
    if (!isNaN(cmd)) {
      $.each(cmd_descr, function (index, value) {
        if (cmd === parseInt(index, 10) + 41200) {
          $(".srvmode").text(String(value));
          return false;
        }
      });
    }

    if (String(json_data.rd_fw) === "RD_FW" &&
        Array.isArray(json_data.data) &&
        json_data.data[1] != null &&
        String(json_data.data[1]) !== "NULL") {
      $("#esp_urx").val(String(json_data.data[1]) + "\r\n");
      console.log("ok!");
    }
};
	
//
//	2.4 temp_json["sensors"]
//
if (Array.isArray(json_data.sensor_data) && json_data.sensor_data.length > 0)
{
		//console.log("(json_data[sensor_data])");
//
//	2.4.1 CRC 
//
	//arrbufcrc=json_data.sensor_data.length-1;
	arrbufcrc = json_data.sensor_data.slice(0, -1);
	crc16_int=parseInt(json_data.sensor_data[(json_data.sensor_data.length-1)], 16); 
	//console.log("arrbufcrc"+arrbufcrc);

	if(crc16(arrbufcrc,crc16_int) != true || isNaN(crc16_int) )
	{
		console.log("crc16(arrbufcrc,crc16_int) ERROR! arrbufcrc",arrbufcrc,"crc16_int",crc16_int);
		return 0;
	}	
	//for(i=0;i<json_data.time.length)
	//	{arrbufcrc[i]=json_data.time[i];j++;}
	//for(i=0;i<json_data.time.length)
	//	{arrbufcrc[i]=json_data.time[i];}
	REGFAIL = parseInt(json_data.sensor_data[40],16);
	//
	//	2.3 Scope RMS scope sensor_data
	//
	tmpf = 1.0;
	ind = 0;

	for (j = 0; j <= 9; j++) {
		if ((REGFAIL & (1 << REG_T[j])) === 0) {
			ind++;
			if (parseFloat(json_data.sensor_data[j]) < 0) {
				tmpf = -tmpf;
			}
			RMSt += Math.abs(parseFloat(json_data.sensor_data[j]));
		}
	}
	RMSt = ind ? (RMSt / ind) * tmpf : 0;

	ind = 0;
	for (j = 0; j <= 6; j++) {
		if ((REGFAIL & (1 << REG_H[j])) === 0) {
			ind++;
			RMSh += parseFloat(json_data.sensor_data[j + 10]);
		}
	}
	RMSh = ind ? RMSh / ind : 0;

	ind = 0;
	for (j = 0; j <= 3; j++) {
		if ((REGFAIL & (1 << REG_P[j])) === 0) {
			ind++;
			RMSp += parseFloat(json_data.sensor_data[j + 17]);
		}
	}
	RMSp = ind ? RMSp / ind : 0;

	//console.log($("canvas[data-type='radial-gauge']"));
	//console.log($("canvas[data-type='radial-gauge']").attr("i"));
    $("#lm75_t1_chk").prop("checked", parseInt(json_data.sensor_data[30], 10) !== 0);
    $("#lm75_t2_chk").prop("checked", parseInt(json_data.sensor_data[31], 10) !== 0);
	
	$("#bme280_DEW").val(((parseFloat(json_data.sensor_data[32],10)+parseFloat(json_data.sensor_data[33]))*0.5).toString().substring(0, 7));
	$("#bme280_QNH").val(((parseFloat(json_data.sensor_data[34],10)+parseFloat(json_data.sensor_data[35]))*0.5).toString().substring(0, 7));
	$("#bme280_ALT").val(((parseFloat(json_data.sensor_data[36],10)+parseFloat(json_data.sensor_data[37]))*0.5).toString().substring(0, 7));
	
    //$("#bme280_DEW").val(isFinite(dew) ? dew.toString().substring(0, 7) : "");
    //$("#bme280_QNH").val(isFinite(qnh) ? qnh.toString().substring(0, 7) : "");
    //$("#bme280_ALT").val(isFinite(alt) ? alt.toString().substring(0, 7) : "");
	
ENS_AIQf(parseInt(json_data.sensor_data[24],10));
	
	ind=0;

	$(".progress-bar").each(function(index){
//const classes = String($(this).attr('class') || '').split(/\s+/);
//const txt = classes[2];
		const txt = $(this).attr('class').toString().split(' ')[2];
		const raw = parseInt(json_data.sensor_data[26 + ind], 10);
		if (isNaN(raw)) return;
		const pct = Math.min(100, Math.max(0, Math.round(0.0244 * raw)));
		$('.' + txt).attr("aria-valuenow", raw.toString());
		$('.' + txt).css("width", pct + "%");           // ← добавлен %
		$('#' + txt).text(raw.toString());
		ind++;
	});
console.log("Width "+Math.round((0.0244*parseInt(json_data.sensor_data[26+ind]))).toString()+"val "+parseInt(json_data.sensor_data[26+ind]))
	
	ind=0;
//try {
    $("canvas[data-type='linear-gauge']").each(function () {
      if ($(this).hasClass("canvasT")) {
        const v = parseFloat(json_data.sensor_data[ind]);
        const g = CanvGaugeMap[this.id] || CanvGaugeArrT[ind];
        if (g) g.update({ value: isNaN(v) ? 0 : v });
        ind++;
      }
    });
	
	//console.log(CanvGaugeArrH);
	//console.log(CanvGaugeArrP);
	//console.log(RMSt);
	//console.log(RMSh);
	//console.log(RMSp);
	
	ind=0;
	j = 0;
	$("canvas[data-type='radial-gauge']").each(function(){
      const id = this.id;
      const $this = $(this);

      if (id === "GauAvTemp") setGaugeValue(id, RMSt);
      if (id === "GauAvHum") setGaugeValue(id, RMSh);
      if (id === "GauAvPress") setGaugeValue(id, RMSp);

      if ($this.hasClass("canvasH1")) {
        const v = parseFloat(json_data.sensor_data[ind + 10]);
        setGaugeValue(id, isNaN(v) ? 0 : v);
        ind++;
      }

      if ($this.hasClass("canvasP1")) {
        if (j < CanvGaugeArrP.length) {
          const p = parseFloat(json_data.sensor_data[j + 17]) * 0.750062;
          const pv = isNaN(p) ? 0 : p;
          Pdat = Number(pv.toFixed(2));
          setGaugeValue(id, Pdat);
          j++;
        }
      }

      if (id === "GauAirQ" || id === "bme680_gr") {
        const iaq = rIAQItem_convertValue(
          parseInt(json_data.sensor_data[21], 10),
          parseFloat(json_data.sensor_data[6]),
          parseFloat(json_data.sensor_data[14])
        );

        if (iaq >= 0) setGaugeValue(id, iaq);
      }

      if (id === "ens160_tvoc") {
        const v = parseInt(json_data.sensor_data[22], 10);
        if (!isNaN(v)) setGaugeValue(id, v);
      }

      if (id === "ens160_eco2") {
        const v = parseInt(json_data.sensor_data[23], 10);
        if (!isNaN(v)) setGaugeValue(id, v);
      }

      if (id === "ens160_AIQ") {
        const v = parseInt(json_data.sensor_data[24], 10);
        if (!isNaN(v)) setGaugeValue(id, v);
      }
	});
}
	
};

function ftvall(cl) {
    for (let i = 0; i < maOBJ.length; i++) {
        const nm = maOBJ[i].name;
        if (!nm) continue;                         // ← главное
        const $el = $("#" + nm);
        if (!$el.length) continue;
        $el.val(cl).removeClass("is-invalid is-valid");
    }
}

function state_online(state) 
{
	if(state==true)
	{$(".pst0").removeClass("bg-danger");$(".pst0").addClass("bg-success").text("ОК")}
	else
	{$(".pst0").removeClass("bg-success");$(".pst0").addClass("bg-danger").text("off")};
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
	xhr.timeout = Number(time_out || 30) * 200;
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
    		if (WSsocket.readyState === 1) 
			{
				state_online(true);
				WSsocket.send(JSON.stringify(httpd_cmd));
			}
			else
			{	state_online(false);ReconnectWebSocket();}
		}
}

function rm_b() {
    $(".mc1").removeClass("col-md-8 col-xl-8");
    $(".bsn0").removeClass("col-md-4 col-xl-4");
    $(".mc1").removeClass("noscroll collapse hide");
    $(".mc1").addClass("col-12");                   // ← remove → removeClass
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

rs = setInterval(refr_rtc, 5000);


}
