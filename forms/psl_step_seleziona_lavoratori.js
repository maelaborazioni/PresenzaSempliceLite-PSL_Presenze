/**
 * @properties={typeid:35,uuid:"F4B565EF-3799-4036-A351-D855E27822D7",variableType:-4}
 */
var v_selezione = [];

/**
 * @properties={typeid:24,uuid:"C69278BF-80C2-495B-A3DF-EBD99DA05624"}
 */
function refreshData(state)
{
	_super.refreshData(state);
	databaseManager.refreshRecordFromDatabase(foundset, -1);
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"16DBE808-EFF5-4C8A-8A0E-C17AEE749BAD"}
 * @AllowToRunInFind
 */
function beforeStep(state)
{
	var result = _super.beforeStep(state);
	var status = state.elaborazione[state.params.periodo][state.params.ditta.id];
	
	if(!state.params.ditta)
	{
		result.error = true;
		result.message = 'Nessuna ditta selezionata'
	}
	else
	if(!globals.ma_utl_isNullOrEmpty(status['lavoratori']))
	{
		foundset.find()
		&& (foundset.idlavoratore = status['lavoratori']) 
		&& foundset.search() > 0
		&& foundset.sort('lavoratori_to_persone.cognome asc, lavoratori_to_persone.nome asc, codice asc');
		
		ripristinaSelezione();
	}
	
	return result;
}

/**
 * @param [selezione]
 * 
 * @properties={typeid:24,uuid:"D3945A73-58AF-4A87-8627-72419E365397"}
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function ripristinaSelezione(selezione)
{
	selezione = selezione || v_selezione;
	
	var fs = foundset.duplicateFoundSet();
	if (fs && fs.find())
	{
		fs.idlavoratore = selezione;
		if(fs.search() > 0)
		{
			for(var r = 1; r <= fs.getSize(); r++)
			{
				var record = fs.getRecord(r);
				var temp   = record.selected;

				record.selected = 1;
			}
		}
	}
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"E95AFBD6-B2B2-4A0B-889A-4CD369D7E8AD"}
 */
function afterStep(state)
{	
	state.params.lavoratori = v_selezione = getSelectedRecords();
	return _super.afterStep(state);
}

/**
 * @properties={typeid:24,uuid:"59EB49B5-BA6A-47C3-8C29-DE533E3F76CB"}
 */
function getSelectedRecords()
{
	var toreturn = [];
	
	var fs = foundset;
	for(var r = 1; r <= fs.getSize(); r++)
	{
		var record = fs.getRecord(r); 
		if (record.selected == 1)
			toreturn.push(record.idlavoratore);
	}
	
	return toreturn;
}

/**
 * @properties={typeid:24,uuid:"6FE96C07-1EE4-41DC-AA99-F432B880E4CD"}
 */
function validateStep(state)
{
	var isValid = (getSelectedRecords().length > 0);
	if(!isValid)
		state.error = 'Selezionare almeno un lavoratore!';
	else
		state.error = '';
	
	return isValid;
}

/**
 * @properties={typeid:24,uuid:"401C72DD-2C89-4200-AA6C-354E100CD99C"}
 */
function getName()
{
	return scopes.psl.Presenze.Sezioni.LAVORATORI;
}

/**
 * @properties={typeid:24,uuid:"FF7B14C9-91EA-42D4-9E43-1153A52BEFB7"}
 */
function saveState(state)
{
	var snapshot =
	{
		selezione : getSelectedRecords(),
		ids       : globals.foundsetToArray(foundset, 'pkey')		
	}
	
	return snapshot;
}

/**
 * @AllowToRunInFind
 * 
 * @param snapshot
 * @param state
 *
 * @properties={typeid:24,uuid:"30B62E9C-1BC6-4A98-814A-AC23E06BF341"}
 */
function restoreStateFromSnapshot(snapshot, state)
{
	var ids = snapshot.ids;
	if (ids && foundset.find())
	{
		foundset.idlavoratore = ids;
		foundset.search();
	}
	
	if(foundset.getSize() > 0 && snapshot.selezione)
	{
		v_selezione = state.params.lavoratori = snapshot.selezione;
		ripristinaSelezione();
	}
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"6A3CDD8A-BDB7-4FDE-8DD7-62E24FCF5BD3"}
 */
function initState(state)
{
	_super.initState(state);
	state.params.lavoratori = [];
}
