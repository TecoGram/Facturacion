import React, {Component} from 'react';
import {Column, Cell} from 'fixed-data-table';

import ResponsiveTable from './ResponsiveTable'


const list = [
  { name: 'Brian Vaughn', description: 'Software engineer' },
  { name: 'Luis Loaiza', description: 'Software engineer' },
  { name: 'Justhine Tumbaco', description: 'Software engineer' },
  { name: 'Pedro Iniguez', description: 'Software engineer' },
  { name: 'Gabriel Aumala', description: 'Software engineer' },
  { name: 'Erika Perugachi', description: 'Software engineer' },
  { name: 'Gianni Carlo', description: 'Software engineer' },
  { name: 'Brian Vaughn', description: 'Software engineer' },
  { name: 'Luis Loaiza', description: 'Software engineer' },
  { name: 'Justhine Tumbaco', description: 'Software engineer' },
  { name: 'Pedro Iniguez', description: 'Software engineer' },
  { name: 'Gabriel Aumala', description: 'Software engineer' },
  { name: 'Brian Vaughn', description: 'Software engineer' },
  { name: 'Luis Loaiza', description: 'Software engineer' },
  { name: 'Justhine Tumbaco', description: 'Software engineer' },
  { name: 'Pedro Iniguez', description: 'Software engineer' },
  { name: 'Gabriel Aumala', description: 'Software engineer' },
  { name: 'Brian Vaughn', description: 'Software engineer' },
  { name: 'Luis Loaiza', description: 'Software engineer' },
  { name: 'Justhine Tumbaco', description: 'Software engineer' },
  { name: 'Pedro Iniguez', description: 'Software engineer' },
  { name: 'Gabriel Aumala', description: 'Software engineer' },
  { name: 'Brian Vaughn', description: 'Software engineer' },
  { name: 'Luis Loaiza', description: 'Software engineer' },
  { name: 'Justhine Tumbaco', description: 'Software engineer' },
  { name: 'Pedro Iniguez', description: 'Software engineer' },
  { name: 'Gabriel Aumala', description: 'Software engineer' },
  { name: 'Erika Perugachi', description: 'Software engineer' },
  { name: 'Gianni Carlo', description: 'Software engineer' },
  { name: 'Brian Vaughn', description: 'Software engineer' },
  { name: 'Luis Loaiza', description: 'Software engineer' },
  { name: 'Justhine Tumbaco', description: 'Software engineer' },
  { name: 'Pedro Iniguez', description: 'Software engineer' },
  { name: 'Gabriel Aumala', description: 'Software engineer' },
  { name: 'Brian Vaughn', description: 'Software engineer' },
  { name: 'Ruben Carvajal', description: 'Software engineer' },
  { name: 'Justhine Tumbaco', description: 'Software engineer' },
  { name: 'Pedro Iniguez', description: 'Software engineer' },
  { name: 'Gabriel Aumala', description: 'Software engineer' },
  { name: 'Brian Vaughn', description: 'Software engineer' },
  { name: 'Luis Loaiza', description: 'Software engineer' },
  { name: 'Charlie Medina', description: 'Software engineer' },
  // And so on...
];

/**
* This component draws a Table efficiently using all the space available. It expects
the parent to have all the height available, so that the table fits the size of
the window. If this condition is not met, the table may not render at all.
*/
export default class ProductosView extends Component {

  state = {
    data : [],
  };

  componentWillMount() {
    this.setState({data: list})
  }

  render() {
    const data = this.state.data
    const textCellStyle = {fontFamily: 'Roboto'}
    return (
      <ResponsiveTable rowsCount={data.length} >
        <Column
          header={<Cell style={textCellStyle}>Name</Cell>}
          cell={({rowIndex, ...props}) =>
            <Cell style={textCellStyle} {...props}>
              {data[rowIndex].name}
            </Cell>
          }
          width={300}
          flexGrow={1}
        />
        <Column
          header={<Cell style={textCellStyle}>Description</Cell>}
          cell={({rowIndex, ...props}) =>
            <Cell style={textCellStyle} {...props}>
              {data[rowIndex].description}
            </Cell>
          }
          width={300}
        />
      </ResponsiveTable>
    );
  }
}
