/**
 * @properties={typeid:35,uuid:"D5EA539C-9F6E-44FF-BC1B-D816B6AE4824",variableType:-4}
 */
var v_listeners = { ondatachange: { } };

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7306B007-3C41-4F3E-8706-876EAB23AEE2",variableType:8}
 */
var v_anno;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"9BE58304-AA44-45DC-AFD5-E3739705A2E5",variableType:8}
 */
var v_mese;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A33446D6-AF26-4082-BF81-FBE2E799B849",variableType:8}
 */
var v_periodo;

/**
 * @type {Array}
 * 
 * @properties={typeid:35,uuid:"C06D59E4-328C-4A2B-A6D7-46743D9464B5",variableType:-4}
 */
var v_lavoratori = [];

/**
 * @param name
 * @param func
 *
 * @properties={typeid:24,uuid:"52B44B25-37D8-463A-8165-97F51C25CA99"}
 */
function registerOnDataChangeListener(name, func)
{
	if(!name)
		throw new Error('Parameter [name] must be provided');
	if(!func)
		throw new Error('Parameter [func] must be provided');
	
	if(!v_listeners.ondatachange[name])
		v_listeners.ondatachange[name] = func;
}

/**
 * Notifies all registered listeners for the event, if any
 * 
 * @param {String} event
 *
 * @properties={typeid:24,uuid:"83FAF2A6-879C-420F-ACB0-2EC251160C2D"}
 */
function notify(event)
{
	for(var l in v_listeners[event])
		v_listeners[event][l]();
}

/**
 * @properties={typeid:24,uuid:"355C1954-B640-46BF-8FB8-AA02E7D04832"}
 */
function getChoiceForm()
{
	return forms.psl_inserisci_variazioni_seleziona_richiesta_single_variazione;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F19E0585-E976-4852-A592-CF2F2361C2BB"}
 */
function onAction$btn_add(event) 
{
	var choiceForm = getChoiceForm();
		choiceForm.vAnno = v_anno;
		choiceForm.vMese = v_mese;
		choiceForm.v_lavoratori = v_lavoratori;
		choiceForm.vTipoRichiesta = globals.TipoRichiesta.SINGOLA;
		
		choiceForm.vCategoriaRichiesta = 0;
		choiceForm.vCodRegola = null;
		choiceForm.vDettaglioRichiesta = null;
		choiceForm.vCodRichiesta = null;
	    choiceForm.vRegola = null;
	    
	newRequest();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"03E16850-1B5D-4694-83DC-295D9594BB94"}
 */
function onAction$btn_delete(event)
{
	dc_delete();
}

/**
 * @properties={typeid:24,uuid:"9AB1B123-FAE8-4424-B8B2-BBDB48018472"}
 */
function dc_delete()
{
	if(foundset.getSize() > 0)
	{
		var answer = globals.ma_utl_showYesNoQuestion('i18n:svy.fr.dlg.delete');
		if (answer)
		{
			databaseManager.startTransaction();
			
			if(dc_delete_pre(foundset, false) == -1)
				databaseManager.rollbackTransaction();
			
			foundset.deleteRecord();
			
			if(dc_delete_post(foundset, false) == -1)
				databaseManager.rollbackTransaction();
			
			if(!databaseManager.commitTransaction())
				databaseManager.rollbackTransaction();
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"26E4B6DA-41D4-4E34-B8D4-ACBEA816D897"}
 */
function onAction$btn_edit(event) 
{
	if(foundset.getSize() > 0)
		editRequest(foundset.getSelectedRecord());
}

/**
 * @properties={typeid:24,uuid:"F1B8EA12-AE37-47DD-B07E-BBC7349C6959"}
 */
function setPeriodo(periodo)
{
	v_periodo = periodo;
	v_anno    = periodo / 100;
	v_mese    = periodo % 100;
}

/**
 * @properties={typeid:24,uuid:"B3ECFBE4-04FF-47E9-8FE2-2DA3F5086504"}
 */
function setLavoratori(lavoratori)
{
	v_lavoratori = lavoratori;
	filterData(foundset).loadAllRecords();
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AE9EAA8F-8FBC-48C5-901A-890F06955727"}
 */
function onRecordSelection(event, _form) 
{
	_super.onRecordSelection(event, _form);
	
	elements.btn_edit.enabled   = 
	elements.btn_delete.enabled = foundset.inviata == 0;
}

/**
 * @properties={typeid:24,uuid:"96FC453D-1332-4F1E-98BC-904C32278407"}
 */
function getFilterForm()
{
	return forms.psl_inserisci_variazioni_filter;
}

/**
 * @properties={typeid:24,uuid:"E587B330-4981-47FD-B722-5B581C17F400"}
 */
function disable()
{
	elements.btn_add.enabled       =
	elements.btn_delete.enabled    =
	elements.btn_edit.enabled      = 
	elements.btn_deleteall.enabled = false;
	
	forms[elements.richieste_panel.getTabFormNameAt(1)].controller.readOnly = true;
}

/**
 * @properties={typeid:24,uuid:"F9262B4F-DDC6-4B69-BCD8-4C982EE3EB56"}
 */
function enable()
{
	elements.btn_add.enabled       = true;
	
	elements.btn_delete.enabled    =
	elements.btn_edit.enabled      = 
	elements.btn_deleteall.enabled = foundset.inviata == 0;
	
	forms[elements.richieste_panel.getTabFormNameAt(1)].controller.readOnly = false;
}

/**
 * @return {JSFoundset}
 * 
 * @properties={typeid:24,uuid:"7FB094C0-3DDF-491B-B162-D8BE068ED624"}
 */
function filterData(fs)
{
	_super.filterData(fs);
	
	if(fs)
	{
		if(fs.getFoundSetFilterParams('psl_ftr_lavoratore') && fs.getFoundSetFilterParams('psl_ftr_periodo'))
		{
			fs.removeFoundSetFilterParam('psl_ftr_lavoratore');
			fs.removeFoundSetFilterParam('psl_ftr_periodo');
		}
		
		fs.addFoundSetFilterParam('idlavoratore', globals.ComparisonOperator.IN, v_lavoratori.map(function(_){ return globals.ma_utl_lav_toSede(_); }), 'psl_ftr_lavoratore');
		fs.addFoundSetFilterParam('periodocedolino', globals.ComparisonOperator.EQ, v_periodo, 'psl_ftr_periodo');
	}
	
	return fs;
}

/**
 * @param parameters
 *
 * @properties={typeid:24,uuid:"4CF18222-3CB5-4579-AE06-CCF39877BB7F"}
 */
function postSaveCallback(parameters)
{
//	_super.postSaveCallback(parameters);
	notify(scopes.events.Listeners.ON_DATACHANGE);
}

/**
 * @properties={typeid:24,uuid:"51028E5C-A499-4FDF-9CA4-87A0C600F296"}
 */
function postCancelCallback()
{
//	_super.postCancelCallback();
	notify(scopes.events.Listeners.ON_DATACHANGE);
}