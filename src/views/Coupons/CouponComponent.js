import React from 'react'
import {
    Box, Fab, Button, Grid, IconButton,
    Typography,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles } from '@material-ui/core/styles';
import { deleteCoupon } from 'apis/coupon';

import ReactDOM from 'react-dom';

const useStyles = makeStyles({
    menu: {
        borderRadius: '1vh', border: '1px solid rgba(0, 0, 0, 0.54)', fontSize: '1.6vh',
        textAlign: 'center', mt: '2vh', minWidth: '15vh',
        backgroundColor: 'white',
    },
});


export default function CouponComponent({ setIsSelected, ind, isSelected, setCouponData, data, getCouponsAll }) {
    const coupon = data
    const classes = useStyles();
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }
        return { x: event.pageX, y: event.pageY }
        // Use event.pageX / event.pageY here
    }
    console.log(coupon)
    return (
        // isExpired: false,
        // name: 'COUPON CODE',
        // discription: 'Discription of the Code',
        // percentage: '50',
        // from: '25-01-2020',
        // to: '25-01-2022',
        // isonetime: true,
        <Box sx={{
            py: '2vh !important', color: 'black',
            backgroundColor: isSelected == ind ? "#388e3c63" : "", borderRadius: '2vh !important'
        }}>
            {coupon.isExpired && <Box sx={{
                backgroundColor: '#94C296', width: 'fit-content', fontSize: '1.2vh',
                p: '0.5vh 3vh', color: 'white', transform: 'rotate(-45deg) translateY(-3.4vh) translateX(-1.7vh)'
            }}>{"EXPIRED"}</Box>}
            <Box sx={{ display: 'flex', mt: coupon.isExpired ? '-2.3vh' : "", width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img style={{
                        height: '6vh', width: '6vh',
                        marginLeft: '3vh', marginRight: '5vh',
                    }} src='/gift.svg'></img>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexFlow: 'column', pr: '2vh', gap: '0.4vh' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box sx={{ fontSize: '2vh', fontWeight: '700' }}>{coupon.name}</Box>
                        <Box onMouseLeave={(e) => {
                            setTimeout(() => {
                                ReactDOM.render(<></>, document.getElementById('addmenu' + ind));
                            }, 3000)
                        }} className='couponMenuIcon' sx={{
                            display: 'flex', flexFlow: 'column', color: 'rgba(0, 0, 0, 0.54)',
                        }}>
                            <MoreHorizIcon onClick={(e) => {
                                const { x, y } = handleMouseMove(e)
                                console.log(e, x, y, e.clientX, e.clientY)
                                ReactDOM.render(<Box sx={{
                                    position: 'absolute',
                                    left: x + 'px',
                                    top: y + 'px',
                                }} className={classes.menu + " couponMenu"}>
                                    <Box onClick={() => { setIsSelected(ind); setCouponData(data); }} sx={{
                                        borderBottom: '0.2px solid rgba(0, 0, 0, 0.54)',
                                        py: '0.5vh'
                                    }}>Edit</Box>
                                    <Box onClick={() => { deleteCoupon({ name: coupon.name, id: coupon.id }).then(res => getCouponsAll()) }} sx={{
                                        py: '0.5vh'
                                    }}>Delete</Box>
                                </Box>, document.getElementById('addmenu' + ind));
                            }} sx={{}} />
                            <Box sx={{ height: '0', width: '0' }} id={'addmenu' + ind}></Box>
                        </Box>
                    </Box>
                    <Box sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '1.6vh' }}>{coupon.discription}</Box>
                    <Box sx={{ fontSize: '1.8vh' }}>{coupon.percentage}%</Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: '400', fontSize: '1.5vh' }}>
                        <Box>From: <span style={{ color: 'rgba(0, 0, 0, 0.54)' }}>{coupon.from}</span></Box>
                        <Box>To: <span style={{ color: 'rgba(0, 0, 0, 0.54)' }}>{coupon.to}</span></Box>
                    </Box>
                    <Box sx={{ fontSize: '1.6vh', display: 'flex' }}><Box sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>used count : </Box>{coupon.usage_count}</Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ fontSize: '1.6vh', display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}>{coupon.isfornew === "true" ? "new users" : "all users"}</Box>
                        <Box sx={{ fontSize: '1.6vh', display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}>{coupon.isonetime === "true" ? "one time" : "multi-time"}</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
