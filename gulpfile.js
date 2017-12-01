var gulp = require('gulp');
var webserver = require('gulp-webserver');
var mock = require('mockjs');
var fs = require('fs');
var path = require('path');
gulp.task("webserver", function () {
    gulp.src('./')
        .pipe(webserver({
            host:'localhost',
            port:'8105',
            fallback:'index.html',
            open:true,
            livereload:true,
            middleware:function (req, res) {
                if (req.url === '/user') {
                    var data = {
                        "name": 'ncl',
                        "sex":"女",
                        "age":18
                    }
                    res.writeHead(200, {
                        "Content-type": "text/json;charset=utf8",
                        "Access-Control-Allow-Origin": "*"
                    });
                    res.end(JSON.stringify(data));
                } else if (req.url === '/news') {
                    var data = mock.mock({
                        "id": "@name",
                        "email": "@email",
                        "content": "@csentence"
                    })
                    res.writeHead(200, {
                        "Content-type": "text/json;charset=utf8",
                        "Access-Control-Allow-Origin": "*"
                    });
                    res.end(JSON.stringify(data));
                } else {
                    var filename = req.url.split("/")[1];
                    var dataFile = path.join(__dirname,"data",filename+".json"); 
                    fs.exists(dataFile,function(exist){
                        if(exist){
                            fs.readFile(dataFile,function(err,data){
                                if(err){
                                    throw err;
                                }
                                res.end(data.toString())
                            }) 
                        }else{
                            var data = new Error("can't find file" + filename)
                            res.end(JSON.stringify(data));
                        }
                    })
                }
            }
        }));
})
gulp.task('default', function () {
    gulp.start('webserver')
})