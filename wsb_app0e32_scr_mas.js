// upda1a
// https://BiLSrvDev.github.io/BiLESP32_Weather/wsb_app0e32_scr_mas.js
// reverse panelki dlya debug 
// function onMessage(event) with 722

/* ==========================================================================
 *  1. Configuration
 * ========================================================================== */
const WS_GATEWAY       = 'wss://weather32app.bilymo.keenetic.pro/ws';
const REFRESH_INTERVAL = 2000;   // ms — automatic sensor poll
const RECONNECT_DELAY  = 1000;   // ms — WebSocket retry backoff

const SENSOR_REQUEST = Object.freeze({
    content_type: 'application/json',
    command:      'get_sens',
    crc16:        'ANY',
});


var CMD_DESCRIPTIONS = {
  0: "WSB_CMD_TXRX_DEFAULT",
  1: "WSB_CMD_TXRX_DATA_TEMPERATURE",
  2: "WSB_CMD_TX_CFG_TEMPERATURE",
  3: "WSB_CMD_RX_CFG_TEMPERATURE",
  4: "WSB_CMD_RX_CFG_SLAVE",
  5: "WSB_CMD_TX_CFG_SLAVE",
  6: "WSB_CMD_GET_KEY",
  7: "WSB_CMD_TX_MAX"
};
const CMD_MAP = {
  0: "1",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "sw_fw",
  9: "upd_fw",
  10: "rd_fw"
};

// Physical constants and sensor layout
const PRESSURE_PA_TO_MMHG = 0.750062;
const TEMP_SENSOR_COUNT   = 10;
const HUM_SENSOR_COUNT    = 7;
const PRESS_SENSOR_COUNT  = 4;
const CRC_INDEX           = 42;

/* ---- Gauge configuration factories --------------------------------------- */

const RADIAL_GAUGE_BASE = Object.freeze({
    width:              150,
    height:             150,
    strokeTicks:        true,
    colorPlate:         '#fff',
    borderShadowWidth:  0,
    borders:            false,
    needleType:         'arrow',
    needleWidth:        2,
    needleCircleSize:   7,
    needleCircleOuter:  true,
    needleCircleInner:  false,
    animationDuration:  1500,
    animationRule:      'linear',
});

/* ==========================================================================
 *  2. Runtime state
 * ========================================================================== */

let socket     = null;
let formFields = [];

const gauges = {
    linear:   [],   // LinearGauge — temperature strips
    humidity: [],   // RadialGauge — % humidity
    pressure: [],   // RadialGauge — mm Hg
    byId:     {},   // DOM id -> RadialGauge (averages, air quality, TVOC …)
};

/* ==========================================================================
 *  3. Bootstrap
 * ========================================================================== */

$(function () {
    $('#esp_tx').val('wsbuser.prints(node.heap());');
    $('#esp_urx').val('');
    $('.bt0st').attr('value', 'off');
    $('.navia').addClass('list-group-item list-group-item-action bg-light border');

    formFields = $('*').get();

    setTimeout(start, 1000);
});


function start() {
    connectSocket();
    createGauges();
    setInterval(refreshSensorData, REFRESH_INTERVAL);
}

/* ==========================================================================
 *  4. WebSocket plumbing
 * ========================================================================== */

function connectSocket() {
    if (socket &&
        (socket.readyState === WebSocket.OPEN ||
         socket.readyState === WebSocket.CONNECTING)) {
        return;
    }
    socket = new WebSocket(WS_GATEWAY);
    socket.addEventListener('open',    handleSocketOpen);
    socket.addEventListener('close',   handleSocketClose);
    socket.addEventListener('error',   handleSocketError);
    socket.addEventListener('message', handleSocketMessage);
}

function scheduleReconnect() {
    setTimeout(connectSocket, RECONNECT_DELAY);
}

function handleSocketOpen() {
    setOnlineState(true);
}

function handleSocketClose(event) {
    setOnlineState(false);
    console.log(event.wasClean ? 'WebSocket closed cleanly'
                               : 'WebSocket closed unexpectedly');
    scheduleReconnect();
}

function handleSocketError(event) {
    // The 'close' event will fire after this and handle reconnection.
    console.error('WebSocket error', event);
}

/* ==========================================================================
 *  5. Outgoing commands
 * ========================================================================== */

function sendSensorCommand() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        setOnlineState(false);
        scheduleReconnect();
        return;
    }
    setOnlineState(true);
    socket.send(JSON.stringify(SENSOR_REQUEST));
}

function refreshSensorData() {
    if ($('input[name="autmp"]').is(':checked')) {
        sendSensorCommand();
    }
}

/**
 * Send an arbitrary command code (used by UI controls).
 * Maps the numeric code through CMD_MAP before sending.
 */
function sub_grad(code) {
    if (CMD_MAP[code] !== undefined) {
        SENSOR_REQUEST.command = CMD_MAP[code];
    }
    sendSensorCommand();
}


/* ==========================================================================
 *  6. Gauge creation
 * ========================================================================== */

function createGauges() {
    // Linear temperature gauges
    $('canvas[data-type="linear-gauge"].canvasT').each(function () {
        gauges.linear.push(
            new LinearGauge(temperatureLinearGaugeConfig(this.id)).draw()
        );
    });

    // Radial gauges
    $('canvas[data-type="radial-gauge"]').each(function () {
        const id  = this.id;
        const cls = $(this).attr('class');
        let   gauge = null;

        switch (true) {
            case cls === 'canvasP1':
                gauge = new RadialGauge(pressureRadialGaugeConfig(id)).draw();
                gauges.pressure.push(gauge);
                break;

            case cls === 'canvasH1':
                gauge = new RadialGauge(humidityRadialGaugeConfig(id)).draw();
                gauges.humidity.push(gauge);
                break;

            case id === 'GauAvTemp':
                gauge = new RadialGauge(avgTemperatureGaugeConfig(id)).draw();
                break;

            case id === 'GauAvHum':
                gauge = new RadialGauge(humidityRadialGaugeConfig(id)).draw();
                break;

            case id === 'GauAvPress':
                gauge = new RadialGauge(pressureRadialGaugeConfig(id)).draw();
                break;

            case id === 'GauAirQ':
            case id === 'bme680_gr':
                gauge = new RadialGauge(airQualityGaugeConfig(id)).draw();
                break;

            case id === 'ens160_tvoc':
                gauge = new RadialGauge(tvocGaugeConfig(id)).draw();
                break;

            case id === 'ens160_eco2':
                gauge = new RadialGauge(eco2GaugeConfig(id)).draw();
                break;

            case id === 'ens160_AIQ':
                gauge = new RadialGauge(ensAiqGaugeConfig(id)).draw();
                break;
        }

        if (gauge) gauges.byId[id] = gauge;
    });
}

function temperatureLinearGaugeConfig(id) {
    return {
        renderTo:          id,
        title:             String(id),
        width:             100,
        height:            300,
        colorPlate:        '#ccc',
        colorPlateEnd:     '#ccc',
        colorUnits:        'black',
        colorNeedle:       '#222',
        colorNeedleEnd:    '',
        colorBar:          '#f5f5f5',
        colorBarStroke:    'black',
        colorTitle:        'blue',
        borderRadius:      20,
        borders:           true,
        minValue:          -50,
        maxValue:          50,
        minorTicks:        11,
        majorTicks:        ['-50','-40','-30','-20','-10','0','10','20','30','40','50'],
        colorNumbers:      ['cyan','blue','blue','blue','black','black','black',
                            'green','green','#CE7E00','red'],
        colorMajorTicks:   ['yellow','green','blue','blue','black','black','black',
                            'black','black','black','black'],
        fontNumbersSize:   30,
        fontValueSize:     45,
        fontTitleSize:     35,
        fontUnitsSize:     45,
        units:             '°C',
        value:             0,
        animationRule:     'elastic',
        animationDuration: 250,
    };
}

function pressureRadialGaugeConfig(id) {
    return Object.assign({}, RADIAL_GAUGE_BASE, {
        renderTo:   id,
        title:      String(id),
        units:      'ммРст',
        minValue:   0,
        maxValue:   770,
        majorTicks: ['0','200','300','400','500','600','700','740','750','760','770'],
        minorTicks: 10,
        highlights: [{ from: 740, to: 760, color: 'rgba(200, 50, 50, .75)' }],
    });
}

function humidityRadialGaugeConfig(id) {
    return Object.assign({}, RADIAL_GAUGE_BASE, {
        renderTo:   id,
        title:      String(id),
        units:      '%',
        minValue:   0,
        maxValue:   100,
        majorTicks: ['0','10','20','30','40','50','60','70','80','90','100'],
        minorTicks: 5,
        highlights: [{ from: 60, to: 100, color: 'rgba(200, 50, 50, .75)' }],
    });
}

function avgTemperatureGaugeConfig(id) {
    return Object.assign({}, RADIAL_GAUGE_BASE, {
        renderTo:   id,
        title:      String(id),
        units:      ' C',
        minValue:   -50,
        maxValue:   50,
        majorTicks: ['-50','-40','-30','-20','-10','0','10','20','30','40','50'],
        minorTicks: 5,
        highlights: [
            { from: -50, to: 0,  color: 'rgba(0, 0, 255, .3)' },
            { from:   0, to: 50, color: 'rgba(255, 0, 0, .3)' },
        ],
    });
}

function airQualityGaugeConfig(id) {
    // NOTE: the overlapping ranges 51-150 / 101-150 are preserved from the
    // original file even though they look like a copy/paste mistake.
    return Object.assign({}, RADIAL_GAUGE_BASE, {
        renderTo:   id,
        title:      String(id),
        units:      'IAQ',
        minValue:   0,
        maxValue:   500,
        majorTicks: ['0','50','100','150','200','250','300','350','400','450','500'],
        minorTicks: 10,
        highlights: [
            { from:   0, to:  50, color: '#00FF00' },
            { from:  51, to: 150, color: '#3CB371' },
            { from: 101, to: 150, color: '#FFD700' },
            { from: 151, to: 200, color: '#FF8C00' },
            { from: 201, to: 300, color: '#FF0000' },
            { from: 301, to: 500, color: '#8B0000' },
        ],
    });
}

function tvocGaugeConfig(id) {
    return Object.assign({}, RADIAL_GAUGE_BASE, {
        renderTo:   id,
        title:      String(id),
        units:      'ppb',
        minValue:   0,
        maxValue:   65000,
        majorTicks: ['0','5000','10500','16000','21500','27000','32500',
                     '38000','43500','49000','53000','58500','62500','65000'],
        minorTicks: 14,
        highlights: [{ from: 49000, to: 65000, color: 'rgba(200, 50, 50, .75)' }],
    });
}

function eco2GaugeConfig(id) {
    return Object.assign({}, RADIAL_GAUGE_BASE, {
        renderTo:   id,
        title:      String(id),
        units:      'ppm',
        minValue:   400,
        maxValue:   65000,
        majorTicks: ['400','5000','10500','16000','21500','27000','32500',
                     '38000','43500','49000','53000','58500','62500','65000'],
        minorTicks: 14,
        highlights: [{ from: 49000, to: 65000, color: 'rgba(200, 50, 50, .75)' }],
    });
}

function ensAiqGaugeConfig(id) {
    return Object.assign({}, RADIAL_GAUGE_BASE, {
        renderTo:   id,
        title:      String(id),
        units:      'AQI-UBA',
        minValue:   0,
        maxValue:   5,
        majorTicks: ['0','1','2','3','4','5'],
        minorTicks: 10,
        highlights: [
            { from: 0, to: 1, color: '#00FF00' },
            { from: 1, to: 2, color: '#3CB371' },
            { from: 2, to: 3, color: '#FFD700' },
            { from: 3, to: 4, color: '#FF0000' },
            { from: 4, to: 5, color: '#8B0000' },
        ],
    });
}


/* ==========================================================================
 *  7. Incoming messages
 * ========================================================================== */

function handleSocketMessage(event) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    let payload;
    try {
        payload = JSON.parse(event.data);
    } catch (err) {
        console.error('Invalid JSON from server:', err.message, event.data);
        return;
    }

    console.log(payload);

    if (payload.time) {
        $('.mcu_tus').text(String(payload.time[0]));
        $('.ptime').text(String(payload.time[1]));
    }

    if (payload.rd_fw) {
        handleFirmwareReadResponse(payload);
    }

    if (payload.sensor_data) {
        handleSensorData(payload);
    }
}

function handleFirmwareReadResponse(payload) {
    const cmd = parseInt(payload.rd_fw, 10);
    console.log('cmd', cmd);

    for (const key of Object.keys(CMD_DESCRIPTIONS)) {
        const description = CMD_DESCRIPTIONS[key];
        console.log(key, description);

        // The original compared cmd against parseInt(key + 41200, 16).
        // We preserve this (odd) comparison.
        if (cmd === parseInt(String(key) + '41200', 16)) {
            $('.srvmode').text(description);
            break;
        }
    }

    if (String(payload.rd_fw) === 'RD_FW' &&
        payload.data &&
        String(payload.data[1]) !== 'NULL') {
        $('#esp_urx').val(String(payload.data[1]) + '\r\n');
        console.log('ok!');
    }
}

function handleSensorData(payload) {
    console.log('sensor_data received');

    if (!payload.crc16) return;

    const sensors     = payload.sensor_data;
    const expectedCrc = parseInt(sensors[CRC_INDEX], 16);

    if (isNaN(expectedCrc) || !verifyCrc16(sensors.slice(), expectedCrc)) {
        console.warn('CRC check failed', sensors, expectedCrc);
        return;
    }

    const averages = computeSensorAverages(sensors);

    updateSensorCheckboxes(sensors);
    updateDerivedFields(sensors);
    updateProgressBars(sensors);
    updateGauges(sensors, averages);
}



/* ==========================================================================
 *  8. UI updates
 * ========================================================================== */

function computeSensorAverages(sensors) {
    // Temperature: mean of |x|, sign taken from any negative reading
    // (this unusual rule is preserved from the original).
    let sign    = 1;
    let tempSum = 0;
    for (let i = 0; i < TEMP_SENSOR_COUNT; i++) {
        const v = parseFloat(sensors[i]);
        if (v < 0) sign = -sign;
        tempSum += Math.abs(v);
    }

    let humSum = 0;
    for (let i = 0; i < HUM_SENSOR_COUNT; i++) {
        humSum += parseFloat(sensors[i + 10]);
    }

    let pressSum = 0;
    for (let i = 0; i < PRESS_SENSOR_COUNT; i++) {
        pressSum += parseFloat(sensors[i + 17]);
    }

    return {
        avgTemp:  tempSum  * 0.1     * sign,
        avgHum:   humSum   * 0.14286,
        avgPress: pressSum * 0.25,
    };
}

function updateSensorCheckboxes(sensors) {
    $('#lm75_t1_chk').prop('checked', Boolean(parseInt(sensors[30], 10)));
    $('#lm75_t2_chk').prop('checked', Boolean(parseInt(sensors[31], 10)));
}

function updateDerivedFields(sensors) {
    const half = 0.5;
    $('#bme280_DEW').val(
        String((parseFloat(sensors[32]) + parseFloat(sensors[33])) * half).substring(0, 7)
    );
    $('#bme280_QNH').val(
        String((parseFloat(sensors[34]) + parseFloat(sensors[35])) * half).substring(0, 7)
    );
    $('#bme280_ALT').val(
        String((parseFloat(sensors[36]) + parseFloat(sensors[37])) * half).substring(0, 7)
    );

    // External helper provided elsewhere on the page.
    ENS_AIQf(parseInt(sensors[24], 10));
}

function updateProgressBars(sensors) {
    $('.progress-bar').each(function (index) {
        const key   = $(this).attr('class').split(' ')[2];
        const value = parseInt(sensors[26 + index], 10);
        const width = Math.round(0.0244 * value);

        // NOTE: the original forgot the '%' unit here.
        $('.' + key)
            .attr('aria-valuenow', value)
            .css('width', width + '%');

        $('#' + key).text(value);
    });
}

function updateGauges(sensors, averages) {
    // Linear temperature gauges — one per temperature sensor
    gauges.linear.forEach(function (gauge, i) {
        gauge.update({ value: parseFloat(sensors[i]) });
    });

    // Radial humidity gauges — sensors 10..16
    gauges.humidity.forEach(function (gauge, i) {
        gauge.update({ value: parseFloat(sensors[i + 10]) });
    });

    // Radial pressure gauges — sensors 17..20, converted Pa → mm Hg
    gauges.pressure.forEach(function (gauge, i) {
        gauge.update({
            value: (parseFloat(sensors[i + 17]) * PRESSURE_PA_TO_MMHG).toFixed(2),
        });
    });

    // Average gauges
    updateGaugeById('GauAvTemp',  averages.avgTemp);
    updateGaugeById('GauAvHum',   averages.avgHum);
    updateGaugeById('GauAvPress', averages.avgPress);

    // Air-quality gauges (same IAQ value shown in two places)
    const iaq = rIAQItem_convertValue(
        parseInt(sensors[21], 10),
        parseFloat(sensors[6]),
        parseFloat(sensors[14])
    );
    updateGaugeById('GauAirQ',   iaq);
    updateGaugeById('bme680_gr', iaq);

    // ENS160 sensors
    updateGaugeById('ens160_tvoc', parseInt(sensors[22], 10));
    updateGaugeById('ens160_eco2', parseInt(sensors[23], 10));
    updateGaugeById('ens160_AIQ',  parseInt(sensors[24], 10));
}

function updateGaugeById(id, value) {
    const gauge = gauges.byId[id];
    if (gauge) gauge.update({ value: value });
}

/* ==========================================================================
 *  9. Layout & form helpers
 * ========================================================================== */

function setOnlineState(isOnline) {
    const $indicator = $('.pst0');
    if (isOnline) {
        $indicator.removeClass('bg-danger').addClass('bg-success').text('ОК');
    } else {
        $indicator.removeClass('bg-success').addClass('bg-danger').text('off');
    }
}

function clearAllFields(value) {
    formFields.forEach(function (el) {
        $('#' + el.name)
            .val(value)
            .removeClass('is-invalid is-valid');
    });
}

// Original names: rm_b / sh_b / rms_b / shs_b
function collapseSidebar() {
    $('.mc1').removeClass('col-md-8 col-xl-8').addClass('col-12');
    $('.bsn0').removeClass('col-md-4 col-xl-4');
    $('.mc1').removeClass('noscroll collapse hide');
}

function expandSidebar() {
    // NOTE: original used jQuery .remove() (removing DOM nodes!) instead of
    // .removeClass() — fixed here.
    $('.mc1').removeClass('col-12').addClass('col-md-8 col-xl-8');
    $('.bsn0').addClass('col-md-4 col-xl-4');
}

function resetOverlay() {
    $('.bsn0').removeClass('col-12 overlay');
    $('.mc1').removeClass('noscroll collapse hide');
}

function showOverlay() {
    $('.bsn0').addClass('col-12 overlay');
    $('.mc1').addClass('noscroll collapse hide');
}

/* ==========================================================================
 * 10. Utilities
 * ========================================================================== */

/**
 * Verify a CRC-16/CCITT checksum (0x1021 polynomial) over an array of
 * string chunks. Returns true when the computed checksum equals expectedCrc.
 *
 * Adapted from github.com/yaacov/node-modbus-serial.
 */
function verifyCrc16(chunks, expectedCrc) {
    const POLYNOMIAL = 0x1021;
    let crc = 0xFFFFFFFF;

    /*for (let c = 0; c < chunks.length; c++) {
        const chunk = chunks[c];
        for (let i = 0; i < chunk.length; i++) {
            crc ^= (chunk.charCodeAt(i) << 8) & 0x0FFFFFFF;
            crc  = ((crc & 0x8000) ? (crc << 1) ^ POLYNOMIAL : crc << 1) & 0x0FFFFFFF;
        }
    }
	*/
	$.each(chunks, function(index, element) {
        for (let  j = 0; j < element.length; j++) {
			crc ^= (element.charCodeAt(j) << 8) & 0x0FFFFFFF;//charCodeAt
			crc = (crc & 0x8000 ? (crc << 1) ^ POLY_D : crc << 1) & 0x0FFFFFFF;
		}
	});

    return crc === expectedCrc;
}

/**
 * Small JSON fetch helper (kept in case HTML still uses it).
 */
function fetchJson(url, method, callback, timeoutSeconds) {
    const xhr = new XMLHttpRequest();
    xhr.onloadend = function () { callback(xhr.status, xhr.responseText); };
    xhr.ontimeout = function () { callback(-1, null); };
    xhr.open(method, url, true);
    xhr.setRequestHeader('Accept', 'text/html');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.responseType = 'json';
    xhr.timeout = timeoutSeconds * 200;
    xhr.send();
}

/* ==========================================================================
 * 11. Backwards-compatible aliases
 *     (in case the HTML still calls the old function names)
 * ========================================================================== */

window.sub_grad       = sendCommandByCode;
window.rm_b           = collapseSidebar;
window.sh_b           = expandSidebar;
window.rms_b          = resetOverlay;
window.shs_b          = showOverlay;
window.refr_rtc       = refreshSensorData;
window.ftvall         = clearAllFields;
window.fetch1         = fetchJson;
/*
window.onload = function () {

$(".bt0st").attr("value", "off");
$(".navia").addClass("list-group-item list-group-item-action bg-light border");
$("#esp_tx").val("wsbuser.prints(node.heap());");
$("#esp_urx").val("");
$('#esp_tx').val('wsbuser.prints(node.heap());');
$('#esp_urx').val('');
$('.bt0st').attr('value', 'off');
$('.navia').addClass('list-group-item list-group-item-action bg-light border');

formFields = $('*').get();

setTimeout(start, 1000);
}
*/
/*
$(function () {
    $('#esp_tx').val('wsbuser.prints(node.heap());');
    $('#esp_urx').val('');
    $('.bt0st').attr('value', 'off');
    $('.navia').addClass('list-group-item list-group-item-action bg-light border');

    formFields = $('*').get();

    setTimeout(start, 1000);
});
*/
