export const RAM_CHOICES = [4, 8, 16, 32, 64];
export const STORAGE_CHOICES = [256, 512, 1024, 2048];

export const EMPTY_LAPTOP = {
  name: '',
  brandId: '',
  categoryId: '',
  price: '',
  salePrice: '',
  cpu: '',
  ram: '',
  storage: '',
  screen: '',
  gpu: '',
  weight: '',
  stock: '',
  image: '',
  description: '',
};

export const toFormValues = (laptop) =>
  Object.fromEntries(
    Object.keys(EMPTY_LAPTOP).map((key) => [
      key,
      laptop[key] === null || laptop[key] === undefined ? '' : String(laptop[key]),
    ])
  );

export const toPayload = (values) => ({
  name: values.name.trim(),
  brandId: Number(values.brandId),
  categoryId: Number(values.categoryId),
  price: Number(values.price),
  salePrice: values.salePrice === '' ? null : Number(values.salePrice),
  cpu: values.cpu.trim(),
  ram: Number(values.ram),
  storage: Number(values.storage),
  screen: values.screen.trim(),
  gpu: values.gpu.trim(),
  weight: values.weight === '' ? null : Number(values.weight),
  stock: Number(values.stock),
  image: values.image.trim(),
  description: values.description.trim(),
});

const isPositiveInt = (value) => value !== '' && Number.isInteger(Number(value)) && Number(value) > 0;

export function validateLaptop(values) {
  const errors = {};
  const name = values.name.trim();

  if (!name) errors.name = 'Vui lòng nhập tên laptop';
  else if (name.length < 5 || name.length > 100) errors.name = 'Tên phải từ 5 đến 100 ký tự';

  if (!values.brandId) errors.brandId = 'Vui lòng chọn hãng';
  if (!values.categoryId) errors.categoryId = 'Vui lòng chọn loại';

  if (!isPositiveInt(values.price)) errors.price = 'Giá phải là số nguyên lớn hơn 0';

  if (values.salePrice !== '') {
    if (!isPositiveInt(values.salePrice)) errors.salePrice = 'Giá khuyến mãi phải là số nguyên lớn hơn 0';
    else if (!errors.price && Number(values.salePrice) >= Number(values.price))
      errors.salePrice = 'Giá khuyến mãi phải nhỏ hơn giá gốc';
  }

  if (!RAM_CHOICES.includes(Number(values.ram))) errors.ram = 'Vui lòng chọn dung lượng RAM';
  if (!STORAGE_CHOICES.includes(Number(values.storage))) errors.storage = 'Vui lòng chọn dung lượng ổ cứng';

  if (values.stock === '' || !Number.isInteger(Number(values.stock)) || Number(values.stock) < 0)
    errors.stock = 'Tồn kho phải là số nguyên ≥ 0';

  if (values.weight !== '' && !(Number(values.weight) > 0)) errors.weight = 'Cân nặng phải lớn hơn 0';

  if (!values.image.trim()) errors.image = 'Vui lòng nhập link ảnh';
  else if (!values.image.trim().startsWith('http')) errors.image = 'Link ảnh phải bắt đầu bằng http';

  ['cpu', 'screen', 'gpu', 'description'].forEach((field) => {
    if (!values[field].trim()) errors[field] = 'Trường này là bắt buộc';
  });

  return errors;
}
