/* Import React modules */
import React, { useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { TypeSDKData, TypeEntryData, TypeHotspot, TypeState } from "../../common/types";
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";
import {Icon} from "@contentstack/venus-components";
import CreateHotSpotDialogBox from "../../components/CreateHotSpotDialogBox";
import ViewHotSpotDialogBox from "../../components/ViewHotspotDialogBox";
import { find } from "lodash";
// import "./global.d.ts";

// declare global {
//   interface Window { 
//     sdk: any; 
//   }
// }


/* To add any labels / captions for fields or any inputs, use common/local/en-us/index.ts */
// interface CustomWindow extends Window {
//   sdk?: any;
// }

// declare global {
//   interface Window { sdk: any; }
// }

  // declare const window: any;

  // interface Window {
  //   sdk:any;
  // }

const SidebarWidget: React.FC = function () {
  const [entryData, setEntryData] = useState<TypeEntryData>({ title: "" });
  // const [state, setState] = useState<TypeSDKData>({
  //   config: {},
  //   location: {},
  //   appSdkInitialized: false,
  // });
  const [hotspotIndex, setHotspotIndex] = useState(Number);
  const [hotspots, setHotspots] = useState<TypeHotspot[]>([])
  const [hotspotCoords, setHotspotCoords] = useState({ x: 0, y: 0 });
  const [enterDetailsDialogVisible, setEnterDetailsDialogVisible] = useState(false);
  const [viewDetailsDialogVisible, setViewDetailsDialogVisible] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<undefined | { [key: string]: any; }>(undefined);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [state, setState] = useState<TypeState>({
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

  //MAIN BRANCH SET STATE------------------------------------
  // const [state, setState] = useState({
  //   config: {},
  //   location: {},
  //   appSdkInitialized: false,
  // });


  const handleClick = (event: any) => {
    if ('offsetX' in event.nativeEvent) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      setHotspotCoords({ x, y });
    }
    setTitle('');
    setDescription('');
    setIsEdit(false);
    setEnterDetailsDialogVisible(true);
    setViewDetailsDialogVisible(false)
  };
  

  const handleHotspotClick = (id : number) => {
    setViewDetailsDialogVisible(true)
    setEnterDetailsDialogVisible(false)
    setHotspotIndex(id);
  };

  const getValue = (hotspots : any) => {
    if (state?.metadata?.length > 0) {
        addNewMetaData(hotspots, state.metadata)
    }
    else {
      //photo does not have metadata and we create it 
      createNewMetadata(hotspots)
    }
  }

  const createNewMetadata = (hotspots : TypeHotspot[]) => {
    console.log('window object', window);
    
    let newState : any = {}
    createMetadata(hotspots).then((res : any) => {
      console.log('New Metadata Created')
      if (state.syncAsset) {
        state.syncAsset()
      }
      newState = { ...state, localMetadataUid: res.data.metadata.uid }
      newState.metadata.pop()
      newState.metadata.push(res.data.metadata)
      setState(newState)
    }).catch((err : any) => {
      console.error(err)
    })
  }

  const createMetadata = (hotspots : TypeHotspot[]) => {
    // @ts-ignore
    const sdk : any = window["sdk"];
    console.log('sdk ----', sdk);
    return sdk.metadata.createMetaData({
      entity_uid: state.currentAsset?.uid,
      type: "asset",
      extension_uid: state.extension_uid,
      _content_type_uid: "sys_assets",
      hotstops: hotspots
    });

  }

  const updateMetaData = (assetMetadata : any) => {
    //@ts-ignore
    if (!window['sdk']){
      return
    }
    //@ts-ignore
    const sdk = window['sdk']
    return sdk.metadata.updateMetaData({
      uid: state.localMetadataUid,
      ...assetMetadata
    })
  }

    const addNewMetaData = (hotspots : TypeHotspot[] , metadata : any) => {
    let newState = {}
    const localMetaData = find(metadata, { uid: state.localMetadataUid })
    localMetaData.hotstops = hotspots;
    updateMetaData(localMetaData).then((res : any) => {
      console.log('New Metadata Added')
      if (state.syncAsset) {
        state.syncAsset()
      }
      newState = state;
      //@ts-ignore
      newState['metadata'].pop()
      //@ts-ignore
      newState.metadata.push(res.data.metadata)
      //@ts-ignore
      setState(newState)
    }).catch((err : any) => {
      console.error(err)
    })
  }


  
  const isConfigured = async (sdk : any) => {
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
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        // @ts-ignore
        window['sdk'] = appSdk
        // @ts-ignore
        window['extension'] = appSdk
        const config = await appSdk?.getConfig();
        // console.log('app sdk:');
        
        if (appSdk.location.AssetSidebarWidget?.currentAsset !== undefined) {
          setCurrentAsset(appSdk.location.AssetSidebarWidget.currentAsset);
        }
      
        const entryDataFromSDK =
          appSdk?.location?.SidebarWidget?.entry?.getData();
        // entryData is the whole entry object from CMS that contains all the data in the current entry for which sidebar is opened.
        setEntryData(entryDataFromSDK);

        let isConfiguredState = await isConfigured(appSdk)
        const extension_uid = appSdk.locationUID;
        const Asset = appSdk.location.AssetSidebarWidget
        let currentAsset = Asset?.currentAsset || {}
        let metadata = currentAsset?._metadata?.extensions?.[extension_uid] || []
        if (metadata?.length > 0 && metadata[0]?.hotstops?.length > 0) {
          let data = []
          for (let i = 0; i < metadata[0].hotstops.length; i++) {
            data.push(metadata[0].hotstops[i])
          }
          setHotspots(data);
        }
        let assetMetadataExist = false;
        let localMetadata : any = find(metadata, { scope: "local" })

        let localMetadataUid;
        if (localMetadata !== undefined) {
          assetMetadataExist = true
          localMetadataUid = localMetadata.uid;
        }

        //MAIN BRANCH SET STATE------------------------------------
        // setState({
        //   config,
        //   location : appSdk.location,
        //   appSdkInitialized: true,
        // });

        setState({
          config,
          syncAsset: appSdk.location.AssetSidebarWidget?.syncAsset || (() => {}),
          extension_uid,
          assetMetadataExist,
          localMetadataUid,
          location: appSdk.location,
          currentAsset,
          metadata,
          isConfiguredState,
          appSdkInitialized: true,
        });
        
        
      })
      .catch((error) => {
        console.error("appSdk initialization error", error);
      });
  }, []);

  /* Handle your UI as per requirement. State variable will hold
  the configuration details from the appSdk. */
  // console.log('entry data:');
  // console.log(entryData);
  return (
    <div className="layout-container">
      {/* This is not being rendered right now */}
      {state.appSdkInitialized && (
        // <>
        // Your sidebar UI must be developed here based on the state variable
        // {`Your current state is ${JSON.stringify(state)}`}
        // {`Your current entryData is ${JSON.stringify(entryData)}`}
        // </>
        <div className="sidebar-wrapper">
          <div className='image-wrapper'>
              <img
                src={currentAsset !== undefined ? currentAsset.url : ''}
                onClick={handleClick}
                alt={currentAsset !== undefined ? currentAsset.filename : ''}
              />
            {hotspots.map(({ id, x, y}) => (
                <Icon key={id} icon="PurpleAdd" style={{ position: 'absolute', left: x, top: y, cursor: 'pointer' }} hover={true} onClick={() => handleHotspotClick(id)} />
            ))}
            {enterDetailsDialogVisible && (
              <CreateHotSpotDialogBox getValue={getValue} hotspots={hotspots} hotspotIndex = {hotspotIndex} isEdit = {isEdit} setHotspots = {setHotspots} hotspotCoords = {hotspotCoords} setEnterDetailsDialogVisible = {setEnterDetailsDialogVisible} globalTitle = {title} globalDescription = {description}/>
            )}
            {
              viewDetailsDialogVisible && (<ViewHotSpotDialogBox getValue={getValue} setIsEdit = {setIsEdit} hotspotIndex = {hotspotIndex} hotspots={hotspots} setHotspots={setHotspots} setTitle = {setTitle} setDescription = {setDescription} setViewDetailsDialogVisible = {setViewDetailsDialogVisible} setEnterDetailsDialogVisible = {setEnterDetailsDialogVisible} data = {hotspots.find(obj => obj.id === hotspotIndex)} />)
            }
        </div>;
        </div>
      )}

    </div>
  );
};

export default SidebarWidget;






