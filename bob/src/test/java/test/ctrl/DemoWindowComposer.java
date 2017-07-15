package test.ctrl;

import org.test.bob.Imageslider;

import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.ForwardEvent;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.select.annotation.Wire;

public class DemoWindowComposer extends SelectorComposer {
	
	@Wire
	private Imageslider imgSlider;
	
	public void doAfterCompose(Component comp) throws Exception {
		super.doAfterCompose(comp);
		imgSlider.setText("Hello ZK Component!! Please click me.");
	}
	
	public void onFoo$myComp (ForwardEvent event) {
		Event mouseEvent = (Event) event.getOrigin();
		alert("You listen onFoo: " + mouseEvent.getTarget());
	}
}