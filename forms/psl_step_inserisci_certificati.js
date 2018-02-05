/**
 * @properties={typeid:24,uuid:"1CEEC3CF-134F-4369-B6C2-A2DF02418DD9"}
 */
function getName()
{
	return scopes.psl.Presenze.Sezioni.CERTIFICATI;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"76F0442A-53E4-4341-B13A-93AE720F145F"}
 * @AllowToRunInFind
 */
function beforeStep(state)
{
	var result = _super.beforeStep(state);
	
	v_month = state.params.periodo;
	
	var tab = getGestioneTab()
		tab.init(v_month);
	
	forms.psl_storico_main.registerListener('notify', function() { 
		notify(scopes.events.Listeners.ON_DATACHANGE); 
	});
	
	foundset.find() && (foundset.idlavoratore = state.params.lavoratori) && foundset.search() && foundset.sort('lavoratori_to_persone.nominativo asc, codice asc');

	return result; 
}

/**
 * @properties={typeid:24,uuid:"D6CAF3E6-F185-4C4E-9409-553045230EE2"}
 */
function refreshData(state)
{
	_super.refreshData(state);
	databaseManager.refreshRecordFromDatabase(lavoratori_to_v_riepilogocertificati, -1);
}

/**
 * @properties={typeid:24,uuid:"A1AD9D12-145F-447E-AA01-496C6C91D850"}
 */
function disable()
{
	_super.disable();
	forms.psl_storico_main.disable();
}

/**
 * @properties={typeid:24,uuid:"DE0ADDC5-9857-4995-85F9-10D1E4127E8D"}
 */
function enable()
{
	_super.enable();
	forms.psl_storico_main.enable();
}

/**
 * @return {RuntimeForm<psl_inserisci_certificati_dettaglio>}
 * @properties={typeid:24,uuid:"F9C80303-CCAC-4A0F-A752-148ECB6D4322"}
 */
function getGestioneTab()
{
	/** @type {RuntimeForm<psl_inserisci_certificati_dettaglio>} */
	var form = forms[elements.tab_certificati.getTabFormNameAt(1)];
	return form;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"9C427348-225E-4CD7-85E7-3012EAEA4E26"}
 */
function onAction$lbl_lavoratore(event) 
{
	showMenuLavoratore(event);
}

/**
 * @properties={typeid:24,uuid:"3CF26BC2-1EB7-4F5D-B166-1DDA66C4D58D"}
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
 * @properties={typeid:24,uuid:"85F70FE4-D9A5-4826-9071-E9AD508AC007"}
 */
function gotoLavoratoreFromMenu(_a, _b, _c, _d, _e, index)
{
	gotoLavoratore(index);
}

/**
 * @properties={typeid:24,uuid:"4AE2B947-9C6B-4710-ABDA-9DFB6A2F05E9"}
 */
function gotoLavoratore(index)
{
	foundset.setSelectedIndex(index);
}
