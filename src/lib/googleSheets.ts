// Google Sheets Integration for Rum Meyhanesi

export interface MenuItem {
  productName: string
  productDescription: string
  productPrice: string
  productImage: string
  category: string
  subCategory?: string
}

interface GoogleSheetsCell {
  v: string | null
}

interface GoogleSheetsRow {
  c: (GoogleSheetsCell | null)[]
}

interface GoogleSheetsTable {
  rows: GoogleSheetsRow[]
}

interface GoogleSheetsResponse {
  table: GoogleSheetsTable
}

// Google Sheets ID - Rum Meyhanesi menü sheet'i
const SHEET_ID = '1HbiNgrYp3E-HBVkab_6N5vK3V0jJX8fuv-081m3MSZk'
const GID = '1428984429'

export async function fetchMenuData(): Promise<MenuItem[]> {
  // Google Sheets public olmalı ve "Herkesin görüntüleyebilmesi" için paylaşılmalı
  // CORS sorununu çözmek için CSV export URL'ini kullanıyoruz
  // Sheet'i public yapmak için: Paylaş > "Herkesin görüntüleyebilmesi" seçeneğini işaretle
  
  // CSV export URL - CORS sorunu olmayan format
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`
  
  // Alternatif: JSON format (eğer CSV çalışmazsa)
  const jsonUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&tq&gid=${GID}`
  
  let data = ''
  let isCSV = false
  
  // Önce CSV formatını dene (daha güvenilir)
  try {
    const csvResponse = await fetch(csvUrl, {
      cache: 'no-store',
      mode: 'cors',
      credentials: 'omit',
    })
    
    if (csvResponse.ok) {
      data = await csvResponse.text()
      if (data && data.length > 0 && data.includes(',')) {
        isCSV = true
        console.log('CSV formatı başarıyla yüklendi')
      }
    }
  } catch (csvError) {
    console.warn('CSV formatı yüklenemedi, JSON formatı deneniyor...', csvError)
  }
  
  // CSV başarısız olursa JSON formatını dene
  if (!isCSV || !data) {
    try {
      const jsonResponse = await fetch(jsonUrl, {
        cache: 'no-store',
        mode: 'cors',
        credentials: 'omit',
      })
      
      if (jsonResponse.ok) {
        data = await jsonResponse.text()
        console.log('JSON formatı başarıyla yüklendi')
      }
    } catch (jsonError) {
      console.error('JSON formatı da yüklenemedi', jsonError)
    }
  }
  
  if (!data || data.length === 0) {
    console.error('Google Sheets verisi alınamadı. Lütfen:')
    console.error('1. Google Sheets\'i açın')
    console.error('2. "Paylaş" butonuna tıklayın')
    console.error('3. "Herkesin görüntüleyebilmesi" seçeneğini işaretleyin')
    throw new Error('Google Sheets verisi alınamadı. Lütfen sheet\'in "Herkesin görüntüleyebilmesi" için paylaşıldığından emin olun.')
  }
  
  try {
    // CSV formatını parse et
    if (isCSV) {
      return parseCSVData(data)
    }
    
    // JSON string'i temizle
    let jsonString = data
    if (data.startsWith('/*O_o*/')) {
      jsonString = data.substring(data.indexOf('{'))
    } else if (data.includes('google.visualization.Query.setResponse')) {
      const start = data.indexOf('(') + 1
      const end = data.lastIndexOf(')')
      jsonString = data.substring(start, end)
    } else if (data.startsWith('google.visualization.Query.setResponse')) {
      const start = data.indexOf('(') + 1
      const end = data.lastIndexOf(')')
      jsonString = data.substring(start, end)
    } else {
      // Farklı formatlar için deneme
      const jsonMatch = data.match(/\{.*\}/s)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      } else {
        jsonString = data.substring(47).slice(0, -2)
      }
    }
    
    const json: GoogleSheetsResponse = JSON.parse(jsonString)
    
    // Debug: İlk birkaç satırı logla
    if (json.table && json.table.rows && json.table.rows.length > 0) {
      console.log('İlk satır (header):', json.table.rows[0]?.c?.map((cell, idx) => ({ idx, value: cell?.v })))
      if (json.table.rows.length > 1) {
        console.log('İkinci satır (örnek veri):', json.table.rows[1]?.c?.map((cell, idx) => ({ idx, value: cell?.v })))
      }
    }
    
    const menuItems: MenuItem[] = json.table.rows
      .slice(1) // İlk satırı atla (header)
      .map(row => {
        // Google Sheets kolon sırası: Ürün Adı, Ürün Fiyatı, Kategori, Alt Kategori, Ürün Açıklaması, Ürün Resmi
        // Trim yaparak boşlukları temizle
        const productName = (row.c[0]?.v || '').trim()
        const productPrice = (row.c[1]?.v || '').trim()
        const category = (row.c[2]?.v || '').trim()
        const subCategory = (row.c[3]?.v || '').trim()
        const productDescription = (row.c[4]?.v || '').trim() || generateMenuDescription(productName)
        const productImage = (row.c[5]?.v || '').trim()
        
        return {
          productName,
          productDescription,
          productPrice,
          productImage,
          category,
          subCategory: subCategory || undefined,
        }
      })
      .filter(item => item.productName && item.category) // Boş ürün adı veya kategori olmayanları filtrele
    
    console.log('Çekilen toplam ürün sayısı:', menuItems.length)
    console.log('Kategoriler:', Array.from(new Set(menuItems.map(item => item.category))))
    
    return menuItems
  } catch (error) {
    console.error('Menü verileri yüklenirken hata:', error)
    console.error('Hata detayı:', error instanceof Error ? error.message : String(error))
    return getDefaultMenuData()
  }
}

// Kategorileri dinamik olarak çek
export function getCategoriesFromMenu(menuItems: MenuItem[]): string[] {
  const categories = Array.from(new Set(menuItems.map(item => item.category).filter(Boolean)))
  return categories.sort()
}

// CSV verisini parse et
function parseCSVData(csvData: string): MenuItem[] {
  const lines = csvData.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []
  
  // İlk satır header, onu atla
  const rows = lines.slice(1)
  
  const menuItems: MenuItem[] = rows
    .map(line => {
      // CSV parse - virgülle ayrılmış, tırnak içinde olabilir
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim()) // Son değer
      
      // Kolon sırası: Ürün Adı, Ürün Fiyatı, Kategori, Alt Kategori, Ürün Açıklaması, Ürün Resmi
      const productName = (values[0] || '').trim().replace(/^"|"$/g, '')
      const productPrice = (values[1] || '').trim().replace(/^"|"$/g, '')
      const category = (values[2] || '').trim().replace(/^"|"$/g, '')
      const subCategory = (values[3] || '').trim().replace(/^"|"$/g, '')
      const productDescription = (values[4] || '').trim().replace(/^"|"$/g, '') || generateMenuDescription(productName)
      const productImage = (values[5] || '').trim().replace(/^"|"$/g, '')
      
      return {
        productName,
        productDescription,
        productPrice,
        productImage,
        category,
        subCategory: subCategory || undefined,
      }
    })
    .filter(item => item.productName && item.category)
  
  return menuItems
}

// Kategori slug oluştur
export function createCategorySlug(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateMenuDescription(dishName: string): string {
  const descriptions: Record<string, string> = {
    'Çerkez Tavuğu': 'Cevizli tavuk göğsü, sarımsak ve baharatlarla hazırlanmış klasik Rum mezesi',
    'Midye Dolma': 'Taze midyeler, fıstıklı pilav ve aromatik baharatlarla',
    'Tarama': 'Taze tarama balığı, limon ve zeytinyağı ile',
    'Levrek Marine': 'Taze levrek filetosu, limon ve taze otlar ile',
    'Fava': 'Santorini favasından ilham alan sarı bezelye püresi',
    'Ahtapot Izgara': 'Köz üstünde pişmiş yumuşacık ahtapot, zeytinyağı ve limon ile',
    'Levrek Buğulama': 'Taze sebzelerle marine edilmiş levrek, zeytinyağı ve limonla',
    'Karides Güveç': 'Jumbo karides, feta peyniri ve domates sosu ile pişmiş',
    'Kuzu Tandır': 'Yavaş pişmiş kuzu but, aromatik baharatlar ve patates püresi ile',
    'Kılıç Şiş': 'Izgara kılıç balığı, mevsim sebzeleri ve pilav ile',
    'Moussaka': 'Patlıcan, kıyma ve beşamel sosu ile geleneksel Yunan usulü',
    'Galaktoboureko': 'Irmikli muhallebi, ince yufka ve şurupla hazırlanan klasik tatlı',
    'Baklava': 'El açması yufka, Antep fıstığı ve şerbetli özel baklava',
    'Revani': 'İrmikli kek, şurup ve hindistan cevizi ile',
    'Loukoumades': 'Akdeniz tatlısı lokma, bal ve tarçınla servis edilir',
    'Sütlaç': 'Fırında kavrulmuş geleneksel sütlaç',
    'Yeni Rakı': 'Türkiye\'nin klasiği, sofranın baş tacı',
    'Tekirdağ Rakısı': 'Trakya\'nın incisi, üzüm aromasıyla',
    'Efe Rakı': 'Ege\'nin esintisi, geleneksel damıtım',
    'Beyaz Şarap': 'Kavaklidere Çankaya, Doluca Sarafin veya mevsim önerileri',
    'Kırmızı Şarap': 'Yakut, Karma veya özel seçki şaraplar',
    'Rosé Şarap': 'Hafif ve zarif pembe tonlar',
    'Ouzo': 'Orijinal Yunan anason likörü',
    'Türk Kahvesi': 'Geleneksel Türk kahvesi, lokumlu',
    'Ev Yapımı Limonata': 'Taze sıkılmış limon, nane ve soda ile',
    'Ayran': 'Yoğurdun tazeliği, tuzun dengesi, serinlik',
  }

  return descriptions[dishName] || `${dishName} - Ustalarımızın özenle hazırladığı, Akdeniz esintili lezzet.`
}

function getDefaultMenuData(): MenuItem[] {
  return [
    {
      productName: 'Çerkez Tavuğu',
      productDescription: 'Cevizli tavuk göğsü, sarımsak ve baharatlarla hazırlanmış klasik Rum mezesi',
      productPrice: '180',
      productImage: '',
      category: 'Mezeler',
    },
    {
      productName: 'Midye Dolma',
      productDescription: 'Taze midyeler, fıstıklı pilav ve aromatik baharatlarla',
      productPrice: '160',
      productImage: '',
      category: 'Mezeler',
    },
    {
      productName: 'Levrek Buğulama',
      productDescription: 'Taze sebzelerle marine edilmiş levrek, zeytinyağı ve limonla',
      productPrice: '450',
      productImage: '',
      category: 'Ana Yemekler',
    },
  ]
}

