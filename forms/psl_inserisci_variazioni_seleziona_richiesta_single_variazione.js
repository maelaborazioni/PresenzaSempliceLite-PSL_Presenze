/**
 * @properties={typeid:35,uuid:"E383A575-B982-4BB7-A7BE-9E61D3BF9DAD",variableType:-4}
 */
var v_lavoratori = [];

/**
 * @properties={typeid:24,uuid:"537332A0-1B8C-46D7-86F0-77810D23F694"}
 * @AllowToRunInFind
 */
function filterLavoratori(fs)
{
	fs = _super.filterLavoratori(fs);
	fs.addFoundSetFilterParam('idlavoratore', globals.ComparisonOperator.IN, v_lavoratori);
	
	return fs;
}

/**
 * @param {JSEvent} event
 * @param {Boolean} multiSelect
 * @param {Array} 	[disabledElements]
 * 
 * @return {Array} the ids
 * 
 * @properties={typeid:24,uuid:"A1C1FB84-D0C6-4A0B-8DE0-9AD855BD48A3"}
 */
function lookupLavoratori(event, multiSelect, disabledElements)
{
	var fs = datasources.db.ma_anagrafiche.lavoratori.getFoundSet();
		fs = filterLavoratori(fs);

	fs.loadAllRecords();
	
	return globals.foundsetToArray(fs).map(
		/** @param {JSRecord} record */
		function(record){ return record.getPKs()[0]; }
	);
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8DA10B2F-E9EE-4535-BCAC-5085F8686AC4"}
 */
function onActionBtnConfermaRichiesta(event) 
{
	// ticket 15135 : data la gestione dell'inserimento variazioni in PSL, verifica se si posssa trattare di duplicazione di voce già inserita
	var recReq = globals.getEmployeeRequest(v_lavoratori[0],request.idtabrichiestadettaglio,vAnno * 100 + vMese);
	if(recReq != null)
	{
		showGenericError(new Error("La voce è già stata inserita per il dipendente nel periodo"));
		return;
	}	
	
	confermaRichiesta(event);
}
