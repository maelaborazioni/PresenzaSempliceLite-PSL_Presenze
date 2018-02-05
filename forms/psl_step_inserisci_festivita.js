/**
 * @properties={typeid:24,uuid:"571CC662-A5D6-4DBA-8850-F8B3B51C0874"}
 */
function enable()
{
	_super.enable();
	disableMultipleEvents();
}

/**
 * @properties={typeid:24,uuid:"BB62B9E0-BF8A-4997-8F47-944A6A4ABD30"}
 */
function getName()
{
	return scopes.psl.Presenze.Sezioni.FESTIVITA;
}

/**
 * @properties={typeid:24,uuid:"3A7F04C6-7B6F-4BC2-A454-029FF7627F45"}
 */
function getEventsClasses()
{
	return [globals.TipologiaEvento.AGGIUNTIVO];
}

/**
 * @properties={typeid:24,uuid:"59F006BC-3845-4964-941E-F5C618C13C67"}
 */
function hoursConstraint(tab)
{
	var parentConstraint = _super.hoursConstraint(tab);
	
	return function(data, isNew, events, maxHours)
	{
		var result = parentConstraint(data, isNew, events, maxHours);
		if (result.error)
			return result;
		
		if(data && data.event)
		{
			var workedHours = isNew ? tab.getWorkHours() : tab.computeWorkedHours(events);
			if (data.event.hours > 13 - workedHours)
				return { error: true, blocking: false, message: 'Le ore lavorate nella giornata superano la soglia predefinita (13 ore)' };
		}
		
		return { error: false, message: '' };
	}
}

/**
 * @properties={typeid:24,uuid:"2BD4119B-AF48-416D-9E54-E6F78A2D68DB"}
 */
function getStepInfo()
{
	return "<h3>Festività</h3>\
			In questa sezione puoi gestire i giorni festivi per il mese selezionato. Poiché il trattamento delle festività segue regole particolari, \
			inserisci qui sia le ore di assenza che di straordinario effettuate dal lavoratore in un giorno festivo.";
}
