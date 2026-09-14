# Aset visual

Tiga aset tema cerah dibuat menggunakan ImageGen bawaan pada 14 September 2026. Aset disalin ke folder proyek; file generasi asli tetap disimpan. Hati dan atlas kupu-kupu memiliki alpha transparan. Burung kecil, matahari, bentuk bunga, serta gerak sayap dibuat dengan kode.

## `dist/assets/daylight-sky.png`

Prompt:

Use case: illustration-story. Asset type: full-screen background for a romantic flower-gift web animation, landscape 1536x1024. Paint an airy, bright, cool spring sky in delicate watercolor/gouache with luminous powder-blue and pale turquoise open central sky. Fluffy painterly cumulus clouds frame the left and right edges and lower corners, creamy white with tiny peach-pink highlights and lavender shadowing. Very subtle soft mint-green foliage only in extreme lower corners. The middle 55 percent of the image stays uncluttered blue/ivory sky for a separately rendered bouquet and central heart. Leave upper-right sky clear for an animated sun added in code. Soft morning warmth, fresh air, happiness, calm romance. Similar to an ornate romantic pink-cloud sky but recolored for a fresh sunny blue day. Edge-to-edge painting. No sun disk, no moon, no stars, no bouquet, no hearts, no people, no butterflies, no typography, no watermark.

## `dist/assets/crystal-heart.png`

Prompt:

Use case: stylized-concept. Asset type: a single transparent PNG heart for the center of a romantic interactive opening screen. Render one large, plump, dimensional pink glass heart viewed from the front, symmetrical classic heart silhouette, pale peach light on upper left, rose-pink and raspberry facets toward the lower point, luminous translucent rock-crystal and watercolor-like internal reflections, soft pearly glass glints, rounded jewel facets instead of hard sharp geometry. It should feel like a beautiful floating rose-quartz glass heart in a dreamy pastel-cloud animation. The heart fills about 80 percent of a square canvas, with all edges and tiny glow intact and ample transparent margin. Genuine alpha transparency outside the heart. No surrounding objects, no ring, no pedestal, no ground shadow, no lettering, no icons, no checkerboard.

## `dist/assets/butterfly-atlas.png`

Prompt:

Use case: illustration-story. Asset type: one production sprite atlas for a butterfly swarm animation, 1536x1024 PNG with genuine transparent background. Exactly SIX complete separate butterflies, in an exact evenly spaced grid of THREE columns and TWO rows. Each 512x512 cell has one butterfly centered precisely at its center (256,256 within cell). Each butterfly is viewed directly from above, head toward the top, thin body vertical exactly through cell center, left and right wings spread horizontally and symmetrically; wings fit well within each cell with at least 45px of transparent padding all around. Natural butterfly wing shapes, delicate botanical watercolor illustration, detailed organic veins, soft translucent highlights and intricate edge markings. Top row: blush-pink butterfly with dark plum edging; sky-blue morpho butterfly with dark delicate veins; lilac-and-cream butterfly. Bottom row: buttery yellow and warm peach patterned butterfly; sage-mint pearly butterfly; coral and rose watercolor butterfly. Consistent scale across all six. Wings fully spread, no wing overlaps, no touching other cells, no wing crop, no shadows behind, no grid lines, no text, no labels, no flowers. Each half will be animated separately by code, so the exact symmetrical top-down alignment and cell centering are essential.

Sumbu tubuh hasil atlas diukur per kolom dan dipakai di `opening.js`; gambar aslinya tidak diubah. Sayap digambar terpisah saat runtime dan dilipat dari sumbu tersebut, dengan tubuh tetap stabil.

## Aset merpati sebelumnya

`dist/assets/dove-rig.png` dan `dist/assets/dove-profile.png` tetap digunakan oleh `dove.js`. Keduanya dibuat menggunakan ImageGen bawaan pada versi sebelumnya. Ringkasan prompt rig: atlas transparan dengan tubuh merpati putih realistis menghadap depan tanpa sayap di kiri dan satu sayap kanan terentang di kanan, bulu rinci serta pencahayaan sama, tanpa tulisan atau amplop. Ringkasan prompt profil: tubuh merpati putih realistis tampak samping menghadap kanan, tanpa sayap, latar transparan. Aset `dove.png` dan `dove-flight.png` dari versi sebelumnya tetap disertakan sebagai arsip aset proyek.

Semua burung dan kupu-kupu merupakan ilustrasi yang dianimasikan, bukan rekaman hewan sungguhan.
