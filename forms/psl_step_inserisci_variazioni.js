/**
 * @properties={typeid:24,uuid:"EAD5AB13-31B0-4BCF-873E-39902F966E9D"}
 */
function getName()
{
	return scopes.psl.Presenze.Sezioni.VARIAZIONI;
}

/**
 * @properties={typeid:24,uuid:"A56AC34D-43E7-44CD-BF8B-0ABB5346F76F"}
 * @AllowToRunInFind
 */
function beforeStep(state)
{
	var result = _super.beforeStep(state);
	if (result.error)
		return result;
		
	if(!state.params)
		return { error: true, message: 'i18n:ma.err.generic_error' };

	var ditta      = state.params.ditta.id;
	var periodo    = scopes.date.ToIntMonth(state.params.periodo);
	
	globals._filtroSuDitta = ditta;
	
	var variazioniForm = getVariazioniForm();
		variazioniForm.setPeriodo(periodo);
		variazioniForm.registerOnDataChangeListener('notify', function() { 
			notify(scopes.events.Listeners.ON_DATACHANGE); 
		});
	
	foundset.find() && (foundset.idlavoratore = state.params.lavoratori) && foundset.search() && foundset.sort('lavoratori_to_persone.cognome asc, lavoratori_to_persone.nome asc, codice asc');
	
	var variazioni_fs = lavoratori_to_lavoratori_richieste;
		variazioni_fs.find() && (variazioni_fs.periodocedolino = periodo) && variazioni_fs.search();

	return { error: false, message: '' };
}

/**
 * @properties={typeid:24,uuid:"E9848A07-ED66-4EA9-9489-E282891483E7"}
 */
function refreshData(state)
{
	_super.refreshData(state);
	databaseManager.refreshRecordFromDatabase(lavoratori_to_lavoratori_richieste, -1);
}

/**
 * @properties={typeid:24,uuid:"DEF01D73-145A-46A3-BF6B-7502195F3EAE"}
 */
function getVariazioniForm()
{
	return forms.psl_inserisci_variazioni_wrapper;
}
/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A5861ED2-7BBD-47AE-B5C7-7637C0B3B710"}
 */
function onRecordSelection(event)
{
	getVariazioniForm().setLavoratori([idlavoratore]);
}

/**
 * @properties={typeid:24,uuid:"5E275DA7-DAD1-4425-8D6D-E5BA8A8A72CD"}
 */
function disable()
{
	_super.disable();
	getVariazioniForm().disable();
}

/**
 * @properties={typeid:24,uuid:"C02DEE9E-7068-49C5-9141-EF44B4A080AB"}
 */
function enable()
{
	_super.enable();
	getVariazioniForm().enable();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"91948E73-A997-4333-8733-636D175C4E5C"}
 */
function onAction$lbl_lavoratore(event) 
{
	showMenuLavoratore(event);
}

/**
 * @properties={typeid:24,uuid:"71ED988C-A357-4CB8-8DAD-764E6008858A"}
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
 * @properties={typeid:24,uuid:"3A125397-1AE2-44BD-BC57-F7026950D319"}
 */
function gotoLavoratoreFromMenu(_a, _b, _c, _d, _e, index)
{
	gotoLavoratore(index);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param index
 *
 * @properties={typeid:24,uuid:"DFC27BC3-F14D-4357-AFD6-C5ED6B537A93"}
 */
function gotoLavoratore(index)
{
	foundset.setSelectedIndex(index);
}
/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B5BA318A-8D30-4D64-8A36-E8F34ABF00FD"}
 */
function onLoad(event) 
{
	_super.onLoad(event);
	
	getVariazioniForm().registerListener(['success'], function(message){ forms.psl_status_bar.setStatusSuccess(message); });
	getVariazioniForm().registerListener(['warning'], function(message){ forms.psl_status_bar.setStatusWarning(message); });
	getVariazioniForm().registerListener(['error'  ], function(message){ forms.psl_status_bar.setStatusError(message);   });
}
