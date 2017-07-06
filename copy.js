/**
 * Created by Cassie.Xu on 17/5/11.
 */
var path = require('path');
var ncp = require('ncp').ncp;

ncp.limit = 16;

var srcPath = 'app/libs'; //current folder
var destPath = 'build/libs'; //Any destination folder

console.log('Copying files...');
ncp(srcPath, destPath, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('Copying files complete.');
});