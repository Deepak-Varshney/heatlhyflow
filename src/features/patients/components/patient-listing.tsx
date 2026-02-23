import { ServerDataTable } from '@/features/products/components/product-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './columns';
import { getPatients } from '@/app/actions/patient-actions';
import type { IPatient } from '@/types/patient';

type PatientListingPage = {};

export default async function PatientListingPage({ }: PatientListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');
  const phone = searchParamsCache.get('phone')
  const address = searchParamsCache.get('address')

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await getPatients({
      page,
      limit: pageLimit,
      ...(search && { search }),
      ...(categories && { categories: categories }),
      ...(phone && { phone }),
      ...(address && { address })
  });
  const totalpatients = data.total;
  const patients: IPatient[] = data.data;

  return (
    <>
      <ServerDataTable
        data={patients}
        totalItems={totalpatients}
        columns={columns}
      />
    </>
  );
}
