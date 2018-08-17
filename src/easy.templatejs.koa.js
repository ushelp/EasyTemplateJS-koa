const path = require('path');
const fs = require('fs')
var Et = require('easytemplatejs');

var defaultSettings = {
	cache: true, // enable cache
	enableScript: true, // enable <etj-script>
	enableStyle: true // enable <etj-style>
}

var cacheTpl = {} // cache data

/**
 * koa view middleware
 * @param {Application} app   koa application instance
 * @param {Object}     settings user settings
 */
exports = module.exports = function(app, settings) {
	if(app.context.render) {
		return;
	}
	settings = Object.assign({}, defaultSettings, settings);

	Et.enableScript = settings.enableScript;
	Et.enableStyle = settings.enableScript;

	app.context.render = function(view, _context) {
		const ctx = this;
		const context = Object.assign({}, ctx.state, _context);
		var filePath = path.join(settings.views, view + '.' + settings.ext);
		
		return new Promise(function(resolve, reject) {
			fs.readFile(filePath, "utf-8", function(err, content) {
				if(err) {
					reject(err)
				} else {
					var compiled;
					// Cache Controller
					if(settings.cache) {
						if(!cacheTpl[filePath]) {
							cacheTpl[filePath] = Et.template(content);
						}
						compiled = cacheTpl[filePath];
					} else {
						compiled = Et.template(content);
					}
					var html = compiled(context);
					ctx.type = 'html';
					ctx.body = html;
					resolve(html)
				}
			})
		});
		
		/*
		var content = fs.readFileSync(filePath, 'utf-8');
		
		var compiled;
		// Cache Controller
		if(settings.cache){
			if(!cacheTpl[filePath]){
				cacheTpl[filePath] = Et.template(content);
			}
			compiled = cacheTpl[filePath];
		}else{
			compiled = Et.template(content);
		}
		var html = compiled(context);
         ctx.type = 'html';
         ctx.body = html;
         */
	}
};

exports.templateEngine = Et;