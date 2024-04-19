const constants = {
  ADMIN_ID: '65746f46f0640f51f585bb07'
}

const districts = [
  'an giang',
  'bà rịa - vũng tàu',
  'bắc giang',
  'bắc kạn',
  'bạc liêu',
  'bắc ninh',
  'bến tre',
  'bình định',
  'bình dương',
  'bình phước',
  'bình thuận',
  'cà mau',
  'cần thơ',
  'cao bằng',
  'đà nẵng',
  'đắk lắk',
  'đắk nông',
  'điện biên',
  'đồng nai',
  'đồng tháp',
  'gia lai',
  'hà giang',
  'hà nam',
  'hà nội',
  'hà tĩnh',
  'hải dương',
  'hải phòng',
  'hậu giang',
  'hòa bình',
  'hưng yên',
  'khánh hòa',
  'kiên giang',
  'kon tum',
  'lai châu',
  'lâm đồng',
  'lạng sơn',
  'lào cai',
  'long an',
  'nam định',
  'nghệ an',
  'ninh bình',
  'ninh thuận',
  'phú thọ',
  'phú yên',
  'quảng bình',
  'quảng nam',
  'quảng ngãi',
  'quảng ninh',
  'quảng trị',
  'sóc trăng',
  'sơn la',
  'tây ninh',
  'thái bình',
  'thái nguyên',
  'thanh hóa',
  'thừa thiên huế',
  'tiền giang',
  'hồ chí minh',
  'trà vinh',
  'tuyên quang',
  'vĩnh long',
  'vĩnh phúc',
  'yên bái'
]

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ')
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  return splitStr.join(' ')
}

const districtOptions = districts.map((district) => ({
  value: district,
  label: titleCase(district)
}))

module.exports = { constants, districtOptions, titleCase }
