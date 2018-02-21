var fiab = fiab || {};

(function($){

	$(document).ready(function () {
		FastClick.attach(document.body);

		//for IE 9 to Edge 12
		svg4everybody({
			polyfill: true
		});
		console.log("scripts2.3");
		fiab.module.init();

	});

})(jQuery);
