/**
 * 
 */
$(function($){
  var baseContainer = $('div.taxonomy div.taxonomy-name ul.terms li.items');
	// Load terms.
  $('.sub', baseContainer).toggle(function () {
	  var This = $(this).parent().parent();
	  var tid = $('input:eq(0)', This).val();
	  if ($('.sub-items-appended' + tid, This).length > 0) {
		  return;
	  }
	  $.ajax({
		  success:function (response, status) {
			  if ('string' == typeof response) {
				  response = $.parseJSON(response);
			  }
			  var terms = $(response.data);
			  $('li', terms).dblclick(function () {
				  var This = $(this);
				  var tmpThis = This.clone();
				  var tid = This.attr('ref');
				  replayField($(this), [{
					  selector:$('li', $(this)),
					  map: {
						  type:'text',
						  name:'name',
						  value:This.text()
					  }
				  }, {selector: null, map:{type:'hidden', name:'tid', value:tid}}], function (action, form, mapping) {
					  if (action == 'save') {
						 $.ajax({
							 success: function (response, status) {
								 if ('string' == typeof response) {
									  response = $.parseJSON(response);
								 }
								 form.append(response.data);
								 window.setTimeout(function (form) {
									 This.html($("input[name='name']", form).val());
								 }, 1000, form);
							 },
							 data:{tid: tid, name:$("input[name='name']", form).val()},
							 dataType:'json',
							 type:'GET',
							 url:'term/' + tid + "/edit"
						 });
					  }
					  else if (action == 'cancel') {
						  This.html(tmpThis);
					  }
				  });
			  });
			 This.append($('<div class="sub-items-appended'+ tid +'"></div>').append(terms));
		  },
		  complete: function (response, status) {
			  
		  },
		  dataType:'json',
		  type:'GET',
		  url:'/terms/' + tid
	  });
  }, function () {
	  var This = $(this).parent().parent();
	  var tid = $('input:eq(0)', This).val();
	  $('.sub-items-appended' + tid).remove();
  });
  
  // Add terms.
  $("a:eq(0)", baseContainer).click(function (e) {
	  e.preventDefault();
	  
	  $.ajax({
		  success:function (response, status) {
			  if ('string' == typeof response) {
				  response = $.parseJSON(response);
			  }
			  var form = $(response.form);
			  $('input:submit', form).click(function (e) {
				  e.preventDefault();
			  });
			  form.dialog({
				  modal:true,
				  buttons:{
					  Cancel: function () {
						  $(this).dialog('close');
					  }
				  },
				  close: function () {
					  
				  }
			  });
		  },
		  complete: function (response, status) {
			  
		  },
		  dataType:'json',
		  type:'GET',
		  url:'/term/' + $('input:eq(0)', $(this).parent()).val() + '/add'
	  });
  });
})(jQuery);

/**
 * 
 * @param mapping
 *   mapping: [{selector: 'selector', map:{type, name, value}}, ...];
 * @param callback
 *   When submit, execute this callback
 */
function replayField(object, mapping, callback) {
	var replayed = $('<div></div>');
	for (var m in mapping) {
		var field = $("<input></input>");
		field.attr('type', mapping[m].map.type);
		field.attr('name', mapping[m].map.name);
		field.attr('value', mapping[m].map.value != undefined ? mapping[m].map.value: $(seletor).text());
		replayed.append(field);
	}
	var save = $('<input></input>').attr({type:'button', value:'Edit'});
	replayed.append(save);
	var cancel = $('<input></input>').attr({type:'button', value:'Cancel'});
	replayed.append(cancel);
	
	save.click(function () {
		callback('save', replayed, mapping);
	});
	
	cancel.click(function () {
		callback('cancel', replayed, mapping);
	});
	
	object.html(replayed);
}