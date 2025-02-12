import type { TextInputProps } from '@patternfly/react-core'

export interface FieldGroupProps {
  name: string;
  value: string;
  label: string;
  children?: React.ReactNode;
  legend?: string;
  checked?: boolean;
  hint?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  inputType?: TextInputProps['type'];
  isDefaultValue?: boolean;
  onChange?: (value: string, event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

export interface FieldCatalogProps {
  catalog: Record<string, string>;
}

export interface TypeItemProps {
  type: FieldCatalogProps & FieldGroupProps;
  item: FieldGroupProps;
}

export interface LegendCollectionProps {
  legend: string;
  collection: FieldGroupProps[];
}
