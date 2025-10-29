import { PointerSensor, PointerSensorProps } from '@dnd-kit/core';

/**
 * A custom PointerSensor that listens for right-clicks during a drag
 * and cancels the active drag operation.
 *
 * Works by listening to the "contextmenu" event on window.
 */
export class RightClickCancelSensor extends PointerSensor {
  private handleContextMenu = () => {
    // @ts-expect-error: Accessing private props to call onCancel
    if (this.props && typeof this.props.onCancel === 'function') {
      // @ts-expect-error: Accessing private props to call onCancel
      this.props.onCancel();
    }
  };

  constructor(props: PointerSensorProps) {
    super(props);
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
