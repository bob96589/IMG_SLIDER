function(out) {
    var uuid = this.uuid,
        sectionClass = this.$s('section');

    out.push('<div ', this.domAttrs_(), '>');

    // prevBtn
    out.push('<div id="', uuid, '-prevBtn" class="', this.$s('prevBtn'), ' ', sectionClass, '"></div>');

    // wrapper
    out.push('<div id="', uuid, '-wrapper" class="', this.$s('wrapper'), ' ', sectionClass, '">');
    out.push('<div id="', uuid, '-imgList" class="', this.$s('imgList'), '">');
    for (var w = this.firstChild; w; w = w.nextSibling) {
        this.encloseChildHTML_(w, out);
    }
    out.push('</div></div>');

    // nextBtn
    out.push('<div id="', uuid, '-nextBtn" class="', this.$s('nextBtn'), ' ', sectionClass, '"></div></div>');

}