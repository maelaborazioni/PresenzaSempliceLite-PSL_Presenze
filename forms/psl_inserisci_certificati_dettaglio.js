/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"1EB7516D-FDAE-4B9B-9AA9-E99B2413551F",variableType:93}
 */
var v_month;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F330DAEB-6469-44BB-819A-C08E8614647D",variableType:8}
 */
var vIdEventoClasse = -1;

/**
 * @properties={typeid:24,uuid:"D7A61B5D-6251-48BD-8A5E-62CF9223A528"}
 */
function getMainForm()
{
	return forms.psl_inserisci_certificati_dettaglio;
}

/**
 * @properties={typeid:24,uuid:"6875BCD7-8D06-4EB1-94C9-34538A227F16"}
 */
function refreshList()
{
	databaseManager.refreshRecordFromDatabase(lavoratori_to_v_riepilogocertificati, -1);
}

/**
 * @param month
 *
 * @properties={typeid:24,uuid:"A8B8655F-0C13-4387-A896-D80DA3DC07EE"}
 */
function setMonth(month)
{
	v_month = month;
}

/**
 * @param {JSFoundSet<db:/ma_presenze/v_riepilogocertificati>} [fs]
 *
 * @properties={typeid:24,uuid:"CEE0FC5C-974D-4ED9-8B0A-25E69FA2DE8D"}
 * @AllowToRunInFind
 */
function filterCertificati(fs)
{
	fs = fs || lavoratori_to_v_riepilogocertificati;
	
	if(fs && fs.find())
	{
		var firstDay = scopes.date.FirstDayOfMonth(v_month);
		var lastDay  = scopes.date.LastDayOfMonth(v_month);
		
		fs.ideventoclasse = vIdEventoClasse || -1;
		fs.datainizio     = globals.ComparisonOperator.LE + globals.formatForFind(lastDay);
		fs.datafine       = globals.ComparisonOperator.GE + globals.formatForFind(firstDay);
		
		fs.search();
	}
	
	return fs;
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
 * @properties={typeid:24,uuid:"4749BC80-50BC-4970-9598-8D86F6D01EC5"}
 * @AllowToRunInFind
 */
function onDataChange$tipologia(oldValue, newValue, event)
{
	newValue = newValue || -1;

	filterCertificati();
	refreshDetail();
	
	return true;
}

/**
 * @param {Number} [idStorico]
 * 
 * @properties={typeid:24,uuid:"C126B221-CA55-46DF-8593-1F74131CE58D"}
 */
function updateDetail(idStorico)
{
	var periodo = scopes.date.ToIntMonth(v_month);
	getDetailForm().aggiornaDettaglioCertificato(idlavoratore, idditta, periodo, vIdEventoClasse, idStorico)
}

/**
 * @properties={typeid:24,uuid:"48C407B3-181B-42F0-8093-768240A8AEF0"}
 */
function getDetailForm()
{
	/** @type {RuntimeForm<psl_storico_main>} */
	var form = forms[elements.tab_certificati.getTabFormNameAt(1)];
	return form;
}

/**
 * @properties={typeid:24,uuid:"C7FE4447-B672-43C8-A744-2E85CCE6121C"}
 */
function gotoEdit()
{
	elements.cmb_eventoclasse.enabled = false;
	elements.tab_elenco.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"A50B5467-BAEC-496D-8F49-4183EBE443FD"}
 */
function gotoBrowse()
{
	elements.cmb_eventoclasse.enabled = true;
	elements.tab_elenco.enabled = true;
}

/**
 * @properties={typeid:24,uuid:"0AD210A5-4F28-482A-ADCA-3603DD1FF80C"}
 */
function init(month)
{
	vIdEventoClasse = globals.EventoClasse.MALATTIA;
	setMonth(month);
	
	filterCertificati();
	refreshDetail();
}

/**
 * @properties={typeid:24,uuid:"B5A3630E-4058-4EB5-AB1A-DB4AF797AEC7"}
 */
function refreshDetail()
{
	if(vIdEventoClasse)
		elements.tab_certificati.enabled = true;
	else
		elements.tab_certificati.enabled = false;
	
	if(lavoratori_to_v_riepilogocertificati)
		updateDetail(lavoratori_to_v_riepilogocertificati.idstoricocertificato);
}

/**
 * @properties={typeid:24,uuid:"2345E683-9BC4-4C02-B2A2-9F125CAE6701"}
 */
function getCertificatiTab()
{
	return forms[elements.tab_certificati.getTabFormNameAt(1)];
}
/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FFF8BEAC-3F96-4DAF-B997-EF6371ECB4A9"}
 */
function onRecordSelection(event) 
{
	filterCertificati();
	refreshDetail();
}
