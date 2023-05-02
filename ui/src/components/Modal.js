import { ModalHeader, ModalBody, ModalFooter, Button, ButtonGroup, TextInput, Dropdown } from "@contentstack/venus-components";
import { useState, useEffect } from "react";
import { v4 } from "uuid";

const ModalComponent = (props) => {

    const getAllEntry = async (api_key, authorization, apiUrl, contentTypeUid, locale) => {
        try {
          const url = `${apiUrl}/v3/content_types/${contentTypeUid}/entries?locale=${locale}`;
          const result = await axios({ 'url': url, 'method': 'GET', headers: { 'api_key': api_key, 'authorization': authorization } });
          if (result) return result?.data?.entries;
        } catch (error) {
          return error;
        }
      };

    const [details, setdetails] = useState({
        hotspot_uid: v4(),
        title: '',
        description: '',
        url: '',
        pageX: props.pageX,
        pageY: props.pageY,
        isUpdate: props.isUpdate,
        product: { title: props.product.title, uid: props.product.uid }
    });
    const [defaultCTs, setDefaultCTs] = useState([]);
    const [ct, setCT] = useState({ title: "", uid: "" });

    const getCTsData = (cts, value) => {
        let cts_list = [];
        cts.forEach((ct1) => {
            cts_list.push({
                label: `${ct1.title}`,
                action: () => {
                    setCT({ title: ct1.title, uid: ct1.uid });
                },
                value: ct1.uid,
                default: ct1.uid === value.uid,
            });
        });
        //console.log('cts_list', cts_list);
        setDefaultCTs(cts_list);
        return cts_list;
    };

    const handleDetails = (e) => {
        //console.log('e',e);
        const { value } = e.target
        setdetails({
            ...details,
            [e.target.name]: value
        })
    }
   

    const handleDropdown = (e) => {
        // console.log('e', e);
        const { label, value } = e
        setdetails({
            ...details,
            product: { title: label, uid: value }
        })
    }

    const handleSave = () => {
        // console.log('details', details);
        if (details.product.title !== '' && details.product.uid !== '') {
            props.getValue(details, props.closeModal())
        } else {
            // console.log('ct', ct);
            const defaultDetails = { ...details, product: { title: ct.title, uid: ct.uid } }
            // console.log('defaultDetails', defaultDetails);
            props.getValue(defaultDetails, props.closeModal())

        }
    }

    const handleDelete = () => {
        props.handleDelete(details.hotspot_uid, props.closeModal())

    }


    useEffect(() => {
        async function fetchData(value) {
            //console.log('first')
            const entries = await getAllEntry("blt2e7c74b243ddbd61", "csca3e734e006dd9b0cb553293", "https://eu-api.contentstack.com", "product_detail_page", "en-us");
            //console.log('entries through modal', entries);
            let cts = [];
            if (Object.keys(value).length === 0) {
                const defvalue = {
                    title: entries[0].title, uid: entries[0].uid
                };
                setCT(defvalue);
                cts = getCTsData(entries, defvalue);
            } else {
                setCT(value);
                cts = getCTsData(entries, value);
            }
            setDefaultCTs(cts);
        }
        if (props.description === '' && props.title === '') {
            fetchData({});
        } else {
            const value = { title: props.product.title, uid: props.product.uid }
            fetchData(value);
        }
    }, [])

    useEffect(() => {
        if (props.description !== '' || props.title !== ''||props.url!=='') {
            setdetails({
                ...details,
                hotspot_uid: props.hotspot_uid,
                title: props.title,
                description: props.description,
                url: props.url,
                pageX: props.pageX,
                pageY: props.pageY,
                isUpdate: props.isUpdate,
                product: { title: props.product.title, uid: props.product.uid }
            })
        }
    }, [props])


    return (
        <>
            <ModalHeader title='Asset Hotspot' closeModal={props.closeModal} />
            <ModalBody className='modalBodyCustomClass'>
                <h6>Title</h6>
                <TextInput
                    onChange={handleDetails}
                    placeholder='Title'
                    name='title'
                    value={details.title}
                />
                <br />
                <h6>Description</h6>
                <TextInput
                    onChange={handleDetails}
                    placeholder='Description'
                    name='description'
                    value={details.description}
                />
                <br />
                <h6>Url</h6>
                <TextInput
                    onChange={handleDetails}
                    placeholder='Url'
                    name='url'
                    value={details.url}
                />
                <br />
                <h6>Product</h6>
                <div className="dropdown wrapper">
                    <Dropdown
                        list={defaultCTs}
                        type="select"
                        closeAfterSelect
                        onChange={handleDropdown}
                    ></Dropdown>
                </div>
            </ModalBody>
            <ModalFooter>
                <ButtonGroup>
                    <Button buttonType='light' onClick={() => props.closeModal(details)}>
                        Cancel
                    </Button>
                    <Button disabled={details?.title!==''||details?.description!==''||details?.url!==''?false:true} onClick={handleSave}>Save</Button>
                    {props?.title !== '' || props?.description !== '' || props?.url !==""? <Button onClick={handleDelete} >Delete</Button> : ''}
                </ButtonGroup>
            </ModalFooter>
        </>
    )
}

export default ModalComponent