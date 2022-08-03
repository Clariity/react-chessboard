'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * Create the React Context
 */

const DndContext = /*#__PURE__*/React.createContext({
  dragDropManager: undefined
});

/**
 * Adapted from React: https://github.com/facebook/react/blob/master/packages/shared/formatProdErrorMessage.js
 *
 * Do not require this module directly! Use normal throw error calls. These messages will be replaced with error codes
 * during build.
 * @param {number} code
 */

function formatProdErrorMessage(code) {
  return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or " + 'use the non-minified dev environment for full errors. ';
} // Inlined version of the `symbol-observable` polyfill


var $$observable = function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
}();
/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */


var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */

function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
} // Inlined / shortened version of `kindOf` from https://github.com/jonschlinkert/kind-of


function miniKindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';
  var type = typeof val;

  switch (type) {
    case 'boolean':
    case 'string':
    case 'number':
    case 'symbol':
    case 'function':
      {
        return type;
      }
  }

  if (Array.isArray(val)) return 'array';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  var constructorName = ctorName(val);

  switch (constructorName) {
    case 'Symbol':
    case 'Promise':
    case 'WeakMap':
    case 'WeakSet':
    case 'Map':
    case 'Set':
      return constructorName;
  } // other


  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
}

function ctorName(val) {
  return typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isError(val) {
  return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
}

function kindOf(val) {
  var typeOfVal = typeof val;

  if (process.env.NODE_ENV !== 'production') {
    typeOfVal = miniKindOf(val);
  }

  return typeOfVal;
}
/**
 * @deprecated
 *
 * **We recommend using the `configureStore` method
 * of the `@reduxjs/toolkit` package**, which replaces `createStore`.
 *
 * Redux Toolkit is our recommended approach for writing Redux logic today,
 * including store setup, reducers, data fetching, and more.
 *
 * **For more details, please read this Redux docs page:**
 * **https://redux.js.org/introduction/why-rtk-is-redux-today**
 *
 * `configureStore` from Redux Toolkit is an improved version of `createStore` that
 * simplifies setup and helps avoid common bugs.
 *
 * You should not be using the `redux` core package by itself today, except for learning purposes.
 * The `createStore` method from the core `redux` package will not be removed, but we encourage
 * all users to migrate to using Redux Toolkit for all Redux code.
 *
 * If you want to use `createStore` without this visual deprecation warning, use
 * the `legacy_createStore` import instead:
 *
 * `import { legacy_createStore as createStore} from 'redux'`
 *
 */


function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(0) : 'It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(1) : "Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(2) : "Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer) + "'");
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(3) : 'You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(4) : "Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
    }

    if (isDispatching) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(5) : 'You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(6) : 'You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(7) : "Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
    }

    if (typeof action.type === 'undefined') {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    }

    if (isDispatching) {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(9) : 'Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(10) : "Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new Error(process.env.NODE_ENV === "production" ? formatProdErrorMessage(11) : "Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[$$observable] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */

function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}
/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */


function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
}

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */
function invariant(condition, format, ...args) {
  if (isProduction()) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    let error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      let argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1 // we don't care about invariant's own frame
    ;
    throw error;
  }
}

function isProduction() {
  return typeof process !== 'undefined' && process.env['NODE_ENV'] === 'production';
}

// cheap lodash replacements

/**
 * drop-in replacement for _.get
 * @param obj
 * @param path
 * @param defaultValue
 */
function get(obj, path, defaultValue) {
  return path.split('.').reduce((a, c) => a && a[c] ? a[c] : defaultValue || null, obj);
}
/**
 * drop-in replacement for _.without
 */

function without$1(items, item) {
  return items.filter(i => i !== item);
}
/**
 * drop-in replacement for _.isString
 * @param input
 */

function isObject(input) {
  return typeof input === 'object';
}
/**
 * replacement for _.xor
 * @param itemsA
 * @param itemsB
 */

function xor(itemsA, itemsB) {
  const map = new Map();

  const insertItem = item => {
    map.set(item, map.has(item) ? map.get(item) + 1 : 1);
  };

  itemsA.forEach(insertItem);
  itemsB.forEach(insertItem);
  const result = [];
  map.forEach((count, key) => {
    if (count === 1) {
      result.push(key);
    }
  });
  return result;
}
/**
 * replacement for _.intersection
 * @param itemsA
 * @param itemsB
 */

function intersection(itemsA, itemsB) {
  return itemsA.filter(t => itemsB.indexOf(t) > -1);
}

const INIT_COORDS = 'dnd-core/INIT_COORDS';
const BEGIN_DRAG = 'dnd-core/BEGIN_DRAG';
const PUBLISH_DRAG_SOURCE = 'dnd-core/PUBLISH_DRAG_SOURCE';
const HOVER = 'dnd-core/HOVER';
const DROP = 'dnd-core/DROP';
const END_DRAG = 'dnd-core/END_DRAG';

function setClientOffset(clientOffset, sourceClientOffset) {
  return {
    type: INIT_COORDS,
    payload: {
      sourceClientOffset: sourceClientOffset || null,
      clientOffset: clientOffset || null
    }
  };
}

const ResetCoordinatesAction = {
  type: INIT_COORDS,
  payload: {
    clientOffset: null,
    sourceClientOffset: null
  }
};
function createBeginDrag(manager) {
  return function beginDrag(sourceIds = [], options = {
    publishSource: true
  }) {
    const {
      publishSource = true,
      clientOffset,
      getSourceClientOffset
    } = options;
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry(); // Initialize the coordinates using the client offset

    manager.dispatch(setClientOffset(clientOffset));
    verifyInvariants$1(sourceIds, monitor, registry); // Get the draggable source

    const sourceId = getDraggableSource(sourceIds, monitor);

    if (sourceId == null) {
      manager.dispatch(ResetCoordinatesAction);
      return;
    } // Get the source client offset


    let sourceClientOffset = null;

    if (clientOffset) {
      if (!getSourceClientOffset) {
        throw new Error('getSourceClientOffset must be defined');
      }

      verifyGetSourceClientOffsetIsFunction(getSourceClientOffset);
      sourceClientOffset = getSourceClientOffset(sourceId);
    } // Initialize the full coordinates


    manager.dispatch(setClientOffset(clientOffset, sourceClientOffset));
    const source = registry.getSource(sourceId);
    const item = source.beginDrag(monitor, sourceId); // If source.beginDrag returns null, this is an indicator to cancel the drag

    if (item == null) {
      return undefined;
    }

    verifyItemIsObject(item);
    registry.pinSource(sourceId);
    const itemType = registry.getSourceType(sourceId);
    return {
      type: BEGIN_DRAG,
      payload: {
        itemType,
        item,
        sourceId,
        clientOffset: clientOffset || null,
        sourceClientOffset: sourceClientOffset || null,
        isSourcePublic: !!publishSource
      }
    };
  };
}

function verifyInvariants$1(sourceIds, monitor, registry) {
  invariant(!monitor.isDragging(), 'Cannot call beginDrag while dragging.');
  sourceIds.forEach(function (sourceId) {
    invariant(registry.getSource(sourceId), 'Expected sourceIds to be registered.');
  });
}

function verifyGetSourceClientOffsetIsFunction(getSourceClientOffset) {
  invariant(typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
}

function verifyItemIsObject(item) {
  invariant(isObject(item), 'Item must be an object.');
}

function getDraggableSource(sourceIds, monitor) {
  let sourceId = null;

  for (let i = sourceIds.length - 1; i >= 0; i--) {
    if (monitor.canDragSource(sourceIds[i])) {
      sourceId = sourceIds[i];
      break;
    }
  }

  return sourceId;
}

function _defineProperty$4(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread$4(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty$4(target, key, source[key]);
    });
  }

  return target;
}
function createDrop(manager) {
  return function drop(options = {}) {
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    verifyInvariants(monitor);
    const targetIds = getDroppableTargets(monitor); // Multiple actions are dispatched here, which is why this doesn't return an action

    targetIds.forEach((targetId, index) => {
      const dropResult = determineDropResult(targetId, index, registry, monitor);
      const action = {
        type: DROP,
        payload: {
          dropResult: _objectSpread$4({}, options, dropResult)
        }
      };
      manager.dispatch(action);
    });
  };
}

function verifyInvariants(monitor) {
  invariant(monitor.isDragging(), 'Cannot call drop while not dragging.');
  invariant(!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');
}

function determineDropResult(targetId, index, registry, monitor) {
  const target = registry.getTarget(targetId);
  let dropResult = target ? target.drop(monitor, targetId) : undefined;
  verifyDropResultType(dropResult);

  if (typeof dropResult === 'undefined') {
    dropResult = index === 0 ? {} : monitor.getDropResult();
  }

  return dropResult;
}

function verifyDropResultType(dropResult) {
  invariant(typeof dropResult === 'undefined' || isObject(dropResult), 'Drop result must either be an object or undefined.');
}

function getDroppableTargets(monitor) {
  const targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);
  targetIds.reverse();
  return targetIds;
}

function createEndDrag(manager) {
  return function endDrag() {
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    verifyIsDragging(monitor);
    const sourceId = monitor.getSourceId();

    if (sourceId != null) {
      const source = registry.getSource(sourceId, true);
      source.endDrag(monitor, sourceId);
      registry.unpinSource();
    }

    return {
      type: END_DRAG
    };
  };
}

function verifyIsDragging(monitor) {
  invariant(monitor.isDragging(), 'Cannot call endDrag while not dragging.');
}

function matchesType(targetType, draggedItemType) {
  if (draggedItemType === null) {
    return targetType === null;
  }

  return Array.isArray(targetType) ? targetType.some(t => t === draggedItemType) : targetType === draggedItemType;
}

function createHover(manager) {
  return function hover(targetIdsArg, {
    clientOffset
  } = {}) {
    verifyTargetIdsIsArray(targetIdsArg);
    const targetIds = targetIdsArg.slice(0);
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    const draggedItemType = monitor.getItemType();
    removeNonMatchingTargetIds(targetIds, registry, draggedItemType);
    checkInvariants(targetIds, monitor, registry);
    hoverAllTargets(targetIds, monitor, registry);
    return {
      type: HOVER,
      payload: {
        targetIds,
        clientOffset: clientOffset || null
      }
    };
  };
}

function verifyTargetIdsIsArray(targetIdsArg) {
  invariant(Array.isArray(targetIdsArg), 'Expected targetIds to be an array.');
}

function checkInvariants(targetIds, monitor, registry) {
  invariant(monitor.isDragging(), 'Cannot call hover while not dragging.');
  invariant(!monitor.didDrop(), 'Cannot call hover after drop.');

  for (let i = 0; i < targetIds.length; i++) {
    const targetId = targetIds[i];
    invariant(targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');
    const target = registry.getTarget(targetId);
    invariant(target, 'Expected targetIds to be registered.');
  }
}

function removeNonMatchingTargetIds(targetIds, registry, draggedItemType) {
  // Remove those targetIds that don't match the targetType.  This
  // fixes shallow isOver which would only be non-shallow because of
  // non-matching targets.
  for (let i = targetIds.length - 1; i >= 0; i--) {
    const targetId = targetIds[i];
    const targetType = registry.getTargetType(targetId);

    if (!matchesType(targetType, draggedItemType)) {
      targetIds.splice(i, 1);
    }
  }
}

function hoverAllTargets(targetIds, monitor, registry) {
  // Finally call hover on all matching targets.
  targetIds.forEach(function (targetId) {
    const target = registry.getTarget(targetId);
    target.hover(monitor, targetId);
  });
}

function createPublishDragSource(manager) {
  return function publishDragSource() {
    const monitor = manager.getMonitor();

    if (monitor.isDragging()) {
      return {
        type: PUBLISH_DRAG_SOURCE
      };
    }

    return;
  };
}

function createDragDropActions(manager) {
  return {
    beginDrag: createBeginDrag(manager),
    publishDragSource: createPublishDragSource(manager),
    hover: createHover(manager),
    drop: createDrop(manager),
    endDrag: createEndDrag(manager)
  };
}

class DragDropManagerImpl {
  receiveBackend(backend) {
    this.backend = backend;
  }

  getMonitor() {
    return this.monitor;
  }

  getBackend() {
    return this.backend;
  }

  getRegistry() {
    return this.monitor.registry;
  }

  getActions() {
    /* eslint-disable-next-line @typescript-eslint/no-this-alias */
    const manager = this;
    const {
      dispatch
    } = this.store;

    function bindActionCreator(actionCreator) {
      return (...args) => {
        const action = actionCreator.apply(manager, args);

        if (typeof action !== 'undefined') {
          dispatch(action);
        }
      };
    }

    const actions = createDragDropActions(this);
    return Object.keys(actions).reduce((boundActions, key) => {
      const action = actions[key];
      boundActions[key] = bindActionCreator(action);
      return boundActions;
    }, {});
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  constructor(store, monitor) {
    this.isSetUp = false;

    this.handleRefCountChange = () => {
      const shouldSetUp = this.store.getState().refCount > 0;

      if (this.backend) {
        if (shouldSetUp && !this.isSetUp) {
          this.backend.setup();
          this.isSetUp = true;
        } else if (!shouldSetUp && this.isSetUp) {
          this.backend.teardown();
          this.isSetUp = false;
        }
      }
    };

    this.store = store;
    this.monitor = monitor;
    store.subscribe(this.handleRefCountChange);
  }

}

/**
 * Coordinate addition
 * @param a The first coordinate
 * @param b The second coordinate
 */
function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}
/**
 * Coordinate subtraction
 * @param a The first coordinate
 * @param b The second coordinate
 */

function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}
/**
 * Returns the cartesian distance of the drag source component's position, based on its position
 * at the time when the current drag operation has started, and the movement difference.
 *
 * Returns null if no item is being dragged.
 *
 * @param state The offset state to compute from
 */

function getSourceClientOffset(state) {
  const {
    clientOffset,
    initialClientOffset,
    initialSourceClientOffset
  } = state;

  if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
    return null;
  }

  return subtract(add(clientOffset, initialSourceClientOffset), initialClientOffset);
}
/**
 * Determines the x,y offset between the client offset and the initial client offset
 *
 * @param state The offset state to compute from
 */

function getDifferenceFromInitialOffset(state) {
  const {
    clientOffset,
    initialClientOffset
  } = state;

  if (!clientOffset || !initialClientOffset) {
    return null;
  }

  return subtract(clientOffset, initialClientOffset);
}

const NONE = [];
const ALL = [];
NONE.__IS_NONE__ = true;
ALL.__IS_ALL__ = true;
/**
 * Determines if the given handler IDs are dirty or not.
 *
 * @param dirtyIds The set of dirty handler ids
 * @param handlerIds The set of handler ids to check
 */

function areDirty(dirtyIds, handlerIds) {
  if (dirtyIds === NONE) {
    return false;
  }

  if (dirtyIds === ALL || typeof handlerIds === 'undefined') {
    return true;
  }

  const commonIds = intersection(handlerIds, dirtyIds);
  return commonIds.length > 0;
}

class DragDropMonitorImpl {
  subscribeToStateChange(listener, options = {}) {
    const {
      handlerIds
    } = options;
    invariant(typeof listener === 'function', 'listener must be a function.');
    invariant(typeof handlerIds === 'undefined' || Array.isArray(handlerIds), 'handlerIds, when specified, must be an array of strings.');
    let prevStateId = this.store.getState().stateId;

    const handleChange = () => {
      const state = this.store.getState();
      const currentStateId = state.stateId;

      try {
        const canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !areDirty(state.dirtyHandlerIds, handlerIds);

        if (!canSkipListener) {
          listener();
        }
      } finally {
        prevStateId = currentStateId;
      }
    };

    return this.store.subscribe(handleChange);
  }

  subscribeToOffsetChange(listener) {
    invariant(typeof listener === 'function', 'listener must be a function.');
    let previousState = this.store.getState().dragOffset;

    const handleChange = () => {
      const nextState = this.store.getState().dragOffset;

      if (nextState === previousState) {
        return;
      }

      previousState = nextState;
      listener();
    };

    return this.store.subscribe(handleChange);
  }

  canDragSource(sourceId) {
    if (!sourceId) {
      return false;
    }

    const source = this.registry.getSource(sourceId);
    invariant(source, `Expected to find a valid source. sourceId=${sourceId}`);

    if (this.isDragging()) {
      return false;
    }

    return source.canDrag(this, sourceId);
  }

  canDropOnTarget(targetId) {
    // undefined on initial render
    if (!targetId) {
      return false;
    }

    const target = this.registry.getTarget(targetId);
    invariant(target, `Expected to find a valid target. targetId=${targetId}`);

    if (!this.isDragging() || this.didDrop()) {
      return false;
    }

    const targetType = this.registry.getTargetType(targetId);
    const draggedItemType = this.getItemType();
    return matchesType(targetType, draggedItemType) && target.canDrop(this, targetId);
  }

  isDragging() {
    return Boolean(this.getItemType());
  }

  isDraggingSource(sourceId) {
    // undefined on initial render
    if (!sourceId) {
      return false;
    }

    const source = this.registry.getSource(sourceId, true);
    invariant(source, `Expected to find a valid source. sourceId=${sourceId}`);

    if (!this.isDragging() || !this.isSourcePublic()) {
      return false;
    }

    const sourceType = this.registry.getSourceType(sourceId);
    const draggedItemType = this.getItemType();

    if (sourceType !== draggedItemType) {
      return false;
    }

    return source.isDragging(this, sourceId);
  }

  isOverTarget(targetId, options = {
    shallow: false
  }) {
    // undefined on initial render
    if (!targetId) {
      return false;
    }

    const {
      shallow
    } = options;

    if (!this.isDragging()) {
      return false;
    }

    const targetType = this.registry.getTargetType(targetId);
    const draggedItemType = this.getItemType();

    if (draggedItemType && !matchesType(targetType, draggedItemType)) {
      return false;
    }

    const targetIds = this.getTargetIds();

    if (!targetIds.length) {
      return false;
    }

    const index = targetIds.indexOf(targetId);

    if (shallow) {
      return index === targetIds.length - 1;
    } else {
      return index > -1;
    }
  }

  getItemType() {
    return this.store.getState().dragOperation.itemType;
  }

  getItem() {
    return this.store.getState().dragOperation.item;
  }

  getSourceId() {
    return this.store.getState().dragOperation.sourceId;
  }

  getTargetIds() {
    return this.store.getState().dragOperation.targetIds;
  }

  getDropResult() {
    return this.store.getState().dragOperation.dropResult;
  }

  didDrop() {
    return this.store.getState().dragOperation.didDrop;
  }

  isSourcePublic() {
    return Boolean(this.store.getState().dragOperation.isSourcePublic);
  }

  getInitialClientOffset() {
    return this.store.getState().dragOffset.initialClientOffset;
  }

  getInitialSourceClientOffset() {
    return this.store.getState().dragOffset.initialSourceClientOffset;
  }

  getClientOffset() {
    return this.store.getState().dragOffset.clientOffset;
  }

  getSourceClientOffset() {
    return getSourceClientOffset(this.store.getState().dragOffset);
  }

  getDifferenceFromInitialOffset() {
    return getDifferenceFromInitialOffset(this.store.getState().dragOffset);
  }

  constructor(store, registry) {
    this.store = store;
    this.registry = registry;
  }

}

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
const scope = typeof global !== 'undefined' ? global : self;
const BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;
function makeRequestCallFromTimer(callback) {
  return function requestCall() {
    // We dispatch a timeout with a specified delay of 0 for engines that
    // can reliably accommodate that request. This will usually be snapped
    // to a 4 milisecond delay, but once we're flushing, there's no delay
    // between events.
    const timeoutHandle = setTimeout(handleTimer, 0); // However, since this timer gets frequently dropped in Firefox
    // workers, we enlist an interval handle that will try to fire
    // an event 20 times per second until it succeeds.

    const intervalHandle = setInterval(handleTimer, 50);

    function handleTimer() {
      // Whichever timer succeeds will cancel both timers and
      // execute the callback.
      clearTimeout(timeoutHandle);
      clearInterval(intervalHandle);
      callback();
    }
  };
} // To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".

function makeRequestCallFromMutationObserver(callback) {
  let toggle = 1;
  const observer = new BrowserMutationObserver(callback);
  const node = document.createTextNode('');
  observer.observe(node, {
    characterData: true
  });
  return function requestCall() {
    toggle = -toggle;
    node.data = toggle;
  };
}
const makeRequestCall = typeof BrowserMutationObserver === 'function' ? // reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
makeRequestCallFromMutationObserver : // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.
// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396
// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
makeRequestCallFromTimer;

/* eslint-disable no-restricted-globals, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-non-null-assertion */
class AsapQueue {
  // Use the fastest means possible to execute a task in its own turn, with
  // priority over other events including IO, animation, reflow, and redraw
  // events in browsers.
  //
  // An exception thrown by a task will permanently interrupt the processing of
  // subsequent tasks. The higher level `asap` function ensures that if an
  // exception is thrown by a task, that the task queue will continue flushing as
  // soon as possible, but if you use `rawAsap` directly, you are responsible to
  // either ensure that no exceptions are thrown from your task, or to manually
  // call `rawAsap.requestFlush` if an exception is thrown.
  enqueueTask(task) {
    const {
      queue: q,
      requestFlush
    } = this;

    if (!q.length) {
      requestFlush();
      this.flushing = true;
    } // Equivalent to push, but avoids a function call.


    q[q.length] = task;
  }

  constructor() {
    this.queue = []; // We queue errors to ensure they are thrown in right order (FIFO).
    // Array-as-queue is good enough here, since we are just dealing with exceptions.

    this.pendingErrors = []; // Once a flush has been requested, no further calls to `requestFlush` are
    // necessary until the next `flush` completes.
    // @ts-ignore

    this.flushing = false; // The position of the next task to execute in the task queue. This is
    // preserved between calls to `flush` so that it can be resumed if
    // a task throws an exception.

    this.index = 0; // If a task schedules additional tasks recursively, the task queue can grow
    // unbounded. To prevent memory exhaustion, the task queue will periodically
    // truncate already-completed tasks.

    this.capacity = 1024; // The flush function processes all tasks that have been scheduled with
    // `rawAsap` unless and until one of those tasks throws an exception.
    // If a task throws an exception, `flush` ensures that its state will remain
    // consistent and will resume where it left off when called again.
    // However, `flush` does not make any arrangements to be called again if an
    // exception is thrown.

    this.flush = () => {
      const {
        queue: q
      } = this;

      while (this.index < q.length) {
        const currentIndex = this.index; // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.

        this.index++;
        q[currentIndex].call(); // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.

        if (this.index > this.capacity) {
          // Manually shift all values starting at the index back to the
          // beginning of the queue.
          for (let scan = 0, newLength = q.length - this.index; scan < newLength; scan++) {
            q[scan] = q[scan + this.index];
          }

          q.length -= this.index;
          this.index = 0;
        }
      }

      q.length = 0;
      this.index = 0;
      this.flushing = false;
    }; // In a web browser, exceptions are not fatal. However, to avoid
    // slowing down the queue of pending tasks, we rethrow the error in a
    // lower priority turn.


    this.registerPendingError = err => {
      this.pendingErrors.push(err);
      this.requestErrorThrow();
    }; // `requestFlush` requests that the high priority event queue be flushed as
    // soon as possible.
    // This is useful to prevent an error thrown in a task from stalling the event
    // queue if the exception handled by Node.js’s
    // `process.on("uncaughtException")` or by a domain.
    // `requestFlush` is implemented using a strategy based on data collected from
    // every available SauceLabs Selenium web driver worker at time of writing.
    // https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593


    this.requestFlush = makeRequestCall(this.flush);
    this.requestErrorThrow = makeRequestCallFromTimer(() => {
      // Throw first error
      if (this.pendingErrors.length) {
        throw this.pendingErrors.shift();
      }
    });
  }

} // The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html
// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.
// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }
// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.
// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }
// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.
// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.
// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// // its existence.
// rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer
// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

// `call`, just like a function.
class RawTask {
  call() {
    try {
      this.task && this.task();
    } catch (error) {
      this.onError(error);
    } finally {
      this.task = null;
      this.release(this);
    }
  }

  constructor(onError, release) {
    this.onError = onError;
    this.release = release;
    this.task = null;
  }

}

class TaskFactory {
  create(task) {
    const tasks = this.freeTasks;
    const t1 = tasks.length ? tasks.pop() : new RawTask(this.onError, t => tasks[tasks.length] = t);
    t1.task = task;
    return t1;
  }

  constructor(onError) {
    this.onError = onError;
    this.freeTasks = [];
  }

}

const asapQueue = new AsapQueue();
const taskFactory = new TaskFactory(asapQueue.registerPendingError);
/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */

function asap(task) {
  asapQueue.enqueueTask(taskFactory.create(task));
}

const ADD_SOURCE = 'dnd-core/ADD_SOURCE';
const ADD_TARGET = 'dnd-core/ADD_TARGET';
const REMOVE_SOURCE = 'dnd-core/REMOVE_SOURCE';
const REMOVE_TARGET = 'dnd-core/REMOVE_TARGET';
function addSource(sourceId) {
  return {
    type: ADD_SOURCE,
    payload: {
      sourceId
    }
  };
}
function addTarget(targetId) {
  return {
    type: ADD_TARGET,
    payload: {
      targetId
    }
  };
}
function removeSource(sourceId) {
  return {
    type: REMOVE_SOURCE,
    payload: {
      sourceId
    }
  };
}
function removeTarget(targetId) {
  return {
    type: REMOVE_TARGET,
    payload: {
      targetId
    }
  };
}

function validateSourceContract(source) {
  invariant(typeof source.canDrag === 'function', 'Expected canDrag to be a function.');
  invariant(typeof source.beginDrag === 'function', 'Expected beginDrag to be a function.');
  invariant(typeof source.endDrag === 'function', 'Expected endDrag to be a function.');
}
function validateTargetContract(target) {
  invariant(typeof target.canDrop === 'function', 'Expected canDrop to be a function.');
  invariant(typeof target.hover === 'function', 'Expected hover to be a function.');
  invariant(typeof target.drop === 'function', 'Expected beginDrag to be a function.');
}
function validateType(type, allowArray) {
  if (allowArray && Array.isArray(type)) {
    type.forEach(t => validateType(t, false));
    return;
  }

  invariant(typeof type === 'string' || typeof type === 'symbol', allowArray ? 'Type can only be a string, a symbol, or an array of either.' : 'Type can only be a string or a symbol.');
}

var HandlerRole;

(function (HandlerRole) {
  HandlerRole["SOURCE"] = "SOURCE";
  HandlerRole["TARGET"] = "TARGET";
})(HandlerRole || (HandlerRole = {}));

let nextUniqueId = 0;
function getNextUniqueId() {
  return nextUniqueId++;
}

function getNextHandlerId(role) {
  const id = getNextUniqueId().toString();

  switch (role) {
    case HandlerRole.SOURCE:
      return `S${id}`;

    case HandlerRole.TARGET:
      return `T${id}`;

    default:
      throw new Error(`Unknown Handler Role: ${role}`);
  }
}

function parseRoleFromHandlerId(handlerId) {
  switch (handlerId[0]) {
    case 'S':
      return HandlerRole.SOURCE;

    case 'T':
      return HandlerRole.TARGET;

    default:
      throw new Error(`Cannot parse handler ID: ${handlerId}`);
  }
}

function mapContainsValue(map, searchValue) {
  const entries = map.entries();
  let isDone = false;

  do {
    const {
      done,
      value: [, value]
    } = entries.next();

    if (value === searchValue) {
      return true;
    }

    isDone = !!done;
  } while (!isDone);

  return false;
}

class HandlerRegistryImpl {
  addSource(type, source) {
    validateType(type);
    validateSourceContract(source);
    const sourceId = this.addHandler(HandlerRole.SOURCE, type, source);
    this.store.dispatch(addSource(sourceId));
    return sourceId;
  }

  addTarget(type, target) {
    validateType(type, true);
    validateTargetContract(target);
    const targetId = this.addHandler(HandlerRole.TARGET, type, target);
    this.store.dispatch(addTarget(targetId));
    return targetId;
  }

  containsHandler(handler) {
    return mapContainsValue(this.dragSources, handler) || mapContainsValue(this.dropTargets, handler);
  }

  getSource(sourceId, includePinned = false) {
    invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
    const isPinned = includePinned && sourceId === this.pinnedSourceId;
    const source = isPinned ? this.pinnedSource : this.dragSources.get(sourceId);
    return source;
  }

  getTarget(targetId) {
    invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
    return this.dropTargets.get(targetId);
  }

  getSourceType(sourceId) {
    invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
    return this.types.get(sourceId);
  }

  getTargetType(targetId) {
    invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
    return this.types.get(targetId);
  }

  isSourceId(handlerId) {
    const role = parseRoleFromHandlerId(handlerId);
    return role === HandlerRole.SOURCE;
  }

  isTargetId(handlerId) {
    const role = parseRoleFromHandlerId(handlerId);
    return role === HandlerRole.TARGET;
  }

  removeSource(sourceId) {
    invariant(this.getSource(sourceId), 'Expected an existing source.');
    this.store.dispatch(removeSource(sourceId));
    asap(() => {
      this.dragSources.delete(sourceId);
      this.types.delete(sourceId);
    });
  }

  removeTarget(targetId) {
    invariant(this.getTarget(targetId), 'Expected an existing target.');
    this.store.dispatch(removeTarget(targetId));
    this.dropTargets.delete(targetId);
    this.types.delete(targetId);
  }

  pinSource(sourceId) {
    const source = this.getSource(sourceId);
    invariant(source, 'Expected an existing source.');
    this.pinnedSourceId = sourceId;
    this.pinnedSource = source;
  }

  unpinSource() {
    invariant(this.pinnedSource, 'No source is pinned at the time.');
    this.pinnedSourceId = null;
    this.pinnedSource = null;
  }

  addHandler(role, type, handler) {
    const id = getNextHandlerId(role);
    this.types.set(id, type);

    if (role === HandlerRole.SOURCE) {
      this.dragSources.set(id, handler);
    } else if (role === HandlerRole.TARGET) {
      this.dropTargets.set(id, handler);
    }

    return id;
  }

  constructor(store) {
    this.types = new Map();
    this.dragSources = new Map();
    this.dropTargets = new Map();
    this.pinnedSourceId = null;
    this.pinnedSource = null;
    this.store = store;
  }

}

const strictEquality = (a, b) => a === b;
/**
 * Determine if two cartesian coordinate offsets are equal
 * @param offsetA
 * @param offsetB
 */

function areCoordsEqual(offsetA, offsetB) {
  if (!offsetA && !offsetB) {
    return true;
  } else if (!offsetA || !offsetB) {
    return false;
  } else {
    return offsetA.x === offsetB.x && offsetA.y === offsetB.y;
  }
}
/**
 * Determines if two arrays of items are equal
 * @param a The first array of items
 * @param b The second array of items
 */

function areArraysEqual(a, b, isEqual = strictEquality) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if (!isEqual(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

function reduce$5( // eslint-disable-next-line @typescript-eslint/no-unused-vars
_state = NONE, action) {
  switch (action.type) {
    case HOVER:
      break;

    case ADD_SOURCE:
    case ADD_TARGET:
    case REMOVE_TARGET:
    case REMOVE_SOURCE:
      return NONE;

    case BEGIN_DRAG:
    case PUBLISH_DRAG_SOURCE:
    case END_DRAG:
    case DROP:
    default:
      return ALL;
  }

  const {
    targetIds = [],
    prevTargetIds = []
  } = action.payload;
  const result = xor(targetIds, prevTargetIds);
  const didChange = result.length > 0 || !areArraysEqual(targetIds, prevTargetIds);

  if (!didChange) {
    return NONE;
  } // Check the target ids at the innermost position. If they are valid, add them
  // to the result


  const prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
  const innermostTargetId = targetIds[targetIds.length - 1];

  if (prevInnermostTargetId !== innermostTargetId) {
    if (prevInnermostTargetId) {
      result.push(prevInnermostTargetId);
    }

    if (innermostTargetId) {
      result.push(innermostTargetId);
    }
  }

  return result;
}

function _defineProperty$3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread$3(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty$3(target, key, source[key]);
    });
  }

  return target;
}
const initialState$1 = {
  initialSourceClientOffset: null,
  initialClientOffset: null,
  clientOffset: null
};
function reduce$4(state = initialState$1, action) {
  const {
    payload
  } = action;

  switch (action.type) {
    case INIT_COORDS:
    case BEGIN_DRAG:
      return {
        initialSourceClientOffset: payload.sourceClientOffset,
        initialClientOffset: payload.clientOffset,
        clientOffset: payload.clientOffset
      };

    case HOVER:
      if (areCoordsEqual(state.clientOffset, payload.clientOffset)) {
        return state;
      }

      return _objectSpread$3({}, state, {
        clientOffset: payload.clientOffset
      });

    case END_DRAG:
    case DROP:
      return initialState$1;

    default:
      return state;
  }
}

function _defineProperty$2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread$2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty$2(target, key, source[key]);
    });
  }

  return target;
}
const initialState = {
  itemType: null,
  item: null,
  sourceId: null,
  targetIds: [],
  dropResult: null,
  didDrop: false,
  isSourcePublic: null
};
function reduce$3(state = initialState, action) {
  const {
    payload
  } = action;

  switch (action.type) {
    case BEGIN_DRAG:
      return _objectSpread$2({}, state, {
        itemType: payload.itemType,
        item: payload.item,
        sourceId: payload.sourceId,
        isSourcePublic: payload.isSourcePublic,
        dropResult: null,
        didDrop: false
      });

    case PUBLISH_DRAG_SOURCE:
      return _objectSpread$2({}, state, {
        isSourcePublic: true
      });

    case HOVER:
      return _objectSpread$2({}, state, {
        targetIds: payload.targetIds
      });

    case REMOVE_TARGET:
      if (state.targetIds.indexOf(payload.targetId) === -1) {
        return state;
      }

      return _objectSpread$2({}, state, {
        targetIds: without$1(state.targetIds, payload.targetId)
      });

    case DROP:
      return _objectSpread$2({}, state, {
        dropResult: payload.dropResult,
        didDrop: true,
        targetIds: []
      });

    case END_DRAG:
      return _objectSpread$2({}, state, {
        itemType: null,
        item: null,
        sourceId: null,
        dropResult: null,
        didDrop: false,
        isSourcePublic: null,
        targetIds: []
      });

    default:
      return state;
  }
}

function reduce$2(state = 0, action) {
  switch (action.type) {
    case ADD_SOURCE:
    case ADD_TARGET:
      return state + 1;

    case REMOVE_SOURCE:
    case REMOVE_TARGET:
      return state - 1;

    default:
      return state;
  }
}

function reduce$1(state = 0) {
  return state + 1;
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty$1(target, key, source[key]);
    });
  }

  return target;
}
function reduce(state = {}, action) {
  return {
    dirtyHandlerIds: reduce$5(state.dirtyHandlerIds, {
      type: action.type,
      payload: _objectSpread$1({}, action.payload, {
        prevTargetIds: get(state, 'dragOperation.targetIds', [])
      })
    }),
    dragOffset: reduce$4(state.dragOffset, action),
    refCount: reduce$2(state.refCount, action),
    dragOperation: reduce$3(state.dragOperation, action),
    stateId: reduce$1(state.stateId)
  };
}

function createDragDropManager(backendFactory, globalContext = undefined, backendOptions = {}, debugMode = false) {
  const store = makeStoreInstance(debugMode);
  const monitor = new DragDropMonitorImpl(store, new HandlerRegistryImpl(store));
  const manager = new DragDropManagerImpl(store, monitor);
  const backend = backendFactory(manager, globalContext, backendOptions);
  manager.receiveBackend(backend);
  return manager;
}

function makeStoreInstance(debugMode) {
  // TODO: if we ever make a react-native version of this,
  // we'll need to consider how to pull off dev-tooling
  const reduxDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;
  return createStore(reduce, debugMode && reduxDevTools && reduxDevTools({
    name: 'dnd-core',
    instanceId: 'dnd-core'
  }));
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
let refCount = 0;
const INSTANCE_SYM = Symbol.for('__REACT_DND_CONTEXT_INSTANCE__');
var DndProvider = /*#__PURE__*/React.memo(function DndProvider(_param) {
  var {
    children
  } = _param,
      props = _objectWithoutProperties(_param, ["children"]);

  const [manager, isGlobalInstance] = getDndContextValue(props) // memoized from props
  ;
  /**
  * If the global context was used to store the DND context
  * then where theres no more references to it we should
  * clean it up to avoid memory leaks
  */

  React.useEffect(() => {
    if (isGlobalInstance) {
      const context = getGlobalContext();
      ++refCount;
      return () => {
        if (--refCount === 0) {
          context[INSTANCE_SYM] = null;
        }
      };
    }

    return;
  }, []);
  return /*#__PURE__*/jsxRuntime.jsx(DndContext.Provider, {
    value: manager,
    children: children
  });
});

function getDndContextValue(props) {
  if ('manager' in props) {
    const manager = {
      dragDropManager: props.manager
    };
    return [manager, false];
  }

  const manager = createSingletonDndContext(props.backend, props.context, props.options, props.debugMode);
  const isGlobalInstance = !props.context;
  return [manager, isGlobalInstance];
}

function createSingletonDndContext(backend, context = getGlobalContext(), options, debugMode) {
  const ctx = context;

  if (!ctx[INSTANCE_SYM]) {
    ctx[INSTANCE_SYM] = {
      dragDropManager: createDragDropManager(backend, context, options, debugMode)
    };
  }

  return ctx[INSTANCE_SYM];
}

function getGlobalContext() {
  return typeof global !== 'undefined' ? global : window;
}

var fastDeepEqual = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;
    var length, i, keys;

    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;

      for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;

      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  } // true if both NaN, false otherwise


  return a !== a && b !== b;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 *
 * @param monitor The monitor to collect state from
 * @param collect The collecting function
 * @param onUpdate A method to invoke when updates occur
 */

function useCollector(monitor, collect, onUpdate) {
  const [collected, setCollected] = React.useState(() => collect(monitor));
  const updateCollected = React.useCallback(() => {
    const nextValue = collect(monitor); // This needs to be a deep-equality check because some monitor-collected values
    // include XYCoord objects that may be equivalent, but do not have instance equality.

    if (!fastDeepEqual(collected, nextValue)) {
      setCollected(nextValue);

      if (onUpdate) {
        onUpdate();
      }
    }
  }, [collected, monitor, onUpdate]); // update the collected properties after react renders.
  // Note that the "Dustbin Stress Test" fails if this is not
  // done when the component updates

  useIsomorphicLayoutEffect(updateCollected);
  return [collected, updateCollected];
}

function useMonitorOutput(monitor, collect, onCollect) {
  const [collected, updateCollected] = useCollector(monitor, collect, onCollect);
  useIsomorphicLayoutEffect(function subscribeToMonitorStateChange() {
    const handlerId = monitor.getHandlerId();

    if (handlerId == null) {
      return;
    }

    return monitor.subscribeToStateChange(updateCollected, {
      handlerIds: [handlerId]
    });
  }, [monitor, updateCollected]);
  return collected;
}

function useCollectedProps(collector, monitor, connector) {
  return useMonitorOutput(monitor, collector || (() => ({})), () => connector.reconnect());
}

function useOptionalFactory(arg, deps) {
  const memoDeps = [...(deps || [])];

  if (deps == null && typeof arg !== 'function') {
    memoDeps.push(arg);
  }

  return React.useMemo(() => {
    return typeof arg === 'function' ? arg() : arg;
  }, memoDeps);
}

function useConnectDragSource(connector) {
  return React.useMemo(() => connector.hooks.dragSource(), [connector]);
}
function useConnectDragPreview(connector) {
  return React.useMemo(() => connector.hooks.dragPreview(), [connector]);
}

let isCallingCanDrag = false;
let isCallingIsDragging = false;
class DragSourceMonitorImpl {
  receiveHandlerId(sourceId) {
    this.sourceId = sourceId;
  }

  getHandlerId() {
    return this.sourceId;
  }

  canDrag() {
    invariant(!isCallingCanDrag, 'You may not call monitor.canDrag() inside your canDrag() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor');

    try {
      isCallingCanDrag = true;
      return this.internalMonitor.canDragSource(this.sourceId);
    } finally {
      isCallingCanDrag = false;
    }
  }

  isDragging() {
    if (!this.sourceId) {
      return false;
    }

    invariant(!isCallingIsDragging, 'You may not call monitor.isDragging() inside your isDragging() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor');

    try {
      isCallingIsDragging = true;
      return this.internalMonitor.isDraggingSource(this.sourceId);
    } finally {
      isCallingIsDragging = false;
    }
  }

  subscribeToStateChange(listener, options) {
    return this.internalMonitor.subscribeToStateChange(listener, options);
  }

  isDraggingSource(sourceId) {
    return this.internalMonitor.isDraggingSource(sourceId);
  }

  isOverTarget(targetId, options) {
    return this.internalMonitor.isOverTarget(targetId, options);
  }

  getTargetIds() {
    return this.internalMonitor.getTargetIds();
  }

  isSourcePublic() {
    return this.internalMonitor.isSourcePublic();
  }

  getSourceId() {
    return this.internalMonitor.getSourceId();
  }

  subscribeToOffsetChange(listener) {
    return this.internalMonitor.subscribeToOffsetChange(listener);
  }

  canDragSource(sourceId) {
    return this.internalMonitor.canDragSource(sourceId);
  }

  canDropOnTarget(targetId) {
    return this.internalMonitor.canDropOnTarget(targetId);
  }

  getItemType() {
    return this.internalMonitor.getItemType();
  }

  getItem() {
    return this.internalMonitor.getItem();
  }

  getDropResult() {
    return this.internalMonitor.getDropResult();
  }

  didDrop() {
    return this.internalMonitor.didDrop();
  }

  getInitialClientOffset() {
    return this.internalMonitor.getInitialClientOffset();
  }

  getInitialSourceClientOffset() {
    return this.internalMonitor.getInitialSourceClientOffset();
  }

  getSourceClientOffset() {
    return this.internalMonitor.getSourceClientOffset();
  }

  getClientOffset() {
    return this.internalMonitor.getClientOffset();
  }

  getDifferenceFromInitialOffset() {
    return this.internalMonitor.getDifferenceFromInitialOffset();
  }

  constructor(manager) {
    this.sourceId = null;
    this.internalMonitor = manager.getMonitor();
  }

}

let isCallingCanDrop = false;
class DropTargetMonitorImpl {
  receiveHandlerId(targetId) {
    this.targetId = targetId;
  }

  getHandlerId() {
    return this.targetId;
  }

  subscribeToStateChange(listener, options) {
    return this.internalMonitor.subscribeToStateChange(listener, options);
  }

  canDrop() {
    // Cut out early if the target id has not been set. This should prevent errors
    // where the user has an older version of dnd-core like in
    // https://github.com/react-dnd/react-dnd/issues/1310
    if (!this.targetId) {
      return false;
    }

    invariant(!isCallingCanDrop, 'You may not call monitor.canDrop() inside your canDrop() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor');

    try {
      isCallingCanDrop = true;
      return this.internalMonitor.canDropOnTarget(this.targetId);
    } finally {
      isCallingCanDrop = false;
    }
  }

  isOver(options) {
    if (!this.targetId) {
      return false;
    }

    return this.internalMonitor.isOverTarget(this.targetId, options);
  }

  getItemType() {
    return this.internalMonitor.getItemType();
  }

  getItem() {
    return this.internalMonitor.getItem();
  }

  getDropResult() {
    return this.internalMonitor.getDropResult();
  }

  didDrop() {
    return this.internalMonitor.didDrop();
  }

  getInitialClientOffset() {
    return this.internalMonitor.getInitialClientOffset();
  }

  getInitialSourceClientOffset() {
    return this.internalMonitor.getInitialSourceClientOffset();
  }

  getSourceClientOffset() {
    return this.internalMonitor.getSourceClientOffset();
  }

  getClientOffset() {
    return this.internalMonitor.getClientOffset();
  }

  getDifferenceFromInitialOffset() {
    return this.internalMonitor.getDifferenceFromInitialOffset();
  }

  constructor(manager) {
    this.targetId = null;
    this.internalMonitor = manager.getMonitor();
  }

}

function registerTarget(type, target, manager) {
  const registry = manager.getRegistry();
  const targetId = registry.addTarget(type, target);
  return [targetId, () => registry.removeTarget(targetId)];
}
function registerSource(type, source, manager) {
  const registry = manager.getRegistry();
  const sourceId = registry.addSource(type, source);
  return [sourceId, () => registry.removeSource(sourceId)];
}

function shallowEqual(objA, objB, compare, compareContext) {
  let compareResult = compare ? compare.call(compareContext, objA, objB) : void 0;

  if (compareResult !== void 0) {
    return !!compareResult;
  }

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB); // Test for A's keys different from B.

  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    const valueA = objA[key];
    const valueB = objB[key];
    compareResult = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

    if (compareResult === false || compareResult === void 0 && valueA !== valueB) {
      return false;
    }
  }

  return true;
}

function isRef(obj) {
  return (// eslint-disable-next-line no-prototype-builtins
    obj !== null && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, 'current')
  );
}

function throwIfCompositeComponentElement(element) {
  // Custom components can no longer be wrapped directly in React DnD 2.0
  // so that we don't need to depend on findDOMNode() from react-dom.
  if (typeof element.type === 'string') {
    return;
  }

  const displayName = element.type.displayName || element.type.name || 'the component';
  throw new Error('Only native element nodes can now be passed to React DnD connectors.' + `You can either wrap ${displayName} into a <div>, or turn it into a ` + 'drag source or a drop target itself.');
}

function wrapHookToRecognizeElement(hook) {
  return (elementOrNode = null, options = null) => {
    // When passed a node, call the hook straight away.
    if (! /*#__PURE__*/React.isValidElement(elementOrNode)) {
      const node = elementOrNode;
      hook(node, options); // return the node so it can be chained (e.g. when within callback refs
      // <div ref={node => connectDragSource(connectDropTarget(node))}/>

      return node;
    } // If passed a ReactElement, clone it and attach this function as a ref.
    // This helps us achieve a neat API where user doesn't even know that refs
    // are being used under the hood.


    const element = elementOrNode;
    throwIfCompositeComponentElement(element); // When no options are passed, use the hook directly

    const ref = options ? node => hook(node, options) : hook;
    return cloneWithRef(element, ref);
  };
}

function wrapConnectorHooks(hooks) {
  const wrappedHooks = {};
  Object.keys(hooks).forEach(key => {
    const hook = hooks[key]; // ref objects should be passed straight through without wrapping

    if (key.endsWith('Ref')) {
      wrappedHooks[key] = hooks[key];
    } else {
      const wrappedHook = wrapHookToRecognizeElement(hook);

      wrappedHooks[key] = () => wrappedHook;
    }
  });
  return wrappedHooks;
}

function setRef(ref, node) {
  if (typeof ref === 'function') {
    ref(node);
  } else {
    ref.current = node;
  }
}

function cloneWithRef(element, newRef) {
  const previousRef = element.ref;
  invariant(typeof previousRef !== 'string', 'Cannot connect React DnD to an element with an existing string ref. ' + 'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' + 'Read more: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs');

  if (!previousRef) {
    // When there is no ref on the element, use the new ref directly
    return /*#__PURE__*/React.cloneElement(element, {
      ref: newRef
    });
  } else {
    return /*#__PURE__*/React.cloneElement(element, {
      ref: node => {
        setRef(previousRef, node);
        setRef(newRef, node);
      }
    });
  }
}

class SourceConnector {
  receiveHandlerId(newHandlerId) {
    if (this.handlerId === newHandlerId) {
      return;
    }

    this.handlerId = newHandlerId;
    this.reconnect();
  }

  get connectTarget() {
    return this.dragSource;
  }

  get dragSourceOptions() {
    return this.dragSourceOptionsInternal;
  }

  set dragSourceOptions(options) {
    this.dragSourceOptionsInternal = options;
  }

  get dragPreviewOptions() {
    return this.dragPreviewOptionsInternal;
  }

  set dragPreviewOptions(options) {
    this.dragPreviewOptionsInternal = options;
  }

  reconnect() {
    const didChange = this.reconnectDragSource();
    this.reconnectDragPreview(didChange);
  }

  reconnectDragSource() {
    const dragSource = this.dragSource; // if nothing has changed then don't resubscribe

    const didChange = this.didHandlerIdChange() || this.didConnectedDragSourceChange() || this.didDragSourceOptionsChange();

    if (didChange) {
      this.disconnectDragSource();
    }

    if (!this.handlerId) {
      return didChange;
    }

    if (!dragSource) {
      this.lastConnectedDragSource = dragSource;
      return didChange;
    }

    if (didChange) {
      this.lastConnectedHandlerId = this.handlerId;
      this.lastConnectedDragSource = dragSource;
      this.lastConnectedDragSourceOptions = this.dragSourceOptions;
      this.dragSourceUnsubscribe = this.backend.connectDragSource(this.handlerId, dragSource, this.dragSourceOptions);
    }

    return didChange;
  }

  reconnectDragPreview(forceDidChange = false) {
    const dragPreview = this.dragPreview; // if nothing has changed then don't resubscribe

    const didChange = forceDidChange || this.didHandlerIdChange() || this.didConnectedDragPreviewChange() || this.didDragPreviewOptionsChange();

    if (didChange) {
      this.disconnectDragPreview();
    }

    if (!this.handlerId) {
      return;
    }

    if (!dragPreview) {
      this.lastConnectedDragPreview = dragPreview;
      return;
    }

    if (didChange) {
      this.lastConnectedHandlerId = this.handlerId;
      this.lastConnectedDragPreview = dragPreview;
      this.lastConnectedDragPreviewOptions = this.dragPreviewOptions;
      this.dragPreviewUnsubscribe = this.backend.connectDragPreview(this.handlerId, dragPreview, this.dragPreviewOptions);
    }
  }

  didHandlerIdChange() {
    return this.lastConnectedHandlerId !== this.handlerId;
  }

  didConnectedDragSourceChange() {
    return this.lastConnectedDragSource !== this.dragSource;
  }

  didConnectedDragPreviewChange() {
    return this.lastConnectedDragPreview !== this.dragPreview;
  }

  didDragSourceOptionsChange() {
    return !shallowEqual(this.lastConnectedDragSourceOptions, this.dragSourceOptions);
  }

  didDragPreviewOptionsChange() {
    return !shallowEqual(this.lastConnectedDragPreviewOptions, this.dragPreviewOptions);
  }

  disconnectDragSource() {
    if (this.dragSourceUnsubscribe) {
      this.dragSourceUnsubscribe();
      this.dragSourceUnsubscribe = undefined;
    }
  }

  disconnectDragPreview() {
    if (this.dragPreviewUnsubscribe) {
      this.dragPreviewUnsubscribe();
      this.dragPreviewUnsubscribe = undefined;
      this.dragPreviewNode = null;
      this.dragPreviewRef = null;
    }
  }

  get dragSource() {
    return this.dragSourceNode || this.dragSourceRef && this.dragSourceRef.current;
  }

  get dragPreview() {
    return this.dragPreviewNode || this.dragPreviewRef && this.dragPreviewRef.current;
  }

  clearDragSource() {
    this.dragSourceNode = null;
    this.dragSourceRef = null;
  }

  clearDragPreview() {
    this.dragPreviewNode = null;
    this.dragPreviewRef = null;
  }

  constructor(backend) {
    this.hooks = wrapConnectorHooks({
      dragSource: (node, options) => {
        this.clearDragSource();
        this.dragSourceOptions = options || null;

        if (isRef(node)) {
          this.dragSourceRef = node;
        } else {
          this.dragSourceNode = node;
        }

        this.reconnectDragSource();
      },
      dragPreview: (node, options) => {
        this.clearDragPreview();
        this.dragPreviewOptions = options || null;

        if (isRef(node)) {
          this.dragPreviewRef = node;
        } else {
          this.dragPreviewNode = node;
        }

        this.reconnectDragPreview();
      }
    });
    this.handlerId = null; // The drop target may either be attached via ref or connect function

    this.dragSourceRef = null;
    this.dragSourceOptionsInternal = null; // The drag preview may either be attached via ref or connect function

    this.dragPreviewRef = null;
    this.dragPreviewOptionsInternal = null;
    this.lastConnectedHandlerId = null;
    this.lastConnectedDragSource = null;
    this.lastConnectedDragSourceOptions = null;
    this.lastConnectedDragPreview = null;
    this.lastConnectedDragPreviewOptions = null;
    this.backend = backend;
  }

}

class TargetConnector {
  get connectTarget() {
    return this.dropTarget;
  }

  reconnect() {
    // if nothing has changed then don't resubscribe
    const didChange = this.didHandlerIdChange() || this.didDropTargetChange() || this.didOptionsChange();

    if (didChange) {
      this.disconnectDropTarget();
    }

    const dropTarget = this.dropTarget;

    if (!this.handlerId) {
      return;
    }

    if (!dropTarget) {
      this.lastConnectedDropTarget = dropTarget;
      return;
    }

    if (didChange) {
      this.lastConnectedHandlerId = this.handlerId;
      this.lastConnectedDropTarget = dropTarget;
      this.lastConnectedDropTargetOptions = this.dropTargetOptions;
      this.unsubscribeDropTarget = this.backend.connectDropTarget(this.handlerId, dropTarget, this.dropTargetOptions);
    }
  }

  receiveHandlerId(newHandlerId) {
    if (newHandlerId === this.handlerId) {
      return;
    }

    this.handlerId = newHandlerId;
    this.reconnect();
  }

  get dropTargetOptions() {
    return this.dropTargetOptionsInternal;
  }

  set dropTargetOptions(options) {
    this.dropTargetOptionsInternal = options;
  }

  didHandlerIdChange() {
    return this.lastConnectedHandlerId !== this.handlerId;
  }

  didDropTargetChange() {
    return this.lastConnectedDropTarget !== this.dropTarget;
  }

  didOptionsChange() {
    return !shallowEqual(this.lastConnectedDropTargetOptions, this.dropTargetOptions);
  }

  disconnectDropTarget() {
    if (this.unsubscribeDropTarget) {
      this.unsubscribeDropTarget();
      this.unsubscribeDropTarget = undefined;
    }
  }

  get dropTarget() {
    return this.dropTargetNode || this.dropTargetRef && this.dropTargetRef.current;
  }

  clearDropTarget() {
    this.dropTargetRef = null;
    this.dropTargetNode = null;
  }

  constructor(backend) {
    this.hooks = wrapConnectorHooks({
      dropTarget: (node, options) => {
        this.clearDropTarget();
        this.dropTargetOptions = options;

        if (isRef(node)) {
          this.dropTargetRef = node;
        } else {
          this.dropTargetNode = node;
        }

        this.reconnect();
      }
    });
    this.handlerId = null; // The drop target may either be attached via ref or connect function

    this.dropTargetRef = null;
    this.dropTargetOptionsInternal = null;
    this.lastConnectedHandlerId = null;
    this.lastConnectedDropTarget = null;
    this.lastConnectedDropTargetOptions = null;
    this.backend = backend;
  }

}

/**
 * A hook to retrieve the DragDropManager from Context
 */

function useDragDropManager() {
  const {
    dragDropManager
  } = React.useContext(DndContext);
  invariant(dragDropManager != null, 'Expected drag drop context');
  return dragDropManager;
}

function useDragSourceConnector(dragSourceOptions, dragPreviewOptions) {
  const manager = useDragDropManager();
  const connector = React.useMemo(() => new SourceConnector(manager.getBackend()), [manager]);
  useIsomorphicLayoutEffect(() => {
    connector.dragSourceOptions = dragSourceOptions || null;
    connector.reconnect();
    return () => connector.disconnectDragSource();
  }, [connector, dragSourceOptions]);
  useIsomorphicLayoutEffect(() => {
    connector.dragPreviewOptions = dragPreviewOptions || null;
    connector.reconnect();
    return () => connector.disconnectDragPreview();
  }, [connector, dragPreviewOptions]);
  return connector;
}

function useDragSourceMonitor() {
  const manager = useDragDropManager();
  return React.useMemo(() => new DragSourceMonitorImpl(manager), [manager]);
}

class DragSourceImpl {
  beginDrag() {
    const spec = this.spec;
    const monitor = this.monitor;
    let result = null;

    if (typeof spec.item === 'object') {
      result = spec.item;
    } else if (typeof spec.item === 'function') {
      result = spec.item(monitor);
    } else {
      result = {};
    }

    return result !== null && result !== void 0 ? result : null;
  }

  canDrag() {
    const spec = this.spec;
    const monitor = this.monitor;

    if (typeof spec.canDrag === 'boolean') {
      return spec.canDrag;
    } else if (typeof spec.canDrag === 'function') {
      return spec.canDrag(monitor);
    } else {
      return true;
    }
  }

  isDragging(globalMonitor, target) {
    const spec = this.spec;
    const monitor = this.monitor;
    const {
      isDragging
    } = spec;
    return isDragging ? isDragging(monitor) : target === globalMonitor.getSourceId();
  }

  endDrag() {
    const spec = this.spec;
    const monitor = this.monitor;
    const connector = this.connector;
    const {
      end
    } = spec;

    if (end) {
      end(monitor.getItem(), monitor);
    }

    connector.reconnect();
  }

  constructor(spec, monitor, connector) {
    this.spec = spec;
    this.monitor = monitor;
    this.connector = connector;
  }

}

function useDragSource(spec, monitor, connector) {
  const handler = React.useMemo(() => new DragSourceImpl(spec, monitor, connector), [monitor, connector]);
  React.useEffect(() => {
    handler.spec = spec;
  }, [spec]);
  return handler;
}

function useDragType(spec) {
  return React.useMemo(() => {
    const result = spec.type;
    invariant(result != null, 'spec.type must be defined');
    return result;
  }, [spec]);
}

function useRegisteredDragSource(spec, monitor, connector) {
  const manager = useDragDropManager();
  const handler = useDragSource(spec, monitor, connector);
  const itemType = useDragType(spec);
  useIsomorphicLayoutEffect(function registerDragSource() {
    if (itemType != null) {
      const [handlerId, unregister] = registerSource(itemType, handler, manager);
      monitor.receiveHandlerId(handlerId);
      connector.receiveHandlerId(handlerId);
      return unregister;
    }

    return;
  }, [manager, monitor, connector, handler, itemType]);
}

/**
 * useDragSource hook
 * @param sourceSpec The drag source specification (object or function, function preferred)
 * @param deps The memoization deps array to use when evaluating spec changes
 */

function useDrag(specArg, deps) {
  const spec = useOptionalFactory(specArg, deps);
  invariant(!spec.begin, `useDrag::spec.begin was deprecated in v14. Replace spec.begin() with spec.item(). (see more here - https://react-dnd.github.io/react-dnd/docs/api/use-drag)`);
  const monitor = useDragSourceMonitor();
  const connector = useDragSourceConnector(spec.options, spec.previewOptions);
  useRegisteredDragSource(spec, monitor, connector);
  return [useCollectedProps(spec.collect, monitor, connector), useConnectDragSource(connector), useConnectDragPreview(connector)];
}

/**
 * useDragLayer Hook
 * @param collector The property collector
 */

function useDragLayer(collect) {
  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();
  const [collected, updateCollected] = useCollector(monitor, collect);
  React.useEffect(() => monitor.subscribeToOffsetChange(updateCollected));
  React.useEffect(() => monitor.subscribeToStateChange(updateCollected));
  return collected;
}

function useConnectDropTarget(connector) {
  return React.useMemo(() => connector.hooks.dropTarget(), [connector]);
}

function useDropTargetConnector(options) {
  const manager = useDragDropManager();
  const connector = React.useMemo(() => new TargetConnector(manager.getBackend()), [manager]);
  useIsomorphicLayoutEffect(() => {
    connector.dropTargetOptions = options || null;
    connector.reconnect();
    return () => connector.disconnectDropTarget();
  }, [options]);
  return connector;
}

function useDropTargetMonitor() {
  const manager = useDragDropManager();
  return React.useMemo(() => new DropTargetMonitorImpl(manager), [manager]);
}

/**
 * Internal utility hook to get an array-version of spec.accept.
 * The main utility here is that we aren't creating a new array on every render if a non-array spec.accept is passed in.
 * @param spec
 */

function useAccept(spec) {
  const {
    accept
  } = spec;
  return React.useMemo(() => {
    invariant(spec.accept != null, 'accept must be defined');
    return Array.isArray(accept) ? accept : [accept];
  }, [accept]);
}

class DropTargetImpl {
  canDrop() {
    const spec = this.spec;
    const monitor = this.monitor;
    return spec.canDrop ? spec.canDrop(monitor.getItem(), monitor) : true;
  }

  hover() {
    const spec = this.spec;
    const monitor = this.monitor;

    if (spec.hover) {
      spec.hover(monitor.getItem(), monitor);
    }
  }

  drop() {
    const spec = this.spec;
    const monitor = this.monitor;

    if (spec.drop) {
      return spec.drop(monitor.getItem(), monitor);
    }

    return;
  }

  constructor(spec, monitor) {
    this.spec = spec;
    this.monitor = monitor;
  }

}

function useDropTarget(spec, monitor) {
  const dropTarget = React.useMemo(() => new DropTargetImpl(spec, monitor), [monitor]);
  React.useEffect(() => {
    dropTarget.spec = spec;
  }, [spec]);
  return dropTarget;
}

function useRegisteredDropTarget(spec, monitor, connector) {
  const manager = useDragDropManager();
  const dropTarget = useDropTarget(spec, monitor);
  const accept = useAccept(spec);
  useIsomorphicLayoutEffect(function registerDropTarget() {
    const [handlerId, unregister] = registerTarget(accept, dropTarget, manager);
    monitor.receiveHandlerId(handlerId);
    connector.receiveHandlerId(handlerId);
    return unregister;
  }, [manager, monitor, dropTarget, connector, accept.map(a => a.toString()).join('|')]);
}

/**
 * useDropTarget Hook
 * @param spec The drop target specification (object or function, function preferred)
 * @param deps The memoization deps array to use when evaluating spec changes
 */

function useDrop(specArg, deps) {
  const spec = useOptionalFactory(specArg, deps);
  const monitor = useDropTargetMonitor();
  const connector = useDropTargetConnector(spec.options);
  useRegisteredDropTarget(spec, monitor, connector);
  return [useCollectedProps(spec.collect, monitor, connector), useConnectDropTarget(connector)];
}

// cheap lodash replacements
function memoize(fn) {
  let result = null;

  const memoized = () => {
    if (result == null) {
      result = fn();
    }

    return result;
  };

  return memoized;
}
/**
 * drop-in replacement for _.without
 */

function without(items, item) {
  return items.filter(i => i !== item);
}
function union(itemsA, itemsB) {
  const set = new Set();

  const insertItem = item => set.add(item);

  itemsA.forEach(insertItem);
  itemsB.forEach(insertItem);
  const result = [];
  set.forEach(key => result.push(key));
  return result;
}

class EnterLeaveCounter {
  enter(enteringNode) {
    const previousLength = this.entered.length;

    const isNodeEntered = node => this.isNodeInDocument(node) && (!node.contains || node.contains(enteringNode));

    this.entered = union(this.entered.filter(isNodeEntered), [enteringNode]);
    return previousLength === 0 && this.entered.length > 0;
  }

  leave(leavingNode) {
    const previousLength = this.entered.length;
    this.entered = without(this.entered.filter(this.isNodeInDocument), leavingNode);
    return previousLength > 0 && this.entered.length === 0;
  }

  reset() {
    this.entered = [];
  }

  constructor(isNodeInDocument) {
    this.entered = [];
    this.isNodeInDocument = isNodeInDocument;
  }

}

class NativeDragSource {
  initializeExposedProperties() {
    Object.keys(this.config.exposeProperties).forEach(property => {
      Object.defineProperty(this.item, property, {
        configurable: true,
        enumerable: true,

        get() {
          // eslint-disable-next-line no-console
          console.warn(`Browser doesn't allow reading "${property}" until the drop event.`);
          return null;
        }

      });
    });
  }

  loadDataTransfer(dataTransfer) {
    if (dataTransfer) {
      const newProperties = {};
      Object.keys(this.config.exposeProperties).forEach(property => {
        const propertyFn = this.config.exposeProperties[property];

        if (propertyFn != null) {
          newProperties[property] = {
            value: propertyFn(dataTransfer, this.config.matchesTypes),
            configurable: true,
            enumerable: true
          };
        }
      });
      Object.defineProperties(this.item, newProperties);
    }
  }

  canDrag() {
    return true;
  }

  beginDrag() {
    return this.item;
  }

  isDragging(monitor, handle) {
    return handle === monitor.getSourceId();
  }

  endDrag() {// empty
  }

  constructor(config) {
    this.config = config;
    this.item = {};
    this.initializeExposedProperties();
  }

}

const FILE = '__NATIVE_FILE__';
const URL = '__NATIVE_URL__';
const TEXT = '__NATIVE_TEXT__';
const HTML = '__NATIVE_HTML__';

var NativeTypes = /*#__PURE__*/Object.freeze({
    __proto__: null,
    FILE: FILE,
    URL: URL,
    TEXT: TEXT,
    HTML: HTML
});

function getDataFromDataTransfer(dataTransfer, typesToTry, defaultValue) {
  const result = typesToTry.reduce((resultSoFar, typeToTry) => resultSoFar || dataTransfer.getData(typeToTry), '');
  return result != null ? result : defaultValue;
}

const nativeTypesConfig = {
  [FILE]: {
    exposeProperties: {
      files: dataTransfer => Array.prototype.slice.call(dataTransfer.files),
      items: dataTransfer => dataTransfer.items,
      dataTransfer: dataTransfer => dataTransfer
    },
    matchesTypes: ['Files']
  },
  [HTML]: {
    exposeProperties: {
      html: (dataTransfer, matchesTypes) => getDataFromDataTransfer(dataTransfer, matchesTypes, ''),
      dataTransfer: dataTransfer => dataTransfer
    },
    matchesTypes: ['Html', 'text/html']
  },
  [URL]: {
    exposeProperties: {
      urls: (dataTransfer, matchesTypes) => getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n'),
      dataTransfer: dataTransfer => dataTransfer
    },
    matchesTypes: ['Url', 'text/uri-list']
  },
  [TEXT]: {
    exposeProperties: {
      text: (dataTransfer, matchesTypes) => getDataFromDataTransfer(dataTransfer, matchesTypes, ''),
      dataTransfer: dataTransfer => dataTransfer
    },
    matchesTypes: ['Text', 'text/plain']
  }
};

function createNativeDragSource(type, dataTransfer) {
  const config = nativeTypesConfig[type];

  if (!config) {
    throw new Error(`native type ${type} has no configuration`);
  }

  const result = new NativeDragSource(config);
  result.loadDataTransfer(dataTransfer);
  return result;
}
function matchNativeItemType(dataTransfer) {
  if (!dataTransfer) {
    return null;
  }

  const dataTransferTypes = Array.prototype.slice.call(dataTransfer.types || []);
  return Object.keys(nativeTypesConfig).filter(nativeItemType => {
    const typeConfig = nativeTypesConfig[nativeItemType];

    if (!(typeConfig === null || typeConfig === void 0 ? void 0 : typeConfig.matchesTypes)) {
      return false;
    }

    return typeConfig.matchesTypes.some(t => dataTransferTypes.indexOf(t) > -1);
  })[0] || null;
}

const isFirefox = memoize(() => /firefox/i.test(navigator.userAgent));
const isSafari = memoize(() => Boolean(window.safari));

class MonotonicInterpolant {
  interpolate(x) {
    const {
      xs,
      ys,
      c1s,
      c2s,
      c3s
    } = this; // The rightmost point in the dataset should give an exact result

    let i = xs.length - 1;

    if (x === xs[i]) {
      return ys[i];
    } // Search for the interval x is in, returning the corresponding y if x is one of the original xs


    let low = 0;
    let high = c3s.length - 1;
    let mid;

    while (low <= high) {
      mid = Math.floor(0.5 * (low + high));
      const xHere = xs[mid];

      if (xHere < x) {
        low = mid + 1;
      } else if (xHere > x) {
        high = mid - 1;
      } else {
        return ys[mid];
      }
    }

    i = Math.max(0, high); // Interpolate

    const diff = x - xs[i];
    const diffSq = diff * diff;
    return ys[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
  }

  constructor(xs, ys) {
    const {
      length
    } = xs; // Rearrange xs and ys so that xs is sorted

    const indexes = [];

    for (let i = 0; i < length; i++) {
      indexes.push(i);
    }

    indexes.sort((a, b) => xs[a] < xs[b] ? -1 : 1); // Get consecutive differences and slopes
    const dxs = [];
    const ms = [];
    let dx;
    let dy;

    for (let i1 = 0; i1 < length - 1; i1++) {
      dx = xs[i1 + 1] - xs[i1];
      dy = ys[i1 + 1] - ys[i1];
      dxs.push(dx);
      ms.push(dy / dx);
    } // Get degree-1 coefficients


    const c1s = [ms[0]];

    for (let i2 = 0; i2 < dxs.length - 1; i2++) {
      const m2 = ms[i2];
      const mNext = ms[i2 + 1];

      if (m2 * mNext <= 0) {
        c1s.push(0);
      } else {
        dx = dxs[i2];
        const dxNext = dxs[i2 + 1];
        const common = dx + dxNext;
        c1s.push(3 * common / ((common + dxNext) / m2 + (common + dx) / mNext));
      }
    }

    c1s.push(ms[ms.length - 1]); // Get degree-2 and degree-3 coefficients

    const c2s = [];
    const c3s = [];
    let m;

    for (let i3 = 0; i3 < c1s.length - 1; i3++) {
      m = ms[i3];
      const c1 = c1s[i3];
      const invDx = 1 / dxs[i3];
      const common = c1 + c1s[i3 + 1] - m - m;
      c2s.push((m - c1 - common) * invDx);
      c3s.push(common * invDx * invDx);
    }

    this.xs = xs;
    this.ys = ys;
    this.c1s = c1s;
    this.c2s = c2s;
    this.c3s = c3s;
  }

}

const ELEMENT_NODE$1 = 1;
function getNodeClientOffset$1(node) {
  const el = node.nodeType === ELEMENT_NODE$1 ? node : node.parentElement;

  if (!el) {
    return null;
  }

  const {
    top,
    left
  } = el.getBoundingClientRect();
  return {
    x: left,
    y: top
  };
}
function getEventClientOffset$1(e) {
  return {
    x: e.clientX,
    y: e.clientY
  };
}

function isImageNode(node) {
  var ref;
  return node.nodeName === 'IMG' && (isFirefox() || !((ref = document.documentElement) === null || ref === void 0 ? void 0 : ref.contains(node)));
}

function getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight) {
  let dragPreviewWidth = isImage ? dragPreview.width : sourceWidth;
  let dragPreviewHeight = isImage ? dragPreview.height : sourceHeight; // Work around @2x coordinate discrepancies in browsers

  if (isSafari() && isImage) {
    dragPreviewHeight /= window.devicePixelRatio;
    dragPreviewWidth /= window.devicePixelRatio;
  }

  return {
    dragPreviewWidth,
    dragPreviewHeight
  };
}

function getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint) {
  // The browsers will use the image intrinsic size under different conditions.
  // Firefox only cares if it's an image, but WebKit also wants it to be detached.
  const isImage = isImageNode(dragPreview);
  const dragPreviewNode = isImage ? sourceNode : dragPreview;
  const dragPreviewNodeOffsetFromClient = getNodeClientOffset$1(dragPreviewNode);
  const offsetFromDragPreview = {
    x: clientOffset.x - dragPreviewNodeOffsetFromClient.x,
    y: clientOffset.y - dragPreviewNodeOffsetFromClient.y
  };
  const {
    offsetWidth: sourceWidth,
    offsetHeight: sourceHeight
  } = sourceNode;
  const {
    anchorX,
    anchorY
  } = anchorPoint;
  const {
    dragPreviewWidth,
    dragPreviewHeight
  } = getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight);

  const calculateYOffset = () => {
    const interpolantY = new MonotonicInterpolant([0, 0.5, 1], [// Dock to the top
    offsetFromDragPreview.y, // Align at the center
    offsetFromDragPreview.y / sourceHeight * dragPreviewHeight, // Dock to the bottom
    offsetFromDragPreview.y + dragPreviewHeight - sourceHeight]);
    let y = interpolantY.interpolate(anchorY); // Work around Safari 8 positioning bug

    if (isSafari() && isImage) {
      // We'll have to wait for @3x to see if this is entirely correct
      y += (window.devicePixelRatio - 1) * dragPreviewHeight;
    }

    return y;
  };

  const calculateXOffset = () => {
    // Interpolate coordinates depending on anchor point
    // If you know a simpler way to do this, let me know
    const interpolantX = new MonotonicInterpolant([0, 0.5, 1], [// Dock to the left
    offsetFromDragPreview.x, // Align at the center
    offsetFromDragPreview.x / sourceWidth * dragPreviewWidth, // Dock to the right
    offsetFromDragPreview.x + dragPreviewWidth - sourceWidth]);
    return interpolantX.interpolate(anchorX);
  }; // Force offsets if specified in the options.


  const {
    offsetX,
    offsetY
  } = offsetPoint;
  const isManualOffsetX = offsetX === 0 || offsetX;
  const isManualOffsetY = offsetY === 0 || offsetY;
  return {
    x: isManualOffsetX ? offsetX : calculateXOffset(),
    y: isManualOffsetY ? offsetY : calculateYOffset()
  };
}

class OptionsReader$1 {
  get window() {
    if (this.globalContext) {
      return this.globalContext;
    } else if (typeof window !== 'undefined') {
      return window;
    }

    return undefined;
  }

  get document() {
    var ref;

    if ((ref = this.globalContext) === null || ref === void 0 ? void 0 : ref.document) {
      return this.globalContext.document;
    } else if (this.window) {
      return this.window.document;
    } else {
      return undefined;
    }
  }

  get rootElement() {
    var ref;
    return ((ref = this.optionsArgs) === null || ref === void 0 ? void 0 : ref.rootElement) || this.window;
  }

  constructor(globalContext, options) {
    this.ownerDocument = null;
    this.globalContext = globalContext;
    this.optionsArgs = options;
  }

}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}
class HTML5BackendImpl {
  /**
  * Generate profiling statistics for the HTML5Backend.
  */
  profile() {
    var ref, ref1;
    return {
      sourcePreviewNodes: this.sourcePreviewNodes.size,
      sourcePreviewNodeOptions: this.sourcePreviewNodeOptions.size,
      sourceNodeOptions: this.sourceNodeOptions.size,
      sourceNodes: this.sourceNodes.size,
      dragStartSourceIds: ((ref = this.dragStartSourceIds) === null || ref === void 0 ? void 0 : ref.length) || 0,
      dropTargetIds: this.dropTargetIds.length,
      dragEnterTargetIds: this.dragEnterTargetIds.length,
      dragOverTargetIds: ((ref1 = this.dragOverTargetIds) === null || ref1 === void 0 ? void 0 : ref1.length) || 0
    };
  } // public for test


  get window() {
    return this.options.window;
  }

  get document() {
    return this.options.document;
  }
  /**
  * Get the root element to use for event subscriptions
  */


  get rootElement() {
    return this.options.rootElement;
  }

  setup() {
    const root = this.rootElement;

    if (root === undefined) {
      return;
    }

    if (root.__isReactDndBackendSetUp) {
      throw new Error('Cannot have two HTML5 backends at the same time.');
    }

    root.__isReactDndBackendSetUp = true;
    this.addEventListeners(root);
  }

  teardown() {
    const root = this.rootElement;

    if (root === undefined) {
      return;
    }

    root.__isReactDndBackendSetUp = false;
    this.removeEventListeners(this.rootElement);
    this.clearCurrentDragSourceNode();

    if (this.asyncEndDragFrameId) {
      var ref;
      (ref = this.window) === null || ref === void 0 ? void 0 : ref.cancelAnimationFrame(this.asyncEndDragFrameId);
    }
  }

  connectDragPreview(sourceId, node, options) {
    this.sourcePreviewNodeOptions.set(sourceId, options);
    this.sourcePreviewNodes.set(sourceId, node);
    return () => {
      this.sourcePreviewNodes.delete(sourceId);
      this.sourcePreviewNodeOptions.delete(sourceId);
    };
  }

  connectDragSource(sourceId, node, options) {
    this.sourceNodes.set(sourceId, node);
    this.sourceNodeOptions.set(sourceId, options);

    const handleDragStart = e => this.handleDragStart(e, sourceId);

    const handleSelectStart = e => this.handleSelectStart(e);

    node.setAttribute('draggable', 'true');
    node.addEventListener('dragstart', handleDragStart);
    node.addEventListener('selectstart', handleSelectStart);
    return () => {
      this.sourceNodes.delete(sourceId);
      this.sourceNodeOptions.delete(sourceId);
      node.removeEventListener('dragstart', handleDragStart);
      node.removeEventListener('selectstart', handleSelectStart);
      node.setAttribute('draggable', 'false');
    };
  }

  connectDropTarget(targetId, node) {
    const handleDragEnter = e => this.handleDragEnter(e, targetId);

    const handleDragOver = e => this.handleDragOver(e, targetId);

    const handleDrop = e => this.handleDrop(e, targetId);

    node.addEventListener('dragenter', handleDragEnter);
    node.addEventListener('dragover', handleDragOver);
    node.addEventListener('drop', handleDrop);
    return () => {
      node.removeEventListener('dragenter', handleDragEnter);
      node.removeEventListener('dragover', handleDragOver);
      node.removeEventListener('drop', handleDrop);
    };
  }

  addEventListeners(target) {
    // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
    if (!target.addEventListener) {
      return;
    }

    target.addEventListener('dragstart', this.handleTopDragStart);
    target.addEventListener('dragstart', this.handleTopDragStartCapture, true);
    target.addEventListener('dragend', this.handleTopDragEndCapture, true);
    target.addEventListener('dragenter', this.handleTopDragEnter);
    target.addEventListener('dragenter', this.handleTopDragEnterCapture, true);
    target.addEventListener('dragleave', this.handleTopDragLeaveCapture, true);
    target.addEventListener('dragover', this.handleTopDragOver);
    target.addEventListener('dragover', this.handleTopDragOverCapture, true);
    target.addEventListener('drop', this.handleTopDrop);
    target.addEventListener('drop', this.handleTopDropCapture, true);
  }

  removeEventListeners(target) {
    // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
    if (!target.removeEventListener) {
      return;
    }

    target.removeEventListener('dragstart', this.handleTopDragStart);
    target.removeEventListener('dragstart', this.handleTopDragStartCapture, true);
    target.removeEventListener('dragend', this.handleTopDragEndCapture, true);
    target.removeEventListener('dragenter', this.handleTopDragEnter);
    target.removeEventListener('dragenter', this.handleTopDragEnterCapture, true);
    target.removeEventListener('dragleave', this.handleTopDragLeaveCapture, true);
    target.removeEventListener('dragover', this.handleTopDragOver);
    target.removeEventListener('dragover', this.handleTopDragOverCapture, true);
    target.removeEventListener('drop', this.handleTopDrop);
    target.removeEventListener('drop', this.handleTopDropCapture, true);
  }

  getCurrentSourceNodeOptions() {
    const sourceId = this.monitor.getSourceId();
    const sourceNodeOptions = this.sourceNodeOptions.get(sourceId);
    return _objectSpread({
      dropEffect: this.altKeyPressed ? 'copy' : 'move'
    }, sourceNodeOptions || {});
  }

  getCurrentDropEffect() {
    if (this.isDraggingNativeItem()) {
      // It makes more sense to default to 'copy' for native resources
      return 'copy';
    }

    return this.getCurrentSourceNodeOptions().dropEffect;
  }

  getCurrentSourcePreviewNodeOptions() {
    const sourceId = this.monitor.getSourceId();
    const sourcePreviewNodeOptions = this.sourcePreviewNodeOptions.get(sourceId);
    return _objectSpread({
      anchorX: 0.5,
      anchorY: 0.5,
      captureDraggingState: false
    }, sourcePreviewNodeOptions || {});
  }

  isDraggingNativeItem() {
    const itemType = this.monitor.getItemType();
    return Object.keys(NativeTypes).some(key => NativeTypes[key] === itemType);
  }

  beginDragNativeItem(type, dataTransfer) {
    this.clearCurrentDragSourceNode();
    this.currentNativeSource = createNativeDragSource(type, dataTransfer);
    this.currentNativeHandle = this.registry.addSource(type, this.currentNativeSource);
    this.actions.beginDrag([this.currentNativeHandle]);
  }

  setCurrentDragSourceNode(node) {
    this.clearCurrentDragSourceNode();
    this.currentDragSourceNode = node; // A timeout of > 0 is necessary to resolve Firefox issue referenced
    // See:
    //   * https://github.com/react-dnd/react-dnd/pull/928
    //   * https://github.com/react-dnd/react-dnd/issues/869

    const MOUSE_MOVE_TIMEOUT = 1000; // Receiving a mouse event in the middle of a dragging operation
    // means it has ended and the drag source node disappeared from DOM,
    // so the browser didn't dispatch the dragend event.
    //
    // We need to wait before we start listening for mousemove events.
    // This is needed because the drag preview needs to be drawn or else it fires an 'mousemove' event
    // immediately in some browsers.
    //
    // See:
    //   * https://github.com/react-dnd/react-dnd/pull/928
    //   * https://github.com/react-dnd/react-dnd/issues/869
    //

    this.mouseMoveTimeoutTimer = setTimeout(() => {
      var ref;
      return (ref = this.rootElement) === null || ref === void 0 ? void 0 : ref.addEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
    }, MOUSE_MOVE_TIMEOUT);
  }

  clearCurrentDragSourceNode() {
    if (this.currentDragSourceNode) {
      this.currentDragSourceNode = null;

      if (this.rootElement) {
        var ref;
        (ref = this.window) === null || ref === void 0 ? void 0 : ref.clearTimeout(this.mouseMoveTimeoutTimer || undefined);
        this.rootElement.removeEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
      }

      this.mouseMoveTimeoutTimer = null;
      return true;
    }

    return false;
  }

  handleDragStart(e, sourceId) {
    if (e.defaultPrevented) {
      return;
    }

    if (!this.dragStartSourceIds) {
      this.dragStartSourceIds = [];
    }

    this.dragStartSourceIds.unshift(sourceId);
  }

  handleDragEnter(_e, targetId) {
    this.dragEnterTargetIds.unshift(targetId);
  }

  handleDragOver(_e, targetId) {
    if (this.dragOverTargetIds === null) {
      this.dragOverTargetIds = [];
    }

    this.dragOverTargetIds.unshift(targetId);
  }

  handleDrop(_e, targetId) {
    this.dropTargetIds.unshift(targetId);
  }

  constructor(manager, globalContext, options) {
    this.sourcePreviewNodes = new Map();
    this.sourcePreviewNodeOptions = new Map();
    this.sourceNodes = new Map();
    this.sourceNodeOptions = new Map();
    this.dragStartSourceIds = null;
    this.dropTargetIds = [];
    this.dragEnterTargetIds = [];
    this.currentNativeSource = null;
    this.currentNativeHandle = null;
    this.currentDragSourceNode = null;
    this.altKeyPressed = false;
    this.mouseMoveTimeoutTimer = null;
    this.asyncEndDragFrameId = null;
    this.dragOverTargetIds = null;
    this.lastClientOffset = null;
    this.hoverRafId = null;

    this.getSourceClientOffset = sourceId => {
      const source = this.sourceNodes.get(sourceId);
      return source && getNodeClientOffset$1(source) || null;
    };

    this.endDragNativeItem = () => {
      if (!this.isDraggingNativeItem()) {
        return;
      }

      this.actions.endDrag();

      if (this.currentNativeHandle) {
        this.registry.removeSource(this.currentNativeHandle);
      }

      this.currentNativeHandle = null;
      this.currentNativeSource = null;
    };

    this.isNodeInDocument = node => {
      // Check the node either in the main document or in the current context
      return Boolean(node && this.document && this.document.body && this.document.body.contains(node));
    };

    this.endDragIfSourceWasRemovedFromDOM = () => {
      const node = this.currentDragSourceNode;

      if (node == null || this.isNodeInDocument(node)) {
        return;
      }

      if (this.clearCurrentDragSourceNode() && this.monitor.isDragging()) {
        this.actions.endDrag();
      }

      this.cancelHover();
    };

    this.scheduleHover = dragOverTargetIds => {
      if (this.hoverRafId === null && typeof requestAnimationFrame !== 'undefined') {
        this.hoverRafId = requestAnimationFrame(() => {
          if (this.monitor.isDragging()) {
            this.actions.hover(dragOverTargetIds || [], {
              clientOffset: this.lastClientOffset
            });
          }

          this.hoverRafId = null;
        });
      }
    };

    this.cancelHover = () => {
      if (this.hoverRafId !== null && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.hoverRafId);
        this.hoverRafId = null;
      }
    };

    this.handleTopDragStartCapture = () => {
      this.clearCurrentDragSourceNode();
      this.dragStartSourceIds = [];
    };

    this.handleTopDragStart = e => {
      if (e.defaultPrevented) {
        return;
      }

      const {
        dragStartSourceIds
      } = this;
      this.dragStartSourceIds = null;
      const clientOffset = getEventClientOffset$1(e); // Avoid crashing if we missed a drop event or our previous drag died

      if (this.monitor.isDragging()) {
        this.actions.endDrag();
        this.cancelHover();
      } // Don't publish the source just yet (see why below)


      this.actions.beginDrag(dragStartSourceIds || [], {
        publishSource: false,
        getSourceClientOffset: this.getSourceClientOffset,
        clientOffset
      });
      const {
        dataTransfer
      } = e;
      const nativeType = matchNativeItemType(dataTransfer);

      if (this.monitor.isDragging()) {
        if (dataTransfer && typeof dataTransfer.setDragImage === 'function') {
          // Use custom drag image if user specifies it.
          // If child drag source refuses drag but parent agrees,
          // use parent's node as drag image. Neither works in IE though.
          const sourceId = this.monitor.getSourceId();
          const sourceNode = this.sourceNodes.get(sourceId);
          const dragPreview = this.sourcePreviewNodes.get(sourceId) || sourceNode;

          if (dragPreview) {
            const {
              anchorX,
              anchorY,
              offsetX,
              offsetY
            } = this.getCurrentSourcePreviewNodeOptions();
            const anchorPoint = {
              anchorX,
              anchorY
            };
            const offsetPoint = {
              offsetX,
              offsetY
            };
            const dragPreviewOffset = getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint);
            dataTransfer.setDragImage(dragPreview, dragPreviewOffset.x, dragPreviewOffset.y);
          }
        }

        try {
          // Firefox won't drag without setting data
          dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.setData('application/json', {});
        } catch (err) {// IE doesn't support MIME types in setData
        } // Store drag source node so we can check whether
        // it is removed from DOM and trigger endDrag manually.


        this.setCurrentDragSourceNode(e.target); // Now we are ready to publish the drag source.. or are we not?

        const {
          captureDraggingState
        } = this.getCurrentSourcePreviewNodeOptions();

        if (!captureDraggingState) {
          // Usually we want to publish it in the next tick so that browser
          // is able to screenshot the current (not yet dragging) state.
          //
          // It also neatly avoids a situation where render() returns null
          // in the same tick for the source element, and browser freaks out.
          setTimeout(() => this.actions.publishDragSource(), 0);
        } else {
          // In some cases the user may want to override this behavior, e.g.
          // to work around IE not supporting custom drag previews.
          //
          // When using a custom drag layer, the only way to prevent
          // the default drag preview from drawing in IE is to screenshot
          // the dragging state in which the node itself has zero opacity
          // and height. In this case, though, returning null from render()
          // will abruptly end the dragging, which is not obvious.
          //
          // This is the reason such behavior is strictly opt-in.
          this.actions.publishDragSource();
        }
      } else if (nativeType) {
        // A native item (such as URL) dragged from inside the document
        this.beginDragNativeItem(nativeType);
      } else if (dataTransfer && !dataTransfer.types && (e.target && !e.target.hasAttribute || !e.target.hasAttribute('draggable'))) {
        // Looks like a Safari bug: dataTransfer.types is null, but there was no draggable.
        // Just let it drag. It's a native type (URL or text) and will be picked up in
        // dragenter handler.
        return;
      } else {
        // If by this time no drag source reacted, tell browser not to drag.
        e.preventDefault();
      }
    };

    this.handleTopDragEndCapture = () => {
      if (this.clearCurrentDragSourceNode() && this.monitor.isDragging()) {
        // Firefox can dispatch this event in an infinite loop
        // if dragend handler does something like showing an alert.
        // Only proceed if we have not handled it already.
        this.actions.endDrag();
      }

      this.cancelHover();
    };

    this.handleTopDragEnterCapture = e => {
      this.dragEnterTargetIds = [];

      if (this.isDraggingNativeItem()) {
        var ref;
        (ref = this.currentNativeSource) === null || ref === void 0 ? void 0 : ref.loadDataTransfer(e.dataTransfer);
      }

      const isFirstEnter = this.enterLeaveCounter.enter(e.target);

      if (!isFirstEnter || this.monitor.isDragging()) {
        return;
      }

      const {
        dataTransfer
      } = e;
      const nativeType = matchNativeItemType(dataTransfer);

      if (nativeType) {
        // A native item (such as file or URL) dragged from outside the document
        this.beginDragNativeItem(nativeType, dataTransfer);
      }
    };

    this.handleTopDragEnter = e => {
      const {
        dragEnterTargetIds
      } = this;
      this.dragEnterTargetIds = [];

      if (!this.monitor.isDragging()) {
        // This is probably a native item type we don't understand.
        return;
      }

      this.altKeyPressed = e.altKey; // If the target changes position as the result of `dragenter`, `dragover` might still
      // get dispatched despite target being no longer there. The easy solution is to check
      // whether there actually is a target before firing `hover`.

      if (dragEnterTargetIds.length > 0) {
        this.actions.hover(dragEnterTargetIds, {
          clientOffset: getEventClientOffset$1(e)
        });
      }

      const canDrop = dragEnterTargetIds.some(targetId => this.monitor.canDropOnTarget(targetId));

      if (canDrop) {
        // IE requires this to fire dragover events
        e.preventDefault();

        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = this.getCurrentDropEffect();
        }
      }
    };

    this.handleTopDragOverCapture = e => {
      this.dragOverTargetIds = [];

      if (this.isDraggingNativeItem()) {
        var ref;
        (ref = this.currentNativeSource) === null || ref === void 0 ? void 0 : ref.loadDataTransfer(e.dataTransfer);
      }
    };

    this.handleTopDragOver = e => {
      const {
        dragOverTargetIds
      } = this;
      this.dragOverTargetIds = [];

      if (!this.monitor.isDragging()) {
        // This is probably a native item type we don't understand.
        // Prevent default "drop and blow away the whole document" action.
        e.preventDefault();

        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'none';
        }

        return;
      }

      this.altKeyPressed = e.altKey;
      this.lastClientOffset = getEventClientOffset$1(e);
      this.scheduleHover(dragOverTargetIds);
      const canDrop = (dragOverTargetIds || []).some(targetId => this.monitor.canDropOnTarget(targetId));

      if (canDrop) {
        // Show user-specified drop effect.
        e.preventDefault();

        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = this.getCurrentDropEffect();
        }
      } else if (this.isDraggingNativeItem()) {
        // Don't show a nice cursor but still prevent default
        // "drop and blow away the whole document" action.
        e.preventDefault();
      } else {
        e.preventDefault();

        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'none';
        }
      }
    };

    this.handleTopDragLeaveCapture = e => {
      if (this.isDraggingNativeItem()) {
        e.preventDefault();
      }

      const isLastLeave = this.enterLeaveCounter.leave(e.target);

      if (!isLastLeave) {
        return;
      }

      if (this.isDraggingNativeItem()) {
        setTimeout(() => this.endDragNativeItem(), 0);
      }

      this.cancelHover();
    };

    this.handleTopDropCapture = e => {
      this.dropTargetIds = [];

      if (this.isDraggingNativeItem()) {
        var ref;
        e.preventDefault();
        (ref = this.currentNativeSource) === null || ref === void 0 ? void 0 : ref.loadDataTransfer(e.dataTransfer);
      } else if (matchNativeItemType(e.dataTransfer)) {
        // Dragging some elements, like <a> and <img> may still behave like a native drag event,
        // even if the current drag event matches a user-defined type.
        // Stop the default behavior when we're not expecting a native item to be dropped.
        e.preventDefault();
      }

      this.enterLeaveCounter.reset();
    };

    this.handleTopDrop = e => {
      const {
        dropTargetIds
      } = this;
      this.dropTargetIds = [];
      this.actions.hover(dropTargetIds, {
        clientOffset: getEventClientOffset$1(e)
      });
      this.actions.drop({
        dropEffect: this.getCurrentDropEffect()
      });

      if (this.isDraggingNativeItem()) {
        this.endDragNativeItem();
      } else if (this.monitor.isDragging()) {
        this.actions.endDrag();
      }

      this.cancelHover();
    };

    this.handleSelectStart = e => {
      const target = e.target; // Only IE requires us to explicitly say
      // we want drag drop operation to start

      if (typeof target.dragDrop !== 'function') {
        return;
      } // Inputs and textareas should be selectable


      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      } // For other targets, ask IE
      // to enable drag and drop


      e.preventDefault();
      target.dragDrop();
    };

    this.options = new OptionsReader$1(globalContext, options);
    this.actions = manager.getActions();
    this.monitor = manager.getMonitor();
    this.registry = manager.getRegistry();
    this.enterLeaveCounter = new EnterLeaveCounter(this.isNodeInDocument);
  }

}

let emptyImage;
function getEmptyImage() {
  if (!emptyImage) {
    emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

  return emptyImage;
}

const HTML5Backend = function createBackend(manager, context, options) {
  return new HTML5BackendImpl(manager, context, options);
};

var ListenerType;

(function (ListenerType) {
  ListenerType["mouse"] = "mouse";
  ListenerType["touch"] = "touch";
  ListenerType["keyboard"] = "keyboard";
})(ListenerType || (ListenerType = {}));

class OptionsReader {
  get delay() {
    var _delay;

    return (_delay = this.args.delay) !== null && _delay !== void 0 ? _delay : 0;
  }

  get scrollAngleRanges() {
    return this.args.scrollAngleRanges;
  }

  get getDropTargetElementsAtPoint() {
    return this.args.getDropTargetElementsAtPoint;
  }

  get ignoreContextMenu() {
    var _ignoreContextMenu;

    return (_ignoreContextMenu = this.args.ignoreContextMenu) !== null && _ignoreContextMenu !== void 0 ? _ignoreContextMenu : false;
  }

  get enableHoverOutsideTarget() {
    var _enableHoverOutsideTarget;

    return (_enableHoverOutsideTarget = this.args.enableHoverOutsideTarget) !== null && _enableHoverOutsideTarget !== void 0 ? _enableHoverOutsideTarget : false;
  }

  get enableKeyboardEvents() {
    var _enableKeyboardEvents;

    return (_enableKeyboardEvents = this.args.enableKeyboardEvents) !== null && _enableKeyboardEvents !== void 0 ? _enableKeyboardEvents : false;
  }

  get enableMouseEvents() {
    var _enableMouseEvents;

    return (_enableMouseEvents = this.args.enableMouseEvents) !== null && _enableMouseEvents !== void 0 ? _enableMouseEvents : false;
  }

  get enableTouchEvents() {
    var _enableTouchEvents;

    return (_enableTouchEvents = this.args.enableTouchEvents) !== null && _enableTouchEvents !== void 0 ? _enableTouchEvents : true;
  }

  get touchSlop() {
    return this.args.touchSlop || 0;
  }

  get delayTouchStart() {
    var ref, ref1;
    var ref2, ref3;
    return (ref3 = (ref2 = (ref = this.args) === null || ref === void 0 ? void 0 : ref.delayTouchStart) !== null && ref2 !== void 0 ? ref2 : (ref1 = this.args) === null || ref1 === void 0 ? void 0 : ref1.delay) !== null && ref3 !== void 0 ? ref3 : 0;
  }

  get delayMouseStart() {
    var ref, ref4;
    var ref5, ref6;
    return (ref6 = (ref5 = (ref = this.args) === null || ref === void 0 ? void 0 : ref.delayMouseStart) !== null && ref5 !== void 0 ? ref5 : (ref4 = this.args) === null || ref4 === void 0 ? void 0 : ref4.delay) !== null && ref6 !== void 0 ? ref6 : 0;
  }

  get window() {
    if (this.context && this.context.window) {
      return this.context.window;
    } else if (typeof window !== 'undefined') {
      return window;
    }

    return undefined;
  }

  get document() {
    var ref;

    if ((ref = this.context) === null || ref === void 0 ? void 0 : ref.document) {
      return this.context.document;
    }

    if (this.window) {
      return this.window.document;
    }

    return undefined;
  }

  get rootElement() {
    var ref;
    return ((ref = this.args) === null || ref === void 0 ? void 0 : ref.rootElement) || this.document;
  }

  constructor(args, context) {
    this.args = args;
    this.context = context;
  }

}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));
}
function inAngleRanges(x1, y1, x2, y2, angleRanges) {
  if (!angleRanges) {
    return false;
  }

  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 180;

  for (let i = 0; i < angleRanges.length; ++i) {
    const ar = angleRanges[i];

    if (ar && (ar.start == null || angle >= ar.start) && (ar.end == null || angle <= ar.end)) {
      return true;
    }
  }

  return false;
}

// Used for MouseEvent.buttons (note the s on the end).
const MouseButtons = {
  Left: 1,
  Right: 2,
  Center: 4
}; // Used for e.button (note the lack of an s on the end).

const MouseButton = {
  Left: 0,
  Center: 1,
  Right: 2
};
/**
 * Only touch events and mouse events where the left button is pressed should initiate a drag.
 * @param {MouseEvent | TouchEvent} e The event
 */

function eventShouldStartDrag(e) {
  // For touch events, button will be undefined. If e.button is defined,
  // then it should be MouseButton.Left.
  return e.button === undefined || e.button === MouseButton.Left;
}
/**
 * Only touch events and mouse events where the left mouse button is no longer held should end a drag.
 * It's possible the user mouse downs with the left mouse button, then mouse down and ups with the right mouse button.
 * We don't want releasing the right mouse button to end the drag.
 * @param {MouseEvent | TouchEvent} e The event
 */

function eventShouldEndDrag(e) {
  // Touch events will have buttons be undefined, while mouse events will have e.buttons's left button
  // bit field unset if the left mouse button has been released
  return e.buttons === undefined || (e.buttons & MouseButtons.Left) === 0;
}
function isTouchEvent(e) {
  return !!e.targetTouches;
}

const ELEMENT_NODE = 1;
function getNodeClientOffset(node) {
  const el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;

  if (!el) {
    return undefined;
  }

  const {
    top,
    left
  } = el.getBoundingClientRect();
  return {
    x: left,
    y: top
  };
}
function getEventClientTouchOffset(e, lastTargetTouchFallback) {
  if (e.targetTouches.length === 1) {
    return getEventClientOffset(e.targetTouches[0]);
  } else if (lastTargetTouchFallback && e.touches.length === 1) {
    if (e.touches[0].target === lastTargetTouchFallback.target) {
      return getEventClientOffset(e.touches[0]);
    }
  }

  return;
}
function getEventClientOffset(e, lastTargetTouchFallback) {
  if (isTouchEvent(e)) {
    return getEventClientTouchOffset(e, lastTargetTouchFallback);
  } else {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
}

const supportsPassive = (() => {
  // simular to jQuery's test
  let supported = false;

  try {
    addEventListener('test', () => {// do nothing
    }, Object.defineProperty({}, 'passive', {
      get() {
        supported = true;
        return true;
      }

    }));
  } catch (e) {// do nothing
  }

  return supported;
})();

const eventNames = {
  [ListenerType.mouse]: {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup',
    contextmenu: 'contextmenu'
  },
  [ListenerType.touch]: {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend'
  },
  [ListenerType.keyboard]: {
    keydown: 'keydown'
  }
};
class TouchBackendImpl {
  /**
  * Generate profiling statistics for the HTML5Backend.
  */
  profile() {
    var ref;
    return {
      sourceNodes: this.sourceNodes.size,
      sourcePreviewNodes: this.sourcePreviewNodes.size,
      sourcePreviewNodeOptions: this.sourcePreviewNodeOptions.size,
      targetNodes: this.targetNodes.size,
      dragOverTargetIds: ((ref = this.dragOverTargetIds) === null || ref === void 0 ? void 0 : ref.length) || 0
    };
  } // public for test


  get document() {
    return this.options.document;
  }

  setup() {
    const root = this.options.rootElement;

    if (!root) {
      return;
    }

    invariant(!TouchBackendImpl.isSetUp, 'Cannot have two Touch backends at the same time.');
    TouchBackendImpl.isSetUp = true;
    this.addEventListener(root, 'start', this.getTopMoveStartHandler());
    this.addEventListener(root, 'start', this.handleTopMoveStartCapture, true);
    this.addEventListener(root, 'move', this.handleTopMove);
    this.addEventListener(root, 'move', this.handleTopMoveCapture, true);
    this.addEventListener(root, 'end', this.handleTopMoveEndCapture, true);

    if (this.options.enableMouseEvents && !this.options.ignoreContextMenu) {
      this.addEventListener(root, 'contextmenu', this.handleTopMoveEndCapture);
    }

    if (this.options.enableKeyboardEvents) {
      this.addEventListener(root, 'keydown', this.handleCancelOnEscape, true);
    }
  }

  teardown() {
    const root = this.options.rootElement;

    if (!root) {
      return;
    }

    TouchBackendImpl.isSetUp = false;
    this._mouseClientOffset = {};
    this.removeEventListener(root, 'start', this.handleTopMoveStartCapture, true);
    this.removeEventListener(root, 'start', this.handleTopMoveStart);
    this.removeEventListener(root, 'move', this.handleTopMoveCapture, true);
    this.removeEventListener(root, 'move', this.handleTopMove);
    this.removeEventListener(root, 'end', this.handleTopMoveEndCapture, true);

    if (this.options.enableMouseEvents && !this.options.ignoreContextMenu) {
      this.removeEventListener(root, 'contextmenu', this.handleTopMoveEndCapture);
    }

    if (this.options.enableKeyboardEvents) {
      this.removeEventListener(root, 'keydown', this.handleCancelOnEscape, true);
    }

    this.uninstallSourceNodeRemovalObserver();
  }

  addEventListener(subject, event, handler, capture = false) {
    const options = supportsPassive ? {
      capture,
      passive: false
    } : capture;
    this.listenerTypes.forEach(function (listenerType) {
      const evt = eventNames[listenerType][event];

      if (evt) {
        subject.addEventListener(evt, handler, options);
      }
    });
  }

  removeEventListener(subject, event, handler, capture = false) {
    const options = supportsPassive ? {
      capture,
      passive: false
    } : capture;
    this.listenerTypes.forEach(function (listenerType) {
      const evt = eventNames[listenerType][event];

      if (evt) {
        subject.removeEventListener(evt, handler, options);
      }
    });
  }

  connectDragSource(sourceId, node) {
    const handleMoveStart = this.handleMoveStart.bind(this, sourceId);
    this.sourceNodes.set(sourceId, node);
    this.addEventListener(node, 'start', handleMoveStart);
    return () => {
      this.sourceNodes.delete(sourceId);
      this.removeEventListener(node, 'start', handleMoveStart);
    };
  }

  connectDragPreview(sourceId, node, options) {
    this.sourcePreviewNodeOptions.set(sourceId, options);
    this.sourcePreviewNodes.set(sourceId, node);
    return () => {
      this.sourcePreviewNodes.delete(sourceId);
      this.sourcePreviewNodeOptions.delete(sourceId);
    };
  }

  connectDropTarget(targetId, node) {
    const root = this.options.rootElement;

    if (!this.document || !root) {
      return () => {
        /* noop */
      };
    }

    const handleMove = e => {
      if (!this.document || !root || !this.monitor.isDragging()) {
        return;
      }

      let coords;
      /**
      * Grab the coordinates for the current mouse/touch position
      */

      switch (e.type) {
        case eventNames.mouse.move:
          coords = {
            x: e.clientX,
            y: e.clientY
          };
          break;

        case eventNames.touch.move:
          var ref, ref1;
          coords = {
            x: ((ref = e.touches[0]) === null || ref === void 0 ? void 0 : ref.clientX) || 0,
            y: ((ref1 = e.touches[0]) === null || ref1 === void 0 ? void 0 : ref1.clientY) || 0
          };
          break;
      }
      /**
      * Use the coordinates to grab the element the drag ended on.
      * If the element is the same as the target node (or any of it's children) then we have hit a drop target and can handle the move.
      */


      const droppedOn = coords != null ? this.document.elementFromPoint(coords.x, coords.y) : undefined;
      const childMatch = droppedOn && node.contains(droppedOn);

      if (droppedOn === node || childMatch) {
        return this.handleMove(e, targetId);
      }
    };
    /**
    * Attaching the event listener to the body so that touchmove will work while dragging over multiple target elements.
    */


    this.addEventListener(this.document.body, 'move', handleMove);
    this.targetNodes.set(targetId, node);
    return () => {
      if (this.document) {
        this.targetNodes.delete(targetId);
        this.removeEventListener(this.document.body, 'move', handleMove);
      }
    };
  }

  getTopMoveStartHandler() {
    if (!this.options.delayTouchStart && !this.options.delayMouseStart) {
      return this.handleTopMoveStart;
    }

    return this.handleTopMoveStartDelay;
  }

  installSourceNodeRemovalObserver(node) {
    this.uninstallSourceNodeRemovalObserver();
    this.draggedSourceNode = node;
    this.draggedSourceNodeRemovalObserver = new MutationObserver(() => {
      if (node && !node.parentElement) {
        this.resurrectSourceNode();
        this.uninstallSourceNodeRemovalObserver();
      }
    });

    if (!node || !node.parentElement) {
      return;
    }

    this.draggedSourceNodeRemovalObserver.observe(node.parentElement, {
      childList: true
    });
  }

  resurrectSourceNode() {
    if (this.document && this.draggedSourceNode) {
      this.draggedSourceNode.style.display = 'none';
      this.draggedSourceNode.removeAttribute('data-reactid');
      this.document.body.appendChild(this.draggedSourceNode);
    }
  }

  uninstallSourceNodeRemovalObserver() {
    if (this.draggedSourceNodeRemovalObserver) {
      this.draggedSourceNodeRemovalObserver.disconnect();
    }

    this.draggedSourceNodeRemovalObserver = undefined;
    this.draggedSourceNode = undefined;
  }

  constructor(manager, context, options) {
    this.getSourceClientOffset = sourceId => {
      const element = this.sourceNodes.get(sourceId);
      return element && getNodeClientOffset(element);
    };

    this.handleTopMoveStartCapture = e => {
      if (!eventShouldStartDrag(e)) {
        return;
      }

      this.moveStartSourceIds = [];
    };

    this.handleMoveStart = sourceId => {
      // Just because we received an event doesn't necessarily mean we need to collect drag sources.
      // We only collect start collecting drag sources on touch and left mouse events.
      if (Array.isArray(this.moveStartSourceIds)) {
        this.moveStartSourceIds.unshift(sourceId);
      }
    };

    this.handleTopMoveStart = e => {
      if (!eventShouldStartDrag(e)) {
        return;
      } // Don't prematurely preventDefault() here since it might:
      // 1. Mess up scrolling
      // 2. Mess up long tap (which brings up context menu)
      // 3. If there's an anchor link as a child, tap won't be triggered on link


      const clientOffset = getEventClientOffset(e);

      if (clientOffset) {
        if (isTouchEvent(e)) {
          this.lastTargetTouchFallback = e.targetTouches[0];
        }

        this._mouseClientOffset = clientOffset;
      }

      this.waitingForDelay = false;
    };

    this.handleTopMoveStartDelay = e => {
      if (!eventShouldStartDrag(e)) {
        return;
      }

      const delay = e.type === eventNames.touch.start ? this.options.delayTouchStart : this.options.delayMouseStart;
      this.timeout = setTimeout(this.handleTopMoveStart.bind(this, e), delay);
      this.waitingForDelay = true;
    };

    this.handleTopMoveCapture = () => {
      this.dragOverTargetIds = [];
    };

    this.handleMove = (_evt, targetId) => {
      if (this.dragOverTargetIds) {
        this.dragOverTargetIds.unshift(targetId);
      }
    };

    this.handleTopMove = e1 => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      if (!this.document || this.waitingForDelay) {
        return;
      }

      const {
        moveStartSourceIds,
        dragOverTargetIds
      } = this;
      const enableHoverOutsideTarget = this.options.enableHoverOutsideTarget;
      const clientOffset = getEventClientOffset(e1, this.lastTargetTouchFallback);

      if (!clientOffset) {
        return;
      } // If the touch move started as a scroll, or is is between the scroll angles


      if (this._isScrolling || !this.monitor.isDragging() && inAngleRanges(this._mouseClientOffset.x || 0, this._mouseClientOffset.y || 0, clientOffset.x, clientOffset.y, this.options.scrollAngleRanges)) {
        this._isScrolling = true;
        return;
      } // If we're not dragging and we've moved a little, that counts as a drag start


      if (!this.monitor.isDragging() && // eslint-disable-next-line no-prototype-builtins
      this._mouseClientOffset.hasOwnProperty('x') && moveStartSourceIds && distance(this._mouseClientOffset.x || 0, this._mouseClientOffset.y || 0, clientOffset.x, clientOffset.y) > (this.options.touchSlop ? this.options.touchSlop : 0)) {
        this.moveStartSourceIds = undefined;
        this.actions.beginDrag(moveStartSourceIds, {
          clientOffset: this._mouseClientOffset,
          getSourceClientOffset: this.getSourceClientOffset,
          publishSource: false
        });
      }

      if (!this.monitor.isDragging()) {
        return;
      }

      const sourceNode = this.sourceNodes.get(this.monitor.getSourceId());
      this.installSourceNodeRemovalObserver(sourceNode);
      this.actions.publishDragSource();
      if (e1.cancelable) e1.preventDefault(); // Get the node elements of the hovered DropTargets

      const dragOverTargetNodes = (dragOverTargetIds || []).map(key => this.targetNodes.get(key)).filter(e => !!e); // Get the a ordered list of nodes that are touched by

      const elementsAtPoint = this.options.getDropTargetElementsAtPoint ? this.options.getDropTargetElementsAtPoint(clientOffset.x, clientOffset.y, dragOverTargetNodes) : this.document.elementsFromPoint(clientOffset.x, clientOffset.y); // Extend list with parents that are not receiving elementsFromPoint events (size 0 elements and svg groups)

      const elementsAtPointExtended = [];

      for (const nodeId in elementsAtPoint) {
        // eslint-disable-next-line no-prototype-builtins
        if (!elementsAtPoint.hasOwnProperty(nodeId)) {
          continue;
        }

        let currentNode = elementsAtPoint[nodeId];

        if (currentNode != null) {
          elementsAtPointExtended.push(currentNode);
        }

        while (currentNode) {
          currentNode = currentNode.parentElement;

          if (currentNode && elementsAtPointExtended.indexOf(currentNode) === -1) {
            elementsAtPointExtended.push(currentNode);
          }
        }
      }

      const orderedDragOverTargetIds = elementsAtPointExtended // Filter off nodes that arent a hovered DropTargets nodes
      .filter(node => dragOverTargetNodes.indexOf(node) > -1) // Map back the nodes elements to targetIds
      .map(node => this._getDropTargetId(node)) // Filter off possible null rows
      .filter(node => !!node).filter((id, index, ids) => ids.indexOf(id) === index); // Invoke hover for drop targets when source node is still over and pointer is outside

      if (enableHoverOutsideTarget) {
        for (const targetId in this.targetNodes) {
          const targetNode = this.targetNodes.get(targetId);

          if (sourceNode && targetNode && targetNode.contains(sourceNode) && orderedDragOverTargetIds.indexOf(targetId) === -1) {
            orderedDragOverTargetIds.unshift(targetId);
            break;
          }
        }
      } // Reverse order because dnd-core reverse it before calling the DropTarget drop methods


      orderedDragOverTargetIds.reverse();
      this.actions.hover(orderedDragOverTargetIds, {
        clientOffset: clientOffset
      });
    };
    /**
    *
    * visible for testing
    */


    this._getDropTargetId = node => {
      const keys = this.targetNodes.keys();
      let next = keys.next();

      while (next.done === false) {
        const targetId = next.value;

        if (node === this.targetNodes.get(targetId)) {
          return targetId;
        } else {
          next = keys.next();
        }
      }

      return undefined;
    };

    this.handleTopMoveEndCapture = e => {
      this._isScrolling = false;
      this.lastTargetTouchFallback = undefined;

      if (!eventShouldEndDrag(e)) {
        return;
      }

      if (!this.monitor.isDragging() || this.monitor.didDrop()) {
        this.moveStartSourceIds = undefined;
        return;
      }

      if (e.cancelable) e.preventDefault();
      this._mouseClientOffset = {};
      this.uninstallSourceNodeRemovalObserver();
      this.actions.drop();
      this.actions.endDrag();
    };

    this.handleCancelOnEscape = e => {
      if (e.key === 'Escape' && this.monitor.isDragging()) {
        this._mouseClientOffset = {};
        this.uninstallSourceNodeRemovalObserver();
        this.actions.endDrag();
      }
    };

    this.options = new OptionsReader(options, context);
    this.actions = manager.getActions();
    this.monitor = manager.getMonitor();
    this.sourceNodes = new Map();
    this.sourcePreviewNodes = new Map();
    this.sourcePreviewNodeOptions = new Map();
    this.targetNodes = new Map();
    this.listenerTypes = [];
    this._mouseClientOffset = {};
    this._isScrolling = false;

    if (this.options.enableMouseEvents) {
      this.listenerTypes.push(ListenerType.mouse);
    }

    if (this.options.enableTouchEvents) {
      this.listenerTypes.push(ListenerType.touch);
    }

    if (this.options.enableKeyboardEvents) {
      this.listenerTypes.push(ListenerType.keyboard);
    }
  }

}

const TouchBackend = function createBackend(manager, context = {}, options = {}) {
  return new TouchBackendImpl(manager, context, options);
};

const COLUMNS = 'abcdefgh'.split('');
const chessboardDefaultProps = {
  animationDuration: 300,
  areArrowsAllowed: true,
  arePiecesDraggable: true,
  arePremovesAllowed: false,
  boardOrientation: 'white',
  boardWidth: 560,
  clearPremovesOnRightClick: true,
  customArrows: [],
  customArrowColor: 'rgb(255,170,0)',
  customBoardStyle: {},
  customDarkSquareStyle: {
    backgroundColor: '#B58863'
  },
  customDndBackend: undefined,
  customDndBackendOptions: undefined,
  customDropSquareStyle: {
    boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)'
  },
  customLightSquareStyle: {
    backgroundColor: '#F0D9B5'
  },
  customPieces: {},
  customPremoveDarkSquareStyle: {
    backgroundColor: '#A42323'
  },
  customPremoveLightSquareStyle: {
    backgroundColor: '#BD2828'
  },
  customSquareStyles: {},
  dropOffBoardAction: 'snapback',
  id: 0,
  isDraggablePiece: () => true,
  getPositionObject: () => {},
  onArrowsChange: () => {},
  onDragOverSquare: () => {},
  onMouseOutSquare: () => {},
  onMouseOverSquare: () => {},
  onPieceClick: () => {},
  onPieceDragBegin: () => {},
  onPieceDragEnd: () => {},
  onPieceDrop: () => true,
  onSquareClick: () => {},
  onSquareRightClick: () => {},
  position: 'start',
  showBoardNotation: true,
  // showSparePieces: false,
  snapToCursor: true
};

const startPositionObject = {
  a8: 'bR',
  b8: 'bN',
  c8: 'bB',
  d8: 'bQ',
  e8: 'bK',
  f8: 'bB',
  g8: 'bN',
  h8: 'bR',
  a7: 'bP',
  b7: 'bP',
  c7: 'bP',
  d7: 'bP',
  e7: 'bP',
  f7: 'bP',
  g7: 'bP',
  h7: 'bP',
  a2: 'wP',
  b2: 'wP',
  c2: 'wP',
  d2: 'wP',
  e2: 'wP',
  f2: 'wP',
  g2: 'wP',
  h2: 'wP',
  a1: 'wR',
  b1: 'wN',
  c1: 'wB',
  d1: 'wQ',
  e1: 'wK',
  f1: 'wB',
  g1: 'wN',
  h1: 'wR'
};
const whiteColumnValues = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
};
const blackColumnValues = {
  a: 7,
  b: 6,
  c: 5,
  d: 4,
  e: 3,
  f: 2,
  g: 1,
  h: 0
};
const whiteRows = [7, 6, 5, 4, 3, 2, 1, 0];
const blackRows = [0, 1, 2, 3, 4, 5, 6, 7];
const getRelativeCoords = (boardOrientation, boardWidth, square) => {
  const squareWidth = boardWidth / 8;
  const columns = boardOrientation === 'white' ? whiteColumnValues : blackColumnValues;
  const rows = boardOrientation === 'white' ? whiteRows : blackRows;
  const x = columns[square[0]] * squareWidth + squareWidth / 2;
  const y = rows[square[1] - 1] * squareWidth + squareWidth / 2;
  return {
    x,
    y
  };
};
const isDifferentFromStart = newPosition => {
  let isDifferent = false;
  Object.keys(startPositionObject).forEach(square => {
    if (newPosition[square] !== startPositionObject[square]) isDifferent = true;
  });
  Object.keys(newPosition).forEach(square => {
    if (startPositionObject[square] !== newPosition[square]) isDifferent = true;
  });
  return isDifferent;
};
const getPositionDifferences = (currentPosition, newPosition) => {
  const difference = {
    removed: {},
    added: {}
  }; // removed from current

  Object.keys(currentPosition).forEach(square => {
    if (newPosition[square] !== currentPosition[square]) difference.removed[square] = currentPosition[square];
  }); // added from new

  Object.keys(newPosition).forEach(square => {
    if (currentPosition[square] !== newPosition[square]) difference.added[square] = newPosition[square];
  });
  return difference;
};

function isString(s) {
  return typeof s === 'string';
}

function convertPositionToObject(position) {
  if (position === 'start') return fenToObj('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  if (validFen(position)) return fenToObj(position);
  if (validPositionObject(position)) return position;
  return {};
}
function fenToObj(fen) {
  if (!validFen(fen)) return false; // cut off any move, castling, etc info from the end. we're only interested in position information

  fen = fen.replace(/ .+$/, '');
  const rows = fen.split('/');
  const position = {};
  let currentRow = 8;

  for (let i = 0; i < 8; i++) {
    const row = rows[i].split('');
    let colIdx = 0; // loop through each character in the FEN section

    for (let j = 0; j < row.length; j++) {
      // number / empty squares
      if (row[j].search(/[1-8]/) !== -1) {
        const numEmptySquares = parseInt(row[j], 10);
        colIdx = colIdx + numEmptySquares;
      } else {
        // piece
        const square = COLUMNS[colIdx] + currentRow;
        position[square] = fenToPieceCode(row[j]);
        colIdx = colIdx + 1;
      }
    }

    currentRow = currentRow - 1;
  }

  return position;
}

function expandFenEmptySquares(fen) {
  return fen.replace(/8/g, '11111111').replace(/7/g, '1111111').replace(/6/g, '111111').replace(/5/g, '11111').replace(/4/g, '1111').replace(/3/g, '111').replace(/2/g, '11');
}

function validFen(fen) {
  if (!isString(fen)) return false; // cut off any move, castling, etc info from the end. we're only interested in position information

  fen = fen.replace(/ .+$/, ''); // expand the empty square numbers to just 1s

  fen = expandFenEmptySquares(fen); // FEN should be 8 sections separated by slashes

  const chunks = fen.split('/');
  if (chunks.length !== 8) return false; // check each section

  for (let i = 0; i < 8; i++) {
    if (chunks[i].length !== 8 || chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
      return false;
    }
  }

  return true;
} // convert FEN piece code to bP, wK, etc

function fenToPieceCode(piece) {
  // black piece
  if (piece.toLowerCase() === piece) {
    return 'b' + piece.toUpperCase();
  } // white piece


  return 'w' + piece.toUpperCase();
}

function validSquare(square) {
  return isString(square) && square.search(/^[a-h][1-8]$/) !== -1;
}

function validPieceCode(code) {
  return isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1;
}

function validPositionObject(pos) {
  if (pos === null || typeof pos !== 'object') return false;

  for (const i in pos) {
    if (!pos[i]) continue;

    if (!validSquare(i) || !validPieceCode(pos[i])) {
      return false;
    }
  }

  return true;
}

const defaultPieces = {
  wP: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsx("path", {
      d: "m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z",
      style: {
        opacity: '1',
        fill: '#ffffff',
        fillOpacity: '1',
        fillRule: 'nonzero',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'miter',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      }
    })
  }),
  wR: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        opacity: '1',
        fill: '#ffffff',
        fillOpacity: '1',
        fillRule: 'evenodd',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      },
      children: [/*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z ",
        style: {
          strokeLinecap: 'butt'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z ",
        style: {
          strokeLinecap: 'butt'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14",
        style: {
          strokeLinecap: 'butt'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 34,14 L 31,17 L 14,17 L 11,14"
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 31,17 L 31,29.5 L 14,29.5 L 14,17",
        style: {
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5"
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 11,14 L 34,14",
        style: {
          fill: 'none',
          stroke: '#000000',
          strokeLinejoin: 'miter'
        }
      })]
    })
  }),
  wN: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        opacity: '1',
        fill: 'none',
        fillOpacity: '1',
        fillRule: 'evenodd',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      },
      children: [/*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18",
        style: {
          fill: '#ffffff',
          stroke: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10",
        style: {
          fill: '#ffffff',
          stroke: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z",
        style: {
          fill: '#000000',
          stroke: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z",
        transform: "matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)",
        style: {
          fill: '#000000',
          stroke: '#000000'
        }
      })]
    })
  }),
  wB: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        opacity: '1',
        fill: 'none',
        fillRule: 'evenodd',
        fillOpacity: '1',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      },
      children: [/*#__PURE__*/jsxRuntime.jsxs("g", {
        style: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeLinecap: 'butt'
        },
        children: [/*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"
        }), /*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"
        }), /*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"
        })]
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18",
        style: {
          fill: 'none',
          stroke: '#000000',
          strokeLinejoin: 'miter'
        }
      })]
    })
  }),
  wQ: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinejoin: 'round'
      },
      children: [/*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 11.5,30 C 15,29 30,29 33.5,30",
        style: {
          fill: 'none'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12,33.5 C 18,32.5 27,32.5 33,33.5",
        style: {
          fill: 'none'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "6",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "14",
        cy: "9",
        r: "2"
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "22.5",
        cy: "8",
        r: "2"
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "31",
        cy: "9",
        r: "2"
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "39",
        cy: "12",
        r: "2"
      })]
    })
  }),
  wK: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        fill: 'none',
        fillOpacity: '1',
        fillRule: 'evenodd',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      },
      children: [/*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 22.5,11.63 L 22.5,6",
        style: {
          fill: 'none',
          stroke: '#000000',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 20,8 L 25,8",
        style: {
          fill: 'none',
          stroke: '#000000',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25",
        style: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37",
        style: {
          fill: '#ffffff',
          stroke: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12.5,30 C 18,27 27,27 32.5,30",
        style: {
          fill: 'none',
          stroke: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5",
        style: {
          fill: 'none',
          stroke: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12.5,37 C 18,34 27,34 32.5,37",
        style: {
          fill: 'none',
          stroke: '#000000'
        }
      })]
    })
  }),
  bP: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsx("path", {
      d: "m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z",
      style: {
        opacity: '1',
        fill: '#000000',
        fillOpacity: '1',
        fillRule: 'nonzero',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'miter',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      }
    })
  }),
  bR: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        opacity: '1',
        fill: '#000000',
        fillOpacity: '1',
        fillRule: 'evenodd',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      },
      children: [/*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z ",
        style: {
          strokeLinecap: 'butt'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z ",
        style: {
          strokeLinecap: 'butt'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z ",
        style: {
          strokeLinecap: 'butt'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z ",
        style: {
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z ",
        style: {
          strokeLinecap: 'butt'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z ",
        style: {
          strokeLinecap: 'butt'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12,35.5 L 33,35.5 L 33,35.5",
        style: {
          fill: 'none',
          stroke: '#ffffff',
          strokeWidth: '1',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 13,31.5 L 32,31.5",
        style: {
          fill: 'none',
          stroke: '#ffffff',
          strokeWidth: '1',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 14,29.5 L 31,29.5",
        style: {
          fill: 'none',
          stroke: '#ffffff',
          strokeWidth: '1',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 14,16.5 L 31,16.5",
        style: {
          fill: 'none',
          stroke: '#ffffff',
          strokeWidth: '1',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 11,14 L 34,14",
        style: {
          fill: 'none',
          stroke: '#ffffff',
          strokeWidth: '1',
          strokeLinejoin: 'miter'
        }
      })]
    })
  }),
  bN: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        opacity: '1',
        fill: 'none',
        fillOpacity: '1',
        fillRule: 'evenodd',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      },
      children: [/*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18",
        style: {
          fill: '#000000',
          stroke: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10",
        style: {
          fill: '#000000',
          stroke: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z",
        style: {
          fill: '#ffffff',
          stroke: '#ffffff'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z",
        transform: "matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)",
        style: {
          fill: '#ffffff',
          stroke: '#ffffff'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z ",
        style: {
          fill: '#ffffff',
          stroke: 'none'
        }
      })]
    })
  }),
  bB: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        opacity: '1',
        fill: 'none',
        fillRule: 'evenodd',
        fillOpacity: '1',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      },
      children: [/*#__PURE__*/jsxRuntime.jsxs("g", {
        style: {
          fill: '#000000',
          stroke: '#000000',
          strokeLinecap: 'butt'
        },
        children: [/*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"
        }), /*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"
        }), /*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"
        })]
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18",
        style: {
          fill: 'none',
          stroke: '#ffffff',
          strokeLinejoin: 'miter'
        }
      })]
    })
  }),
  bQ: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      },
      children: [/*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z",
        style: {
          strokeLinecap: 'butt',
          fill: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z"
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 11.5,30 C 15,29 30,29 33.5,30"
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "m 12,33.5 c 6,-1 15,-1 21,0"
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "6",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "14",
        cy: "9",
        r: "2"
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "22.5",
        cy: "8",
        r: "2"
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "31",
        cy: "9",
        r: "2"
      }), /*#__PURE__*/jsxRuntime.jsx("circle", {
        cx: "39",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 11,38.5 A 35,35 1 0 0 34,38.5",
        style: {
          fill: 'none',
          stroke: '#000000',
          strokeLinecap: 'butt'
        }
      }), /*#__PURE__*/jsxRuntime.jsxs("g", {
        style: {
          fill: 'none',
          stroke: '#ffffff'
        },
        children: [/*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 11,29 A 35,35 1 0 1 34,29"
        }), /*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 12.5,31.5 L 32.5,31.5"
        }), /*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"
        }), /*#__PURE__*/jsxRuntime.jsx("path", {
          d: "M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"
        })]
      })]
    })
  }),
  bK: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    width: "45",
    height: "45",
    children: /*#__PURE__*/jsxRuntime.jsxs("g", {
      style: {
        fill: 'none',
        fillOpacity: '1',
        fillRule: 'evenodd',
        stroke: '#000000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: '4',
        strokeDasharray: 'none',
        strokeOpacity: '1'
      },
      children: [/*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 22.5,11.63 L 22.5,6",
        style: {
          fill: 'none',
          stroke: '#000000',
          strokeLinejoin: 'miter'
        },
        id: "path6570"
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25",
        style: {
          fill: '#000000',
          fillOpacity: '1',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37",
        style: {
          fill: '#000000',
          stroke: '#000000'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 20,8 L 25,8",
        style: {
          fill: 'none',
          stroke: '#000000',
          strokeLinejoin: 'miter'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5",
        style: {
          fill: 'none',
          stroke: '#ffffff'
        }
      }), /*#__PURE__*/jsxRuntime.jsx("path", {
        d: "M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37",
        style: {
          fill: 'none',
          stroke: '#ffffff'
        }
      })]
    })
  })
};

const ChessboardContext = /*#__PURE__*/React__default["default"].createContext();
const useChessboard = () => React.useContext(ChessboardContext);
const ChessboardProvider = /*#__PURE__*/React.forwardRef(({
  animationDuration,
  areArrowsAllowed,
  arePiecesDraggable,
  arePremovesAllowed,
  boardOrientation,
  boardWidth,
  clearPremovesOnRightClick,
  customArrows,
  customArrowColor,
  customBoardStyle,
  customDarkSquareStyle,
  customDropSquareStyle,
  customLightSquareStyle,
  customPieces,
  customPremoveDarkSquareStyle,
  customPremoveLightSquareStyle,
  customSquareStyles,
  dropOffBoardAction,
  id,
  isDraggablePiece,
  getPositionObject,
  onArrowsChange,
  onDragOverSquare,
  onMouseOutSquare,
  onMouseOverSquare,
  onPieceClick,
  onPieceDragBegin,
  onPieceDragEnd,
  onPieceDrop,
  onSquareClick,
  onSquareRightClick,
  position,
  showBoardNotation,
  showSparePieces,
  snapToCursor,
  children
}, ref) => {
  // position stored and displayed on board
  const [currentPosition, setCurrentPosition] = React.useState(convertPositionToObject(position)); // calculated differences between current and incoming positions

  const [positionDifferences, setPositionDifferences] = React.useState({}); // colour of last piece moved to determine if premoving

  const [lastPieceColour, setLastPieceColour] = React.useState(undefined); // current premoves

  const [premoves, setPremoves] = React.useState([]); // ref used to access current value during timeouts (closures)

  const premovesRef = React.useRef(premoves); // current right mouse down square

  const [currentRightClickDown, setCurrentRightClickDown] = React.useState(); // current arrows

  const [arrows, setArrows] = React.useState([]); // chess pieces/styling

  const [chessPieces, setChessPieces] = React.useState({ ...defaultPieces,
    ...customPieces
  }); // whether the last move was a manual drop or not

  const [manualDrop, setManualDrop] = React.useState(false); // the most recent timeout whilst waiting for animation to complete

  const [previousTimeout, setPreviousTimeout] = React.useState(undefined); // if currently waiting for an animation to finish

  const [waitingForAnimation, setWaitingForAnimation] = React.useState(false); // open clearPremoves() to allow user to call on undo/reset/whenever

  React.useImperativeHandle(ref, () => ({
    clearPremoves(clearLastPieceColour = true) {
      clearPremoves(clearLastPieceColour);
    }

  })); // handle custom pieces change

  React.useEffect(() => {
    setChessPieces({ ...defaultPieces,
      ...customPieces
    });
  }, [customPieces]); // handle external position change

  React.useEffect(() => {
    var _Object$keys, _Object$entries, _Object$entries$;

    const newPosition = convertPositionToObject(position);
    const differences = getPositionDifferences(currentPosition, newPosition);
    const newPieceColour = ((_Object$keys = Object.keys(differences.added)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.length) <= 2 ? (_Object$entries = Object.entries(differences.added)) === null || _Object$entries === void 0 ? void 0 : (_Object$entries$ = _Object$entries[0]) === null || _Object$entries$ === void 0 ? void 0 : _Object$entries$[1][0] : undefined; // external move has come in before animation is over
    // cancel animation and immediately update position

    if (waitingForAnimation) {
      setCurrentPosition(newPosition);
      setWaitingForAnimation(false);
      arePremovesAllowed && attemptPremove(newPieceColour);

      if (previousTimeout) {
        clearTimeout(previousTimeout);
      }
    } else {
      // move was made using drag and drop
      if (manualDrop) {
        setCurrentPosition(newPosition);
        setWaitingForAnimation(false);
        arePremovesAllowed && attemptPremove(newPieceColour);
      } else {
        // move was made by external position change
        // if position === start then don't override newPieceColour
        // needs isDifferentFromStart in scenario where premoves have been cleared upon board reset but first move is made by computer, the last move colour would need to be updated
        if (isDifferentFromStart(newPosition) && lastPieceColour !== undefined) {
          setLastPieceColour(newPieceColour);
        } else {
          // position === start, likely a board reset
          setLastPieceColour(undefined);
        }

        setPositionDifferences(differences); // animate external move

        setWaitingForAnimation(true);
        const newTimeout = setTimeout(() => {
          setCurrentPosition(newPosition);
          setWaitingForAnimation(false);
          arePremovesAllowed && attemptPremove(newPieceColour);
        }, animationDuration);
        setPreviousTimeout(newTimeout);
      }
    } // reset manual drop, ready for next move to be made by user or external


    setManualDrop(false); // inform latest position information

    getPositionObject(newPosition); // clear arrows

    clearArrows(); // clear timeout on unmount

    return () => {
      clearTimeout(previousTimeout);
    };
  }, [position]); // handle external arrows change

  React.useEffect(() => {
    setArrows(customArrows);
  }, [customArrows]); // callback when new arrows are set

  React.useEffect(() => {
    onArrowsChange(arrows);
  }, [arrows]); // handle drop position change

  function handleSetPosition(sourceSq, targetSq, piece) {
    // if dropped back down, don't do anything
    if (sourceSq === targetSq) {
      return;
    }

    clearArrows(); // if second move is made for same colour, or there are still premoves queued, then this move needs to be added to premove queue instead of played
    // premoves length check for colour is added in because white could make 3 premoves, and then black responds to the first move (changing the last piece colour) and then white pre-moves again

    if (arePremovesAllowed && waitingForAnimation || arePremovesAllowed && (lastPieceColour === piece[0] || premovesRef.current.filter(p => p.piece[0] === piece[0]).length > 0)) {
      const oldPremoves = [...premovesRef.current];
      oldPremoves.push({
        sourceSq,
        targetSq,
        piece
      });
      premovesRef.current = oldPremoves;
      setPremoves([...oldPremoves]);
      return;
    } // if transitioning, don't allow new drop


    if (!arePremovesAllowed && waitingForAnimation) return;
    const newOnDropPosition = { ...currentPosition
    };
    setManualDrop(true);
    setLastPieceColour(piece[0]); // if onPieceDrop function provided, execute it, position must be updated externally and captured by useEffect above for this move to show on board

    if (onPieceDrop.length) {
      const isValidMove = onPieceDrop(sourceSq, targetSq, piece);
      if (!isValidMove) clearPremoves();
    } else {
      // delete if dropping off board
      if (dropOffBoardAction === 'trash' && !targetSq) {
        delete newOnDropPosition[sourceSq];
      } // delete source piece if not dropping from spare piece


      if (sourceSq !== 'spare') {
        delete newOnDropPosition[sourceSq];
      } // add piece in new position


      newOnDropPosition[targetSq] = piece;
      setCurrentPosition(newOnDropPosition);
    } // inform latest position information


    getPositionObject(newOnDropPosition);
  }

  function attemptPremove(newPieceColour) {
    if (premovesRef.current.length === 0) return; // get current value of premove as this is called in a timeout so value may have changed since timeout was set

    const premove = premovesRef.current[0]; // if premove is a differing colour to last move made, then this move can be made

    if (premove.piece[0] !== undefined && premove.piece[0] !== newPieceColour && onPieceDrop.length) {
      setLastPieceColour(premove.piece[0]);
      setManualDrop(true); // pre-move doesn't need animation

      const isValidMove = onPieceDrop(premove.sourceSq, premove.targetSq, premove.piece); // premove was successful and can be removed from queue

      if (isValidMove) {
        const oldPremoves = [...premovesRef.current];
        oldPremoves.shift();
        premovesRef.current = oldPremoves;
        setPremoves([...oldPremoves]);
      } else {
        // premove wasn't successful, clear premove queue
        clearPremoves();
      }
    }
  }

  function clearPremoves(clearLastPieceColour = true) {
    // don't clear when right clicking to clear, otherwise you won't be able to premove again before next go
    if (clearLastPieceColour) setLastPieceColour(undefined);
    premovesRef.current = [];
    setPremoves([]);
  }

  function onRightClickDown(square) {
    setCurrentRightClickDown(square);
  }

  function onRightClickUp(square) {
    if (!areArrowsAllowed) return;

    if (currentRightClickDown) {
      // same square, don't draw an arrow, but do clear premoves and run onSquareRightClick
      if (currentRightClickDown === square) {
        setCurrentRightClickDown(null);
        clearPremovesOnRightClick && clearPremoves(false);
        onSquareRightClick(square);
        return;
      } // if arrow already exists then it needs to be removed


      for (const i in arrows) {
        if (arrows[i][0] === currentRightClickDown && arrows[i][1] === square) {
          setArrows(oldArrows => {
            const newArrows = [...oldArrows];
            newArrows.splice(i, 1);
            return newArrows;
          });
          return;
        }
      } // different square, draw an arrow


      setArrows(oldArrows => [...oldArrows, [currentRightClickDown, square]]);
    } else setCurrentRightClickDown(null);
  }

  function clearCurrentRightClickDown() {
    setCurrentRightClickDown(null);
  }

  function clearArrows() {
    setArrows([]);
  }

  return /*#__PURE__*/jsxRuntime.jsx(ChessboardContext.Provider, {
    value: {
      animationDuration,
      arePiecesDraggable,
      arePremovesAllowed,
      boardOrientation,
      boardWidth,
      customArrowColor,
      customBoardStyle,
      customDarkSquareStyle,
      customDropSquareStyle,
      customLightSquareStyle,
      customPremoveDarkSquareStyle,
      customPremoveLightSquareStyle,
      customSquareStyles,
      dropOffBoardAction,
      id,
      isDraggablePiece,
      getPositionObject,
      onDragOverSquare,
      onMouseOutSquare,
      onMouseOverSquare,
      onPieceClick,
      onPieceDragBegin,
      onPieceDragEnd,
      onPieceDrop,
      onSquareClick,
      onSquareRightClick,
      showBoardNotation,
      showSparePieces,
      snapToCursor,
      arrows,
      chessPieces,
      clearArrows,
      clearCurrentRightClickDown,
      clearPremoves,
      currentPosition,
      handleSetPosition,
      lastPieceColour,
      manualDrop,
      onRightClickDown,
      onRightClickUp,
      positionDifferences,
      premoves,
      setChessPieces,
      setCurrentPosition,
      setManualDrop,
      waitingForAnimation
    },
    children: children
  });
});

function Notation({
  row,
  col
}) {
  const {
    boardOrientation,
    boardWidth,
    customDarkSquareStyle,
    customLightSquareStyle
  } = useChessboard();
  const whiteColor = customLightSquareStyle.backgroundColor;
  const blackColor = customDarkSquareStyle.backgroundColor;
  const isRow = col === 0;
  const isColumn = row === 7;
  const isBottomLeftSquare = isRow && isColumn;

  function getRow() {
    return boardOrientation === 'white' ? 8 - row : row + 1;
  }

  function getColumn() {
    return boardOrientation === 'black' ? COLUMNS[7 - col] : COLUMNS[col];
  }

  function renderBottomLeft() {
    return /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
      children: [/*#__PURE__*/jsxRuntime.jsx("div", {
        style: { ...notationStyle,
          ...{
            color: whiteColor
          },
          ...numericStyle(boardWidth)
        },
        children: getRow()
      }), /*#__PURE__*/jsxRuntime.jsx("div", {
        style: { ...notationStyle,
          ...{
            color: whiteColor
          },
          ...alphaStyle(boardWidth)
        },
        children: getColumn()
      })]
    });
  }

  function renderLetters() {
    return /*#__PURE__*/jsxRuntime.jsx("div", {
      style: { ...notationStyle,
        ...{
          color: col % 2 !== 0 ? blackColor : whiteColor
        },
        ...alphaStyle(boardWidth)
      },
      children: getColumn()
    });
  }

  function renderNumbers() {
    return /*#__PURE__*/jsxRuntime.jsx("div", {
      style: { ...notationStyle,
        ...(boardOrientation === 'black' ? {
          color: row % 2 === 0 ? blackColor : whiteColor
        } : {
          color: row % 2 === 0 ? blackColor : whiteColor
        }),
        ...numericStyle(boardWidth)
      },
      children: getRow()
    });
  }

  if (isBottomLeftSquare) {
    return renderBottomLeft();
  }

  if (isColumn) {
    return renderLetters();
  }

  if (isRow) {
    return renderNumbers();
  }

  return null;
}

const alphaStyle = width => ({
  alignSelf: 'flex-end',
  paddingLeft: width / 8 - width / 48,
  fontSize: width / 48
});

const numericStyle = width => ({
  alignSelf: 'flex-start',
  paddingRight: width / 8 - width / 48,
  fontSize: width / 48
});

const notationStyle = {
  zIndex: 3,
  position: 'absolute'
};

function Piece({
  piece,
  square,
  squares,
  isPremovedPiece = false
}) {
  const {
    animationDuration,
    arePiecesDraggable,
    arePremovesAllowed,
    boardWidth,
    id,
    isDraggablePiece,
    onPieceClick,
    onPieceDragBegin,
    onPieceDragEnd,
    premoves,
    chessPieces,
    dropTarget,
    positionDifferences,
    waitingForAnimation,
    currentPosition
  } = useChessboard();
  const [pieceStyle, setPieceStyle] = React.useState({
    opacity: 1,
    zIndex: 5,
    touchAction: 'none',
    cursor: arePiecesDraggable && isDraggablePiece({
      piece,
      sourceSquare: square
    }) ? '-webkit-grab' : 'default'
  });
  const [{
    canDrag,
    isDragging
  }, drag, dragPreview] = useDrag(() => ({
    type: 'piece',
    item: () => {
      onPieceDragBegin(piece, square);
      return {
        piece,
        square,
        id
      };
    },
    end: () => onPieceDragEnd(piece, square),
    collect: monitor => ({
      canDrag: isDraggablePiece({
        piece,
        sourceSquare: square
      }),
      isDragging: !!monitor.isDragging()
    })
  }), [piece, square, currentPosition, id]); // hide the default preview

  dragPreview(getEmptyImage(), {
    captureDraggingState: true
  }); // hide piece on drag

  React.useEffect(() => {
    setPieceStyle(oldPieceStyle => ({ ...oldPieceStyle,
      opacity: isDragging ? 0 : 1
    }));
  }, [isDragging]); // hide piece on matching premoves

  React.useEffect(() => {
    // if premoves aren't allowed, don't waste time on calculations
    if (!arePremovesAllowed) return;
    let hidePiece = false; // side effect: if piece moves into pre-moved square, its hidden
    // if there are any premove targets on this square, hide the piece underneath

    if (!isPremovedPiece && premoves.find(p => p.targetSq === square)) hidePiece = true; // if sourceSq === sq and piece matches then this piece has been pre-moved elsewhere?

    if (premoves.find(p => p.sourceSq === square && p.piece === piece)) hidePiece = true; // TODO: If a premoved piece returns to a premoved square, it will hide (e1, e2, e1)

    setPieceStyle(oldPieceStyle => ({ ...oldPieceStyle,
      display: hidePiece ? 'none' : 'unset'
    }));
  }, [currentPosition, premoves]); // new move has come in
  // if waiting for animation, then animation has started and we can perform animation
  // we need to head towards where we need to go, we are the source, we are heading towards the target

  React.useEffect(() => {
    var _positionDifferences$;

    const removedPiece = (_positionDifferences$ = positionDifferences.removed) === null || _positionDifferences$ === void 0 ? void 0 : _positionDifferences$[square]; // return as null and not loaded yet

    if (!positionDifferences.added) return; // check if piece matches or if removed piece was a pawn and new square is on 1st or 8th rank (promotion)

    const newSquare = Object.entries(positionDifferences.added).find(([s, p]) => p === removedPiece || (removedPiece === null || removedPiece === void 0 ? void 0 : removedPiece[1]) === 'P' && (s[1] === '1' || s[1] === '8')); // we can perform animation if our square was in removed, AND the matching piece is in added AND this isn't a premoved piece

    if (waitingForAnimation && removedPiece && newSquare && !isPremovedPiece) {
      const {
        sourceSq,
        targetSq
      } = getSquareCoordinates(square, newSquare[0]);

      if (sourceSq && targetSq) {
        setPieceStyle(oldPieceStyle => ({ ...oldPieceStyle,
          transform: `translate(${targetSq.x - sourceSq.x}px, ${targetSq.y - sourceSq.y}px)`,
          transition: `transform ${animationDuration}ms`,
          zIndex: 6
        }));
      }
    }
  }, [positionDifferences]); // translate to their own positions (repaint on undo)

  React.useEffect(() => {
    const {
      sourceSq
    } = getSingleSquareCoordinates(square);

    if (sourceSq) {
      setPieceStyle(oldPieceStyle => ({ ...oldPieceStyle,
        transform: `translate(${0}px, ${0}px)`,
        transition: `transform ${0}ms`
      }));
    }
  }, [currentPosition]); // update is piece draggable

  React.useEffect(() => {
    setPieceStyle(oldPieceStyle => ({ ...oldPieceStyle,
      cursor: arePiecesDraggable && isDraggablePiece({
        piece,
        sourceSquare: square
      }) ? '-webkit-grab' : 'default'
    }));
  }, [square, currentPosition, arePiecesDraggable]);

  function getSingleSquareCoordinates(square) {
    return {
      sourceSq: squares[square]
    };
  }

  function getSquareCoordinates(sourceSquare, targetSquare) {
    return {
      sourceSq: squares[sourceSquare],
      targetSq: squares[targetSquare]
    };
  }

  return /*#__PURE__*/jsxRuntime.jsx("div", {
    ref: arePiecesDraggable ? canDrag ? drag : null : null,
    onClick: () => onPieceClick(piece),
    style: pieceStyle,
    children: typeof chessPieces[piece] === 'function' ? chessPieces[piece]({
      squareWidth: boardWidth / 8,
      isDragging,
      droppedPiece: dropTarget === null || dropTarget === void 0 ? void 0 : dropTarget.piece,
      targetSquare: dropTarget === null || dropTarget === void 0 ? void 0 : dropTarget.target,
      sourceSquare: dropTarget === null || dropTarget === void 0 ? void 0 : dropTarget.source
    }) : /*#__PURE__*/jsxRuntime.jsx("svg", {
      viewBox: '1 1 43 43',
      width: boardWidth / 8,
      height: boardWidth / 8,
      children: /*#__PURE__*/jsxRuntime.jsx("g", {
        children: chessPieces[piece]
      })
    })
  });
}

function Square({
  square,
  squareColor,
  setSquares,
  squareHasPremove,
  children
}) {
  const squareRef = React.useRef();
  const {
    boardWidth,
    boardOrientation,
    clearArrows,
    currentPosition,
    customBoardStyle,
    customDarkSquareStyle,
    customDropSquareStyle,
    customLightSquareStyle,
    customPremoveDarkSquareStyle,
    customPremoveLightSquareStyle,
    customSquareStyles,
    handleSetPosition,
    lastPieceColour,
    onDragOverSquare,
    onMouseOutSquare,
    onMouseOverSquare,
    onPieceDrop,
    onRightClickDown,
    onRightClickUp,
    onSquareClick,
    waitingForAnimation
  } = useChessboard();
  const [{
    isOver
  }, drop] = useDrop(() => ({
    accept: 'piece',
    drop: item => handleSetPosition(item.square, square, item.piece),
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  }), [square, currentPosition, onPieceDrop, waitingForAnimation, lastPieceColour]);
  React.useEffect(() => {
    const {
      x,
      y
    } = squareRef.current.getBoundingClientRect();
    setSquares(oldSquares => ({ ...oldSquares,
      [square]: {
        x,
        y
      }
    }));
  }, [boardWidth, boardOrientation]);
  const defaultSquareStyle = { ...borderRadius(customBoardStyle, square, boardOrientation),
    ...(squareColor === 'black' ? customDarkSquareStyle : customLightSquareStyle),
    ...(squareHasPremove && (squareColor === 'black' ? customPremoveDarkSquareStyle : customPremoveLightSquareStyle)),
    ...(isOver && customDropSquareStyle)
  };
  return /*#__PURE__*/jsxRuntime.jsx("div", {
    ref: drop,
    style: defaultSquareStyle,
    "data-square-color": squareColor,
    "data-square": square,
    onMouseOver: e => {
      // noop if moving from child of square into square.
      if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
      onMouseOverSquare(square);
    },
    onMouseOut: e => {
      // noop if moving from square into a child of square.
      if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
      onMouseOutSquare(square);
    },
    onMouseDown: e => {
      if (e.button === 2) onRightClickDown(square);
    },
    onMouseUp: e => {
      if (e.button === 2) onRightClickUp(square);
    },
    onDragEnter: () => onDragOverSquare(square),
    onClick: () => {
      onSquareClick(square);
      clearArrows();
    },
    onContextMenu: e => {
      e.preventDefault();
    },
    children: /*#__PURE__*/jsxRuntime.jsx("div", {
      ref: squareRef,
      style: { ...size(boardWidth),
        ...center,
        ...(!squareHasPremove && (customSquareStyles === null || customSquareStyles === void 0 ? void 0 : customSquareStyles[square]))
      },
      children: children
    })
  });
}
const center = {
  display: 'flex',
  justifyContent: 'center'
};

const size = width => ({
  width: width / 8,
  height: width / 8
});

const borderRadius = (customBoardStyle, square, boardOrientation) => {
  if (!customBoardStyle.borderRadius) return {};

  if (square === 'a1') {
    return boardOrientation === 'white' ? {
      borderBottomLeftRadius: customBoardStyle.borderRadius
    } : {
      borderTopRightRadius: customBoardStyle.borderRadius
    };
  }

  if (square === 'a8') {
    return boardOrientation === 'white' ? {
      borderTopLeftRadius: customBoardStyle.borderRadius
    } : {
      borderBottomRightRadius: customBoardStyle.borderRadius
    };
  }

  if (square === 'h1') {
    return boardOrientation === 'white' ? {
      borderBottomRightRadius: customBoardStyle.borderRadius
    } : {
      borderTopLeftRadius: customBoardStyle.borderRadius
    };
  }

  if (square === 'h8') {
    return boardOrientation === 'white' ? {
      borderTopRightRadius: customBoardStyle.borderRadius
    } : {
      borderBottomLeftRadius: customBoardStyle.borderRadius
    };
  }

  return {};
};

function Squares({
  children
}) {
  const {
    boardOrientation,
    boardWidth,
    customBoardStyle,
    id
  } = useChessboard();
  return /*#__PURE__*/jsxRuntime.jsx("div", {
    "data-boardid": id,
    style: { ...boardStyles(boardWidth),
      ...customBoardStyle
    },
    children: [...Array(8)].map((_, r) => {
      return /*#__PURE__*/jsxRuntime.jsx("div", {
        style: rowStyles(boardWidth),
        children: [...Array(8)].map((_, c) => {
          // a1, a2 ...
          const square = boardOrientation === 'black' ? COLUMNS[7 - c] + (r + 1) : COLUMNS[c] + (8 - r);
          const squareColor = c % 2 === r % 2 ? 'white' : 'black';
          return children({
            square,
            squareColor,
            col: c,
            row: r
          });
        })
      }, r.toString());
    })
  });
}

const boardStyles = width => ({
  cursor: 'default',
  height: width,
  width
});

const rowStyles = width => ({
  display: 'flex',
  flexWrap: 'nowrap',
  width
});

const errorImage = {
  whiteKing: /*#__PURE__*/jsxRuntime.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    style: {
      shapeRendering: 'geometricPrecision',
      textRendering: 'geometricPrecision',
      imageRendering: 'optimizeQuality'
    },
    viewBox: "0 0 4210 12970",
    x: "0px",
    y: "0px",
    fillRule: "evenodd",
    clipRule: "evenodd",
    width: "250",
    height: "250",
    children: /*#__PURE__*/jsxRuntime.jsx("g", {
      children: /*#__PURE__*/jsxRuntime.jsx("path", {
        style: {
          fill: 'black',
          fillRule: 'nonzero'
        },
        d: "M2105 0c169,0 286,160 249,315l200 0c-172,266 -231,479 -256,792 315,-24 530,-86 792,-255l0 897c-265,-171 -479,-231 -792,-256 18,234 75,495 185,682l339 0c233,0 369,269 225,456l545 0 -595 1916c130,94 158,275 59,402 465,0 416,568 51,568l-334 0 465 2867 332 0c250,0 381,306 199,485 162,63 273,220 273,399l0 633 168 0 0 475c-1403,0 -2807,0 -4210,0l0 -475 167 0 0 -633c0,-179 112,-336 274,-399 -181,-178 -52,-485 199,-485l332 0 465 -2867 -335 0c-353,0 -418,-568 51,-568 -98,-127 -70,-308 59,-402l-594 -1916c181,0 363,0 545,0 -144,-187 -9,-456 225,-456l339 0c110,-187 167,-448 185,-682 -315,25 -530,87 -793,256l0 -897c266,171 480,231 793,255 -25,-315 -87,-529 -256,-792l199 0c-36,-155 81,-315 250,-315zm-1994 10012l0 253 3988 0 0 -253c-1330,0 -2659,0 -3988,0zm484 -1060c-174,0 -316,142 -316,316l0 633 3652 0 0 -633c0,-174 -142,-316 -316,-316 -1007,0 -2013,0 -3020,0zm45 -457c-230,0 -225,345 0,345l2930 0c230,0 225,-345 0,-345 -977,0 -1953,0 -2930,0zm2020 -2978l-1111 0 -465 2867 2041 0 -465 -2867zm-1558 -456c-229,0 -224,345 0,345 669,0 1337,0 2005,0 230,0 225,-345 0,-345 -668,0 -1336,0 -2005,0zm1730 -457l-1454 0c-229,0 -224,345 0,345l1454 0c229,0 224,-345 0,-345zm-2064 -1862l544 1751c529,0 1057,0 1586,0l544 -1751c-892,0 -1783,0 -2674,0zm1085 -567l504 0c-126,-247 -163,-526 -177,-800 273,15 553,52 800,177l0 -504c-247,126 -527,163 -800,177 14,-273 51,-552 177,-799 -168,0 -336,0 -504,0 125,247 162,526 177,799 -274,-14 -553,-51 -800,-177l0 504c247,-125 527,-162 800,-177 -15,274 -52,553 -177,800zm969 111l-1434 0c-230,0 -225,345 0,345l1434 0c230,0 225,-345 0,-345zm-717 -2175c-105,0 -175,109 -133,204l266 0c42,-96 -30,-205 -133,-204z"
      })
    })
  })
};

function ErrorBoundary({
  children
}) {
  try {
    return children;
  } catch (error) {
    return /*#__PURE__*/jsxRuntime.jsx(WhiteKing, {
      showError: true
    });
  }
}
function WhiteKing({
  showError = false
}) {
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    style: container,
    children: [/*#__PURE__*/jsxRuntime.jsx("div", {
      style: whiteKingStyle,
      children: errorImage.whiteKing
    }), showError && /*#__PURE__*/jsxRuntime.jsx("h1", {
      children: "Something went wrong"
    })]
  });
}
const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
};
const whiteKingStyle = {
  width: 250,
  height: 250,
  transform: 'rotate(90deg)'
};

function Board() {
  const boardRef = React.useRef();
  const [squares, setSquares] = React.useState({});
  const {
    arrows,
    boardOrientation,
    boardWidth,
    clearCurrentRightClickDown,
    customArrowColor,
    showBoardNotation,
    currentPosition,
    premoves
  } = useChessboard();
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (boardRef.current && !boardRef.current.contains(event.target)) {
        clearCurrentRightClickDown();
      }
    }

    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);
  return boardWidth ? /*#__PURE__*/jsxRuntime.jsxs("div", {
    ref: boardRef,
    style: {
      position: 'relative'
    },
    children: [/*#__PURE__*/jsxRuntime.jsx(Squares, {
      children: ({
        square,
        squareColor,
        col,
        row
      }) => {
        const squareHasPremove = premoves.find(p => p.sourceSq === square || p.targetSq === square);
        const squareHasPremoveTarget = premoves.find(p => p.targetSq === square);
        return /*#__PURE__*/jsxRuntime.jsxs(Square, {
          square: square,
          squareColor: squareColor,
          setSquares: setSquares,
          squareHasPremove: squareHasPremove,
          children: [currentPosition[square] && /*#__PURE__*/jsxRuntime.jsx(Piece, {
            piece: currentPosition[square],
            square: square,
            squares: squares
          }), squareHasPremoveTarget && /*#__PURE__*/jsxRuntime.jsx(Piece, {
            isPremovedPiece: true,
            piece: squareHasPremoveTarget.piece,
            square: square,
            squares: squares
          }), showBoardNotation && /*#__PURE__*/jsxRuntime.jsx(Notation, {
            row: row,
            col: col
          })]
        }, `${col}${row}`);
      }
    }), /*#__PURE__*/jsxRuntime.jsx("svg", {
      width: boardWidth,
      height: boardWidth,
      style: {
        position: 'absolute',
        top: '0',
        left: '0',
        pointerEvents: 'none',
        zIndex: '10'
      },
      children: arrows.map(arrow => {
        const from = getRelativeCoords(boardOrientation, boardWidth, arrow[0]);
        const to = getRelativeCoords(boardOrientation, boardWidth, arrow[1]);
        return /*#__PURE__*/jsxRuntime.jsxs(React.Fragment, {
          children: [/*#__PURE__*/jsxRuntime.jsx("defs", {
            children: /*#__PURE__*/jsxRuntime.jsx("marker", {
              id: "arrowhead",
              markerWidth: "2",
              markerHeight: "2.5",
              refX: "1.25",
              refY: "1.25",
              orient: "auto",
              children: /*#__PURE__*/jsxRuntime.jsx("polygon", {
                points: "0 0, 2 1.25, 0 2.5",
                style: {
                  fill: customArrowColor
                }
              })
            })
          }), /*#__PURE__*/jsxRuntime.jsx("line", {
            x1: from.x,
            y1: from.y,
            x2: to.x,
            y2: to.y,
            style: {
              stroke: customArrowColor,
              strokeWidth: boardWidth / 36
            },
            markerEnd: "url(#arrowhead)"
          })]
        }, `${arrow[0]}-${arrow[1]}`);
      })
    })]
  }) : /*#__PURE__*/jsxRuntime.jsx(WhiteKing, {});
}

function CustomDragLayer() {
  const {
    boardWidth,
    chessPieces,
    id,
    snapToCursor
  } = useChessboard();
  const collectedProps = useDragLayer(monitor => ({
    item: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    sourceClientOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));
  const {
    isDragging,
    item,
    clientOffset,
    sourceClientOffset
  } = collectedProps;
  const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 10,
    left: 0,
    top: 0
  };
  const getItemStyle = React.useCallback((clientOffset, sourceClientOffset) => {
    if (!clientOffset || !sourceClientOffset) return {
      display: 'none'
    };
    let {
      x,
      y
    } = snapToCursor ? clientOffset : sourceClientOffset;

    if (snapToCursor) {
      const halfSquareWidth = boardWidth / 8 / 2;
      x -= halfSquareWidth;
      y -= halfSquareWidth;
    }

    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
      touchAction: 'none'
    };
  }, [boardWidth, snapToCursor]);
  return isDragging && item.id === id ? /*#__PURE__*/jsxRuntime.jsx("div", {
    style: layerStyles,
    children: /*#__PURE__*/jsxRuntime.jsx("div", {
      style: getItemStyle(clientOffset, sourceClientOffset),
      children: typeof chessPieces[item.piece] === 'function' ? chessPieces[item.piece]({
        squareWidth: boardWidth / 8,
        isDragging: true
      }) : /*#__PURE__*/jsxRuntime.jsx("svg", {
        viewBox: '1 1 43 43',
        width: boardWidth / 8,
        height: boardWidth / 8,
        children: /*#__PURE__*/jsxRuntime.jsx("g", {
          children: chessPieces[item.piece]
        })
      })
    })
  }) : null;
}

const Chessboard = /*#__PURE__*/React.forwardRef((props, ref) => {
  const [backendSet, setBackendSet] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const {
    customDndBackend,
    customDndBackendOptions,
    ...otherProps
  } = props;
  React.useEffect(() => {
    setIsMobile('ontouchstart' in window);
    setBackendSet(true);
  }, []);
  const backend = customDndBackend || (isMobile ? TouchBackend : HTML5Backend);
  return backendSet && /*#__PURE__*/jsxRuntime.jsx(ErrorBoundary, {
    children: /*#__PURE__*/jsxRuntime.jsx(DndProvider, {
      backend: backend,
      children: /*#__PURE__*/jsxRuntime.jsxs(ChessboardProvider, {
        ref: ref,
        ...otherProps,
        children: [/*#__PURE__*/jsxRuntime.jsx(CustomDragLayer, {}), /*#__PURE__*/jsxRuntime.jsx(Board, {})]
      })
    })
  });
});
Chessboard.defaultProps = chessboardDefaultProps;

exports.Chessboard = Chessboard;
