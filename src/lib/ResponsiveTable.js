import React, { Component } from 'react';
import { Table } from 'fixed-data-table';
import ContainerDimensions from 'react-container-dimensions';

/**
* This component draws a Table efficiently using all the space available. It expects
the parent to have all the height available, so that the table fits the size of
the window. If this condition is not met, the table may not render at all.
*/
export default class ResponsiveTable extends Component {
  render() {
    return (
      <ContainerDimensions>
        {({ width, height }) =>
          <Table
            rowHeight={this.props.rowHeight || 50}
            rowsCount={this.props.rowsCount}
            width={width}
            height={height}
            headerHeight={this.props.headerHeight || 50}
          >
            {this.props.children}
          </Table>}
      </ContainerDimensions>
    );
  }
}
