/* Import React modules */
import React, { useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { FieldLabel, TextInput } from "@contentstack/venus-components";
import { TypeSDKData } from "../../common/types";
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";

/* To add any labels / captions for fields or any inputs, use common/local/en-us/index.ts */

const CustomField: React.FC = function () {
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });

  const [value, setValue] = useState("");

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const config = await appSdk?.getConfig();
        const initialData = appSdk?.location?.CustomField?.field?.getData();
        if (initialData?.name && Object.keys(initialData.name).length !== 0) {
          setValue(initialData?.name);
        }
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

  useEffect(() => {
    state?.location?.CustomField?.field?.setData({ name: value });
  }, [value]);

  /* Handle your UI as per requirement. State variable will hold
  the configuration details from the appSdk. */

  const handleData = (event: any) => {
    setValue(event.target.value);
  };

  return (
    <div className="layout-container">
      {state.appSdkInitialized && (
        // <>
        //   Your Custom Field must be developed here based on the state variable
        //   {`Your current state is ${JSON.stringify(state)}`}
        // </>
        <>
          <FieldLabel htmlFor={state?.config?.configField1} className="field">
            {state.config.configField1}
          </FieldLabel>
          <div className="field-wrapper">
            <FieldLabel htmlFor={state?.config?.name} className="field">
              Name
            </FieldLabel>
            <TextInput
              className="field"
              maxLength={50}
              value={value}
              width="large"
              placeholder="Enter your Name"
              onChange={handleData}
              name="name"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CustomField;
