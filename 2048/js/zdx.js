/**
 * 取出函数体的函数名
 * @param  {[字符串]} str [字符串形式的函数体]
 * @return {[混合]}     [返回false或返回函数名或提示语]
 */
function getFnName(str){

	if(!str){
		return false;
	}

	var str = str.toString();

	var res = str.split('function');
	res.shift()
	res = res.join('');
	res = res.split('(');
	res = res[0].trim();

	if(res){
		return res;
	}else{
		return '函数体为匿名函数或格式错误';
	}

}






function tmove(){


}
tmove.prototype = {

	scale:function(){

		
		
	}

}







/**
 * 阻止浏览器默认行为
 * @param  {[对象]} e [event对象，由事件函数内部传入]
 * @return {[无]}   [无]
 */
function preventDefalut(e){

	if( e.preventDefault ){
		e.preventDefault();
	}else{
		e.returnValue = false;
	}

}





function $(v,parent){

	if(typeof v === 'function'){
		window.onload = v;
	}else if( typeof v === 'string' ){

		if( parent instanceof Object ){
			parent = parent;
		}else{
			parent = document;
		}
		var returnValue = parent.querySelector(v);
		returnValue.all = parent.querySelectorAll(v);
		return returnValue;

	}

}




/**
 * 获得一个x~y之间的随机数
 * @param  {[数值]} x [最小值]
 * @param  {[数值]} y [最大值]
 * @return {[数值]}   [返回随机数]
 */
function rand(x,y){
	return Math.round(Math.random()*(y-x)+x)
}







/**
 * 键盘控制定位元素上下左右运动(并不完善，快速操作的时候会卡顿)
 * @param  {[元素]} ele  [定位元素]
 * @param  {[数值]} step [步长]
 * @return {[无]}      
 */
function moveByDirKey(ele,step){

	document.onkeydown = function(e){

		var e = e || event;
		var _this = this;

		if( !this.timer ){
			fn();
		}

		function fn(){
			switch(e.keyCode){
				case 37:
					ele.style.left = ele.offsetLeft - step + 'px';
					break;
				case 38:
					ele.style.top = ele.offsetTop - step + 'px';
					break;
				case 39:
					ele.style.left = ele.offsetLeft + step + 'px';
					break;
				case 40:
					ele.style.top = ele.offsetTop + step + 'px';
					break;
			}

			_this.timer = setTimeout(fn,30);

		}

		this.onkeyup = function(){

			clearTimeout(_this.timer);
			_this.timer = null;

		};	

	}

}







/**
 * 判断第二个参数是不是第一个参数的祖先元素
 * @param  {[元素]}  ele      [元素]
 * @param  {[元素]}  ele      [元素]
 * @return {Boolean}          [是返回true否则返回false]
 */
function isParent(ele,otherEle){

	var parent = null;
	while( parent = ele.parentNode ){
		if( parent == otherEle ) return true;
		ele = parent;
	}
	return false;

}








// 窗口尺寸与大小
/*
可视区尺寸
clientWidth/clientHeight(client客户):这两个属性可以任何获取元素的可视宽高

// 文档本身没有宽高，只有文档下的文档元素才有宽高，这个没有兼容问题
document.documentElement.clientWidth	
document.documentElement.clientHeight





滚动距离:Element.scrollTop 属性可以获取或设置一个元素的内容垂直滚动的像素数。
document.body.scrollTop/scrollLeft
document.documentElement.scrollTop/scrollLeft

内容高度
document.body.scrollHeight

文档高度
document.documentElement.offsetHeight
document.body.offsetHeight


// obj.onscroll事件:滚动条拉动时触发
// obj.onresize事件:窗口宽高发生变化的时候触发


 */




window.onload = function(){

	var wrap = document.getElementById('wrap');
	var left = document.getElementById('left');
	var right = document.getElementById('right');
	var de = document.getElementById('de');
	var bar = document.getElementById('bar');


	drag(bar,wrap,true,true,1,function(){
		var res = isBoom(bar,de);
		if( res ){
			bar.style.background = 'yellow';
		}else{
			bar.style.background = '';
		}
	});
	drag(de,wrap,true,true,1,function(){
		return isBoom(bar,de);
	});



}



/**
 * 获得元素滚动宽高，兼容所有浏览器
 * @param  {[元素]} ele [传入普通元素和window，window表示要获取文档的滚动高度]
 * @return {[对象]}     [返回一个对象，有两个属性，top和left]
 */
function scroll(ele){
	if(ele === window){
		return {
			top : document.documentElement.scrollTop || document.body.scrollTop,
			left : document.documentElement.scrollLeft || document.body.scrollLeft

		}
	}else{
		return {
			top : ele.scrollTop,
			left : ele.scrollLeft

		}
	}
}





/**
 * 可视区宽高，不包括任务栏滚动条，兼容所有浏览器
 * @param  {[元素]} ele [可传入普通元素和window，window表示要获取文档的可视区宽高]
 * @return {[对象]}     [返回一个对象，有两个属性,w和h]
 */
function client(ele){
	if(ele === window){
		ele = document.documentElement;
	}
	return {
		w : ele.clientWidth,
		h : ele.clientHeight

	}
}





/**
 * 获得元素被内容撑开的宽高，如果没有被撑开则可视区的高(不包括滚动条和任务栏),兼容所有浏览器
 * @param  {[元素]} ele [可传入普通元素和window，window表示要获取文档被内容撑开的高度]
 * @return {[对象]}     [返回一个对象，有两个属性,w和h]
 */
function innerScroll(ele){

	if(ele === window){
		ele = document.body;
	}
	return {

		w : ele.scrollWidth,
		h : ele.scrollHeight

	}
}








/**
 *焦点：使浏览器能够区分用户输入的对象，当一个元素有焦点的时候，那么它就可以接收用户的输入
 *我们可以通过一些方式给元素设置焦点,不是所有元素都能接收焦点，能够响应用户操作的元素才有焦点
 *	1.点击
 *	2.tab键
 * 	3.通过js设置
 *
 *	onfocus:当元素获取焦点的时候触发
 *	onblur:当元素失去焦点的时候触发
 *
 * 	obj.focus()给指定的元素设置焦点
 * 	obj.blur()取消指定元素的焦点
 * 	obj.select()全选可输入的元素里面的文本内容
 * 
 */





/**
 * 给input的text标签和textarea标签绑定onfocus事件和onblur事件
 * @param  {[标签元素]} ele      [input标签或textarea标签]
 * @param  {[字符串]} tdefault [用于提示]
 * @return {[无]}          [无返回值]
 */
function toggleFocus(ele,tdefault){

	// 判断第二个参数是否有值，没有就赋默认值
	var tdefault = tdefault || '请输入内容';

	// 只允许input的text标签和textarea标签使用
	if( ele.nodeName == 'INPUT' ){
		if( ele.getAttribute('type') != 'text' ){
			return false;
		}
	}else{
		if( ele.nodeName != 'TEXTAREA' ){
			return false;
		}
	}




	ele.style.color = '#999';

	var str = tdefault;
	ele.nodeName == 'INPUT' ? (ele.value=str) : (ele.value=str);

	var oriVal = str;
	var newVal = '';

	ele.onfocus = function(){

		ele.style.color = '';
		if( ele.value == oriVal ){
			this.value = '';
		}

	}

	ele.onblur = function(){

		if( ele.value == oriVal || ele.value == '' ){
			this.value = oriVal;
			ele.style.color = '#999';
		}

	}

}







/**
 * Event事件对象：当一个事件发生的时候，
 * 和当前这个对象发生的事件有关的一些详细的信息都会被临时保存到一个指定的地方——event对象，
 * 供我们需要的时候调用。飞机黑匣子
 *
 * 兼容
 * IE/chrome:event是一个内置的全局对象，初始化赋值是null或undefined
 * ff:事件对象是通过事件函数的第一个参数传入的
 * var ev = ev || event;
 * 
 * 事件对象必须在一个事件调用的函数里面使用才有内容
 * 事件函数：事件调用的函数
 * 如果一个函数是被事件调用的，那么这个函数定义的第一个参数就是事件对象
 * 
 *
 *
 * clientX/Y:当一个事件发生的时候鼠标相对于页面可视区顶部的距离
 * 
 */



/**
 * 事件流
 * 事件冒泡:当一个元素接收到事件后，会把它接收到的所有事件传播给它的父级,一直到顶层window，就像力的传递
 * 阻止冒泡: 
 * 	event.cancelBubble = true; 阻止当前对象的当前事件的冒泡
 *
 *
 *
 * 事件捕获：
 * 非标准IE:obj.attachEvent( 事件名称 , 事件函数 ); 
 * 		1.attachEvent方法无法实现捕获
 * 		2.事件名称有on
 * 		3.事件函数执行的顺序： 标准ie -> 正序		非标准ie -> 倒序
 * 		4.this指向window
 * 标准:obj.addEventListener( 没有on的事件名称 , 事件函数 , 是否捕获默认false[false冒泡,true捕获] );
 *
 *
 * 	事件取消绑定：
 * 	IE：obj.detachEvent(事件名称，事件函数)
 *  标准：obj.removeEventListener(事件名称，事件函数，是否捕获)
 *
 *
 * 键盘事件
 *
 * onkeydown:当键盘按键按下的时候触发，当按下不抬起，会连续触发
 * onkeyup:当键盘按键抬起的时候触发
 *
 * event.keyCode:数字类型 键盘按键的值 键值——不同键对应的是个ASCII码
 * 常用键值：
 * 		a:65  z:90
 * 		Tab:9
 * 		CapsLock:20
 * 		Shift:16
 * 		Ctrl:17
 * 		Alt:18
 * 		Enter:13
 * 		0:48   9:57
 * 		左:37  上:38   右:39    下:40
 * ctrlKey,shiftKey,altKey 这是event对象内置的属性，返回值是布尔值。
 * 当一个事件(事件，任何事件)发生的时候，如果ctrl || shift || alt 是按下的状态，返回true，否则返回false
 *
 *
 *
 *
 * 事件默认行为：当一个事件发生的时候浏览器自己会默认做的事情
 * 阻止，在事件处理函数里使用return false;
 * IE:e.returnValue = false;
 * 标准:e.preventDefault();
 * 
 * 环境菜单：oncontextmenu：当环境菜单显示出来的时候触发
 * 
 * 
 */




/**
 * 给元素绑定事件，为冒泡形式
 * @param  {[元素]}   ele       [给那个元素绑定事件]
 * @param  {[事件名]}   eventName [不带on的事件名]
 * @param  {事件函数} fn        [要绑定的事件函数]
 * @param  {是否阻止冒泡} bubble        [false表示不阻止，true表示阻止]
 * @return {[bool]}             [如果事件名不合法返回false]
 */
function on(ele,eventName,fn,bubble){

	// 判断传进来的事件名称合不合法
	var availEvent = 'click,mousedown,mouseup,mousemove,mouseover,scroll,resize,keydown,keyup';
	var re = new RegExp(eventName);

	if( availEvent.search(re) == -1 ){
		return false;
	}


	// 获得传入函数的函数名,做个备份
	var fnName = getFnName(fn);
	
	if(!ele.callback){
		ele.callback = {};
	}
	if( ele.addEventListener ){

		ele.callback[fnName] = function(e){
			var e = e || event;
			fn.call(ele);
			if( bubble ){
				e.stopPropagation();
			}
		};

		ele.addEventListener(eventName,ele.callback[fnName],false);

	}else{

		ele.callback[fnName] = function(e){
			var e = e || event;
			fn.call(ele);
			if( bubble ){
				e.cancelBubble = true;
			}
		};

		ele.attachEvent('on'+eventName , ele.callback[fnName] );

	}

}






/**
 * 取消元素某个事件绑定的函数,由于IE7不支持trim，所以这个方法在IE7失效
 * @param  {[元素]}   ele       [之前用on绑定过函数的元素]
 * @param  {[事件名]}   eventName [之前用on绑定过的事件名]
 * @param  {Function} fn        [事件函数，必须引用相同]
 * @return {[bool]}             [当事件名不合法的时候返回false]
 */
function off(ele,eventName,fn){

	// 判断传进来的事件名称合不合法
	var availEvent = 'click,mousedown,mouseup,mousemove,mouseover,scroll,resize';
	var re = new RegExp(eventName);

	if( availEvent.search(re) == -1 ){
		return false;
	}

	var fnName = getFnName(fn);

	fn = ele.callback[fnName];
	if( ele.removeEventListener ){

		ele.removeEventListener(eventName,fn,false);

	}else{

		ele.detachEvent('on'+eventName,fn);

	}

	delete ele.callback[fnName];

}









/**
 * 获得计算后的css属性值
 * @param  {[元素]} obj   [元素]
 * @param  {[字符串]} attr  [驼峰式属性名]
 * @param  {[布尔值]} units [是否带单位，true为带单位，false为不带单位，当计算值不是数字类型此参数无效]
 * @return {[混合]}       [返回对应的css值]
 */
function getStyle( obj,attr ){

	var outCome = obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];

	if( parseFloat(outCome) || parseFloat(outCome) == 0 ){
		outCome = parseFloat(outCome);
	}

	return {
		key:attr,
		val:outCome
	};
} 







/**
 * 获取元素距离窗口顶部的距离，无视嵌套;计算元素的宽高，包括外边框，兼容所有浏览器
 * @param  {[元素]} ele [元素]
 * @param  {[元素]} tParent [父级元素,如果有就只计算到这个父级元素为止]
 * @return {[对象]}     [对象包含两个属性，top和left]
 */
function offset(ele,tParent){

	if(ele === window){
		/*IE7不支持document.documentElement.offsetHeight，所以取而代之去获取body的高，
		但body的margin获取不到(offsetHeight只获取到外边框为止),但开发过程中body的margin一般都会去掉*/
		// offsetHeight 和 scrollHeight的区别，前者是包括边框，后者不包括边框计算被撑开的值
		ele = document.body
	}

	var parent = ele,
		top = ele.offsetTop,
		left = ele.offsetLeft,
		w = ele.offsetWidth,
		h = ele.offsetHeight;

	while( (parent = parent.offsetParent) && parent.nodeName != 'BODY' && parent != tParent ){

		top += (parent.offsetTop + getStyle(parent,'borderTopWidth').val);
		left += (parent.offsetLeft + getStyle(parent,'borderLeftWidth').val);

	}


	return {
		w:w,
		h:h,
		top:top,
		left:left
	}

}












/**
 * 碰撞检测——九宫格排除法
 * @param  {[元素]}  obj1 [元素]
 * @param  {[元素]}  obj2 [元素]
 * @return {Boolean}      [碰上了返回true，没碰上返回false]
 */
function isBoom( obj1 , obj2 ){

	// 获取obj1的左边到窗口左边的距离，右边到窗口右边的距离，上边到窗口上边的距离，下边到窗口下边的距离
	var L11 = offset(obj1).left,
		R11 = L11 + obj1.offsetWidth,
		T11 = offset(obj1).top,
		B11 = T11 + obj1.offsetHeight;


	// 获取obj2的左边到窗口左边的距离，右边到窗口右边的距离，上边到窗口上边的距离，下边到窗口下边的距离
	var L22 = offset(obj2).left,
		R22 = L22 + obj2.offsetWidth,
		T22 = offset(obj2).top,
		B22 = T22 + obj2.offsetHeight;


	if( ( L11 < R22 && R11 > L22 ) && ( T11 < B22 && B11 > T22 ) ){
		return true;
	}else{
		return false;
	}

}












/**
 * 拖动元素
 * @param  {[元素]} ele      [要拖动的元素]
 * @param  {[元素的父级]} parent   [必须传入，拖动的位置依据这个父级计算]
 * @param  {[布尔值]} slopOver [是否禁止出界，true表示禁止，false或不传参表示不禁止]
 * @param  {[布尔值]} magnet   [是否模拟磁吸效果，true表示是，false表示不模拟]
 * @param  {[数值]} zIndex   [层级，默认是1]
 * @param  {[函数]} callback   [元素移动时候的回调函数]
 * @return {[布尔值]}          [当没有传第二个参数的时候返回false]
 */
function drag(ele,parent,slopOver,magnet,zIndex,callback){

	// 判断是否有祖先元素，且是否合法
	if(!parent) return false;
	if(!isParent(ele,parent)) throw '第二个参数不是第一个参数的祖先元素';


	// 给对应元素加定位属性
	if( getStyle(ele.parentNode,'position').val == 'static' ){
		parent.style.position = 'relative';
	}
	if( getStyle(ele.parentNode,'position').val == 'static' ){
		ele.parentNode.style.position = 'relative';
	}
	// 给拖动的元素默认绝对定位
	ele.style.position = 'absolute';

	// 层级默认为1
	var zIndex = zIndex || 1;
	ele.style.zIndex = zIndex;



	ele.onmousedown = function(e){
		var e = e || event;
		var disL = e.clientX-offset(ele).left
		var disT = e.clientY-offset(ele).top;
		var scrT = scroll(window).top;
		var scrL = scroll(window).left;

		document.onmousemove = function(e){


			var e = e || event;

			// 如果ele的父级元素不是parent则需要进行位置校准(因为被拖动元素相对于它的父级定位)
			var adjustLeft = 0,
				adjustTop = 0;
			if( ele.parentNode != parent ){

				adjustLeft = offset(ele.parentNode,parent).left + getStyle(ele.parentNode,'borderLeftWidth').val;
				adjustTop = offset(ele.parentNode,parent).top + getStyle(ele.parentNode,'borderTopWidth').val;

			}


			var L = e.clientX - offset(parent).left - disL - adjustLeft;
			var T = e.clientY - offset(parent).top - disT - adjustTop;



			// 是否限制在父级内
			if( slopOver ){

				var i = 0;
				// 是否模拟磁吸效果
				if( magnet ){
					var i = 30;
				}

				// 越界判断
				if( L<0+i-adjustLeft ){
					L=0-adjustLeft;
				}
				if( T<0+i-adjustTop ){
					T=0-adjustTop;
				}

				if( L>client(parent).w-offset(ele).w-i-adjustLeft ){
					L=client(parent).w-offset(ele).w-adjustLeft;
				}
				if( T>client(parent).h-offset(ele).h-i-adjustTop ){
					T=client(parent).h-offset(ele).h-adjustTop;
				}

			}

			ele.style.left = L + 'px';
			ele.style.top = T + 'px';


			// 回调函数执行
			callback && callback();
		}

		document.onmouseup = function(){
			document.onmousemove = document.onmouseup = null;
		};


		// 阻止默认行为
		preventDefalut(e);

	}

}






