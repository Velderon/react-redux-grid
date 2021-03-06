import deepEqual from 'deep-equal';
import { getLastUpdate } from './lastUpdate';

export function shouldGridUpdate(nextProps) {
    let result = true;

    const { reducerKeys, stateKey, store } = this.props;

    const nextUpdate = getLastUpdate(store, stateKey, reducerKeys);

    result = (
        !deepEqual(nextUpdate, this._lastUpdate)
        || !equalProps(nextProps, this._lastProps)
    );

    this._lastUpdate = nextUpdate;
    this._lastProps = nextProps;

    return result;
}

export function shouldPagerUpdate(nextProps, nextState) {

    let result = true;

    const limitedNextProps = {
        gridData: nextProps.gridData,
        state: this.state
    };

    const limitedProps = {
        gridData: this.props.gridData,
        state: nextState
    };

    result = (
        !deepEqual(limitedNextProps, limitedProps)
    );

    return result;
}

export function shouldHeaderUpdate(nextProps, nextState) {
    // let result = true;
    // to do, stop this
    return true;

    /* eslint-disable no-unreachable */

    // const menuState = state =>
    //     state && state.get('header-row');

    // const limitedNextProps = {
    //     columns: nextProps.columns,
    //     menuState: menuState(nextProps.menuState),
    //     state: nextState
    // };

    // const limitedProps = {
    //     columns: this.previousColumns,
    //     menuState: menuState(this.props.menuState),
    //     state: this.state
    // };

    // result = (
    //     !deepEqual(limitedNextProps, limitedProps)
    // );

    // this.previousColumns = this.props.columns.slice();

    // return result;

    /* eslint-enable no-unreachable */
}

export function shouldRowUpdate(nextProps) {
    let result = true;

    // unique key created by setData action/reducer
    const key = nextProps.row.get('_key');

    const isSelected = rows => Boolean(rows && rows.get(key));

    const isMenuShown = rows => Boolean(rows && rows.get(key));

    const isEdited = editorState => Boolean(
        editorState
        && editorState.get(key)
        && editorState.get(key).values
    );

    const limitedNextProps = {
        columns: slimColumn(nextProps.columns),
        isEdited: isEdited(nextProps.editorState),
        currentValues: isEdited(nextProps.editorState)
            ? nextProps.editorState.get(key)
            : null,
        isMenuShown: isMenuShown(nextProps.menuState),
        row: nextProps.row,
        index: nextProps.index,
        isSelected: isSelected(nextProps.selectedRows),
        isDragging: nextProps.isDragging
    };

    const limitedProps = {
        columns: this.previousColumns,
        isEdited: isEdited(this.props.editorState),
        currentValues: isEdited(this.props.editorState)
            ? this.props.editorState.get(key)
            : null,
        isMenuShown: isMenuShown(this.props.menuState),
        row: this.props.row,
        index: this.props.index,
        isSelected: isSelected(this.props.selectedRows),
        isDragging: this.props.isDragging
    };

    this.previousColumns = slimColumn(this.props.columns.slice());

    result = (
        !deepEqual(limitedNextProps, limitedProps)
    );

    return result;
}

export const slimColumn = cols =>
    cols.map(col => ({ hidden: col.hidden, dataIndex: col.dataIndex }));

export const equalProps = (props = {}, newProps = {}) => {
    return props.height === newProps.height
        && deepEqual(props.classNames, newProps.classNames)
        && deepEqual(props.events, newProps.events);
};
