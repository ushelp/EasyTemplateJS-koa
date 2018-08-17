const Koa = require('koa');
const path = require('path');

// EasyTemplateJS-koa
//const view = require('easytemplatejs-koa');
const view = require('../dist/easy.templatejs.koa.min');

const app = new Koa();

// EasyTemplateJS-koa view render middleware
view(app, {
	  cache: true,  // Whether to open the cache; default is true
//  cache: process.env.NODE_ENV == 'production',
    enableScript:true, // enable <etj-script>; default is true
	  enableStyle:true, // enable <etj-style>; default is true
	  views: path.join(__dirname, './views'), // template file directory
    ext: 'etj' // template file suffix
});

app.use(async ctx => {
   await ctx.render('user', {
    name: 'Jay',
		list:[
 			{name:"Jay", sex:'M'},
 			{name:"Rose", sex:'F'},
 			{name:"Anna ", sex:'F'}
 		]
  });
});

app.listen(3000);