// Definición de producto
interface Product {
  id: number
  name: string
  description: string
  price: number
}

export function ProductsList({ products }: { products: Product[] }) {
  return (
    <div className="w-full">
      <ul className="menu bg-base-200 w-full rounded-box">
        {products.map((product) => (
          <li key={product.id} className="border-b border-base-300 last:border-b-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-base-300 transition-colors duration-200">
              <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                <h3 className="text-base sm:text-lg font-semibold text-base-content truncate">{product.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-base-content/70 line-clamp-2">{product.description}</p>
              </div>
              <div className="sm:ml-4">
                <span className="text-base sm:text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/*  De no coincidir ningún producto de la base de datos con la búsqueda realizada, se indica al usuario. */}
      {products.length === 0 && (
        <div className="text-center py-10">
          <div className="text-lg sm:text-xl font-semibold text-base-content/70">No products found</div>
        </div>
      )}
    </div>
  )
}
