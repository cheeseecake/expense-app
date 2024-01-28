import { forwardRef } from "react";
import { Button, Box, Flex, useRadio, useRadioGroup } from "@chakra-ui/react";
import { useController } from "react-hook-form";

const CustomRadio = forwardRef(({ children, ...props }, ref) => {
  const { state, getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps({ ref });
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" mx="1">
      <input {...input} />
      <Button
        as="div"
        {...checkbox}
        cursor="pointer"
        colorScheme={state.isChecked ? "blue" : "gray"}
      >
        {children}
      </Button>
    </Box>
  );
});

export const AccountTypeRadios = forwardRef(
  ({ control, name, defaultValue, ...props }, ref) => {
    const { field } = useController({
      name,
      control,
      rules: { required: "Toggle is required" },
      defaultValue,
    });

    const { getRootProps, getRadioProps } = useRadioGroup({
      ...field,
    });

    return (
      <Flex {...getRootProps()}>
        <CustomRadio {...getRadioProps({ value: "1" })}>ASSET</CustomRadio>
        <CustomRadio {...getRadioProps({ value: "2" })}>LIABILITY</CustomRadio>
        <CustomRadio {...getRadioProps({ value: "3" })}>INCOME</CustomRadio>
        <CustomRadio {...getRadioProps({ value: "4" })}>EXPENSE</CustomRadio>
      </Flex>
    );
  }
);
