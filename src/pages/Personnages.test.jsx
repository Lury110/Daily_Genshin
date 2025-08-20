import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Personnages from './Personnages'

beforeEach(() => vi.unstubAllGlobals())

function makeFakeCharacters(n) {
    return Array.from({ length: n }).map((_, i) => ({
        id: i + 1,
        name: `Char${i + 1}`,
        rarity: ((i % 5) + 1)
    }))
}

describe('Personnages listing', () => {
    it('affiche 12 cartes sur la 1re page puis pagine avec "Suivant"', async () => {

        const data = makeFakeCharacters(25)

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            json: async () => data
        }))

        const { container } = render(<Personnages />)

        await waitFor(() => {
            const listing = container.querySelector('#listingItems')

            expect(listing.querySelectorAll('#parentLight').length).toBe(12)
        })

        // bouton "Suivant" → page 2
        const nextBtn = screen.getByRole('button', { name: /suivant/i })
        expect(nextBtn).toBeEnabled()
        nextBtn.click()

        await waitFor(() => {
            const listing = container.querySelector('#listingItems')
            expect(listing.querySelectorAll('#parentLight').length).toBe(12) // page 2
        })

        nextBtn.click()
        await waitFor(() => {
            const listing = container.querySelector('#listingItems')
            expect(listing.querySelectorAll('#parentLight').length).toBe(1)
        })

        // sur la dernière page, “Suivant” doit être disabled
        expect(screen.getByRole('button', { name: /suivant/i })).toBeDisabled()
    })

    it('rend 0 carte si l’API renvoie une liste vide', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            json: async () => [] // ton setCardData(data) → []
        }))

        const { container } = render(<Personnages />)

        await waitFor(() => {
            const listing = container.querySelector('#listingItems')
            expect(listing.querySelectorAll('#parentLight').length).toBe(0)
        })
    })

    it('rend 0 carte si la requête échoue (catch)', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')))

        // évite le bruit console.error dans le test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const { container } = render(<Personnages />)

        await waitFor(() => {
            const listing = container.querySelector('#listingItems')
            expect(listing.querySelectorAll('#parentLight').length).toBe(0)
        })

        spy.mockRestore()
    })
})
