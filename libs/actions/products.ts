import { supabase } from "../supabase/client"
import { SearchParams } from "@/app/dashboard/page"

export async function getProducts(params: SearchParams, perPage: number = 5) {
    // Extracción los parámetros de la URL mediante el objecto params proveído por Next
    const page = parseInt(params.page || '1')
    const search = params.search || ''
    const minPrice = parseFloat(params.minPrice || '0')
    const maxPrice = parseFloat(params.maxPrice || '1000')
    const sort = params.sort || 'relevant'
    
  
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .gte('price', minPrice)
      .lte('price', maxPrice)
    
    // Búsqueda por similitud de parámetros "name" o "description"
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
  
    // Queries para el orden de los resultados
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      default:
        query = query.order('id', { ascending: true })
    }
  
    // Selección de resultados paginados mediante query.range de Supabase
    const start = (page - 1) * perPage
    
    // Supabase no sólo devuelve los resultados sino la cantidad total de elementos que satisfacen la búsqueda.
    const { data, count, error } = await query
      .range(start, start + perPage - 1)
    
    if (error) {
      console.error('Error fetching products:', error)
      return { products: [], totalCount: 0 }
    }
    
    return {
      products: data, 
      totalCount: count ?? 0 
    }
  }