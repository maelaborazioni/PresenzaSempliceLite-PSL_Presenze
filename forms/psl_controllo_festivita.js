/**
 * @type {Continuation}
 * 
 * @properties={typeid:35,uuid:"F5817FAC-112C-4C7D-9004-48655F287FBF",variableType:-4}
 */
var dialogContinuation = null;

/**
 * @properties={typeid:35,uuid:"38BCD89D-7B46-46E7-8540-BF65EE5F52A8",variableType:-4}
 */
var returnValue = false;

/**
 * @param {Number} idditta
 * @param {Number} periodo
 *
 * @properties={typeid:24,uuid:"FA8FB14C-E79B-41DC-9BF9-1EA4AB34F290"}
 */
function init(idditta, periodo)
{
	var gruppoInstallazione = globals.getGruppoInstallazioneDitta(idditta);
	
	var params = globals.inizializzaParametriAttivaMese(idditta, periodo, gruppoInstallazione, '', globals.getTipoConnessione());
	var url    = globals.WS_URL + "/Trattamenti/ElencoFestivita";

	/** @type {{ returnValue: Boolean, festivita: Array<Array> }} */
	var response = globals.getWebServiceResponse(url, params);
	if(!response || !response.returnValue)
		throw new Error('Errore durante la richiesta al server. Contattare lo studio');

	var festivita = response.festivita;
	var dataset = databaseManager.createEmptyDataSet(0, ['data', 'descrizione', 'accinfra', 'accriposo']);
	
	for (var f = 0; f < festivita.length; f++)
		dataset.addRow(festivita[f]);

	var datasourceName = ['elenco_festivita', idditta, periodo].join('_');
	var datasource     = dataset.createDataSource(datasourceName, [JSColumn.TEXT, JSColumn.TEXT, JSColumn.INTEGER, JSColumn.INTEGER]);

	var form = forms.psl_controllo_festivita_tbl;
	if (form.foundset.getDataSource() !== datasource)
	{
		var jsForm = solutionModel.getForm(form.controller.getName());
		if(!jsForm.dataSource)
		{	
			jsForm.getField(form.elements.fld_data.getName()).dataProviderID = 'data';
			jsForm.getField(form.elements.fld_descrizione.getName()).dataProviderID = 'descrizione';
			jsForm.getField(form.elements.fld_accinfra.getName()).dataProviderID = 'accinfra';
			jsForm.getField(form.elements.fld_accriposo.getName()).dataProviderID = 'accriposo';
		}
			
		jsForm.dataSource = datasource;
		form.controller.recreateUI();
	}
	
	return festivita;
}

/**
 * @properties={typeid:24,uuid:"3B4D88F5-094F-430F-8CB6-2E9F5CF6A9AE"}
 */
function show()
{
	return globals.ma_utl_showFormDialog({ 
		name: controller.getName(), 
		title: 'Gestione festività', 
		blocking: true 
	});
}

/**
 * @properties={typeid:24,uuid:"C0CC2C82-851F-4DCA-BD17-5EC87E12414A"}
 */
function hide(event)
{
	globals.svy_mod_closeForm(event);
	
	if(dialogContinuation && scopes.utl.IsWebClient())
		dialogContinuation(returnValue);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"132EC907-F33F-47EA-A2CA-43B2C4B6A96D"}
 */
function onAction$btn_conferma(event)
{
	returnValue = true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7C0A11D7-4A33-4C62-881E-38A7716987F5"}
 */
function onAction$btn_annulla(event) 
{
	returnValue = false;
}
/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"49C6E0EC-BB87-4F46-81A0-A44BD15D6732"}
 */
function onHide(event) 
{
	hide(event);	
	return true;
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DD97C04D-858A-4EFD-9797-831D4DBE7B1F"}
 */
function onShow(firstShow, event)
{
	return;
}
