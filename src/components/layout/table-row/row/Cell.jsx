import React, { PropTypes } from 'react';

import { Editor } from './cell/Editor';
import { prefix } from '../../../../util/prefix';
import { getData } from './../../../../util/getData';
import { handleEditClick } from './../../../../util/handleEditClick';
import { elementContains } from './../../../../util/elementContains';
import { gridConfig } from './../../../../constants/GridConstants';

import TreeArrow from './cell/TreeArrow';
import DragHandle from './cell/DragHandle';

export const Cell = ({
    cellData,
    columns,
    dragAndDrop,
    editor,
    editorState,
    events,
    gridType,
    index,
    isRowSelected,
    readFunc,
    row,
    rowId,
    rowIndex,
    selectionModel,
    showTreeRootNode,
    stateful,
    stateKey,
    store,
    treeData
}) => {

    const { CLASS_NAMES } = gridConfig();

    const isEditable = (editorState
            && editorState.get
            && editorState.get(rowId)
            && editorState.get(rowId).key === rowId)
        || editor.config.type === editor.editModes.grid;

    const isExpandable = treeData.expandable && !treeData.leaf;

    const shouldNest = treeData.expandable;

    const depth = treeData.depth !== undefined
        && gridType === 'tree'
        ? treeData.depth
        : null;

    const hidden = columns
            && columns[index]
            && columns[index].hidden !== undefined
            ? columns[index].hidden
            : null;

    const cellClickArguments = {
        events,
        columns,
        cellData,
        editor,
        editorState,
        rowIndex,
        row,
        rowId,
        selectionModel,
        stateKey,
        store
    };

    const cellProps = {
        className: prefix(CLASS_NAMES.CELL,
            isEditable ? 'edit' : '',
            isExpandable ? 'expand' : '',
            shouldNest ? 'tree-nested' : '',
            depth !== null ? `tree-node-depth-${depth}` : ''
        ),
        onClick: (e) => {
            return handleClick(cellClickArguments, e);
        },
        onDoubleClick: (e) => {
            return handleDoubleClick(cellClickArguments, e);
        },
        style: {}
    };

    if (hidden) {
        cellProps.style.display = 'none';
    }

    const arrowProps = {
        isEditable,
        isExpandable,
        isExpanded: treeData.isExpanded,
        hasChildren: treeData.hasChildren,
        shouldNest,
        depth,
        id: treeData.id,
        readFunc,
        showTreeRootNode,
        stateful,
        stateKey,
        store
    };

    // only have drag handle in first cell
    const dragHandle = dragAndDrop && index === 0
        ? <DragHandle store={store} />
        : null;

    const arrow = gridType === 'tree'
        && shouldNest
        ? <TreeArrow { ...arrowProps } />
        : null;

    const cellHTML = getCellHTML(
        cellData,
        editorState,
        isEditable,
        isRowSelected,
        columns,
        index,
        rowId,
        row,
        stateKey,
        store
    );

    const className = prefix(CLASS_NAMES.CELL_HANDNLE_CONTAINER);

    const handleContainer = dragHandle || arrow
        ? <div className={className}>{ dragHandle }{ arrow }</div>
        : null;

    return (
        <td { ...cellProps }>
            { handleContainer }
            { cellHTML }
        </td>
    );
};

export const getCellHTML = (
    cellData,
    editorState,
    isEditable,
    isRowSelected,
    columns,
    index,
    rowId,
    row,
    stateKey,
    store
) => {

    if (isEditable) {
        return (
            <Editor
                cellData={cellData}
                columns={columns}
                editorState={editorState}
                index={index}
                isEditable={isEditable}
                isRowSelected={isRowSelected}
                rawValue={getData(row, columns, index)}
                row={row}
                rowId={rowId}
                stateKey={stateKey}
                store={store}
            />
        );
    }

    return <span children={cellData} />;
};

export const handleClick = ({
    events,
    columns,
    cellData,
    editor,
    editorState,
    rowIndex,
    row,
    rowId,
    selectionModel,
    stateKey,
    store
}, reactEvent) => {

    const { CLASS_NAMES } = gridConfig();

    if (reactEvent.target
        && elementContains(
            reactEvent.target, prefix(CLASS_NAMES.EDITED_CELL))
        ) {
        reactEvent.stopPropagation();
    }

    if (selectionModel.defaults.editEvent
        === selectionModel.eventTypes.singleclick) {

        // if a row is clicked and the editorState is empty except
        // for last update integer, trigger edit event
        if (!editorState || editorState.count() === 1) {
            handleEditClick(
                editor,
                store,
                rowId,
                row,
                rowIndex,
                columns,
                stateKey,
                events,
                { reactEvent }
            );
        }

        else if (editorState && !editorState.get(rowId)) {
            handleEditClick(
                editor,
                store,
                rowId,
                row,
                rowIndex,
                columns,
                stateKey,
                events,
                { reactEvent }
            );
        }
    }

    if (events.HANDLE_CELL_CLICK) {
        return events.HANDLE_CELL_CLICK.apply(this, arguments);
    }
};

export const handleDoubleClick = ({
    events,
    columns,
    cellData,
    editor,
    editorState,
    rowIndex,
    row,
    rowId,
    selectionModel,
    stateKey,
    store
}, reactEvent) => {

    const { CLASS_NAMES } = gridConfig();

    if (reactEvent.target
        && elementContains(
            reactEvent.target, prefix(CLASS_NAMES.EDITED_CELL))
        ) {
        reactEvent.stopPropagation();
    }

    if (selectionModel.defaults.editEvent
    === selectionModel.eventTypes.doubleclick) {

        // if a row is clicked and the editorState is empty except
        // for last update integer, trigger edit event
        if (!editorState || Object.keys(editorState).length === 1) {
            handleEditClick(
                editor,
                store,
                rowId,
                row,
                rowIndex,
                columns,
                stateKey,
                events,
                { reactEvent }
            );
        }

        else if (editorState && !editorState[rowId]) {
            handleEditClick(
                editor,
                store,
                rowId,
                row,
                rowIndex,
                columns,
                stateKey,
                events,
                { reactEvent }
            );
        }

    }

    if (events.HANDLE_CELL_DOUBLE_CLICK) {
        return events.HANDLE_CELL_DOUBLE_CLICK.apply(this, arguments);
    }
};

const { any, array, bool, func, object, oneOf, number, string } = PropTypes;

Cell.propTypes = {
    cellData: any,
    columns: array,
    data: func,
    dragAndDrop: bool,
    editor: object,
    editorState: object,
    events: object,
    gridType: oneOf([
        'tree', 'grid'
    ]),
    index: number,
    isRowSelected: bool,
    readFunc: func,
    row: object,
    rowId: string,
    rowIndex: number,
    selectionModel: object,
    showTreeRootNode: bool,
    stateKey: string,
    stateful: bool,
    store: object,
    treeData: object
};

Cell.defaultProps = {
    treeData: {}
};
