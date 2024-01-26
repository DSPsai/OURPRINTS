import React from 'react';
import MaterialTable from 'material-table';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import LeadsService from 'services/repo/LeadsService';


const columns = [
  { title: 'S.NO', field: 's.no', render: d => d.index + 1 },
  { title: 'Name', field: 'full_name' },
  { title: 'Mobile', field: 'mobile' },
  { title: 'Email', field: 'email' },
  { title: 'Details of Enquiry', field: 'details_of_enquiry' },
]

function Leads() {
  const leads = useAsyncDataFrom(LeadsService.get);


  return (
    <MaterialTable
      title='Leads'
      isLoading={leads.isLoading}
      data={leads.data.map((d, index) => { return { ...d, index: index } })}
      columns={columns}
      options={{
        actionsColumnIndex: -1,
        pageSize: 20,
        pageSizeOptions: [20, 30, 40, 50],
      }}
    />

  )
}

export default Leads;