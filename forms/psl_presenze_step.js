/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"BCA50B67-3BA3-4F1D-958C-65B2E08C4958",variableType:93}
 */
var v_month = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"DCF67761-55C8-4D86-95EB-5CA9AEDD56C8",variableType:4}
 */
var v_ditta = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"08B36545-4217-4D85-A82B-B64184AEBE83"}
 */
var v_ditta_desc = '';

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"61812A4A-55C3-41F6-AC25-4EB191A1211A"}
 */
function beforeStep(state)
{
	v_month = state.params.periodo  || v_month;
	v_ditta = state.params.ditta.id || v_ditta;
	
	updateDitta(v_ditta);
	
	return _super.beforeStep(state);
}

/**
 * @properties={typeid:24,uuid:"53050E7B-B903-44AD-9B7B-6A3A293ED8CA"}
 */
function getSnapshot(state)
{
	var info = scopes.psl.Presenze.GetProcessingInfo(state, state.params.periodo, state.params.ditta.id);
	if (info)
		return info.snapshot[getName()];
	
	return null;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"7D8D19F8-7727-407A-B3A3-02C3544AF642"}
 */
function isProcessingStateFinal(state)
{
	return scopes.psl.Presenze.GetProcessingState(state) > scopes.psl.Presenze.GetLastEditableState();
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"E6152B71-76EC-47CC-88F9-AF5D2502562F"}
 */
function getStateChangeParams(state)
{
	return { month: state.params.periodo, company: state.params.ditta, reset: true };
}

/**
 * @properties={typeid:24,uuid:"49081483-BECA-4F1F-A15F-768ECCA0BEF3"}
 */
function getMainForm()
{
	return forms.psl_nav_presenze;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"9907E438-42B2-4AD1-B3DE-079464961E8F"}
 */
function isDirty(state)
{
	if(_super.isDirty(state))
		return true;

	var status = scopes.psl.Presenze.GetProcessingInfo(state, state.params.periodo, state.params.ditta.id);

	return (status && status.is_dirty && true) || false;
}

/**
 * @param {Number} ditta
 *
 * @properties={typeid:24,uuid:"03263979-BC49-4BA6-A7E3-265910CDF495"}
 */
function updateDitta(ditta)
{
	if(ditta)
	{
		var fs = datasources.db.ma_anagrafiche.ditte.getFoundSet();
		if (fs.loadRecords(ditta))
			v_ditta_desc = fs.ragionesociale;
	}
}

/**
 * @properties={typeid:24,uuid:"90230857-4971-4CCE-B2CD-22AC4C2FFE5E"}
 */
function disable()
{
	_super.disable();
	
	controller.enabled = false;
	controller.readOnly = true;
}

/**
 * @properties={typeid:24,uuid:"71E6186D-8626-4218-90BD-CE7E296C4D05"}
 */
function enable()
{
	_super.enable();
	
	controller.enabled = true;
	controller.readOnly = false;
}