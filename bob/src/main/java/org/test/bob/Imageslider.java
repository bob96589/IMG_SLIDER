package org.test.bob;

import java.util.Map;

import org.zkoss.lang.Objects;
import org.zkoss.zk.au.AuRequest;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.UiException;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zul.Image;
import org.zkoss.zul.impl.XulElement;

public class Imageslider extends XulElement {

	static {
		addClientEvent(Imageslider.class, "onFoo", 0);
	}

	/* Here's a simple example for how to implements a member field */

	private String _text;

	public String getText() {
		return _text;
	}

	public void setText(String text) {
		if (!Objects.equals(_text, text)) {
			_text = text;
			smartUpdate("text", _text);
		}
	}

	// super//
	protected void renderProperties(org.zkoss.zk.ui.sys.ContentRenderer renderer) throws java.io.IOException {
		super.renderProperties(renderer);

		render(renderer, "text", _text);
	}

	public void service(AuRequest request, boolean everError) {
		final String cmd = request.getCommand();
		final Map data = request.getData();

		if (cmd.equals("onFoo")) {
			final String foo = (String) data.get("foo");
			System.out.println("do onFoo, data:" + foo);
			Events.postEvent(Event.getEvent(request));
		} else
			super.service(request, everError);
	}

	/**
	 * The default zclass is "z-imageslider"
	 */
	public String getZclass() {
		return (this._zclass != null ? this._zclass : "z-imageslider");
	}

	// ----------------------------------------------------------------------------------------

	// can't not be null ??
	
	private Image _selectedItem;
	private int _selectedIndex;
	private int _viewportSize;
	private int _imageWidth;

	public Image getSelectedItem() {
		return _selectedItem;
	};

	public void setSelectedItem(Image img) {
		if (!Objects.equals(_selectedItem, img)) {
			_selectedItem = img;
			smartUpdate("selectedItem", _selectedItem);
		}
	};

	public int getSelectedIndex() {
		return _selectedIndex;
	}

	public void setSelectedIndex(int index) {
		if (_selectedIndex != index) {
			_selectedIndex = index;
			smartUpdate("selectedIndex", _selectedIndex);
		}
	};

	public int getViewportSize() {
		return _viewportSize;
	}

	public void setViewportSize(int size) {
		if (_viewportSize != size) {
			_viewportSize = size;
			smartUpdate("viewportSize", _viewportSize);
		}
	}

	public int getImageWidth() {
		return _imageWidth;
	}

	public void setImageWidth(int width) {
		if (_imageWidth != width) {
			_imageWidth = width;
			smartUpdate("imageWidth", _imageWidth);
		}
	}
	
	// ----------------------------------------------------------------------------------------

	public void beforeChildAdded(Component child, Component refChild) {
		if (!(child instanceof Image))
			throw new UiException("Unsupported child for imageslider: " + child);
		super.beforeChildAdded(child, refChild);
	}
}

