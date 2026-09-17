# Our Work Local Graphics Design

## Goal

Use the supplied artwork in `public/Ui Grphics_Webnxt` to complete the home-page Our Work carousel. Add project cards for brands whose logos already exist but whose project artwork is not currently shown, and refresh existing cards that have matching new artwork.

## Scope

- Add cards for Maidhive, ZenVedaa, Dream Luxury Holidays, The Realty Investments, Sky Wings Studios, and Lavish Real Estate.
- Replace the matching preview artwork for TrueStar, The Corp Store, The Tiffin Adda, Royals Property, Florence Homes, and Fransco Skincare.
- Use `22.png` as the Fransco Skincare card preview because its composition fills the carousel preview area more effectively; retain `23.png` as an unused supplied alternative.
- Preserve all existing carousel layout, interactions, responsive behavior, timing, styling, and animations.

## Asset Mapping

| Supplied artwork | Brand | Existing logo |
| --- | --- | --- |
| `11.png` | Maidhive | `/Logos__2/10.webp` |
| `12.png` | ZenVedaa | `/Logos__2/9.webp` |
| `13.png` | TrueStar Real Estate | `/Logos__2/3.webp` |
| `14.png` | Dream Luxury Holidays | `/Logos__2/7.webp` |
| `15.png` | The Realty Investments | `/Logos__2/1.webp` |
| `16.png` | Sky Wings Studios | `/Logos__2/8.webp` |
| `17.png` | Lavish Real Estate | `/Logos__2/5.webp` |
| `18.png` | The Corp Store | `/Logos__2/33.webp` |
| `19.png` | The Tiffin Adda | `/Logos__2/32.webp` |
| `20.png` | Royals Property | `/Logos__2/11.webp` |
| `21.png` | Florence Homes | `/Logos__2/florence.webp` |
| `22.png` | Fransco Skincare | `/Logos__2/12.webp` |

## Implementation

Convert the selected PNG previews to WebP with the project's existing `sharp` dependency, keeping the original files unchanged. Add explicit asset constants in `src/data/assets.ts`. Update `OUR_WORK_ITEMS` in `src/data/services.ts` with the six new cards and the refreshed preview references. Each new card will follow the existing data shape and provide a unique key, brand name, concise project description, four relevant tags, existing logo, descriptive logo alt text, and an accent gradient drawn from existing carousel patterns.

No carousel component or CSS changes are required.

## Accessibility and Performance

The carousel already lazy-loads and asynchronously decodes preview and logo images. New items will supply meaningful brand names and logo alt text. WebP conversion will reduce transfer size while preserving the supplied composition and the existing fixed preview layout will continue to prevent carousel layout changes.

## Verification

- Confirm every mapped WebP exists and can be decoded.
- Confirm all new and refreshed paths resolve through the Vite public directory.
- Run `npm run build` successfully.
- Confirm the generated production output contains the selected assets.
- Verify all new brands and updated preview references appear in the built JavaScript and that existing Our Work behavior remains structurally unchanged.
- Add one compact completed-change entry to `TASK.md` after implementation.
