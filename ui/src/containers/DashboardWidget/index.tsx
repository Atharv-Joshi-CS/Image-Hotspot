/* Import React modules */
import React, { useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { FieldLabel } from "@contentstack/venus-components";
import { TypeSDKData } from "../../common/types";

/* Import our modules */
// import { getDataFromAPI } from '../../services'; //If no services are required, this can be removed
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";

/* To add any labels / captions for fields or any inputs, use common/local/en-us/index.ts */

const DashboardWidget: React.FC = function () {
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const config = await appSdk.getConfig();
        appSdk?.location?.DashboardWidget?.frame?.enableAutoResizing?.();
        setState({
          config,
          location: appSdk.location,
          appSdkInitialized: true,
        });
      })
      .catch((error) => {
        console.error("appSdk initialization error", error);
      });
  }, []);

  /* Handle your UI as per requirement. State variable will hold
  the configuration details from the appSdk. */

  return (
    <div className="layout-container">
      {state.appSdkInitialized && (
        // <>
        //   Your dashboard UI must be developed here based on the state variable
        //   {`Your current state is ${JSON.stringify(state)}`}
        // </>
        <FieldLabel
          htmlFor={state?.config?.configField1}
          className="Dashboard-field"
        >
          {state.config.configField1}
        </FieldLabel>
      )}
    </div>
  );
};

export default DashboardWidget;
