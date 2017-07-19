(function() {
    bob.Imageslider = zk.$extends(zul.Widget, {
        _viewportSize: 3,
        _imageWidth: 200,
        $define: {
            viewportSize: function() {
                if (this.desktop) {
                	console.log('viewportSize');
                    this._updateWrapperWidth();
                    this._updateBtnVisibility();
                }
            },
            imageWidth: function() {
                if (this.desktop) {
                	console.log('imageWidth');
                    this._updateWrapperWidth();
                    this._updateImgListWidth();
                    this._updateScrollLeftOfWrapper();
                    this._updateChildrenWidth();
                }
            }
        },
        getSelectedIndex: function() {
            return this._selectedIndex;
        },
        setSelectedIndex: function(index, opts) {
        	console.log('setSelectedIndex');
            var prevIndex = this._selectedIndex;
            if (index != prevIndex  || (opts && opts.force)) {
            	this._selectedIndex = index;
                if (this.desktop) {
                    this._highlightSelectedItem(prevIndex);
                    if (index >= 0 && index < this.nChildren) {
                        this._updateScrollLeftOfWrapper();
                    }
                }
            }
        },
        bind_: function() {
            this.$supers(bob.Imageslider, 'bind_', arguments);
            zWatch.listen({
            	onResponse: this
            });
            this.domListen_(this.$n("imgList"), "onClick", "_doImgListClick");
            this.domListen_(this.$n("prevBtn"), "onClick", "_doPrevBtnClick");
            this.domListen_(this.$n("nextBtn"), "onClick", "_doNextBtnClick");
            if (this.desktop) {
            	console.log('bind_');
                this._updateBtnVisibility();
                this._updateWrapperWidth();
                this._updateImgListWidth();
                this._highlightSelectedItem();
                this._updateChildrenWidth();
            }
        },
        unbind_: function() {
            zWatch.unlisten({
                onResponse: this
            });
            this.domUnlisten_(this.$n("imgList"), "onClick", "_doImgListClick");
            this.domUnlisten_(this.$n("prevBtn"), "onClick", "_doPrevBtnClick");
            this.domUnlisten_(this.$n("nextBtn"), "onClick", "_doNextBtnClick");
            this.$supers(bob.Imageslider, 'unbind_', arguments);
        },
        onResponse: function() {
            if (this.desktop) {
            	if(this._isChildAdded){
            		console.log('onResponse_isChildAdded');
            		this._updateBtnVisibility();
            		this._isChildAdded = false;
            	}else if(this._isChildRemoved){
            		console.log('onResponse_isChildRemoved');
            		this._updateBtnVisibility();
            		this._updateImgListWidth();
            		this._isChildRemoved = false;
            	}
            }
        },
        _doImgListClick: function (evt) {
        	var target = evt.target;
        	if (this._chdex(target) && 　this._chdex(target).className == this.$s('img')) {
              this.fire('onSelect', {
                  items: [target],
                  reference: target
              });
          }
    	},
    	_doPrevBtnClick: function (evt) {
    		this._doAnimation(-1);
    	},
    	_doNextBtnClick: function (evt) {
    		this._doAnimation(1);
    	},
        encloseChildHTML_: function(w, out) {
            var oo = new zk.Buffer();;
            oo.push('<div id="' + w.uuid + '-chdex"  class="', this.$s('img'), '">');
            w.redraw(oo);
            oo.push('</div>');
            if (!out) return oo.join('');
            out.push(oo.join(''));
        },
        insertChildHTML_: function(child, before, desktop) {
        	var childHtml = this.encloseChildHTML_(child);
            if (before)
                jq(this._chdex(before)).before(childHtml);
            else {
                var jqn = jq(this.$n('imgList'));
                jqn.append(childHtml);
            }
            child.bind(desktop);
            this._chdex(child).style.width = jq.px0(this._imageWidth);
            this._updateImgListWidth();
            this._isChildAdded = true;
        },
        removeChildHTML_: function(child) {
            var id = child.uuid;
            this.$supers('removeChildHTML_', arguments);
            jq('#' + id + '-chdex').remove();
            this._isChildRemoved = true;
        },
        _chdex: function(child) {
            return child.$n('chdex');
        },
        _doAnimation: function(flag) {
        	console.log('_doAnimation');
            var wgt = this;
            if (wgt._stepMovement) return;
            var steps = 10,
                dist = wgt.getImageWidth() * flag / steps;
            this._stepMovement = setInterval(function() {
                if (wgt.desktop) {
                    if (steps--) {
                        wgt.$n('wrapper').scrollLeft -= dist;
                    } else {
                        clearInterval(wgt._stepMovement);
                        wgt._stepMovement = null;
                    }
                }
            }, 10);
        },
        _updateWrapperWidth: function() {
        	console.log('_updateWrapperWidth');
            this.$n('wrapper').style.width = jq.px0(this._imageWidth * this._viewportSize);
        },
        _updateChildrenWidth: function() {
        	console.log('_updateChildrenWidth');
            for (var w = this.firstChild; w; w = w.nextSibling) {
                this._chdex(w).style.width = jq.px0(this._imageWidth);
            }
        },
        _updateImgListWidth: function() {
        	console.log('_updateImgListWidth');
            this.$n('imgList').style.width = jq.px0(this._imageWidth * this.nChildren);
        },
        _updateBtnVisibility: function() {
        	console.log('_updateBtnVisibility');
            var jqPrevBtn = jq(this.$n('prevBtn')),
                jqNextBtn = jq(this.$n('nextBtn')),
                hiddenClass = this.$s('hidden');
            if (this.nChildren > this._viewportSize) {
                // show button
                jqPrevBtn.removeClass(hiddenClass);
                jqNextBtn.removeClass(hiddenClass);
            } else {
                // hide button
                jqPrevBtn.addClass(hiddenClass);
                jqNextBtn.addClass(hiddenClass);
            }
        },
        _updateScrollLeftOfWrapper: function() {
        	console.log('_updateScrollLeftOfWrapper');
            var index = this._selectedIndex;
            if (index == -1) {
                return;
            }
            var originScrollLeft = this.$n('wrapper').scrollLeft,
                dist = (index - this._viewportSize + 1) * this._imageWidth,
                maxDist = index * this._imageWidth;
            if (dist > originScrollLeft || originScrollLeft > maxDist) {
                this.$n('wrapper').scrollLeft = maxDist;
            }
        },
        _highlightSelectedItem: function(prevIndex) {
        	console.log('_highlightSelectedItem');
            var prevSelectedWgt = this.getChildAt(prevIndex),
                currentSelectedWgt = this.getChildAt(this._selectedIndex),
                selectedClass = this.$s('selectedImg');
            // remove highlight of previous selected image
            if (prevSelectedWgt) {
                jq(this._chdex(prevSelectedWgt)).removeClass(selectedClass);
            }
            // highlight selected image
            if (currentSelectedWgt) {
                jq(this._chdex(currentSelectedWgt)).addClass(selectedClass);
            }
        }
    });
})();