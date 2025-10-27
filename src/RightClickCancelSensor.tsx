import { PointerSensor, PointerSensorProps } from '@dnd-kit/core';

/**
 * A custom PointerSensor that listens for right-clicks during a drag
 * and cancels the active drag operation.
 *
 * Works by listening to the "contextmenu" event on window.
 */
export class RightClickCancelSensor extends PointerSensor {
  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    // @ts-expect-error: Accessing private props to call onCancel
    if (this.props && typeof this.props.onCancel === 'function') {
      // @ts-expect-error: Accessing private props to call onCancel
      this.props.onCancel();
    }
  };

  constructor(props: PointerSensorProps) {
    super(props);
    window.addEventListener('contextmenu', this.handleContextMenu, {
      passive: false,
    });
  }

  teardown() {
    window.removeEventListener('contextmenu', this.handleContextMenu);
  }
}
