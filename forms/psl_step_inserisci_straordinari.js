/**
 * @properties={typeid:24,uuid:"0103A379-EDD7-4862-905F-208F9AF5790F"}
 */
function getName()
{
	return scopes.psl.Presenze.Sezioni.STRAORDINARI;
}

/**
 * @properties={typeid:24,uuid:"C7086161-5433-4C71-9A96-DD510C73BD52"}
 */
function getEventsClass()
{
	return globals.TipologiaEvento.AGGIUNTIVO;
}

/**
 * @properties={typeid:24,uuid:"4036C494-726F-455C-9CE0-7B7FF24D2057"}
 */
function getEventsClasses()
{
	return [globals.TipologiaEvento.AGGIUNTIVO];
}

/**
 * @properties={typeid:24,uuid:"F508CEE5-3A62-4279-8B4B-4308A289E63C"}
 */
function hoursConstraint(tab)
{
	var parentConstraint = _super.hoursConstraint(tab);
	
	/**
	 * @param 			data
	 * @param {Boolean} isNew
	 * @param {Array} 	events
	 * @param {Number} 	maxHours
	 */
	return function(data, isNew, events, maxHours)
	{
		var result = parentConstraint(data, isNew, events, maxHours);
		if (result.error)
			return result;
		
		var workedHours = isNew ? tab.getWorkHours() : tab.computeWorkedHours(events);
		
		if(data && data.event)
		{
			var eventHours          = data.event.hours;
			var hoursLeftBeforeRest = 13 - workedHours;
			var newWorkedHours      = workedHours + data.event.hours;
			
			/**
			 * Avviso, superamento della soglia, ma ancora nei limiti della giornata
			 */
			if(eventHours > hoursLeftBeforeRest)
				return { error: true, blocking: false, message: scopes.string.Format('<strong>Attenzione!</strong><br/>\
																					  Le ore lavorate nella giornata (@0 ore) superano la soglia predefinita (13 ore).<br/>\
																					  Se il valore inserito è corretto, ignora pure questo messaggio', newWorkedHours) };
		}
		   
		return { error: false, message: '' };
	}
}

/**
 * @properties={typeid:24,uuid:"315B3B1F-8B79-4D8F-B4CF-1613FD004799"}
 */
function getStepInfo()
{
	return "In questa sezione puoi inserire le ore di straordinario per i lavoratori selezionati precedentemente. Gli eventi qui inseriti \
			sono sommati al monte ore teorico del lavoratore. Gli straordinari nella giornata non possono ovviamente superare le 24 ore totali, \
			ed in particolare <em>le ore lavorate totali, ovvero la somma delle ore ordinarie e degli straordinari, non possono superare le 13 ore</em>."
}
