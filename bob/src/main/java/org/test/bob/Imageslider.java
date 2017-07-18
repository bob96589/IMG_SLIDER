package org.test.bob;

import java.util.List;
import java.util.Map;

import org.zkoss.lang.Objects;
import org.zkoss.zk.au.AuRequest;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.UiException;
import org.zkoss.zk.ui.event.Event;
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
	private int _selectedIndex = -1;
	private int _viewportSize = 3;
	private int _imageWidth = 200;

	private boolean isIndexOutOfBound(List<Image> children, int index) {
		return index < 0 || index >= children.size();
	}

	public Image getSelectedItem() {
		List<Image> children = this.<Image>getChildren();
		if (isIndexOutOfBound(children, _selectedIndex)) {
			return null;
		} else {
			return children.get(_selectedIndex);
		}
	};

	// TODO
	public void setSelectedItem(Image img) {
		if (!Objects.equals(_selectedItem, img)) {
			List<Image> children = this.<Image>getChildren();
			setSelectedIndex(children.indexOf(img));
		}
	};

	public int getSelectedIndex() {
		return _selectedIndex;
	}

	public void setSelectedIndex(int index) {
		if (_selectedIndex != index) {
			// update index
			_selectedIndex = index;
			smartUpdate("selectedIndex", _selectedIndex);
			
			// update Image
			List<Image> children = this.<Image>getChildren();
			Image image = null;
			if (!isIndexOutOfBound(children, _selectedIndex)) {
				image = children.get(_selectedIndex);
			} 
			this._selectedItem = image;
			smartUpdate("selectedItem", _selectedItem);
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

	protected void renderProperties(org.zkoss.zk.ui.sys.ContentRenderer renderer) throws java.io.IOException {
		super.renderProperties(renderer);
		// _selectedItem or _selectedIndex
		// render(renderer, "selectedItem", _selectedItem);
		if (_selectedIndex != -1) {
			render(renderer, "selectedIndex", _selectedIndex);
		}
		if (_viewportSize != 3) {
			render(renderer, "viewportSize", _viewportSize);
		}
		if (_imageWidth != 200) {
			render(renderer, "imageWidth", _imageWidth);
		}
	}

	@SuppressWarnings("rawtypes")
	public void service(AuRequest request, boolean everError) {
		final String cmd = request.getCommand();
		final Map data = request.getData();
		if (cmd.equals(Events.ON_SELECT)) {
			final Integer index = (Integer) data.get("index");
			setSelectedIndex(index);
			SelectEvent s = SelectEvent.getSelectEvent(request);
			Events.postEvent(s);
		} else
			super.service(request, everError);
	}

	public String getZclass() {
		return (this._zclass != null ? this._zclass : "z-imageslider");
	}

	public void beforeChildAdded(Component child, Component refChild) {
		if (!(child instanceof Image))
			throw new UiException("Unsupported child for imageslider: " + child);
		super.beforeChildAdded(child, refChild);
	}
}
