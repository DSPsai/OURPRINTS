import React from 'react';
import { useHistory } from 'react-router-dom';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import { useRouteMatch } from 'react-router-dom';
import UserService from 'services/repo/UserService';
import {
  Card,
  CardContent,
} from '@material-ui/core';
import MaterialTable from 'material-table';

const CoinHistory = props => {
  const { className, data, ...rest } = props;
  const history = useHistory()
  const match = useRouteMatch('/user/:id');
  const response = useAsyncDataFrom(() => UserService.getUserCoinInfo(match.params.id))
  const userCoinHistory = response && response.data ? response.data :  []
  const coloumns = [
    {
      title: 'Created On',
      field: 'created_on',
      render: coin => ((coin.created_on && coin.created_on.length) ? coin.created_on.split('T')[0] : '-')
    },
    {
      title: 'Coin added', field: 'coin_added',  render: coin => (coin.coin_added || '-')
    },
    { title: 'QR code', field: 'qr_code', render: coin =>
      (
        <div className='qr-code-in-coin-table' style={{cursor: 'pointer'}} onClick={() => {
          redirectToQRListing(coin.qr_code)
        }}>
          {coin.qr_code || '-'}
        </div>
      )
    },
    {
      title: 'Coin Used', field: 'coin_used', render: coin => (coin.coin_used || '-')
    },
    { title: 'Voucher', field: 'voucher', render: coin => 
    (
      <div className='qr-code-in-coin-table' style={{cursor: 'pointer'}} onClick={() => {
        redirectToVoucherListing(coin.voucher)
      }}>
        {coin.voucher || '-'}
      </div>
      )
    }
  ]

  const redirectToQRListing = (qrCode) => {
    if(qrCode) {
      const redirectTo = `/qr_codes?id=${qrCode}`

      history.push(redirectTo);
    }
  }

  const redirectToVoucherListing = (voucherId) => {
    if(voucherId) {
      const redirectTo = `/vouchers?id=${voucherId}`

      history.push(redirectTo);
    }
  }

  if (response.isLoading) {
    return '...'
  }

  return (
    <Card
      {...rest}
    >
      <CardContent>          
        <MaterialTable
          title="Coin History"
          isLoading={response.isLoading}
          columns={coloumns}
          data={(userCoinHistory && userCoinHistory.length > 0) ? userCoinHistory : []}
          options={{
            search: false,
            filtering: false,
            paging: false
          }}
        />
      </CardContent>
    </Card>
  );
};


export default CoinHistory;
