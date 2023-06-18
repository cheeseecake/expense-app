import { Editable, EditablePreview, EditableTextarea } from "@chakra-ui/react";

type InputProps = {
  value: string | number;
  setValue: (val: string) => void;
};

export const EditableField = ({ value, setValue }: InputProps) => {
  return (
    <Editable value={value} onChange={setValue} submitOnBlur>
      <EditablePreview />
      <EditableTextarea />
    </Editable>
  );
};
