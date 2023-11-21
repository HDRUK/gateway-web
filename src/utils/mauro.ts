import { MauroItem } from "@/interfaces/Dataset";

const getMauroValue = (key: string, mauro?: MauroItem[]) => {
    const foundItem = mauro?.find(item => item.key === key);
    return foundItem?.value;
};

export { getMauroValue };
