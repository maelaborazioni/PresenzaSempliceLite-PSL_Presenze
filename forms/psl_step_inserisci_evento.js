/**
 * @properties={typeid:35,uuid:"BF629806-9BA7-43A7-9818-04A52608A6DD",variableType:-4}
 */
var filteredEvents = { };

/**
 * @properties={typeid:35,uuid:"CEA1D3D2-67AF-4975-A47A-FF5061D58181",variableType:-4}
 */
var constraintsDataset = { };

/**
 * @properties={typeid:35,uuid:"3CB0CA39-2071-44DE-9974-A055CDCCFFA9",variableType:-4}
 */
var v_selezione = { };

/**
 * @type {{ giorno: Date, ore: Number }}
 * 
 * @properties={typeid:35,uuid:"8EECABF3-3E0D-4A61-BFAC-78BB57E63886",variableType:-4}
 */
var v_hours = { };

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8139CFB9-D70C-4347-A7C8-CC24098CC03A",variableType:4}
 */
var v_loop_on_lavoratori = 0;

/**
 * @properties={typeid:24,uuid:"E7FF6DA6-D3A2-47A6-A55D-B4C11992F246"}
 */
function disableMultipleEvents()
{
	elements.btn_eventomultiplo.enabled  =
	elements.btn_eliminamultiplo.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"541E9E67-C88E-4A70-8F19-4663B68DB27F"}
 */
function enableMultipleEvents()
{
	elements.btn_eventomultiplo.enabled  =
	elements.btn_eliminamultiplo.enabled = true;
}

/**
 * @properties={typeid:24,uuid:"3FDB1FD2-DFB6-4DEF-9055-8E081675647C"}
 */
function disable()
{
	_super.disable();
	
	getCalendarForm().disable();
	disableMultipleEvents();
}

/**
 * @properties={typeid:24,uuid:"2B4FEE89-BF23-4354-A113-1DC6558FAC1C"}
 */
function enable()
{
	_super.enable();
	
	getCalendarForm().enable();
	enableMultipleEvents();
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"C969CA36-2F06-4D87-8F18-DC9554C4A2BD"}
 */
function saveData(state)
{
	state.data[state.params.ditta.id].ore = saveHours();
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"43FE03AC-D6AF-4280-B781-9E7F0FDD73CA"}
 */
function saveParams(state)
{
	state.params.selected_employee = foundset.getSelectedIndex();
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"C72199CE-A411-4E48-A187-187A39A66BF7"}
 */
function validateStep(state)
{
	if(_super.validateStep(state))
	{
		var firstDay = scopes.date.FirstDayOfMonth(state.params.periodo);
		var LastDay  = scopes.date.LastDayOfMonth(state.params.periodo);
		
		var calendar = getCalendarForm();
		
		for(var day = firstDay; day <= LastDay; day = scopes.date.AddDay(day))
			if(calendar.getTabForDay(day).hasError())
			{
				state.error =  scopes.string.Format('Verificare le segnalazioni per il giorno @0 prima di proseguire', utils.dateFormat(day, 'dd'));
				return false;
			}
		
		return true;
	}
			
	return false;
}

/**
 * @AllowToRunInFind
 * 
 * @param state
 *
 * @properties={typeid:24,uuid:"F5A2AB71-DCEC-4AA7-98DD-95E44043D373"}
 */
function beforeStep(state)
{
	if(state.params && state.data)
	{
		v_month = state.params.periodo;
		
		foundset.find();
		foundset.idlavoratore = state.params.lavoratori;
		foundset.search();
		foundset.sort('lavoratori_to_persone.cognome asc, lavoratori_to_persone.nome asc, codice asc');
		
		if(state.params.selected_employee)
			foundset.setSelectedIndex(state.params.selected_employee);
		
		v_hours = scopes.psl.Presenze.GetEvents(state, state.params.ditta.id);
		
		var result = scopes.psl.RunJob(
			{
				method: init,
				sync: true,
				args: [
						{ idditta: state.params.ditta.id, periodo: scopes.date.ToIntMonth(state.params.periodo) }, 
						state
					  ],
				start_message: 'Elaborazione in corso, attendere prego...'
			});

		if(result.error)
			return result;
	}
	
	return _super.beforeStep(state);
}

/**
 * @properties={typeid:24,uuid:"244B2D96-ADDA-4DC1-B72D-AB80632AED9B"}
 */
function init(params, state)
{
	var ditta     = params.idditta;
	var periodo   = params.periodo;
	/** @type {Object}*/
	var hours     = scopes.psl.Presenze.GetEvents(state, ditta)[idlavoratore];
	var calendar  = getCalendarForm();
	var festivita = scopes.giornaliera.RiepilogoFestivita(idditta, idlavoratore, periodo);

	elements.tab_calendar.removeTabAt(2);
	
	calendar.init(
				v_month,
				festivita, 
				hours,
				filterEvents(),
				scopes.storico.GiorniCopertiDaCertificato(idlavoratore, periodo),
				assunzione,
				cessazione)
		    .updateSelection(params.selezione || v_selezione[v_month]);
	
	calendar.getTabs().forEach(function(_) {
		_.registerListener(
			scopes.events.Listeners.ON_DATACHANGE,
			'notify',
			function() { notify(scopes.events.Listeners.ON_DATACHANGE); });		
	});
	
	elements.tab_calendar.addTab(calendar);
	
	setConstraints(hours);
	restoreHours(hours);
	
	calendar.updateTabStatus();
	
	return { error: false, message: 'Inizializzazione completata con successo.' };
}

/**
 * @properties={typeid:24,uuid:"BBA05EF9-9FC9-44E7-BE3E-F7937D1C5C55"}
 */
function getCalendarForm()
{
	/** @type {RuntimeForm<psl_inserisci_evento_calendar>} */
	var form = forms[elements.tab_calendar.getTabFormNameAt(1)];
	return form;
}

/**
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"D91D48E9-A95F-40D0-858F-324EBD66ACAA"}
 */
function filterEvents()
{
	var periodo = scopes.date.ToIntMonth(v_month);
	
	filteredEvents[idlavoratore] = filteredEvents[idlavoratore] || { };
	var dataset = filteredEvents[idlavoratore][periodo] || getEventsDataset();
	
	if(!filteredEvents[idlavoratore][periodo])
		filteredEvents[idlavoratore][periodo] = dataset;
	
	return dataset;
}

/**
 * @properties={typeid:24,uuid:"031971E7-CCE2-46E8-BA5D-12EA0DAC363F"}
 */
function getEventsDataset()
{
	if(!globals.FiltraEventiSelezionabili(idlavoratore, scopes.date.ToIntMonth(v_month), globals.TipoGiornaliera.NORMALE))
		throw new Error('Errore durante il filtraggio degli eventi selezionabili');
						
	return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, getEventsFilterQuery(), getEventsFilterParams(), -1);
}

/**
 * @properties={typeid:24,uuid:"3B419E8F-FDAA-4A96-A99D-7FFF18DFA574"}
 */
function getEventsFilterQuery()
{
	var query = "select\
					e.descriz as Descrizione,\
					e.idEvento,\
					ec.tipo\
				from\
					e2eventi e\
					inner join E2EventiClassi ec\
						on ec.IdEventoClasse = e.IdEventoClasse\
					left outer join\
					(\
						select ge.idEvento\
						from\
							e2giornalieraeventi ge\
							left outer join E2Giornaliera g\
								on g.IdGiornaliera = ge.IdGiornaliera\
						where\
							g.iddip = ?\
							and\
							g.giorno between ? and ?\
					) ge\
						on ge.IdEvento = e.idEvento\
				where\
					ec.tipo in ('" + getEventsClasses().join("', '")  + "')\
					and\
					ec.GestitoConStorico = 0\
					and\
					e.idEvento IN (" + globals._arrIdEvSelezionabili.join(", ") + ")\
				group by\
					e.idEvento,\
					e.evento,\
					e.descriz,\
					ec.tipo\
				order by\
					case when e.evento = 'PD' then 999 else count(e.idEvento) end desc,\
					e.descriz;";
	
	return query;
}

/**
 * @properties={typeid:24,uuid:"80B8C737-75E1-4C3F-9C04-A1201ED17901"}
 */
function getEventsClasses()
{
	return [];
}

/**
 * @properties={typeid:24,uuid:"D997CCFD-63EE-480F-9CDE-D9F9227EF2FB"}
 */
function getEventsFilterParams()
{
	var dal = scopes.date.FirstDayOfMonth(scopes.date.AddMonths(v_month, -3));
	var al  = scopes.date.LastDayOfMonth(v_month);
	
	return [idlavoratore, dal, al];
}

/**
 * @properties={typeid:24,uuid:"A11E7523-6334-4A69-A39D-362CA353A309"}
 */
function getEventsClass()
{
	return '';
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E9AA1C4A-93BB-4A7D-9C45-14C3E3C16B80"}
 */
function onAction$btn_next$lavoratore(event) 
{
	gotoNextLavoratore();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3CF62560-F1CC-44F4-ACC2-570581E1FFB6"}
 */
function onAction$btn_prev$lavoratore(event) 
{
	gotoPreviousLavoratore()
}

/**
 * @properties={typeid:24,uuid:"00922AA2-87A8-422D-9476-BD965CDFF43A"}
 */
function gotoNextLavoratore()
{
	var nextIndex = foundset.getSelectedIndex() + 1;
	if(foundset.getSelectedIndex() > foundset.getSize())
	{
		if(loopOnLavoratori())
			nextIndex = 1;
		else
			return;
	}
	
	gotoLavoratore(nextIndex);
}

/**
 * @param index
 *
 * @properties={typeid:24,uuid:"B5B570CA-3088-440C-AC52-67C42742DEED"}
 */
function gotoLavoratore(index)
{
	saveHours();
	
	foundset.setSelectedIndex(index);
	
	init({ 
			idditta: v_ditta, 
			periodo: scopes.date.ToIntMonth(v_month), 
			selezione: getCalendarForm().getSelectedDays() 
		  }, 
		  getMainForm().getState());
}

/**
 * @properties={typeid:24,uuid:"4D900BBC-9E3C-48E0-B8C7-9F30FD75C840"}
 */
function gotoPreviousLavoratore()
{
	var prevIndex = foundset.getSelectedIndex() - 1;
	if(foundset.getSelectedIndex() == 1)
	{
		if(loopOnLavoratori())
			prevIndex = foundset.getSize();
		else
			return;
	}

	gotoLavoratore(prevIndex);
}

/**
 * @properties={typeid:24,uuid:"9CF0C819-225C-4832-9F69-6AB36B4E8EE0"}
 */
function loopOnLavoratori()
{
	return v_loop_on_lavoratori === 1;
}

/**
 * @properties={typeid:24,uuid:"FE5D2B56-449E-4CF1-A91B-51FC61B2A141"}
 */
function saveState(state)
{ 
	v_selezione[state.params.periodo] = getCalendarForm().getSelectedDays();
	
	var snapshot = 
	{
		v_loop_on_lavoratori	: v_loop_on_lavoratori,
		v_selezione				: v_selezione[state.params.periodo]
	};
	
	return snapshot;
}

/**
 * @param snapshot
 * @param state
 *
 * @properties={typeid:24,uuid:"7E9C240C-D912-437A-B467-6736E3CE594A"}
 */
function restoreStateFromSnapshot(snapshot, state)
{
	v_loop_on_lavoratori = snapshot.v_loop_on_lavoratori;
	v_selezione[state.params.periodo] = snapshot.v_selezione;
}

/**
 * @properties={typeid:24,uuid:"78E48865-07D6-4271-B949-3FA556C803A8"}
 */
function saveHours()
{
	var hours = v_hours[idlavoratore] || { };
	
	var data = getCalendarForm().getData();
	for(var d in data)
		hours[d] = globals.clone(data[d]);
	
	return v_hours;
}

/**
 * @param [hours]
 * 
 * @properties={typeid:24,uuid:"51F4F7A5-0739-4595-93A8-CBA0CC8B7461"}
 */
function restoreHours(hours)
{
	hours = hours || v_hours[idlavoratore]; 
	if(hours)
		getCalendarForm().setData(hours);
	else
		getCalendarForm().clear();
}

/**
 * @properties={typeid:24,uuid:"F1EFEC4C-6B3B-4798-8E95-4E1D7B35AD1D"}
 */
function getConstraintsDataset()
{
	var firstDay = scopes.date.FirstDayOfMonth(v_month);
	var lastDay  = scopes.date.LastDayOfMonth(v_month);
	
	var sqlQuery  = "select Giorno, OreFatte from [dbo].[F_Lav_OreTeorichePeriodo](?, ?, ?) order by Giorno;";
	var sqlParams = [idlavoratore, firstDay, lastDay];

	var dataset   = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, sqlQuery, sqlParams, -1);
	if(!dataset)
		globals.ma_utl_logError(new Error('Cannot perform query: ' + sqlQuery + ' with params: ' + sqlParams));
	
	return dataset;
}

/**
 * @properties={typeid:24,uuid:"991893A0-5D9B-4875-B9A8-2BA5ED1E5541"}
 */
function setConstraints(data)
{
	getCalendarForm().setConstraints(data, [hoursConstraint]);
}

/**
 * This is called any time a new event must be checked.
 * 
 * @properties={typeid:24,uuid:"D7EA6A8C-B0EF-4EE7-BA81-E69A48CA9EE3"}
 */
function hoursConstraint(tab)
{
	/**
	 * @param 			data		l'evento inserito/modificato
	 * @param {Boolean} isNew		true se inserimento, false altrimenti
	 * @param {Array} 	events		l'elenco degli eventi presenti nella giornata
	 * @param {Number} 	maxHours	l'orario teorico per la giornata
	 */
	return function(data, isNew, events, maxHours)
	{
		if(data && data.event && data.event.hours)
		{
			/**
			 * L'unico controllo da effettuare è che la somma delle ore inserite non superi le 24 ore
			 */
			var totalHours = maxHours + data.event.hours;
			events.forEach(function(_) { totalHours += _.hours; });
			
			if(totalHours > 24)
				return {
					error: true,
					blocking: true,
					message: scopes.string.Format('Il totale degli eventi inseriti (@0 ore) supera le 24 ore', totalHours)
				};
		}
		
		return { 
			error   : false, 
			blocking: false, 
			message : '' 
		};
	}
}

/**
 * @properties={typeid:24,uuid:"9CBC88DB-020E-47F9-87E1-92BB14F3A97A"}
 */
function getName()
{
	return 'eventi';
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A8F99536-CF6B-4973-90FC-FCC97BC22961"}
 */
function onAction$lbl_lavoratore(event) 
{
	showMenuLavoratore(event);
}

/**
 * @properties={typeid:24,uuid:"BD1B5CB9-C483-4D4F-A7AF-AF5FD9EEE63D"}
 */
function showMenuLavoratore(event)
{
	var menu = plugins.window.createPopupMenu();
	for(var r = 1; r <= foundset.getSize(); r++)
	{
		var record = foundset.getRecord(r);
		var item = menu.addMenuItem(record.codice_nominativo_qualifica);
			item.setMethod(gotoLavoratoreFromMenu, [r]);
		
		if(r == foundset.getSelectedIndex())
			item.selected = true;
	}
	
	menu.show(event.getSource());
}

/**
 * @properties={typeid:24,uuid:"E6986F2E-FA11-4D42-9DC3-2B98D6189214"}
 */
function gotoLavoratoreFromMenu(_a, _b, _c, _d, _e, index)
{
	gotoLavoratore(index);
}

/**
 * @properties={typeid:24,uuid:"ABE47FA5-D7B1-40F4-904F-51EAAB1CE8B3"}
 */
function next_record()
{
	gotoNextLavoratore();
}

/**
 * @properties={typeid:24,uuid:"D3D1059B-25CB-4520-A5A9-32E8249B5DA1"}
 */
function previous_record()
{
	gotoPreviousLavoratore();
}

/**
 * @properties={typeid:24,uuid:"289889FD-ECE6-4B2B-8F59-A357F44E96D5"}
 */
function getNavigator()
{
	return forms[elements.tab_navigator.getTabFormNameAt(1)];
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"45E71A59-CA8D-4F83-A57E-4E13E6F480FB"}
 */
function onAction$btn_eventomultiplo(event) 
{
	getCalendarForm().aggiungiEventoMultiplo();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"0B8F67B2-BE70-477D-BA68-DA56F582D407"}
 */
function onAction$btn_eliminamultiplo(event) 
{
	getCalendarForm().eliminaEventoMultiplo();
}
