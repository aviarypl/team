;/* js/productform.js */
function selectProduct(product, component, anyval) {
if (!product || !component)
return;
if (product.length == (anyval != null ? 1 : 0))
return;
if ((first_load) && (product.selectedIndex == -1)) {
first_load = false;
return;
}
first_load = false;
var sel = Array();
var merging = false;
var findall = (product.selectedIndex == -1
|| (anyval != null && product.options[0].selected));
sel = get_selection(product, findall, false, anyval);
if (!findall) {
var tmp = sel;
if ((last_sel.length > 0) && (last_sel.length < sel.length)) {
sel = fake_diff_array(sel, last_sel);
merging = true;
}
last_sel = tmp;
}
var saved_cpts = get_selection(component, false, true, null);
updateSelect(cpts, sel, component, merging, anyval);
restoreSelection(component, saved_cpts);
}
function updateSelect(array, sel, target, merging, anyval) {
var i, item;
if (array.length < 1) {
target.options.length = 0;
return false;
}
if (merging) {
item = merge_arrays(array[sel[0]], target.options, 1);
for (i = 1 ; i < sel.length ; i++)
item = merge_arrays(array[sel[i]], item, 0);
}
else if (sel.length > 1) {
item = merge_arrays(array[sel[0]],array[sel[1]], 0);
for (i = 2; i < sel.length; i++)
item = merge_arrays(item, array[sel[i]], 0);
}
else {
item = array[sel[0]];
}
target.options.length = 0;
if (anyval != null)
target.options[0] = new Option(anyval, "");
for (i = 0; i < item.length; i++)
target.options[target.options.length] = new Option(item[i], item[i]);
return true;
}
function restoreSelection(control, selnames) {
for (var j = 0; j < selnames.length; j++)
for (var i = 0; i < control.options.length; i++)
if (control.options[i].value == selnames[j])
control.options[i].selected = true;
}
function fake_diff_array(a, b) {
var newsel = new Array();
var found = false;
for (var ia in a) {
for (var ib in b)
if (a[ia] == b[ib])
found = true;
if (!found)
newsel[newsel.length] = a[ia];
found = false;
}
return newsel;
}
function merge_arrays(a, b, b_is_select) {
var pos_a = 0;
var pos_b = 0;
var ret = new Array();
var bitem, aitem;
while ((pos_a < a.length) && (pos_b < b.length)) {
aitem = a[pos_a];
if (b_is_select)
bitem = b[pos_b].value;
else
bitem = b[pos_b];
if (aitem.toLowerCase() < bitem.toLowerCase()) {
ret[ret.length] = aitem;
pos_a++;
}
else {
if (aitem.toLowerCase() > bitem.toLowerCase()) {
ret[ret.length] = bitem;
pos_b++;
}
else {
ret[ret.length] = aitem;
pos_a++;
pos_b++;
}
}
}
if (pos_a < a.length)
for (; pos_a < a.length ; pos_a++)
ret[ret.length] = a[pos_a];
if (pos_b < b.length) {
for (; pos_b < b.length; pos_b++) {
if (b_is_select)
bitem = b[pos_b].value;
else
bitem = b[pos_b];
ret[ret.length] = bitem;
}
}
return ret;
}
function get_selection(control, findall, want_values, anyval) {
var ret = new Array();
if ((!findall) && (control.selectedIndex == -1))
return ret;
for (var i = (anyval != null ? 1 : 0); i < control.length; i++)
if (findall || control.options[i].selected)
ret[ret.length] = want_values ? control.options[i].value : i;
return ret;
}
;/* js/field.js */
var bz_no_validate_enter_bug = false;
function validateEnterBug(theform) {
if (bz_no_validate_enter_bug) {
bz_no_validate_enter_bug = false;
return true;
}
var component = theform.component;
var short_desc = theform.short_desc;
var version = theform.version;
var bug_status = theform.bug_status;
var description = theform.comment;
var attach_data = theform.data;
var attach_desc = theform.description;
var current_errors = YAHOO.util.Dom.getElementsByClassName(
'validation_error_text', null, theform);
for (var i = 0; i < current_errors.length; i++) {
current_errors[i].parentNode.removeChild(current_errors[i]);
}
var current_error_fields = YAHOO.util.Dom.getElementsByClassName(
'validation_error_field', null, theform);
for (var i = 0; i < current_error_fields.length; i++) {
var field = current_error_fields[i];
YAHOO.util.Dom.removeClass(field, 'validation_error_field');
}
var focus_me;
if (attach_data && attach_data.value && YAHOO.lang.trim(attach_desc.value) == '') {
_errorFor(attach_desc, 'attach_desc');
focus_me = attach_desc;
}
if (bug_status) {
var check_description = status_comment_required[bug_status.value];
if (check_description && YAHOO.lang.trim(description.value) == '') {
_errorFor(description, 'description');
focus_me = description;
}
}
if (YAHOO.lang.trim(short_desc.value) == '') {
_errorFor(short_desc);
focus_me = short_desc;
}
if (version.selectedIndex < 0) {
_errorFor(version);
focus_me = version;
}
if (component.selectedIndex < 0) {
_errorFor(component);
focus_me = component;
}
if (focus_me) {
focus_me.focus();
return false;
}
return true;
}
function _errorFor(field, name) {
if (!name) name = field.id;
var string_name = name + '_required';
var error_text = BUGZILLA.string[string_name];
var new_node = document.createElement('div');
YAHOO.util.Dom.addClass(new_node, 'validation_error_text');
new_node.innerHTML = error_text;
YAHOO.util.Dom.insertAfter(new_node, field);
YAHOO.util.Dom.addClass(field, 'validation_error_field');
}
function createCalendar(name, start_weekday, months_long, weekdays_short) {
var cal = new YAHOO.widget.Calendar('calendar_' + name,
'con_calendar_' + name,
{ START_WEEKDAY:  start_weekday,
MONTHS_LONG:    months_long,
WEEKDAYS_SHORT: weekdays_short
});
YAHOO.bugzilla['calendar_' + name] = cal;
var field = document.getElementById(name);
cal.selectEvent.subscribe(setFieldFromCalendar, field, false);
updateCalendarFromField(field);
cal.render();
}
function showCalendar(field_name) {
var calendar  = YAHOO.bugzilla["calendar_" + field_name];
var field     = document.getElementById(field_name);
var button    = document.getElementById('button_calendar_' + field_name);
bz_overlayBelow(calendar.oDomContainer, field);
calendar.show();
button.onclick = function() { hideCalendar(field_name); };
calendar.bz_myBodyCloser = function(event) {
var container = this.oDomContainer;
var target    = YAHOO.util.Event.getTarget(event);
if (target != container && target != button
&& !YAHOO.util.Dom.isAncestor(container, target))
{
hideCalendar(field_name);
}
};
YAHOO.util.Event.addListener(document.body, 'click',
calendar.bz_myBodyCloser, calendar, true);
calendar.bz_escCal = function (event) {
var key = YAHOO.util.Event.getCharCode(event);
if (key == 27) {
hideCalendar(field_name);
}
};
YAHOO.util.Event.addListener(document.body, 'keydown', calendar.bz_escCal);
}
function hideCalendar(field_name) {
var cal = YAHOO.bugzilla["calendar_" + field_name];
cal.hide();
var button = document.getElementById('button_calendar_' + field_name);
button.onclick = function() { showCalendar(field_name); };
YAHOO.util.Event.removeListener(document.body, 'click',
cal.bz_myBodyCloser);
YAHOO.util.Event.removeListener(document.body, 'keydown', cal.bz_escCal);
}
function setFieldFromCalendar(type, args, date_field) {
var dates = args[0];
var setDate = dates[0];
var timeRe = /\b(\d{1,2}):(\d\d)(?::(\d\d))?/;
var currentTime = timeRe.exec(date_field.value);
var d = new Date(setDate[0], setDate[1] - 1, setDate[2]);
if (currentTime) {
d.setHours(currentTime[1], currentTime[2]);
if (currentTime[3]) {
d.setSeconds(currentTime[3]);
}
}
var year = d.getFullYear();
var month = d.getMonth() + 1;
if (month < 10) month = '0' + String(month);
var day = d.getDate();
if (day < 10) day = '0' + String(day);
var dateStr = year + '-' + month  + '-' + day;
if (currentTime) {
var minutes = d.getMinutes();
if (minutes < 10) minutes = '0' + String(minutes);
var seconds = d.getSeconds();
if (seconds > 0 && seconds < 10) {
seconds = '0' + String(seconds);
}
dateStr = dateStr + ' ' + d.getHours() + ':' + minutes;
if (seconds) dateStr = dateStr + ':' + seconds;
}
date_field.value = dateStr;
hideCalendar(date_field.id);
}
function updateCalendarFromField(date_field) {
var dateRe = /(\d\d\d\d)-(\d\d?)-(\d\d?)/;
var pieces = dateRe.exec(date_field.value);
if (pieces) {
var cal = YAHOO.bugzilla["calendar_" + date_field.id];
cal.select(new Date(pieces[1], pieces[2] - 1, pieces[3]));
var selectedArray = cal.getSelectedDates();
var selected = selectedArray[0];
cal.cfg.setProperty("pagedate", (selected.getMonth() + 1) + '/'
+ selected.getFullYear());
cal.render();
}
}
function setupEditLink(id) {
var link_container = 'container_showhide_' + id;
var input_container = 'container_' + id;
var link = 'showhide_' + id;
hideEditableField(link_container, input_container, link);
}
function hideEditableField( container, input, action, field_id, original_value, new_value, hide_input ) {
YAHOO.util.Dom.removeClass(container, 'bz_default_hidden');
YAHOO.util.Dom.addClass(input, 'bz_default_hidden');
YAHOO.util.Event.addListener(action, 'click', showEditableField,
new Array(container, input, field_id, new_value));
if(field_id != ""){
YAHOO.util.Event.addListener(window, 'load', checkForChangedFieldValues,
new Array(container, input, field_id, original_value, hide_input ));
}
}
function showEditableField (e, ContainerInputArray) {
var inputs = new Array();
var inputArea = YAHOO.util.Dom.get(ContainerInputArray[1]);
if ( ! inputArea ){
YAHOO.util.Event.preventDefault(e);
return;
}
YAHOO.util.Dom.addClass(ContainerInputArray[0], 'bz_default_hidden');
YAHOO.util.Dom.removeClass(inputArea, 'bz_default_hidden');
if ( inputArea.tagName.toLowerCase() == "input" ) {
inputs.push(inputArea);
} else if (ContainerInputArray[2]) {
inputs.push(document.getElementById(ContainerInputArray[2]));
} else {
inputs = inputArea.getElementsByTagName('input');
}
if ( inputs.length > 0 ) {
var type = inputs[0].tagName.toLowerCase();
if (ContainerInputArray[3]) {
if ( type == "input" ) {
inputs[0].value = ContainerInputArray[3];
} else {
for (var i = 0; inputs[0].length; i++) {
if ( inputs[0].options[i].value == ContainerInputArray[3] ) {
inputs[0].options[i].selected = true;
break;
}
}
}
}
inputs[0].focus();
if ( type == "input" || type == "textarea" ) {
inputs[0].select();
}
}
YAHOO.util.Event.preventDefault(e);
}
function checkForChangedFieldValues(e, ContainerInputArray ) {
var el = document.getElementById(ContainerInputArray[2]);
var unhide = false;
if ( el ) {
if ( !ContainerInputArray[4]
&& (el.value != ContainerInputArray[3]
|| (el.value == "" && el.id != "qa_contact")) )
{
unhide = true;
}
else {
var set_default = document.getElementById("set_default_" +
ContainerInputArray[2]);
if ( set_default ) {
if(set_default.checked){
unhide = true;
}
}
}
}
if(unhide){
YAHOO.util.Dom.addClass(ContainerInputArray[0], 'bz_default_hidden');
YAHOO.util.Dom.removeClass(ContainerInputArray[1], 'bz_default_hidden');
}
}
function showPeopleOnChange( field_id_list ) {
for(var i = 0; i < field_id_list.length; i++) {
YAHOO.util.Event.addListener( field_id_list[i],'change', showEditableField,
new Array('bz_qa_contact_edit_container',
'bz_qa_contact_input'));
YAHOO.util.Event.addListener( field_id_list[i],'change',showEditableField,
new Array('bz_assignee_edit_container',
'bz_assignee_input'));
}
}
function assignToDefaultOnChange(field_id_list, default_assignee, default_qa_contact) {
showPeopleOnChange(field_id_list);
for(var i = 0, l = field_id_list.length; i < l; i++) {
YAHOO.util.Event.addListener(field_id_list[i], 'change', function(evt, defaults) {
if (document.getElementById('assigned_to').value == defaults[0]) {
setDefaultCheckbox(evt, 'set_default_assignee');
}
if (document.getElementById('qa_contact')
&& document.getElementById('qa_contact').value == defaults[1])
{
setDefaultCheckbox(evt, 'set_default_qa_contact');
}
}, [default_assignee, default_qa_contact]);
}
}
function initDefaultCheckbox(field_id){
YAHOO.util.Event.addListener( 'set_default_' + field_id,'change', boldOnChange,
'set_default_' + field_id);
YAHOO.util.Event.addListener( window,'load', checkForChangedFieldValues,
new Array( 'bz_' + field_id + '_edit_container',
'bz_' + field_id + '_input',
'set_default_' + field_id ,'1'));
YAHOO.util.Event.addListener( window, 'load', boldOnChange,
'set_default_' + field_id );
}
function showHideStatusItems(e, dupArrayInfo) {
var el = document.getElementById('bug_status');
if ( el ) {
showDuplicateItem(el);
var resolution = document.getElementById('resolution');
if (resolution && resolution.options[0].value != '') {
resolution.bz_lastSelected = resolution.selectedIndex;
var emptyOption = new Option('', '');
resolution.insertBefore(emptyOption, resolution.options[0]);
emptyOption.selected = true;
}
YAHOO.util.Dom.addClass('resolution_settings', 'bz_default_hidden');
if (document.getElementById('resolution_settings_warning')) {
YAHOO.util.Dom.addClass('resolution_settings_warning',
'bz_default_hidden');
}
YAHOO.util.Dom.addClass('duplicate_display', 'bz_default_hidden');
if ( (el.value == dupArrayInfo[1] && dupArrayInfo[0] == "is_duplicate")
|| bz_isValueInArray(close_status_array, el.value) )
{
YAHOO.util.Dom.removeClass('resolution_settings',
'bz_default_hidden');
YAHOO.util.Dom.removeClass('resolution_settings_warning',
'bz_default_hidden');
if (resolution && resolution.options[0].value == '') {
resolution.removeChild(resolution.options[0]);
resolution.selectedIndex = resolution.bz_lastSelected;
}
}
if (resolution) {
bz_fireEvent(resolution, 'change');
}
}
}
function showDuplicateItem(e) {
var resolution = document.getElementById('resolution');
var bug_status = document.getElementById('bug_status');
var dup_id = document.getElementById('dup_id');
if (resolution) {
if (resolution.value == 'DUPLICATE' && bz_isValueInArray( close_status_array, bug_status.value) ) {
YAHOO.util.Dom.removeClass('duplicate_settings',
'bz_default_hidden');
YAHOO.util.Dom.addClass('dup_id_discoverable', 'bz_default_hidden');
if( ! YAHOO.util.Dom.hasClass( dup_id, 'bz_default_hidden' ) ){
dup_id.focus();
dup_id.select();
}
}
else {
YAHOO.util.Dom.addClass('duplicate_settings', 'bz_default_hidden');
YAHOO.util.Dom.removeClass('dup_id_discoverable',
'bz_default_hidden');
dup_id.blur();
}
}
YAHOO.util.Event.preventDefault(e); //prevents the hyperlink from going to the url in the href.
}
function setResolutionToDuplicate(e, duplicate_or_move_bug_status) {
var status = document.getElementById('bug_status');
var resolution = document.getElementById('resolution');
YAHOO.util.Dom.addClass('dup_id_discoverable', 'bz_default_hidden');
status.value = duplicate_or_move_bug_status;
bz_fireEvent(status, 'change');
resolution.value = "DUPLICATE";
bz_fireEvent(resolution, 'change');
YAHOO.util.Event.preventDefault(e);
}
function setDefaultCheckbox(e, field_id) {
var el = document.getElementById(field_id);
var elLabel = document.getElementById(field_id + "_label");
if( el && elLabel ) {
el.checked = "true";
YAHOO.util.Dom.setStyle(elLabel, 'font-weight', 'bold');
}
}
function boldOnChange(e, field_id){
var el = document.getElementById(field_id);
var elLabel = document.getElementById(field_id + "_label");
if( el && elLabel ) {
if( el.checked ){
YAHOO.util.Dom.setStyle(elLabel, 'font-weight', 'bold');
}
else{
YAHOO.util.Dom.setStyle(elLabel, 'font-weight', 'normal');
}
}
}
function updateCommentTagControl(checkbox, field) {
if (checkbox.checked) {
YAHOO.util.Dom.addClass(field, 'bz_private');
} else {
YAHOO.util.Dom.removeClass(field, 'bz_private');
}
}
function setClassification() {
var classification = document.getElementById('classification');
var product = document.getElementById('product');
var selected_product = product.value;
var select_classification = all_classifications[selected_product];
classification.value = select_classification;
bz_fireEvent(classification, 'change');
}
function showFieldWhen(controlled_id, controller_id, values) {
var controller = document.getElementById(controller_id);
YAHOO.util.Event.addListener(controller, 'change',
handleVisControllerValueChange, [controlled_id, controller, values]);
}
function handleVisControllerValueChange(e, args) {
var controlled_id = args[0];
var controller = args[1];
var values = args[2];
var field = document.getElementById(controlled_id);
var label_container =
document.getElementById('field_label_' + controlled_id);
var field_container =
document.getElementById('field_container_' + controlled_id);
var selected = false;
for (var i = 0; i < values.length; i++) {
if (bz_valueSelected(controller, values[i])) {
selected = true;
break;
}
}
if (selected) {
YAHOO.util.Dom.removeClass(label_container, 'bz_hidden_field');
YAHOO.util.Dom.removeClass(field_container, 'bz_hidden_field');
var field_readonly = document.getElementById(controlled_id + '_readonly');
if (!field_readonly) {
var field_input = document.getElementById(controlled_id + '_input');
var edit_container =
document.getElementById(controlled_id + '_edit_container');
if (field_input) {
YAHOO.util.Dom.removeClass(field_input, 'bz_default_hidden');
}
if (edit_container) {
YAHOO.util.Dom.addClass(edit_container, 'bz_hidden_field');
}
}
if (field.getAttribute('data-required') == "true") {
field.setAttribute('required', 'true');
field.setAttribute('aria-required', 'true');
}
}
else {
YAHOO.util.Dom.addClass(label_container, 'bz_hidden_field');
YAHOO.util.Dom.addClass(field_container, 'bz_hidden_field');
if (field.getAttribute('data-required') == "true") {
field.removeAttribute('required');
field.removeAttribute('aria-required');
}
}
}
var bz_value_controllers = {};
var bz_value_controller_has_handler = {};
function showValueWhen(target_field_id, target_value_ids,
source_field_id, source_value_id, empty_shows_all)
{
if (!bz_value_controllers[source_field_id]) {
bz_value_controllers[source_field_id] = {};
}
if (!bz_value_controllers[source_field_id][target_field_id]) {
bz_value_controllers[source_field_id][target_field_id] = {};
}
var source_values = bz_value_controllers[source_field_id][target_field_id];
source_values[source_value_id] = target_value_ids;
if (!bz_value_controller_has_handler[source_field_id]) {
var source_field = document.getElementById(source_field_id);
YAHOO.util.Event.addListener(source_field, 'change',
handleValControllerChange, [source_field, empty_shows_all]);
bz_value_controller_has_handler[source_field_id] = true;
}
}
function handleValControllerChange(e, args) {
var source = args[0];
var empty_shows_all = args[1];
for (var target_field_id in bz_value_controllers[source.id]) {
var target = document.getElementById(target_field_id);
if (!target) continue;
_update_displayed_values(source, target, empty_shows_all);
}
}
var bz_option_hide_count = {};
function _update_displayed_values(source, target, empty_shows_all) {
var show_all = (empty_shows_all && source.selectedIndex == -1);
bz_option_hide_count[target.id] = {};
var source_values = bz_value_controllers[source.id][target.id];
for (source_value_id in source_values) {
var source_option = getPossiblyHiddenOption(source, source_value_id);
var target_values = source_values[source_value_id];
for (var i = 0; i < target_values.length; i++) {
var target_value_id = target_values[i];
_handle_source_target(source_option, target, target_value_id,
show_all);
}
}
bz_fireEvent(target, 'change');
}
function _handle_source_target(source_option, target, target_value_id,
show_all)
{
var target_option = getPossiblyHiddenOption(target, target_value_id);
if (source_option.selected || (show_all && !source_option.disabled)) {
_show_option(target_option, target);
}
else {
_hide_option(target_option, target);
}
}
var bz_option_duplicate_count = {};
function _show_option(option, field) {
if (!option.disabled) return;
option = showOptionInIE(option, field);
YAHOO.util.Dom.removeClass(option, 'bz_hidden_option');
option.disabled = false;
}
function _hide_option(option, field) {
if (option.disabled) return;
var value_id = option.bz_value_id;
if (field.id in bz_option_duplicate_count
&& value_id in bz_option_duplicate_count[field.id])
{
if (!bz_option_hide_count[field.id][value_id]) {
bz_option_hide_count[field.id][value_id] = 0;
}
bz_option_hide_count[field.id][value_id]++;
var current = bz_option_hide_count[field.id][value_id];
var dups    = bz_option_duplicate_count[field.id][value_id];
if (current <= dups) return;
}
YAHOO.util.Dom.addClass(option, 'bz_hidden_option');
option.selected = false;
option.disabled = true;
hideOptionInIE(option, field);
}
function _value_id(field_name, id) {
return 'v' + id + '_' + field_name;
}
var ie_hidden_options = {};
function hideOptionInIE(anOption, aSelect) {
if (browserCanHideOptions(aSelect)) return;
var commentNode = document.createComment(anOption.value);
commentNode.id = anOption.id;
commentNode.disabled = true;
if (anOption.replaceNode) {
anOption.replaceNode(commentNode);
}
else {
aSelect.replaceChild(commentNode, anOption);
}
if (!ie_hidden_options[aSelect.id]) {
ie_hidden_options[aSelect.id] = {};
}
ie_hidden_options[aSelect.id][anOption.id] = commentNode;
}
function showOptionInIE(aNode, aSelect) {
if (browserCanHideOptions(aSelect)) return aNode;
var optionNode = document.createElement('option');
optionNode.innerHTML = aNode.data;
optionNode.value = aNode.data;
optionNode.id = aNode.id;
if (aNode.replaceNode) {
aNode.replaceNode(optionNode);
}
else {
aSelect.replaceChild(optionNode, aNode);
}
delete ie_hidden_options[aSelect.id][optionNode.id];
return optionNode;
}
function initHidingOptionsForIE(select_name) {
var aSelect = document.getElementById(select_name);
if (browserCanHideOptions(aSelect)) return;
if (!aSelect) return;
for (var i = 0; ;i++) {
var item = aSelect.options[i];
if (!item) break;
if (item.disabled) {
hideOptionInIE(item, aSelect);
i--; // Hiding an option means that the options array has changed.
}
}
}
var bz_option_duplicates = {};
function getPossiblyHiddenOption(aSelect, optionId) {
if (bz_option_duplicates[aSelect.id]
&& bz_option_duplicates[aSelect.id][optionId])
{
optionId = bz_option_duplicates[aSelect.id][optionId];
}
var id = _value_id(aSelect.id, optionId);
var val = document.getElementById(id);
if (!val && ie_hidden_options[aSelect.id]) {
val = ie_hidden_options[aSelect.id][id];
}
val.bz_value_id = optionId;
return val;
}
var browser_can_hide_options;
function browserCanHideOptions(aSelect) {
if (typeof(browser_can_hide_options) == "undefined") {
var new_opt = bz_createOptionInSelect(aSelect, '', '');
var opt_pos = YAHOO.util.Dom.getX(new_opt);
aSelect.removeChild(new_opt);
if (opt_pos) {
browser_can_hide_options = true;
}
else {
browser_can_hide_options = false;
}
}
return browser_can_hide_options;
}
YAHOO.bugzilla.userAutocomplete = {
counter : 0,
dataSource : null,
generateRequest : function ( enteredText ){
YAHOO.bugzilla.userAutocomplete.counter =
YAHOO.bugzilla.userAutocomplete.counter + 1;
YAHOO.util.Connect.setDefaultPostHeader('application/json', true);
var json_object = {
method : "User.get",
id : YAHOO.bugzilla.userAutocomplete.counter,
params : [ {
Bugzilla_api_token: BUGZILLA.api_token,
match : [ decodeURIComponent(enteredText) ],
include_fields : [ "name", "real_name" ]
} ]
};
var stringified =  YAHOO.lang.JSON.stringify(json_object);
var debug = { msg: "json-rpc obj debug info", "json obj": json_object,
"param" : stringified}
YAHOO.bugzilla.userAutocomplete.debug_helper( debug );
return stringified;
},
resultListFormat : function(oResultData, enteredText, sResultMatch) {
return ( YAHOO.lang.escapeHTML(oResultData.real_name) + " ("
+ YAHOO.lang.escapeHTML(oResultData.name) + ")");
},
debug_helper : function ( ){
if( typeof(console) !== 'undefined' && console != null && arguments.length > 0 ){
console.log("debug helper info:", arguments);
}
return true;
},
init_ds : function(){
this.dataSource = new YAHOO.util.XHRDataSource("jsonrpc.cgi");
this.dataSource.connTimeout = 30000;
this.dataSource.connMethodPost = true;
this.dataSource.connXhrMode = "cancelStaleRequests";
this.dataSource.maxCacheEntries = 5;
this.dataSource.responseSchema = {
resultsList : "result.users",
metaFields : { error: "error", jsonRpcId: "id"},
fields : [
{ key : "name" },
{ key : "real_name"}
]
};
},
init : function( field, container, multiple ) {
if( this.dataSource == null ){
this.init_ds();
}
var userAutoComp = new YAHOO.widget.AutoComplete( field, container,
this.dataSource );
userAutoComp.maxResultsDisplayed = BUGZILLA.param.maxusermatches;
userAutoComp.generateRequest = this.generateRequest;
userAutoComp.formatResult = this.resultListFormat;
userAutoComp.doBeforeLoadData = this.debug_helper;
userAutoComp.minQueryLength = 3;
userAutoComp.autoHighlight = false;
userAutoComp.queryDelay = 0.05;
userAutoComp.useIFrame = true;
userAutoComp.resultTypeList = false;
if( multiple == true ){
userAutoComp.delimChar = [","];
}
}
};
YAHOO.bugzilla.fieldAutocomplete = {
dataSource : [],
init_ds : function( field ) {
this.dataSource[field] =
new YAHOO.util.LocalDataSource( YAHOO.bugzilla.field_array[field] );
},
init : function( field, container ) {
if( this.dataSource[field] == null ) {
this.init_ds( field );
}
var fieldAutoComp =
new YAHOO.widget.AutoComplete(field, container, this.dataSource[field]);
fieldAutoComp.maxResultsDisplayed = YAHOO.bugzilla.field_array[field].length;
fieldAutoComp.formatResult = fieldAutoComp.formatEscapedResult;
fieldAutoComp.minQueryLength = 0;
fieldAutoComp.useIFrame = true;
fieldAutoComp.delimChar = [","," "];
fieldAutoComp.resultTypeList = false;
fieldAutoComp.queryDelay = 0;
fieldAutoComp.textboxFocusEvent.subscribe( function(){
var sInputValue = YAHOO.util.Dom.get(field).value;
if( sInputValue.length === 0
&& YAHOO.bugzilla.field_array[field].length > 0 ){
this.sendQuery(sInputValue);
this.collapseContainer();
this.expandContainer();
}
});
fieldAutoComp.dataRequestEvent.subscribe( function(type, args) {
args[0].autoHighlight = args[1] != '';
});
}
};
function userDisabledTextOnChange(disabledtext) {
var disable_mail = document.getElementById('disable_mail');
if (disabledtext.value === "" && !disable_mail_manually_set) {
disable_mail.checked = false;
}
if (disabledtext.value !== "" && !disable_mail_manually_set) {
disable_mail.checked = true;
}
}
function initDirtyFieldTracking() {
if (YAHOO.env.ua.ie > 0 && YAHOO.env.ua.ie <= 8) return;
var selects = document.getElementById('changeform').getElementsByTagName('select');
for (var i = 0, l = selects.length; i < l; i++) {
var el = selects[i];
var el_dirty = document.getElementById(el.name + '_dirty');
if (!el_dirty) continue;
if (!el_dirty.value) {
var preSelected = bz_preselectedOptions(el);
if (!el.multiple) {
preSelected.selected = true;
} else {
el.selectedIndex = -1;
for (var j = 0, m = preSelected.length; j < m; j++) {
preSelected[j].selected = true;
}
}
}
YAHOO.util.Event.on(el, "change", function(e) {
var el = e.target || e.srcElement;
var preSelected = bz_preselectedOptions(el);
var currentSelected = bz_selectedOptions(el);
var isDirty = false;
if (!el.multiple) {
isDirty = preSelected.index != currentSelected.index;
} else {
if (preSelected.length != currentSelected.length) {
isDirty = true;
} else {
for (var i = 0, l = preSelected.length; i < l; i++) {
if (currentSelected[i].index != preSelected[i].index) {
isDirty = true;
break;
}
}
}
}
document.getElementById(el.name + '_dirty').value = isDirty ? '1' : '';
});
}
}
var last_comment_text = '';
function show_comment_preview(bug_id) {
var Dom = YAHOO.util.Dom;
var comment = document.getElementById('comment');
var preview = document.getElementById('comment_preview');
if (!comment || !preview) return;
if (Dom.hasClass('comment_preview_tab', 'active_comment_tab')) return;
preview.style.width = (comment.clientWidth - 4) + 'px';
preview.style.height = comment.offsetHeight + 'px';
var comment_tab = document.getElementById('comment_tab');
Dom.addClass(comment, 'bz_default_hidden');
Dom.removeClass(comment_tab, 'active_comment_tab');
comment_tab.setAttribute('aria-selected', 'false');
var preview_tab = document.getElementById('comment_preview_tab');
Dom.removeClass(preview, 'bz_default_hidden');
Dom.addClass(preview_tab, 'active_comment_tab');
preview_tab.setAttribute('aria-selected', 'true');
Dom.addClass('comment_preview_error', 'bz_default_hidden');
if (last_comment_text == comment.value)
return;
Dom.addClass('comment_preview_text', 'bz_default_hidden');
Dom.removeClass('comment_preview_loading', 'bz_default_hidden');
YAHOO.util.Connect.setDefaultPostHeader('application/json', true);
YAHOO.util.Connect.asyncRequest('POST', 'jsonrpc.cgi',
{
success: function(res) {
data = YAHOO.lang.JSON.parse(res.responseText);
if (data.error) {
Dom.addClass('comment_preview_loading', 'bz_default_hidden');
Dom.removeClass('comment_preview_error', 'bz_default_hidden');
Dom.get('comment_preview_error').innerHTML =
YAHOO.lang.escapeHTML(data.error.message);
} else {
document.getElementById('comment_preview_text').innerHTML = data.result.html;
Dom.addClass('comment_preview_loading', 'bz_default_hidden');
Dom.removeClass('comment_preview_text', 'bz_default_hidden');
last_comment_text = comment.value;
}
},
failure: function(res) {
Dom.addClass('comment_preview_loading', 'bz_default_hidden');
Dom.removeClass('comment_preview_error', 'bz_default_hidden');
Dom.get('comment_preview_error').innerHTML =
YAHOO.lang.escapeHTML(res.responseText);
}
},
YAHOO.lang.JSON.stringify({
version: "1.1",
method: 'Bug.render_comment',
params: {
Bugzilla_api_token: BUGZILLA.api_token,
id: bug_id,
text: comment.value
}
})
);
}
function show_comment_edit() {
var comment = document.getElementById('comment');
var preview = document.getElementById('comment_preview');
if (!comment || !preview) return;
if (YAHOO.util.Dom.hasClass(comment, 'active_comment_tab')) return;
var preview_tab = document.getElementById('comment_preview_tab');
YAHOO.util.Dom.addClass(preview, 'bz_default_hidden');
YAHOO.util.Dom.removeClass(preview_tab, 'active_comment_tab');
preview_tab.setAttribute('aria-selected', 'false');
var comment_tab = document.getElementById('comment_tab');
YAHOO.util.Dom.removeClass(comment, 'bz_default_hidden');
YAHOO.util.Dom.addClass(comment_tab, 'active_comment_tab');
comment_tab.setAttribute('aria-selected', 'true');
}
function adjustRemainingTime() {
var new_time = Math.max(bz_remaining_time - document.changeform.work_time.value, 0.0);
document.changeform.remaining_time.value = Math.round(new_time * 100)/100;
}
function updateRemainingTime() {
bz_remaining_time = document.changeform.remaining_time.value;
}
