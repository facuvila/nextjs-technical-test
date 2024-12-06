'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function SortingDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || 'relevant'

  // useCallback permite recibir un resultado memorizado de una solicitud previa, que se actualiza únicamente ante un cambio en alguna de sus dependencias ([searchParams])
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      // Page es seteada a 1 tras el cambio en el orden seleccionado para una mejor experiencia (El ususario ve los primeros resultados)
      params.set('page', '1')
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="flex items-center justify-end space-x-2 w-full sm:w-auto">
      <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
      <select
        id="sort"
        value={sort}
        onChange={(e) => {
          router.push(`/dashboard?${createQueryString('sort', e.target.value)}`)
        }}
        className="select select-bordered select-sm w-full sm:w-auto"
      >
        <option value="relevant">Most relevant</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  )
}