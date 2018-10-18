import React, { Component } from 'react';
import { Column, Cell } from 'fixed-data-table';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';

import ResponsiveTable from './ResponsiveTable';

/**
* This component draws a Table efficiently using all the space available. It expects
the parent to have all the height available, so that the table fits the size of
the window. If this condition is not met, the table may not render at all.
*/
export default class CRUDTable extends Component {
  render() {
    const textCellStyle = { fontFamily: 'Roboto' };
    return (
      <ResponsiveTable rowsCount={this.props.data.length}>
        {this.props.columnData.map((col, i) => {
          return (
            <Column
              key={i}
              header={
                <Cell style={textCellStyle}>
                  {col.name}
                </Cell>
              }
              cell={({ rowIndex, ...props }) =>
                <Cell style={textCellStyle} {...props}>
                  {this.props.data[rowIndex][col.key].toString()}
                </Cell>}
              width={col.width}
              flexGrow={col.flexGrow}
            />
          );
        }, this)}

        <Column
          key={this.props.columnData.length}
          header={<Cell style={textCellStyle}> </Cell>}
          cell={({ ...props }) =>
            <Cell style={textCellStyle} {...props}>
              <IconButton>
                <ModeEdit />
              </IconButton>
            </Cell>}
          width={80}
        />
      </ResponsiveTable>
    );
  }
}
