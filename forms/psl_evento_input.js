/**
 * @properties={typeid:35,uuid:"472F5949-A58C-48D6-9575-50790F4B09FE",variableType:-4}
 */
var events_fs = datasources.db.ma_presenze.e2eventi.getFoundSet();

/**
 * @properties={typeid:35,uuid:"62D033C8-3F91-453B-A124-C1DB329A5626",variableType:-4}
 */
var save = true;

/**
 * @properties={typeid:35,uuid:"E5106407-4B56-40A3-BADD-1C910F6E5CD7",variableType:-4}
 */
var returnValue = null;

/**
 * @type {Continuation}
 * 
 * @properties={typeid:35,uuid:"4A8BDABB-D68F-4CBF-9642-80EE8DEF8C86",variableType:-4}
 */
var continuation = null;

/**
 * @type {Function}
 *
 * @properties={typeid:35,uuid:"B89115FE-128A-42B8-969A-369973AADCF8",variableType:-4}
 */
var constraints = { };

/**
 * @properties={typeid:35,uuid:"8B39BFB5-BA04-4FB9-BEDA-B26EA7C95FAF",variableType:-4}
 */
var events = [];

/**
 * @properties={typeid:35,uuid:"A32424CC-A269-4747-86A8-A702E001A9A8",variableType:-4}
 */
var v_warning = false;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"43E61956-BBD5-4EF5-8D93-E2616FF3F3C4",variableType:-4}
 */
var v_edit = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9607319A-A875-406A-BB45-9ABFFD72B23F"}
 */
var v_html = '<html>\
					<script type="text/javascript">\
						function removeSelectedDay()\
						{\
							$(".day-selected").removeCssClass("day-selected");\
						}\
					</script>\
			  	</html>';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5A5DBDCC-1583-46F8-8230-123288A047DA",variableType:8}
 */
var v_hours = null;

/**
 * @properties={typeid:35,uuid:"413E988A-2E27-4844-AE21-B31820BA0169",variableType:-4}
 */
var v_max_hours = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7F9831CF-0B44-4611-95E4-D8E7F78BFC96",variableType:4}
 */
var v_event_id = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"58F7B8F4-B430-4AA6-8979-E4B5C18058BB"}
 */
var v_event_type = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7ACFA3ED-DE98-4E25-B48D-BF9E8F646649",variableType:4}
 */
var v_whole_day = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"43ADAB81-24A0-4E93-A216-CF03022B49DA"}
 */
var input_evento_id = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"4DF02B67-F3D3-4792-A6A9-AAA58E5049E1"}
 */
var input_ore_id = '';

/**
 * @return {{ event: { id: Number, type: String, hours: Number, whole_day: Number } }}
 * 
 * @properties={typeid:24,uuid:"807668AD-C6C7-4F48-8874-5544B8BC77D6"}
 */
function getData()
{
	return { event: { id: v_event_id, type: v_event_type, hours: v_hours, whole_day: v_whole_day } };
}

/**
 * @properties={typeid:24,uuid:"622402AC-97A7-4FFC-A6FE-34EC8DC7FBC9"}
 */
function setData(data)
{
	v_hours      = data.event.hours;
	v_event_id   = data.event.id;
	v_whole_day  = data.event.whole_day;
	v_event_type = data.event.type;
	
	updateInputOre(v_whole_day);	
}

/**
 * @properties={typeid:24,uuid:"F541A18C-E426-49A2-949B-D7E8895A6E25"}
 */
function validateData()
{
	return v_event_id && (v_hours || v_whole_day);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param edit
 *
 * @properties={typeid:24,uuid:"2BABD710-67FC-45F2-A7D9-1DCDAB753A67"}
 */
function setEdit(edit)
{
	v_edit = edit;
}

/**
 * @properties={typeid:24,uuid:"484357A2-2071-4422-BC56-B9A38F0272F1"}
 */
function clear()
{
	v_hours = v_max_hours = v_event_id = v_whole_day = null;
	
	elements.input_ore.enabled = true;
	enableCheckWholeDay();
}

/**
 * @properties={typeid:24,uuid:"CCF7FEE4-55CB-4A55-B691-9E935022387A"}
 */
function clearConstraints()
{
	constraints = { };
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
 * @properties={typeid:24,uuid:"1D9D31AA-4453-4670-BAD1-40046712C60F"}
 */
function onDataChange$input_ore(oldValue, newValue, event) 
{
	return true;
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
 * @properties={typeid:24,uuid:"A0BF7F0C-4C84-425E-80BE-08EC8860921F"}
 * @AllowToRunInFind
 */
function onDataChange$input_evento(oldValue, newValue, event)
{
	events_fs.loadRecords(newValue);		
	setEventType(events_fs.e2eventi_to_e2eventiclassi.tipo);
	
	return true;
}

/**
 * @properties={typeid:24,uuid:"F4538DF8-A74B-4C0A-8A32-850DE8B858E1"}
 */
function updateEvento(evento)
{
	if(evento)
		v_event_id = evento.idevento;
}

/**
 * @properties={typeid:24,uuid:"73925A17-2EED-42C8-A611-4207AA31229C"}
 */
function lookupEvento(event)
{
	return globals.ma_utl_showLkpWindow
	(
		{
			event: event,
			lookup: 'LEAF_Lkp_Eventi',
			fieldToReturn: 'idevento',
			methodToAddFoundsetFilter: 'filterEvents',
			allowInBrowse: true,
			returnFullRecords: true
		}
	);
}

/**
 * @properties={typeid:24,uuid:"1FE20751-E9EC-4C99-93EB-A94E3548478B"}
 */
function filterEvents(fs)
{
	var ids = application.getValueListItems('vls_evento').getColumnAsArray(2);
	fs.addFoundSetFilterParam('idevento', globals.ComparisonOperator.IN, ids);

	return fs;
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"934B83C9-58E7-411F-A2BB-7D7F59DC6183"}
 */
function onLoad(event)
{
	input_ore_id    = '#' + plugins.WebClientUtils.getElementMarkupId(elements.input_ore);
	input_evento_id = '#' + plugins.WebClientUtils.getElementMarkupId(elements.input_evento);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E9187E8E-B403-42F5-9772-8B92435CAA97"}
 */
function onAction$btn_cancel(event) 
{
	save = false;
	hide();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D61CD83A-8588-4978-92E2-4AE9F5C1E286"}
 */
function onAction$btn_lookup(event) 
{
	updateEvento(lookupEvento(event));
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8B51794F-BD16-4688-BED1-CA773A6C0986"}
 */
function onShow(firstShow, event)
{
	elements.lbl_warning.visible = false;
	elements.input_evento.requestFocus();
}

/**
 * @param [x]
 * @param [y]
 * 
 * @return {{ event: { id: Number, code: String, type: String, hours: Number, whole_day: Boolean } }}
 * 
 * @properties={typeid:24,uuid:"8F0CEC8A-B005-49EE-81A1-4E5B5485B0F3"}
 */
function show(x, y)
{	
	continuation = new Continuation();
	
	var windowName = 'w_psl_input_evento_' + application.getUUID();
	var window = application.createWindow(windowName, JSWindow.MODAL_DIALOG);
		window.undecorated = true;
		window.title = '';
		window.resizable = false;
		window.setInitialBounds(x || -1, y || -1, 400, 300);
		window.transparent = true;

	controller.show(window);
	globals.terminator();
	
	return null;
}

/**
 * @properties={typeid:24,uuid:"2D2F28CD-87FE-47B6-8C7B-C1AAEBEFB2A6"}
 */
function hide()
{
	var window = controller.getWindow();
	if (window && window.isVisible())
	{
		if(window.hide())
		{
			window.destroy();
			if(continuation && scopes.utl.IsWebClient())
				continuation(save ? getData() : null);
		}			
	}
}

/**
 * @properties={typeid:24,uuid:"4320BFE6-3D56-45A5-856C-F074276CC9DF"}
 */
function setConstraints(cons, evs)
{
	constraints = cons;
	events = evs;
}

/**
 * @properties={typeid:24,uuid:"CDFC7941-FC3C-4A0A-BBA5-2BE632AF4B4D"}
 */
function getHoursFieldName()
{
	return elements.input_ore.getName();
}

/**
 * @param {Number} maxHours
 *
 * @properties={typeid:24,uuid:"DE6D84FC-BBAE-4276-A4D6-45ABC162728D"}
 */
function setMaxHours(maxHours)
{
	v_max_hours = maxHours;
}

/**
 * @param {String} type
 *
 * @properties={typeid:24,uuid:"9E2228F6-033C-4C45-BB2E-82F3EE155A06"}
 */
function setEventType(type)
{
	v_event_type = type;
	
	if(type == globals.TipologiaEvento.AGGIUNTIVO)
		disableCheckWholeDay();
	else
		enableCheckWholeDay();
}

/**
 * @properties={typeid:24,uuid:"92595DB8-15CC-4643-84D0-B560EFC13EAE"}
 */
function disableCheckWholeDay()
{
	elements.chk_whole_day.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"3AE5BB4B-B72F-42FF-BEC7-941B75209BFF"}
 */
function enableCheckWholeDay()
{
	elements.chk_whole_day.enabled = true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D524C33B-FC90-4B44-905D-B4277912A2A2"}
 */
function onAction$input(event) 
{
	if(v_event_id && v_hours >= 0 && !v_warning)
	{
		save = true;
		hide();
	}
	
	v_warning = false;
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
 * @properties={typeid:24,uuid:"03088B10-136F-429A-BF4B-F75D2E5C5139"}
 */
function onDataChange$input(oldValue, newValue, event)
{
	if(newValue >= 0)
		return enforceConstraints(event.getElementName());

	v_whole_day = 0;
	return true;
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
 * @properties={typeid:24,uuid:"C3C47C19-9A38-4F61-B190-4DA28941909F"}
 */
function onDataChange$whole_day(oldValue, newValue, event) 
{
	updateInputOre(newValue);
	
	var success = enforceConstraints(elements.input_ore.getName());
	if(!success)
		elements.input_ore.enabled = true;
		
	
	return success;
}

/**
 * @param wholeDay
 *
 * @properties={typeid:24,uuid:"E8A75CC8-ADCD-4171-88B0-820C4DC36D5C"}
 */
function updateInputOre(wholeDay)
{
	if(wholeDay)
	{
		v_hours = v_max_hours;
		elements.input_ore.enabled = false;
	}
	else
		elements.input_ore.enabled = true;
}

/**
 * @param element
 *
 * @properties={typeid:24,uuid:"00CA64E5-71EA-4211-8F53-A91E963837B3"}
 */
function enforceConstraints(element)
{
	var data = getData();
	for(var c = 0; constraints[element] && c < constraints[element].length; c++)
	{
		/** @type {{ error: Boolean, blocking: Boolean, message: String }} */
		var result = constraints[element][c](data, !v_edit, events, v_max_hours);
		elements.lbl_warning.toolTipText = result.message;
		
		if(result.error)
		{
			v_warning = !result.blocking;
			
			elements.lbl_warning.imageURL = v_warning ? 'media:///Warning.gif' : 'media:///Error.gif';
			elements.lbl_warning.visible = true;
			
			return v_warning;
		}
	}
	
	elements.lbl_warning.visible = false;
	return true;
}

/**
 * @param {String} message
 *
 * @properties={typeid:24,uuid:"DC5BF718-0EF9-4C80-AD44-21B8D6783711"}
 */
function setError(message)
{
	elements.lbl_warning.imageURL    = 'media:///Error.gif';
	elements.lbl_warning.visible     = true;
	elements.lbl_warning.toolTipText = message;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"34A9A5EF-BAB3-4AB0-AFE6-B028E418AAA1"}
 */
function onAction$btn_confirm(event) 
{
	if(validateData())
	{
		save = true;
		hide();
	}
	else
		setError('Inserire i dati');
}
