import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Grid, Switch } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { saveClients, updateClient } from 'services/repo/ClientCompaniesService';
import TextField from 'components/formFields/TextField';
import helpers from 'helpers';
import './style.scss';

function CreateClientCompamy(props) {
    const [uploadedImg, setUploadedImg] = useState('');
    const [clientImgSrc, setClientImgSrc] = useState('');
    const [isAdvertisible, setIsAdvertisible] = useState(false);
    const [isEditClient, setIsEditClient] = useState(false);
    const [initialCompanyInfo, setInitialCompanyInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory();
    const match = useRouteMatch();

    useEffect(() => {
        const { params: {viewType = 'create'} } = match;
        if(viewType == 'edit') {
            const encodedCompanyInfo = helpers.getQueryParamFromUrl(window.location.search, 'companyInfo');
            if(encodedCompanyInfo.length) {
                setIsLoading(true)
                try {
                    let initialCompanyInfo = JSON.parse(window.atob(encodedCompanyInfo))
                    const { is_advertisible = false } = initialCompanyInfo;

                    initialCompanyInfo = {...initialCompanyInfo, address: JSON.parse(initialCompanyInfo.address)}
                    setInitialCompanyInfo(initialCompanyInfo)
                    setIsEditClient(true);
                    setIsAdvertisible(is_advertisible);
                } catch(err) {
                    setIsLoading(false)
                }
            }
        }
    }, [])

    useEffect(() => {
        if(isEditClient && Object.keys(initialCompanyInfo).length) {
            setIsLoading(false)
        }
    }, [initialCompanyInfo, isEditClient])

    const createClient = (values) => {
        const { city = '', state = '', country = '', pincode = '' } = values;
        const address = {city, state, country, pincode: pincode.toString()};
        const payload = {
            ...values,
            address: JSON.stringify(address),
            is_advertisible: isAdvertisible,
            joined_on: new Date().toISOString()
        }

        if(isEditClient) {
            updateClient(payload, initialCompanyInfo.id).then((response) => {
                history.push('/client_companies');
            })
        } else {
            saveClients(payload).then((response) => {
                history.push('/client_companies');
            });
        }
    };

    const getInitialCompanyInfo = () => {
        const {
            name = "",
            client_type = "",
            contact = "",
            potential = "",
            address = {}
        } = initialCompanyInfo;
        const {city = "", state = "", country = "", pincode = ""} = address;
                
        return {
            name,
            contact,
            country,
            city,
            state,
            pincode, 
            client_type,
            potential
        }
    };

    const openFile = (e) => {
        const uploadedImg = e.target.files[0];
        setUploadedImg(uploadedImg);
        setClientImgSrc(URL.createObjectURL(uploadedImg));
    };

    const deleteUploadedImg = () => {
        setClientImgSrc('');
        setUploadedImg('');
    };

    const toggleIsAdvertisible = (e) => {
        setIsAdvertisible((isAdvertisible) => !isAdvertisible);
    }
    

    return (
        <Box>
            {isLoading &&
                <div>Loading...</div>
            }
            {!isLoading &&
                <div className="container">
                    <div className="header-bar">
                        <div className="title">{isEditClient ? 'Edit' : 'Create New' + ' Client Company'}</div>
                    </div>
                    <div className="content">
                        <div className="client-details-wrapper">
                            <div className="content-title">Client Details</div>
                            <Formik
                                initialValues={getInitialCompanyInfo()}
                                onSubmit={createClient}
                            >
                                <Form>
                                    <Grid container lg={6} md={6} s={12} xs={12} spacing={4}>
                                        <Grid container item spacing={3}>
                                            <Grid item lg={4}>
                                                <TextField variant="outlined" required className="client-name" name="name" label="Client Name" type="text" />
                                            </Grid>
                                            <Grid item lg={4}>
                                                <TextField variant="outlined" required className="phone-number" name="contact" label="Phone Number" type="number" />
                                            </Grid>
                                        </Grid>
                                        <Grid container item spacing={3}>
                                            <Grid item lg={4}>
                                                <TextField variant="outlined" required className="client-country" name="country" label="Client Country" type="text" />
                                            </Grid>
                                            <Grid item lg={4}>
                                                <TextField variant="outlined" required className="city" name="city" label="City" type="text" />
                                            </Grid>
                                        </Grid>
                                        <Grid container item spacing={3}>
                                            <Grid item lg={4}>
                                                <TextField variant="outlined" required className="state" name="state" label="State" type="text" />
                                            </Grid>
                                            <Grid item lg={4}>
                                                <TextField variant="outlined" required className="pincode" name="pincode" label="Pin Code" type="number" />
                                            </Grid>
                                        </Grid>
                                        <Grid container item spacing={3}>
                                            <Grid item lg={4}>
                                                <TextField variant="outlined" required className="client-type" name="client_type" label="Client Type" type="number" />
                                            </Grid>
                                            <Grid item lg={4}>
                                                <TextField variant="outlined" className="client-potential" name="potential" label="Client Potential" type="text" />
                                            </Grid>
                                        </Grid>
                                        <Grid container item spacing={3}>
                                            <Grid item lg={4}>
                                                <div className="switch-container">
                                                    <label>IS ADVERTISABLE</label>
                                                    <Switch onChange={toggleIsAdvertisible} checked={isAdvertisible} />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        <Grid container item spacing={3}>
                                            <Grid item lg={4}>
                                                <Button className="submit" type='submit' color='primary' variant='contained'>Create Client</Button>
                                            </Grid>
                                        </Grid>

                                        {/* <Grid container item spacing={3}>
                                            <Grid item lg={4}>
                                                <div className="client-img-txt">Client Image</div>
                                                <div className="client-image-wrapper">
                                                    {!clientImgSrc &&
                                                        <label className="upload-img" for="file">
                                                            <PublishTwoTone className="search-icon" color='primary'/>
                                                            <span className="upload-img-txt">Upload Client Image</span>
                                                            <input type="file" id="file" className="upload-file-input" accept=".png" onChange={openFile}/>
                                                        </label>
                                                    }
                                                    {clientImgSrc && 
                                                        <>
                                                            <img className="uploaded-img" src={clientImgSrc} />
                                                            <Delete className="delete-img" onClick={deleteUploadedImg} />
                                                        </>
                                                    }
                                                </div>
                                            </Grid>
                                        </Grid> */}
                                    </Grid>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            }
        </Box>
    )
}

export default CreateClientCompamy;