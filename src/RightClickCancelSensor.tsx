import { PointerSensor, PointerSensorProps } from '@dnd-kit/core';

/**
 * A custom PointerSensor that listens for right-clicks during a drag
 * and cancels the active drag operation.
 *
 * Works by listening to the "contextmenu" event on window.
 */
export class RightClickCancelSensor extends PointerSensor {
  private handleContextMenu = () => {
    this.teardown();
    // handleCancel is private on AbstractPointerSensor. Calling it is what
    // actually detach()es the inherited pointer/window listeners; calling
    // props.onCancel alone would leave those attached and leak this
    // contextmenu listener (teardown is never invoked by dnd-kit).
    // @ts-expect-error private AbstractPointerSensor.handleCancel
    this.handleCancel();
  };

  constructor(props: PointerSensorProps) {
    // dnd-kit instantiates a sensor per gesture and never calls instance
    // teardown(). Wrap the settle callbacks so the contextmenu listener is
    // removed on the normal pointer end/cancel path too.
    const sensorRef: { current?: RightClickCancelSensor } = {};
    super({
      ...props,
      onCancel: () => {
        sensorRef.current?.teardown();
        props.onCancel();
      },
      onEnd: () => {
        sensorRef.current?.teardown();
        props.onEnd();
      },
    });
    sensorRef.current = this;
    if (typeof window !== 'undefined') {
      window.addEventListener('contextmenu', this.handleContextMenu, {
        passive: false,
      });
    }
  }

  teardown() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('contextmenu', this.handleContextMenu);
    }
  }
}
