'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { DualHRangeBar } from 'dual-range-bar'

export function Filters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '0')
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '1000')
    const rangeBarRef = useRef<HTMLDivElement>(null)
    const dualRangeBarRef = useRef<DualHRangeBar | null>(null)

    const [debouncedMin] = useDebounce(minPrice, 300)
    const [debouncedMax] = useDebounce(maxPrice, 300)

    const createQueryString = useCallback(
        (updates: Record<string, string>) => {
            const params = new URLSearchParams(searchParams)
            params.set('page', '1') // Reset page
            Object.entries(updates).forEach(([name, value]) => {
                params.set(name, value)
            })
            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {
        router.push(`/dashboard?${createQueryString({ minPrice: debouncedMin, maxPrice: debouncedMax })}`)
    }, [debouncedMin, debouncedMax, router, createQueryString])

    useEffect(() => {
        if (rangeBarRef.current && !dualRangeBarRef.current) {
            // No logré modificar los colors del RangeBar, es un paquete específico para poder utilizar dichos sliders. Con algo más de tiempo se resuelve.
            dualRangeBarRef.current = new DualHRangeBar(rangeBarRef.current, {
                lowerBound: 0,
                upperBound: 1000,
                lower: parseInt(minPrice),
                upper: parseInt(maxPrice),
            })

            dualRangeBarRef.current.addEventListener('update', (e: CustomEvent) => {
                setMinPrice(Math.round(e.detail.lower).toString())
                setMaxPrice(Math.round(e.detail.upper).toString())
            })
        }

        return () => {
            if (dualRangeBarRef.current) {
                dualRangeBarRef.current.removeEventListener('update', () => { })
            }
        }
    }, [minPrice, maxPrice])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
        const value = e.target.value
        if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 1000)) {
            setter(value)
            if (dualRangeBarRef.current) {
                if (setter === setMinPrice) {
                    dualRangeBarRef.current.lower = parseInt(value) || 0
                } else {
                    dualRangeBarRef.current.upper = parseInt(value) || 1000
                }
            }
        }
    }

    return (
        <div className="bg-base-100 rounded-lg shadow p-4 sm:p-6">
            <h3 className="font-medium mb-3 text-lg">Price filter</h3>
            <div className="space-y-4">
                <div
                    ref={rangeBarRef}
                    className="w-full h-2 bg-primary rounded relative"
                >
                    <div className="absolute left-0 h-full bg-secondary rounded" style={{ width: '50%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <input
                            type="text"
                            value={minPrice}
                            onChange={(e) => handleInputChange(e, setMinPrice)}
                            className="input input-bordered input-sm w-16 sm:w-20"
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <input
                            type="text"
                            value={maxPrice}
                            onChange={(e) => handleInputChange(e, setMaxPrice)}
                            className="input input-bordered input-sm w-16 sm:w-20"
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}