import { PropsWithChildren, forwardRef } from "react";
import { Button, Box, Flex, useRadio, useRadioGroup } from "@chakra-ui/react";
import { Control, useController } from "react-hook-form";
import { z } from "zod";

import {  accountSchema } from "../../../server/types";

const CustomRadio = forwardRef(
  ({ children, ...props }: PropsWithChildren, ref) => {
    const { state, getInputProps, getCheckboxProps } = useRadio(props);
    const input = getInputProps({ ref });
    const checkbox = getCheckboxProps();

    return (
      <Box as="label" p={1}>
        <input {...input} />
        <Button
          as="div"
          {...checkbox}
          cursor="pointer"
          colorScheme={state.isChecked ? "blue" : "gray"}
          fontSize="xs"
        >
          {children}
        </Button>
      </Box>
    );
  }
);

// https://react-hook-form.com/ts
type InputProps = {
  control: Control<z.infer<typeof accountSchema>>;
  name: keyof z.infer<typeof accountSchema>;
};

export const AccountTypeRadios = ({ name, control }: InputProps) => {
  const { field } = useController({
    control,
    name,
  });

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
  });

  return (
    <Flex {...getRootProps()} justifyContent="center">
      <CustomRadio {...getRadioProps({ value: "INCOME" })}>INCOME</CustomRadio>
      <CustomRadio {...getRadioProps({ value: "EXPENSE" })}>
        EXPENSE
      </CustomRadio>
      <CustomRadio {...getRadioProps({ value: "ASSET" })}>ASSET</CustomRadio>
      <CustomRadio {...getRadioProps({ value: "LIABILITY" })}>
        LIABILITY
      </CustomRadio>
    </Flex>
  );
};
