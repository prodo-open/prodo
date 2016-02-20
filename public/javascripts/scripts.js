var Modal = new function() {
	var _this = this;

	var wrapper = $('.modal-wrapper'),
		modal = $('.content', wrapper);

	_this.show = function(content) {
		if (wrapper.is(':visible')) {
			_this.hide(function() {
				_this.show(content);
			});
		} else {
			modal.html(content);

			wrapper.stop(true, true).fadeIn(function() {
				$(document).on('click keyup', function(e) {
					if (e.type === 'click' && $(e.target).hasClass('modal') || e.type === 'keyup' && e.which === 27) {
						_this.hide();
					}
				});
			});
		}
	};

	_this.hide = function(callback) {
		wrapper.stop(true, true).fadeOut(function() {
			modal.html('');

			$(document).off('click keyup');

			if (typeof callback === 'function') {
				callback();
			}
		});
	};
};
