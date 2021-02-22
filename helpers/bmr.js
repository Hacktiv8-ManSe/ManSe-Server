const bmr = (birth, weight, height, gender) => {
  const this_year = new Date().getFullYear()
  const age = new Date(birth).getFullYear() - this_year
  const result = 10 * weight + 6.25 * height - 5 * +age
  return gender === 'female' ? result + 161 : result + 5
}

module.exports = { bmr }
