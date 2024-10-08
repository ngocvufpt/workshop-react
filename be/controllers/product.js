import slugify from "slugify";
import { Product } from "../models/product";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Hàm để thêm một sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    // Tạo slug từ tên sản phẩm
    const slug = slugify(req.body.name, { lower: true });
    const product = await Product.create({ ...req.body, slug });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Xóa một sản phẩm theo ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID sản phẩm từ URL params
    const product = await Product.findByIdAndDelete(id); // Tìm và xóa sản phẩm theo ID
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" }); // Trả về lỗi nếu không tìm thấy sản phẩm
    }
    res.status(200).json({ message: "Xóa sản phẩm thành công" }); // Trả về phản hồi thành công sau khi xóa
  } catch (error) {
    res.status(500).json({ message: error.message }); // Xử lý lỗi và trả về phản hồi lỗi
  }
};
// Cập nhật một sản phẩm theo ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID sản phẩm từ URL params
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // Trả về sản phẩm mới sau khi cập nhật
      runValidators: true, // Chạy các validator đã định nghĩa trong schema
    });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" }); // Trả về lỗi nếu không tìm thấy sản phẩm
    }
    res.status(200).json(product); // Trả về thông tin sản phẩm sau khi cập nhật
  } catch (error) {
    res.status(400).json({ message: error.message }); // Xử lý lỗi và trả về phản hồi lỗi
  }
};
// Hàm để lấy thông tin chi tiết của một sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
      const { id } = req.params; // Lấy ID sản phẩm từ URL params
      const { _embed } = req.query; // Lấy thông tin các trường cần populate từ query params
      let query = Product.findById(id); // Tạo query để tìm sản phẩm theo ID

      // Nếu có yêu cầu populate các trường liên quan
      if (_embed) {
          const embeds = _embed.split(","); // Tách các trường cần populate thành mảng
          embeds.forEach((embed) => {
              query = query.populate(embed); // Thêm các trường cần populate vào query
          });
      }

      const product = await query.exec(); // Thực thi query để lấy thông tin sản phẩm
      if (!product) {
          return res.status(404).json({ message: "Không tìm thấy sản phẩm" }); // Trả về lỗi nếu không tìm thấy sản phẩm
      }
      res.status(200).json(product); // Trả về thông tin sản phẩm nếu tìm thấy
  } catch (error) {
      res.status(500).json({ message: error.message }); // Xử lý lỗi và trả về phản hồi lỗi
  }
};
