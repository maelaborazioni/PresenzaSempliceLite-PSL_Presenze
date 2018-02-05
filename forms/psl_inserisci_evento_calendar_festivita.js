/**
 * @properties={typeid:24,uuid:"4CC406AB-5DF8-4931-A026-19A6ED7F744C"}
 */
function init(month, festivita, hours, eventsDataset, certificati, assunzione, cessazione)
{
	_super.init(month, festivita, hours, eventsDataset, certificati, assunzione, cessazione);
	
	// disabilita i giorni non festivi e la selezione multipla
	for(var day = scopes.date.FirstDayOfMonth(month); day <= scopes.date.LastDayOfMonth(month); day = scopes.date.AddDay(day))
	{
		var tab = getTabForDay(day);
		if (tab.isEnabled() && festivita.map(function(f){ return f.data; }).indexOf(day) == -1)
			tab.setEditDisabled('Giorno non festivo');
		
		getTabForDay(day).disableSelection();
	}
	
	return this;
}

/**
 * @properties={typeid:24,uuid:"681DE370-DAC1-4C47-8776-AD4D23180FCC"}
 */
function enable()
{
	_super.enable();
	disableMultipleSelection();
}

/**
 * @properties={typeid:24,uuid:"07422398-D8AA-4470-B632-B2CD983CFB30"}
 */
function getExtraCssClasses(month, festivita, day)
{
	// disabilita i giorni non festivi
	if(festivita.indexOf(day.getDate()) == -1)
		return ['day-disabled'];
	
	return [];
}

/**
 * @param {Array} events
 *
 * @properties={typeid:24,uuid:"1EA7AA5F-733C-42A5-853D-462E888A300D"}
 */
function disableEvents(events)
{
	// impedisci l'inserimento/modifica di eventi sostitutivi
	if(events)
		events.forEach(function(e){ e.disabled = (e.type == globals.TipologiaEvento.SOSTITUTIVO); });
	
	return events;
}
