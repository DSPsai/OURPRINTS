import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Fab, Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import ReferralContainer from './ReferralContainer';
import useAsyncDataFrom from 'hooks/useAsyncDataFrom';
import UserService from 'services/repo/UserService';
import { getReferrals } from 'apis/referrals';
import { LastPage } from '@material-ui/icons';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '2vh'
}));

function useIsVisible(ref) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting)
        );

        observer.observe(ref.current);
        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isIntersecting;
}
export default function Referrals() {
    const [referralsData, setReferralsData] = useState([])

    const updateData = async () => {
        return await getReferrals()
    }

    const ref = useRef();
    const isVisible = useIsVisible(ref);
    const [pages, setPages] = useState(0)
    const [lastPage, setLastPage] = useState(-1)
    useEffect(() => {
        console.log("visible", pages)
        // const inter = setTimeout(() => {
        if (lastPage !== pages) {
            setLastPage(pages)
            updateData(pages).then(data => {
                setPages(pages + 1)
                console.log(data)
                setReferralsData([...referralsData, ...data]);
            })
        }
        // }, 500)

    }, [isVisible])
    return (
        <Box>
            <Grid container spacing={2}>
                {referralsData.map(referral => {
                    return <Grid item xs={6}>
                        <Item sx={{ borderRadius: '2vh' }}>
                            <ReferralContainer updateData={updateData} data={referral} />
                        </Item>
                    </Grid>
                })}
            </Grid>
            <Box sx={{
                height: '10vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                bgcolor: '#388e3c', fontSize: '2.2vh', color: 'white', mt: '4vh'
            }} ref={ref}>{isVisible ? "...Loading..." : "...Loading..."}</Box>
        </Box>
    )
}
