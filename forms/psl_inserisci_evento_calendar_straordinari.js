/**
 * @param {Array} events
 *
 * @properties={typeid:24,uuid:"5FF3ACDB-FB7F-4F3B-9BF4-A8618B9D6259"}
 */
function disableEvents(events)
{
	if(events && events.length > 0)
		events.forEach(function(e){ e.disabled = e.type != globals.TipologiaEvento.AGGIUNTIVO; });
	
	return events;
}

/**
 * @properties={typeid:24,uuid:"122DBBAA-8A77-4ACD-B4D2-FEA8D8FD7624"}
 */
function init(month, festivita, hours, eventsDataset, certificati, assunzione, cessazione)
{
	_super.init(month, festivita, hours, eventsDataset, certificati, assunzione, cessazione);
	
	for(var day = scopes.date.FirstDayOfMonth(month); day <= scopes.date.LastDayOfMonth(month); day = scopes.date.AddDay(day))
	{
		var tab = getTabForDay(day);
		if (tab.isEnabled() && tab.isHoliday())
			tab.setEditDisabled('Giorno festivo');
	}
	
	return this;
}