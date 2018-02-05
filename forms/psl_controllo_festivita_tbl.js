/**
 * @type {Continuation}
 * 
 * @properties={typeid:35,uuid:"5852F1B0-489E-4E65-8C94-BBACDA155C23",variableType:-4}
 */
var dialogContinuation = null;

/**
 * @properties={typeid:35,uuid:"2686F603-67B7-47FC-96D6-F7B140189D57",variableType:-4}
 */
var returnValue = false;

/**
 * @properties={typeid:24,uuid:"078CA8D5-C51F-4282-AD43-5DD824CCA5F2"}
 */
function init(festivita)
{
	var dataset = databaseManager.createEmptyDataSet(0, ['data', 'descrizione', 'accinfra', 'accriposo']);
	for (var f = 0; f < festivita.length; f++)
		dataset.addRow(festivita[f]);

	var datasourceName = ['elenco_festivita'].join('_');
	var datasource     = dataset.createDataSource(datasourceName, [JSColumn.TEXT, JSColumn.TEXT, JSColumn.INTEGER, JSColumn.INTEGER]);

	if (foundset.getDataSource() !== datasource)
	{
		var jsForm = solutionModel.getForm(controller.getName());
		if(!jsForm.dataSource)
		{	
			jsForm.getField(elements.fld_data.getName()).dataProviderID = 'data';
			jsForm.getField(elements.fld_descrizione.getName()).dataProviderID = 'descrizione';
			jsForm.getField(elements.fld_accinfra.getName()).dataProviderID = 'accinfra';
			jsForm.getField(elements.fld_accriposo.getName()).dataProviderID = 'accriposo';
		}
			
		jsForm.dataSource = datasource;
		controller.recreateUI();
	}
}

/**
 * @properties={typeid:24,uuid:"7A9C764F-69F6-4D80-8522-F513538BD6BE"}
 */
function hide(event)
{
	globals.svy_mod_closeForm(event);
	
	if(dialogContinuation && scopes.utl.IsWebClient())
		dialogContinuation(returnValue);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5BD6F9C8-E988-4FD5-8573-76292D7DDD42"}
 */
function onAction$btn_conferma(event)
{
	returnValue = true;
	hide(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B03A32B8-EF60-4FE9-A78A-3F37A6A8FD0C"}
 */
function onAction$btn_annulla(event) 
{
	returnValue = false;
	hide(event);
}
