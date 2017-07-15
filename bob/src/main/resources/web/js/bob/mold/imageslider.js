/**
* Here's the mold file , a mold means a HTML struct that the widget really presented.
* yep, we build html in Javascript , that make it more clear and powerful.
*/
function (out) {

	// Here you call the "this" means the widget instance. (@see Imageslider.js)

	var zcls = this.getZclass(),
		uuid = this.uuid;

	// The this.domAttrs_() means it will prepare some dom attributes,
	// like the pseudo code below
	/*
	 * class="${zcls} ${this.getSclass()}" id="${uuid}"
	 */
	console.log('mold.this.getViewportSize(): ' + this.getViewportSize());
	console.log('mold.this.getImageWidth(): ' + this.getImageWidth());
	console.log('mold.this.domAttrs_(): ' + this.domAttrs_());
	
	out.push('<div ', this.domAttrs_(), '>');
	
	out.push('<div id="', uuid, '-wrapper" class="', this.$s('imgListWrapper'), '"><div class="', this.$s('imgList'), '">');
	for (var w = this.firstChild; w; w = w.nextSibling) {
		out.push('<div class="', this.$s('img'), '">');
		w.redraw(out);
		out.push('</div>');
	}
	out.push('</div></div>');
	
	out.push('</div>');

}