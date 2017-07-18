/**
 * Here's the mold file , a mold means a HTML struct that the widget really presented.
 * yep, we build html in Javascript , that make it more clear and powerful.
 */
function(out) {

	// redraw
	
    // Here you call the "this" means the widget instance. (@see Imageslider.js)

    var zcls = this.getZclass(),
        uuid = this.uuid;

    // The this.domAttrs_() means it will prepare some dom attributes,
    // like the pseudo code below
    /*
     * class="${zcls} ${this.getSclass()}" id="${uuid}"
     */
    out.push('<div ', this.domAttrs_(), '>');


    var btnDisplayStyle = this.nChildren > this._viewportSize ? ' ' : ' style="display: none"'
    // prevBtn
    out.push('<div id="', uuid, '-prevBtn" class="', this.$s('prevBtn'), ' ', this.$s('section'), '"' + btnDisplayStyle + '>');
    out.push('</div>');

    // imgListWrapper
    out.push('<div id="', uuid, '-wrapper" class="', this.$s('imgListWrapper'), ' ', this.$s('section'), '" style="width: ', this._viewportSize * this._imageWidth, 'px">');
    out.push('<div id="', uuid, '-imgList"  class="', this.$s('imgList'), '">');
    for (var w = this.firstChild; w; w = w.nextSibling) {
        this.encloseChildHTML_(w, out);
    }
    out.push('</div>');
    out.push('</div>');

    // nextBtn
    out.push('<div id="', uuid, '-nextBtn" class="', this.$s('nextBtn'), ' ', this.$s('section'), '"' + btnDisplayStyle + '>');
    out.push('</div>');

    out.push('</div>');

}