var MODAL = new function() {
	var _this = this;

	_this.SLIM = 'slim';
	_this.SUCCESS = 'success';
	_this.ERROR = 'error';

	var wrapper = $('.modal-wrapper'),
		modal = $('.content', wrapper);

	_this.show = function(content, style, callback) {
		if (!content) {
			return;
		}

		if (wrapper.is(':visible')) {
			_this.hide(function() {
				_this.show(content, style);
			});
		} else {
			modal.html(content);

			if (style) {
				wrapper.addClass(typeof style === 'string' ? style : style.join(' '));
			}

			if (typeof callback === 'function') {
				callback(modal);
			}

			wrapper.stop(true, true).fadeIn(function() {
				$(document).on('click keyup', function(e) {
					if (e.type === 'click' && ($(e.target).hasClass('modal') || $(e.target).hasClass('close')) || e.type === 'keyup' && e.which === 27) {
						_this.hide();
					}
				});
			});
		}
	};

	_this.hide = function(callback) {
		wrapper.stop(true, true).fadeOut(function() {
			wrapper.removeClass().addClass('modal-wrapper');

			modal.html('');

			$(document).off('click keyup');

			if (typeof callback === 'function') {
				callback();
			}
		});
	};
};

var AJAX = new function() {
	var ajax = function(url, method, data) {
		return $.ajax(url, {
			method: method,
			data: data
		});
	};

	this.get = function(url) {
		return ajax(url, 'GET');
	};

	this.post = function(url, data) {
		return ajax(url, 'POST', data);
	};

	this.put = function(url, data) {
		return ajax(url, 'PUT', data);
	};

	this.delete = function(url, data) {
		return ajax(url, 'DELETE', data);
	};
};
