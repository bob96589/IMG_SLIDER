package test.ctrl;

import org.test.bob.Imageslider;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.ForwardEvent;
import org.zkoss.zk.ui.event.SelectEvent;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Listen;
import org.zkoss.zk.ui.select.annotation.Wire;

public class DemoWindowComposer extends SelectorComposer {
	
	@Wire
	private Imageslider imgslider;
	
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		//imgslider.setText("Hello ZK Component!! Please click me.");
	}
	
	public void onFoo$imgSlider (ForwardEvent event) {
		Event mouseEvent = (Event) event.getOrigin();
		alert("You listen onFoo: " + mouseEvent.getTarget());
	}
	
	//@Listen("onSelect = #imgslider")
	public void onSelect (Event event) {
		alert("You listen onFoo: " + event.getTarget());
	}
}