import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button } from '@material-ui/core';
import { getClients, deleteClients } from 'services/repo/ClientCompaniesService';
import { getAllVouchers } from 'services/repo/VouchersService';
import SearchIcon from '@material-ui/icons/Search';
import helpers from 'helpers';
import { Alert } from '@material-ui/lab';
import './style.scss';

export default function ClientCompanies(props){
    const [isLoading, setLoading] = useState(false);
    const [displayUploadVouchersModal, setUploadVouchersModal] = useState(false);
    const [clientCompanies, setClientCompanies] = useState([]);
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [emptyVoucherAlert, setEmptyVoucherAlert] = useState(false);
    const [searchedResults, setSearchResults] = useState([]);
    const history = useHistory()

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if(searchText.length > 0) {
            let searchResults = [];
    
            clientCompanies.forEach((clientCompanyInfo, index) => {
                const { name = '', contact = ''} = clientCompanyInfo;
    
                if(name.toLowerCase().includes(searchText.toLowerCase()) || contact.toString().toLowerCase().includes(searchText.toLowerCase())) {
                    searchResults.push(index);
                }
            });
            setSearchResults(searchResults);
        } else {
            setSearchResults([]);
        }
    }, [searchText]);

    const fetchClients = () => {
        getClients().then((response) => {
            const { data = [] } = response;
            data.sort((a,b) => {
                return new Date(b.joined_on) - new Date(a.joined_on);
            });
            setClientCompanies(data);
            setLoading(false);
        }).catch((err) => {})
    };

    const toggleUploadVouchersModal = () => {
        setUploadVouchersModal((displayUploadVouchersModal) => !displayUploadVouchersModal);
    };

    const filterItemsFromSelectedIndexes = (index) => {
        setSelectedIndexes((selectedIndexes) => {
            const filteredArray = selectedIndexes.filter((qrIndex) => qrIndex !== index);

            return filteredArray;
        });
    };

    const selectAllRows = () => {
        let selectedIndexes = [];
        for(let i=0; i < clientCompanies.length; i++) {
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

    const deleteClientCompanies = (e) => {
        let queryParam = helpers.getDeleteApiQueryParam(selectedIndexes, clientCompanies, 'client_id') || '';
        
        deleteClients(queryParam).then((response) => {
            setSelectedIndexes([]);
            fetchClients();
        }).catch((error) => {
            setErrorAlert(true);
        });
    }

    const editClientCompany = (e) => {
        const selectedCompany = clientCompanies[selectedIndexes[0]];
        const encodedInfo = window.btoa(JSON.stringify(selectedCompany))

        const redirectURL = `/client_companies/edit?companyInfo=${encodedInfo}`

        history.push(redirectURL);
    }

    const showVoucher = (clientInfo) => {
        const { id, name } = clientInfo;

        getAllVouchers(id).then((response) => {
            const { data = [] } = response;
            let vouchersListing = [];

            data.forEach((voucherObj) => {
                const formattedVouchers = helpers.getFormattedVouchers(voucherObj);
                if(formattedVouchers.length > 0) {
                    vouchersListing = [...vouchersListing,  ...formattedVouchers];
                }
            });
            if(vouchersListing.length) {
                const voucherList = window.btoa(JSON.stringify(vouchersListing))
                history.push(`/clientVouchers?clientName=${name}&voucherList=${voucherList}`)
            } else {
                setEmptyVoucherAlert(true)
            }
        }).catch((err) => {})
    }

    let isAllListChecked = useMemo(() => {
        if(clientCompanies.length == 0) {
            return false;
        }
        return !(clientCompanies.some((_, index) => !selectedIndexes.includes(index)));
    }, [clientCompanies, selectedIndexes]);
    const disableDeleteAction = selectedIndexes.length == 0;
    const disableEditAction = selectedIndexes.length !== 1;
    let noSearchResultsFound = false;
    if(searchedResults.length == 0 && searchText.length) {
        noSearchResultsFound = true;
    }
    
    return(
        <Box>
            <div className="container client-companies-container">
                {isLoading &&
                    <div>Loading...</div>
                }
                {errorAlert && 
                    <Alert severity="warning">Something went wrong — please try again!</Alert>
                }
                {emptyVoucherAlert && 
                    <Alert severity="warning">This client has no vouchers!</Alert>
                }
                {!isLoading &&
                    <React.Fragment>
                        <div className="header-bar client-companies-header-bar">
                            <div className="title">Client Companies</div>
                            <div className="btn-group">
                                <Button onClick={toggleUploadVouchersModal} className="upload-vouchers" color="primary" variant='contained'>Upload vouchers</Button>
                                <Button onClick={() => history.push('/client_companies/create')} className="create-company" color="primary" variant='contained'>Create new company</Button>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="table-action-bar">
                                <div className="actions">
                                    <div className="title">ACTIONS</div>
                                    <button onClick={deleteClientCompanies} className={"delete-action" + (disableDeleteAction ? ' btn-disabled' : '')}>DELETE</button>
                                    <button onClick={editClientCompany} className={"edit-action"+ (disableEditAction ? ' btn-disabled' : '')}>EDIT</button>
                                    {/* <div className="switch-container">
                                        <label>IS ACTIVE</label>
                                        <Switch checked={true} />
                                    </div> */}
                                </div>
                                {/* <div className="filters">
                                    <div className="title">FILTERS</div>
                                    <div className="switch-container">
                                        <label>IS ACTIVE</label>
                                        <Switch checked={true} />
                                    </div>
                                </div> */}
                            </div>
                            <div className="table-list">
                                <div className="search-container">
                                    <input
                                        className="search-field"
                                        placeholder="Search Companies"
                                        value={searchText}
                                        onChange={(e) => handleSearch(e)}
                                    />
                                    <SearchIcon className="search-icon" color='primary'/>
                                </div>
                                <table className="table client-companies-table">
                                    <thead className="table-head client-companies-table-head">
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    className={"checkbox select-all-checkbox"}
                                                    checked={isAllListChecked}
                                                    onChange={(e) => hanldeCheckboxChange(e,-1, isAllListChecked, 'all')}
                                                />
                                            </th>
                                            <th>Name</th>
                                            <th>Contact</th>
                                            <th>Potential</th>
                                            <th>Joined on</th>
                                            <th>Is Advertisable</th>
                                            {/* <th>Contact Name</th> */}
                                            <th>Vouchers</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body client-companies-table-body">
                                        {!noSearchResultsFound && clientCompanies.length > 0 && clientCompanies.map((clientCompanyInfo, index) => {
                                            const { name = '', contact = '', potential = '', joined_on = '', conatctName = '', is_advertisible = '', vouchers = '' } = clientCompanyInfo;
                                            let joined_on_modified = (joined_on && joined_on.length) ? joined_on.split('T')[0] : '';
                                            const isRowChecked = selectedIndexes.includes(index);

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
                                                    <td>{name}</td>
                                                    <td>{contact}</td>
                                                    <td>{potential}</td>
                                                    <td>{joined_on_modified}</td>
                                                    <td>{is_advertisible ? 'YES' : 'NO'}</td>
                                                    {/* <td>{conatctName}</td> */}
                                                    <td className="td-action" onClick={() => showVoucher(clientCompanyInfo)}>Show Vouchers</td>
                                                </tr>
                                            )
                                        })}
                                        {(noSearchResultsFound || clientCompanies.length == 0) &&
                                            <tr>
                                                <td colspan="100%">No Records found</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </React.Fragment>
                }
            </div>
        </Box>
    );
};