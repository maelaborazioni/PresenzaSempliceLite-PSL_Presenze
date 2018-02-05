/**
 * @properties={typeid:24,uuid:"B3E864F0-10D8-4D52-9769-D008D4436A8E"}
 */
function getCustomLookup()
{
	return forms.psl_lookup_window.controller.getName();
}

/**
 * @properties={typeid:24,uuid:"CE118B6D-EAFF-4823-B629-FA79E1CE2C77"}
 */
function getLookupStyle()
{
	return 'psl';
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"ABA570DC-0AC2-488A-9EAC-41506EF8988E"}
 */
function confermaEsportazioneReport(event)
{
	returnValue = _super.confermaEsportazioneReport(event);
	closeAndContinue(event);
}

/**
 * @param ditta
 * @param periodo
 *
 * @properties={typeid:24,uuid:"99E29ACE-E5BD-45E7-85B1-150E40CABB69"}
 */
function filterPeriodo(ditta, periodo)
{
	// do nothing, we're just printing
}