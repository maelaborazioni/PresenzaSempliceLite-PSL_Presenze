/**
 * Seleziona il figlio ed entra nella gestione del relativo 
 * periodo di congedo associato
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1C3777F4-D29F-4FB0-BA9C-B1B0E5323863"}
 * @AllowToRunInFind
 */
function confermaSelezioneFiglio(event) 
{	
	/** @type {RuntimeForm<storico_main>} */
	var storicoForm = forms[vStoricoForm];
	var vIdStoricoDatiAggiuntivi = foundset.getSelectedRecord().idstoricodatiaggiuntivi;
	
	if(vIdStoricoDatiAggiuntivi)
		storicoForm.vIdStoricoDatiAggiuntivi = vIdStoricoDatiAggiuntivi;
	else
	{
		globals.ma_utl_showInfoDialog('Controllare nel database l\'inserimento del figlio','Selezione dati figlio')
	    return;
	}
	
	var sqlStoricoCertificati    = "SELECT [dbo].[F_Sto_IdStoricoDaDatiAggiuntivi](?,?)";
	var paramsStoricoCertificati = [vIdEventoClasse, vIdStoricoDatiAggiuntivi ];
	
	var dsStoricoCertificati = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlStoricoCertificati,paramsStoricoCertificati,-1);
	var idStoricoCertificati = dsStoricoCertificati.getValue(1,1);
	
	// se è già esistente un certificato padre di congedo parentale mostralo
	globals.svy_mod_closeForm(event);
	forms.psl_storico_main.buildCertificate(event,idStoricoCertificati);
}