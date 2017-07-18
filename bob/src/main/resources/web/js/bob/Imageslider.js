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
(function() {

	//do not write here
	// this.stepMovement
    var stepMovement;

    // static global
    function _doAnimation(wgt, flag) {
        if (stepMovement) return;
        var steps = 20;
        var dist = wgt.getImageWidth() * flag / steps;
        
        stepMovement = setInterval(function() {
        	// check wgt.desktop
        	if (wgt.desktop) {
        		if (steps--) {
        			wgt.$n('wrapper').scrollLeft -= dist;
        		} else {
        			clearInterval(stepMovement);
        			stepMovement = null;
        		}
        	}
        }, 10);
    }

    function _updateImgListWidth(wgt) {
        wgt.$n('imgList').style.width = wgt._imageWidth * wgt.nChildren + 'px';
    }

    function _updateWrapperWidth(wgt) {
        wgt.$n('wrapper').style.width = wgt._imageWidth * wgt._viewportSize + 'px';
    }

    function _updateBtnVisibility(wgt) {
        if (wgt.nChildren > wgt._viewportSize) {
            wgt.$n('prevBtn').style.display = 'inline-block';
            wgt.$n('nextBtn').style.display = 'inline-block';
        } else {
            wgt.$n('prevBtn').style.display = 'none';
            wgt.$n('nextBtn').style.display = 'none';
        }
    }
    //bob.Imageslider.$class._updateBtnVisibility, get static value

    bob.Imageslider = zk.$extends(zul.Widget, {
    	_selectedIndex: -1,
        _viewportSize: 3,
        _imageWidth: 200,


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
            selectedItem: function(item) {
                if (this.desktop) {
                    console.log("selectedItem" + item);
                }
            },
            selectedIndex: function() {
                if (this.desktop) {
                	// put in method
                    var i = 0;
                    for (var w = this.firstChild; w; w = w.nextSibling) {
                        this._chdextr(w).className = this.$s('img');
                        if (i == this._selectedIndex) {
                            this._chdextr(w).className += ' ' + this.$s('selectImg');
                        }
                        i++;
                    }
                    var originScrollLeft = this.$n('wrapper').scrollLeft;
                    var maxDist = this._imageWidth * this._selectedIndex;
                    var dist = maxDist - (this._imageWidth * (this._viewportSize - 1));
//                    console.log('originScrollLeft: ' + originScrollLeft);
//                    console.log('dist: ' + dist);
//                    console.log('maxDist: ' + maxDist);
//                    debugger;
                    if(dist > originScrollLeft || originScrollLeft > maxDist){
                    	this.$n('wrapper').scrollLeft = dist;
                    }
                }
            },
            viewportSize: function() {
                if (this.desktop) {
                    _updateWrapperWidth(this);
                    _updateBtnVisibility(this);
                }
            },
            imageWidth: function() {
                if (this.desktop) {
                    _updateWrapperWidth(this);
                    _updateImgListWidth(this);
                    for (var w = this.firstChild; w; w = w.nextSibling) {
                        this._chdextr(w).style.width = this._imageWidth + 'px';
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
        bind_: function() {
            /**
             * For widget lifecycle , the super bind_ should be called
             * as FIRST STATEMENT in the function.
             * DONT'T forget to call supers in bind_ , or you will get error.
             */
            this.$supers(bob.Imageslider, 'bind_', arguments);

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
        unbind_: function() {

            // A example for domUnlisten_ , should be paired with bind_
            // this.domUnlisten_(this.$n("cave"), "onClick", "_doItemsClick");

            /*
             * For widget lifecycle , the super unbind_ should be called
             * as LAST STATEMENT in the function.
             */
            this.$supers(bob.Imageslider, 'unbind_', arguments);
        },
        /*
        	widget event, more detail 
        	please refer to http://books.zkoss.org/wiki/ZK%20Client-side%20Reference/Notifications
         */
        doClick_: function(evt) {
            if (evt.domTarget == this.$n('prevBtn')) {
                _doAnimation(this, -1);
            } else if (evt.domTarget == this.$n('nextBtn')) {
                _doAnimation(this, 1);
            } else if (this._chdextr(evt.target).className == this.$s('img')) {
                var currentNode = this._chdextr(evt.target);
                var selectedIndex = 0;
                //evt.target.getChildIndex()
                while ((currentNode = currentNode.previousSibling) != null) {
                    selectedIndex++;
                }
                // items
                this.fire('onSelect', {
                    index: selectedIndex,
                    items: [evt.target.uuid],
                });
            } else {
            	this.$super('doClick_', evt, true);
            }


            // add to first
            //var img = new zul.wgt.Image();
            //img.setSrc('images/ironman-03.jpg');
            //this.insertBefore(img, this.firstChild);

            // add to last
            //		var img = new zul.wgt.Image();
            //		img.setSrc('images/ironman-03.jpg');
            //		this.appendChild(img);

            // remove first child
            //		this.removeChild(this.firstChild);	

        },
        encloseChildHTML_: function(w, out) {
            var oo = new zk.Buffer();
            
            // id: child; class: parent
            oo.push('<div id="' + w.uuid + '-chdex" class="', this.$s('img'), '" style="width:', this._imageWidth, 'px">');
            w.redraw(oo);
            oo.push('</div>');

            if (!out) return oo.join('');

            out.push(oo.join(''));
        },
        _chdextr: function(child) {
            return child.$n('chdex');
        },
        insertChildHTML_: function(child, before, desktop) {
            if (before)
                jq(this._chdextr(before)).before(this.encloseChildHTML_(child));
            else {
                var jqn = jq(this.$n('imgList'));
                jqn.append(this.encloseChildHTML_(child));
            }
            child.bind(desktop);
            _updateImgListWidth(this);
            _updateBtnVisibility(this);
        },
        removeChildHTML_: function(child) {
        	var id = child.uuid;
        	this.$supers('removeChildHTML_', arguments);
            jq('#' + id + '-chdex').remove();
        },
        // onChildAdd
        // zwatch do after 1000
        // https://www.zkoss.org/javadoc/latest/jsdoc/_global_/zWatch.html
        // onResponse, set flag        
        onChildRemoved_: function() {
            this.$supers('onChildRemoved_', arguments);
            if (this.desktop) {
                _updateImgListWidth(this);
                _updateBtnVisibility(this);
            }
        }

    });
})();