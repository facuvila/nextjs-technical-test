'use client'

import { supabase } from '@/libs/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { useDebounce } from 'use-debounce'

export function SearchBar({ defaultValue = '' }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState([])
  
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      const currentValue = searchParams.get(name)
      
      if (name === 'search' && currentValue !== value) {
       // Page es seteada a 1 tras el cambio en la búsqueda para una mejor experiencia (El ususario ve los primeros resultados)
        params.set('page', '1')
      }
      
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    startTransition(() => {
      router.push(`/dashboard?${createQueryString('search', debouncedSearchTerm)}`)
    })

    // Solicitud a Supabase de términos de búsqueda sugeridos, estos en un futuro podrían pertenecer a una tabla independiente de los productos: "suggestedSearchTerms" (Quiero que mi usuario pueda buscar "iPhone 16", aún no lo tuvieramos en nuestro catálogo)
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length > 0) {
        const { data, error } = await supabase
          .from('products')
          .select('name')
          .ilike('name', `%${debouncedSearchTerm}%`)
          .limit(5)

        if (error) {
          console.error('Error fetching suggestions:', error)
        } else {
          setSuggestions(data.map(product => product.name))
        }
      } else {
        setSuggestions([])
      }
    }

    fetchSuggestions()
  }, [debouncedSearchTerm, router, createQueryString, supabase])

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion)
    setSuggestions([])
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="input input-bordered w-full pr-10"
      />
      {isPending && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}