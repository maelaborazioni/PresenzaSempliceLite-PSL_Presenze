/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"65A2D138-F982-4891-B324-CFFC5F44521E"}
 */
var v_codice_certificato = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9DEF42CE-A7B0-42F7-B88C-4BB1D88A488B"}
 */
var html_icon = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"24B33E12-8B8B-43A2-B8BB-A264A750F8F5"}
 */
var html_icon_template = '<span class="icon icon-mini @0"/>'; 

/**
 * @properties={typeid:35,uuid:"A52B0FC1-3E31-4F6F-8C96-8F1221ED2E9E",variableType:-4}
 */
var disabled = false;

/**
 * @properties={typeid:35,uuid:"3CD9B8F6-294A-45F4-9116-2785FB40563E",variableType:-4}
 */
var edit_disabled = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"363F1900-0F4A-45DF-8A9F-007B74D8BBB6"}
 */
var disabled_message = 'L\'inserimento di eventi non è disponibile per questa giornata';

/**
 * @properties={typeid:35,uuid:"A96DD33F-7134-4486-9544-1DD8A08EA10E",variableType:-4}
 */
var v_events_dataset = null;

/**
 * @properties={typeid:35,uuid:"04F90D13-10BA-4D51-B536-6B0AE2F41E98",variableType:-4}
 */
var v_listeners = { ondatachange: { }, onselectionchange: { } };

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"422598A3-AFE4-4360-B7E4-9855A6EE2D6C"}
 */
var btn_day_id;

/**
 * @properties={typeid:35,uuid:"EAE434D8-7418-4EFC-89A4-4ACBB12F946F",variableType:-4}
 */
var v_error = false;

/**
 * @properties={typeid:35,uuid:"1D6543D2-6230-4F6D-924B-68BDFF6CFC4A",variableType:-4}
 */
var v_warning = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1096635A-F9C8-4564-8D5C-2F2040EDF41A"}
 */
var v_message = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A09A99F8-9C8E-4D89-A96B-C367A6B9019C",variableType:4}
 */
var v_selected = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E2320875-F896-4835-B8EA-506843ED72E5"}
 */
var v_tooltip = 'Fai doppio click per aggiungere un evento<br/>Fai doppio click su un evento per modificarlo';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6D6B1AE5-7FB4-4755-9D84-B7033E27EA12"}
 */
var workedHoursTemplate = '<html><div class="workhours" title="Ore lavorate">@0</div></html>';

/**
 * @properties={typeid:35,uuid:"2A15254B-F87E-4240-BEB5-A96CB65419BB",variableType:-4}
 */
var constraints = { };

/**
 * @properties={typeid:35,uuid:"96DA63DC-F3C3-4A6B-B87F-1C4A835286BA",variableType:-4}
 */
var events_fs = datasources.db.ma_presenze.e2eventi.getFoundSet();

/**
 * @type {Array<{ 
 * 			id: Number, 
 * 			type: String, 
 * 			hours: Number, 
 * 			disabled: Boolean, 
 * 			is_dirty: Boolean, 
 * 			persisted: Boolean, 
 * 			error: Boolean }>}
 * 
 * @properties={typeid:35,uuid:"CE80621A-63AB-4267-922A-24FFF247B9D9",variableType:-4}
 */
var v_events = [];

/**
 * @properties={typeid:35,uuid:"AC2864F2-6B95-41DD-B85E-B5085852F53E",variableType:-4}
 */
var v_edit = false;

/**
 * @properties={typeid:35,uuid:"9F3F3CB3-074C-41D4-B596-B8349A5385C0",variableType:-4}
 */
var v_holiday = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"73A3502D-DD46-4732-9CB1-A6F16AF25627"}
 */
var v_holiday_desc = '';

/**
 * @properties={typeid:35,uuid:"4C4A9523-0322-4148-9F94-FE01C0C1669F",variableType:-4}
 */
var v_certificate = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3BA9D8A2-B197-4008-A020-0382116DFDE6"}
 */
var html_events_id = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"7097CBBA-A840-4A85-A1FA-E897285DBDF7"}
 */
var v_html = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AF461403-5A17-467C-976A-9DC36B8484F5"}
 */
var v_html_workedhours = workedHoursTemplate;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"EE4525EF-5F2C-4F7F-BC5E-92F50D99D717"}
 */
var v_events_html = '<div class="events"><ul class="events-list"></ul></div>';

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"344CB9F0-82D8-455E-BAC6-6BC953BAABED",variableType:93}
 */
var v_day = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"192D7B24-79A8-4F33-BFB3-B6ECB8C6EA5F",variableType:8}
 */
var v_work_hours = 0.00;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E53A9E40-1F46-4FD3-A1C9-C3C6DC21FBE9"}
 */
var v_work_hours_desc = '';

/**
 * @properties={typeid:35,uuid:"227EC066-D620-4536-92BE-457DDC177237",variableType:-4}
 */
var v_workable_hours = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F79E4633-DF8E-44B7-8122-4E35B2D4CD6D",variableType:-4}
 */
var v_event_type = [''];

/**
 * @param {Date} day
 * 
 * @return {JSForm}
 *
 * @properties={typeid:24,uuid:"4D239BEB-3C80-417F-8DB7-354F60CCE139"}
 */
function getInstanceForDay(day)
{	
	var cloneName = controller.getName() + '_' + utils.dateFormat(day, 'yyyyMMdd');
	
	var jsform = solutionModel.getForm(cloneName);
	if(!jsform)
		jsform = solutionModel.cloneForm(cloneName, solutionModel.getForm(controller.getName()));
	
	return jsform;
}

/**
 * @properties={typeid:24,uuid:"BDCC9D31-4C1F-448A-9461-0F83B4DE0851"}
 */
function isSelected()
{
	return v_selected == 1;
}

/**
 * @properties={typeid:24,uuid:"E69389E9-0046-4E63-8963-59C942E1F157"}
 */
function hasError()
{
	return v_error;
}

/**
 * @properties={typeid:24,uuid:"80A49C69-B7A4-45BB-9128-72A0C32B25A7"}
 */
function select()
{
	v_selected = 1;
}

/**
 * @properties={typeid:24,uuid:"2B1B951E-F2A8-4C19-A663-C27CD83AA5CD"}
 */
function unselect()
{
	v_selected = 0;
}

/**
 * @properties={typeid:24,uuid:"0082CDFD-09FF-4DBF-9F21-30E56246D0FA"}
 */
function setEnabled()
{
	disabled = false;
	disabled_message = null;
}

/**
 * @param {String} message
 *
 * @properties={typeid:24,uuid:"F8DA81B3-AFAC-454A-89D6-DBB06F0BD906"}
 */
function setDisabled(message)
{
	disabled = true;
	disabled_message = message;
}

/**
 * @param {String} [message]
 * 
 * @properties={typeid:24,uuid:"0D2FD72E-6483-41B6-B772-E9CB23FA43A8"}
 */
function disable(message)
{
	disableEdit(message || disabled_message);
	elements.btn_date.format = 'dd MMM';
	
	plugins.WebClientUtils.setExtraCssClass(elements.btn_day, 'day day-disabled');
}

/**
 * @properties={typeid:24,uuid:"2944727A-FD48-42A3-AA28-45B4BB47FA17"}
 */
function enable()
{
	disabled = edit_disabled = false;
	
	controller.enabled = true;
	controller.readOnly = false;
	
	elements.btn_date.format = 'dd';
	elements.btn_day.toolTipText = elements.btn_date.toolTipText = v_tooltip;
	
	elements.chk_selected.visible =
	elements.chk_selected.enabled = true;
	
	elements.icn_info.visible = false;
	
	elements.lbl_certificate.visible = false;
	elements.lbl_certificate.toolTipText = '';
	
	plugins.WebClientUtils.removeExtraCssClass(elements.btn_day);
	plugins.WebClientUtils.setExtraCssClass(elements.btn_day, 'day');
}

/**
 * @properties={typeid:24,uuid:"1B600AF8-690F-4CB0-8C37-6A54469A2D08"}
 */
function getData()
{
	return { events: v_events, worked_hours: v_work_hours, workable_hours: v_workable_hours, warning: v_warning, error: v_error, message: v_message };	
}

/**
 * @param {Array} data
 * 
 * @properties={typeid:24,uuid:"32FBF51E-86AE-4117-8C52-CCAAEAE00B44"}
 * @AllowToRunInFind
 */
function setData(data)
{
	if(data)
	{
		setEvents(data.slice(0));
		
		updateWorkedHours();
		updateView();
	}
}

/**
 * @properties={typeid:24,uuid:"C02F1DDA-39B1-4DAA-A0EF-EA2BAF1EB7EF"}
 */
function clear()
{
	v_events = [];
	v_work_hours = v_workable_hours;
	
	updateWorkedHours();
	updateView();
	
	resetWarning();
	resetError();
}

/**
 * @param {Number} 	[x]
 * @param {Number} 	[y]
 * @param {Number}	[eventIndex]
 * 
 * @properties={typeid:24,uuid:"34B4130E-363E-4CD4-A288-9BD7888A822A"}
 */
function drawInputAt(x, y, eventIndex)
{
	var input  = getInput();
		input.clear();

	var events = getEvents();
	if (isInEdit() && eventIndex && eventIndex > -1)
	{
		input.setData({ event: events[eventIndex] });
		events.splice(eventIndex, 1);
	}
	
	input.setConstraints(constraints, events);
	input.setMaxHours(getWorkableHours());
	scopes.psl.SetEventsValuelist(v_events_dataset);
		
	/** @type {{ event: { id: Number, code: String, property: String, type: String, hours: Number, whole_day: Boolean }}} */
	var data = input.show(x, y);
	if (data && validateData(data, !isInEdit(), eventIndex))
		updateEvents(data, eventIndex);
}

/**
 * @properties={typeid:24,uuid:"83448BF7-61D5-40BC-AF4A-C53751CA5FF1"}
 */
function getEvents()
{
	// make a copy to prevent spurious data
	return v_events.slice(0);
}

/**
 * @param {Array} events
 *
 * @properties={typeid:24,uuid:"41F703FB-E7CB-47F1-8CA9-5E576A47E853"}
 */
function setEvents(events)
{
	v_events = events;
}

/**
 * @param {{ event: { id: Number, code: String, type: String, hours: Number, whole_day: Boolean , code : String, property : String} }} data
 * @param {Number} [eventIndex]
 *
 * @properties={typeid:24,uuid:"DB9173E7-3942-47F4-954F-D9E659AE2007"}
 * @AllowToRunInFind
 */
function updateEvents(data, eventIndex)
{
	if(!data || !data.event || !data.event.hours)
		return;
	
	try
	{
		var eventid = data.event.id;
		events_fs.loadRecords(eventid);
		
		var codiceProprieta = '';
		
		var proprieta = events_fs.e2eventi_to_e2eventiclassiproprieta;
		if (proprieta && proprieta.getSize() > 0)
		{
			if(v_holiday)
				codiceProprieta = globals.ProprietaEvento.FESTIVO_DIURNO;
			else
				codiceProprieta = globals.ProprietaEvento.LAVORATIVO_DIURNO;
		}
		
		var eventclass = events_fs.e2eventi_to_e2eventiclassi.tipo;
		
		/** @type {{id : Number, code : String, property : String, type : String, hours : Number, whole_day : Boolean, 
		 *          disabled : Boolean, is_dirty : Boolean, is_new : Boolean, persisted : Boolean }}*/
		var event = 
		{ 
			id: eventid,
			code: events_fs.evento,
			property: codiceProprieta, 
			type: eventclass, 
			hours: data.event.hours,
			whole_day: data.event.whole_day,
			disabled: false,
			is_dirty: true,
			is_new: false,
			persisted: false
		};
		
		/** @type {Array<{id : Number, code : String, property : String, type : String, hours : Number, whole_day : Boolean, 
		 *                disabled : Boolean, is_dirty : Boolean, is_new : Boolean, persisted : Boolean }>}*/
		var events = getEvents();
		
		/**
		 * If an event of the same type already exists (which is not the current one), add hours to that
		 */		
		var existingEventIndex  = events.map(function(e){ return e.id; }).indexOf(eventid);
		
		var updateExistingEvent = existingEventIndex > -1 && existingEventIndex != eventIndex; 
		if (updateExistingEvent)
		{
			event = events[existingEventIndex];
			
			// delete the original event if present
			if(eventIndex && eventIndex > -1)
				events = deleteEvent(eventIndex, false);

			event.hours   += data.event.hours;	
			event.is_dirty  = true;			
		}
		/**
		 * Otherwise, edit the original event or add a new one
		 */
		else
		{
			if(isInEdit() && eventIndex && eventIndex > -1)
				events[eventIndex] = event;
			else
			{
				event.is_new = true;
				// find the first event of the same type, and push the new one just after
				var lastIndex = events.map(function(e){ return e.type; }).lastIndexOf(event.type);
				if (lastIndex > -1)
					events = events.slice(0, lastIndex + 1).concat([event]).concat(events.slice(lastIndex + 1));
				else
					events.push(event);
			}
		}
		
		setEvents(events);
		updateWorkedHours();
		updateView();
		
		notify(scopes.events.Listeners.ON_DATACHANGE);
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		throw new Error('i18n:ma.err.generic_error');
	}
}

/**
 * Notifies all registered listeners for the event, if any
 * 
 * @param {String} event
 *
 * @properties={typeid:24,uuid:"50B128E2-4928-482B-8B7E-8D47B65AAD9F"}
 */
function notify(event)
{
	for(var l in v_listeners[event])
		v_listeners[event][l]();
}

/**
 * @param [events]
 * 
 * @properties={typeid:24,uuid:"B4141EAA-5A1B-426F-B235-BBF791B98E4D"}
 */
function updateWorkedHours(events)
{
	events = events || getEvents();
	setWorkedHours(computeWorkedHours(events));
}

/**
 * @param events
 *
 * @properties={typeid:24,uuid:"A12DBCC2-F1EB-4DF8-A3DF-B045A8987F86"}
 */
function computeWorkedHours(events)
{
	var work_hours = v_workable_hours;
	events.forEach(function(e){ 
						if(e.type == globals.TipologiaEvento.SOSTITUTIVO){ work_hours -= e.hours; }
						else
						if(e.type == globals.TipologiaEvento.AGGIUNTIVO){ work_hours += e.hours; }
					});
	
	return work_hours;
}

/**
 * @param {Array<{ id: Number, type: String, hours: Number, disabled: Boolean }>} [events]
 * 
 * @properties={typeid:24,uuid:"146398C1-0E8F-40ED-B8D1-86A3BBAF11D4"}
 */
function updateView(events)
{
	if(!events)
		events = getEvents();
	
	var div_id = 'events-day-' + v_day.getDate();
	var html = '<div class="events" id="' + div_id + '">\
					<script type="text/javascript">\
						$("li.evento").click(function() {\
							$("li.evento.selected").removeClass("selected");\
							$(this).addClass("selected");\
						});\
						$("div.day-tab").not  (".day-disabled")\
										.find ("li.evento")\
										.hover(function(e) { if(!$(this).hasClass("disabled")) $(this).find("span.delete-event").css("visibility", "visible"); },\
										   	   function(e) { if(!$(this).hasClass("disabled")) $(this).find("span.delete-event").css("visibility", "hidden"); });\
					</script>\
					<ul class="events-list">';
	
	for(var e = 0; e < events.length; e++)
	{
		events_fs.loadRecords(events[e].id);
		
		var id    = events[e].id;
		var code  = events_fs.evento;
		var hours = events[e].hours;
		
		var editCallback   = plugins.WebClientUtils.generateCallbackScript(editEvent, [e.toString()]);
		var deleteCallback = plugins.WebClientUtils.generateCallbackScript(deleteEvent, [e.toString(), 'true']);
		
		var cssClasses       = 'evento evento-' + id;
		var editCallbackHtml = 'ondblclick="' + editCallback + '"';

		var eventIsDisabled = events[e].disabled || events_fs.e2eventi_to_e2eventiclassi.gestitoconstorico == 1;
		if (eventIsDisabled)
		{
			cssClasses += ' disabled';
			editCallbackHtml = '';
		}
			
		
		var li_html = '<li class="@classes" title="@title" @editCallback>\
							<span class="delete-event icon-cross" title="elimina" onclick="@deleteCallback"></span>\
							@innerHtml\
					   </li>';
		
		var hoursString = hours.toFixed(2);
		var innerHtml   =   (scopes.html.EncodeHtmlEntity(code) + new Array(4 - code.length).join('&nbsp;')) 
						  + ' ' 
						  + (new Array(6 - hoursString.length).join('&nbsp;')) + hoursString;

		li_html = li_html.replace("@disabled"      , disabled.toString());
		li_html = li_html.replace("@classes"       , cssClasses);
		li_html = li_html.replace("@title"         , events_fs.descriz);
		li_html = li_html.replace("@editCallback"  , editCallbackHtml);
		li_html = li_html.replace("@innerHtml"     , innerHtml);
		li_html = li_html.replace("@deleteCallback", deleteCallback);
		
		html += li_html;
	}
	
	html +=    '</ul>\
			</div>';
	
	v_events_html = html;
}

/**
 * @properties={typeid:24,uuid:"93F72971-7285-460C-8428-EF9FD64E6BB0"}
 */
function hideInput()
{
	var input = forms.psl_evento_input;
		input.hide();
}

/**
 * @properties={typeid:24,uuid:"161A175B-3E4F-49F8-8D05-047BCA050A87"}
 */
function addEvent()
{
	setEdit(false);
	getInput().clear();
	
	var script = 'var offset = $("' + btn_day_id + '").offset();';
	plugins.WebClientUtils.executeClientSideJS(script, drawInputAt, ['offset.left + 40', 'offset.top + 40']);
}

/**
 * @properties={typeid:24,uuid:"4CEAFECB-C901-486D-9610-A6EA44C888AC"}
 */
function getInput()
{
	return forms.psl_evento_input;
}

/**
 * @param eventIndex
 *
 * @properties={typeid:24,uuid:"ACE5D1FA-09F1-4D36-8B3A-2AB25857CE6E"}
 * @AllowToRunInFind
 */
function editEvent(eventIndex)
{
	if(isDisabled())
		return;
	
	setEdit(true);
	   	
	var script = 'var offset = $("' + btn_day_id + '").offset();';
	plugins.WebClientUtils.executeClientSideJS(script, drawInputAt, ['offset.left + 40', 'offset.top + 40', eventIndex]);
}

/**
 * @param {Number} eventIndex
 * @param {Boolean} [update]
 * 
 * @properties={typeid:24,uuid:"FAA51FCE-2AEC-4823-8BCE-8587A8EC5EB2"}
 */
function deleteEvent(eventIndex, update)
{
	if(isDisabled())
		return [];
	
	update = update != false;
	
	var answer = true;
	if (answer)
	{
		var events = getEvents();
		var event  = events[eventIndex];
		
		if(event)
		{
			if(update)
			{
				events.splice(eventIndex, 1);
				
				setEvents(events);
				updateWorkedHours();
				updateView();
			}				
				
			notify(scopes.events.Listeners.ON_DATACHANGE);
		}
	}
	
	return events;
}

/**
 * @properties={typeid:24,uuid:"EA6B3F00-F47D-41EE-A8EC-BC67737849FC"}
 */
function deleteAllEvents()
{
	var events = getEvents();
	for(var e = events.length - 1; e >= 0; e--)
		deleteEvent(e);
	
	updateWorkedHours();
	updateView();
}

/**
 * @properties={typeid:24,uuid:"72483E18-214E-41C0-AF53-E2A59FABED41"}
 */
function isDisabled()
{
	return disabled || (!controller.enabled && controller.readOnly);
}

/**
 * @properties={typeid:24,uuid:"425A2B5B-0788-4EA7-887B-04A0A05F88B1"}
 */
function isEditDisabled()
{
	return edit_disabled;
}

/**
 * @properties={typeid:24,uuid:"39859D3F-6B58-4D80-B40A-B8FAC42ACB11"}
 */
function isEnabled()
{
	return !isDisabled() && !isEditDisabled();
}

/**
 * @properties={typeid:24,uuid:"194195CB-E51C-4307-814D-8BD389DC0BFF"}
 */
function setEdit(edit)
{
	v_edit = edit;
	getInput().setEdit(edit);
}

/**
 * @properties={typeid:24,uuid:"8B30F911-1029-4D88-8D63-F0949F1488E5"}
 */
function isInEdit()
{
	return v_edit;
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 * 
 * @private
 *
 * @properties={typeid:24,uuid:"C45E33DF-9540-4313-A3A1-44F3E3419C09"}
 */
function onLoad(event)
{
	btn_day_id     = '#' + plugins.WebClientUtils.getElementMarkupId(elements.btn_day);
	html_events_id = '#' + plugins.WebClientUtils.getElementMarkupId(elements.html_events);
	
	plugins.WebClientUtils.setExtraCssClass(elements.btn_date, 'date');
}

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"13C3AD9B-680E-48D2-8464-94C7B49B081B",variableType:93}
 */
var last_timestamp = new Date();

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2B2F0DE2-C776-495F-B848-3129A0924374"}
 */
function onAction$day(event) 
{
	// simulate a double click
	var current_timestamp = application.getTimeStamp();
	if (current_timestamp - last_timestamp < 200)
		addEvent();
	
	last_timestamp = current_timestamp;
}

/**
 * Perform the element double-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A6550482-C3E5-43A1-AC27-9AE509F956D2"}
 */
function onDoubleClick$btn_day(event)
{	
	addEvent();
}

/**
 * @param {Function} c
 *
 * @properties={typeid:24,uuid:"777CB9B7-CFA7-4D65-901F-91165BA9CAE6"}
 */
function setHoursConstraint(c)
{
	var field = getInput().getHoursFieldName();
	constraints[field] = [c];
}

/**
 * @param {{ event: { id: Number, code: String, type: String, hours: Number, whole_day: Boolean } }} data
 * @param {Boolean} isNew
 * @param {Number} [eventIndex]
 *
 * @properties={typeid:24,uuid:"A0D6F89E-3F45-4628-851C-47F4DC8C1E67"}
 */
function validateData(data, isNew, eventIndex)
{
	if(!data)
		return true;
	
	events_fs.loadRecords(data.event.id);
	
	if(data.event.whole_day)
		data.event.hours = isInEdit() ? v_workable_hours : v_work_hours;
	
	resetWarning();
	resetError();
	
	for(var c in constraints)
	{
		for(var i = 0; constraints[c] && i < constraints[c].length; i++)
		{
			var events = getEvents();
			if(eventIndex && eventIndex > -1)
				events.splice(eventIndex, 1);
				
			/** @type {{ error: Boolean, blocking: Boolean, message: String }} */
			var result = constraints[c][i](data, isNew, events, getWorkableHours());
			if (result.error)
			{
				var message = scopes.string.Format("@0 @1: @2", events_fs.evento, data.event.hours.toFixed(2), result.message);
				
				if(result.blocking)
				{
					setError(message);
					return false;
				}
				else
					setWarning(message);
			}
		}
	}
	
	return true;
}

/**
 * @param {String} message
 *
 * @properties={typeid:24,uuid:"2B70B436-90E0-4E05-BD1D-5787EA0AC675"}
 */
function setError(message)
{
	message += ' (clicca per nascondere)';
	
	v_error   = true;
	v_message = message;
	
	html_icon = scopes.string.Format(html_icon_template, 'icon-bubble');
	showMessage(message);
}

/**
 * @param {String} message
 *
 * @properties={typeid:24,uuid:"5BD1C889-4C27-4D61-BDE2-AFF710DD95F5"}
 */
function setWarning(message)
{
	v_error   = false;
	v_warning = true;
	v_message = message + ' (click per nascondere)';
	
	html_icon = scopes.string.Format(html_icon_template, 'icon-point-down');
	showMessage(message);
}

/**
 * @param message
 *
 * @properties={typeid:24,uuid:"1013969C-2EDC-4FCD-9BF6-30504406C0BD"}
 */
function showMessage(message)
{
	v_message = message;
	
	elements.icn_info.visible = true;
	elements.icn_info.toolTipText = message;
}

/**
 * @properties={typeid:24,uuid:"863380DD-6FEF-4AAF-94B0-7CD9177C03A8"}
 */
function resetError()
{
	v_error = false;
	v_message = '';
	
	elements.icn_info.visible = false;
	elements.icn_info.toolTipText = '';
}

/**
 * @properties={typeid:24,uuid:"E85C16CD-F4AA-434B-BE9C-F6FA2E801111"}
 */
function resetWarning()
{
	v_warning = false;
	v_message = '';
	
	elements.icn_info.visible = false;
	elements.icn_info.toolTipText = '';
}

/**
 * @param {Number} hours
 *
 * @properties={typeid:24,uuid:"E6AC9FC9-0505-433A-872A-CD0E0E594D54"}
 */
function setWorkedHours(hours)
{
	hours = hours || 0;
	
	v_work_hours = hours;
	// o potevo lavorare, oppure ho lavorato lo stesso (straordinari)
	if(v_workable_hours > 0 || hours > 0)
	{
		v_html_workedhours = scopes.string.Format(workedHoursTemplate, hours.toFixed(2));
		elements.html_workedhours.visible = true;
	}
	else
	{
		v_html_workedhours = workedHoursTemplate;
		elements.html_workedhours.visible = false;
	}
}

/**
 * @param {Number} hours
 *
 * @properties={typeid:24,uuid:"A72F9A4C-248B-4283-A719-96850385EB51"}
 */
function setWorkableHours(hours)
{
	v_workable_hours = hours;
}

/**
 * @param {String} description
 * @param {Number} [workableHours]
 * 
 * @properties={typeid:24,uuid:"FA438CD0-2774-404D-89E5-8BC0C60EDB60"}
 */
function setHoliday(description, workableHours)
{
	v_holiday      = true;
	v_holiday_desc = description;
	
	setWorkableHours(workableHours || 0.00);
}

/**
 * @param dataset
 *
 * @properties={typeid:24,uuid:"F97DAF4B-0414-440F-A2EA-5CDB2C9ABAAA"}
 */
function setEventsDataset(dataset)
{
	v_events_dataset = dataset;
}

/**
 * @properties={typeid:24,uuid:"862B2005-56F0-410E-88D6-6D374714C6D4"}
 */
function setCertificate(code, message)
{
	var disabledMessage = i18n.getI18NMessage('ma.psl.msg.certificate_covered') + ': ' + message;
	
	setEditDisabled(disabledMessage);
	
	elements.lbl_certificate.visible = true;
	elements.lbl_certificate.toolTipText = disabledMessage;
	
	v_certificate = true;
	v_codice_certificato = code;
}

/**
 * @param {String} [message]
 *
 * @properties={typeid:24,uuid:"D7DF70D9-222F-4B5D-80C5-ADE8043EA82B"}
 */
function setEditDisabled(message)
{
	edit_disabled = true;
	if(message)
		disabled_message = message;
}

/**
 * @param {String} [message]
 * 
 * @properties={typeid:24,uuid:"EB527604-5E0B-40EF-890D-9F3E6B40C4DA"}
 */
function disableEdit(message)
{
	message = message || disabled_message;
	
	controller.enabled  = false;
	controller.readOnly = true;
	
	elements.btn_date.toolTipText = elements.btn_day.toolTipText = message;
	elements.chk_selected.visible = false;
	
	var id = plugins.WebClientUtils.getElementMarkupId(elements.btn_date);
	
	plugins.WebClientUtils.setExtraCssClass(elements.btn_day, 'day day-edit-disabled');
	plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('$("#@0").attr("title", "@1");', id, message));
}

/**
 * @properties={typeid:24,uuid:"9B8C0AF1-81EC-4A97-9E72-71745EEC7530"}
 */
function hasCertificate()
{
	return v_certificate;
}

/**
 * @properties={typeid:24,uuid:"A5E3AEBA-3236-4FDC-968F-2DF7764590CA"}
 */
function isHoliday()
{
	return v_holiday;
}

/**
 * @properties={typeid:24,uuid:"9DFDCC63-A2B1-4A6E-9EA7-7BFFD5CAB10B"}
 */
function getWorkHours()
{
	return v_work_hours;
}

/**
 * @properties={typeid:24,uuid:"E39DA188-D04B-4CE9-A324-B26AC4D1BA52"}
 */
function getWorkableHours()
{
	return v_workable_hours || 0;
}

/**
 * @param {Array<Number>} idsToExclude
 * 
 * @properties={typeid:24,uuid:"E6C2914D-FAD0-4D79-937B-01C198076D7F"}
 */
function getEventsHours(idsToExclude)
{
	var eventsHours = 0, events = getEvents();
	
	if(idsToExclude && idsToExclude.length > 0)
		events = events.filter(function(e){ return idsToExclude.indexOf(e.id) == -1; });
	
	events.forEach(function(e){ eventsHours += e.hours; });
	
	return eventsHours;
}

/**
 * @param field
 * @param c
 *
 * @properties={typeid:24,uuid:"8D136248-7631-4D21-B17A-C7AB37CD35DF"}
 */
function addConstraint(field, c)
{
	constraints[field] = constraints[field] || [];
	constraints[field].push(c);
}

/**
 * @properties={typeid:24,uuid:"99303517-2331-4AA2-96A1-F24E7D679036"}
 */
function getTotalHours()
{
	var total = 0;
	v_events.forEach(function(e){ total += e.hours; });
	
	return total;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"4423AF9F-51C6-466A-A17E-243B2C2C71A4"}
 */
function onAction$icn_info(event) 
{
	if(v_error)
		resetError();
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"76C15724-ED78-4CAC-9E73-B567002CB7EC"}
 */
function onShow(firstShow, event)
{
	return;
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"11C54ED3-01EE-4D2E-A840-7145B71ECB5A"}
 */
function onDataChange$chk_selected(oldValue, newValue, event)
{
	for(var l in v_listeners.onselectionchange)
		if(!v_listeners.onselectionchange[l](oldValue, newValue, event))
			return false;
	
	return true;
}

/**
 * @properties={typeid:24,uuid:"BF58E627-221E-4A2E-BDE4-6ADF6C49F94A"}
 */
function disableSelection()
{
	unselect();
	elements.chk_selected.visible = false;
}

/**
 * @param {String} event
 * @param 		   name
 * @param 		   func
 *
 * @properties={typeid:24,uuid:"6CA80EF4-C99C-4D7A-8F9C-894916C3B71D"}
 */
function registerListener(event, name, func)
{
	if(!event)
		throw new Error('Parameter [event] must be provided');
	
	if(!name)
		throw new Error('Parameter [name] must be provided');
	
	if(!func)
		throw new Error('Parameter [func] must be provided');
	
	if(v_listeners[event] && !v_listeners[event][name])
		v_listeners[event][name] = func;
}