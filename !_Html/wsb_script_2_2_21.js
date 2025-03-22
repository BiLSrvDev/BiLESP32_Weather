// upda3a3
// https://bilsrv.github.io/WSBSrvWeatherPub/wsb_script_2_2_2.js
// reverse panelki dlya debug 

/*
float IAQ_abs(float IAQ,float T,float Hum)
{
	float hum_abs=6.112*exp((17.67*T)/(T+243.5))*Hum*2.1674/(273.15+T);
	float comp_gas=IAQ*exp(0.09*hum_abs);
	return ((comp_gas-0)/(16000000-0)*(0-500)+500);
}
*/
var sds, mds, sets, maOBJ, canvasOBJ, GuageMeterOBJ;
var httpd_cmd = 
{
	content_type: "application/json",
	command: ["get_data","get_sens"],
	CRC32: "ANY"
}
sds = $(".sideset");
mds = $(".macnt");
sets = $(".setcnt");
cnftmp = $(".scntf");
	
var CanvGaugeArr = [];
	
//$(document).ready(function() {
var gateway = 'wss://wsb.bilymo.keenetic.pro/ws'
/*
var gateway = 
{
		//gw:'wss://wsb.bilymo.keenetic.pro/ws',
		gw:'ws://wsb. bilymo.keenetic.pro/ws',
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
	//var pcBlock=0;
	var i=0,j,n1,k;
	//var str="";
	/*$(buffer).each((index, element) => {
        console.log(`current index : ${index} element : ${element}`)
    });*/
	
	$.each(buffer, function(index, element) {
  		//console.log(index, element);
		//str=buffer[index];
		//console.log('puu '+buffer[index]);
        for (var j = 0; j < element.length; j++) {
			
			crc ^= (element.charCodeAt(j) << 8) & 0x0FFFFFFF;//charCodeAt
			//console.log('crc ^=  '+crc.toString(16));
			for (k = 0; k < 8; k++)
            	crc = (crc & 0x8000 ? (crc << 1) ^ POLY_D : crc << 1) & 0x0FFFFFFF;
		}
	});

    if(crc==extcrc) 
		{return true;}
	else
		{return false;}
}

function refr_rtc() {
    //if (subwdeb == false && $("#autmp").prop("checked")) {
        //fetch("/get_rtc.json?n=" + Math.random(), "GET", txjstmp, 30);
        sub_grad();
    //}
    //console.log("refr_rtc");
}


$('body').delay(500).queue(function() 
{

    //$(this).load('myPage.php');
WSsocket = new WebSocket(gateway);
// Canvas .each Default Settings 
$('canvas').each(function(index){	
    CanvGaugeArr.push(new LinearGauge({
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
	

	
$('canvas').each(function(index){	
    CanvGaugeArr.push(new LinearGauge({
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
	//console.log( String($(this).attr('id')) + ": " + $( this ).text() + $( this ).attr('id')+ " " );    units: '°C',	colorPlateEnd: "#327ac0",
});
GuageMeter={
	theme: "Green-Gold-Red",
	text: "0",
	style: "Arch",
	text_size: "0.10",
	append: "°C",
	percent: "null",
	size: 140,
	width: 10,
	back: "null",
	label: $( this ).attr('id'),
	animate_gauge_colors: false,
	animate_text_colors:  false,
	label_color: "Blue"
	//showvalue: true
	//color: "White",
	//label_color: "White"
};
/*
$(".GaugeMeter1H").each(function(index){
	$($("."+$(this).attr('class').split(" ")[1])).gaugeMeter(GuageMeter);
});
	
$(".GaugeMeter1P").each(function(index){

	$($("."+$(this).attr('class').split(" ")[1])).gaugeMeter(GuageMeter);
});*/

//GuageMeter.animationstep=true;
//GuageMeter.animate_gauge_colors=true;
//GuageMeter.animate_text_colors=true;
//GuageMeter.back="#DCDCDC"
GuageMeter.label = "Влажн-ь"
GuageMeter.text_size = "0.12";
GuageMeter.append = "%";
$(".GaugeMeter1H").gaugeMeter(GuageMeter);
GuageMeter.append = "%";
GuageMeter.label = "Кач.Возд."
//GuageMeter.back="#DCDCDC"
$(".GaugeMeter1AQ").gaugeMeter(GuageMeter);
$(".GaugeMeterAQ").gaugeMeter(GuageMeter);
//GuageMeter.back="#DCDCDC"
GuageMeter.append = "%";
GuageMeter.label = "Влажн-ь"
$(".GaugeMeterH").gaugeMeter(GuageMeter);
//GuageMeter.back="#DCDCDC"
GuageMeter.append = "ммРт";
GuageMeter.label = "Давл-е"
//GuageMeter.theme="White";
GuageMeter.fill="#21B4F9";
$(".GaugeMeterP").gaugeMeter(GuageMeter);
$(".GaugeMeter1P").gaugeMeter(GuageMeter);
//GuageMeter.back="#DCDCDC"

//GuageMeter.back="#DCDCDC"
//$( "div:has(.GaugeMeter1T)").addClass("bd_fail");.fadeOut(1000)
//$( ".GaugeMeter1T").addClass("bd_fail");
//$( ".GaugeMeter1T" ).find('bd_fail').fadeIn(1000);
	
//$(".GaugeMeter").gaugeMeter(GuageMeter);

if(WSsocket.readyState!=1)
{
	initWebSocket();
}

maOBJ = $('*');

	
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

// Initialize GaugeMeter plugin
}

function sub_grad()
{
	//
//https://javascriptcompressor.com/
//gaugeArr[1].update({ value: '47' });

					/*$('canvas').attr({value:'51'})
					/$('canvas').attr({width:'100',height:'150'});*/
					
					/*guagelm75_t.attr('data-value','47');guagelm75_t.attr('data-width','100');
					guagelm75_t.attr('data-height','150');
					guagelm75_t.attr('data-value','47');*/
//console.log(WSsocket.readyState);
//rs = setInterval(refr_rtc, 3000);
if (WSsocket.readyState === 1) {

	WSsocket.send(JSON.stringify(httpd_cmd));
}
	else
{initWebSocket();}

// Initialize GaugeMeter plugin
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
	waitForSocketConnection(WSsocket, null);
	console.log('ws close');
	WSsocket.close();
}

function onError(event) {
	// only event
	if(WSsocket.readyState==2 || WSsocket.readyState==3)
	{
		state_online(false);
		waitForSocketConnection(WSsocket, null);
		console.log('ws error'+event);
	}
}
 

function onMessage(event)
{
arrbufcrc="";
i=0,j=0,crc16_int=0;
Pdat=0.0,Pdt=0.0;

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
		return 0;
	}
}
else
	return 0;
	

//
//	2.1 CRC
//
if (json_data["crc16"]) 
{
	arrbufcrc=[].concat(json_data.sensors).concat(json_data.time);
	crc16_int=parseInt(json_data.crc16, 16);
	//console.log("crc16_int"+crc16_int);
	
	if (isNaN(crc16_int)) {
    	return NaN;
	}	

	if(crc16(arrbufcrc,crc16_int) != true )
		return 0;
	//for(i=0;i<json_data.time.length)
	//	{arrbufcrc[i]=json_data.time[i];j++;}
	//for(i=0;i<json_data.time.length)
	//	{arrbufcrc[i]=json_data.time[i];}
}
else
	{return 0;}
	
//
//	2.2 Times from mcu
//
	
$('.mcu_tus').text((parseFloat(json_data.time[0])*10^-6).toString());
$('.ptime').text(json_data.time[1].toString());

//
//	2.3 temp_json["sensors"]
//
if (json_data["sensors"]) 
{
//try {
	$('canvas').each(function(index){
		//console.log(CanvGaugeArr[index]," ind ",index);
		CanvGaugeArr[index].update({ value: parseFloat(json_data.sensors[index]) });
		if(index>8)
		{return false;}
	});
	
	//console.log("GaugeMeter1P");
	//GuageMeterOBJ = $(".GaugeMeter1H").get();
	//console.log(GuageMeterOBJ);
	GuageMeter.append="%";

	$(".GaugeMeter1H").each(function(index){
		//console.log($(this).attr('id'));
		GuageMeter.text=parseFloat(json_data.sensors[index+10]).toFixed(2);
		//GuageMeter.percent=parseInt(json_data.sensors[index+10],10);
$($("."+$(this).attr('class').split(" ")[1])).gaugeMeter({text:GuageMeter.text,append:GuageMeter.append,percent:parseInt(json_data.sensors[index+10],10)});

		if(index>7)
		{return true;}
	});
	//console.log("GaugeMeter1P");
	//GuageMeterOBJ = $(".GaugeMeter1P").get();
	//console.log(GuageMeterOBJ);
	
	$(".GaugeMeter1P").each(function(index){
		Pdat = (parseFloat(json_data.sensors[index+17])*0.750062).toFixed(2);
		//GuageMeter.text=Pdat.toString();
		
		if(Math.round(Pdat)>750)
		{
			Pdt=750-(Pdat-750);
		}
		else if(Math.round(Pdat)<750)
		{
			Pdt=750-(750-Pdat);
		}
		
		GuageMeter.append="ммРтст";
		
$($("."+$(this).attr('class').split(" ")[1])).gaugeMeter({text:Pdat.toString(),append:GuageMeter.append,percent:Math.round(Pdt*100/750)});

		console.log(Math.round(Pdt*100/750));

		if(index>3)
		{return true;}
	});
}
//
//	2.3 temp_json["sensors"]
//
if (json_data["sensors"] && (json_data.rd_fw.toString()=="RD_FW")) 
{
	$("#esp_urx").val(temp_json.data.toString())
}
	
	
}
	

function state_online(state) 
{
	if(state==true)
	{$(".tst0").removeClass("bg-danger");$(".tst0").addClass("bg-success").text("ОК")}
	else
	{$(".tst0").removeClass("bg-success");$(".tst0").addClass("bg-danger").text("off")};
}
	
}) 

window.onload = function () {

$(".bt0st").attr("value", "off");
$(".navia").addClass("list-group-item list-group-item-action bg-light border");
$("#esp_tx").val("wsbuser.prints(node.heap());");
$("#esp_urx").val("");

rs = setInterval(refr_rtc, 3000);
  // --------
  // Tooltips
  // --------
  // Instantiate all tooltips in a docs or StackBlitz
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(tooltip => {
      new bootstrap.Tooltip(tooltip)
    })

  // --------
  // Popovers
  // --------
  // Instantiate all popovers in docs or StackBlitz
  document.querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(popover => {
      new bootstrap.Popover(popover)
    })

  // -------------------------------
  // Toasts
  // -------------------------------
  // Used by 'Placement' example in docs or StackBlitz
  const toastPlacement = document.getElementById('toastPlacement')
  if (toastPlacement) {
    document.getElementById('selectToastPlacement').addEventListener('change', function () {
      if (!toastPlacement.dataset.originalClass) {
        toastPlacement.dataset.originalClass = toastPlacement.className
      }

      toastPlacement.className = `${toastPlacement.dataset.originalClass} ${this.value}`
    })
  }

  // Instantiate all toasts in docs pages only
  document.querySelectorAll('.bd-example .toast')
    .forEach(toastNode => {
      const toast = new bootstrap.Toast(toastNode, {
        autohide: false
      })

      toast.show()
    })

  // Instantiate all toasts in docs pages only
  // js-docs-start live-toast
  const toastTrigger = document.getElementById('liveToastBtn')
  const toastLiveExample = document.getElementById('liveToast')

  if (toastTrigger) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastTrigger.addEventListener('click', () => {
      toastBootstrap.show()
    })
  }
  // js-docs-end live-toast

  // -------------------------------
  // Alerts
  // -------------------------------
  // Used in 'Show live alert' example in docs or StackBlitz

  // js-docs-start live-alert
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }

  const alertTrigger = document.getElementById('liveAlertBtn')
  if (alertTrigger) {
    alertTrigger.addEventListener('click', () => {
      appendAlert('Nice, you triggered this alert message!', 'success')
    })
  }
  // js-docs-end live-alert

  // --------
  // Carousels
  // --------
  // Instantiate all non-autoplaying carousels in docs or StackBlitz
  document.querySelectorAll('.carousel:not([data-bs-ride="carousel"])')
    .forEach(carousel => {
      bootstrap.Carousel.getOrCreateInstance(carousel)
    })

  // -------------------------------
  // Checks & Radios
  // -------------------------------
  // Indeterminate checkbox example in docs and StackBlitz
  document.querySelectorAll('.bd-example-indeterminate [type="checkbox"]')
    .forEach(checkbox => {
      if (checkbox.id.includes('Indeterminate')) {
        checkbox.indeterminate = true
      }
    })

  // -------------------------------
  // Links
  // -------------------------------
  // Disable empty links in docs examples only
  document.querySelectorAll('.bd-content [href="#"]')
    .forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault()
      })
    })

  // -------------------------------
  // Modal
  // -------------------------------
  // Modal 'Varying modal content' example in docs and StackBlitz
  // js-docs-start varying-modal-content
  const exampleModal = document.getElementById('exampleModal')
  if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', event => {
      // Button that triggered the modal
      const button = event.relatedTarget
      // Extract info from data-bs-* attributes
      const recipient = button.getAttribute('data-bs-whatever')
      // If necessary, you could initiate an Ajax request here
      // and then do the updating in a callback.

      // Update the modal's content.
      const modalTitle = exampleModal.querySelector('.modal-title')
      const modalBodyInput = exampleModal.querySelector('.modal-body input')

      modalTitle.textContent = `New message to ${recipient}`
      modalBodyInput.value = recipient
    })
  }
  // js-docs-end varying-modal-content

  // -------------------------------
  // Offcanvas
  // -------------------------------
  // 'Offcanvas components' example in docs only
  const myOffcanvas = document.querySelectorAll('.bd-example-offcanvas .offcanvas')
  if (myOffcanvas) {
    myOffcanvas.forEach(offcanvas => {
      offcanvas.addEventListener('show.bs.offcanvas', event => {
        event.preventDefault()
      }, false)
    })
  }

	

}