import React, { useEffect, useState } from 'react';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import UserService from 'services/repo/UserService';
import MaterialTable from 'material-table';
import { Box, Fab, Grid, Button, Tooltip, IconButton } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons'
import OrderService from 'services/repo/OrderService';
import FornattedDateTime from 'components/FormattedDateTime';
import { withRouter, useHistory, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import VisibilityOutlinedIcon from '@material-ui/icons/Visibility';
import exportFromJSON from 'export-from-json'

function TotalOrders(props) {
  const [orders, setOrders] = useState({
    isLoading: true,
    data: [],
    error: null
  })

  useEffect(() => {
    getOrders()
  }, []);


  function getOrders() {
    OrderService.getTotal().then(res => {
      setOrders({
        isLoading: false,
        data: res.data.results,
        error: null
      })
    }).catch(e => console.log(e))
  }
  const history = useHistory();
  function Status({ order }) {
    if (order.status === 'delivered') {
      return 'Completed'
    } else {
      return 'Incomplete'
    }
  }
  const coloumns = [
    { title: 'S.NO', field: 's.no', render: d => d.index + 1, filtering: false },
    { title: 'Order Id', field: 'order_id' },
    { title: 'Date And Time', field: 'created_at', render: order => <FornattedDateTime date={order.created_at} /> },
    { title: 'Name', field: 'user_data.first_name' },
    {
      title: 'Category of Print',
      filtering: true,
      field: 'order_type',
      lookup: {
        'standard_print': 'Standard',
        'freemium': 'Freemium',
        'official_documents': 'Official',
        '24hrs-delivery': '24hrs-delivery'
      },
    },
    { title: 'Number of pages', field: 'pdf_page_count' },
    { title: 'Order price', field: 'amount' },
    { title: 'Status', field: 'status', render: order => <Status order={order} /> },
    {
      title: 'Actions', render: r => (
        <Tooltip title='View Order'>
          <IconButton
            onClick={() => history.push(`order/${r.id}`)}
            tooltip='Assigned'>
            <VisibilityOutlinedIcon size='small' color='primary' />
          </IconButton>
        </Tooltip>
      )
    }
  ]
  // const orders = await useAsyncDataFrom(OrderService.getTotal);

  const fileName = 'download'
  const exportType = exportFromJSON.types.csv


  const downloadExcel = () => {
    exportFromJSON({ data: orders.data, fileName, exportType })
  }

  return (
    <>
      <Button onClick={downloadExcel}>Download Excel</Button>
      <Box>
        <MaterialTable
          title="Total Orders"
          isLoading={orders.isLoading}
          columns={coloumns}
          data={orders.data.map((d, index) => { return { ...d, index: index } })}
          options={{
            search: false,
            actionsColumnIndex: -1,
            filtering: true,
            pageSize: 20,
            pageSizeOptions: [20, 30, 40, 50],
            emptyRowsWhenPaging: true,
          }}
        />
      </Box>
    </>
  )
}

export default TotalOrders;