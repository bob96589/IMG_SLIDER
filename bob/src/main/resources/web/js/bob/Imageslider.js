(function() {
    bob.Imageslider = zk.$extends(zul.Widget, {
        _viewportSize: 3,
        _imageWidth: 200,
        $define: {
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
                    this._updateChildrenWidth();
                }
            }
        },
        getSelectedItem: function() {
            return this._selectedItem;
        },
        setSelectedItem: function(item, opts) {
            var prevItem = this._selectedItem;
            if (item != prevItem || (opts && opts.force)) {
                this._selectedItem = item;
                if (this.desktop) {
                    this._highlightSelectedItem(prevItem);
                    this._updateScrollLeftOfWrapper();
                }
            }
        },
        bind_: function() {
            this.$supers(bob.Imageslider, 'bind_', arguments);
            zWatch.listen({
                onCommandReady: this
            });
            this.domListen_(this.$n('imgList'), 'onClick', '_doImgListClick');
            this.domListen_(this.$n('prevBtn'), 'onClick', '_doPrevBtnClick');
            this.domListen_(this.$n('nextBtn'), 'onClick', '_doNextBtnClick');

            this._updateBtnVisibility();
            this._updateWrapperWidth();
            this._updateImgListWidth();
            this._updateChildrenWidth();

        },
        unbind_: function() {
            this.domUnlisten_(this.$n('nextBtn'), 'onClick', '_doNextBtnClick');
            this.domUnlisten_(this.$n('prevBtn'), 'onClick', '_doPrevBtnClick');
            this.domUnlisten_(this.$n('imgList'), 'onClick', '_doImgListClick');
            zWatch.unlisten({
                onCommandReady: this
            });
            this.$supers(bob.Imageslider, 'unbind_', arguments);
        },
        onCommandReady: function() {
            if (this._isChildModified) {
                this._updateBtnVisibility();
                this._updateImgListWidth();
                this._isChildModified = false;
            }
        },
        _doImgListClick: function(evt) {
            var target = evt.target,
                chdexOfTarget = this._chdex(target);
            if (chdexOfTarget && 　chdexOfTarget.className == this.$s('img')) {
                var prevItem = this._selectedItem;
                this._selectedItem = target;
                this._highlightSelectedItem(prevItem);
                this.fire('onSelect', {
                    items: [target],
                    reference: target
                });
            }
        },
        _doPrevBtnClick: function(evt) {
            this._doAnimation(-1);
        },
        _doNextBtnClick: function(evt) {
            this._doAnimation(1);
        },
        encloseChildHTML_: function(w, out) {
            var oo = new zk.Buffer();
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
            this._isChildModified = true;
        },
        removeChildHTML_: function(child) {
            var id = child.uuid;
            this.$supers('removeChildHTML_', arguments);
            jq('#' + id + '-chdex').remove();
            this._isChildModified = true;
        },
        _chdex: function(child) {
            return child.$n('chdex');
        },
        _doAnimation: function(flag) {
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
            this.$n('wrapper').style.width = jq.px0(this._imageWidth * this._viewportSize);
        },
        _updateChildrenWidth: function() {
            for (var w = this.firstChild; w; w = w.nextSibling) {
                this._chdex(w).style.width = jq.px0(this._imageWidth);
            }
        },
        _updateImgListWidth: function() {
            this.$n('imgList').style.width = jq.px0(this._imageWidth * this.nChildren);
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
        _updateScrollLeftOfWrapper: function() {
            var index = this._selectedItem.getChildIndex();
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
        _highlightSelectedItem: function(prevItem) {
            var prevSelectedWgt = prevItem,
                currentSelectedWgt = this._selectedItem,
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