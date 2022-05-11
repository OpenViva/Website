import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { AssetCategory, AssetSubcategory } from "../../../types/api";
import { CARD_HEIGHT, CARD_WIDTH, extractCharacterMetadata, extractClothingMetadata, subcategoryNames } from "../../../server/helpers/cardUtils";
import useRecaptcha from "../../hooks/useRecaptcha";
import useAsyncCallback from "../../hooks/useAsyncCallback";
import useOpen from "../../hooks/useOpen";
import requestJSON from "../../helpers/requestJSON";
import useObjectURL from "../../hooks/useObjectURL";
import Button from "../Button";
import Field from "../Field";
import RadioButton from "../RadioButton";
import Modal, { ModalProps } from "./Modal";
import "./UploadModal.scss";

export default function UploadModal(props: ModalProps) {
  const { open, onOpen, onClose } = useOpen();
  const { recaptcha, loading: recaptchaLoading } = useRecaptcha(open);
  const [category, setCategory] = useState(AssetCategory.CHARACTER);
  const [subcategory, setSubcategory] = useState<AssetSubcategory | null>(null);
  
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
    if(recaptcha) {
      data.append("recaptchaToken", await recaptcha.execute());
    }
    
    await requestJSON<any, FormData>({
      url: "/api/assets",
      method: "POST",
      data,
    });
    
    toast.success("Your asset has been uploaded. It will become listed on the website after moderator approval.");
    
    onClose();
  }, [onClose]);
  
  const onClothingChange = useCallback(async (img: HTMLImageElement, input: HTMLInputElement) => {
    function throwError() {
      toast.error("Invalid Image. Make sure you are uploading full size card image.");
      input.value = "";
      return;
    }
    
    if(img.naturalWidth !== CARD_WIDTH) return throwError();
    if(img.naturalHeight !== CARD_HEIGHT) return throwError();
    
    try {
      const { subcategory } = extractClothingMetadata(img);
      
      setSubcategory(subcategory);
    } catch(e) {
      console.error(e);
      return throwError();
    }
  }, []);
  
  const onCharacterChange = useCallback(async (img: HTMLImageElement, input: HTMLInputElement) => {
    function throwError() {
      toast.error("Invalid Card. Make sure you are uploading full size card image of correct type.");
      input.value = "";
      return;
    }
    
    if(img.naturalWidth !== CARD_WIDTH) return throwError();
    if(img.naturalHeight !== CARD_HEIGHT) return throwError();
    
    try {
      extractCharacterMetadata(img);
    } catch(e) {
      console.error(e);
      return throwError();
    }
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
      <Field label="Subcategory" className="subcategory" fluid disabled>{subcategoryNames[subcategory || AssetSubcategory.UNKNOWN]}</Field>
    </>; // eslint-disable-line react/jsx-closing-tag-location
  }
  
  return (
    <Modal className="UploadModal" open={open} onOpen={onOpen} onClose={onClose} {...props}>
      <form onSubmit={onSubmit}>
        <h3>Upload New Content</h3>
        <Field label="Name" name="name" placeholder="Name" required fluid maxLength={32} />
        <Field as="textarea" label="Description" name="description" placeholder="Description..." fluid maxLength={512} />
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
          <Button primary loading={loading || recaptchaLoading}>Upload</Button>
        </div>
      </form>
    </Modal>
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
