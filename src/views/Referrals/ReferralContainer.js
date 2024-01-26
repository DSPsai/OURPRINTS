import React, { useState } from 'react'
import { Box, Fab, Button, Grid, IconButton, } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { markFulfilled } from 'apis/referrals';
import PersonIcon from '@material-ui/icons/Person';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    borderRadius: '1vh',
    boxShadow: 'none',
    border: '1px solid rgba(0, 0, 0, 0.15)'
}));

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        p: '2vh !important',
        backgroundColor: 'white', display: 'flex',
        flexFlow: 'column', gap: '0.3vh',
        fontWeight: '600', textAlign: 'initial',
        borderRadius: '2vh', border: '1px solid rgba(0, 0, 0, 0.54)',
    },
}))(Tooltip);

export default function ReferralContainer(referralData) {
    const [referral, setReferral] = useState(referralData.data)
    return (
        <Box sx={{ p: '2vh', textAlign: 'initial', color: 'black', fontFamily: 'Montserrat' }}>
            <Box sx={{ textAlign: 'end', display: 'flex', justifyContent: 'end' }}>
                <Box>
                    <HtmlTooltip
                        title={
                            <React.Fragment>
                                <Box sx={{
                                    minHeight: '4vh', color: 'black', px: '1vh',
                                }}>
                                    {referral.claim.length !== 0 ? (referral.claim.map((claim, ind) => {
                                        return <Box sx={{ fontSize: '1.2vh', color: 'rgba(0, 0, 0, 0.54)', }}>
                                            {ind + 1}. {claim}
                                        </Box>
                                    })) : <Box sx={{ height: '3.7vh', fontSize: '1.5vh', fontWeight: '400', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No claims so far</Box>}
                                </Box>
                            </React.Fragment>
                        }
                    >
                        <Button><MoreVertIcon /></Button>
                    </HtmlTooltip>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: '50%' }}>
                    <Box sx={{ fontSize: '2vh', fontWeight: '600' }}>
                        {referral.name}
                    </Box>
                    <Box sx={{ fontSize: '2vh', color: 'grey', fontWeight: '500' }}>
                        {referral.phone}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                    <Box>
                        <Box sx={{ fontSize: '3vh', fontWeight: 'bold' }}>{referral.eligible}</Box>
                        <Box sx={{ fontSize: '1.5vh', fontWeight: '600', color: 'rgba(0, 0, 0, 0.75)' }}>Eligible</Box>
                    </Box>
                    <Box>
                        <Box sx={{ fontSize: '3vh', fontWeight: 'bold' }}>{referral.claimed}</Box>
                        <Box sx={{ fontSize: '1.5vh', fontWeight: '600', color: 'rgba(0, 0, 0, 0.75)' }}>Claimed</Box>
                    </Box>
                    <Box>
                        <Box sx={{ fontSize: '3vh', fontWeight: 'bold' }}>{referral.remaining}</Box>
                        <Box sx={{ fontSize: '1.5vh', fontWeight: '600', color: 'rgba(0, 0, 0, 0.75)' }}>Remaining</Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ mt: '2vh' }}>
                <Grid container spacing={1}>
                    {referral.referrals.map(ref => {
                        return <Grid item xs={4}>
                            <Item sx={{ borderRadius: '2vh', textAlign: 'initial' }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    my: '0.5vh',
                                    justifyContent: 'space-evenly',
                                    '& svg': {
                                        transform: 'scale(1.3)'
                                    }
                                }}>
                                    <Box sx={{
                                        display: 'flex', flexFlow: 'column', alignItems: 'center',
                                        justifyContent: 'center', backgroundColor: '#D9D9D9', p: '2vh', borderRadius: '50%'
                                    }}>
                                        {/* <svg height="4vh" width='4vh' viewBox='0 0 5vh 5vh' style={{
                                            // backgroundColor: '#D9D9D9', borderRadius: '50%',
                                            // display: 'flex', justifyContent: 'center', alignItems: 'center'
                                        }} fill="none">
                                            <circle cx="4vh" cy="4vh" r="4vh" fill="#D9D9D9" />
                                            <path d="M18.2648 12.0881C19.0839 12.0881 19.8694 12.4135 20.4486 12.9927C21.0277 13.5718 21.3531 14.3573 21.3531 15.1764C21.3531 15.9954 21.0277 16.7809 20.4486 17.3601C19.8694 17.9392 19.0839 18.2646 18.2648 18.2646C17.4458 18.2646 16.6603 17.9392 16.0811 17.3601C15.502 16.7809 15.1766 15.9954 15.1766 15.1764C15.1766 14.3573 15.502 13.5718 16.0811 12.9927C16.6603 12.4135 17.4458 12.0881 18.2648 12.0881ZM18.2648 19.8087C21.6773 19.8087 24.4413 21.1907 24.4413 22.897V24.4411H12.0884V22.897C12.0884 21.1907 14.8523 19.8087 18.2648 19.8087Z" fill="#757575" />
                                        </svg> */}
                                        <PersonIcon style={{ height: '3vh', width: '3vh' }} />
                                    </Box>
                                    <Box sx={{ ml: '0.4vh', color: 'rgba(0, 0, 0, 0.54)', display: 'flex', flexFlow: 'column', gap: '0.3vh' }}>
                                        <Box sx={{ fontWeight: '600', color: 'black' }}>{ref.name}</Box>
                                        <Box>{ref.phone}</Box>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '1.3vh'
                                        }}>
                                            <Box>
                                                Rs: {ref.price}
                                            </Box>&emsp;&emsp;
                                            <Box>
                                                {ref.date}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Item>
                        </Grid>
                    })}
                </Grid>
            </Box>
            <Box sx={{ textAlign: 'end', mt: '2vh' }}>
                <Button onClick={() => {
                    markFulfilled(referral.refCode).then(res => {
                        referralData.updateData()
                    })
                }} className="upload-vouchers" color="primary"
                    disabled={referral.isEligible} variant='contained'>
                    Mark{referral.isEligible && "ed"} As Fulfilled
                </Button>
            </Box>
        </Box >
    )
}
