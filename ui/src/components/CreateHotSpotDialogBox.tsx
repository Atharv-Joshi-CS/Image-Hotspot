import React, { useState } from 'react';
import { TypeHotspot } from '../common/types';
import { Button, FieldLabel, TextInput, Textarea } from '@contentstack/venus-components';

const CreateHotSpotDialogBox = function({getValue, hotspotIndex, hotspots, isEdit, hotspotCoords, setEnterDetailsDialogVisible, setHotspots, globalTitle, globalDescription} : {getValue : any, hotspotIndex : number, hotspots : TypeHotspot[], isEdit : boolean, hotspotCoords : {x: number,y: number}, setEnterDetailsDialogVisible : React.Dispatch<React.SetStateAction<boolean>>, globalTitle : string, globalDescription : string,  setHotspots : React.Dispatch<React.SetStateAction<TypeHotspot[]>>}){
  const [title, setTitle] = useState(globalTitle);
  const [description, setDescription] = useState(globalDescription);

  const onTitleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  const onDescriptionChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }
 
  const handleSave = () => {
    setHotspots((prevHotspots : TypeHotspot[]) => [
      ...prevHotspots,
      {
        id: hotspotCoords.x,
        x: hotspotCoords.x,
        y: hotspotCoords.y,
        content: {
          title,description
        },
      },
    ]);
    getValue(hotspots);
    setEnterDetailsDialogVisible(false);
  }

  const handleEdit = () => {
    const temp = hotspots;
    const index = temp.findIndex((obj : TypeHotspot) => obj.id === hotspotIndex);
    
    temp[index].content.title = title;
    temp[index].content.description = description;
    setHotspots(temp);
    getValue(hotspots)
    setEnterDetailsDialogVisible(false);
  }

  const closeDialogBox = () => {
    setEnterDetailsDialogVisible(false);
  }

  return (
    <div className='enter-details-wrapper'>
      <Button className='exit-btn' onClick={closeDialogBox}>X</Button>
      <FieldLabel htmlFor="title" className='label'>Title :</FieldLabel>
      <TextInput autoFocus = {true} type = "string" placeholder = "Enter Title" value={title} onChange={onTitleChange}/>
      <FieldLabel htmlFor="description" className='label'>Description :</FieldLabel>
      <Textarea  placeholder = "Enter Description" value={description} onChange={onDescriptionChange}/>
      <Button onClick={isEdit ? handleEdit : handleSave}>{isEdit === true ? 'Update' : 'Save'}</Button>
    </div>
  );
}

export default CreateHotSpotDialogBox;