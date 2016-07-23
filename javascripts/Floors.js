
	
	function Floor(targetElement,control,fcount)
	{
		this.entity = targetElement; //楼对象
		this.control = control;  //开关(导航按钮)
		this.floorCount = fcount;  // 楼层数
		this.allWheel = true;
		this.curActive = 0;
		
	}
	Floor.prototype = {
		constructor:Floor,
		nextFloor:function(){},
		prevFloor:function(){},
		controlBtns:function(){
			return this.control.getElementsByTagName("li");
		},
		nextBtn:function(){
			if(this.controlBtns().length > 0){
				return this.controlBtns()[0];
			}
		},
		prevBtn:function(){
			if(this.controlBtns().length > 0){
				return this.controlBtns()[this.controlBtns().length - 1];
			}
		},
		navBtns:function(){
			var btns = [];
			if(this.controlBtns().length > 0){
				for(var i = 1; i < this.controlBtns().length - 1; i++){
					btns.push(this.controlBtns()[i]);
				}
			}
			return btns;
		},
		refreshControl:function(){
		    var btns = this.navBtns();
			for(var i = 0; i < btns.length; i++){
				if(jey.hasClass( btns[i], "active" )){
					jey.removeClass( btns[i], "active" );
				}
			}
			jey.addClass( btns[this.curActive], "active");
			
		},
		positionFloor:function(){
			if( this.curActive < 0 ){
				this.curActive = 0;
				return;
			}else if(this.curActive >= this.floorCount){
				this.curActive = this.floorCount - 1;
				return;
			}
			this.entity.className = "active-f" + (this.curActive + 1);
			this.allWheel = false;
			var this_ = this;
			setTimeout(function(){
				this_.allWheel =  true;
			},1000);
			
			this.refreshControl();
			
		},
		mouseWheel:function(e){
			if(this.allWheel == true){
				var delta = jey.getWheelDelta(e);
				parseInt(delta) > 0 ? this.curActive ++ : this.curActive --;
				this.positionFloor();
			}
		},
		renderer:function(){
			 var navBtns = this.navBtns();
			 var this_ = this;
			 for(var j = 0; j < navBtns.length; j++){
				 jey.addEvent(navBtns[j],"click",function(){
					
					 if( !jey.hasClass(this, "active") ){
						 this_.curActive = navBtns.indexOf(this);
						 this_.positionFloor();
					 }
				 })
			 };
			 
			 jey.addEvent( this.nextBtn(), "click", function(){
				 this_.curActive --;
				  this_.positionFloor();
			 });
			 
			  jey.addEvent( this.prevBtn(), "click", function(){
				  this_.curActive ++;
				  this_.positionFloor();
			 }) 
		}
	}
	
	
	
