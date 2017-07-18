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
    //var stepMovement;
    // static global
    //bob.Imageslider.$class._updateBtnVisibility, get static value

    bob.Imageslider = zk.$extends(zul.Widget, {
    	_selectedIndex: -1,
        _viewportSize: 3,
        _imageWidth: 200,
        $define: {
            selectedItem: function(item) {
                if (this.desktop) {
                	this.setSelectedIndex(item.getChildIndex());
                }
            },
            viewportSize: function() {
                if (this.desktop) {
                	this._updateWrapperWidth();
                	this._updateBtnVisibility();
                }
            },
            imageWidth: function() {
                if (this.desktop) {
                	this._updateWrapperWidth();
                	this._updateImgListWidth();
                    for (var w = this.firstChild; w; w = w.nextSibling) {
                        this._chdex(w).style.width = this._imageWidth + 'px';
                    }
                }
            }
        },
        getSelectedIndex: function() { 
        	return this._selectedIndex;
        },
        setSelectedIndex: function(index){
        	if(this.desktop){
        		//TODO index out of bound
        		//TODO put in method
        		// remove highlight of previous selected image
        		if(this._selectedIndex != -1){
        			var prevSelectedWgt = this.getChildAt(this._selectedIndex);
        			this._chdex(prevSelectedWgt).className = this.$s('img');
        		}     		
        		// highlight selected image
        		var currentSelectedWgt = this.getChildAt(index);
        		this._chdex(currentSelectedWgt).className += ' ' + this.$s('selectImg');
        		
        		// relocate wrapper
        		var originScrollLeft = this.$n('wrapper').scrollLeft;
        		var dist = (index - this._viewportSize + 1) * this._imageWidth;
        		var maxDist = index * this._imageWidth;
        		if(dist > originScrollLeft || originScrollLeft > maxDist){
        			this.$n('wrapper').scrollLeft = maxDist;
        		}
        	}
        	this._selectedIndex = index;
        },
        doClick_: function(evt) {
        	var target = evt.target;
            if (evt.domTarget == this.$n('prevBtn')) {
                this._doAnimation(-1);
            } else if (evt.domTarget == this.$n('nextBtn')) {
            	this._doAnimation(1);
            } else if (this._chdex(target) &&　this._chdex(target).className == this.$s('img')) {
                this.fire('onSelect', {
                    index: target.getChildIndex(),
                    items: [target.uuid],
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
            oo.push('<div id="' + w.uuid + '-chdex" class="', this.$s('img'), '" style="width:', this._imageWidth, 'px">');
            w.redraw(oo);
            oo.push('</div>');
            if (!out) return oo.join('');
            out.push(oo.join(''));
        },
        _chdex: function(child) {
            return child.$n('chdex');
        },
        insertChildHTML_: function(child, before, desktop) {
            if (before)
                jq(this._chdex(before)).before(this.encloseChildHTML_(child));
            else {
                var jqn = jq(this.$n('imgList'));
                jqn.append(this.encloseChildHTML_(child));
            }
            child.bind(desktop);
            this._updateImgListWidth();
            this._updateBtnVisibility();
        },
        removeChildHTML_: function(child) {
        	var id = child.uuid;
        	this.$supers('removeChildHTML_', arguments);
            jq('#' + id + '-chdex').remove();
        },
        // TODO
        // onChildAdd
        // zwatch do after 1000
        // https://www.zkoss.org/javadoc/latest/jsdoc/_global_/zWatch.html
        // onResponse, set flag        
        onChildRemoved_: function() {
            this.$supers('onChildRemoved_', arguments);
            if (this.desktop) {
            	this._updateImgListWidth();
            	this._updateBtnVisibility();
            }
        },
        _doAnimation : function (flag) {
        	var wgt = this;
            if (wgt.stepMovement) return;
            var steps = 20;
            var dist = wgt.getImageWidth() * flag / steps;
            console.log(wgt.$n('wrapper').scrollLeft);
            this.stepMovement = setInterval(function() {
            	if (wgt.desktop) {
            		if (steps--) {
            			wgt.$n('wrapper').scrollLeft -= dist;
            		} else {
            			clearInterval(wgt.stepMovement);
            			wgt.stepMovement = null;
            		}
            	}
            }, 10);
        },
        _updateWrapperWidth: function () {
        	this.$n('wrapper').style.width = this._imageWidth * this._viewportSize + 'px';
        },
        _updateImgListWidth: function () {
            this.$n('imgList').style.width = this._imageWidth * this.nChildren + 'px';
        },
        _updateBtnVisibility: function () {
            if (this.nChildren > this._viewportSize) {
            	this.$n('prevBtn').style.display = 'inline-block';
            	this.$n('nextBtn').style.display = 'inline-block';
            } else {
            	this.$n('prevBtn').style.display = 'none';
            	this.$n('nextBtn').style.display = 'none';
            }
        }
    });
})();