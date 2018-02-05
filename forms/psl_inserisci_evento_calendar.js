/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"36622D50-C0BB-43E5-9A26-A976A235BB99",variableType:4}
 */
var v_last_tab = 42;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D5722B94-E858-4069-BFD8-88311F19D2DA",variableType:4}
 */
var v_last_week = 6;

/**
 * @type {JSDataSet}
 *
 * @properties={typeid:35,uuid:"C123B8EC-AA24-4905-8705-D74B93867D36",variableType:-4}
 */
var v_events_dataset = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3363B2D3-4C1C-4B05-970B-874B585D8EB9"}
 */
var v_html = '';

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"E05B4D1A-EC90-45FB-A73C-4DB1F2A687FF",variableType:93}
 */
var v_month;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"68829200-83DF-4B4E-AEF8-F4E4F631378F",variableType:4}
 */
var v_select_all = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B64485ED-D362-44E8-AFB4-667257369FAF",variableType:8}
 */
var v_week_1 = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"EEFAAD93-BB53-4636-9771-7E7C34E2E388",variableType:4}
 */
var v_week_2 = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F772A5D5-232F-4F53-B0F1-1E3DFBB9D36D",variableType:4}
 */
var v_week_3 = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F282B22F-AA07-4F79-B484-E09FD75D101E",variableType:4}
 */
var v_week_4 = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"BB9A0398-A21D-4E4F-B8E1-1FD3024F4C91",variableType:4}
 */
var v_week_5 = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"257A5233-A405-420E-8F28-713712CCFBF8",variableType:4}
 */
var v_week_6 = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C746723A-27E9-402B-B79B-716A6FCA5345",variableType:4}
 */
var v_offset = 0;

/**
 * {{ ondatachange: Array<Function> }}
 * 
 * @properties={typeid:35,uuid:"ABAC661A-D590-40C2-80FA-847CEE4EF382",variableType:-4}
 */
var v_listeners = { ondatachange: [] };

/**
 * @properties={typeid:24,uuid:"9D49A0B8-29A7-47A3-835F-EA8631955B6F"}
 */
function hideLastWeek()
{
	elements.chk_week_6.visible = false;
	v_last_week = 5;
}

/**
 * @properties={typeid:24,uuid:"C2E4A647-8448-470C-B0CB-D1AB5A4D61D5"}
 */
function showLastWeek()
{	
	elements.chk_week_6.visible = true;
	v_last_week = 6;
}

/**
 * @properties={typeid:24,uuid:"2CF451FB-ED1D-485E-822A-0C37A5ADD089"}
 */
function disable()
{
	for(var day = scopes.date.FirstDayOfMonth(v_month); day <= scopes.date.LastDayOfMonth(v_month); day = scopes.date.AddDay(day))
	{
		getTabForDay(day).setEditDisabled();
		disableTab(day);
	}
	
	disableMultipleSelection();	
	updateTabStatus();
}

/**
 * @properties={typeid:24,uuid:"C4377EB8-B577-4B8B-BFCE-913CB63B72AB"}
 */
function enable()
{
	enableMultipleSelection();
	updateTabStatus();
}

/**
 * @properties={typeid:24,uuid:"5376F692-233A-4541-B76C-D42E955CB8C4"}
 */
function updateTabStatus()
{
	for(var t = 1; t <= v_last_tab; t++)
	{
		var tab = getTabAt(t);
		if (tab.isEditDisabled())
			tab.disableEdit();
		else
		if (tab.isDisabled())
			tab.disable();
	}
}

/**
 * @properties={typeid:24,uuid:"E534048F-676B-4FE9-B35B-5CD8338607C7"}
 */
function disableMultipleSelection()
{
	elements.chk_week_1.enabled     =
	elements.chk_week_2.enabled     = 
	elements.chk_week_3.enabled     = 
	elements.chk_week_4.enabled     = 
	elements.chk_week_5.enabled     = 
	elements.chk_week_6.enabled     = 
	elements.chk_select_all.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"6576ABD0-4567-4F02-9270-BA7055553C27"}
 */
function enableMultipleSelection()
{
	elements.chk_week_1.visible     =
	elements.chk_week_2.visible     = 
	elements.chk_week_3.visible     = 
	elements.chk_week_4.visible     = 
	elements.chk_week_5.visible     = 
	elements.chk_select_all.visible = true;
	
	elements.chk_week_6.visible     = v_last_week == 6;
}

/**
 * @param {Date} 										month			il periodo di elaborazione considerato
 * @param {Array<{  data       : Date, 
 * 					tipo       : String,
 *                  [codice]     : String,
 *                  [descrizione] : String
 * 				 }>  }                                  festivita		l'elenco dei giorni di festa
 * @param {Object}										hours	        un oggetto contenente, per ogni lavoratore e per ogni giorno, i dettagli sulle ore
 * @param {JSDataSet} 									eventsDataset	il dataset contenente gli eventi selezionabili per giorno
 * @param {Array<{  
 *                  codice : String,
 *                  descrizione : String, 
 *                  datainizio: Date, 
 * 					datafine: Date}>  }  				certificati		l'elenco dei giorni coperti da certificato
 * @param {Date} 										assunzione		la data di assunzione del lavoratore
 * @param {Date} 										cessazione		la data di cessazione del lavoratore
 * 
 * @return {RuntimeForm<psl_inserisci_evento_calendar>}
 *
 * @properties={typeid:24,uuid:"AF4EB464-BADD-4210-AF19-67EB984A29C0"}
 */
function init(month, festivita, hours, eventsDataset, certificati, assunzione, cessazione)
{	
	/**
	 * 0. Imposta le variabili di form
	 */
	v_month          = month;
	v_events_dataset = eventsDataset;
	
	/**
	 * 0.1 Imposta le variabili di calcolo
	 */
	var prevMonth = new Date(month);
		prevMonth.setMonth(prevMonth.getMonth() - 1);
		
	var firstDay = scopes.date.FirstDayOfMonth(month);
	var lastDay  = scopes.date.LastDayOfMonth(month);
		
	// find the offset if the week does not start on monday:
	//
	//				  Sun, Mon, Tue, Wed, Thu, Fri, Sat
	// date.getDay():   0,   1,   2,   3,   4,   5,   6
	// what we want:    6,   0,   1,   2,   3,   4,   5
	var offset      = v_offset = [6, 0, 1, 2, 3, 4, 5][firstDay.getDay()];
	var lastTab     = v_last_tab;
	var lastDayWeek = Math.ceil((lastDay.getDate() + offset) / 7);
	
	/**
	 * 1. Nascondi l'ultima settimana se superflua
	 */
	if(offset == 0 || lastDayWeek < 6)
	{
		hideLastWeek();
		lastTab = 35;
	}
	else
	{
		showLastWeek();
		lastTab = 42;
	}
	
	v_last_tab = lastTab;
	
	var tab_no;
	for(tab_no = 42; tab_no > lastTab; tab_no--)
		hideDay(tab_no);
	
	/**
	 * 2. Disegna il calendario
	 */
	drawCalendar(firstDay, lastDay, hours, eventsDataset, certificati, festivita, assunzione, cessazione);
	
	/**
	 * 4. Imposta l'html per la gestione dell'interfaccia
	 */
	setHtml();
	
	return this;
}

/**
 * @param {Date}										firstDay
 * @param {Date}										lastDay
 * @param 												hours
 * @param {JSDataSet} 									eventsDataset	il dataset contenente gli eventi selezionabili per giorno
 * @param {Array<{  codice      : String, 
 * 					descrizione : String,
 * 					datainizio  : Date,
 * 					datafine    : Date }>}  			certificati		l'elenco dei giorni coperti da certificato
 * @param {Array<{  data        : Date, 
 *                  codice      : String,
 * 					tipo        : String, 
 * 					descrizione : String	}>} 		festivita		l'elenco dei giorni di festa
 * @param {Date} 										assunzione
 * @param {Date} 										cessazione
 * 
 * @properties={typeid:24,uuid:"25A2C326-9ED1-48A5-A86E-F86018D04266"}
 */
function drawCalendar(firstDay, lastDay, hours, eventsDataset, certificati, festivita, assunzione, cessazione)
{
	var /** @type {RuntimeTabPanel} */panel, dayForm;
	var giorniFestivi = festivita.filter(function(_){ return firstDay <= _.data && _.data <= lastDay; })
								 .map   (function(_){ return _.data.getDate(); });

	var day = new Date(firstDay)
		day.setDate(day.getDate() - v_offset);
	
	/**
	 * 2. Disegna i giorni del calendario
	 */
	for(var tabNo = 1; tabNo <= v_last_tab; tabNo++)
	{
		showDay(tabNo);
		
		var dayISO = utils.dateFormat(day, globals.ISO_DATEFORMAT);
		
		var weekNo           = Math.ceil(tabNo / 7);
		var colNo            = Math.ceil((tabNo - 1) % 7) + 1;
		var dayWorkableHours = hours[dayISO] && hours[dayISO].workable_hours;
		
		dayForm = forms.psl_inserisci_evento_calendar_day.getInstanceForDay(day);
		/** @type {RuntimeForm<psl_inserisci_evento_calendar_day>} */
		var form = forms[dayForm.name];
			form.v_day = day;
			form.registerListener(scopes.events.Listeners.ON_SELECTIONCHANGE, 
								  'update_week_selection_' + controller.getName(), 
								  (function(_weekNo, _form) {
										return function(oldValue, newValue, event)
											   {
												   forms[_form]['v_week_' + _weekNo] = getWeekSelection(_weekNo).length > 0 ? 1 : 0;
												   v_select_all = getSelectedDays().length > 0;
												   
												   return true;
											   }
									})(weekNo, controller.getName()));
			
		panel = elements['tab_day_'+ tabNo];
		panel.removeAllTabs();
		panel.addTab(dayForm.name);
		
		var cssClasses = computeCssClassesForDay(day, tabNo, weekNo, colNo);
		var nonAssunto = (assunzione && day < assunzione) || (cessazione && day > cessazione);
		
		// Disabilita i giorni extra mese
		if(tabNo <= v_offset || day > lastDay)
		{
			cssClasses.push('day-tab-disabled');
			disableDay(tabNo);
		}
		else
		if (nonAssunto)
		{
			cssClasses.push('day-tab-disabled');
			disableDayWithReason(tabNo, 'Dipendente non in forza');
		}			
		else
		{
			enableDay(tabNo);
			
			var index = giorniFestivi.indexOf(day.getDate());
			if (index > -1)
			{
				var festa = festivita[index];

				if (scopes.utl.Trim(festa.tipo) == globals.TipoFestivita.GODUTA)
					form.setHoliday(festa.descrizione);
				else
					form.setHoliday(festa.descrizione, dayWorkableHours);
				
				form.setEventsDataset(scopes.psl.EventiAmmessiInGiornoDiFesta(eventsDataset, festa, dayWorkableHours));
				cssClasses.push('day-tab-holiday');
			}
			else
			{
				form.setWorkableHours(dayWorkableHours);
				form.setEventsDataset(eventsDataset);
			}
			
			/**
			 * Disabilita il giorno se coperto da certificato
			 */
			var certificatiDelGiorno = certificati.filter(function(_){ return _.datainizio <= day && day <= _.datafine; });
			if (certificatiDelGiorno.length > 0)
			{
				var code = '';
				if(certificatiDelGiorno.length > 1)
					code = 'XX';
				else
					code = certificatiDelGiorno[0].codice;
				
				form.setCertificate(code, certificatiDelGiorno.map(function(_){ return _.descrizione; }).join(', '));
				cssClasses.push('covered-by-certificate');
			}
		}
		
		if(form.isEnabled())
			cssClasses = cssClasses.concat(getExtraCssClasses(v_month, giorniFestivi, day));
		
		setCssClasses(panel, cssClasses.join(' '));
		
		// go to the next day
		day.setDate(day.getDate() + 1);
	}
}

/**
 * @param day
 * @param tabNo
 * @param weekNo
 * @param colNo
 *
 * @properties={typeid:24,uuid:"8BDD4240-32FD-4479-8229-04A84B85E58E"}
 */
function computeCssClassesForDay(day, tabNo, weekNo, colNo)
{
	var cssClasses  = 
	[
		'day-tab',
		'day-tab-' + tabNo,
		'day-tab-week-' + weekNo,
		'row-' + (weekNo % 2 == 0 ? 'even' : 'odd'),
		'day-tab-col-' + colNo,
		'col-' + (colNo % 2 == 0 ? 'even' : 'odd'),
	];

	if(day.getDay() == 6)	// saturday
		cssClasses.push('day-saturday');
	else
	if(day.getDay() == 0)	// sunday
		cssClasses.push('day-sunday');
	
	return cssClasses;
}

/**
 * @properties={typeid:24,uuid:"C826D5F7-79DB-48F2-9B30-1912294C72DF"}
 */
function setHtml()
{
	v_html = '<script type="text/javascript">\
		$(document).ready(function()\
			{\
				$("div.day-tab").not(".day-tab-disabled").click(\
					function(e)\
					{\
						$("div.day-selected").removeClass("day-selected");\
						$(this).find("div.day, div.day-edit-disabled").removeClass("day-selectable").addClass("day-selected");\
						$("div.day-tab-selected").removeClass("day-tab-selected");\
						$(this).addClass("day-tab-selected");\
					}\
				);\
				\
				var height = $("div.day-tab").height();\
				var z_index = $("div.day-tab").css("z-index");\
				$("div.day-tab").not(".day-tab-disabled").hover(\
					function(e)\
					{\
						$(this).find("div.day, div.day-edit-disabled").not(".day-selected").addClass("day-selectable");\
						\
						var child = $(this).find("div.events");\
						var child_scroll_height = child.prop("scrollHeight");\
						var child_height = child.innerHeight();\
						\
						if (child_scroll_height > child_height)\
						{\
							$(this).css("overflow", "visible");\
							$(this).css("z-index", 9999);\
							$(this).animate({ height: 3 + $(this).height() + (child_scroll_height - child_height) });\
						}\
					},\
					(function(_height, _z_index){\
						return function(e)\
						{\
							$(this).find("div.day, div.day-edit-disabled").removeClass("day-selectable");\
							$(this).animate(\
								{ height: _height },\
								{\
									complete: function(){\
										$(this).css("overflow", "hidden");\
										$(this).css("z-index", _z_index);\
									}\
								}\
							);\
						}\
					})(height, z_index)\
				);\
			}\
		);\
	</script>';
	
	plugins.WebClientUtils.setExtraCssClass(elements.lbl_monday, 'day-header day-header-monday day-tab-odd');
	plugins.WebClientUtils.setExtraCssClass(elements.lbl_tuesday, 'day-header day-header-tuesday day-tab-even');
	plugins.WebClientUtils.setExtraCssClass(elements.lbl_wednesday, 'day-header day-header-wednesday day-tab-odd');
	plugins.WebClientUtils.setExtraCssClass(elements.lbl_thursday, 'day-header day-header-thursday day-tab-even');
	plugins.WebClientUtils.setExtraCssClass(elements.lbl_friday, 'day-header day-header-friday day-tab-odd');
	plugins.WebClientUtils.setExtraCssClass(elements.lbl_saturday, 'day-header day-header-saturday day-tab-even');
	plugins.WebClientUtils.setExtraCssClass(elements.lbl_sunday, 'day-header day-header-sunday day-tab-odd');
}

/**
 * @param {Array<Number>} selection
 *
 * @properties={typeid:24,uuid:"11A0A79C-E744-49E2-B24E-A44991811203"}
 */
function updateSelection(selection)
{
	resetSelection();
	setSelectedDays(selection, v_offset);
	v_select_all = selection && selection.length > 0;
}

/**
 * @properties={typeid:24,uuid:"6EF2DFB9-9875-4EB8-B447-EACD6EE4BCED"}
 */
function resetSelection()
{
	selectNone();
}

/**
 * @properties={typeid:24,uuid:"6AD96715-215D-4650-A465-7337D23C3435"}
 */
function getExtraCssClasses(month, festivita, day)
{
	if (festivita.indexOf(day.getDate()) > -1)
		return ['day-disabled'];
	else
		return [];
}

/**
 * @param day
 *
 * @properties={typeid:24,uuid:"C6FA7019-57EF-4A6A-A889-6A89115AB1B0"}
 */
function isDaySelectable(day)
{
	return day >= scopes.date.FirstDayOfMonth(v_month) && day <= scopes.date.LastDayOfMonth(v_month)
}

/**
 * @param {Number} tabNo
 * @param {String} message
 *
 * @properties={typeid:24,uuid:"62F2727C-A12F-472B-B28B-14D13545AC43"}
 */
function disableDayWithReason(tabNo, message)
{
	var tab = getTabAt(tabNo);		
		tab.setDisabled(message);
		
	tab.setWorkableHours(0);
}

/**
 * @param tabNo
 *
 * @properties={typeid:24,uuid:"9A3DF069-885E-4B8A-9FB0-94A70066FD5E"}
 */
function disableDay(tabNo)
{
	disableDayWithReason(tabNo, '');
}

/**
 * @param {Date} day
 *
 * @properties={typeid:24,uuid:"7E7849C0-7398-40F6-BCC5-976ED15EFBBC"}
 */
function disableTab(day)
{
	var id = plugins.WebClientUtils.getElementMarkupId(getContainerForDay(day));
	var js = scopes.string.Format('$("#@0").addClass("day-tab-disabled")\
			  		  					   .find("li.evento").addClass("disabled");', id);
	
	plugins.WebClientUtils.executeClientSideJS(js);
}

/**
 * @param {Number} tabNo
 *
 * @properties={typeid:24,uuid:"CE698BB8-2F6A-4291-BA1B-E9CB199139D8"}
 */
function getContainerForTab(tabNo)
{
	return elements['tab_day_' + tabNo];
}

/**
 * @param {Date} day
 *
 * @properties={typeid:24,uuid:"07633253-6E90-4BD9-9930-8F5A37CD6E9E"}
 */
function getContainerForDay(day)
{
	return getContainerForTab(day.getDate() + v_offset);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param day
 *
 * @properties={typeid:24,uuid:"4EE28AB0-E6F8-4FE1-B8E1-35A4ACE1A3CA"}
 */
function hideDay(day)
{
	/** @type {RuntimeTabPanel} */
	var tab = elements['tab_day_' + day];
		tab && (tab.visible = false);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param day
 *
 * @properties={typeid:24,uuid:"5F95F163-89B5-4B1A-8465-1C3C83E2D63C"}
 */
function showDay(day)
{
	/** @type {RuntimeTabPanel} */
	var tab = elements['tab_day_' + day];
		tab && (tab.visible = true);
}

/**
 * @param day
 *
 * @properties={typeid:24,uuid:"ABBC9AEA-EBD1-4F82-8865-E4B76D5E1724"}
 */
function enableDay(day)
{
	/** @type {RuntimeTabPanel} */
	var tab = elements['tab_day_' + day];
		tab.enabled = true;
	
	getTabAt(day).enable();
}

/**
 * @param element
 * @param {String} classes
 *
 * @properties={typeid:24,uuid:"B1B54208-FCDF-454B-B9A2-1AAB6D45E1A4"}
 */
function setCssClasses(element, classes)
{
	plugins.WebClientUtils.removeExtraCssClass(element);
	plugins.WebClientUtils.setExtraCssClass(element, classes);
}

/**
 * @properties={typeid:24,uuid:"52D2BB4F-E08E-402B-B8DA-9BF6095473C7"}
 */
function getData()
{
	var data = { };
	
	for(var day = scopes.date.FirstDayOfMonth(v_month); day <= scopes.date.LastDayOfMonth(v_month); day = scopes.date.AddDay(day))
	{
		var tab     = getTabForDay(day);
		var dayData = tab.getData();
		
		data[utils.dateFormat(day, globals.ISO_DATEFORMAT)] = { 
			events: dayData.events || [], 
			worked_hours: dayData.worked_hours || null,
			workable_hours: dayData.workable_hours || null,
			warning: dayData.warning,
			message: dayData.message
		};
	}
	
	return data;
}

/**
 * @param data
 *
 * @properties={typeid:24,uuid:"30D9B011-2791-4438-B39D-D1B30E257532"}
 */
function setData(data)
{
	for(var tab_no = 1; tab_no <= v_last_tab; tab_no++)
	{
		var tab = getTabAt(tab_no);
		if (tab)
		{
			tab.clear();
	
			/** @type {{ events: Array, worked_hours: Number, workable_hours: Number, warning: Boolean, error: Boolean, message: String }} */
			var dayData = data[utils.dateFormat(tab.v_day, globals.ISO_DATEFORMAT)];
			if (dayData)
			{
				var events = dayData.events;
					events = disableEvents(events);
			
				tab.setData(events);
				
				if(dayData.warning)
					tab.setWarning(dayData.message);
				
				if(dayData.error)
					tab.setError(dayData.message);
			}
		}
	}
}

/**
 * @param events
 *
 * @properties={typeid:24,uuid:"B1328B20-B92C-4CA5-BE99-9077875C6707"}
 */
function disableEvents(events)
{
	return events;
}

/**
 * @param {Date} day
 * 
 * @return {RuntimeForm<psl_inserisci_evento_calendar_day>}
 *
 * @properties={typeid:24,uuid:"F02213DF-D380-4491-AEBB-51888862ABB4"}
 */
function getTabForDay(day)
{
	/** @type {RuntimeForm<psl_inserisci_evento_calendar_day>} */
	var form = forms[elements['tab_day_' + (day.getDate() + v_offset)].getTabFormNameAt(1)];
	return form;
}

/**
 * @param {Number} date
 *
 * @properties={typeid:24,uuid:"812B3435-2F96-4833-BA4E-20864D8F7EFD"}
 */
function getTabForDate(date)
{
	/** @type {RuntimeForm<psl_inserisci_evento_calendar_day>} */
	var form = forms[elements['tab_day_'+ (date + v_offset)].getTabFormNameAt(1)];
	return form;
}

/**
 * @param {Number} index
 *
 * @properties={typeid:24,uuid:"CB0B3C33-1779-4A4B-ABAE-11EA776BDD7B"}
 */
function getTabAt(index)
{
	/** @type {RuntimeForm<psl_inserisci_evento_calendar_day>} */
	var form = forms[elements['tab_day_'+ index].getTabFormNameAt(1)];
	return form;
}

/**
 * @return {RuntimeForm<psl_inserisci_evento_calendar_day>}
 * 
 * @properties={typeid:24,uuid:"DBF4F2F3-73D1-40AA-8A0C-AF91FCF7A841"}
 */
function getTabs()
{
	/** @type {RuntimeForm<psl_inserisci_evento_calendar_day>} */
	var tabs = [];
	for(var t = 1; t <= v_last_tab; t++)
		tabs.push(getTabAt(t));
	
	return tabs;
}

/**
 * @properties={typeid:24,uuid:"B19C25BC-4FBD-47C3-BD68-3CD6158DF1DA"}
 */
function clear()
{
	for(var day = new Date(v_month); day <= scopes.date.LastDayOfMonth(v_month); day.setDate(day.getDate() + 1))
		getTabForDay(day).clear();
}

/**
 * @param 					data
 * @param {Array<Function>} constraints
 *
 * @properties={typeid:24,uuid:"8E5FD752-DA89-4F98-9691-61A35B010E01"}
 */
function setConstraints(data, constraints)
{
	for(var item in data)
	{
		var day = utils.parseDate(item, globals.ISO_DATEFORMAT);
		if(!day)
			continue;
		
		var workableHours = data[item] && data[item].workable_hours;
		var tab           = getTabForDay(day);
		
		// handle constraints for the input
		for(var c = 0; c < constraints.length; c++)
			tab.setHoursConstraint
			(
				(function(_tab, _workableHours){ return constraints[c](_tab, _workableHours); })(tab, workableHours)
			);
	}
}

/**
 * @properties={typeid:24,uuid:"0C0D3009-1050-44EC-970C-85EAF419F02C"}
 */
function aggiungiEventoMultiplo()
{
	var selectedDays = getSelectedDays();
	if (selectedDays.length == 0)
	{
		forms.psl_status_bar.setStatusError('Selezionare i giorni');
		return false;
	}
	else
		forms.psl_status_bar.resetStatus();
	
	var success = addMultipleEvents(selectedDays);
	if(!success)
		forms.psl_status_bar.setStatusWarning('Si sono verificati errori durante l\'inserimento. Controllare le segnalazioni per i giorni selezionati.');
	else
		forms.psl_status_bar.setStatusSuccess('i18n:ma.msg.operations.success');
	
	return true;
}

/**
 * @properties={typeid:24,uuid:"4285BF96-5259-4621-8389-FA5A09CD59FB"}
 */
function eliminaEventoMultiplo() 
{
	var selectedDays = getSelectedDays();
	if (selectedDays.length == 0)
	{
		forms.psl_status_bar.setStatusError('Selezionare i giorni');
		return;
	}
	else
		forms.psl_status_bar.resetStatus();
	
	var answer = globals.ma_utl_showYesNoQuestion('L\'operazione cancellerà tutti gli eventi presenti nei giorni selezionati. <strong>Continuare</strong>?');
	if (answer)
		deleteMultipleEvents(selectedDays);
}

/**
 * @properties={typeid:24,uuid:"A72BCFAC-00F7-435E-8555-52107BD30D4D"}
 */
function addMultipleEvents(days)
{
	var input = getInput();
		input.clear();
		input.clearConstraints();
		input.setEdit(false);
		
	scopes.psl.SetEventsValuelist(v_events_dataset);
					
	var success = true;
	/** @type {{ event: { id: Number, code: String, type: String, hours: Number, whole_day: Boolean, property : String } }}*/
	var data = input.show();
	if (data)
	{
		for(var d = 0; d < days.length; d++)
		{
			var tab = getTabForDate(days[d]);
			
			// segna se è presente almeno un errore
			if(tab.validateData(data, true))
				tab.updateEvents(data);
			else
				success = false;
		}
	}
	
	return success;		
}

/**
 * @param {Array<Number>} days
 *
 * @properties={typeid:24,uuid:"FBA2B17C-01E6-410B-86BB-A3618D1B038D"}
 */
function deleteMultipleEvents(days)
{
	for(var d = 0; d < days.length; d++)
	{
		var tab = getTabForDate(days[d]);
		tab.deleteAllEvents();
	}
}

/**
 * @properties={typeid:24,uuid:"F765AB3D-47FF-4ABF-8D11-2DD80FF26958"}
 */
function getInput()
{
	return forms.psl_evento_input;
}

/**
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"D8310090-01B6-44D7-92A7-0B4561532CD7"}
 */
function getSelectedDays()
{
	var selection = [];
	for(var t = v_offset + 1; t <= v_last_tab; t++)
	{
		var tab = getTabAt(t);
		if (tab.isSelected())
			selection.push(tab.v_day.getDate());
	}
	
	return selection;
}

/**
 * @param {Array<Number>} selection
 * @param {Number}		  [offset]	 the number of days from the previos month displayed in the first week
 *
 * @properties={typeid:24,uuid:"0F875399-BE79-43FB-935D-67E934EEBB8A"}
 */
function setSelectedDays(selection, offset)
{
	offset    = offset || 0;
	selection = selection || [];
	
	selection.forEach(
		function(_)
		{
			var weekNo = Math.ceil((offset + _) / 7);
			var tab = getTabForDate(_);
				
			if(tab.isEnabled())
			{
				tab.select();
				forms[controller.getName()]['v_week_' + weekNo] = 1;
			}
		});
}

/**
 * @param weekNo
 * 
 * @return {Array<Number>}
 *
 * @properties={typeid:24,uuid:"87A70DC2-D4C6-4B37-B0FF-2A61F11034C0"}
 */
function getWeekSelection(weekNo)
{
	var firstTab = 1 + (7 * (weekNo - 1));
	var lastTab  = firstTab + 6;
	
	var selection = [];
	for(var t = firstTab; t <= lastTab; t++)
		if(getTabAt(t).isSelected())
			selection.push(getTabAt(t).v_day.getDate());
	
	return selection;
}

/**
 * @param {Number} weekNo
 * @param {Boolean} select
 *
 * @properties={typeid:24,uuid:"73B68B60-6124-4FB9-953C-0C0D79474D45"}
 */
function setWeekSelection(weekNo, select)
{
	var firstTab = 1 + (7 * (weekNo - 1));
	var lastTab  = firstTab + 6;
	
	for(var t = firstTab; t <= lastTab; t++)
	{
		var tab = getTabAt(t);
		if(!tab.isDisabled())
		{
			if(select)
				tab.select();
			else
				tab.unselect();
		}
	}
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
 * @properties={typeid:24,uuid:"626EDE1D-978D-4435-8E64-654DFBFC5E19"}
 */
function onDataChange$btn_week_1(oldValue, newValue, event) 
{
	setWeekSelection(1, newValue == 1);
	v_select_all = getSelectedDays().length > 0;
	
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
 * @properties={typeid:24,uuid:"5B44C962-69D6-46F6-8AB8-EA20DC6B8CA5"}
 */
function onDataChange$btn_week_2(oldValue, newValue, event)
{
	setWeekSelection(2, newValue == 1);
	v_select_all = getSelectedDays().length > 0;
	
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
 * @properties={typeid:24,uuid:"68FCAC55-69F0-4540-823D-47769A565170"}
 */
function onDataChange$btn_week_3(oldValue, newValue, event) 
{
	setWeekSelection(3, newValue == 1);
	v_select_all = getSelectedDays().length > 0;
	
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
 * @properties={typeid:24,uuid:"8B525256-C452-4AB7-A980-67C945305EBC"}
 */
function onDataChange$btn_week_4(oldValue, newValue, event) 
{
	setWeekSelection(4, newValue == 1);
	v_select_all = getSelectedDays().length > 0;
	
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
 * @properties={typeid:24,uuid:"092A419E-B1D2-490E-9981-1D8BDFC4B0BA"}
 */
function onDataChange$btn_week_5(oldValue, newValue, event) 
{
	setWeekSelection(5, newValue == 1);
	v_select_all = getSelectedDays().length > 0;
	
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
 * @properties={typeid:24,uuid:"BE60990A-065D-4664-91B0-774E46A6697B"}
 */
function onDataChange$btn_week_6(oldValue, newValue, event) 
{
	setWeekSelection(6, newValue == 1);
	v_select_all = getSelectedDays().length > 0;
	
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
 * @properties={typeid:24,uuid:"9E00D3B2-77E3-4297-B4A8-B85997EF1CC5"}
 */
function onDataChange$btn_select_all(oldValue, newValue, event) 
{
	if(newValue)
		selectAll();
	else
		selectNone();
	
	return true;
}

/**
 * @properties={typeid:24,uuid:"99818A87-CE00-4537-8919-16BA6CB67F39"}
 */
function selectNone()
{
	setSelection(0);
}

/**
 * @properties={typeid:24,uuid:"80BB570D-CE56-452C-A732-8490044B41DD"}
 */
function selectAll()
{
	setSelection(1);
}

/**
 * @param value
 *
 * @properties={typeid:24,uuid:"7ADF293A-5FCB-4088-BDD0-355908ACB2B1"}
 */
function setSelection(value)
{
	v_select_all = v_week_1 = v_week_2 = v_week_3 = v_week_4 = v_week_5 = v_week_6 = value;
	for(var w = 1; w <= v_last_week; w++)
		setWeekSelection(w, value);
}