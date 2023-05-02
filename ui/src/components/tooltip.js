
import { useState } from "react";
import { Button, Tooltip } from "@contentstack/venus-components";


const ToolTip = (props) => {
    const [showTooltip, setShowTooltip] = useState(true);
    const handleClose = () => {
        setShowTooltip(false)
        props.handleClose()
    }

    const handleEdit=()=>{
        setShowTooltip(false)
        props.handleEdit(props.data)
    }

    return (
        <div style={{ position: "absolute", top: props.data.pageY+'%', left: props.data.pageX+'%' }}>
            <Tooltip
                content={
                    <div style={{ width: 280 }}>
                        <div style={{ fontSize: 14, maxWidth: 240, lineHeight: '20px' }}>
                            <h6>Title</h6>
                            <p>{props.data.title}</p>
                        </div>
                        <div style={{ fontSize: 14, maxWidth: 240, lineHeight: '20px' }}>
                            <h6>Description</h6>
                            <p>{props.data.description}</p>
                        </div>
                        <div style={{ fontSize: 14, maxWidth: 240, lineHeight: '20px' }}>
                            <h6>Url</h6>
                            <p>{props.data.url}</p>
                        </div>
                        {props?.data?.product?.title &&
                        <div style={{ fontSize: 14, maxWidth: 240, lineHeight: '20px' }}>
                            <h6>Product</h6>
                            <p>{props.data.product.title}</p>
                        </div>}
                        <Button onClick={handleEdit}>Edit</Button>
                    </div>
                }
                position="bottom"
                showArrow={true}
                variantType="light"
                type="secondary"
                visible={showTooltip}
                showClose={true}
                onClose={() => handleClose()}
            >
            </Tooltip>
        </div>
    );
}

export default ToolTip