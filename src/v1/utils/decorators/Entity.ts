export function Entity(options: {
    table_name?: string
}){
    return (target: any, key: any) => {
        target._table_name = options.table_name || target.name;
    }
}