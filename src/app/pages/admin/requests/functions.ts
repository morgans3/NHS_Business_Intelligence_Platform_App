export function getValueByKey(key, item) {
    key = key.split('|');
    if (key[1]) {
        return new Function('return `' + key[0] + '`').call({ item: item });
    } else {
        return ((s, o) => {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, '');           // strip a leading dot
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in o) {
                    o = o[k];
                } else {
                    return;
                }
            }
            return o;
        })(key[0], item);
    }
}