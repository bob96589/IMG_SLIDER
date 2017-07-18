function(out) {
    var zcls = this.getZclass(),
        uuid = this.uuid;
    console.log("this._viewportSize" + this._viewportSize);
    console.log("this._imageWidth" + this._imageWidth);
    console.log("this._selectedIndex" + this._selectedIndex);


    out.push('<div ', this.domAttrs_(), '>');

    var btnHiddenClass = this.nChildren > this._viewportSize ? '' : ' ' + this.$s('hidden');
    // prevBtn
    out.push('<div id="', uuid, '-prevBtn" class="', this.$s('prevBtn'), ' ', this.$s('section'), btnHiddenClass, '">');
    out.push('</div>');

    // wrapper
    out.push('<div id="', uuid, '-wrapper" class="', this.$s('wrapper'), ' ', this.$s('section'), '" style="width: ', this._viewportSize * this._imageWidth, 'px">');
    out.push('<div id="', uuid, '-imgList"  class="', this.$s('imgList'), '" style="width: ', this.nChildren * this._imageWidth, 'px">');
    for (var w = this.firstChild; w; w = w.nextSibling) {
        this.encloseChildHTML_(w, out);
    }
    out.push('</div>');
    out.push('</div>');

    // nextBtn
    out.push('<div id="', uuid, '-nextBtn" class="', this.$s('nextBtn'), ' ', this.$s('section'), btnHiddenClass, '">');
    out.push('</div>');

    out.push('</div>');
}