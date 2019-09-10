

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0B9266E0-94CA-4CDF-8CD5-0C1CEBD0B654"}
 */
function onRecordSelection(event) 
{
	forms.psl_inserisci_certificati_dettaglio.refreshDetail();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"2CA1CB30-0E94-4B8B-87EF-95816982AE95"}
 */
function onAction$btn_datiaggiuntivi(event) 
{
//	var fs = storico_certificati_to_v_riepilogocertificati.v_riepilogocertificati_to_storico_datiaggiuntivi;
//	if (fs && fs.getSize() > 0)
	if(globals.getIdDatiAggiuntiviFromStoricoPadre(idstoricocertificato))
	   showDatiAggiuntivi();
}

/**
 * @properties={typeid:24,uuid:"0BB25C88-0FC0-45E5-B228-11EDD9BF2555"}
 * @AllowToRunInFind
 */
function showDatiAggiuntivi()
{
	var form = forms.storico_dati_aggiuntivi_tab_dtl;
	// serve per la modifica dei dati
	databaseManager.startTransaction();
	
	var idStoricoDatiAgg = globals.getIdDatiAggiuntiviFromStoricoPadre(idstoricocertificato);
	
	/** @type {JSFoundSet<db:/ma_presenze/storico_datiaggiuntivi>}*/
	var fsDatiAgg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.STORICO_DATI_AGGIUNTIVI);
	if(fsDatiAgg.find())
	{
		fsDatiAgg.idstoricodatiaggiuntivi = idStoricoDatiAgg;
		fsDatiAgg.search();
	}
	
	globals.ma_utl_showFormInDialog(form.controller.getName(), 'Dati aggiuntivi', fsDatiAgg);
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5A649EC0-1491-4AA0-BAB3-FA35DA16129E"}
 */
function onRender$btn_datiaggiuntivi(event) 
{
	var renderable = event.getRenderable();
	
	if (globals.getIdDatiAggiuntiviFromStoricoPadre(idstoricocertificato))
		renderable.enabled = true;
	else
		renderable.enabled = false;
}
