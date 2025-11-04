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

// Google Sheets ID - MuteRestaurant menü sheet'i
const SHEET_ID = '13TP_bZjg1rPBnlS8wJ9KV3eRIHioAqgOWRE8EaL8QzU'
const GID = '1127384471'

export async function fetchMenuData(): Promise<MenuItem[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&tq&gid=${GID}`
  
  try {
    const response = await fetch(url, {
      cache: 'no-store',
    })
    const data = await response.text()
    
    const jsonString = data.substring(47).slice(0, -2)
    const json: GoogleSheetsResponse = JSON.parse(jsonString)
    
    const menuItems: MenuItem[] = json.table.rows
      .slice(1)
      .map(row => ({
        productName: row.c[0]?.v || '',
        productDescription: row.c[1]?.v || generateMenuDescription(row.c[0]?.v || ''),
        productPrice: row.c[2]?.v || '',
        productImage: row.c[3]?.v || '',
        category: row.c[4]?.v || '',
        subCategory: row.c[5]?.v || '',
      }))
      .filter(item => item.productName && item.category)
    
    return menuItems
  } catch (error) {
    console.error('Menü verileri yüklenirken hata:', error)
    return getDefaultMenuData()
  }
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

