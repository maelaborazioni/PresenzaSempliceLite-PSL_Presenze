/**
 * @properties={typeid:24,uuid:"E5DC4B2C-EDBB-4D57-9932-66E337B4DAE9"}
 */
function getName()
{
	return scopes.psl.Presenze.Sezioni.ASSENZE;
}

/**
 * @properties={typeid:24,uuid:"72EB43A6-4943-468D-9EFA-FCDD7BF557B1"}
 */
function getEventsClass()
{
	return globals.TipologiaEvento.SOSTITUTIVO;
}

/**
 * @properties={typeid:24,uuid:"4C787A54-6B4D-4CC7-AB92-719182F3D775"}
 */
function getEventsClasses()
{
	return [globals.TipologiaEvento.SOSTITUTIVO];
}

/**
 * @properties={typeid:24,uuid:"A5E6A77A-1E76-448F-B95F-0B5F0404C347"}
 */
function getStepInfo()
{
	return "In questa sezione puoi inserire le ore di assenza per i dipendenti selezionati precedentemente. Gli eventi qui inseriti \
			sono sottratti al monte ore teorico del lavoratore."
}

/**
 * @param tab
 *
 * @properties={typeid:24,uuid:"EFE2B38A-29FD-4CCE-B971-D1ACAFE778CF"}
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
		
		if(data && data.event && data.event.hours)
		{
			/**
			 * Verifica che totale delle ore di assenza non superi il monte ore teorico
			 */
			var leaveHours = 0;
			
			// Escludi gli eventi aggiuntivi in quanto non contribuiscono al depauperamento delle ore lavorabili.
			// I restanti eventi vanno sommati al totale delle ore per la giornata
			events.filter (function(e){ return e.type == globals.TipologiaEvento.SOSTITUTIVO; })			
				  .forEach(function(e){ leaveHours += e.hours; });
			
			/** @type {Number} */
			var newLeaveHours = data.event.hours + leaveHours; 
			if (newLeaveHours > maxHours)
			{
				return { 
					error   : true, 
					blocking: true, 
					message : scopes.string.Format('Il massimo numero di ore di assenza inseribili nella giornata è @0', maxHours) 
				};
			}
		}
		
		return { error: false, message: '' }
	}
}