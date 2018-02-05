/**
 * @properties={typeid:24,uuid:"F2F633FC-6974-4784-82DD-1699CFE042AE"}
 */
function init(month, festivita, hours, eventsDataset, certificati, assunzione, cessazione)
{
	_super.init(month, festivita, hours, eventsDataset, certificati, assunzione, cessazione);
	
	for(var day = scopes.date.FirstDayOfMonth(month); day <= scopes.date.LastDayOfMonth(month); day = scopes.date.AddDay(day))
	{
		var tab = getTabForDay(day);
		if (tab.isEnabled())
		{
			if(tab.isHoliday())
				tab.setEditDisabled('Giorno festivo');
			else
			if(tab.getWorkableHours() == 0)
				tab.setEditDisabled('Il giorno non prevede ore lavorabili');
		}
	}
	
	return this;
}

/**
 * @param {Array} events
 *
 * @properties={typeid:24,uuid:"E217A1B2-472B-4F8A-8F22-563964BD4D30"}
 */
function disableEvents(events)
{
	if(events && events.length > 0)
		events.forEach(function(e){ e.disabled = e.type != globals.TipologiaEvento.SOSTITUTIVO; });
	
	return events;
}