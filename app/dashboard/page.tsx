import { ProductsList } from './components/ProductsList'
import { Pagination } from './components/Pagination'
import { SearchBar } from './components/SearchBar'
import { Filters } from './components/Filters'
import { SortingDropdown } from './components/Sorting'
import { getProducts } from '@/libs/actions/products'

export const dynamic = 'force-dynamic'

// Definición de los posibles parámetros presentes en la URL
export interface SearchParams {
  search?: string
  page?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Número de resultados por página
  const perPage = 5

  const { products, totalCount } = await getProducts(searchParams, perPage)
  const currentPage = parseInt(searchParams.page || '1')
  const totalPages = Math.ceil(totalCount / perPage)

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/4 order-2 lg:order-1">
        <Filters />
      </div>
      <div className="lg:w-3/4 space-y-6 order-1 lg:order-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Products list</h1>
        <SearchBar defaultValue={searchParams.search || ''} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-sm text-gray-600">Showing {products.length} of {totalCount} products</p>
          <SortingDropdown />
        </div>
        <ProductsList products={products} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          {...searchParams}
        />
      </div>
    </div>
  )
}