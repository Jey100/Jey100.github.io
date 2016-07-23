/**
 * @brief jey是一个全局object，提供一些静态的工具方法
 * 
 */

(function(){
	


var jey = {
    addEvent : function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
	addMouseWheel : function( handler){
		if(document.AddEventListener){
			jey.addEvent(document,"DOMMouseScroll",handler);
		}else if(document.attachEvent){
			jey.addEvent(document,"mousewheel",handler);
		}
	},
    
    getEvent : function(event){
        return event ? event : window.event;
    },
    getArgs : function(){
            var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
                args = {},
                items = qs.length ? qs.split("&") : [],
                item = null,
                name = null,
                value = null,

                i = 0,
                len = items.length;
            
            //assign each item onto the args object
            for (i=0; i < len; i++){
                item = items[i].split("=");
                name = decodeURIComponent(item[0]);
                value = decodeURIComponent(item[1]);
                
                if (name.length){
                    args[name] = value;
                }
            }
            
            return args;
	},
    getTarget : function(event){
        return event.target || event.srcElement;
    },
	getWheelDelta: function(event){
        if (event.wheelDelta){
            //return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
			return event.wheelDelta;
        } else {
            return -event.detail * 40;
        }
    },
	getByClass : function(element,className){
		var eles = [];
		if(arguments.length == 1){
			eles = document.getElementsByTagName("*");
		}else{
			if(element)
				eles = element.getElementsByTagName("*");
		}
		
		var resultArray =[];
		for(var i = 0; i < eles.length;i++)
		{
			var classArr = eles[i].className.split(" ");
			for(var j = 0; j < classArr.length; j++){
				if(classArr[j] == className){
					resultArray.push(eles[i]);
					break;
				}
			}
		}
		return resultArray;
	},
	hasClass : function(element, inClassName){
		var regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)');
        return regExp.test(element.className);
	},
	addClass : function(element, cName){
		if( !jey.hasClass(element, cName) ){
			element.className = [element.className,cName].join(" ");
		}
	},
	removeClass : function(element,cName){
		if(jey.hasClass(element,cName)){
			 var regExp = new RegExp('(?:^|\\s+)' + cName + '(?:\\s+|$)', 'g');
            var curClasses = element.className;
            element.className = curClasses.replace(regExp, ' ');
		}
	},
	getById : function(){
		if(arguments.length == 1){
			return document.getElementById(arguments[0]);
		}
		return element.getElementById(arguments[1]);
	},
	toggleClassName : function(element,cName){
		if(jey.hasClass(element,cName)){
			jey.removeClass(element,cName);
		}else{
			jey.addClass(element,cName);
		}
	},
	style : function(element,attr,value){
		if(typeof value == "string"){
			element.style[attr] = value;
			return;
		}
		if(element.currentStyle){
			return element.currentStyle[attr];
		}	
		else{
			return getComputedStyle(element, false)[attr];
		}
	},
	drag : function(element, targetElement){
		
		var hasTarget = false;
		if(arguments.length == 2){
			hasTarget = true;
		}
		document.onmousedown = function(e){
			e = jey.getEvent(e);
			var distX = 0;
			var distY = 0;
			if( hasTarget ){
				 distX = e.clientX - targetElement.offsetLeft;
			     distY = e.clientY - targetElement.offsetTop;
			}
			else{
				 distX = e.clientX - element.offsetLeft;
			     distY = e.clientY - element.offsetTop;
			}
			document.onmousemove = function(e){
				e = jey.getEvent(e);
				if(hasTarget){
					targetElement.style.left = e.clientX - distX + "px";
					targetElement.style.top = e.clientY - distY + "px"
				}else{
					element.style.left = e.clientX - distX + "px";
					element.style.top = e.clientY - distY + "px"
				}
			};
			document.onmouseup = function(){
				document.onmouseup = null;
				document.onmousemove = null;		
				
			}
			
		}
	},
	/**
	*Resilient movement is more suitable to change the coordinates of the point
	*Change the width and height, need to be very careful, not the best,because it is not very suitable
	*/
	spring : function(element, json, fn){
		clearInterval(element.timer);
		if(!element.speed){
			element.speed = 0;
		}
		if(!element.speed_back){
			element.speed_back = 0;
		}

		var move = true;  //make sure currnent sport is change size or move place;
		var valid = true; //make sure  current loop is valid
		element.timer = setInterval(function(){
			var stop = true;
			for(var attr in json){
				if(attr === "opacity" || valid === false){
					break;
				}
				var targetV = json[attr];
				var currentV = parseInt(jey.style(element, attr));
				if(!element.orginal){
					element.orginal = currentV;
				}	
				
				//if the orginal Value equals the target Value and attr is width or heightbreak;
				if(Math.abs(element.orginal - targetV) < 1){
					//if(attr == "width" || attr == "height"){
						break; 	
					//}
						
				}
				element.speed += (targetV - currentV) / 5; //speed
				element.speed *= 0.7;  //friction force(摩擦力)
				element.speed_back += element.speed;   //make sure less error amount
				
				//if the targetV is nearly reached 
				if(Math.abs(element.speed) < 1 && Math.abs(element.speed_back - targetV) < 1){
					element.style[attr] = targetV +"px"; //set targetV to element;
					valid = false;  //set  current loop valid false;
 
				}
				else{
					if(attr == "width" || attr == "height")
					{
						move = false;  //set move flag false;
						if(element.speed_back < 5){
							element.speed_back= 5
						}
						
						//if targetV bigger,  make sure element currentValue more than the element's orginal;
						if(element.orginal < targetV && element.speed_back < element.orginal){
							element.speed_back = element.orginal + element.orginal;
						}

					}
					element.style[attr] = element.speed_back +"px";
					//console.log("org:"+element.orginal+"target:"+targetV+"---currentV:"+currentV+"--speed"+element.speed+"---speed_back:"+element.speed_back);
					stop = false;
				}
			}
			if(stop){
				clearInterval(element.timer);
				element.style[attr] = targetV +"px";
				//currnent sport is change size ,so delete the value of backup;
				if(!move){
					delete element.speed_back;
					delete element.speed;
					delete element.orginal ;
				}
				if(typeof fn == "function"){
					fn();
				}
			}
		},30);
	},
	speed : function(element, json, fn){
		clearInterval(element.timer);
		element.timer = setInterval(function(){
			var stop = true;
			for(var attr in json)
			{
				var currentV = 0;
				var targetV = json[attr]; // every attributes target value

				if(attr == "opacity"){
					currentV=parseInt(parseFloat(jey.style(element, attr)).toFixed(2)*100);
					if(isNaN( currentV )){
						//make sure the element has Set over opacity on ie7,8
						element.style.opacity = 1; 
						currentV=parseInt(parseFloat(jey.style(element, attr)).toFixed(2)*100);
					}
					if(targetV <= 1 ){
						targetV = parseInt(parseFloat(targetV).toFixed(2)*100);
					}
					else{
						targetV = 100;
					}
				}
				else{
					currentV=parseInt(jey.style(element, attr));
				}
				
				var currentSpeed = (targetV - currentV) / 6;  //current Speed
				currentSpeed = currentSpeed > 0 ? Math.ceil(currentSpeed) : Math.floor(currentSpeed);
				if(currentV != targetV){
					stop = false; //if has a target not arrived, can not stop the timer
				}
				
				if(attr == "opacity"){
					element.style.opacity = parseFloat((currentV + currentSpeed)/100);
					element.style.filter = 'alpha(opacity:' + (currentV+currentSpeed) + ')';
				}
				else{
					element.style[attr] = currentV + currentSpeed + "px";
					
				}
			}
			if(stop){
				clearInterval(element.timer);
				
				console.log("ok");
				if(typeof fn == "function"){
					fn();
				}
			}	
		},30);
	}
};
window.jey = jey;
})();

(function(){
	/*
	* @ 拓展数组对象的indexOf方法
	*/
	if(!Array.prototype.indexOf){
		Array.prototype.indexOf =  function(v){
			for(var i = 0; i<this.length ;i++){
				if(this[i] == v){
					return i;
				}
			}
			return -1;
		}
		
	}


})();



