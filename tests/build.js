var broadway = require('broadway'),
	LessPlugin = require('../index'),
	app = new broadway.App(),
	path = require('path'),
	tap = require('tap'),
	test = tap.test;

app.use(new LessPlugin(), { app: app, compress: true, paths: [path.normalize(__dirname + '/css')] });

test("Test LESS build", function(t) {
	var pl = app.less.pipeline(),
		file = path.normalize(__dirname + '/css/style.less');

	// console.log(file);

	pl.on('error', function(err, results) {
		if (err) {
			console.log(err);
		}
		t.notOk(err, "Should not return error");
	})

	.on('end', function(err, results) {
		var css = results[results.length - 1];
    	
    	t.ok(css.length > 0, "CSS should be greater than zero");
    	t.ok(/body{/.test(css), "Body class should exist and be compressed");
    	t.ok(/background:-moz-linear-gradient/.test(css), "LESS Elements gradient code exists.");

    	console.log(css);
    	
    	t.end();
	})	

	.execute({
		file: file
	});
});