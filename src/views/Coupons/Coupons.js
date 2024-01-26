import React, { useEffect, useState } from 'react'
import {
    Box, Fab, Button, Grid, IconButton,
    Typography,
} from '@material-ui/core';
import CouponComponent from './CouponComponent';
import { styled } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import './styles.scss'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { createNewCouponAPI, getCoupons } from 'apis/coupon';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'initial',
    color: theme.palette.text.secondary,
    borderRadius: '2vh',
    my: '2vh !important',
    overflow: 'hidden',
}));
export default function Coupons() {
    const [selectedCoupon, setSelectedCoupon] = useState({ isonetime: "false", isfornew: "false" })
    const [coupons, setCoupons] = useState([]
        //     [
        //     {
        //         isExpired: true,
        //         name: 'COUPON CODE',
        //         discription: 'Discription of the Code',
        //         percentage: '50',
        //         from: '25-01-2020',
        //         to: '25-01-2022',
        //         isonetime: true,
        //     }, {
        //         isExpired: false,
        //         name: 'COUPON CODE',
        //         discription: 'Discription of the Code',
        //         percentage: '50',
        //         from: '25-01-2020',
        //         to: '25-01-2022',
        //         isonetime: true,
        //     }, {
        //         isExpired: false,
        //         name: 'COUPON CODE',
        //         discription: 'Discription of the Code',
        //         percentage: '50',
        //         from: '25-01-2020',
        //         to: '25-01-2022',
        //         isonetime: true,
        //     }, {
        //         isExpired: false,
        //         name: 'COUPON CODE',
        //         discription: 'Discription of the Code',
        //         percentage: '50',
        //         from: '25-01-2020',
        //         to: '25-01-2022',
        //         isonetime: true,
        //     }, {
        //         isExpired: false,
        //         name: 'COUPON CODE',
        //         discription: 'Discription of the Code',
        //         percentage: '50',
        //         from: '25-01-2020',
        //         to: '25-01-2022',
        //         isonetime: true,
        //     }, {
        //         isExpired: false,
        //         name: 'COUPON CODE',
        //         discription: 'Discription of the Code',
        //         percentage: '50',
        //         from: '25-01-2020',
        //         to: '25-01-2022',
        //         isonetime: true,
        //     }, {
        //         isExpired: false,
        //         name: 'COUPON CODE',
        //         discription: 'Discription of the Code',
        //         percentage: '50',
        //         from: '25-01-2020',
        //         to: '25-01-2022',
        //         isonetime: true,
        //     }, {
        //         isExpired: false,
        //         name: 'COUPON CODE',
        //         discription: 'Discription of the Code',
        //         percentage: '50',
        //         from: '25-01-2020',
        //         to: '25-01-2022',
        //         isonetime: true,
        //     }, {
        //         isExpired: false,
        //         name: 'COUPON CODE',
        //         discription: 'Discription of the Code',
        //         percentage: '50',
        //         from: '25-01-2020',
        //         to: '25-01-2022',
        //         isonetime: true,
        //     },
        // ]
    )
    const getCouponsAll = () => {
        getCoupons().then(async res => {
            let temp = []
            if (res)
                for await (let i of res) {
                    let from = new Date(i.valid_from)
                    let to = new Date(i.valid_to)

                    from = from.toISOString().split("T")[0]
                    to = to.toISOString().split("T")[0]
                    console.log(new Date(i.valid_to).valueOf(), ", ", Date.now())
                    temp.push({
                        isExpired: new Date(i.valid_to).valueOf() < Date.now(),
                        name: i.code,
                        discription: i.name,
                        percentage: i.discount_percentage,
                        from: from,
                        to: to,
                        isonetime: i.one_time_only ? 'true' : 'false',
                        id: i.id,
                        usage_count: i.usage_count,
                        isfornew: i.isfornew ? 'true' : 'false'
                    })
                }
            setCoupons([...temp])
        })
    }
    useEffect(() => {
        getCouponsAll()
    }, [])

    // isExpired: false,
    // name: 'COUPON CODE',
    // discription: 'Discription of the Code',
    // percentage: '50',
    // from: '25-01-2020',
    // to: '25-01-2022',
    // isonetime: true,

    const setCouponData = (dat) => {
        console.log(dat)
        setSelectedCoupon({ ...dat })
    }
    const [isSelected, setIsSelected] = useState(null)
    const createNewCoupon = () => {
        const name = document.getElementById('couponName')
        const desc = document.getElementById('couponDesc')
        const start = document.getElementById('couponStart')
        const end = document.getElementById('couponEnd')
        const disc = document.getElementById('couponDisc')
        const couponForNew = document.getElementById('couponForNew')

        if (name.value.length == 0 || desc.value.length == 0 || start.value.length == 0 || end.value.length == 0 || disc.value.length == 0) {
            alert("Please enter the values correctly")
        } else {
            createNewCouponAPI({
                name: name,
                desc: desc,
                start: start,
                end: end,
                disc: disc,
                isOneTime: selectedCoupon.isonetime === "true",
                isNew: isSelected == null,
                id: isSelected != null && selectedCoupon.id,
                isfornew: selectedCoupon.isfornew === "true",
            }).then(res => getCouponsAll()).catch(er => console.log(er))
        }
    }
    return (
        <Box sx={{
            p: '5vh 3vh', fontFamily: 'Montserrat', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: '6vh'
        }}>
            <Box sx={{ width: '100%', height: '70vh', overflowY: 'scroll' }}>
                <Typography
                    style={{ fontSize: '4vh', fontWeight: '400', textAlign: 'left' }}>
                    My Coupons
                </Typography>
                <Box sx={{ width: '100%', mt: '2vh', }}>
                    <Box sx={{ display: 'flex', flexFlow: 'column', gap: '2vh' }} >
                        {coupons.map((coupon, ind) => <Grid style={{ maxWidth: '600px', minWidth: '500px', margin: 'auto', }} item>
                            <Item style={{ borderRadius: '2vh', padding: '2vh !important', }}>
                                <CouponComponent
                                    setIsSelected={setIsSelected} ind={ind}
                                    isSelected={isSelected} setCouponData={setCouponData}
                                    getCouponsAll={getCouponsAll}
                                    data={coupon} />
                            </Item></Grid>)}
                    </Box>
                </Box>
            </Box>
            {/* <Box sx={{ width: '2px', height: '40vh', backgroundColor: 'black', mx: '6vh' }}></Box> */}
            <Box sx={{
                width: '100%', border: '1px solid rgba(0, 0, 0, 0.15)', p: '5vh 3vh', borderRadius: '2vh',
                backgroundColor: 'white', display: 'flex', flexFlow: 'column', gap: '2vh'
            }}>
                <Box>
                    <input
                        onChange={(e) => { setSelectedCoupon({ ...selectedCoupon, name: e.target.value }) }}
                        id="couponName" class='couponTextField' value={selectedCoupon.name || ""} placeholder='Name Of Coupon' />
                    <Box class='couponTextFieldsub' sx={{ fontSize: '1.6vh', color: 'rgba(0, 0, 0, 0.54)', mt: '0.5vh' }}>
                        Name a coupon ( this wont reflect on user side )
                    </Box>
                </Box>
                <Box>
                    <input
                        onChange={(e) => { setSelectedCoupon({ ...selectedCoupon, discription: e.target.value }) }}
                        id="couponDesc" class='couponTextField' value={selectedCoupon.discription || ""} placeholder='Coupon Code' />
                    <Box class='couponTextFieldsub' sx={{ fontSize: '1.6vh', color: 'rgba(0, 0, 0, 0.54)', mt: '0.5vh' }}>
                        Make sure every word is CAPITAL and it is used as reference
                    </Box>
                </Box>
                <Box>
                    <input
                        onChange={(e) => { setSelectedCoupon({ ...selectedCoupon, percentage: e.target.value }) }}
                        id="couponDisc" class='couponTextField' value={selectedCoupon.percentage || ""} placeholder='Discount %' />
                    <Box class='couponTextFieldsub' sx={{ fontSize: '1.6vh', color: 'rgba(0, 0, 0, 0.54)', mt: '0.5vh' }}>
                        Discount percentage is applied on total order value
                    </Box>
                </Box>
                <Box sx={{ color: 'black', fontSize: '1.7vh', mb: '-0.5vh' }}>Validity</Box>
                <Box sx={{ width: '100%', display: 'flex', gap: '2vh' }}>
                    <Box sx={{ width: '100%' }}>
                        <input
                            onChange={(e) => { setSelectedCoupon({ ...selectedCoupon, from: e.target.value }) }}
                            type='date' id="couponStart" value={selectedCoupon.from ? new Date(selectedCoupon.from).toISOString().split("T")[0] : ""} class='couponTextField' placeholder='From' />
                        <Box class='couponTextFieldsub' sx={{ fontSize: '1.6vh', color: 'rgba(0, 0, 0, 0.54)', mt: '0.5vh' }}>
                            Starts from the date of
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <input
                            onChange={(e) => {

                                setSelectedCoupon({ ...selectedCoupon, to: e.target.value })
                            }}
                            type='date' id="couponEnd" value={selectedCoupon.to ? new Date(selectedCoupon.to).toISOString().split("T")[0] : ""} class='couponTextField' placeholder='To' />
                        <Box class='couponTextFieldsub' sx={{ fontSize: '1.6vh', color: 'rgba(0, 0, 0, 0.54)', mt: '0.5vh' }}>
                            Ends from the date of
                        </Box>
                    </Box>
                </Box>
                <Box >
                    <Box sx={{
                        width: '100%',
                        '& > .MuiFormGroup-root': { display: 'flex', flexFlow: 'row' },
                        '& .MuiFormControlLabel-root': { width: '100%' },
                    }}>
                        <RadioGroup
                            onChange={(e) => { setSelectedCoupon({ ...selectedCoupon, isonetime: e.target.value }) }}
                            id='couponOneTime' value={selectedCoupon.isonetime}>
                            <FormControlLabel value="true" control={<Radio />} label="One-time use" />
                            <FormControlLabel value="false" control={<Radio />} label="Multi-time use" />
                        </RadioGroup>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        '& > .MuiFormGroup-root': { display: 'flex', flexFlow: 'row' },
                        '& .MuiFormControlLabel-root': { width: '100%' },
                    }}>
                        <RadioGroup id='couponForNew'
                            onChange={(e) => { setSelectedCoupon({ ...selectedCoupon, isfornew: e.target.value }) }}
                            value={selectedCoupon.isfornew}>
                            <FormControlLabel value={"true"} control={<Radio />} label="Only for New Users" />
                            <FormControlLabel value={"false"} control={<Radio />} label="For ALL Users" />
                        </RadioGroup>
                    </Box>
                    <Box sx={{ width: '100%', textAlign: 'end', mt: '2vh', display: 'flex', justifyContent: 'space-between' }}>
                        {isSelected != null ? <Button onClick={() => { setIsSelected(null); setSelectedCoupon({}) }} className="upload-vouchers" color="white"
                            variant='contained'>
                            {'Cancel'}
                        </Button> : <Box></Box>}

                        <Button onClick={() => { createNewCoupon() }} className="upload-vouchers" color="primary"
                            variant='contained'>
                            {isSelected ? "Update" : 'Submit'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}
