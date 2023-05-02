import React, { useEffect, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import ModalComponent from "../../../components/Modal";
import ToolTip from "../../../components/tooltip";
import { Icon, cbModal, Button } from "@contentstack/venus-components";
import { find } from "lodash"
import "./index.scss"


const AssetSidebarWidget = () => {

  const isAllowedAssetType = (asset) => {
    const allowedAssetTypes = ["image"]
    const assetContentType = asset?.content_type || ""
    return allowedAssetTypes.some((type) => assetContentType.includes(type))
  }


  const [isShow, setIsShow] = useState(false)
  const [isHide, seIsHide] = useState(false)
  const [data, setData] = useState({})
  const [state, setState] = useState({
    config: {},
    syncAsset: () => { },
    extension_uid: "",
    metadata: [],
    assetMetadataExist: false,
    localMetadataUid: "",
    location: {},
    currentAsset: {},
    isConfiguredState: true,
    appSdkInitialized: false,
  });
  const [imageAssetArr, setImageAssetArr] = useState([]);

  const onAssetClick = (e) => {
    let myImg = document.querySelector(".img");
    const x = (100 * e.pageX) / myImg.clientWidth > 100 ? 96 : (100 * e.pageX) / myImg.clientWidth
    const y = (100 * e.pageY) / myImg.clientHeight > 100 ? 96 : (100 * e.pageY) / myImg.clientHeight
    setImageAssetArr(imageAssetArr => [
      ...imageAssetArr,
      {
        pageX: x,
        pageY: y,
        title: '',
        description: '',
        url: '',
        isUpdate: false,
        product: { title: '', uid: '' }
      }
    ]);
    let data = {
      pageX: x,
      pageY: y,
      title: '',
      description: '',
      url: '',
      isUpdate: false,
      product: { title: '', uid: '' }
    }
    handleClick(data)
  }



  const onClose = (details) => {
    setIsShow(false)
    setData({})
  }

  const getValue = (details, close) => {
    if (state?.metadata?.length > 0) {
      if (!details.isUpdate) {
        addNewMetaData(details, state.metadata)
      }
      else {
        updateExistingMetaData(details, state.metadata)
      }
    }
    else {
      createNewMetadata(details)
    }
    close()
  }

  const handleDelete = (id, close) => {
    deleteExistingMetaData(id, close, state.metadata)
  }

  const handleClick = (data) => {
    cbModal({
      component: (props) => <ModalComponent getValue={getValue} handleDelete={handleDelete} {...props} {...data} />,
      modalProps: {
        onClose,
        onOpen: () => { },
      },
      testId: 'cs-modal-storybook',
    })
  }

  const handleMouseOver = async (e, data) => {
    if (data.hasOwnProperty('hotspot_uid')) {
      await setData(data)
    }
  }

  useEffect(() => {
    if (data.hasOwnProperty('title')) {
      setIsShow(true)
    }
  }, [data])

  const handleClose = () => {
    setIsShow(false)
    setData({})
  }

  const handleEdit = (data) => {
    let upDatedata = {
      hotspot_uid: data.hotspot_uid,
      pageX: data.pageX,
      pageY: data.pageY,
      title: data.title,
      description: data.description,
      url: data.url,
      isUpdate: true,
      product: { title: data.product.title, uid: data.product.uid }
    }
    handleClick(upDatedata)
  }

  const createNewMetadata = (assetMetadata) => {
    let newState = {}
    const hotstopData = []
    hotstopData.push(assetMetadata)
    setImageAssetArr(hotstopData)
    createMetadata(hotstopData).then((res) => {
      console.log('New Metadata Created')
      if (state.syncAsset) {
        state.syncAsset()
      }
      newState = { ...state, localMetadataUid: res.data.metadata.uid }
      newState.metadata.pop()
      newState.metadata.push(res.data.metadata)
      setState(newState)
    }).catch((err) => {
      console.error(err)
    })
  }

  const createMetadata = (hotstopData) => {
    setImageAssetArr(hotstopData)
    if (!window.sdk) {
      return
    }
    const sdk = window.sdk
    return sdk.metadata.createMetaData({
      entity_uid: state.currentAsset.uid,
      type: "asset",
      extension_uid: state.extension_uid,
      _content_type_uid: "sys_assets",
      hotstops: hotstopData
    })
  }

  const updateMetaData = (assetMetadata) => {
    if (!window.sdk) {
      return
    }
    const sdk = window.sdk
    return sdk.metadata.updateMetaData({
      uid: state.localMetadataUid,
      ...assetMetadata
    })
  }

  const addNewMetaData = (assetMetadata, metadata) => {
    let newState = {}
    const localMetaData = find(metadata, { uid: state.localMetadataUid })
    localMetaData.hotstops.push(assetMetadata)
    setImageAssetArr(localMetaData.hotstops)
    updateMetaData(localMetaData).then((res) => {
      console.log('New Metadata Added')
      if (state.syncAsset) {
        state.syncAsset()
      }
      newState = state
      newState.metadata.pop()
      newState.metadata.push(res.data.metadata)
      setState(newState)
    }).catch((err) => {
      console.error(err)
    })
  }

  const updateExistingMetaData = (assetMetadata, metadata) => {
    let newState = {}
    const localMetaData = find(metadata, { uid: state.localMetadataUid })
    const hotspotIndex = localMetaData?.hotstops.findIndex((obj => obj.hotspot_uid === assetMetadata.hotspot_uid));
    localMetaData.hotstops[hotspotIndex] = assetMetadata
    setImageAssetArr(localMetaData.hotstops)
    updateMetaData(localMetaData).then((res) => {
      console.log('Existing Metadata Updated')
      if (state.syncAsset) {
        state.syncAsset()
      }
      newState = state
      newState.metadata.pop()
      newState.metadata.push(res.data.metadata)
      setState(newState)
    }).catch((err) => {
      console.error(err)
    })
  }

  const deleteExistingMetaData = (hotspot_uid, close, metadata) => {
    let newState = {}
    const localMetaData = find(metadata, { uid: state.localMetadataUid })
    const updatedMetadata = localMetaData?.hotstops.filter((obj) => { if (obj.hotspot_uid !== hotspot_uid) { return obj } })
    localMetaData.hotstops = updatedMetadata
    setImageAssetArr(localMetaData.hotstops)
    updateMetaData(localMetaData).then((res) => {
      console.log('Existing Metadata Deleted')
      if (state.syncAsset) {
        state.syncAsset()
      }
      newState = state
      newState.metadata.pop()
      newState.metadata.push(res.data.metadata)
      setState(newState)
    }).catch((err) => {
      console.error(err)
    })
  }

  const isConfigured = async (sdk) => {
    if (!sdk) {
      return Promise.resolve(false)
    }
    const isMarketPlaceApp = sdk.appUID || sdk.installationUID
    if (!isMarketPlaceApp) {
      return Promise.resolve(true)
    } else {
      const config = await sdk.getConfig() || {}
      const extension_uid = config?.extension_uid
      if (extension_uid) {
        return Promise.resolve(true)
      }
      return Promise.resolve(false)
    }
  }

  useEffect(() => {
    ContentstackAppSdk.init().then(async (appSdk) => {
      console.log(appSdk);
      window.sdk = appSdk
      window.extension = appSdk
      const config = await appSdk.getConfig();
      console.log('config', config);
      appSdk?.location?.AssetSidebarWidget?.frame?.enableAutoResizing?.();
      let isConfiguredState = await isConfigured(appSdk)
      console.log('locale', appSdk.stack._data.master_locale)
      const extension_uid = appSdk.locationUID
      const Asset = appSdk.location.AssetSidebarWidget
      let assetMetadataExist = false
      let currentAsset = Asset?.currentAsset || {}
      const isCurrentAssetSupported = isAllowedAssetType(currentAsset)
      let metadata = currentAsset?._metadata?.extensions?.[extension_uid] || []
      // console.log('metadata', metadata);
      if (metadata?.length > 0 && metadata[0]?.hotstops?.length > 0) {
        let data = []
        for (let i = 0; i < metadata[0].hotstops.length; i++) {
          data.push(metadata[0].hotstops[i])
        }
        setImageAssetArr(data)
      }
      let localMetadata = find(metadata, { scope: "local" })
      let localMetadataUid
      if (localMetadata) {
        assetMetadataExist = true
        localMetadataUid = localMetadata.uid;
      }
      if (isCurrentAssetSupported) {
        setState({
          config,
          syncAsset: appSdk.location.AssetSidebarWidget.syncAsset,
          extension_uid,
          assetMetadataExist,
          localMetadataUid,
          location: Asset,
          currentAsset,
          metadata,
          isConfiguredState,
          appSdkInitialized: true,
        });
      }
      else {
        setState({});
        console.log('Image Assets are only supported!')
      }
    });
  }, []);

  const handleShowhotspot = () => {
    seIsHide(!isHide)
  }

  return (
    <div className="layout-container">
      {state.appSdkInitialized && (
        <div className="asset-sidebar-widget">
          <div className="image-marker">
            <img
              className="img"
              src={state.currentAsset.url}
              alt={state.currentAsset.filename}
              onClick={onAssetClick}
            />
            {!isHide && imageAssetArr?.length > 0 && imageAssetArr.map((data) => {
              return (
                <div
                  className="icon-wrapper"
                  style={{ top: data.pageY + '%', left: data.pageX + '%' }}
                >
                  <Icon icon="PurpleAdd" hover={true} onMouseOver={(e) => handleMouseOver(e, data)} />
                </div>
              )
            })}
            {isShow && <ToolTip data={data} handleClose={handleClose} handleEdit={handleEdit} />}
          </div>

          <div className="primaryButton">
            <Button onClick={handleShowhotspot}>{!isHide ? 'Hide' : 'Show'}</Button>
          </div>

        </div>
      )}
    </div>
  );
};

export default AssetSidebarWidget;