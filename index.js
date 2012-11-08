var less = require('less'),
	fs = require('fs'),
	Pipeline = require('node-pipeline');

var Less = function() {};

Less.prototype.attach = function(options) {
	
	this.less = {

		pipeline: function() {
			var pl = Pipeline.create("Build less");

			// Step 1: read main file.
	    	pl.use(function(results, next) {
	    		fs.readFile(results[0].file, 'utf-8', next);
	    	})

	    	// 
	    	.use(function(results, next) {
	    		var lcss = results[results.length - 1];
	    		
	    		var parser = new(less.Parser)({
				    paths: options.paths // Specify search paths for @import directives
				});

				parser.parse(lcss, next);
	    	})

	    	.use(function(results, next) {
	    		var tree = results[results.length - 1];
	    		next(null, tree.toCSS({ compress: options.compress })); // Minify CSS output
	    	});

	    	return pl;
		}
	};

};

module.exports = Less;