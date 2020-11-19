const product = {
    sku: 'DBA219-43893',
    name: {
        ar: 'منظف أذن بمسحة سمارت',
        en: 'Smart Swab- Smart Ear Cleaner',
        tr: 'Smart Swab - Akıllı Kulak Temizleyici'
    },
    archive: true,
    description: {
        tr: 'Kulaklarınızı temizlemek acı vermemelidir. Kolay bir çözüm var! Smart Swab®, kulak kiri giderici kolay ve ağrısız hale getiren yenilikçi bir kitdir. Sadece kulağınıza yerleştirin, bükün ve kulak kirini çıkarın. Bu kadar kolay! ÖzellikleriBoyutları: Uzunluğu 12cm, başlığı 3cmKulak kirini toplamak için çevirirken bükünKulak kiri giderilmesini kolaylaştırırYumuşak, esnek uçludurKulağınızda mükemmel mesafeye ulaşırSpiral yivli kafasu kulak kirini en iyi şekilde toplarKitapçığında yazıldığı gibi kullanıldığında kulağınıza zarar vermeyecektirTek kullanımlık dokunmatik yedek kafalarAkıllı Swab® tutacağı, 16 atılabilir uç ve saklama kutusu dahildir'
    },
    supplier: '1775488000001751357',
    images: [
        'https://storage.googleapis.com/knawat-suppliers-img/durbuldum/A219-43893/smart-swab-akilli-kulak-temizleyici-11939688-sm_1601617623471.jpg'],
    tax_class: 18,
    categories: [
        {
            id: 26395, name:
                { ar: 'الصحة والجمال', en: 'Health & Beauty', tr: 'Health & Beauty' },
            treeNodeLevel: 1
        },
        {
            id: 67588, name:
                { ar: 'العناية بالصحة', en: 'Health Care', tr: 'Health Care' },
            parentId: 26395, treeNodeLevel: 2
        },
        {
            id: 67589, name:
                { ar: 'Other Health Care Supplies', en: 'Other Health Care Supplies', tr: 'Other Health Care Supplies' },
            parentId: 67588, treeNodeLevel: 3
        }],
    attributes: [{
        name: { ar: 'عارضة الأزياء', en: 'Model', tr: 'Model' },
        options: [{ ar: 'معياري', en: 'STD', tr: 'STD' }]
    },
    {
        name: { ar: 'الأبعاد', en: 'Dimensions', tr: 'Boyutları' },
        options: [
            { ar: 'الطول: 12 سم، الرأس: 3 سم', en: 'Length: 12 cm, Head: 3 cm', tr: 'Uzunluğu 12cm, başlığı 3cm' }
        ]
    }],
    variations: [
        {
            sku: 'DBA219-43893-STD', cost_price: 5.365, sale_price: 8.0475, market_price: 8.0475, weight: 0.5,
            attributes:
                [
                    {
                        name:
                            { ar: 'عارضة الأزياء', en: 'Model', _id: '5f2bbdfce1920e00197d019d', tr: 'Model' },
                        option:
                            { ar: 'معياري', en: 'STD', _id: '5f2bbdfce1920e00197d019c', tr: 'STD' }
                    }],
            quantity: 0
        }
    ],
    ship_from: [{ country: 'TR', city: 'ISTANBUL' }]
}

console.log(product)
