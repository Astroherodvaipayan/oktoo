export interface InteractiveSheetProperties {
  open: boolean;
  setOpen: (newValue: boolean) => void;
}

export interface GlobalAppToken {
  name: string;
  symbol: string;
  description: string;
  address: string;
  image: string;
}
