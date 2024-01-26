import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Dialog, Radio, RadioGroup, FormControlLabel, Select, MenuItem, FormControl } from '@material-ui/core';
import { Formik, Form } from 'formik';
import TextField from 'components/formFields/TextField';
import GetAppIcon from '@material-ui/icons/GetApp';
import { DatePicker } from 'components/formFields';
import { getQrCodes, saveQrCode, updateQrCode, deleteQrCodes } from 'services/repo/QrCodeService';
import helpers from 'helpers';
import { isEmpty } from 'lodash';
import QRCode from "qrcode.react";
import SearchIcon from '@material-ui/icons/Search';
import Delete from '@material-ui/icons/Delete';
import { Alert } from '@material-ui/lab';
import cfg from 'cfg';
import './style.scss';

export default function QrCodes(props){
    const [isLoading, setLoading] = useState(true);
    const [displayGenerateQRModal, setGenerateQRModal] = useState(false);
    const [displayQRCode, setDisplayQrCode] = useState(false);
    const [selectedQrInfo, setSelectedQrInfo] = useState({});
    const [qrCodes, setQrCodes] = useState([]);
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedResults, setSearchResults] = useState([]);
    const [qrToUpdate, setQRToUpdate] = useState({});
    const [errorAlert, setErrorAlert] = useState(false);
    const [qrRedirectionType, setQrRedirectionType] = useState('redirect-url')
    const [redirectionImgSrc, setRedirectionImgSrc] = useState('');
    const [filterValue, setFilterValue] = useState('all');

    useEffect(() => {
        const qrCodeId = helpers.getQueryParamFromUrl(window.location.search, 'id') || '';

        fetchQrCodes(qrCodeId);
    }, []);

    useEffect(() => {
        if(searchText.length > 0) {
            let searchResults = [];
    
            qrCodes.forEach((qrCodeInfo, index) => {
                const { company = '', code = ''} = qrCodeInfo;
    
                if(company.toLowerCase().includes(searchText.toLowerCase()) || code.toString().toLowerCase().includes(searchText.toLowerCase())) {
                    searchResults.push(index);
                }
            });
            setSearchResults(searchResults);
        } else {
            setSearchResults([]);
        }
    }, [searchText]);

    useEffect(() => {
        if(selectedQrInfo.qrValue && selectedQrInfo.qrValue.length) {
            setDisplayQrCode(true);
        }
    }, [selectedQrInfo]);

    useEffect(() => {
        if(!isEmpty(qrToUpdate)) {
            toggleGenerateQRModal();
        }
    }, [qrToUpdate])

    useEffect(() => {
        if(!isEmpty(filterValue)) {
            let filteredIndexes = [];

            qrCodes.forEach((qr, index) => {

                if(filterValue == 'all') {
                    filteredIndexes.push(index)
                } else if(filterValue == 'active') {
                    (qr.is_active) && filteredIndexes.push(index)
                } else if(filterValue == 'inactive') {
                    (!qr.is_active) && filteredIndexes.push(index)
                }
            })
            setSearchResults(filteredIndexes)
        }
    }, [filterValue])

    const fetchQrCodes = (qrCodeId = '') => {
        const shouldFilterQrCodeList = qrCodeId !== ''
        getQrCodes().then((response) => {
            let { data = [] } = response;
            data.sort((a,b) => {
                return new Date(b.generated_date) - new Date(a.generated_date);
            });
            if(shouldFilterQrCodeList) {
                data = data.filter((qr) => (qr.id == parseInt(qrCodeId)))
            }
            setQrCodes(data);
            setLoading(false);
        }).catch((err) => {})
    };

    const viewQr = (qrValue, index) => {
        setSelectedQrInfo({qrValue, index});
    };

    const downloadQr = (canvasId, index) => {
        const canvas = document.getElementById(canvasId);
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qrcode-${index}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const generateQR = (values) => {
        const { validity, company, redirection_url, value } = values;
        let form_data = new FormData();
        let payload = {
            value,
            validity: (typeof validity == 'string') ? validity : validity.toISOString(),
            company,
            count: Math.floor(100 + Math.random() * 900),
            redirection_url : (qrRedirectionType === 'redirect-url') ? redirection_url : ''
        };

        if(qrRedirectionType === 'redirect-img') {
            payload = {...payload, image: redirectionImgSrc}
        }

        for (let key in payload) {
            form_data.append(key, payload[key]);
        }

        saveQrCode(form_data).then((response) => {
            toggleGenerateQRModal();
            fetchQrCodes();
        }).catch((error) => {

        });
    };

    const updateQR = (values, updateFlow = '') => {
        const { validity, company, redirection_url, value, id, code = "", count, image } = values;
        let redirectionImage = image;
        let form_data = new FormData();

        if(qrRedirectionType === 'redirect-img' && typeof redirectionImgSrc == 'object') {
            redirectionImage = redirectionImgSrc;
        }

        let payload = {
            ...values,
            code: !isEmpty(code) ? code : Math.floor(100 + Math.random() * 900),
            value,
            validity: (typeof validity === 'string') ? validity : validity.toISOString(),
            company,
            count: !!count ? count : Math.floor(100 + Math.random() * 900),
            image: qrRedirectionType === 'redirect-img' ? redirectionImage : null,
            redirection_url : (qrRedirectionType === 'redirect-url') ? redirection_url : ''
        };

        if(qrRedirectionType === 'redirect-img' && redirectionImage.length > 0 && (typeof redirectionImage == 'string')) {
            delete payload.image
        }

        for (let key in payload) {
            form_data.append(key, payload[key]);
        }

        updateQrCode(form_data, id).then((response) => {
            if(updateFlow == 'editQrModal') {
                setQRToUpdate({});
                toggleGenerateQRModal();
            }
            fetchQrCodes();
        }).catch((err) => {
            setErrorAlert(true);
        });
    };

    const deleteQR = (e) => {
        let queryParam = helpers.getDeleteApiQueryParam(selectedIndexes, qrCodes, 'qr_id') || '';
        
        deleteQrCodes(queryParam).then((response) => {
            setSelectedIndexes([]);
            fetchQrCodes();
        }).catch((error) => {
            setErrorAlert(true);
        });
    };

    const toggleGenerateQRModal = () => {
        if(displayGenerateQRModal) {
            setSelectedIndexes([]);
            setQRToUpdate({});
        } 
        setGenerateQRModal((displayGenerateQRModal) => !displayGenerateQRModal);
    };

    const toggleDisplayQrCode = () => {
        setDisplayQrCode((displayQRCode) => !displayQRCode);
    };

    const filterItemsFromSelectedIndexes = (index) => {
        setSelectedIndexes((selectedIndexes) => {
            const filteredArray = selectedIndexes.filter((qrIndex) => qrIndex !== index);

            return filteredArray;
        });
    };

    const selectAllRows = () => {
        let selectedIndexes = [];
        for(let i=0; i < qrCodes.length; i++) {
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

    const handleSearch = (e) => {
        const searchText = e.target.value;

        if(selectedIndexes.length > 0) {
            setSelectedIndexes([]);
        }
        setSearchText(searchText);
    };

    const editQr = (e) => {
        const index = selectedIndexes[0];
        const selectedQrObject = qrCodes[index];

        setQRToUpdate(selectedQrObject);
        if(selectedQrObject.redirection_url == '' && selectedQrObject.image) {
            setQrRedirectionType('redirect-img')
            setRedirectionImgSrc(selectedQrObject.image);
        }
    };

    const updateActiveStatus = (isActive) => {
        const index = selectedIndexes[0];
        let selectedQrObject = qrCodes[index];

        selectedQrObject.is_active = !isActive;
        updateQR(selectedQrObject);
    };

    const handleFilterChange = (e) => {
        const filterValue = e.target.value;

        setFilterValue(filterValue);
    };

    const selectQRRedirectOption = (e) => {
        const qrRedirectionType = e.target.value;

        if(qrRedirectionType == 'redirect-url') {
            setRedirectionImgSrc('');
        }
        setQrRedirectionType(qrRedirectionType);
    };

    const openFile = (e) => {
        const uploadedImg = e.target.files[0];
        setRedirectionImgSrc(uploadedImg);
    };

    const deleteUploadedImg = () => {
        setRedirectionImgSrc('');
    };

    let isAllListChecked = useMemo(() => {
        if(qrCodes.length == 0) {
            return false;
        }
        return !(qrCodes.some((_, index) => !selectedIndexes.includes(index)));
    }, [qrCodes, selectedIndexes]);
    const disableDeleteAction = selectedIndexes.length == 0;
    const disableEditAction = selectedIndexes.length !== 1;
    let noSearchResultsFound = false;
    if(searchedResults.length == 0 && searchText.length) {
        noSearchResultsFound = true;
    }
    const qrCodeSelectedObject = selectedIndexes.length == 1 ? qrCodes[selectedIndexes[0]] : {};
    
    return(
        <Box>
            <div className="container qr-codes-container">
                {isLoading &&
                    <div>Loading...</div>
                }
                {errorAlert && 
                    <Alert severity="warning">Something went wrong — please try again!</Alert>
                }
                {!isLoading &&
                    <React.Fragment>
                        <div className="header-bar qr-codes-header-bar">
                            <div className="title">QR Code Generator</div>
                            <Button onClick={() => {
                                toggleGenerateQRModal();
                                setRedirectionImgSrc('');
                                setQrRedirectionType('redirect-url');
                            }} color="primary" variant='contained'>Generate QR</Button>
                        </div>
                        <div className="table-container">
                            <div className="table-action-bar">
                                <div className="actions">
                                    <div className="title">ACTIONS</div>
                                    <button onClick={deleteQR} className={"delete-action" + (disableDeleteAction ? ' btn-disabled' : '')}>DELETE</button>
                                    <button onClick={editQr} className={"edit-action"+ (disableEditAction ? ' btn-disabled' : '')}>EDIT</button>
                                    <button onClick={() => updateActiveStatus(qrCodeSelectedObject.is_active)} className={"qr-activate"+ (disableEditAction ? ' btn-disabled' : '')}>{(selectedIndexes.length !== 1) ? 'Activate/Deactivate' : (!!(qrCodeSelectedObject.is_active) ? 'Deactivate QR' : 'Activate QR')}</button>
                                </div>
                                <div className="filters">
                                    <div className="title">FILTERS</div>
                                    <div className="active-status">
                                        <Select
                                            className="mutli-select"
                                            value={filterValue}
                                            onChange={handleFilterChange}
                                        >
                                            <MenuItem value={'active'}>Active QRs</MenuItem>
                                            <MenuItem value={'inactive'}>Inactive QRs</MenuItem>
                                            <MenuItem value={'all'}>All QRs</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="table-list">
                                <div className="search-container">
                                    <input
                                        className="search-field"
                                        placeholder="Search Qr Codes"
                                        value={searchText}
                                        onChange={(e) => handleSearch(e)}
                                    />
                                    <SearchIcon className="search-icon" color='primary'/>
                                </div>
                                <table className="table qr-codes-table">
                                    <thead className="table-head qr-codes-table-head">
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    className={"checkbox select-all-checkbox"}
                                                    checked={isAllListChecked}
                                                    onChange={(e) => hanldeCheckboxChange(e,-1, isAllListChecked, 'all')}
                                                />
                                            </th>
                                            <th>Company</th>
                                            <th>Qr Code</th>
                                            <th>Generated Date</th>
                                            <th>Validity</th>
                                            <th>Value</th>
                                            <th>Scanned</th>
                                            <th>Download</th>
                                            <th>Is Active</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body qr-codes-table-body">
                                        {!noSearchResultsFound && qrCodes.length > 0 && qrCodes.map((qrCodeInfo, index) => {
                                            const { code = '', generated_date,validity,value, count, company, is_active} = qrCodeInfo;
                                            let generated_date_modified = (generated_date && generated_date.length) ? generated_date.split('T')[0] : '';
                                            let validity_modified = (validity && validity.length) ? validity.split('T')[0] : '';
                                            const isRowChecked = selectedIndexes.includes(index);
                                            const qrValue = `${cfg.baseURL}?qr_code=${code}`;

                                            if(searchedResults.length && !searchedResults.includes(index)) {
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
                                                    <td>{company}</td>
                                                    <td>{code}</td>
                                                    <td>{generated_date_modified}</td>
                                                    <td>{validity_modified}</td>
                                                    <td>{value}</td>
                                                    <td>{count}</td>
                                                    <td className={'td-action'} onClick={() => viewQr(qrValue, index)}>
                                                        <div>View & Download</div>
                                                    </td>
                                                    <td>
                                                        <div className={'dot' + (is_active ?  ' green-dot' : ' grey-dot')}></div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {(noSearchResultsFound || qrCodes.length == 0) &&
                                            <tr>
                                                <td colspan="100%">No Records found</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Dialog 
                            open={displayGenerateQRModal}
                            onClose={toggleGenerateQRModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >   
                            <div className="generate-qr-dialog">
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={!isEmpty(qrToUpdate) ? {...qrToUpdate} : { validity: "", value: "", company: "", redirection_url: "" }}
                                    onSubmit={(values) => {
                                        !isEmpty(qrToUpdate) ? updateQR(values, 'editQrModal') : generateQR(values);
                                    }}
                                >
                                    <Form>
                                        <DatePicker required className="qr-validity" minDate={Date()} name='validity' label='Validity' />
                                        <TextField required className="qr-value" name="value" label="QR code value" type="number" />
                                        <TextField required className="company-name" name="company" label="Company Name" />
                                        <RadioGroup className="redirection-type" row aria-label="url-image" name="url-image" value={qrRedirectionType == '' ? 'redirect-url' : qrRedirectionType} onChange={selectQRRedirectOption}>
                                            <FormControlLabel value="redirect-url" control={<Radio />} label="Redirect URL" />
                                            <FormControlLabel value="redirect-img" control={<Radio />} label="Image" />
                                        </RadioGroup>
                                        {(qrRedirectionType === 'redirect-url' || qrRedirectionType == '') &&
                                            <TextField required className="redirection-url" name="redirection_url" label="Redirection URL" />
                                        }
                                        {qrRedirectionType === 'redirect-img' &&
                                            <div className="redirection-img-wrapper">
                                                {!redirectionImgSrc &&
                                                    <label className="upload-redirect-img" htmlFor="file">
                                                        <span className="upload-img-txt">Upload Redirection Image</span>
                                                        <input type="file" id="file" className="upload-file-input" accept=".png" onChange={openFile}/>
                                                    </label>
                                                }
                                                {redirectionImgSrc &&
                                                    <>
                                                        <img className="uploaded-img" src={(typeof redirectionImgSrc == 'object') ? URL.createObjectURL(redirectionImgSrc) : redirectionImgSrc.length > 0 ? redirectionImgSrc : ''} />
                                                        <Delete className="delete-img" onClick={deleteUploadedImg} />
                                                    </>
                                                }
                                            </div>
                                        }
                                        <Button className="submit" type='submit' color='primary' variant='contained'>OK</Button>
                                    </Form>
                                </Formik>
                            </div>
                        </Dialog>
                        <Dialog 
                            open={displayQRCode}
                            onClose={() => setDisplayQrCode(false)}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >   
                            <div className="qr-code-dialog">
                                <QRCode
                                    id={`${selectedQrInfo.qrValue}-${selectedQrInfo.index}`}
                                    value={selectedQrInfo.qrValue}
                                    size={350}
                                    level={"H"}
                                    includeMargin={true}
                                />
                                <div className="download-qrcode" onClick={() => downloadQr(`${selectedQrInfo.qrValue}-${selectedQrInfo.index}`, selectedQrInfo.index)}>
                                    <span>Download</span><GetAppIcon />
                                </div>
                            </div>
                        </Dialog>
                    </React.Fragment>
                }
            </div>
        </Box>
    );
};