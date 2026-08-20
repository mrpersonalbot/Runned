export type ShoeImageView = {
  label: "Side" | "Top" | "Outsole";
  url: string;
};

export const shoeImages: Record<string, ShoeImageView[]> = {
  "adidas-adizero-evo-sl": [
    { label: "Side", url: "https://shopasf.com/cdn/shop/files/JH6206_1_FOOTWEAR_Photography_Side_Lateral_Center_View_white_0548e77b-6888-4ea5-afd1-e1db241cd867.jpg?v=1771693240&width=2400" },
    { label: "Top", url: "https://www.sneakertwins.de/out/pictures/master/product/4/adidas_adizero_evo_sl_ki9440_4878.jpg" },
    { label: "Outsole", url: "https://en-sa.sssports.com/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw7b5b27c2/sss/SSS2/A/D/J/H/6/SSS2_ADJH6206_4067903746042_4.jpg?sh=700&sm=fit&sw=700" },
  ],
  "adidas-adizero-boston-13": [
    { label: "Side", url: "https://cdn.blazimg.com/1800/product/a/d/adidas_js4939_1_footwear_photography_side_lateral_center_view_white-nw091725.webp" },
    { label: "Top", url: "https://assets.adidas.com/images/w_1880%2Cf_auto%2Cq_auto/87a67b651fe948fdaf903e0318a9115b_9366/JS4934_02_standard_hover.jpg" },
    { label: "Outsole", url: "https://images.prodirectsport.com/ProductImages/Gallery_3/445340_Gallery_3_1994923.jpg" },
  ],
  "nike-pegasus-42": [
    { label: "Side", url: "https://static.nike.com/a/images/c_limit%2Cw_592%2Cf_auto/t_product_v1/5f62f3e5-6375-4cd9-a68a-c662daa09f5f/PEGASUS%2BPLUS.png" },
    { label: "Top", url: "https://huckberry.imgix.net/spree/products/812256/original/98022_Nike_Pegasus_42_Spruce_AuraJade_Horizon-Pale_Ivory_06_Product_on_White.jpg?ar=4%3A5&auto=format%2C+compress&crop=top&cs=tinysrgb&fill=solid&fill-color=FFFFFF&fit=fill&ixlib=react-9.8.1" },
    { label: "Outsole", url: "https://nikeco.vtexassets.com/arquivos/ids/1023301-800-auto?aspect=true&height=auto&v=639110877755700000&width=800" },
  ],
  "nike-vomero-18": [
    { label: "Side", url: "https://www.topfashiontf.com/cdn/shop/files/AURORA_HM6803-106_PHSRH000-1000.png?v=1768941696&width=1000" },
    { label: "Top", url: "https://footdistrict.com/cdn/shop/files/sneakers-nike-vomero-18-hm6803-101-2.jpg?v=1774614426&width=2000" },
    { label: "Outsole", url: "https://irunsg.com/cdn/shop/files/HM6803-101_4_1024x1024.png?v=1744863218" },
  ],
  "asics-superblast-3": [
    { label: "Side", url: "https://www.paceathletic.com/cdn/shop/files/Unisex-ASICS-Superblast-3-White_Black-1013A177-100.jpg?v=1769048730&width=1701" },
    { label: "Top", url: "https://lecoureur.com/cdn/shop/files/ASICS-SUPERBLAST-3-UNISEXE-1013A177-100-3_5000x.webp?v=1770991195" },
    { label: "Outsole", url: "https://static.ftshp.digital/img/p/1/8/2/1/5/2/6/1821526-thickbox.jpg" },
  ],
  "asics-novablast-6": [
    { label: "Side", url: "https://www.running-point.nl/cdn/shop/files/P000000860020300_1.jpg?v=1783056106&width=1946" },
    { label: "Top", url: "https://lecoureur.com/cdn/shop/files/ASICS-NOVABLAST-5-HOMME-1011B974-101-3_5000x.webp?v=1768233626" },
    { label: "Outsole", url: "https://static.ftshp.digital/img/p/1/8/5/8/6/3/0/1858630-thickbox.jpg" },
  ],
  "hoka-clifton-10": [
    { label: "Side", url: "https://hoka.mx/cdn/shop/files/1162031-WWH_1_2400x.png?v=1750277221" },
    { label: "Top", url: "https://www.lwshoes.com/cdn/shop/files/344548_ALT3_MED_2048x.jpg?v=1749694376" },
    { label: "Outsole", url: "https://media.nz.hoka.com/cdn-cgi/image/fit%3Dscale-down%2Cf%3Dauto%2Cw%3D1280/products/cf7268de-255d-4ad7-8cce-a6e0e85b2e5e/9b40f746/1162030-wwh_wwh_08.jpg" },
  ],
  "hoka-bondi-9": [
    { label: "Side", url: "https://www.fit2run.com/cdn/shop/files/1162011-WWH_1_698a17d4-8197-44a1-ae1a-606b8244278e.png?v=1736870395&width=1200" },
    { label: "Top", url: "https://assets.kogan.com/files/external/Hoka/HOK-1162012-WWH-6HB_4.jpg?auto=webp&bg-color=fff&canvas=1200%2C800&dpr=1&enable=upscale&fit=bounds&height=800&quality=90&width=1200" },
    { label: "Outsole", url: "https://shop.soletosoulfootwear.com/cdn/shop/files/hoka-running-shoes-hoka-women-s-bondi-9-running-shoes-white-42406004555991_1024x1024.png?v=1736464754" },
  ],
  "new-balance-rebel-v5": [
    { label: "Side", url: "https://nb.scene7.com/is/image/NB/wfcxlx5_nb_03_i?%24dw_detail_main_lg%24=&bgc=f1f1f1&bgcolor=f1f1f1&blendMode=mult&hei=1600&layer=1&scale=10&wid=1600" },
    { label: "Top", url: "https://img01.ztat.net/article/spp-media-p1/c85bbe68a9854372b66e5d2bc1c490e2/c40bed99a5d541a481765b3f30708642.jpg?imwidth=762" },
    { label: "Outsole", url: "https://runhavoc.com.au/cdn/shop/files/WFCXL5A_6.webp?v=1754545629&width=1000" },
  ],
  "new-balance-1080-v14": [
    { label: "Side", url: "https://irunsg.com/cdn/shop/files/main-1110x740.psd-2024-10-09T152848.230_2048x2048.png?v=1728459038" },
    { label: "Top", url: "https://cdn.shoplightspeed.com/shops/627485/files/66412470/image.jpg" },
    { label: "Outsole", url: "https://lukeslocker.com/cdn/shop/files/LukesLockerDallasFortWorth_NEWBALANCE_W1080W14_Women_sFreshFoamX1080v14_White_Light_Gold_5.png?v=1728505134&width=1080" },
  ],
  "puma-velocity-nitro-5": [
    { label: "Side", url: "https://resize.sprintercdn.com/o/products/0374113/puma-velocity-nitro-3_0374113_00_4_74009354.jpg" },
    { label: "Top", url: "https://item-shopping.c.yimg.jp/i/n/alpen-group_4303585215_3_d_20250806175311" },
    { label: "Outsole", url: "https://a.scdn.gr/images/sku_images/116827/116827644/fixedratio_20251014110303_559f0864.jpeg" },
  ],
  "puma-deviate-nitro-4": [
    { label: "Side", url: "https://images.puma.com/image/upload/f_auto%2Cq_auto%2Cb_rgb%3Afafafa%2Cw_2000%2Ch_2000/global/312123/02/sv01/fnd/VNM/fmt/png/Deviate-NITRO%E2%84%A2-4-Running-Shoes-Men" },
    { label: "Top", url: "https://www.paceathletic.com/cdn/shop/files/Mens-PUMA-Deviate-Nitro-4-PUMA-White_Feather-Gray-312123-02-2.jpg?v=1771819148&width=1701" },
    { label: "Outsole", url: "https://www.holabirdsports.com/cdn/shop/files/044567_4.jpg?v=1771431336&width=2048" },
  ],
  "saucony-ride-19": [
    { label: "Side", url: "https://img01.ztat.net/article/spp-media-p1/9d17d9595f65430184d64d53b831b8a3/0435e04b89594ab0a45149010f88d038.jpg?filter=packshot&imwidth=762" },
    { label: "Top", url: "https://thetribeconcept.com/cdn/shop/files/saucony-ride-19-whitecrimson_382456c7-a735-4c17-85e2-8796f06b9059.jpg?crop=center&height=800&v=1770799037&width=800" },
    { label: "Outsole", url: "https://www.peltzshoes.com/cdn/shop/files/S11056-100_Womens-Saucony-Ride-19-Running-Shoe-Wide-Width-Black-Silver_5.jpg?v=1769530603" },
  ],
  "saucony-endorphin-speed-5": [
    { label: "Side", url: "https://prrunandwalk.com/cdn/shop/files/S21007-10_3_1080x.jpg?v=1754600714" },
    { label: "Top", url: "https://www.misterrunning.com/images/2025-media-07/saucony-endorphin-speed-5-scarpe-da-running-donna-white-gum-s11007-10-F.jpg" },
    { label: "Outsole", url: "https://www.keeponrunning.com.au/cdn/shop/files/S21007-243_6_2000x.jpg?v=1775531555" },
  ],
  "brooks-ghost-18": [
    { label: "Side", url: "https://img.runningwarehouse.com/watermark/rs.php?nw=1888&path=B18GHM4-1.jpg" },
    { label: "Top", url: "https://cdn11.bigcommerce.com/s-21x65e8kfn/images/stencil/original/products/90481/506256/BRO3587_1000_4__25435.1779880731.jpg" },
    { label: "Outsole", url: "https://luckyfeetshoes.com/cdn/shop/files/ShopifyProductPhotos-2026-05-14T095641.007.png?v=1778777817&width=600" },
  ],
  "brooks-adrenaline-gts-25": [
    { label: "Side", url: "https://www.fit2run.com/cdn/shop/files/120443_127_M_Adrenaline_GTS_25.png?v=1767896212&width=1200" },
    { label: "Top", url: "https://www.lwshoes.com/cdn/shop/files/348134_ALT2_MED_1200x.jpg?v=1781102333" },
    { label: "Outsole", url: "https://smithssportsshoes.co.nz/cdn/shop/files/120443-127-s-adrenaline-gts-25-womens-dynamic-cushion-road-running-shoe.png?v=1761692379&width=2500" },
  ],
  "on-cloudmonster-3": [
    { label: "Side", url: "https://cuylas.com/img/products/MONSTER3-M_10054747-1.jpg" },
    { label: "Top", url: "https://images.bike24.com/i/mb/f1/f6/fb/on-3mg10051200-3-2041637.jpg" },
    { label: "Outsole", url: "https://www.innovasport.com/medias/1200Wx1200H-NEW-media-gallery-000000000000416145-02-20260306121212.jpg?context=bWFzdGVyfGltYWdlc3w2MzA3OHxpbWFnZS9qcGVnfGFEY3pMMmcwTlM4eE56STNNREV5TnpBMk56QTJNemcxTkRVeU1Ua3pOaTh4TWpBd1YzZ3hNakF3U0Y5T1JWZGZiV1ZrYVdGZloyRnNiR1Z5ZVY4d01EQXdNREF3TURBd01EQTBNVFl4TkRWZk1ESmZNakF5TmpBek1EWXhNakV5TVRJdWFuQm58YjNlNzBjMWMxNjg1MWJjMzk1NWNiOTczMDJiNjdjYWNhMWNmYzJmNTliMzlmYzk4YWY4ZjkzYzgyYTU5Mzg0NA" },
  ],
  "on-cloudsurfer-2": [
    { label: "Side", url: "https://media.gqitalia.it/photos/68c1255e29a7086f8c8c7642/master/w_1600%2Cc_limit/Tenis_On_Cloudsurfer_2%2520%281%29.jpg" },
    { label: "Top", url: "https://images.ctfassets.net/hnk2vsx53n6l/2pVpCMtbAi4Xc042RSKdGn/22f38c6439441235df41d1ce2148b5ca/79117dcd638dd4f9bf1bbb2533fbeb987ba9dca4.png?fm=webp" },
    { label: "Outsole", url: "https://images.tcdn.com.br/img/img_prod/1409077/tnis_on_running_cloudsurfer_2_feminino_branco_6_20251024145524_f9788621abc9.jpg" },
  ],
  "mizuno-wave-rider-29": [
    { label: "Side", url: "https://www.rundome.gr/3214986-product_large/mizuno-wave-rider-29-shoes.jpg" },
    { label: "Top", url: "https://emea.mizuno.com/dw/image/v2/BDBS_PRD/on/demandware.static/-/Sites-masterCatalog_Mizuno/default/dw87de48c1/AW25/Footwear/SH_J1GC250504_04.png-1000x1000-s_i-c_t_White-f_png.png?sh=950&sw=950" },
    { label: "Outsole", url: "https://www.theathletesfoot.com.au/media/catalog/product/s/h/sh_j1gd250304_02.jpg?auto=webp&fit=cover&format=pjpg&height=722.5806451612904&width=640" },
  ],
  "mizuno-hyperwarp-elite": [
    { label: "Side", url: "https://emea.mizuno.com/dw/image/v2/BDBS_PRD/on/demandware.static/-/Sites-masterCatalog_Mizuno/default/dw937546ec/SS26/Footwear/SH_J1GC267101_03.png?sh=950&sw=950" },
    { label: "Top", url: "https://www.paceathletic.com/cdn/shop/files/UnisexMizunoHyperwarpElite-White_LightningYellow_DazzlingBlue-2.jpg?v=1764663116&width=1701" },
    { label: "Outsole", url: "https://www.keeponrunning.com.au/cdn/shop/files/SH_J1GC267101_02_2000x.png?v=1764669369" },
  ],
  "skechers-aero-razor": [
    { label: "Side", url: "https://www.skechers.com.au/media/catalog/product/2/4/246240_wbo_02.jpg?auto=webp&fit=cover&format=pjpg&quality=85&width=100%25" },
    { label: "Top", url: "https://www.skechers.co.nz/media/catalog/product/2/4/246200_wbl_03.jpg?auto=webp&fit=cover&format=pjpg&quality=85&width=100%25" },
    { label: "Outsole", url: "https://www.skechersvn.vn/cdn/shop/files/246210_BKW_C_2b21a95a-2f0d-4b61-9ba9-a57ebe8c9eec_1024x1024.jpg?v=1757180287" },
  ],
  "skechers-aero-burst": [
    { label: "Side", url: "https://skechers.se/cdn/shop/files/335318_246215WSL_2_1445x.jpg?v=1747387256" },
    { label: "Top", url: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/H63438s4.jpg" },
    { label: "Outsole", url: "https://www.skechersvn.vn/cdn/shop/files/246210_BKW_C_2b21a95a-2f0d-4b61-9ba9-a57ebe8c9eec_1024x1024.jpg?v=1757180287" },
  ],
  "910-haze-tempo-2": [
    { label: "Side", url: "https://down-id.img.susercontent.com/file/id-11134207-7rbke-m6ul0dfs8ejr7d" },
    { label: "Top", url: "https://910.id/cdn/shop/files/13_7aba6627-dddd-4b72-8ca8-d877305b91a9.png?v=1740908871&width=1946" },
    { label: "Outsole", url: "https://cdn.store-assets.com/s/986841/i/85164041.png?width=1024" },
  ],
  "910-geist-ekiden-hyperpulse": [
    { label: "Side", url: "https://cdn.shopify.com/s/files/1/0670/0371/1670/files/1_058fa15a-7a9e-421e-b888-ec4610cbccd2.png?v=1770720001&width=533" },
    { label: "Top", url: "https://910.id/cdn/shop/files/940_b16c260f-4d2b-4c80-8a89-0b6230a1bd5e.png?v=1731613183&width=1946" },
    { label: "Outsole", url: "https://sportaways.com/storage/products/910%20Geist%20Ekiden%20Glide%20-%20HitamMerahBiru%20Md%202.webp" },
  ],
  "ortuseight-hypersonic-2": [
    { label: "Side", url: "https://sportaways.com/storage/products/7582/sepatu-running-ortuseight-hyperdrive-22-all-white-e8qo-3.webp" },
    { label: "Top", url: "https://sportaways.com/storage/products/7612/sepatu-running-ortuseight-hypersonic-20-whiteortrange-mai4-4.webp" },
    { label: "Outsole", url: "https://cdn.store-assets.com/s/986841/i/97062183.jpeg?width=1024" },
  ],
  "ortuseight-hyperglide-3-1": [
    { label: "Side", url: "https://cdn.store-assets.com/s/1362844/i/85420146.jpeg" },
    { label: "Top", url: "https://cdn.store-assets.com/s/986841/i/84846738.jpeg?width=1024" },
    { label: "Outsole", url: "https://cdn.store-assets.com/s/1267934/i/98061957.jpeg" },
  ],
  "mills-enerpro-zenith": [
    { label: "Side", url: "https://spoton-images.imgix.net/cms-image/BQjbWrB8xD7dXZkQLsQ7D41eut9nzu1TRp3d90Iq.png" },
    { label: "Top", url: "https://media.power-cdn.net/images/h-c26091b9bd03a9dfaf07a983189c3afa/products/2349105/2349105_1_600x600_w_g.webp" },
    { label: "Outsole", url: "https://mills.co.id/cdn/shop/files/mills-sepatu-lari-running-shoes-enerpro-zenith-ltjadepinegreenoffwhite-9104402-enerpro_zenith-09.png?v=1756355308&width=1445" },
  ],
  "mills-enermax-dynaplate": [
    { label: "Side", url: "https://c1.neweggimages.com/productimage/nb640/17-114-307-03.jpg" },
    { label: "Top", url: "https://c1.neweggimages.com/productimage/nb640/BFNMS2212150BMJUNC2.jpg" },
    { label: "Outsole", url: "https://sportaways.com/storage/products/5844/sepatu-running-mills-enermax-dynaplate-royalblueorangewhite-r20p-2.webp" },
  ],
  "specs-novaspeed-subsx": [
    { label: "Side", url: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-184612162/specs_specs_sepatu_running_novaspeed_subsx_white-black-dazzling_blue_spe1040161_full01_jtmsh7vj.webp" },
    { label: "Top", url: "https://en-ae.sssports.com/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw52a0d85d/sss/SSS2/S/D/8/7/0/SSS2_SD8706062150_5039247305352_1.jpg?sh=700&sm=fit&sw=700" },
    { label: "Outsole", url: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/95/MTA-184612081/br-m036969-03072_full02-8c81e008.webp" },
  ],
  "specs-airglide": [
    { label: "Side", url: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/99/MTA-184340771/br-m036969-03072_full03-d48855d9.webp" },
    { label: "Top", url: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/92/MTA-184340332/br-m036969-03072_full04-79c6c5b5.webp" },
    { label: "Outsole", url: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/99/MTA-184340771/br-m036969-03072_full02-622e0c74.webp" },
  ],
};
