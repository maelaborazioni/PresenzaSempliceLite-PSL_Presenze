dataSource:"db:/ma_presenze/storico_certificati",
encapsulation:60,
items:[
{
labelFor:"fld_codicecertificato",
location:"0,0",
name:"lbl_codicecertificato",
size:"50,20",
styleClass:"table_header_light",
text:"Codice",
typeid:7,
uuid:"06FE0925-E21C-41DC-86F2-DB211696C3CB"
},
{
anchors:3,
labelFor:"fld_datainizio",
location:"220,0",
name:"lbl_datainizio",
size:"70,20",
styleClass:"table_header_light",
text:"Inizio",
typeid:7,
uuid:"29421A3A-6620-41A0-AE88-7B4B54889400"
},
{
anchors:3,
labelFor:"btn_datiaggiuntivi",
location:"360,0",
name:"lbl_datiaggiuntivi",
size:"20,20",
styleClass:"table_header_light",
typeid:7,
uuid:"426C4617-DDE4-4D6E-8C9F-52C93D6D4F4E"
},
{
horizontalAlignment:0,
location:"360,20",
name:"btn_datiaggiuntivi",
onActionMethodID:"2CA1CB30-0E94-4B8B-87EF-95816982AE95",
onDoubleClickMethodID:"-1",
onRenderMethodID:"5A649EC0-1491-4AA0-BAB3-FA35DA16129E",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"table_btn_light",
text:"i",
toolTipText:"i18n:ma.lbl.additional_data",
transparent:true,
typeid:7,
uuid:"4E6B6BAD-1D8A-4E8C-ABE5-99F85DB4E2B5"
},
{
anchors:11,
dataProviderID:"storico_certificati_to_v_riepilogocertificati.v_riepilogocertificati_to_e2eventiclassi.descrizioneclasseevento",
editable:false,
format:"0",
location:"50,20",
name:"fld_descrizione",
size:"170,20",
styleClass:"table_light",
typeid:4,
uuid:"8421FF2B-FFC1-4636-A12E-52072E62750C"
},
{
dataProviderID:"storico_certificati_to_v_riepilogocertificati.v_riepilogocertificati_to_e2eventiclassi.codevento",
editable:false,
format:"0",
location:"0,20",
name:"fld_codicecertificato",
size:"50,20",
styleClass:"table_light",
typeid:4,
uuid:"9660ECB7-1275-4E2C-A989-EF969FD0FE91"
},
{
height:20,
partType:2,
typeid:19,
uuid:"9EEFB595-8B99-4234-A1AB-1D58C448EAF3"
},
{
anchors:3,
labelFor:"fld_datafine",
location:"290,0",
name:"lbl_datafine",
size:"70,20",
styleClass:"table_header_light",
text:"Fine",
typeid:7,
uuid:"C65E1BC4-A23F-4741-9508-781575D00BF5"
},
{
anchors:3,
dataProviderID:"storico_certificati_to_v_riepilogocertificati.datainizio",
editable:false,
format:"dd/MM/yyyy",
location:"220,20",
name:"fld_datainizio",
size:"70,20",
styleClass:"table_light",
typeid:4,
uuid:"C7B0F2BF-0AC2-4A67-9CA1-21495CCE5B7E"
},
{
height:40,
partType:5,
typeid:19,
uuid:"D7AEF49D-834E-49CE-88EE-25C739CB519A"
},
{
anchors:3,
dataProviderID:"storico_certificati_to_v_riepilogocertificati.datafine",
editable:false,
format:"dd/MM/yyyy",
location:"290,20",
name:"fld_datafine",
size:"70,20",
styleClass:"table_light",
typeid:4,
uuid:"DED66697-4423-4F52-8EA3-9B6241A8F777"
},
{
anchors:11,
labelFor:"fld_descrizione",
location:"50,0",
name:"lbl_descrizione",
size:"170,20",
styleClass:"table_header_light",
text:"Descrizione",
typeid:7,
uuid:"E58529CA-A1DD-4254-9313-7DF4DF37F074"
}
],
name:"psl_storico_riepilogocertificati",
onRecordSelectionMethodID:"0B9266E0-94CA-4CDF-8CD5-0C1CEBD0B654",
scrollbars:32,
showInMenu:true,
size:"380,40",
styleName:"psl",
typeid:3,
uuid:"67D491E8-A524-4B60-980D-C8E5BF0FBE01",
view:3