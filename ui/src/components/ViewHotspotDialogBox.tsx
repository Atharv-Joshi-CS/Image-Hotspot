import React from 'react';
import { Button, FieldLabel, Icon, TextInput, Textarea } from '@contentstack/venus-components';
import { TypeHotspot } from '../common/types';
const ViewHotSpotDialogBox = function({setIsEdit, hotspotIndex, hotspots, setHotspots, setDescription, setTitle, setViewDetailsDialogVisible, setEnterDetailsDialogVisible,  data} : {setIsEdit : any, hotspotIndex : any, hotspots : any, setHotspots : any, setDescription : any, setTitle : any, setViewDetailsDialogVisible : any, setEnterDetailsDialogVisible : any, data : any}){

  const handleExit = () => {
    setViewDetailsDialogVisible(false);
  }

  const handleEdit = () => {
    setTitle(data.content.title);
    setDescription(data.content.description);
    setIsEdit(true);
    setEnterDetailsDialogVisible(true);
    setViewDetailsDialogVisible(false);
  }

  const handleDelete = () => {
    let temp = hotspots;
    const index = temp.findIndex((obj : TypeHotspot) => obj.id === hotspotIndex);
    console.log(index);
    
    temp.splice(index, 1);
    setHotspots(temp);
    setViewDetailsDialogVisible(false)
  }
  
  return (
    <div className='view-details-wrapper' style={{left: data.x, top: data.y}}>
      <div className="row">
        <Button className='exit-btn' onClick={handleExit}>X</Button>
        <Icon hover active onClick={handleEdit} icon="Edit"/>
        <Icon hover active onClick={handleDelete} icon="Delete"/>
      </div>
      <FieldLabel htmlFor="title" className='label'>Title :</FieldLabel>
      <TextInput disabled = {true} type = "string" value={data.content.title}/>
      <FieldLabel htmlFor="description" className='label'>Description :</FieldLabel>
      <Textarea disabled = {true} type = "string" value={data.content.description}/>
    </div>
  );
};


export default ViewHotSpotDialogBox;