/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"803264B2-585B-4976-8260-0076B7A40186"}
 */
var buttonsScript = '';

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"A4CE7486-BCC7-4CEC-832E-5D405B1FA3BB",variableType:93}
 */
var v_min_month = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"37D10B00-C6BA-4150-9FCE-42EA037EDC69"}
 */
var v_ragionesociale = '';

/**
 * @param {Boolean} [refresh]
 * 
 * @properties={typeid:24,uuid:"CE043DEF-04B0-4FD9-8DFF-992D5B4E29E2"}
 */
function setupUI(refresh)
{
	var x = 20;
	var y = elements.cmb_month.getAbsoluteFormLocationY() + elements.cmb_month.getHeight() + 20;
	
	var jsForm = solutionModel.getForm(controller.getName());
	if(!jsForm)
		throw new Error('JSForm' + controller.getName() + ' not  found');
	
	var body       = jsForm.getBodyPart();
	var bodyHeight = body.height;
	
	var fs = foundset;
		fs.loadAllRecords();
		fs.sort('codice asc');
		
	var width = jsForm.width - 40, height = 60;
		
	for(var r = 1; r <= fs.getSize(); r++)
	{
		var record = fs.getRecord(r);
		
		var newButton = jsForm.newLabel(record.codice + ' ' + record.ragionesociale, x, y, width, height, jsForm.getMethod('onAction$btn_ditta'));
			newButton.name = 'btn_ditta_' + r;
			newButton.styleClass = 'material-button';
			newButton.showClick = false;
			newButton.margin = '0, 80, 0, 0';
			newButton.rolloverCursor = SM_CURSOR.HAND_CURSOR;
			newButton.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.WEST | SM_ANCHOR.EAST;
			
		var htmlVariable = jsForm.newVariable('v_progress_' + r, JSVariable.TEXT);
		var htmlProgress = jsForm.newHtmlArea(htmlVariable.name, newButton.x + 20, newButton.y + 10, 40, 40);	// subtract the border from the width
			htmlProgress.name = 'html_progress_' + r;
			htmlProgress.transparent = true;
			htmlProgress.styleClass = 'no_border';
			htmlProgress.editable = false;
			htmlProgress.scrollbars = SM_SCROLLBAR.VERTICAL_SCROLLBAR_NEVER | SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_NEVER;

		var menuButton = jsForm.newLabel('', newButton.x + newButton.width - 20 - 20, y + 20, 20, 20, jsForm.getMethod('onAction$btn_menu'));
			menuButton.name = 'btn_menu_' + r;
			menuButton.showClick = false;
			menuButton.rolloverCursor = SM_CURSOR.HAND_CURSOR;
			menuButton.imageMedia = solutionModel.getMedia('menu_icon.png');
			menuButton.horizontalAlignment = SM_ALIGNMENT.CENTER;
			menuButton.toolTipText = 'i18n:ma.psl.lbl.presenze.menu';
			menuButton.transparent = true;
			menuButton.formIndex = newButton.formIndex + 1;
			menuButton.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST;
			
		var lblError = jsForm.newLabel('', menuButton.x - menuButton.width - 20, newButton.y + 20, 20, 20);
			lblError.name = 'lbl_error_' + r;
			lblError.styleClass = 'material-error-icon';
			lblError.imageMedia = solutionModel.getMedia('blue/flag.png');
			lblError.showClick = false;
			lblError.formIndex = newButton.formIndex + 1;
			lblError.transparent = true;
			lblError.visible = false;
			lblError.horizontalAlignment = SM_ALIGNMENT.CENTER;
			lblError.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST;
			
		var lblProgressDesc = jsForm.newLabel('', newButton.width - 120 - 20 - 20 - 20 - 10, y, 120, newButton.height);
			lblProgressDesc.name = 'lbl_status_desc_' + r;
//			lblProgressDesc.styleClass = 'material-label-small';
			lblProgressDesc.foreground = '#E2007A';
			lblProgressDesc.showClick = false;
			lblProgressDesc.formIndex = newButton.formIndex + 1;
			lblProgressDesc.transparent = true;
			lblProgressDesc.horizontalAlignment = SM_ALIGNMENT.RIGHT;
			lblProgressDesc.verticalAlignment = SM_ALIGNMENT.CENTER;
			lblProgressDesc.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST;
		
		y += 10 + height;
	}
	
	var tabInfo = jsForm.getTabPanel('info_tab');
		tabInfo.formIndex = 99;
		
	var btnInfo = jsForm.getLabel('btn_info');
		btnInfo.formIndex = tabInfo.formIndex + 1;
		
	y += btnInfo.height + 12;
		
	if(y > bodyHeight)
	{
		var difference = (y - bodyHeight);
		
		body.height += difference;
		tabInfo.y   += difference;
		btnInfo.y   += difference;
	}
	
//	// apparently the remainder of the form is discarded if no elements is present
//	var lbl = jsForm.newLabel(null, x, y - 20, jsForm.width, 20);
//		lbl.transparent = true;
	
	return _super.setupUI(true);
}

/**
 * @properties={typeid:24,uuid:"56C026EB-702D-496C-82A3-E340BC9269E2"}
 */
function afterSetupUI()
{
	elements.allnames.filter (function(_) { return globals.startsWith('btn_ditta_', _); })
					 .forEach(function(_) {
						 var split = _.split('_');
						 var index = split[split['length'] - 1];
						 
						 plugins.WebClientUtils.setExtraCssClass(elements[_], 'material-button material-button-' + index);
						 plugins.WebClientUtils.setExtraCssClass(elements['html_progress_' + index], 'material-progressbar material-progress-' + index);
					  });
}

/**
 * @properties={typeid:24,uuid:"9BA0B014-7545-4E7C-8B82-D089D715A047"}
 */
function disable()
{
	// do nothing. We want the form to remain active
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7BECF900-9B96-4CE8-90C7-259B0ABE2582"}
 */
function onAction$btn_menu(event)
{
	var index = event.getElementName().split('_');
		index = parseInt(index[index.length - 1]);
		
	toggleSelection({ index: index, id: null });
	
	var state = getState();
	var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, v_month, v_ditta);
	var menu = plugins.window.createPopupMenu();

	var stampaRiepilogoItem     	= menu.addMenuItem('Stampa un riepilogo delle ore inserite', stampaRiepilogoOreDaMenu); 
		stampaRiepilogoItem.enabled = elaborazione.status && elaborazione.status > scopes.psl.Presenze.StatoElaborazione.DA_CARICARE;
		
	menu.addMenuItem('Scarica le stampe di controllo', generaStampeDaMenu);
	
	if(globals.ma_utl_hasKey(globals.Key.ADMIN_PSL))
	{
		menu.addSeparator();
		
		var menuOperativo = menu.addMenu('i18n:ma.psl.lbl.admin.operations');
			menuOperativo.addMenuItem('i18n:ma.lbl.import_data', importaDatiDaMenu);
			menuOperativo.addMenuItem('i18n:ma.psl.lbl.import_hours', importaGiornalieraDaMenu);
			
		var segnaDaRettificareItem 		   = menuOperativo.addMenuItem('i18n:ma.psl.lbl.mark_dirty', segnaDaRettificareDaMenu);
			segnaDaRettificareItem.enabled = elaborazione.status >= scopes.psl.Presenze.StatoElaborazione.INVIATA;
	}

	menu.show(event.getSource());
}

/**
 * @properties={typeid:24,uuid:"DB34794A-60EC-41FB-9EFD-82F929669335"}
 * @AllowToRunInFind
 */
function generaStampeDaMenu()
{
	try
	{
		notify(scopes.events.Listeners.ON_PROCESSING$START);
		
		scopes.psl.RunJob({
			method: generaStampe,
			args: [],
			sync: true,
			start_message: 'Stampa in corso...'
		});
		
		notify(scopes.events.Listeners.ON_PROCESSING$END, true);
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		scopes.psl.ShowError('i18n:ma.err.print');
		
		notify(scopes.events.Listeners.ON_PROCESSING$END, false);
	}
}

/**
 * @properties={typeid:24,uuid:"FBDDCF17-8CE2-45B2-A6ED-038A7C9E3F28"}
 * @AllowToRunInFind
 */
function generaStampe()
{
	var file = [];
	
	var variazioni  = stampaVariazioni();
	var giornaliera = stampaGiornaliera();
	var certificati = stampaCertificati();
	
	/**
	 * Combina le tre stampe in una sola
	 */
	file = plugins.pdf_output.combinePDFDocuments([giornaliera, certificati, variazioni]);
	
	if(file && file.length > 0)
		plugins.file.writeFile(scopes.string.Format('Riepilogo_@0_@1:yyyyMM:.pdf', foundset.codice, v_month), file, globals.MimeTypes.PDF);
}

/**
 * @AllowToRunInFind
 * 
 * @properties={typeid:24,uuid:"302828C3-5B90-493A-8F3D-192FB659AA9C"}
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
		iddipendenti   			: [-1],
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
 * @properties={typeid:24,uuid:"305D5474-7463-4E7A-B878-FACA706A6B07"}
 */
function stampaVariazioniDaMenu()
{
	
}

/**
 * @properties={typeid:24,uuid:"5FAECE1F-EFDE-4F14-9842-CB6A7E083961"}
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
 * @properties={typeid:24,uuid:"3C8B4FDC-AED3-4F9C-9E34-3B9D950F8143"}
 * 
 * @AllowToRunInFind
 */
function stampaGiornaliera()
{
	var lavoratori = scopes.anagrafiche.FilterLavoratori(v_ditta, scopes.date.ToIntMonth(v_month)); 
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
 * @properties={typeid:24,uuid:"5124A81E-9E8E-41E0-9EFC-98EF32309B52"}
 */
function segnaDaRettificareDaMenu(_a, _b, _c, _d, _e)
{
	segnaDaRettificare();
}

/**
 * @properties={typeid:24,uuid:"563A20B2-0333-490D-9157-B09424D072A9"}
 */
function segnaDaRettificare()
{
	if(getMainForm().segnaDaRettificare(v_ditta, v_month))
		forms.psl_status_bar.setStatusSuccess('i18n:ma.msg.operations.success');
	else
		forms.psl_status_bar.setStatusError();
}

/**
 * @properties={typeid:24,uuid:"442448F8-AE37-4E4A-84FA-DDABE4282D6B"}
 */
function setBusy(isBusy)
{
	var status  = scopes.psl.Presenze.GetProcessingInfo(getMainForm().getState(), v_month, v_ditta);
		status.busy = isBusy;
}

/**
 * @properties={typeid:24,uuid:"120E5D77-874D-4354-A221-2FB68AD67C16"}
 */
function importaGiornalieraDaMenu(_a, _b, _c, _d, _e)
{
	var answer = globals.ma_utl_showYesNoQuestion('i18n:ma.psl.msg.start_longrunning_operation');
	if (answer)
		importaGiornaliera();
}

/**
 * @properties={typeid:24,uuid:"3265BC1D-3AA5-4177-832A-B8F4EC10F554"}
 */
function importaDatiDaMenu(_a, _b, _c, _d, _e)
{
	var answer = globals.ma_utl_showYesNoQuestion('i18n:ma.psl.msg.start_longrunning_operation');
	if (answer)
		importaDati();
}

/**
 * @properties={typeid:24,uuid:"AF96666D-183D-40C3-91D0-FDB7EC0163F8"}
 */
function stampaRiepilogoOreDaMenu(_a, _b, _c, _d, _e)
{
	stampaRiepilogoOre();
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"8D0FAE22-0F69-4CF8-963E-0B28550A1382"}
 */
function initState(state)
{
	_super.initState(state);
	
	var periodo      = state.params.periodo;
	for(var r = 1; r <= foundset.getSize(); r++)
	{
		var ditta = foundset.getRecord(r).idditta;
		var elaborazione = { 
			snapshot : { }, 
			attivata : false, 
			compilata: false, 
			festivita: null, 
			status   : scopes.psl.Presenze.StatoElaborazione.DA_CARICARE 
		};	
		var data = {
			ore   : { }, 
			backup: { }
		}
		
		// crea l'elaborazione per la ditta
		state.elaborazione[periodo][ditta] = elaborazione;
		scopes.psl.Presenze.SetData(state, ditta, data);
	}
}

/**
 * @param {{ id: Number, index: Number }} ditta
 * 
 * @properties={typeid:24,uuid:"E540AEDD-6BE9-4FEC-84C7-4B272597DED8"}
 */
function toggleSelection(ditta)
{
	setDittaUnselected(foundset.getSelectedIndex());
	
	var index = ditta.index;
	var id    = ditta.id;
	/**
	 * Lookup the company based on the id if no index has been provided
	 */
	if(!index && id)
	{
		var found = false;
		for(var r = 1; !found && r <= foundset.getSize(); r++)
			if(foundset.getRecord(r).idditta == id)
				found = true;
		
		if(found)
			index = r - 1;
		else
			index = 1;
	}
	
	foundset.setSelectedIndex(index);
	
	v_ditta     = idditta;
	v_min_month = scopes.date.FromIntMonth(globals.ma_utl_getUltimoCedolinoStampato(idditta));
	
	updateDitta(v_ditta);
	setDittaSelected(index);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"45EC4758-7B93-47A8-A835-580CE8BC2C7C"}
 */
function onAction$btn_ditta(event)
{
	if(!event.getElementName())
		throw new Error('Element has no name attached');
	
	var split    = event.getElementName().split('_');
	var index    = parseInt(split[split.length - 1]);
	var oldValue = v_ditta;

	toggleSelection({ index: index, id: null });
	onDataChange(oldValue, v_ditta, event);
}

/**
 * @properties={typeid:24,uuid:"E08D896D-62EB-45D9-862C-351F7A8EED83"}
 */
function setDittaSelected(index)
{
	var button   = getButtonForIndex(index);
	var progress = getProgressHtmlForIndex(index);
	
	plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('$("#@0").addClass("material-button-selected");', plugins.WebClientUtils.getElementMarkupId(button)));
	plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('$("#@0").addClass("progressbar-selected");', plugins.WebClientUtils.getElementMarkupId(progress)));
}

/**
 * @param index
 *
 * @properties={typeid:24,uuid:"E68D8148-3D7F-42D0-9A61-2D05D423F5A9"}
 */
function setDittaUnselected(index)
{
	var button   = getButtonForIndex(index);
	var progress = getProgressHtmlForIndex(index);
	
	plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('$("#@0").removeClass("material-button-selected");', plugins.WebClientUtils.getElementMarkupId(button)));
	plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('$("#@0").removeClass("progressbar-selected");', plugins.WebClientUtils.getElementMarkupId(progress)));
}

/**
 * @properties={typeid:24,uuid:"D54107E9-93EA-4FFF-B98E-CD912193C302"}
 * @AllowToRunInFind
 */
function validateStep(state)
{
	var ditteElaborabili = state.elaborazione[state.params.periodo].ditte_elaborabili || []
	
	var fs = foundset.duplicateFoundSet();
	if (!v_ditta && fs && fs.find() && (fs.idditta = ditteElaborabili) && fs.search() == 0)
	{
		state.error = 'Nessuna ditta disponibile per l\'invio per il periodo selezionato';
		return false;
	}
	
	if(!v_ditta || !v_month)
	{
		state.error = 'Selezionare una ditta ed un periodo';
		return false;
	}
	
	var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, v_month, v_ditta);
	if (elaborazione.busy)
	{
		state.error = 'Un\'operazione è attualmente in corso per la ditta ed il periodo selezionati. Attendere il completamento prima di proseguire';
		return false;
	}
	
	if(!elaborazione.festivita_approvate)
	{
		var festivita = elaborazione.festivita = scopes.giornaliera.ElencoFestivita(v_ditta, scopes.date.ToIntMonth(v_month));
		if (festivita && festivita.length > 0 && !approvaFestivita(festivita))
		{
			state.error = 'Per continuare è necessario confermare la gestione delle festività. Contattare lo studio per maggiori informazioni';
			elaborazione.festivita_approvate = false;
			
			return false;
		}
		else
			elaborazione.festivita_approvate = true;
	}
	
	return true;
}

/**
 * @param {forms.psl_nav_wizard.State} state
 *
 * @properties={typeid:24,uuid:"94710D8B-7EF6-4EA2-A362-CD484C48421B"}
 */
function updateStatus(state)
{
	_super.updateStatus(state);

	var elaborazione;
	
	for(var r = 1; r <= foundset.getSize(); r++)
	{
		var record = foundset.getRecord(r);
		
		elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, state.params['periodo'], record.idditta);
		if (elaborazione)
		{
			setProgress(r, elaborazione.status || 0);
			
			if(elaborazione.error)
				setDittaErrore(r, elaborazione.message);
			else
				setDittaOk(r);
		}
		else
			setProgress(r, scopes.psl.Presenze.StatoElaborazione.DA_CARICARE);
	}
	
	setDittaSelected(foundset.getSelectedIndex());
	updateNavButtons(state);
}

/**
 * @param {forms.psl_nav_wizard.State} state
 *
 * @properties={typeid:24,uuid:"2ED4041A-636C-49FD-86FE-F3E36297B0ED"}
 */
function updateNavButtons(state)
{
	/**
	 * Disabilita il wizard se la ditta è inviata
	 */
	var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, state.params['periodo'], state.params['ditta']['id']);
	
	if (elaborazione.status >= scopes.psl.Presenze.StatoElaborazione.INVIATA)
		state.disableAllSteps();
	else
		state.enableAllSteps();
}

/**
 * @param {Number} index
 * @param {String} error
 * 
 * @properties={typeid:24,uuid:"0A545DD6-6EE5-4BB5-8D0E-5DAC97F74777"}
 */
function setDittaErrore(index, error)
{
	var error_label = getErrorLabelForIndex(index);
		error_label.visible = true;
		error_label.toolTipText = globals.from_i18n(error);
		
	plugins.WebClientUtils.setExtraCssClass(error_label, 'material-error-icon');
}

/**
 * @param {Number} index
 * 
 * @properties={typeid:24,uuid:"63B04D66-8CDD-4069-898B-ACFFEE99809F"}
 */
function setDittaOk(index)
{
	var error_label = getErrorLabelForIndex(index);
		error_label.visible = false;
}

/**
 * @param index
 *
 * @properties={typeid:24,uuid:"B9848444-47ED-4C68-9A10-975AF20A936E"}
 */
function getButtonForIndex(index)
{
	return elements['btn_ditta_' + index];
}

/**
 * @param {Number} index
 * 
 * @return {RuntimeLabel}
 *
 * @properties={typeid:24,uuid:"F160B4BF-C520-474A-8518-EEF2DD8AB5DC"}
 */
function getErrorLabelForIndex(index)
{
	/** @type {RuntimeLabel} */
	var label = elements['lbl_error_' + index];
	return label;
}

/**
 * @param {forms.psl_nav_presenze.State} state
 * 
 * @properties={typeid:24,uuid:"815DAA63-B13F-420D-A919-3DB67D3BE6B7"}
 */
function beforeStep(state)
{
	updateMonth(state.params['periodo']);
    /** @type {{id : Number,index : Number}}*/
	var ditta = state.params['ditta'];
    toggleSelection(ditta);
	
	return _super.beforeStep(state);
}

/**
 * @properties={typeid:24,uuid:"2D92D8BB-EC18-4713-9C9E-1D8710739505"}
 */
function refreshData(state)
{
	_super.refreshData(state);
	databaseManager.refreshRecordFromDatabase(foundset, -1);
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"8A4047E4-8A52-4431-8B12-B1EE0CA9F62F"}
 */
function saveData(state)
{
	if(!state.data[v_ditta])
		state.data[v_ditta] = { ore: { } };
}

/**
 * @properties={typeid:24,uuid:"30AF571F-BFF6-4FB4-9923-F392CC6CB18B"}
 */
function afterStep(state)
{
	var result = _super.afterStep(state);
	
	/**
	 * 0. Calcola i parametri ed inizializza lo stato di elaborazione
	 */
	state.params.ditta   = { id: v_ditta, index: foundset.getSelectedIndex() };
	state.params.periodo = v_month;
	
	var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, v_month, v_ditta);
	
	/**
	 * 2. Segna la ditta in caricamento. Se già compilata, segna da ricompilare
	 */
	if(elaborazione.status < scopes.psl.Presenze.StatoElaborazione.INVIATA)
		markAsLoading(state, v_month, v_ditta);
		
	/**
	 * 3. Prima attivazione
	 */
	if(!elaborazione.attivata)
	{
		/**
		 * 1. Filtra i lavoratori in forza
		 */
		var dal = scopes.date.FirstDayOfMonth(v_month);
		var al  = scopes.date.LastDayOfMonth(v_month);
		var lavoratori = filterLavoratori(v_ditta, dal, al);
			
		/** @type {Array<Number>} */
		var idlavoratori = elaborazione.lavoratori = globals.foundsetToArray(lavoratori, 'pkey');
		if (idlavoratori.length == 0)
			return { error: true, message: 'Nessun lavoratore presente per il periodo selezionato' }; 
		
		var periodo = scopes.date.ToIntMonth(v_month);
		var gruppoInstallazione = globals.getGruppoInstallazioneDitta(v_ditta);
		var gruppoLavoratori = '';
		
		var params = 
		{ 
			  method: scopes.giornaliera.attivaMese
			, args: [v_ditta, periodo, gruppoInstallazione, gruppoLavoratori, true]
			, start_message: 'Attivazione mese in corso...'
			, sync: true
		};
		
		/** @type {{ error: Boolean, message: String }} */
		result = scopes.psl.RunJob(params);
		if(!result.error)
		{
			elaborazione.attivata = true;
			
			// Inizializza le ore per tutti i lavoratori
			var data     = scopes.psl.Presenze.GetData(state, v_ditta);
				data.ore = scopes.psl.InitHours(idlavoratori, v_month);
		}
	}
	
	// Ripristina lo stato dei passaggi successivi al cambio ditta
	getMainForm().restoreStateFromSnapshot([getName()]);
	
	return result;
}

/**
 * @properties={typeid:24,uuid:"B24E0424-3472-4F44-BD07-0C85A909DB31"}
 */
function approvaFestivita(festivita)
{
	var festivitaForm = forms.psl_controllo_festivita_tbl;
		festivitaForm.init(festivita);
	
	return globals.ma_utl_showFormDialog({ 
		name    : festivitaForm.controller.getName(), 
		title   : 'Conferma festività', 
		blocking: true,
		height  : 20 * (festivita.length + 2) + festivitaForm.controller.getPartHeight(JSPart.FOOTER)
	});
}

/**
 * @param id_ditta
 * @param id_gruppoinstallazione
 *
 * @properties={typeid:24,uuid:"C8AA1123-BAC2-4FE8-B8D3-F201931CF4F7"}
 */
function controllaPeriodiDaImportare(id_ditta, id_gruppoinstallazione)
{
	var params = { idditta: id_ditta, idgruppoinstallazione: id_gruppoinstallazione };
	
	var result = scopes.giornaliera.PeriodiDaImportare(id_ditta, id_gruppoinstallazione);
	if(!result || !result.returnValue)
		throw new Error('Errore durante il controllo di acquisizione, contattare lo studio.');
	
	if(result.periodi.length > 0)
	{
		globals.ma_utl_showInfoDialog('Sono presenti giornaliere non ancora acquisite. L\'operazione potrebbe richiedere qualche minuto, premere ok per proseguire');
		
		for(var p = 0; p < result.periodi.length; p++)
		{
			var periodo = result.periodi[p];
			
			params = globals.inizializzaParametriTracciatoMese(id_ditta, periodo, id_gruppoinstallazione, '', [-1], -1);
			params.sync = true;
			
			result = scopes.giornaliera.importaDaFtp(params);
			if(!result || !result.returnValue)
				return { error: true, message: 'Errore durante l\'acquisizione della giornaliera per il periodo [' + utils.dateFormat(scopes.date.FromIntMonth(periodo), globals.EU_DATEFORMAT) + ']. Contattare lo studio.' };
		}
	}
	
	return { error: false, message: 'Importazione giornaliere eseguita con successo' };	
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"FD2F1466-0128-4978-8F2C-046C38513461"}
 */
function getStateChangeParams(state)
{
	return { month: v_month, company: { id: v_ditta, index: foundset.getSelectedIndex() }, reset: !v_month || (v_month != state.params.periodo) };
}

/**
 * @param state
 * @param periodo
 * @param id_ditta
 *
 * @properties={typeid:24,uuid:"1EDCA55C-9CBC-4B06-BADD-EA11A40BA50C"}
 */
function markAsLoading(state, periodo, id_ditta)
{
	if(state.elaborazione[periodo].ditte_in_caricamento.indexOf(id_ditta) == -1)
		state.elaborazione[periodo].ditte_in_caricamento.push(id_ditta);
}

/**
 * @properties={typeid:24,uuid:"83E0EEDA-45E2-4AD5-96E1-4E2838708871"}
 */
function getName()
{
	return scopes.psl.Presenze.Sezioni.DITTA_PERIODO;
}

/**
 * @properties={typeid:24,uuid:"0789E599-2FA6-4D9C-A0FC-A94A523800C7"}
 */
function saveState(state)
{
	var snapshot =
	{
		v_month	: scopes.date.ToIntMonth(v_month)
	};
	
	return snapshot;
}

/**
 * @properties={typeid:24,uuid:"C476EA71-7FD9-4BC0-A8D8-177CF3CF0A22"}
 */
function restoreStateFromSnapshot(snapshot, state)
{
	v_month = scopes.date.FromIntMonth(snapshot.v_month);
}

/**
 * @param {Date} firstMonth
 * @param {Date} lastMonth
 *
 * @properties={typeid:24,uuid:"2B2660D1-8849-49E6-8C3E-2A1E4565AC88"}
 */
function setMonthValues(firstMonth, lastMonth)
{
	var months = [];
	for(var m = firstMonth; m <= lastMonth; m = scopes.date.AddMonth(m))
		months.push(m);
	
	application.setValueListItems('vls_periodo', months);
}

/**
 * @param month
 *
 * @properties={typeid:24,uuid:"21ADB7F9-A640-4391-9989-4B6DA6653E21"}
 */
function updateMonth(month)
{
	var firstMonth = scopes.date.AddMonths(month, -6);
	if (firstMonth < v_min_month)
		firstMonth = scopes.date.GetDatePart(v_min_month);
	
	var lastMonth  = scopes.date.AddMonths(firstMonth, 11);
	
	setMonthValues(firstMonth, lastMonth);
	v_month = month;
}

/**
 * @param {Number} index
 * @param {Number} status
 *
 * @properties={typeid:24,uuid:"5CAB9C23-8574-43E6-8669-7A6D9B472E7A"}
 */
function setProgress(index, status)
{
	var prog_label_desc = getProgressLabelForIndex(index);
		prog_label_desc.text = scopes.psl.Presenze.StatoElaborazione.FormatStatus(status);
		
	var percentage = scopes.psl.Presenze.StatoElaborazione.GetProgressForStatus(status);
	forms[controller.getName()]['v_progress_' + index] = scopes.string.Format(
		'<script type="text/javascript">\
			var progress_@0    = @1;\
			var progressBar_@0 = null;\
			\
			function setProgress_@0(percentage) {\
		 		progress_@0 = percentage;\
				progressBar_@0.animate(percentage);\
			}\
			\
			function refreshProgress_@0() {\
				setProgress_@0(progress_@0);\
			}\
			\
			$(document).ready(function() {\
			 	progressBar_@0 = new ProgressBar.Circle("#progressbar-@0",\
					{\
						strokeWidth: 8,\
						color: "#2A3C9F",\
						trailColor: "#2A3C9F",\
						trailWidth: 2,\
						step: (state, bar) => {\
							bar.setText(Math.round(bar.value() * 100));\
		 				}\
		 			});\
		 		\
		 		refreshProgress_@0();\
			});\
		 </script>\
		 <div id="progressbar-@0" class="progressbar"></div>', index, percentage / 1e2);
	
	plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('setProgress_@0 && setProgress_@0(@1);', index, percentage / 1e2));
}

/**
 * @param {Number} index
 * 
 * @return {RuntimeLabel}
 *
 * @properties={typeid:24,uuid:"0C93DC10-3880-48EB-ABF9-8D0EF4361440"}
 */
function getProgressHtmlForIndex(index)
{
	/** @type {RuntimeLabel} */
	var label = elements['html_progress_' + index];
	return label;
}

/**
 * @param {Number} index
 * 
 * @return {RuntimeLabel}
 *
 * @properties={typeid:24,uuid:"F658C6D9-9731-4E18-8A5D-AB0AF48878F3"}
 */
function getProgressLabelForIndex(index)
{
	/** @type {RuntimeLabel} */
	var label = elements['lbl_status_desc_' + index];
	return label;
}

/**
 * @param {Number} index
 * 
 * @return {RuntimeLabel}
 *
 * @properties={typeid:24,uuid:"5D49F907-BD70-4D6B-8C91-1454E872DE74"}
 */
function getProgressLabelDescForIndex(index)
{
	/** @type {RuntimeLabel} */
	var label = elements['lbl_progress_desc_' + index];
	return label;
}

/**
 * Handle changed data.
 *
 * @param {Date} oldValue old value
 * @param {Date} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"14E8467D-9038-4DDF-A746-A00ABE47050B"}
 */
function onDataChange$cmb_month(oldValue, newValue, event)
{
	updateMonth(newValue);
	return true;
}

/**
 * @param {Number} ditta
 * @param {Date} dal
 * @param {Date} al
 * 
 * @return {JSFoundset<db:/ma_anagrafiche/lavoratori>}
 *
 * @properties={typeid:24,uuid:"01AE4458-C228-4763-AA5F-47CE176EC30E"}
 * @AllowToRunInFind
 */
function filterLavoratori(ditta, dal, al)
{
	var fs = ditte_to_lavoratori;
	return scopes.anagrafiche.FilterLavoratoriDalAl(ditta, dal, al, fs);
}

/**
 * @properties={typeid:24,uuid:"C76B1A36-7B10-4F09-B6C7-D0F70DDC7C28"}
 */
function importaGiornaliera()
{
	try
	{
		setBusy(true);
		
		var state = getMainForm().getState();
		var elaborazione = scopes.psl.Presenze.GetProcessingInfo(state, v_month, v_ditta);
		
		var proceed = elaborazione.status >= scopes.psl.Presenze.StatoElaborazione.INVIATA ||
					   globals.ma_utl_showYesNoQuestion("L'operazione richiesta sovrascriverà gli eventi attualmente inseriti \
													     con i dati importati.<br/>\
													     <p><strong>Continuare?</strong></p>");
					 
		if(!proceed)
			return true;
			
		var ditta      = v_ditta;
		var periodo    = scopes.date.ToIntMonth(v_month);
		var gruppoinst = globals.getGruppoInstallazioneDitta(ditta);
		
		var params      = scopes.giornaliera.inizializzaParametriTracciatoMese(ditta, periodo, gruppoinst, '',  [-1], -1);
			params.sync = true;
			
		var jobParams =
		{
			method		 : scopes.giornaliera.importaGiornaliera,
			args  		 : [params],
			sync  		 : true,
			start_message: 'Importazione giornaliera in corso...'
		}
		
		notify(scopes.events.Listeners.ON_PROCESSING$START);
		
		var message = '';
		
		/** @type {{ returnValue: Boolean, message: String }} */
		var response = scopes.psl.RunJob(jobParams)
		if(!response)
		{
			notify(scopes.events.Listeners.ON_PROCESSING$END, false, 'Errore durante la connessione al server. Se il problema persiste contattare lo studio.');
			return false;
		}
		
		if(response.returnValue === false)
			message = response.message;
		else
		{
			var data     = scopes.psl.Presenze.GetData(state, v_ditta);
				data.ore = scopes.psl.Presenze.RestoreDataFromDatabase(data.ore, v_ditta, v_month, elaborazione.lavoratori);
				
			message = 'i18n:ma.msg.operations.success';
		}
		
		notify(scopes.events.Listeners.ON_PROCESSING$END, response.returnValue, message);

		return response.returnValue;			
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		notify(scopes.events.Listeners.ON_PROCESSING$END, false, 'i18n:ma.err.generic_error');
		
		return false;
	}
	finally
	{
		setBusy(false);
	}
}

/**
 * @properties={typeid:24,uuid:"EFB13EF3-F065-4FBC-9AA0-E2D2D40C6E48"}
 */
function importaDati()
{
	try
	{
		setBusy(true);
		
		var gruppoinst   = globals.getGruppoInstallazioneDitta(v_ditta);
		var params       = globals.inizializzaParametriRiceviTabelle(v_ditta, gruppoinst, '', globals.getTipoConnessione());
		
		var jobParams =
		{
			method        : scopes.giornaliera.importaDatiSync,
			args          : [params],
			sync          : true,
			start_message : 'Importazione dati in corso...'
		}
		
		/**
		 * INIZIO ELABORAZIONE
		 */	
		notify(scopes.events.Listeners.ON_PROCESSING$START);
			
		// Esegui l'importazione e scarica le stampe
		var success = scopes.psl.RunJob(jobParams);
		if (success)
		{
			var dal        = scopes.date.FirstDayOfMonth(v_month);
			var al         = scopes.date.LastDayOfMonth(v_month);
			var lavoratori = filterLavoratori(v_ditta, dal, al);
			
			success = getMainForm().aggiornaElaborazione(v_ditta, v_month, lavoratori);
		}
		
		var message = success ? 'i18n:ma.msg.operations.success' : 'i18n:ma.msg.operations.error';
		
		/**
		 * FINE ELABORAZIONE
		 */
		notify(scopes.events.Listeners.ON_PROCESSING$END, success, message);
	
		return success;	
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		notify(scopes.events.Listeners.ON_PROCESSING$END, false, 'i18n:ma.err.generic_error');
		
		return false;
	}
	finally
	{
		setBusy(false);
	}
}

/**
 * @properties={typeid:24,uuid:"AF67A566-9782-481F-8FED-A6B7C7EBDD7D"}
 */
function stampaRiepilogoOre()
{
	var ditta  = foundset.getSelectedRecord();
	var state  = getMainForm().getState();
	var status = scopes.psl.Presenze.GetProcessingInfo(state, v_month, v_ditta);
	var hours  = scopes.psl.Presenze.GetEvents(state, ditta.idditta);
	
	if(!scopes.psl_reports.ExportHours(ditta, v_month, status.lavoratori, hours, function(event){ return !event.to_delete; }))
		forms.psl_status_bar.setStatusError('i18n:ma.err.print');
}

/**
 * @properties={typeid:24,uuid:"5CD9054F-2625-4ECD-82C5-BA72EA9333D9"}
 */
function getStepInfo()
{
	return "In questa sezione puoi controllare lo stato di elaborazione delle tue ditte per il periodo selezionato. Per ognuna sono visualizzate alcune \
			informazioni, tra cui la percentuale di completamento, lo stato di elaborazione ed eventuali messaggi, visibili passando il mouse sull'icona \
			<img src='mediafolder?id=blue/flag.png&s=PresenzaSempliceLite&option=14&w=20&h=20'/>. Tramite il menu a destra puoi invece accedere alle stampe \
			di controllo.<p>Per iniziare o proseguire un'elaborazione, seleziona una ditta e premi 'AVANTI'.</p>";
}