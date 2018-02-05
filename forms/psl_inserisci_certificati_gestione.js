/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"286B1FBB-F1DA-4DB0-924D-08241B9172DA",variableType:93}
 */
var v_month = null;

/**
 * @properties={typeid:24,uuid:"04C1781E-70C6-4699-BF8E-FFC748FCE4BD"}
 */
function refresh()
{
	databaseManager.refreshRecordFromDatabase(lavoratori_to_storico_certificati, -1);
}

/**
 * @AllowToRunInFind
 * 
 * @properties={typeid:24,uuid:"79389609-D32E-4E54-A14B-C116D25AEB15"}
 */
function onDataChangeEventoLungo(oldValue, newValue, event)
{
	var fs = lavoratori_to_storico_certificati;
	if (fs.find())
	{
		fs.ideventoclasse = newValue;
		fs.search();
	}
	
	return true;
}

/**
 * @param month
 *
 * @properties={typeid:24,uuid:"8B6800A1-9BF3-4483-ACD6-F627C6877D05"}
 */
function setMonth(month)
{
	v_month = month;
}
