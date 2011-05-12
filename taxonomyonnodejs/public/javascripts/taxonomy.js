/**
 * 
 */
$(function($){
  $('div.taxonomy div.taxonomy-name ul.terms li.items').click(function () {
	  var This = $('p', this);
	  var tid = $('span', this).text();
	  // 
	  if ($(this).hasClass('preprocess-load')) {
		  $(this).remove('#appended' + tid);
		  $(this).removeClass('preprocess-load');
		  return;
	  }
	  $(this).addClass('preprocess-load');
	  
	  $.ajax({
		  success:function (response, status) {
			  if ('string' == typeof response) {
				  response = $.parseJSON(response);
			  }
			  var appended = $("<div id='appended"+tid+"'></div>");
			  appended.append(response.data);
			  This.after(appended);
		  },
		  complete: function (response, status) {
			  
		  },
		  dataType:'json',
		  type:'GET',
		  url:'/terms/' + tid
	  });
  });
})(jQuery);