package org.test.bob;

import java.util.List;

import org.zkoss.lang.Objects;
import org.zkoss.zk.au.AuRequest;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.UiException;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.event.SelectEvent;
import org.zkoss.zul.Image;
import org.zkoss.zul.impl.XulElement;

@SuppressWarnings("serial")
public class Imageslider extends XulElement {

	static {
		addClientEvent(Imageslider.class, Events.ON_SELECT, CE_IMPORTANT | CE_DUPLICATE_IGNORE);
	}

	private Image _selectedItem;
	private int _viewportSize = 3;
	private int _imageWidth = 200;

	public Image getSelectedItem() {
		return _selectedItem;
	}

	public void setSelectedItem(Image img) {
		if (img == null) {
			throw new UiException("Null item is not allowed");
		}
		if (this != img.getParent()) {
			throw new UiException("Unsupported child for imageslider: " + img);
		}
		if (!Objects.equals(_selectedItem, img)) {
			_selectedItem = img;
			smartUpdate("selectedItem", _selectedItem);
		}
	}

	public int getSelectedIndex() {
		return this.getChildren().indexOf(_selectedItem);
	}

	public void setSelectedIndex(int index) {
		List<Image> children = this.<Image>getChildren();
		int size = children.size();
		if (size == 0) {
			return;
		}
		if (index < 0 || index >= size) {
			throw new UiException("Index: " + index + ", Size: " + size);
		}
		setSelectedItem(children.get(index));
	}

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

	protected void renderProperties(org.zkoss.zk.ui.sys.ContentRenderer renderer) throws java.io.IOException {
		super.renderProperties(renderer);
		if (_viewportSize != 3) {
			render(renderer, "viewportSize", _viewportSize);
		}
		if (_imageWidth != 200) {
			render(renderer, "imageWidth", _imageWidth);
		}
	}

	public void service(AuRequest request, boolean everError) {
		final String cmd = request.getCommand();
		if (cmd.equals(Events.ON_SELECT)) {
			SelectEvent<Image, Object> event = SelectEvent.getSelectEvent(request);
			this._selectedItem = event.getReference();
			Events.postEvent(event);
		} else
			super.service(request, everError);
	}

	public String getZclass() {
		return (this._zclass != null ? this._zclass : "z-imageslider");
	}

	public void beforeChildAdded(Component child, Component refChild) {
		if (!(child instanceof Image)) {
			throw new UiException("Unsupported child for imageslider: " + child);
		}
		super.beforeChildAdded(child, refChild);
	}
}
