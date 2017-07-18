(function() {
    bob.Imageslider = zk.$extends(zul.Widget, {
        _selectedIndex: -1,
        _viewportSize: 3,
        _imageWidth: 200,
        $define: {
            selectedItem: function() {},
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
                    this._updateScrollLeftOfWrapper();
                    for (var w = this.firstChild; w; w = w.nextSibling) {
                        this._chdex(w).style.width = this._imageWidth + 'px';
                    }
                }
            }
        },
        getSelectedIndex: function() {
            return this._selectedIndex;
        },
        setSelectedIndex: function(index) {
            if (this.desktop) {
                this._highlightSelectedItem(index);
                if (index >= 0) {
                    this._updateScrollLeftOfWrapper(index);
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
            } else if (this._chdex(target) && 　this._chdex(target).className == this.$s('img')) {
                this.fire('onSelect', {
                    index: target.getChildIndex(),
                    items: [target.uuid],
                });
            } else {
                this.$super('doClick_', evt, true);
            }
        },
        encloseChildHTML_: function(w, out) {
            var oo = new zk.Buffer(),
                className = this.$s('img') + (w.getChildIndex() == this._selectedIndex ? ' ' + this.$s('selectedImg') : '');
            oo.push('<div id="' + w.uuid + '-chdex" class="', className, '" style="width:', this._imageWidth, 'px">');
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
        },
        removeChildHTML_: function(child) {
            var id = child.uuid;
            this.$supers('removeChildHTML_', arguments);
            jq('#' + id + '-chdex').remove();
        },
        onChildAdded_: function(child) {
            this.$supers('onChildAdded_', arguments);
            if (this.desktop) {
                this._updateImgListWidth();
                this._updateBtnVisibility();
            }
        },
        onChildRemoved_: function() {
            this.$supers('onChildRemoved_', arguments);
            if (this.desktop) {
                this._updateImgListWidth();
                this._updateBtnVisibility();
            }
        },
        _doAnimation: function(flag) {
            var wgt = this;
            if (wgt.stepMovement) return;
            var steps = 10;
            var dist = wgt.getImageWidth() * flag / steps;
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
        _updateWrapperWidth: function() {
            this.$n('wrapper').style.width = this._imageWidth * this._viewportSize + 'px';
        },
        _updateImgListWidth: function() {
            this.$n('imgList').style.width = this._imageWidth * this.nChildren + 'px';
        },
        _updateBtnVisibility: function() {
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
        _updateScrollLeftOfWrapper: function(index) {
            index = index ? index : 0;
            var originScrollLeft = this.$n('wrapper').scrollLeft,
                dist = (index - this._viewportSize + 1) * this._imageWidth,
                maxDist = index * this._imageWidth;
            if (dist > originScrollLeft || originScrollLeft > maxDist) {
                this.$n('wrapper').scrollLeft = maxDist;
            }
        },
        _highlightSelectedItem: function(index) {
            // remove highlight of previous selected image
            var prevSelectedWgt = this.getChildAt(this._selectedIndex),
            	selectedClass = this.$s('selectedImg');
            if (prevSelectedWgt) {
//            	debugger;
//                this._chdex(prevSelectedWgt).className = this.$s('img');
                jq(this._chdex(prevSelectedWgt)).removeClass(selectedClass);
            }
            // highlight selected image
            var currentSelectedWgt = this.getChildAt(index);
            if (currentSelectedWgt) {
//                this._chdex(currentSelectedWgt).className += ' ' + this.$s('selectedImg');
                jq(this._chdex(currentSelectedWgt)).addClass(selectedClass);
            }
        }
    });
})();