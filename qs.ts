import * as qs from 'qs';

const parsed = qs.parse('count=20&skip=40&foo=bar&date:lte=200&date:gte=20&role:exists=true&categories=cooking&categories=cars&roles:includes=admin');
const { count, skip } = parsed;
const pageFilter = (obj: any) => {
    delete obj['count'];
    delete obj['skip'];

    return obj;
}
const filters = pageFilter(parsed);

console.log(count, skip, filters);