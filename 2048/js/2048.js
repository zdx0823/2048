window.onload = function(){

/**
 * 生成sum组每组num个，数值在min~max之间的随机数，组内数值允许重复，参数全部可选，
 * 如果超过5s未响应抛出错误，sum值或num值超过100000抛出错误
 * 
 * @param  {[数值可选]} num [生成几组随机数]
 * @param  {[数值可选]} min [最小值]
 * @param  {[数值可选]} max [最大值]
 * @return {[数组]}     [返回一个二维数组]
 */
function gRandArr(sum,num,min,max){

	// 设定默认值
	var sum = sum || 1,
		num = num || 1,
		min = min || 0,
		max = max || 0;


	// 限定最大值，如果sum或num超过十万则抛出错误
	var err = 'sum值或num值过大或过小';
	if( sum > 100000 || num > 100000 ){
		throw err;
	}


	// 为数组添加第一组随机数
	var newOne = [];
	var arr = [];
	for(var i=0; i<num; i++){
		newOne.push(rand(min,max));
	}
	arr.push(newOne);

	// 按需生成若干组随机数
	for(var j=1; j<sum; j++){

		// 记录开始执行的时间
		var st = Date.now();
		while( newOne = [] ){

			// 生成一组新的随机数
			for(var k=0; k<num; k++){
				newOne.push(rand(min,max));
			}

			// every判断，如果新生成的一组与原有的不重复则返回true否则返回false
			var res = arr.every(function(item,i){

				// 新生成的一组与原有数组其中一组的每一项两两匹配，相同返回true，不同返回false
				var res = [];
				for(var j=0,jLen=item.length; j<jLen; j++){

					if( item[j] == newOne[j] ){
						res.push(true);
					}else{
						res.push(false);
					}
				}

				// 对res逐一判断，全部为true返回true。对结果取反
				return !res.every(function(item){
					return item;
				});

			});


			// true表示新生成的一组随机数符合要求，将其添加进arr数组，并跳出while循环
			if(res){
				arr.push(newOne);
				break;
			}

			// 如果超过3s未给出结果抛出错误
			var ed = Date.now();
			if( ed-st > 3000 ){
				throw err;
				break;
			}

		}

	}


	// 返回结果数组
	return arr;

}








// 默认是按“列”保存
var vColMatrix = [

	[2,2,0,2],	// (0,0,0,0)T 列1
	[4,0,4,4],	// (0,0,0,0)T 列2
	[2,4,2,2],	// (0,0,0,0)T 列3
	[0,0,0,2]	// (0,0,0,0)T 列4

];






merge(vColMatrix,'top');
console.log(vColMatrix);

/**
 * 用于合并一行或一列中最近两个数字(为2048提供，无其他功能)
 * @param  {[二维数组]} matrix [合并后的二维数组]
 * @return {[无]}        [无]
 */
function merge(matrix,to){

	if(!to){
		return false;
	}

	if( to == 'left' || to == 'right' ){
		matrix = TMatrix(matrix);
	}

	var iLen = matrix.length;
	var status = [];

	matrix.forEach(function(item){

		var jLen = item.length;
		var posArr = [];

		if( to == 'left' || to == 'top' ){

			// 主要算法
			var cnt = 0;
			for(var j=0; j<jLen; j++){

				// j就是新的位置(后面now通过与cnt相加得到原始位置，如果cnt为0，新位置与原始位置相等，表示位置不变)
				var now = j;

				// 剔除0，且cnt加1，“同步”后面几位的原始下标
				// length-1
				while( item[j] == 0 ){

					item.splice(j,1);
					jLen--;
					cnt++;

				}
				// 原始位置 = 新位置+剔除的元素个数
				var ori = now + cnt;

				// 向前比对(因为前面的都是已经剔除0的部分可放心比对，向后比对可能出现0的情况)
				// 比对成功前一个元素值乘以2，
				// 剔除当前元素,cnt加1，
				// 数组长度减1，
				// j-1(因为不减的话下一次for循环会漏掉一个)
				// 当前位置-1(因为动画效果是与最边边那位数重合),
				if( item[j-1] && item[j-1] == item[j] ){

					item[j-1] *= 2;
					item.splice(j,1);
					cnt++;

					jLen--;
					j--;

					now--;

				}


				// 将原始位置与最终位置记录在一个对象里，对象再包含进一个数组
				var obj = {
					ori:ori,
					now:now
				}
				posArr.push(obj);

			}

			// 用0补齐空位，以免后面矩阵转置的时候出错
			for(var k=item.length; k<4; k++){
				item.push(0);
			}

			// 将当前行的变换记录到一个大数组里
			status.push(posArr);

		}

	});


	console.log(status);

}









var cols = $('.col').all;




// 初始化
// 生成2个块
electBar();

// 保存每个innerBar的位置
var w = h = getStyle($('.innerBar'),'width').val;
var l = t = 15;
var pos = {};


for(var i=0,iLen=cols.length; i<iLen; i++){

	for(var j=0,jLen=$('.innerBar',cols[i]).all.length; j<jLen; j++){
		// console.log(543);
		var str = 'p'+i+j;
		pos[str] = {
			left: l*(i+1) + w*i,
			top: t*(j+1) + w*j
		}

	}

}





TMatrix(vColMatrix);




/**
 * 转置矩阵函数，用于将矩阵“放平”或“竖起”
 * @param {[二维数组]} matrix [合法矩阵]
 * @return {[二维数组]}     [转置后的矩阵]
 */
function  TMatrix(matrix){

	var tdMatrix = [];
	for(var i=0,iLen=matrix[0].length; i<iLen; i++){
		tdMatrix.push([]);
	}

	for(var i=0,iLen=matrix.length; i<iLen; i++){
		for(var j=0,jLen=matrix[i].length; j<jLen; j++){

			tdMatrix[j][i] = matrix[i][j];

		}
	}

	return tdMatrix;

} 








function fixBaseNum(){

	var baseNum = 0;
	var r = Math.round(Math.random()*10);
	if( r >= 5 ){
		baseNum = 4;
	}else{
		baseNum = 2;
	}

	return baseNum;

}







function recordPos(coord2D,val){

	var c = coord2D[0];
	var r = coord2D[1];

	// vColMatrix[c][r] = val;

}



function electBar(baseNum){

	var rands = gRandArr(2,2,0,3);
	var bars = [];
	var baseNum = baseNum || 2;

	for(var i=0,iLen=rands.length; i<iLen; i++){
		recordPos( rands[i],baseNum );
	}
	

	rands.forEach(function(item){

		var i = item[0];
		var j = item[1];

		bars.push( $('.innerBar',cols[i]).all[j] );

	});

	bars[0].innerHTML = baseNum;
	bars[1].innerHTML = baseNum;

	barsHover(bars[0]);
	barsHover(bars[1]);

}







function barsHover(ele){

	// o:opacity	t:transform ——>  返回matrix(0, 0, 0, 0, 0, 0)
	var o = getStyle(ele,'opacity').val;
	var t = getStyle(ele,'transform').val;

	// 进行处理取出初始缩放值;
	t = parseFloat( t.substring(7,t.length-2).split(',')[0] );



	var timer = setInterval(function(){

		t += 0.1;
		( t >= 1 ) && ( t = 1 );

		o += 35;
		( o >= 100 ) && ( o = 100 );

		if( t == 1 && o == 100 ){
			clearInterval(timer);
		}

		ele.style = 'transform: scale('+ t +'); opacity: '+ o/100 +';';

	},30);



}






// moveBar(1,1);

/**
 * 从0开始计数，第i列第j行
 * @param  {[type]} i [description]
 * @param  {[type]} j [description]
 * @return {[type]}   [description]
 */
/*function moveBar(i,j){

	var bar = $('.innerBar',cols[i]).all[j];

	setInterval(function(){

		bar.style.top = 

	},30);

}

*/







};