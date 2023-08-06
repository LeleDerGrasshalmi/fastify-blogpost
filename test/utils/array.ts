export const filterArray = <TElement extends object>(arr: TElement[], filter: Partial<TElement>) => {
    const filteredKeys = (Object.keys(filter) as (keyof TElement)[]).filter((k) => filter[k]);

    return arr.filter((element) => {
        for (const k of filteredKeys) {
            if (element[k] !== filter[k]) {
                return false;
            }
        }

        return true;
    });
};
