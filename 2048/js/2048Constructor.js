




function T2048(matrix,cols){

	// 基础配置
	this.cols = cols;
	this.pos = this.posPoint(cols);
	this.matrix = matrix;
	this.status = null;



	this.electBar(cols);



	console.log( this.matrix );
	this.moveBar(this.cols);


}

T2048.prototype = {


	gRandArr:function(sum,num,min,max){

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
	},


	TMatrix:function(matrix){

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

	},


	fixBaseNum:function(){

		var baseNum = 0;
		var r = Math.round(Math.random()*10);
		if( r >= 5 ){
			baseNum = 4;
		}else{
			baseNum = 2;
		}
		return baseNum;
		
	},

	barsHover:function(ele){

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

	},


	upgrade:function(cols,elePosObj){


		var x = elePosObj['o-i'];		
		var y = elePosObj['o-j'];	

		var i = elePosObj['n-i'];
		var j = elePosObj['n-j'];

		var bar = $('.innerBar',cols[x]).all[y];
		var val = this.matrix[i][j];

		bar.innerHTML = val;



	},


	moveBar:function(cols){

		var status = this.status;
		var cols = cols;
		var pos = this.pos;
		var _this = this;

		document.onclick = function(){

			var to = 'top';

			var status = _this.status = _this.merge(to);

			// 遍历出每一列————y
			status.forEach(function(item){

				item.forEach(function(list){


					var oi = list['o-i'];
					var oj = list['o-j'];

					var ni = list['n-i'];
					var nj = list['n-j'];

					var col = cols[oi];
					var bar = $('.innerBar',col).all[oj];

					var oStr = 'p' + oi + oj;
					var ot = _this.pos[oStr].top;
					var ol = _this.pos[oStr].left;

					var nStr = 'p' + ni + nj;
					var nt = _this.pos[nStr].top;
					var nl = _this.pos[nStr].left;

					var isMerge = list.isMerge;


					bar.style.top = ot + 'px'; 
					bar.style.left = ol + 'px';


					bar.timer = setInterval(function(){

						var t = getStyle(bar,'top').val;
						var l = getStyle(bar,'left').val;


						if( to == 'left' || to == 'top' ){

							t += -30;
							l += -30;
							( t <= nt ) && ( t = nt );
							( l <= nl ) && ( l = nl );

						}else if( to == 'right' || to == 'bottom' ){

							t += 30;
							l += 30;
							( t >= nt ) && ( t = nt );
							( l >= nl ) && ( l = nl );

						}


						if( t == nt && l == nl ){

							if( isMerge ){

								_this.upgrade(cols,list);

							}
							clearInterval(bar.timer);

						}


						bar.style.left = l + 'px';
						bar.style.top = t + 'px';
						


					},15);




				});

			});


		}


	},



	electBar:function(cols,baseNum){

		var rands = this.gRandArr(2,2,0,3);
		var bars = [];
		var baseNum = baseNum || 2;

		for(var i=0,iLen=rands.length; i<iLen; i++){
			this.recordPos( this.matrix,rands[i],baseNum );
		}
		

		rands.forEach(function(item){

			var i = item[0];
			var j = item[1];
			bars.push( $('.innerBar',cols[i]).all[j] );


		});

		bars[0].innerHTML = baseNum;
		bars[1].innerHTML = baseNum;

		this.barsHover(bars[0]);
		this.barsHover(bars[1]);

	},



	posPoint:function(cols){

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
		return pos;
	},



	recordPos:function(matrix,coord2D,val){

		var c = coord2D[0];
		var r = coord2D[1];

		matrix[c][r] = val;

	},



	/**
	 * merge方法用于按列或按行合并相同的数，由于初始参数要求传入一个列视角的矩阵，所以默认是按列视角处理的，设定，i代表列，j代表行
	 * 	1.不管是向上合并还是向左合并，在计算的时候都是向左计算，由于默认矩阵是“列”矩阵的行写法，所以，对默认矩阵直接进行合并处理就是
	 * 	  向上合并的动作，如果对矩阵转置后再做同样的处理就是向左合并的动作；
	 *
	 * 		具体到代码实现
	 * 		如果是向左合并,oriJ和nowJ表示的是列,i表示的是行
	 * 		如果是向上合并,oriJ和nowJ表示的是行,i表示的是列
	 *   	为什么? 简单想就是：初始参数的矩阵是用行视角看的列矩阵，即“把列矩阵放倒”,那放倒后的二维数组的每一维
	 *   	就是一列(由于键盘打不出右上角的小T，所以省略)，这是其一。再加上本案例的DOM节点我写成了一列一列的形式
	 *   	(即有4个div，每个div里有4个div元素)，因此，在定位DOM的时候是先定位列数再定位行数。在向上合并的时候
	 *   	需要一列一列进行处理所以直接用初始参数的矩阵，此时i表示一列,j表示一行;在向左合并的时候，需要一行一行处理
	 *   	因此需要将矩阵转置成行矩阵，此时i表示一行,j表示一列。
	 *   	(注：代码处理矩阵的时候只能一行一行处理，所以列矩阵要转换成行视角)
	 * 
	 * @param  {[字符串]} to [说明要合并的方向,top等价与left,bottom等价与right]
	 * @return {[二维数组]}    [返回合并后的数组，即原数组]
	 */
	merge:function(to){
	if(!to){
		return false;
	}


	if( to == 'left' || to == 'right' ){

		this.matrix = this.TMatrix(this.matrix);
		console.log( this.matrix );
	}

	var doReverse = false;
	if( to == 'right' || to == 'bottom' ){
		doReverse = true;
	}


	var iLen = this.matrix.length;
	var status = [];
	this.matrix.forEach(function(item,i){


		var posArr = [];
		var jLen = item.length;
		var isMerge = false;

		// 主要算法
		var cnt = 0;
		var k = jLen-1;

		if( doReverse ){
			item = item.reverse();
		}

		for(var j=0; j<jLen; j++){

			// j就是新的位置(后面now通过与cnt相加得到原始位置，如果cnt为0，新位置与原始位置相等，表示位置不变)
			var nowJ = j;
			if( doReverse ){
				nowJ = k;
			}

			// 剔除0，且cnt加1，“同步”后面几位的原始下标
			// length-1
			while( item[j] == 0 ){

				item.splice(j,1);
				jLen--;
				cnt++;

			}
			// 原始位置 = 新位置+剔除的元素个数
			var oriJ = nowJ + cnt;
			if( doReverse ){
				oriJ = nowJ - cnt;
			}

			// 如果为ori为4表示，数组连续splice掉了4个0，表示本行全为0，如果ori为0，表示该元素已经顶格无需再给出新的定位信息
			if( oriJ == 4 || oriJ == -1 ){
				continue;
			}
			

			// 向前比对(因为前面的都是已经剔除0的部分可放心比对，向后比对可能出现0的情况)
			// 比对成功前一个元素值乘以2，
			// 剔除当前元素,cnt加1，
			// 数组长度减1，
			// j-1(因为不减的话下一次for循环会漏掉一个)
			// 当前位置-1(因为动画效果是与最边边那位数重合),
			if( item[j-1] && item[j-1] == item[j] ){

				isMerge = true;
				item[j-1] *= 2;
				item.splice(j,1);
				
				if( doReverse ){
					cnt--;
					nowJ++;
				}else{
					cnt++;
					nowJ--;
				}

				jLen--;
				j--;
				k--;


			}

			// 将原始位置与最终位置记录在一个对象里，对象再包含进一个数组
			// 
			if( to == 'left' || to == 'right' ){

				var obj = {
					'o-i':oriJ,
					'o-j':i,
					'n-i':nowJ,
					'n-j':i,
					'isMerge':isMerge
				}

			}else if( to == 'top' || to == 'bottom' ){

				var obj = {
					'o-i':i,
					'o-j':oriJ,
					'n-i':i,
					'n-j':nowJ,
					'isMerge':isMerge
				}

			}

			posArr.push(obj);
			k--;
		}

		// 用0补齐空位，以免后面矩阵转置的时候出错
		for(var k=item.length; k<4; k++){
			item.push(0);
		}

		if( doReverse ){
			item = item.reverse();
		}

		// 将当前行的变换记录到一个大数组里
		if( posArr.length ){
			status.push(posArr);
		}

		

	},this);

	// 再转置回去
	if( to == 'left' || to == 'right' ){

		this.matrix = this.TMatrix(this.matrix);
		
	}

	console.log(status);
	return status;


}








}












