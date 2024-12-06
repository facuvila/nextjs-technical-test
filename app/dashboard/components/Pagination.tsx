'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'


interface PaginationProps {
    currentPage: number
    totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Modificación de la URL
    const createQueryString = useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams)
            params.set('page', page.toString())

            // Se mantienen todos los otros parámetros de búsqueda
            const existingParams = Array.from(searchParams.entries())
            existingParams.forEach(([key, value]) => {
                if (key !== 'page') {
                    params.set(key, value)
                }
            })

            return params.toString()
        },
        [searchParams]
    )

    const handlePageChange = (page: number) => {
        router.replace(`/dashboard?${createQueryString(page)}`, {
            scroll: false,
        })
    }

    return (
        <div className="flex justify-center items-center gap-2 flex-wrap">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="btn btn-primary btn-sm"
            >
                Previous
            </button>

            <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="btn btn-primary btn-sm"
            >
                Next
            </button>
        </div>
    )
}