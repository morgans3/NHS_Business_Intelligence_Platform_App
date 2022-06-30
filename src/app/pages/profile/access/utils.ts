export const reverseFormat = (data) => {
    // Get all parents
    const permissions = data.reduce((list, item) => {
        if(item.parent == null) {
            list[item.id] = {
                id: item.id,
                ...(item.valuejson && {valuejson: item.valuejson})
            };
        }
        return list;
    }, {});
    console.log(permissions);

    // Add children
    data.forEach(item => {
        if(item.parent && item.parent !== null) {
            if(!permissions[item.parent].meta) {
                permissions[item.parent].meta = {
                    children: [{
                        id: item.id, valuejson: [item.valuejson]
                    }]
                }
            } else {
                // eslint-disable-next-line eqeqeq
                const index = permissions[item.parent].meta.children.findIndex((x) => x.id == item.id);
                if(index >= 0) {
                    permissions[item.parent].meta.children[index].valuejson.push(item.valuejson);
                } else {
                    permissions[item.parent].meta.children.push({
                        id: item.id, valuejson: [item.valuejson]
                    })
                }
            }
        }
    });
    return Object.values(permissions);
}

export const arraysMatch = (arr1, arr2) => {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;
};


export const getChanges = (original, updated) => {
    const result = { edited: [], deleted: [] };
    updated.forEach((updatedItem) => {
        const oldItemIndex = original.findIndex((oldItem) => oldItem.id === updatedItem.id);
        if(oldItemIndex >= 0) {
            // Has value json?
            if(updatedItem.valuejson) {
                // Check valuejson
                if(typeof original[oldItemIndex].valuejson === "string") {
                    if(!(original[oldItemIndex].valuejson === updatedItem.valuejson)) {
                        result.edited.push(updatedItem);
                    }
                } else {
                    if(!arraysMatch(original[oldItemIndex].valuejson, updatedItem.valuejson)) {
                        result.edited.push(updatedItem);
                    }
                }


                // Check for children
                if(updatedItem?.meta?.children) {
                    const childrenEdited = getChanges(original[oldItemIndex].meta.children, updatedItem.meta.children);
                    if(childrenEdited.edited.length > 0) {
                        updatedItem.meta.children = childrenEdited.edited;
                        result.edited.push(updatedItem);
                    }
                }
            }
        } else {
            result.edited.push(updatedItem);
        }
    });

    // Find deleted
    original.forEach((oldItem) => {
        const updatedItemIndex = updated.findIndex((updatedItem) =>  updatedItem.id === oldItem.id);
        if(updatedItemIndex < 0) {
            result.deleted.push(oldItem);
        }
    });
    return result;
}