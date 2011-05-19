/**
 * @description Ajax Form object. Depend on the jQuery and jquery.form.js
 * @param
 */
function AjaxForm(settings) {
	this.settings = settings;
	this.action = {};
	if (settings.hasOwnProperty('url'))
	  this.__load(settings.url, settings.formID);
	else {
	  this.click(form);
	}
};

AjaxForm.prototype.__load = function () {
	var This = this;
	$.ajax({
		dataType:'JSON',
		type:'GET',
		url:This.settings.url,
		data:{tpl: This.settings.formID, options:This.settings.options},
		success: function (response, status) {
			// Handle loaded form
			var form = $(response.data);
			This.click(form);
			// Fire event listener
			This.emmit('loaded', {form: form, response:response, status:status});
		},
		complete: function (response, status) {
			This.emmit('complete', {response:response, status:status});
		}
	});
};

AjaxForm.prototype.click = function (form) {
	$(':submit', form).click(function (e) {
		e.preventDefault();
		var options = {success: function (response, status) {
			This.emmit('success', {form:form, response:response, status:status});
		}};
		This.emmit('pre-submit', {form:form});
		if(form.ajaxSubmit(options)) {
		  This.emmit('updated', {});	
		}
		else {
		  This.emmit('failed-update', {});	
		}
	});
}


AjaxForm.prototype.on = function (action, callback) {
	if (!this.action.hasOwnProperty(action)) {
		this.action[action] = new Array(callback);
	}
	else {
		this.action[action].push(callback);
	}
};

AjaxForm.prototype.emmit = function (action, data) {
	if (this.action.hasOwnProperty(action)) {
		while (this.action[action].length) {
			var callback = this.action[action].shift();
			callback(data);
		}
	}
};

