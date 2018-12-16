window.onload = function(){


// 默认是按“列”保存
var vColMatrix = [

	[0,0,0,0],	// (0,0,0,0)T 列1
	[0,0,0,0],	// (0,0,0,0)T 列2
	[0,0,0,0],	// (0,0,0,0)T 列3
	[0,0,0,0]	// (0,0,0,0)T 列4

];

var cols = $('.col').all;
var newGame = new T2048(vColMatrix,cols);

console.log( newGame.pos );



};