// 'use strict';

const MODAL = new function() {
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

			wrapper.stop(true, true).fadeIn('fast', function() {
				$(document).on('click keyup', function(e) {
					if (e.type === 'click' && ($(e.target).hasClass('modal') || $(e.target).hasClass('close')) || e.type === 'keyup' && e.which === 27) {
						_this.hide();
					}
				});
			});
		}
	};

	_this.hide = function(callback) {
		wrapper.stop(true, true).fadeOut('fast', function() {
			wrapper.removeClass().addClass('modal-wrapper');

			modal.html('');

			$(document).off('click keyup');

			if (typeof callback === 'function') {
				callback();
			}
		});
	};
};

const AJAX = new function() {
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

	this.form = function(form, callback, callbackError) {
		$(form).on('submit', function(e) {
			e.preventDefault();

			var form = $(this);

			ajax(form.attr('action'), form.attr('method'), form.serialize()).then(callback, callbackError);
		});
	};
};

$(document).ready(function() {
	$('.user-new').on('click', function(e) {
		e.preventDefault();

		AJAX.get(this.href).done(function(data) {
			MODAL.show(data, MODAL.SLIM, function(content) {
				var form = content.find('.ajax-form');

				var timeout;

				AJAX.form(form, function(data) {
					content.find('p.success').text('User added');

					clearTimeout(timeout);

					timeout = setTimeout(function() {
						content.find('p.success').text('');

						window.location.reload();
					}, 3000);
				}, function(xhr) {
					if (xhr.responseJSON) {
						content.find('p.error').text(xhr.responseJSON.error);

						clearTimeout(timeout);

						timeout = setTimeout(function() {
							content.find('p.error').text('');
						}, 3000);
					}
				});
			});
		});
	});

	$('.user-edit').on('click', function(e) {
		e.preventDefault();

		AJAX.get(this.href).done(function(data) {
			MODAL.show(data, MODAL.SLIM, function(content) {
				var form = content.find('.ajax-form');

				var timeout;

				AJAX.form(form, function(data) {
					content.find('p.success').text('User updated');

					clearTimeout(timeout);

					timeout = setTimeout(function() {
						content.find('p.success').text('');

						window.location.reload();
					}, 3000);
				}, function(xhr) {
					if (xhr.responseJSON) {
						content.find('p.error').text(xhr.responseJSON.error);

						clearTimeout(timeout);

						timeout = setTimeout(function() {
							content.find('p.error').text('');
						}, 3000);
					}
				});
			});
		});
	});

	$('.user-remove').on('click', function(e) {
		e.preventDefault();

		var ask = confirm('Are you sure?');

		if (ask) {
			var row = $(this).closest('tr');

			AJAX.delete(this.href).then(function() {
				row.fadeOut(function() {
					row.remove();
				});
			}, function(xhr) {
				if (xhr.responseJSON) {
					MODAL.show('<p>' + xhr.responseJSON.error, [MODAL.SLIM, MODAL.ERROR]);
				}
			});
		}
	});
});
