/**
 *
 * Base naming rule:
 * The stuff start with "_" means private , end with "_" means protect ,
 * others mean public.
 *
 * All the member field should be private.
 *
 * Life cycle: (It's very important to know when we bind the event)
 * A widget will do this by order :
 * 1. $init
 * 2. set attributes (setters)
 * 3. rendering mold (@see mold/bob.js )
 * 4. call bind_ to bind the event to dom .
 *
 * this.deskop will be assigned after super bind_ is called,
 * so we use it to determine whether we need to update view
 * manually in setter or not.
 * If this.desktop exist , means it's after mold rendering.
 *
 */
(function () {

var stepMovement;

function _doAnimation(wgt, flag) {
    if (stepMovement) return;
    var steps = 20;
    var dist = wgt.getImageWidth() * flag / steps;   
    stepMovement = setInterval(function() {
        if (steps--) {
        	wgt.$n('wrapper').scrollLeft -= dist;
        } else {
            clearInterval(stepMovement);
            stepMovement = null;
        }
    }, 10);
}




bob.Imageslider = zk.$extends(zul.Widget, {
	_text:'', //default value for text attribute
	_viewportSize : 3,
	_imageWidth : 200,
	
	
	/**
	 * Don't use array/object as a member field, it's a restriction for ZK object,
	 * it will work like a static , share with all the same Widget class instance.
	 *
	 * if you really need this , assign it in bind_ method to prevent any trouble.
	 *
	 * TODO:check array or object , must be one of them ...I forgot. -_- by Tony
	 */
	
	$define: {
		/**
		 * The member in $define means that it has its own setter/getter.
		 * (It's a coding sugar.)
		 *
		 * If you don't get this ,
		 * you could see the comment below for another way to do this.
		 *
		 * It's more clear.
		 *
		 */
		text: function() { //this function will be called after setText() .
		
			if(this.desktop) {
				//updated UI here.
			}
		},
		selectedItem: function(item) { 
			
			if(this.desktop) {
				console.log("selectedItem" + item);
			}
		},
		selectedIndex: function(index) { 
			console.log("selectedIndex:------------------------- " + index);
			if(this.desktop) {
				console.log("selectedIndex: " + index);
				var i = 0;
				for (var w = this.firstChild; w; w = w.nextSibling) {
					w.$n().parentNode.className = this.$s('img');
					if(i == index){
						w.$n().parentNode.className += ' ' + this.$s('selectImg');
					}
					i++;
				}

			}
		},
		viewportSize: function(size) {		
			if(this.desktop) {
				console.log(this.nChildren);
				if(this.nChildren > size){
					this.$n('prevBtn').style.display = 'inline-block';
					this.$n('nextBtn').style.display = 'inline-block';
				}else{
					this.$n('prevBtn').style.display = 'none';
					this.$n('nextBtn').style.display = 'none';
				}				
				this.$n('wrapper').style.width = this._imageWidth * size + 'px';
			}
		},
		imageWidth: function (width) {			
			if(this.desktop) {
				console.log("imageWidth: " + width);
				this.$n('wrapper').style.width = width * this._viewportSize + 'px';
				this.$n('imgList').style.width = width * this.nChildren + 'px';
				for (var w = this.firstChild; w; w = w.nextSibling) {
					var child = w.$n();
					child.parentNode.style.width = width + 'px';
				}
			}
		}
	},
	/**
	 * If you don't like the way in $define ,
	 * you could do the setter/getter by yourself here.
	 *
	 * Like the example below, they are the same as we mentioned in $define section.
	 */
	/*
	getText:function(){ return this._text; },
	setText:function(val){
		this._text = val;
		if(this.desktop){
		//update the UI here.
		}
	},
	*/
	bind_: function () {
		/**
		 * For widget lifecycle , the super bind_ should be called
		 * as FIRST STATEMENT in the function.
		 * DONT'T forget to call supers in bind_ , or you will get error.
		 */
		this.$supers(bob.Imageslider,'bind_', arguments);
	
		//A example for domListen_ , REMEMBER to do domUnlisten in unbind_.
		//this.domListen_(this.$n("cave"), "onClick", "_doItemsClick");
	},
	/*
		A example for domListen_ listener.
	*/
	/*
	_doItemsClick: function (evt) {
		alert("item click event fired");
	},
	*/
	unbind_: function () {
	
		// A example for domUnlisten_ , should be paired with bind_
		// this.domUnlisten_(this.$n("cave"), "onClick", "_doItemsClick");
		
		/*
		* For widget lifecycle , the super unbind_ should be called
		* as LAST STATEMENT in the function.
		*/
		this.$supers(bob.Imageslider,'unbind_', arguments);
	},
	/*
		widget event, more detail 
		please refer to http://books.zkoss.org/wiki/ZK%20Client-side%20Reference/Notifications
	 */
	doClick_: function (evt) {
		if(evt.domTarget == this.$n('prevBtn')){
			_doAnimation(this, -1);
		}else if(evt.domTarget == this.$n('nextBtn')){
			_doAnimation(this, 1);
		}else if(evt.domTarget.parentNode.className == this.$s('img')){
			var currentNode = evt.domTarget.parentNode;			
			var selectedIndex = 0;
			while( (currentNode = currentNode.previousSibling) != null ) {
				selectedIndex++;
			}				
			//console.log('index: ' +  selectedIndex);
			this.fire('onSelect', {index: selectedIndex}, {toServer:true});			
		}
		
		this.$super('doClick_', evt, true);

		
		// add to first
		//var img = new zul.wgt.Image();
		//img.setSrc('images/ironman-03.jpg');
		//this.insertChildHTML_(img, this.firstChild);
		
		// add to last
//		var img = new zul.wgt.Image();
//		img.setSrc('images/ironman-03.jpg');
//		this.insertChildHTML_(img);
		
//		debugger;

	},
	encloseChildHTML_: function(w, out){
		var oo = new zk.Buffer();
		
		oo.push('<div id="' + w.uuid + '-chdex" class="', this.$s('img'), '">');
		w.redraw(oo);
		oo.push('</div>');
		
		if (!out) return oo.join('');

		out.push(oo.join(''));
	},
	_chdextr: function (child) {
		return child.$n('chdex') || child.$n();
	},
	insertChildHTML_: function (child, before, desktop) {
//		debugger;
		if (before)
			jq(this._chdextr(before)).before(this.encloseChildHTML_(child));
		else {
			var jqn = jq(this.$n('imgList'));
			jqn.append(this.encloseChildHTML_(child));	
			
		}
		child.bind(desktop);
		console.log("child: " + this.nChildren);
	},
	removeChildHTML_: function (child) {
		var node = child.$n().parentNode;
		if(node.className.indexOf(this.$s('img')) != -1){
			node.remove();
		}		
	},
	_getChildCnt: function () {
		return jq('.' + this.$s('img')).length;
	}

});



})();