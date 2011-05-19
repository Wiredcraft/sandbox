/**
 * 
 */
$(function($){
  var baseContainer = $('div.taxonomy div.taxonomy-name ul.terms li.items');
	// Load terms.
  $('.sub-items', baseContainer).toggle(loadSubterms , cleanSubterms);
  
  // Edit vocabulary
  $('div.vocabulary-name', baseContainer).dblclick(function () {
	  var This = $(this);
	  var originObj = $(this).clone();
	  var loadedForm = new AjaxForm({
		  url:'/load/part', 
		  formID:'addVocabulary', 
		  options:{name:originObj.text(), vid:originObj.attr('ref')}});
	  
	  /** Add listener on the form **/
	  // Add loaded event listener
	  loadedForm.on('loaded', function (data) {
		  This.html(data.form);
	  });
	  // Add success event listener
	  loadedForm.on('success', function (data) {
		  This.append(data.response.data);
		  window.setTimeout(function () {
			  This.html(originObj);
		  }, 1.5 * 1000);
	  });
  });
});


/**
 * Load sub items
 */
function loadSubterms () {
	  var This = $(this).parent();
	  var tid = $(this).siblings('div.vocabulary-name').attr('ref');
	  if ($('.sub-items-appended' + tid, This).length > 0) {
		  return;
	  }
	  $.ajax({
		  success:function (response, status) {
			  if ('string' == typeof response) {
				  response = $.parseJSON(response);
			  }
			  var terms = $(response.data);
			  // Add submit ajax hander for form
			  var termAddForm = new AjaxForm($('form', terms));
			  terms.AddForm.on('success', function (data) {
				  
			  });
			  $('li', terms).dblclick(function () {
				  var This = $(this);
				  var tmpThis = This.clone();
				  var tid = This.attr('ref');
				  var form = new AjaxForm({
					  url:'/load/part',
					  formID:'addterm',
					  options:{tvalue:This.text(), tid:tid}
				  });
				  form.on('loaded', function (data) {
					 This.html(data.form);
				  });
				  
				  // Add success event listener
				  form.on('success', function (data) {
					  This.append(data.response.data);
					  window.setTimeout(function () {
						  This.html(tmpThis);
					  }, 1.5 * 1000);
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
};

/**
 * 
 */
function cleanSubterms () {
	var This = $(this).parent();
    var tid = $(this).siblings('div.vocabulary-name').attr('ref');
    $('.sub-items-appended' + tid).remove();
}
