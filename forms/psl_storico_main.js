/**
 * @type {{ ondatachange: Array<Function> }}
 * 
 * @properties={typeid:35,uuid:"B1B803EE-37B4-41E8-98C2-B575A70CF82B",variableType:-4}
 */
var v_listeners = 
{
	ondatachange: []
}

/**
 * @properties={typeid:35,uuid:"7F26C4F8-59F4-4536-9459-8751D6B33F9E",variableType:-4}
 */
var vApriSelezioneFiglio = false;

/**
 * @properties={typeid:24,uuid:"E24FA2DE-7060-4B93-A654-BB9E6533D6BE"}
 */
function getStyle()
{
	return 'psl';
}

/**
 * @properties={typeid:24,uuid:"0C430F35-177C-48DF-A8B7-8747CBBAF5C0"}
 */
function getFieldOnDataChangeMethod()
{
	return solutionModel.getGlobalMethod('certificati', 'onDataChangeField$certificato');
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"9813019A-0CF9-49E4-86CA-AAB81D5ACA6A"}
 */
function onAction$confermaCertificato(event)
{
	if(confermaGestioneCertificato(globals.TipoGiornaliera.NORMALE))
	{
		confermaCertificati(event);
	
		forms.psl_inserisci_certificati_dettaglio.gotoBrowse();
		forms.psl_inserisci_certificati_dettaglio.refreshList();
		
		notify(scopes.events.Listeners.ON_DATACHANGE);
	}
}

/**
 * @param name
 * @param func
 *
 * @properties={typeid:24,uuid:"30E20804-FA7C-4C58-85BA-E71FF623A19C"}
 */
function registerListener(name, func)
{
	if(!name)
		throw new Error('Parameter [name] must be provided');
	if(!func)
		throw new Error('Parameter [func] must be provided');
	
	if(!v_listeners.ondatachange[name])
		v_listeners.ondatachange[name] = func;
}

/**
 * @param {String}  event   the event type
 * @param {...}		[args]  the arguments to be passed to the listener
 * @see   scopes.events.Listeners
 *
 * @properties={typeid:24,uuid:"DAA495D3-1176-4532-B400-02527D3F7F43"}
 */
function notify(event)
{
	var listeners = v_listeners[event];
	if (listeners)
		for(var l in listeners)
			listeners[l].apply(null, Array.prototype.slice.call(arguments, 1));
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"A69A8D7A-42BC-4D23-A34F-6CC510D49D76"}
 */
function annullaGestioneCertificato(event)
{
	_super.annullaGestioneCertificato(event);
	forms.psl_inserisci_certificati_dettaglio.gotoBrowse();
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"83BE9C64-53BE-45D1-B38B-9D4A99152A39"}
 */
function confermaCertificati(event)
{
	var params = 
	{
		iddipendenti: [vIdLavoratore],
		idditta: vIdDitta,
		periodo: vPeriodo,
		tipogiornaliera: globals.TipoGiornaliera.NORMALE,
		tipoconnessione: globals.getTipoConnessione(),
		ideventoclasse: vIdEventoClasse,
		calcologiornaliera: false,
		sync: true
	}

	globals.confermaCertificati(params, true);
	vOriginaleModificato = false;
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"EAC09ACD-4C3B-4B3D-AADB-EE74BAC9DA4D"}
 * @AllowToRunInFind
 */
function addCertificate(event)
{	
	if(vApriSelezioneFiglio)
	{
		var idStoricoPadre = showDatiAggiuntivi(vIdLavoratore, vIdEventoClasse);
		if (idStoricoPadre == null)	// selezione annullata
			return;
		else
		if (idStoricoPadre == -1)
			forzaInserimentoPadreCongedo();
		else
		{
			inizializzaRiepilogo(idStoricoPadre);
			_super.addCertificate(event);
		}
	}
	else
		_super.addCertificate(event);
}

/**
 * @param {Boolean} disableTypeSelection
 * @param {String}  [formName]
 * 
 * @properties={typeid:24,uuid:"00558B13-807A-4BC4-96F8-4432D757FE1A"}
 */
function enterEditMode(disableTypeSelection,formName)
{
	forms.psl_inserisci_certificati_dettaglio.gotoEdit();
	_super.enterEditMode(disableTypeSelection,formName);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"31DF9B71-87E8-47D9-AC96-E5BFDB6570A0"}
 */
function exitEditMode(event)
{
	forms.psl_inserisci_certificati_dettaglio.gotoBrowse();
	_super.exitEditMode(event);
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"9E0C3A07-848D-48A3-AA40-A84B1B0FF352"}
 */
function eliminaCertificato(event)
{
	_super.eliminaCertificato(event);
	forms.psl_inserisci_certificati_dettaglio.refreshList();
}

/**
 * @properties={typeid:24,uuid:"4A6F6FD5-F396-4452-B5B4-965F7B8B4DEE"}
 */
function getRiepilogoFormName()
{
	return forms.psl_storico_certificati_riepilogo.controller.getName();
}

/**
 * @param idLavoratore
 * @param idDitta
 * @param periodo
 * @param idEventoClasse
 * @param idStorico
 *
 * @properties={typeid:24,uuid:"E9ACAFFB-710B-4F3C-9474-01AB10BCCC80"}
 */
function aggiornaDettaglioCertificato(idLavoratore, idDitta, periodo, idEventoClasse, idStorico)
{
	init(idLavoratore, idDitta, periodo, idEventoClasse)
	
	vApriSelezioneFiglio = scopes.certificati.RichiedeDatiAggiuntivi(idEventoClasse);
	inizializzaRiepilogo(idStorico, false);
}

/**
 * @properties={typeid:24,uuid:"87D5E56C-9F1D-4DCE-81C4-266F616770E5"}
 */
function enable()
{
	disabled = false;
}

/**
 * @properties={typeid:24,uuid:"E7E77C71-6038-4798-B419-AC933099ACFF"}
 */
function disable()
{
	disabled = true;
	abilitaPulsanti(false,false,false);
}

/**
 * @properties={typeid:24,uuid:"BF21D21A-9F02-4E1D-BDCD-A96CF09AA891"}
 */
function getDatiAggiuntiviForm()
{
	return forms.psl_certificati_datiaggiuntivi;
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"3DBE030A-4A69-4CF9-B437-40C08B2C3D86"}
 */
function forzaInserimentoPadreCongedo()
{
	// Forza l'inserimento del certificato padre		
	/** @type {JSFoundset<db:/ma_presenze/storico_tipicertificato>} */
	var tipiCertificatoFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,'storico_tipicertificato');
	if (tipiCertificatoFs && tipiCertificatoFs.find())
	{
		tipiCertificatoFs.ideventoclasse = vIdEventoClasse;
		tipiCertificatoFs.wizard = 1;
		tipiCertificatoFs.sceltawizard = 1;
		
		if(tipiCertificatoFs.search() === 0)
			throw 'Certificato non riconosciuto';
	}

	inizializzaRiepilogo(null, true);
	updateTipoCertificato(tipiCertificatoFs.getSelectedRecord());
}
