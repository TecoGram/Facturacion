import React from 'react'
import MaterialTable from '../lib/MaterialTable'

export default class FacturasListView extends React.Component {
  render () {
    const columns = ['ID', 'Name', 'Status']
    const keys = ['id', 'name', 'status']
    const rows = [
      {
        id: 1,
        name: 'John Smith',
        status: 'Employed',
      },
      {
        id: 2,
        name: 'Randal White',
        status: 'Unemployed',
      },
      {
        id: 3,
        name: 'Stephanie Sanders',
        status: 'Employed',
      },
      {
        id: 4,
        name: 'Walter Johnson',
        status: 'Employed',
      },
      {
        id: 4,
        name: 'Steve Brown',
        status: 'Unemployed',
      },
    ]
    return (
      <MaterialTable columns={columns} keys={keys} rows={rows}
        onEditItem={() => {}} onDeleteItem={() => {}} enableCheckbox={false}/>
    )
  }

}
