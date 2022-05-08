import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { AssetCategory } from "../../../types/api";
import { CARD_HEIGHT, CARD_MAX_BYTES, CARD_WIDTH, extractCharacterMetadata, extractClothingMetadata, Subcategory, subcategoryNames } from "../../../server/helpers/cardUtils";
import useAsyncCallback from "../../hooks/useAsyncCallback";
import useOpen from "../../hooks/useOpen";
import requestJSON from "../../helpers/requestJSON";
import { classJoin } from "../../helpers/utils";
import useObjectURL from "../../hooks/useObjectURL";
import Button from "../Button";
import Field from "../Field";
import Modal, { ModalProps } from "./Modal";
import "./UploadModal.scss";

export default function UploadModal(props: ModalProps) {
  const { open, onOpen, onClose } = useOpen();
  const [category, setCategory] = useState(AssetCategory.CHARACTER);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  
  const onCategoryChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(ev.currentTarget.value as AssetCategory);
    setSubcategory(null);
  }, []);
  
  const [onSubmit, loading] = useAsyncCallback(async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    
    if(!ev.currentTarget.checkValidity()) {
      ev.currentTarget.reportValidity();
      return;
    }
    
    const data = new FormData(ev.currentTarget);
    await requestJSON<any, FormData>({
      url: "/api/assets",
      method: "POST",
      data,
    });
    
    onClose();
  }, [onClose]);
  
  const onClothingChange = useCallback(async (img: HTMLImageElement, input: HTMLInputElement) => {
    function throwError() {
      toast.error("Invalid Image. Make sure you are uploading full size card image.");
      input.value = "";
      throw new Error("Invalid Image");
    }
    
    if(img.naturalWidth !== CARD_WIDTH) throwError();
    if(img.naturalHeight !== CARD_HEIGHT) throwError();
    
    const data = extractClothingMetadata(img);
    const decoder = new TextDecoder("utf-8");
    
    let pos = 0;
    if(data[pos] !== 1) throwError();
    pos++;
    
    if(data[pos] !== 0) throwError();
    pos++;
    
    const pieceLength = data[pos];
    pos++;
    
    if(pos + pieceLength > data.length) throwError();
    const pieceName = decoder.decode(data.slice(pos, pos + pieceLength));
    
    pos += pieceLength;
    const textureLength = data[pos];
    
    pos++;
    if(pos + textureLength > data.length) throwError();
    const textureName = decoder.decode(data.slice(pos, pos + textureLength));
    
    const subcategory = Object.values(Subcategory).includes(pieceName as Subcategory) ? pieceName : Subcategory.UNKNOWN;
    setSubcategory(subcategory as Subcategory);
  }, []);
  
  const onCharacterChange = useCallback(async (img: HTMLImageElement, input: HTMLInputElement) => {
    function throwError() {
      toast.error("Invalid Card. Make sure you are uploading full size card image of correct type.");
      input.value = "";
      throw new Error("Invalid Image");
    }
    
    if(img.naturalWidth !== CARD_WIDTH) throwError();
    if(img.naturalHeight !== CARD_HEIGHT) throwError();
    
    const data = extractCharacterMetadata(img);
    
    const payloadLength = data[0]
                        + data[1] * 256
                        + data[2] * 256 * 256
                        + data[3] * 256 * 256 * 256;
    
    console.log(payloadLength, CARD_MAX_BYTES);
    if(payloadLength > CARD_MAX_BYTES) throwError();
  }, []);
  
  let fileInputs;
  if(category === AssetCategory.CHARACTER) {
    fileInputs = <>
      <Field as={ImageInput} label="Character Card" name="character" required fluid type="file" accept="image/png" onImageLoad={onCharacterChange} />
      <Field as={ImageInput} label="Skin Card" name="skin" required fluid type="file" accept="image/png" onImageLoad={onCharacterChange} />
    </>; // eslint-disable-line react/jsx-closing-tag-location
  } else {
    fileInputs = <>
      <Field as={ImageInput} label="Clothing Card" name="clothing" required fluid accept="image/png" onImageLoad={onClothingChange} />
      <Field label="Subcategory" fluid disabled>{subcategoryNames[subcategory || Subcategory.UNKNOWN]}</Field>
    </>; // eslint-disable-line react/jsx-closing-tag-location
  }
  
  return (
    <Modal className="UploadModal" open={open} onOpen={onOpen} onClose={onClose} {...props}>
      <form onSubmit={onSubmit}>
        <h3>Upload New Content</h3>
        <Field label="Name" name="name" placeholder="Name" required fluid max={50} />
        <Field as="textarea" label="Description" name="description" placeholder="Description..." fluid max={2048} />
        <Field label="Category">
          <RadioButton id="UploadModalCharacter" name="category"
                       value={AssetCategory.CHARACTER} text="Character"
                       active={category === AssetCategory.CHARACTER}
                       onChange={onCategoryChange}  />
          <RadioButton id="UploadModalClothing" name="category"
                       value={AssetCategory.CLOTHING} text="Clothing"
                       active={category === AssetCategory.CLOTHING}
                       onChange={onCategoryChange}  />
        </Field>
        {fileInputs}
        <div className="actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary loading={loading}>Upload</Button>
        </div>
      </form>
    </Modal>
  );
}

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  text: string;
  active: boolean;
  onChange: React.ChangeEventHandler;
}

function RadioButton({ id, name, value, text, active, onChange }: RadioButtonProps) {
  return (
    <div className={classJoin("radioBox", active && "active")}>
      <input type="radio" id={id} name={name} checked={active}
             value={value} onChange={onChange} />
      <label htmlFor={id}>{text}</label>
    </div>
  );
}

interface ImageInputProps extends React.ComponentProps<"input"> {
  onImageLoad?: (image: HTMLImageElement, input: HTMLInputElement) => void;
}

function ImageInput({ onImageLoad, onChange, ...rest }: ImageInputProps) {
  const createObjectURL = useObjectURL();
  
  const onInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    if(!ev.currentTarget.files || ev.currentTarget.files.length === 0 || !onImageLoad) return;
    
    const url = createObjectURL(ev.currentTarget.files[0]);
    const input = ev.currentTarget;
    const img = new Image();
    img.onload = () => {
      onImageLoad(img, input);
    };
    img.src = url;
    
    if(onChange) onChange(ev);
  }, [createObjectURL, onChange, onImageLoad]);
  
  return <input type="file" onChange={onInputChange} {...rest} />;
}
