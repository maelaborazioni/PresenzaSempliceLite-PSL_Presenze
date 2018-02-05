/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C55816B0-908D-45CE-B6F4-BCCD8DF976DF"}
 */
var buttonsScript = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"783CBC50-4E3E-4CBF-AD43-602558D8BA93"}
 */
var html_processdata = '<span class="icon icon-small icon-cogs processdata"/>';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9E36AB2D-788F-4502-BA9E-9A298D2EC29B"}
 */
var html_prints = '<span class="icon icon-small icon-file-pdf prints"/>';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B1F4A320-DE51-4599-8983-932BC5BDB5D2",variableType:4}
 */
var v_process = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3616DC17-662B-4BD6-8837-3D5E2117CBC2",variableType:8}
 */
var v_prints = 0;

/**
 * @type {Array<byte>}
 * 
 * @properties={typeid:35,uuid:"8CEB0B6E-2161-4427-9A2B-B3A8EA82F209",variableType:-4}
 */
var v_file = null;

/**
 * @type {Array<Number>}
 * 
 * @properties={typeid:35,uuid:"D0C12181-980A-4267-925C-23B4EE2989E0",variableType:-4}
 */
var lavoratori = [];

/**
 * @properties={typeid:24,uuid:"A43B0BA3-3FE6-4E4F-BFD7-753BB06057A8"}
 */
function getName()
{
	return scopes.psl.Presenze.Sezioni.ELABORAZIONE;
}

/**
 * @properties={typeid:24,uuid:"FC0D34DE-4D62-4D41-9906-3BD615209CDA"}
 */
function saveState(state)
{
	return {
		v_process : v_process,
		v_prints  : v_prints
	};
}

/**
 * @param snapshot
 * @param state
 *
 * @properties={typeid:24,uuid:"5C05ABDD-0236-4EC2-A366-533EF46CA9F7"}
 */
function restoreStateFromSnapshot(snapshot, state)
{
	v_process = snapshot.v_process;
	v_prints  = snapshot.v_prints;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"8C37C4FE-150B-4C02-AABA-F81CD185EBF2"}
 */
function beforeStep(state)
{
	var result = _super.beforeStep(state);
	if (result.error)
		return result;
	
	var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, v_month, v_ditta)
		lavoratori   = elaborazione.lavoratori;
	
	return { error: false, message: '' };
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"05394AFC-8EB1-4FD1-9CB4-C84D55B14440"}
 */
function validateStep(state)
{
	if(!_super.validateStep(state))
		return false;
	
	var isValid = (v_process == 1 && v_prints == 1);
	if(!isValid)
		state.error = 'È necessario prendere visione di tutte le stampe prima di proseguire';
	
	return isValid;
}

/**
 * @properties={typeid:24,uuid:"C0346B46-531B-4098-A147-36C376A4107A"}
 */
function updateButtons()
{
	elements.lbl_ok_processdata.visible = v_process == 1;
	elements.lbl_ok_prints.visible      = v_prints == 1;
}

/**
 * @properties={typeid:24,uuid:"6F130794-1C4B-45CB-AF7E-DBCB0D56B412"}
 */
function resetButtons()
{
	v_process =
	v_prints  = 0 
}

/**
 * @properties={typeid:24,uuid:"4D05771C-4C7C-4D45-91C3-DAC0FF58EBE4"}
 */
function enablePrints()
{
	elements.btn_prints.enabled = true;
}

/**
 * @properties={typeid:24,uuid:"66A1F7D7-38AB-4926-9F48-A0C41AD3205C"}
 */
function disablePrints()
{
	elements.btn_prints.enabled = false;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"37A1CDF4-B20A-41A9-B5D3-869E307DE77E"}
 */
function updateStatus(state)
{
	_super.updateStatus(state);
	
	var periodo = state.params.periodo || v_month;
	var ditta   = state.params.ditta.id || v_ditta;
	
	// inizializza i pulsanti in base allo stato dell'elaborazione
	var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, periodo, ditta);
	if(!elaborazione.compilata)
	{
		resetButtons();
		disablePrints();
	}
	else
		enablePrints();
	
	updateButtons();
	updateUI();
}

/**
 * @param print
 *
 * @properties={typeid:24,uuid:"145D417B-7422-4825-97B7-6817FA7FC971"}
 */
function getButtonForPrint(print)
{
	return elements['btn_print_' + print];
}

/**
 * @properties={typeid:24,uuid:"2E7E264E-AD93-43F2-8691-CA86D88FB6E1"}
 * @AllowToRunInFind
 */
function generaStampe()
{
	notify(scopes.events.Listeners.ON_PROCESSING$START);
	
	v_file = [];
	
	var variazioni  = stampaVariazioni();
	var giornaliera = stampaGiornaliera();
	var certificati = stampaCertificati();
	
	/**
	 * Combina le tre stampe in una sola
	 */
	v_file = plugins.pdf_output.combinePDFDocuments([giornaliera, certificati, variazioni]);
	if(v_file && v_file.length > 0)
		plugins.file.writeFile(scopes.string.Format('Riepilogo_@0_@1:yyyyMM:.pdf', foundset.codice, v_month), v_file, globals.MimeTypes.PDF);
	
	v_prints = 1;
	notify(scopes.events.Listeners.ON_PROCESSING$END, true);
}

/**
 * @properties={typeid:24,uuid:"032A8766-4F63-48E8-A573-0ED9DA6E000A"}
 * 
 * @AllowToRunInFind
 */
function stampaGiornaliera()
{
	var params = 
	{
		user_id                 : security.getUserName(), 
		client_id               : security.getClientID(),
		tipoconnessione         : globals.TipoConnessione.CLIENTE,
		periodo 	  			: scopes.date.ToIntMonth(v_month), 
		totaleeventi  			: 1,
		rateimaturati 			: 1,
		senzaelabdiv  			: 0,
		codicipaga 	  			: 1,
		notemensili   			: 1,
		legendaeventi 			: 1,
		idditta 	  			: idditta,
		iddipendenti  			: lavoratori,
		groupContratto 			: false,
		groupQualifica 			: false,
		groupPosizioneInps 		: false,
		groupSedeLavoro 		: false,
		groupRaggruppamento 	: false,
		groupTipoRaggruppamento : 0
	};
	
	/** @type {{Success : boolean, OperationId : string}}*/
	var response = globals.stampaGiornalieraDittaSync(params);
	if (response.Success)
	{
		var prints = datasources.db.ma_log.operationfile.getFoundSet();
		if (prints.find() && (prints.op_id = response.OperationId) && prints.search() > 0)
			return prints.operationfile_to_filelog.file_bytes;
		
		return [];
	}
	
	throw new Error('ma.err.print');
}

/**
 * @properties={typeid:24,uuid:"DA1A76A1-E175-4BC7-B988-433E7CECFDB5"}
 * @AllowToRunInFind
 */
function stampaCertificati()
{
	var params = 
	{
		tipostampa	   			: 1,		// certificazioni
		ideventoclasse 			: -1,		// tutte le certificazioni
	    inforzaal 	   			: '',
	    periodo 	   			: scopes.date.ToIntMonth(v_month),
	    compresidal    			: '',
	    compresial     			: '',
		idditta		   			: v_ditta,
		iddipendenti   			: lavoratori,
		groupContratto 			: false,
		groupQualifica 			: false,
		groupPosizioneInps 		: false,
		groupSedeLavoro 		: false,
		groupRaggruppamento 	: false,
		groupTipoRaggruppamento : 0
	};
	
	/** @type {{Success : boolean, OperationId : string}}*/
	var response = globals.stampaCertificatiSync(params);
	if (response.Success)
	{
		var prints = datasources.db.ma_log.operationfile.getFoundSet();
		if (prints.find() && (prints.op_id = response.OperationId) && prints.search() > 0)
			return prints.operationfile_to_filelog.file_bytes;
		
		return [];
	}
	
	throw new Error('ma.err.print');
}

/**
 * @properties={typeid:24,uuid:"9D854A84-55F8-4AB0-B14D-049F9E896CFC"}
 * @AllowToRunInFind
 */
function stampaVariazioni() 
{
	var periodo    = scopes.date.ToIntMonth(v_month);
	var fileName   = 'Riepilogo_Variazioni_Lavoratori';
	var reportName = 'PV_VariazioniLavoratore.jasper';

	var parameters =
    {
	   pidditta					:	globals.ma_utl_ditta_toSede(idditta),
	   pcodditta				:   codice,
	   pragionesociale			:   ragionesociale,
	   pdalperiodo				:	periodo,
	   palperiodo      			:	periodo,
	   piddettagliorichiesta	:	-1,
	   pcodgruppo           	:	'',
	   pnomegruppo              :   '',
	   pissede					:	globals.ma_utl_hasKeySede(),
	   powner_id				:	globals.svy_sec_lgn_owner_id,
	   pcategoria				:	'',
	   style					: 	globals.software_rp
    };
    
    /**
	 * Save additional operation's information
	 */
	var vDateTo = new Date();
	var values = 
	{
		op_hash		: utils.stringMD5HashBase64(idditta + vDateTo.toString()),
		op_ditta	: idditta,
		op_message	: 'Stampa Riepilogo Variazioni in corso...',
		op_periodo 	: periodo
	};
	
	var operation = scopes.log.GetNewOperation(globals.OpType.SRV, values);
	if (operation)
	{
		var jobParams =
		{
			method : globals.createReport,
			args   : [ globals.getSwitchedServer(globals.Server.MA_RICHIESTE),
					   parameters,
					   reportName,
					   scopes.string.Format('@0_@1.pdf', fileName, periodo),
					   operation ],
			sync   : true,
			start_message: 'Stampa in corso...'
		}
		
		var success = scopes.psl.RunJob(jobParams) && operation.operationlog_to_operationfile.getSize() > 0;
		if (success)
		{
			var    prints = operation.operationlog_to_operationfile;
			return prints.operationfile_to_filelog.file_bytes;
		}
		else
			throw new Error('ma.err.print');
	}
	
	return [];
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"010B4AA7-22D9-48EF-B17A-B802497758DF"}
 */
function onAction$bnt_prints(event) 
{
	try
	{
		scopes.psl.RunJob({
			method: generaStampe,
			args: [],
			sync: true,
			start_message: 'Stampa in corso...'
		});
		
		updateButtons();
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		scopes.psl.ShowError('i18n:ma.err.print');
		
		notify(scopes.events.Listeners.ON_PROCESSING$END, false);
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F71AE864-E46A-4937-A88F-EF2A841256E9"}
 */
function onAction$btn_processdata(event)
{
	if (getMainForm().processDataAction(v_ditta, v_month))
	{
		v_process = 1;
		enablePrints();		
	}
	
	updateButtons();
	updateUI();
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"DBF51CEE-D625-484D-AEDB-EFCCD62B87D2"}
 */
function onLoad(event) 
{
	updateUI();
	_super.onLoad(event);
}

/**
 * @properties={typeid:24,uuid:"6E3688C1-8611-4E39-B716-D1A760275B09"}
 */
function updateUI()
{
	[
		elements.btn_processdata,
		elements.btn_prints
	].forEach(function(_) {
		var split = _.getName().split('_');
		var name  = split[split['length'] - 1];
		
		plugins.WebClientUtils.removeExtraCssClass(_);
		
		var buttonCssClasses = ['material-button', name];
		var iconCssClasses   = ['icon'];
		
		if (!_.enabled)
		{
			buttonCssClasses.push('material-button-disabled');
			iconCssClasses.push('icon-disabled');
		}
		
		plugins.WebClientUtils.setExtraCssClass(_, buttonCssClasses.join(' '));
		plugins.WebClientUtils.setExtraCssClass(elements['icon_' + name], iconCssClasses.join(' '));
		
		buttonsScript += scopes.string.Format(
			  '$(".material-button.@0").not(".material-button-disabled").hover(\
					function(e) { $(".icon.@0").addClass("icon-selected");    },\
				 	function(e) { $(".icon.@0").removeClass("icon-selected"); });'
			 , name);
	});
}

/**
 * @properties={typeid:24,uuid:"E5493BCC-2445-4B7E-AAA2-3CD7531EE5B9"}
 */
function setHtml()
{
	_super.setHtml();
	
	html += scopes.string.Format(
			'<script type="text/javascript">\
				$(document).ready(function() { @0 });\
			 </script>'
			 , buttonsScript);
	
	return html;
}