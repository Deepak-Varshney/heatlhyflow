
import { columns } from '@/features/patients/components/columns';
import { ServerDataTable } from '@/features/products/components/product-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { getPatients } from '@/utilties/patients';
import { getAllUsers } from '../components/utils';

type PatientListingPage = {};

export default async function PatientListingPage({ }: PatientListingPage) {
    // Showcasing the use of search params cache in nested RSCs
    const page = searchParamsCache.get('page');
    const search = searchParamsCache.get('name');
    const pageLimit = searchParamsCache.get('perPage');
    const categories = searchParamsCache.get('category');

    const filters = {
        page,
        limit: pageLimit,
        ...(search && { search }),
        ...(categories && { categories: categories })
    };

    const data = await getAllUsers();
    const totalpatients = data.length;
    const patients: any[] = data;

    return (
        <ServerDataTable
            data={patients}
            totalItems={totalpatients}
            columns={columns}
        />
    );
}
