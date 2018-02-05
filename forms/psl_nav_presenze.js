/**
 * @properties={typeid:24,uuid:"4F65A8B1-040F-4BA0-A67D-AE2B7F933C8C"}
 */
function getName()
{
	return scopes.psl.Sezioni.PRESENZE['nome'];
}

/**
 * @properties={typeid:24,uuid:"08B344A9-4CDE-48E6-A99B-8427AE5495D4"}
 */
function getProcessingState(_state)
{
	return scopes.psl.Presenze.GetProcessingState(_state);
}

/**
 * @properties={typeid:24,uuid:"3A08F732-98A9-45D8-BD26-64F4B9D8D4EF"}
 */
function getLastEditableState()
{
	return scopes.psl.Presenze.GetLastEditableState();
}

/**
 * @properties={typeid:24,uuid:"417770F2-747E-4CE7-B608-10005989865B"}
 */
function isSendingEnabled()
{
	return getProcessableElaborations().length > 0;
}

/**
 * @param step
 * @param _snapshot
 *
 * @properties={typeid:24,uuid:"195D7BDD-3924-4DD5-8F7A-64E5A98BEAFB"}
 */
function saveSnapshot(step, _snapshot)
{
	state.elaborazione[state['params'].periodo][state['params'].ditta.id].snapshot[step.getName()] = _snapshot;
}

/**
 * @param [params]
 * 
 * @properties={typeid:24,uuid:"9DE0339C-B919-4A92-B740-598B78966803"}
 */
function resetProcessingState(params)
{
	var currDay = globals.TODAY;
	var currDate = currDay.getDate();
	var periodo = (params && params.month) || (currDate <= 15 ? new Date(currDay.getFullYear(),currDay.getMonth() - 1,1) : scopes.date.FirstDayOfMonth(globals.TODAY));
	
	state.params       			= 
	{ 
		periodo: periodo, 
		ditta: { index: 1 }, 
		steps: {
			festivita	 : 0,
			assenze		 : 0,
			straordinari : 0,
			certificati	 : 0,
			richieste	 : 0
		} 
	};
	state.data         			= { };
	state.elaborazione 			= { params: { ditte: [], periodo: null, giorni: [] } };
	state.elaborazione[periodo] = { ditte_in_caricamento: [], ditte_elaborabili: [] };
	
	_super.resetProcessingState(params);
}

/**
 * @properties={typeid:24,uuid:"0EE9B7EE-10AB-4C47-A50E-56536D4169EA"}
 */
function newElaboration()
{
	var oldState = globals.clone(state);
	
	try
	{
		_super.newElaboration();
		
		resetProcessingState();
		restoreProcessingState();
		gotoFirstStep();
	}
	catch(ex)
	{
		state = oldState;
		throw new Error(globals.from_i18n('i18n:ma.psl.err.restore_failed', [ex.message]));
	}
}

/**
 * @param {{ 
 * 			record : JSRecord<db:/ma_framework/psl_hours_processingstate>, 
 * 			month  : Date, 
 * 			company: { 
 * 				id   : Number, 
 * 				index: Number 
 * 			}, 
 * 			reset  : Boolean 
 * 		  }} [params]
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"422D6602-8885-4476-98AA-DADEE24FE332"}
 */
function restoreProcessingState(params)
{
	var month, company;
	
	var record = (params && params.record) || null;
	if(!record)
	{
		month = (params && params.month) || state.params.periodo;
		if (!month)
			throw new Error(controller.getName() + ' - restoreProcessingState: No month provided');
		
		if (params && params.company)
			if(params.company.id)
				company = params.company;
			else
				company =  { id: foundset.getRecord(1).idditta, index: 1 };
	}
	else
	{
		month   = record.month_date;
		company = { id: globals.ma_utl_ditta_toCliente(record.company_id), index: null };
	}
	
	/**
	 * Retrieve the processing records based on owner and month
	 */
	var fs = datasources.db.ma_framework.psl_hours_processingstate.getFoundSet();
	if(!fs || !fs.find())
		throw new Error('i18n:ma.err.find_mode');
	
	fs.owner_id = globals.svy_sec_lgn_owner_id;
	fs.month    = scopes.date.ToIntMonth(month);
	fs.search();
	
	for(var r = 1; r <= fs.getSize(); r++)
	{
		record = fs.getRecord(r);
		
		var company_id = globals.ma_utl_ditta_toCliente(record.company_id);			
		if (record.status)
		{
			/**
			 * Add the company to the appropriate list based on its status
			 */
			switch(record.status.status)
			{
				case scopes.psl.Presenze.StatoElaborazione.DA_CARICARE:
				case scopes.psl.Presenze.StatoElaborazione.IN_CARICAMENTO:
					state.elaborazione[month].ditte_in_caricamento.push(company_id);
					break;
					
				case scopes.psl.Presenze.StatoElaborazione.DA_INVIARE:
					state.elaborazione[month].ditte_elaborabili.push(company_id);
					break;
			}
			
			/**
			 * Update the in-memory processing state
			 */
			var elaboration          = scopes.psl.Presenze.SetProcessingInfo(state, month, company_id, record.status);
				elaboration.is_dirty = record.is_dirty;
				
			/**
			 * Restore the data if present
			 */
			if(record.data)
				state.data[company_id] = record.data;
			
			/**
			 * Load data from the db if the elaboration is marked as dirty
			 */
			// TODO rimuovere la gestione delle ore da qui ed inserirla nel servizio di acquisizione automatica
//			// WARN NON TOCCARE LE ORE INSERITE DALL'UTENTE FINCHE' LA GIORNALIERA NON E' STATA COMPILATA E INVIATA!!!
//			// Carica le ore da database se la giornaliera è compilata ma l'oggetto non è stato popolato
//			var giornalieraInviata = elaboration.compilata && elaboration.status == scopes.psl.Presenze.StatoElaborazione.INVIATA;
//			if (giornalieraInviata && (elaboration.is_dirty || scopes.utl.IsEmpty(ore)))
//			{
//				var ore = scopes.psl.Presenze.GetEvents(state, company_id);
//					ore = scopes.psl.Presenze.RestoreDataFromDatabase(ore, company_id, month, elaboration.lavoratori);
//				
//				elaboration.is_dirty = false;
//			}
		}
	}
	
	/**
	 * Update the current params
	 */
	state.params.periodo = month;
	state.params.ditta   = company;
	
	_super.restoreProcessingState(params);
}

/**
 * @properties={typeid:24,uuid:"64ED04D6-2438-4512-A3E4-7CB3B9085A84"}
 */
function getParams()
{
	return { month: state.params.periodo || scopes.date.FirstDayOfMonth(scopes.date.GetDatePart()) };
}

/**
 * @param {RuntimeForm<psl_presenze_step>} step
 * 
 * @properties={typeid:24,uuid:"CFF094C2-5257-4145-B6FD-4D9CE414CA19"}
 */
function getOnDataChangeListeners(step)
{
	var listeners = _super.getOnDataChangeListeners(step);
	var triggerDirty = [
		scopes.psl.Presenze.Sezioni.CERTIFICATI,
		scopes.psl.Presenze.Sezioni.FESTIVITA, 
		scopes.psl.Presenze.Sezioni.ASSENZE, 
		scopes.psl.Presenze.Sezioni.STRAORDINARI,
		scopes.psl.Presenze.Sezioni.VARIAZIONI
	]; 
	
	if (step.getName() == scopes.psl.Presenze.Sezioni.DITTA_PERIODO)
		listeners.push(updateProcessingState);
	else
	if (triggerDirty.indexOf(step.getName()) > -1)
		listeners.push(segnaDaRicompilare);
		
	return listeners;
}

/**
 * Reinizializza l'elaborazione per i parametri specificati. Questo significa che l'elaborazione
 * è segnata 'da compilare', ed inoltre l'orario teorico dei lavoratori è ricalcolato.<br>
 * <p>
 * <strong>Nota bene</strong><br/>
 * <ul>
 * <li>L'elaborazione non è esplicitamente segnata come 'da attivare', in quanto si suppone che i dati 
 * 	   relativi all'orario teorico siano già aggiornati.</li>
 * <li>Per ogni giorno, se sono rilevate discrepanze tra l'orario teorico precedente alla reinizializzazione 
 * ed il nuovo orario teorico, e qualora siano presenti eventi, il giorno è segnato 'da controllare' 
 * (<code>warning = true</code>). Inoltre, se l'ammontare delle ore di assenza supera il nuovo 
 * orario teorico, il giorno è segnato come 'errato' (<code>error = true</code>). A differenze del
 * primo caso, un giorno errato è considerato bloccante per l'elaborazione, ed impedisce perciò
 * l'avanzamento dell'elaborazione.</li>
 * </ul>
 * </p>
 *  
 * @param {Number} 		  							  ditta
 * @param {Date}   		  							  periodo
 * @param {JSFoundset<db:/ma_anagrafiche/lavoratori>} lavoratori
 *
 * @properties={typeid:24,uuid:"F3B0968E-C11C-4508-A261-E16610611874"}
 * @AllowToRunInFind
 */
function aggiornaElaborazione(ditta, periodo, lavoratori)
{
	var oldState = globals.clone(state);
	
	try
	{
		/** @type {Array<Number>} */
		var idlavoratori = globals.foundsetToArray(lavoratori, 'pkey');
		var data         = scopes.psl.Presenze.GetData(state, ditta);

		// Ricalcola l'elenco dei lavoratori
		var elaborazione 			= scopes.psl.Presenze.GetProcessingInfo(state, periodo, ditta);
			elaborazione.lavoratori = idlavoratori;
		
		/**
		 * Se i dati non sono ancora stati inviati, ricalcola l'orario teorico e ripristina 
		 * gli eventi inseriti sino a questo momento, segnando eventuali giorni squadrati.
		 */
		if (elaborazione.status < scopes.psl.Presenze.StatoElaborazione.INVIATA)
		{
			elaborazione.compilata = false;
			elaborazione.status    = scopes.psl.Presenze.StatoElaborazione.IN_CARICAMENTO;
		
			// 1. Segna tutti gli eventi come 'dirty' per il reinserimento
			var backup = scopes.psl.Presenze.ResetEvents(data.ore);
			// 2. Reinizializza l'orario teorico
			data.ore = scopes.psl.InitHours(elaborazione.lavoratori, periodo);
			// 3. Ripristina gli eventi salvati e segnala eventuali giornate squadrate
			scopes.psl.Presenze.MergeEvents(data.ore, backup, lavoratori);
			// 4. Rimuovi la ditta dall'elenco delle ditte elaborabili
			markAsLoading(ditta);
		}
		/**
		 * Se i dati sono già stati inviati, ripristina la situazione ore da database, in quanto 
		 * nessuna modifica è intervenuta. In questo modo i dati per i nuovi lavoratori sono popolati
		 * automaticamente.
		 */
		else
			data.ore = scopes.psl.Presenze.RestoreDataFromDatabase(data.ore, ditta, periodo, idlavoratori)
		
		return saveState();
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		
		state = oldState;
		saveState();
		
		return false;
	}
	finally
	{
		updateWizardStatus();
	}
}

/**
 * @param {Number} [ditta]
 * @param {Date}   [periodo]
 * 
 * @properties={typeid:24,uuid:"3EAFD247-1722-4526-B707-61A051698C16"}
 */
function segnaDaRettificare(ditta, periodo)
{
	ditta   = ditta   || state.params.ditta.id;
	periodo = periodo || state.params.periodo;
	
	var oldState = globals.clone(state);
	
	try
	{
		var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, periodo, ditta);
		if (elaborazione.status < scopes.psl.Presenze.StatoElaborazione.INVIATA)	// just in case
			throw new Error('Impossibile eseguire la rettifica: i dati non sono ancora stati inviati');
		
		// Reimposta gli eventi come 'dirty'
		var data     = scopes.psl.Presenze.GetData(state, ditta);
			data.ore = scopes.psl.Presenze.ResetEvents(data.ore);
		
		elaborazione.compilata           =
		elaborazione.festivita_approvate = false;
		elaborazione.status              = scopes.psl.Presenze.StatoElaborazione.IN_CARICAMENTO;
		
		return saveState();
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		
		state = oldState;
		saveState();
		
		return false;
	}
	finally
	{
		updateWizardStatus();
	}
}

/**
 * @param {Number} [ditta]
 * @param {Date}   [periodo]
 * 
 * @properties={typeid:24,uuid:"009360B9-8B0E-4A28-AB24-611FEC2848BC"}
 */
function segnaDaRicompilare(ditta, periodo)
{	
	ditta   = ditta   || state.params.ditta.id;
	periodo = periodo || state.params.periodo;
	
	var oldState = globals.clone(state);
	
	try
	{	
		var elaborazione		   = scopes.psl.Presenze.GetProcessingInfo(state, periodo, ditta);
			elaborazione.compilata = false;
		
		// Reimposta gli eventi come 'dirty'
		var data     = scopes.psl.Presenze.GetData(state, ditta);
			data.ore = scopes.psl.Presenze.ResetEvents(data.ore)
			
		// rimuovi la ditta dall'elenco delle ditte elaborabili
		markAsLoading(ditta);
			
		if(!saveState())
			throw new Error('i18n:ma.err.wiz_state_save');
			
		updateWizardStatus();
		
		// show success message
		forms.psl_status_bar.setStatusSuccess('i18n:ma.msg.operations.success');
	}
	catch(ex)
	{
		state = oldState;
		saveState();
		
		globals.ma_utl_logError(ex);
		forms.psl_status_bar.setStatusError();
	}
}

/**
 * @properties={typeid:24,uuid:"71AA7A25-5582-4B6E-878F-A8BA3459F419"}
 */
function finalizeData()
{
	var ditta        = state.params.ditta.id;
	var periodo      = state.params.periodo;
	var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, periodo, ditta);
	var lavoratori   = elaborazione.lavoratori;
	var steps        = state.params.steps;
	
	markAsClean(ditta);
	markAsProcessable(ditta);
	markToSend(ditta);
	
	var params = 
	{ 
		idditta	   : ditta,
		periodo	   : scopes.date.ToIntMonth(periodo),
		giorni	   : scopes.date.GetDates(periodo),
		lavoratori : lavoratori,
		steps	   : steps
	};
	
	var jobs = [];
	if(!saveJobs(params, jobs))
		return { error: true, message: 'i18n:ma.psl.err.job_not_saved' };
	
	var result = _super.finalizeData();
	if (result.error)
		return result;
	
	return { error: false, message: '', jobs: jobs };
}

/**
 * @properties={typeid:24,uuid:"2F44FA14-D09A-4A32-9BF3-3DCF7E78CDE1"}
 * @AllowToRunInFind
 */
function salvaVariazioni(ditta, periodo)
{
	var fs = datasources.db.ma_richieste.lavoratori_richieste.getFoundSet();
	if(!fs || !fs.find())
		return false;
	
	fs.idditta         = globals.ma_utl_ditta_toSede(ditta);
	fs.periodocedolino = periodo;
	fs.inviata 		   = 0;
	
	fs.search();
	
	var requestsToSend = globals.foundsetToArray(fs);
	if (requestsToSend.length > 0)
	{
		/** @type {{ error: Boolean, message: String }} */
		var result = scopes.psl.RunJob(
						{
							method			: scopes.richieste.markRequestsAsSent,
							args			: [requestsToSend],
							start_message	: 'Salvataggio variazioni in corso...',
							sync			: true
						});
		
		if(!result.error)
			databaseManager.refreshRecordFromDatabase(fs, -1);
		
		return !result.error;
	}
	
	return true;
}

/**
 * @param {JSRecord<db:/ma_framework/psl_hours_jobqueue>} record
 * @param {Boolean} [showProcessing=true] handle enable/disable. Defaults to true
 * 
 * @properties={typeid:24,uuid:"1E4682B0-CFC2-41D9-8255-3C4BABB3F826"}
 */
function startJob(record, showProcessing)
{
	showProcessing = showProcessing != false;
	
	openElaboration(record.psl_hours_jobqueue_to_psl_hours_processingstate.getSelectedRecord());
	
	var jobParams = record.params;
	
	showProcessing && disable();
	var success = sendDataAction(jobParams);
	showProcessing && enable(success);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C7074B0A-8B6D-4547-A7C4-558FFF5C3A67"}
 */
function onAction$btn_send(event)
{
	/** @type {Array<JSRecord<db:/ma_framework/psl_hours_processingstate>>} */
	var jobsToStart = selectDataToSend();
	
	if (jobsToStart && jobsToStart.length > 0)// && globals.ma_utl_showYesNoQuestion('i18n:ma.psl.msg.start_longrunning_operation'))
		for(var j = 0; j < jobsToStart.length; j++)
			startJob(jobsToStart[j].psl_hours_processingstate_to_psl_hours_jobqueue.getSelectedRecord());
}

/**
 * @param {{ 
 * 			idditta	      : Number, 
 * 			periodo		  : Number, 
 * 			giorni		  : Array<Number>, 
 * 			lavoratori	  : Array<Number>, 
 * 			steps		  : 
 * 			{ 
 * 				festivita    : Number,
 * 				assenze		 : Number,
 * 				straordinari : Number,
 * 				certificati	 : Number,
 * 				richieste	 : Number 
 * 			}
 * 		   }}	 
 * 
 * 		params the job parameters
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"18BC5830-8601-4A08-A2D0-F624E6744ED7"}
 */
function compilaGiornaliera(params)
{
	try
	{
		var error = false;
		/** @type {{ error: Boolean, message: String }} */
		var result;
	
		var ditta   = params.idditta;
		var periodo = params.periodo;
		
		/**
		 * 0. Compila la giornaliera, se necessario
		 */
		var callParams = globals.inizializzaParametriCompilaConteggio
						 (
							 params.idditta,
							 params.periodo,
							 globals.TipoGiornaliera.NORMALE,
							 globals.getTipoConnessione(),
							 params.giorni,
							 params.lavoratori,
							 false
						 );
		
		var jobParams =
		{
			method		  : globals.compilaDalAlSync,
			args  		  : [callParams, true],
			start_message : 'Compilazione mese in corso...',
			sync		  : true
		};
	
		result = scopes.psl.RunJob(jobParams);
		if(result.error)
		{
			globals.ma_utl_logError(new Error(result.message));
			return false;
		}
		
		/**
		 * 1. Salva tutti gli eventi per i lavoratori scelti, saltando quelli che generano errore.
		 */
		var ore = state.data[ditta].ore;
		if (ore)
		{
			var lavoratori = datasources.db.ma_anagrafiche.lavoratori.getFoundSet();
				lavoratori.find() && (lavoratori.idlavoratore = params.lavoratori) && lavoratori.search();
				
			for(var l = 1; l <= lavoratori.getSize(); l++)
			{
				var lavoratore   = lavoratori.getRecord(l);
				var idlavoratore = lavoratore.idlavoratore;
				
				for(var day in ore[idlavoratore])
				{
					error = false;
					
					var date = utils.parseDate(day, globals.ISO_DATEFORMAT);
					/** @type {Array<{ id: Number, code: String, property: String, type: String, hours: Number, is_new: Boolean, to_delete: Boolean, is_dirty: Boolean }>} */
					var events = ore[idlavoratore][day].events;
					
					/** @type {Array<{ id: Number, code: String, property: String, type: String, hours: Number, is_new: Boolean, to_delete: Boolean, is_dirty: Boolean }>} */
					var dirty_events = events.filter(function(_){ return _.is_dirty; });
					if (dirty_events.length > 0)
					{
						result = scopes.psl.RunJob(
						{
							method		  : salvaEventi,
							args		  : [dirty_events, date, ditta, periodo, idlavoratore],
							sync		  : true,
							start_message : scopes.string.Format('Compilazione mese in corso... @0', lavoratore.nominativo_qualifica)
						});
						
						error = result.error;
					}
					
					// exclude deleted events (to_delete = false) if correctly persisted
					var nonPersistedEvents = events.filter(function(_) { return _.persisted && !_.toDelete; })
					ore[idlavoratore][day].events = nonPersistedEvents; 
				}
			}
		}
		
		/**
		 * 2. Compila gli eventi lunghi
		 */
		if(!error)
			error = !salvaCertificati(params);
		
		if (error)
			globals.ma_utl_logError(new Error(result.message));
		
		return !error;
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		return false;
	}
}

/**
 * @param {{ 
 * 			idditta	      : Number, 
 * 			periodo		  : Number, 
 * 			giorni		  : Array<Number>, 
 * 			lavoratori	  : Array<Number>, 
 * 			steps		  : 
 * 			{ 
 * 				festivita    : Number,
 * 				assenze		 : Number,
 * 				straordinari : Number,
 * 				certificati	 : Number,
 * 				richieste	 : Number 
 * 			}
 * 		   }}	 
 * 
 * 		params the job parameters
 *
 * @properties={typeid:24,uuid:"15089283-226A-4305-AA92-255D1EB7E63B"}
 */
function compilaDalAl(params)
{
	var callParams = globals.inizializzaParametriCompilaConteggio(
							    params.idditta,
							    params.periodo,
							    globals.TipoGiornaliera.NORMALE,
							    globals.getTipoConnessione(),
							    params.giorni,
							    params.lavoratori,
								false);

	return scopes.psl.RunJob(
				{
					method			: globals.compilaDalAlSync,
					args  			: [callParams, true],
					start_message	: 'Compilazione mese in corso...',
					sync			: true
				});
}

/**
 * @properties={typeid:24,uuid:"C4BF1CAA-FE40-498B-A571-CDD214567399"}
 */
function salvaEventi(events, giorno, ditta, periodo, idlavoratore)
{
	var error = false;

	for(var e = 0; e < events.length; e++)
	{
		/** @type {{ id: Number, code: String, property: String, hours: Number, is_new: Boolean, to_delete: Boolean }} */
		var event = events[e];
		var callParams = globals.inizializzaParametriEvento(
							ditta, 
							periodo, 
							0,
							[giorno.getDate()],
							globals.TipoGiornaliera.NORMALE,
							globals.getTipoConnessione(),
							[idlavoratore],
							event.id,
							event.property,
							event.hours,
							0,
							(event.is_new) ? -1 : event.id,
							(event.is_new) ? '' : event.property,
							0);
		
		var	success = globals.salvaEvento(callParams);
		if (success)
		{
			event.is_dirty  = false;
			event.persisted = true;
		}
		else
		{
			globals.ma_utl_logError(new Error('Errore durante il salvataggio dell\'evento: [' + idlavoratore + ', ' + event.code + ' ' + event.hours.toFixed(2) + ', ' + utils.dateFormat(giorno, globals.EU_DATEFORMAT) + ']'));
			event.error = error = true;
		}
	}
	
	if(error)
		return { error: true, message: 'Errore durante il salvataggio degli eventi. Contattare lo studio' };
	else
		return { error: false, message: 'Salvataggio avvenuto correttamente' };
}

/**
 * @param {JSRecord<db:/ma_framework/psl_hours_processingstate>} [record]
 * 
 * @properties={typeid:24,uuid:"2DF625D3-413C-448F-9E57-EDAB2C559C53"}
 * @AllowToRunInFind
 */
function saveProcessingState(record)
{
	record = record || getElaborationRecord();
	
	// no elaboration means no new data
	if(!record)
		return true;
	
	if(!_super.saveProcessingState(record))
		return false;
	
	try
	{
		databaseManager.startTransaction();
		
		var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, record.month_date, globals.ma_utl_ditta_toCliente(record.company_id));
		
		record.status   = elaborazione;
		record.is_dirty = elaborazione.is_dirty ? 1 : 0;
		record.data     = state.data[state.params.ditta.id];
		
		if(!databaseManager.commitTransaction())
		{
			globals.ma_utl_logError(new Error('psl: Error while saving the processing state of company with id [' + record.company_id + ']'));
			globals.ma_utl_logError(databaseManager.getFailedRecords()[0].exception);
			databaseManager.rollbackTransaction();
			
			return false;
		}
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		databaseManager.rollbackTransaction();
		
		return false;
	}
	
	return true;
}

/**
 * Search for the current elaboration. If not found, creates it based on current state.params
 * 
 * @return {JSRecord<db:/ma_framework/psl_hours_processingstate>}
 * 
 * @properties={typeid:24,uuid:"885B5F62-C49E-46FD-877F-F8C729104044"}
 * @AllowToRunInFind
 */
function getElaborationRecord()
{
	try
	{
		var company_id = globals.ma_utl_ditta_toSede(state.params.ditta.id);
		var month      = scopes.date.ToIntMonth(state.params.periodo);
		
		var fs = datasources.db.ma_framework.psl_hours_processingstate.getFoundSet();
		if (fs.find() && (fs.company_id = company_id) && (fs.month = month) && (fs.owner_id = globals.svy_sec_lgn_owner_id) && fs.search() > 0)
		{
			application.output('Elaboration found: ' + fs.elaboration_id, LOGGINGLEVEL.INFO);
			return fs.getSelectedRecord();
		}
		
		var record 			  = fs.getRecord(fs.newRecord());
			record.company_id = company_id;
			record.month      = month;
			record.owner_id   = globals.svy_sec_lgn_owner_id;
			
		application.output('Elaboration created', LOGGINGLEVEL.INFO);
			
		return record;
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		return null;
	}
}

/**
 * @param {{ 
 * 			idditta	      : Number, 
 * 			periodo		  : Number, 
 * 			giorni		  : Array<Number>, 
 * 			lavoratori	  : Array<Number>, 
 * 			steps		  : 
 * 			{ 
 * 				festivita    : Number,
 * 				assenze		 : Number,
 * 				straordinari : Number,
 * 				certificati	 : Number,
 * 				richieste	 : Number 
 * 			},
 * 			[elaboration] : JSRecord<db:/ma_framework/psl_hours_processingstate> }}  	 
 * 
 * 		params the job parameters
 * 
 * @param {Array<JSRecord<db:/ma_framework/psl_hours_jobqueue>>}
 * 
 * 		[jobs] 	an array to be populated with saved jobs
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"1060BCDD-227B-446B-9D03-2AEB1ABA2924"}
 */
function saveJobs(params, jobs)
{
	if(!_super.saveJobs(params))
		return false;
	
	var elaboration = params.elaboration || getElaborationRecord();

	var record;
	
	if(elaboration.psl_hours_processingstate_to_psl_hours_jobqueue.getSize() > 0)
		record = elaboration.psl_hours_processingstate_to_psl_hours_jobqueue.getSelectedRecord();
	else
		record = elaboration.psl_hours_processingstate_to_psl_hours_jobqueue.getRecord(elaboration.psl_hours_processingstate_to_psl_hours_jobqueue.newRecord());

	try
	{
		databaseManager.startTransaction();
		
		record.params = 
		{ 
			idditta    : params.idditta, 
			periodo    : params.periodo, 
			giorni     : params.giorni, 
			lavoratori : params.lavoratori,
			steps      : params.steps
		};
		
		if(!databaseManager.commitTransaction())
		{
			globals.ma_utl_logError(new Error('psl: Error while saving the processing state of company ' + params.idditta));
			globals.ma_utl_logError(databaseManager.getFailedRecords()[0].exception);
			databaseManager.rollbackTransaction();
			
			return false;
		}
	}
	catch(ex)
	{
		globals.ma_utl_logError(new Error(ex));
		databaseManager.rollbackTransaction();
		
		return false;
	}
	finally
	{
		if(jobs && record)
			jobs.push(record);
	}
	
	return true;
}

/**
 * @return {Array}
 * 
 * @properties={typeid:24,uuid:"3321F052-6DDD-4EBA-ACB1-2C129A003C89"}
 */
function selectDataToSend()
{	
	/** @type {Array} */
	var jobs = globals.ma_utl_showLkpWindow(
				{
					lookup: 'PSL_Lkp_Hours_ProcessingState',
					methodToAddFoundsetFilter: 'filterElaborazioniToSend',
					multiSelect: true,
					allowInBrowse: true,
					returnForm: controller.getName(),
					noRecordMessage: 'Nessuna ditta disponibile per l\'invio',
					returnFullRecords: true,
					verbose: true,
					dateFormat: 'MM/yyyy'
				});
	
	return jobs;
}

/**
 * @param {JSRecord<db:/ma_framework/psl_hours_processingstate>} record
 *
 * @properties={typeid:24,uuid:"D7D3FD9E-D018-48BA-8BDB-82BDA6D8917E"}
 */
function openElaboration(record)
{
	if(!record)
		return false;

	updateProcessingState({ record: record, reset: true});
	
	gotoFirstStep();
	getCurrentStepForm().updateStatus(state);
	
	return true;
}

/**
 *  @param {{ 
 * 			idditta	      : Number, 
 * 			periodo		  : Number, 
 * 			giorni		  : Array<Number>, 
 * 			lavoratori	  : Array<Number>, 
 * 			steps		  : 
 * 			{ 
 * 				festivita    : Number,
 * 				assenze		 : Number,
 * 				straordinari : Number,
 * 				certificati	 : Number,
 * 				richieste	 : Number 
 * 			}
 * 		   }}	 
 * 
 * 		params the job parameters
 *
 * @properties={typeid:24,uuid:"176B7A69-D163-4F48-BC57-8D44E9D04BC6"}
 */
function processData(params)
{
	if(!_super.processData(params))
		return false;
	
	try
	{
		var fs           = datasources.db.ma_anagrafiche.ditte.getFoundSet();
		var ditta        = params.idditta;
		var periodo      = scopes.date.FromIntMonth(params.periodo);
		var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, periodo, ditta);
		var data         = scopes.psl.Presenze.GetData(state, ditta);
		
		fs.loadRecords(ditta);
		
		/**
		 * 1.0 Salva una copia delle ore pre-compilazione. Escludi gli eventi da eliminare, in quanto
		 * 	   la successiva compilazione pulisce già la giornaliera
		 */
		data.backup = globals.clone(data.ore); 
		
		var success = saveState();
		if(!success)
		{
			forms.psl_status_bar.setStatusError('i18n:ma.err.wiz_state_save');
			return false;
		}
		
		/**
		 * 2.0 Compilazione giornaliera
		 */
		if(success && !elaborazione.compilata)
		{
			success = compilaGiornaliera(params) && saveState();
			if(success)
			{
				elaborazione.compilata = true;
				success = saveState();
			}
			else
				elaborazione.message = 'Errore durante la compilazione dei dati. Contattare il servizio di assistenza per la verifica dell\'anomalia riscontrata.';
		}
		
		/**
		 * 2.1 Controlli Preliminari
		 */
		if(success)
		{
			success = controlliPreliminari(params) && saveState();
			if(success)
			{
				elaborazione.compilata = true;
				// le ore sono aggiornate esternamente a servoy, ricarichiamole
				state.data[ditta].ore = scopes.psl.Presenze.RestoreDataFromDatabase(state.data[ditta].ore, ditta, periodo, params.lavoratori);
				success = saveState();
			}
			else
				elaborazione.message = 'Errore durante l\'esecuzione dei controlli preliminari. Contattare il servizio di assistenza per la verifica dell\'anomalia riscontrata.';
		}
		
		/**
		 * 2.2 Chiusura Mese
		 */
		if(success)
		{
			success = chiusuraMese(params) && saveState();
			if(!success)
				elaborazione.message = 'Errore durante l\'esecuzione di chiusura mese. Contattare il servizio di assistenza per la verifica dell\'anomalia riscontrata.';
		}
		
		elaborazione.error = !success;
		
		if(success)
			forms.psl_status_bar.setStatusSuccess('i18n:ma.msg.operations.success');
		else
		{
			forms.psl_status_bar.setStatusError(elaborazione.message);
			globals.ma_utl_logError(scopes.string.Format("Ditta @0, periodo @1: @2", fs.codice_ragionsociale, params.periodo, state.error));
		}
		
		saveState();
		getCurrentStepForm().updateStatus(state);
		
		return success;
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		forms.psl_status_bar.setStatusError(scopes.error.FormatError(ex.message));
		
		elaborazione.error = true;
		elaborazione.message = 'i18n:ma.err.generic_error';
		
		saveState();
		getCurrentStepForm().updateStatus(state);
		
		return false;
	}
}

/**
 * @param {{ 
 * 			idditta	      : Number, 
 * 			periodo		  : Number, 
 * 			giorni		  : Array<Number>, 
 * 			lavoratori	  : Array<Number>, 
 * 			steps		  : 
 * 			{ 
 * 				festivita    : Number,
 * 				assenze		 : Number,
 * 				straordinari : Number,
 * 				certificati	 : Number,
 * 				richieste	 : Number 
 * 			},
 * 			[elaboration] : JSRecord<db:/ma_framework/psl_hours_processingstate> }}  	 
 * 
 * 		params the job parameters
 * 
 * @properties={typeid:24,uuid:"5179EF6B-6303-4E6C-85E5-7F0C696487DB"}
 */
function sendData(params)
{
	try
	{
		if(!_super.sendData(params))
			return false;
		
		var ditta        = params.idditta;
		var periodo      = scopes.date.FromIntMonth(params.periodo);
		var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, periodo, ditta);
		
		/**
		 * 2.3 (PRE) Aggiornamento variazioni (richieste)
		 */
		var success = salvaVariazioni(ditta, params.periodo) && saveState();
		if(!success)
			elaborazione.message = 'Errore durante l\'aggiornamento delle variazioni. Contattare il servizio di assistenza per la verifica dell\'anomalia riscontrata.';
		
		/**
		 * 2.3 Invio giornaliera su FTP
		 */
		success = success && invioGiornaliera(params) && saveState();
		if(!success)
			elaborazione.message = 'Errore durante l\'invio della giornaliera. Contattare il servizio di assistenza per la verifica dell\'anomalia riscontrata.';

//      TODO PANNELLO VARIAZIONI		
//		/**
//		 * 2.3 (NEW) Invio giornaliera con unificazione del pannello variazioni
//		 */
//		success = invioGiornalieraNew(params)  && saveState();
//		if(!success)
//			elaborazione.message = 'Errore durante l\'invio della giornaliera. Contattare il servizio di assistenza per la verifica dell\'anomalia riscontrata.';
		
		if (success)
		{
			markAsSent(ditta);
			
			if(saveState())
				forms.psl_status_bar.setStatusSuccess('Invio dati avvenuto correttamente');
			else
				forms.psl_status_bar.setStatusError('i18n:ma.err.wiz_state_save');
		}
		
		elaborazione.error = !success;
		
		updateWizardStatus();
		
		return success;
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		forms.psl_status_bar.setStatusError('i18n:ma.err.generic_error');
		
		updateWizardStatus();
		
		return false;
	}
}

/**
 * @param params
 *
 * @properties={typeid:24,uuid:"B0DE1816-3DB6-45BE-8439-32AD100C9F19"}
 */
function controlliPreliminari(params)
{
	var callParams 				= globals.inizializzaParametriAttivaMese(params.idditta, params.periodo, globals.getGruppoInstallazioneDitta(params.ditta), '', globals.getTipoConnessione());
		callParams.iddipendenti = params.lavoratori;
		callParams.giorni 		= params.giorni;
		callParams.sync			= true;

	var jobParams = 
	{ 
		method: scopes.giornaliera.controlliPreliminari, 
		args: [callParams],
		start_message: 'Controlli preliminari in corso...',
		sync: true
	};
	
	/** @type {{ error: Boolean, message: String }} */
	var result = scopes.psl.RunJob(jobParams);
	if (result.error)
		state.error = result.message;
	
	return !result.error;
}

/**
 * @param {{ idditta   : Number, 
 * 			 periodo   : Number  }} 	params
 *
 * @properties={typeid:24,uuid:"047C77D6-2ECA-4136-A720-E332B371072E"}
 */
function attivaMese(params)
{
	var callParams = [params.idditta, params.periodo, globals.getGruppoInstallazioneDitta(params.idditta), '', true];
	var jobParams  = 
	{ 
		method: scopes.giornaliera.attivaMese, 
		args: callParams,
		start_message: 'Attivazione mese in corso...',
		sync: true
	};
	
	/** @type {{ error: Boolean, message: String }} */
	var result = scopes.psl.RunJob(jobParams);
	if (result.error)
		state.error = result.message;
	
	return !result.error;
}

/**
 * @param params
 *
 * @properties={typeid:24,uuid:"A23E582F-30A3-44C7-940F-152157E13436"}
 */
function chiusuraMese(params)
{
	var callParams 				= globals.inizializzaParametriAttivaMese(params.idditta, params.periodo, globals.getGruppoInstallazioneDitta(params.ditta), '', globals.getTipoConnessione());
		callParams.iddipendenti = globals.ottieniArrayDipDaChiudere(params);
		callParams.giorni 		= params.giorni;
		callParams.sync         = true;
	
	var jobParams = 
	{ 
		method: scopes.giornaliera.chiudiMeseSelezionato, 
		args: [callParams],
		start_message: 'Chiusura mese in corso...',
		sync: true
	};
	
	/** @type {{ error: Boolean, message: String }} */
	var result = scopes.psl.RunJob(jobParams);
	if (result.error)
		state.error = result.message;
	
	return !result.error;
}

/**
 * @param params
 *
 * @properties={typeid:24,uuid:"2B8EE6D6-A4C8-4DF6-8256-0DE8FA69C803"}
 */
function invioGiornaliera(params)
{
	var callParams 				= globals.inizializzaParametriAttivaMese(params.idditta, params.periodo, globals.getGruppoInstallazioneDitta(params.ditta), '', globals.getTipoConnessione());
		callParams.iddipendenti = params.lavoratori;
		callParams.giorni 		= params.giorni;
		callParams.sync			= true;

	var jobParams = 
	{ 
		method: scopes.giornaliera.inviaGiornalieraSuFtp, 
		args: [callParams],
		start_message: 'Invio giornaliera in corso...',
		sync: true
	};
	
	/** @type {{ error: Boolean, message: String }} */
	var result = scopes.psl.RunJob(jobParams);
	if (result.error)
		state.error = result.message;
	
	return !result.error;
}

/**
 * @param params
 *
 * @properties={typeid:24,uuid:"14358D9C-77A6-4A63-B7A6-698254264F71"}
 */
function invioGiornalieraNew(params)
{
	var callParams 			= globals.inizializzaParametriAttivaMese(params.idditta, params.periodo, globals.getGruppoInstallazioneDitta(params.ditta), '', globals.getTipoConnessione());
	callParams.iddipendenti = globals.ottieniArrayDipDaInviare(params.idditta,params.periodo);
	callParams.giorni 		= params.giorni;
	callParams.sync			= true;

	var jobParams = 
	{ 
		method: scopes.giornaliera.inviaGiornalieraSuFtp, 
		args: [callParams],
		start_message: 'Invio giornaliera in corso...',
		sync: true
	};
	
	/** @type {{ error: Boolean, message: String }} */
	var result = scopes.psl.RunJob(jobParams);
	if (result.error)
		state.error = result.message;
	
	return !result.error;
}

/**
 * @param params
 *
 * @properties={typeid:24,uuid:"A2983CF9-018F-4B22-9D40-E11D82CAABA0"}
 */
function salvaCertificati(params)
{
	var error 		 = false;
	var classiEvento = globals.EventoClasse;
	
	for(var ec in classiEvento)
	{
		/** @type {{ error: Boolean, message: String }} */
		var result = scopes.psl.RunJob
		(
			{
				method: compilaCertificati,
				args: [classiEvento[ec], params],
				starting_message: 'Salvataggio certificati in corso...',
				sync: true
			}
		);
		
		error = error || result.error;
	}
	
	return !error;	
}

/**
 * @param idEventoClasse
 * @param params
 *
 * @properties={typeid:24,uuid:"6F3BBFCC-9E4E-4BB6-88A2-3671E3B4BC65"}
 */
function compilaCertificati(idEventoClasse, params)
{
	var success = true;
	
	params.lavoratori.forEach(
		function(lavoratore)
		{
			var resCert = scopes.storico.GiorniCopertiDaCertificato(lavoratore,params.periodo,idEventoClasse);
			if(resCert.length != 0)
			{
				var callParams =
				{
					user_id : security.getUserName(), 
					client_id : security.getClientID(),
					iddipendenti: [lavoratore],
					idditta: params.idditta,
					periodo: params.periodo,
					tipogiornaliera: globals.TipoGiornaliera.NORMALE,
					tipoconnessione: globals.getTipoConnessione(),
					ideventoclasse: idEventoClasse
				}
				
				var response = scopes.storico.compilaGiornaliera(callParams);
				success = success && response.returnValue;
			}
		}
	);
		
	return success;
}

/**
 * @param params
 *
 * @properties={typeid:24,uuid:"2FA4CF4F-6F31-47C3-BD19-88D6AF609B87"}
 */
function compilaCertificatiInGiornaliera(params)
{
	return scopes.storico.compilaGiornaliera(params);
}

/**
 * @param ditta
 *
 * @properties={typeid:24,uuid:"49BE1388-31A8-4D97-9E2C-5B13A282BB4D"}
 */
function markAsClean(ditta)
{
	state.elaborazione[state.params.periodo][ditta].error = false;
	state.elaborazione[state.params.periodo][ditta].message = '';
}

/**
 * @param ditta
 *
 * @properties={typeid:24,uuid:"EF0A3E6D-6C4A-4E92-BCD8-063D7BED320F"}
 */
function markAsProcessable(ditta)
{
	var index = state.elaborazione[state.params.periodo].ditte_in_caricamento.indexOf(ditta);
	if (index > -1)
	{
		var status = state.elaborazione[state.params.periodo][ditta];
			status.status = scopes.psl.Presenze.StatoElaborazione.DA_INVIARE;
		
		if(state.elaborazione[state.params.periodo].ditte_elaborabili.indexOf(ditta) == -1)
		{
			state.elaborazione[state.params.periodo].ditte_elaborabili.push(ditta);
			state.elaborazione[state.params.periodo].ditte_in_caricamento.splice(index, 1);
		}
	}
}

/**
 * @param ditta
 *
 * @properties={typeid:24,uuid:"7DCA895B-B52D-4913-AC5B-DD71204AC07B"}
 */
function markAsLoading(ditta)
{
	var index = state.elaborazione[state.params.periodo].ditte_elaborabili.indexOf(ditta);
	if (index > -1)
	{
		if (state.elaborazione[state.params.periodo].ditte_in_caricamento.indexOf(ditta) == -1)
		{
			state.elaborazione[state.params.periodo].ditte_in_caricamento.push(ditta);
			state.elaborazione[state.params.periodo].ditte_elaborabili.splice(index, 1);
		}
	}
}

/**
 * @param {Number} ditta
 *
 * @properties={typeid:24,uuid:"3DF5EB30-37E3-4009-8085-FAFA26180607"}
 */
function markAsSent(ditta)
{
	state.elaborazione[state.params.periodo][ditta].status = scopes.psl.Presenze.StatoElaborazione.INVIATA;
	state.elaborazione[state.params.periodo].ditte_elaborabili.splice(state.elaborazione[state.params.periodo].ditte_elaborabili.indexOf(ditta), 1);
}

/**
 * @param {Number} ditta
 *
 * @properties={typeid:24,uuid:"095EEC6F-168F-4868-9DCF-955ABA3D35DA"}
 */
function markAsSaved(ditta)
{
	state.elaborazione[state.params.periodo][ditta].status = scopes.psl.Presenze.StatoElaborazione.COMPILATA;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param ditta
 *
 * @properties={typeid:24,uuid:"83678780-5AE6-4EDE-BC08-9F6383083F10"}
 */
function markToSend(ditta)
{
	state.elaborazione[state.params.periodo][ditta].status = scopes.psl.Presenze.StatoElaborazione.DA_INVIARE;
}

/**
 * @properties={typeid:24,uuid:"A4F9484C-B3FA-48B3-B758-4BDB5874C96A"}
 */
function getProcessableElaborations()
{
	return state.elaborazione[state.params.periodo].ditte_elaborabili.map(function(_){ return globals.ma_utl_ditta_toSede(_); }) || [];
}

/**
 * @properties={typeid:24,uuid:"A5A172B6-8042-4DDE-BDFC-19CE078D0B25"}
 */
function filterElaborazioniToSend(fs)
{
	if(fs)
	{
		var ditte_elaborabili = getProcessableElaborations();
		var periodo           = scopes.date.ToIntMonth(state.params.periodo);
		
		fs.addFoundSetFilterParam('company_id', globals.ComparisonOperator.IN, ditte_elaborabili);
		fs.addFoundSetFilterParam('month', globals.ComparisonOperator.EQ, periodo);
		fs.addFoundSetFilterParam('owner_id', globals.ComparisonOperator.EQ, globals.svy_sec_lgn_owner_id);
	}
		
	return fs;
}