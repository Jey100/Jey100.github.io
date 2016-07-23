(function(){
	

//全局变量，用于存储每个视图索引，对应的父亲节点理论上的偏移值
var globalMap = {};
window.globalIndex = 0;  //全局的视图索引
var sectionCount = 0;

//初始化地图
var initMap = function(){
	var viewWrap = jey.getById("view-wrap");
	var areas = jey.getByClass(viewWrap,"area");
	sectionCount = areas.length;
	for(var i = 0; i < areas.length; i++){
		console.log(areas[i].attributes["data-view"].value);
		globalMap[areas[i].attributes["data-view"].value] = viewWrap.offsetWidth * -i;
	}
	
	coordinateView(globalMap[globalIndex]);
	console.log(globalMap);
}





//切换到当前视图
var coordinateView = function( targetValue){
	var v = jey.getById("view-wrap");
	if(v){
		jey.speed(v,{left:targetValue},function(){
			v.style.left = globalMap[globalIndex] +"px";
		});
	}	
}


//拖拽视图
var dragView = function(){
    var view = jey.getById("view-wrap");
	if( !view ){
		return;
	}
	document.onmousedown = function(e){
		e = jey.getEvent(e);
		var beginPointX = e.clientX;
		var endPointX = 0;
		var distX = beginPointX - globalMap[globalIndex];
		
		document.onmousemove = function(e){
			e = jey.getEvent(e);
			view.style.left = e.clientX - distX + "px";
		};
		document.onmouseup = function(e){
			e = jey.getEvent(e);
			document.onmouseup = null;
			document.onmousemove = null;	
			endPointX =  e.clientX;	
			//如果拖动的幅度超过总宽度的30%，则表示需要切换视图
			if(Math.abs(endPointX - beginPointX) / view.offsetWidth > 0.3){
				endPointX > beginPointX ? globalIndex -- : globalIndex ++;
				//边界判断，确保索引不溢出
				if(globalIndex < 0){
					globalIndex = 0;
				}
				else if(globalIndex == sectionCount){
					globalIndex = sectionCount -1;
				}	
			}
			coordinateView(globalMap[globalIndex]);		
		}
	}
}


//初始化上下跳转的楼层页面
var initFloorsPage = function(){
	
	//初始化第一个楼层页面(页面索引data-view = 0)
	var floors = jey.getById("V0-floors");
	var navU = jey.getById("V0-nav");
	var house = new Floor(floors, navU ,3);
	house.renderer();
	
	//初始化第二个楼层页面(页面索引data-view = 2)
	var floors2 = jey.getById("t-floors");
	var navU2 = jey.getById("t-nav");
	var house2 = new Floor(floors2, navU2 ,5);
	house2.renderer();

	//控制器(正确的调用当前视图的滚轮事件)
	function mouseWheelControl(e){
		if(window.globalIndex == 0){
			return house.mouseWheel(e);
		}
		else if(window.globalIndex == 2){
			return house2.mouseWheel(e);
		}
	}
	
	//给楼层页面绑定滚轮事件
	if(document.addEventListener){
		 jey.addEvent(document,"mousewheel",function(e){
			 mouseWheelControl(e);
		});
	}else if(document.attachEvent){
		//ff
		jey.addEvent(document,"DOMMouseScroll",function(e){
			mouseWheelControl(e);
		});
	}
}

//当浏览器窗体大小改变是，重新初始化地图
window.onresize = function(){
	initMap();
}
window.onload = function(){
	var view = jey.getById("view");
	var areas = jey.getByClass(view,"area");
	for(var i = 0; i < areas.length; i++){
		areas[i].style.left = i * 100+"%";
	}
	dragView();
	
	initMap();

	initFloorsPage();


}

})();




