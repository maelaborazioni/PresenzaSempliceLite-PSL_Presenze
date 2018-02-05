/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B3570E6D-9151-4D87-8157-645C9DC7E411",variableType:-4}
 */
var v_selectall = true;

/**
 * @param fs
 *
 * @properties={typeid:24,uuid:"65F68029-A709-4490-8497-25C535AB57B5"}
 * @SuppressWarnings(unused)
 */
function clearSelection(fs)
{
	for(var r = 1; r <= fs.getSize(); r++)
	{
		// needed for successful storing of the calculation (see https://support.servoy.com/browse/SVY-7095)
		var temp = fs.getRecord(r).selected;
		fs.getRecord(r).selected = 0;
	}
}

/**
 * @param fs
 *
 * @properties={typeid:24,uuid:"E6599188-B814-4F51-90E9-795EE18360F8"}
 * @SuppressWarnings(unused)
 */
function selectAll(fs)
{
	for(var r = 1; r <= fs.getSize(); r++)
	{
		// needed for successful storing of the calculation (see https://support.servoy.com/browse/SVY-7095)
		var temp = fs.getRecord(r).selected;
		fs.getRecord(r).selected = 1;
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CBEA238B-2674-42BB-BDCB-DF791261B2F9"}
 */
function onActionSelected(event) 
{
	if(v_selectall)
		selectAll(foundset);
	else
		clearSelection(foundset);
	
	v_selectall = !v_selectall;
}

/**
 * @properties={typeid:24,uuid:"401E2633-6965-4375-9114-1915F064A1AB"}
 */
function onDataChange$selected(oldValue, newValue, event)
{
	if(newValue === 1)
		v_selectall = false;
}