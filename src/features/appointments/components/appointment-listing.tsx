import { ServerDataTable } from '@/features/products/components/product-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './columns';
import { getAllAppointments } from '@/utilties/appointments';

type AppointmentListingPage = {};

export default async function AppointmentListingPage({ }: AppointmentListingPage) {
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

    const data = await getAllAppointments();
    return (
        <ServerDataTable
            data={data}
            totalItems={data.length}
            columns={columns}
        />
    );
}
