import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Dialog, Radio, RadioGroup, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { Formik, Form } from 'formik';
import TextField from 'components/formFields/TextField';
import Delete from '@material-ui/icons/Delete';
import { cloneDeep } from 'lodash';
import { Alert } from '@material-ui/lab';
import { DatePicker } from 'components/formFields';
import { getClients } from 'services/repo/ClientCompaniesService';
import { getAllVouchers, saveVoucher, updateVoucher, uploadVouchers, deleteVoucher } from 'services/repo/VouchersService';
import { isEmpty } from 'lodash';
import helpers from 'helpers';

import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import './style.scss';

export default function Vouchers(props){
    const [isLoading, setLoading] = useState(true);
    const [vouchers, setVouchers] = useState([]);
    const [voucherToUpdate, setVoucherToUpdate] = useState({})
    const [clientCompanies, setClientCompanies] = useState([]);
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [clientName, setClientName] = useState('');
    const [loadClientVoucherMode, setLoadClientVoucherMode] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedResults, setSearchResults] = useState([]);
    const [displayCreateVoucherModal, setDisplayCreateVoucherModal] = useState(false);
    const [displayUploadVoucherModal, setDisplayUploadVoucherModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(false);
    const [voucherList, setVoucherList] = useState(['']);
    const [voucherType, setVoucherType] = useState('single');
    const [errorAlert, setErrorAlert] = useState(false);
    const [voucherImgSrc, setVoucherImgSrc] = useState('');
    const history = useHistory();
    const previousPathRef = useRef(history.location.pathname);

    useEffect(() => {
        try {
            const { pathname = '' } = history.location          
            const clientName = helpers.getQueryParamFromUrl(window.location.search, 'clientName') || '';
            const encodedVoucherInfo = helpers.getQueryParamFromUrl(window.location.search, 'voucherList') || [];
            if(pathname == '/clientVouchers' && encodedVoucherInfo.length) {
                const vouchers = JSON.parse(window.atob(encodedVoucherInfo))
                setLoadClientVoucherMode(true)
                setVouchers(vouchers);
                setClientName(clientName)
                setLoading(false);
            } else {
                const voucherId = helpers.getQueryParamFromUrl(window.location.search, 'id') || '';
                fetchVouchers(voucherId);
                fetchClients();
            }
        } catch(err){}
    }, []);

    useEffect(() => {
        const { pathname = '' } = history.location
        if(previousPathRef.current !== pathname && pathname == '/vouchers') {
            setLoadClientVoucherMode(false)
            setClientName('')
            setLoading(true);
            fetchVouchers();
            fetchClients();
        }
        previousPathRef.current = pathname
    }, [window.location.pathname])

    useEffect(() => {
        if(searchText.length > 0) {
            let searchResults = [];

            vouchers.forEach((vouchersInfo, index) => {
                const { client = '', voucher_code = '', cost = ''} = vouchersInfo;
                const currentClientObj = clientCompanies.find((company) => company.id == client);
                const clientName = currentClientObj && currentClientObj.name ? currentClientObj.name : '';

                if(clientName.toLowerCase().includes(searchText.toLowerCase()) || voucher_code.toLowerCase().includes(searchText.toLowerCase()) || cost.toString().toLowerCase().includes(searchText.toLowerCase())) {
                    searchResults.push(index);
                }
            });
            setSearchResults(searchResults);
        } else {
            setSearchResults([]);
        }
    }, [searchText]);

    useEffect(() => {
        if(!isEmpty(voucherToUpdate)) {
            toggleCreateVoucherModal();
        }
    }, [voucherToUpdate])

    const fetchVouchers = (voucherId = '') => {
        getAllVouchers().then((response) => {
            const { data = [] } = response;
            initializeVoucherListing(data, voucherId)
        }).catch((err) => {})
    };
    
    const fetchClients = () => {
        getClients().then((response) => {
            const { data = [] } = response;
            data.sort((a,b) => {
                return new Date(b.joined_on) - new Date(a.joined_on);
            });
            setClientCompanies(data);
            setSelectedCompany(data[0].id);
        }).catch((err) => {})
    };

    const initializeVoucherListing = (data = [], voucherId = '') => {
        let vouchersListing = [];
        const shouldFilterVoucherList = voucherId !== ''

        data.sort((a,b) => {
            return new Date(b.created_on) - new Date(a.created_on);
        });

        data.forEach((voucherObj) => {
            const formattedVouchers = helpers.getFormattedVouchers(voucherObj);
            if(formattedVouchers.length > 0) {
                vouchersListing = [...vouchersListing,  ...formattedVouchers];
            }
        });
        if(shouldFilterVoucherList) {
            vouchersListing = vouchersListing.filter((voucher) => (voucher.voucherInfoId == parseInt(voucherId)))
        }
        setVouchers(vouchersListing);
        setLoading(false);
    }

    const onClickUploadVoucher = (e) => {
        setDisplayUploadVoucherModal(true);
    }

    const proceedToUploadFile = (e) => {
        const formData = new FormData()
        const fileToUpload = e.target.files[0];
        const date = new Date();
        const stringDate = date.toISOString();
        formData.append('file', fileToUpload);

        uploadVouchers(formData, selectedCompany, stringDate).then((response) => {

        }).catch((error) => {
            setErrorAlert(true);
        })
    }

    const toggleCreateVoucherModal = () => {
        if(displayCreateVoucherModal) {
            setSelectedIndexes([]);
            setSelectedCompany('');
            setVoucherToUpdate({});
            setVoucherImgSrc('');
        } else {
            if(isEmpty(voucherToUpdate) && clientCompanies.length > 0) {
                setSelectedCompany(clientCompanies[0].id);
                setVoucherType('single');
            }
        }
        setDisplayCreateVoucherModal((displayCreateVoucherModal) => !displayCreateVoucherModal);
    };

    const toggleUploadVoucherModal = () => {
        setDisplayUploadVoucherModal((displayUploadVoucherModal) => !displayUploadVoucherModal)
    }

    const handleCompanyChange = (e) => {
        const selectedCompany = e.target.value;

        setSelectedCompany(selectedCompany);
    };

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
        reader.onerror = error => reject(error);
    });

    const createVoucher = async (values) => {
        const { voucherDetails = "", voucherCost, voucherValidity } = values;
        const vouchers = getNonNullValues(voucherList).map((voucher, index) => {
            return {
                is_assigned: false,
                voucher_code: voucher,
                is_active: true
            }
        });

        const base64VoucherImg = await toBase64(voucherImgSrc);

        const payload = {
            client: selectedCompany,
            voucher_detail: voucherDetails,
            cost: voucherCost,
            expiry_date: voucherValidity.toISOString(),
            image: base64VoucherImg,
            vouchers,
            is_single: !!(voucherType == 'single')
        };

        saveVoucher(payload).then((response) => {
            toggleCreateVoucherModal();
            fetchVouchers();
        }).catch((err) => {
            setErrorAlert(true);
        });
    };

    const editVoucher = async (values) => {
        const { voucherDetails = "", voucherCost, voucherValidity } = values;
        let payload = {
            id: voucherToUpdate.voucherInfoId,
            voucher_code: voucherList[0],
            client: selectedCompany,
            voucher_detail: voucherDetails,
            cost: voucherCost,
            expiry_date: (typeof voucherValidity === 'string') ?  voucherValidity : voucherValidity.toISOString()
        };

        if(!(voucherImgSrc.length > 0 && (typeof voucherImgSrc == 'string'))) {
            const base64VoucherImg = await toBase64(voucherImgSrc);

            payload = {...payload, image: base64VoucherImg};
        }

        updateVoucher(payload).then((response) => {
            toggleCreateVoucherModal();
            fetchVouchers();
        }).catch((err) => {
            setErrorAlert(true);
        });
    }

    const filterItemsFromSelectedIndexes = (index) => {
        setSelectedIndexes((selectedIndexes) => {
            const filteredArray = selectedIndexes.filter((qrIndex) => qrIndex !== index);

            return filteredArray;
        });
    };

    const selectAllRows = () => {
        let selectedIndexes = [];
        for(let i=0; i < vouchers.length; i++) {
            selectedIndexes.push(i);
        }
        setSelectedIndexes(selectedIndexes);
    };

    const hanldeCheckboxChange = (e, index, previousCheckValue, type = '') => {
        if(type == 'all') {
            if(previousCheckValue) {
                setSelectedIndexes([]);
            } else {
                selectAllRows();
            }
        } else {
            if(previousCheckValue) {
                filterItemsFromSelectedIndexes(index);
            } else {
                setSelectedIndexes((selectedIndexes) => [...selectedIndexes, index]);
            }
        }
    };

    const onDeleteVoucherClick = (e) => {
        let queryParam = helpers.getDeleteApiQueryParam(selectedIndexes, vouchers, 'voucher_ids') || '';

        deleteVoucher(queryParam).then((response) => {
            setSelectedIndexes([]);
            fetchVouchers();
        }).catch((error) => {
            setErrorAlert(true);
        });
    }

    const onEditVoucherClick = (e) => {
        const index = selectedIndexes[0]
        const selectedVoucherObject = vouchers[index];
        const { client, is_single = false, voucher_code, image } = selectedVoucherObject;
        let voucherList = [voucher_code];
        
        setSelectedCompany(client);
        setVoucherType(is_single ? 'single': 'multiple');
        setVoucherList(voucherList);
        setVoucherToUpdate(selectedVoucherObject);
        if(image) {
            setVoucherImgSrc(image);
        }
    }

    const handleSearch = (e) => {
        const searchText = e.target.value;

        if(selectedIndexes.length > 0) {
            setSelectedIndexes([]);
        }
        setSearchText(searchText);
    };

    const openFile = (e) => {
        const uploadedImg = e.target.files[0];
        setVoucherImgSrc(uploadedImg);
    };

    const deleteUploadedImg = () => {
        setVoucherImgSrc('');
    };

    const handleVoucherTypeChange = (e) => {
        const voucherType = e.target.value;

        setVoucherType(voucherType);
    };

    const handleVoucherChange = (e, voucherIndex) => {
        setVoucherList((voucherList) => {
            voucherList[voucherIndex] = e.target.value;

            return voucherList;
        })
    };

    const addVoucher = () => {
        setVoucherList((voucherList) => [...voucherList, '']);
    };

    const deleteCurrentVoucher = (voucherIndex) => {
        setVoucherList((voucherList) => {
            voucherList[voucherIndex] = null;

            return cloneDeep(voucherList);
        })
    };

    const getFirstNonNullIndex = (list = []) => {
        let firstNonNullIndex = 0;

        for(let i=0; i< list.length; i++) {
            if(list[i] !== null) {
                firstNonNullIndex = i;
                break;
            }
        }

        return firstNonNullIndex;
    };

    const getNonNullValues = (list = []) => {
        let nonNullValues = [];
        for(let i=0; i< list.length; i++) {
            if(list[i] == null) {
                continue;
            }
            nonNullValues.push(list[i]);
        };

        return nonNullValues;
    };

    let isAllListChecked = useMemo(() => {
        if(vouchers.length == 0) {
            return false;
        }
        return !(vouchers.some((_, index) => !selectedIndexes.includes(index)));
    }, [vouchers, selectedIndexes]);
    const disableDeleteAction = selectedIndexes.length == 0;
    const disableEditAction = selectedIndexes.length !== 1;
    let noSearchResultsFound = false;
    if(searchedResults.length == 0 && searchText.length) {
        noSearchResultsFound = true;
    }
    
    return(
        <Box>
            <div className="container vouchers-container">
                {isLoading &&
                    <div>Loading...</div>
                }
                {errorAlert && 
                    <Alert severity="warning">Something went wrong — please try again!</Alert>
                }
                {!isLoading &&
                    <React.Fragment>
                        <div className="header-bar vouchers-header-bar">
                            <div className="title">{(loadClientVoucherMode ? clientName : '') + ' Vouchers'}</div>
                            {!loadClientVoucherMode &&
                                <div className="btn-group">
                                    <Button onClick={onClickUploadVoucher} className="upload-vouchers" color="primary" variant='contained'>Upload Vouchers</Button>
                                    <Button onClick={toggleCreateVoucherModal} color="primary" variant='contained'>Create New</Button>
                                </div>
                            }
                        </div>
                        <div className="table-container">
                            <div className="table-action-bar">
                                <div className="actions">
                                    <div className="title">ACTIONS</div>
                                    <button onClick={onDeleteVoucherClick} className={"delete-action" + (disableDeleteAction ? ' btn-disabled' : '')}>DELETE</button>
                                    <button onClick={onEditVoucherClick} className={"edit-action"+ (disableEditAction ? ' btn-disabled' : '')}>EDIT</button>
                                    {/* <button onClick={activateQr} className={"qr-activate"+ (disableEditAction ? ' btn-disabled' : '')}>{(selectedIndexes.length !== 1) ? 'Activate/Deactivate' : (!!(qrCodeSelectedObject.is_active) ? 'Deactivate QR' : 'Activate QR')}</button> */}
                                </div>
                            </div>
                            <div className="table-list">
                                <div className="search-container">
                                    <input
                                        className="search-field"
                                        placeholder="Search Vouchers"
                                        value={searchText}
                                        onChange={(e) => handleSearch(e)}
                                    />
                                    <SearchIcon className="search-icon" color='primary'/>
                                </div>
                                <table className="table vouchers-table">
                                    <thead className="table-head vouchers-table-head">
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    className={"checkbox select-all-checkbox"}
                                                    checked={isAllListChecked}
                                                    onChange={(e) => hanldeCheckboxChange(e,-1, isAllListChecked, 'all')}
                                                />
                                            </th>
                                            <th>Client</th>
                                            <th>Voucher Code</th>
                                            <th>Voucher Detail</th>
                                            <th>Cost</th>
                                            <th>Validity</th>
                                            <th>Created On</th>
                                            <th>Is Single</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body vouchers-table-body">
                                        {!noSearchResultsFound && vouchers.length > 0 && vouchers.map((voucherInfo, index) => {
                                            const { client = '', voucher_code = '', created_on, expiry_date, voucher_detail, cost, is_single } = voucherInfo;
                                            let created_on_modified = (created_on && created_on.length) ? created_on.split('T')[0] : '';
                                            let expiry_date_modified = (expiry_date && expiry_date.length) ? expiry_date.split('T')[0] : '';
                                            const isRowChecked = selectedIndexes.includes(index);
                                            const clientCompanyObj = clientCompanies.find((clientCompany) => clientCompany.id == client) || {};
                                            const clientCompanyName = loadClientVoucherMode ? clientName : (clientCompanyObj.name ? clientCompanyObj.name : '')

                                            if(searchedResults.length && searchText.length && !searchedResults.includes(index)) {
                                                return null;
                                            }
                                            return (
                                                <tr>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            className={"checkbox select-single-checkbox"}
                                                            checked={isRowChecked}
                                                            onChange={(e) => hanldeCheckboxChange(e,index, isRowChecked, 'single')}
                                                        />
                                                    </td>
                                                    <td>{clientCompanyName}</td>
                                                    <td>{voucher_code}</td>
                                                    <td>{voucher_detail}</td>
                                                    <td>{cost}</td>
                                                    <td>{expiry_date_modified}</td>
                                                    <td>{created_on_modified}</td>
                                                    <td>
                                                        <div className={'dot' + (is_single ?  ' green-dot' : ' grey-dot')}></div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {(noSearchResultsFound || vouchers.length == 0) &&
                                            <tr>
                                                <td colSpan="100%">No Records found</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Dialog 
                            open={displayCreateVoucherModal}
                            onClose={toggleCreateVoucherModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >   
                            <div className="create-voucher-dialog">
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={!isEmpty(voucherToUpdate)
                                        ? {voucherDetails: voucherToUpdate.voucher_detail, voucherValidity: voucherToUpdate.expiry_date, voucherCost: voucherToUpdate.cost}
                                        : {voucherDetails: "", voucherValidity: "", voucherCost: ""}}
                                    onSubmit={(values) => !isEmpty(voucherToUpdate) ? editVoucher(values) : createVoucher(values)}
                                >
                                    <Form>
                                        <div className="dialog-title">Voucher Information</div>
                                        <div className="client-details-wrapper">
                                            <div className="title">Client Details</div>
                                            <Select
                                                className="company-select"
                                                value={selectedCompany}
                                                onChange={handleCompanyChange}
                                            >
                                                {clientCompanies.map((clientCompany) => {
                                                    const { name = '', id = '' } = clientCompany;

                                                    return (
                                                        <MenuItem value={id}>{name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </div>
                                        <div className="voucher-details-wrapper">
                                            <div className="title">Voucher Details</div>
                                            <TextField required className="voucher-details" name="voucherDetails" label="Voucher Details" />
                                            <DatePicker required className="voucher-validity" minDate={Date()} name='voucherValidity' label='Validity' />
                                            <TextField required className="voucher-cost" name="voucherCost" label="Voucher Cost" type="number" />
                                        </div>
                                        <div className="voucher-img-wrapper">
                                            <div className="title">Voucher Image</div>
                                            {!voucherImgSrc &&
                                                <label className="upload-voucher-img" htmlFor="file">
                                                    <span className="upload-img-txt">Upload Voucher Image</span>
                                                    <input type="file" id="file" className="upload-file-input" accept=".png" onChange={openFile}/>
                                                </label>
                                            }
                                            {voucherImgSrc &&
                                                <>
                                                    <img className="uploaded-img" src={(typeof voucherImgSrc == 'object') ? URL.createObjectURL(voucherImgSrc) : voucherImgSrc.length > 0 ? voucherImgSrc : ''} />
                                                    <Delete className="delete-img" onClick={deleteUploadedImg} />
                                                </>
                                            }
                                        </div>
                                        <div className="voucher-type-wrapper">
                                            {isEmpty(voucherToUpdate)
                                                ? <React.Fragment>
                                                    <div className="title">Voucher Type</div>
                                                    <RadioGroup className="voucher-type" row aria-label="url-image" name="url-image" value={voucherType} onChange={handleVoucherTypeChange}>
                                                        <FormControlLabel value={'single'} control={<Radio />} label="Single" />
                                                        <FormControlLabel value={'multiple'} control={<Radio />} label="Multiple" />
                                                    </RadioGroup>
                                                    <div className="vouchers-list">
                                                        {voucherType == "single" &&
                                                            <TextField required className="voucher-code" label="Voucher Code" name={`voucherList[${getFirstNonNullIndex(voucherList)}]`}  onChange={(e) => handleVoucherChange(e, 0)}/>
                                                        }
                                                        {voucherType == "multiple" && voucherList.map((voucherCode, index) => {
                                                            const voucherNameString = 'voucherList' + '[' + index + ']';
                                                            
                                                            if(voucherCode == null) {
                                                                return null;
                                                            }
                                                            return (
                                                                <div className='voucher-code-wrapper'>
                                                                    <TextField required className="voucher-code" label="Voucher Code" name={voucherNameString} key={`${voucherCode}-${index}`} onChange={(e) => handleVoucherChange(e, index)} />
                                                                    {(getNonNullValues(voucherList).length > 1) && <DeleteIcon className="delete-voucher" onClick={() => deleteCurrentVoucher(index)} />}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <Button
                                                        className={"add-voucher" + (voucherType == 'single' ? ' btn-disabled' : '')}
                                                        onClick={() => {addVoucher();}}
                                                    >Add-voucher</Button>
                                                </React.Fragment>
                                                : null
                                            }

                                        </div>
                                        <Button className="submit" type='submit' color='primary' variant='contained'>{!isEmpty(voucherToUpdate) ? 'Update Voucher' : 'Create Voucher'}</Button>
                                    </Form>
                                </Formik>
                            </div>
                        </Dialog>
                        <Dialog
                            open={displayUploadVoucherModal}
                            onClose={toggleUploadVoucherModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                            <div className="upload-voucher-dialog">
                                <div className="client-details-wrapper">
                                    <div className="title">Select a Client before uploading voucher csv</div>
                                    <Select
                                        className="company-select"
                                        value={selectedCompany}
                                        onChange={handleCompanyChange}
                                    >
                                        {clientCompanies.map((clientCompany) => {
                                            const { name = '', id = '' } = clientCompany;

                                            return (
                                                <MenuItem value={id}>{name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </div>
                                <input type="file" id="upload-voucher" name="files" style={{"display": "none"}}
                                    onChange={proceedToUploadFile} 
                                    onClick={(event) => {
                                        const element = event.target
                                        element.value = ''
                                    }}
                                    accept=".csv"
                                />
                                <label for="upload-voucher" className="proceed-upload-vouchers">Proceed</label>
                            </div>
                        </Dialog>
                    </React.Fragment>
                }
            </div>
        </Box>
    );
};