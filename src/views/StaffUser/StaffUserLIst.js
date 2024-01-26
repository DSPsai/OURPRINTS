import React, { useState } from 'react';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import StaffUserService from 'services/repo/StaffUserService';
import MaterialTable from 'material-table';
import { Box, Fab, Grid, Button, IconButton } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import AddStaffUser from './AddStaffUser';
import useDrawer from 'hooks/useDrawer';
import withDrawer from 'components/hoc/withDrawer';
import EditStaffUser from './EditStaffUser'
import { withRouter, useHistory } from 'react-router-dom';
import withAlertDialog from 'components/withAlertDialog';
import { withSnackbar } from 'notistack';
import { Delete, Edit, Visibility } from '@material-ui/icons'

function StaffUsers(props) {
  const users = useAsyncDataFrom(StaffUserService.get);
  const createStaffUser = useDrawer();
  const editStaffUser = useDrawer();
  const history = useHistory();


  const [selectedData, setSelectedData] = useState([])

  const coloumns = [
    { title: 'S.NO', field: 's.no', render: d => d.index + 1, filtering: false },
    { title: 'Full Name', field: 'full_name' },
    { title: 'Mobile', field: 'mobile' },
    { title: 'Email', field: 'email' },
    { title: 'Pending Orders', field: 'assigned_orders' },
    {
      title: 'Actions', render: r => (
        <Grid container spacing={1}>
          <Grid item>
            <IconButton onClick={() => (
              setSelectedData(r),
              editStaffUser.setData(users),
              editStaffUser.setOpen(true)
            )}>
              <Edit color="primary" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={() => (
              history.push(`staff_users/${r.id}/view`)
            )}>
              <Visibility color="primary" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={() => (
              props
                .showAlertDialog(
                  `Are you sure that you want to delete this Staff User?`
                )
                .onOk(() => {
                  StaffUserService
                    .deleteById(r.id)
                    .then(res => {
                      props.enqueueSnackbar('Deleted successfully', {
                        variant: 'success'
                      });
                      users.refresh();
                    })
                    .catch(err => {
                      console.log(err);
                      props.enqueueSnackbar(
                        'Cannot delete due to unknown error!',
                        { variant: 'error' }
                      );
                    });
                }
                ))
            }>
              <Delete color="error" />
            </IconButton>

          </Grid>
        </Grid >
      )
    }
  ]

  return (
    <>
      <CreateStaffUserDrawer sdata={selectedData}  {...createStaffUser} title="Create Staff User" />
      <EditStaffUserDrawer data={users} sdata={selectedData} {...editStaffUser} title="Edit Staff User" />
      <Box >
        <MaterialTable
          title="Staff Users"
          columns={coloumns}
          data={users.data.map((d, index) => { return { ...d, index: index } })}
          isLoading={users.isLoading}
          options={{
            search: false,
            actionsColumnIndex: -1,
            pageSize: 10,
            filtering: true
          }}
          actions={
            [{
              tooltip: 'Add Staff user',
              icon:() => <AddIcon color="primary" />,
              onClick: () => (
                createStaffUser.setOpen(true),
                createStaffUser.setData(users)
              ),
              isFreeAction: true
            },
            ]
          }
        />
      </Box>

    </>
  )
}

export default withSnackbar(withAlertDialog(StaffUsers));
const CreateStaffUserDrawer = withDrawer(AddStaffUser);
const EditStaffUserDrawer = withDrawer(EditStaffUser);
