'use strict';
define(function() {
	// Add languages here
	var userLang, listOfSupportedLanguages = ['en', 'es'];

	// to avoid being called in non browser environments
	if (typeof navigator === 'object') {
		userLang = navigator.language || navigator.userLanguage;
		userLang = userLang.split('-')[0];
	}

	// Set English as default language
	if (userLang === undefined || listOfSupportedLanguages.indexOf(userLang) < 0) {
		userLang = 'es';
	}
	return {
		load: function (name, require, load) {
			require(['i18n/translations.' + userLang], function (value) {
				load(value);
				return value;
			});
		}
	};
});
