/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"EADB9686-5EAF-4060-AC45-BDE2FA9BAA66"}
 */
var buttonsScript = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"4D194310-15C5-4FB0-8FAA-4335DB3ADC19"}
 */
var html_certificati = '<div id="check-certificati" style="height: 60px; line-height: 60px;">\
							<span class="icon icon-tiny button-icon icon-checkbox-unchecked certificati"></span>\
							<span class="label">Certificati</span>\
						</div>';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6238954C-1155-41C1-9404-B1075337E6E3"}
 */
var html_straordinari = '<div id="check-straordinari" style="height: 60px; line-height: 60px;">\
						 	<span class="icon icon-tiny button-icon icon-checkbox-unchecked straordinari"></span>\
							<span class="label">Ore di straordinario</span>\
						 </div>';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C43C03DF-9D45-4EA2-BB9D-FEF530B518CA"}
 */
var html_assenze = '<div id="check-assenze" style="height: 60px; line-height: 60px;">\
						<span class="icon icon-tiny button-icon icon-checkbox-unchecked assenze"></span>\
						<span class="label">Ore di assenza</span>\
					</div>'
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AD58702B-DFD0-4BB3-8E24-BEBB31BB096B"}
 */
var html_festivita = '<div id="check-festivita" style="height: 60px; line-height: 60px;">\
					  	<span class="icon icon-tiny button-icon icon-checkbox-unchecked festivita"></span>\
						<span class="label">Ore lavorate in giorni di festa</span>\
					  </div>'
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D41750E3-C9E8-41A7-B740-D9B3EE4905BE"}
 */
var html_richieste = '<div id="check-richieste" style="height: 60px; line-height: 60px;">\
						<span class="icon icon-tiny button-icon icon-checkbox-unchecked richieste"></span>\
						<span class="label">Variazioni mensili</span>\
					  </div>'

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"CA46E3AF-D62D-48B3-BCAB-BEE5CB239B9B",variableType:4}
 */
var v_festivita = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"CDFB9A9D-A7FD-42A7-BDE1-23BDA01B9A77",variableType:4}
 */
var v_variazioni = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"DEF8AD00-0893-4FB2-97C3-13E743837D52",variableType:4}
 */
var v_richieste = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"CD20AEE5-C35B-47DE-9689-9496F584855C",variableType:4}
 */
var v_assenze = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"26EC7546-B419-434F-BE9C-4C0DD3CBAA90",variableType:4}
 */
var v_straordinari = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"840E59F2-1440-4246-90BC-726E055AD75C",variableType:4}
 */
var v_certificati = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B7D400C1-3172-4970-8769-0107064E4810"}
 */
var v_festivita_tooltip = 'Nessuna festività per il periodo selezionato';

/**
 * @properties={typeid:24,uuid:"3EFB8A72-6830-4443-8CEB-F80D9072512F"}
 */
function validateStep(state)
{
	var isValid = !v_variazioni || v_richieste || v_festivita || v_assenze || v_straordinari || v_certificati;
	if(!isValid)
		state.error = 'Selezionare le variazioni da inserire';
	else
		state.error = '';
	
	return isValid;
}

/**
 * @properties={typeid:24,uuid:"048E38C3-9A47-44AB-975D-EC97AEE54084"}
 */
function getName()
{
	return scopes.psl.Presenze.Sezioni.ATTIVITA;
}

/**
 * @properties={typeid:24,uuid:"B27E49BE-493D-48FF-9036-CF7300A01300"}
 */
function saveState(state)
{
	var snapshot =
	{
		v_variazioni	: v_variazioni,
		v_richieste		: v_richieste,
		v_festivita		: v_festivita,
		v_assenze		: v_assenze,
		v_straordinari	: v_straordinari,
		v_certificati	: v_certificati
	}
	
	return snapshot;
}

/**
 * @properties={typeid:24,uuid:"862B5E74-B7DF-4540-A31D-88B54648319A"}
 */
function restoreStateFromSnapshot(snapshot, state)
{
	v_variazioni   = snapshot.v_variazioni;
	v_richieste    = snapshot.v_richieste;
	v_festivita    = snapshot.v_festivita;
	v_assenze      = snapshot.v_assenze;
	v_straordinari = snapshot.v_straordinari;
	v_certificati  = snapshot.v_certificati;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"7A575E51-C76D-4E71-BFAE-F2436206FA88"}
 */
function beforeStep(state)
{
	_super.beforeStep(state);
	
	var tooltip = '';
	var festivita = scopes.psl.Presenze.GetProcessingInfo(state, state.params.periodo, state.params.ditta.id).festivita;
		festivita = FestivitaNonAccantonate(festivita);
		
	if (festivita && festivita.length > 0)
	{
		tooltip = festivita.map(function(_){ return scopes.string.Format('@0 - @1', _[0], _[1]); }).join('<br/>');
		elements.html_festivita.enabled = true;
		plugins.WebClientUtils.setExtraCssClass(elements.html_festivita,'material-button material-checkbox festivita');
	}
	else
	{
		elements.html_festivita.enabled = false;
		plugins.WebClientUtils.setExtraCssClass(elements.html_festivita,'material-button material-button-disabled material-checkbox festivita');
	}
	
	v_festivita_tooltip = scopes.string.Format('<strong>Festività del periodo @0</strong><br/>@1', 
												utils.dateFormat(state.params.periodo, 'MMM yyyy'), 
												tooltip || 'Nessuna');
	
	return { error: false, message: '' };
}

/**
 * @properties={typeid:24,uuid:"2328A6CE-7C08-43A3-A353-7A3A8FFE109C"}
 */
function afterStep(state)
{
	_super.afterStep(state);
	
	var status = state.elaborazione[state.params.periodo][state.params.ditta.id];
	if (status.status < scopes.psl.Presenze.StatoElaborazione.COMPILATA)
		status.status = scopes.psl.Presenze.StatoElaborazione.IN_CARICAMENTO;
	
	state.setStepsEnabled(getEnabledSteps());
	state.params.steps = 
	{
		festivita	 : v_festivita,
		assenze		 : v_assenze,
		straordinari : v_straordinari,
		certificati	 : v_certificati,
		richieste	 : v_richieste
	};
	
	return { error: false, message: '' };
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"855B547D-7E17-4A74-BB1E-C6D176E0EB99"}
 */
function updateStatus(state)
{
	state.setStepsEnabled(getEnabledSteps());
	updateCheckIcons();
}

/**
 * @properties={typeid:24,uuid:"7DAA6457-11F6-4DDB-8C10-1DA0064251AF"}
 */
function updateCheckIcons()
{
	[
		  elements.html_festivita	 
		, elements.html_assenze     
		, elements.html_certificati 
		, elements.html_straordinari
		, elements.html_richieste
	].forEach(function(_) {
		/** @type {Array<String>} */
		var split   = _.getName().split('_');
		var name    = split[split.length - 1];
		var checked = forms[controller.getName()]['v_' + name];
		
		setChecked(name, checked);
	});
}

/**
 * @param name
 * @param checked
 *
 * @properties={typeid:24,uuid:"2D3914ED-A0BD-45B0-9934-72DB96690009"}
 */
function setChecked(name, checked)
{
	plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('setChecked("@0", @1);', name, checked));
}

/**
 * @properties={typeid:24,uuid:"80C577BB-AFA3-4921-89BA-EB831757733D"}
 */
function getEnabledSteps()
{
	return 	[
				{ name: scopes.psl.Presenze.Sezioni.LAVORATORI  , enabled: v_variazioni   				  },
				{ name: scopes.psl.Presenze.Sezioni.VARIAZIONI  , enabled: v_variazioni && v_richieste    },
				{ name: scopes.psl.Presenze.Sezioni.FESTIVITA   , enabled: v_variazioni && v_festivita    },
				{ name: scopes.psl.Presenze.Sezioni.ASSENZE     , enabled: v_variazioni && v_assenze      },
				{ name: scopes.psl.Presenze.Sezioni.STRAORDINARI, enabled: v_variazioni && v_straordinari },
				{ name: scopes.psl.Presenze.Sezioni.CERTIFICATI , enabled: v_variazioni && v_certificati  }
			];
}

/**
 * @properties={typeid:24,uuid:"8E82E5A7-99BB-45CA-8266-30857AE482DD"}
 */
function enableOptions()
{
	elements.html_festivita.enabled	  =
	elements.html_assenze.enabled      =
	elements.html_certificati.enabled  =
	elements.html_straordinari.enabled =
	elements.html_richieste.enabled    = true;
}

/**
 * @properties={typeid:24,uuid:"7A103CDD-996B-49C3-A62F-BF65CC6B72A3"}
 */
function disableOptions()
{
	elements.html_festivita.enabled	  =
	elements.html_assenze.enabled      =
	elements.html_certificati.enabled  =
	elements.html_straordinari.enabled =
	elements.html_richieste.enabled    = false;
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5BDF054F-B89F-4CCF-A0C7-5A51A94CD9D0"}
 */
function onDataChange$(oldValue, newValue, event) 
{
	v_variazioni = v_festivita || v_assenze || v_straordinari || v_certificati || v_richieste;
	return true;
}

/**
 * @param {Array} festivita
 * 
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"56FED152-CD6F-4919-859C-9470BA081F2F"}
 */
function FestivitaNonAccantonate(festivita)
{
	if (festivita)
		return festivita.filter(function(_){ return _[2] == 0 && _[3] == 0; });
	
	return [];
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A48D7C30-F632-48A3-9A9F-CA24142B6AD2"}
 */
function onLoad(event)
{	
	elements.allnames.filter (function(_) { return globals.startsWith('html_', _); })
					 .forEach(function(_) {
						 /** @type {Array<String>} */
						 var split         = _.split('_');
						 var name  		   = split[split.length - 1];
						 var buttonClasses = ['material-button', 'material-checkbox', name];
						 var iconClasses   = ['material-icon', name];
						 
						 plugins.WebClientUtils.setExtraCssClass(elements[_], buttonClasses.join(' ')); 
						 plugins.WebClientUtils.setExtraCssClass(elements['icon_' + name], iconClasses.join(' '));
						 
						 buttonsScript += scopes.string.Format(
							  '$(".material-checkbox.@0").hover(\
							  		function(e) { $(".icon.@0").addClass("icon-selected"); },\
								 	function(e) { $(".icon.@0").removeClass("icon-selected"); });'
							, name);
					 });
	
	_super.onLoad(event);
}

/**
 * @properties={typeid:24,uuid:"357A65C2-9DF4-4720-A802-E899622DA4A8"}
 */
function setHtml()
{
	_super.setHtml();
	
	html += scopes.string.Format('<script type="text/javascript">\
										function setChecked(name, checked) {\
									  		if(checked)\
									  			$(".icon." + name).removeClass("icon-checkbox-unchecked").addClass("icon-checkbox-checked");\
									 		else\
									 			$(".icon." + name).removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");\
										}\
										\
										$(document).ready(function() { @0 });\
								   </script>', buttonsScript);
		
	return html;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"895B63C0-1913-4D7F-B84F-DDE5B2B4C377"}
 */
function onAction$html_assenze(event) 
{
	var oldValue = v_assenze;
	var newValue = v_assenze = 1 - v_assenze;
	
	onDataChange(oldValue, newValue, event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"20FE1E38-2843-4EB2-83FC-3B4B6324DA77"}
 */
function onAction$html_certificati(event) 
{
	var oldValue = v_certificati;
	var newValue = v_certificati = 1 - v_certificati;
	
	onDataChange(oldValue, newValue, event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5377E26A-93D5-4584-B1BB-9D500D7B1B9E"}
 */
function onAction$html_festivita(event) 
{
	var oldValue = v_festivita;
	var newValue = v_festivita = 1 - v_festivita;
	
	onDataChange(oldValue, newValue, event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E36094EF-F32B-4392-AFAF-C39D58F58650"}
 */
function onAction$html_straordinari(event) 
{
	var oldValue = v_straordinari;
	var newValue = v_straordinari = 1 - v_straordinari;
	
	onDataChange(oldValue, newValue, event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DD2DF36C-7EBB-4003-A21D-09E6F80CADC8"}
 */
function onAction$html_richieste(event) 
{
	var oldValue = v_richieste;
	var newValue = v_richieste = 1 - v_richieste;
	
	onDataChange(oldValue, newValue, event);
}