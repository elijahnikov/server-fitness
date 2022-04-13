import DataLoader from "dataloader";
import { Group } from "../entities/groupEntity";

export const groupLoader = () => new DataLoader<number, Group>(async (groupIds) => {
    const groups = await Group.findByIds(groupIds as number[])
    const groupIdToGroup: Record<number, Group> = {};
    groups.forEach(g => {
        groupIdToGroup[g.id] = g;
    })
    return groupIds.map((groupId) => groupIdToGroup[groupId])
})