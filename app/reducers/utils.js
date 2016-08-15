export function addOrRemove (object, list, comparator) {
    if (list.find(comparator)) {
        list = remove(list, it => !comparator(it));
    } else {
        list.push(object);
    }
    return list;
}

export function remove (list, comparator) {
    return list.filter(comparator);
}