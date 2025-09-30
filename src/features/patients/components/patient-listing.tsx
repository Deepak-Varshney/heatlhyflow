import { ServerDataTable } from '@/features/products/components/product-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './columns';
import { getPatients } from '@/utilties/patients';

type PatientListingPage = {};

export default async function PatientListingPage({}: PatientListingPage) {
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

  const data = await getPatients(filters);
  const totalpatients = data.totalPatients;
  const patients: any[] = data.patients;

  return (
    <ServerDataTable
      data={patients}
      totalItems={totalpatients}
      columns={columns}
    />
  );
}
