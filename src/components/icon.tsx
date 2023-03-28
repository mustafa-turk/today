import Feather from "@expo/vector-icons/Feather";

type IconProps = {
  color: string,
  size: number
}

export const PlusIcon = (props: IconProps) => <Feather {...props} name='plus' />;
export const ArrowLeft = (props: IconProps) => <Feather {...props} name='chevron-left' />;
export const ArrowRight = (props: IconProps) => <Feather {...props} name='chevron-right' />;
