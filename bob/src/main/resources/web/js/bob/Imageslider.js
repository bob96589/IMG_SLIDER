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
        setSelectedIndex: function(index) {
        	console.log('setSelectedIndex');
            var prevIndex = this._selectedIndex;
            if (index != prevIndex) {
                this._selectedIndex = index;
                if (this.desktop) {
                    this._highlightSelectedItem(prevIndex);
                    if (index >= 0) {
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
            this.$supers(bob.Imageslider, 'unbind_', arguments);
        },
        onResponse: function() {
            if (this.desktop && this._isChildModified) {
                console.log('onResponse');
                this._updateImgListWidth();
                this._updateChildrenWidth();
                this._updateBtnVisibility();
                this._isChildModified = false;
            }
        },
        doClick_: function(evt) {
            var target = evt.target;
            if (evt.domTarget == this.$n('prevBtn')) {
                this._doAnimation(-1);
            } else if (evt.domTarget == this.$n('nextBtn')) {
                this._doAnimation(1);
            } else if (this._chdex(target) && 　this._chdex(target).className == this.$s('img')) {
                this.fire('onSelect', {
                    items: [target],
                    reference: target
                });
            } else {
                this.$super('doClick_', evt, true);
            }
        },
        encloseChildHTML_: function(w, out) {
            var oo = new zk.Buffer();;
            oo.push('<div id="' + w.uuid + '-chdex"  class="', this.$s('img'), '">');
            w.redraw(oo);
            oo.push('</div>');
            if (!out) return oo.join('');
            out.push(oo.join(''));
        },
        _chdex: function(child) {
            return child.$n('chdex');
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
          //this._chdex(child).style.width = jq.px0(this._imageWidth);
            this._isChildModified = true;
        },
        removeChildHTML_: function(child) {
            var id = child.uuid;
            this.$supers('removeChildHTML_', arguments);
            jq('#' + id + '-chdex').remove();
            this._isChildModified = true;
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