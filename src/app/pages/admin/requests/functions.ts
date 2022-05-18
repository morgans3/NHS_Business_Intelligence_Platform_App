export const getValueByKey = (key, item) => {
    key = key.split("|");
    if (key[1]) {
        return helper.fn(key[0], item);
    } else {
        return ((s, o) => {
            s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
            s = s.replace(/^\./, ""); // strip a leading dot
            const a = s.split(".");
            for (let i = 0, n = a.length; i < n; ++i) {
                const k = a[i];
                if (k in o) {
                    o = o[k];
                } else {
                    return;
                }
            }
            return o;
        })(key[0], item);
    }
};

class helper {
    static fn = (key, item) => {
        return "`" + (key as string) + "`";
    };
}
