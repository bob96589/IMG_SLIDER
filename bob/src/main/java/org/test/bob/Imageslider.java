package org.test.bob;

import java.util.List;
import java.util.Map;

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

	private int _selectedIndex = -1;
	private int _viewportSize = 3;
	private int _imageWidth = 200;

	public Image getSelectedItem() {
		Image image = null;
		List<Image> children = this.<Image>getChildren();
		if (!isIndexOutOfBound(children, _selectedIndex)) {
			image = children.get(_selectedIndex);
		}
		return image;
	}

	public void setSelectedItem(Image img) {
		if (img == null) {
			return;
		}
		List<Image> children = this.<Image>getChildren();
		int index = children.indexOf(img);
		if (index != -1) {
			setSelectedIndex(index);
		}
	}

	public int getSelectedIndex() {
		return _selectedIndex;
	}

	public void setSelectedIndex(int index) {
		List<Image> children = this.<Image>getChildren();
		if(isIndexOutOfBound(children, index)) {
			//throw new IndexOutOfBoundsException("size: " + children.size() + ", input index: " + index);
		}
		if (_selectedIndex != index) {
			_selectedIndex = index;
			smartUpdate("selectedIndex", _selectedIndex);
		}
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

	private boolean isIndexOutOfBound(List<Image> children, int index) {
		return index < 0 || index >= children.size();
	}

	protected void renderProperties(org.zkoss.zk.ui.sys.ContentRenderer renderer) throws java.io.IOException {
		super.renderProperties(renderer);
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
		if (cmd.equals(Events.ON_SELECT)) {
			SelectEvent<Image, Object> event = SelectEvent.getSelectEvent(request);
			List<Image> children = this.<Image>getChildren();
			int index = children.indexOf(event.getReference());
			setSelectedIndex(index);
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

		if (refChild != null) {
			List<Image> children = this.<Image>getChildren();
			int index = children.indexOf(refChild);
			if (_selectedIndex >= index) {
				setSelectedIndex(_selectedIndex + 1);
			}
		}

		super.beforeChildAdded(child, refChild);
	}

	public void beforeChildRemoved(Component child) {
		List<Image> children = this.<Image>getChildren();
		int index = children.indexOf(child);
		if (_selectedIndex > index) {
			setSelectedIndex(_selectedIndex - 1);
		} else if (_selectedIndex == index) {
			setSelectedIndex(-1);
		}
		super.beforeChildRemoved(child);
	}

}
